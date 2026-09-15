import Link from "next/link";
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import {
  Trophy,
  Sun,
  HandCoins,
  MessageCircle,
  Eye,
  ArrowRight,
  PenLine,
  FileText,
  Globe,
  BookOpenText,
  Landmark,
} from "lucide-react";
import { SUPPLEMENTAL_ESSAYS } from "@/data/supplemental-essays";
import { COMMON_APP_PROMPTS_DETAILED } from "@/data/common-app-prompts";
import { SCHOLARSHIPS } from "@/data/scholarships-db";
import summerPrograms from "@/../../public/summer-programs.json";
import competitions from "@/../../public/competitions.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

// Derive counts from the canonical data files so the hub copy can never
// drift out of sync (was a real bug — the cards said "20 schools" after
// supplemental data grew to 25).
const SUPPLEMENTAL_COUNT = SUPPLEMENTAL_ESSAYS.length;
const COMMON_APP_PROMPT_COUNT = COMMON_APP_PROMPTS_DETAILED.length;
const SUMMER_PROGRAM_COUNT = summerPrograms.length;
const SCHOLARSHIP_COUNT = SCHOLARSHIPS.length;
const COMPETITION_COUNT = competitions.length;

export const metadata: Metadata = {
  title: "Free College Admissions Resources (2026)",
  description:
    "Free guides: summer programs, scholarships, competitions, essays, interview prep, rec letters, financial aid, and demonstrated interest. No sign-up.",
  alternates: { canonical: `${BASE}/resources` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free College Admissions Resources (2026)",
    description: "Free guides: summer programs, scholarships, competitions, essays, interview prep, rec letters, financial aid. No sign-up.",
    url: `${BASE}/resources`,
    type: "website",
    images: [{
      url: `${BASE}/api/og?title=${encodeURIComponent("Free College Admissions Resources")}&subtitle=${encodeURIComponent("Summer programs • scholarships • competitions • interview prep")}`,
      width: 1200,
      height: 630,
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Resources — Programs, Scholarships & More", description: "Curated directories of summer programs, scholarships, competitions, and interview prep.", images: [`${BASE}/api/og?title=${encodeURIComponent("Free College Admissions Resources")}&subtitle=${encodeURIComponent("Summer programs • scholarships • competitions • interview prep")}`] },
};

const SECTIONS = [
  {
    href: "/resources/summer-programs",
    icon: Sun,
    title: "Summer Programs",
    desc: `${SUMMER_PROGRAM_COUNT} vetted programs with selectivity, cost, grade, and deadline filters.`,
    count: SUMMER_PROGRAM_COUNT,
  },
  {
    href: "/resources/scholarships",
    icon: HandCoins,
    title: "Scholarships",
    desc: `${SCHOLARSHIP_COUNT} merit, need-based, identity, STEM, and community scholarships.`,
    count: SCHOLARSHIP_COUNT,
  },
  {
    href: "/resources/competitions",
    icon: Trophy,
    title: "Competitions",
    desc: COMPETITION_COUNT > 0
      ? `${COMPETITION_COUNT} academic competitions with deadlines, eligibility, and prizes.`
      : "Directory refresh status plus adjacent ways to build academic depth.",
    ...(COMPETITION_COUNT > 0 ? { count: COMPETITION_COUNT } : { cta: "View directory status" }),
  },
  {
    href: "/resources/interview-prep",
    icon: MessageCircle,
    title: "Interview Prep",
    desc: "22 common interview questions with expert tips on what to say and what to avoid.",
    count: 22,
  },
  {
    href: "/resources/demonstrated-interest",
    icon: Eye,
    title: "Demonstrated Interest",
    desc: "Which schools track it, which don't, and 11 actions that move the needle.",
    count: 11,
  },
  {
    href: "/resources/common-app-essay",
    icon: FileText,
    title: "Common App Essay",
    desc: `All ${COMMON_APP_PROMPT_COUNT} official prompts for the 2026–27 cycle with what each rewards and what to avoid.`,
    count: COMMON_APP_PROMPT_COUNT,
  },
  {
    href: "/resources/supplemental-essays",
    icon: BookOpenText,
    title: "Supplemental Essays",
    desc: `Official 2026–27 prompts from ${SUPPLEMENTAL_COUNT} top schools — word limits, intent, and pitfalls to avoid.`,
    count: SUPPLEMENTAL_COUNT,
  },
  {
    href: "/resources/rec-letters",
    icon: PenLine,
    title: "Recommendation Letters",
    desc: "Pick the right teachers, build a brag sheet, and send asks that get strong letters.",
    cta: "Read the guide",
  },
  {
    href: "/resources/financial-aid",
    icon: Landmark,
    title: "Financial Aid",
    desc: "FAFSA, CSS Profile, federal aid, merit scholarships, and the timeline that gets you the most money.",
    cta: "Read the guide",
  },
  {
    href: "/international",
    icon: Globe,
    title: "For International Students",
    desc: "Need-blind schools, TOEFL/IELTS requirements, F-1 visa process, financial aid options, and timeline differences.",
    cta: "Read the guide",
  },
];

type Section = (typeof SECTIONS)[number];
function sectionCta(s: Section): string {
  if ("cta" in s && s.cta) return s.cta;
  if ("count" in s && typeof s.count === "number") return `Browse ${s.count} entries`;
  return "Open";
}

/**
 * LearningResource @graph — each card is a discoverable learning resource.
 * Lets Google surface these in the "Free" filter of education search results
 * and feeds Lens / educational-content discovery surfaces.
 */
const learningResourcesSchema = {
  "@context": "https://schema.org",
  "@graph": SECTIONS.map((s) => ({
    "@type": "LearningResource",
    "@id": `${BASE}${s.href}#resource`,
    name: s.title,
    description: s.desc,
    url: `${BASE}${s.href}`,
    learningResourceType: "Reference",
    educationalLevel: ["HighSchool"],
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
    isAccessibleForFree: true,
    inLanguage: "en-US",
    provider: { "@id": `${BASE}/#organization` },
  })),
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourcesSchema) }}
      />
      <MarketingNav />

      <main id="main" className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        {/* Hero */}
        <div className="mb-16 text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            Free resources
          </p>
          <h1
            className="text-4xl sm:text-5xl leading-tight mb-4"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need to get in.
          </h1>
          <p
            className="max-w-xl mx-auto text-[16px] leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
          >
            Searchable directories and practical guides for building a stronger
            application. No sign-up required.
          </p>
        </div>

        {/* Cards */}
        <div className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="dl-card-hover group flex h-full flex-col rounded-lg border p-6"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "rgba(74,111,165,0.08)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "#4A6FA5" }} />
                </div>
                <h2
                  className="text-[17px] font-semibold mb-1"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                >
                  {s.title}
                </h2>
                <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {s.desc}
                </p>
                <span className="mt-auto flex items-center gap-1 pt-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
                  {sectionCta(s)}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Want personalized recommendations based on your profile?
          </p>
          <Link
            href="/sign-up"
            className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            Create your free profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
