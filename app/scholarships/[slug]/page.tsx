import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, DollarSign, Calendar, Users, ExternalLink, HelpCircle, Clock, Award } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { SCHOLARSHIPS, SCHOLARSHIP_SLUGS, findScholarship } from "@/data/seo-scholarships";
import { scholarshipSchema } from "@/lib/seo-schema";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return SCHOLARSHIP_SLUGS.map((slug) => ({ slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = findScholarship(slug);
  if (!s) return { title: "Scholarship not found" };
  const url = `${BASE}/scholarships/${s.slug}`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url,
      siteName: "AdmitPath",
      locale: "en_US",
      type: "article",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(s.shortName)}&subtitle=${encodeURIComponent(s.amount)}`,
        width: 1200, height: 630,
        alt: `${s.name} - ${s.amount}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@admitpath",
      title: s.metaTitle,
      description: s.metaDescription,
    },
  };
}

export default async function ScholarshipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = findScholarship(slug);
  if (!s) notFound();

  const schema = scholarshipSchema({
    name: s.name,
    slug: s.slug,
    amount: s.amount,
    description: s.metaDescription,
    faq: s.faq,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <MarketingLayout
        eyebrow="SCHOLARSHIP GUIDE"
        title={`${s.name}: Application Guide (${YEAR})`}
        description={s.metaDescription}
        maxWidth="max-w-4xl"
        backHref="/scholarships"
        backLabel="All Scholarships"
      >
        {/* Quick Facts */}
        <div
          className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { icon: DollarSign, label: "Award Amount", value: s.amount },
            { icon: Calendar, label: "Deadline", value: s.deadline },
            { icon: Award, label: "Renewability", value: s.renewability },
            { icon: ExternalLink, label: "Official Site", value: "Apply", href: s.website },
          ].map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border p-4"
              style={{
                backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                borderColor: "rgba(0,0,0,0.06)",
              }}
            >
              <fact.icon className="h-4 w-4 mb-2" style={{ color: "#4A6FA5" }} />
              <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                {fact.label}
              </p>
              {fact.href ? (
                <a
                  href={fact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: "#4A6FA5" }}
                >
                  {fact.value} &rarr;
                </a>
              ) : (
                <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {fact.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Eligibility Requirements
          </h2>
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface-raised, #FFFFFF)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {s.eligibility}
            </p>
          </div>
        </section>

        {/* How to Apply */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            How to Apply
          </h2>
          <div
            className="rounded-xl border p-6 space-y-4"
            style={{
              backgroundColor: "var(--color-surface-raised, #FFFFFF)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>1</div>
              <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Check eligibility requirements and gather necessary documents before the deadline ({s.deadline}).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>2</div>
              <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Visit the official application portal and create an account.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>3</div>
              <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Complete the application, including essays and supporting materials.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#4A6FA5" }}>4</div>
              <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Submit before the deadline and follow up to confirm receipt.
              </p>
            </div>
            <a
              href={s.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#4A6FA5" }}
            >
              <ExternalLink className="h-4 w-4" />
              Visit Official Application
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {s.faq.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border p-5"
                style={{
                  backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <h3 className="text-sm font-semibold mb-2 flex items-start gap-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                  {item.question}
                </h3>
                <p className="text-sm leading-relaxed pl-6" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Related Scholarships and Guides
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {s.internalLinks.map((link) => (
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
                {link.split("/").pop()?.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </Link>
            ))}
          </div>
        </div>

        {/* Author and date */}
        <div
          className="mb-8 flex items-center gap-4 rounded-xl border p-4"
          style={{ backgroundColor: "var(--color-surface, #EFF2F8)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Written by AdmitPath team</p>
            <p className="text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              Verified against official scholarship sources. Last updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
            </p>
          </div>
          <Clock className="h-4 w-4 flex-shrink-0" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
        </div>

        <MarketingCTA
          heading="Find more scholarships"
          description="Use the AdmitPath Scholarship Match tool to find scholarships you qualify for."
          primaryLabel="Find Scholarships"
          primaryHref="/scholarship-match"
          secondaryLabel="See All Scholarships"
          secondaryHref="/scholarships"
        />
      </MarketingLayout>
    </div>
  );
}
