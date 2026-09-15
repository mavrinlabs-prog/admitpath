import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { COLLEGES } from "@/data/colleges";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Pricing Comparison — Free vs Pro Feature Table",
  description:
    "Feature comparison of Free and Pro ($19.99/mo) AdmitPath plans. What's included and which plan fits you.",
  alternates: { canonical: `${BASE}/pricing-comparison` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pricing Comparison — Free vs Pro",
    description: "Feature comparison of Free and Pro ($19.99/mo) AdmitPath plans.",
    url: `${BASE}/pricing-comparison`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Pricing+Comparison&subtitle=Free+vs+Pro+features`, width: 1200, height: 630, alt: "AdmitPath Pricing Comparison" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Pricing Comparison — Free vs Pro", description: "Feature comparison of AdmitPath Free and Pro plans.", images: [`${BASE}/api/og?title=Pricing+Comparison&subtitle=Free+vs+Pro+features`] },
};

type Feature = {
  category: string;
  name: string;
  free: "yes" | "no" | "limited";
  pro: "yes" | "no" | "limited";
  detail?: string;
};

const FEATURES: Feature[] = [
  // Profile
  { category: "Profile scoring", name: "7-dimension profile score", free: "yes", pro: "yes" },
  { category: "Profile scoring", name: "Profile re-analyses", free: "limited", pro: "yes", detail: "Free: 5 total. Pro: no Free-plan cap." },
  { category: "Profile scoring", name: "Profile history with version tracking", free: "no", pro: "yes" },
  { category: "Profile scoring", name: "Per-school CDS C7 calibration", free: "yes", pro: "yes" },

  // College list
  { category: "College list", name: `Planning context for ${COLLEGES.length} college records`, free: "yes", pro: "yes" },
  { category: "College list", name: "Four-band planning estimate", free: "yes", pro: "yes" },
  { category: "College list", name: "Side-by-side school comparison", free: "yes", pro: "yes" },
  { category: "College list", name: "Personalized list with reach/target/safety bands", free: "no", pro: "yes" },
  { category: "College list", name: "Net-price estimator (your income)", free: "yes", pro: "yes" },

  // Essays
  { category: "Essays", name: "Essay feedback (6-rubric scoring)", free: "limited", pro: "yes", detail: "Free: 5 total. Pro: no Free-plan cap." },
  { category: "Essays", name: "Essay version history", free: "no", pro: "yes" },
  { category: "Essays", name: "Real-time voice + specificity scoring", free: "no", pro: "yes" },
  { category: "Essays", name: "Why-Us coach (per school)", free: "no", pro: "yes" },

  // Counseling
  { category: "Counseling", name: "30/60/90-day action plan", free: "limited", pro: "yes", detail: "Free: top 3 actions only. Pro: full action plan." },
  { category: "Counseling", name: "AI counselor chat", free: "limited", pro: "yes", detail: "Free: 5 messages. Pro: no Free-plan cap, subject to abuse safeguards and service availability." },
  { category: "Counseling", name: "Interview prep module (22 questions + tips)", free: "limited", pro: "yes", detail: "Free: 5 questions free. Pro: full set." },

  // Free tools (all available without account too)
  { category: "Free tools", name: "Deadlines tracker (50+ schools)", free: "yes", pro: "yes" },
  { category: "Free tools", name: "Application timeline", free: "yes", pro: "yes" },
  { category: "Free tools", name: "Glossary, FAQ, Methodology", free: "yes", pro: "yes" },

];

const CATEGORIES = Array.from(new Set(FEATURES.map((f) => f.category)));

function Cell({ value }: { value: "yes" | "no" | "limited" }) {
  if (value === "yes") return <CheckCircle2 className="h-4 w-4" style={{ color: "#16A34A" }} aria-label="Included" />;
  if (value === "limited") return <span className="text-[10px] font-bold" style={{ color: "#D97706" }}>LIMITED</span>;
  return <XCircle className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} aria-label="Not included" />;
}

const PLANS = [
  { name: "Free", price: "$0", description: "Get the 7-dimension score and college list.", cta: "Start free", highlighted: false },
  { name: "Pro", price: "$19.99/mo", description: "Analyses, essay feedback, AI counselor chat, and personalized planning without the Free-plan caps.", cta: "Go Pro", highlighted: true },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/pricing-comparison#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${BASE}/pricing` },
        { "@type": "ListItem", position: 3, name: "Comparison", item: `${BASE}/pricing-comparison` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/pricing-comparison#page`,
      url: `${BASE}/pricing-comparison`,
      name: "Pricing Comparison — Free vs Pro",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/pricing-comparison#breadcrumb` },
      inLanguage: "en-US",
    },
  ],
};

