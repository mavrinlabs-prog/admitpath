import { notFound } from "next/navigation";
import {
  getSitemapEntries,
  renderUrlSet,
  SITEMAP_SECTIONS,
  type SitemapSection,
} from "@/lib/seo-sitemaps";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section: sectionParam } = await params;
  const section = sectionParam.replace(/\.xml$/, "");
  if (!SITEMAP_SECTIONS.includes(section as SitemapSection)) notFound();

  return new Response(renderUrlSet(getSitemapEntries(section as SitemapSection)), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
