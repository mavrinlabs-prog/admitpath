CREATE TABLE "OneTimePurchase" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "checkoutSessionId" TEXT NOT NULL,
  "paymentIntentId" TEXT,
  "offerSlug" TEXT NOT NULL,
  "amountTotal" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'usd',
  "status" TEXT NOT NULL DEFAULT 'paid',
  "customerId" TEXT,
  "fulfilledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OneTimePurchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OneTimePurchase_checkoutSessionId_key" ON "OneTimePurchase"("checkoutSessionId");
CREATE UNIQUE INDEX "OneTimePurchase_paymentIntentId_key" ON "OneTimePurchase"("paymentIntentId");
CREATE INDEX "OneTimePurchase_userId_createdAt_idx" ON "OneTimePurchase"("userId", "createdAt");
CREATE INDEX "OneTimePurchase_offerSlug_status_idx" ON "OneTimePurchase"("offerSlug", "status");
CREATE INDEX "OneTimePurchase_customerId_idx" ON "OneTimePurchase"("customerId");
ALTER TABLE "OneTimePurchase" ADD CONSTRAINT "OneTimePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
