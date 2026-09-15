/**
 * Production monitoring: error-rate tracking, response-time tracking, and
 * auto-alerting when thresholds are breached.
 *
 * Runs entirely in-memory (per-instance). On serverless, each instance tracks
 * its own window -- good enough to catch systemic failures. For cross-instance
 * aggregation, pipe structured logs to a Log Drain.
 *
 * Pattern: sliding-window counters with configurable alert thresholds.
 */

import { sendAlert } from "./alert";
import { logError, logWarn } from "./log-error";

// ---------------------------------------------------------------------------
// Error-rate tracking per route
// ---------------------------------------------------------------------------

interface RouteStats {
  successes: number;
  failures: number;
  totalMs: number;
  /** Timestamps of recent failures (pruned to 10-min window) */
  failureTimestamps: number[];
  /** Last time we fired an alert for this route (prevent alert storms) */
  lastAlertAt: number;
}

const routeStats = new Map<string, RouteStats>();
// Cap the number of tracked routes to prevent unbounded Map growth
// at 1M-user scale. In practice, route count is bounded by the number
// of API routes (~50), but defensive cap prevents abuse via dynamic routes.
const MAX_TRACKED_ROUTES = 200;

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ERROR_RATE_THRESHOLD = 0.05; // 5%
const MIN_REQUESTS_FOR_ALERT = 20; // need enough data before alerting
const ALERT_COOLDOWN_MS = 30 * 60 * 1000; // 30 min between alerts per route

function getOrCreate(route: string): RouteStats {
  let stats = routeStats.get(route);
  if (!stats) {
    // Evict oldest route if we hit the cap
    if (routeStats.size >= MAX_TRACKED_ROUTES) {
      const firstKey = routeStats.keys().next().value;
      if (firstKey !== undefined) routeStats.delete(firstKey);
    }
    stats = {
      successes: 0,
      failures: 0,
      totalMs: 0,
      failureTimestamps: [],
      lastAlertAt: 0,
    };
    routeStats.set(route, stats);
  }
  return stats;
}

function pruneWindow(stats: RouteStats): void {
  const cutoff = Date.now() - WINDOW_MS;
  stats.failureTimestamps = stats.failureTimestamps.filter((t) => t > cutoff);
  // Hard cap: even within the window, bound the array to prevent memory
  // issues if a single route fails 100K times in 10 minutes (DDoS scenario).
  if (stats.failureTimestamps.length > 10_000) {
    stats.failureTimestamps = stats.failureTimestamps.slice(-10_000);
  }
}

/**
 * Record a successful request. Call at the end of each API route handler.
 */
export function recordSuccess(route: string, durationMs: number): void {
  const stats = getOrCreate(route);
  stats.successes++;
  stats.totalMs += durationMs;
}

/**
 * Record a failed request. Auto-alerts when the error rate exceeds 5%
 * over the last 10 minutes (with at least 20 requests in the window).
 */
