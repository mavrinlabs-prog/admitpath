import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Canonical entitlement returned to application code. */
export type Plan = "free" | "pro";

export const ENTITLEMENT_SOURCE = {
  STRIPE_SUBSCRIPTION: "STRIPE_SUBSCRIPTION",
  LEGACY_TRIAL: "LEGACY_TRIAL",
  MANUAL_GRANT: "MANUAL_GRANT",
} as const;

export type EntitlementSource =
  (typeof ENTITLEMENT_SOURCE)[keyof typeof ENTITLEMENT_SOURCE];

export function isPaidPlan(plan: string | null | undefined): boolean {
  return plan === "pro" || plan === "plus"; // "plus" treated as legacy Pro
}

export function isProPlan(plan: string | null | undefined): boolean {
  return plan === "pro" || plan === "plus"; // "plus" treated as legacy Pro
}

export type EffectivePlanUser = {
  plan: string | null;
  stripeSubscriptionId: string | null;
  /** Deprecated storage retained only while the removal migration rolls out. */
  trialStartedAt?: Date | null;
  /** Legacy compatibility flag for protected staff/manual grants. */
  isInternal?: boolean;
  entitlementSource?: string | null;
  entitlementExpiresAt?: Date | string | null;
};

export function hasProtectedManualEntitlement(
  user: Pick<EffectivePlanUser, "isInternal" | "entitlementSource"> | null | undefined,
): boolean {
  return Boolean(
    user &&
    (user.entitlementSource === ENTITLEMENT_SOURCE.MANUAL_GRANT || user.isInternal),
  );
}

export function hasActiveLegacyTrial(
  user: Pick<EffectivePlanUser, "entitlementSource" | "entitlementExpiresAt"> | null | undefined,
  now = new Date(),
): boolean {
  if (
    !user ||
    user.entitlementSource !== ENTITLEMENT_SOURCE.LEGACY_TRIAL ||
    !user.entitlementExpiresAt
  ) {
    return false;
  }
  const expiresAt = new Date(user.entitlementExpiresAt);
  return Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() > now.getTime();
}

export function effectivePlan(
  user: EffectivePlanUser | null | undefined,
  now = new Date(),
): Plan {
  if (!user) return "free";
  // Explicit durable entitlement provenance is authoritative even if a stale
  // billing sync temporarily rewrites the legacy plan snapshot.
  if (hasProtectedManualEntitlement(user)) {
    return "pro";
  }
  if (hasActiveLegacyTrial(user, now)) {
    return "pro";
  }
  // An expired legacy trial must not fall through to the compatibility rule
  // merely because its historical Stripe subscription ID is still present.
  if (user.entitlementSource === ENTITLEMENT_SOURCE.LEGACY_TRIAL) {
    return "free";
  }
  // Backward compatible with paid rows created before entitlementSource was
  // introduced. Stripe lifecycle handlers maintain the source going forward.
  if (user.stripeSubscriptionId && (user.plan === "plus" || user.plan === "pro")) {
    return "pro";
  }
  return "free";
}

/** Human-readable plan label for UI display. */
export function planLabel(plan: Plan | string | null | undefined): string {
  switch (plan) {
    case "plus": return "Pro"; // legacy Plus → Pro
    case "pro": return "Pro";
    case "free": return "Free";
    default: return "Free";
  }
}

/**
 * Clamp a number to a range. Handles NaN by returning min.
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Format a number as currency (USD). Returns "$0" for invalid input.
 */
export function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
