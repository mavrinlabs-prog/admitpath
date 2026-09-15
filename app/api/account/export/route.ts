import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitAPI, getClientIp } from "@/lib/rate-limit";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/account/export
 * Returns a single JSON download with the user's profile, analyses,
 * college list, and essays. Stripe identifiers are stripped from the
 * user object — they aren't useful to the user and shouldn't be
 * re-exposed in an exported file.
 */
export async function POST(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  // Rate-limit exports per user+IP. Without this, a compromised session can
  // spam export to (a) DoS the DB by triggering big findMany scans across
  // every user-data table, and (b) exfiltrate data faster than humans
  // could reasonably need (one snapshot per minute is plenty).
  const rl = await rateLimitAPI(`export:${userId}:${getClientIp(req)}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many export requests. Try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [profile, analyses, colleges, essays, applications] = await Promise.all([
    // findFirst + deletedAt: null — a tombstoned profile (e.g. from a prior
    // soft-delete + restore cycle) was being re-emitted into the export,
    // leaking data the user already chose to remove. Match the soft-delete
    // contract every other read on this table uses.
    prisma.profile.findFirst({ where: { userId, deletedAt: null } }),
    prisma.analysis.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.collegeList.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.essay.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    // Application has no deletedAt column — rows are hard-deleted via cascade
    // when the User is removed, or removed by the tracker UI directly. Include
    // unconditionally so the export covers every user-owned table.
    prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Strip Stripe identifiers from the exported user object.
  const {
    stripeCustomerId: _omitCustomer,
    stripeSubscriptionId: _omitSub,
    ...safeUser
  } = user;

  const payload = {
    exportedAt: new Date().toISOString(),
    user: safeUser,
    profile,
    analyses,
    colleges,
    essays,
    applications,
  };

  const date = new Date().toISOString().slice(0, 10);
  const filename = `admitpath-export-${userId}-${date}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
