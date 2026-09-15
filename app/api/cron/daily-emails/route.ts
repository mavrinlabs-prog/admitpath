import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret } from "@/lib/api-helpers";
import {
  sendProfileNudgeEmail,
  sendEssayTipEmail,
  sendDeadlineReminderEmail,
  sendOnboardingDay2Email,
  sendOnboardingDay4Email,
  sendOnboardingDay7Email,
  sendOnboardingDay14Email,
  sendDay1ScoreExplainerEmail,
  sendDay3HabitEmail,
  sendInactivityNudgeEmail,
  sendStreakMilestoneEmail,
} from "@/lib/email";

export const runtime = "nodejs";

// ─── Rate limiting ──────────────────────────────────────────────────
// Resend free tier: 100 emails/day, 1 email/second.
// Resend pro tier: 50k emails/month. We add a small delay between sends
// to respect the 1/sec burst limit and avoid 429s.
const EMAIL_DELAY_MS = 150; // 150ms between sends ~ 6.6 emails/sec max
const MAX_EMAILS_PER_RUN = 500; // Safety cap per flow

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Daily email-flow dispatcher. Runs once a day at 09:00 UTC (Vercel cron).
 *
 * Four orthogonal flows in one route:
 *   1. PROFILE NUDGE — under-50% profiles, alternate Tuesdays
 *   2. ESSAY TIP — Wednesdays, paid subscribers only
 *   3. DEADLINE REMINDER — applications hitting 30/14/7 days away
 *   4. ONBOARDING SEQUENCE — Day 2 / 4 / 7 / 14 after signup
 */
