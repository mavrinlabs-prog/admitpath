import Link from "next/link";
import type { Metadata } from "next";
import {
  Search,
  Users,
  FileText,
  Eye,
  AlertCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "How to Research Colleges",
  description:
    "Go beyond college websites: the deeper research framework with 5 data sources, who to talk to, and what actually reveals the real school.",
  alternates: { canonical: `${BASE}/college-research-strategy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How to Actually Research Colleges",
    description: "Go beyond college websites: 5 data sources, who to talk to, and what reveals the real school.",
    url: `${BASE}/college-research-strategy`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=College+Research+Strategy&subtitle=Beyond+the+website`, width: 1200, height: 630, alt: "College Research Strategy" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "How to Actually Research Colleges", description: "5 data sources beyond the website that reveal the real school.", images: [`${BASE}/api/og?title=College+Research+Strategy&subtitle=Beyond+the+website`] },
};

const RESEARCH_SOURCES = [
  {
    source: "Common Data Set (CDS)",
    desc: "Each school publishes annual CDS reports with detailed admissions data, financial aid breakdowns, demographic information, and degrees granted by major. The most authoritative single source about a school. AdmitPath's scoring engine uses CDS Section C7 data for per-school calibration.",
    where: "Search '[School Name] Common Data Set [year]' or check the school's institutional research page. Most schools publish under 'Institutional Research' or 'Facts & Figures.'",
    keyValue: "Section C7 (admissions factor weights — this is what AdmitPath uses for per-school calibration), Section C1 (admit rates by round), Section B (enrollment by demographics), Section H (financial aid packages), Section J (degrees by major). C7 is the single most valuable section — it tells you whether a school weights essays as 'Very Important,' 'Important,' or 'Considered.'",
  },
  {
    source: "First Destinations Reports",
    desc: "Annual reports from career services showing where graduates went after the school — by major, by industry, by job title. Reveals real career outcomes vs marketing claims.",
    where: "Search '[School Name] First Destinations report' or check the career services page.",
    keyValue: "Specific company/grad school placement by major. The 'top employers' list. Median starting salaries by field. Research participation rates.",
  },
  {
    source: "r/[School Name] subreddits",
    desc: "Honest student perspectives on academics, social life, dining, dorms, faculty, classes. Sort by 'top of year' for most-upvoted insights.",
    where: "reddit.com/r/[SchoolName] for most schools.",
    keyValue: "Real student experience. Filters for top posts. Searchable for specific topics ('dining,' 'professor X,' 'social scene'). Especially useful for student culture.",
  },
  {
    source: "Niche student reviews",
    desc: "User-generated reviews from current students and alumni. Filter to 3-5 star reviews to balance highlights and gripes.",
    where: "niche.com/colleges/",
    keyValue: "Anonymous student perspectives across multiple dimensions (academics, athletics, dining, dorms, professors, value). Useful for vibe checking.",
  },
  {
    source: "School-specific student newspapers",
    desc: "The Daily (Stanford), Crimson (Harvard), Daily Pennsylvanian (Penn), Yale Daily News, Chicago Maroon. Honest student journalism on what's actually happening at the school.",
    where: "Search '[School Name] daily' or 'student newspaper.'",
    keyValue: "Recent stories on student concerns, faculty issues, administrative changes, social events. Reflects current school dynamics.",
  },
  {
    source: "LinkedIn alumni search",
    desc: "Search the school + your intended major to see where alumni work. Helps verify First Destinations claims and identify real career pipelines.",
    where: "LinkedIn → search '[School Name]' → filter by school AND major.",
    keyValue: "Real career paths. Alumni network strength. Geographic distribution. Industry concentration. Useful for major-specific outcome verification.",
  },
  {
    source: "Current student conversations",
    desc: "Direct conversations with current students at the school. Often more honest than admissions materials.",
    where: "Email department coordinators for connections. Reach out via LinkedIn alumni who graduated recently. Use AdmitPath alumni network.",
    keyValue: "Specific perspectives on classes, professors, social life, what they wish they'd known. Best source for fit assessment.",
  },
  {
    source: "Reddit r/ApplyingToCollege",
    desc: "Active community discussing applications across schools. Crowdsourced admit data, essay advice, school comparisons.",
    where: "reddit.com/r/ApplyingToCollege",
    keyValue: "Real-time perspectives from current applicants. Crowdsourced admit data. Discussion of recent changes. Filter to 'best' for quality content.",
  },
];

const QUESTIONS_TO_INVESTIGATE = [
  "What's the academic culture like — collaborative vs competitive?",
  "What classes are 'hidden gems' that students recommend?",
  "What's the typical student work week like — how many hours studying, how many socializing?",
  "Where do students live junior/senior year? On campus? Off-campus? Greek life?",
  "What's the social scene? Active Greek life? Drinking-heavy? Diverse alternatives?",
  "Who's the best professor in [my intended department]? Who should I avoid?",
  "How do students get internships in [my intended field]? Self-driven or organized?",
  "What's the cultural fit — pre-professional, intellectual, balanced?",
  "What's the worst thing about being a student at this school?",
  "What did current students assume about the school before they came that turned out to be wrong?",
];

const RESEARCH_ARC = [
  { stage: "Exploration (sophomore-junior year)", action: "Use rankings + general criteria to identify 30-50 schools that might fit. Cast wide net at this stage." },
  { stage: "Narrowing (junior fall-spring)", action: "Use CDS reports, First Destinations, and student perspectives to narrow to 12-20 schools. Eliminate schools where you're clearly not a fit." },
  { stage: "Deepening (junior summer)", action: "Visit if possible. Talk to current students. Read student newspapers. Check r/[School Name] for honest culture. Refine to 8-12 schools." },
  { stage: "Pre-application (senior fall)", action: "Verify per-school admit data, supplemental essay prompts, application requirements. Confirm this is your final list." },
  { stage: "Post-admission (senior spring)", action: "If you have multiple admits, deep-dive on 2-3 finalists. Visit, talk to current students of those specific schools, attend admitted-student events." },
];

