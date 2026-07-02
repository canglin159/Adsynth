/**
 * AdSynth Auth System
 *
 * Provides Supabase-based authentication with an abstraction layer.
 *
 * ⚠️  Until Supabase credentials are configured in .env, this module
 *     will work in "stub mode" — functions return placeholder data.
 *
 * Architecture:
 *   - `getServerClient()` — creates a Supabase client on the server
 *     (for use in createServerFn handlers and API routes)
 *   - `getBrowserClient()` — creates a Supabase client in the browser
 *   - Auth helpers wrap raw Supabase calls with typed responses
 *   - `requireAuth()` / `getCurrentUser()` — server-side helpers for
 *     protecting routes and API handlers
 *
 * IMPORTANT: Client code must NOT import this directly. Use the API
 * routes in src/routes/api/auth.ts instead.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: number;
}

export interface AuthResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Server-side Supabase client
// ---------------------------------------------------------------------------

/**
 * Creates a Supabase server client that reads cookies from the request.
 * Use inside createServerFn() handlers or API routes that have access to
 * the request headers.
 *
 * Example:
 * ```ts
 * const { data } = await getServerClient().auth.getUser();
 * ```
 */
export function getServerClient(requestHeaders?: Headers) {
  // For TanStack Start server functions without direct cookie access,
  // fall back to the regular service client
  if (!requestHeaders) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  const cookies = requestHeaders.get("cookie") ?? "";
  const cookieStore = Object.fromEntries(
    cookies.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(cookieStore).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll() {
        // Cannot set cookies in server functions — use API routes for mutations
        // that need to set cookies (sign in, sign out)
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Browser-side Supabase client
// ---------------------------------------------------------------------------

/**
 * Creates a Supabase client for use in the browser.
 * WARNING: Only use this inside useEffect or event handlers,
 * or in client-only components wrapped in <ClientOnly>.
 */
export function getBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

/**
 * Sign up a new user with email and password.
 * If Supabase is not configured, returns an error message.
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<AuthResult<AuthUser>> {
  const sb = getBrowserClient();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data.user) {
    return { ok: false, error: "No user returned from sign up" };
  }

  return {
    ok: true,
    data: {
      id: data.user.id,
      email: data.user.email ?? "",
      name: data.user.user_metadata?.full_name ?? name,
      avatarUrl: data.user.user_metadata?.avatar_url ?? "",
    },
  };
}

/**
 * Sign in with email and password.
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult<AuthSession>> {
  const sb = getBrowserClient();
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data.session || !data.user) {
    return { ok: false, error: "No session returned" };
  }

  return {
    ok: true,
    data: {
      user: {
        id: data.user.id,
        email: data.user.email ?? "",
        name: data.user.user_metadata?.full_name ?? "",
        avatarUrl: data.user.user_metadata?.avatar_url ?? "",
      },
      accessToken: data.session.access_token,
      expiresAt: data.session.expires_at ?? 0,
    },
  };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<AuthResult> {
  const sb = getBrowserClient();
  const { error } = await sb.auth.signOut();
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const sb = getBrowserClient();
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Get the current session from the browser client.
 */
export async function getCurrentSession(): Promise<AuthResult<AuthSession>> {
  const sb = getBrowserClient();
  const { data, error } = await sb.auth.getSession();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data.session?.user) {
    return { ok: false, error: "Not authenticated" };
  }

  return {
    ok: true,
    data: {
      user: {
        id: data.session.user.id,
        email: data.session.user.email ?? "",
        name: data.session.user.user_metadata?.full_name ?? "",
        avatarUrl: data.session.user.user_metadata?.avatar_url ?? "",
      },
      accessToken: data.session.access_token,
      expiresAt: data.session.expires_at ?? 0,
    },
  };
}

/**
 * Server-side: require an authenticated user.
 * Throws if not authenticated. Call at the start of protected handlers.
 */
export async function requireAuth(
  requestHeaders?: Headers
): Promise<AuthUser> {
  const sb = getServerClient(requestHeaders);
  const { data, error } = await sb.auth.getUser();

  if (error || !data.user) {
    throw new Error("Authentication required");
  }

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    name: data.user.user_metadata?.full_name ?? "",
    avatarUrl: data.user.user_metadata?.avatar_url ?? "",
  };
}

/**
 * Server-side: get current user (returns null if not authenticated).
 */
export async function getCurrentUser(
  requestHeaders?: Headers
): Promise<AuthUser | null> {
  try {
    return await requireAuth(requestHeaders);
  } catch {
    return null;
  }
}