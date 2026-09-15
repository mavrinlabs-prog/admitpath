import { NextResponse } from "next/server";
import { checkFeatureAccess, accessDenialResponse } from "@/lib/trial";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { INTERVIEW_COACH_SYSTEM, buildInterviewFeedbackPrompt } from "@/lib/prompts/interview-coach";
import { routeLlmCall } from "@/lib/llm-router";
import { effectivePlan } from "@/lib/utils";
import {
  FreePlanLimitReachedError,
  freeUsageLimitBody,
  releaseFreeUsage,
  reserveFreeUsage,
} from "@/lib/free-usage";
import { sanitizeUserInput, validateAIOutput, buildResponseMeta, buildNextSteps } from "@/lib/api-quality";
import { z } from "zod";
import { normalizeInterviewFeedback } from "@/lib/interview-quality";

const interviewSchema = z.object({
  question: z.string().min(5).max(500),
  answer: z.string().min(20).max(5000),
  targetSchool: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
});

export async function POST(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  // Cost-bearing AI routes must not bypass abuse controls when the limiter fails.
  let rl: { allowed: boolean };
  try {
    rl = await rateLimitUserAndIp(userId, req, user.plan);
  } catch (rlErr) {
    console.error("[/api/interview] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
    return NextResponse.json(
      { error: "Request safety check is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  // Gate on the "chat" feature since interview practice is AI-powered conversation.
  const access = checkFeatureAccess(user, "chat");
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  const parsedBody = await parseJsonBody(req, interviewSchema);
  if ("response" in parsedBody) return parsedBody.response;

  const { question: rawQuestion, answer: rawAnswer, targetSchool, category, difficulty } = parsedBody.data;

  // Sanitize user-provided question and answer text
  const question = sanitizeUserInput(rawQuestion);
  const answer = sanitizeUserInput(rawAnswer);

  const TIMEOUT_MS = 60_000;
  const startTime = Date.now();

  const userPrompt = buildInterviewFeedbackPrompt({
    question,
    answer,
    targetSchool,
    category,
    difficulty,
  });

  const plan = effectivePlan(user as Parameters<typeof effectivePlan>[0]);

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: INTERVIEW_COACH_SYSTEM },
    { role: "user", content: userPrompt },
  ];

  let freeUsageReserved = false;
  if (access.reason === "free") {
    try {
      await reserveFreeUsage(userId, "chat");
      freeUsageReserved = true;
    } catch (error) {
      if (error instanceof FreePlanLimitReachedError) {
        return NextResponse.json(freeUsageLimitBody("chat"), { status: 429 });
      }
      console.error("[/api/interview] usage reservation failed:", error);
      return NextResponse.json(
        { error: "Could not reserve a free coaching credit. Please try again.", retryable: true },
        { status: 503, headers: { "Retry-After": "10" } },
      );
    }
  }

  try {
    const { text, tierUsed } = await Promise.race([
      routeLlmCall(messages, { minTier: 2, plan }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("LLM timeout")), TIMEOUT_MS),
      ),
    ]);

    // Parse the JSON response
    let feedback: Record<string, unknown>;
    try {
      const { repairAndParse } = await import("@/lib/json-repair");
      feedback = repairAndParse<Record<string, unknown>>(text);
    } catch {
      if (freeUsageReserved) {
        freeUsageReserved = false;
        try {
          await releaseFreeUsage(userId, "chat");
        } catch (releaseError) {
          console.error("[/api/interview] usage release failed:", releaseError);
        }
      }
      return NextResponse.json(
        { error: "AI returned unparseable feedback. Please try again." },
        { status: 502 },
      );
    }

    feedback = normalizeInterviewFeedback(feedback, question, answer);

    // Validate AI output quality
    const quality = validateAIOutput(feedback, {
      requiredFields: ["scores", "overallScore", "verdict", "dimensionFeedback", "assessmentDisclaimer"],
      requiredArrays: ["strengths", "improvements", "practicePlan"],
      scoreFields: [
        "scores.clarity", "scores.specificity", "scores.authenticity",
        "scores.relevance", "scores.confidence",
      ],
    });

    const nextSteps = buildNextSteps("interview");
    const meta = buildResponseMeta({
      tierUsed,
      startTime,
      dataSources: targetSchool ? ["interview-coach prompt", "school-specific calibration"] : ["interview-coach prompt"],
      confidenceLevel: "high",
      qualityScore: quality.score,
    });

    return NextResponse.json({
      feedback,
      tierUsed,
      nextSteps,
      _meta: meta,
      _quality: quality.passed ? undefined : { issues: quality.issues },
    });
  } catch (err) {
    if (freeUsageReserved) {
      freeUsageReserved = false;
      try {
        await releaseFreeUsage(userId, "chat");
      } catch (releaseError) {
        console.error("[/api/interview] usage release failed:", releaseError);
      }
    }
    const message = (err as Error).message;
    if (message === "LLM timeout") {
      return NextResponse.json(
        { error: "Interview feedback timed out. Our AI is under load — please try again in a moment." },
        { status: 504 },
      );
    }
    console.error("[/api/interview]", {
      event: "ai_failed",
      error: message,
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    const errMsg = message?.toLowerCase() ?? "";
    if (errMsg.includes("all llm") || errMsg.includes("exhausted") || errMsg.includes("429")) {
      return NextResponse.json(
        { error: "Our AI is temporarily busy due to high demand. Please try again in 30 seconds.", retryable: true },
        { status: 429, headers: { "Retry-After": "30" } },
      );
    }
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}
