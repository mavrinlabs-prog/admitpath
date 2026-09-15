import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { ARTICLES } from "@/data/articles";
import { MarketingNav } from "@/components/marketing";

export const revalidate = 86400;

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "College Admissions Blog | Strategy & Stats | AdmitPath" },
  description: "Data-backed college admissions guides: Common App essays, acceptance rates, SAT strategies, and application deadlines. Updated weekly. Read free.",
  alternates: { canonical: `${BASE}/blog` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AdmitPath Blog: College Admissions Strategy",
    description: "Honest, data-backed guides to college admissions.",
    url: `${BASE}/blog`,
    type: "website",
    siteName: "AdmitPath",
    locale: "en_US",
    images: [
      {
        url: `${BASE}/api/og?title=AdmitPath+Blog&subtitle=College+admissions+strategy%2C+essays%2C+and+stats`,
        width: 1200,
        height: 630,
        alt: "AdmitPath Blog — college admissions strategy, essays, and stats.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "AdmitPath Blog: College Admissions Strategy",
    description: "Honest, data-backed guides to college admissions.",
    images: [
      {
        url: `${BASE}/api/og?title=AdmitPath+Blog&subtitle=College+admissions+strategy%2C+essays%2C+and+stats`,
        alt: "AdmitPath Blog — college admissions strategy.",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/blog#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
      ],
    },
    {
      "@type": "Blog",
      "@id": `${BASE}/blog#blog`,
      name: "AdmitPath Blog",
      url: `${BASE}/blog`,
      description: "Honest, data-backed guides on college admissions.",
      // Reference the canonical Organization + Person @ids defined elsewhere
      // (root layout for the org, /about for the editorial-team Person).
      // Schema graph merges these references into single entities so Google's
      // E-E-A-T pipeline sees one author across all 27+ articles.
      publisher: { "@id": `${BASE}/#organization` },
      author: { "@id": `${BASE}/about#editorial-team` },
      inLanguage: "en-US",
      blogPost: ARTICLES.map((a) => ({
        "@type": "BlogPosting",
        headline: a.h1,
        description: a.description,
        url: `${BASE}/blog/${a.slug}`,
        datePublished: a.publishedAt,
        dateModified: a.updatedAt,
        author: { "@id": `${BASE}/about#editorial-team` },
        publisher: { "@id": `${BASE}/#organization` },
        timeRequired: `PT${a.readMinutes}M`,
        inLanguage: "en-US",
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${BASE}/blog#articles-list`,
      name: "AdmitPath Blog Articles",
      numberOfItems: ARTICLES.length,
      itemListElement: ARTICLES.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.h1,
        url: `${BASE}/blog/${a.slug}`,
      })),
    },
  ],
};

function tagFromKeyword(kw: string): string {
  if (kw.includes("essay")) return "Essays";
  if (kw.includes("sat") || kw.includes("act") || kw.includes("score")) return "Test Prep";
  if (kw.includes("ivy") || kw.includes("get into")) return "Ivy League";
  if (kw.includes("deadline")) return "Planning";
  if (kw.includes("college")) return "Admissions";
  return "Strategy";
}

function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function BlogIndex() {
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const [featured, ...rest] = sorted;

  return (
    <div style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingNav />

      <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Header */}
        <header className="mb-14">
          <p className="dl-section-eyebrow">AdmitPath Blog</p>
          <h1
            className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            College admissions, told straight
          </h1>
          <p className="text-lg max-w-2xl mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Honest, data-backed guides. No fluff, no false hope — just the information you actually need to build a competitive application.
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            {ARTICLES.length} articles
          </p>
        </header>

        {/* Featured post — full width */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="dl-card-hover group block mb-14 rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image placeholder — brand gradient */}
              <div
                className="h-56 lg:h-full min-h-[240px] flex items-end p-8"
                style={{
                  background: "linear-gradient(135deg, #1E3352 0%, #4A6FA5 50%, #7A99C9 100%)",
                }}
              >
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-white mb-3"
                    style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    <BookOpen className="h-3 w-3" />
                    Featured
                  </span>
                  <p className="text-3xl font-extrabold text-white leading-snug" style={{ fontFamily: "var(--font-inter)" }}>
                    {featured.h1}
                  </p>
                </div>
              </div>
              {/* Text */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span
                    className="badge-primary text-[10px] mb-4 inline-block"
                  >
                    {tagFromKeyword(featured.primaryKeyword)}
                  </span>
                  <p className="text-base leading-relaxed mb-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {featured.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readMinutes} min read
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
                    style={{ color: "#4A6FA5" }}
                  >
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid — remaining articles */}
        {rest.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-6" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}>
              All articles
            </h2>
            <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="dl-card-hover group block rounded-2xl border overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Card top strip */}
                  <div
                    className="h-2"
                    style={{ background: "linear-gradient(90deg, #4A6FA5, #2E4A6E)" }}
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                        style={{ background: "rgba(74,111,165,0.08)", color: "#4A6FA5", letterSpacing: "0.04em" }}
                      >
                        {tagFromKeyword(a.primaryKeyword)}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-instrument-sans)" }}
                      >
                        {formatArticleDate(a.publishedAt)}
                      </span>
                    </div>
                    <h3
                      className="font-bold text-base leading-snug mb-2.5 transition-colors group-hover:text-[#4A6FA5]"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                    >
                      {a.h1}
                    </h3>
                    <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {a.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        <Clock className="h-3 w-3" />
                        {a.readMinutes} min
                      </div>
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        style={{ color: "#4A6FA5" }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div
          className="mt-20 rounded-3xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #E8EFF8, #D5E0EE)",
            border: "1px solid rgba(74,111,165,0.2)",
          }}
        >
          <p className="section-label">Ready to go further?</p>
          <h2
            className="mt-2 text-3xl font-extrabold mb-3"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Put the advice into action.
          </h2>
          <p className="text-base mb-7 max-w-md mx-auto" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Get your 7-dimension profile score and a personalized action plan based on your actual application.
          </p>
          <Link href="/sign-up" className="btn-primary px-8 py-3.5 text-sm">
            Analyze my profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
