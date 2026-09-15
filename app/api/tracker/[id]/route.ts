/**
 * Per-row tracker mutations.
 *
 * PATCH  /api/tracker/[id]   — update status / sub-tasks / round / notes
 * DELETE /api/tracker/[id]   — remove the tracked school
 *
 * Both routes verify the row belongs to the authenticated user before
 * mutating. We do this with `where: { id, userId }` so a leaked row id
 * never lets a different user touch it.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";

const ROUND_VALUES = ["ED", "EA", "REA", "RD", "RD_2", "rolling"] as const;
const STATUS_VALUES = [
  "not_started",
  "in_progress",
  "submitted",
  "accepted",
  "waitlisted",
  "rejected",
  "deferred",
  "withdrawn",
] as const;

const patchSchema = z
  .object({
    applicationRound: z.enum(ROUND_VALUES).nullable().optional(),
    status: z.enum(STATUS_VALUES).optional(),
    essaysDrafted: z.boolean().optional(),
    recsRequested: z.boolean().optional(),
    transcriptSent: z.boolean().optional(),
    fafsaSubmitted: z.boolean().optional(),
    // ISO-8601 string from the client; coerce to Date or null. Empty string
    // resets the field — handy for un-doing a click-locked decision date.
    decisionDate: z
      .union([z.string().datetime(), z.literal(""), z.null()])
      .optional(),
    notes: z.string().max(2000).nullable().optional(),
    // Outcome tracking fields
    financialAidAmount: z.number().min(0).nullable().optional(),
    enrolled: z.boolean().optional(),
    acceptedAt: z
      .union([z.string().datetime(), z.literal(""), z.null()])
      .optional(),
    rejectedAt: z
      .union([z.string().datetime(), z.literal(""), z.null()])
      .optional(),
    waitlistedAt: z
      .union([z.string().datetime(), z.literal(""), z.null()])
      .optional(),
    enrolledAt: z
      .union([z.string().datetime(), z.literal(""), z.null()])
      .optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field is required",
  });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const parsed = await parseJsonBody(req, patchSchema);
  if ("response" in parsed) return parsed.response;

  // Verify ownership before update — Prisma returns count: 0 if the
  // (id, userId) pair doesn't exist, which we map to 404.
  const data: Record<string, unknown> = { ...parsed.data };
  // Coerce ISO-8601 date strings to Date objects for Prisma.
  for (const dateField of [
    "decisionDate",
    "acceptedAt",
    "rejectedAt",
    "waitlistedAt",
    "enrolledAt",
  ] as const) {
    if (dateField in data) {
      const val = (parsed.data as Record<string, unknown>)[dateField];
      data[dateField] = val ? new Date(val as string) : null;
    }
  }

  // Auto-set outcome timestamps when status changes to a decision state.
  if ("status" in data) {
    const now = new Date();
    if (data.status === "accepted" && !("acceptedAt" in data)) {
      data.acceptedAt = now;
    }
    if (data.status === "rejected" && !("rejectedAt" in data)) {
      data.rejectedAt = now;
    }
    if (data.status === "waitlisted" && !("waitlistedAt" in data)) {
      data.waitlistedAt = now;
    }
  }

  const result = await prisma.application.updateMany({
    where: { id, userId },
    data,
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = await prisma.application.findUnique({ where: { id } });
  return NextResponse.json({ application: row });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const result = await prisma.application.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