export async function GET(req: Request) {
  const startTime = Date.now();

  if (!verifyCronSecret(req)) {
    console.warn("[cron/daily-emails] unauthorized request blocked");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[cron/daily-emails] starting daily email run");

  const now = new Date();
  const dayOfWeek = now.getUTCDay();

  const results = {
    profileNudges: { eligible: 0, sent: 0, failed: 0, errors: [] as string[] },
    essayTips: { eligible: 0, sent: 0, failed: 0, skipped: false, errors: [] as string[] },
    deadlineReminders: { eligible: 0, sent: 0, failed: 0, errors: [] as string[] },
    onboarding: { eligible: 0, sent: 0, failed: 0, errors: [] as string[] },
    activationNudges: { eligible: 0, sent: 0, failed: 0, errors: [] as string[] },
    inactivity: { eligible: 0, sent: 0, failed: 0, errors: [] as string[] },
    streakReminders: { eligible: 0, sent: 0, failed: 0, errors: [] as string[] },
    durationMs: 0,
    totalEmailsSent: 0,
  };

  // ───────────────────────────────────────────────────────────────────
  // 1. PROFILE NUDGE — alternate Tuesdays, under-50% profiles
  // ───────────────────────────────────────────────────────────────────
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const epochWeek = Math.floor(now.getTime() / WEEK_MS);
  if (dayOfWeek === 2 && epochWeek % 2 === 0) {
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    try {
      const nudgeCandidates = await prisma.user.findMany({
        where: {
          deletedAt: null,
          createdAt: { lte: threeDaysAgo },
        },
        select: {
          id: true,
          email: true,
          name: true,
          profile: {
            select: {
              gpa: true,
              satScore: true,
              actScore: true,
              grade: true,
              state: true,
              activities: true,
              awards: true,
              intendedMajor: true,
            },
          },
        },
        take: MAX_EMAILS_PER_RUN,
      });

      for (const u of nudgeCandidates) {
        const p = u.profile;
        const hasItems = (v: unknown) => Array.isArray(v) && v.length > 0;
        const fields: Array<unknown> = p
          ? [
              p.gpa,
              p.satScore ?? p.actScore,
              p.grade,
              p.state,
              hasItems(p.activities) || null,
              hasItems(p.awards) || null,
              p.intendedMajor,
            ]
          : [];
        const filled = fields.filter((v) => v !== null && v !== undefined && v !== false).length;
        const pct = p ? Math.round((filled / 7) * 100) : 0;

        if (pct >= 50) continue;
        results.profileNudges.eligible++;

        const firstName = (u.name ?? "").split(" ")[0] || "there";
        try {
          await sendProfileNudgeEmail(u.email, firstName, pct);
          results.profileNudges.sent++;
          await sleep(EMAIL_DELAY_MS);
        } catch (err) {
          results.profileNudges.failed++;
          const msg = `user=${u.id}: ${String(err)}`;
          results.profileNudges.errors.push(msg);
          console.error("[cron/daily-emails] profile-nudge failed", msg);
          // Continue to next user — error isolation
        }
      }
    } catch (err) {
      console.error("[cron/daily-emails] profile-nudge query failed:", err);
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // 2. ESSAY TIP — Wednesdays only, paid subscribers only
  // ───────────────────────────────────────────────────────────────────
  if (dayOfWeek === 3) {
    try {
      const subscribers = await prisma.user.findMany({
        where: {
          deletedAt: null,
          plan: { in: ["plus", "pro"] },
        },
        select: { id: true, email: true, name: true },
        take: MAX_EMAILS_PER_RUN,
      });
      results.essayTips.eligible = subscribers.length;

      for (const u of subscribers) {
        const firstName = (u.name ?? "").split(" ")[0] || "there";
        try {
          await sendEssayTipEmail(u.email, firstName);
          results.essayTips.sent++;
          await sleep(EMAIL_DELAY_MS);
        } catch (err) {
          results.essayTips.failed++;
          const msg = `user=${u.id}: ${String(err)}`;
          results.essayTips.errors.push(msg);
          console.error("[cron/daily-emails] essay-tip failed", msg);
        }
      }
    } catch (err) {
      console.error("[cron/daily-emails] essay-tip query failed:", err);
    }
  } else {
    results.essayTips.skipped = true;
  }

  // ───────────────────────────────────────────────────────────────────
  // 3. DEADLINE REMINDER — applications at 30/14/7 days away
  // ───────────────────────────────────────────────────────────────────
  const DAY_MS = 24 * 60 * 60 * 1000;
  const buckets = [30, 14, 7];
  const activeStatuses = ["not_started", "in_progress", "deferred", "waitlisted"];

  try {
    const upperBound = new Date(now.getTime() + (30 + 0.5) * DAY_MS);
    const lowerBound = new Date(now.getTime() + (7 - 0.5) * DAY_MS);
    const apps = await prisma.application.findMany({
      where: {
        status: { in: activeStatuses },
        decisionDate: { gte: lowerBound, lte: upperBound },
      },
      select: {
        id: true,
        decisionDate: true,
        collegeName: true,
        user: { select: { id: true, email: true, name: true, deletedAt: true } },
      },
    });

    // Group by user, take the most-urgent bucket
    const perUser = new Map<string, { user: typeof apps[0]["user"]; daysLeft: number }>();
    for (const a of apps) {
      if (!a.user || a.user.deletedAt) continue;
      if (!a.decisionDate) continue;
      const daysLeft = Math.round((a.decisionDate.getTime() - now.getTime()) / DAY_MS);
      const matched = buckets.find((b) => Math.abs(daysLeft - b) <= 0.5);
      if (matched === undefined) continue;
      const existing = perUser.get(a.user.id);
      if (!existing || matched < existing.daysLeft) {
        perUser.set(a.user.id, { user: a.user, daysLeft: matched });
      }
    }
    results.deadlineReminders.eligible = perUser.size;

    for (const { user, daysLeft } of Array.from(perUser.values())) {
      if (!user) continue;
      const firstName = (user.name ?? "").split(" ")[0] || "there";
      try {
        await sendDeadlineReminderEmail(user.email, firstName, daysLeft);
        results.deadlineReminders.sent++;
        await sleep(EMAIL_DELAY_MS);
      } catch (err) {
        results.deadlineReminders.failed++;
        const msg = `user=${user.id}: ${String(err)}`;
        results.deadlineReminders.errors.push(msg);
        console.error("[cron/daily-emails] deadline-reminder failed", msg);
      }
    }
  } catch (err) {
    console.error("[cron/daily-emails] deadline-reminder query failed:", err);
  }

  // ───────────────────────────────────────────────────────────────────
  // 4. ONBOARDING SEQUENCE — Day 2 / 4 / 7 / 14 after signup
  // ───────────────────────────────────────────────────────────────────
  const onboardingDays = [
    { day: 2, send: sendOnboardingDay2Email },
    { day: 4, send: sendOnboardingDay4Email },
    { day: 7, send: sendOnboardingDay7Email },
    { day: 14, send: sendOnboardingDay14Email },
  ] as const;

  for (const { day, send } of onboardingDays) {
    const targetMin = new Date(now.getTime() - (day + 0.5) * DAY_MS);
    const targetMax = new Date(now.getTime() - (day - 0.5) * DAY_MS);

    try {
      const candidates = await prisma.user.findMany({
        where: {
          deletedAt: null,
          createdAt: { gte: targetMin, lte: targetMax },
        },
        select: {
          id: true,
          email: true,
          name: true,
          analysisCount: true,
        },
        take: MAX_EMAILS_PER_RUN,
      });

      for (const u of candidates) {
        results.onboarding.eligible++;
        const firstName = (u.name ?? "").split(" ")[0] || "there";
        try {
          await send(u.email, firstName);
          results.onboarding.sent++;
          await sleep(EMAIL_DELAY_MS);
        } catch (err) {
          results.onboarding.failed++;
          const msg = `user=${u.id} day=${day}: ${String(err)}`;
          results.onboarding.errors.push(msg);
          console.error(`[cron/daily-emails] onboarding-day${day} failed`, msg);
        }
      }
    } catch (err) {
      console.error(`[cron/daily-emails] onboarding-day${day} query failed:`, err);
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // 5. ACTIVATION NUDGES — Day 1 / Day 3 after signup
  // ───────────────────────────────────────────────────────────────────
  const activationNudgeDays = [
    { day: 1, send: (email: string, fn: string) => sendDay1ScoreExplainerEmail(email, fn) },
    { day: 3, send: (email: string, fn: string) => sendDay3HabitEmail(email, fn) },
  ] as const;

  for (const { day, send } of activationNudgeDays) {
    const targetMin = new Date(now.getTime() - (day + 0.5) * DAY_MS);
    const targetMax = new Date(now.getTime() - (day - 0.5) * DAY_MS);

    try {
      const candidates = await prisma.user.findMany({
        where: {
          deletedAt: null,
          createdAt: { gte: targetMin, lte: targetMax },
        },
        select: { id: true, email: true, name: true },
        take: MAX_EMAILS_PER_RUN,
      });

      for (const u of candidates) {
        results.activationNudges.eligible++;
        const firstName = (u.name ?? "").split(" ")[0] || "there";
        try {
          await send(u.email, firstName);
          results.activationNudges.sent++;
          await sleep(EMAIL_DELAY_MS);
        } catch (err) {
          results.activationNudges.failed++;
          const msg = `user=${u.id} day=${day}: ${String(err)}`;
          results.activationNudges.errors.push(msg);
        }
      }
    } catch (err) {
      console.error(`[cron/daily-emails] activation-nudge-day${day} query failed:`, err);
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // 6. DAY-7 INACTIVITY — users inactive for 7 days
  // ───────────────────────────────────────────────────────────────────
  try {
    const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS);
    const eightDaysAgo = new Date(now.getTime() - 8 * DAY_MS);
    // Users who signed up 8+ days ago, had activity between 7–8 days ago,
    // but none in the last 7 days.
    const inactiveUsers = await prisma.user.findMany({
      where: {
        deletedAt: null,
        createdAt: { lte: eightDaysAgo },
        updatedAt: { gte: eightDaysAgo, lte: sevenDaysAgo },
      },
      select: { id: true, email: true, name: true },
      take: MAX_EMAILS_PER_RUN,
    });

    for (const u of inactiveUsers) {
      results.inactivity.eligible++;
      const firstName = (u.name ?? "").split(" ")[0] || "there";
      try {
        await sendInactivityNudgeEmail(u.email, firstName, 7);
        results.inactivity.sent++;
        await sleep(EMAIL_DELAY_MS);
      } catch (err) {
        results.inactivity.failed++;
        const msg = `user=${u.id}: ${String(err)}`;
        results.inactivity.errors.push(msg);
      }
    }
  } catch (err) {
    console.error("[cron/daily-emails] inactivity query failed:", err);
  }

  // ───────────────────────────────────────────────────────────────────
  // 7. STREAK REMINDERS — users with multiple consecutive days of activity
  // ───────────────────────────────────────────────────────────────────
  try {
    const twoDaysAgo = new Date(now.getTime() - 2 * DAY_MS);
    const yesterday = new Date(now.getTime() - DAY_MS);
    // Users updated yesterday but not today — potential streak break
    const streakCandidates = await prisma.user.findMany({
      where: {
        deletedAt: null,
        updatedAt: { gte: twoDaysAgo, lte: yesterday },
        analysisCount: { gte: 3 },
      },
      select: { id: true, email: true, name: true, analysisCount: true },
      take: MAX_EMAILS_PER_RUN,
    });

    for (const u of streakCandidates) {
      results.streakReminders.eligible++;
      const firstName = (u.name ?? "").split(" ")[0] || "there";
      // Use analysisCount as a proxy for engagement streak
      const streakDays = Math.min(u.analysisCount, 30);
      if (streakDays < 3) continue;
      try {
        await sendStreakMilestoneEmail(u.email, firstName, streakDays);
        results.streakReminders.sent++;
        await sleep(EMAIL_DELAY_MS);
      } catch (err) {
        results.streakReminders.failed++;
        const msg = `user=${u.id}: ${String(err)}`;
        results.streakReminders.errors.push(msg);
      }
    }
  } catch (err) {
    console.error("[cron/daily-emails] streak-reminders query failed:", err);
  }

  results.totalEmailsSent =
    results.profileNudges.sent +
    results.essayTips.sent +
    results.deadlineReminders.sent +
    results.onboarding.sent +
    results.activationNudges.sent +
    results.inactivity.sent +
    results.streakReminders.sent;
  results.durationMs = Date.now() - startTime;

  // Trim error arrays for response size
  for (const flow of [results.profileNudges, results.essayTips, results.deadlineReminders, results.onboarding, results.activationNudges, results.inactivity, results.streakReminders]) {
    if (flow.errors.length > 10) {
      flow.errors = [...flow.errors.slice(0, 10), `... and ${flow.errors.length - 10} more`];
    }
  }

  console.log("[cron/daily-emails] completed", {
    totalSent: results.totalEmailsSent,
    durationMs: results.durationMs,
    profileNudges: results.profileNudges.sent,
    essayTips: results.essayTips.sent,
    deadlineReminders: results.deadlineReminders.sent,
    onboarding: results.onboarding.sent,
    activationNudges: results.activationNudges.sent,
    inactivity: results.inactivity.sent,
    streakReminders: results.streakReminders.sent,
  });

  return NextResponse.json(results);
}
