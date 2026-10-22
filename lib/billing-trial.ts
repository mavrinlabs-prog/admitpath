/** New Pro subscribers get a Stripe-managed free trial on their first subscription only. */
export const PRO_TRIAL_DAYS = 7;

/** Active subscriptions and Stripe-managed trials grant Pro; delinquent ones do not. */
export function subscriptionGrantsPro(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

/** A customer gets the trial only if they have never had any subscription. */
export function isEligibleForProTrial(previousSubscriptionCount: number): boolean {
  return previousSubscriptionCount === 0;
}
