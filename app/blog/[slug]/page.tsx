import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import { ARTICLE_SLUGS, findArticle, ARTICLES, type Article, type ArticleBlock } from "@/data/articles";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { PullQuote } from "@/components/pull-quote";
import { Footnotes, FootnoteRef } from "@/components/footnote";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MarketingNav } from "@/components/marketing";

export const dynamicParams = true;
export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) return { title: "Article not found" };
  const url = `${BASE}/blog/${a.slug}`;
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      title: a.title,
      description: a.description,
      url,
      type: "article",
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      siteName: "AdmitPath",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(a.h1)}&subtitle=${encodeURIComponent(`${a.readMinutes} min read · AdmitPath`)}`,
        width: 1200,
        height: 630,
        alt: `${a.title} — AdmitPath blog`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@admitpath",
      title: a.title,
      description: a.description,
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(a.h1)}&subtitle=${encodeURIComponent(`${a.readMinutes} min read · AdmitPath`)}`,
        alt: `${a.title} — AdmitPath blog`,
      }],
    },
  };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

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

function jsonLd(a: Article) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${BASE}/blog/${a.slug}#article`,
        headline: a.h1,
        description: a.description,
        datePublished: a.publishedAt,
        dateModified: a.updatedAt,
        // E-E-A-T: reference the canonical Person @id defined on /about
        // instead of inlining a duplicate Person object. schema.org's @id
        // resolution lets Google merge this Article author with the full
        // Person record (jobTitle, knowsAbout, worksFor) on /about.
        author: { "@id": `${BASE}/#founder` },
        publisher: { "@id": `${BASE}/#organization` },
        mainEntityOfPage: `${BASE}/blog/${a.slug}`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${BASE}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
          { "@type": "ListItem", position: 3, name: a.h1, item: `${BASE}/blog/${a.slug}` },
        ],
      },
      ...(a.faqs && a.faqs.length > 0
        ? [{
            "@type": "FAQPage",
            mainEntity: a.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }]
        : []),
    ],
  };
}

