// Deterministic secrets for unit tests only (never real credentials).
process.env.SESSION_SECRET ??= "unit-test-session-secret-0123456789abcdef";
process.env.REFERRAL_SECRET ??= "unit-test-referral-secret-0123456789abcd";
