import { ARTICLES } from "@/data/articles";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

// Cache for 24h. Articles change infrequently.
export const revalidate = 86400;

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

export async function GET() {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const items = sorted
    .map(
      (a) => `    <item>
      <title>${escape(a.h1)}</title>
      <link>${BASE}/blog/${a.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${a.slug}</guid>
      <pubDate>${rfc822(a.publishedAt)}</pubDate>
      <description>${escape(a.description)}</description>
      <author>maestro.committee@gmail.com (AdmitPath team)</author>
      <category>${escape(a.primaryKeyword)}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AdmitPath Blog</title>
    <link>${BASE}/blog</link>
    <description>Honest, data-backed guides on college admissions strategy, essays, and stats.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>maestro.committee@gmail.com (AdmitPath team)</managingEditor>
    <webMaster>maestro.committee@gmail.com (AdmitPath team)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} AdmitPath</copyright>
    <generator>AdmitPath Next.js RSS</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>1440</ttl>
    <image>
      <url>${BASE}/apple-icon</url>
      <title>AdmitPath Blog</title>
      <link>${BASE}/blog</link>
      <width>180</width>
      <height>180</height>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
