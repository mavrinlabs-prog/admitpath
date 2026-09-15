/**
 * Seed coupon codes into the database.
 *
 * Usage: npx tsx scripts/seed-coupons.ts
 *
 * Reads codes from C:\Users\itmoh\codes\admitpath_codes.txt (one per line)
 * and inserts them as Coupon rows granting Pro plan.
 *
 * Admin email: maestro.committee@gmail.com
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const codesFile = path.resolve(__dirname, "..", "codes", "admitpath_codes.txt");
  const raw = fs.readFileSync(codesFile, "utf-8");
  const codes = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log(`Read ${codes.length} codes from ${codesFile}`);

  // Insert in batches of 500
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < codes.length; i += BATCH_SIZE) {
    const batch = codes.slice(i, i + BATCH_SIZE);
    await prisma.coupon.createMany({
      data: batch.map((code) => ({
        code,
        discountPct: null,
        freeMonths: 1,
        planGrant: "pro",
      })),
      skipDuplicates: true,
    });
    inserted += batch.length;
    console.log(`  Inserted ${inserted} / ${codes.length}`);
  }

  console.log(`Done. ${inserted} coupons seeded.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
