/**
 * AdSynth Reusable Auth Guard System
 *
 * Provides standard `requireAuth()` and `requireAdmin()` guard functions
 * for use in TanStack Router `beforeLoad` hooks.
 *
 * Usage:
 *   import { requireAuth, requireAdmin } from "~/lib/router-guard";
 *
 *   // In a protected layout route:
 *   beforeLoad: async () => {
 *     return requireAuth();
 *   }
 *
 *   // In an admin-only route:
 *   beforeLoad: async () => {
 *     return requireAdmin();
 *   }
 *
 * The returned AuthContext (userId, userEmail, userName) is available to
 * child routes via the route context or by re-calling getCurrentUserId().
 */

import { redirect } from "@tanstack/react-router";
import { getCurrentUserId } from "~/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthContext {
  userId: string;
  userEmail: string;
  userName: string;
}

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/**
 * Require the user to be authenticated.
 * Redirects to /auth/login if not logged in.
 * Returns user context (userId, userEmail, userName) for use in loaders.
 */
export async function requireAuth(): Promise<AuthContext> {
  const user = await getCurrentUserId();
  if (!user) {
    throw redirect({ to: "/auth/login" as const });
  }
  return {
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
  };
}

/**
 * Require the user to be authenticated AND be an admin.
 * Redirects to /auth/login if not logged in or not an admin.
 * Admin check: email is admin@adsynth.app or ends with @adsynth.app.
 */
export async function requireAdmin(): Promise<AuthContext> {
  const ctx = await requireAuth();
  const isAdmin =
    ctx.userEmail === "admin@adsynth.app" ||
    ctx.userEmail.endsWith("@adsynth.app");
  if (!isAdmin) {
    throw redirect({ to: "/auth/login" as const });
  }
  return ctx;
}