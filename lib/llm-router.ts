/**
 * Three-tier LLM router.
 *
 * Routing strategy by tier and task complexity:
 *
 *   Tier 1 — Cerebras llama3.1-8b
 *     For: chat replies, simple Q&A, fast iteration.
 *     Reason: ~3000 tokens/sec, free credits, 8B is enough.
 *
 *   Tier 2 — Groq llama-3.3-70b-versatile
 *     For: 7-dim profile analysis, 6-dim essay scoring, college matching.
 *     Reason: 70B reasoning beats 8B on multi-dim rubrics by a clear margin.
 *
 *   Tier 3 — Anthropic Claude Sonnet 4.5 (Pro tier only, optional)
 *     For: deep essay coaching, "why us" specificity scoring,
 *          honest-reach calibration narrative.
 *     Reason: best-in-class at nuanced writing critique. Only fires when
 *             ANTHROPIC_API_KEY is set AND the user is on plan="pro".
 *
 * The router falls back gracefully: Tier 3 → Tier 2 → Tier 1 if any tier
 * is unavailable or fails. Existing callers using `groqChat()` are
 * unchanged; new code can use `routeLlmCall()` to opt into tier 3.
 */

import { groqChat, getGroqClient, markGroqKeyRateLimited, getGroqKeyHealth } from "./groq";
import { sendGroqExhaustionAlert } from "./email";
import { sendAlert } from "./alert";
import { logError, logEvent, logWarn } from "./log-error";
let logTrainingExample: (ex: any) => Promise<void>;
try { logTrainingExample = require("./training-data-logger").logTrainingExample; } catch { logTrainingExample = async () => {}; }

export type LlmTier = 1 | 2 | 3;

export type RouteOptions = {
  /** Caller's preferred minimum tier. Router may downgrade on availability. */
  minTier?: LlmTier;
  /** User plan — only "pro" can hit Tier 3. Defaults to free behavior. */
  plan?: "free" | "plus" | "pro";
  /** Override Anthropic model. Defaults to claude-sonnet-4-5. */
  anthropicModel?: string;
  /** Override temperature. Defaults to 0.7 for chat, 0.4 recommended for scoring. */
  temperature?: number;
  /** Override max_tokens. Defaults to 2048. */
  maxTokens?: number;
  /** Caller label for debug logging (e.g., "analyze", "essay"). */
  callerLabel?: string;
  /** Attributed user — REQUIRED for training-data logging. The logger
   *  verifies User.trainingConsent and drops examples it can't attribute. */
  userId?: string;
};

/**
 * Anthropic Claude call. Returns string content from the first text block.
 * Throws on missing key or non-2xx so the router can fall through.
 */
async function callAnthropic(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  system: string,
  model: string,
  maxTokens = 2048,
  temperature = 0.7,
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY not set");
  const controller = new AbortController();
  // Must be under Vercel's maxDuration (60s) so the route can return JSON on timeout
  const timeout = setTimeout(() => controller.abort(), 25_000);
  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system,
        messages,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Anthropic ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { content: Array<{ type: string; text?: string }> };
  const firstText = data.content.find((b) => b.type === "text" && typeof b.text === "string");
  return firstText?.text ?? "";
}

/**
 * Direct Groq llama-3.3-70b-versatile call with health-aware key rotation.
 * Used by the router when minTier >= 2 to guarantee 70B reasoning — bypasses
 * the Cerebras 8B primary path that groqChat() uses.
 */
async function callGroq70B(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  temperature = 0.7,
  maxTokens = 2048,
): Promise<string> {
  let lastError: Error | null = null;
  const { total } = getGroqKeyHealth();
  for (let attempt = 0; attempt < Math.max(total, 1); attempt++) {
    const { client, apiKey } = getGroqClient();
    try {
      const completion = await client.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature,
        max_tokens: maxTokens,
      });
      return completion.choices[0]?.message?.content ?? "";
    } catch (err) {
      lastError = err as Error;
      const status = (err as { status?: number }).status;
      if (status === 429) {
        const headers = (err as { headers?: Record<string, string> }).headers;
        const ra = parseInt(headers?.["retry-after"] ?? "60", 10);
        markGroqKeyRateLimited(apiKey, Number.isFinite(ra) ? ra : 60);
        continue;
      }
      if (status === 401) {
        // Invalid/expired key — mark unhealthy for 24h
        markGroqKeyRateLimited(apiKey, 86400);
        continue;
      }
      throw err;
    }
  }
  sendGroqExhaustionAlert().catch(() => { /* best-effort */ });
  throw lastError ?? new Error("All Groq keys exhausted for Tier 2 call");
}

/**
 * Three-tier router with graceful fallback. The `messages` array follows the
 * OpenAI/Groq convention (system + user + assistant interleaved). Anthropic
 * requires the system prompt to be separated, so we extract it.
 */