export function recordFailure(route: string, durationMs: number, error?: string): void {
  const now = Date.now();
  const stats = getOrCreate(route);
  stats.failures++;
  stats.totalMs += durationMs;
  stats.failureTimestamps.push(now);

  pruneWindow(stats);

  const total = stats.successes + stats.failures;
  if (total < MIN_REQUESTS_FOR_ALERT) return;

  const recentFailures = stats.failureTimestamps.length;
  const errorRate = recentFailures / total;

  if (errorRate > ERROR_RATE_THRESHOLD && now - stats.lastAlertAt > ALERT_COOLDOWN_MS) {
    stats.lastAlertAt = now;
    void sendAlert({
      severity: "critical",
      scope: `monitoring.error-rate.${route}`,
      message: `Error rate ${(errorRate * 100).toFixed(1)}% exceeds 5% threshold on ${route}`,
      context: {
        route,
        errorRate: Number(errorRate.toFixed(3)),
        recentFailures,
        totalRequests: total,
        windowMinutes: WINDOW_MS / 60_000,
        lastError: error ?? null,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// LLM failure tracking
// ---------------------------------------------------------------------------

interface LLMStats {
  cerebrasSuccesses: number;
  cerebrasFailures: number;
  groqSuccesses: number;
  groqFailures: number;
  totalLatencyMs: number;
  lastAlertAt: number;
}

const llmStats: LLMStats = {
  cerebrasSuccesses: 0,
  cerebrasFailures: 0,
  groqSuccesses: 0,
  groqFailures: 0,
  totalLatencyMs: 0,
  lastAlertAt: 0,
};

export function recordLLMSuccess(provider: "cerebras" | "groq", durationMs: number): void {
  if (provider === "cerebras") llmStats.cerebrasSuccesses++;
  else llmStats.groqSuccesses++;
  llmStats.totalLatencyMs += durationMs;
}

export function recordLLMFailure(provider: "cerebras" | "groq", durationMs: number, error?: string): void {
  if (provider === "cerebras") llmStats.cerebrasFailures++;
  else llmStats.groqFailures++;
  llmStats.totalLatencyMs += durationMs;

  const now = Date.now();
  const totalLLM =
    llmStats.cerebrasSuccesses +
    llmStats.cerebrasFailures +
    llmStats.groqSuccesses +
    llmStats.groqFailures;

  const totalFailures = llmStats.cerebrasFailures + llmStats.groqFailures;

  if (
    totalLLM >= 10 &&
    totalFailures / totalLLM > 0.15 &&
    now - llmStats.lastAlertAt > ALERT_COOLDOWN_MS
  ) {
    llmStats.lastAlertAt = now;
    const failRate = (totalFailures / totalLLM * 100).toFixed(1);
    void sendAlert({
      severity: "critical",
      scope: "monitoring.llm-failure-rate",
      message: `LLM failure rate ${failRate}% exceeds 15% threshold`,
      context: {
        cerebrasOk: llmStats.cerebrasSuccesses,
        cerebrasFail: llmStats.cerebrasFailures,
        groqOk: llmStats.groqSuccesses,
        groqFail: llmStats.groqFailures,
        lastError: error ?? null,
      },
    });
  }
}

export function getLLMStats(): LLMStats {
  return { ...llmStats };
}

// ---------------------------------------------------------------------------
// Response time tracking (per route, rolling average)
// ---------------------------------------------------------------------------

const responseTimeHistory = new Map<string, number[]>();
const MAX_HISTORY = 100;
const MAX_RESPONSE_TIME_ROUTES = 200;

export function recordResponseTime(route: string, ms: number): void {
  let history = responseTimeHistory.get(route);
  if (!history) {
    // Evict oldest route if we hit the cap
    if (responseTimeHistory.size >= MAX_RESPONSE_TIME_ROUTES) {
      const firstKey = responseTimeHistory.keys().next().value;
      if (firstKey !== undefined) responseTimeHistory.delete(firstKey);
    }
    history = [];
    responseTimeHistory.set(route, history);
  }
  history.push(ms);
  if (history.length > MAX_HISTORY) history.shift();
}

export function getAverageResponseTime(route: string): number | null {
  const history = responseTimeHistory.get(route);
  if (!history || history.length === 0) return null;
  return history.reduce((a, b) => a + b, 0) / history.length;
}

export function getP95ResponseTime(route: string): number | null {
  const history = responseTimeHistory.get(route);
  if (!history || history.length === 0) return null;
  const sorted = [...history].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)] ?? null;
}

// ---------------------------------------------------------------------------
// Snapshot for health endpoint
// ---------------------------------------------------------------------------

export function getMonitoringSnapshot(): {
  routes: Record<string, { successes: number; failures: number; avgMs: number | null; p95Ms: number | null }>;
  llm: LLMStats;
} {
  const routes: Record<string, { successes: number; failures: number; avgMs: number | null; p95Ms: number | null }> = {};
  for (const [route, stats] of Array.from(routeStats)) {
    routes[route] = {
      successes: stats.successes,
      failures: stats.failures,
      avgMs: getAverageResponseTime(route),
      p95Ms: getP95ResponseTime(route),
    };
  }
  return { routes, llm: getLLMStats() };
}

// ---------------------------------------------------------------------------
// Graceful shutdown / timeout guard for async work
// ---------------------------------------------------------------------------

const pendingWork = new Set<Promise<unknown>>();

/**
 * Wrap an async operation with a timeout guard. If the operation takes longer
 * than `timeoutMs`, it logs a warning and returns the fallback value. The
 * underlying promise is NOT cancelled (no AbortController) -- this just
 * prevents the serverless function from timing out without a response.
 *
 * Use in webhook handlers and cron jobs:
 *   const result = await withTimeout(doHeavyWork(), 25_000, null);
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback: T,
  label = "unnamed",
): Promise<T> {
  pendingWork.add(promise);
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) =>
        setTimeout(() => {
          logWarn("timeout-guard", `${label} timed out after ${timeoutMs}ms, returning fallback`, {
            timeoutMs,
            label,
          });
          resolve(fallback);
        }, timeoutMs),
      ),
    ]);
  } finally {
    pendingWork.delete(promise);
  }
}

/**
 * Returns the count of in-flight timeout-guarded operations. Useful for
 * health checks to report whether the instance is busy.
 */
export function getPendingWorkCount(): number {
  return pendingWork.size;
}
