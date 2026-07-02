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
  // Referrals
  createReferral,
  getReferralsByReferrer,
  getReferralByEmail,
  updateReferralStatus,
  getReferralStats,
  createReferralCredit,
  getReferralCreditsByUser,
  getTotalReferralCredits,
  // Free previews
  createFreePreview,
  updateFreePreviewCreative,
  getFreePreviews,
  // Brand settings
  upsertBrandSettings,
  getBrandSettings,
  checkUserHasBrandSettings,
  checkUserHasProjects,
} from "~/db";
import type { User, CreativeRequest, Project, Referral, ReferralCredit, FreePreview, BrandSettings } from "~/db/schema";

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

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: {
    tier: "starter" | "growth" | "agency";
    customerEmail?: string;
    userId?: string;
    successUrl?: string;
    cancelUrl?: string;
  }) => data)
  .handler(async (ctx) => {
    const { createCheckoutSession: createStripeSession, getOrCreateCustomer } = await import("./stripe");
    const { APP_URL } = await import("./env");

    const { tier, customerEmail, userId, successUrl, cancelUrl } = ctx.data;

    const customer = await getOrCreateCustomer(
      customerEmail ?? "customer@example.com",
      userId ?? undefined
    );

    const result = await createStripeSession({
      customerId: customer.id,
      tierKey: tier,
      successUrl: successUrl ?? `${APP_URL}/dashboard?checkout=success`,
      cancelUrl: cancelUrl ?? `${APP_URL}/pricing`,
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

// ---------------------------------------------------------------------------
// Referral Program
// ---------------------------------------------------------------------------

export const createReferralLink = createServerFn({ method: "POST" })
  .validator((data: { referrerId: string; referredEmail: string }) => data)
  .handler(async (ctx) => {
    // Check if referral already exists for this email
    const existing = await getReferralByEmail(ctx.data.referredEmail);
    if (existing) {
      return { ok: false, error: "This email has already been referred." };
    }
    const referral = await createReferral(ctx.data.referrerId, ctx.data.referredEmail);
    return { ok: true, referral };
  });

export const getMyReferrals = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const referrals = await getReferralsByReferrer(ctx.data);
    const stats = await getReferralStats(ctx.data);
    const credits = await getTotalReferralCredits(ctx.data);
    return { referrals, stats, credits };
  });

export const getMyReferralCredits = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const credits = await getTotalReferralCredits(ctx.data);
    return { credits };
  });

// ---------------------------------------------------------------------------
// Free Preview / Sample Feature
// ---------------------------------------------------------------------------

export const requestFreePreview = createServerFn({ method: "POST" })
  .validator((data: {
    email: string;
    business_name: string;
    industry: string;
    target_audience?: string;
    ad_platform?: string;
  }) => data)
  .handler(async (ctx) => {
    // Create the free preview record
    const preview = await createFreePreview(ctx.data);

    // Generate a sample creative using OpenAI
    const { generateCreative } = await import("./openai");
    const brief = {
      businessType: ctx.data.industry,
      businessName: ctx.data.business_name,
      adPlatform: (ctx.data.ad_platform ?? "facebook") as "facebook" | "instagram" | "google",
      adType: "image" as const,
      description: `Ad for ${ctx.data.business_name} in the ${ctx.data.industry} industry${ctx.data.target_audience ? `. Target audience: ${ctx.data.target_audience}` : ""}. Create a compelling sample ad.`,
      targetAudience: ctx.data.target_audience,
    };
    const generated = await generateCreative(brief);

    // Save the generated creative
    const creativeJson = JSON.stringify(generated);
    await updateFreePreviewCreative(preview.id, creativeJson);

    return { ok: true, previewId: preview.id, creative: generated };
  });

export const listFreePreviews = createServerFn({ method: "GET" })
  .handler(async () => {
    return getFreePreviews();
  });

// ---------------------------------------------------------------------------
// Brand Settings (Onboarding)
// ---------------------------------------------------------------------------

export const saveBrandSettings = createServerFn({ method: "POST" })
  .validator((data: {
    user_id: string;
    brand_colors?: string;
    brand_tone?: string;
    style_preferences?: string;
    logo_url?: string;
  }) => data)
  .handler(async (ctx) => {
    const settings = await upsertBrandSettings(ctx.data);
    return { ok: true, settings };
  });

export const getMyBrandSettings = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    return getBrandSettings(ctx.data) ?? null;
  });

// ---------------------------------------------------------------------------
// Onboarding Status
// ---------------------------------------------------------------------------

export const getOnboardingStatus = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const [hasBrandSettings, hasProjects] = await Promise.all([
      checkUserHasBrandSettings(ctx.data),
      checkUserHasProjects(ctx.data),
    ]);

    let step = 1;
    if (hasBrandSettings) step = 2;
    if (hasProjects) step = 3;
    // Check if user has at least one creative request
    const requests = await getCreativeRequestsByUser(ctx.data);
    if (requests.length > 0) step = 4;

    return {
      completed: step > 3,
      currentStep: Math.min(step, 4),
      totalSteps: 4,
      hasBrandSettings,
      hasProjects,
      hasCreatives: requests.length > 0,
    };
  });

// ---------------------------------------------------------------------------
// Stripe Subscription Management
// ---------------------------------------------------------------------------

export const getSubscriptionStatus = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const user = await getUserById(ctx.data);
    if (!user) return { active: false, tier: null, currentPeriodEnd: null, cancelAtPeriodEnd: false };

    if (!user.stripe_customer_id) {
      return {
        active: user.subscription_tier !== "free",
        tier: user.subscription_tier === "free" ? null : user.subscription_tier,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    const { getSubscriptionStatus: getStripeStatus } = await import("./stripe");
    return getStripeStatus(user.stripe_customer_id);
  });

export const cancelMySubscription = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const user = await getUserById(ctx.data);
    if (!user || !user.stripe_customer_id) {
      throw new Error("No active subscription found");
    }

    const { cancelSubscription } = await import("./stripe");
    return cancelSubscription(user.stripe_customer_id);
  });

export const createBillingPortalSession = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const user = await getUserById(ctx.data);
    if (!user || !user.stripe_customer_id) {
      throw new Error("No Stripe customer found");
    }

    const { createPortalSession } = await import("./stripe");
    const { APP_URL } = await import("./env");
    return createPortalSession(user.stripe_customer_id, `${APP_URL}/dashboard/settings`);
  });