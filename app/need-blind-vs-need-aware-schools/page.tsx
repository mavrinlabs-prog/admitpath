import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  Eye,
  EyeOff,
  DollarSign,
  Globe,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Need-Blind vs Need-Aware — 2026 College List",
  description:
    "Need-blind vs need-aware colleges: complete 2026 list for domestic and international students, and what each policy means for your strategy.",
  alternates: { canonical: `${BASE}/need-blind-vs-need-aware-schools` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Need-Blind vs Need-Aware Colleges — 2026 List",
    description: "Complete 2026 list of need-blind and need-aware schools for domestic and international students.",
    url: `${BASE}/need-blind-vs-need-aware-schools`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Need-Blind+vs+Need-Aware&subtitle=Complete+2026+list`, width: 1200, height: 630, alt: "Need-Blind vs Need-Aware Colleges" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Need-Blind vs Need-Aware — 2026 List", description: "Complete 2026 list for domestic and international students.", images: [`${BASE}/api/og?title=Need-Blind+vs+Need-Aware&subtitle=Complete+2026+list`] },
};

const NEED_BLIND_DOMESTIC_AND_INTL = [
  { school: "Harvard University", note: "Meets 100% of need; no loans." },
  { school: "Yale University", note: "Meets 100% of need; no loans for families <$200K AGI." },
  { school: "Princeton University", note: "Meets 100% of need; no loans; $0 family contribution under $100K AGI." },
  { school: "MIT", note: "Meets 100% of need; no loans for families <$140K AGI." },
  { school: "Amherst College", note: "Meets 100% of need; no loans." },
  { school: "Brown University", note: "Need-blind for international applicants since 2024." },
  { school: "Dartmouth College", note: "Need-blind for international applicants since 2022." },
  { school: "Bowdoin College", note: "Meets 100% of need; no loans." },
  { school: "Notre Dame", note: "Need-blind for international applicants since 2024." },
];

const NEED_BLIND_DOMESTIC_ONLY = [
  { school: "Stanford University", note: "Need-aware for international applicants. Meets 100% of need for admitted internationals." },
  { school: "Columbia University", note: "Need-aware for international applicants." },
  { school: "Penn (University of Pennsylvania)", note: "Need-aware for international applicants. Meets 100% of need for admitted internationals." },
  { school: "Cornell University", note: "Need-aware for international applicants." },
  { school: "Duke University", note: "Need-aware for international applicants." },
  { school: "University of Chicago", note: "Need-aware for international applicants." },
  { school: "Northwestern University", note: "Need-aware for international applicants." },
  { school: "Johns Hopkins University", note: "Need-aware for international applicants. Meets 100% of need for admitted internationals." },
  { school: "Williams College", note: "Need-aware for international applicants." },
  { school: "Pomona College", note: "Need-aware for international applicants." },
  { school: "Wellesley College", note: "Need-aware for international applicants." },
  { school: "Swarthmore College", note: "Need-aware for international applicants." },
  { school: "Vanderbilt University", note: "Need-aware for international applicants. Meets 100% of need for admitted internationals." },
  { school: "Rice University", note: "Need-aware for international applicants." },
  { school: "Washington University in St. Louis", note: "Need-aware for international applicants." },
  { school: "Most state flagships (UC system, Texas, Michigan, Virginia, etc.)", note: "Need-blind for in-state students; need-aware for out-of-state and international." },
];

const NEED_AWARE_SCHOOLS = [
  "Most colleges in the US are need-aware to some degree. The list above is the exception, not the norm.",
  "Need-aware means: a portion of the admissions decision considers your ability to pay. Your financial need can affect your admit/deny decision.",
  "Most need-aware schools are need-aware only for marginal applicants — strong applicants are often admitted regardless of need.",
  "Many less-selective private schools and second-tier privates are need-aware. They have aid budgets and balance them across the class.",
  "International applicants face need-aware status at most US schools (only 9 schools are need-blind for internationals as of 2026).",
];

const STRATEGY_LOW_INCOME = [
  "Apply to all need-blind, meets-100%-need schools you're competitive at — these have the strongest aid for low-income applicants.",
  "Use Princeton's $0 family contribution under $100K AGI as a benchmark — this is the gold standard.",
  "Apply ED only to need-blind schools where you can confirm the aid will be acceptable. Most ED schools' net price calculators are accurate.",
  "Consider QuestBridge College Match if you're high-achieving and below the income threshold ($65K AGI).",
  "Many need-blind schools have no-loan financial aid — an offer of $80K total cost might come back as $5K family contribution + $0 loans.",
  "Some need-aware schools do meet 100% of demonstrated need for ADMITTED applicants (e.g., USC, Vanderbilt, Rice, JHU). These are realistic targets if you're competitive on academics.",
];

const STRATEGY_INTERNATIONAL = [
  "Need-blind for international: 9 schools (Harvard, Yale, Princeton, MIT, Amherst, Brown, Dartmouth, Bowdoin, Notre Dame). Apply to as many of these as you're competitive at.",
  "Need-aware for international: most other selective US schools. Your need DOES factor into the admit decision.",
  "Some schools are need-aware but generous with admitted internationals (Stanford, Penn, Vanderbilt, JHU). Strong applicants often get full aid even at need-aware schools.",
  "International students requesting full aid at need-aware schools face harder admissions than full-pay internationals. Be realistic about this.",
  "Look at meets-100%-of-need schools, not just need-blind. A need-aware school that meets 100% of need is a stronger financial fit than a need-blind school that gaps.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/need-blind-vs-need-aware-schools#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Need-Blind vs Need-Aware Schools", item: `${BASE}/need-blind-vs-need-aware-schools` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/need-blind-vs-need-aware-schools#page`,
      url: `${BASE}/need-blind-vs-need-aware-schools`,
      name: "Need-Blind vs Need-Aware Colleges — Complete 2026 List",
      description: "Comprehensive list of need-blind colleges (for domestics + internationals), need-blind-for-domestics-only schools, need-aware schools, and application strategy guidance.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/need-blind-vs-need-aware-schools#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What does need-blind mean?", acceptedAnswer: { "@type": "Answer", text: "Need-blind means the admissions office makes accept/reject decisions without knowing how much financial aid an applicant would need. Your family's financial situation has no impact on the admissions decision. About 100 US schools are need-blind for domestic applicants. Only Harvard, Yale, Princeton, MIT, and Amherst are need-blind for international applicants." } },
        { "@type": "Question", name: "What does need-aware mean?", acceptedAnswer: { "@type": "Answer", text: "Need-aware (also called need-sensitive or need-conscious) means the school considers an applicant's financial need as one factor in the admissions decision. In practice, this means that two equally qualified applicants may receive different decisions based on who needs more financial aid. This typically affects only borderline applicants." } },
        { "@type": "Question", name: "Should I apply to need-aware schools if I need financial aid?", acceptedAnswer: { "@type": "Answer", text: "Yes, but strategically. If your application is strong enough to be admitted well above the borderline, need-awareness won't affect you. Need-awareness primarily impacts students on the admit/deny boundary. Apply to a mix of need-blind and need-aware schools, with need-blind schools as your financial safety net." } },
      ],
    },
  ],
};

