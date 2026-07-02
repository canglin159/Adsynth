/**
 * POST /api/webhook
 *
 * Stripe webhook endpoint — receives subscription events.
 * Verifies webhook signature using STRIPE_WEBHOOK_SECRET.
 *
 * Called by Stripe's webhook system. Returns 200 for verified events.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/webhook")({
  component: () => null,
  ssr: false,
});