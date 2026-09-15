import type { Metadata } from "next";
import {
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Compass,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "How to Choose a College Major",
  description:
    "How to choose a college major: 3 admissions patterns that boost acceptance odds, year-by-year exploration, and handling 'undecided' strategically.",
  alternates: { canonical: `${BASE}/choose-a-major` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How to Choose a College Major — Guide",
    description: "3 admissions patterns, the year-by-year exploration framework, and handling 'undecided' strategically.",
    url: `${BASE}/choose-a-major`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=How+to+Choose+a+Major&subtitle=3+admissions+patterns+%C2%B7+framework`, width: 1200, height: 630, alt: "How to Choose a College Major" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "How to Choose a College Major", description: "3 admissions patterns, exploration framework, and handling 'undecided'.", images: [`${BASE}/api/og?title=How+to+Choose+a+Major&subtitle=3+admissions+patterns+%C2%B7+framework`] },
};

const FRAMEWORKS = [
  {
    label: "Admit-by-major (your major matters in admissions)",
    description:
      "Your stated major significantly affects your admissions outcome. Some majors are dramatically more competitive than others within the same school.",
    examples: [
      "UC Berkeley, UCLA, UCI — CS/EECS at Berkeley admits ~5%; Letters & Sciences ~15%",
      "University of Michigan — Engineering admits separately from LSA",
      "Carnegie Mellon — School of Computer Science is much harder than other schools",
      "USC — Marshall, Annenberg, Viterbi all admit separately",
      "Cornell — Each of the 7 undergraduate colleges admits separately",
    ],
    advice:
      "Do NOT apply for an easier-to-get-into major and plan to switch. Internal transfers between competitive majors are often as hard or harder than getting in directly. Apply for the major you actually want.",
  },
  {
    label: "Admit-by-college (your school within the university matters)",
    description:
      "You apply to a specific school within the university (Engineering, Business, Arts & Sciences) but not to a specific major within that school. The major declaration happens later, internally.",
    examples: [
      "Penn — Wharton, Engineering, College of Arts & Sciences, Nursing all admit separately",
      "Northwestern — Weinberg, McCormick, Communications all admit separately",
      "Many state schools (Wisconsin, Penn State) — separate admits for engineering, business, arts",
    ],
    advice:
      "Apply to the school whose disciplines you'd be choosing from. Don't apply to Engineering thinking you'll switch to Business — most schools don't allow easy school-to-school transfers.",
  },
  {
    label: "Admit university-wide (major doesn't matter in admissions)",
    description:
      "You apply to the university as a whole. Your stated major is informational; admissions reads your application primarily for fit and quality, not major demand.",
    examples: [
      "Most Ivies (Harvard, Yale, Princeton, Columbia) — admit university-wide",
      "Stanford — admit university-wide; can declare any major after admission",
      "MIT — admit university-wide; major declared end of sophomore year",
      "Most liberal arts colleges — admit university-wide",
    ],
    advice:
      "Your stated intended major matters less. You can change to almost any other major after admission with minimal restrictions.",
  },
];

const TIMELINE = [
  {
    when: "9th-10th grade",
    label: "Wide exploration",
    body: "Take broad coursework, try clubs across multiple domains. The point isn't to pick a major — it's to discover what you actually engage with. Notice what you do for free vs what you do under duress.",
  },
  {
    when: "11th grade",
    label: "Direction emerges",
    body: "Most strong applicants notice a coherent direction by junior year. You don't need to know the exact major, but you should have a domain (STEM / humanities / social sciences / arts) and ideally a sub-direction within it.",
  },
  {
    when: "Summer before senior year",
    label: "Solidify positioning",
    body: "Whatever your major direction is, this summer is when you produce something tangible in it. Research, project, internship, creative work. The summer is the major-positioning evidence in your application.",
  },
  {
    when: "Senior year application",
    label: "Declare strategically",
    body: "Pick the major that best matches your application narrative. If you've spent 3 years on biology research, declare biology. Don't change majors at application time to game admissions — readers can tell.",
  },
  {
    when: "After admission",
    label: "Real major exploration",
    body: "Most schools let you change majors easily within the same school/college. Use freshman year to take 1-2 courses outside your declared major to test alternatives. Most students change majors at least once.",
  },
];

const FOR_UNDECIDED = [
  "Apply 'undecided' or with a stated major that reflects the strongest evidence in your application — not necessarily what you want most.",
  "Do NOT apply 'undecided' if your application has a coherent narrative pointing to one direction. Stating 'undecided' on top of clear major-direction evidence reads as evasive.",
  "Some schools (Caltech, MIT) explicitly admit university-wide and assume undecided. Some (UCs, Penn, Cornell) require declared majors and read them carefully.",
  "If you genuinely don't know your major direction yet, your application essays should reflect intellectual curiosity across domains — not a forced commitment.",
  "Admit rates for 'undecided' are typically similar to or slightly worse than declared majors at most schools — but much worse than easier majors at admit-by-major schools (where 'undecided' might land you in the easiest pool).",
];

const PAGE_FAQS = [
  { q: "When do I need to choose a major?", a: "It depends on the school. At admit-by-major schools (UC Berkeley, Carnegie Mellon, Cornell), you choose at application time. At university-wide schools (Harvard, Stanford, MIT), you declare sophomore year. Most students change their major at least once after enrollment." },
  { q: "Does your major affect college admissions?", a: "At some schools, dramatically. At UC Berkeley, CS admits at roughly 5% while Letters & Sciences admits at 15%. At Harvard or Stanford, your stated major is informational — admissions reads your whole application, not your major box. Check whether your target school is admit-by-major, admit-by-college, or admit-university-wide." },
  { q: "Should I apply undecided?", a: "Only if your application genuinely reflects broad intellectual curiosity across domains. If your transcript, activities, and essays clearly point to one direction, applying 'undecided' on top of that reads as evasive. At admit-by-major schools, undecided can land you in less competitive pools." },
  { q: "Can I change my major after being admitted?", a: "At most university-wide admission schools (Ivies, Stanford, MIT), yes — easily. At admit-by-major or admit-by-college schools, switching between schools or competitive majors can be as hard or harder than getting in directly. Research each school's internal transfer policy." },
  { q: "Does my major determine my career?", a: "Less than most people think. Outside specialized fields (engineering, nursing, pre-med prerequisites), employers care more about skills, experience, and internships than your specific major. Philosophy majors outscore business majors on the LSAT. English majors work in tech. The major opens doors — what you do with it matters more." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/choose-a-major#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Choose a Major", item: `${BASE}/choose-a-major` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/choose-a-major#page`,
      url: `${BASE}/choose-a-major`,
      name: "How to Choose a College Major",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/choose-a-major#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/choose-a-major#article` },
    },
    {
      "@type": "Article",
      "@id": `${BASE}/choose-a-major#article`,
      headline: "How to Choose a College Major — Frameworks, Patterns, and When to Declare",
      description:
        "The 3 admissions patterns for majors, year-by-year exploration timeline, and how to handle 'undecided.'",
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

export default function ChooseAMajorPage() {
  return (
    <MarketingLayout
      eyebrow="Major Selection"
      title="How to Choose a College Major"
      description='The 3 admissions patterns that determine whether your major matters, a year-by-year exploration framework, and the honest take on applying "undecided."'
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* The frameworks */}
      <Section title="The 3 admissions patterns" Icon={Compass}
        description="Schools handle major declarations very differently. Knowing which pattern your target school uses changes how you apply."
      >
        {FRAMEWORKS.map((f, i) => (
          <article
            key={i}
            className="dl-card-hover mb-4 rounded-2xl border p-5"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <p
              className="mb-2 text-[15px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              {i + 1}. {f.label}
            </p>
            <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {f.description}
            </p>
            <p
              className="mb-2 text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Examples
            </p>
            <ul className="mb-3 space-y-1">
              {f.examples.map((ex, j) => (
                <li key={j} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--dl-text-muted, #5A6275)" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{ex}</span>
                </li>
              ))}
            </ul>
            <div
              className="rounded-lg border p-3"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "var(--dl-bg-root, #D5DCE8)" }}
            >
              <p
                className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#4A6FA5" }}
              >
                <Lightbulb className="h-3 w-3" />
                Strategy
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {f.advice}
              </p>
            </div>
          </article>
        ))}
      </Section>

      {/* Year-by-year timeline */}
      <section className="mb-12">
        <h2
          className="mb-3 text-[20px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Year-by-year exploration framework
        </h2>
        <p className="mb-5 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Major direction develops over years, not weeks. Here&apos;s the
          cadence we see in students who end up with strong, coherent
          major-direction stories.
        </p>
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
              <p
                className="mb-1 text-[15px] font-semibold"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
              >
                {t.label}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Undecided */}
      <Section title='What about applying "undecided"?' Icon={AlertTriangle}>
        <ul className="space-y-2.5">
          {FOR_UNDECIDED.map((u, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{u}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* FAQ */}
      <section className="mb-12">
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
      <MarketingCTA
        headline="See how your major direction reads"
        description="Get a calibrated profile score that factors in your intended major and target schools."
        buttonText="Build your free profile"
      />
    </MarketingLayout>
  );
}
