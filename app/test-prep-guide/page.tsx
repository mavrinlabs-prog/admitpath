import Link from "next/link";
import type { Metadata } from "next";
import { COLLEGES } from "@/data/colleges";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Target,
  AlertTriangle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "SAT & ACT Prep Guide 2026",
  description:
    "SAT vs ACT: the proven 12-week prep plan for 100-200+ point gains, official free resources, score interpretation, and retake strategy.",
  alternates: { canonical: `${BASE}/test-prep-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "SAT & ACT Test Prep Guide — Score Higher",
    description: "SAT vs ACT, the 12-week prep plan for 100-200 point gains, free resources, and when to retake.",
    url: `${BASE}/test-prep-guide`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Test+Prep+Guide&subtitle=SAT+%26+ACT+%C2%B7+12-week+plan`, width: 1200, height: 630, alt: "SAT & ACT Test Prep Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "SAT & ACT Test Prep Guide — Score Higher", description: "12-week prep plan for 100-200 point gains, free resources, retake strategy.", images: [`${BASE}/api/og?title=Test+Prep+Guide&subtitle=SAT+%26+ACT+%C2%B7+12-week+plan`] },
};

const SAT_VS_ACT = [
  {
    factor: "Format",
    sat: "Digital adaptive (since 2024). Two modules per section.",
    act: "Linear paper or digital. Same questions in same order for everyone.",
  },
  {
    factor: "Timing",
    sat: "Faster pace per question, but shorter overall (~2hr 14min).",
    act: "Slower per question, longer overall (~2hr 55min including science).",
  },
  {
    factor: "Math",
    sat: "Algebra-heavy. Includes Heart of Algebra + Problem Solving + Advanced Math + Geometry.",
    act: "Algebra + Geometry + Trigonometry. Calculator allowed throughout.",
  },
  {
    factor: "Reading",
    sat: "Shorter passages, more questions per passage. Single questions per passage.",
    act: "Longer passages with multiple questions each. Faster reading required.",
  },
  {
    factor: "Science section",
    sat: "None.",
    act: "Yes — but it's mostly graph reading and experiment interpretation, not science content knowledge.",
  },
  {
    factor: "Writing/Grammar",
    sat: "Integrated into Reading & Writing module.",
    act: "Separate English section. Grammar-heavy.",
  },
  {
    factor: "Score range",
    sat: "400-1600 (200-800 each section).",
    act: "1-36 composite.",
  },
];

const PHASES = [
  {
    week: "Weeks 1-2",
    title: "Diagnostic & gap analysis",
    body: "Take a full official Bluebook (SAT) or ACT.org practice test. Categorize every miss: content gap (didn't know it), timing (ran out), or careless (knew it, missed it).",
  },
  {
    week: "Weeks 3-6",
    title: "Targeted content review",
    body: "Khan Academy SAT or ACT.org practice. 30-45 min/day, 4-5 days/week. Drill weak skills, then 10-15 problems on each skill afterwards.",
  },
  {
    week: "Weeks 7-9",
    title: "Full-length practice + pacing",
    body: "One full official practice test per week under timed conditions. Add timed-section drills mid-week to build pacing under pressure.",
  },
  {
    week: "Weeks 10-11",
    title: "Mistake review",
    body: "Review every missed question across all practice tests. Look for patterns — same skill, same trap, same time-pressure breakdown. Take one final timed full-length test 7-10 days before test day.",
  },
  {
    week: "Week 12",
    title: "Taper",
    body: "No new material. Light review only. Sleep on a normal schedule. Eat breakfast on test day. Bring a water bottle and an approved calculator.",
  },
];

