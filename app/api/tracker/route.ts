/**
 * Common App tracker — list + add.
 *
 * GET  /api/tracker            — list current user's Application rows
 * POST /api/tracker            — add a new tracked school by slug
 *
 * Both routes are auth-gated. No feature gate — this is plumbing every
 * student needs regardless of plan, just like /deadlines and /timeline.
 *
 * The PATCH/DELETE for individual rows live at /api/tracker/[id] so the
 * route handler can use the dynamic segment for the row id.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { findCollege } from "@/data/colleges";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";

const ROUND_VALUES = ["ED", "EA", "REA", "RD", "RD_2", "rolling"] as const;

const addSchema = z.object({
  collegeSlug: z.string().min(1).max(80),
  applicationRound: z.enum(ROUND_VALUES).optional(),
});

export async function GET() {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  let rows: unknown[] = [];
  try {
    rows = await prisma.application.findMany({
      where: { userId },
      orderBy: [{ status: "asc" }, { collegeName: "asc" }],
    });
  } catch (err) {
    console.error("[tracker] findMany failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ applications: rows });
}

export async function POST(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const parsed = await parseJsonBody(req, addSchema);
  if ("response" in parsed) return parsed.response;
  const { collegeSlug, applicationRound } = parsed.data;

  const college = findCollege(collegeSlug);
  if (!college) {
    return NextResponse.json(
      { error: `Unknown college slug: ${collegeSlug}` },
      { status: 400 }
    );
  }

  // Upsert because the (userId, collegeSlug) pair is unique. If the
  // student adds the same school twice, treat it as a no-op rather than
  // returning a 409 — the UI lets them add from a search box, and a
  // hard error would feel like a bug.
  const row = await prisma.application.upsert({
    where: { userId_collegeSlug: { userId, collegeSlug } },
    create: {
      userId,
      collegeSlug,
      collegeName: college.name,
      applicationRound: applicationRound ?? null,
    },
    update: {
      // Don't overwrite status / sub-task progress on duplicate add. Only
      // update the round if the user explicitly passed a new one.
      applicationRound: applicationRound ?? undefined,
    },
  });

  return NextResponse.json({ application: row }, { status: 201 });
}
