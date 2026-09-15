import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { checkFeatureAccess, accessDenialResponse, FREE_LIMITS } from "@/lib/trial";
import { callWithJsonRetry } from "@/lib/json-repair";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { ESSAY_COACH_SYSTEM_COMPACT, buildCompactEssayCoachPrompt } from "@/lib/prompts";
import { scoreVoice } from "@/lib/voice-rubric";
import { effectivePlan } from "@/lib/utils";
import { sanitizeUserInput, validateAIOutput, buildResponseMeta, buildNextSteps } from "@/lib/api-quality";
import { FreePlanLimitReachedError, freeUsageLimitBody } from "@/lib/free-usage";
import { ESSAY_TYPE_VALUES } from "@/lib/essay-types";
import {
  essaySubmissionSchema,
  getEssayReplayDecision,
  isRequestKeyConflict,
  type EssayReplayRecord,
} from "@/lib/essay-contract";
import { callEssayProviderWithFallback } from "@/lib/essay-provider";
import { buildEssayFallbackFeedback, normalizeEssayFeedback } from "@/lib/essay-fallback";
import { z } from "zod";

function replayResponse(prior: EssayReplayRecord) {
  return NextResponse.json({
    ...(prior.feedback as object),
    essayId: prior.essayId,
    persisted: true,
    replayed: true,
  });
}

function requestKeyConflictResponse(requestKey: string) {
  return NextResponse.json({
    error: "This request key was already used for a different essay submission.",
    code: "ESSAY_REQUEST_KEY_CONFLICT",
    message: "Refresh the page and submit again.",
    fieldErrors: { requestKey: ["Request key must be unique to this essay submission."] },
    requestId: requestKey,
    recoverable: true,
  }, { status: 409, headers: { "X-Request-Id": requestKey } });
}

