import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

const VALID_CATEGORIES = new Set(["reach", "target", "safety"]);

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  await prisma.collegeList.updateMany({
    where: { id, userId },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ deleted: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  let body: { category?: string };
  try {
    body = (await req.json()) as { category?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const category = body.category;
  if (!category || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const result = await prisma.collegeList.updateMany({
    where: { id, userId, deletedAt: null },
    data: { category },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ updated: true, category });
}
