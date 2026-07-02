/**
 * AdSynth OpenAI Integration
 *
 * Generates ad creative drafts using OpenAI's API.
 *
 * ⚠️  Requires OPENAI_API_KEY in .env
 *
 * Server-only — import only from createServerFn() or API route handlers.
 */

import OpenAI from "openai";
import { OPENAI_API_KEY } from "./env";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  _openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  return _openai;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreativeBrief {
  businessType: string;
  businessName: string;
  adPlatform: "facebook" | "instagram" | "google";
  adType: "image" | "video" | "static" | "carousel";
  description: string;
  /** Optional brand voice / tone instructions */
  tone?: string;
  /** Optional target audience description */
  targetAudience?: string;
}

export interface GeneratedCreative {
  /** The AI-generated ad copy / description */
  adCopy: string;
  /** Suggested headline (for display ads) */
  headline: string;
  /** Call-to-action text */
  cta: string;
  /** Brief description of suggested visual direction */
  visualDescription: string;
  /** Marketing angle / hook used */
  marketingAngle: string;
  /** Additional suggestions */
  suggestions: string[];
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

function buildPrompt(brief: CreativeBrief): string {
  return `You are an expert advertising copywriter and creative director for local businesses.

Generate a high-converting ad creative for the following:

Business Type: ${brief.businessType}
Business Name: ${brief.businessName}
Ad Platform: ${brief.adPlatform}
Ad Type: ${brief.adType}
Description / Goals: ${brief.description}
${brief.tone ? `Tone: ${brief.tone}` : ""}
${brief.targetAudience ? `Target Audience: ${brief.targetAudience}` : ""}

Return your response as a JSON object with these fields:
- "headline": A compelling ad headline (max 40 characters for Facebook, max 30 for Google)
- "adCopy": The main ad body copy (2-3 sentences, benefits-focused)
- "cta": A strong call-to-action (e.g., "Book Now", "Get a Free Quote")
- "visualDescription": A detailed description of the visual/ad creative
- "marketingAngle": The marketing angle or hook used
- "suggestions": Array of 2-3 additional creative variations or ideas`;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

/**
 * Generate an ad creative using OpenAI.
 * Returns structured creative content.
 */
export async function generateCreative(
  brief: CreativeBrief
): Promise<GeneratedCreative> {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // cost-effective for creative generation
    messages: [
      {
        role: "system",
        content:
          "You are an expert advertising creative director. Generate conversion-optimized ad copy in JSON format.",
      },
      {
        role: "user",
        content: buildPrompt(brief),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  const parsed = JSON.parse(content) as GeneratedCreative;
  return {
    adCopy: parsed.adCopy ?? "",
    headline: parsed.headline ?? "",
    cta: parsed.cta ?? "",
    visualDescription: parsed.visualDescription ?? "",
    marketingAngle: parsed.marketingAngle ?? "",
    suggestions: parsed.suggestions ?? [],
  };
}

/**
 * Generate multiple ad variations for A/B testing.
 */
export async function generateVariations(
  brief: CreativeBrief,
  count: number = 3
): Promise<GeneratedCreative[]> {
  const results: GeneratedCreative[] = [];
  for (let i = 0; i < count; i++) {
    const creative = await generateCreative({
      ...brief,
      tone: brief.tone ?? `Variation ${i + 1}: different angle from the previous`,
    });
    results.push(creative);
  }
  return results;
}