ALTER TABLE "EssayVersion"
  ADD COLUMN IF NOT EXISTS "requestKey" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "EssayVersion_requestKey_key"
  ON "EssayVersion"("requestKey");
