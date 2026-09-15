const REFERRAL_CODE_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{22}$/;

export function isValidReferralCode(code: string): boolean {
  return REFERRAL_CODE_PATTERN.test(code);
}
