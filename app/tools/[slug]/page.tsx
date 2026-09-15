import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle, Wrench, Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { TOOLS_PAGES, TOOL_SLUGS, findTool } from "@/data/seo-tools";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return TOOL_SLUGS.map((slug) => ({ slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = findTool(slug);
  if (!t) return { title: "Tool not found" };
  const url = `${BASE}/tools/${t.slug}`;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url,
      siteName: "AdmitPath",
      locale: "en_US",
      type: "website",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(t.shortName)}&subtitle=${encodeURIComponent("Free AdmitPath Tool")}`,
        width: 1200, height: 630,
        alt: t.name,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@admitpath",
      title: t.metaTitle,
      description: t.metaDescription,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = findTool(slug);
  if (!t) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: t.name,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        url: `${BASE}/tools/${t.slug}`,
        description: t.metaDescription,
        featureList: t.features,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        provider: { "@id": `${BASE}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE}/tools` },
          { "@type": "ListItem", position: 3, name: t.shortName, item: `${BASE}/tools/${t.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <MarketingLayout
        eyebrow="FREE TOOL"
        title={t.h1}
        description={t.heroSubheading}
        maxWidth="max-w-4xl"
        backHref="/tools"
        backLabel="All Tools"
      >
        {/* Primary CTA */}
        <div className="mb-10 text-center">
          <Link
            href={t.ctaHref}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#4A6FA5" }}
          >
            <Wrench className="h-5 w-5" />
            {t.ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-sm" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
            Free. No signup required.
          </p>
        </div>

        {/* Features */}
        <div
          className="mb-10 rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface-raised, #FFFFFF)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            What You Get
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#16a34a" }} />
                <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div
          className="mb-10 rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface, #EFF2F8)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            How {t.shortName} Works
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>1</span>
              <p className="text-sm leading-relaxed pt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Enter your academic profile, interests, and preferences into the tool.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>2</span>
              <p className="text-sm leading-relaxed pt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                The tool uses the college records and published IPEDS or CDS fields available in AdmitPath.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>3</span>
              <p className="text-sm leading-relaxed pt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Get personalized results you can share with parents and counselors.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div
          className="mb-10 rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface-raised, #FFFFFF)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {t.faq.map((item, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  <HelpCircle className="inline h-4 w-4 mr-1.5" style={{ color: "#4A6FA5" }} />
                  {item.question}
                </h3>
                <p className="text-sm leading-relaxed pl-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Links */}
        <div className="mb-10">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            Related Tools and Guides
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.internalLinks.slice(0, 8).map((link) => (
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

        {/* Author & Updated */}
        <div
          className="mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface, #EFF2F8)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Built by AdmitPath team
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
        <MarketingCTA
          heading="Want the full AI college counselor?"
          description="Score your profile across 7 dimensions calibrated to real CDS data. Get your free analysis in under 5 minutes."
          primaryLabel="Get Your Free Profile Score"
          primaryHref="/analyze"
          secondaryLabel="See All Free Tools"
          secondaryHref="/tools"
        />
      </MarketingLayout>
    </div>
  );
}

function formatLinkLabel(link: string): string {
  const slug = link.split("/").pop() || "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
