/**
 * IndexNow — instant search-engine indexing notifications.
 *
 * Call `submitToIndexNow(urls)` after publishing new content or updating
 * important pages. The IndexNow protocol notifies Bing, Yandex, and
 * Seznam simultaneously via a single POST to api.indexnow.org.
 *
 * Requires:
 *   - INDEXNOW_KEY env var (32-char hex key)
 *   - public/indexnow-key.txt containing the same key (ownership proof)
 *   - NEXT_PUBLIC_APP_URL env var for the host
 */

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

/**
 * Submit one or more URLs to the IndexNow API so search engines crawl
 * them immediately instead of waiting for the next scheduled crawl.
 *
 * Best-effort: never throws. Returns `true` if the API accepted the
 * submission, `false` otherwise (missing key, network error, etc.).
 */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.warn("[indexnow] INDEXNOW_KEY not set — skipping submission");
    return false;
  }

  if (urls.length === 0) return true;

  // Normalise: prefix relative paths with the app URL
  const absoluteUrls = urls.map((u) =>
    u.startsWith("http") ? u : `${APP_URL}${u.startsWith("/") ? "" : "/"}${u}`,
  );

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(APP_URL).host,
        key,
        keyLocation: `${APP_URL}/${key}.txt`,
        urlList: absoluteUrls,
      }),
    });

    if (res.ok || res.status === 202) {
      console.log(`[indexnow] submitted ${absoluteUrls.length} URL(s) — ${res.status}`);
      return true;
    }

    console.warn(`[indexnow] API returned ${res.status}: ${await res.text().catch(() => "")}`);
    return false;
  } catch (err) {
    console.warn("[indexnow] submission failed:", err);
    return false;
  }
}
