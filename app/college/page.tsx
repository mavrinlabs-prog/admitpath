import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { COLLEGES } from "@/data/colleges";

export const revalidate = 86400;

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Profiles & Admissions Data 2026",
  description: `Browse 102+ college profiles with real acceptance rates, SAT/ACT ranges, and essay prompts from Common Data Set reports. Find your target schools.`,
  alternates: { canonical: `${BASE}/college` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Admissions Stats: Acceptance Rates, GPA, SAT (2026)",
    description: "Acceptance rates, SAT ranges, and average GPAs for top US colleges, in one place.",
    url: `${BASE}/college`,
    type: "website",
    siteName: "AdmitPath",
    locale: "en_US",
    images: [
      {
        url: `${BASE}/api/og?title=College+Admissions+Stats&subtitle=Acceptance+rates%2C+SAT%2C+GPA+for+top+US+colleges`,
        width: 1200,
        height: 630,
        alt: "College admissions stats — acceptance rates, SAT, GPA for top US colleges.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "College Admissions Stats: Acceptance Rates, GPA, SAT (2026)",
    description: "Side-by-side admissions data for top US colleges.",
    images: [
      {
        url: `${BASE}/api/og?title=College+Admissions+Stats&subtitle=Acceptance+rates%2C+SAT%2C+GPA+for+top+US+colleges`,
        alt: "College admissions stats.",
      },
    ],
  },
};

const LAC_SLUGS = new Set([
  "williams-college", "amherst-college", "swarthmore-college", "pomona-college",
  "wellesley-college", "bowdoin-college", "middlebury-college", "claremont-mckenna-college",
  "washington-and-lee-university", "colby-college", "harvey-mudd-college", "carleton-college",
  "haverford-college", "davidson-college", "grinnell-college", "hamilton-college",
  "colgate-university", "barnard-college", "smith-college", "colorado-college", "oberlin-college",
]);

export default function CollegeIndex() {
  const ivies = COLLEGES.filter((c) => c.ivy);
  const lacs = COLLEGES.filter((c) => LAC_SLUGS.has(c.slug));
  const publics = COLLEGES.filter((c) => c.type === "public");
  const others = COLLEGES.filter((c) => !c.ivy && !LAC_SLUGS.has(c.slug) && c.type !== "public");

  return (
    <MarketingLayout
      eyebrow="College admissions data"
      title="Acceptance rates, SAT, and GPA for top US colleges"
      description={`Browse the latest admissions stats for ${COLLEGES.length}+ top US universities. Click any school for full details, FAQs, and a free chances calculator.`}
      maxWidth="max-w-5xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: COLLEGES.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${BASE}/colleges/${c.slug}`,
              name: c.name,
            })),
          }),
        }}
      />

      <section aria-labelledby="ivies-heading" className="mb-12">
        <h2 id="ivies-heading" className="text-2xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>Ivy League</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ivies.map((c) => (
            <CollegeCard key={c.slug} c={c} />
          ))}
        </div>
      </section>

      <section aria-labelledby="private-heading" className="mb-12">
        <h2 id="private-heading" className="text-2xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>Top private universities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {others.map((c) => (
            <CollegeCard key={c.slug} c={c} />
          ))}
        </div>
      </section>

      <section aria-labelledby="lac-heading" className="mb-12">
        <h2 id="lac-heading" className="text-2xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>Top liberal arts colleges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {lacs.map((c) => (
            <CollegeCard key={c.slug} c={c} />
          ))}
        </div>
      </section>

      <section aria-labelledby="public-heading" className="mb-12">
        <h2 id="public-heading" className="text-2xl font-bold mb-4" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>Public flagship universities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {publics.map((c) => (
            <CollegeCard key={c.slug} c={c} />
          ))}
        </div>
      </section>

      <MarketingCTA
        headline="See your real chances at any of these schools"
        description="AdmitPath scores your profile across 7 dimensions — and tells you, honestly, where you stand."
        buttonText="Sign up free"
      />
    </MarketingLayout>
  );
}

function CollegeCard({ c }: { c: typeof COLLEGES[number] }) {
  return (
    <Link
      href={`/college/${c.slug}`}
      className="dl-card-hover rounded-2xl border p-4 transition-colors hover:bg-[rgba(255,255,255,0.45)]"
      style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="font-bold mb-0.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{c.shortName}</div>
      <div className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{c.acceptanceRate}% acceptance · {c.sat25}-{c.sat75} SAT</div>
    </Link>
  );
}