export async function POST(req: Request) {
 try {
  // requireUser folds the 401 + soft-delete-aware 404 — a tombstoned account
  // must NOT be able to keep writing Essay rows / burning essay quota.
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  // Cost-bearing AI routes must not bypass abuse controls when the limiter fails.
  let rl: { allowed: boolean };
  try {
    rl = await rateLimitUserAndIp(userId, req, user.plan);
  } catch (rlErr) {
    console.error("[/api/essay] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
    return NextResponse.json(
      { error: "Request safety check is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const access = checkFeatureAccess(user, "essays");
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  const parsedBody = await parseJsonBody(req, essaySubmissionSchema, { includeDetails: true });
  if ("response" in parsedBody) return parsedBody.response;

  // Track processing time for response metadata
  const startTime = Date.now();

  const { essayId, requestKey, prompt: rawPrompt, content: rawContent, college, essayType, wordLimit } = parsedBody.data;

  const prompt = sanitizeUserInput(rawPrompt);
  const content = sanitizeUserInput(rawContent);

  const loadPriorVersion = () => withRetry(() =>
    prisma.essayVersion.findUnique({
      where: { requestKey },
      select: { content: true, feedback: true, essayId: true, essay: { select: { userId: true } } },
    }),
  ) as Promise<EssayReplayRecord | null>;
  const priorVersion = await loadPriorVersion();
  const replayDecision = getEssayReplayDecision(priorVersion, userId, { essayId, content });
  if (replayDecision === "replay") return replayResponse(priorVersion!);
  if (replayDecision === "conflict") return requestKeyConflictResponse(requestKey);
  // Sanitize essay content and prompt to prevent injection. The essay itself
  // gets sanitized lightly — we only strip injection patterns, not legitimate
  // essay text (students write about "ignoring previous advice" legitimately).
  // Hard cap on the LLM call. Must be UNDER Vercel's maxDuration (60s) so
  // the route can catch the timeout and return JSON instead of Vercel
  // killing the function with a bare 503.
  const TIMEOUT_MS = 25_000;
  class EssayTimeoutError extends Error {}

  const voiceHeuristic = scoreVoice(content);
  let feedback: unknown;
  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new EssayTimeoutError("essay timed out")), TIMEOUT_MS);
    });
    // Run the heuristic voice rubric (CEG 4-axis: place, detail, vulnerability,
    // surprise) and pass the pre-scores to the LLM so it can cross-reference
    // and calibrate. This is cheap (no LLM call) and gives the AI concrete
    // signals about sentence variance, proper noun count, etc.
    // Tier 2 minimum — 6-dimension essay scoring needs 70B reasoning.
    // Pro users get Tier 3 (Claude Sonnet) for best writing critique.
    const userPlan = effectivePlan(user);
    const llmMessages = [
      { role: "system" as const, content: ESSAY_COACH_SYSTEM_COMPACT },
      { role: "user" as const, content: buildCompactEssayCoachPrompt({ prompt, content, college, essayType, wordLimit, voiceHeuristic }) },
    ];
    const work = callWithJsonRetry<unknown>(
      async () => {
        return callEssayProviderWithFallback(llmMessages, {
          minTier: userPlan === "pro" ? 3 : 2,
          plan: userPlan,
          // Compact JSON contract stays below Groq's 12k TPM request ceiling.
          temperature: 0.2,
          maxTokens: 3000,
          callerLabel: "essay",
          userId,
        });
      },
      1
    );
    try {
      feedback = await Promise.race([work, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  } catch (err) {
    console.error("[/api/essay]", {
      event: "ai_failed",
      error: String(err),
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    feedback = buildEssayFallbackFeedback(content, prompt, voiceHeuristic);
  }

  feedback = normalizeEssayFeedback(feedback as Record<string, unknown>, content);

  const wordCount = content.trim().split(/\s+/).length;

  // Pull the overall score off the feedback JSON for the version-list
  // denormalization. Tolerant of shape drift — if the LLM omitted the
  // field or returned something un-numeric we just store null.
  const pickScore = (fb: unknown): number | null => {
    if (!fb || typeof fb !== "object") return null;
    const v = (fb as Record<string, unknown>).overallScore;
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  };
  const score = pickScore(feedback);

  // Atomic: for a Free-plan user, the essay write, version snapshot, and
  // usage-counter increment must all commit together. Without
  // the transaction, a DB hiccup between writes could either burn budget
  // without saving (lost work) or save without burning (free reroll), or
  // worse — write the essay update without the version snapshot, leaving
  // the diff history with a hole for that draft.
  //
  // The version snapshot is the "Git for essays" feature per the PRD
  // (COMPLIANCE_AUDIT.md item 54). Every successful AI scoring writes one
  // EssayVersion row so the user can compare drafts ("v3:72 → v4:81").
  // We do this on EVERY scoring, not just on explicit "save version"
  // clicks — students don't reliably tag good drafts, and storage is
  // cheap enough.
  let savedEssayId: string;
  try {
    if (essayId) {
      // Existing essay → bump version, snapshot the new content+feedback.
      const existing = await withRetry(() =>
        prisma.essay.findFirst({
          where: { id: essayId, userId, deletedAt: null },
          select: { version: true },
        }),
      );
      if (!existing) {
        return NextResponse.json({ error: "Essay not found" }, { status: 404 });
      }
      const nextVersion = existing.version + 1;

      savedEssayId = await withRetry(() => prisma.$transaction(async (tx) => {
        if (access.reason === "free") {
          const reservation = await tx.user.updateMany({
            where: { id: userId, deletedAt: null, trialEssayCount: { lt: FREE_LIMITS.essays } },
            data: { trialEssayCount: { increment: 1 } },
          });
          if (reservation.count !== 1) throw new FreePlanLimitReachedError("essays");
        }
        await tx.essay.update({
          where: { id: essayId },
          data: {
            feedback: feedback as object,
            content,
            wordCount,
            version: nextVersion,
            latestScore: score,
            ...(essayType ? { essayType } : {}),
          },
        });
        await tx.essayVersion.create({
          data: { essayId, requestKey, version: nextVersion, content, wordCount, feedback: feedback as object, score },
        });
        return essayId;
      }));
    } else {
      // New essay → create row at version 1, snapshot v1 immediately so
      // history starts from the very first draft.
      savedEssayId = await withRetry(() => prisma.$transaction(async (tx) => {
        if (access.reason === "free") {
          const reservation = await tx.user.updateMany({
            where: { id: userId, deletedAt: null, trialEssayCount: { lt: FREE_LIMITS.essays } },
            data: { trialEssayCount: { increment: 1 } },
          });
          if (reservation.count !== 1) throw new FreePlanLimitReachedError("essays");
        }
        const created = await tx.essay.create({
          data: {
            userId, prompt, content, college, essayType, feedback: feedback as object, wordCount, version: 1, latestScore: score,
            // Inline create the first version row via nested write so we
            // don't need the Essay.id round-trip.
            versions: {
              create: { requestKey, version: 1, content, wordCount, feedback: feedback as object, score },
            },
          },
          select: { id: true },
        });
        return created.id;
      }));
    }
    const readBack = await withRetry(() => prisma.essay.findFirst({ where: { id: savedEssayId, userId, deletedAt: null }, select: { id: true } }));
    if (!readBack) throw new Error("Saved essay could not be read back.");
  } catch (err) {
    if (err instanceof FreePlanLimitReachedError) {
      return NextResponse.json(freeUsageLimitBody("essays"), { status: 429 });
    }
    if (isRequestKeyConflict(err)) {
      try {
        const winner = await loadPriorVersion();
        const decision = getEssayReplayDecision(winner, userId, { essayId, content });
        if (decision === "replay") return replayResponse(winner!);
        if (decision === "conflict") return requestKeyConflictResponse(requestKey);
      } catch {
        // Fall through to the recoverable save error below.
      }
    }
    console.error("[/api/essay]", { event: "db_write_failed_after_ai_success", fatal: true, error: String(err), hasDbUrl: !!process.env.DATABASE_URL });
    return NextResponse.json(
      { error: "Feedback was generated but could not be saved. Retry this request; it will not create a duplicate.", code: "ESSAY_SAVE_FAILED", requestId: requestKey, recoverable: true },
      { status: 503, headers: { "Retry-After": "10", "X-Request-Id": requestKey } },
    );
  }

  // Persist AI generation for cross-app analytics
  try {
    await withRetry(() =>
      prisma.generation.create({
        data: {
          userId,
          app: "admitpath",
          type: "essay",
          payload: { prompt, college, essayType, feedback } as object,
          createdAt: new Date(),
        },
      }),
    );
  } catch {
    // Non-fatal — essay already saved above
  }

  // Validate AI output quality
  const quality = validateAIOutput(feedback, {
    requiredFields: ["scores", "overallScore", "summary", "counselorNote", "craftAnalysis", "authorshipPolicy"],
    requiredArrays: ["topStrengths", "criticalIssues", "lineEdits", "revisionPriorities"],
    scoreFields: [
      "scores.authenticity", "scores.insight", "scores.specificity",
      "scores.storytelling", "scores.impact", "scores.voice",
    ],
    minScoreSpread: 10,
  });

  const nextSteps = buildNextSteps("essay", feedback as Record<string, unknown>);
  const meta = buildResponseMeta({
    startTime,
    dataSources: ["voice-rubric heuristic", "essay-coach prompt v2.1"],
    confidenceLevel: wordCount >= 100 ? "high" : "medium",
    qualityScore: quality.score,
  });

  return NextResponse.json({
    ...(feedback as object),
    essayId: savedEssayId,
    persisted: true,
    nextSteps,
    _meta: meta,
    _quality: quality.passed ? undefined : { issues: quality.issues },
  });
 } catch (outerErr) {
    // Top-level guard: any unhandled throw (requireUser crash, cookie parsing
    // edge case, checkFeatureAccess null pointer) surfaces as structured JSON 503.
    console.error("[/api/essay] POST unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      stack: outerErr instanceof Error ? outerErr.stack : undefined,
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Essay service temporarily unavailable. Please try again in 30s.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}

/**
 * PATCH — lightweight draft save (no AI scoring, no quota consumed).
 *
 * Saves the current essay content to the DB so it persists across devices
 * and sessions. Called by the client every 3s while the user is typing.
 * Does NOT create a version row (versions are only created on AI scoring).
 */
const draftSchema = z.object({
  essayId: z.string().optional(),
  prompt: z.string().max(500),
  content: z.string().max(7000),
  college: z.string().max(200).optional(),
  essayType: z.enum(ESSAY_TYPE_VALUES).optional(),
});

export async function PATCH(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const parsedBody = await parseJsonBody(req, draftSchema);
  if ("response" in parsedBody) return parsedBody.response;

  const { essayId, prompt, content, college, essayType } = parsedBody.data;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  try {
    if (essayId) {
      // Update existing essay draft. withRetry handles Neon cold-start.
      const existing = await withRetry(() =>
        prisma.essay.findFirst({
          where: { id: essayId, userId, deletedAt: null },
          select: { id: true },
        }),
      );
      if (!existing) {
        return NextResponse.json({ error: "Essay not found" }, { status: 404 });
      }
      await withRetry(() =>
        prisma.essay.update({
          where: { id: essayId },
          data: {
            prompt,
            content,
            college: college || null,
            wordCount,
            ...(essayType ? { essayType } : {}),
          },
        }),
      );
      return NextResponse.json({ id: essayId, saved: true });
    } else {
      // Create a new draft essay (no feedback yet)
      const essay = await withRetry(() =>
        prisma.essay.create({
          data: { userId, prompt, content, college: college || null, essayType, wordCount },
        }),
      );
      return NextResponse.json({ id: essay.id, saved: true });
    }
  } catch (err) {
    console.error("[/api/essay PATCH]", { event: "draft_save_failed", error: String(err), hasDbUrl: !!process.env.DATABASE_URL });
    const errMsg = err instanceof Error ? err.message.toLowerCase() : "";
    if (
      errMsg.includes("database unavailable") ||
      errMsg.includes("prismaclient failed") ||
      errMsg.includes("econnrefused") ||
      errMsg.includes("p1001") ||
      errMsg.includes("connection")
    ) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Your work is safe in your browser — please try saving again in a moment." },
        { status: 503, headers: { "Retry-After": "10" } },
      );
    }
    return NextResponse.json(
      { error: "Could not save draft. Your work is safe in your browser — please try again in a moment." },
      { status: 500 },
    );
  }
}
