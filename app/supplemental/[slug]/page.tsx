import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  SUPPLEMENTAL_ESSAYS,
  getSupplementsForSchool,
  listSupplementSlugs,
} from "@/data/supplemental-essays";
import { findCollegeByName } from "@/data/colleges";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

/**
 * Per-school supplemental essay reference page.
 *
 * Long-tail SEO play: each school becomes its own URL, ranking for queries
 * like "harvard supplemental essays 2026" / "princeton supplemental prompts"
 * that the umbrella /resources/supplemental-essays page can't capture.
 *
 * Static-rendered: `generateStaticParams` enumerates every slug from
 * `SUPPLEMENTAL_ESSAYS` at build time. Adding a school = appending to
 * `data/supplemental-essays.ts` and the URL is automatically generated +
 * sitemap-listed.
 */

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return listSupplementSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const school = getSupplementsForSchool(slug);
  if (!school) return { title: "Not found" };

  return {
    title: { absolute: `${school.name} Supplemental Essays ${school.cycle} | AdmitPath` },
    description: `Official ${school.name} supplemental essay prompts for the ${school.cycle} cycle: word limits, what they really want, common pitfalls.`,
    alternates: { canonical: `${BASE}/supplemental/${school.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${school.name} Supplemental Essays ${school.cycle}`,
      description: `${school.prompts.length} official prompts with coaching — word limits, intent, pitfalls.`,
      url: `${BASE}/supplemental/${school.slug}`,
      type: "article",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(`${school.name} Supplemental Essays`)}&subtitle=${encodeURIComponent(`${school.prompts.length} prompts • ${school.cycle} cycle • coaching included`)}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: { card: "summary_large_image", site: "@admitpath" },
  };
}