const COMMON_MISTAKES = [
  "Relying only on the school website. The marketing version is incomplete; the real version requires deeper research.",
  "Choosing schools based on rankings alone without verifying fit, major strength, or cost.",
  "Trusting one source. Different sources have different biases; cross-reference.",
  "Skipping student perspectives. The CDS tells you what the school admits; students tell you what it's like to be there.",
  "Visiting only the show campus. The official tour shows the show campus; the real campus is what students see daily.",
  "Asking generic questions. 'What's the social scene?' gets generic answers. Ask specific questions.",
  "Ignoring department-specific information. The school's overall ranking doesn't tell you about your specific major.",
  "Not using LinkedIn alumni search. Real career outcomes by major are searchable.",
];

const PAGE_FAQS = [
  { q: "When should I start researching colleges?", a: "Informal research begins sophomore year with broad exploration of campus types and interests. Structured research using Common Data Sets and First Destinations reports should start junior fall. Deep research (visiting, talking to students, reading school newspapers) happens junior spring through senior fall." },
  { q: "What is the Common Data Set and how do I use it?", a: "The Common Data Set (CDS) is a standardized report published annually by most colleges. Section C7 lists how schools weight each admissions factor. Section H details financial aid. Section J shows degrees granted by major. Search '[School Name] Common Data Set [year]' or check the school's institutional research page." },
  { q: "How do I find out what a school is really like?", a: "Cross-reference three sources: the school's official data (CDS, First Destinations), student perspectives (r/[School Name] subreddit, Niche reviews, student newspaper), and direct conversations with current students. The marketing website alone is insufficient. Each source has biases — triangulate across all three." },
  { q: "How many colleges should I research before applying?", a: "Start broad (30-50 schools sophomore-junior year), narrow to 15-25 by junior spring, and finalize to 8-12 by senior fall. Research depth should increase as the list narrows — shallow research on 50 schools, deep research on your final 12." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-research-strategy#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College Research Strategy", item: `${BASE}/college-research-strategy` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-research-strategy#page`,
      url: `${BASE}/college-research-strategy`,
      name: "How to Actually Research Colleges — Beyond the Website",
      description: "Comprehensive framework for college research beyond websites. 8 research sources, 10 questions to investigate, the research arc from sophomore through admitted-student events, and 8 common mistakes.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-research-strategy#breadcrumb` },
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

export default function CollegeResearchStrategyPage() {
  return (
    <MarketingLayout
      eyebrow="Research Strategy"
      title="How to Actually Research Colleges"
      description="Most students rely on websites and rankings. The real research goes deeper. Here's the comprehensive framework: 8 research sources (Common Data Set, First Destinations, r/[School Name] subreddits, LinkedIn alumni search, current students), 10 questions to investigate, the research arc from sophomore year to admitted student, and 8 common mistakes."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="8 essential research sources"
        Icon={Search}
        description="Beyond the school website. Each source reveals something different about what the school actually offers."
      >
        <div className="space-y-3">
          {RESEARCH_SOURCES.map((s) => (
            <article
              key={s.source}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {s.source}
              </h3>
              <p className="mb-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {s.desc}
              </p>
              <p className="mb-1 text-[13px]" style={{ color: "#4A6FA5", fontWeight: 500 }}>
                Where: {s.where}
              </p>
              <p className="text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)", fontStyle: "italic" }}>
                Key value: {s.keyValue}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="10 questions to investigate"
        Icon={Eye}
        description="Specific questions that produce useful answers. Generic questions get generic answers."
      >
        <ol className="space-y-2">
          {QUESTIONS_TO_INVESTIGATE.map((q, i) => (
            <li key={i} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="The research arc"
        Icon={FileText}
        description="When to do which type of research, from sophomore year through admitted-student events."
      >
        <div className="space-y-3">
          {RESEARCH_ARC.map((r) => (
            <article
              key={r.stage}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {r.stage}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {r.action}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="8 common research mistakes" Icon={AlertCircle}>
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
        title="Why the deeper research matters"
        Icon={Users}
      >
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The school website is the marketing version. The Common Data Set is the regulatory version. The r/[School Name] subreddit is the student version. Triangulating all three (plus First Destinations, LinkedIn alumni, and current student conversations) gives you the real picture.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Students who do deeper research make better-informed application decisions, build stronger &apos;why us&apos; essays, and end up at schools that actually fit. The 4-year experience is too important to choose based on rankings alone.
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
        headline="Research with a calibrated framework."
        description="AdmitPath aggregates CDS data, admit rates, First Destinations outcomes, and student perspectives — surfacing what matters about each school for your specific profile. Free plan included. Pro $19.99/mo."
        buttonText="Research smarter"
      />

      {/* Related resources */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <Link href="/college-tour-checklist" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>College tour checklist</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>What to do before, during, and after a campus visit.</div>
        </Link>
        <Link href="/college-rankings-explained" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>College rankings explained</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>How US News, Forbes, and Niche rankings work.</div>
        </Link>
        <Link href="/diverse-college-list" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>First-gen and diverse college list</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Schools with strong first-gen and low-income support.</div>
        </Link>
        <Link href="/admissions-statistics-2026" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Admissions statistics 2026</div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Admit rates, trends, and ED/EA splits.</div>
        </Link>
      </nav>
    </MarketingLayout>
  );
}
