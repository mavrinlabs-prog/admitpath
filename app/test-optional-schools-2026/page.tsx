import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  ClipboardCheck,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Test-Optional Schools 2026 — Complete List",
  description:
    "2026 list of test-required, test-optional, and test-blind schools. Per-school submission strategy and when scores help or hurt.",
  alternates: { canonical: `${BASE}/test-optional-schools-2026` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Test-Optional Schools 2026 — Complete List",
    description: "2026 list of test-required, test-optional, and test-blind schools with submission strategy.",
    url: `${BASE}/test-optional-schools-2026`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Test-Optional+Schools+2026&subtitle=Complete+list+%C2%B7+submission+strategy`, width: 1200, height: 630, alt: "Test-Optional Schools 2026" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Test-Optional Schools 2026 — Complete List", description: "2026 list of test-required, test-optional, and test-blind schools.", images: [`${BASE}/api/og?title=Test-Optional+Schools+2026&subtitle=Complete+list+%C2%B7+submission+strategy`] },
};

const TEST_REQUIRED_2026 = [
  { school: "MIT", note: "Reinstated SAT/ACT requirement for fall 2024 admissions and forward. SAT or ACT required." },
  { school: "Yale University", note: "Reinstated test requirement for fall 2025 admissions (Class of 2030 and forward). SAT or ACT required." },
  { school: "Dartmouth College", note: "Reinstated test requirement in spring 2024 for fall 2024 admissions and forward. SAT or ACT required." },
  { school: "Brown University", note: "Reinstated test requirement for fall 2025 admissions (Class of 2030 and forward). SAT or ACT required." },
  { school: "Cornell University", note: "Reinstated test requirement for fall 2025 admissions (Class of 2030 and forward). SAT or ACT required." },
  { school: "Caltech", note: "Reinstated test requirement for 2025-26 admissions cycle. SAT or ACT required." },
  { school: "Georgetown University", note: "Has historically required testing; requires SAT or ACT for 2026 cycle." },
  { school: "Purdue University", note: "Reinstated test requirement for fall 2025 admissions." },
  { school: "Florida public universities (UF, FSU, USF, etc.)", note: "Florida public universities require SAT or ACT (state policy)." },
  { school: "Georgia public universities (UGA, Georgia Tech)", note: "Both reinstated test requirement for fall 2024 admissions." },
  { school: "University of Texas at Austin", note: "Reinstated test requirement. SAT or ACT required for all applicants." },
  { school: "Tennessee public universities", note: "State-mandated test requirement." },
  { school: "Auburn University", note: "Reinstated test requirement." },
  { school: "Most US service academies (Air Force, Army, Naval, Coast Guard)", note: "Require testing for application." },
  { school: "Most international university applicants", note: "International applicants face stricter testing requirements at most US schools, even at test-optional ones." },
];

const TEST_OPTIONAL_2026 = [
  { school: "Harvard, Princeton, Stanford, Penn, Columbia", note: "Test-optional through 2026 cycle. Strong scores at the upper end of admit range still recommended. Check each school's site for any policy updates." },
  { school: "Duke, Northwestern, Notre Dame, JHU, Vanderbilt, Rice, USC, Wash U", note: "Test-optional. Strong applicants typically still submit 1500+ SAT or 34+ ACT." },
  { school: "T20 LACs (Williams, Amherst, Pomona, Swarthmore, etc.)", note: "Test-optional. Strong applicants typically submit." },
  { school: "Most state flagships (UVA, UNC, Michigan, etc.)", note: "Test-optional for in-state and out-of-state applicants. Strong applicants typically submit if scores are above the median for admits. UT Austin now requires scores." },
  { school: "Most regional state schools and tier-2 privates", note: "Permanently test-optional in many cases. Test scores rarely a deciding factor at less-selective schools." },
];

const TEST_BLIND_2026 = [
  { school: "University of California (all 9 campuses)", note: "Test-blind since 2021. Will not see SAT/ACT scores even if you submit." },
  { school: "CSU (California State University, all campuses)", note: "Test-blind since 2021." },
  { school: "Reed College", note: "Test-blind." },
  { school: "Hampshire College", note: "Test-blind." },
];

const STRATEGY_BY_TIER = [
  { tier: "T20 schools", strategy: "Submit if 1500+ SAT or 34+ ACT. Below 1500/34, consider not submitting unless your score is significantly above the school's median for your demographic context. Submitting a 1450 to schools with 1500-1550 admit ranges generally hurts you." },
  { tier: "T20-50 schools", strategy: "Submit if 1450+ SAT or 32+ ACT. Below 1450/32, judge per school. Many schools' admits range from 1380-1530; the 25th percentile is often 1380-1420." },
  { tier: "State flagships", strategy: "Submit if your score is at or above the school's published 25th percentile. Below that, consider not submitting unless you have strong contextual reasons (under-represented background, strong upward trajectory)." },
  { tier: "Less-selective schools (>40% admit rate)", strategy: "Submit if you have a score. The downside is small; the upside is potential merit aid (some merit aid is tied to test scores even at test-optional schools)." },
];

const HOW_TO_DECIDE = [
  "Look up each school's published 25th and 75th percentile SAT/ACT for admitted students.",
  "Compare your score to the 25th percentile. Above it = generally submit. Significantly below it = consider not submitting.",
  "Account for your demographic context: under-represented students sometimes benefit from submitting slightly below the 25th percentile because admissions evaluates scores in context.",
  "Account for your spike: STEM-spike applicants applying to STEM-strong schools should submit math scores; humanities-spike applicants might benefit from submitting EBRW (verbal) scores.",
  "If unsure, submit. The 'cost' of submitting an okay score is usually less than the 'cost' of not submitting and looking like you're hiding a weak score.",
];

const COMMON_MISTAKES = [
  "Assuming 'test-optional' means scores don't matter. They still matter at most schools — they just give you the option to omit them.",
  "Submitting a low score because you took the test. If your score is significantly below the school's 25th percentile, omitting is usually better.",
  "Not submitting a strong score 'to look mysterious.' If you have a strong score, submit it. Strong scores help.",
  "Confusing test-optional with test-blind. Test-optional schools see your scores if you submit; test-blind schools won't see them even if submitted.",
  "Forgetting that international applicants often face stricter testing at otherwise-test-optional schools.",
  "Assuming the 2026 policy will be the same as the 2025 policy. Several schools have reinstated requirements; verify current policy at each school.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/test-optional-schools-2026#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Test-Optional Schools 2026", item: `${BASE}/test-optional-schools-2026` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/test-optional-schools-2026#page`,
      url: `${BASE}/test-optional-schools-2026`,
      name: "Test-Optional, Test-Blind & Test-Required Schools — 2026 Complete List",
      description: "Comprehensive 2026 list of test policies at US colleges plus per-school strategy guidance and the 6 most common mistakes.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/test-optional-schools-2026#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Should I submit my SAT/ACT scores to test-optional schools?", acceptedAnswer: { "@type": "Answer", text: "Submit if your scores are at or above the school's 50th percentile for admitted students. Don't submit if below the 25th percentile. Between 25th-50th, consider whether the rest of your application compensates. Check each school's Common Data Set Section C9 for score ranges." } },
        { "@type": "Question", name: "Which colleges require test scores in 2026?", acceptedAnswer: { "@type": "Answer", text: "MIT, Yale, Dartmouth, Brown, Cornell, Caltech, Georgetown, Purdue, UT Austin, Florida public universities, and Georgia Tech now require test scores. Harvard, Princeton, Stanford, Penn, and Columbia remain test-optional. The UC system is test-blind (scores not considered at all). Always check each school's current admissions page." } },
        { "@type": "Question", name: "Does going test-optional hurt my chances?", acceptedAnswer: { "@type": "Answer", text: "At genuinely test-optional schools, not submitting scores should not hurt your chances. However, at schools where 75%+ of admitted students submitted scores, not submitting may put you in a smaller, potentially more competitive pool. The decision should be based on whether your scores strengthen or weaken your overall application." } },
      ],
    },
  ],
};