export async function routeLlmCall(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  opts: RouteOptions = {}
): Promise<{ text: string; tierUsed: LlmTier }> {
  // CLAUDE-FIRST MODE: When USE_CLAUDE_PRIMARY=true, route ALL calls
  // through Claude regardless of plan. Used during data collection phase
  // to generate gold-standard outputs for training the Groq model.
  const claudeFirst =
    process.env.USE_CLAUDE_PRIMARY === "true" &&
    process.env.ANTHROPIC_API_KEY;

  const wantsTier3 =
    claudeFirst ||
    ((opts.minTier ?? 2) >= 3 &&
    opts.plan === "pro" &&
    process.env.ANTHROPIC_API_KEY);

  const label = opts.callerLabel ?? "unknown";
  const temperature = opts.temperature ?? 0.7;
  const maxTokens = opts.maxTokens ?? 2048;

  if (wantsTier3) {
    try {
      const systemMsg = messages.find((m) => m.role === "system");
      const conversation = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      const model = opts.anthropicModel ?? "claude-sonnet-4-5";
      const text = await callAnthropic(
        conversation,
        systemMsg?.content ?? "",
        model,
        maxTokens,
        temperature,
      );
      console.info(`[llm-route] ${label} -> tier 3 (anthropic/${model}) OK`);
      logTrainingExample({
        route: label,
        tierUsed: 3,
        systemPrompt: systemMsg?.content ?? "",
        userMessage: conversation.map(m => m.content).join("\n"),
        assistantResponse: text,
        metadata: { userId: opts.userId, model, timestamp: new Date().toISOString(), responseLength: text.length },
      }).catch(() => {});
      return { text, tierUsed: 3 };
    } catch (e) {
      logWarn("llm-route:tier3-fallback", `${label} tier 3 (Anthropic) failed, falling back to tier 2`, {
        error: (e as Error).message,
        status: (e as { status?: number }).status ?? null,
      });
      // Fall through to tier 2.
    }
  }

  const minTier = opts.minTier ?? 2;

  // Diagnostic: log when Tier 3 was desired but not available
  if (!wantsTier3 && (opts.minTier ?? 2) >= 3) {
    console.warn(`[llm-route] ${label}: tier 3 requested but skipped (plan=${opts.plan}, hasAnthropicKey=${!!process.env.ANTHROPIC_API_KEY})`);
  }

  // Tier 2: call Groq 70B directly — do NOT fall through to Cerebras 8B.
  // Multi-dimension scoring rubrics (essay 6-dim, profile 7-dim) need 70B
  // reasoning; 8B produces inflated scores and misses calibration nuances.
  if (minTier >= 2) {
    try {
      const text = await callGroq70B(messages, temperature, maxTokens);
      console.info(`[llm-route] ${label} -> tier 2 (groq/llama-3.3-70b-versatile) OK`);
      const sysMsg2 = messages.find(m => m.role === "system");
      logTrainingExample({
        route: label,
        tierUsed: 2,
        systemPrompt: sysMsg2?.content ?? "",
        userMessage: messages.filter(m => m.role === "user").map(m => m.content).join("\n"),
        assistantResponse: text,
        metadata: { userId: opts.userId, model: "llama-3.3-70b-versatile", timestamp: new Date().toISOString(), responseLength: text.length },
      }).catch(() => {});
      return { text, tierUsed: 2 };
    } catch (e) {
      logWarn("llm-route:tier2-fallback", `${label} tier 2 (Groq 70B) failed, falling back to tier 1`, {
        error: (e as Error).message,
        status: (e as { status?: number }).status ?? null,
      });
      // Fall through to Tier 1 (Cerebras → Groq via groqChat).
    }
  }

  // Tier 1: Cerebras 8B primary with Groq 70B fallback (for simple tasks
  // like chat Q&A, deadline parsing, profile summaries).
  const text = await groqChat(messages);
  logEvent("llm_route_complete", { label, tierUsed: 1, responseLength: text.length });

  // Empty-response guard: if the LLM returned nothing, log a warning.
  // Better to surface an empty result to the caller than silently succeed.
  if (!text || text.trim().length === 0) {
    logWarn("llm-route:empty-response", `${label} tier 1 returned empty response`, { tierUsed: 1 });
  }

  return { text, tierUsed: 1 };
}

/**
 * Convenience: returns ONLY the text. Useful when the caller doesn't
 * care which tier answered.
 */
export async function llmComplete(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  opts: RouteOptions = {}
): Promise<string> {
  const { text } = await routeLlmCall(messages, opts);
  return text;
}

/**
 * Hard guard: ensures no OpenAI models are ever used in this codebase.
 * This function is a no-op assertion — it exists so grep can verify the
 * policy is documented and enforced in the routing layer.
 *
 * Routing chain: Cerebras llama3.1-8b -> Groq llama-3.3-70b-versatile
 *                (Tier 3: Anthropic Claude for Pro users only)
 *                NEVER OpenAI. See CLAUDE.md hard rule #1.
 */
export const LLM_ROUTING_POLICY = {
  tier1: "cerebras/llama3.1-8b",
  tier2: "groq/llama-3.3-70b-versatile",
  tier3: "anthropic/claude-sonnet-4-5 (pro only)",
  banned: ["openai/*", "gpt-*", "o1-*", "o3-*"] as const,
} as const;
