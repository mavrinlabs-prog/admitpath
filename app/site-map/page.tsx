import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ARTICLES } from "@/data/articles";
import { COLLEGES } from "@/data/colleges";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "Site Map — All AdmitPath Pages" },
  description:
    "Index of every public AdmitPath page: tools, blog articles, college pages, resources, and reference guides.",
  alternates: { canonical: `${BASE}/site-map` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Site Map — All AdmitPath Pages",
    description: "Index of every public page: tools, blog articles, college pages, resources, and guides.",
    url: `${BASE}/site-map`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Site+Map&subtitle=All+AdmitPath+pages`, width: 1200, height: 630, alt: "AdmitPath Site Map" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Site Map — All AdmitPath Pages", description: "Index of every public AdmitPath page.", images: [`${BASE}/api/og?title=Site+Map&subtitle=All+AdmitPath+pages`] },
};

const siteMapSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/site-map#page`,
      url: `${BASE}/site-map`,
      name: "Site Map — All AdmitPath Pages",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Site map", item: `${BASE}/site-map` },
      ],
    },
  ],
};

const SECTIONS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Tools",
    links: [
      { href: "/tools", label: "All tools (hub)" },
      { href: "/quiz", label: "What Are My Chances? quiz" },
      { href: "/calculator", label: "Chances calculator" },
      { href: "/compare", label: "Compare colleges" },
      { href: "/scholarship-match", label: "Scholarship match" },
      { href: "/net-price", label: "Net price estimator" },
      { href: "/undermatch", label: "Undermatching self-check" },
      { href: "/deadlines", label: "Application deadlines" },
      { href: "/timeline", label: "Application timeline" },
      { href: "/glossary", label: "Admissions glossary" },
      { href: "/faq", label: "Admissions FAQ" },
      { href: "/college-essay-examples", label: "Annotated essay examples" },
      { href: "/college-rankings-explained", label: "College rankings explained" },
      { href: "/college-list-builder", label: "College list builder guide" },
      { href: "/personal-statement-guide", label: "Personal statement guide" },
      { href: "/test-prep-guide", label: "SAT/ACT test prep guide" },
      { href: "/choose-a-major", label: "How to choose a major" },
      { href: "/college-tour-checklist", label: "College tour checklist" },
      { href: "/admissions-jargon-decoder", label: "Admissions jargon decoder" },
      { href: "/admissions-statistics-2026", label: "2026 admissions statistics" },
      { href: "/college-application-checklist", label: "College application checklist" },
      { href: "/college-decision-day", label: "May 1 decision day framework" },
      { href: "/honors-college-explained", label: "Honors colleges explained" },
      { href: "/how-to-pick-a-counselor", label: "How to pick a counselor" },
      { href: "/need-blind-vs-need-aware-schools", label: "Need-blind vs need-aware schools" },
      { href: "/diverse-college-list", label: "First-gen & low-income schools guide" },
      { href: "/test-optional-schools-2026", label: "Test-optional schools 2026" },
      { href: "/scholarship-application-guide", label: "Scholarship application guide" },
      { href: "/transfer-college-strategy", label: "Transfer college strategy" },
      { href: "/summer-experience-strategy", label: "Summer experience strategy" },
      { href: "/college-rejection-recovery", label: "College rejection recovery" },
      { href: "/application-component-weighting", label: "Application component weighting" },
      { href: "/accelerated-degree-programs", label: "Accelerated degree programs" },
      { href: "/college-research-strategy", label: "College research strategy" },
      { href: "/financial-aid-appeal-guide", label: "Financial aid appeal guide" },
      { href: "/college-acceptance-letter-decoder", label: "Acceptance letter decoder" },
      { href: "/college-decision-comparison-guide", label: "Decision comparison guide" },
      { href: "/college-rejection-recovery-checklist", label: "Rejection recovery checklist" },
      { href: "/college-essay-revision-checklist", label: "Essay revision checklist" },
      { href: "/college-essay-topic-finder", label: "Essay topic finder" },
      { href: "/college-application-timeline-2026", label: "Application timeline 2026" },
      { href: "/college-admissions-framework-2026", label: "Complete admissions framework 2026" },
      { href: "/scholarships-by-category", label: "Scholarships by category" },
      { href: "/international", label: "International students guide" },
      { href: "/grad-school", label: "Graduate school admissions" },
      { href: "/decision-matrix", label: "College decision matrix" },
      { href: "/aid-comparison", label: "Financial aid offer comparison" },
      { href: "/peer-profiles", label: "Admitted student profiles" },
      { href: "/appeal-letter", label: "Appeal letter generator" },
      { href: "/fafsa-checklist", label: "FAFSA filing checklist" },
    ],
  },
  {
    heading: "About AdmitPath the product",
    links: [
      { href: "/how-it-works", label: "How AdmitPath works (full breakdown)" },
      { href: "/pricing", label: "Pricing" },
      { href: "/pricing-comparison", label: "Plan comparison table" },
      { href: "/pricing-faq", label: "Pricing FAQ" },
      { href: "/why-admitpath", label: "Why AdmitPath — how we compare" },
      { href: "/sign-up", label: "Get started" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/resources", label: "Resources hub" },
      { href: "/resources/summer-programs", label: "Summer programs" },
      { href: "/resources/scholarships", label: "Scholarships" },
      { href: "/resources/competitions", label: "Academic competitions" },
      { href: "/resources/interview-prep", label: "Interview prep" },
      { href: "/resources/demonstrated-interest", label: "Demonstrated interest" },
      { href: "/resources/common-app-essay", label: "Common App essay prompts" },
      { href: "/resources/supplemental-essays", label: "Supplemental essays" },
      { href: "/resources/rec-letters", label: "Recommendation letters" },
      { href: "/resources/financial-aid", label: "Financial aid guide" },
    ],
  },
  {
    heading: "About AdmitPath",
    links: [
      { href: "/about", label: "About — mission, methodology, editorial team" },
      { href: "/methodology", label: "Methodology — how scores are calculated" },
      { href: "/security", label: "Security & privacy" },
      { href: "/press", label: "Press & media kit" },
      { href: "/admits-wall", label: "Admits Wall — real student results" },
      { href: "/creators", label: "Creator Program" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Account & legal",
    links: [
      { href: "/sign-up", label: "Sign up free" },
      { href: "/sign-in", label: "Sign in" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/site-map", label: "Site map (this page)" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <MarketingLayout
      eyebrow="Site map"
      title="Every public AdmitPath page, in one place."
      description={`The XML sitemap for crawlers lives at /sitemap.xml. This page is for humans.`}
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteMapSchema) }}
      />

      {/* Structured sections */}
      {SECTIONS.map((section) => (
        <section key={section.heading} className="mb-10">
          <h2
            className="mb-4 text-xl font-extrabold tracking-tight border-b pb-2"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            {section.heading}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm py-1 hover:underline focus-visible:outline-none focus-visible:underline"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Blog articles (dynamic) */}
      <section className="mb-10">
        <h2
          className="mb-4 text-xl font-extrabold tracking-tight border-b pb-2"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          Blog ({ARTICLES.length} articles)
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[...ARTICLES]
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="text-sm py-1 hover:underline focus-visible:outline-none focus-visible:underline"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {a.title}
                </Link>
              </li>
            ))}
        </ul>
      </section>

      {/* College pages (dynamic) */}
      <section className="mb-10">
        <h2
          className="mb-4 text-xl font-extrabold tracking-tight border-b pb-2"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          Colleges ({COLLEGES.length} schools)
        </h2>
        <p className="mb-3 text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Per-school pages with admit rate, SAT range, GPA, demonstrated-interest weight, and the school&apos;s CDS C7 admissions-factor weights.
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          {[...COLLEGES]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/colleges/${c.slug}`}
                  className="text-xs py-1 hover:underline focus-visible:outline-none focus-visible:underline"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {c.name}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </MarketingLayout>
  );
}
