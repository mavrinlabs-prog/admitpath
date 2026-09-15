import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import {
  recommendPrograms,
  type ProgramRow,
  type ProgramSignals,
} from "@/lib/summer-program-matcher";
import programsRaw from "@/../../public/summer-programs.json";

/**
 * Personalized summer program recommender.
 *
 * GET /api/summer-programs/recommend
 *
 * Returns reach / target / safety bucketed lists based on the student's
 * profile strength (GPA + SAT) compared to each program's selectivity.
 *
 * Free-tier accessible. Pure scoring, no LLM cost.
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
        },
      }),
    );
  } catch (dbErr) {
    console.error("[/api/summer-programs/recommend] DB fetch failed:", {
      error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "10" } },
    );
  }

  const signals: ProgramSignals = {
    grade: profile?.grade ?? null,
    gpa: profile?.gpa ?? null,
    satScore: profile?.satScore ?? null,
    intendedMajor: profile?.intendedMajor ?? null,
  };

  const profileComplete =
    signals.grade !== null && (signals.gpa !== null || signals.satScore !== null);

  const buckets = recommendPrograms(programsRaw as ProgramRow[], signals);

  // Build actionable next steps
  const nextSteps: string[] = [];
  if (!profileComplete) {
    nextSteps.push("Add your GPA and/or SAT score to your profile for better reach/target/safety bucketing.");
  }
  nextSteps.push("Apply to 2-3 reach programs and 2-3 target programs — do not put all eggs in one basket.");
  nextSteps.push("Most selective summer programs (RSI, SSTP, MOSTEC) have deadlines in January-February — plan accordingly.");

  return NextResponse.json(
    {
      ...buckets,
      profileComplete,
      nextSteps,
      _meta: {
        dataSource: "AdmitPath summer programs database",
        confidenceLevel: profileComplete ? "high" : "low",
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
  } catch (outerErr) {
    console.error("[/api/summer-programs/recommend] unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Summer programs service temporarily unavailable. Please try again.", retryable: true },
      { status: 503, headers: { "Retry-After": "15" } },
    );
  }
}
