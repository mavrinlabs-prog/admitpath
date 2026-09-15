import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  Award,
  CalendarRange,
  PenLine,
  Search,
  AlertCircle,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Scholarship Application Guide 2026",
  description:
    "How to apply for college scholarships in 2026: timeline, where to find real awards, application strategy, essay tips, and 5 common mistakes to avoid.",
  alternates: { canonical: `${BASE}/scholarship-application-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Scholarship Application Guide",
    description: "How to apply for college scholarships: timeline, where to find them, essay tips, and common mistakes.",
    url: `${BASE}/scholarship-application-guide`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Scholarship+Guide&subtitle=Timeline+%C2%B7+strategy+%C2%B7+essay+tips`, width: 1200, height: 630, alt: "Scholarship Application Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Scholarship Application Guide", description: "How to apply for college scholarships: timeline, strategy, essay tips.", images: [`${BASE}/api/og?title=Scholarship+Guide&subtitle=Timeline+%C2%B7+strategy+%C2%B7+essay+tips`] },
};

const TYPES = [
  { type: "Need-based scholarships from colleges", desc: "Awarded based on financial need (FAFSA + sometimes CSS Profile). Most generous for low-income families. Auto-applied at need-blind, meets-100%-need schools." },
  { type: "Merit-based scholarships from colleges", desc: "Awarded based on GPA, test scores, and accomplishments. Some are automatic with admission (Penn State Schreyer, USC Trustee, Vanderbilt Cornelius Vanderbilt). Others require separate application." },
  { type: "Outside / external scholarships", desc: "From foundations, businesses, churches, civic groups, government programs. Typically $500-$25,000. Some are large (Coca-Cola, Gates, Davis-Putter, etc.). Cumulative effect of many small scholarships can be meaningful." },
  { type: "Federal aid (technically not scholarships)", desc: "Pell Grants (need-based, up to $7,395 in 2025-26), Federal Direct Subsidized/Unsubsidized Loans, Federal Work-Study. Apply via FAFSA." },
  { type: "State scholarships", desc: "State-funded scholarships for residents of the state. Examples: Cal Grant (CA), Bright Futures (FL), HOPE Scholarship (GA), Excelsior Scholarship (NY). Apply via state website + FAFSA." },
  { type: "Affinity scholarships", desc: "Targeted at specific groups: first-gen, racial/ethnic minorities, women in STEM, veterans, students with disabilities, etc. Examples: Gates Millennium, Hispanic Scholarship Fund, Jackie Robinson Foundation." },
];

const TIMELINE = [
  { period: "Fall of junior year", action: "Start a scholarship database and begin tracking. Sites: Scholarships.com, Fastweb, College Board's Big Future, niche.com. Begin saving deadlines and requirements for fits." },
  { period: "Spring of junior year", action: "Apply for scholarships with junior-year deadlines (Coca-Cola Scholars, AXA Achievement, etc.). Many top scholarships open or close in junior spring." },
  { period: "Summer before senior year", action: "Draft scholarship-specific essays. Many recycle from your Common App essays, but many require unique prompts." },
  { period: "Senior fall (October-December)", action: "Apply for the bulk of scholarships. Most major scholarship deadlines are in the senior fall window. Submit alongside your college applications." },
  { period: "Senior spring (January-April)", action: "Continue applying for scholarships, especially those with March-April deadlines. Apply for state scholarships, college-specific merit competitions, and smaller local scholarships." },
  { period: "Senior summer", action: "Final scholarship cleanup. Some 'late' scholarships have summer deadlines. Apply for any remaining ones; track your awards." },
];

const FINDING_SCHOLARSHIPS = [
  "Your high school's college and career office — local scholarships from area businesses, civic organizations, religious groups. Often less competitive due to limited applicant pools.",
  "Your school's alumni network — some high schools have alumni-funded scholarships specifically for their graduates.",
  "Your parents' employers — many companies offer scholarships for employees' children. HR can confirm.",
  "Your church or religious organization — many maintain scholarships for active members.",
  "Your community — local Rotary, Lions, Kiwanis, Elks, Optimist clubs often have small scholarships.",
  "Your professional interest organizations — IEEE, ACM, AMA, etc. for STEM fields.",
  "Major scholarship databases: Scholarships.com, Fastweb, Big Future, Niche, Cappex.",
  "Specialized databases: NACAC, Hispanic Scholarship Fund, United Negro College Fund (UNCF), QuestBridge.",
];

