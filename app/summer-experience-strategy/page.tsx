import Link from "next/link";
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  Sun,
  Briefcase,
  FlaskConical,
  Users,
  AlertCircle,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Summer Experience Strategy — Grades 9-12 Guide",
  description:
    "Summer planning guide for grades 9-12. What counts (selective programs, research, jobs), what doesn't, and how to build a narrative for admissions.",
  alternates: { canonical: `${BASE}/summer-experience-strategy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Summer Experience Strategy — Grades 9-12",
    description: "Summer planning for grades 9-12. What counts, what doesn't, and how to build a narrative.",
    url: `${BASE}/summer-experience-strategy`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Summer+Strategy&subtitle=Grades+9-12+planning+guide`, width: 1200, height: 630, alt: "Summer Experience Strategy" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Summer Experience Strategy — Grades 9-12", description: "Summer planning for grades 9-12. What counts and how to build a narrative.", images: [`${BASE}/api/og?title=Summer+Strategy&subtitle=Grades+9-12+planning+guide`] },
};

const SUMMER_BY_GRADE = [
  {
    grade: "Summer after 9th grade",
    priority: "Foundational exploration",
    options: [
      "Free local STEM camp or arts program. Low pressure to start showing direction.",
      "Reading widely. The 9th-to-10th grade summer is one of the few where you have time to read substantively.",
      "Small project: building something simple, learning a programming language, taking on a creative project.",
      "Paid job (food service, retail, tutoring younger kids). Underrated — paid work signals discipline and life experience.",
      "Travel, family time, or genuine rest. Don't burn out before junior year.",
    ],
    avoid: "Trying to attend RSI / TASP / MITES. These programs admit only at the highest level of academic credentials, which most rising 10th graders haven't yet built."
  },
  {
    grade: "Summer after 10th grade",
    priority: "Direction emerging",
    options: [
      "Selective summer programs (TASP, RSI Eligibility, Clark Scholars Eligibility, MITES Eligibility, COSMOS, SSP). These are competitive but accessible to strong rising juniors.",
      "Paid summer programs at universities (Stanford SUMaC, JHU CTY, Yale Young Global Scholars). Less differentiating but solid.",
      "Substantive paid work, especially as primary income earner.",
      "Cold-emailed research with a college professor (yes, this works — many professors take rising juniors).",
      "Self-organized project showing initiative: starting a club at your school, organizing a community event.",
    ],
    avoid: "Pay-to-attend summer programs that don't have selective admissions. They look like 'student's family could pay $5K' rather than 'student was selected for academic merit.'"
  },
  {
    grade: "Summer after 11th grade (the most strategic)",
    priority: "Demonstrating commitment to your spike",
    options: [
      "Top-tier selective programs (RSI, TASP, Clark Scholars, MITES, SSP — these run rising senior year).",
      "Substantive research with a professor or in a lab. Often the strongest summer experience.",
      "Paid internship in your intended field.",
      "Independent production: starting a real business, writing a substantive paper, building something tangible.",
      "Significant community-organizing or service project with measurable outcomes.",
      "Selective summer pre-college program (ABILITY: Brown Pre-College, Cornell Summer College, Wash U Summer Scholars). Less differentiating than selective merit programs.",
    ],
    avoid: "Coasting. Junior summer is one of the most important summers in your application — it's the last summer before applications, and admissions reads it carefully."
  },
  {
    grade: "Summer after 12th grade (post-application)",
    priority: "Transition and personal growth",
    options: [
      "Substantive paid work or internship.",
      "Travel or service that's not 'voluntourism' but real engagement.",
      "Independent project that prepares you academically (read in your major, learn a skill, address foundational gaps).",
      "Genuine rest. Senior summer is partly for restoring before college.",
    ],
    avoid: "Treating senior summer as a final break with no intentional preparation. The transition to college is harder than students realize."
  },
];

