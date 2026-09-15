import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

/**
 * Single version detail — returns the full content + feedback JSON for a
 * specific version of an essay. Used by the side-by-side compare view.
 *
 * Ownership: we cross-check the parent essay's userId before serving the
 * version body, so id-guessing another user's draft text is blocked.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; version: string }> },
) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const { id, version } = await params;
  const versionNum = parseInt(version, 10);
  if (!Number.isFinite(versionNum) || versionNum < 1) {
    return NextResponse.json({ error: "Invalid version" }, { status: 400 });
  }

  // Single query joining essay → version. Gives us ownership + content in
  // one DB roundtrip. The orphan case (essay deleted but version still
  // exists) is impossible because EssayVersion has onDelete: Cascade.
  const v = await prisma.essayVersion.findFirst({
    where: {
      essayId: id,
      version: versionNum,
      essay: { userId, deletedAt: null },
    },
    select: {
      id: true,
      version: true,
      content: true,
      wordCount: true,
      feedback: true,
      score: true,
      createdAt: true,
    },
  });

  if (!v) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  return NextResponse.json(v, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
