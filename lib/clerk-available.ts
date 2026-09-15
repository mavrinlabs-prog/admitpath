/**
 * Returns true only when a real (non-localhost, non-placeholder) Clerk key is
 * configured.  Mirrors the checkClerkKey guard in app/layout.tsx so that
 * client components can skip rendering Clerk UI when Clerk isn't wired up
 * (e.g. local dev without valid keys).
 */
export function isClerkAvailable(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  if (!key.startsWith("pk_")) return false;
  if (key.includes("placeholder")) return false;
  try {
    const b64 = key.replace(/^pk_(test|live)_/, "");
    // Use atob in browser, Buffer in Node (both are available in Next.js)
    const decoded =
      typeof atob === "function"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf8");
    if (decoded.includes("localhost") || decoded.includes("example.com"))
      return false;
  } catch {
    return false;
  }
  return true;
}
