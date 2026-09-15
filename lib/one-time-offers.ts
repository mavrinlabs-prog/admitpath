export const ONE_TIME_OFFERS = {
  "essay-deep-review": {
    slug: "essay-deep-review",
    name: "Essay Deep Review",
    priceLabel: "$49",
    amount: 4_900,
    priceEnv: "STRIPE_PRICE_ESSAY_REVIEW",
    summary: "A focused review of one college essay with prioritized revisions and next-step guidance.",
    includes: [
      "Narrative, structure, specificity, and voice review",
      "Prioritized revision plan",
      "One follow-up clarification by email",
    ],
    nextPath: "/essays",
    nextLabel: "Open my essays",
  },
  "complete-application-review": {
    slug: "complete-application-review",
    name: "Complete Application Review",
    priceLabel: "$149",
    amount: 14_900,
    priceEnv: "STRIPE_PRICE_APPLICATION_REVIEW",
    summary: "A holistic review of your profile, activities, college list, and application strategy.",
    includes: [
      "Profile and positioning review",
      "College-list balance check",
      "Prioritized application action plan",
    ],
    nextPath: "/profile/create",
    nextLabel: "Complete my profile",
  },
  "test-prep-strategy": {
    slug: "test-prep-strategy",
    name: "Test Prep Strategy Session",
    priceLabel: "$59",
    amount: 5_900,
    priceEnv: "STRIPE_PRICE_TEST_PREP_STRATEGY",
    summary: "A personalized SAT or ACT preparation plan with tutor-fit and study-resource guidance.",
    includes: [
      "SAT vs. ACT decision framework",
      "Weekly preparation roadmap",
      "Tutor and course-fit recommendations",
    ],
    nextPath: "/test-prep-guide",
    nextLabel: "Review test-prep resources",
  },
} as const;

export type OneTimeOfferSlug = keyof typeof ONE_TIME_OFFERS;
export type OneTimeOffer = (typeof ONE_TIME_OFFERS)[OneTimeOfferSlug];

export function getOneTimeOffer(value: string | null | undefined): OneTimeOffer | null {
  if (!value || !(value in ONE_TIME_OFFERS)) return null;
  return ONE_TIME_OFFERS[value as OneTimeOfferSlug];
}

export function getOfferPriceId(offer: OneTimeOffer): string | null {
  return process.env[offer.priceEnv]?.trim() || null;
}

export function getOfferByPriceId(priceId: string | null | undefined): OneTimeOffer | null {
  if (!priceId) return null;
  return Object.values(ONE_TIME_OFFERS).find((offer) => getOfferPriceId(offer) === priceId) ?? null;
}