const ESSAY_STRATEGY = [
  "Read the prompt 3 times. Scholarship readers reward direct answers to specific prompts. Generic 'I'm passionate' essays are the most common failure mode.",
  "Show the specific work, not the desire. Scholarships fund accomplished students, not aspirational ones. Write about what you've DONE, not what you HOPE to do.",
  "Connect to the scholarship's mission. Coca-Cola Scholars looks for leadership; Davidson Fellows looks for prodigy-level work; Gates Millennium looks for service. Write specifically to each scholarship's stated values.",
  "Tighten language ruthlessly. Most scholarship essays are 250-500 words; some are 1000-1500. Every sentence must contribute.",
  "Don't recycle Common App essays without modification. The prompts are different; the audience is different. Adapt, don't copy-paste.",
  "Get a second pair of eyes. Even more than for college applications — scholarship essays are often shorter and have smaller margins for error.",
];

const COMMON_MISTAKES = [
  "Spraying applications without tailoring. 50 generic applications produce 0 awards; 10 tailored applications produce 2-3.",
  "Skipping local scholarships because the awards are small. $500 + $1,000 + $1,500 from local awards adds up — and the applicant pool is much smaller.",
  "Not applying because of self-disqualification. The student who decides 'I'm not the right fit' for a scholarship without actually applying loses 100% of the time.",
  "Falling for scholarship scams. Real scholarships don't charge application fees. If a 'scholarship' asks for a fee, it's a scam.",
  "Missing essay word counts. Going under or over the limit usually disqualifies you.",
  "Forgetting financial aid forms. Most college scholarships require FAFSA submission. Submit early.",
  "Reapplying to the same scholarships year after year without adjustment. Adjust your essays for senior fall vs senior spring; if you're rejected, ask for feedback if available.",
];

const STRATEGIC_ADVICE = [
  "The 80/20 rule: 80% of total scholarship money awarded comes from college institutional aid (need-based + merit), not external scholarships. Spend 80% of your scholarship time on getting strong financial aid offers from colleges.",
  "External scholarships matter most for: students with no/limited need-based aid eligibility, students at need-aware schools, students whose target colleges don't meet 100% of need.",
  "For many low-income students, getting admitted to a need-blind/meets-100%-need school is more financially impactful than chasing 50 small external scholarships.",
  "Focus on the ROI. A 10-hour application for a $1,000 scholarship at a 5% admit rate has a lower expected value than a 30-hour application for a $25,000 scholarship at a 1% admit rate.",
  "Don't sacrifice grades or activities for scholarship hunting. The strongest 'scholarship' is the one tied to the strongest application.",
];

const PAGE_FAQS = [
  { q: "When should I start applying for scholarships?", a: "Start tracking scholarship databases in fall of junior year. Major scholarship deadlines cluster in senior fall (October-December). Some top scholarships (Coca-Cola Scholars, AXA Achievement) open or close in junior spring. Local scholarships often have spring deadlines." },
  { q: "How do I find scholarships I'm eligible for?", a: "Start with your high school's college office for local scholarships (smaller applicant pools). Check parents' employers for employee-family scholarships. Use Scholarships.com, Fastweb, and Big Future for national databases. For specific populations, check UNCF, Hispanic Scholarship Fund, and QuestBridge." },
  { q: "Are scholarship search services worth it?", a: "No. All legitimate scholarship databases are free (Scholarships.com, Fastweb, Big Future, Niche). Any service that charges a fee to find scholarships is a scam or is providing the same information available for free. Real scholarships never charge application fees." },
  { q: "Should I apply for lots of small scholarships or focus on big ones?", a: "Focus on the highest expected value: time invested times probability of winning times award amount. Ten tailored applications producing 2-3 awards beats 50 generic applications producing zero. Don't skip local $500-$1,500 scholarships -- smaller applicant pools mean higher win rates, and they add up." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/scholarship-application-guide#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Scholarship Application Guide", item: `${BASE}/scholarship-application-guide` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/scholarship-application-guide#page`,
      url: `${BASE}/scholarship-application-guide`,
      name: "Scholarship Application Guide — When, How, Where to Apply",
      description: "How to apply for college scholarships strategically: timeline, types, where to find them, application strategy, scholarship-specific essay tips, and the 7 most common mistakes.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/scholarship-application-guide#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/scholarship-application-guide#howto`,
      name: "How to apply for college scholarships",
      description: "Six-step framework for applying to college scholarships: identify types, build a list, find scholarships, write essays, submit on schedule, and apply strategically.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Identify scholarship types relevant to you", text: "Need-based, merit-based, outside/external, state, affinity scholarships. Each has different application processes and timing." },
        { "@type": "HowToStep", position: 2, name: "Build a scholarship target list", text: "Use Scholarships.com, Fastweb, Big Future, Niche, plus your school's college office and local community organizations." },
        { "@type": "HowToStep", position: 3, name: "Apply early in the timeline", text: "Junior spring through senior fall is the densest window. Many large scholarships open or close in junior spring." },
        { "@type": "HowToStep", position: 4, name: "Tailor essays to each scholarship", text: "Read prompts carefully. Connect to each scholarship's stated mission. Don't recycle without modification." },
        { "@type": "HowToStep", position: 5, name: "Track deadlines and submit", text: "Most major scholarship deadlines are senior fall (Oct-Dec). State and smaller scholarships have spring deadlines." },
        { "@type": "HowToStep", position: 6, name: "Focus where ROI is highest", text: "80% of scholarship money comes from college institutional aid, not external scholarships. Prioritize getting admitted to need-blind/meets-100%-need schools." },
      ],
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

