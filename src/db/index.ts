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

import { SCHEMA_SQL, type User, type CreativeRequest, type Project, type ContactMessage } from "./schema";

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