/**
 * AdSynth Database — initialization and helpers.
 *
 * Uses Bun's built-in SQLite (`bun:sqlite`) via dynamic import so Vite's
 * client build doesn't try to resolve it (bun:sqlite doesn't exist in browser).
 *
 * This module is server-only. Import it only from:
 *   - createServerFn() handlers
 *   - Server-side utilities
 *
 * NEVER import this in client components or hooks.
 */

import { SCHEMA_SQL, type User, type CreativeRequest, type Project, type ContactMessage, type Referral, type ReferralCredit, type FreePreview, type BrandSettings } from "./schema";

// ---------------------------------------------------------------------------
// Singleton DB connection
// ---------------------------------------------------------------------------

let _db: any = null;

async function getDb() {
  if (_db) return _db;

  const { join } = await import("node:path");
  const { existsSync, mkdirSync } = await import("node:fs");

  const DB_DIR = join(process.cwd(), ".data");
  const DB_PATH = join(DB_DIR, "adsynth.db");

  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }

  const { Database } = await import("bun:sqlite");
  _db = new Database(DB_PATH);

  _db.run("PRAGMA journal_mode = WAL");
  _db.run("PRAGMA foreign_keys = ON");

  const statements = SCHEMA_SQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    _db.run(stmt + ";");
  }

  return _db;
}

// ---------------------------------------------------------------------------
// User helpers
// ---------------------------------------------------------------------------

export async function createUser(email: string, name: string): Promise<User> {
  const db = await getDb();
  const stmt = db.prepare(
    "INSERT INTO users (email, name) VALUES (?, ?) RETURNING *"
  );
  return stmt.get(email, name) as User;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as User | undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) as User | undefined;
}

export async function updateUserSubscription(
  userId: string,
  tier: User["subscription_tier"],
  stripeCustomerId?: string
): Promise<User> {
  const db = await getDb();
  if (stripeCustomerId) {
    const stmt = db.prepare(
      "UPDATE users SET subscription_tier = ?, stripe_customer_id = ? WHERE id = ? RETURNING *"
    );
    return stmt.get(tier, stripeCustomerId, userId) as User;
  }
  const stmt = db.prepare(
    "UPDATE users SET subscription_tier = ? WHERE id = ? RETURNING *"
  );
  return stmt.get(tier, userId) as User;
}

// ---------------------------------------------------------------------------
// Creative request helpers
// ---------------------------------------------------------------------------

export async function createCreativeRequest(data: {
  user_id: string;
  business_type: string;
  business_name: string;
  ad_platform: CreativeRequest["ad_platform"];
  ad_type: CreativeRequest["ad_type"];
  description: string;
  logo_url?: string;
  photos?: string;
  project_id?: string;
}): Promise<CreativeRequest> {
  const db = await getDb();
  const stmt = db.prepare(`
    INSERT INTO creative_requests (user_id, project_id, business_type, business_name, ad_platform, ad_type, description, logo_url, photos)
    VALUES ($user_id, $project_id, $business_type, $business_name, $ad_platform, $ad_type, $description, $logo_url, $photos)
    RETURNING *
  `);
  return stmt.get({
    $user_id: data.user_id,
    $project_id: data.project_id ?? null,
    $business_type: data.business_type,
    $business_name: data.business_name,
    $ad_platform: data.ad_platform,
    $ad_type: data.ad_type,
    $description: data.description,
    $logo_url: data.logo_url ?? "",
    $photos: data.photos ?? "[]",
  }) as CreativeRequest;
}

export async function getCreativeRequestsByUser(userId: string): Promise<CreativeRequest[]> {
  const db = await getDb();
  const stmt = db.prepare(
    "SELECT * FROM creative_requests WHERE user_id = ? ORDER BY created_at DESC"
  );
  return stmt.all(userId) as CreativeRequest[];
}

export async function getCreativeRequestById(id: string): Promise<CreativeRequest | undefined> {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM creative_requests WHERE id = ?");
  return stmt.get(id) as CreativeRequest | undefined;
}