const FREE_RESOURCES = [
  { name: "Bluebook (College Board)", description: "Official SAT practice — adaptive, in the actual app you'll test in.", url: "https://bluebook.app.collegeboard.org" },
  { name: "Khan Academy Official SAT Practice", description: "Personalized practice based on your diagnostic score. Free, official partnership with College Board.", url: "https://www.khanacademy.org/sat" },
  { name: "ACT.org Free Test Prep", description: "Free official practice questions, ACT Online Prep tier (paid), and one full practice test.", url: "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html" },
  { name: "PrepScholar / Magoosh free trials", description: "Both offer free 7-day trials with adaptive practice. Useful for additional question variety.", url: "https://www.prepscholar.com" },
];

const SCORE_TARGETS = [
  { tier: "Ivy / MIT / Stanford / Caltech", sat: "1500-1570", act: "34-35", note: "Middle 50% of admitted students. Below 1450/33 with no compensating factors is risky." },
  { tier: "Top-20 (Duke, Northwestern, etc.)", sat: "1470-1550", act: "33-34", note: "Strong but not extraordinary. Test-optional viable below 1430/32." },
  { tier: "Top-50 (NYU, USC, Wisconsin tier)", sat: "1380-1500", act: "31-33", note: "Wide variation by school. Check each school's CDS C9 page." },
  { tier: "State flagships", sat: "1280-1430", act: "28-31", note: "Highly variable by state. In-state often has lower thresholds than out-of-state." },
];

