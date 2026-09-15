import { NextResponse } from "next/server";
import { checkFeatureAccess, accessDenialResponse } from "@/lib/trial";
import { callWithJsonRetry, JsonParseError } from "@/lib/json-repair";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { routeLlmCall } from "@/lib/llm-router";
import { effectivePlan } from "@/lib/utils";
import {
  FreePlanLimitReachedError,
  freeUsageLimitBody,
  releaseFreeUsage,
  reserveFreeUsage,
} from "@/lib/free-usage";
import { sanitizeUserInput, buildResponseMeta } from "@/lib/api-quality";
import { z } from "zod";

/**
 * SAT / ACT score feedback endpoint.
 *
 * Given a student's test scores and target schools, returns:
 *   - Score positioning vs. target school 25th/50th/75th percentiles
 *   - Section-by-section analysis (if breakdown provided)
 *   - Whether to submit or go test-optional
 *   - Specific improvement strategies per section
 *   - Estimated hours needed for target improvement
 *
 * LLM routing: Cerebras primary -> Groq fallback. NO OpenAI.
 */

const satFeedbackSchema = z.object({
  satScore: z.number().min(400).max(1600).optional(),
  satMath: z.number().min(200).max(800).optional(),
  satVerbal: z.number().min(200).max(800).optional(),
  actScore: z.number().min(1).max(36).optional(),
  targetColleges: z.array(z.string().max(160)).max(20).optional().default([]),
  grade: z.number().min(7).max(12).optional(),
  intendedMajor: z.string().max(200).optional(),
  testDate: z.string().max(30).optional(),
  previousScore: z.number().min(400).max(1600).optional(),
});

function buildSATPrompt(input: z.infer<typeof satFeedbackSchema>): string {
  const lines: string[] = [];
  if (input.satScore) lines.push(`SAT Total: ${input.satScore}`);
  if (input.satMath) lines.push(`SAT Math: ${input.satMath}`);
  if (input.satVerbal) lines.push(`SAT Evidence-Based Reading & Writing: ${input.satVerbal}`);
  if (input.actScore) lines.push(`ACT Composite: ${input.actScore}`);
  if (input.grade) lines.push(`Grade: ${input.grade}`);
  if (input.intendedMajor) lines.push(`Intended Major: ${input.intendedMajor}`);
  if (input.previousScore) lines.push(`Previous SAT Score: ${input.previousScore}`);
  if (input.testDate) lines.push(`Test Date: ${input.testDate}`);
  if (input.targetColleges.length > 0) lines.push(`Target Schools: ${input.targetColleges.join(", ")}`);

  return `Analyze this student's standardized test performance and give actionable feedback.

STUDENT DATA:
${lines.join("\n")}

For each target school, compare the student's score to that school's 25th/50th/75th percentile SAT ranges. State whether the score is BELOW 25th, BETWEEN 25th-50th, BETWEEN 50th-75th, or ABOVE 75th. Use real published data where available.

Return ONLY valid JSON in this shape:
{
  "scoreAnalysis": {
    "composite": "<overall assessment of the composite score>",
    "math": "<math section analysis if provided, or null>",
    "verbal": "<verbal section analysis if provided, or null>",
    "improvement": "<estimated points of improvement possible with X hours of study>"
  },
  "schoolComparisons": [
    {
      "school": "<school name>",
      "satRange": "<25th-75th percentile range>",
      "position": "below_25th | 25th_to_50th | 50th_to_75th | above_75th",
      "submitRecommendation": "submit | test_optional | retake",
      "reasoning": "<one sentence explaining the recommendation>"
    }
  ],
  "testOptionalAdvice": "<whether to go test-optional at any target schools and why>",
  "improvementPlan": {
    "targetScore": <recommended target score>,
    "focusAreas": ["<specific areas to focus on>"],
    "estimatedHours": <estimated study hours needed>,
    "timeline": "<recommended study timeline>",
    "resources": ["<specific free or paid resources>"]
  },
  "retakeRecommendation": "<whether to retake, when, and what score to target>",
  "actComparison": "<if ACT provided, which test better represents this student and why>",
  "summary": "<3-4 sentence honest assessment>"
}`;
}

