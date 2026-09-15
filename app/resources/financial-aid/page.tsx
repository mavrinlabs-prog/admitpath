import Link from "next/link";
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section } from "@/components/marketing/Section";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  ArrowRight,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Financial Aid Guide — FAFSA, CSS & Merit Aid",
  description:
    "The complete guide to college financial aid: FAFSA, CSS Profile, need-based vs. merit aid, work-study, loans, and the timeline that gets you the most money.",
  alternates: { canonical: `${BASE}/resources/financial-aid` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Financial Aid Guide — FAFSA, CSS & Merit Aid",
    description: "FAFSA, CSS Profile, need-based vs. merit aid, work-study, loans, and the timeline that gets you the most money. Free.",
    url: `${BASE}/resources/financial-aid`,
    type: "article",
    images: [{
      url: `${BASE}/api/og?title=${encodeURIComponent("Financial Aid Guide")}&subtitle=${encodeURIComponent("FAFSA • CSS Profile • merit aid • timeline")}`,
      width: 1200,
      height: 630,
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Financial Aid Guide — FAFSA, CSS & Merit Aid", description: "FAFSA, CSS Profile, need-based vs. merit aid, and the timeline for the most money.", images: [`${BASE}/api/og?title=${encodeURIComponent("Financial Aid Guide")}&subtitle=${encodeURIComponent("FAFSA • CSS Profile • merit aid • timeline")}`] },
};

const TIMELINE = [
  {
    when: "October 1 of senior year",
    what: "FAFSA opens",
    desc: "File the same week. Many state grants and some institutional aid are first-come-first-served. Required for federal Pell Grants, federal loans, and work-study.",
    href: "https://studentaid.gov/h/apply-for-aid/fafsa",
  },
  {
    when: "October 1 of senior year",
    what: "CSS Profile opens",
    desc: "Required by ~250 selective private colleges (most Ivies, top liberal arts) for institutional aid. File before any application deadline. $25/school, automatically waived under ~$100K family income.",
    href: "https://cssprofile.collegeboard.org",
  },
  {
    when: "Mid-November to mid-December",
    what: "ED/EA financial aid estimates arrive",
    desc: "If admitted ED with unaffordable aid, you can break the binding agreement on financial-need grounds. Read the package carefully before celebrating.",
  },
  {
    when: "January 1–15",
    what: "Most RD applications + state aid forms due",
    desc: "Many states have separate aid applications (Cal Grant, TAP, etc.). Check your state's deadline — some are earlier than the FAFSA federal deadline.",
  },
  {
    when: "March 1",
    what: "Many state grant deadlines",
    desc: "Cal Grant (California), TAP (New York), and several others. Missing this deadline can cost you $5K-$10K in state aid.",
  },
  {
    when: "Late March – early April",
    what: "RD financial aid packages arrive",
    desc: "Compare net prices (what you pay) — never sticker prices. Use schools' net price calculators to verify packages match what was promised.",
  },
  {
    when: "May 1",
    what: "Decision day",
    desc: "Submit enrollment deposit at your chosen school. Decline other offers in writing.",
  },
];

const AID_TYPES = [
  {
    label: "Pell Grant",
    type: "Federal need-based grant",
    amount: "Up to $7,395/year (2025-26)",
    repays: "No",
    bestFor: "Family income roughly under $60K",
  },
  {
    label: "Federal Direct Subsidized Loan",
    type: "Federal need-based loan",
    amount: "$3,500–$5,500/year (caps)",
    repays: "Yes, no interest while in school",
    bestFor: "Most students with demonstrated need",
  },
  {
    label: "Federal Direct Unsubsidized Loan",
    type: "Federal loan, not need-based",
    amount: "$5,500–$12,500/year (caps)",
    repays: "Yes, interest accrues immediately",
    bestFor: "Students whose need isn't fully met",
  },
  {
    label: "Federal Work-Study",
    type: "Need-based campus job",
    amount: "Typically $2K–$4K/year",
    repays: "Earnings are wages, not loans",
    bestFor: "Students who can balance ~10 hr/wk work",
  },
  {
    label: "Institutional Need-Based Grant",
    type: "School-funded grant",
    amount: "Varies — up to full need at top schools",
    repays: "No",
    bestFor: "Anyone with demonstrated need at meets-full-need schools",
  },
  {
    label: "Merit Scholarship",
    type: "School-funded, performance-based",
    amount: "$1K to full tuition",
    repays: "No",
    bestFor: "Strong applicants below the school's median (you'd be in the top quartile)",
  },
  {
    label: "Outside / Private Scholarships",
    type: "Awarded by external orgs",
    amount: "$500 to full ride",
    repays: "No",
    bestFor: "Targeted scholarships matching your background, interests, or geography",
  },
  {
    label: "Parent PLUS Loan",
    type: "Federal loan to parents",
    amount: "Up to cost of attendance",
    repays: "Yes, parents are borrower",
    bestFor: "Last resort for families covering remaining cost",
  },
];

const NEED_BLIND_FULL_NEED = [
  "Amherst College",
  "Bowdoin College",
  "Brown University",
  "California Institute of Technology",
  "Columbia University",
  "Dartmouth College",
  "Duke University",
  "Georgetown University",
  "Harvard University",
  "MIT",
  "Northwestern University",
  "Notre Dame",
  "Princeton University",
  "Rice University",
  "Stanford University",
  "Swarthmore College",
  "University of Chicago",
  "University of Pennsylvania",
  "Vanderbilt University",
  "Williams College",
  "Yale University",
];

const COMMON_MISTAKES = [
  "Filing FAFSA late and missing first-come-first-served state grants worth thousands.",
  "Not filing the CSS Profile because you assume you 'won't qualify' — most top schools meet need to ~$200K family income.",
  "Comparing sticker prices instead of net prices when choosing between schools.",
  "Borrowing Parent PLUS loans without checking if there are scholarships you missed.",
  "Forgetting to renew FAFSA every year — aid is not automatic.",
  "Ignoring outside scholarships because they're 'too small' — five $1K scholarships cover a year of books.",
  "Missing your state's separate aid application (Cal Grant, TAP, etc.).",
  "Choosing a school that gives you a $20K merit scholarship over one that gives you $40K in need-based aid because the merit feels prestigious.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/resources/financial-aid#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
        { "@type": "ListItem", position: 3, name: "Financial Aid", item: `${BASE}/resources/financial-aid` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/resources/financial-aid#page`,
      url: `${BASE}/resources/financial-aid`,
      name: "Financial Aid Guide — FAFSA, CSS Profile, Merit Aid Explained",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/resources/financial-aid#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/resources/financial-aid#guide` },
    },
    {
      "@type": "LearningResource",
      "@id": `${BASE}/resources/financial-aid#guide`,
      name: "Complete College Financial Aid Guide",
      description:
        "Comprehensive guide covering FAFSA, CSS Profile, federal aid, merit scholarships, and need-based aid for U.S. college applicants.",
      url: `${BASE}/resources/financial-aid`,
      learningResourceType: "Reference",
      educationalLevel: ["HighSchool"],
      audience: { "@type": "EducationalAudience", educationalRole: "student" },
      isAccessibleForFree: true,
      inLanguage: "en-US",
      provider: { "@id": `${BASE}/#organization` },
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/resources/financial-aid#timeline`,
      name: "Financial Aid Application Timeline",
      description: "Step-by-step financial aid timeline for the senior year of high school.",
      totalTime: "P10M",
      step: TIMELINE.map((t, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: t.what,
        text: t.desc,
      })),
    },
  ],
};

