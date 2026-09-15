/**
 * GET /api/rec-letter/recommenders
 *
 * Returns the heuristic-picked top recommenders for the current user based
 * on the courses field of their Profile. No LLM call — pure rule-based,
 * always free, never gated. The student should always be able to see who
 * we'd ask for letters even on the Free tier.
 *
 * The Profile.courses JSON is stored as a string[] of course names (one
 * per line in the profile builder textarea). We don't have grade-year or
 * final-grade per course in the schema, so the heuristic falls back to
 * inferring rigor + subject from the course name regex. Result quality is
 * therefore proportional to how specifically students name their courses
 * ("AP Calc BC" parses cleanly; "Math 4" does not).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { selectRecommenders, type CourseHint } from "@/lib/rec-letter";

export async function GET() {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { courses: true, grade: true },
  });

  if (!profile || !Array.isArray(profile.courses) || profile.courses.length === 0) {
    return NextResponse.json(
      {
        error:
          "Add the courses you've taken to your profile so we can suggest the strongest recommenders.",
        nextStep: "/profile/create",
      },
      { status: 422 }
    );
  }

  // The courses field is `string[]` per app/profile/create/page.tsx, but
  // defensively coerce because Profile.courses is Prisma Json.
  const courseNames = (profile.courses as unknown[])
    .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    .map((c) => c.trim());

  // Without grade-year data per course, we treat every course as "current"
  // and let the rigor + subject regex do the heavy lifting. If/when we add
  // a structured Course model with grade fields, this maps 1:1.
  const courses: CourseHint[] = courseNames.map((name) => ({
    name,
    grade: profile.grade ?? null, // student's current grade applies to all listed
  }));

  const picks = selectRecommenders(courses);

  if (picks.length === 0) {
    return NextResponse.json(
      {
        error:
          "We couldn't infer subjects from your course names. Add courses like 'AP Biology' or 'Honors English' so the matcher can pick recommenders.",
        nextStep: "/profile/create",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({
    picks,
    selectionBasis: courseNames.map((course) => `Confirmed profile course: ${course}`),
    interpretation: "The ranking infers subject and rigor from course names. It does not know the teacher relationship, classroom contribution, final grade, or whether a teacher can write a specific letter.",
    missingEvidence: [
      "which teacher knows the student best",
      "specific classroom anecdotes",
      "relationship length",
      "final grade and growth",
      "teacher willingness and deadline availability",
    ],
    confirmationQuestions: [
      "Which teacher can describe a specific moment when your thinking, effort, or contribution changed the class?",
      "Which teacher has known you long enough to compare your growth over time?",
      "Can each recommender add a different perspective rather than repeating the same strengths?",
    ],
    nextAction: "Ask the top candidate whether they can write a strong, specific letter, then share two truthful classroom moments and the deadline.",
    disclaimer: "These are course-based suggestions, not judgments of a teacher or guarantees of letter quality or admission.",
  });
}
