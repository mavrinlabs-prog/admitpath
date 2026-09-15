import Link from "next/link";
import type { Metadata } from "next";
import { COLLEGES } from "@/data/colleges";
import {
  ArrowRight,
  Target,
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College List Builder — Free Tool",
  description:
    "Build a balanced college list: 2-3 reaches, 3-5 targets, 2-3 safeties calibrated to your profile. The 4-band probability framework used by top counselors.",
  alternates: { canonical: `${BASE}/college-list-builder` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How to Build a Balanced College List",
    description: "Build a balanced college list: reaches, targets, safeties using the 4-band probability framework.",
    url: `${BASE}/college-list-builder`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=College+List+Builder&subtitle=The+4-band+probability+framework`, width: 1200, height: 630, alt: "College List Builder Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "How to Build a Balanced College List", description: "4-band framework: reaches, targets, safeties calibrated to your profile.", images: [`${BASE}/api/og?title=College+List+Builder&subtitle=The+4-band+probability+framework`] },
};

const BANDS = [
  {
    label: "Very Likely",
    range: "≥ 70% admit probability",
    color: "#16A34A",
    description:
      "Schools where your profile clearly exceeds the typical admitted student. These are your safeties — but only if you'd actually attend AND can afford them.",
    rule: "Aim for 2-3 in this band.",
  },
  {
    label: "Possible",
    range: "30-70% admit probability",
    color: "#2563EB",
    description:
      "Schools where your profile is competitive but not assured. Most of your applications should land here. These are your targets.",
    rule: "Aim for 3-5 in this band.",
  },
  {
    label: "Long Shot",
    range: "10-30% admit probability",
    color: "#D97706",
    description:
      "Schools where you'd need things to break right. Worth applying to if they're true first choices and the supplements are manageable.",
    rule: "Aim for 2-3 in this band.",
  },
  {
    label: "Hail Mary",
    range: "≤ 10% admit probability",
    color: "#DC2626",
    description:
      "Acceptance would require everything aligning — a hook, a dream essay, an under-yielded year. Apply if it's a dream, but don't build your list around them.",
    rule: "Optional. Add 0-1 if you'd genuinely attend.",
  },
];

const COMMON_MISTAKES = [
  {
    mistake: "Top-heavy lists",
    detail: "8 reaches, 1 target, 1 safety. The most common pattern — and the one that produces the most disappointing April.",
    fix: "Build from your safeties up, not your reaches down. Verify each safety meets the 70%+ threshold AND you'd actually attend.",
  },
  {
    mistake: "Unaffordable safeties",
    detail: "A safety you can't afford to attend isn't a safety. Many state out-of-state options are admit-likely but cost-prohibitive.",
    fix: "Run net-price calculators on every safety before adding it. Net price < family budget = real safety.",
  },
  {
    mistake: "Fake safeties (rate above 50% but you're below the 75th percentile)",
    detail: "A 60%-admit-rate school is not a safety if you're below the 75th-percentile applicant.",
    fix: "Both criteria must hold: school admits >50% AND your profile is in the top 25% of admits.",
  },
  {
    mistake: "Confusing low admit rate with reach",
    detail: "A 4% admit rate at MIT and a 6% admit rate at Yale aren't the same level of reach for everyone. STEM applicants face different odds at each.",
    fix: "Calibrate against the school's specific factor weights (CDS Section C7), not raw admit rates.",
  },
  {
    mistake: "List size > 15 schools",
    detail: "Each additional supplemental essay reduces the quality of all of them. You can't write 15 strong supplements.",
    fix: "Cap at 10-12. Cut weakly-considered schools first.",
  },
  {
    mistake: "List size < 6 schools",
    detail: "Statistical variance demands diversification. Six schools is the minimum for safety against a bad-luck year.",
    fix: "Add 2-3 schools you'd genuinely attend, even if they aren't your favorites on paper.",
  },
];

const PAGE_FAQS = [
  { q: "How many colleges should I apply to?", a: "Most students should apply to 8-12 schools. Below 6 leaves you statistically exposed to a bad-luck year. Above 15 means each application gets less attention than it deserves. The ideal shape: 2-3 safeties, 3-5 targets, 2-3 reaches." },
  { q: "What is a balanced college list?", a: "A balanced list has schools across multiple probability bands: Very Likely (70%+ admit probability), Possible (30-70%), Long Shot (10-30%), and optionally Hail Mary (under 10%). Most of your applications should be in the Possible band." },
  { q: "How do I know if a school is a safety?", a: "A true safety meets two criteria: the school admits more than 50% of applicants AND your profile is in the top 25% of admitted students. A high admit-rate school where you're below the median is not a safety." },
  { q: "Should I apply to all Ivy League schools?", a: "Only if each one is genuinely a good fit. Applying to all 8 Ivies plus Stanford and MIT is a common pattern that produces poor results — each supplemental essay gets less attention, and admissions readers can tell when a 'Why Us' essay is generic." },
  { q: "Does Early Decision help my chances?", a: "Yes. ED admit rates are typically 2-3x higher than Regular Decision at most selective schools. The tradeoff: ED is binding, and you lose the ability to compare financial aid packages. Only apply ED to a school you'd attend at any offered price." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-list-builder#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College List Builder", item: `${BASE}/college-list-builder` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-list-builder#page`,
      url: `${BASE}/college-list-builder`,
      name: "How to Build a Balanced College List — The 4-Band Framework",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-list-builder#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/college-list-builder#article` },
    },
    {
      "@type": "Article",
      "@id": `${BASE}/college-list-builder#article`,
      headline: "How to Build a Balanced College List — The 4-Band Framework",
      description:
        "The honest math behind a balanced college list, the 4-band probability framework, and the most common mistakes.",
      datePublished: "2026-05-07",
      dateModified: "2026-05-07",
      author: { "@id": `${BASE}/about#editorial-team` },
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: PAGE_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function CollegeListBuilderPage() {
  return (
    <MarketingLayout
      eyebrow="The college list"
      title="Build a balanced college list, not a wish list"
      description="The single most important strategic decision in your application is your college list. Most students under-invest in it. Here's the framework that produces good outcomes — calibrated to your real profile, not raw admit rates."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* The honest setup */}
        <div
          className="mb-14 rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            <Target className="h-4 w-4" style={{ color: "#4A6FA5" }} />
            The shape of a balanced list
          </p>
          <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            For most students applying to selective colleges, a balanced list
            looks like this:
          </p>
          <ul className="space-y-1 text-[14px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            <li>• <span className="font-semibold">2-3 reaches</span> (Possible to Hail Mary bands)</li>
            <li>• <span className="font-semibold">3-5 targets</span> (Possible band — your profile is competitive)</li>
            <li>• <span className="font-semibold">2-3 safeties</span> (Very Likely band — you&apos;d almost certainly be admitted AND attend)</li>
          </ul>
          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Total: 7-11 schools. Below 6 leaves you exposed; above 15 means
            each application gets less attention than it should.
          </p>
        </div>

        {/* The bands */}
        <section className="mb-14">
          <h2
            className="mb-3 flex items-center gap-2 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            <Scale className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            The 4-band probability framework
          </h2>
          <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            False-precision percentages (&quot;you have a 23.4% chance at Brown&quot;)
            are noise, not signal. Bands are honest: each band is a range that
            reflects real uncertainty about a specific applicant at a specific
            school in a specific year.
          </p>
          <div className="space-y-3">
            {BANDS.map((b) => (
              <div
                key={b.label}
                className="dl-card-hover rounded-xl border p-5"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
                    style={{ background: b.color }}
                  >
                    {b.label}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {b.range}
                  </span>
                </div>
                <p className="mb-2 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {b.description}
                </p>
                <p className="text-[12px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {b.rule}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The math */}
        <section className="mb-14">
          <h2
            className="mb-3 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Why the math demands diversification
          </h2>
          <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The table below shows a simplified independence model using a 5%
            per-school probability: 1 − (0.95)<sup>N</sup>. It is an illustration,
            not an applicant prediction; admissions decisions are correlated and
            institutional admit rates are not personal probabilities.
          </p>
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <table className="w-full text-left text-[13px]">
              <thead style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                <tr>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Schools applied to</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>P(at least one admit)</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>P(zero admits)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>1</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>5%</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>95%</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>4</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>19%</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>81%</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>8</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>34%</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>66%</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>12</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>46%</td>
                  <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>54%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Under that simplified model, applying only to low-probability schools
            still leaves substantial risk. Build a balanced list and verify that
            every likely school is affordable and genuinely acceptable to you.
          </p>
        </section>

        {/* Common mistakes */}
        <section className="mb-14">
          <h2
            className="mb-5 flex items-center gap-2 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            <AlertTriangle className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            The 6 most common list-building mistakes
          </h2>
          <div className="space-y-4">
            {COMMON_MISTAKES.map((m, i) => (
              <div
                key={i}
                className="dl-card-hover rounded-xl border p-5"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <p
                  className="mb-2 flex items-center gap-2 text-[14px] font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  <XCircle className="h-4 w-4" style={{ color: "#DC2626" }} />
                  {m.mistake}
                </p>
                <p className="mb-2 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {m.detail}
                </p>
                <p className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#16A34A" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    <span className="font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Fix:</span> {m.fix}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2
            className="mb-5 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
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

        {/* CTA */}
        <div
          className="mt-8 rounded-2xl border p-8 text-center"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            See your bands at every school in our {COLLEGES.length}-college database
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/quiz"
              className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
            >
              Take the chances quiz
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex h-11 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors hover:border-[color:var(--dl-text-muted, #5A6275)]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)" }}
            >
              Open the full calculator
            </Link>
          </div>
        </div>
    </MarketingLayout>
  );
}
