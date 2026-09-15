import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import {
  recommendCompetitions,
  type CompetitionRow,
  type CompetitionSignals,
} from "@/lib/competition-matcher";
import { readFileSync } from "fs";
import { join } from "path";
const competitionsRaw = JSON.parse(readFileSync(join(process.cwd(), "public/competitions.json"), "utf8"));

/**
 * Personalized competition recommendations.
 *
 * GET /api/competitions/recommend
 *
 * Reads user Profile (grade, intendedMajor, gpa) and ranks the 55-row pool
 * by category-vs-major alignment + eligibility text scan + prestige cues.
 *
 * Free-tier accessible. No LLM cost.
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
        select: { grade: true, intendedMajor: true, gpa: true },
      }),
    );
  } catch (dbErr) {
    console.error("[/api/competitions/recommend] DB fetch failed:", {
      error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "10" } },
    );
  }

  const signals: CompetitionSignals = {
    grade: profile?.grade ?? null,
    intendedMajor: profile?.intendedMajor ?? null,
    gpa: profile?.gpa ?? null,
  };

  const profileComplete = signals.grade !== null && signals.intendedMajor !== null;

  const matches = recommendCompetitions(
    competitionsRaw as CompetitionRow[],
    signals,
    12,
  );

  // Build actionable next steps based on results
  const nextSteps: string[] = [];
  if (!profileComplete) {
    nextSteps.push("Complete your profile (add grade and intended major) for more accurate competition matches.");
  }
  if (matches.length > 0) {
    nextSteps.push("Check registration deadlines for your top 3 matches — many competitions close months before the event.");
    nextSteps.push("Focus on 1-2 competitions aligned with your spike rather than spreading across many.");
  }

  return NextResponse.json(
    {
      matches,
      profileComplete,
      total: matches.length,
      nextSteps,
      _meta: {
        dataSource: "AdmitPath competitions database",
        confidenceLevel: profileComplete ? "high" : "low",
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
  } catch (outerErr) {
    console.error("[/api/competitions/recommend] unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Competition recommendations temporarily unavailable. Please try again.", retryable: true },
      { status: 503, headers: { "Retry-After": "15" } },
    );
  }
}
