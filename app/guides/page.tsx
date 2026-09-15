import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { GUIDES } from "@/data/seo-guides";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Admissions Guides (2026) — AdmitPath",
  description: "Free college admissions guides covering essays, applications, timelines, financial aid, and strategy. Written by a current high school student with real admissions experience. 25+ definitive guides.",
  alternates: { canonical: `${BASE}/guides` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Admissions Guides (2026) — AdmitPath",
    description: "25+ free college admissions guides. Essays, applications, timelines, financial aid, and strategy.",
    url: `${BASE}/guides`,
    siteName: "AdmitPath",
    type: "website",
  },
};

const CATEGORIES = [
  {
    label: "Essay Writing",
    slugs: ["how-to-write-college-essay", "common-app-prompts-2026", "college-essay-examples", "supplemental-essay-guide", "why-this-college-essay", "personal-statement-guide", "topics-to-avoid", "show-dont-tell", "essay-hooks", "college-essay-word-count"],
  },
  {
    label: "Application Strategy",
    slugs: ["ed-vs-ea", "application-timeline", "admissions-calendar", "application-checklist", "how-many-colleges", "safety-match-reach", "coalition-vs-common", "how-to-choose-college"],
  },
  {
    label: "Profile Building",
    slugs: ["activities-list-guide", "activities-character-limit", "high-school-resume", "spike-vs-well-rounded", "college-interview-questions", "letter-of-rec-guide", "how-to-ask-letter-of-rec"],
  },
  {
    label: "Academics",
    slugs: ["ap-vs-ib", "dual-enrollment"],
  },
];

const TOPIC_CLUSTERS = [
  {
    title: "College profile development",
    description: "Build academic rigor, activity depth, leadership, and a coherent area of focus.",
    links: [
      { href: "/guides/activities-list-guide", label: "Activities list strategy" },
      { href: "/guides/spike-vs-well-rounded", label: "Focused vs. well-rounded profiles" },
      { href: "/summer-experience-strategy", label: "Summer experience planning" },
    ],
  },
  {
    title: "Essay strategy",
    description: "Move from topic selection through structure, drafting, and revision.",
    links: [
      { href: "/guides/how-to-write-college-essay", label: "College essay guide" },
      { href: "/guides/supplemental-essay-guide", label: "Supplemental essay strategy" },
      { href: "/college-essay-revision-checklist", label: "Revision checklist" },
    ],
  },
  {
    title: "Application planning",
    description: "Organize application rounds, requirements, tasks, and submission decisions.",
    links: [
      { href: "/guides/application-checklist", label: "Application checklist" },
      { href: "/guides/ed-vs-ea", label: "Early Decision vs. Early Action" },
      { href: "/college-admissions-framework-2026", label: "Admissions planning framework" },
    ],
  },
  {
    title: "College research",
    description: "Compare institutional data, fit factors, costs, and list balance.",
    links: [
      { href: "/college", label: "College profile directory" },
      { href: "/college-research-strategy", label: "College research strategy" },
      { href: "/college-list-builder", label: "Balanced college-list guide" },
    ],
  },
  {
    title: "Scholarships and aid",
    description: "Find opportunities, verify eligibility, and plan stronger applications.",
    links: [
      { href: "/resources/scholarships", label: "Scholarship directory" },
      { href: "/scholarship-application-guide", label: "Scholarship application guide" },
      { href: "/resources/financial-aid", label: "Financial aid guide" },
    ],
  },
  {
    title: "Admissions timelines",
    description: "Work backward from application, aid, recommendation, and decision dates.",
    links: [
      { href: "/guides/application-timeline", label: "Application timeline" },
      { href: "/guides/admissions-calendar", label: "Admissions calendar" },
      { href: "/deadlines", label: "Deadline directory" },
    ],
  },
  {
    title: "Counselor collaboration",
    description: "Coordinate recommendations, school support, and shared planning responsibly.",
    links: [
      { href: "/resources/rec-letters", label: "Recommendation letter guide" },
      { href: "/how-to-pick-a-counselor", label: "Choosing admissions support" },
      { href: "/counselor-toolkit", label: "Counselor toolkit" },
    ],
  },
] as const;

export default function GuidesIndex() {
  return (
    <MarketingLayout
      eyebrow="GUIDES"
      title="College Admissions Guides"
      description="Free guides for every stage of the college application process, from college lists and essays to deadlines and financial aid."
      maxWidth="max-w-5xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "College Admissions Guides",
            url: `${BASE}/guides`,
            description: "Free college admissions guides covering essays, applications, timelines, financial aid, and strategy.",
            publisher: { "@id": `${BASE}/#organization` },
          }),
        }}
      />

      <section className="mb-14" aria-labelledby="topic-clusters-heading">
        <h2
          id="topic-clusters-heading"
          className="mb-3 text-2xl font-bold"
          style={{ color: "var(--dl-text-primary, #1B2030)" }}
        >
          Explore by topic
        </h2>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Start with the area you are working on now, then follow the connected guides as your application develops.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {TOPIC_CLUSTERS.map((cluster) => (
            <section key={cluster.title} className="border-b border-black/10 pb-5">
              <h3 className="text-base font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {cluster.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {cluster.description}
              </p>
              <ul className="mt-3 space-y-2">
                {cluster.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E4A6E] hover:underline">
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      {CATEGORIES.map((cat) => {
        const guides = cat.slugs
          .map((s) => GUIDES.find((g) => g.slug === s))
          .filter(Boolean) as typeof GUIDES;
        if (guides.length === 0) return null;
        return (
          <section key={cat.label} className="mb-12">
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "var(--dl-text-primary, #1B2030)" }}
            >
              {cat.label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {guides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-md"
                  style={{
                    backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0.5 group-hover:underline" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                      {g.title}
                    </p>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {g.metaDescription}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-3.5 w-3.5 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "#4A6FA5" }} />
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-8">
        <MarketingCTA
          heading="Ready to build your application?"
          description="Score your profile across 7 dimensions calibrated to real CDS data from 102+ schools."
          primaryLabel="Get Your Free Profile Score"
          primaryHref="/analyze"
          secondaryLabel="Try the Essay Brainstorm"
          secondaryHref="/worksheets/common-app-essay-brainstorm"
        />
      </div>
    </MarketingLayout>
  );
}
