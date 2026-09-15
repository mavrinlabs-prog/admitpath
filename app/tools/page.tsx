import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calculator, BarChart3, Scale, Award,
  DollarSign, Target, CalendarRange, BookOpen, HelpCircle, Wallet,
  ClipboardList, Database, CalendarCheck, Star, Search, Eye,
  Heart, ClipboardCheck, ArrowRightLeft, Sun, LifeBuoy, Layers, Receipt, Mail, GitCompare, CheckSquare, Edit3, Lightbulb,
  ScatterChart, Mic, FileText,
} from "lucide-react";
import { MarketingNav, MarketingCTA } from "@/components/marketing";
import { ScrollReveal, StaggerContainer } from "@/components/scroll-reveal";
import { SUPPLEMENTAL_ESSAYS } from "@/data/supplemental-essays";
import { COLLEGES } from "@/data/colleges";

const SUPPLEMENTAL_COUNT = SUPPLEMENTAL_ESSAYS.length;

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Admissions Tools",
  description:
    "College admissions tools and planning references, including essay feedback, college-list guidance, and net-price resources.",
  alternates: { canonical: `${BASE}/tools` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Admissions Tools",
    description: "College admissions calculators and planning references. Availability and sign-in requirements vary by tool.",
    url: `${BASE}/tools`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=College+admissions+tools&subtitle=Calculators+and+planning+references`,
        width: 1200,
        height: 630,
        alt: "College admissions tools",
      },
    ],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Admissions Tools", description: "College admissions calculators and planning references.", images: [`${BASE}/api/og?title=College+admissions+tools&subtitle=Calculators+and+planning+references`] },
};

type Tool = {
  href: string;
  name: string;
  description: string;
  category: string;
  icon: typeof Calculator;
};

const TOOLS: Tool[] = [
  {
    href: "/quiz",
    name: "What Are My Chances? Quiz",
    description: `5-question chances assessment across ${COLLEGES.length} colleges. Tier breakdown (Likely / Target / Reach / Hard Reach).`,
    category: "Strategy",
    icon: Target,
  },
  {
    href: "/calculator",
    name: "Chances Calculator",
    description: "Detailed chances calculator. Enter GPA, SAT, and extracurriculars to see odds at the Ivies, Stanford, MIT, and 30+ top schools.",
    category: "Strategy",
    icon: BarChart3,
  },
  {
    href: "/compare",
    name: "Compare Colleges",
    description: "Side-by-side comparison of up to 5 schools: acceptance rate, SAT 25/75, GPA, enrollment, type, location.",
    category: "Strategy",
    icon: Scale,
  },
  {
    href: "/net-price",
    name: "Net Price Estimator",
    description: "Income-band planning estimates for the supported college records, with reminders to use each official Net Price Calculator.",
    category: "Money",
    icon: DollarSign,
  },
  {
    href: "/undermatch",
    name: "Undermatching Self-Check",
    description: "Research whether your current list overlooks schools with need-based aid. Verify eligibility and prices with official calculators.",
    category: "Strategy",
    icon: Target,
  },
  {
    href: "/deadlines",
    name: "Application Deadlines",
    description: "Common App ED / EA / REA / RD dates for 50 top colleges, grouped by application type. Downloadable .ics calendar.",
    category: "Reference",
    icon: CalendarRange,
  },
  {
    href: "/glossary",
    name: "Admissions Glossary",
    description: "38 terms (ED, EA, REA, spike, demonstrated interest, CSS Profile, FAFSA, need-blind, yield protection) defined plainly.",
    category: "Reference",
    icon: BookOpen,
  },
  {
    href: "/faq",
    name: "Admissions FAQ",
    description: "30 most-asked admissions questions answered with plain, sourced answers across 7 categories.",
    category: "Reference",
    icon: HelpCircle,
  },
  {
    href: "/resources/financial-aid",
    name: "Financial Aid Guide",
    description: "FAFSA, CSS Profile, federal aid, merit scholarships, and the timeline that maximizes your award.",
    category: "Money",
    icon: Wallet,
  },
  {
    href: "/interview-practice",
    name: "AI Interview Practice",
    description: "51 real questions from Harvard, Yale, MIT, Stanford, Georgetown alumni interviews. Practice mode with 2-min timer. AI scores clarity, specificity, authenticity, relevance, confidence.",
    category: "Strategy",
    icon: Mic,
  },
  {
    href: "/college-essay-examples",
    name: "Annotated Essay Examples",
    description: "6 strong college essay excerpts with line-by-line analysis of what works, what to avoid, and the takeaway for your own writing.",
    category: "Strategy",
    icon: BookOpen,
  },
  {
    href: "/resources/common-app-essay",
    name: "Common App Essay Prompts",
    description: "All 7 official 2026–27 prompts with what each rewards, what to avoid, and the writers each one is best for.",
    category: "Strategy",
    icon: BookOpen,
  },
  {
    href: "/resources/supplemental-essays",
    name: "Supplemental Essay Prompts",
    description: `${SUPPLEMENTAL_COUNT} top schools' 2026–27 supplemental prompts with word limits, intent, and pitfalls — Harvard, Stanford, MIT, Yale, USC, JHU, Notre Dame, Rice, and more.`,
    category: "Strategy",
    icon: BookOpen,
  },
  {
    href: "/college-rankings-explained",
    name: "College Rankings Explained",
    description: "What US News, QS, Forbes, Niche actually measure — methodology weights, caveats, and how to use rankings as one input, not the input.",
    category: "Reference",
    icon: BookOpen,
  },
  {
    href: "/college-list-builder",
    name: "College List Builder Guide",
    description: "The 4-band probability framework, the math of a balanced list, and the 6 most common list-building mistakes.",
    category: "Strategy",
    icon: Target,
  },
  {
    href: "/scholarship-match",
    name: "Scholarship Finder",
    description: "Filter the maintained scholarship catalog by profile fields. Verify eligibility, deadlines, and award details on each provider's official page before applying.",
    category: "Money",
    icon: Award,
  },
  {
    href: "/scholarships-by-category",
    name: "Scholarships by Category",
    description: "20 scholarships re-cut by audience: need-based, merit, minority, STEM, leadership, regional. Direct application links.",
    category: "Money",
    icon: Award,
  },
  {
    href: "/personal-statement-guide",
    name: "Personal Statement Guide",
    description: "The 5-part essay structure, the 6 things admissions reads for, and the 15-day revision process from brainstorm to final draft.",
    category: "Strategy",
    icon: BookOpen,
  },
  {
    href: "/test-prep-guide",
    name: "SAT/ACT Test Prep Guide",
    description: "How to choose between SAT and ACT, the 12-week study plan, score targets by tier, and when to retake or stop.",
    category: "Reference",
    icon: Target,
  },
  {
    href: "/choose-a-major",
    name: "How to Choose a Major",
    description: "The 3 admissions patterns (admit-by-major, admit-by-college, university-wide), the year-by-year exploration framework, and how to handle 'undecided.'",
    category: "Strategy",
    icon: Target,
  },
  {
    href: "/college-tour-checklist",
    name: "College Tour Checklist",
    description: "What to do before, during, and after a campus visit. Questions worth asking, virtual visit substitutes, post-visit notes.",
    category: "Reference",
    icon: BookOpen,
  },
  {
    href: "/admissions-jargon-decoder",
    name: "Admissions Jargon Decoder",
    description: "50+ confusing admissions terms with plain-language definitions and DefinedTermSet schema for rich-result eligibility.",
    category: "Reference",
    icon: BookOpen,
  },
  {
    href: "/admissions-statistics-2026",
    name: "2026 Admissions Statistics",
    description: "22-row admit rate table for top schools (overall, ED, EA, applications, trend) plus 6 structural trends shaping the cycle.",
    category: "Reference",
    icon: Database,
  },
  {
    href: "/college-application-checklist",
    name: "College Application Checklist",
    description: "80+ items across 7 categories — accounts, documents, testing, recommenders, Common App, supplemental essays, financial aid, submission. With HowTo schema.",
    category: "Strategy",
    icon: ClipboardList,
  },
  {
    href: "/college-decision-day",
    name: "May 1 Decision Day Framework",
    description: "Compare offers, calculate real cost, negotiate aid, handle waitlists, and commit cleanly. The 6-step decision framework with HowTo schema.",
    category: "Money",
    icon: CalendarCheck,
  },
  {
    href: "/honors-college-explained",
    name: "Honors Colleges Explained",
    description: "15+ top honors colleges (Schreyer, Barrett, Echols, Park, Robertson, Morehead-Cain, Macaulay) with admit numbers, benefits, and tradeoffs.",
    category: "Strategy",
    icon: Star,
  },
  {
    href: "/how-to-pick-a-counselor",
    name: "How to Pick a College Counselor",
    description: "8 red flags to walk away from. 10 questions to ask before signing. Fair pricing tiers ($200/hr to $70K packages). Free and lower-cost alternatives.",
    category: "Reference",
    icon: Search,
  },
  {
    href: "/need-blind-vs-need-aware-schools",
    name: "Need-Blind vs Need-Aware Schools",
    description: "Complete 2026 list: 9 fully need-blind schools, 16+ domestic-only need-blind schools, and strategy guidance for low-income and international applicants.",
    category: "Money",
    icon: Eye,
  },
  {
    href: "/diverse-college-list",
    name: "First-Gen & Low-Income Schools Guide",
    description: "Schools with strong first-gen programs, QuestBridge partners, HBCUs with strong outcomes, and 8 free national support programs (QuestBridge, Posse, College Possible, Matriculate, etc.).",
    category: "Money",
    icon: Heart,
  },
  {
    href: "/test-optional-schools-2026",
    name: "Test-Optional, Test-Blind, Test-Required Schools (2026)",
    description: "Comprehensive 2026 list of test policies. Strategy by tier (T20, T20-50, state flagships, less-selective). 6 most common mistakes. Per-school submit/skip decision framework.",
    category: "Reference",
    icon: ClipboardCheck,
  },
  {
    href: "/scholarship-application-guide",
    name: "Scholarship Application Guide",
    description: "6 types of scholarships, 6-phase timeline, where to find them (8 sources), essay strategy, the 80/20 truth on scholarship time, and 7 common mistakes. With HowTo schema.",
    category: "Money",
    icon: Award,
  },
  {
    href: "/transfer-college-strategy",
    name: "Transfer College Strategy",
    description: "How transfer admissions differs from first-year. 7 top transfer pipelines (UC TAG, Cornell Transfer Option, USC, Northwestern, Vanderbilt). The 'why transfer' essay framework. Realistic admit rates by tier.",
    category: "Strategy",
    icon: ArrowRightLeft,
  },
  {
    href: "/summer-experience-strategy",
    name: "Summer Experience Strategy (Years 9-12)",
    description: "Strategic guide to summer planning across grades 9-12. 5-tier program ranking, 6 production paths, 7 common mistakes. What signals strength vs weakness at each grade.",
    category: "Strategy",
    icon: Sun,
  },
  {
    href: "/college-rejection-recovery",
    name: "College Rejection Recovery",
    description: "Honest framework for processing rejections: first 24 hours, first week, 5 paths forward (best admit, gap year, transfer pipeline, late deadlines, reapply), schools you may not have considered.",
    category: "Reference",
    icon: LifeBuoy,
  },
  {
    href: "/application-component-weighting",
    name: "Application Component Weighting",
    description: "How each application component (GPA, course rigor, test scores, essays, recommendations, activities) is weighted at T20, T50, and state flagship schools — drawn from CDS C7 reports.",
    category: "Reference",
    icon: BarChart3,
  },
  {
    href: "/accelerated-degree-programs",
    name: "Accelerated Degree Programs",
    description: "8 types: 3-year bachelor's, 4+1 master's, 3+2 engineering, BS/MD, Penn M&T, Huntsman, Cornell BA/BS, joint JD programs. Benefits, tradeoffs, application strategy.",
    category: "Strategy",
    icon: Layers,
  },
  {
    href: "/college-research-strategy",
    name: "College Research Strategy",
    description: "8 essential research sources beyond the school website (Common Data Set, First Destinations, r/[School] subreddits, LinkedIn alumni, current students). 10 questions to investigate. The research arc.",
    category: "Reference",
    icon: Search,
  },
  {
    href: "/financial-aid-appeal-guide",
    name: "Financial Aid Appeal Guide",
    description: "How to negotiate your aid package. 6 valid grounds for appeal (income change, medical expenses, special circumstances, competing offers, errors, multiple in college), 7-step letter framework, what schools will/won't budge on, timeline.",
    category: "Money",
    icon: Receipt,
  },
  {
    href: "/college-acceptance-letter-decoder",
    name: "Acceptance Letter Decoder",
    description: "Decoded guide to admission letter language. Acceptance, deferral, waitlist, rejection phrases — what each actually signals about the school's position on you. How to read between the lines.",
    category: "Reference",
    icon: Mail,
  },
  {
    href: "/college-decision-comparison-guide",
    name: "Decision Comparison Guide",
    description: "Choosing between multiple admit offers before May 1. 8-factor comparison framework, decision matrix, what to weigh, what to ignore. With HowTo schema for actionable guidance.",
    category: "Strategy",
    icon: GitCompare,
  },
  {
    href: "/college-rejection-recovery-checklist",
    name: "Rejection Recovery Checklist",
    description: "Day-by-day action plan for processing college rejection. Day 1, Week 1, Week 2, Month 1, Month 2-3 actions. Decisional moments. Mental health checkpoints.",
    category: "Reference",
    icon: CheckSquare,
  },
  {
    href: "/college-essay-revision-checklist",
    name: "Essay Revision Checklist",
    description: "5-pass revision framework for college essays. Structural pass, content pass, language pass, voice pass, final cuts. With HowTo schema.",
    category: "Reference",
    icon: Edit3,
  },
  {
    href: "/college-essay-topic-finder",
    name: "Essay Topic Finder",
    description: "Framework for finding strong college essay topics. 8 categories of strong topics, prompts to surface ideas, 8 topic traps, and tests to verify your topic before drafting.",
    category: "Strategy",
    icon: Lightbulb,
  },
  {
    href: "/college-application-timeline-2026",
    name: "Application Timeline 2026",
    description: "Month-by-month guide from sophomore spring through commitment day. Per-period actions, deadlines, priorities, and common timeline mistakes.",
    category: "Reference",
    icon: CalendarRange,
  },
  {
    href: "/college-admissions-framework-2026",
    name: "Complete Admissions Framework",
    description: "The definitive guide to college admissions in 2026. Links to all 200+ articles and 22 reference pages organized across 8 dimensions. The master resource.",
    category: "Strategy",
    icon: BookOpen,
  },
  {
    href: "/rec-letters",
    name: "Recommendation Letter Tracker",
    description: "Track recommender status (Not Asked / Asked / Writing / Submitted), generate printable brag sheets, and get AI-suggested recommenders from your course list.",
    category: "Strategy",
    icon: FileText,
  },
  {
    href: "/decision-matrix",
    name: "College Decision Matrix",
    description: "Weighted comparison tool for choosing between acceptances. Score each school on 8+ factors, weight by importance, and see which college wins objectively.",
    category: "Strategy",
    icon: Scale,
  },
  {
    href: "/aid-comparison",
    name: "Financial Aid Offer Comparison",
    description: "Compare aid packages from up to 5 schools side by side. See net cost, grant-to-loan ratio, out-of-pocket cost, and 4-year totals.",
    category: "Money",
    icon: DollarSign,
  },
  {
    href: "/peer-profiles",
    name: "Admitted Student Profiles",
    description: "Anonymized profiles of students accepted and rejected at Harvard, MIT, Stanford, Yale, Princeton. See the patterns: spike focus, awards level, essay topics.",
    category: "Strategy",
    icon: ScatterChart,
  },
  {
    href: "/appeal-letter",
    name: "Appeal Letter Generator",
    description: "Generate a professional financial aid appeal letter. Select your reason, fill in details, and get a customizable letter ready to send. Free template.",
    category: "Money",
    icon: Receipt,
  },
  {
    href: "/fafsa-checklist",
    name: "FAFSA Filing Checklist",
    description: "Interactive 7-step FAFSA filing checklist with time estimates, document list, IRS DRT tips, and warnings. Check off steps as you complete them.",
    category: "Money",
    icon: ClipboardList,
  },
  {
    href: "/parent",
    name: "Parent Dashboard",
    description: "Read-only view of your child's application progress: profile completion, target schools, scores, and financial aid resources for parents.",
    category: "Reference",
    icon: Eye,
  },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/tools#page`,
      url: `${BASE}/tools`,
      name: "College Admissions Tools",
      description: "College admissions calculators and planning references on AdmitPath.",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      primaryImageOfPage: `${BASE}/api/og?title=College+admissions+tools&subtitle=Calculators+and+planning+references`,
    },
    {
      "@type": "ItemList",
      "@id": `${BASE}/tools#list`,
      name: "College Admissions Tools",
      description: "College admissions calculators and planning references on AdmitPath.",
      numberOfItems: TOOLS.length,
      itemListElement: TOOLS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        description: t.description,
        url: `${BASE}${t.href}`,
      })),
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE}/tools` },
  ],
};

const CATEGORIES = [
  { label: "Strategy", description: "Figure out where you stand and where to apply." },
  { label: "Money", description: "Compare planning estimates and financial-aid resources." },
  { label: "Reference", description: "Deadlines, terms, and the application timeline." },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <MarketingNav />

      <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <ScrollReveal>
          <header className="mb-12 sm:mb-16 text-center">
            <p className="dl-section-eyebrow">Tools</p>
            <h1
              className="mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Nine calculators and tools. <em style={{ fontFamily: "var(--font-inter)", fontStyle: "italic" }}>One sign-up</em> required: zero.
            </h1>
            <p
              className="mx-auto max-w-2xl text-lg leading-relaxed"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Every tool here works without an account. The full AI profile analysis, essay feedback, and college list builder live behind sign-up — these don&apos;t.
            </p>
          </header>
        </ScrollReveal>

        {/* Tools grouped by category */}
        {CATEGORIES.map((cat) => {
          const categoryTools = TOOLS.filter((t) => t.category === cat.label);
          return (
            <section key={cat.label} className="mb-12 sm:mb-16">
              <ScrollReveal>
                <header className="mb-5 flex items-baseline justify-between gap-4 border-b pb-3" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="flex items-baseline gap-3">
                    <h2
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      {cat.label}
                    </h2>
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: "rgba(74,111,165,0.1)", color: "#4A6FA5" }}
                    >
                      {categoryTools.length}
                    </span>
                  </div>
                  <p className="hidden sm:block text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {cat.description}
                  </p>
                </header>
              </ScrollReveal>
              <StaggerContainer className="stagger-children grid grid-cols-1 sm:grid-cols-2 gap-4" staggerMs={60}>
                {categoryTools.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="dl-card-hover card-hover flex items-start gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]"
                    >
                      <span
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 ease-out group-hover:scale-110"
                        style={{
                          background: "linear-gradient(135deg, #E8EFF8, #D5E0EE)",
                          color: "#4A6FA5",
                        }}
                        aria-hidden
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="mb-1.5 text-base font-bold flex items-center gap-1.5"
                          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                        >
                          <span className="flex-1">{t.name}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-60 group-hover:translate-x-0" />
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                          {t.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </StaggerContainer>
            </section>
          );
        })}

        {/* CTA */}
        <ScrollReveal>
          <MarketingCTA
            headline="Ready for the full AI counselor?"
            description="7-dimension profile scoring, line-by-line essay feedback, AI counselor chat, and a personalized action plan. Free plan included. Pro $19.99/mo."
            buttonText="Score my profile"
          />
        </ScrollReveal>
      </main>
    </div>
  );
}
