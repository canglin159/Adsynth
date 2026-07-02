/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for subscription signup.
 *
 * Usage:
 *   const { url } = await createSubscriptionCheckout({ tier: "growth" });
 *   window.location.href = url;
 *
 * Or via fetch:
 *   POST /api/checkout
 *   Body: { tier: "starter"|"growth"|"agency" }
 *   Response: { url, sessionId }
 */
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createSubscriptionCheckout } from "~/lib/api";

export const Route = createFileRoute("/api/checkout")({
  component: () => null,
  ssr: false,
});