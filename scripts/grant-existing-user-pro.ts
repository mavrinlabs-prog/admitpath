import { grantManualPro } from "../lib/manual-entitlement";
import { prisma } from "../lib/prisma";

function option(name: string): string {
  const exact = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (exact) return exact.slice(name.length + 3).trim();
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? (process.argv[index + 1] ?? "").trim() : "";
}

const email = process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2].trim()
  : undefined;
const apply = process.argv.includes("--apply");
const actor = option("actor");
const reason = option("reason");
if (!email) {
  throw new Error(
    "Usage: npx tsx scripts/grant-existing-user-pro.ts <email> [--apply --actor <actor> --reason <reason>]",
  );
}
const targetEmail = email;
if (apply && (!actor || !reason)) {
  throw new Error("--apply requires explicit --actor and --reason values.");
}

async function main() {
  const result = await grantManualPro(
    targetEmail,
    actor,
    reason,
    { apply },
  );
  if (!result.found) {
    console.log("MANUAL_GRANT_NOT_APPLIED: account does not exist");
    process.exitCode = 2;
  } else {
    console.log(JSON.stringify({
      status: result.applied ? "MANUAL_GRANT_APPLIED" : "MANUAL_GRANT_DRY_RUN",
      previousPlan: result.previousPlan,
      newPlan: result.newPlan,
      grantedAt: result.grantedAt,
      entitlementId: result.entitlementId,
      stripeChargeCreated: false,
    }));
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
