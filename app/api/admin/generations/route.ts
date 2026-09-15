import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminUser } from "@/lib/admin-auth";

/**
 * GET /api/admin/generations - list generation records for internal QA review.
 * Gated by admin email check. Supports cursor pagination and app/type filters.
 *
 * Query params:
 *   - cursor: last generation id for pagination
 *   - app: filter by app name
 *   - type: filter by generation type
 *   - limit: page size (default 100, max 500)
 */
export async function GET(req: NextRequest) {
  const authorization = await authorizeAdminUser();
  if (!authorization.ok) {
    const error =
      authorization.status === 401
        ? "Unauthorized"
        : authorization.status === 403
          ? "Forbidden"
          : "Admin authorization unavailable";
    return NextResponse.json(
      { error },
      {
        status: authorization.status,
        headers: { "Cache-Control": "private, no-store, max-age=0" },
      },
    );
  }

  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const app = url.searchParams.get("app");
  const type = url.searchParams.get("type");
  const requestedLimit = Number(url.searchParams.get("limit") ?? "100");
  if (!Number.isInteger(requestedLimit) || requestedLimit < 1 || requestedLimit > 500) {
    return NextResponse.json(
      { error: "limit must be an integer between 1 and 500" },
      { status: 400 },
    );
  }
  if ((cursor?.length ?? 0) > 128 || (app?.length ?? 0) > 80 || (type?.length ?? 0) > 80) {
    return NextResponse.json({ error: "Invalid filter" }, { status: 400 });
  }
  const take = requestedLimit;

  const where: Record<string, unknown> = {};
  if (app) where.app = app;
  if (type) where.type = type;

  const generations = await prisma.generation.findMany({
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where,
    orderBy: { createdAt: "desc" },
  });

  const hasMore = generations.length > take;
  if (hasMore) generations.pop();

  return NextResponse.json(
    {
      success: true,
      data: generations,
      nextCursor: hasMore ? generations[generations.length - 1]?.id : null,
      count: generations.length,
    },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
