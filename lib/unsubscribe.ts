import { createHmac, timingSafeEqual } from "crypto";

function unsubscribeSecret(): string | null {
  const value = process.env.UNSUBSCRIBE_SECRET;
  if (value && value.trim().length >= 32) return value.trim();
  if (process.env.NODE_ENV !== "production") return "dev-unsubscribe-secret-32-chars";
  return null;
}

export function createUnsubscribeToken(email: string): string | null {
  const secret = unsubscribeSecret();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(email.trim().toLowerCase())
    .digest("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = createUnsubscribeToken(email);
  if (!expected) return false;
  const actualBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length
    && timingSafeEqual(actualBuffer, expectedBuffer);
}
