/**
 * AdSynth Stripe Integration
 *
 * Handles subscription billing for the three tiers:
 *   - Starter  ($199/month  — 8 creatives)
 *   - Growth   ($499/month  — 25 creatives)
 *   - Agency   ($999/month  — unlimited)
 *
 * ⚠️  Stripe credentials must be configured in .env before this module
 *     will work. See src/lib/env.ts for required vars.
 *
 * IMPORTANT: This module is server-only. Import it only from
 * createServerFn() handlers or API route handlers.
 */

import Stripe from "stripe";
import { STRIPE_SECRET_KEY, APP_URL, SUBSCRIPTION_TIERS } from "./env";

// ---------------------------------------------------------------------------
// Stripe client (singleton)
// ---------------------------------------------------------------------------

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  _stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-01.basil",
    typescript: true,
  });
  return _stripe;
}

// ---------------------------------------------------------------------------
// Subscription tier helpers
// ---------------------------------------------------------------------------

export type TierKey = "starter" | "growth" | "agency";

export interface TierInfo {
  key: TierKey;
  name: string;
  price: number; // cents
  creativesPerMonth: number;
  stripePriceId: string;
}

export function getTier(tierKey: string): TierInfo | null {
  const t = SUBSCRIPTION_TIERS[tierKey as TierKey];
  if (!t) return null;
  return {
    key: tierKey as TierKey,
    name: t.name,
    price: t.price,
    creativesPerMonth: t.creativesPerMonth,
    stripePriceId: t.stripePriceId,
  };
}

export function getAllTiers(): TierInfo[] {
  return (Object.keys(SUBSCRIPTION_TIERS) as TierKey[]).map((k) => ({
    key: k,
    name: SUBSCRIPTION_TIERS[k].name,
    price: SUBSCRIPTION_TIERS[k].price,
    creativesPerMonth: SUBSCRIPTION_TIERS[k].creativesPerMonth,
    stripePriceId: SUBSCRIPTION_TIERS[k].stripePriceId,
  }));
}

/**
 * Get the creatives remaining for a given tier.
 * Returns -1 for unlimited (Agency).
 */
export function getCreativesAllowed(tierKey: string): number {
  const t = SUBSCRIPTION_TIERS[tierKey as TierKey];
  if (!t) return 0;
  return t.creativesPerMonth;
}

// ---------------------------------------------------------------------------
// Stripe API methods
// ---------------------------------------------------------------------------

/**
 * Create a Stripe Checkout Session for a new subscription.
 *
 * @param customerId  — existing Stripe customer ID, or email to create one
 * @param tierKey     — "starter", "growth", or "agency"
 * @param successUrl  — where to redirect after successful payment
 * @param cancelUrl   — where to redirect if user cancels
 * @returns Checkout session URL
 */
export async function createCheckoutSession(params: {
  customerId?: string;
  customerEmail?: string;
  tierKey: TierKey;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ url: string | null; sessionId: string }> {
  const stripe = getStripe();
  const tier = getTier(params.tierKey);
  if (!tier) throw new Error(`Invalid tier: ${params.tierKey}`);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ...(params.customerId
      ? { customer: params.customerId }
      : { customer_email: params.customerEmail }),
    line_items: [
      {
        price: tier.stripePriceId || undefined,
        quantity: 1,
      },
    ],
    success_url: params.successUrl ?? `${APP_URL}/dashboard?checkout=success`,
    cancel_url: params.cancelUrl ?? `${APP_URL}/pricing?checkout=cancelled`,
    subscription_data: {
      metadata: {
        tier: params.tierKey,
      },
    },
  });

  return {
    url: session.url,
    sessionId: session.id,
  };
}

/**
 * Create a Billing Portal session so customers can manage their subscription.
 */
export async function createPortalSession(
  customerId: string,
  returnUrl?: string
): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl ?? `${APP_URL}/dashboard`,
  });
  return session.url;
}

/**
 * Get the current subscription status for a Stripe customer.
 */
export async function getSubscriptionStatus(
  customerId: string
): Promise<{
  active: boolean;
  tier: TierKey | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}> {
  const stripe = getStripe();
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  const sub = subscriptions.data[0];
  if (!sub) {
    return { active: false, tier: null, currentPeriodEnd: null, cancelAtPeriodEnd: false };
  }

  const tier = (sub.metadata?.tier as TierKey) ?? null;
  return {
    active: sub.status === "active",
    tier,
    currentPeriodEnd: sub.current_period_end,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  };
}

/**
 * Cancel an active subscription at period end.
 */
export async function cancelSubscription(
  customerId: string
): Promise<{ canceled: boolean }> {
  const stripe = getStripe();
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  const sub = subscriptions.data[0];
  if (!sub) {
    throw new Error("No active subscription found");
  }

  await stripe.subscriptions.update(sub.id, {
    cancel_at_period_end: true,
  });

  return { canceled: true };
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

/**
 * Handle an incoming Stripe webhook event.
 * Verifies the signature and processes relevant events.
 *
 * @param body — raw request body (string)
 * @param signature — the Stripe-Signature header value
 * @returns processed event type
 */
export async function handleWebhook(
  body: string,
  signature: string
): Promise<{ type: string; customerId?: string; status?: string }> {
  const { STRIPE_WEBHOOK_SECRET } = await import("./env");
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    throw new Error(`Webhook signature verification failed: ${message}`);
  }

  const result: { type: string; customerId?: string; status?: string } = {
    type: event.type,
  };

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      result.customerId = session.customer as string;
      result.status = "completed";
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      result.customerId = invoice.customer as string;
      result.status = "paid";
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      result.customerId = sub.customer as string;
      result.status = sub.status;
      break;
    }
  }

  return result;
}

/**
 * Create or retrieve a Stripe customer by email.
 */
export async function getOrCreateCustomer(
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  const stripe = getStripe();

  // Check if customer already exists
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) {
    return existing.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name,
    metadata: { source: "adsynth" },
  });
}