import type { MetadataRoute } from "next";
import { ARTICLES } from "@/data/articles";
import { COLLEGES } from "@/data/colleges";
import { COMPARISON_PAIRS } from "@/data/comparison-pairs";
import { FLORIDA_PAGES } from "@/data/seo-florida";
import { GUIDES } from "@/data/seo-guides";
import { MAJORS } from "@/data/seo-majors";
import { SCHOLARSHIPS } from "@/data/seo-scholarships";
import { TOOLS_PAGES } from "@/data/seo-tools";
import { ALL_STATES, STATE_SUBPAGES } from "@/data/seo-combo-pages";
import { SUPPLEMENTAL_ESSAYS } from "@/data/supplemental-essays";
import { getPublicAppUrl } from "@/lib/site-url";

export const SITEMAP_SECTIONS = ["core", "content", "colleges", "regional"] as const;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

const BASE = getPublicAppUrl();

function item(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  priority = 0.7,
): MetadataRoute.Sitemap[number] {
  return {
    url: path === "/" ? BASE : `${BASE}${path}`,
    changeFrequency,
    priority,
  };
}

const CORE_PATHS: Array<[string, MetadataRoute.Sitemap[number]["changeFrequency"], number]> = [
  ["/", "weekly", 1],
  ["/about", "yearly", 0.6],
  ["/accessibility", "yearly", 0.3],
  ["/admissions-jargon-decoder", "monthly", 0.7],
  ["/admissions-statistics-2026", "monthly", 0.8],
  ["/aid-comparison", "monthly", 0.8],
  ["/appeal-letter", "monthly", 0.8],
  ["/application-component-weighting", "monthly", 0.8],
  ["/blog", "weekly", 0.8],
  ["/calculator", "monthly", 0.9],
  ["/choose-a-major", "monthly", 0.8],
  ["/college", "weekly", 0.9],
  ["/college-acceptance-letter-decoder", "monthly", 0.7],
  ["/college-admissions-framework-2026", "monthly", 0.8],
  ["/college-application-checklist", "monthly", 0.9],
  ["/college-application-timeline-2026", "monthly", 0.9],
  ["/college-decision-comparison-guide", "monthly", 0.8],
  ["/college-decision-day", "monthly", 0.8],
  ["/college-essay-examples", "monthly", 0.8],
  ["/college-essay-revision-checklist", "monthly", 0.8],
  ["/college-essay-topic-finder", "monthly", 0.8],
  ["/college-list-builder", "monthly", 0.9],
  ["/college-rankings-explained", "monthly", 0.8],
  ["/college-rejection-recovery", "monthly", 0.7],
  ["/college-rejection-recovery-checklist", "monthly", 0.7],
  ["/college-research-strategy", "monthly", 0.8],
  ["/college-tour-checklist", "monthly", 0.7],
  ["/contact", "yearly", 0.4],
  ["/cookie-policy", "yearly", 0.3],
  ["/counselor-toolkit", "monthly", 0.8],
  ["/deadlines", "monthly", 0.8],
  ["/diverse-college-list", "monthly", 0.7],
  ["/fafsa-checklist", "monthly", 0.8],
  ["/faq", "monthly", 0.7],
  ["/financial-aid-appeal-guide", "monthly", 0.8],
  ["/for-schools", "monthly", 0.6],
  ["/glossary", "monthly", 0.7],
  ["/grad-school", "monthly", 0.6],
  ["/help", "monthly", 0.5],
  ["/honors-college-explained", "monthly", 0.7],
  ["/how-it-works", "monthly", 0.8],
  ["/how-to-pick-a-counselor", "monthly", 0.7],
  ["/international", "monthly", 0.7],
  ["/methodology", "monthly", 0.8],
  ["/need-blind-vs-need-aware-schools", "monthly", 0.7],
  ["/net-price", "monthly", 0.8],
  ["/personal-statement-guide", "monthly", 0.8],
  ["/press", "yearly", 0.4],
  ["/pricing", "monthly", 0.9],
  ["/pricing-comparison", "monthly", 0.7],
  ["/pricing-faq", "monthly", 0.7],
  ["/privacy", "yearly", 0.3],
  ["/quiz", "monthly", 0.8],
  ["/resources", "monthly", 0.8],
  ["/resources/common-app-essay", "monthly", 0.8],
  ["/resources/competitions", "monthly", 0.6],
  ["/resources/demonstrated-interest", "monthly", 0.7],
  ["/resources/financial-aid", "monthly", 0.8],
  ["/resources/interview-prep", "monthly", 0.7],
  ["/resources/rec-letters", "monthly", 0.7],
  ["/resources/scholarships", "monthly", 0.8],
  ["/resources/summer-programs", "monthly", 0.7],
  ["/resources/supplemental-essays", "monthly", 0.8],
  ["/scholarship-application-guide", "monthly", 0.8],
  ["/scholarship-match", "monthly", 0.8],
  ["/scholarships-by-category", "monthly", 0.7],
  ["/security", "yearly", 0.4],
  ["/site-map", "monthly", 0.4],
  ["/summer-experience-strategy", "monthly", 0.7],
  ["/terms", "yearly", 0.3],
  ["/test-optional-schools-2026", "monthly", 0.8],
  ["/test-prep-guide", "monthly", 0.7],
  ["/timeline", "monthly", 0.8],
  ["/tools", "monthly", 0.8],
  ["/transfer-college-strategy", "monthly", 0.7],
  ["/what-if", "monthly", 0.7],
];

