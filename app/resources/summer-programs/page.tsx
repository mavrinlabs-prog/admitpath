import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { SummerProgramsDirectory } from "@/components/resources/summer-programs-directory";
import type { SummerProgramResource } from "@/lib/resource-filters";
import summerPrograms from "@/../../public/summer-programs.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const PROGRAM_COUNT = summerPrograms.length;

export const metadata: Metadata = {
  title: "Summer Programs for High School Students (2026)",
  description:
    `${PROGRAM_COUNT} vetted summer programs from RSI and TASP to COSMOS and SSP. Selectivity ratings, costs, deadlines, and direct links. Free.`,
  alternates: { canonical: `${BASE}/resources/summer-programs` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Summer Programs for High School Students (2026)",
    description: `${PROGRAM_COUNT} vetted programs with selectivity, cost, deadlines, and direct links. Free.`,
    url: `${BASE}/resources/summer-programs`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=${encodeURIComponent("Summer Programs for High Schoolers")}&subtitle=${encodeURIComponent(`${PROGRAM_COUNT} programs + selectivity + cost + deadlines`)}`, width: 1200, height: 630, alt: "Summer Programs Guide" }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Summer Programs for High School Students", description: `${PROGRAM_COUNT} vetted programs with selectivity, cost, and deadlines. Free.`, images: [`${BASE}/api/og?title=${encodeURIComponent("Summer Programs for High Schoolers")}&subtitle=${encodeURIComponent(`${PROGRAM_COUNT} programs + selectivity + cost + deadlines`)}`] },
};

export default function SummerProgramsPage() {
  const programs = summerPrograms as SummerProgramResource[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/resources/summer-programs#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
          { "@type": "ListItem", position: 3, name: "Summer Programs", item: `${BASE}/resources/summer-programs` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${BASE}/resources/summer-programs#page`,
        url: `${BASE}/resources/summer-programs`,
        name: "Summer Programs for High School Students",
        isPartOf: { "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${BASE}/resources/summer-programs#breadcrumb` },
        inLanguage: "en-US",
        mainEntity: { "@id": `${BASE}/resources/summer-programs#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${BASE}/resources/summer-programs#list`,
        name: "Vetted Summer Programs",
        numberOfItems: programs.length,
        itemListElement: programs.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Course",
            name: p.name,
            description: p.description,
            provider: { "@type": "EducationalOrganization", name: p.host },
            url: p.url,
            educationalLevel: "HighSchool",
          },
        })),
      },
      {
        "@type": "LearningResource",
        "@id": `${BASE}/resources/summer-programs#resource`,
        name: "Summer Programs for High School Students",
        description: `${programs.length} vetted summer programs with selectivity ratings, costs, deadlines, and direct links.`,
        url: `${BASE}/resources/summer-programs`,
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
      title="Summer Programs"
      description={`${programs.length} programs ranked by selectivity. The best summer programs are genuine credentials — admissions officers recognize RSI, TASP, Clark Scholars, and SSP by name.`}
      backHref="/resources"
      backLabel="All resources"
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        <SummerProgramsDirectory programs={programs} />

        {/* Related resources */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/resources/competitions"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Academic Competitions
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Review competition planning guidance and related ways to build evidence of academic depth.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Browse competitions <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/resources/scholarships"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Scholarships
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Many selective summer programs are free or offer need-based aid. Check scholarships for additional funding.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Browse scholarships <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <MarketingCTA
            headline="Build your summer strategy"
            description="Create your free profile and see how summer experiences factor into your admissions profile score."
            buttonText="Create your free profile"
          />
        </div>
    </MarketingLayout>
  );
}
