/**
 * AI essay topic generator.
 *
 * POST /api/essay/topics
 * Body: {} — auth gate identifies the user; profile loaded from Prisma.
 *
 * Pipeline:
 *   1. Auth gate (any plan — Free tier costs 1 of their 5 essay credits)
 *   2. Rate limit (per-user + IP, same as /api/essay)
 *   3. Feature access — counts as an essay credit
 *   4. Pull Profile from Prisma; require activities OR awards OR courses
 *   5. LLM via three-tier router (Pro tier hits Anthropic Claude Sonnet)
 *
 * Returns JSON:
 *   { topics: [{ prompt: 1-7, title, anchor, angle, avoid }], tierUsed: 1|2|3 }
 *
 * Why a separate route instead of folding into /api/essay: this is a
 * pre-draft tool (the student has nothing to score yet). The existing
 * /api/essay route requires `content` to score — different shape, different
 * UI, different mental model.
 */

import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { checkFeatureAccess, accessDenialResponse } from "@/lib/trial";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { requireUser } from "@/lib/api-helpers";
import { routeLlmCall } from "@/lib/llm-router";
import { effectivePlan } from "@/lib/utils";
import {
  FreePlanLimitReachedError,
  freeUsageLimitBody,
  releaseFreeUsage,
  reserveFreeUsage,
} from "@/lib/free-usage";
import { repairAndParse, JsonParseError } from "@/lib/json-repair";
import { validateAIOutput, buildResponseMeta, buildNextSteps } from "@/lib/api-quality";
import {
  ESSAY_TOPICS_SYSTEM,
  buildEssayTopicsPrompt,
  type EssayTopicProfile,
} from "@/lib/prompts/essay-topics";

type ProfileActivity = { name?: string; role?: string; impact?: string; yearsInvolved?: number };
type ProfileAward = { name?: string; level?: string; year?: number };

// Profile.activities/awards/courses are Json — coerce defensively. Missing
// fields default to undefined so the prompt builder skips them rather than
// emitting "Activity: undefined" lines that would confuse the model.
function coerceActivities(raw: unknown): EssayTopicProfile["activities"] {
  if (!Array.isArray(raw)) return undefined;
  return raw
    .filter((x): x is ProfileActivity => typeof x === "object" && x !== null)
    .map((a) => ({
      name: typeof a.name === "string" ? a.name : "Untitled activity",
      role: typeof a.role === "string" ? a.role : null,
      impact: typeof a.impact === "string" ? a.impact : null,
      yearsInvolved: typeof a.yearsInvolved === "number" ? a.yearsInvolved : null,
    }))
    .filter((a) => a.name && a.name !== "Untitled activity");
}

function coerceAwards(raw: unknown): EssayTopicProfile["awards"] {
  if (!Array.isArray(raw)) return undefined;
  // Awards from the manual form are plain strings; resume-import stores
  // { name, level, year } objects. The original `typeof x === "object"`
  // filter silently dropped every string award — topic suggestions were
  // missing them entirely.
  return raw
    .map((x) => {
      if (typeof x === "string" && x.trim()) return { name: x.trim(), level: null, year: null };
      if (typeof x === "object" && x !== null) {
        const a = x as ProfileAward;
        return {
          name: typeof a.name === "string" ? a.name : "",
          level: typeof a.level === "string" ? a.level : null,
          year: typeof a.year === "number" ? a.year : null,
        };
      }
      return null;
    })
    .filter((a): a is NonNullable<typeof a> => a !== null && !!a.name);
}

function coerceCourses(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const courses = raw.filter((c): c is string => typeof c === "string" && c.length > 0);
  return courses.length ? courses : undefined;
}

