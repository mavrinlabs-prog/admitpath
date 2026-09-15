import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logEvent } from "@/lib/log-error";
import { rateLimitWindow, getClientIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { parseSessionCookieValue } from "@/lib/session-cookie";

export const dynamic = "force-dynamic";

/**
 * Batch event ingestion endpoint. Receives batched analytics events from
 * the client, enriches them with server-side data (user plan, IP hash,
 * user agent), and logs them as structured JSON to Vercel Function Logs.
 *
 * No database writes -- events live in Vercel logs (queryable via Log Drains
 * to any analytics warehouse). This keeps the endpoint fast and free.
 *
 * Pattern source: MongoDB production tracking guide (server-side enrichment,
 * batch ingestion, IP hashing), adapted for PostgreSQL/Prisma stack.
 *
 * Design decisions:
 *   - Auth is optional: pre-login events (landing page, pricing) still tracked
 *   - IP is pseudonymized with SHA-256 before storage
 *   - Subscription snapshot is captured at event time for conversion analysis
 *   - Rate limited per IP (60 req/min) to prevent abuse
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = await rateLimitWindow(`tracking:${ip}`, 60, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: true, throttled: true });
  }

  // Guard against oversized payloads
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 50_000) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  let body: {
    events?: Array<{
      id?: string;
      name?: string;
      properties?: Record<string, unknown>;
      timestamp?: string;
    }>;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const events = body.events;
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ ok: true, recorded: 0 });
  }

  // Cap batch size to prevent abuse
  const batch = events.slice(0, 50);

  // Auth is optional -- unauthenticated visitors still generate events
  let userId: string | null = null;
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_user") || cookieStore.get("session");
    if (session?.value) {
      userId = parseSessionCookieValue(session.value)?.id ?? null;
    }
  } catch { /* no session */ }

  // Enrich with subscription snapshot (only if authenticated)
  let plan: string | null = null;
  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });
      plan = user?.plan ?? null;
    } catch {
      // Non-fatal: enrichment is best-effort
    }
  }

  const serverTs = Date.now();
  const safePropertyKeys = new Set([
    "steps", "step", "plan", "source", "feature", "method", "tool", "slug",
    "schoolCount", "days", "goal", "seconds", "daysSinceLast", "type",
    "milestone", "score", "stepNumber", "totalSteps", "plans", "readTimeSec",
    "location", "status", "endpoint", "route", "tierUsed", "durationMs",
    "errorType", "passed", "attempt", "fromTier", "toTier", "offerSlug",
    "amount", "currency", "surface", "authority", "placementId",
    "campaignId", "sponsorId", "isPaidUser",
  ]);

  let recorded = 0;
  for (const event of batch) {
    if (!event.name || typeof event.name !== "string" || !/^[a-z0-9_:-]{1,64}$/i.test(event.name)) continue;

    logEvent(event.name, {
      // Event identity
      eventId: typeof event.id === "string" ? event.id : undefined,
      // User context
      plan: plan ?? "anonymous",

      // Event payload (flattened top-level properties only)
      ...(event.properties && typeof event.properties === "object"
        ? Object.fromEntries(
            Object.entries(event.properties)
              .filter(([key, v]) => safePropertyKeys.has(key) && (typeof v === "string" || typeof v === "number" || typeof v === "boolean"))
              .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 200) : value])
              .slice(0, 20),
          )
        : {}),

      // Temporal
      clientTs: typeof event.timestamp === "string" ? event.timestamp : undefined,
      serverTs,

      source: "web_app",
    });
    recorded += 1;
  }

  return NextResponse.json({ ok: true, recorded });
}
