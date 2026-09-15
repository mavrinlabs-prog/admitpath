import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  ArrowRightLeft,
  GraduationCap,
  PenLine,
  CalendarRange,
  CheckCircle2,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Transfer College Strategy — Top School Guide",
  description:
    "Guide to college transfer admissions: timing, top pipelines (UC TAG, Cornell, USC Transfer), the 'why transfer' essay, and realistic admit rates.",
  alternates: { canonical: `${BASE}/transfer-college-strategy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Transfer College Strategy — Top School Transfers",
    description: "College transfer guide: timing, UC TAG, Cornell, USC pipelines, the 'why transfer' essay, and admit rates.",
    url: `${BASE}/transfer-college-strategy`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Transfer+Strategy&subtitle=Top+pipelines+%C2%B7+essay+%C2%B7+admit+rates`, width: 1200, height: 630, alt: "Transfer College Strategy" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Transfer College Strategy", description: "UC TAG, Cornell, USC pipelines, the 'why transfer' essay, and admit rates.", images: [`${BASE}/api/og?title=Transfer+Strategy&subtitle=Top+pipelines+%C2%B7+essay+%C2%B7+admit+rates`] },
};

const TRANSFER_DIFFERS = [
  "College transcript dominates. Your high school transcript matters less; your college GPA carries 70-80% of the weight.",
  "'Why transfer' essay is critical. Why are you leaving your current school? What do you need that you can't get there? This essay can make or break the application.",
  "Recommendations from college professors are preferred. Your high school recommendations matter less; current college professors who know your work are stronger.",
  "Activities and engagement at your current college matter more than high school activities. Admissions reads who you are NOW, not who you were 2 years ago.",
  "Test scores matter less. Most transfer applicants have moved past the test-score stage of admissions.",
  "Senior year grades and current college transcript matter most.",
  "Application volumes are smaller than first-year applications, but admit rates vary wildly.",
];

const TOP_TRANSFER_PIPELINES = [
  {
    name: "California Community Colleges → UC system (TAG)",
    desc: "Transfer Admission Guarantee: automatic admission to UC Davis, UC Irvine, UC Merced, UC Riverside, UC Santa Barbara, or UC Santa Cruz with stated GPA. Berkeley and UCLA do NOT participate in TAG but admit transfers competitively (Berkeley transfer admit ~24%; UCLA ~22%). The strongest single transfer pipeline in the US.",
    admitRate: "~22-30% at Berkeley/UCLA; near-100% TAG-guaranteed at others",
  },
  {
    name: "Cornell Transfer Option",
    desc: "Some Cornell applicants are offered transfer admission for sophomore year if they complete specified coursework at an alternate school. Effectively a delayed admission with a year of transfer-prep coursework requirement.",
    admitRate: "~15-20% from Transfer Option pool",
  },
  {
    name: "USC Transfer Pipeline",
    desc: "USC has historically admitted transfers at a higher rate than first-year applicants. Active transfer recruiting from California community colleges and other 4-year schools. Significantly more accessible than first-year USC.",
    admitRate: "~25-30% transfer admit rate",
  },
  {
    name: "Northwestern Transfer Program",
    desc: "Solid transfer pipeline from community colleges, regional 4-year schools, and other selective institutions. Northwestern values transfer applicants who've demonstrated college-level rigor and interest.",
    admitRate: "~15-20% transfer admit rate",
  },
  {
    name: "Vanderbilt Transfer",
    desc: "Vanderbilt's transfer admit rate exceeds the first-year admit rate at most years. Strong pipeline from regional 4-year schools and high-performing community college applicants.",
    admitRate: "~25-30% transfer admit rate",
  },
  {
    name: "Notre Dame Transfer",
    desc: "Notre Dame welcomes transfer applicants, especially those with strong religious community or service backgrounds. Transfer admit rate is lower than at USC/Vanderbilt but higher than at most Ivies.",
    admitRate: "~20-25% transfer admit rate",
  },
  {
    name: "State flagships (UVA, UNC, Michigan, Texas)",
    desc: "Strong transfer pipelines especially from CC. UVA's Echols Scholars Transfer pathway and UNC's transfer programs admit competitively. Texas and Michigan transfer admits are typically at higher rates than first-year.",
    admitRate: "~30-50% depending on school and program",
  },
];

