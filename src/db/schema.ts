/**
 * AdSynth Database Schema
 *
 * SQLite schema for local development / MVP.
 * All tables are created via better-sqlite3 on server startup.
 *
 * NOTE: In production, migrate to Supabase PostgreSQL for
 * managed auth, real-time, and multi-region replication.
 */

export const SCHEMA_SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL DEFAULT '',
  avatar_url      TEXT DEFAULT '',
  stripe_customer_id TEXT DEFAULT '',
  subscription_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'starter', 'growth', 'agency')),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Creative requests
CREATE TABLE IF NOT EXISTS creative_requests (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id      TEXT REFERENCES projects(id) ON DELETE SET NULL,
  business_type   TEXT NOT NULL DEFAULT '',
  business_name   TEXT NOT NULL DEFAULT '',
  ad_platform     TEXT NOT NULL DEFAULT 'facebook'
    CHECK (ad_platform IN ('facebook', 'instagram', 'google')),
  ad_type         TEXT NOT NULL DEFAULT 'image'
    CHECK (ad_type IN ('image', 'video', 'static', 'carousel')),
  description     TEXT NOT NULL DEFAULT '',
  logo_url        TEXT DEFAULT '',
  photos          TEXT DEFAULT '[]',
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'ai_draft', 'editing', 'completed', 'cancelled')),
  ai_draft        TEXT DEFAULT '',
  final_delivery  TEXT DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at    TEXT DEFAULT NULL
);

-- Projects table
-- Contact messages (website inquiries / support)
CREATE TABLE IF NOT EXISTS contact_messages (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  business_name   TEXT DEFAULT '',
  message         TEXT NOT NULL,
  source          TEXT NOT NULL DEFAULT 'website',
  read            INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT DEFAULT '',
  creatives_count INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived', 'completed')),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Referral program
CREATE TABLE IF NOT EXISTS referrals (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  referrer_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_email  TEXT NOT NULL,
  referred_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'signed_up', 'subscribed', 'rewarded', 'expired')),
  reward_granted  INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Referral credits (can be applied to subscriptions)
CREATE TABLE IF NOT EXISTS referral_credits (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents    INTEGER NOT NULL DEFAULT 0,
  description     TEXT NOT NULL DEFAULT '',
  expires_at      TEXT DEFAULT NULL,
  used            INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Free previews (sample creative generation)
CREATE TABLE IF NOT EXISTS free_previews (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email           TEXT NOT NULL,
  business_name   TEXT NOT NULL,
  industry        TEXT NOT NULL,
  target_audience TEXT DEFAULT '',
  ad_platform     TEXT NOT NULL DEFAULT 'facebook',
  generated_creative TEXT DEFAULT '',
  subscribed      INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Brand settings (onboarding flow)
CREATE TABLE IF NOT EXISTS brand_settings (
  id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_colors    TEXT DEFAULT '[]',
  brand_tone      TEXT NOT NULL DEFAULT 'professional',
  style_preferences TEXT DEFAULT '',
  logo_url        TEXT DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  stripe_customer_id: string;
  subscription_tier: "free" | "starter" | "growth" | "agency";
  created_at: string;
}

export interface CreativeRequest {
  id: string;
  user_id: string;
  project_id: string | null;
  business_type: string;
  business_name: string;
  ad_platform: "facebook" | "instagram" | "google";
  ad_type: "image" | "video" | "static" | "carousel";
  description: string;
  logo_url: string;
  photos: string; // JSON array of URLs
  status: "pending" | "ai_draft" | "editing" | "completed" | "cancelled";
  ai_draft: string;
  final_delivery: string;
  created_at: string;
  completed_at: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  business_name: string;
  message: string;
  source: string;
  read: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  creatives_count: number;
  status: "active" | "archived" | "completed";
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_email: string;
  referred_user_id: string | null;
  status: "pending" | "signed_up" | "subscribed" | "rewarded" | "expired";
  reward_granted: number;
  created_at: string;
}

export interface ReferralCredit {
  id: string;
  user_id: string;
  amount_cents: number;
  description: string;
  expires_at: string | null;
  used: number;
  created_at: string;
}

export interface FreePreview {
  id: string;
  email: string;
  business_name: string;
  industry: string;
  target_audience: string;
  ad_platform: string;
  generated_creative: string;
  subscribed: number;
  created_at: string;
}

export interface BrandSettings {
  id: string;
  user_id: string;
  brand_colors: string; // JSON array
  brand_tone: string;
  style_preferences: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}