export async function POST(req: Request) {
 let freeUsageReserved = false;
 let reservedUserId: string | null = null;
 try {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  // Cost-bearing AI routes must not bypass abuse controls when the limiter fails.
  let rl: { allowed: boolean };
  try {
    rl = await rateLimitUserAndIp(userId, req, user.plan);
  } catch (rlErr) {
    console.error("[/api/essay/topics] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
    return NextResponse.json(
      { error: "Request safety check is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Topic generation is an LLM call — book it against the same essay credit
  // pool as scoring (3 free runs, unlimited on Plus/Pro).
  const access = checkFeatureAccess(user, "essays");
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  let profile;
  try {
    profile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { userId },
        select: {
          grade: true,
          state: true,
          intendedMajor: true,
          activities: true,
          awards: true,
          courses: true,
        },
      }),
    );
  } catch (dbErr) {
    console.error("[/api/essay/topics] profile fetch failed:", {
      error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      hasDbUrl: !!process.env.DATABASE_URL,
      userId,
    });
    return NextResponse.json(
      { error: "Could not load your profile. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "10" } },
    );
  }

  if (!profile) {
    return NextResponse.json(
      {
        error:
          "We need your profile to suggest topics tailored to you. Finish your profile first at /profile/create.",
        nextStep: "/profile/create",
      },
      { status: 422 }
    );
  }

  const activities = coerceActivities(profile.activities);
  const awards = coerceAwards(profile.awards);
  const courses = coerceCourses(profile.courses);

  // The model needs SOMETHING concrete to anchor topics on. Without any
  // activities, awards, or courses, the output collapses into the same
  // generic suggestions we explicitly told it not to produce — better to
  // bounce the user back to the profile builder.
  if (!activities?.length && !awards?.length && !courses?.length) {
    return NextResponse.json(
      {
        error:
          "Add at least one activity, award, or course to your profile so we can suggest topics anchored in your actual life.",
        nextStep: "/profile/create",
      },
      { status: 422 }
    );
  }

  const promptProfile: EssayTopicProfile = {
    grade: profile.grade ? String(profile.grade) : null,
    state: profile.state ?? null,
    intendedMajor: profile.intendedMajor ?? null,
    activities,
    awards,
    courses,
  };

  const userPlan = effectivePlan(user);
  const messages = [
    { role: "system" as const, content: ESSAY_TOPICS_SYSTEM },
    { role: "user" as const, content: buildEssayTopicsPrompt(promptProfile) },
  ];

  if (access.reason === "free") {
    try {
      await reserveFreeUsage(userId, "essays");
      freeUsageReserved = true;
      reservedUserId = userId;
    } catch (error) {
      if (error instanceof FreePlanLimitReachedError) {
        return NextResponse.json(freeUsageLimitBody("essays"), { status: 429 });
      }
      console.error("[/api/essay/topics] usage reservation failed:", error);
      return NextResponse.json(
        { error: "Could not reserve a free essay credit. Please try again.", retryable: true },
        { status: 503, headers: { "Retry-After": "10" } },
      );
    }
  }

  try {
    const { text, tierUsed } = await routeLlmCall(messages, {
      minTier: userPlan === "pro" ? 3 : 2,
      plan: userPlan,
    });
    let parsed: Record<string, unknown>;
    try {
      parsed = repairAndParse<Record<string, unknown>>(text);
    } catch (parseErr) {
      throw new JsonParseError(
        parseErr instanceof Error ? parseErr.message : "Failed to parse essay-topics LLM JSON",
        text,
      );
    }
    // Validate topics quality — ensure we got real topics, not generic filler
    const quality = validateAIOutput(parsed, {
      requiredArrays: ["topics"],
    });
    // Verify each topic has an anchor (should be specific to this student)
    const topics = (parsed.topics ?? []) as Array<Record<string, unknown>>;
    if (topics.length > 0 && topics.every((t) => !t.anchor || String(t.anchor).length < 10)) {
      quality.issues.push("Topics lack profile-specific anchors. Output may be too generic.");
      quality.score = Math.max(0, quality.score - 15);
      quality.passed = quality.score >= 60;
    }

    const nextSteps = buildNextSteps("essay-topics");
    const meta = buildResponseMeta({
      tierUsed,
      dataSources: ["student profile"],
      confidenceLevel: (activities?.length ?? 0) >= 2 ? "high" : "medium",
      qualityScore: quality.score,
    });
    return NextResponse.json({
      ...parsed,
      tierUsed,
      nextSteps,
      _meta: meta,
      _quality: quality.passed ? undefined : { issues: quality.issues },
    });
  } catch (err) {
    if (freeUsageReserved && reservedUserId) {
      freeUsageReserved = false;
      try {
        await releaseFreeUsage(reservedUserId, "essays");
      } catch (releaseError) {
        console.error("[/api/essay/topics] usage release failed:", releaseError);
      }
    }
    console.error("[/api/essay/topics]", {
      event: "ai_failed",
      fatal: false,
      error: String(err),
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
    });
    if (err instanceof JsonParseError) {
      return NextResponse.json(
        { error: "AI returned an unparseable response. Please retry." },
        { status: 502 }
      );
    }
    const errMsg = err instanceof Error ? err.message.toLowerCase() : "";
    if (errMsg.includes("all llm") || errMsg.includes("exhausted") || errMsg.includes("429")) {
      return NextResponse.json(
        { error: "Our AI is temporarily busy due to high demand. Please try again in 30 seconds.", retryable: true },
        { status: 429, headers: { "Retry-After": "30" } },
      );
    }
    if (errMsg.includes("timeout") || errMsg.includes("timed out")) {
      return NextResponse.json(
        { error: "Topic generation timed out. Please try again in a moment.", retryable: true },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
 } catch (outerErr) {
    if (freeUsageReserved && reservedUserId) {
      freeUsageReserved = false;
      try {
        await releaseFreeUsage(reservedUserId, "essays");
      } catch (releaseError) {
        console.error("[/api/essay/topics] usage release failed after unhandled error:", releaseError);
      }
    }
    // Top-level guard: any unhandled throw surfaces as structured JSON 503.
    console.error("[/api/essay/topics] POST unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      stack: outerErr instanceof Error ? outerErr.stack : undefined,
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Topic generation service temporarily unavailable. Please try again in 30s.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}
