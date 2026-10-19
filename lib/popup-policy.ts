/**
 * Smart popup trigger policy (pure, unit-tested).
 *
 * A marketing popup may open only when ALL of these hold:
 *   - visitor is signed out (never for signed-in or paid users);
 *   - the page is not an auth / checkout / billing / dashboard / legal page;
 *   - it is not the first paint: at least MIN_SECONDS on page, OR scroll
 *     depth >= MIN_SCROLL, OR a desktop exit-intent signal;
 *   - it has not been shown this browser session (max 1 per session);
 *   - it has not been shown in the last FREQUENCY_DAYS days;
 *   - it was not dismissed in the last DISMISS_DAYS days.
 */
export const POPUP_POLICY = {
  minSeconds: 25,
  minScroll: 0.5,
  frequencyDays: 7,
  dismissDays: 30,
} as const;

const SUPPRESSED_PREFIXES = [
  "/sign-in", "/sign-up", "/checkout", "/billing", "/dashboard", "/settings", "/admin",
  "/privacy", "/terms", "/cookie-policy", "/security", "/accessibility", "/r/",
  "/analyze", "/essays", "/chat", "/profile", "/offers",
];

export type PopupContext = {
  pathname: string;
  signedIn: boolean;
  isPaid?: boolean;
  secondsOnPage: number;
  scrollDepth: number;
  exitIntent: boolean;
  isDesktop: boolean;
  now: number;
  lastShownAt: number | null;
  dismissedAt: number | null;
  shownThisSession: boolean;
};

export type PopupDecision = { show: boolean; reason: string };

const DAY = 24 * 60 * 60 * 1000;

export function isSuppressedPath(pathname: string): boolean {
  return SUPPRESSED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`) || pathname === prefix.replace(/\/$/, ""));
}

export function shouldShowPopup(ctx: PopupContext): PopupDecision {
  if (ctx.signedIn || ctx.isPaid) return { show: false, reason: "signed_in" };
  if (isSuppressedPath(ctx.pathname)) return { show: false, reason: "suppressed_page" };
  if (ctx.shownThisSession) return { show: false, reason: "session_cap" };
  if (ctx.dismissedAt && ctx.now - ctx.dismissedAt < POPUP_POLICY.dismissDays * DAY) return { show: false, reason: "dismissed" };
  if (ctx.lastShownAt && ctx.now - ctx.lastShownAt < POPUP_POLICY.frequencyDays * DAY) return { show: false, reason: "frequency_cap" };
  const engaged = ctx.secondsOnPage >= POPUP_POLICY.minSeconds || ctx.scrollDepth >= POPUP_POLICY.minScroll;
  if (ctx.exitIntent && ctx.isDesktop && (engaged || ctx.secondsOnPage >= 8)) return { show: true, reason: "exit_intent" };
  if (ctx.secondsOnPage >= POPUP_POLICY.minSeconds && ctx.scrollDepth >= POPUP_POLICY.minScroll) return { show: true, reason: "engaged" };
  return { show: false, reason: "not_engaged" };
}

export const POPUP_STORAGE = {
  lastShown: "ap_popup_last_shown",
  dismissed: "ap_popup_dismissed",
  session: "ap_popup_session",
} as const;

export function readNumber(storage: Storage | null, key: string): number | null {
  try {
    const value = storage?.getItem(key);
    const n = value ? Number(value) : NaN;
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeValue(storage: Storage | null, key: string, value: string): void {
  try {
    storage?.setItem(key, value);
  } catch {
    // private mode / quota — popup simply won't be capped beyond this page view
  }
}

export function safeStorage(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}
