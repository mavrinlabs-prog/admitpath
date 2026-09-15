import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGroqKeyHealth } from "@/lib/groq";
import { sendAlert } from "@/lib/alert";
import { getMonitoringSnapshot, getPendingWorkCount } from "@/lib/monitoring";
import { verifyBearerSecret } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

interface CheckResult {
  status: "ok" | "degraded" | "missing";
  responseMs: number;
  detail?: string;
}

async function timedCheck(
  name: string,
  fn: () => Promise<CheckResult>,
): Promise<[string, CheckResult]> {
  const start = Date.now();
  try {
    const result = await fn();
    result.responseMs = Date.now() - start;
    return [name, result];
  } catch (error) {
    return [
      name,
      {
        status: "degraded",
        responseMs: Date.now() - start,
        detail: error instanceof Error ? error.message : String(error),
      },
    ];
  }
}

export async function GET(request: Request) {
  const healthSecret = process.env.HEALTHCHECK_SECRET ?? process.env.CRON_SECRET;
  if (!verifyBearerSecret(request, healthSecret)) {
    return NextResponse.json(
      { status: "ok", timestamp: new Date().toISOString() },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  const uptime = typeof process.uptime === "function" ? Math.floor(process.uptime()) : 0;

  const checkResults = await Promise.all([
    // --- Database connectivity ---
    timedCheck("db", async () => {
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ok", responseMs: 0 };
    }),

    // --- LLM availability (Cerebras + Groq key pool) ---
    timedCheck("llm", async () => {
      const cerebrasSet = !!process.env.CEREBRAS_API_KEY;
      const groqHealth = getGroqKeyHealth();
      if (!cerebrasSet && groqHealth.total === 0) {
        return {
          status: "missing" as const,
          responseMs: 0,
          detail: "No LLM keys configured (Cerebras + Groq both missing)",
        };
      }
      const healthyRatio = groqHealth.total > 0 ? groqHealth.healthy / groqHealth.total : 1;
      return {
        status: (cerebrasSet || healthyRatio > 0.5 ? "ok" : "degraded") as "ok" | "degraded",
        responseMs: 0,
        detail: `cerebras=${cerebrasSet ? "yes" : "no"}, groq=${groqHealth.healthy}/${groqHealth.total} healthy`,
      };
    }),

    // --- Email service (Resend) ---
    timedCheck("email", async () => {
      const set = !!process.env.RESEND_API_KEY;
      return {
        status: set ? ("ok" as const) : ("missing" as const),
        responseMs: 0,
        detail: set ? "Resend configured" : "RESEND_API_KEY not set",
      };
    }),

    // --- Auth service (Google OAuth) ---
    timedCheck("auth", async () => {
      const set = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
      return {
        status: set ? ("ok" as const) : ("missing" as const),
        responseMs: 0,
        detail: set ? "Google OAuth configured" : "GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set",
      };
    }),

    // --- Stripe ---
    timedCheck("stripe", async () => {
      const set = !!process.env.STRIPE_SECRET_KEY;
      return {
        status: set ? ("ok" as const) : ("missing" as const),
        responseMs: 0,
        detail: set ? "Stripe configured" : "STRIPE_SECRET_KEY not set",
      };
    }),

    // --- Rate limiter (Upstash Redis or in-memory) ---
    timedCheck("rateLimit", async () => {
      const upstashConfigured = !!(
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      );
      return {
        status: "ok" as const,
        responseMs: 0,
        detail: upstashConfigured
          ? "redis (distributed)"
          : "in-memory (single instance only)",
      };
    }),

    // --- Memory usage ---
    timedCheck("memory", async () => {
      if (typeof process.memoryUsage !== "function") {
        return { status: "ok" as const, responseMs: 0, detail: "not available" };
      }
      const mem = process.memoryUsage();
      const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
      const rssMB = Math.round(mem.rss / 1024 / 1024);
      const heapPct = heapTotalMB > 0 ? heapUsedMB / heapTotalMB : 0;
      return {
        status: heapPct > 0.9 ? ("degraded" as const) : ("ok" as const),
        responseMs: 0,
        detail: `heap=${heapUsedMB}/${heapTotalMB}MB, rss=${rssMB}MB`,
      };
    }),
  ]);

  // Build checks object
  const checks: Record<string, CheckResult> = {};
  for (const [name, result] of checkResults) {
    checks[name] = result;
  }

  // Determine overall status
  const hasMissing = checkResults.some(([, r]) => r.status === "missing");
  const hasDegraded = checkResults.some(([, r]) => r.status === "degraded");
  const overallStatus: "healthy" | "degraded" | "unhealthy" = hasMissing
    ? "unhealthy"
    : hasDegraded
      ? "degraded"
      : "healthy";

  // Fire alerts for critical failures
  if (checks.db?.status !== "ok") {
    void sendAlert({
      severity: "critical",
      scope: "health.db-down",
      message: "Health probe: database check failed",
      context: { detail: checks.db?.detail ?? null },
    });
  }
  if (checks.llm?.status === "missing") {
    void sendAlert({
      severity: "critical",
      scope: "health.llm-down",
      message: "Health probe: no LLM keys configured",
      context: { detail: checks.llm?.detail ?? null },
    });
  }

  // Recent analysis adoption (enrichment, non-load-bearing). A user with no
  // analyses has not necessarily experienced a failure, so keep this metric
  // explicitly about product adoption rather than reliability.
  let recentUserAnalysisAdoptionRatio = 0;
  try {
    const recentUsers = await prisma.user.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: { analysisCount: true },
    });
    const withAnalysis = recentUsers.filter((u) => u.analysisCount > 0).length;
    if (recentUsers.length > 0) {
      recentUserAnalysisAdoptionRatio = Number(
        (withAnalysis / recentUsers.length).toFixed(3),
      );
    }
  } catch {
    // Enrichment is non-load-bearing -- swallow errors
  }

  const monitoring = getMonitoringSnapshot();
  // Always return 200 for liveness probes. Status field indicates actual health.
  const code = 200;
  const cacheHeader =
    overallStatus === "healthy"
      ? "public, s-maxage=10, stale-while-revalidate=30"
      : "no-store";

  return NextResponse.json(
    {
      status: overallStatus,
      checks,
      version,
      uptime,
      pendingWork: getPendingWorkCount(),
      recentUserAnalysisAdoptionRatio,
      monitoring: {
        llm: monitoring.llm,
        routeCount: Object.keys(monitoring.routes).length,
      },
      timestamp: new Date().toISOString(),
    },
    { status: code, headers: { "Cache-Control": cacheHeader } },
  );
}
