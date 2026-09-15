import Link from "next/link";
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import glossaryData from "@/../../public/glossary.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Admissions Glossary | 200+ Terms",
  description:
    "200+ college admissions terms defined in plain language. From yield protection to demonstrated interest. Searchable glossary for students and parents.",
  alternates: { canonical: `${BASE}/glossary` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Admissions Glossary — 38 Terms Explained",
    description: "Plain-English definitions for every admissions term: EA, ED, spike, yield protection, CSS Profile, and more.",
    url: `${BASE}/glossary`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Admissions+Glossary&subtitle=38+terms+explained+in+plain+English`, width: 1200, height: 630, alt: "College Admissions Glossary" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Admissions Glossary — 38 Terms", description: "Plain-English definitions for every admissions term.", images: [`${BASE}/api/og?title=Admissions+Glossary&subtitle=38+terms+explained+in+plain+English`] },
};

type GlossaryEntry = {
  term: string;
  definition: string;
};

export default function GlossaryPage() {
  const entries = glossaryData as GlossaryEntry[];

  // Group by first letter
  const grouped = entries.reduce<Record<string, GlossaryEntry[]>>((acc, e) => {
    const letter = e.term[0]!.toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter]!.push(e);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/glossary#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Admissions Glossary", item: `${BASE}/glossary` },
        ],
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${BASE}/glossary#termset`,
        name: "College Admissions Glossary",
        description: `Plain-English definitions for ${entries.length} college admissions terms.`,
        url: `${BASE}/glossary`,
        inLanguage: "en-US",
        hasDefinedTerm: entries.slice(0, 30).map((e) => ({
          "@type": "DefinedTerm",
          name: e.term,
          description: e.definition,
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${BASE}/glossary#page`,
        url: `${BASE}/glossary`,
        name: `College Admissions Glossary — ${entries.length} Terms Explained`,
        description: "Plain-English definitions for every college admissions term — from EA and ED to spike, yield protection, and CSS Profile.",
        isPartOf: { "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${BASE}/glossary#breadcrumb` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <MarketingLayout
      eyebrow="Reference"
      title="Admissions Glossary"
      description={`${entries.length} terms explained in plain English. No jargon, no condescension — just what you need to know.`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Letter quick nav */}
      <div className="mb-10 flex flex-wrap gap-1">
        {letters.map((l) => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[13px] font-semibold transition-colors hover:bg-[color:rgba(74,111,165,0.08)] hover:text-[#4A6FA5]"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            {l}
          </a>
        ))}
      </div>

      {/* Terms */}
      {letters.map((l) => (
        <section key={l} className="mb-8" id={`letter-${l}`}>
          <h2
            className="mb-3 flex items-center gap-2 text-[20px] font-bold"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-inter)",
            }}
          >
            {l}
          </h2>
          <div className="space-y-3">
            {grouped[l]!.map((e) => (
              <div
                key={e.term}
                className="dl-card-hover rounded-xl border p-4"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <h3
                  className="text-[15px] font-semibold mb-1.5"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  {e.term}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                >
                  {e.definition}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Related resources */}
      <section className="mt-10 mb-10">
        <h2
          className="mb-3 text-[17px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Related resources
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admissions-jargon-decoder"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Jargon Decoder (full guides)
          </Link>
          <Link
            href="/faq"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Admissions FAQ
          </Link>
          <Link
            href="/college-application-checklist"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Application Checklist
          </Link>
          <Link
            href="/methodology"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Scoring Methodology
          </Link>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12">
        <MarketingCTA
          headline="Ready to start building your profile?"
          description="Put these terms into action. Create a free profile and see where you stand."
          buttonText="Create your free profile"
        />
      </div>
    </MarketingLayout>
  );
}