export async function updateCreativeRequest(
  id: string,
  updates: Partial<Pick<CreativeRequest, "status" | "ai_draft" | "final_delivery">>
): Promise<CreativeRequest> {
  const db = await getDb();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.status !== undefined) {
    fields.push("status = ?");
    values.push(updates.status);
    if (updates.status === "completed") {
      fields.push("completed_at = datetime('now')");
    }
  }
  if (updates.ai_draft !== undefined) {
    fields.push("ai_draft = ?");
    values.push(updates.ai_draft);
  }
  if (updates.final_delivery !== undefined) {
    fields.push("final_delivery = ?");
    values.push(updates.final_delivery);
  }

  if (fields.length === 0) {
    return getCreativeRequestById(id) as Promise<CreativeRequest>;
  }

  values.push(id);
  const stmt = db.prepare(
    `UPDATE creative_requests SET ${fields.join(", ")} WHERE id = ? RETURNING *`
  );
  return stmt.get(...values) as CreativeRequest;
}

// ---------------------------------------------------------------------------
// Project helpers
// ---------------------------------------------------------------------------

export async function createProject(data: {
  user_id: string;
  name: string;
  description?: string;
}): Promise<Project> {
  const db = await getDb();
  const stmt = db.prepare(`
    INSERT INTO projects (user_id, name, description)
    VALUES ($user_id, $name, $description)
    RETURNING *
  `);
  return stmt.get({
    $user_id: data.user_id,
    $name: data.name,
    $description: data.description ?? "",
  }) as Project;
}

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  const db = await getDb();
  const stmt = db.prepare(
    "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC"
  );
  return stmt.all(userId) as Project[];
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
  return stmt.get(id) as Project | undefined;
}

export async function incrementProjectCreativeCount(projectId: string): Promise<void> {
  const db = await getDb();
  db.run(
    "UPDATE projects SET creatives_count = creatives_count + 1 WHERE id = ?",
    [projectId]
  );
}

// ---------------------------------------------------------------------------
// Contact message helpers
// ---------------------------------------------------------------------------

export async function createContactMessage(data: {
  name: string;
  email: string;
  business_name?: string;
  message: string;
}): Promise<ContactMessage> {
  const db = await getDb();
  const stmt = db.prepare(`
    INSERT INTO contact_messages (name, email, business_name, message)
    VALUES ($name, $email, $business_name, $message)
    RETURNING *
  `);
  return stmt.get({
    $name: data.name,
    $email: data.email,
    $business_name: data.business_name ?? "",
    $message: data.message,
  }) as ContactMessage;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = await getDb();
  return db
    .prepare("SELECT * FROM contact_messages ORDER BY created_at DESC")
    .all() as ContactMessage[];
}

// ---------------------------------------------------------------------------
// Admin helpers
// ---------------------------------------------------------------------------

export async function getAllUsers(): Promise<User[]> {
  const db = await getDb();
  return db.prepare("SELECT * FROM users ORDER BY created_at DESC").all() as User[];
}

export async function getSubscriptionSummary(): Promise<Array<{
  tier: string;
  count: number;
}>> {
  const db = await getDb();
  return db
    .prepare(
      "SELECT subscription_tier AS tier, COUNT(*) AS count FROM users GROUP BY subscription_tier ORDER BY tier"
    )
    .all() as Array<{ tier: string; count: number }>;
}

export async function getAllCreativeRequests(): Promise<CreativeRequest[]> {
  const db = await getDb();
  return db
    .prepare("SELECT * FROM creative_requests ORDER BY created_at DESC")
    .all() as CreativeRequest[];
}