export function getSitemapEntries(section: SitemapSection): MetadataRoute.Sitemap {
  if (section === "core") {
    return CORE_PATHS.map(([path, frequency, priority]) => item(path, frequency, priority));
  }

  if (section === "content") {
    return [
      item("/guides", "weekly", 0.9),
      ...GUIDES.map((guide) => item(`/guides/${guide.slug}`, "monthly", 0.8)),
      ...ARTICLES.map((article) => ({
        ...item(`/blog/${article.slug}`, "monthly", 0.7),
        lastModified: new Date(article.updatedAt),
      })),
      ...SUPPLEMENTAL_ESSAYS.map((essay) => item(`/supplemental/${essay.slug}`, "yearly", 0.7)),
      ...COMPARISON_PAIRS.map((pair) => item(`/compare/${pair.slug}`, "monthly", 0.7)),
      ...SCHOLARSHIPS.map((scholarship) => item(`/scholarships/${scholarship.slug}`, "monthly", 0.7)),
      ...MAJORS.map((major) => item(`/majors/${major.slug}/colleges`, "monthly", 0.7)),
      ...TOOLS_PAGES.map((tool) => item(`/tools/${tool.slug}`, "monthly", 0.8)),
    ];
  }

  if (section === "colleges") {
    return COLLEGES.map((college) => item(`/colleges/${college.slug}`, "monthly", 0.8));
  }

  return [
    item("/florida/admissions-guide", "monthly", 0.8),
    ...FLORIDA_PAGES.map((page) => item(`/florida/${page.slug}`, "monthly", 0.7)),
    item("/states", "monthly", 0.7),
    ...ALL_STATES.flatMap((state) => [
      item(`/states/${state.slug}`, "monthly", 0.7),
      ...STATE_SUBPAGES.map((subpage) => item(`/states/${state.slug}/${subpage}`, "monthly", 0.6)),
    ]),
  ];
}

export function getAllSitemapEntries(): MetadataRoute.Sitemap {
  return SITEMAP_SECTIONS.flatMap(getSitemapEntries);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderSitemapIndex(): string {
  const children = SITEMAP_SECTIONS.map(
    (section) => `  <sitemap><loc>${escapeXml(`${BASE}/sitemaps/${section}.xml`)}</loc></sitemap>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children}\n</sitemapindex>\n`;
}

export function renderUrlSet(entries: MetadataRoute.Sitemap): string {
  const children = entries.map((entry) => {
    const fields = [`    <loc>${escapeXml(entry.url)}</loc>`];
    if (entry.lastModified) {
      const value = entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;
      fields.push(`    <lastmod>${escapeXml(value)}</lastmod>`);
    }
    if (entry.changeFrequency) fields.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
    if (entry.priority !== undefined) fields.push(`    <priority>${entry.priority}</priority>`);
    return `  <url>\n${fields.join("\n")}\n  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children}\n</urlset>\n`;
}
