import type { Metadata } from "next";
import {
  Scale,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  GitCompare,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Decision Comparison Guide",
  description:
    "Multiple admits? Use the 8-factor comparison framework, decision matrix, what to weigh, what to ignore, and when to revisit before May 1.",
  alternates: { canonical: `${BASE}/college-decision-comparison-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Decision Comparison Guide",
    description:
      "You have multiple admits. May 1 is approaching. Here's the 8-factor comparison framework, decision matrix, what to weigh, what to ignore, and when to revisit.",
    url: `${BASE}/college-decision-comparison-guide`,
    type: "website",
    images: [{
      url: `${BASE}/api/og?title=Decision+Comparison+Guide&subtitle=8-factor+framework`,
      width: 1200,
      height: 630,
      alt: "AdmitPath Decision Comparison Guide — 8-factor framework",
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Decision Comparison Guide", description: "8-factor comparison framework for choosing between multiple admits.", images: [`${BASE}/api/og?title=Decision+Comparison+Guide&subtitle=8-factor+framework`] },
};

const COMPARISON_FACTORS = [
  {
    factor: "Real Financial Cost (4-year)",
    weight: "Highest",
    desc: "Real cost = COA × 4 - Grants × 4 - Scholarships × 4. NOT loans. NOT work-study. Calculate net cost over 4 years.",
    questions: [
      "What is the 4-year real cost (grants/scholarships only) at each school?",
      "Will my family or I be taking on loans? How much?",
      "Is the cost-difference between schools $20K+ over 4 years?",
      "Can my family absorb the cost without serious financial strain?",
    ],
  },
  {
    factor: "Major / Department Strength",
    weight: "High",
    desc: "Specific department strength matters more than overall school ranking. CMU CS is top-tier; CMU drama is not. Berkeley engineering is top; Berkeley humanities is good but not top.",
    questions: [
      "Which school has the strongest department for my intended major?",
      "What are the actual research opportunities, faculty access, and class quality in my major?",
      "Where do recent grads in my major end up?",
      "Are there specific labs, programs, or opportunities I'd seek out?",
    ],
  },
  {
    factor: "Career & Post-Graduation Outcomes",
    weight: "High",
    desc: "First Destinations Reports are the data. Where do graduates go in your field? Specific company placements, grad school placements, average starting salaries.",
    questions: [
      "Where do recent grads in my major go specifically?",
      "What's the alumni network like in my target industry?",
      "What's the career services office actually like?",
      "Does this school have brand-pipeline access I want?",
    ],
  },
  {
    factor: "Cultural & Personal Fit",
    weight: "Medium-High",
    desc: "Will you thrive there? Cultural fit predicts both academic success and life satisfaction. Visit if possible; talk to current students.",
    questions: [
      "Do students share my values and interests?",
      "Is the academic culture collaborative or competitive — and which fits me?",
      "Is the social scene compatible with how I actually want to spend time?",
      "Would I be intellectually engaged here?",
    ],
  },
  {
    factor: "Geographic & Climate Fit",
    weight: "Medium",
    desc: "You'll spend 4 years here. Climate, region, urban/rural, distance from home. These compound over 4 years.",
    questions: [
      "Can I tolerate the climate (winter cold, summer heat, year-round weather)?",
      "Is the urban/suburban/rural setting what I want?",
      "How far from home? Will I want to come home often or rarely?",
      "Does the location offer opportunities I want (internships, cultural, outdoor)?",
    ],
  },
  {
    factor: "Specific Programs & Opportunities",
    weight: "Medium",
    desc: "Honors college, specific research programs, study abroad, dual degree options, etc. Some schools have unique offerings worth pursuing.",
    questions: [
      "Are there honors programs I'd be in?",
      "Are there specific research opportunities, fellowships, or programs?",
      "Are there structured paths I want (study abroad, dual degree, accelerated)?",
      "What's the support for my specific interests?",
    ],
  },
  {
    factor: "Peer Quality & Intellectual Ambition",
    weight: "Medium",
    desc: "Who are you surrounded by? Ambitious peers shape you. Disengaged peers shape you. This effect compounds over 4 years.",
    questions: [
      "Are students academically ambitious?",
      "Is the peer culture intellectually serious?",
      "Are students engaged or disengaged in their education?",
      "Would I be pushed by peers to do my best work?",
    ],
  },
  {
    factor: "Long-term Brand & Reputation",
    weight: "Medium-Low",
    desc: "School name carries weight in some careers (banking, consulting, top grad schools). Less in others (creative, entrepreneurial). Don't over-weight, but don't ignore.",
    questions: [
      "Does my target career path care about school name?",
      "Will I have access to the alumni networks I want?",
      "Is the brand recognition meaningful for my goals?",
      "How does this brand age 10 years post-graduation?",
    ],
  },
];

const DECISION_MATRIX_STEPS = [
  "Calculate real 4-year cost (grants + scholarships only) for each school. This is your baseline financial reality.",
  "List the 2-3 things that matter most to you in a college (major strength, career outcomes, cost, fit, location, etc.). These are your top criteria.",
  "Score each school 1-10 on each of your top criteria. Be honest — your perception of fit/quality should reflect reality, not aspirations.",
  "Multiply each score by the criterion's weight (e.g., financial cost might get weight 3, fit might get weight 2). Sum scores per school.",
  "Now look at the totals. The numerical winner is your top choice — but check your gut. If your gut disagrees, dig into why.",
  "If gut disagrees with score: probably a missing criterion. Add it. Re-score. Re-rank.",
  "Get input from people who know you (family, mentors, current students at each school). They'll surface considerations you missed.",
  "Make the call. Don't agonize endlessly. Most decisions become 'right' through commitment, not through being perfect.",
];

const WHAT_TO_WEIGH = [
  "Real financial cost over 4 years (grants + scholarships only).",
  "Specific department strength for your major.",
  "Career outcomes data (First Destinations Reports).",
  "Cultural fit (visited or talked to current students).",
  "Specific programs/opportunities you'd actually pursue.",
  "Peer quality and intellectual ambition.",
  "Geographic and climate compatibility.",
  "Long-term brand recognition (calibrated to your goals).",
];

const WHAT_TO_IGNORE = [
  "Pure overall school ranking. Department strength matters more.",
  "Vibes from a single visit. Vibes shift; data doesn't.",
  "What other people think you should choose. Their lives are not yours.",
  "The school that sounds most prestigious. Sometimes the right choice isn't the most-prestigious one.",
  "FOMO about other schools. You can only attend one.",
  "How a school's brochure presented itself. Marketing differs from reality.",
  "Acceptance to a school as evidence of fit. Acceptance shows interest, not fit.",
  "What worked for someone else. Different student, different fit.",
];

const COMMON_MISTAKES = [
  "Choosing based on rank alone. Misses fit, cost, major strength, fit.",
  "Choosing based on cost alone. Sometimes the more expensive school is genuinely better fit.",
  "Choosing based on 'I really want to go there' without checking finances. Resentment about debt later is real.",
  "Listening primarily to parents. Their experience may not match current cycle reality.",
  "Visiting only one school. Comparison requires multiple data points.",
  "Comparing schools at different time periods. Visit each in similar context.",
  "Spending months on the decision when a week is sufficient. Overthinking after the data is in produces nothing additional.",
  "Treating every factor as equally important. Some factors matter more for your specific goals.",
];

const PAGE_FAQS = [
  { q: "How should I choose between two colleges?", a: "Calculate real 4-year cost (grants and scholarships only). Compare department strength for your intended major using CDS and First Destinations data. Visit both if possible. Talk to current students. Score each school 1-10 on your top 3 criteria, weight them, and sum. If your gut disagrees with the score, investigate why." },
  { q: "Should I choose the more prestigious school?", a: "Brand prestige matters for certain careers (consulting, finance, top grad schools) but decreases in importance after 5 years out. It should not override real cost or department strength for your major. A top program at a less-prestigious school often produces better outcomes than a mediocre program at a prestigious one." },
  { q: "How important is cost when choosing a college?", a: "Very important. Student debt compounds for decades. Calculate real cost (COA minus grants minus scholarships) over 4 years. If the cost difference between schools is $20K+ over 4 years, that factor should weigh heavily. Graduating without debt gives you career flexibility that prestige cannot." },
  { q: "What if I can't visit both colleges before deciding?", a: "Talk to current students via department coordinators or LinkedIn. Watch unscripted YouTube vlogs from current students. Read the r/[School Name] subreddit sorted by 'top of year.' Attend virtual admitted student events. These sources combined can approximate (though not replace) an in-person visit." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-decision-comparison-guide#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Decision Comparison Guide", item: `${BASE}/college-decision-comparison-guide` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-decision-comparison-guide#page`,
      url: `${BASE}/college-decision-comparison-guide`,
      name: "College Decision Comparison Guide — Choosing Between Multiple Admits",
      description: "Comprehensive framework for comparing multiple college admit offers and making the May 1 commitment.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-decision-comparison-guide#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/college-decision-comparison-guide#howto`,
      name: "How to Compare College Admit Offers",
      description: "8-step framework for comparing multiple college admit offers and making the right decision.",
      step: DECISION_MATRIX_STEPS.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: `Step ${i + 1}`,
        text: step,
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

export default function CollegeDecisionComparisonGuidePage() {
  return (
    <MarketingLayout
      eyebrow="Decision Framework"
      title="College Decision Comparison Guide"
      description="You have multiple admits. May 1 is approaching. The decision can feel overwhelming, but the framework is straightforward: 8 factors to weigh, an 8-step decision matrix, what to weigh and what to ignore. Use this guide to make the call without overthinking."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="8 factors to compare"
        Icon={Scale}
        description="Each factor has a weight depending on your specific goals. Use this as a starting framework, then customize."
      >
        <div className="space-y-3">
          {COMPARISON_FACTORS.map((f) => (
            <article
              key={f.factor}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <div className="mb-1 flex items-baseline gap-3 flex-wrap">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {f.factor}
                </h3>
                <span className="text-[12px] font-medium" style={{ color: "#4A6FA5" }}>
                  Weight: {f.weight}
                </span>
              </div>
              <p className="mb-2 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {f.desc}
              </p>
              <div className="text-[12.5px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                <p className="font-medium mb-0.5" style={{ color: "#4A6FA5" }}>Questions to ask:</p>
                <ul className="space-y-0.5 ml-3 list-disc">
                  {f.questions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="The 8-step decision matrix"
        Icon={Target}
        description="A repeatable process to move from comparison to commitment."
      >
        <ol className="space-y-3">
          {DECISION_MATRIX_STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="What to weigh and what to ignore"
        Icon={GitCompare}
        description="The signal vs the noise of college decision-making."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <h3 className="mb-2 text-[15px] font-semibold" style={{ color: "#4A6FA5" }}>
              Weigh
            </h3>
            <ul className="space-y-1.5">
              {WHAT_TO_WEIGH.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <h3 className="mb-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Ignore
            </h3>
            <ul className="space-y-1.5">
              {WHAT_TO_IGNORE.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="8 common decision mistakes" Icon={AlertCircle}>
        <ul className="space-y-2">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{m}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="When to revisit your decision"
        Icon={Users}
      >
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The decision is worth revisiting if: (1) Material new information arrives — financial aid increases, scholarship offer, transfer admit, family situation changes. (2) You realize a critical factor you didn&apos;t weigh — discovered a specific program at a different school that perfectly matches your goals. (3) Your gut persistently disagrees with your matrix — that&apos;s data; investigate. (4) Visiting changes your perception — what looked great on paper feels different in person.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Don&apos;t revisit because of: FOMO, comparison to peers&apos; choices, last-minute panic, parent pressure if you&apos;ve already decided. The decision should feel solid, not perfect. Most students experience some doubt; that&apos;s normal. If the doubt is structural and persistent, then revisit.
          </p>
        </div>
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
        headline="Make the right call with calibrated framework."
        description="AdmitPath surfaces the data and considerations specific to your decision — major strength, career outcomes, real costs. Free plan included. Pro $19.99/mo."
        buttonText="Decide with data"
      />

      {/* Related resources */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <a href="/college-decision-day" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Decision day guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>May 1 framework: negotiate aid, handle waitlist, commit.</div>
        </a>
        <a href="/financial-aid-appeal-guide" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Financial aid appeal guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>6 valid grounds and the 7-step letter framework.</div>
        </a>
        <a href="/college-acceptance-letter-decoder" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Acceptance letter decoder</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>What each admission phrase actually signals.</div>
        </a>
        <a href="/college-rejection-recovery" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Rejection recovery</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Processing rejections and the paths forward.</div>
        </a>
      </nav>
    </MarketingLayout>
  );
}
