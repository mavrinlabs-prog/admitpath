import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/lib/log-error";
import { rateLimitWindow, getClientIp } from "@/lib/rate-limit";
import { recordFailure } from "@/lib/monitoring";

export const dynamic = "force-dynamic";

/**
 * Receives client-side errors from app/error.tsx and pipes them through
 * the structured logger so they show up in Vercel Function Logs alongside
 * server errors. Rate-limited per IP -- a misbehaving client could
 * otherwise drown the log stream.
 *
 * Intentionally cheap: no auth (errors happen pre-login too), no DB write.
 *
 * Pattern source: MongoDB production tracking guide (error tracking concept),
 * adapted for AdmitPath's Vercel + Prisma stack.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = await rateLimitWindow(`client-error:${ip}`, 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: true, throttled: true });
  }

  // Guard against oversized payloads: Content-Length > 10 KB is likely abuse.
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 10_240) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  let body: {
    message?: unknown;
    stack?: unknown;
    digest?: unknown;
    url?: unknown;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const message = typeof body.message === "string"
    ? body.message.replace(/[\r\n\t\0]/g, " ").slice(0, 500)
    : "client error";
  const err = new Error(message);
  if (typeof body.stack === "string") {
    err.stack = body.stack.replace(/[\0]/g, "").slice(0, 4_000);
  }

  // Extract the route from the URL for monitoring
  let clientRoute = "unknown";
  if (typeof body.url === "string") {
    try {
      clientRoute = new URL(body.url, "https://admith.vercel.app").pathname.slice(0, 300);
    } catch {
      clientRoute = "unknown";
    }
  }

  logError("client", err, {
    digest: typeof body.digest === "string" ? body.digest : undefined,
    route: clientRoute,
  });

  // Track client errors in the monitoring system so error-rate alerts
  // fire when a page is consistently crashing for users.
  recordFailure(`client:${clientRoute}`, 0, "client render error");

  return NextResponse.json({ ok: true });
}
