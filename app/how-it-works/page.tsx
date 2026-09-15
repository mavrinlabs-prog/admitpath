import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Brain,
  BarChart3,
  Target,
  PenLine,
  GraduationCap,
  ShieldCheck,
  Database,
  Sparkles,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "How AdmitPath Works — 7 Dimensions, 102 Schools, Real Data" },
  description:
    "How AdmitPath scores your application across 7 dimensions using CDS C7 calibration, 4-band probability, and action plans for 102 schools.",
  alternates: { canonical: `${BASE}/how-it-works` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How AdmitPath Works — 7-Dimension Scoring",
    description: "How AdmitPath scores your application: 7 dimensions, CDS calibration, 4-band probability, and the action plan engine.",
    url: `${BASE}/how-it-works`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=How+AdmitPath+Works&subtitle=7-dimension+scoring+%C2%B7+real+calibration`, width: 1200, height: 630, alt: "How AdmitPath Works" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "How AdmitPath Works — 7-Dimension Scoring", description: "7 dimensions, CDS calibration, 4-band probability, and action plan.", images: [`${BASE}/api/og?title=How+AdmitPath+Works&subtitle=7-dimension+scoring+%C2%B7+real+calibration`] },
};

type Step = {
  index: string;
  icon: typeof Brain;
  title: string;
  body: string;
  details: string[];
};

const STEPS: Step[] = [
  {
    index: "01",
    icon: Database,
    title: "You enter your real application data",
    body: "Grades by year and subject, AP/IB/honors course load, SAT/ACT scores, the activities you actually do (with hours and roles), awards with their level (school/regional/state/national), intended major, and any context (school strength, financial-aid need, demographics).",
    details: [
      "No vague self-rating sliders. Specific data, the same shape admissions reads.",
      "Imported from a Common App-style template if you have one.",
      "Stored encrypted at rest. Never sold or shared with third parties.",
    ],
  },
  {
    index: "02",
    icon: BarChart3,
    title: "Your profile is scored across 7 dimensions",
    body: "Academic Rigor, Leadership, Awards, Activity Depth, Spike, Essay Quality, and Recommendations. Each is scored 0–100 against calibrated benchmarks for the school you're targeting — not against an arbitrary scale.",
    details: [
      "Academic Rigor reads your AP count against your school's apsOffered (a B in 7 APs at a 12-AP school is read differently than 7 APs at a 6-AP school).",
      "Leadership rewards sustained office-holding and founding, not just membership.",
      "Awards weights state/national/international wins higher than school-level recognitions.",
      "Spike is the single hardest score: depth + increasing trajectory + tangible production.",
      "Essay Quality is run through 6 rubrics: authenticity, insight, specificity, storytelling, impact, voice.",
    ],
  },
  {
    index: "03",
    icon: Target,
    title: "Your odds at each school are calibrated, not invented",
    body: "We run your scored profile against each target school's actual CDS Section C7 admissions-factor weights. Stanford weights extracurriculars heavily; MIT weights rigor and STEM-specific signals; Brown values intellectual fit. The same applicant shows different odds at different schools.",
    details: [
      "We use a 4-band probability system (Very Likely / Possible / Long Shot / Hail Mary) — not false-precision percentages.",
      "Bands are tied to ranges of admit-rate-conditional-on-profile, not raw admit rates.",
      "Calibration data comes from CDS C7 (102 schools) + IPEDS + College Scorecard — public sources, named on /methodology.",
      "We don't predict hooks (legacy, athletics, demographics) directly — those are noted separately if relevant.",
    ],
  },
  {
    index: "04",
    icon: Sparkles,
    title: "We generate your gap analysis and action plan",
    body: "Once we know your scores and your target schools, we work backward: which dimensions are below the band threshold for your target schools? Which gaps are realistic to close in 30 / 60 / 90 days? Which would require a year of sustained work?",
    details: [
      "Action items are specific and time-stamped. Not 'improve your essay' but 'rewrite paragraph 3 to add a specific moment about [your debate experience].'",
      "30-day actions: high-impact and immediately doable.",
      "60-day actions: bigger projects (research, competitions, leadership pivots).",
      "90-day actions: structural changes (additional courses, major project completions).",
    ],
  },
  {
    index: "05",
    icon: PenLine,
    title: "Your essays get line-by-line feedback",
    body: "The essay tool runs your draft against the same 6 dimensions admissions readers internally apply: authenticity, insight, specificity, storytelling, impact, and voice. It flags abstract paragraphs, generic phrases, and missing reflection. It rewrites suggestions in YOUR voice — not a generic AI voice.",
    details: [
      "Voice rubric scores 4 axes (College Essay Guy framework): place (grounding in a physical location), detail (sentence-level craft and rhythm variance), vulnerability (honest self-disclosure and admission of doubt), surprise (unexpected connections and intellectual tension).",
      "Why-Us coach detects 27 generic phrases and counts specific signals (named courses, professors, traditions).",
      "Per-school AI-policy badge tells you exactly what each school allows you to use AI for.",
      "Essay version control lets you roll back, compare, and track score changes across drafts.",
    ],
  },
  {
    index: "06",
    icon: GraduationCap,
    title: "Your college list is built from the bottom up",
    body: "Most students start with reaches and add safeties later. We start with your bands. Schools where your profile predicts Very Likely become safeties. Possible become targets. Long Shot become reaches. Hail Mary stays in the calculation but is flagged as low-percent.",
    details: [
      "Recommended balance: 2-3 reaches, 3-5 targets, 2-3 safeties.",
      "Safeties must meet two criteria: admit rate above 50% AND your profile above the 75th percentile.",
      "Net price is computed alongside admit probability — a school you can't afford isn't really on your list.",
      "Undermatching nudge for high-stat low-income students surfaces meets-full-need schools that often cost less than state flagships.",
    ],
  },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Calibrated, not inflated",
    body: "We tell you when you're a Long Shot. The schools that say 'we'll get you in anywhere' are selling false hope. Your real options widen when you start with the truth.",
  },
  {
    icon: Brain,
    title: "Built for the student, not the parent",
    body: "Every interface is designed for a 17-year-old to use alone. Parents can read along; the system doesn't require a Common App login or counselor approval to start.",
  },
  {
    icon: Database,
    title: "Sourced from public, primary data",
    body: "CDS Section C7, IPEDS, College Scorecard, FairTest, and named admissions research. Every claim is traceable. See /methodology for the full list of sources per dimension.",
  },
  {
    icon: Sparkles,
    title: "AI as augmentation, never as authorship",
    body: "We score, we suggest, we explain. We don't write your essays. The Common App honor pledge and most schools' AI policies forbid AI-authored essays — we surface those rules and never cross them.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/how-it-works#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "How it works", item: `${BASE}/how-it-works` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/how-it-works#page`,
      url: `${BASE}/how-it-works`,
      name: "How AdmitPath Works",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/how-it-works#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/how-it-works#howto` },
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/how-it-works#howto`,
      name: "How AdmitPath Scores Your College Application",
      description:
        "The full mechanics of how AdmitPath produces your score, calibrated odds, action plan, and essay feedback.",
      totalTime: "PT15M",
      step: STEPS.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <MarketingLayout
      eyebrow="How it works"
      title="The honest mechanics of AdmitPath"
      description="Six steps from raw application data to a calibrated college list, with no false precision, no inflated scores, and no fake testimonials along the way."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Steps */}
      {STEPS.map((s) => {
        const Icon = s.icon;
        return (
          <article
            key={s.index}
            className="dl-card-hover mb-10 rounded-2xl border p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="mb-4 flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(74,111,165,0.08)" }}
              >
                <Icon className="h-6 w-6" style={{ color: "#4A6FA5" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: "#4A6FA5" }}
                >
                  Step {s.index}
                </p>
                <h2
                  className="text-[18px] font-semibold mb-2"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {s.title}
                </h2>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                >
                  {s.body}
                </p>
              </div>
            </div>

            <ul className="mt-2 space-y-1.5">
              {s.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--dl-text-muted, #5A6275)" }}
                  />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{d}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}

      {/* Principles */}
      <section className="mt-16 mb-12">
        <h2
          className="mb-6 text-[22px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          The principles behind every score
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="dl-card-hover rounded-xl border p-5"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <Icon className="mb-3 h-5 w-5" style={{ color: "#4A6FA5" }} />
                <h3
                  className="mb-1.5 text-[14px] font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {p.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-links */}
      <div
        className="mb-12 rounded-xl border p-5"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
      >
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Want the full technical detail?
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "#4A6FA5" }}
          >
            Full methodology <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/security"
            className="inline-flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "#4A6FA5" }}
          >
            Security &amp; privacy <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "#4A6FA5" }}
          >
            Editorial team <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <section className="mt-16 mb-12">
        <h2
          className="mb-2 text-[22px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          What the product currently provides
        </h2>
        <p
          className="text-[14px] leading-relaxed"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          AdmitPath combines a documented seven-dimension rubric, available CDS and IPEDS fields,
          essay feedback, college-list planning, and next-step tools. Results are planning guidance,
          not admissions decisions or a substitute for qualified counseling.
        </p>
        <div className="mt-5">
          <Link href="/pricing-comparison" className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: "#4A6FA5" }}>
            Review Free and Pro limits <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>


      {/* CTA */}
      <MarketingCTA
        headline="Get your honest 7-dimension score"
        description="Build your profile and see where you actually stand — calibrated against real admissions data."
        buttonText="Start free"
      />
    </MarketingLayout>
  );
}
