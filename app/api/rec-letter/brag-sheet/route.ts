/**
 * GET /api/rec-letter/brag-sheet
 *
 * Renders a printable brag-sheet from the current user's profile. Pure
 * template — no LLM call, free for all tiers. Returns plain text the
 * student copies/prints and hands to the recommending teacher.
 *
 * Profile.activities, .awards, .courses, .targetColleges are all Prisma
 * Json so we coerce defensively. Top items are capped at 5 each so the
 * sheet stays one page.
 */

import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { buildBragSheet, type BragSheetInput } from "@/lib/rec-letter";

const MAX_ITEMS = 5;

function topActivities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is { name?: string; role?: string; impact?: string } =>
      typeof x === "object" && x !== null
    )
    .filter((x) => typeof x.name === "string" && x.name.trim())
    .slice(0, MAX_ITEMS)
    .map((x) => {
      const role = typeof x.role === "string" && x.role ? ` (${x.role})` : "";
      const impact = typeof x.impact === "string" && x.impact ? ` — ${x.impact.slice(0, 120)}` : "";
      return `${x.name}${role}${impact}`;
    });
}

function topAwards(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  // Awards can be plain strings (manual form) or objects { name, level,
  // year } (resume-import). The original implementation only handled
  // objects, so every manually-entered award was silently filtered out.
  return raw
    .map((x) => {
      if (typeof x === "string" && x.trim()) return x.trim();
      if (typeof x === "object" && x !== null) {
        const o = x as { name?: string; level?: string; year?: number };
        if (typeof o.name === "string" && o.name.trim()) {
          const lvl = typeof o.level === "string" && o.level ? ` (${o.level} level)` : "";
          const yr = typeof o.year === "number" ? `, ${o.year}` : "";
          return `${o.name}${lvl}${yr}`;
        }
      }
      return null;
    })
    .filter((s): s is string => s !== null)
    .slice(0, MAX_ITEMS);
}

function topCourses(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    .slice(0, MAX_ITEMS);
}

function topTargets(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    .slice(0, MAX_ITEMS);
}

export async function GET() {
  try {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  let profile;
  try {
    profile = await withRetry(() =>
      prisma.profile.findFirst({
        where: { userId, deletedAt: null },
        select: {
          grade: true,
          gpa: true,
          satScore: true,
          actScore: true,
          activities: true,
          awards: true,
          courses: true,
          targetColleges: true,
        },
      }),
    );
  } catch (dbErr) {
    console.error("[/api/rec-letter/brag-sheet] DB fetch failed:", {
      error: dbErr instanceof Error ? dbErr.message : String(dbErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "10" } },
    );
  }

  if (!profile) {
    return NextResponse.json(
      {
        error: "Finish your profile first so we can populate the brag sheet.",
        nextStep: "/profile/create",
      },
      { status: 422 }
    );
  }

  const courseList = topCourses(profile.courses);
  // Approximate AP count by counting "AP " or " AP" tokens — close enough
  // for the brag sheet (the profile builder doesn't track AP/IB type per
  // course in the current schema).
  const apCount = courseList.filter((c) => /\bap\b/i.test(c)).length;

  const input: BragSheetInput = {
    // The User schema uses a single `name` field (not split first/last).
    studentName: typeof user.name === "string" && user.name.trim() ? user.name.trim() : null,
    grade: profile.grade ?? null,
    gpa: profile.gpa ?? null,
    satScore: profile.satScore ?? null,
    actScore: profile.actScore ?? null,
    apCount,
    topActivities: topActivities(profile.activities),
    topAwards: topAwards(profile.awards),
    topCourses: courseList,
    targetColleges: topTargets(profile.targetColleges),
  };

  const sheet = buildBragSheet(input);

  // Build actionable next steps
  const nextSteps: string[] = [
    "Print this brag sheet and give it to your recommender at least 3 weeks before the deadline.",
    "Include a brief personal note explaining why you chose this teacher and what you hope they highlight.",
    "Follow up with a thank-you note after they submit — it matters for future references too.",
  ];

  return NextResponse.json({
    sheet,
    nextSteps,
    confirmedProfileEvidence: {
      grade: input.grade,
      gpa: input.gpa,
      testing: input.satScore ? `SAT ${input.satScore}` : input.actScore ? `ACT ${input.actScore}` : null,
      activities: input.topActivities,
      awards: input.topAwards,
      courses: input.topCourses,
    },
    missingPersonalization: [
      !input.whyAskingThem ? "why this specific recommender was chosen" : null,
      "one specific classroom or community anecdote",
      "a challenge or moment of growth the recommender observed",
      "the distinct quality this letter should illustrate without exaggeration",
    ].filter((value): value is string => Boolean(value)),
    personalizationPrompts: [
      "What is one moment this recommender personally witnessed that shows how you think or contribute?",
      "What changed in your work or confidence during their class?",
      "What truthful detail would help this letter add something that grades and activities cannot show?",
    ],
    authorshipNote: "The brag sheet organizes facts supplied by the student. Recommenders should write independently in their own voice; never draft or script the letter for them.",
    _meta: {
      dataSource: "student profile",
      confidenceLevel: (input.topActivities?.length ?? 0) >= 2 ? "high" : "medium",
    },
  });
  } catch (outerErr) {
    console.error("[/api/rec-letter/brag-sheet] unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    return NextResponse.json(
      { error: "Brag sheet service temporarily unavailable. Please try again in a moment.", retryable: true },
      { status: 503, headers: { "Retry-After": "15" } },
    );
  }
}