export async function POST(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  // Cost-bearing AI routes must not bypass abuse controls when the limiter fails.
  let rl: { allowed: boolean };
  try {
    rl = await rateLimitUserAndIp(userId, req, user.plan);
  } catch (rlErr) {
    console.error("[/api/sat-feedback] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
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

  // Gate on "analyses" feature since this is an AI-powered scoring tool.
  const access = checkFeatureAccess(user, "analyses");
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  const parsedBody = await parseJsonBody(req, satFeedbackSchema, { includeDetails: true });
  if ("response" in parsedBody) return parsedBody.response;

  // Must have at least one test score
  if (!parsedBody.data.satScore && !parsedBody.data.actScore) {
    return NextResponse.json(
      { error: "Please provide at least an SAT or ACT score." },
      { status: 400 },
    );
  }

  const startTime = Date.now();
  const TIMEOUT_MS = 45_000;

  let freeUsageReserved = false;
  if (access.reason === "free") {
    try {
      await reserveFreeUsage(userId, "analyses");
      freeUsageReserved = true;
    } catch (error) {
      if (error instanceof FreePlanLimitReachedError) {
        return NextResponse.json(freeUsageLimitBody("analyses"), { status: 429 });
      }
      console.error("[/api/sat-feedback] usage reservation failed:", error);
      return NextResponse.json(
        { error: "Could not reserve a free analysis credit. Please try again.", retryable: true },
        { status: 503, headers: { "Retry-After": "10" } },
      );
    }
  }

  let result: unknown;
  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("SAT feedback timed out")), TIMEOUT_MS);
    });

    const userPlan = effectivePlan(user);
    const prompt = sanitizeUserInput(buildSATPrompt(parsedBody.data));

    const work = callWithJsonRetry<unknown>(
      async () => {
        const { text } = await routeLlmCall(
          [
            {
              role: "system",
              content:
                "<role>You are a careful SAT/ACT planning assistant. Use only the score and school data supplied in this request.</role> " +
                "<operating_standards>Give brutally honest, data-driven advice grounded ONLY in the score data provided — never invent percentiles or school policies not supplied, and flag anything the student should verify on a school's official site. Cover every section score provided, not just the composite. The reader is a minor: keep advice age-appropriate, frame projections as estimates (never guarantees), and if the input suggests test anxiety or distress, acknowledge it kindly and suggest talking to a counselor rather than piling on pressure. Never sugarcoat scores or inflate potential — a false 'you're fine' costs the student their retake window.</operating_standards> " +
                "<self_check>Before emitting, verify every number traces to the provided data, every recommendation names a concrete next step with a timeframe, and the JSON matches the requested schema exactly; revise once, then output.</self_check> " +
                "<format>Return ONLY valid JSON matching the requested schema — no prose, no markdown.</format>",
            },
            { role: "user", content: prompt },
          ],
          { minTier: userPlan === "pro" ? 2 : 1, plan: userPlan, callerLabel: "sat-feedback" },
        );
        return text;
      },
      2,
    );

    try {
      result = await Promise.race([work, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  } catch (err) {
    if (freeUsageReserved) {
      freeUsageReserved = false;
      try {
        await releaseFreeUsage(userId, "analyses");
      } catch (releaseError) {
        console.error("[/api/sat-feedback] usage release failed:", releaseError);
      }
    }
    console.error("[/api/sat-feedback]", {
      event: "ai_failed",
      error: String(err),
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    if (err instanceof JsonParseError) {
      return NextResponse.json({ error: "AI returned an unparseable response. Please retry." }, { status: 502 });
    }
    const errMsg = err instanceof Error ? err.message.toLowerCase() : "";
    if (errMsg.includes("timed out")) {
      return NextResponse.json(
        { error: "Analysis took too long. Please try again in a moment." },
        { status: 504 },
      );
    }
    if (errMsg.includes("exhausted") || errMsg.includes("429")) {
      return NextResponse.json(
        { error: "Our AI is temporarily busy. Please try again in 30 seconds.", retryable: true },
        { status: 429, headers: { "Retry-After": "30" } },
      );
    }
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again.", retryable: true },
      { status: 503 },
    );
  }

  const meta = buildResponseMeta({
    startTime,
    dataSources: ["sat-feedback prompt"],
    confidenceLevel: parsedBody.data.targetColleges.length > 0 ? "high" : "medium",
    qualityScore: 80,
  });

  return NextResponse.json({
    ...(result as object),
    _meta: meta,
  });
}
