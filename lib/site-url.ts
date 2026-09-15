import { isValidReferralCode } from "@/lib/referral-code";

export const CANONICAL_PRODUCTION_URL = "https://admith.vercel.app";

export function getPublicAppUrl(): string {
  return CANONICAL_PRODUCTION_URL;
}

export function buildReferralUrl(code: string): string {
  if (!isValidReferralCode(code)) {
    throw new TypeError("Cannot build a referral URL from an invalid code");
  }
  return `${CANONICAL_PRODUCTION_URL}/r/${encodeURIComponent(code)}`;
}
