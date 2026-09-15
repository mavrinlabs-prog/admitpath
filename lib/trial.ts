/**
 * Permanent Free-plan usage limits.
 *
 * The historical filename and counter column names are retained for a
 * backward-compatible rollout, but there is no time-based or no-card Pro
 * trial. Paid access requires Stripe or an audited manual entitlement.
 */

import { effectivePlan, type EffectivePlanUser, type Plan } from "@/lib/utils";

export type PlanFeature = "analyses" | "essays" | "chat" | "colleges";

export const PLAN_LIMITS = {
  free: {
    analyses: 5,
    essays: 5,
    chat: 5,
    colleges: 8,
  },
  pro: {
    analyses: 2000,
    essays: 2000,
    chat: 999999,
    colleges: 200,
  },
} as const satisfies Record<Plan, Record<PlanFeature, number>>;

export const FREE_LIMITS = PLAN_LIMITS.free;

export type FreePlanUser = {
  plan: Plan | string;
  analysisCount: number;
  /** Legacy database column: number of Free-plan essay uses. */
  trialEssayCount: number;
  /** Legacy database column: number of Free-plan chat uses. */
  trialChatCount: number;
  stripeSubscriptionId?: string | null;
  isInternal?: boolean;
  trialStartedAt?: Date | null;
};

export function getLimitForPlan(plan: Plan, feature: PlanFeature): number {
  return PLAN_LIMITS[plan][feature];
}

export type FreePlanStatus = {
  onFreePlan: boolean;
  active: boolean;
  usage: Record<PlanFeature, { used: number; limit: number; remaining: number; exhausted: boolean }>;
  allExhausted: boolean;
};

export function isFreePlan(plan: string | null | undefined): boolean {
  return plan === "free" || plan === "free_trial";
}

function usedCount(user: FreePlanUser, feature: PlanFeature): number {
  switch (feature) {
    case "analyses": return user.analysisCount ?? 0;
    case "essays": return user.trialEssayCount ?? 0;
    case "chat": return user.trialChatCount ?? 0;
    case "colleges": return 0;
  }
}

export function getFreePlanStatus(user: FreePlanUser, collegeCount = 0): FreePlanStatus {
  const onFreePlan = effectivePlan(user as EffectivePlanUser) === "free";
  const usage = (Object.keys(FREE_LIMITS) as PlanFeature[]).reduce((acc, feature) => {
    const limit = FREE_LIMITS[feature];
    const used = feature === "colleges" ? collegeCount : usedCount(user, feature);
    const remaining = Math.max(0, limit - used);
    acc[feature] = { used, limit, remaining, exhausted: used >= limit };
    return acc;
  }, {} as FreePlanStatus["usage"]);
  const allExhausted = Object.values(usage).every((item) => item.exhausted);
  return { onFreePlan, active: onFreePlan && !allExhausted, usage, allExhausted };
}

export type AccessResult =
  | { allowed: true; reason: "paid" | "free" }
  | { allowed: false; reason: "unauthenticated" | "free_limit_reached"; feature?: PlanFeature; upgradeUrl: string };

export function checkFeatureAccess(
  user: FreePlanUser | null,
  feature: PlanFeature,
  collegeCount = 0,
): AccessResult {
  if (!user) return { allowed: false, reason: "unauthenticated", upgradeUrl: "/sign-in" };
  if (effectivePlan(user as EffectivePlanUser) === "pro") {
    return { allowed: true, reason: "paid" };
  }
  const status = getFreePlanStatus(user, collegeCount);
  if (status.usage[feature].exhausted) {
    return { allowed: false, reason: "free_limit_reached", feature, upgradeUrl: "/pricing" };
  }
  return { allowed: true, reason: "free" };
}

export function accessDenialResponse(result: Extract<AccessResult, { allowed: false }>) {
  const unauthenticated = result.reason === "unauthenticated";
  const status = unauthenticated ? 401 : 429;
  const message = unauthenticated
    ? "Sign in required"
    : result.feature
      ? `You've used all ${FREE_LIMITS[result.feature]} ${result.feature} on the free plan. Upgrade to continue.`
      : "Free-plan limit reached. Upgrade to continue.";
  return {
    status,
    body: {
      error: message,
      reason: result.reason,
      feature: result.feature,
      upgradeUrl: result.upgradeUrl,
    },
  };
}
