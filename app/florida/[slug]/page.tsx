import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, GraduationCap, HelpCircle, Clock, BookOpen } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { FLORIDA_PAGES, FLORIDA_SLUGS, findFloridaPage } from "@/data/seo-florida";
import { findCollege } from "@/data/colleges";
import { floridaPageSchema } from "@/lib/seo-schema";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return FLORIDA_SLUGS.map((slug) => ({ slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fp = findFloridaPage(slug);
  if (!fp) return { title: "Page not found" };
  const url = `${BASE}/florida/${fp.slug}`;
  return {
    title: fp.metaTitle,
    description: fp.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: fp.metaTitle,
      description: fp.metaDescription,
      url,
      siteName: "AdmitPath",
      locale: "en_US",
      type: "article",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(fp.h1)}&subtitle=${encodeURIComponent("Florida Admissions Guide")}`,
        width: 1200, height: 630,
        alt: fp.h1,
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@admitpath",
      title: fp.metaTitle,
      description: fp.metaDescription,
    },
  };
}

export default async function FloridaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fp = findFloridaPage(slug);
  if (!fp) notFound();

  const schema = floridaPageSchema({
    title: fp.h1,
    slug: fp.slug,
    city: fp.city,
    faq: fp.faq,
  });

  const nearbyColleges = fp.nearbySchools
    .map((slug) => findCollege(slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <MarketingLayout
        eyebrow="FLORIDA ADMISSIONS"
        title={fp.h1}
        description={fp.metaDescription}
        maxWidth="max-w-4xl"
        backHref="/florida/admissions-guide"
        backLabel="Florida Guide"
      >
        {/* Location Badge */}
        <div className="mb-8 flex items-center gap-2">
          <MapPin className="h-4 w-4" style={{ color: "#4A6FA5" }} />
          <span className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
            {fp.city}, Florida
          </span>
        </div>

        {/* Key Florida Schools */}
        {nearbyColleges.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Top Florida Schools for {fp.city} Students
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {nearbyColleges.map((c) => c && (
                <Link
                  key={c.slug}
                  href={`/how-to-get-into/${c.slug}`}
                  className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-md"
                  style={{
                    backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <GraduationCap className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                  <div>
                    <p className="text-sm font-semibold group-hover:underline" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                      {c.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {c.acceptanceRate}% acceptance rate &middot; {c.city}, {c.state}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto mt-1 h-3.5 w-3.5 flex-shrink-0 opacity-40 group-hover:opacity-100" style={{ color: "#4A6FA5" }} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bright Futures Quick Reference */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Bright Futures Scholarship — Quick Reference
          </h2>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--color-surface, #EFF2F8)" }}>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Tier</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>GPA</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>SAT/ACT</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Award</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "var(--color-surface-raised, #FFFFFF)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>FAS (Academic Scholars)</td>
                  <td className="px-4 py-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>3.5 weighted</td>
                  <td className="px-4 py-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>1330 SAT / 29 ACT</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "#16a34a" }}>100% tuition</td>
                </tr>
                <tr style={{ backgroundColor: "var(--color-surface, #EFF2F8)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>FMS (Medallion Scholars)</td>
                  <td className="px-4 py-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>3.0 weighted</td>
                  <td className="px-4 py-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>1210 SAT / 25 ACT</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "#4A6FA5" }}>75% tuition</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
            Both tiers require 100+ community service hours. See{" "}
            <Link href="/scholarships/bright-futures" className="underline" style={{ color: "#4A6FA5" }}>
              full Bright Futures guide
            </Link>{" "}
            for details.
          </p>
        </section>

        {/* Dual Enrollment */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Dual Enrollment in {fp.city}
          </h2>
          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: "var(--color-surface-raised, #FFFFFF)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Florida has one of the strongest dual enrollment programs in the country. Eligible high school students can take college courses at no cost through local state colleges. Credits transfer to all Florida public universities through the statewide articulation agreement, and many private schools also accept them.
            </p>
            <Link
              href="/guides/dual-enrollment"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: "#4A6FA5" }}
            >
              Read the full dual enrollment guide
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {fp.faq.map((item, i) => (
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

        {/* Internal Links */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Related Resources
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {fp.internalLinks.map((link) => (
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

        {/* Author */}
        <div
          className="mb-8 flex items-center gap-4 rounded-xl border p-4"
          style={{ backgroundColor: "var(--color-surface, #EFF2F8)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Written by AdmitPath team</p>
            <p className="text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              Based in Sarasota, FL. Built by a current Florida high school student.
            </p>
          </div>
          <Clock className="h-4 w-4 flex-shrink-0" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
        </div>

        <MarketingCTA
          heading="Build your Florida college strategy"
          description="Score your profile against Florida schools. Free analysis in under 5 minutes."
          primaryLabel="Get Your Free Profile Score"
          primaryHref="/analyze"
          secondaryLabel="See Florida Schools"
          secondaryHref="/colleges"
        />
      </MarketingLayout>
    </div>
  );
}