export async function getDashboardMetrics(): Promise<{
  totalUsers: number;
  activeSubscribers: number;
  totalCreatives: number;
  completedCreatives: number;
  thisMonthSignups: number;
  thisMonthCreatives: number;
  mrr: number;
}> {
  const db = await getDb();

  const totalUsers = (
    db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }
  ).c;

  const activeSubscribers = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM users WHERE subscription_tier IN ('starter', 'growth', 'agency')"
      )
      .get() as { c: number }
  ).c;

  const totalCreatives = (
    db.prepare("SELECT COUNT(*) as c FROM creative_requests").get() as {
      c: number;
    }
  ).c;

  const completedCreatives = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM creative_requests WHERE status = 'completed'"
      )
      .get() as { c: number }
  ).c;

  const thisMonthSignups = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM users WHERE created_at >= datetime('now', 'start of month')"
      )
      .get() as { c: number }
  ).c;

  const thisMonthCreatives = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM creative_requests WHERE created_at >= datetime('now', 'start of month')"
      )
      .get() as { c: number }
  ).c;

  const mrr = db
    .prepare(
      `SELECT
        SUM(CASE subscription_tier
          WHEN 'starter' THEN 19900
          WHEN 'growth' THEN 49900
          WHEN 'agency' THEN 99900
          ELSE 0
        END) as mrr
      FROM users
      WHERE subscription_tier IN ('starter', 'growth', 'agency')`
    )
    .get() as { mrr: number | null };

  return {
    totalUsers,
    activeSubscribers,
    totalCreatives,
    completedCreatives,
    thisMonthSignups,
    thisMonthCreatives,
    mrr: mrr.mrr ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Referral helpers
// ---------------------------------------------------------------------------

export async function createReferral(referrerId: string, referredEmail: string): Promise<Referral> {
  const db = await getDb();
  const stmt = db.prepare(
    "INSERT INTO referrals (referrer_id, referred_email) VALUES ($referrer_id, $referred_email) RETURNING *"
  );
  return stmt.get({ $referrer_id: referrerId, $referred_email: referredEmail }) as Referral;
}

export async function getReferralsByReferrer(referrerId: string): Promise<Referral[]> {
  const db = await getDb();
  return db
    .prepare("SELECT * FROM referrals WHERE referrer_id = ? ORDER BY created_at DESC")
    .all(referrerId) as Referral[];
}

export async function getReferralByEmail(referredEmail: string): Promise<Referral | undefined> {
  const db = await getDb();
  return db.prepare("SELECT * FROM referrals WHERE referred_email = ?").get(referredEmail) as Referral | undefined;
}

export async function updateReferralStatus(id: string, status: Referral["status"]): Promise<Referral> {
  const db = await getDb();
  const stmt = db.prepare(
    "UPDATE referrals SET status = ?, reward_granted = CASE WHEN ? = 'rewarded' THEN 1 ELSE reward_granted END WHERE id = ? RETURNING *"
  );
  return stmt.get(status, status, id) as Referral;
}

export async function grantReferralReward(id: string): Promise<Referral> {
  return updateReferralStatus(id, "rewarded");
}

export async function getReferralStats(referrerId: string): Promise<{ total: number; pending: number; signedUp: number; subscribed: number; rewarded: number }> {
  const db = await getDb();
  const all = await getReferralsByReferrer(referrerId);
  return {
    total: all.length,
    pending: all.filter((r) => r.status === "pending").length,
    signedUp: all.filter((r) => r.status === "signed_up").length,
    subscribed: all.filter((r) => r.status === "subscribed").length,
    rewarded: all.filter((r) => r.status === "rewarded").length,
  };
}

// ---------------------------------------------------------------------------
// Referral credit helpers
// ---------------------------------------------------------------------------

export async function createReferralCredit(userId: string, amountCents: number, description: string): Promise<ReferralCredit> {
  const db = await getDb();
  const stmt = db.prepare(
    "INSERT INTO referral_credits (user_id, amount_cents, description) VALUES ($user_id, $amount_cents, $description) RETURNING *"
  );
  return stmt.get({ $user_id: userId, $amount_cents: amountCents, $description: description }) as ReferralCredit;
}

export async function getReferralCreditsByUser(userId: string): Promise<ReferralCredit[]> {
  const db = await getDb();
  return db
    .prepare("SELECT * FROM referral_credits WHERE user_id = ? AND used = 0 ORDER BY created_at DESC")
    .all(userId) as ReferralCredit[];
}

export async function getTotalReferralCredits(userId: string): Promise<number> {
  const db = await getDb();
  const result = db
    .prepare("SELECT COALESCE(SUM(amount_cents), 0) as total FROM referral_credits WHERE user_id = ? AND used = 0")
    .get(userId) as { total: number };
  return result.total;
}

export async function markReferralCreditsUsed(userId: string, amountCents: number): Promise<void> {
  const db = await getDb();
  const credits = await getReferralCreditsByUser(userId);
  let remaining = amountCents;
  for (const credit of credits) {
    if (remaining <= 0) break;
    const toUse = Math.min(credit.amount_cents, remaining);
    db.run("UPDATE referral_credits SET used = 1 WHERE id = ?", [credit.id]);
    remaining -= toUse;
  }
}

// ---------------------------------------------------------------------------
// Free preview helpers
// ---------------------------------------------------------------------------

export async function createFreePreview(data: {
  email: string;
  business_name: string;
  industry: string;
  target_audience?: string;
  ad_platform?: string;
}): Promise<FreePreview> {
  const db = await getDb();
  const stmt = db.prepare(`
    INSERT INTO free_previews (email, business_name, industry, target_audience, ad_platform)
    VALUES ($email, $business_name, $industry, $target_audience, $ad_platform)
    RETURNING *
  `);
  return stmt.get({
    $email: data.email,
    $business_name: data.business_name,
    $industry: data.industry,
    $target_audience: data.target_audience ?? "",
    $ad_platform: data.ad_platform ?? "facebook",
  }) as FreePreview;
}

export async function updateFreePreviewCreative(id: string, creativeJson: string): Promise<FreePreview> {
  const db = await getDb();
  const stmt = db.prepare(
    "UPDATE free_previews SET generated_creative = ? WHERE id = ? RETURNING *"
  );
  return stmt.get(creativeJson, id) as FreePreview;
}

export async function markFreePreviewSubscribed(id: string): Promise<FreePreview> {
  const db = await getDb();
  const stmt = db.prepare("UPDATE free_previews SET subscribed = 1 WHERE id = ? RETURNING *");
  return stmt.get(id) as FreePreview;
}

export async function getFreePreviews(): Promise<FreePreview[]> {
  const db = await getDb();
  return db.prepare("SELECT * FROM free_previews ORDER BY created_at DESC").all() as FreePreview[];
}

// ---------------------------------------------------------------------------
// Brand settings helpers
// ---------------------------------------------------------------------------

export async function upsertBrandSettings(data: {
  user_id: string;
  brand_colors?: string;
  brand_tone?: string;
  style_preferences?: string;
  logo_url?: string;
}): Promise<BrandSettings> {
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM brand_settings WHERE user_id = ?").get(data.user_id) as BrandSettings | undefined;

  if (existing) {
    const stmt = db.prepare(`
      UPDATE brand_settings SET
        brand_colors = COALESCE($brand_colors, brand_colors),
        brand_tone = COALESCE($brand_tone, brand_tone),
        style_preferences = COALESCE($style_preferences, style_preferences),
        logo_url = COALESCE($logo_url, logo_url),
        updated_at = datetime('now')
      WHERE user_id = $user_id RETURNING *
    `);
    return stmt.get({
      $user_id: data.user_id,
      $brand_colors: data.brand_colors ?? null,
      $brand_tone: data.brand_tone ?? null,
      $style_preferences: data.style_preferences ?? null,
      $logo_url: data.logo_url ?? null,
    }) as BrandSettings;
  }

  const stmt = db.prepare(`
    INSERT INTO brand_settings (user_id, brand_colors, brand_tone, style_preferences, logo_url)
    VALUES ($user_id, $brand_colors, $brand_tone, $style_preferences, $logo_url)
    RETURNING *
  `);
  return stmt.get({
    $user_id: data.user_id,
    $brand_colors: data.brand_colors ?? "[]",
    $brand_tone: data.brand_tone ?? "professional",
    $style_preferences: data.style_preferences ?? "",
    $logo_url: data.logo_url ?? "",
  }) as BrandSettings;
}

export async function getBrandSettings(userId: string): Promise<BrandSettings | undefined> {
  const db = await getDb();
  return db.prepare("SELECT * FROM brand_settings WHERE user_id = ?").get(userId) as BrandSettings | undefined;
}

export async function checkUserHasBrandSettings(userId: string): Promise<boolean> {
  const db = await getDb();
  const result = db.prepare("SELECT COUNT(*) as c FROM brand_settings WHERE user_id = ?").get(userId) as { c: number };
  return result.c > 0;
}

export async function checkUserHasProjects(userId: string): Promise<boolean> {
  const db = await getDb();
  const result = db.prepare("SELECT COUNT(*) as c FROM projects WHERE user_id = ?").get(userId) as { c: number };
  return result.c > 0;
}

// ---------------------------------------------------------------------------
// Close (for graceful shutdown)
// ---------------------------------------------------------------------------

export async function closeDb(): Promise<void> {
  if (_db) {
    _db.close();
    _db = null;
  }
}

// ---------------------------------------------------------------------------
// Dev mode: auto-create a demo user when Supabase isn't configured
// ---------------------------------------------------------------------------

const DEV_USER_ID = "dev-user-001";
const DEV_USER_EMAIL = "demo@adsynth.app";
const DEV_USER_NAME = "Jane Demo";

export async function getOrCreateDevUser(): Promise<User> {
  const existing = await getUserById(DEV_USER_ID);
  if (existing) return existing;

  const existingByEmail = await getUserByEmail(DEV_USER_EMAIL);
  if (existingByEmail) return existingByEmail;

  return createUser(DEV_USER_EMAIL, DEV_USER_NAME);
}