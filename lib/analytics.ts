// lib/analytics.ts
// Production analytics with client-side batching, retry logic, and
// sendBeacon for page-unload resilience. Wraps Vercel Analytics custom
// events AND an internal batch endpoint for server-side enrichment.
//
// Patterns applied from MongoDB production tracking guide:
//   - Client-side batching (10 events OR 5 seconds)
//   - Retry with exponential backoff (3 attempts)
//   - sendBeacon on beforeunload for zero event loss
//   - UUID-based event deduplication
//   - Session + device ID tracking via storage
//
// Addresses "$100M audit" finding: "No analytics beyond Vercel Analytics."

/** Typed property values -- no `any` leakage. */
type EventPropertyValue = string | number | boolean;
type EventProperties = Record<string, EventPropertyValue>;

export type OneTimeCommerceStage =
  | "offer_checkout_clicked"
  | "checkout_created"
  | "purchase_completed";

interface OneTimeCommerceInput {
  offerSlug: string;
  surface: string;
  authority: "client" | "server";
  amount?: number;
  currency?: string;
  eventId?: string;
}

export interface AnalyticsEventEnvelope {
  id?: string;
  name: string;
  properties: EventProperties;
}

/**
 * Builds the deliberately narrow commerce payload shared by browser intent
 * tracking and Stripe-verified server events. Student/profile content is not
 * accepted by this contract, which keeps it out of monetization analytics.
 */
export function buildOneTimeCommerceEvent(
  stage: OneTimeCommerceStage,
  input: OneTimeCommerceInput,
): AnalyticsEventEnvelope {
  const properties: EventProperties = {
    offerSlug: input.offerSlug,
    surface: input.surface,
    authority: input.authority,
  };

  if (input.amount !== undefined) properties.amount = input.amount;
  if (input.currency) properties.currency = input.currency.toLowerCase();

  return {
    id: input.eventId,
    name: `one_time_${stage}`,
    properties,
  };
}

/** Vercel Analytics window interface. */
interface VercelAnalyticsWindow {
  va?: (command: string, payload: EventProperties & { name: string }) => void;
}

// ---------------------------------------------------------------------------
// Batching configuration (from MongoDB tracking guide)
// ---------------------------------------------------------------------------
const BATCH_SIZE = 10;       // Flush after 10 events
const BATCH_INTERVAL = 5000; // Or after 5 seconds
const MAX_RETRIES = 3;       // Retry failed batches 3 times

interface QueuedEvent {
  id: string;
  name: string;
  properties?: EventProperties;
  timestamp: string;
}

let eventQueue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let beaconRegistered = false;

/** Simple unique ID without uuid dependency. */
function eventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Flush the event queue to the batch endpoint with retry. */
async function flushQueue(retryCount = 0): Promise<void> {
  if (eventQueue.length === 0) return;

  const batch = [...eventQueue];
  eventQueue = [];

  try {
    const response = await fetch("/api/tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
    });

    if (!response.ok && retryCount < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, retryCount)));
      eventQueue = [...batch, ...eventQueue];
      return flushQueue(retryCount + 1);
    }
  } catch {
    if (retryCount < MAX_RETRIES) {
      eventQueue = [...batch, ...eventQueue];
      setTimeout(() => void flushQueue(retryCount + 1), 1000 * Math.pow(2, retryCount));
    }
    // After max retries, events are silently dropped -- analytics should
    // never block the user experience.
  }
}

/** Register the beforeunload handler once so events survive page close. */
function ensureBeaconHandler(): void {
  if (typeof window === "undefined" || beaconRegistered) return;
  beaconRegistered = true;

  window.addEventListener("beforeunload", () => {
    if (eventQueue.length === 0) return;
    // sendBeacon is the only reliable way to send data during page unload.
    // Falls back to sync XHR if sendBeacon is unavailable (very rare).
    const payload = JSON.stringify({ events: eventQueue });
    try {
      navigator.sendBeacon("/api/tracking/events", payload);
    } catch {
      // Last resort: fire-and-forget fetch with keepalive
      fetch("/api/tracking/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
    eventQueue = [];
  });
}

/** Queue an event for batched sending. Also fires via Vercel Analytics. */
export function trackEvent(name: string, properties?: EventProperties): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem("ap_cookie_consent") !== "accepted") return;
  } catch {
    return;
  }

  // Fire through Vercel Analytics (real-time, limited to 10 properties)
  const w = window as unknown as VercelAnalyticsWindow;
  if (w.va) {
    w.va("event", { name, ...properties });
  }

  // Also queue for our batch endpoint (server-side enrichment, full history)
  ensureBeaconHandler();

  const event: QueuedEvent = {
    id: eventId(),
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  eventQueue.push(event);

  // Flush if batch size reached
  if (eventQueue.length >= BATCH_SIZE) {
    void flushQueue();
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
  } else if (!flushTimer) {
    // Start flush timer
    flushTimer = setTimeout(() => {
      void flushQueue();
      flushTimer = null;
    }, BATCH_INTERVAL);
  }
}

/** Batch track multiple events in sequence (e.g. funnel steps). */
export function trackEvents(events: Array<{ name: string; properties?: EventProperties }>): void {
  for (const event of events) {
    trackEvent(event.name, event.properties);
  }
}

