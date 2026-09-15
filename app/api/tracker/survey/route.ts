/**
 * POST /api/tracker/survey — submit a results survey after decision day.
 *
 * Accepts: committedSchool (string), otherAdmits (string[]),
 *          financialAidAmount (number | null).
 *
 * For now the survey data is stored as an Analysis record with
 * type "results_survey" so it's queryable for the /outcomes page.
 * When the outcomes dataset grows, this can migrate to its own table.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";

const surveySchema = z.object({
  committedSchool: z.string().min(1).max(200),
  otherAdmits: z.array(z.string().max(200)).max(30).default([]),
  financialAidAmount: z.number().min(0).nullable().default(null),
});

export async function POST(req: Request) {
  let authed: Awaited<ReturnType<typeof requireUser>>;
  try {
    authed = await requireUser();
  } catch (err) {
    console.error("DB unavailable (requireUser):", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const parsed = await parseJsonBody(req, surveySchema);
  if ("response" in parsed) return parsed.response;

  const { committedSchool, otherAdmits, financialAidAmount } = parsed.data;

  try {
    // Store as an Analysis with type "results_survey". This reuses the
    // existing Analysis model (type + input JSON) rather than adding a new
    // table, keeping things simple until the dataset warrants its own model.
    await prisma.analysis.create({
      data: {
        userId,
        type: "results_survey",
        input: {
          committedSchool,
          otherAdmits,
          financialAidAmount,
          submittedAt: new Date().toISOString(),
        },
        result: {}, // No computed result for surveys
      },
    });

    // Also mark the committed school as enrolled in the tracker if it exists.
    const slug = committedSchool
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await prisma.application.updateMany({
      where: {
        userId,
        OR: [
          { collegeSlug: slug },
          { collegeName: { equals: committedSchool, mode: "insensitive" } },
        ],
      },
      data: {
        enrolled: true,
        enrolledAt: new Date(),
      } as any,
    });
  } catch (err) {
    console.error("DB unavailable (survey write):", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true });
}
