/**
 * POST /api/contact
 *
 * Submits a contact form inquiry.
 *
 * Usage:
 *   const { success } = await submitContactForm({ name, email, business_name, message });
 *
 * Or via fetch:
 *   POST /api/contact
 *   Body: { name, email, business_name?, message }
 *   Response: { success: true, id: string }
 */
import { createFileRoute } from "@tanstack/react-router";
import { submitContactForm } from "~/lib/api";

export const Route = createFileRoute("/api/contact")({
  component: () => null,
  ssr: false,
});