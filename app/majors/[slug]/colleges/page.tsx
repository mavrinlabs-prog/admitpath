import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase, HelpCircle, Clock, BookOpen } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { MAJORS, MAJOR_SLUGS, findMajor } from "@/data/seo-majors";
import { findCollege } from "@/data/colleges";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return MAJOR_SLUGS.map((slug) => ({ slug }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = findMajor(slug);
  if (!m) return { title: "Major not found" };
  const url = `${BASE}/majors/${m.slug}/colleges`;
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: m.metaTitle,
      description: m.metaDescription,
      url,
      siteName: "AdmitPath",
      locale: "en_US",
      type: "article",
      images: [{
        url: `${BASE}/api/og?title=${encodeURIComponent(`Best Colleges for ${m.name}`)}&subtitle=${encodeURIComponent(YEAR.toString())}`,
        width: 1200, height: 630,
        alt: `Best colleges for ${m.name}`,
      }],
    },
    twitter: { card: "summary_large_image", site: "@admitpath", title: m.metaTitle, description: m.metaDescription },
  };
}

export default async function MajorCollegesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = findMajor(slug);
  if (!m) notFound();

  const colleges = m.relatedColleges.map((slug) => findCollege(slug)).filter(Boolean);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: `Best Colleges for ${m.name} (${YEAR})`,
                url: `${BASE}/majors/${m.slug}/colleges`,
                publisher: { "@id": `${BASE}/#organization` },
                author: { "@id": `${BASE}/#founder` },
                dateModified: new Date().toISOString().split("T")[0],
              },
              {
                "@type": "FAQPage",
                mainEntity: m.faq.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: { "@type": "Answer", text: item.answer },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: BASE },
                  { "@type": "ListItem", position: 2, name: "Majors", item: `${BASE}/majors` },
                  { "@type": "ListItem", position: 3, name: m.name, item: `${BASE}/majors/${m.slug}/colleges` },
                ],
              },
            ],
          }),
        }}
      />

      <MarketingLayout
        eyebrow="MAJOR GUIDE"
        title={`Best Colleges for ${m.name} (${YEAR})`}
        description={m.metaDescription}
        maxWidth="max-w-4xl"
        backHref="/choose-a-major"
        backLabel="All Majors"
      >
        {/* College Rankings */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Top Colleges for {m.name}
          </h2>
          <div className="space-y-3">
            {colleges.map((c, i) => c && (
              <Link
                key={c.slug}
                href={`/colleges/${c.slug}`}
                className="group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md"
                style={{
                  backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: "#4A6FA5" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold group-hover:underline" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                    {c.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {c.city}, {c.state} &middot; {c.acceptanceRate}% acceptance rate &middot; {c.type === "private" ? "Private" : "Public"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                    SAT: {c.sat25}-{c.sat75} &middot; GPA: {c.gpaAvg} &middot; {c.enrollment.toLocaleString()} undergrads
                  </p>
                </div>
                <ArrowRight className="mt-2 h-4 w-4 flex-shrink-0 opacity-40 group-hover:opacity-100" style={{ color: "#4A6FA5" }} />
              </Link>
            ))}
          </div>
        </section>

        {/* Career Paths */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Career Paths for {m.name} Majors
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {m.careerPaths.map((career) => (
              <div
                key={career}
                className="flex items-center gap-2 rounded-xl border p-4"
                style={{
                  backgroundColor: "var(--color-surface-raised, #FFFFFF)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <Briefcase className="h-4 w-4 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                <p className="text-sm font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{career}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {m.faq.map((item, i) => (
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

        {/* Author */}
        <div
          className="mb-8 flex items-center gap-4 rounded-xl border p-4"
          style={{ backgroundColor: "var(--color-surface, #EFF2F8)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Written by AdmitPath team</p>
            <p className="text-xs" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              Rankings based on IPEDS data, program reputation, and career outcome metrics. Last updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
            </p>
          </div>
          <Clock className="h-4 w-4 flex-shrink-0" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
        </div>

        <MarketingCTA
          heading={`Find the right ${m.name} program`}
          description="Use the Major Exploration Map worksheet to match your interests to the best programs."
          primaryLabel="Explore Your Major Fit"
          primaryHref="/worksheets/major-exploration-map"
          secondaryLabel="Build Your College List"
          secondaryHref="/worksheets/college-list-generator"
        />
      </MarketingLayout>
    </div>
  );
}
