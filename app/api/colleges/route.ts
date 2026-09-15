import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { checkFeatureAccess, accessDenialResponse } from "@/lib/trial";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { sanitizeUserInput } from "@/lib/api-quality";
import { parseSessionCookieValue } from "@/lib/session-cookie";
import { z } from "zod";

const addSchema = z.object({
  collegeName: z.string().min(1).max(200),
  category: z.enum(["reach", "target", "safety"]),
  // notes lands in CollegeList.notes (TEXT column). Cap at 2KB so a single
  // entry can't bloat the row to MB-scale.
  notes: z.string().max(2000).optional(),
});

// User-specific list — must never be cached on a CDN edge or browser.
const PRIVATE_NO_STORE = {
  "Cache-Control": "private, no-store, max-age=0",
} as const;

async function getSessionUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_user") || cookieStore.get("session");
    if (!session?.value) return null;
    return parseSessionCookieValue(session.value)?.id ?? null;
  } catch { return null; }
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: PRIVATE_NO_STORE });

  try {
    const colleges = await withRetry(() =>
      prisma.collegeList.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      }),
    );
    return NextResponse.json(colleges, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error("[colleges GET]", { error: err instanceof Error ? err.message : String(err), hasDbUrl: !!process.env.DATABASE_URL });
    const errMsg = err instanceof Error ? err.message.toLowerCase() : "";
    if (errMsg.includes("database unavailable") || errMsg.includes("prismaclient") || errMsg.includes("econnrefused") || errMsg.includes("p1001") || errMsg.includes("connection")) {
      return NextResponse.json({ error: "Service temporarily unavailable. Please try again in a moment." }, { status: 503, headers: { "Retry-After": "10" } });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again in a moment." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // requireUser folds the 401 + the soft-delete-aware 404 lookup. The
  // soft-delete filter prevents the (unlikely but real) race where Clerk auth
  // passes but the User row was tombstoned between auth and this query —
  // without it, checkFeatureAccess(null) silently defaulted to
  // "unauthenticated" (a soft trial-budget bypass surface).
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  const parsedBody = await parseJsonBody(req, addSchema);
  if ("response" in parsedBody) return parsedBody.response;
  const parsed = parsedBody;

  // Server-authoritative dedupe — the client comment claims the server is
  // authoritative on dupes, but it wasn't, so a quick double-click (or an
  // attacker bypassing the client) could create two CollegeList rows with
  // the same name and chew through the trial cap (8 colleges) on dupes.
  const trimmedName = sanitizeUserInput(parsed.data.collegeName.trim());

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Serialize list writes per user so simultaneous requests cannot both
      // observe the same count and create past the Free-plan limit.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`college-list:${userId}`}))`;

      const collegeCount = await tx.collegeList.count({ where: { userId, deletedAt: null } });
      const access = checkFeatureAccess(user, "colleges", collegeCount);
      if (!access.allowed) {
        return { kind: "denied" as const, denial: accessDenialResponse(access) };
      }

      const existing = await tx.collegeList.findFirst({
        where: {
          userId,
          deletedAt: null,
          collegeName: { equals: trimmedName, mode: "insensitive" },
        },
      });
      if (existing) return { kind: "duplicate" as const, name: existing.collegeName };

      const college = await tx.collegeList.create({
        data: {
          userId,
          collegeName: trimmedName,
          category: parsed.data.category,
          notes: parsed.data.notes ? sanitizeUserInput(parsed.data.notes) : undefined,
        },
      });
      return { kind: "created" as const, college };
    }, { maxWait: 5_000, timeout: 10_000 });

    if (result.kind === "denied") {
      return NextResponse.json(result.denial.body, { status: result.denial.status });
    }
    if (result.kind === "duplicate") {
      return NextResponse.json(
        { error: `"${result.name}" is already on your list.` },
        { status: 409 },
      );
    }
    return NextResponse.json(result.college);
  } catch (err) {
    console.error("[/api/colleges] POST create failed:", {
      error: err instanceof Error ? err.message : String(err),
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    const errMsg = err instanceof Error ? err.message.toLowerCase() : "";
    if (
      errMsg.includes("database unavailable") ||
      errMsg.includes("prismaclient failed") ||
      errMsg.includes("econnrefused") ||
      errMsg.includes("p1001") ||
      errMsg.includes("p1002") ||
      errMsg.includes("connection") ||
      errMsg.includes("etimedout")
    ) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again in a moment.", retryable: true },
        { status: 503, headers: { "Retry-After": "10" } },
      );
    }
    return NextResponse.json(
      { error: "Could not save school. Please retry.", retryable: true },
      { status: 500, headers: { "Retry-After": "10" } },
    );
  }
}