export default function FinancialAidPage() {
  return (
    <MarketingLayout
      backHref="/resources"
      backLabel="All resources"
      eyebrow="Financial Aid"
      title="Financial Aid Guide"
      description="Everything you need to know about paying for college: FAFSA, CSS Profile, federal aid, merit scholarships, and the timeline that maximizes your award."
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* Key insight callout */}
        <ScrollReveal>
        <div
          className="dl-card-hover mb-10 rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p className="text-[14px] font-semibold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}>
            The most important rule
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Compare <em>net prices</em>, not sticker prices. Many top private
            colleges are cheaper for low-income families than your in-state
            public flagship. Run every school&apos;s net price calculator
            (federally required, on every financial aid page) before you decide
            anything.
          </p>
        </div>
        </ScrollReveal>

        {/* Timeline section */}
        <Section title="The financial aid timeline" Icon={Calendar}>

          <div className="relative ml-2 border-l-2 pl-6 space-y-6" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            {TIMELINE.map((t, i) => (
              <div key={i} className="relative">
                <div
                  className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2"
                  style={{ borderColor: "#4A6FA5", background: "var(--dl-bg-root, #D5DCE8)" }}
                />
                <p
                  className="text-[12px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "#4A6FA5" }}
                >
                  {t.when}
                </p>
                <h3
                  className="text-[15px] font-semibold mb-2"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
                >
                  {t.what}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {t.desc}
                </p>
                {t.href && (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold"
                    style={{ color: "#4A6FA5" }}
                  >
                    Official site
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Aid types section */}
        <Section title="Types of aid, ranked from best to last-resort" Icon={DollarSign}>

          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Aid type</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Category</th>
                  <th className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Amount</th>
                  <th className="px-4 py-2.5 font-semibold whitespace-nowrap" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Repays?</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Best for</th>
                </tr>
              </thead>
              <tbody>
                {AID_TYPES.map((a, i) => (
                  <tr
                    key={a.label}
                    className="border-t"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{a.label}</td>
                    <td className="px-4 py-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{a.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{a.amount}</td>
                    <td className="px-4 py-3" style={{ color: a.repays.startsWith("No") || a.repays.startsWith("Earnings") ? "#16A34A" : "var(--dl-text-secondary, #454B5E)" }}>
                      {a.repays}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{a.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Need-blind list */}
        <Section
          title="Need-blind + meets-full-need schools"
          Icon={CheckCircle2}
          description="These schools don't consider your financial need when admitting you AND meet 100% of demonstrated need with grants (no loans required). For low- and middle-income applicants, these are often the cheapest options after aid."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {NEED_BLIND_FULL_NEED.map((s) => (
              <div
                key={s}
                className="dl-card-hover rounded-lg border px-3 py-2 text-[13px]"
                style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {s}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Note: These policies apply to U.S. citizens and permanent residents. International applicants
            face different (typically need-aware) policies at most schools, with a few exceptions
            (Harvard, MIT, Princeton, Yale, Amherst).
          </p>
        </Section>

        {/* Common mistakes */}
        <Section title="Common mistakes that cost money" Icon={AlertTriangle}>
          <ul className="space-y-3">
            {COMMON_MISTAKES.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#DC2626" }} />
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{m}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Related tools */}
        <ScrollReveal>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/scholarship-match"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Scholarship Finder
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Filter the scholarship catalog by profile fields, then verify current eligibility, deadlines, and award amounts with each provider.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Find scholarships <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/net-price"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Net Price Estimator
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              See estimated real cost at 24 top colleges based on your family income. Need-blind badges included.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Estimate net price <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
        </ScrollReveal>

        {/* More related resources */}
        <ScrollReveal>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/fafsa-checklist"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              FAFSA Checklist
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Step-by-step FAFSA filing checklist so you do not miss any documents or deadlines.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Open checklist <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/aid-comparison"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Aid Comparison Tool
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Compare financial aid packages side-by-side across schools to find the true best deal.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Compare packages <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
        </ScrollReveal>
    </MarketingLayout>
  );
}