export default function PricingComparisonPage() {
  return (
    <MarketingLayout
      eyebrow="Pricing"
      title="Pricing Comparison"
      description="Detailed feature-by-feature comparison of both plans. Pick the one that fits your needs."
      backHref="/pricing"
      backLabel="Back to pricing"
      maxWidth="max-w-5xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* Plan summary cards */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="dl-card-hover rounded-2xl border p-5"
              style={{
                background: p.highlighted ? "rgba(74,111,165,0.08)" : "rgba(255,255,255,0.45)",
                borderColor: p.highlighted ? "#4A6FA5" : "rgba(0,0,0,0.06)",
                borderWidth: p.highlighted ? 2 : 1,
              }}
            >
              <p
                className="mb-1 text-[12px] font-semibold uppercase tracking-wider"
                style={{ color: p.highlighted ? "#4A6FA5" : "var(--dl-text-muted, #5A6275)" }}
              >
                {p.name}
              </p>
              <p
                className="mb-2 text-[24px] font-bold"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
              >
                {p.price}
              </p>
              <p className="mb-4 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.description}
              </p>
              <Link
                href="/sign-up"
                className={p.highlighted ? "btn-primary inline-flex h-9 items-center gap-1.5 px-4 text-sm" : "inline-flex h-9 items-center gap-1.5 rounded-md border px-4 text-sm font-medium transition-colors hover:border-[color:var(--dl-text-muted, #5A6275)]"}
                style={p.highlighted ? undefined : { borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)" }}
              >
                {p.cta}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>

        {/* Feature table by category */}
        {CATEGORIES.map((cat) => {
          const items = FEATURES.filter((f) => f.category === cat);
          return (
            <section key={cat} className="mb-10">
              <h2
                className="mb-3 text-[18px] font-semibold"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
              >
                {cat}
              </h2>
              <div
                className="overflow-x-auto rounded-xl border"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <table className="w-full text-left text-[13px]">
                  <thead style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                    <tr>
                      <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Feature</th>
                      <th className="w-20 px-4 py-2.5 text-center font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Free</th>
                      <th className="w-20 px-4 py-2.5 text-center font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((f, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                        <td className="px-4 py-3 align-top">
                          <p style={{ color: "var(--dl-text-primary, #1B2030)" }}>{f.name}</p>
                          {f.detail && (
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{f.detail}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center align-top">
                          <div className="inline-flex"><Cell value={f.free} /></div>
                        </td>
                        <td className="px-4 py-3 text-center align-top">
                          <div className="inline-flex"><Cell value={f.pro} /></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        {/* Cross-link */}
        <div
          className="mt-12 rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p className="mb-2 text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Still have questions?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pricing-faq"
              className="inline-flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: "#4A6FA5" }}
            >
              Pricing FAQ <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/vs-college-counselor"
              className="inline-flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: "#4A6FA5" }}
            >
              vs Private counselor <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: "#4A6FA5" }}
            >
              How it works <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Start free — upgrade when ready
          </p>
          <Link
            href="/sign-up"
            className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            Create your free profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
    </MarketingLayout>
  );
}
