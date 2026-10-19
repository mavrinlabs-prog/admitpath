import { describe, expect, it } from "vitest";
import { canUseFeature, featureForApiPath, getEntitlements, PRO_FEATURES } from "@/lib/entitlements";
import { checkFeatureAccess, FREE_LIMITS } from "@/lib/trial";

const base = { plan: "free", stripeSubscriptionId: null, isInternal: false, entitlementSource: null, entitlementExpiresAt: null, analysisCount: 0, trialEssayCount: 0, trialChatCount: 0 };

describe("entitlements: single source of truth", () => {
  it("free user: Pro features locked, metered features open, free tools open", () => {
    expect(canUseFeature(base, "tracker")).toBe(false);
    expect(canUseFeature(base, "whatIf")).toBe(false);
    expect(canUseFeature(base, "analyze")).toBe(true);
    expect(canUseFeature(base, "tools")).toBe(true);
  });

  it("upgrade (webhook sets plan=pro + subscription) unlocks every Pro feature", () => {
    const pro = { ...base, plan: "pro", stripeSubscriptionId: "sub_123", entitlementSource: "STRIPE_SUBSCRIPTION" };
    const ent = getEntitlements(pro);
    expect(ent.plan).toBe("pro");
    expect(ent.features.every((f) => f.unlocked)).toBe(true);
  });

  it("downgrade (subscription.deleted clears plan/subscription) relocks everything", () => {
    const downgraded = { ...base, plan: "free", stripeSubscriptionId: null, entitlementSource: null };
    for (const feature of PRO_FEATURES) expect(canUseFeature(downgraded, feature.key)).toBe(false);
  });

  it("plan=pro without an active subscription does not grant Pro", () => {
    expect(getEntitlements({ ...base, plan: "pro" }).plan).toBe("free");
  });

  it("code/manual activation (MANUAL_GRANT) unlocks Pro without Stripe", () => {
    expect(getEntitlements({ ...base, entitlementSource: "MANUAL_GRANT" }).plan).toBe("pro");
  });

  it("expired legacy trial relocks", () => {
    const expired = { ...base, plan: "pro", stripeSubscriptionId: "sub_1", entitlementSource: "LEGACY_TRIAL", entitlementExpiresAt: new Date(Date.now() - 1000) };
    expect(getEntitlements(expired).plan).toBe("free");
  });

  it("free usage limit: 5 analyses then blocked with checkout upgrade URL", () => {
    const at = { ...base, analysisCount: FREE_LIMITS.analyses };
    const access = checkFeatureAccess(at, "analyses");
    expect(access.allowed).toBe(false);
    if (!access.allowed) expect(access.upgradeUrl).toBe("/checkout/pro");
    expect(canUseFeature(at, "analyze")).toBe(false);
    expect(checkFeatureAccess({ ...base, analysisCount: 4 }, "analyses").allowed).toBe(true);
  });

  it("maps Pro API paths to their feature", () => {
    expect(featureForApiPath("/api/tracker/abc")?.key).toBe("tracker");
    expect(featureForApiPath("/api/rec-letter/brag-sheet")?.key).toBe("recLetters");
    expect(featureForApiPath("/api/analyze")).toBeNull();
  });
});
