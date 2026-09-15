import { createHmac, timingSafeEqual } from "crypto";

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

type SessionPayload = SessionUser & {
  iat?: number;
  exp?: number;
};

function sessionSecret(): string | null {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (secret && secret.trim().length >= 32) return secret.trim();
  if (process.env.NODE_ENV !== "production") return "dev-session-secret";
  return null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function validSessionUser(value: unknown): SessionUser | null {
  if (!value || typeof value !== "object") return null;
  const user = value as Partial<SessionPayload>;
  if (typeof user.id !== "string" || typeof user.email !== "string") return null;
  if (typeof user.exp === "number" && user.exp < Math.floor(Date.now() / 1000)) return null;
  if (process.env.NODE_ENV === "production" && typeof user.exp !== "number") return null;
  return {
    id: user.id,
    email: user.email,
    name: typeof user.name === "string" ? user.name : undefined,
    picture: typeof user.picture === "string" ? user.picture : undefined,
  };
}

export function encodeSessionCookie(user: SessionUser): string {
  const secret = sessionSecret();
  if (!secret) throw new Error("Missing SESSION_SECRET (minimum 32 characters) for signed sessions");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  })).toString("base64url");
  return `v1.${payload}.${sign(payload, secret)}`;
}

export { SESSION_MAX_AGE_SECONDS };

export function parseSessionCookieValue(value: string | undefined | null): SessionUser | null {
  if (!value) return null;

  if (value.startsWith("v1.")) {
    const [, payload, signature] = value.split(".");
    const secret = sessionSecret();
    if (!payload || !signature || !secret) return null;

    const expected = sign(payload, secret);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
      return null;
    }

    try {
      return validSessionUser(JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")));
    } catch {
      return null;
    }
  }

  if (process.env.NODE_ENV === "production") return null;

  try {
    const raw = value.startsWith("{") ? value : Buffer.from(value, "base64").toString("utf-8");
    return validSessionUser(JSON.parse(raw));
  } catch {
    return null;
  }
}