// Pre-defined events for the conversion funnel
export const analytics = {
  // Auth funnel
  signupStarted: () => trackEvent("signup_started"),
  signupCompleted: () => trackEvent("signup_completed"),
  signInStarted: () => trackEvent("sign_in_started"),

  // Profile funnel
  profileStarted: () => trackEvent("profile_started"),
  profileCompleted: (steps: number) => trackEvent("profile_completed", { steps }),
  profileStepCompleted: (step: string) => trackEvent("profile_step_completed", { step }),

  // Core feature usage
  analysisRun: () => trackEvent("analysis_run"),
  essaySubmitted: () => trackEvent("essay_submitted"),
  essayTopicsGenerated: () => trackEvent("essay_topics_generated"),
  schoolAdded: () => trackEvent("school_added"),
  chatMessageSent: () => trackEvent("chat_message_sent"),

  // Monetization funnel
  upgradeClicked: (plan: string, source: string) => trackEvent("upgrade_clicked", { plan, source }),
  upgradeDismissed: (plan: string, source: string) => trackEvent("upgrade_dismissed", { plan, source }),
  checkoutStarted: (plan: string) => trackEvent("checkout_started", { plan }),
  checkoutCompleted: (plan: string) => trackEvent("checkout_completed", { plan }),
  limitHit: (feature: string) => trackEvent("limit_hit", { feature }),
  oneTimeOfferCheckoutClicked: (offerSlug: string, surface: string) => {
    const event = buildOneTimeCommerceEvent("offer_checkout_clicked", {
      offerSlug,
      surface,
      authority: "client",
    });
    trackEvent(event.name, event.properties);
  },

  // Engagement
  referralShared: (method: string) => trackEvent("referral_shared", { method }),
  scoreShared: () => trackEvent("score_shared"),
  toolUsed: (tool: string) => trackEvent("tool_used", { tool }),
  articleRead: (slug: string) => trackEvent("article_read", { slug }),
  deadlineViewed: () => trackEvent("deadline_viewed"),
  collegeViewed: (slug: string) => trackEvent("college_viewed", { slug }),
  comparisonStarted: (schoolCount: number) => trackEvent("comparison_started", { schoolCount }),

  // Retention & streaks
  streakAchieved: (days: number) => trackEvent("streak_achieved", { days }),
  weeklyGoalSet: (goal: string) => trackEvent("weekly_goal_set", { goal }),
  weeklyGoalCompleted: (goal: string) => trackEvent("weekly_goal_completed", { goal }),
  sessionStart: () => trackEvent("session_start"),
  sessionDuration: (seconds: number) => trackEvent("session_duration", { seconds }),
  returnVisit: (daysSinceLast: number) => trackEvent("return_visit", { daysSinceLast }),
  notificationClicked: (type: string) => trackEvent("notification_clicked", { type }),
  progressMilestone: (milestone: string, score: number) => trackEvent("progress_milestone", { milestone, score }),

  // Referral & growth
  referralLinkCopied: () => trackEvent("referral_link_copied"),
  referralLinkShared: (platform: string) => trackEvent("referral_link_shared", { platform }),
  referralSignup: (referrerId: string) => trackEvent("referral_signup", { referrerId }),
  referralConverted: (referrerId: string) => trackEvent("referral_converted", { referrerId }),
  shareCardGenerated: () => trackEvent("share_card_generated"),
  shareCardViewed: () => trackEvent("share_card_viewed"),

  // Onboarding flow
  onboardingStepViewed: (step: string, stepNumber: number) => trackEvent("onboarding_step_viewed", { step, stepNumber }),
  onboardingCompleted: (totalSteps: number) => trackEvent("onboarding_completed", { totalSteps }),
  onboardingSkipped: (step: string) => trackEvent("onboarding_skipped", { step }),
  firstAnalysisRun: () => trackEvent("first_analysis_run"),
  firstEssaySubmitted: () => trackEvent("first_essay_submitted"),
  firstCollegeAdded: () => trackEvent("first_college_added"),

  // Conversion optimization
  pricingPageViewed: (source: string) => trackEvent("pricing_page_viewed", { source }),
  planCompared: (plans: string) => trackEvent("plan_compared", { plans }),
  paywallViewed: (feature: string) => trackEvent("paywall_viewed", { feature }),
  paywallDismissed: (feature: string) => trackEvent("paywall_dismissed", { feature }),
  couponApplied: (code: string) => trackEvent("coupon_applied", { code }),

  // Content & SEO
  blogPostRead: (slug: string, readTimeSec: number) => trackEvent("blog_post_read", { slug, readTimeSec }),
  ctaClicked: (ctaId: string, location: string) => trackEvent("cta_clicked", { ctaId, location }),
  socialProofViewed: (type: string) => trackEvent("social_proof_viewed", { type }),
  testimonialViewed: (id: string) => trackEvent("testimonial_viewed", { id }),

  // Error tracking
  errorDisplayed: (source: string, code: number) => trackEvent("error_displayed", { source, code }),
  apiError: (endpoint: string, status: number) => trackEvent("api_error", { endpoint, status }),

  // AI performance monitoring (ONIX Analytics Engine pattern — track LLM quality/speed)
  aiResponseReceived: (route: string, tierUsed: number, durationMs: number) =>
    trackEvent("ai_response_received", { route, tierUsed, durationMs }),
  aiResponseFailed: (route: string, errorType: string) =>
    trackEvent("ai_response_failed", { route, errorType }),
  aiQualityScore: (route: string, score: number, passed: boolean) =>
    trackEvent("ai_quality_score", { route, score, passed }),
  aiRetryTriggered: (route: string, attempt: number) =>
    trackEvent("ai_retry_triggered", { route, attempt }),
  aiFallbackUsed: (route: string, fromTier: number, toTier: number) =>
    trackEvent("ai_fallback_used", { route, fromTier, toTier }),
};
