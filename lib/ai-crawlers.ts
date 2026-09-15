import type { MetadataRoute } from "next";

/**
 * 2026 answer-engine / AI-search crawler allow-list (AEO / GEO).
 *
 * These bots surface CITATIONS in AI answers — Google AI Overviews, ChatGPT
 * Search, Perplexity, Claude web search, Gemini, Apple Intelligence, Meta AI,
 * Amazon Rufus, DuckAssist, You.com. Being crawlable by them is the entire
 * point of answer-engine optimization: blocked = invisible in AI answers,
 * which is where a growing share of high-intent discovery now happens.
 *
 * Public marketing/content pages only ever get exposed — every caller passes
 * its own `disallow` list so authenticated/app/API paths stay private.
 *
 * Pure training-only scrapers with no citation surface are blocked separately
 * (BLOCKED_SCRAPERS) so we feed answer engines without feeding dead-end
 * harvesters.
 */
export const AI_ANSWER_ENGINES = [
  // OpenAI — ChatGPT Search + browsing (OAI-SearchBot indexes; ChatGPT-User fetches live; GPTBot grounds)
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic — Claude web search + citations
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity — index + live fetch
  "PerplexityBot",
  "Perplexity-User",
  // Google — Gemini / AI Overviews grounding
  "Google-Extended",
  // Apple Intelligence / Siri
  "Applebot",
  "Applebot-Extended",
  // Meta AI (WhatsApp / Instagram / Facebook answers)
  "meta-externalagent",
  "FacebookBot",
  // Amazon — Alexa / Rufus
  "Amazonbot",
  // You.com
  "YouBot",
  // DuckDuckGo AI assist
  "DuckAssistBot",
  // Common Crawl — feeds most LLM corpora and several answer engines
  "CCBot",
  // Cohere — enterprise answer tooling
  "cohere-ai",
] as const;

/** Pure training/scraper bots with no citation surface — blocked. */
export const BLOCKED_SCRAPERS = [
  "Bytespider",
  "Diffbot",
  "Omgilibot",
  "Timpibot",
  "ImagesiftBot",
] as const;

type Rule = { userAgent: string; allow?: string | string[]; disallow?: string | string[] };

/** Allow every answer-engine bot on public content, keeping `disallow` private. */
export function answerEngineRules(disallow: string[]): Rule[] {
  return AI_ANSWER_ENGINES.map((userAgent) => ({ userAgent, allow: "/", disallow }));
}

/** Block pure training/scraper bots entirely. */
export function blockedScraperRules(): Rule[] {
  return BLOCKED_SCRAPERS.map((userAgent) => ({ userAgent, disallow: "/" }));
}
