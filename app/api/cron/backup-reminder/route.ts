import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlert } from "@/lib/alert";
import { verifyCronSecret } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Weekly backup reminder cron. Fires a structured alert with:
 *   - Current DB row counts (users, profiles, essays, subscriptions)
 *   - Instructions for manual backup/export
 *   - Restore procedure reference
 *
 * Schedule in vercel.json: "0 8 * * 1" (Monday 8 AM UTC)
 *
 * This does NOT perform the backup itself -- Neon/Supabase/PlanetScale have
 * built-in point-in-time restore. This route ensures the operator remembers
 * to verify that backups are working and knows how to restore.
 */
export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = new Date().toISOString();

  // Gather row counts for the reminder
  let stats: Record<string, number | string> = {};
  try {
    const [userCount, profileCount, subscriptionCount] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.profile.count().catch(() => 0),
      prisma.subscription.count().catch(() => 0),
    ]);
    stats = {
      activeUsers: userCount,
      profiles: profileCount,
      subscriptions: subscriptionCount,
    };
  } catch (err) {
    stats = { error: err instanceof Error ? err.message : String(err) };
  }

  const backupGuide = {
    schedule: "Automated daily backups via database provider (Neon/Supabase). Verify in provider dashboard.",
    manualExport: {
      description: "Export all user data as JSON via the existing /api/account/export endpoint (per-user) or use pg_dump for full DB.",
      pgDump: "pg_dump $DATABASE_URL --format=custom --file=admitpath-backup-$(date +%Y%m%d).dump",
      restore: "pg_restore --dbname=$DATABASE_URL --clean admitpath-backup-YYYYMMDD.dump",
    },
    userDataExport: {
      endpoint: "GET /api/account/export (authenticated, returns user's own data as JSON)",
      adminBulk: "Run: npx prisma db pull && npx prisma db execute --stdin < export-script.sql",
    },
    verification: [
      "1. Log into your database provider dashboard",
      "2. Confirm the most recent automatic backup completed successfully",
      "3. Check that backup retention policy covers at least 7 days",
      "4. Test restore on a staging database at least once per quarter",
    ],
    retentionPolicy: "Keep daily backups for 7 days, weekly backups for 4 weeks, monthly backups for 12 months",
  };

  // Send the reminder alert
  void sendAlert({
    severity: "warn",
    scope: "backup.weekly-reminder",
    message: `Weekly backup reminder: ${stats.activeUsers ?? "unknown"} active users. Verify backups in provider dashboard.`,
    context: {
      ...stats,
      timestamp,
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Backup reminder sent",
    stats,
    backupGuide,
    timestamp,
  });
}
