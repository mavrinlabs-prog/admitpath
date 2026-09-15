import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret } from "@/lib/api-helpers";

export const runtime = "nodejs";

function check(results: string[], name: string, pass: boolean, detail = "") {
  results.push(`${pass ? "PASS" : "FAIL"} ${name}${detail ? " -- " + detail : ""}`);
  return pass;
}

export async function GET(request: Request) {
  const startTime = Date.now();

  if (!verifyCronSecret(request)) {
    console.warn("[cron/audit/hourly] unauthorized request blocked");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[cron/audit/hourly] starting audit run");

  const results: string[] = [`# Hourly Audit -- admitpath`, `**Time:** ${new Date().toISOString()}`, ""];
  const ROOT = path.resolve(process.cwd());
  const stats = { passed: 0, failed: 0, gcCount: 0, durationMs: 0 };

  try {
    // ─── Environment variable checks ──────────────────────────────
    const checkEnvVar = (name: string) => !!(process.env[name]);
    check(results, "STRIPE_SECRET_KEY set", checkEnvVar("STRIPE_SECRET_KEY"));
    check(results, "STRIPE_WEBHOOK_SECRET set", checkEnvVar("STRIPE_WEBHOOK_SECRET"));
    check(results, "GOOGLE_CLIENT_ID set", checkEnvVar("GOOGLE_CLIENT_ID"));
    check(results, "GOOGLE_CLIENT_SECRET set", checkEnvVar("GOOGLE_CLIENT_SECRET"));
    check(results, "SESSION_SECRET set", (process.env.SESSION_SECRET ?? "").trim().length >= 32);
    check(results, "UNSUBSCRIBE_SECRET set", (process.env.UNSUBSCRIBE_SECRET ?? "").trim().length >= 32);
    check(results, "CEREBRAS_API_KEY set", checkEnvVar("CEREBRAS_API_KEY"));
    check(results, "CRON_SECRET set", checkEnvVar("CRON_SECRET"));
    check(results, "DATABASE_URL set", checkEnvVar("DATABASE_URL") && !(process.env.DATABASE_URL ?? "").includes("placeholder"));
    check(results, "RESEND_API_KEY set", checkEnvVar("RESEND_API_KEY") && !(process.env.RESEND_API_KEY ?? "").includes("placeholder"));
    check(results, "RESEND_AUDIENCE_ID set", checkEnvVar("RESEND_AUDIENCE_ID"));
    check(results, "Upstash rate limiting set", checkEnvVar("UPSTASH_REDIS_REST_URL") && checkEnvVar("UPSTASH_REDIS_REST_TOKEN"));

    const groqKeyCount = Array.from({ length: 40 }, (_, i) => process.env[`GROQ_API_KEY_${i + 1}`]).filter(Boolean).length;
    check(results, `Groq keys loaded (${groqKeyCount}/40)`, groqKeyCount >= 5, `${groqKeyCount} keys`);

    // ─── File system checks ───────────────────────────────────────
    const clPath = path.join(ROOT, "CHANGELOG.md");
    check(results, "CHANGELOG.md exists", fs.existsSync(clPath));

    // ─── Database health check ────────────────────────────────────
    try {
      const userCount = await prisma.user.count({ where: { deletedAt: null } });
      check(results, "Database reachable", true, `${userCount} active users`);
    } catch (dbErr) {
      check(results, "Database reachable", false, String(dbErr));
    }

    // ─── Check for orphaned data ──────────────────────────────────
    try {
      const orphanedProfiles = await prisma.profile.count({
        where: { user: { deletedAt: { not: null } }, deletedAt: null },
      });
      if (orphanedProfiles > 0) {
        results.push(`WARNING: ${orphanedProfiles} orphaned profiles (user soft-deleted but profile active)`);
      }
    } catch {
      // Relation query may fail if schema differs — non-fatal
    }

    // ─── Check for users with stale plan state ────────────────────
    try {
      const stalePaid = await prisma.user.count({
        where: {
          plan: { in: ["plus", "pro"] },
          stripeSubscriptionId: null,
          deletedAt: null,
        },
      });
      if (stalePaid > 0) {
        results.push(`WARNING: ${stalePaid} users with paid plan but no stripeSubscriptionId`);
      }
    } catch {
      // Non-fatal
    }

    // ─── GC: StripeWebhookEvent idempotency rows older than 30 days ──
    try {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const gc = await prisma.stripeWebhookEvent.deleteMany({
        where: { createdAt: { lt: cutoff } },
      });
      stats.gcCount = gc.count;
    } catch (gcErr) {
      results.push(`WARNING: Webhook-event GC failed: ${String(gcErr)}`);
    }
    if (stats.gcCount > 0) results.push(`GC: Cleaned ${stats.gcCount} stale webhook-event rows (>30d)`);

    // ─── Sitemap ping — best effort ─────────────────────────────
    const sitemapUrl = `${(process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app").trim().replace(/\/+$/, "")}/sitemap.xml`;
    await Promise.allSettled([
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`).catch(() => {}),
      fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`).catch(() => {}),
    ]).then((pings) => {
      const ok = pings.filter((p) => p.status === "fulfilled").length;
      results.push(`INFO: Sitemap ping sent (${ok}/2 succeeded)`);
    });

    stats.passed = results.filter((r) => r.startsWith("PASS")).length;
    stats.failed = results.filter((r) => r.startsWith("FAIL")).length;
    stats.durationMs = Date.now() - startTime;

    const report = results.join("\n");

    console.log("[cron/audit/hourly] completed", {
      passed: stats.passed,
      failed: stats.failed,
      gcCount: stats.gcCount,
      durationMs: stats.durationMs,
    });

    return NextResponse.json(
      { passed: stats.passed, failed: stats.failed, gcCount: stats.gcCount, durationMs: stats.durationMs, report },
      { status: stats.failed > 0 ? 207 : 200 },
    );
  } catch (err) {
    console.error("[cron/audit/hourly] unhandled error:", err);
    return NextResponse.json({ error: String(err), durationMs: Date.now() - startTime }, { status: 500 });
  }
}
