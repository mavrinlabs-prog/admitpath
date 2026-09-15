import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, HelpCircle, FileText, Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { GUIDES, GUIDE_SLUGS, findGuide, type Guide } from "@/data/seo-guides";
import { pillarGuideSchema } from "@/lib/seo-schema";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return { title: "Guide not found" };
  const url = `${BASE}/guides/${g.slug}`;
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: g.metaTitle,
      description: g.metaDescription,
      url,
      siteName: "AdmitPath",
      locale: "en_US",
      type: "article",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(g.title)}&subtitle=${encodeURIComponent("AdmitPath Guide")}`,
        width: 1200, height: 630,
        alt: g.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@admitpath",
      title: g.metaTitle,
      description: g.metaDescription,
      images: [`${BASE}/api/og?title=${encodeURIComponent(g.title)}&subtitle=${encodeURIComponent("AdmitPath Guide")}`],
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  const schema = pillarGuideSchema({
    title: g.title,
    slug: g.slug,
    description: g.metaDescription,
    faq: g.faq,
    steps: g.sections,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <MarketingLayout
        eyebrow="ADMISSIONS GUIDE"
        title={g.title}
        description={g.metaDescription}
        maxWidth="max-w-4xl"
        backHref="/guides"
        backLabel="All Guides"
      >
        {/* AI Summary Nugget — citation-worthy for AI Overviews */}
        <div
          className="mb-10 rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface, #EFF2F8)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#4A6FA5" }} />
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                Quick Answer
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {g.metaDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div
          className="mb-10 rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface-raised, #FFFFFF)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <p className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
            In This Guide
          </p>
          <nav>
            <ol className="space-y-1.5">
              {g.sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: "#4A6FA5" }}
                  >
                    {i + 1}. {section}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Guide Sections */}
        <div className="space-y-12">
          {g.sections.map((section, i) => (
            <section key={i} id={`section-${i}`}>
              <h2
                className="text-xl sm:text-2xl font-bold mb-4"
                style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.01em" }}
              >
                {section}
              </h2>
              <div
                className="rounded-xl border p-6"
                style={{
                  backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                {section.toLowerCase().includes("frequently asked") ? (
                  <div className="space-y-6">
                    {g.faq.map((item, j) => (
                      <div key={j}>
                        <h3 className="text-base font-semibold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                          <HelpCircle className="inline h-4 w-4 mr-1.5" style={{ color: "#4A6FA5" }} />
                          {item.question}
                        </h3>
                        <p className="text-sm leading-relaxed pl-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : section.toLowerCase().includes("worksheet") || section.toLowerCase().includes("admitpath") ? (
                  <div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      This section is enhanced by an interactive AdmitPath worksheet. Use the free brainstorm tool to apply these strategies directly to your own application.
                    </p>
                    <Link
                      href="/worksheets/common-app-essay-brainstorm"
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: "#4A6FA5" }}
                    >
                      <FileText className="h-4 w-4" />
                      Try the Brainstorm Worksheet — Free
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {getSectionContent(g.slug, section)}
                    </p>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Internal Links */}
        <div className="mt-12">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Related Guides and Tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.internalLinks.slice(0, 8).map((link) => (
              <Link
                key={link}
                href={link}
                className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-all hover:shadow-sm"
                style={{
                  backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                  borderColor: "rgba(0,0,0,0.06)",
                  color: "#4A6FA5",
                }}
              >
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
                {formatLinkLabel(link)}
              </Link>
            ))}
          </div>
        </div>

        {/* Author & Last Updated */}
        <div
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface, #EFF2F8)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Written by AdmitPath team
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              Built for students who need practical admissions planning without expensive private counseling.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
            <Clock className="h-3.5 w-3.5" />
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12">
          <MarketingCTA
            heading="Build your college application strategy"
            description="Score your profile across 7 dimensions calibrated to real CDS data. Get your free analysis in under 5 minutes."
            primaryLabel="Get Your Free Profile Score"
            primaryHref="/analyze"
            secondaryLabel="See How It Works"
            secondaryHref="/how-it-works"
          />
        </div>
      </MarketingLayout>
    </div>
  );
}

/** Generate contextual placeholder content for guide sections */
function getSectionContent(guideSlug: string, section: string): string {
  // Return contextually relevant placeholder text that can be enriched with real data later
  const sectionLower = section.toLowerCase();
  if (sectionLower.includes("admissions officer")) {
    return "Admissions officers at selective schools review thousands of applications each cycle. What separates the admits from the waitlist is not perfection — it is authenticity, specificity, and strategic self-presentation. CDS data from 102+ schools shows consistent patterns in what moves the needle.";
  }
  if (sectionLower.includes("structure") || sectionLower.includes("framework")) {
    return "The most effective college application materials follow a clear structure: open with a specific detail, provide context, demonstrate reflection, and connect to your future. This framework applies whether you are writing a 650-word personal statement or a 100-word short answer.";
  }
  if (sectionLower.includes("mistake") || sectionLower.includes("avoid")) {
    return "The most common mistakes are not about grammar or formatting. They are about strategy: being generic when you need to be specific, telling when you need to show, and trying to sound impressive rather than genuine. Each mistake below includes a concrete example and the fix.";
  }
  if (sectionLower.includes("data") || sectionLower.includes("acceptance")) {
    return "Data from IPEDS College Navigator and institutional Common Data Sets reveals patterns that general advice misses. Acceptance rates alone do not tell the story — yield rates, ED vs RD splits, and demographic breakdowns paint a more actionable picture.";
  }
  if (sectionLower.includes("example") || sectionLower.includes("composite")) {
    return "All examples on AdmitPath are composite samples created from patterns observed in effective applications. No real student essays are reproduced. Each example is annotated to show why specific techniques work.";
  }
  if (sectionLower.includes("timeline") || sectionLower.includes("calendar") || sectionLower.includes("deadline")) {
    return "Timing matters as much as quality in college admissions. Missing a deadline is an automatic rejection. This timeline accounts for seasonal patterns in admissions and the specific workflow most successful applicants follow.";
  }
  if (sectionLower.includes("financial") || sectionLower.includes("aid") || sectionLower.includes("cost")) {
    return "Financial reality should drive your college list as much as academic fit. IPEDS net price data by income band shows the true cost of attendance — not the sticker price. A school is not a real option if you cannot afford to attend.";
  }
  return "This section provides actionable strategy based on CDS data from 102+ schools, verified admissions patterns, and the structured worksheet methodology that AdmitPath uses to help students build stronger applications. Every recommendation is specific and backed by data.";
}

/** Format a URL slug into a human-readable label */
function formatLinkLabel(link: string): string {
  const slug = link.split("/").pop() || "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
