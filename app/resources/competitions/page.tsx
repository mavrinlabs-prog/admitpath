import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, Calendar, Trophy, ArrowRight, Database } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import competitions from "@/../../public/competitions.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const COMPETITION_COUNT = competitions.length;
const COMPETITION_DESCRIPTION = COMPETITION_COUNT > 0
  ? `${COMPETITION_COUNT} academic competitions with categories, deadlines, prizes, and eligibility.`
  : "Academic competition planning guidance with related summer program and scholarship resources.";

export const metadata: Metadata = {
  title: "Academic Competitions for High Schoolers (2026)",
  description: COMPETITION_DESCRIPTION,
  alternates: { canonical: `${BASE}/resources/competitions` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Academic Competitions for High School Students",
    description: COMPETITION_DESCRIPTION,
    url: `${BASE}/resources/competitions`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=${encodeURIComponent("Academic Competitions")}&subtitle=${encodeURIComponent(COMPETITION_DESCRIPTION)}`, width: 1200, height: 630, alt: "Academic Competitions Guide" }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Academic Competitions for High Schoolers", description: COMPETITION_DESCRIPTION, images: [`${BASE}/api/og?title=${encodeURIComponent("Academic Competitions")}&subtitle=${encodeURIComponent(COMPETITION_DESCRIPTION)}`] },
};

type Competition = {
  name: string;
  url: string;
  deadline: string;
  category: string;
  eligibility: string;
  prize?: string;
  description: string;
};

export default function CompetitionsPage() {
  const items = competitions as Competition[];

  // Group by category
  const categories = Array.from(new Set(items.map((c) => c.category))).sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/resources/competitions#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
          { "@type": "ListItem", position: 3, name: "Competitions", item: `${BASE}/resources/competitions` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${BASE}/resources/competitions#page`,
        url: `${BASE}/resources/competitions`,
        name: "Academic Competitions for High School Students",
        isPartOf: { "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${BASE}/resources/competitions#breadcrumb` },
        inLanguage: "en-US",
        mainEntity: { "@id": `${BASE}/resources/competitions#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${BASE}/resources/competitions#list`,
        name: "Academic Competitions Directory",
        numberOfItems: items.length,
        itemListElement: items.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Event",
            name: c.name,
            description: c.description,
            url: c.url,
            eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: { "@type": "VirtualLocation", url: c.url },
          },
        })),
      },
      {
        "@type": "LearningResource",
        "@id": `${BASE}/resources/competitions#resource`,
        name: "Academic Competitions Directory",
        description: `${items.length} academic competitions across STEM, humanities, business, and arts for high school students.`,
        url: `${BASE}/resources/competitions`,
        learningResourceType: "Reference",
        educationalLevel: ["HighSchool"],
        audience: { "@type": "EducationalAudience", educationalRole: "student" },
        isAccessibleForFree: true,
        inLanguage: "en-US",
        provider: { "@id": `${BASE}/#organization` },
      },
    ],
  };

  return (
    <MarketingLayout
      eyebrow="Resources"
      title="Academic Competitions"
      description={items.length > 0
        ? `${items.length} competitions across ${categories.length} categories. Use the directory to compare deadlines, eligibility, and award details.`
        : "The competition directory is being refreshed. These adjacent resources remain available while verified listings are restored."}
      backHref="/resources"
      backLabel="All resources"
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {items.length === 0 ? (
          <div
            className="mb-10 rounded-lg border border-dashed px-5 py-10 text-center"
            style={{ background: "rgba(255,255,255,0.35)", borderColor: "rgba(0,0,0,0.12)" }}
          >
            <Database aria-hidden="true" className="mx-auto mb-3 h-6 w-6 text-[#4A6FA5]" />
            <h2 className="text-base font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Verified listings are temporarily unavailable
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              We are not showing stale deadlines or provider links. Browse summer programs and scholarships below in the meantime.
            </p>
          </div>
        ) : null}

        {/* Category quick nav */}
        {items.length > 0 ? <div className="mb-10 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:border-[color:#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {cat} ({items.filter((c) => c.category === cat).length})
            </a>
          ))}
        </div> : null}

        {/* Grouped listings */}
        {categories.map((cat) => {
          const group = items.filter((c) => c.category === cat);
          return (
            <section key={cat} className="mb-10" id={cat.toLowerCase().replace(/\s+/g, "-")}>
              <h2
                className="mb-4 flex items-center gap-2 text-[18px] font-semibold"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
              >
                <Trophy className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                {cat}
                <span className="text-[13px] font-normal" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  ({group.length})
                </span>
              </h2>

              <div className="space-y-3">
                {group.map((c, i) => (
                  <div
                    key={i}
                    className="dl-card-hover rounded-xl border p-4"
                    style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-[15px] font-semibold mb-1"
                          style={{ color: "var(--dl-text-primary, #1B2030)" }}
                        >
                          {c.name}
                        </h3>
                        <p
                          className="text-[13px] leading-relaxed mb-2"
                          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                        >
                          {c.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {c.deadline}
                          </span>
                          <span>{c.eligibility}</span>
                          {c.prize && <span className="font-medium" style={{ color: "#4A6FA5" }}>{c.prize}</span>}
                        </div>
                      </div>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 mt-1"
                        style={{ color: "var(--dl-text-muted, #5A6275)" }}
                        title={`Visit ${c.name}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Related resources */}
        <div className="mt-2 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/resources/summer-programs"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Summer Programs
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              20 vetted programs from RSI to TASP. Pair competition prep with a summer research program for a stronger spike.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Browse programs <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/resources/supplemental-essays"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Supplemental Essays
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Use your competition experience as essay material. See the official 2026-27 prompts for top schools.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Read the prompts <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <MarketingCTA
          headline="Build a spike that stands out"
          description="Create your free profile and see how your competition results factor into your admissions profile score."
          buttonText="Create your free profile"
        />
    </MarketingLayout>
  );
}