const TIER_RANKING = [
  { tier: "Tier 1 (Strongest signal)", examples: "RSI, TASP, MITES, Clark Scholars, SSP, Telluride", note: "Single-digit admit rates from a self-selected pool. Explicit recognition by admissions readers as gold-standard." },
  { tier: "Tier 2 (Strong signal)", examples: "Stanford SUMaC, JHU CTY, COSMOS, Yale YGS, Brown Pre-College Honors", note: "Selective named programs at top universities. Solid academic signal but less differentiating than Tier 1." },
  { tier: "Tier 3 (Moderate signal)", examples: "Cornell Summer College, Wash U Summer Scholars, ESU America, Brown Pre-College", note: "Pre-college experience programs. Read positively but not differentiating." },
  { tier: "Tier 4 (Weak signal)", examples: "Pay-to-attend summer programs at universities, self-paced online programs, generic 'leadership' programs", note: "Read as 'student's family could pay $X' rather than 'student was selected.' Don't lead your application with these." },
  { tier: "Tier 5 (Read negatively)", examples: "Pay-for-publication scams, fake research programs that produce no real output, 'shadowing' arrangements through family connections", note: "Admissions readers can spot these patterns. Worse than no summer experience." },
];

const PRODUCTION_PATHS = [
  { type: "Research", desc: "Working with a professor or grad student on a substantive project. Sometimes leads to a publication, conference presentation, or significant paper. Cold-email approach works for many students at local universities." },
  { type: "Building / shipping", desc: "Software, hardware, creative work. The student who shipped a real iOS app, built and tested a robot, or wrote a substantive piece of fiction signals exceptional initiative." },
  { type: "Entrepreneurship", desc: "Starting a real business that generates revenue or impact. Not the 'I started a business' that lasted a week — sustained business with real outcomes." },
  { type: "Community organizing", desc: "Founding a nonprofit, organizing a substantive community event, leading a sustained service initiative with measurable outcomes." },
  { type: "Substantive paid work", desc: "Holding down a real job — especially as primary income earner — signals discipline, responsibility, and life experience that admissions reads positively." },
  { type: "Self-directed study", desc: "Mastering a skill or topic on your own with documented output (a paper, a project, a portfolio of work). Self-direction without output is weaker." },
];

const COMMON_MISTAKES = [
  "Spending $10K on a 'name-brand' pay-to-attend summer program when the same money could fund 6 weeks of substantive paid work or independent project.",
  "Doing 'leadership camp' or 'enrichment program' with vague outcomes. Admissions reads these as resume-padding.",
  "Starting a generic-sounding 'startup' or 'nonprofit' for resume purposes only — without sustained engagement or real outcomes.",
  "Treating any summer with a college name on it as equivalent. Brown Pre-College is different from RSI.",
  "Family-arranged 'shadowing' or 'internship' through parental connections. Admissions sees through this.",
  "Spending the entire summer in test prep. Test prep matters but shouldn't crowd out other application-strengthening activities.",
  "Not having ANY substantive summer activity. Having nothing on your summers reads as 'student didn't engage.'",
];

