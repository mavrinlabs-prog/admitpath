import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

/**
 * Per-essay version history. Returns versions newest-first so the diff UI
 * can default to "compare latest two" without re-sorting client-side.
 *
 * Ownership check: we filter the parent essay by `userId + deletedAt: null`
 * before reading versions — a malicious id-guess against another user's
 * essay returns 404, not someone else's drafts.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const { id } = await params;

  const essay = await prisma.essay.findFirst({
    where: { id, userId, deletedAt: null },
    select: { id: true, prompt: true, college: true, version: true },
  });
  if (!essay) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const versions = await prisma.essayVersion.findMany({
    where: { essayId: id },
    orderBy: { version: "desc" },
    select: {
      id: true,
      version: true,
      score: true,
      wordCount: true,
      createdAt: true,
      // We intentionally do NOT return `content` or `feedback` here — those
      // are large columns and only needed when the user opens a specific
      // version. The detail route (below) loads them on demand.
    },
  });

  return NextResponse.json({ essay, versions }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
