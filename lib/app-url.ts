import { CANONICAL_PRODUCTION_URL } from "@/lib/site-url";

const DEFAULT_APP_URL = CANONICAL_PRODUCTION_URL;

function cleanUrlValue(value: string | undefined | null) {
  return value
    ?.replace(/^\xEF\xBB\xBF/, "")
    .replace(/^ï»¿/, "")
    .replace(/\uFEFF/g, "")
    .trim()
    .replace(/\/+$/, "");
}

export function getAppBaseUrl(fallback = DEFAULT_APP_URL) {
  const raw =
    cleanUrlValue(process.env.NEXT_PUBLIC_APP_URL) ||
    cleanUrlValue(process.env.VERCEL_URL) ||
    fallback;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return fallback;
  }
}

export function getAppUrl(path: string, fallback?: string) {
  return new URL(path, getAppBaseUrl(fallback));
}
