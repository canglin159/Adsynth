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
} from "~/db";
import type { User, CreativeRequest, Project } from "~/db/schema";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const getCurrentUserFromDb = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async (ctx) => {
    const user = getUserById(ctx.data);
    return user ?? null;
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