import { createHmac } from "crypto";

export type ShareParams = {
  score: number;
  spike: number;
  academic: number;
  leadership: number;
  awards: number;
  depth: number;
  essay: number;
  recs: number;
  name: string;
};

/** Clamp a dimension score to the valid 0-100 range. */
function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Sanitize name to prevent injection in URLs / HMAC payloads. */
function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9 .'-]/g, "").trim().slice(0, 100);
}

/**
 * Generate an HMAC-SHA256 signature for share card URLs.
 * This prevents users from fabricating score cards with arbitrary values.
 *
 * When SHARE_HMAC_SECRET is not set, returns undefined (dev mode — no signing).
 */
export function signShareParams(params: ShareParams): string | undefined {
  const secret = process.env.SHARE_HMAC_SECRET;
  if (!secret) return undefined;

  const sanitized = {
    academic: clampScore(params.academic),
    awards: clampScore(params.awards),
    depth: clampScore(params.depth),
    essay: clampScore(params.essay),
    leadership: clampScore(params.leadership),
    name: sanitizeName(params.name),
    recs: clampScore(params.recs),
    score: clampScore(params.score),
    spike: clampScore(params.spike),
  };

  // Must match the key order in /api/share verification (alphabetical)
  const message = [
    `academic=${sanitized.academic}`,
    `awards=${sanitized.awards}`,
    `depth=${sanitized.depth}`,
    `essay=${sanitized.essay}`,
    `leadership=${sanitized.leadership}`,
    `name=${sanitized.name}`,
    `recs=${sanitized.recs}`,
    `score=${sanitized.score}`,
    `spike=${sanitized.spike}`,
  ].join("&");

  return createHmac("sha256", secret).update(message).digest("hex");
}

/**
 * Verify a share URL signature. Returns true if the signature matches.
 */
export function verifyShareSignature(params: ShareParams, sig: string): boolean {
  const expected = signShareParams(params);
  if (!expected) return false; // No secret set — can't verify
  if (sig.length !== expected.length) return false;
  // Constant-time comparison to prevent timing attacks
  try {
    const { timingSafeEqual } = require("crypto") as typeof import("crypto");
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return sig === expected;
  }
}

/**
 * Build a full signed share URL for a score card.
 */
export function buildSignedShareUrl(
  baseUrl: string,
  params: {
    score: number;
    spike: number;
    academic: number;
    leadership: number;
    awards: number;
    depth: number;
    essay: number;
    recs: number;
    name: string;
  },
): string {
  const url = new URL("/api/share", baseUrl);
  url.searchParams.set("score", String(params.score));
  url.searchParams.set("spike", String(params.spike));
  url.searchParams.set("academic", String(params.academic));
  url.searchParams.set("leadership", String(params.leadership));
  url.searchParams.set("awards", String(params.awards));
  url.searchParams.set("depth", String(params.depth));
  url.searchParams.set("essay", String(params.essay));
  url.searchParams.set("recs", String(params.recs));
  url.searchParams.set("name", params.name);

  const sig = signShareParams(params);
  if (sig) {
    url.searchParams.set("sig", sig);
  }

  return url.toString();
}
