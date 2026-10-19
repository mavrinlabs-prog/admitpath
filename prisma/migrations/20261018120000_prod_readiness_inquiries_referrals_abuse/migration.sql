-- Prod-readiness 2026-10-18. Additive and idempotent: safe to re-run, no data
-- is rewritten or dropped. Apply with `npx prisma migrate deploy` (or run this
-- file against the production database) BEFORE deploying the matching code.

-- Anti-abuse signals on User (raw IPs are never stored; only salted hashes).
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "normalizedEmail" TEXT,
  ADD COLUMN IF NOT EXISTS "signupIpHash" TEXT,
  ADD COLUMN IF NOT EXISTS "abuseSignals" JSONB,
  ADD COLUMN IF NOT EXISTS "abuseReviewStatus" TEXT DEFAULT 'clear';

CREATE INDEX IF NOT EXISTS "User_normalizedEmail_idx" ON "User"("normalizedEmail");
CREATE INDEX IF NOT EXISTS "User_deviceId_idx" ON "User"("deviceId");
CREATE INDEX IF NOT EXISTS "User_signupIpHash_idx" ON "User"("signupIpHash");

-- Referral: referee one-time 50% promotion code + referrer reward code.
ALTER TABLE "Referral"
  ADD COLUMN IF NOT EXISTS "refereeCouponId" TEXT,
  ADD COLUMN IF NOT EXISTS "refereePromoCodeId" TEXT,
  ADD COLUMN IF NOT EXISTS "refereePromoCode" TEXT,
  ADD COLUMN IF NOT EXISTS "refereeDiscountPct" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS "checkoutSessionId" TEXT,
  ADD COLUMN IF NOT EXISTS "checkoutStartedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "redeemedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rewardCouponId" TEXT,
  ADD COLUMN IF NOT EXISTS "rewardPromoCodeId" TEXT,
  ADD COLUMN IF NOT EXISTS "rewardCode" TEXT,
  ADD COLUMN IF NOT EXISTS "rewardStatus" TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS "rewardGeneratedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rewardEmailedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "blockedReason" TEXT;

CREATE INDEX IF NOT EXISTS "Referral_refereePromoCodeId_idx" ON "Referral"("refereePromoCodeId");
CREATE INDEX IF NOT EXISTS "Referral_rewardStatus_idx" ON "Referral"("rewardStatus");

-- School / counselor inquiries.
CREATE TABLE IF NOT EXISTS "SchoolInquiry" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "schoolName" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "phone" TEXT,
  "studentCount" INTEGER,
  "timeline" TEXT,
  "needs" JSONB,
  "message" TEXT,
  "audience" TEXT NOT NULL DEFAULT 'school',
  "sourcePage" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "emailDelivered" BOOLEAN NOT NULL DEFAULT false,
  "ipHash" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SchoolInquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SchoolInquiry_createdAt_idx" ON "SchoolInquiry"("createdAt");
CREATE INDEX IF NOT EXISTS "SchoolInquiry_status_idx" ON "SchoolInquiry"("status");
CREATE INDEX IF NOT EXISTS "SchoolInquiry_email_idx" ON "SchoolInquiry"("email");