export default function ScholarshipApplicationGuidePage() {
  return (
    <MarketingLayout
      eyebrow="Scholarship Strategy"
      title="Scholarship Application Guide"
      description="The honest framework for applying to college scholarships. The types, the timeline, where to find them, the essay strategy that works, the 7 most common mistakes, and why 80% of your scholarship time should go to maximizing college institutional aid — not chasing 50 small external scholarships."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section title="6 types of scholarships" Icon={Award}>
        <div className="space-y-3">
          {TYPES.map((t) => (
            <article
              key={t.type}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {t.type}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {t.desc}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="The scholarship timeline" Icon={CalendarRange}>
        <div className="space-y-3">
          {TIMELINE.map((t) => (
            <article
              key={t.period}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <header className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {t.period}
                </h3>
              </header>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {t.action}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Where to find scholarships"
        Icon={Search}
        description="Don't rely only on big-name databases. Local scholarships have much smaller applicant pools and are often easier to win."
      >
        <ul className="space-y-2">
          {FINDING_SCHOLARSHIPS.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Scholarship essay strategy"
        Icon={PenLine}
        description="Scholarship essays differ from college essays — read the specific prompt, connect to the scholarship's mission, and tighten language ruthlessly."
      >
        <ul className="space-y-2">
          {ESSAY_STRATEGY.map((e, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{e}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Strategic advice (the 80/20 truth)"
        Icon={Award}
        description="The honest framing of where scholarship time produces the highest return."
      >
        <ul className="space-y-2">
          {STRATEGIC_ADVICE.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="7 common mistakes" Icon={AlertCircle}>
        <ul className="space-y-2">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{m}</span>
            </li>
          ))}
        </ul>
      </Section>

      <div
        className="mb-8 rounded-2xl border p-6"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
      >
        <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
          Ready to find scholarships?
        </p>
        <p className="text-[13px] mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Our Scholarship Finder filters the catalog by GPA, SAT, state, and background. Verify current eligibility, deadlines, and award details with each provider.
        </p>
        <a
          href="/scholarship-match"
          className="btn-primary inline-flex h-10 items-center gap-2 px-5 text-sm"
        >
          Find my scholarships
          <Award className="h-3.5 w-3.5" />
        </a>
      </div>

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
        headline="Surface scholarships matched to your profile."
        description="AdmitPath helps filter scholarship opportunities by profile fields. Confirm every requirement and deadline on the provider's official page before applying."
        buttonText="Find my scholarships"
      />

      {/* Related resources */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <a href="/financial-aid-appeal-guide" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Financial aid appeal guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Negotiate your package with the 7-step letter framework.</div>
        </a>
        <a href="/fafsa-checklist" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>FAFSA checklist</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Interactive 7-step FAFSA filing guide.</div>
        </a>
        <a href="/need-blind-vs-need-aware-schools" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Need-blind vs need-aware</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>How financial need affects admissions decisions.</div>
        </a>
        <a href="/diverse-college-list" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>First-gen and FGLI support</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Schools with strong first-gen programs and QuestBridge partners.</div>
        </a>
      </nav>
    </MarketingLayout>
  );
}
