-- Backward-compatible preparation for the Free/Pro entitlement model.
-- Existing Stripe trials are grandfathered through their original period end.
-- This migration never cancels a Stripe subscription or creates a charge.
ALTER TABLE "User" ALTER COLUMN "plan" SET DEFAULT 'free';

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "entitlementSource" TEXT,
  ADD COLUMN IF NOT EXISTS "entitlementExpiresAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "Entitlement" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" TEXT NOT NULL DEFAULT 'pro',
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endsAt" TIMESTAMP(3),
  "stripeSubscriptionId" TEXT,
  "actor" TEXT,
  "reason" TEXT,
  "metadata" JSONB,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Entitlement_userId_status_idx" ON "Entitlement"("userId", "status");
CREATE INDEX IF NOT EXISTS "Entitlement_source_status_idx" ON "Entitlement"("source", "status");
CREATE INDEX IF NOT EXISTS "Entitlement_stripeSubscriptionId_idx" ON "Entitlement"("stripeSubscriptionId");
CREATE INDEX IF NOT EXISTS "Entitlement_endsAt_idx" ON "Entitlement"("endsAt");

UPDATE "User"
SET "plan" = 'free'
WHERE "plan" = 'free_trial';

-- Snapshot protected manual grants before reconciling Stripe access.
UPDATE "User"
SET
  "plan" = 'pro',
  "entitlementSource" = 'MANUAL_GRANT',
  "entitlementExpiresAt" = NULL
WHERE "isInternal" = TRUE
  AND "plan" IN ('plus', 'pro');

-- Preserve every locally known, still-running Stripe trial through the
-- original period end. currentPeriodEnd is captured once as the immutable
-- grandfathered expiry; later webhook updates may shorten but never extend it.
UPDATE "User" AS u
SET
  "plan" = 'pro',
  "stripeSubscriptionId" = s."stripeSubId",
  "entitlementSource" = 'LEGACY_TRIAL',
  "entitlementExpiresAt" = s."currentPeriodEnd"
FROM "Subscription" AS s
WHERE s."userId" = u."id"
  AND s."deletedAt" IS NULL
  AND s."status" = 'trialing'
  AND s."currentPeriodEnd" > CURRENT_TIMESTAMP
  AND u."isInternal" = FALSE;

-- Active paid subscriptions remain Pro.
UPDATE "User" AS u
SET
  "plan" = 'pro',
  "stripeSubscriptionId" = s."stripeSubId",
  "entitlementSource" = 'STRIPE_SUBSCRIPTION',
  "entitlementExpiresAt" = NULL
FROM "Subscription" AS s
WHERE s."userId" = u."id"
  AND s."deletedAt" IS NULL
  AND s."status" = 'active'
  AND u."isInternal" = FALSE;

-- Retire only stale no-card Pro/Plus rows. Manual grants, active paid access,
-- and grandfathered trial access are explicitly excluded.
UPDATE "User" AS u
SET
  "plan" = 'free',
  "stripeSubscriptionId" = NULL,
  "trialStartedAt" = NULL,
  "entitlementSource" = NULL,
  "entitlementExpiresAt" = NULL
WHERE u."isInternal" = FALSE
  AND u."plan" IN ('plus', 'pro')
  AND NOT EXISTS (
    SELECT 1
    FROM "Subscription" AS s
    WHERE s."userId" = u."id"
      AND s."deletedAt" IS NULL
      AND s."status" IN ('active', 'trialing')
      AND (s."status" <> 'trialing' OR s."currentPeriodEnd" > CURRENT_TIMESTAMP)
  );

UPDATE "User"
SET "trialStartedAt" = NULL
WHERE "trialStartedAt" IS NOT NULL
  AND "entitlementSource" IS DISTINCT FROM 'LEGACY_TRIAL';

-- Durable provenance for grandfathered trials and manual grants. NOT EXISTS
-- makes this safe to retry without duplicating active entitlement records.
INSERT INTO "Entitlement" (
  "id", "userId", "plan", "source", "status", "startsAt", "endsAt",
  "stripeSubscriptionId", "actor", "reason", "metadata", "createdAt", "updatedAt"
)
SELECT
  'legacy_trial_' || md5(u."id" || ':' || s."stripeSubId"),
  u."id", 'pro', 'LEGACY_TRIAL', 'ACTIVE',
  COALESCE(u."trialStartedAt", s."createdAt"), s."currentPeriodEnd",
  s."stripeSubId", 'migration',
  'Grandfathered existing Stripe trial through original trial end',
  jsonb_build_object('chargeCreated', false, 'originalTrialEnd', s."currentPeriodEnd"),
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User" AS u
JOIN "Subscription" AS s ON s."userId" = u."id"
WHERE s."deletedAt" IS NULL
  AND s."status" = 'trialing'
  AND s."currentPeriodEnd" > CURRENT_TIMESTAMP
  AND NOT EXISTS (
    SELECT 1 FROM "Entitlement" AS e
    WHERE e."source" = 'LEGACY_TRIAL'
      AND e."stripeSubscriptionId" = s."stripeSubId"
      AND e."status" = 'ACTIVE'
  );

INSERT INTO "Entitlement" (
  "id", "userId", "plan", "source", "status", "startsAt", "actor",
  "reason", "metadata", "createdAt", "updatedAt"
)
SELECT
  'manual_grant_' || md5(u."id"), u."id", 'pro', 'MANUAL_GRANT', 'ACTIVE',
  u."updatedAt", 'migration', 'Existing protected internal/manual entitlement',
  jsonb_build_object('stripeChargeCreated', false), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User" AS u
WHERE u."isInternal" = TRUE
  AND u."plan" IN ('plus', 'pro')
  AND NOT EXISTS (
    SELECT 1 FROM "Entitlement" AS e
    WHERE e."userId" = u."id"
      AND e."source" = 'MANUAL_GRANT'
      AND e."status" = 'ACTIVE'
  );

-- The route now fails closed on schema drift, so this column must be present.
ALTER TABLE "Profile"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- Essay request idempotency shipped after the original production table.
-- The unique index makes concurrent browser retries converge on one version.
ALTER TABLE "EssayVersion"
  ADD COLUMN IF NOT EXISTS "requestKey" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "EssayVersion_requestKey_key"
  ON "EssayVersion"("requestKey");
