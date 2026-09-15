/**
 * Seed script: provision internal/admin accounts as Pro users
 * with no billing (no Stripe charge).
 *
 * Usage: npx tsx scripts/seed-pro-user.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRO_ACCOUNTS = [
  { email: "mithran.loganathan.m@gmail.com", name: "Mithran" },
  { email: "astroslayer88@gmail.com", name: "AstroSlayer" },
];

async function main() {
  for (const account of PRO_ACCOUNTS) {
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        plan: "pro",
        isInternal: true,
      },
      create: {
        id: `admin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        email: account.email,
        name: account.name,
        plan: "pro",
        isInternal: true,
      },
    });

    console.log(`[seed-pro-user] ${account.email} set to Pro (isInternal=true). User ID: ${user.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
