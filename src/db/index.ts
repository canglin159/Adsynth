/**
 * AdSynth Database — initialization and helpers.
 *
 * This module is server-only. Import it only from:
 *   - createServerFn() handlers
 *   - API route handlers (src/routes/api/*.ts)
 *   - Server-side utilities
 *
 * NEVER import this in client components or hooks.
 */

import Database from "better-sqlite3";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { SCHEMA_SQL, type User, type CreativeRequest, type Project } from "./schema";

// ---------------------------------------------------------------------------
// Singleton DB connection
// ---------------------------------------------------------------------------

const DB_DIR = join(process.cwd(), ".data");
const DB_PATH = join(DB_DIR, "adsynth.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }

  _db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  // Run schema
  _db.exec(SCHEMA_SQL);

  return _db;
}

// ---------------------------------------------------------------------------
// User helpers
// ---------------------------------------------------------------------------

export function createUser(email: string, name: string): User {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO users (email, name) VALUES (?, ?) RETURNING *"
  );
  return stmt.get(email, name) as User;
}

export function getUserByEmail(email: string): User | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) as User | undefined;
}

export function updateUserSubscription(
  userId: string,
  tier: User["subscription_tier"],
  stripeCustomerId?: string
): User {
  const db = getDb();
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

export function createCreativeRequest(data: {
  user_id: string;
  business_type: string;
  business_name: string;
  ad_platform: CreativeRequest["ad_platform"];
  ad_type: CreativeRequest["ad_type"];
  description: string;
  logo_url?: string;
  photos?: string;
  project_id?: string;
}): CreativeRequest {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO creative_requests (user_id, project_id, business_type, business_name, ad_platform, ad_type, description, logo_url, photos)
    VALUES (@user_id, @project_id, @business_type, @business_name, @ad_platform, @ad_type, @description, @logo_url, @photos)
    RETURNING *
  `);
  return stmt.get({
    user_id: data.user_id,
    project_id: data.project_id ?? null,
    business_type: data.business_type,
    business_name: data.business_name,
    ad_platform: data.ad_platform,
    ad_type: data.ad_type,
    description: data.description,
    logo_url: data.logo_url ?? "",
    photos: data.photos ?? "[]",
  }) as CreativeRequest;
}

export function getCreativeRequestsByUser(userId: string): CreativeRequest[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM creative_requests WHERE user_id = ? ORDER BY created_at DESC"
  );
  return stmt.all(userId) as CreativeRequest[];
}

export function getCreativeRequestById(id: string): CreativeRequest | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM creative_requests WHERE id = ?");
  return stmt.get(id) as CreativeRequest | undefined;
}

export function updateCreativeRequest(
  id: string,
  updates: Partial<Pick<CreativeRequest, "status" | "ai_draft" | "final_delivery">>
): CreativeRequest {
  const db = getDb();
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
    return getCreativeRequestById(id) as CreativeRequest;
  }

  values.push(id);
  const db2 = getDb();
  const stmt = db2.prepare(
    `UPDATE creative_requests SET ${fields.join(", ")} WHERE id = ? RETURNING *`
  );
  return stmt.get(...values) as CreativeRequest;
}

// ---------------------------------------------------------------------------
// Project helpers
// ---------------------------------------------------------------------------

export function createProject(data: {
  user_id: string;
  name: string;
  description?: string;
}): Project {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO projects (user_id, name, description)
    VALUES (@user_id, @name, @description)
    RETURNING *
  `);
  return stmt.get({
    user_id: data.user_id,
    name: data.name,
    description: data.description ?? "",
  }) as Project;
}

export function getProjectsByUser(userId: string): Project[] {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC"
  );
  return stmt.all(userId) as Project[];
}

export function getProjectById(id: string): Project | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
  return stmt.get(id) as Project | undefined;
}

export function incrementProjectCreativeCount(projectId: string): void {
  const db = getDb();
  db.prepare(
    "UPDATE projects SET creatives_count = creatives_count + 1 WHERE id = ?"
  ).run(projectId);
}

// ---------------------------------------------------------------------------
// Admin helpers
// ---------------------------------------------------------------------------

export function getAllUsers(): User[] {
  const db = getDb();
  return db.prepare("SELECT * FROM users ORDER BY created_at DESC").all() as User[];
}

export function getSubscriptionSummary(): Array<{
  tier: string;
  count: number;
}> {
  const db = getDb();
  return db
    .prepare(
      "SELECT subscription_tier AS tier, COUNT(*) AS count FROM users GROUP BY subscription_tier ORDER BY tier"
    )
    .all() as Array<{ tier: string; count: number }>;
}

// ---------------------------------------------------------------------------
// Close (for graceful shutdown)
// ---------------------------------------------------------------------------

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}