const PAGE_FAQS = [
  { q: "Should I take the SAT or ACT?", a: "Take a full practice test of each under timed conditions. Most students score meaningfully better on one. Pick that one. Colleges accept both equally — there is no admissions advantage to either test." },
  { q: "What is a good SAT score for college?", a: "It depends on your target schools. For Ivy League and top-10 schools, the middle 50% of admitted students score 1500-1570. For top-20 schools like Duke or Northwestern, 1470-1550. For top-50 schools, 1380-1500. Check each school's Common Data Set for exact ranges." },
  { q: "How long should I study for the SAT?", a: "12 weeks of consistent preparation (30-45 minutes per day, 4-5 days per week) produces the best results. Average gains: 100-200 points on the SAT, 3-5 points on the ACT. Consistency beats intensity." },
  { q: "Is the SAT still required for college?", a: "Most schools are test-optional in 2026, meaning you can choose whether to submit scores. Some schools (MIT, Georgetown, Purdue, UT Austin) have returned to requiring test scores. Check each school's current policy on their admissions website." },
  { q: "How many times should I take the SAT?", a: "Most students take it twice — once junior spring and once senior fall. A third attempt yields diminishing returns (usually +20 points or less). Don't take it more than 4 times. Stop when your last two practice tests are within 30 points of your target." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/test-prep-guide#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Test Prep Guide", item: `${BASE}/test-prep-guide` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/test-prep-guide#page`,
      url: `${BASE}/test-prep-guide`,
      name: "SAT and ACT Test Prep Guide",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/test-prep-guide#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/test-prep-guide#howto` },
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/test-prep-guide#howto`,
      name: "How to Prep Efficiently for the SAT or ACT",
      description: "12-week structured prep plan that produces 100-200 point average score gains.",
      totalTime: "P12W",
      step: PHASES.map((p, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: p.title,
        text: p.body,
      })),
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

export default function TestPrepGuidePage() {
  return (
    <MarketingLayout
      eyebrow="Test prep"
      title="SAT and ACT Test Prep Guide"
      description="How to pick between the SAT and ACT, the 12-week prep plan that produces 100-200 point average score gains, and the score targets at each tier of school."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* SAT vs ACT */}
        <section className="mb-14">
          <h2
            className="mb-3 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            SAT vs ACT: how to choose
          </h2>
          <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Colleges accept both equally. Take a practice test of each — most
            students score meaningfully better on one. Pick that one and stop
            comparing.
          </p>
          <div
            className="overflow-x-auto rounded-xl border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <table className="w-full text-left text-[13px]">
              <thead style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                <tr>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Factor</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>SAT</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>ACT</th>
                </tr>
              </thead>
              <tbody>
                {SAT_VS_ACT.map((row, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <td className="px-4 py-3 font-medium align-top" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.factor}</td>
                    <td className="px-4 py-3 align-top" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.sat}</td>
                    <td className="px-4 py-3 align-top" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.act}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Score targets */}
        <section className="mb-14">
          <h2
            className="mb-3 flex items-center gap-2 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            <Target className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            Score targets by tier
          </h2>
          <div
            className="overflow-x-auto rounded-xl border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <table className="w-full text-left text-[13px]">
              <thead style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                <tr>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Tier</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>SAT</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>ACT</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {SCORE_TARGETS.map((row, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <td className="px-4 py-3 align-top font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.tier}</td>
                    <td className="px-4 py-3 align-top tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.sat}</td>
                    <td className="px-4 py-3 align-top tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.act}</td>
                    <td className="px-4 py-3 align-top text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Ranges represent the middle 50% of admitted students. Below the
            25th percentile of admits at a given tier, going test-optional is
            often the better move (if available).
          </p>
        </section>

        {/* 12-week plan */}
        <section className="mb-14">
          <h2
            className="mb-3 flex items-center gap-2 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            <Calendar className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            The 12-week prep plan
          </h2>
          <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Average gains for students who follow this plan consistently:
            100-200 points (SAT) / 3-5 points (ACT). Consistency beats
            intensity — 30-45 min/day for 12 weeks beats 3 hours/day for 4
            weeks.
          </p>
          <div className="space-y-3">
            {PHASES.map((p, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-xl border p-4"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white"
                  style={{ background: "#4A6FA5" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#4A6FA5" }}>
                    {p.week}
                  </p>
                  <p
                    className="mb-1 text-[15px] font-semibold"
                    style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                  >
                    {p.title}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Free resources */}
        <section className="mb-14">
          <h2
            className="mb-3 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Free resources that actually work
          </h2>
          <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Most students don&apos;t need a paid prep course. The free
            official resources below are sufficient for almost everyone to
            reach their score potential.
          </p>
          <div className="space-y-3">
            {FREE_RESOURCES.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dl-card-hover block rounded-xl border p-4 transition-colors hover:border-[color:#4A6FA5]"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <p
                  className="mb-1 text-[14px] font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {r.name}
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {r.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* When to take / retake */}
        <section className="mb-14">
          <h2
            className="mb-3 flex items-center gap-2 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            <AlertTriangle className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            When to take, retake, and stop
          </h2>
          <ul className="space-y-2 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span>First take: spring of junior year, after at least 8 weeks of prep.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span>Second take: late summer or early fall of senior year. Most students improve 30-50 points on attempt 2.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span>Third take: only if attempt 2 didn&apos;t hit your target. Usually +20 points or less.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span>Stop when your last 2 practice tests are within 30 points of each other AND at or above target.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span>Don&apos;t take the SAT/ACT more than 4 times — it suggests you don&apos;t know when to stop.</span>
            </li>
          </ul>
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
            See where your score actually puts you across our {COLLEGES.length}-college database
          </p>
          <Link
            href="/quiz"
            className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            Take the chances quiz
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Related resources */}
        <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
          <Link
            href="/calculator"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Chances Calculator
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Enter GPA, SAT, and ECs to see odds at 30+ schools.
            </div>
          </Link>
          <Link
            href="/college-application-timeline-2026"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Timeline 2026
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Month-by-month guide including when to test.
            </div>
          </Link>
          <Link
            href="/test-optional-schools-2026"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Test-Optional Schools 2026
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Current test policies and submit/skip strategy.
            </div>
          </Link>
          <Link
            href="/admissions-jargon-decoder"
            className="rounded-xl border p-4 transition-shadow hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Jargon Decoder
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              What superscore, concordance, and test-blind mean.
            </div>
          </Link>
        </nav>
    </MarketingLayout>
  );
}