const HARD_TRANSFER_SCHOOLS = [
  "Harvard, Yale, Princeton, Stanford, MIT (transfer admit rates <2%, sometimes 0% — these are essentially uncompetitive transfer pools).",
  "Caltech, JHU (similarly tight transfer admissions).",
  "Most Ivy schools — transfer admits run 5-10% of regular admissions. Even strong applicants have low admit rates here.",
  "Schools that have suspended transfer admissions in recent cycles — verify current status before committing time.",
];

const TIMELINE = [
  { period: "Fall of intended transfer year", action: "Identify target schools and review their transfer requirements (deadlines, course requirements, recommendation requirements)." },
  { period: "Fall (October-December)", action: "Take rigorous courses with professors you can ask for recommendations. Submit applications by Nov-Dec deadlines for Spring-start transfers; Mar-Apr deadlines for Fall-start transfers." },
  { period: "Spring (January-April)", action: "Submit applications for Fall-start transfers. Continue strong academic performance — transfer decisions can hinge on spring grades." },
  { period: "Summer", action: "Notification letters arrive. Review aid offers; commit to your school by stated deadline." },
  { period: "Fall (your transfer year)", action: "Begin at your new school. Connect with transfer advising, take care of credit transfer logistics, build new community." },
];

const WHY_TRANSFER_ESSAY = [
  "Be honest about why you're leaving. Don't disparage your current school, but be specific about what you need that you can't get there.",
  "Show what you've gained at your current school. Even if you're transferring, your current school has shaped you. Admissions wants to see that growth, not bitterness.",
  "Be specific about what the new school offers. Same as Why Us essay — name specific programs, courses, professors, opportunities.",
  "Connect to your future. The transfer is a means to an end. What's the end? Specifics matter.",
  "Acknowledge the disruption. Transferring is non-trivial; admissions wants to know you've thought about it carefully.",
  "Avoid the 'rebound' framing. Don't write as if you're transferring because the original school 'wasn't enough' for you — that reads as ungenerous.",
];

const REALISTIC_EXPECTATIONS = [
  "Transfer applications are smaller pools but harder to predict.",
  "Some schools have very low transfer admit rates regardless of applicant strength (HYPSM, Caltech, JHU).",
  "Some schools have higher transfer admit rates than first-year (USC, Vanderbilt, UC Berkeley, Cornell Transfer Option, NU Transfer).",
  "Course transferability varies wildly. Don't assume all your current credits will transfer; verify with each target school.",
  "Financial aid for transfers is sometimes less generous than for first-year admits. Verify aid policies before committing.",
  "Transfer culture matters. Some schools have strong transfer support (UC system, USC, Notre Dame); others have minimal transfer infrastructure.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/transfer-college-strategy#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Transfer College Strategy", item: `${BASE}/transfer-college-strategy` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/transfer-college-strategy#page`,
      url: `${BASE}/transfer-college-strategy`,
      name: "Transfer College Strategy — How to Transfer to a Top School",
      description: "Comprehensive guide to transfer college admissions: timing, application differences, top transfer pipelines, the 'why transfer' essay, and realistic admit rates by school tier.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/transfer-college-strategy#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What are the best transfer pipelines to top schools?", acceptedAnswer: { "@type": "Answer", text: "California CCs to UCs via TAG (Transfer Admission Guarantee) is the strongest pipeline. Cornell, USC, and Northwestern have formal transfer programs. Community college to 4-year transfer is the most common and often most successful path. Strong GPA at current school plus a compelling 'why transfer' essay are the keys." } },
        { "@type": "Question", name: "How hard is it to transfer to an Ivy League school?", acceptedAnswer: { "@type": "Answer", text: "Very hard. Transfer admit rates at top private schools are typically 3-7%. Columbia and Cornell have historically higher transfer acceptance rates (closer to 7-10%). Penn, Yale, and Princeton have rates under 5%. Strong college GPA (3.7+) and a genuine reason to transfer are essential." } },
        { "@type": "Question", name: "When should I apply for a college transfer?", acceptedAnswer: { "@type": "Answer", text: "Most transfer deadlines are March 1 - April 1 for fall entry. You typically need at least one full year (24-30 credits) of college coursework. Apply during your freshman spring for sophomore entry. Some schools accept spring transfer applications with November-December deadlines." } },
      ],
    },
  ],
};

