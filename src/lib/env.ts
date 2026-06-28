/**
 * AdSynth Environment Variables
 *
 * All env vars are validated/parsed here so the rest of the app
 * imports from a single source of truth.
 *
 * ⚠️  SETUP INSTRUCTIONS FOR THE OWNER:
 *
 *   Create a `.env` file at the project root with these values:
 *
 *   ```env
 *   # Supabase (Auth + Database)
 *   VITE_SUPABASE_URL=https://your-project.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your-anon-key
 *
 *   # Stripe (Payments)
 *   STRIPE_SECRET_KEY=sk_test_...
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 *
 *   # OpenAI (AI Creative Generation)
 *   OPENAI_API_KEY=sk-...
 *
 *   # App
 *   APP_URL=https://adsynth.app
 *   ```
 *
 *   For local development, copy `.env.example` to `.env` and fill in values.
 */

// ---------------------------------------------------------------------------
// Required — app will warn if missing
// ---------------------------------------------------------------------------

/** Supabase project URL (e.g. https://xyz.supabase.co) */
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "";

/** Supabase anon/public key */
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? "";

/** Stripe secret key (sk_test_ or sk_live_) */
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";

/** Stripe webhook signing secret */
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

/** Stripe publishable key — exposed to the client via VITE_ */
export const STRIPE_PUBLISHABLE_KEY =
  process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

/** OpenAI API key */
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

/** Public-facing app URL (used for Stripe return URLs, emails, etc.) */
export const APP_URL = process.env.APP_URL ?? process.env.VITE_APP_URL ?? "http://localhost:3000";

// ---------------------------------------------------------------------------
// Tier pricing (hardcoded as they are part of the business model)
// ---------------------------------------------------------------------------

export const SUBSCRIPTION_TIERS = {
  starter: {
    name: "Starter",
    price: 19900, // cents ($199)
    creativesPerMonth: 8,
    stripePriceId: "", // ⚠️ Set after creating prices in Stripe dashboard
  },
  growth: {
    name: "Growth",
    price: 49900, // cents ($499)
    creativesPerMonth: 25,
    stripePriceId: "",
  },
  agency: {
    name: "Agency",
    price: 99900, // cents ($999)
    creativesPerMonth: -1, // unlimited (fair use)
    stripePriceId: "",
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// ---------------------------------------------------------------------------
// Validation helper
// ---------------------------------------------------------------------------

/** Returns a list of missing critical env vars. Call once at startup. */
export function getMissingEnvVars(): string[] {
  const missing: string[] = [];
  if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!SUPABASE_ANON_KEY) missing.push("VITE_SUPABASE_ANON_KEY");
  if (!STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
  return missing;
}