const PAGE_FAQS = [
  { q: "What does need-blind mean?", a: "Need-blind means the admissions office makes accept/reject decisions without knowing how much financial aid an applicant would need. Your family's financial situation has no impact on the admissions decision. About 100 US schools are need-blind for domestic applicants. Only Harvard, Yale, Princeton, MIT, and Amherst are need-blind for international applicants." },
  { q: "What does need-aware mean?", a: "Need-aware (also called need-sensitive or need-conscious) means the school considers an applicant's financial need as one factor in the admissions decision. In practice, this means that two equally qualified applicants may receive different decisions based on who needs more financial aid. This typically affects only borderline applicants." },
  { q: "Should I apply to need-aware schools if I need financial aid?", a: "Yes, but strategically. If your application is strong enough to be admitted well above the borderline, need-awareness won't affect you. Need-awareness primarily impacts students on the admit/deny boundary. Apply to a mix of need-blind and need-aware schools, with need-blind schools as your financial safety net." },
];

export default function NeedBlindVsNeedAwarePage() {
  return (
    <MarketingLayout
      eyebrow="Financial Aid Reference"
      title="Need-Blind vs Need-Aware Schools"
      description="A school's need-blind / need-aware policy directly affects your admissions chances if you're requesting financial aid. Here's the complete 2026 list, what each policy means in practice, and how to use it for application strategy."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* What the terms mean */}
      <section className="mb-12">
        <h2
          className="mb-3 text-[22px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          What each term means
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}>
            <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Need-blind
            </h3>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Admissions decisions are made WITHOUT considering your ability to pay. Your need does not affect whether you&apos;re admitted. This is the strongest commitment to equal-access admissions.
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}>
            <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Need-aware (also called need-sensitive)
            </h3>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Admissions decisions DO factor your ability to pay, especially for marginal applicants. Strong applicants are often admitted regardless of need; borderline applicants may be denied if they request more aid than the school can offer.
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}>
            <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Meets 100% of demonstrated need
            </h3>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              If admitted, the school provides aid covering the full demonstrated need (calculated by the school&apos;s formula). This applies to both need-blind AND need-aware schools — many need-aware schools meet 100% of need for ADMITTED applicants.
            </p>
          </div>
        </div>
      </section>

      {/* Need-blind for everyone */}
      <Section
        title="Need-blind for ALL applicants (incl. international)"
        Icon={Eye}
        description="The strongest commitment. As of 2026, only 9 US schools are fully need-blind including for international applicants."
      >
        <div className="space-y-2">
          {NEED_BLIND_DOMESTIC_AND_INTL.map((s) => (
            <div
              key={s.school}
              className="dl-card-hover rounded-lg border p-3"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-[14.5px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {s.school}
              </h3>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Need-blind for domestic only */}
      <Section
        title="Need-blind for US applicants, need-aware for international"
        Icon={EyeOff}
        description="Many top schools are need-blind only for US applicants. Most still meet 100% of need for admitted internationals."
      >
        <div className="space-y-2">
          {NEED_BLIND_DOMESTIC_ONLY.map((s) => (
            <div
              key={s.school}
              className="dl-card-hover rounded-lg border p-3"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-[14.5px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {s.school}
              </h3>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Need-aware general guidance */}
      <Section title="Need-aware schools (general guidance)" Icon={DollarSign}>
        <ul className="space-y-2">
          {NEED_AWARE_SCHOOLS.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Strategy: low-income */}
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            <DollarSign className="h-4 w-4" style={{ color: "#4A6FA5" }} />
            Low-income strategy
          </h3>
          <ul className="space-y-2">
            {STRATEGY_LOW_INCOME.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            <Globe className="h-4 w-4" style={{ color: "#4A6FA5" }} />
            International applicant strategy
          </h3>
          <ul className="space-y-2">
            {STRATEGY_INTERNATIONAL.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-5 text-[22px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {PAGE_FAQS.map(({ q, a }) => (
            <details key={q} className="dl-card-hover rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
              <summary className="cursor-pointer font-bold text-base" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{q}</summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <MarketingCTA
        headline="Build a financial-aid-aware school list."
        description="AdmitPath flags need-blind, need-aware, and meets-100%-need schools per applicant context — so you don't apply where the aid won't close the gap. Free plan included. Pro $19.99/mo."
        buttonText="Build my list"
      />
    </MarketingLayout>
  );
}
