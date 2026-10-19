import { isValidReferralCode } from "@/lib/referral-code";

/** Live production origin (verified resolving 2026-10-18). */
export const CANONICAL_PRODUCTION_URL = "https://admith.vercel.app";

function cleanOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  const raw = value.replace(/﻿/g, "").trim().replace(/\/+$/, "");
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Public origin for links we hand to users (referral links, emails).
 * Order: NEXT_PUBLIC_APP_URL (the configured custom/production domain) →
 * the current request origin → the canonical production URL. Never a
 * hard-coded domain that may not resolve (the old admitpath.* links did not).
 */
export function getPublicAppUrl(requestOrigin?: string | null): string {
  return cleanOrigin(process.env.NEXT_PUBLIC_APP_URL)
    ?? cleanOrigin(requestOrigin)
    ?? CANONICAL_PRODUCTION_URL;
}

export function buildReferralUrl(code: string, requestOrigin?: string | null): string {
  if (!isValidReferralCode(code)) {
    throw new TypeError("Cannot build a referral URL from an invalid code");
  }
  return `${getPublicAppUrl(requestOrigin)}/r/${encodeURIComponent(code)}`;
}
