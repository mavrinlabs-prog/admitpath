import Groq from "groq-sdk";
import { sendGroqExhaustionAlert } from "./email";
import { sendAlert } from "./alert";
import { logError, logWarn } from "./log-error";
import { MAX_PROVIDER_OUTPUT_TOKENS } from "./chat-budget";
import { counselorProviderFailureAction } from "./counselor-provider-policy";

// LLM routing: Cerebras llama3.1-8b primary → Groq llama-3.3-70b-versatile fallback.
// NO OpenAI anywhere. Keys loaded from env vars ONLY — never hardcode.
// Rotate ALL gsk_* keys at console.groq.com (27 were exposed in git history — see SECURITY_INCIDENT.md).

/** Cerebras request timeout (ms). Must be UNDER Vercel's maxDuration (60s)
 *  so the route can catch the timeout and return JSON instead of Vercel
 *  killing the function with a bare 503. */
const CEREBRAS_TIMEOUT_MS = 8_000;
/** Groq SDK request timeout (ms). Same rationale — stay under Vercel limit. */
const GROQ_TIMEOUT_MS = 20_000;

function cleanEnvKey(raw: string): string {
  return raw.trim().replace(/^\xEF\xBB\xBF/, "").replace(/[\r\n]+/g, "");
}

function loadGroqKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 50; i++) {
    const raw = process.env[`GROQ_API_KEY_${i}`];
    if (raw) {
      const k = cleanEnvKey(raw);
      if (k) keys.push(k);
    }
  }
  if (keys.length === 0 && process.env.GROQ_API_KEY) {
    keys.push(cleanEnvKey(process.env.GROQ_API_KEY));
  }
  if (keys.length === 0) {
    console.error("[groq] NO GROQ API KEYS FOUND:", {
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      GROQ_API_KEY_1: !!process.env.GROQ_API_KEY_1,
      CEREBRAS_API_KEY: !!process.env.CEREBRAS_API_KEY,
    });
  } else {
    console.log(`[groq] Keys loaded: ${keys.length} (CEREBRAS_API_KEY=${!!process.env.CEREBRAS_API_KEY})`);
  }
  return keys;
}

let _cachedKeys: string[] | null = null;
let _cachedKeysTime = 0;
const KEY_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — refresh keys periodically in long-lived serverless instances

function getGroqKeysFromEnv(): string[] {
  const now = Date.now();
  if (!_cachedKeys || now - _cachedKeysTime > KEY_CACHE_TTL_MS) {
    _cachedKeys = loadGroqKeys();
    _cachedKeysTime = now;
  }
  return _cachedKeys;
}

/** Clear the cached key list. Call after hot-reloading env vars. */
export function invalidateKeyCache(): void {
  _cachedKeys = null;
}

let currentKeyIndex = 0;

// Health-aware rotation. When a key returns 429 we record the soonest-allowed
// retry time (parsed from `retry-after` if present, else +60s). On subsequent
// requests we skip keys that are still rate-limited rather than blindly burning
// through the rotation pool.
const keyHealth = new Map<string, { rateLimitedUntil: number }>();

export function markGroqKeyRateLimited(apiKey: string, retryAfterSeconds: number): void {
  const ms = Math.max(1, retryAfterSeconds) * 1000;
  keyHealth.set(apiKey, { rateLimitedUntil: Date.now() + ms });
}

export function getGroqKeyHealth(): { total: number; healthy: number } {
  const keys = getGroqKeysFromEnv();
  const now = Date.now();
  let healthy = 0;
  for (const k of keys) {
    const h = keyHealth.get(k);
    if (!h || h.rateLimitedUntil <= now) healthy += 1;
  }
  return { total: keys.length, healthy };
}

/** Pick the next healthy key. Falls back to the soonest-resetting key
 *  if every key is currently penalized. */
function pickHealthyKey(): string | null {
  const keys = getGroqKeysFromEnv();
  if (keys.length === 0) return null;
  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const idx = (currentKeyIndex + i) % keys.length;
    const k = keys[idx];
    const h = keyHealth.get(k);
    if (!h || h.rateLimitedUntil <= now) {
      currentKeyIndex = (idx + 1) % keys.length;
      return k;
    }
  }
  // All penalized — fall back to soonest-resetting.
  let best: string | null = null;
  let bestTime = Infinity;
  for (const k of keys) {
    const t = keyHealth.get(k)?.rateLimitedUntil ?? 0;
    if (t < bestTime) { bestTime = t; best = k; }
  }
  return best ?? keys[0];
}

export function getGroqClient(): { client: Groq; apiKey: string } {
  const apiKey = pickHealthyKey();
  if (!apiKey) throw new Error("No GROQ_API_KEY_* env vars set. Add to .env.local or Vercel.");
  return { client: new Groq({ apiKey, timeout: GROQ_TIMEOUT_MS }), apiKey };
}