const PAGE_FAQS = [
  { q: "What summer activities look best for college admissions?", a: "Substantive independent production (research, software, organized events with outcomes) ranks highest. Selective programs like RSI, TASP, and MITES are next. Paid work signals discipline. Pay-to-attend summer programs at colleges carry the least weight -- admissions reads them as 'family could pay' not 'student was selected.'" },
  { q: "Are pre-college summer programs at universities worth it?", a: "It depends on selectivity. Free, competitive-admission programs (RSI, MITES, SSP, Clark Scholars) carry real weight. Pay-to-attend programs ($5K-$12K) at brand-name universities are read as enrichment, not achievement. The brand name on the program doesn't transfer to your application." },
  { q: "What should I do the summer before senior year?", a: "This is the critical production summer. Engage in your highest-impact activity (research, internship, project). Draft your personal statement (aim for 2-3 drafts). Research 'why us' supplements for your top schools. Finalize your school list. Begin the Common App activities section." },
  { q: "Is paid work a good summer activity for college applications?", a: "Yes, especially for students who work out of financial necessity. Admissions readers recognize that paid work signals discipline, responsibility, and real-world experience. Being a primary income earner for your family is read very positively. Don't dismiss it in favor of unpaid 'resume padding' activities." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/summer-experience-strategy#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Summer Experience Strategy", item: `${BASE}/summer-experience-strategy` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/summer-experience-strategy#page`,
      url: `${BASE}/summer-experience-strategy`,
      name: "Summer Experience Strategy — Years 9-12 Planning Guide",
      description: "Strategic guide to summer planning across grades 9-12. What signals strength vs weakness, the 5-tier program ranking, the 6 production paths, and 7 common mistakes.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/summer-experience-strategy#breadcrumb` },
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

export default function SummerExperienceStrategyPage() {
  return (
    <MarketingLayout
      eyebrow="Summer Strategy"
      title="Summer Experience Strategy (Grades 9-12)"
      description="What you do summers compounds. The student who builds substantive summers from grade 9 onward arrives at senior year with real depth. The student who does nothing or who pays for fluff programs arrives empty-handed. Here's the strategic framework for each summer, the 5-tier program ranking, and the 7 most common mistakes."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="Summer planning by grade"
        Icon={Sun}
        description="What's prioritized at each age. Strategy shifts as you build credentials and direction."
      >
        <div className="space-y-3">
          {SUMMER_BY_GRADE.map((s) => (
            <article
              key={s.grade}
              className="dl-card-hover rounded-xl border p-5"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <header className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {s.grade}
                </h3>
                <span className="text-[13px]" style={{ color: "#4A6FA5" }}>
                  · Priority: {s.priority}
                </span>
              </header>
              <h4 className="mt-1 text-[13.5px] font-semibold" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Strong options:
              </h4>
              <ul className="mt-1 mb-2 space-y-1">
                {s.options.map((o, i) => (
                  <li key={i} className="text-[13.5px] leading-relaxed flex items-start gap-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
              <h4 className="mt-2 text-[13.5px] font-semibold" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Avoid:
              </h4>
              <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s.avoid}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Program tier ranking"
        Icon={FlaskConical}
        description="How different summer programs are read by admissions. Not all 'summer programs at colleges' are equal."
      >
        <div className="space-y-3">
          {TIER_RANKING.map((t) => (
            <article
              key={t.tier}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <header className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {t.tier}
                </h3>
              </header>
              <p className="mb-1.5 text-[13.5px]" style={{ color: "#4A6FA5" }}>
                Examples: {t.examples}
              </p>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {t.note}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Production paths beyond programs"
        Icon={Briefcase}
        description="Often stronger than a program: substantive production over the summer."
      >
        <div className="space-y-3">
          {PRODUCTION_PATHS.map((p) => (
            <article
              key={p.type}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {p.type}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="The honest hierarchy"
        Icon={Users}
        description="If you had to rank what admissions reads as strongest summer activity, the order is:"
      >
        <ol className="space-y-2">
          <li className="flex items-start gap-3 text-[14.5px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#4A6FA5" }}>1</span>
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Substantive independent production (research with publication, software shipped, business with revenue, organized event with measurable outcome).</span>
          </li>
          <li className="flex items-start gap-3 text-[14.5px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#4A6FA5" }}>2</span>
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Selective Tier 1 program (RSI, TASP, MITES, SSP, Clark Scholars, Telluride).</span>
          </li>
          <li className="flex items-start gap-3 text-[14.5px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#4A6FA5" }}>3</span>
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Substantive paid work (real internship, primary income earner role, paid research).</span>
          </li>
          <li className="flex items-start gap-3 text-[14.5px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#4A6FA5" }}>4</span>
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Substantive volunteer / community organizing with measurable outcomes.</span>
          </li>
          <li className="flex items-start gap-3 text-[14.5px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#4A6FA5" }}>5</span>
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Selective Tier 2 program (Stanford SUMaC, JHU CTY, COSMOS, Yale YGS).</span>
          </li>
          <li className="flex items-start gap-3 text-[14.5px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#4A6FA5" }}>6</span>
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Honors-level pre-college experience (Cornell Summer College, Wash U Summer Scholars).</span>
          </li>
          <li className="flex items-start gap-3 text-[14.5px] leading-relaxed">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "var(--dl-text-muted, #5A6275)" }}>7</span>
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Pay-to-attend summer programs (read as &apos;family could pay,&apos; not &apos;student was selected&apos;).</span>
          </li>
        </ol>
      </Section>

      <Section title="Common mistakes" Icon={AlertCircle}>
        <ul className="space-y-2">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
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
        headline="Match your summers to your spike."
        description="AdmitPath surfaces summer programs and production paths aligned to your spike, profile, and grade level. Free plan included. Pro $19.99/mo."
        buttonText="Plan my summers"
      />

      {/* Related links */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/resources/summer-programs"
          className="dl-card-hover rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Summer programs database
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Curated database of selective and pre-college summer programs.
          </div>
        </Link>
        <Link
          href="/resources/competitions"
          className="dl-card-hover rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Academic competitions
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Competitions to consider during the school year and summer.
          </div>
        </Link>
      </nav>
    </MarketingLayout>
  );
}
