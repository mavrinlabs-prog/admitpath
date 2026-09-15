import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { parseSessionCookieValue } from "@/lib/session-cookie";
import {
  profileActivitySchema,
  profileAwardSchema,
  profileCompletionPct,
  profileWriteSchema,
} from "@/lib/profile-contract";
import {
  mergeResumeActivities,
  mergeResumeAwards,
  uniqueActivities,
  uniqueAwards,
  uniqueStrings,
} from "@/lib/profile-normalize";

export const dynamic = "force-dynamic";

function profileError(
  status: number,
  requestId: string,
  code: string,
  message: string,
  options: { fieldErrors?: Record<string, string[]>; recoverable?: boolean; retryAfter?: string } = {},
) {
  return NextResponse.json(
    {
      error: message,
      code,
      message,
      fieldErrors: options.fieldErrors ?? {},
      requestId,
      recoverable: options.recoverable ?? status >= 500,
    },
    {
      status,
      headers: {
        "X-Request-Id": requestId,
        ...(options.retryAfter ? { "Retry-After": options.retryAfter } : {}),
      },
    },
  );
}

// Bounds on every string + array length here. The User-controlled fields
// land in Prisma `Json` columns and would otherwise let a single signup
// store unbounded payloads — real DoS surface against DB row size and
// downstream LLM prompt budgets.
export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    const authed = await requireUser();
    if ("response" in authed) return authed.response;
    const { userId } = authed;

    // Rate-limit profile writes to prevent free-form spam from a compromised
    // session. 60 req/min per user is generous for legitimate edits.
    // Profile writes must not bypass abuse controls when the limiter fails.
    let rl: { allowed: boolean };
    try {
      rl = await rateLimitAPI(`${userId}:${getClientIp(req)}`);
    } catch (rlErr) {
      console.error("[/api/profile] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
      return profileError(503, requestId, "RATE_LIMIT_UNAVAILABLE", "Request safety check is temporarily unavailable. Please try again shortly.", { retryAfter: "30" });
    }
    if (!rl.allowed) {
      return profileError(429, requestId, "RATE_LIMITED", "Too many requests. Try again in a minute.", { recoverable: true, retryAfter: "60" });
    }

    const parsedBody = await parseJsonBody(req, profileWriteSchema, { includeDetails: true });
    if ("response" in parsedBody) return parsedBody.response;
    const { mergeStrategy, ...profileInput } = parsedBody.data;

    let email = `${userId}@unknown.admitpath`;
    let name: string | undefined;
    try {
      const cookieStore = await cookies();
      const session = cookieStore.get("session_user") || cookieStore.get("session");
      if (session?.value) {
        const parsed = parseSessionCookieValue(session.value);
        if (parsed?.email) email = parsed.email;
        if (parsed?.name) name = parsed.name;
      }
    } catch { /* cookie read failed — use fallback identity */ }

    // Clean the data — remove undefined fields that could cause issues.
    // Also strip any fields that don't belong on the Profile model to
    // prevent "Unknown arg" Prisma errors (e.g. a client sending
    // `referred_by` or other User-level fields).
    // Declared outside inner try so the catch block can log the keys for debugging.
    const PROFILE_FIELDS = new Set([
      "gpa", "weightedGpa", "satScore", "actScore", "grade", "state",
      "activities", "awards", "courses", "intendedMajor", "targetColleges",
      "admissionsConcern", "householdIncome", "siblingsInCollege",
    ]);
    const cleanData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(profileInput)) {
      if (value !== undefined && PROFILE_FIELDS.has(key)) {
        cleanData[key] = value;
      }
    }
    if (Array.isArray(cleanData.activities)) cleanData.activities = uniqueActivities(cleanData.activities as Parameters<typeof uniqueActivities>[0]);
    if (Array.isArray(cleanData.awards)) cleanData.awards = uniqueAwards(cleanData.awards as Parameters<typeof uniqueAwards>[0]);
    if (Array.isArray(cleanData.courses)) cleanData.courses = uniqueStrings(cleanData.courses as string[]);
    if (Array.isArray(cleanData.targetColleges)) cleanData.targetColleges = uniqueStrings(cleanData.targetColleges as string[]);

    try {
      // Explicitly clear deletedAt on update so a soft-deleted profile is restored
      // rather than left tombstoned (which would make the next GET return {}).
      // withRetry handles Neon cold-start (ECONNREFUSED, P1001, etc.) with one
      // automatic retry after 500ms.
      const readBack = await withRetry(() => prisma.$transaction(async (tx) => {
        await tx.user.upsert({
          where: { id: userId },
          create: { id: userId, email, name, plan: "free" },
          update: {},
        });

        if (mergeStrategy === "RESUME_REPLACE_AUTO") {
          const existing = await tx.profile.findFirst({
            where: { userId, deletedAt: null },
          });
          if (existing) {
            if (Array.isArray(cleanData.activities)) {
              const previous = profileActivitySchema.array().safeParse(existing.activities);
              const incoming = profileActivitySchema.array().safeParse(cleanData.activities);
              if (incoming.success) {
                cleanData.activities = mergeResumeActivities(
                  previous.success ? previous.data : [],
                  incoming.data,
                );
              }
            }
            if (Array.isArray(cleanData.awards)) {
              const previous = profileAwardSchema.array().safeParse(existing.awards);
              const incoming = profileAwardSchema.array().safeParse(cleanData.awards);
              if (incoming.success) {
                cleanData.awards = mergeResumeAwards(
                  previous.success ? previous.data : [],
                  incoming.data,
                );
              }
            }
            if (Array.isArray(cleanData.courses)) {
              const previous = Array.isArray(existing.courses)
                ? existing.courses.filter((course): course is string => typeof course === "string")
                : [];
              cleanData.courses = uniqueStrings([...previous, ...(cleanData.courses as string[])]);
            }
          }
        }

        const profile = await tx.profile.upsert({
          where: { userId },
          create: { userId, ...cleanData },
          update: { ...cleanData, deletedAt: null },
        });
        const saved = await tx.profile.findFirst({
          where: { id: profile.id, userId, deletedAt: null },
        });
        if (!saved) throw new Error("Saved profile could not be read back.");
        await tx.user.update({
          where: { id: userId },
          data: { profileCompletePct: profileCompletionPct(saved as unknown as Record<string, unknown>) },
        });
        return saved;
      }));
      return NextResponse.json(
        { ...readBack, profile: readBack, persisted: true, requestId },
        { headers: { "X-Request-Id": requestId } },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      const code = (err as { code?: string })?.code;
      console.error("[/api/profile] profile.upsert failed after retry:", {
        message: msg,
        code,
        userId,
        cleanDataKeys: Object.keys(cleanData),
        timestamp: new Date().toISOString(),
      });
      let userMessage = "Please try again.";
      if (msg.includes("prisma") || msg.includes("database") || msg.includes("Unique constraint")) {
        userMessage = "Database error — your data is safe. Please try again.";
      }
      return NextResponse.json(
        { error: `Could not save your profile: ${userMessage}`, code: "PROFILE_SAVE_FAILED", message: userMessage, fieldErrors: {}, requestId, recoverable: true },
        { status: 500, headers: { "X-Request-Id": requestId } },
      );
    }
  } catch (outerErr) {
    // Top-level guard: any unhandled throw (requireUser crash, cookie parsing
    // edge case, unexpected null) surfaces as a structured JSON 503 instead
    // of Next.js's bare 503 with no body.
    console.error("[/api/profile] POST unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      stack: outerErr instanceof Error ? outerErr.stack : undefined,
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Profile service temporarily unavailable. Your data is safe — please try again in 30s.", code: "PROFILE_SERVICE_UNAVAILABLE", message: "Your data was not changed. Please retry.", fieldErrors: {}, requestId, recoverable: true },
      { status: 503, headers: { "Retry-After": "30", "X-Request-Id": requestId } },
    );
  }
}

export async function GET() {
  try {
    const authed = await requireUser();
    if ("response" in authed) return authed.response;
    const { userId } = authed;

    // Honor soft-delete: if a profile was tombstoned, return empty (not the deleted row).
    // withRetry handles Neon cold-start so the GET doesn't 503 on first load.
    try {
      const profile = await withRetry(() =>
        prisma.profile.findFirst({
          where: { userId, deletedAt: null },
        }),
      );
      return NextResponse.json(profile ?? {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[/api/profile] GET error:", msg, {
        userId,
        errorCode: (err as { code?: string })?.code,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: "Could not load profile. Please try again.", code: "PROFILE_READ_FAILED" },
        { status: 500 },
      );
    }
  } catch (outerErr) {
    // Top-level guard for GET — prevents bare 503 from unhandled throws.
    console.error("[/api/profile] GET unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Could not load profile. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "15" } },
    );
  }
}
