import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, MapPin, Trophy, DollarSign, HelpCircle } from "lucide-react";
import { STATES, STATE_SLUGS, findState } from "@/data/seo-states";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return STATE_SLUGS.map((state) => ({ state }));
}

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = findState(state);
  if (!s) return { title: "State not found" };
  const url = `${BASE}/states/${s.slug}`;
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
        url: `${BASE}/api/og?title=${encodeURIComponent(`${s.name} College Admissions`)}&subtitle=${encodeURIComponent(YEAR.toString())}`,
        width: 1200, height: 630,
        alt: `${s.name} college admissions guide`,
      }],
    },
    twitter: { card: "summary_large_image", site: "@admitpath", title: s.metaTitle, description: s.metaDescription },
  };
}

export default async function StateAdmissionsPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = findState(state);
  if (!s) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "States", item: `${BASE}/states` },
      { "@type": "ListItem", position: 3, name: s.name, item: `${BASE}/states/${s.slug}` },
    ],
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li>/</li>
            <li><Link href="/states" className="hover:underline">States</Link></li>
            <li>/</li>
            <li style={{ color: "var(--dl-text-primary, #1B2030)" }} className="font-medium">{s.name}</li>
          </ol>
        </nav>

        <h1 className="mb-4 text-4xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
          College Admissions for {s.name} Students
        </h1>
        <p className="mb-10 text-lg max-w-3xl" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          {s.metaDescription}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl p-5" style={{ backgroundColor: "var(--dl-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-3xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{s.satAverage}</p>
            <p className="text-sm" style={{ color: "var(--dl-text-muted, #8890A5)" }}>Average SAT ({s.abbreviation})</p>
          </div>
          <div className="rounded-xl p-5" style={{ backgroundColor: "var(--dl-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-3xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{s.collegeBound}</p>
            <p className="text-sm" style={{ color: "var(--dl-text-muted, #8890A5)" }}>College-going rate</p>
          </div>
          <div className="rounded-xl p-5" style={{ backgroundColor: "var(--dl-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-lg font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{s.meritScholarship}</p>
            <p className="text-sm" style={{ color: "var(--dl-text-muted, #8890A5)" }}>State merit scholarship</p>
          </div>
        </div>

        {/* Top Public Colleges */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Top Public Colleges in {s.name}</h2>
          <div className="flex flex-wrap gap-2">
            {s.topPublics.map((c) => (
              <span key={c} className="rounded-full px-4 py-2 text-sm font-medium" style={{ backgroundColor: "var(--dl-surface-raised, #FFFFFF)", color: "var(--dl-text-primary, #1B2030)", border: "1px solid rgba(0,0,0,0.06)" }}>
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* Top Private Colleges */}
        {s.topPrivates.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Top Private Colleges in {s.name}</h2>
            <div className="flex flex-wrap gap-2">
              {s.topPrivates.map((c) => (
                <span key={c} className="rounded-full px-4 py-2 text-sm font-medium" style={{ backgroundColor: "var(--dl-surface-raised, #FFFFFF)", color: "var(--dl-text-primary, #1B2030)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {s.faq.map((f) => (
              <details key={f.question} className="rounded-xl p-5 group" style={{ backgroundColor: "var(--dl-surface-raised, #FFFFFF)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <summary className="cursor-pointer font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{f.question}</summary>
                <p className="mt-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl p-10 text-center text-white" style={{ backgroundColor: "var(--dl-brand, #4A6FA5)" }}>
          <h2 className="mb-3 text-2xl font-bold">Get Your {s.name} Admissions Advantage</h2>
          <p className="mb-6 text-white/80">College admissions analysis for {s.name} students. Free plan included.</p>
          <Link href="/profile/create" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold hover:bg-white/90" style={{ color: "var(--dl-brand, #4A6FA5)" }}>
            Start Free Analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Other states */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>College Admissions by State</h2>
          <div className="flex flex-wrap gap-2">
            {STATES.filter((st) => st.slug !== s.slug).slice(0, 20).map((st) => (
              <Link key={st.slug} href={`/states/${st.slug}`} className="rounded-lg px-3 py-1.5 text-sm hover:underline" style={{ backgroundColor: "var(--dl-surface-raised, #FFFFFF)", color: "var(--dl-text-muted, #8890A5)", border: "1px solid rgba(0,0,0,0.06)" }}>
                {st.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
