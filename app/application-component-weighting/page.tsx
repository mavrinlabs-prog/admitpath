import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "How Schools Weight Your Application",
  description:
    "How each application component is weighted at top schools, drawn from CDS Section C7 reports. GPA, essays, recs, activities, and how to allocate your effort.",
  alternates: { canonical: `${BASE}/application-component-weighting` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How Schools Weight Your Application",
    description: "Application component weighting from CDS Section C7: GPA, essays, recs, activities, and effort allocation.",
    url: `${BASE}/application-component-weighting`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Application+Weighting&subtitle=CDS+Section+C7+data`, width: 1200, height: 630, alt: "Application Component Weighting" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "How Schools Weight Your Application", description: "CDS Section C7 data: how GPA, essays, recs, and activities are weighted.", images: [`${BASE}/api/og?title=Application+Weighting&subtitle=CDS+Section+C7+data`] },
};

const COMPONENT_DATA = [
  {
    component: "Academic GPA / Class Rank",
    t20: "Very Important",
    t50: "Very Important",
    flagship: "Very Important",
    note: "First filter at all tiers. Without competitive GPA, the rest of the application doesn't matter much.",
    advice: "If GPA is below the school's median, focus effort here. Above the median, marginal returns are low.",
  },
  {
    component: "Course Rigor",
    t20: "Very Important",
    t50: "Important to Very Important",
    flagship: "Important",
    note: "Often the difference between two strong-GPA applicants. A 3.95 with 5 APs reads weaker than a 3.85 with 8 APs.",
    advice: "High marginal value in junior and senior course selection. Don't sacrifice rigor for an easier GPA boost.",
  },
  {
    component: "Application Essay (Personal)",
    t20: "Very Important",
    t50: "Important",
    flagship: "Considered",
    note: "Differentiates applicants with similar academics. Can move you up or down significantly within your band at top schools.",
    advice: "One of the highest marginal-return components. Multiple revisions, voice-driven, specific moments.",
  },
  {
    component: "Application Essay (Supplemental)",
    t20: "Important to Very Important",
    t50: "Important",
    flagship: "Considered",
    note: "Where 'fit' is demonstrated. Generic supplements hurt; specific ones help significantly.",
    advice: "Customize per school. Why-us essays should cite 3+ specific things (course, professor, program).",
  },
  {
    component: "Recommendation Letters",
    t20: "Very Important",
    t50: "Important",
    flagship: "Considered",
    note: "Letters with specific moments beat generic praise. Specifics signal genuine teacher engagement.",
    advice: "Build relationships with 2 academic teachers in junior/senior year. Provide brag sheet to support specificity.",
  },
  {
    component: "Test Scores (SAT/ACT)",
    t20: "Variable (test-required at MIT/Georgetown; test-optional at most)",
    t50: "Important when submitted",
    flagship: "Important",
    note: "Strong scores reinforce strong applications. Weak scores at test-optional schools can be omitted.",
    advice: "Take once. Submit if above school's 25th percentile of admits; consider not submitting if below.",
  },
  {
    component: "Extracurricular Activities",
    t20: "Very Important",
    t50: "Important",
    flagship: "Considered",
    note: "Where spike depth shows up. The activities list is proof of demonstrated commitment beyond academics.",
    advice: "Quality > quantity. 3-5 substantive activities with 4-year arcs beat 8-10 shallow ones.",
  },
  {
    component: "Talent / Ability",
    t20: "Important",
    t50: "Considered",
    flagship: "Considered",
    note: "Demonstrated talent (musical, athletic, artistic, intellectual) at exceptional levels is read as spike-equivalent.",
    advice: "Document with portfolio, recordings, or recognition. Important in arts/athletic admissions.",
  },
  {
    component: "Character / Personal Qualities",
    t20: "Important to Very Important",
    t50: "Important",
    flagship: "Considered",
    note: "Read through essays, recommendations, and the overall coherence of the application.",
    advice: "Indirectly addressed through essays and recommendations. The reader should see who you are.",
  },
  {
    component: "First-Generation College",
    t20: "Considered (some schools weight more)",
    t50: "Considered",
    flagship: "Considered",
    note: "Increasingly weighted post-2024 SCOTUS ruling. JHU, USC, Vanderbilt have explicit first-gen support.",
    advice: "Note status on application. The narrative around first-gen experience can strengthen essays.",
  },
  {
    component: "Alumni Relations / Legacy",
    t20: "Considered at some Ivies; Not Considered at MIT, Caltech, Amherst, Wesleyan, JHU, Pomona, CMU",
    t50: "Considered at some private schools",
    flagship: "Variable",
    note: "Hook effect at schools that consider it; nothing at others.",
    advice: "Apply ED if it's your top choice and the school weights legacy.",
  },
  {
    component: "Geographical Residence",
    t20: "Considered",
    t50: "Considered",
    flagship: "Often weighted (state preference)",
    note: "Geographic diversity is an institutional priority. Underrepresented states can help at the margin.",
    advice: "Limited control. Apply broadly across states; geographic context is read favorably at most schools.",
  },
  {
    component: "Demonstrated Interest",
    t20: "Not Considered (HYPSM, most Ivies)",
    t50: "Considered at some private schools",
    flagship: "Often Considered (state schools)",
    note: "At schools that track DI: applying ED, attending info sessions, opening emails matter. At schools that don't: wasted time.",
    advice: "Research per-school DI policy. Don't waste effort at non-DI schools. Apply ED at DI schools you'd attend.",
  },
];

const EFFORT_ALLOCATION = [
  {
    period: "Sophomore/junior year (long-term effort)",
    items: [
      "60% — academics (GPA + course rigor) and spike development.",
      "20% — building relationships with teachers (for strong recommendations) and counselor.",
      "10% — test prep (if relevant) and standardized testing.",
      "10% — research and exploration of college lists and possibilities.",
    ],
  },
  {
    period: "Senior fall (peak application effort)",
    items: [
      "Maintain academics (don't slip senior fall — visible via mid-year report).",
      "Major effort on essays — one of the highest marginal-return activities.",
      "Careful effort on activities list and honors (specifics, not padding).",
      "Calibrated school list based on actual fit and probability.",
      "Skip wasted effort on low-impact components and demonstrated interest at non-DI schools.",
    ],
  },
];

const COMMON_MISALLOCATIONS = [
  "Spending 40 hours on test prep when scores are already 1500+ but the personal essay is in draft 1.",
  "Stressing about senior fall transcript while skipping supplemental essays at deadline schools.",
  "Visiting 12 schools for demonstrated interest at schools where DI doesn't matter.",
  "Asking for a second teacher recommendation from someone who doesn't know you well.",
  "Padding the activities list with shallow involvement instead of deepening 3-4 substantive activities.",
  "Polishing already-strong essays endlessly instead of fixing weaker components.",
  "Worrying about brand prestige instead of fit and outcomes.",
];

const PAGE_FAQS = [
  { q: "What matters most in a college application?", a: "GPA and course rigor are the strongest filters at every tier. After that, the personal essay and recommendations carry the most weight at top-20 schools. Activities and spike matter for differentiation. Test scores are important where submitted but test-optional at many schools. The specific weighting varies by school -- check CDS Section C7 for each." },
  { q: "How important are extracurriculars for college admissions?", a: "Activities are 'Important' at T20 schools and 'Considered' at state flagships. Depth in 2-3 activities with demonstrated impact matters more than breadth across 10 shallow activities. Leadership and measurable outcomes (not just participation) are what admissions readers look for." },
  { q: "Do recommendation letters really matter?", a: "At T20 schools, recommendations are rated 'Very Important.' A strong letter from a teacher who knows you well and can speak to specific intellectual qualities is more valuable than a lukewarm letter from a more prestigious teacher. Ask teachers who've seen you at your best intellectually -- typically junior year core subject teachers." },
  { q: "Where should I spend my time during senior fall?", a: "Major effort on essays (highest marginal return for most students). Maintain grades (don't slip -- visible via mid-year report). Finalize activities list with specific details. Submit early applications with a 10-day buffer before deadlines. Skip low-impact activities like visiting schools that don't track demonstrated interest." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/application-component-weighting#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Application Component Weighting", item: `${BASE}/application-component-weighting` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/application-component-weighting#page`,
      url: `${BASE}/application-component-weighting`,
      name: "Application Component Weighting — How Schools Actually Weight Your Application",
      description: "Reference guide on how each application component is weighted at T20, T50, and state flagship schools, drawn from CDS Section C7 reports. Plus how to allocate your effort.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/application-component-weighting#breadcrumb` },
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

export default function ApplicationComponentWeightingPage() {
  return (
    <MarketingLayout
      eyebrow="Application Reference"
      title="How Schools Weight Your Application"
      description="Drawn from CDS Section C7 reports across T20, T50, and state flagships. How each application component is actually weighted, how to allocate your effort accordingly, and the 7 most common misallocations."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Component table */}
      <Section title="Component-by-component weighting" Icon={BarChart3}>
        <div className="space-y-3">
          {COMPONENT_DATA.map((c) => (
            <article
              key={c.component}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {c.component}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 text-[12.5px]">
                <div className="rounded-md px-2 py-1" style={{ background: "var(--dl-bg-root, #D5DCE8)" }}>
                  <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>T20: </span>
                  <span style={{ color: "#4A6FA5", fontWeight: 500 }}>{c.t20}</span>
                </div>
                <div className="rounded-md px-2 py-1" style={{ background: "var(--dl-bg-root, #D5DCE8)" }}>
                  <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>T50: </span>
                  <span style={{ color: "#4A6FA5", fontWeight: 500 }}>{c.t50}</span>
                </div>
                <div className="rounded-md px-2 py-1" style={{ background: "var(--dl-bg-root, #D5DCE8)" }}>
                  <span style={{ color: "var(--dl-text-muted, #5A6275)" }}>State: </span>
                  <span style={{ color: "#4A6FA5", fontWeight: 500 }}>{c.flagship}</span>
                </div>
              </div>
              <p className="mb-1 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                <strong>Real impact:</strong> {c.note}
              </p>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                <strong>Strategy:</strong> {c.advice}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Effort allocation */}
      <Section title="How to allocate your effort" Icon={CheckCircle2}>
        <div className="space-y-3">
          {EFFORT_ALLOCATION.map((e) => (
            <article
              key={e.period}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {e.period}
              </h3>
              <ul className="space-y-1.5">
                {e.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
                    <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* Common misallocations */}
      <Section title="7 common misallocations" Icon={AlertCircle}>
        <ul className="space-y-2">
          {COMMON_MISALLOCATIONS.map((m, i) => (
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
        headline="Allocate effort where it actually matters."
        description="AdmitPath audits your application against the CDS C7 weights for your target schools and shows where additional effort would have the highest return. Free plan included. Pro $19.99/mo."
        buttonText="Audit my application"
      />

      {/* Related resources */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <a href="/college-application-checklist" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Application checklist</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>80+ items across 7 categories.</div>
        </a>
        <a href="/college-essay-examples" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Essay examples</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>6 annotated excerpts with line-by-line analysis.</div>
        </a>
        <a href="/admissions-statistics-2026" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Admissions statistics 2026</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Admit rates, trends, and ED/EA splits.</div>
        </a>
        <a href="/test-prep-guide" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Test prep guide</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>12-week SAT/ACT prep plan.</div>
        </a>
      </nav>
    </MarketingLayout>
  );
}
