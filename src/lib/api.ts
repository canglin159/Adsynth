/**
 * AdSynth Server API
 *
 * All server-only functions are defined here using createServerFn.
 * These are the ONLY way client code can access database/auth/stripe/OpenAI.
 *
 * Usage from a page or component:
 *   const { data } = await listProjects();
 *
 * Or via route loader:
 *   loader: () => listProjects(),
 */

import { createServerFn } from "@tanstack/react-start";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserSubscription,
  createCreativeRequest,
  getCreativeRequestsByUser,
  getCreativeRequestById,
  updateCreativeRequest,
  createProject,
  getProjectsByUser,
  getProjectById,
  getAllUsers,
  getSubscriptionSummary,
  getAllCreativeRequests,
  getDashboardMetrics,
  createContactMessage,
  getOrCreateDevUser,
} from "~/db";
import type { User, CreativeRequest, Project } from "~/db/schema";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const getCurrentUserFromDb = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const user = await getUserById(ctx.data);
    return user ?? null;
  });

/**
 * Get the currently authenticated user ID.
 * When Supabase is configured, uses the Supabase session.
 * In dev mode (no Supabase), auto-creates a demo user.
 */
export const getCurrentUserId = createServerFn({ method: "GET" })
  .handler(async () => {
    const { SUPABASE_URL } = await import("./env");

    if (SUPABASE_URL) {
      // Supabase configured — use session
      const { getCurrentUser } = await import("./auth");
      const user = await getCurrentUser();
      if (user) return { id: user.id, email: user.email, name: user.name };
      return null;
    }

    // Dev mode — use our local demo user
    const devUser = await getOrCreateDevUser();
    return {
      id: devUser.id,
      email: devUser.email,
      name: devUser.name,
    };
  });

/**
 * Handle Stripe checkout success — link stripe customer to user.
 * Called after redirect from Stripe checkout.
 */
export const handleCheckoutSuccess = createServerFn({ method: "POST" })
  .validator(
    (data: {
      userId: string;
      stripeCustomerId: string;
      tier: "starter" | "growth" | "agency";
    }) => data
  )
  .handler(async (ctx) => {
    return updateUserSubscription(
      ctx.data.userId,
      ctx.data.tier,
      ctx.data.stripeCustomerId
    );
  });

// ---------------------------------------------------------------------------
// Creative Requests
// ---------------------------------------------------------------------------

export const listRequests = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    return getCreativeRequestsByUser(ctx.data);
  });

export const getRequest = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async (ctx) => {
    return getCreativeRequestById(ctx.data);
  });

export const createRequest = createServerFn({ method: "POST" })
  .validator(
    (data: {
      user_id: string;
      business_type: string;
      business_name?: string;
      ad_platform?: string;
      ad_type?: string;
      description: string;
      logo_url?: string;
      photos?: string;
      project_id?: string;
    }) => data
  )
  .handler(async (ctx) => {
    const d = ctx.data;
    const validPlatforms = ["facebook", "instagram", "google"] as const;
    const platform = validPlatforms.includes(
      d.ad_platform as (typeof validPlatforms)[number]
    )
      ? (d.ad_platform as "facebook" | "instagram" | "google")
      : "facebook";

    const validTypes = ["image", "video", "static", "carousel"] as const;
    const adType = validTypes.includes(
      d.ad_type as (typeof validTypes)[number]
    )
      ? (d.ad_type as "image" | "video" | "static" | "carousel")
      : "image";

    return createCreativeRequest({
      user_id: d.user_id,
      business_type: d.business_type,
      business_name: d.business_name ?? "",
      ad_platform: platform,
      ad_type: adType,
      description: d.description,
      logo_url: d.logo_url,
      photos: d.photos,
      project_id: d.project_id,
    });
  });

export const updateRequest = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      status?: string;
      ai_draft?: string;
      final_delivery?: string;
    }) => data
  )
  .handler(async (ctx) => {
    return updateCreativeRequest(ctx.data.id, {
      status: ctx.data.status as CreativeRequest["status"],
      ai_draft: ctx.data.ai_draft,
      final_delivery: ctx.data.final_delivery,
    });
  });

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const listProjects = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    return getProjectsByUser(ctx.data);
  });

export const getProject = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async (ctx) => {
    return getProjectById(ctx.data);
  });

export const createNewProject = createServerFn({ method: "POST" })
  .validator(
    (data: { user_id: string; name: string; description?: string }) => data
  )
  .handler(async (ctx) => {
    return createProject({
      user_id: ctx.data.user_id,
      name: ctx.data.name,
      description: ctx.data.description,
    });
  });

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export const adminListUsers = createServerFn({ method: "GET" })
  .handler(async () => {
    return getAllUsers();
  });

export const adminGetSummary = createServerFn({ method: "GET" })
  .handler(async () => {
    return getSubscriptionSummary();
  });

export const adminGetDashboard = createServerFn({ method: "GET" })
  .handler(async () => {
    return getDashboardMetrics();
  });

export const adminListRequests = createServerFn({ method: "GET" })
  .handler(async () => {
    return getAllCreativeRequests();
  });

// ---------------------------------------------------------------------------
// Stripe Checkout
// ---------------------------------------------------------------------------

export const createSubscriptionCheckout = createServerFn({ method: "POST" })
  .validator(
    (data: {
      tier: "starter" | "growth" | "agency";
      customerEmail?: string;
      userId?: string;
      successUrl?: string;
      cancelUrl?: string;
    }) => data
  )
  .handler(async (ctx) => {
    const { createCheckoutSession, getOrCreateCustomer } = await import(
      "./stripe"
    );
    const { APP_URL } = await import("./env");

    const { tier, customerEmail, userId, successUrl, cancelUrl } = ctx.data;

    // Create or get Stripe customer
    const customer = await getOrCreateCustomer(
      customerEmail ?? "customer@example.com",
      userId ?? undefined
    );

    // Create checkout session
    const result = await createCheckoutSession({
      customerId: customer.id,
      tierKey: tier,
      successUrl: successUrl ?? `${APP_URL}/dashboard?checkout=success`,
      cancelUrl: cancelUrl ?? `${APP_URL}/pricing?checkout=cancelled`,
    });

    return { url: result.url, sessionId: result.sessionId };
  });

// ---------------------------------------------------------------------------
// Contact Form
// ---------------------------------------------------------------------------

export const submitContactForm = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      email: string;
      business_name?: string;
      message: string;
    }) => data
  )
  .handler(async (ctx) => {
    const result = await createContactMessage(ctx.data);
    return { success: true, id: result.id };
  });

// ---------------------------------------------------------------------------
// AI Creative Generation
// ---------------------------------------------------------------------------

export const generateAdCreative = createServerFn({ method: "POST" })
  .validator((requestId: string) => requestId)
  .handler(async (ctx) => {
    const request = await getCreativeRequestById(ctx.data);
    if (!request) {
      throw new Error(`Creative request not found: ${ctx.data}`);
    }

    // Import OpenAI module dynamically to avoid client build issues
    const { generateCreative } = await import("./openai");
    const { generateVariations } = await import("./openai");

    const brief = {
      businessType: request.business_type,
      businessName: request.business_name,
      adPlatform: request.ad_platform,
      adType: request.ad_type,
      description: request.description,
    };

    const generated = await generateCreative(brief);

    // Save the AI draft as JSON string
    const draftJson = JSON.stringify(generated);
    await updateCreativeRequest(ctx.data, {
      status: "ai_draft",
      ai_draft: draftJson,
    });

    return generated;
  });