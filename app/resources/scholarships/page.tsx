import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { ScholarshipsDirectory } from "@/components/resources/scholarships-directory";
import { SCHOLARSHIPS } from "@/data/scholarships-db";
import type { ScholarshipResource } from "@/lib/resource-filters";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");
const SCHOLARSHIP_COUNT = SCHOLARSHIPS.length;

export const metadata: Metadata = {
  title: "Scholarships for High School Students (2026)",
  description:
    `${SCHOLARSHIP_COUNT} curated scholarships with amounts, deadlines, eligibility, and direct provider links. Free.`,
  alternates: { canonical: `${BASE}/resources/scholarships` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Scholarships for High School Students (2026)",
    description: `${SCHOLARSHIP_COUNT} curated scholarships with amounts, deadlines, eligibility, and direct provider links. Free.`,
    url: `${BASE}/resources/scholarships`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=${encodeURIComponent("Scholarships for High School Students")}&subtitle=${encodeURIComponent(`${SCHOLARSHIP_COUNT} scholarships + amounts + deadlines + eligibility`)}`, width: 1200, height: 630, alt: "Scholarships Guide" }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Scholarships for High School Students", description: `${SCHOLARSHIP_COUNT} curated scholarships with amounts, deadlines, and eligibility. Free.`, images: [`${BASE}/api/og?title=${encodeURIComponent("Scholarships for High School Students")}&subtitle=${encodeURIComponent(`${SCHOLARSHIP_COUNT} scholarships + amounts + deadlines + eligibility`)}`] },
};

export default function ScholarshipsPage() {
  const items: ScholarshipResource[] = SCHOLARSHIPS.map((scholarship) => ({
    id: scholarship.id,
    name: scholarship.name,
    amount: scholarship.amount,
    deadline: scholarship.deadline,
    eligibility: scholarship.eligibility,
    category: scholarship.type,
    renewable: scholarship.renewability === "renewable",
    url: scholarship.url,
    description: scholarship.description,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/resources/scholarships#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
          { "@type": "ListItem", position: 3, name: "Scholarships", item: `${BASE}/resources/scholarships` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${BASE}/resources/scholarships#page`,
        url: `${BASE}/resources/scholarships`,
        name: "Scholarships for High School Students",
        isPartOf: { "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${BASE}/resources/scholarships#breadcrumb` },
        inLanguage: "en-US",
        mainEntity: { "@id": `${BASE}/resources/scholarships#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${BASE}/resources/scholarships#list`,
        name: "Curated Scholarships",
        numberOfItems: items.length,
        itemListElement: items.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "MonetaryGrant",
            name: s.name,
            description: s.description,
            url: s.url,
            amount: { "@type": "MonetaryAmount", value: s.amount, currency: "USD" },
          },
        })),
      },
      {
        "@type": "LearningResource",
        "@id": `${BASE}/resources/scholarships#resource`,
        name: "Scholarships for High School Students",
        description: `${items.length} curated scholarships with amounts, deadlines, eligibility, and direct application links.`,
        url: `${BASE}/resources/scholarships`,
        learningResourceType: "Reference",
        educationalLevel: ["HighSchool"],
        audience: { "@type": "EducationalAudience", educationalRole: "student" },
        isAccessibleForFree: true,
        inLanguage: "en-US",
        provider: { "@id": `${BASE}/#organization` },
      },
    ],
  };

  return (
    <MarketingLayout
      eyebrow="Resources"
      title="Scholarships"
      description={`${items.length} scholarships ranging from $500 to full cost of attendance. Start applications early — most deadlines fall in September through February of senior year.`}
      backHref="/resources"
      backLabel="All resources"
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        <ScholarshipsDirectory scholarships={items} />

        {/* Related tools */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/scholarship-match"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Scholarship Finder
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Filter the scholarship catalog using profile fields and review possible fits. Verify eligibility and deadlines on each provider&apos;s official page.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Find scholarships <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/resources/financial-aid"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Financial Aid Guide
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              FAFSA, CSS Profile, need-based vs. merit aid, and the full timeline for maximizing your award.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Read the guide <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <MarketingCTA
            headline="Find scholarships you qualify for"
            description="Create your free profile and get matched with scholarships based on your GPA, test scores, and extracurriculars."
            buttonText="Create your free profile"
          />
        </div>
    </MarketingLayout>
  );
}
