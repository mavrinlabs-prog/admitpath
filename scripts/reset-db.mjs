/**
 * Production DB reset.
 * - Soft-deletes nothing; this is a HARD truncate of user data.
 * - Preserves nothing user-scoped — every row from User, Profile, Analysis,
 *   Essay, CollegeList, Subscription is removed.
 * - Run: node scripts/reset-db.mjs --confirm
 *
 * The Prisma client is loaded from ./node_modules so prisma/schema.prisma is
 * the source of truth. We use a single transaction so a partial wipe never
 * happens.
 */
import { PrismaClient } from "@prisma/client";

const args = new Set(process.argv.slice(2));
if (!args.has("--confirm")) {
  console.error("Refusing to run without --confirm flag.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const before = await snapshot();
  console.log("BEFORE:", before);

  // Order matters — children first to satisfy FK constraints. EssayVersion
  // → Essay (onDelete: Cascade handles this, but explicit is safer in a
  // truncation context); Application → User; StripeWebhookEvent is standalone
  // but should be wiped to reset idempotency state.
  const result = await prisma.$transaction([
    prisma.essayVersion.deleteMany({}),
    prisma.essay.deleteMany({}),
    prisma.analysis.deleteMany({}),
    prisma.collegeList.deleteMany({}),
    prisma.application.deleteMany({}),
    prisma.subscription.deleteMany({}),
    prisma.stripeWebhookEvent.deleteMany({}),
    prisma.profile.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  const after = await snapshot();
  console.log("DELETED counts (essay, analysis, collegeList, subscription, profile, user):", result.map((r) => r.count));
  console.log("AFTER:", after);
}

async function snapshot() {
  const [u, p, a, e, ev, c, app, s, wh] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count(),
    prisma.analysis.count(),
    prisma.essay.count(),
    prisma.essayVersion.count(),
    prisma.collegeList.count(),
    prisma.application.count(),
    prisma.subscription.count(),
    prisma.stripeWebhookEvent.count(),
  ]);
  return { users: u, profiles: p, analyses: a, essays: e, essayVersions: ev, colleges: c, applications: app, subscriptions: s, webhookEvents: wh };
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
