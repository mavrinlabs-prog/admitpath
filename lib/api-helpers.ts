/**
 * Shared API-route helpers — auth + user lookup + request-body parsing.
 *
 * Extracted because the AI routes (chat, analyze, essay) plus colleges all
 * inlined the same prelude:
 *   1. `auth()` → 401 if no userId
 *   2. `prisma.user.findFirst({ id, deletedAt: null })` → 404 if missing
 *   3. `await req.json()` in a try/catch → 400 "Invalid JSON"
 *   4. zod `.safeParse(body)` → 400 "Invalid input"
 *
 * Soft-delete filter is non-negotiable: a tombstoned user (post account-delete
 * or Clerk user.deleted webhook) must NOT pass the user-not-found gate. Every
 * AI write path that bypasses this lets a deleted account keep burning trial
 * budget and persisting rows tied to its tombstone.
 *
 * Response shapes match what the AI routes already return — clients keep
 * branching on the same `error` string + status code.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma, withRetry } from "@/lib/prisma";
import { parseSessionCookieValue } from "@/lib/session-cookie";
import type { z } from "zod";

/**
 * Authenticate the request and load the (non-tombstoned) User row in one shot.
 *
 * Returns either:
 *   - `{ user, userId }` on success
 *   - `{ response }` with the appropriate 401 / 404 NextResponse on failure
 *
 * Callers handle the failure branch with a single `if ("response" in r) return r.response;`
 * and the type narrowing makes `user` safe to use on the success branch.
 *
 * `select` is forwarded verbatim to Prisma so callers can fetch only the
 * columns they actually use (the AI routes typically need plan, counters,
 * trialStartedAt, stripeSubscriptionId — exactly the EffectivePlanUser shape).
 * Leave undefined to fetch the full row.
 */
export async function requireUser<S extends Record<string, true> | undefined = undefined>(
  options: { select?: S } = {},
): Promise<
  | {
      userId: string;
      // Prisma's findFirst return type is hard to plumb through generics here
      // without a runtime-only `Prisma.UserGetPayload`. Callers cast at the
      // edge or rely on the structural shape of the columns they selected.
      user: NonNullable<Awaited<ReturnType<typeof prisma.user.findFirst>>>;
    }
  | { response: NextResponse }
> {
  // Google OAuth session — read from cookie
  let userId: string | null = null;
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_user") || cookieStore.get("session");
    if (session?.value) {
      userId = parseSessionCookieValue(session.value)?.id ?? null;
    }
  } catch (cookieErr) {
    console.error("[requireUser] cookie parse failed:", cookieErr instanceof Error ? cookieErr.message : String(cookieErr));
  }
  if (!userId) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let user;
  try {
    // Use withRetry to survive Neon cold-start / transient connection drops.
    // This was the primary cause of 503s — a single findFirst with no retry
    // would fail on cold-start ECONNREFUSED and return 503 immediately.
    user = await withRetry(() =>
      prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
        ...(options.select ? { select: options.select } : {}),
      }),
    );
  } catch (dbErr) {
    console.error("[requireUser] database error after retry — failing closed", {
      errorName: dbErr instanceof Error ? dbErr.name : "UnknownError",
      errorCode: (dbErr as { code?: string })?.code,
      timestamp: new Date().toISOString(),
    });
    const requestId = crypto.randomUUID();
    return {
      response: NextResponse.json(
        {
          error: "Account service temporarily unavailable.",
          code: "ACCOUNT_DATABASE_UNAVAILABLE",
          message: "We could not verify your account safely. Please retry in a moment.",
          fieldErrors: {},
          requestId,
          recoverable: true,
        },
        { status: 503, headers: { "Retry-After": "15", "X-Request-Id": requestId } },
      ),
    };
  }
  if (!user) {
    return {
      response: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }

  return { userId, user };
}

