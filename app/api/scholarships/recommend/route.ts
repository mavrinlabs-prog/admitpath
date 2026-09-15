import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import {
  recommendStructured,
  type StudentSignals,
} from "@/lib/scholarship-matcher";
import { SCHOLARSHIPS } from "@/data/scholarships-db";

/**
 * Personalized scholarship matcher.
 *
 * GET /api/scholarships/recommend
 *
 * Reads the user's Profile + the static scholarships.json pool, scores
 * each against profile signals (grade, GPA, SAT, major, household income,
 * state), and returns the top 12 matches with reasons.
 *
 * Free-tier accessible — no LLM cost, deterministic match. The static
 * pool is small (20 scholarships) so we do all scoring in-memory per request.
 *
 * Returns: { matches: Match[], profileComplete: boolean }
 *   profileComplete = whether enough signals exist for a confident match.
 *   When false, the UI prompts the student to fill in their profile.
 */
export async function GET() {
  try {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  let profile;
  try {
    profile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { userId },
        select: {
          grade: true,
          gpa: true,
          satScore: true,
          intendedMajor: true,
          householdIncome: true,
          state: true,
        },
      }),
    );
  } catch (dbErr) {
    console.error("[/api/scholarships/recommend] DB fetch failed:", {
      error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "10" } },
    );
  }

  const signals: StudentSignals = {
    grade: profile?.grade ?? null,
    gpa: profile?.gpa ?? null,
    satScore: profile?.satScore ?? null,
    intendedMajor: profile?.intendedMajor ?? null,
    householdIncome: profile?.householdIncome ?? null,
    state: profile?.state ?? null,
  };

  // "Complete enough for a confident match" = at minimum we know grade
  // (the strongest filter) AND one of GPA/major/income (a personalization
  // signal). Otherwise everything just gets the renewable + any grade-match
  // boost which makes the ranking nearly meaningless.
  const profileComplete =
    signals.grade !== null &&
    (signals.gpa !== null || signals.intendedMajor !== null || signals.householdIncome !== null);

  const matches = recommendStructured(SCHOLARSHIPS, signals, 12);

  // Build actionable next steps
  const nextSteps: string[] = [];
  if (!profileComplete) {
    nextSteps.push("Complete your profile (add GPA, major, or household income) for more accurate scholarship matches.");
  }
  if (matches.length > 0) {
    nextSteps.push("Check application deadlines for your top 3 matches — many scholarships close 6+ months before the award date.");
    nextSteps.push("Prepare a strong personal statement — most competitive scholarships weight the essay heavily.");
  }

  return NextResponse.json(
    {
      matches,
      profileComplete,
      total: matches.length,
      nextSteps,
      _meta: {
        dataSource: "AdmitPath structured scholarship catalog (2025-26 reference cycle)",
        confidenceLevel: profileComplete ? "high" : "low",
        scoreMeaning: "Match scores rank profile relevance; they are not eligibility decisions or probabilities of winning.",
        freshnessCaveat: "Scholarship rules and deadlines change. Verify every match on the linked official program page before applying.",
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
  } catch (outerErr) {
    console.error("[/api/scholarships/recommend] unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Scholarship recommendations temporarily unavailable. Please try again.", retryable: true },
      { status: 503, headers: { "Retry-After": "15" } },
    );
  }
}
