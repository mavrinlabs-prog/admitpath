import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Upstash Redis-backed rate limiter with graceful in-memory fallback.
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enable distributed
// limiting across serverless instances. Without those vars, falls back to a
// module-level Map (best-effort; resets on cold start).
// ---------------------------------------------------------------------------

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// In-memory fallback (single instance only — not distributed).
// Bounded to MAX_FALLBACK_ENTRIES to prevent unbounded growth at 1M-user scale.
// Expired entries are lazily evicted on access; a periodic sweep runs every
// 60s to catch entries that are never re-accessed.
const fallbackStore = new Map<string, { count: number; reset: number }>();
const MAX_FALLBACK_ENTRIES = 50_000;

// Periodic sweep: every 60s, evict expired entries to prevent memory leaks
// in long-lived serverless instances.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    fallbackStore.forEach((entry, key) => {
      if (entry.reset < now) fallbackStore.delete(key);
    });
  }, 60_000).unref?.();
}

function fallbackRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = fallbackStore.get(key);
  if (!entry || entry.reset < now) {
    // Evict oldest entries if we hit the size cap (LRU-like via insertion order)
    if (fallbackStore.size >= MAX_FALLBACK_ENTRIES) {
      const firstKey = fallbackStore.keys().next().value;
      if (firstKey !== undefined) fallbackStore.delete(firstKey);
    }
    fallbackStore.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Legacy export — still used by some routes
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  return fallbackRateLimit(key, limit, windowMs);
}

export type RateLimitResult = { allowed: boolean; remaining?: number; reset?: number };

/**
 * Per-plan AI rate limits (requests per 60s). Free tier is conservative to
 * prevent abuse; paid tiers are generous enough for power users.
 *
 *   free:  6 req / 60s  (one every 10s — prevents rapid-fire)
 *   plus:       20 req / 60s  (comfortable iteration)
 *   pro:        40 req / 60s  (power user / bulk workflows)
 */
type PlanTier = "free" | "plus" | "pro";

const AI_LIMITS_BY_PLAN: Record<PlanTier, number> = {
  free: 6,
  plus: 20,
  pro: 40,
};

const API_LIMITS_BY_PLAN: Record<PlanTier, number> = {
  free: 30,
  plus: 120,
  pro: 200,
};

const distributedLimiters = new Map<string, Ratelimit>();

function distributedLimiter(scope: string, limit: number, windowSeconds = 60): Ratelimit | null {
  if (!redis) return null;
  const key = `${scope}:${limit}:${windowSeconds}`;
  const existing = distributedLimiters.get(key);
  if (existing) return existing;
  const duration = windowSeconds === 600
    ? "600 s"
    : windowSeconds === 3600
      ? "3600 s"
      : "60 s";
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, duration),
    analytics: true,
    prefix: `admitpath:${scope}:${limit}:${windowSeconds}`,
  });
  distributedLimiters.set(key, limiter);
  return limiter;
}

/**
 * Distributed limiter for public endpoints with route-specific thresholds.
 * Supported windows match the public API policies currently used by the app.
 */
export async function rateLimitWindow(
  identifier: string,
  limit: number,
  windowMs: 60_000 | 600_000 | 3_600_000,
): Promise<RateLimitResult> {
  const windowSeconds = windowMs / 1000;
  const limiter = distributedLimiter("public", limit, windowSeconds);
  if (limiter) {
    try {
      const { success, remaining, reset } = await limiter.limit(identifier);
      return { allowed: success, remaining, reset };
    } catch (err) {
      console.error("[rate-limit] distributed public limiter unavailable; using bounded fallback", {
        name: err instanceof Error ? err.name : "UnknownError",
      });
    }
  }
  return { allowed: fallbackRateLimit(`public:${identifier}`, limit, windowMs) };
}

function resolveAiLimit(plan?: string | null): number {
  if (plan === "plus") return AI_LIMITS_BY_PLAN.plus;
  if (plan === "pro" || plan === "seasonPass") return AI_LIMITS_BY_PLAN.pro;
  return AI_LIMITS_BY_PLAN.free;
}

function resolveApiLimit(plan?: string | null): number {
  if (plan === "plus") return API_LIMITS_BY_PLAN.plus;
  if (plan === "pro" || plan === "seasonPass") return API_LIMITS_BY_PLAN.pro;
  return API_LIMITS_BY_PLAN.free;
}

/**
 * Rate limit an AI route. Limit scales by plan tier.
 * identifier should be userId or IP.
 *
 * Distributed limiters are cached by scope and threshold so each plan uses
 * the same limits in Redis and in the bounded single-instance fallback.
 */
export async function rateLimitAI(identifier: string, plan?: string | null): Promise<RateLimitResult> {
  const limit = resolveAiLimit(plan);
  const limiter = distributedLimiter("ai", limit);
  if (limiter) {
    try {
      const { success, remaining, reset } = await limiter.limit(identifier);
      return { allowed: success, remaining, reset };
    } catch (err) {
      console.error("[rate-limit] distributed AI limiter unavailable; using bounded fallback", {
        name: err instanceof Error ? err.name : "UnknownError",
      });
      return { allowed: fallbackRateLimit(`ai:${identifier}`, limit, 60_000) };
    }
  }
  return { allowed: fallbackRateLimit(`ai:${identifier}`, limit, 60_000) };
}

/**
 * Rate limit a general API route. Limit scales by plan tier.
 */
export async function rateLimitAPI(identifier: string, plan?: string | null): Promise<RateLimitResult> {
  const limit = resolveApiLimit(plan);
  const limiter = distributedLimiter("api", limit);
  if (limiter) {
    try {
      const { success, remaining, reset } = await limiter.limit(identifier);
      return { allowed: success, remaining, reset };
    } catch (err) {
      console.error("[rate-limit] distributed API limiter unavailable; using bounded fallback", {
        name: err instanceof Error ? err.name : "UnknownError",
      });
      return { allowed: fallbackRateLimit(`api:${identifier}`, limit, 60_000) };
    }
  }
  return { allowed: fallbackRateLimit(`api:${identifier}`, limit, 60_000) };
}

/** Extract the client IP from a request, preferring `x-forwarded-for`'s
 *  first hop. Falls back to a literal "unknown" so the rate-limit key is
 *  still well-formed (rate-limited rather than crashing). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Combine per-user and per-IP rate limits in a single call. AI routes
 *  should gate on BOTH so a single account can't be parallelized across
 *  many IPs, and a single IP can't farm many free accounts. */
export async function rateLimitUserAndIp(
  userId: string,
  req: Request,
  plan?: string | null,
): Promise<RateLimitResult> {
  const userResult = await rateLimitAI(userId, plan);
  if (!userResult.allowed) return userResult;
  const ip = getClientIp(req);
  // Per-IP cap is intentionally looser than per-user (lets a household
  // share an IP) but still bounded so abuse fails fast.
  if (ip === "unknown") return userResult;
  const ipLimiter = distributedLimiter("ip", 30);
  if (ipLimiter) {
    try {
      const { success, remaining, reset } = await ipLimiter.limit(ip);
      if (!success) return { allowed: false, remaining, reset };
    } catch (err) {
      console.error("[rate-limit] distributed IP limiter unavailable; using bounded fallback", {
        name: err instanceof Error ? err.name : "UnknownError",
      });
      if (!fallbackRateLimit(`ip:${ip}`, 30, 60_000)) {
        return { allowed: false };
      }
    }
  } else {
    if (!fallbackRateLimit(`ip:${ip}`, 30, 60_000)) {
      return { allowed: false };
    }
  }
  return userResult;
}
