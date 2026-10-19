import { effectivePlan, type EffectivePlanUser, type Plan } from "@/lib/utils";
import { getFreePlanStatus, type FreePlanUser } from "@/lib/trial";

/**
 * SINGLE SOURCE OF TRUTH for what each plan can use.
 *
 * Plan resolution is `effectivePlan()` (Stripe subscription / manual grant /
 * legacy trial). Webhooks change the user's plan fields; every surface —
 * dashboard cards, page gates, API routes, admin — derives access from this
 * registry, so an upgrade (checkout, admin grant, coupon) unlocks and a
 * downgrade (subscription.deleted / updated to inactive) relocks everything
 * on the next request without any per-page logic.
 *
 * "metered" features are open to Free with usage caps (lib/trial.ts limits).
 * "pro" features require Pro. "free" features are open to every signed-in user.
 */
export type FeatureAccess = "free" | "metered" | "pro";

export type FeatureKey =
  | "analyze"
  | "essays"
  | "chat"
  | "colleges"
  | "tools"
  | "resources"
  | "whatIf"
  | "thisWeek"
  | "outcomes"
  | "tracker"
  | "scholarshipMatches"
  | "summerPrograms"
  | "competitionMatches"
  | "interviewPractice"
  | "recLetters"
  | "parentView";

export type FeatureDef = {
  key: FeatureKey;
  label: string;
  href: string;
  access: FeatureAccess;
  description: string;
  /** API path prefixes this feature owns (enforced server-side). */
  apiPrefixes?: string[];
};

export const FEATURES: Record<FeatureKey, FeatureDef> = {
  analyze: { key: "analyze", label: "Profile analysis", href: "/analyze", access: "metered", description: "7-dimension score and action plan.", apiPrefixes: ["/api/analyze"] },
  essays: { key: "essays", label: "Essay feedback", href: "/essays", access: "metered", description: "Six-dimension essay review.", apiPrefixes: ["/api/essay"] },
  chat: { key: "chat", label: "AI counselor", href: "/chat", access: "metered", description: "Profile-aware planning chat.", apiPrefixes: ["/api/chat"] },
  colleges: { key: "colleges", label: "College list", href: "/colleges", access: "metered", description: "Reach, target, and likely schools." },
  tools: { key: "tools", label: "Tools", href: "/tools", access: "free", description: "Calculators, checklists, and planning guides." },
  resources: { key: "resources", label: "Guides", href: "/resources", access: "free", description: "Prompts, deadlines, FAFSA, and more." },
  whatIf: { key: "whatIf", label: "What-If Modeler", href: "/what-if", access: "pro", description: "See how GPA, SAT, or activity changes shift admission bands." },
  thisWeek: { key: "thisWeek", label: "This Week in Admissions", href: "/this-week", access: "pro", description: "Weekly deadlines, scholarship alerts, and tips." },
  outcomes: { key: "outcomes", label: "Report outcomes", href: "/outcomes", access: "pro", description: "Log decisions and compare with your plan.", apiPrefixes: ["/api/tracker/survey"] },
  tracker: { key: "tracker", label: "Application tracker", href: "/tracker", access: "pro", description: "Track essays, recs, transcripts, and decisions.", apiPrefixes: ["/api/tracker"] },
  scholarshipMatches: { key: "scholarshipMatches", label: "Scholarship matches", href: "/scholarships", access: "pro", description: "Scholarships ranked against your profile.", apiPrefixes: ["/api/scholarships/recommend"] },
  summerPrograms: { key: "summerPrograms", label: "Summer programs", href: "/summer", access: "pro", description: "Reach, target, and likely summer programs.", apiPrefixes: ["/api/summer-programs/recommend"] },
  competitionMatches: { key: "competitionMatches", label: "Competition matches", href: "/competitions", access: "pro", description: "Spike-building competitions for your major and grade.", apiPrefixes: ["/api/competitions/recommend"] },
  interviewPractice: { key: "interviewPractice", label: "Interview practice", href: "/interview-practice", access: "pro", description: "Mock interviews with AI feedback.", apiPrefixes: ["/api/interview"] },
  recLetters: { key: "recLetters", label: "Recommendation letters", href: "/rec-letters", access: "pro", description: "Track recommenders and generate brag sheets.", apiPrefixes: ["/api/rec-letter"] },
  parentView: { key: "parentView", label: "Parent view", href: "/parent", access: "pro", description: "Read-only progress summary for parents." },
};

export const PRO_FEATURES: FeatureDef[] = Object.values(FEATURES).filter((feature) => feature.access === "pro");

export type EntitlementUser = EffectivePlanUser & Partial<FreePlanUser>;

export type FeatureState = {
  key: FeatureKey;
  label: string;
  href: string;
  access: FeatureAccess;
  unlocked: boolean;
  reason: "pro" | "free" | "metered" | "metered_exhausted" | "requires_pro" | "signed_out";
};

export function planFor(user: EntitlementUser | null | undefined): Plan {
  return effectivePlan(user ?? null);
}

export function featureState(user: EntitlementUser | null | undefined, key: FeatureKey): FeatureState {
  const feature = FEATURES[key];
  const base = { key, label: feature.label, href: feature.href, access: feature.access };
  if (!user) return { ...base, unlocked: false, reason: "signed_out" };
  const plan = planFor(user);
  if (plan === "pro") return { ...base, unlocked: true, reason: "pro" };
  if (feature.access === "free") return { ...base, unlocked: true, reason: "free" };
  if (feature.access === "pro") return { ...base, unlocked: false, reason: "requires_pro" };
  // metered
  const meter = key === "analyze" ? "analyses" : key === "essays" ? "essays" : key === "chat" ? "chat" : null;
  if (meter && typeof user.analysisCount === "number") {
    const status = getFreePlanStatus(user as FreePlanUser);
    if (status.usage[meter].exhausted) return { ...base, unlocked: false, reason: "metered_exhausted" };
  }
  return { ...base, unlocked: true, reason: "metered" };
}

export function canUseFeature(user: EntitlementUser | null | undefined, key: FeatureKey): boolean {
  return featureState(user, key).unlocked;
}

export function getEntitlements(user: EntitlementUser | null | undefined) {
  const plan = planFor(user);
  const features = (Object.keys(FEATURES) as FeatureKey[]).map((key) => featureState(user, key));
  return { plan, features };
}

/** Find the Pro feature that owns an API path (for route-level enforcement). */
export function featureForApiPath(pathname: string): FeatureDef | null {
  for (const feature of PRO_FEATURES) {
    if (feature.apiPrefixes?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return feature;
  }
  return null;
}

export const UPGRADE_URL = "/checkout/pro";

/** Columns needed to evaluate entitlements — use in every Prisma `select`. */
export const ENTITLEMENT_USER_SELECT = {
  plan: true,
  stripeSubscriptionId: true,
  isInternal: true,
  entitlementSource: true,
  entitlementExpiresAt: true,
  trialStartedAt: true,
  analysisCount: true,
  trialEssayCount: true,
  trialChatCount: true,
} as const;