export default async function SupplementalSchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getSupplementsForSchool(slug);
  if (!school) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE}/supplemental/${school.slug}#faq`,
    mainEntity: school.prompts.map((p, i) => ({
      "@type": "Question",
      name: `${school.name} Supplemental Prompt ${i + 1}: ${p.prompt.slice(0, 80)}${p.prompt.length > 80 ? "..." : ""}`,
      acceptedAnswer: {
        "@type": "Answer",
        text: [
          `Word limit: ${p.wordLimit === 0 ? "no specific limit" : `${p.wordLimit} words`}.`,
          `${p.required ? "Required." : "Optional."}`,
          `What they're looking for: ${p.guidance.join(" ")}`,
          `Common pitfalls: ${p.pitfalls.join(" ")}`,
        ].join(" "),
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE}/supplemental/${school.slug}#article`,
    headline: `${school.name} Supplemental Essays ${school.cycle}`,
    description: `Official ${school.name} supplemental essay prompts for the ${school.cycle} cycle: word limits, what they really want, common pitfalls.`,
    url: `${BASE}/supplemental/${school.slug}`,
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@id": `${BASE}/#founder` },
    publisher: { "@id": `${BASE}/#organization` },
    isPartOf: { "@id": `${BASE}/#website` },
    inLanguage: "en-US",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Write the ${school.name} Supplemental Essays (${school.cycle})`,
    description: `Step-by-step strategy for each ${school.name} supplemental essay prompt.`,
    step: school.prompts.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Prompt ${i + 1}: ${p.prompt.slice(0, 60)}${p.prompt.length > 60 ? "..." : ""}`,
      text: `Word limit: ${p.wordLimit === 0 ? "no specific limit" : `${p.wordLimit} words`}. ${p.required ? "Required." : "Optional."} Focus on: ${p.guidance[0] || "answering the prompt directly"}.`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${BASE}/supplemental/${school.slug}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Supplemental Essays",
        item: `${BASE}/resources/supplemental-essays`,
      },
      { "@type": "ListItem", position: 4, name: school.name },
    ],
  };

  const idx = SUPPLEMENTAL_ESSAYS.findIndex((s) => s.slug === school.slug);
  const siblings: typeof SUPPLEMENTAL_ESSAYS = [];
  for (const offset of [-2, -1, 1, 2]) {
    const sib = SUPPLEMENTAL_ESSAYS[(idx + offset + SUPPLEMENTAL_ESSAYS.length) % SUPPLEMENTAL_ESSAYS.length];
    if (sib && sib.slug !== school.slug && !siblings.find((s) => s.slug === sib.slug)) {
      siblings.push(sib);
    }
  }

  return (
    <MarketingLayout
      eyebrow={`${school.cycle} Cycle • ${school.prompts.length} prompt${school.prompts.length === 1 ? "" : "s"}`}
      title={`${school.name} supplemental essays.`}
      description={`Every ${school.name} supplemental prompt for the ${school.cycle} cycle, with the word limit, what they're looking for, and the most common pitfalls.`}
      backHref="/resources/supplemental-essays"
      backLabel="All schools"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Supplemental Essays", href: "/resources/supplemental-essays" },
          { label: school.name },
        ]} />
      </div>

      {school.promptsCommonNote && (
        <div
          className="mb-8 rounded-2xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p
            className="text-[14px] italic leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
          >
            {school.promptsCommonNote}
          </p>
        </div>
      )}

      <ol className="space-y-8">
        {school.prompts.map((p, i) => (
          <li
            key={i}
            className="dl-card-hover rounded-2xl border p-5 sm:p-6"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start gap-2 mb-3">
              <FileText className="h-4 w-4 mt-1 shrink-0" style={{ color: "#4A6FA5" }} />
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                <span className="font-semibold">Prompt {i + 1}:</span> {p.prompt}
              </p>
            </div>

            <div className="ml-6 flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                style={{ color: "#4A6FA5", background: "rgba(74,111,165,0.08)" }}
              >
                {p.wordLimit === 0 ? "no limit" : `${p.wordLimit} words`}
              </span>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                style={{
                  color: p.required ? "#9C2E2E" : "var(--dl-text-muted, #5A6275)",
                  background: p.required ? "rgba(156,46,46,0.08)" : "rgba(255,255,255,0.45)",
                }}
              >
                {p.required ? "required" : "optional"}
              </span>
            </div>

            <div className="ml-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg p-4" style={{ background: "rgba(74,111,165,0.07)" }}>
                <p
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#4A6FA5" }}
                >
                  <Lightbulb className="h-3 w-3" />
                  What they really want
                </p>
                <ul className="space-y-1.5">
                  {p.guidance.map((g, gi) => (
                    <li
                      key={gi}
                      className="text-[13px] leading-relaxed pl-3"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg p-4" style={{ background: "rgba(156,46,46,0.06)" }}>
                <p
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#9C2E2E" }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  Avoid
                </p>
                <ul className="space-y-1.5">
                  {p.pitfalls.map((pf, pi) => (
                    <li
                      key={pi}
                      className="text-[13px] leading-relaxed pl-3"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {pf}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Related pages for this school */}
      {(() => {
        const college = findCollegeByName(school.name);
        return college ? (
          <div className="mt-10 mb-2">
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Related {school.name} pages
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/college/${college.slug}`}
                className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white/60"
                style={{ borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}
              >
                {college.shortName} full profile
              </Link>
              <Link
                href={`/college/${college.slug}/why`}
                className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white/60"
                style={{ borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}
              >
                Why {college.shortName}? essay guide
              </Link>
              <Link
                href={`/acceptance-rate/${college.slug}`}
                className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white/60"
                style={{ borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}
              >
                {college.shortName} acceptance rate
              </Link>
              <Link
                href={`/how-to-get-into/${college.slug}`}
                className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-white/60"
                style={{ borderColor: "rgba(0,0,0,0.06)", color: "#4A6FA5" }}
              >
                How to get into {college.shortName}
              </Link>
            </div>
          </div>
        ) : null;
      })()}

      <div className="mt-12">
        <MarketingCTA
          headline={`Draft your ${school.name} supplements with AdmitPath.`}
          description="Get line-by-line scoring across the six-dimension rubric. Free tier includes 5 essays."
          buttonText="Start free"
        />
      </div>

      {siblings.length > 0 && (
        <div className="mt-12">
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            More school supplements
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/supplemental/${s.slug}`}
                className="dl-card-hover rounded-xl border px-4 py-3 transition-[border-color] hover:border-[color:var(--dl-text-muted, #5A6275)]"
                style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
              >
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  {s.name}
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  {s.prompts.length} prompt{s.prompts.length === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </MarketingLayout>
  );
}
