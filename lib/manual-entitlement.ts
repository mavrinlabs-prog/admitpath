import { prisma } from "@/lib/prisma";
import { ENTITLEMENT_SOURCE } from "@/lib/utils";

export type ManualGrantResult =
  | { found: false; applied: false }
  | {
      found: true;
      applied: boolean;
      userId: string;
      previousPlan: string;
      newPlan: "pro";
      grantedAt: string | null;
      entitlementId: string | null;
    };

export async function grantManualPro(
  email: string,
  actor: string,
  reason: string,
  options: { apply?: boolean } = {},
): Promise<ManualGrantResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const apply = options.apply === true;
  const normalizedActor = actor.trim();
  const normalizedReason = reason.trim();

  if (!normalizedEmail) throw new Error("A normalized account email is required.");
  if (apply && !normalizedActor) throw new Error("--actor is required with --apply.");
  if (apply && !normalizedReason) throw new Error("--reason is required with --apply.");

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, plan: true },
  });
  if (!existing) return { found: false, applied: false };

  if (!apply) {
    return {
      found: true,
      applied: false,
      userId: existing.id,
      previousPlan: existing.plan,
      newPlan: "pro",
      grantedAt: null,
      entitlementId: null,
    };
  }

  const grantedAt = new Date();
  const entitlementId = await prisma.$transaction(async (tx) => {
    const account = await tx.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (!account) throw new Error("Account no longer exists; grant was not applied.");

    const activeGrant = await tx.entitlement.findFirst({
      where: {
        userId: account.id,
        source: ENTITLEMENT_SOURCE.MANUAL_GRANT,
        status: "ACTIVE",
        revokedAt: null,
      },
      select: { id: true },
    });

    const entitlement = activeGrant ?? await tx.entitlement.create({
      data: {
        userId: account.id,
        plan: "pro",
        source: ENTITLEMENT_SOURCE.MANUAL_GRANT,
        status: "ACTIVE",
        startsAt: grantedAt,
        actor: normalizedActor,
        reason: normalizedReason,
        metadata: { stripeChargeCreated: false },
      },
      select: { id: true },
    });

    await tx.user.update({
      where: { id: account.id },
      data: {
        plan: "pro",
        isInternal: true,
        entitlementSource: ENTITLEMENT_SOURCE.MANUAL_GRANT,
        entitlementExpiresAt: null,
      },
    });
    await tx.generation.create({
      data: {
        userId: account.id,
        app: "admitpath",
        type: activeGrant ? "entitlement_manual_grant_reaffirmed" : "entitlement_manual_grant",
        payload: {
          source: ENTITLEMENT_SOURCE.MANUAL_GRANT,
          entitlementId: entitlement.id,
          previousPlan: existing.plan,
          newPlan: "pro",
          actor: normalizedActor,
          reason: normalizedReason,
          grantedAt: grantedAt.toISOString(),
          stripeChargeCreated: false,
        },
      },
    });
    return entitlement.id;
  });

  return {
    found: true,
    applied: true,
    userId: existing.id,
    previousPlan: existing.plan,
    newPlan: "pro",
    grantedAt: grantedAt.toISOString(),
    entitlementId,
  };
}
