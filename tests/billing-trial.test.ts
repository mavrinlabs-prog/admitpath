import { describe, expect, it } from "vitest";
import { PRO_TRIAL_DAYS, isEligibleForProTrial, subscriptionGrantsPro } from "../lib/billing-trial";

describe("billing trial", () => {
  it("grants Pro for active and trialing subscriptions only", () => {
    expect(subscriptionGrantsPro("active")).toBe(true);
    expect(subscriptionGrantsPro("trialing")).toBe(true);
    expect(subscriptionGrantsPro("past_due")).toBe(false);
    expect(subscriptionGrantsPro("canceled")).toBe(false);
    expect(subscriptionGrantsPro(undefined)).toBe(false);
  });

  it("offers the 7-day trial only on a customer's first subscription", () => {
    expect(PRO_TRIAL_DAYS).toBe(7);
    expect(isEligibleForProTrial(0)).toBe(true);
    expect(isEligibleForProTrial(2)).toBe(false);
  });
});