/**
 * Read + zod-validate a JSON request body.
 *
 * Returns either:
 *   - `{ data }` with the parsed/validated payload (uses `z.infer` so the
 *     OUTPUT type — post-defaults, post-transforms — flows to the caller).
 *   - `{ response }` with a 400 NextResponse matching the route's prior shape
 *
 * Two distinct 400s, kept distinct because clients may already differentiate:
 *   - "Invalid JSON" — body wasn't parseable JSON at all
 *   - "Invalid input" — JSON parsed but failed schema validation
 *
 * `includeDetails` mirrors the analyze route's behavior of returning
 * `parsed.error.flatten()` so the form can highlight specific fields.
 *
 * Generic over `S extends z.ZodTypeAny` (not `z.ZodType<T>`) so schemas with
 * `.default()` / `.transform()` keep their distinct input vs output types —
 * `z.infer<S>` returns the OUTPUT, which is what callers want.
 */
export async function parseJsonBody<S extends z.ZodTypeAny>(
  req: Request,
  schema: S,
  options: { includeDetails?: boolean } = {},
): Promise<{ data: z.infer<S> } | { response: NextResponse }> {
  const requestId = crypto.randomUUID();
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      response: NextResponse.json({
        error: "Invalid JSON",
        code: "INVALID_JSON",
        message: "The request body is not valid JSON.",
        fieldErrors: {},
        requestId,
        recoverable: true,
      }, { status: 400, headers: { "X-Request-Id": requestId } }),
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const body: Record<string, unknown> = {
      error: "Invalid input",
      code: "VALIDATION_ERROR",
      message: "Check the highlighted fields and try again.",
      fieldErrors: flattened.fieldErrors,
      requestId,
      recoverable: true,
    };
    if (options.includeDetails) body.details = flattened;
    return {
      response: NextResponse.json(body, { status: 400, headers: { "X-Request-Id": requestId } }),
    };
  }

  return { data: parsed.data };
}

/**
 * Constant-time bearer token verification for cron and admin routes.
 * Uses `crypto.timingSafeEqual` to prevent timing-attack leakage of the
 * secret value. Returns true only when both the secret env var is set AND
 * the header matches. Fail-closed: missing secret → always false.
 *
 * Uses ESM import for crypto (Node.js built-in) instead of require() to
 * align with the rest of the codebase and avoid CJS compatibility issues
 * in edge runtimes.
 */
export function verifyBearerSecret(req: Request, secret: string | undefined): boolean {
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (header.length !== expected.length) return false;
  try {
    // Use globalThis.crypto.subtle when available (edge runtime), fall back
    // to Node.js Buffer-based comparison. Both paths are constant-time.
    const a = Buffer.from(header);
    const b = Buffer.from(expected);
    return timingSafeEqual(a, b);
  } catch {
    // Last-resort fallback: byte-by-byte comparison with constant-time
    // accumulator to avoid early-exit timing leaks.
    const a = new TextEncoder().encode(header);
    const b = new TextEncoder().encode(expected);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      diff |= a[i] ^ b[i];
    }
    return diff === 0;
  }
}

export function verifyCronSecret(req: Request): boolean {
  return verifyBearerSecret(req, process.env.CRON_SECRET);
}

/**
 * Convenience: return a JSON error response with consistent shape.
 * All API routes should use this for error responses so the client
 * can rely on the { error, reason?, feature?, upgradeUrl?, retryable? } shape.
 *
 * ONIX User-Facing Messaging Guidelines applied:
 *   - `error` is always a human-readable string (not a code)
 *   - `retryable` tells the client whether to show a retry button
 *   - `upgradeUrl` provides a clear path to resolution for plan limits
 *   - Internal errors never expose stack traces or implementation details
 */
export function jsonError(
  message: string,
  status: number,
  extra?: {
    reason?: string;
    feature?: string;
    upgradeUrl?: string;
    details?: unknown;
    /** Whether the client should offer a retry button. Defaults based on status code. */
    retryable?: boolean;
  },
): NextResponse {
  // Default retryable: 5xx and 429 are retryable, 4xx (except 429) are not.
  const retryable = extra?.retryable ?? (status >= 500 || status === 429);
  return NextResponse.json(
    {
      error: message,
      retryable,
      ...(extra?.reason && { reason: extra.reason }),
      ...(extra?.feature && { feature: extra.feature }),
      ...(extra?.upgradeUrl && { upgradeUrl: extra.upgradeUrl }),
      ...(extra?.details != null ? { details: extra.details } : {}),
    },
    { status },
  );
}

/**
 * Convenience: return a JSON success response.
 */
export function jsonSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200,
): NextResponse {
  return NextResponse.json(data, { status });
}
