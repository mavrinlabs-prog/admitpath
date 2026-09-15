import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { diffWords, summarizeDiff } from "@/lib/essay-diff";

/**
 * Word-level diff between two versions of an essay.
 *
 * GET /api/essay/[id]/diff?from=N&to=M
 * Defaults: from = (latest - 1), to = latest. So calling with no params
 * gives the most useful diff (last revision pair) without the UI having to
 * fetch the version list first.
 *
 * Returns: { from, to, ops, summary, scoreDelta }
 *   ops      — array of {type: "equal"|"insert"|"delete", text}
 *   summary  — { wordsAdded, wordsRemoved, wordsKept, similarity }
 *   scoreDelta — number | null (newScore - oldScore)
 *
 * Ownership: same pattern as siblings — filter parent essay by userId +
 * deletedAt: null before reading versions.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const { id } = await params;
  const url = new URL(req.url);
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");

  const essay = await prisma.essay.findFirst({
    where: { id, userId, deletedAt: null },
    select: { id: true },
  });
  if (!essay) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const versions = await prisma.essayVersion.findMany({
    where: { essayId: id },
    orderBy: { version: "desc" },
    select: { version: true, content: true, score: true },
  });

  if (versions.length < 2) {
    return NextResponse.json(
      { error: "Need at least two versions to diff" },
      { status: 400 },
    );
  }

  // Default: previous-vs-latest. Most-useful default since the user just
  // saved a revision and wants to see what changed.
  const latestNum = versions[0].version;
  const prevNum = versions[1].version;
  const toNum = toParam ? parseInt(toParam, 10) : latestNum;
  const fromNum = fromParam ? parseInt(fromParam, 10) : prevNum;

  if (!Number.isFinite(fromNum) || !Number.isFinite(toNum) || fromNum === toNum) {
    return NextResponse.json({ error: "Invalid version range" }, { status: 400 });
  }

  const fromV = versions.find((v) => v.version === fromNum);
  const toV = versions.find((v) => v.version === toNum);
  if (!fromV || !toV) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  const ops = diffWords(fromV.content, toV.content);
  const summary = summarizeDiff(ops);
  const scoreDelta =
    typeof fromV.score === "number" && typeof toV.score === "number"
      ? Number((toV.score - fromV.score).toFixed(2))
      : null;

  return NextResponse.json(
    { from: fromNum, to: toNum, ops, summary, scoreDelta },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
