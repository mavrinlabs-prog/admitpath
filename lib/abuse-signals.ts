import { createHash, randomBytes } from "crypto";

/**
 * Privacy-respecting duplicate-account / abuse heuristics.
 *
 * What we use (all server-side, no fingerprinting scripts):
 *   - normalized account email (lowercase; Gmail dots and +aliases removed)
 *   - email local-part / display-name similarity between two accounts
 *   - an httpOnly random device token cookie (stored only as a SHA-256 hash)
 *   - a salted SHA-256 hash of the request IP (raw IPs are never stored)
 *   - shared Stripe customer IDs
 *   - existing admin review flags
 *
 * What we do NOT do: browsers cannot read MAC addresses and we never claim to.
 * No canvas/audio fingerprinting. Signals only FLAG accounts for review or
 * block a referral discount; they never delete accounts automatically.
 */

export const DEVICE_COOKIE = "ap_device";
export const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

/** Canonical email used for duplicate detection. */
export function normalizeEmail(email: string): string {
  const lower = email.trim().toLowerCase();
  const at = lower.lastIndexOf("@");
  if (at <= 0) return lower;
  let local = lower.slice(0, at);
  let domain = lower.slice(at + 1);
  const plus = local.indexOf("+");
  if (plus >= 0) local = local.slice(0, plus);
  if (GMAIL_DOMAINS.has(domain)) {
    local = local.replace(/\./g, "");
    domain = "gmail.com";
  }
  return `${local}@${domain}`;
}

function salt(): string {
  return process.env.ABUSE_HASH_SALT?.trim()
    || process.env.SESSION_SECRET?.trim()
    || "admitpath-dev-abuse-salt";
}

export function hashSignal(value: string): string {
  return createHash("sha256").update(salt()).update("\0").update(value).digest("hex").slice(0, 40);
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip || ip === "unknown") return null;
  return hashSignal(`ip:${ip.trim()}`);
}

export function newDeviceToken(): string {
  return randomBytes(24).toString("base64url");
}

export function hashDeviceToken(token: string | null | undefined): string | null {
  if (!token || token.length < 16 || token.length > 128) return null;
  return hashSignal(`device:${token}`);
}

export function getRequestIp(headers: Headers): string | null {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("x-real-ip")?.trim()
    || null;
}

/** Levenshtein distance, bounded for short strings. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length];
}

/** 0..1 similarity of two email local parts / names (1 = identical). */
export function similarity(a: string | null | undefined, b: string | null | undefined): number {
  const x = (a ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const y = (b ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!x || !y) return 0;
  const longest = Math.max(x.length, y.length);
  return 1 - editDistance(x, y) / longest;
}

export type AccountSignals = {
  id?: string;
  email: string;
  name?: string | null;
  deviceHash?: string | null;
  ipHash?: string | null;
  stripeCustomerId?: string | null;
  abuseReviewStatus?: string | null;
};

export type AbuseAssessment = {
  score: number;
  flags: string[];
  /** "allow" | "review" | "block" */
  decision: "allow" | "review" | "block";
};

/**
 * Compare two accounts (e.g. referrer vs referee) and decide whether they are
 * likely the same person. Pure + deterministic so it can be unit tested.
 */
export function assessPair(a: AccountSignals, b: AccountSignals): AbuseAssessment {
  const flags: string[] = [];
  let score = 0;
  if (a.id && b.id && a.id === b.id) {
    return { score: 100, flags: ["same_account"], decision: "block" };
  }
  if (normalizeEmail(a.email) === normalizeEmail(b.email)) {
    flags.push("same_normalized_email");
    score += 100;
  }
  if (a.deviceHash && b.deviceHash && a.deviceHash === b.deviceHash) {
    flags.push("same_device_token");
    score += 70;
  }
  if (a.stripeCustomerId && b.stripeCustomerId && a.stripeCustomerId === b.stripeCustomerId) {
    flags.push("same_stripe_customer");
    score += 100;
  }
  if (a.ipHash && b.ipHash && a.ipHash === b.ipHash) {
    // Shared IPs are common (schools, families, NAT) — weak signal alone.
    flags.push("same_ip_hash");
    score += 25;
  }
  const localA = a.email.split("@")[0];
  const localB = b.email.split("@")[0];
  const emailSim = similarity(localA, localB);
  if (emailSim >= 0.8) {
    flags.push("similar_email");
    score += 20;
  }
  if (a.name && b.name && similarity(a.name, b.name) >= 0.9) {
    flags.push("similar_name");
    score += 15;
  }
  if (a.abuseReviewStatus === "blocked" || b.abuseReviewStatus === "blocked") {
    flags.push("admin_blocked");
    score += 100;
  }
  const decision = score >= 70 ? "block" : score >= 35 ? "review" : "allow";
  return { score: Math.min(100, score), flags, decision };
}

/**
 * Sign-up heuristic: how many existing accounts share this person's signals.
 * `matches` are other accounts found by normalized email / device / IP hash.
 */
export function assessSignup(
  candidate: AccountSignals,
  matches: AccountSignals[],
  recentSignupsFromIp = 0,
): AbuseAssessment {
  const flags = new Set<string>();
  let score = 0;
  for (const match of matches) {
    const pair = assessPair(candidate, match);
    pair.flags.forEach((flag) => flags.add(flag));
    score = Math.max(score, pair.score);
  }
  if (recentSignupsFromIp >= 5) {
    flags.add("signup_burst_from_ip");
    score = Math.max(score, 50);
  }
  const decision = score >= 70 ? "review" : score >= 35 ? "review" : "allow";
  // Sign-up never hard-blocks automatically: a shared family laptop is normal.
  return { score: Math.min(100, score), flags: Array.from(flags), decision };
}
