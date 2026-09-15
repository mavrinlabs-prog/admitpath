import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret } from "@/lib/api-helpers";
import { sendWeeklyProgressEmail } from "@/lib/email";

export const runtime = "nodejs";

// Rate limiting — same constants as daily-emails
const EMAIL_DELAY_MS = 150;
const BATCH_SIZE = 100; // Process users in batches to avoid memory spikes

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const startTime = Date.now();

  if (!verifyCronSecret(req)) {
    console.warn("[cron/weekly-progress] unauthorized request blocked");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[cron/weekly-progress] starting weekly progress run");

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stats = { total: 0, sent: 0, skipped: 0, failed: 0, errors: [] as string[], durationMs: 0 };

  try {
    // Process in batches to handle large user lists without memory spikes
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const users = await prisma.user.findMany({
        where: {
          plan: { in: ["plus", "pro"] },
          updatedAt: { gte: oneWeekAgo },
          deletedAt: null,
        },
        select: { id: true, email: true, profile: true },
        take: BATCH_SIZE,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: "asc" },
      });

      if (users.length < BATCH_SIZE) {
        hasMore = false;
      }
      if (users.length > 0) {
        cursor = users[users.length - 1]!.id;
      }

      stats.total += users.length;

      for (const user of users) {
        try {
          const [analysesRun, essaysReviewed] = await Promise.all([
            prisma.analysis.count({
              where: { userId: user.id, createdAt: { gte: oneWeekAgo }, deletedAt: null },
            }),
            prisma.essay.count({
              where: { userId: user.id, updatedAt: { gte: oneWeekAgo }, deletedAt: null },
            }),
          ]);

          // Skip users with no activity — don't send empty progress emails
          if (analysesRun === 0 && essaysReviewed === 0) {
            stats.skipped++;
            continue;
          }

          // Compute profile completeness from 7 tracked fields
          const p = user.profile;
          const hasItems = (v: unknown) => Array.isArray(v) && v.length > 0;
          const profileFields: Array<unknown> = p
            ? [p.gpa, p.satScore ?? p.actScore, p.grade, p.state, hasItems(p.activities) || null, hasItems(p.awards) || null, p.intendedMajor]
            : [];
          const filled = profileFields.filter((v) => v !== null && v !== undefined && v !== false).length;
          const profileCompleteness = p ? Math.round((filled / 7) * 100) : 0;

          await sendWeeklyProgressEmail(user.email, {
            analysesRun,
            essaysReviewed,
            profileCompleteness,
            avgScoreChange: 0, // no per-week score delta stored yet
          });
          stats.sent++;
          await sleep(EMAIL_DELAY_MS);
        } catch (err) {
          stats.failed++;
          const errorName = err instanceof Error ? err.name : "UnknownError";
          stats.errors.push(errorName);
          console.error("[cron/weekly-progress] send failed", { errorName });
          // Error isolation: one user's failure doesn't block others
        }
      }
    }
  } catch (err) {
    console.error("[cron/weekly-progress] query failed", {
      errorName: err instanceof Error ? err.name : "UnknownError",
    });
    return NextResponse.json({ error: "Weekly progress job failed", durationMs: Date.now() - startTime }, { status: 500 });
  }

  stats.durationMs = Date.now() - startTime;

  // Trim error arrays for response size
  if (stats.errors.length > 10) {
    stats.errors = [...stats.errors.slice(0, 10), `... and ${stats.errors.length - 10} more`];
  }

  console.log("[cron/weekly-progress] completed", {
    total: stats.total,
    sent: stats.sent,
    skipped: stats.skipped,
    failed: stats.failed,
    durationMs: stats.durationMs,
  });

  return NextResponse.json(stats);
}