const PAGE_FAQS = [
  { q: "Should I submit my SAT/ACT scores to test-optional schools?", a: "Submit if your scores are at or above the school's 50th percentile for admitted students. Don't submit if below the 25th percentile. Between 25th-50th, consider whether the rest of your application compensates. Check each school's Common Data Set Section C9 for score ranges." },
  { q: "Which colleges require test scores in 2026?", a: "MIT, Yale, Dartmouth, Brown, Cornell, Caltech, Georgetown, Purdue, UT Austin, Florida public universities, and Georgia Tech now require test scores. Harvard, Princeton, Stanford, Penn, and Columbia remain test-optional. The UC system is test-blind (scores not considered at all). Always check each school's current admissions page." },
  { q: "Does going test-optional hurt my chances?", a: "At genuinely test-optional schools, not submitting scores should not hurt your chances. However, at schools where 75%+ of admitted students submitted scores, not submitting may put you in a smaller, potentially more competitive pool. The decision should be based on whether your scores strengthen or weaken your overall application." },
];

export default function TestOptionalSchoolsPage() {
  return (
    <MarketingLayout
      eyebrow="Testing Reference"
      title="Test-Optional, Test-Blind & Test-Required Schools (2026)"
      description="Test policies have shifted significantly since 2020. Some schools have reinstated requirements (MIT, Yale, Brown, Cornell, Dartmouth, Caltech, Georgia Tech). Georgetown has always required tests. Most remain test-optional. The UC system is fully test-blind. Here's the complete 2026 picture and how to decide whether to submit."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="Test-required schools"
        Icon={ClipboardCheck}
        description="Schools that REQUIRE SAT or ACT scores for the 2026 cycle. Some have reinstated requirements after a pandemic-era pause."
      >
        <div className="space-y-2">
          {TEST_REQUIRED_2026.map((s) => (
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

      <Section
        title="Test-optional schools"
        Icon={Eye}
        description="Schools that allow you to choose whether to submit scores. They will see your scores if submitted; if not submitted, the rest of your application is reviewed."
      >
        <div className="space-y-2">
          {TEST_OPTIONAL_2026.map((s) => (
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

      <Section
        title="Test-blind schools"
        Icon={EyeOff}
        description="Schools that will NOT see your SAT/ACT scores even if you submit them. The most well-known is the entire University of California system."
      >
        <div className="space-y-2">
          {TEST_BLIND_2026.map((s) => (
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

      <Section title="Strategy by school tier" Icon={ClipboardCheck}>
        <div className="space-y-3">
          {STRATEGY_BY_TIER.map((s) => (
            <article
              key={s.tier}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {s.tier}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s.strategy}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="How to decide whether to submit" Icon={ClipboardCheck}>
        <ol className="space-y-2">
          {HOW_TO_DECIDE.map((d, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{d}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Common mistakes" Icon={AlertCircle}>
        <ul className="space-y-2">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{m}</span>
            </li>
          ))}
        </ul>
      </Section>

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
        headline="Per-school submit decisions in one place."
        description="AdmitPath surfaces the school-specific 25th/75th percentile and recommends submit/skip for each of your applications based on your score and context. Free plan included. Pro $19.99/mo."
        buttonText="See my submit recommendations"
      />
    </MarketingLayout>
  );
}
