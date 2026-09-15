import { prisma } from "../lib/prisma";
import { ENTITLEMENT_SOURCE } from "../lib/utils";

const apply = process.argv.includes("--apply");

async function main() {
  const trialing = await prisma.subscription.findMany({
    where: { status: "trialing", deletedAt: null },
    select: {
      id: true,
      stripeSubId: true,
      userId: true,
      plan: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      user: {
        select: {
          isInternal: true,
          entitlementSource: true,
          entitlementExpiresAt: true,
        },
      },
    },
  });

  const now = new Date();
  const liveTrials = trialing.filter((subscription) => subscription.currentPeriodEnd > now);
  console.log(JSON.stringify({
    mode: apply ? "apply" : "dry-run",
    policy: "GRANDFATHER_EXISTING_TRIALS",
    trialingSubscriptions: trialing.length,
    liveTrials: liveTrials.length,
    expiredTrialRows: trialing.length - liveTrials.length,
    stripeMutations: 0,
    stripeChargesCreated: 0,
  }));
  if (!apply) return;

  for (const subscription of liveTrials) {
    if (subscription.user.isInternal || subscription.user.entitlementSource === ENTITLEMENT_SOURCE.MANUAL_GRANT) {
      continue;
    }
    await prisma.$transaction(async (tx) => {
      const existing = await tx.entitlement.findFirst({
        where: {
          source: ENTITLEMENT_SOURCE.LEGACY_TRIAL,
          stripeSubscriptionId: subscription.stripeSubId,
          status: "ACTIVE",
        },
        select: { id: true, endsAt: true },
      });
      const originalEnd = existing?.endsAt && existing.endsAt < subscription.currentPeriodEnd
        ? existing.endsAt
        : subscription.currentPeriodEnd;

      if (!existing) {
        await tx.entitlement.create({
          data: {
            userId: subscription.userId,
            plan: "pro",
            source: ENTITLEMENT_SOURCE.LEGACY_TRIAL,
            status: "ACTIVE",
            startsAt: subscription.currentPeriodStart,
            endsAt: originalEnd,
            stripeSubscriptionId: subscription.stripeSubId,
            actor: "maintenance:remove-pro-trials",
            reason: "Grandfather existing Stripe trial through its original end",
            metadata: { stripeMutated: false, stripeChargeCreated: false },
          },
        });
      }
      await tx.user.update({
        where: { id: subscription.userId },
        data: {
          plan: "pro",
          stripeSubscriptionId: subscription.stripeSubId,
          entitlementSource: ENTITLEMENT_SOURCE.LEGACY_TRIAL,
          entitlementExpiresAt: originalEnd,
        },
      });
      await tx.generation.create({
        data: {
          userId: subscription.userId,
          app: "admitpath",
          type: "legacy_trial_grandfathered",
          payload: {
            source: ENTITLEMENT_SOURCE.LEGACY_TRIAL,
            stripeSubscriptionId: subscription.stripeSubId,
            originalTrialEnd: originalEnd.toISOString(),
            stripeMutated: false,
            stripeChargeCreated: false,
          },
        },
      });
    });
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