/**
 * 5xx responses (and network failures) get up to 2 retries with exponential
 * backoff (250ms, 750ms). 4xx is deterministic — no retry, fall through to
 * Groq fallback. Status is encoded on the thrown Error so the caller can
 * distinguish network/5xx from 4xx.
 */
class CerebrasError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function callCerebrasOnce(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  parentSignal?: AbortSignal,
): Promise<string> {
  const rawKey = process.env.CEREBRAS_API_KEY;
  if (!rawKey) throw new CerebrasError(0, "CEREBRAS_API_KEY not set");
  const key = cleanEnvKey(rawKey);
  if (!key) throw new CerebrasError(0, "CEREBRAS_API_KEY is empty after stripping");
  const controller = new AbortController();
  const abortFromParent = () => {
    controller.abort(parentSignal?.reason ?? new DOMException("Request aborted", "AbortError"));
  };
  if (parentSignal?.aborted) abortFromParent();
  else parentSignal?.addEventListener("abort", abortFromParent, { once: true });
  const timeout = setTimeout(() => controller.abort(), CEREBRAS_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.CEREBRAS_MODEL || "llama3.1-8b", messages, temperature: 0.7, max_tokens: 2048 }),
      signal: controller.signal,
    });
  } catch (e) {
    if (parentSignal?.aborted) {
      throw parentSignal.reason ?? new DOMException("Request aborted", "AbortError");
    }
    // Network-layer failure (DNS, TCP, TLS) or AbortController timeout. Treat as retryable.
    const msg = (e as Error).name === "AbortError"
      ? `Cerebras timeout after ${CEREBRAS_TIMEOUT_MS}ms`
      : `Cerebras network error: ${(e as Error).message}`;
    throw new CerebrasError(0, msg);
  } finally {
    clearTimeout(timeout);
    parentSignal?.removeEventListener("abort", abortFromParent);
  }
  if (!res.ok) throw new CerebrasError(res.status, `Cerebras ${res.status}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? "";
}

async function callCerebras(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  signal?: AbortSignal,
): Promise<string> {
  const maxRetries = 0;
  let lastErr: CerebrasError | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callCerebrasOnce(messages, signal);
    } catch (e) {
      const err = e as CerebrasError;
      lastErr = err;
      // 4xx (excluding 0/5xx) is deterministic — bail immediately so the
      // caller can fall through to Groq.
      const isRetryable = err.status === 0 || err.status >= 500;
      if (!isRetryable || attempt === maxRetries) {
        if (attempt > 0) {
          console.error(`[llm-route] cerebras gave up after ${attempt} retries status=${err.status}`);
        }
        throw err;
      }
      const backoffMs = 250 * Math.pow(3, attempt); // 250ms, 750ms
      console.error(`[llm-route] cerebras retry ${attempt + 1}/${maxRetries} status=${err.status} backoff=${backoffMs}ms`);
      await new Promise((r) => setTimeout(r, backoffMs));
    }
  }
  throw lastErr ?? new CerebrasError(0, "cerebras: unknown");
}

/**
 * Streaming variant of groqChat. Yields raw text deltas (no JSON envelope).
 *
 * Routing mirrors the counselor policy: Groq stream primary → buffered
 * Cerebras fallback when the primary fails before its first delta.
 * Failure handling differs from the batch path in one important way: once we've
 * yielded the first chunk we are committed to that provider — switching mid-
 * stream would require buffering and replaying, which defeats the point of
 * streaming. So fallback only triggers if the *primary* fails before its first
 * delta. Mid-stream errors propagate so the caller can `controller.error()`.
 */
export async function* groqChatStream(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: { signal?: AbortSignal; primaryTimeoutMs?: number } = {},
): AsyncGenerator<string, void, unknown> {
  // Groq-only streaming — Cerebras SSE removed (too slow for serverless).
  let lastError: Error | null = null;
  const keys = getGroqKeysFromEnv();
  const streamMaxRetries = Math.min(keys.length + 1, 5);
  let hasYielded = false;
  for (let attempt = 0; attempt < Math.max(streamMaxRetries, 1); attempt++) {
    let apiKey = "";
    try {
      const selected = getGroqClient();
      const client = selected.client;
      apiKey = selected.apiKey;
      const stream = await client.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        // Keep requested output inside the 12K TPM envelope used by the
        // counselor model; the route separately caps input at 6K tokens.
        max_tokens: MAX_PROVIDER_OUTPUT_TOKENS,
        stream: true,
      }, {
        signal: options.signal,
        timeout: options.primaryTimeoutMs ?? 12_000,
        maxRetries: 0,
      });
      // Once we yield the first chunk we own the stream — errors here
      // propagate to the caller.
      for await (const chunk of stream as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          hasYielded = true;
          yield delta;
        }
      }
      return;
    } catch (err) {
      lastError = err as Error;
      const status = (err as { status?: number }).status;
      const action = counselorProviderFailureAction(err, {
        hasYielded,
        aborted: options.signal?.aborted ?? false,
      });
      if (action === "retry-key" && status === 429 && apiKey) {
        const headers = (err as { headers?: Record<string, string> }).headers;
        const ra = parseInt(headers?.["retry-after"] ?? "60", 10);
        markGroqKeyRateLimited(apiKey, Number.isFinite(ra) ? ra : 60);
        continue;
      }
      if (action === "retry-key" && status === 401 && apiKey) {
        // Invalid/expired key — permanently disable for 24h
        markGroqKeyRateLimited(apiKey, 86400);
        logError("groq:stream-auth-failure", new Error(`Groq stream key ending ...${apiKey.slice(-4)} returned 401`));
        continue;
      }
      if (action === "fallback") break;
      throw err;
    }
  }
  // Fall back before streaming starts. A single buffered fallback chunk keeps
  // the client contract intact without risking duplicate partial output.
  try {
    const fallback = await callCerebras(messages, options.signal);
    if (fallback) {
      yield fallback;
      return;
    }
  } catch (fallbackError) {
    if (options.signal?.aborted) throw fallbackError;
    lastError = fallbackError as Error;
  }

  // Structured alert for streaming path exhaustion
  const streamHealth = getGroqKeyHealth();
  void sendAlert({
    severity: "critical",
    scope: "groq.stream-keys-exhausted",
    message: "All Groq keys exhausted during streaming; AI chat offline.",
    context: { totalKeys: streamHealth.total, healthyKeys: streamHealth.healthy, lastError: lastError?.message ?? null },
  });
  sendGroqExhaustionAlert().catch(() => { /* best-effort */ });
  const health = getGroqKeyHealth();
  throw lastError ?? new Error(
    `All LLM providers failed: Cerebras and Groq both unavailable (${health.total} keys, ${health.healthy} healthy)`
  );
}

export async function groqChat(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  _model = "llama-3.3-70b-versatile"
): Promise<string> {
  // Primary: Groq (fast, reliable, 41 keys with rotation).
  // Cerebras is fallback only — it cold-starts too slowly for serverless.
  let lastError: Error | null = null;
  const keys = getGroqKeysFromEnv();
  const maxRetries = Math.min(keys.length + 1, 5);
  for (let attempt = 0; attempt < Math.max(maxRetries, 1); attempt++) {
    const { client, apiKey } = getGroqClient();
    try {
      const completion = await client.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2048,
      });
      const content = completion.choices[0]?.message?.content ?? "";
      console.info("[llm-route] groq llama-3.3-70b-versatile OK (fallback)");
      return content;
    } catch (err) {
      lastError = err as Error;
      const status = (err as { status?: number }).status;
      if (status === 429) {
        // Try to read retry-after header from the SDK error envelope; default to 60s.
        const headers = (err as { headers?: Record<string, string> }).headers;
        const ra = parseInt(headers?.["retry-after"] ?? "60", 10);
        markGroqKeyRateLimited(apiKey, Number.isFinite(ra) ? ra : 60);
        continue;
      }
      if (status === 401) {
        // Invalid/expired key — permanently mark it so we don't retry with it.
        // 86400s = 24h; the key won't recover on its own.
        markGroqKeyRateLimited(apiKey, 86400);
        logError("groq:auth-failure", new Error(`Groq key ending ...${apiKey.slice(-4)} returned 401 — marked unhealthy for 24h`));
        continue;
      }
      throw err;
    }
  }
  // Alert ops team that all Groq keys are exhausted — structured alert + legacy email
  const { total, healthy } = getGroqKeyHealth();
  void sendAlert({
    severity: "critical",
    scope: "groq.keys-exhausted",
    message: "All Groq API keys unhealthy; AI features offline.",
    context: { totalKeys: total, healthyKeys: healthy, lastError: lastError?.message ?? null },
  });
  // Fallback: try Cerebras once if all Groq keys failed
  try {
    const cerebrasResult = await callCerebras(messages);
    if (cerebrasResult) {
      console.info("[llm-route] cerebras fallback OK (all Groq keys failed)");
      return cerebrasResult;
    }
  } catch (e) {
    logWarn("groq:cerebras-fallback-also-failed", (e as Error).message, {});
  }

  sendGroqExhaustionAlert().catch(() => {});
  throw lastError ?? new Error(
    `All LLM providers failed: Groq and Cerebras both unavailable (${total} keys, ${healthy} healthy)`
  );
}