function Block({ b }: { b: ArticleBlock }) {
  switch (b.type) {
    case "p":
      return (
        <p>
          {b.text}
          {b.footnotes?.map((n) => <FootnoteRef key={n} n={n} />)}
        </p>
      );
    case "h2":
      return <h2 id={slugify(b.text)}>{b.text}</h2>;
    case "h3":
      return <h3>{b.text}</h3>;
    case "ul":
      return <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    case "ol":
      return <ol>{b.items.map((i) => <li key={i}>{i}</li>)}</ol>;
    case "callout":
      return (
        <aside className="not-prose my-7 rounded-2xl border-2 p-5" style={{ borderColor: "#4A6FA5", background: "#E8EFF8" }}>
          <p style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)", fontSize: "0.95rem", margin: 0, fontWeight: 500 }}>{b.text}</p>
        </aside>
      );
    case "pull-quote":
      return <PullQuote cite={b.cite}>{b.text}</PullQuote>;
    case "asterism":
      return <hr />;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) notFound();

  const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 5);
  const tocHeadings = a.body.filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2");

  // Sequential prev/next based on the canonical ARTICLES order. Wraps at
  // both ends so the reader always has a next-step path.
  const idx = ARTICLES.findIndex((x) => x.slug === a.slug);
  const prev = ARTICLES[(idx - 1 + ARTICLES.length) % ARTICLES.length];
  const next = ARTICLES[(idx + 1) % ARTICLES.length];

  return (
    <div style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(a)) }} />

      <MarketingNav />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex gap-12 lg:gap-16">

          {/* ── Main content ── */}
          <main className="min-w-0 flex-1 max-w-[680px]">
            {/* Back to blog */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-opacity hover:opacity-70"
              style={{ color: "#4A6FA5", fontFamily: "var(--font-inter)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to blog
            </Link>

            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: a.h1 },
              ]} />
            </div>

            <header className="mb-10">
              <Eyebrow className="mb-3">
                {tagFromKeyword(a.primaryKeyword).toUpperCase()} · {formatArticleDate(a.updatedAt)}
              </Eyebrow>
              <h1
                className="text-4xl sm:text-5xl font-normal leading-[1.08] mb-4"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)", letterSpacing: "-0.01em" }}
              >
                {a.h1}
              </h1>
              <p className="text-lg mb-5" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)", lineHeight: 1.55 }}>{a.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{a.readMinutes} min read</span>
              </div>
            </header>

            <Prose>
              <article>
                {(() => {
                  const midIdx = Math.floor(a.body.length / 2);
                  return a.body.map((b, i) => (
                    <div key={i}>
                      <Block b={b} />
                      {i === midIdx && (
                        <aside
                          className="not-prose my-10 rounded-3xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                          style={{ background: "#4A6FA5" }}
                        >
                          <div className="flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em" }}>
                              From AdmitPath
                            </p>
                            <h3 className="text-xl font-bold mb-1.5 text-white" style={{ fontFamily: "var(--font-inter)" }}>
                              Score your profile against real admit data
                            </h3>
                            <p className="text-sm text-white/90" style={{ fontFamily: "var(--font-inter)" }}>
                              7 dimensions, calibrated to actual T20 admit rates. Free plan included.
                            </p>
                          </div>
                          <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold whitespace-nowrap"
                            style={{ background: "white", color: "#4A6FA5" }}
                          >
                            Score your profile <ArrowRight className="h-4 w-4" />
                          </Link>
                        </aside>
                      )}
                    </div>
                  ));
                })()}
              </article>
              {a.footnotes && a.footnotes.length > 0 && (
                <Footnotes notes={a.footnotes} />
              )}
            </Prose>

            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-5 tracking-tight" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>Frequently asked questions</h2>
              <div className="space-y-3">
                {a.faqs.map(({ q, a: ans }) => (
                  <details key={q} className="dl-card-hover rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
                    <summary className="cursor-pointer font-bold text-base" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{q}</summary>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>{ans}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Inline CTA — #E8EFF8 background */}
            <section
              className="mt-16 rounded-3xl border-2 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              style={{ borderColor: "#4A6FA5", background: "#E8EFF8" }}
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1.5" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>See where you actually stand</h2>
                <p className="text-base" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>AdmitPath scores your profile across 7 dimensions using real CDS admissions data. Free plan included.</p>
              </div>
              <Link href="/sign-up" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm whitespace-nowrap">
                Sign up free <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* Popular tools — internal linking for SEO */}
            <section className="mt-16">
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>Tools from AdmitPath</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { href: "/calculator", title: "Chances Calculator", desc: "See your estimated admissions odds at 30+ top schools" },
                  { href: "/quiz", title: "Admissions Quiz", desc: "5-question assessment across our full college database" },
                  { href: "/compare", title: "College Comparison", desc: "Compare schools side-by-side on 20+ data points" },
                  { href: "/net-price", title: "Net Price Estimator", desc: "Estimate real cost at 24 top colleges by family income" },
                  { href: "/scholarship-match", title: "Scholarship Finder", desc: "Filter the catalog and verify details with each provider" },
                  { href: "/college-list-builder", title: "College List Builder", desc: "The 4-band framework for a balanced list" },
                ].map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="dl-card-hover block rounded-2xl border p-4"
                    style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <div className="font-bold text-sm mb-0.5" style={{ color: "#4A6FA5" }}>{tool.title}</div>
                    <div className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{tool.desc}</div>
                  </Link>
                ))}
              </div>
            </section>

            {related.length > 0 && (
              <section className="mt-16">
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>More from the AdmitPath blog</h2>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="dl-card-hover block rounded-2xl border p-4" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
                      <div className="font-bold text-base mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{r.h1}</div>
                      <div className="text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{r.description}</div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "#4A6FA5" }}
                >
                  View all {ARTICLES.length} articles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            )}

            {/* Sequential prev/next nav — separate from "related" so readers
                always have a one-click path through every article. Wraps at
                both ends so first/last article never dead-ends. */}
            <nav
              aria-label="Article navigation"
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <Link
                href={`/blog/${prev.slug}`}
                rel="prev"
                className="dl-card-hover rounded-2xl border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  ← Previous
                </div>
                <div className="font-bold text-sm leading-snug" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {prev.h1}
                </div>
              </Link>
              <Link
                href={`/blog/${next.slug}`}
                rel="next"
                className="dl-card-hover rounded-2xl border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] sm:text-right"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  Next →
                </div>
                <div className="font-bold text-sm leading-snug" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {next.h1}
                </div>
              </Link>
            </nav>
          </main>

          {/* ── Sticky TOC sidebar (desktop only) ── */}
          {tocHeadings.length > 1 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center gap-1.5 mb-4">
                  <BookOpen className="h-3.5 w-3.5" style={{ color: "#4A6FA5" }} />
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4A6FA5" }}>
                    Contents
                  </p>
                </div>
                <nav aria-label="Table of contents">
                  <ul className="space-y-1">
                    {tocHeadings.map((h) => (
                      <li key={h.text}>
                        <a
                          href={`#${slugify(h.text)}`}
                          className="block rounded-lg px-3 py-1.5 text-xs leading-snug transition-all duration-150 hover:bg-[rgba(74,111,165,0.08)] hover:text-[#4A6FA5]"
                          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