const PAGE_FAQS = [
  { q: "What are the best transfer pipelines to top schools?", a: "California CCs to UCs via TAG (Transfer Admission Guarantee) is the strongest pipeline. Cornell, USC, and Northwestern have formal transfer programs. Community college to 4-year transfer is the most common and often most successful path. Strong GPA at current school plus a compelling 'why transfer' essay are the keys." },
  { q: "How hard is it to transfer to an Ivy League school?", a: "Very hard. Transfer admit rates at top private schools are typically 3-7%. Columbia and Cornell have historically higher transfer acceptance rates (closer to 7-10%). Penn, Yale, and Princeton have rates under 5%. Strong college GPA (3.7+) and a genuine reason to transfer are essential." },
  { q: "When should I apply for a college transfer?", a: "Most transfer deadlines are March 1 - April 1 for fall entry. You typically need at least one full year (24-30 credits) of college coursework. Apply during your freshman spring for sophomore entry. Some schools accept spring transfer applications with November-December deadlines." },
];

export default function TransferCollegeStrategyPage() {
  return (
    <MarketingLayout
      eyebrow="Transfer Admissions"
      title="Transfer College Strategy"
      description={'Transfer admissions runs differently than first-year admissions — the college transcript dominates, the "why transfer" essay is critical, and admit rates vary from <2% (HYPSM) to 30% (USC, Vanderbilt, UC Berkeley/UCLA from CC). Here\'s the framework, the pipelines, and the realistic expectations.'}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section title="How transfer admissions differs from first-year" Icon={ArrowRightLeft}>
        <ul className="space-y-2">
          {TRANSFER_DIFFERS.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{d}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Top transfer pipelines"
        Icon={GraduationCap}
        description="Schools with strong, established transfer admissions infrastructure. Higher transfer admit rates than first-year admit rates at many of these."
      >
        <div className="space-y-3">
          {TOP_TRANSFER_PIPELINES.map((p) => (
            <article
              key={p.name}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <header className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {p.name}
                </h3>
                <span className="ml-auto text-[12.5px] font-medium" style={{ color: "#4A6FA5" }}>
                  {p.admitRate}
                </span>
              </header>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Schools with very limited transfer admissions"
        Icon={ArrowRightLeft}
        description="Schools where transfer admissions are essentially uncompetitive regardless of applicant strength."
      >
        <ul className="space-y-2">
          {HARD_TRANSFER_SCHOOLS.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Transfer application timeline" Icon={CalendarRange}>
        <div className="space-y-3">
          {TIMELINE.map((t) => (
            <article
              key={t.period}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {t.period}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {t.action}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="The 'why transfer' essay"
        Icon={PenLine}
        description="The most important piece of the transfer application. What it should include and what to avoid."
      >
        <ul className="space-y-2">
          {WHY_TRANSFER_ESSAY.map((w, i) => (
            <li key={i} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Realistic expectations" Icon={CheckCircle2}>
        <ul className="space-y-2">
          {REALISTIC_EXPECTATIONS.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{r}</span>
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
        headline="Plan your transfer pathway."
        description="AdmitPath surfaces transfer pipelines aligned with your current school, GPA, and target program. Free plan included. Pro $19.99/mo."
        buttonText="Plan my transfer"
      />
    </MarketingLayout>
  );
}
