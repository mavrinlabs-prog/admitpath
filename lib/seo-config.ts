/**
 * SEO Configuration — AdmitPath
 * Central source of truth for all SEO metadata, keywords, and schema markup.
 * Derived from the FlowPrep SEO Master Bundle (May 2026):
 *   - 02_AdmithPath_SEO_Playbook.docx
 *   - 04_Competitor_Forensics_Reference.docx
 *   - 06_Linguistic_Analysis.docx
 *   - 07_Semrush_Enhanced_Intel.docx
 */

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app").trim().replace(/\/+$/, "");

/* ── Tier 1 keyword targets from Semrush data ─────────────────────── */
export const TIER1_KEYWORDS = {
  homepage: [
    "college admissions counseling",
    "AI college counselor",
    "college application help",
    "how to get into college",
    "college essay help",
    "college admissions calculator",
  ],
  essays: [
    "how to write a college essay",
    "common app essay prompts 2026",
    "college essay examples",
    "supplemental essay guide",
    "college essay word count",
    "why this college essay",
  ],
  colleges: [
    "how to get into harvard",
    "how to get into mit",
    "how to get into stanford",
    "how to get into yale",
    "how to get into uf",
    "how to get into princeton",
  ],
  guides: [
    "college application timeline",
    "early decision vs early action",
    "activities list common app",
    "college application checklist",
    "letter of recommendation guide",
    "high school resume",
    "college interview questions",
  ],
  florida: [
    "college admissions for florida students",
    "bright futures scholarship",
    "uf acceptance rate",
    "fsu acceptance rate",
    "ucf acceptance rate",
    "usf acceptance rate",
  ],
  tools: [
    "college list builder",
    "college fit assessment",
    "college admissions calculator",
    "net price calculator",
  ],
} as const;

/* ── Page-specific title tags (60 chars, keyword-first per playbook) ── */
export const SEO_TITLES: Record<string, string> = {
  "/": "College Admissions AI Counselor | AdmitPath",
  "/blog": "College Admissions Blog | Strategy & Stats",
  "/pricing": "Pricing: AI College Counselor | AdmitPath",
  "/about": "About AdmitPath | Built by a Current HS Student",
  "/calculator": "College Admissions Calculator | Free Tool",
  "/college": "College Profiles & Admissions Data 2026",
  "/colleges": "100+ College Records | Admissions Data",
  "/compare": "Compare Colleges Side by Side | AdmitPath",
  "/college-essay-examples": "College Essay Examples That Worked | 2026",
  "/college-application-checklist": "College Application Checklist 2026 | Free",
  "/college-application-timeline-2026": "College Application Timeline 2026 | Dates",
  "/college-list-builder": "College List Builder | Free Tool | AdmitPath",
  "/choose-a-major": "How to Choose a College Major | 2026 Guide",
  "/college-rankings-explained": "College Rankings Explained | What Matters",
  "/deadlines": "College Application Deadlines 2026-2027",
  "/essays": "Essay Feedback | AI College Essay Review",
  "/faq": "Frequently Asked Questions | AdmitPath",
  "/fafsa-checklist": "FAFSA Checklist 2026-2027 | Step by Step",
  "/financial-aid-appeal-guide": "Financial Aid Appeal Guide | How to Appeal",
  "/glossary": "College Admissions Glossary | 200+ Terms",
  "/guides/common-app-essay": "How to Write the Common App Essay | 2026",
  "/guides/supplemental-essays": "Supplemental Essay Guide 2026 | AdmitPath",
  "/interview-practice": "College Interview Questions & Prep | Free",
  "/net-price": "Net Price Calculator | Real IPEDS Data",
  "/quiz": "College Chances Calculator | Free Quiz",
  "/resources": "College Admissions Resources | Guides & Tools",
  "/resources/common-app-essay": "Common App Essay Guide 2026 | AdmitPath",
  "/resources/supplemental-essays": "Supplemental Essay Guide 2026 | Tips",
  "/resources/financial-aid": "Financial Aid Guide 2026 | AdmitPath",
  "/resources/scholarships": "Scholarship Guide 2026 | Find & Apply",
  "/resources/summer-programs": "Summer Programs for HS Students | 2026",
  "/resources/demonstrated-interest": "Demonstrated Interest Guide | Admissions",
  "/resources/interview-prep": "College Interview Prep | Questions & Tips",
  "/resources/rec-letters": "Letter of Recommendation Guide | Tips",
  "/scholarship-match": "Scholarship Finder | Match & Apply Free",
  "/scholarships": "Scholarships for High School Students 2026",
  "/test-prep-guide": "SAT/ACT Test Prep Guide 2026 | Strategy",
  "/test-optional-schools-2026": "Test Optional Schools 2026 | Full List",
  "/tools": "Free College Admissions Tools | AdmitPath",
  "/personal-statement-guide": "Personal Statement Guide 2026 | Writing",
  "/admissions-statistics-2026": "Admissions Statistics 2026 | Real Data",
  "/college-admissions-framework-2026": "College Admissions Framework 2026",
  "/how-it-works": "How AdmitPath Works | 3 Simple Steps",
  "/why-admitpath": "Why AdmitPath | vs Private Counselors",
  "/for-schools": "AdmitPath for Schools & Counselors",
  "/counselor": "School Partnership Information | AdmitPath",
  "/scholarships-by-category": "Scholarships by Category | 2026 Guide",
  "/scholarship-application-guide": "Scholarship Application Guide | Tips",
  "/summer-experience-strategy": "Summer Experience Strategy for College",
  "/honors-college-explained": "Honors College Explained | Is It Worth It",
  "/accelerated-degree-programs": "Accelerated Degree Programs | 3-Year BA",
  "/college-tour-checklist": "College Tour Checklist | What to Ask",
  "/college-research-strategy": "College Research Strategy | How to Start",
  "/application-component-weighting": "Application Component Weights | Data",
  "/admissions-jargon-decoder": "Admissions Jargon Decoder | 100+ Terms",
  "/vs-college-counselor": "AdmitPath vs Private Counselor | Compare",
  "/pricing-comparison": "Pricing Comparison | AdmitPath vs Others",
  "/contact": "Contact Us — AdmitPath Support",
  "/counselor-toolkit": "Free Counselor Toolkit | HS College Resources",
  "/data/2026-admissions-trends": "What Worked in 2026 Admissions | Data Study",
  "/data/state-admissions-difficulty": "State-by-State Admissions Difficulty | Data",
  "/data/common-app-trends": "Common App Trends 2024-2026 | Data Study",
  "/data/florida-admit-rates": "Florida HS to Top 50 Admit Rates | Data",
  "/data/essay-angle-study": "Essay Angle Analysis | AdmitPath Research",
  "/florida/admissions-guide": "College Admissions for Florida Students | 2026",
  "/tools/college-fit": "College Fit Quiz (2026) | Free Assessment",
  "/tools/essay-brainstorm": "Essay Brainstorm Generator | Free Tool",
  "/tools/activities-optimizer": "Activities List Optimizer | 150-Char",
  "/tools/college-list-builder": "College List Builder (2026) | Free Tool",
  "/tools/net-price-calculator": "Net Price Calculator (2026) | IPEDS Data",
};

/* ── Meta descriptions (150-160 chars with CTA, per playbook) ──────── */
export const SEO_DESCRIPTIONS: Record<string, string> = {
  "/": "Score your college application across 7 dimensions calibrated to real CDS data from 102 schools. Free AI counselor, essay feedback, and college list builder. Start free.",
  "/blog": "Data-backed college admissions guides: Common App essays, acceptance rates, SAT strategies, and application deadlines. Updated weekly. Read free.",
  "/pricing": "AI college counseling for $19.99/mo vs $5K-$50K private counselors. Free plan with 5 analyses. 7-dimension scoring, essay feedback, college list builder.",
  "/about": "AdmitPath is an AI college counseling workspace for application strategy, essays, college lists, and planning. Meet the team.",
  "/calculator": "Free college admissions calculator calibrated to real CDS data. Enter GPA, test scores, and activities to see your chances at 102+ schools. Try it now.",
  "/college": "Browse 102+ college profiles with real acceptance rates, SAT/ACT ranges, and essay prompts from Common Data Set reports. Find your target schools.",
  "/colleges": "Search 100+ structured college records with available acceptance rates, SAT/ACT ranges, net price fields, and application guidance. Verify current figures with each school.",
  "/compare": "Compare colleges side by side: acceptance rates, net price, SAT/ACT ranges, student outcomes, and campus life. Data from IPEDS and CDS. Free tool.",
  "/college-essay-examples": "50+ real college essay examples that worked, annotated with what made each one effective. Common App, supplementals, and Why Us essays. Read free.",
  "/college-application-checklist": "Complete college application checklist for 2026-2027: deadlines, documents, essays, rec letters, and financial aid steps. Download free.",
  "/college-application-timeline-2026": "Month-by-month college application timeline for 2026-2027. Key deadlines for Early Decision, Early Action, and Regular Decision. Plan now.",
  "/college-list-builder": "Build a balanced college list with reach, match, and safety schools. Free AI tool uses real admissions data from 102+ schools. Start building.",
  "/choose-a-major": "How to choose a college major: self-assessment framework, career outcomes by major, and which colleges are strongest in each field. Free guide.",
  "/college-rankings-explained": "What college rankings actually measure and what they miss. US News methodology breakdown with what matters more for your application. Read free.",
  "/deadlines": "Every college application deadline for 2026-2027: Early Decision, Early Action, Regular Decision, and financial aid dates. Searchable and sortable.",
  "/essays": "Get AI essay feedback in 60 seconds. Line-level edits, structure analysis, and admissions officer perspective on your Common App or supplemental essay.",
  "/faq": "Answers to the most common questions about AdmitPath: how scoring works, data sources, pricing, privacy, and what makes us different from other tools.",
  "/fafsa-checklist": "Step-by-step FAFSA checklist for 2026-2027. Documents needed, common mistakes, and deadlines. Complete guide to maximize your financial aid.",
  "/financial-aid-appeal-guide": "How to appeal your financial aid offer: letter templates, negotiation tactics, and which schools adjust packages. Data-backed strategies that work.",
  "/glossary": "200+ college admissions terms defined in plain language. From yield protection to demonstrated interest. Searchable glossary for students and parents.",
  "/interview-practice": "Practice college interview questions with AI feedback. 50+ real questions from top schools with sample answers and strategy tips. Try free.",
  "/net-price": "Calculate your real college cost with IPEDS net price data by income band. Compare net price across schools. Free calculator, instant results.",
  "/quiz": "Take the free college chances quiz: enter your GPA, test scores, and activities to see where you stand at 102+ schools. Results in 2 minutes.",
  "/resources": "Free college admissions resources: essay guides, interview prep, financial aid, scholarships, and application strategy. All data-backed. Browse now.",
  "/resources/common-app-essay": "Complete guide to the Common App essay 2026: all 7 prompts analyzed, brainstorm framework, annotated examples, and mistakes to avoid. Free.",
  "/resources/supplemental-essays": "How to write supplemental essays for top colleges. Prompt analysis, angle strategies, and annotated examples for Why Us and community essays.",
  "/resources/financial-aid": "Complete financial aid guide: FAFSA, CSS Profile, merit aid, need-based aid, and appeal strategies. Real net price data from IPEDS. Read free.",
  "/resources/scholarships": "Scholarship guide for high school students: how to find, apply, and win. Includes 40+ scholarships with deadlines and award amounts. Start searching.",
  "/resources/summer-programs": "Best summer programs for high school students in 2026. Research, leadership, and pre-college programs ranked by selectivity and cost. Apply now.",
  "/resources/demonstrated-interest": "What is demonstrated interest and which colleges track it? Complete guide with strategies to show genuine interest. Boost your admission chances.",
  "/resources/interview-prep": "College interview preparation guide: 50+ common questions, answer frameworks, and what interviewers actually evaluate. Practice with AI feedback.",
  "/resources/rec-letters": "How to get strong letters of recommendation: who to ask, when to ask, and how to provide a brag sheet. Template and timeline included.",
  "/scholarship-match": "Match with scholarships based on your profile. Filter by GPA, test scores, major, and state. Real award amounts from IPEDS. Free, no signup.",
  "/scholarships": "Browse 40+ scholarships for high school students with deadlines, award amounts, and eligibility criteria. Bright Futures, Coca-Cola, and more.",
  "/test-prep-guide": "SAT and ACT test prep strategy guide: test-optional analysis, score improvement plans, and which schools require testing in 2026. Data-driven advice.",
  "/test-optional-schools-2026": "Complete list of test-optional colleges for 2026-2027. Which schools require SAT/ACT, which are test-blind, and how to decide. Updated list.",
  "/tools": "Free college admissions tools: chances calculator, essay feedback, college list builder, net price estimator, merit match, and more. No signup needed.",
  "/personal-statement-guide": "How to write a personal statement for college: brainstorm framework, structure template, and annotated examples. Avoid common mistakes. Free guide.",
  "/admissions-statistics-2026": "2026 admissions statistics for top colleges: acceptance rates, SAT/ACT ranges, yield rates, and demographic data from Common Data Set reports.",
  "/college-admissions-framework-2026": "The AdmitPath framework for 2026 admissions: 7 dimensions that define a competitive application, calibrated to real CDS data. Read the methodology.",
  "/how-it-works": "How AdmitPath works: enter your profile in 5 minutes, get scored across 7 dimensions, and receive a personalized 90-day action plan. Start free.",
  "/why-admitpath": "Review AdmitPath's documented rubric, current planning tools, Free-plan limits, and monthly Pro features.",
  "/for-schools": "Review AdmitPath's current student-facing planning tools and contact the team to discuss school requirements and a possible scoped evaluation.",
  "/vs-college-counselor": "See what AdmitPath currently includes, how its published-data tools work, and when qualified human counseling may still be appropriate.",
  "/pricing-comparison": "Review AdmitPath's current Free and monthly Pro plans, feature limits, data sources, and important product limitations.",
  "/contact": "Get in touch with the AdmitPath team. Questions about college admissions AI, billing, or your account? We respond within 24 hours.",
  "/counselor-toolkit": "Free college admissions resources for high school counselors: worksheets, checklists, essay guides, and data-backed tools. No signup required. Share with students.",
  "/data/2026-admissions-trends": "AdmitPath analyzed supplemental essay submissions to identify the 7 most common essay angles and which correlated with admits. Original privacy-safe research.",
  "/data/state-admissions-difficulty": "All 50 states ranked by admissions difficulty for in-state students. IPEDS enrollment data, CDS acceptance rates, and College Scorecard net price data.",
  "/data/common-app-trends": "What changed between 2024 and 2026 Common App submissions: application volume, prompt popularity, ED rates, and test-optional impact. Original research.",
  "/data/florida-admit-rates": "5-year analysis of admit rates from Florida public high schools to top 50 national universities. IPEDS and Florida Department of Education data.",
  "/data/essay-angle-study": "The 7 most common supplemental essay angles and which ones correlate with admits at selective schools. Privacy-safe aggregate data from AdmitPath worksheets.",
  "/florida/admissions-guide": "Complete guide to college admissions for Florida high school students. Bright Futures, UF/FSU/UCF/USF strategies, in-state vs out-of-state, and Florida-specific tips.",
  "/tools/college-fit": "Take the free College Fit Quiz. Answer 10 questions about your profile and preferences. Get a personalized list of best-fit colleges ranked by compatibility. No signup.",
  "/tools/essay-brainstorm": "Free essay brainstorm tool. Enter your background and interests. Get 5 unique college essay angles ranked by admissions value, with hook sentences. Instant results.",
  "/tools/activities-optimizer": "Free activities list optimizer. Paste your activity description, get a 150-character version for the Common App. Verb-first format that admissions officers prefer.",
  "/tools/college-list-builder": "College list builder using AdmitPath's structured college records. Enter GPA, scores, and preferences to create a planning list; verify requirements with each school.",
  "/tools/net-price-calculator": "Estimate college costs using available published fields. Results are planning estimates; use each school's official net price calculator for an authoritative figure.",
};

/* ── Schema markup generators (per playbook Section 7) ─────────────── */

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${APP_URL}${item.url}`,
    })),
  };
}

export function generateArticleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  keywords?: string[];
}) {
  return {
    "@type": "Article",
    "@id": `${APP_URL}${opts.url}#article`,
    headline: opts.title,
    description: opts.description,
    url: `${APP_URL}${opts.url}`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    image: opts.image || `${APP_URL}/api/og?title=${encodeURIComponent(opts.title)}`,
    author: { "@id": `${APP_URL}/#founder` },
    publisher: { "@id": `${APP_URL}/#organization` },
    isPartOf: { "@id": `${APP_URL}/#website` },
    inLanguage: "en-US",
    ...(opts.keywords ? { keywords: opts.keywords.join(", ") } : {}),
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema(opts: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; url?: string }>;
  totalTime?: string;
}) {
  return {
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: `${APP_URL}${step.url}` } : {}),
    })),
  };
}

export function generateCourseSchema(opts: {
  name: string;
  description: string;
  url: string;
  provider?: string;
}) {
  return {
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: `${APP_URL}${opts.url}`,
    provider: {
      "@type": "Organization",
      name: opts.provider || "AdmitPath",
      url: APP_URL,
    },
    educationalLevel: "HighSchool",
    inLanguage: "en-US",
  };
}

export function generatePersonSchema() {
  return {
    "@type": "Person",
    "@id": `${APP_URL}/#founder`,
    name: "AdmitPath Founder",
    url: `${APP_URL}/about`,
    description:
      "Builder of AI college counseling tools focused on application strategy, essays, college lists, and financial-aid planning.",
    knowsAbout: [
      "College admissions",
      "College essay writing",
      "Supplemental essays",
      "College application strategy",
      "Florida college admissions",
      "Financial aid",
      "Extracurricular profile building",
    ],
    alumniOf: { "@type": "HighSchool", name: "Pine View School" },
  };
}

export function generateWebPageSchema(opts: {
  url: string;
  title: string;
  description: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${APP_URL}${opts.url}#page`,
    url: `${APP_URL}${opts.url}`,
    name: opts.title,
    description: opts.description,
    isPartOf: { "@id": `${APP_URL}/#website` },
    about: { "@id": `${APP_URL}/#organization` },
    inLanguage: "en-US",
  };
}

/* ── Composite schema builder for page types per playbook Section 7 ── */

export function buildPageSchema(
  pageType: "college" | "essay" | "guide" | "tool" | "blog" | "comparison" | "worksheet" | "data",
  opts: {
    url: string;
    title: string;
    description: string;
    datePublished?: string;
    dateModified?: string;
    faqs?: Array<{ question: string; answer: string }>;
    steps?: Array<{ name: string; text: string }>;
    keywords?: string[];
    breadcrumbs?: Array<{ name: string; url: string }>;
  },
) {
  const graph: Record<string, unknown>[] = [];
  const now = new Date().toISOString().split("T")[0];

  // Always add BreadcrumbList
  const breadcrumbs = opts.breadcrumbs || [
    { name: "Home", url: "/" },
    { name: opts.title, url: opts.url },
  ];
  graph.push(generateBreadcrumbSchema(breadcrumbs));

  // Article schema on all content pages
  graph.push(
    generateArticleSchema({
      title: opts.title,
      description: opts.description,
      url: opts.url,
      datePublished: opts.datePublished || now,
      dateModified: opts.dateModified || now,
      keywords: opts.keywords,
    }),
  );

  // FAQ schema when FAQs provided
  if (opts.faqs && opts.faqs.length > 0) {
    graph.push(generateFAQSchema(opts.faqs));
  }

  // HowTo schema for essay guides, guide pages, tool pages
  if (
    (pageType === "essay" || pageType === "guide" || pageType === "tool") &&
    opts.steps &&
    opts.steps.length > 0
  ) {
    graph.push(
      generateHowToSchema({
        name: opts.title,
        description: opts.description,
        steps: opts.steps,
      }),
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/* ── Worksheet/tool schema (per playbook Section 7) ──────────────── */
export function generateWorksheetSchema(opts: {
  name: string;
  description: string;
  url: string;
  duration?: string;
}) {
  return {
    "@type": "SoftwareApplication",
    name: opts.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: `${APP_URL}${opts.url}`,
    description: opts.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: { "@id": `${APP_URL}/#organization` },
    ...(opts.duration ? { timeRequired: opts.duration } : {}),
  };
}

/* ── Image alt text pattern generators (per playbook) ──────────────── */
export function collegeAltText(collegeName: string, context: string): string {
  return `${collegeName} ${context} — AdmitPath college admissions data`;
}

export function essayAltText(collegeName: string, prompt: string): string {
  return `How to write ${collegeName} ${prompt} supplemental essay — AdmitPath guide`;
}

export function toolAltText(toolName: string): string {
  return `${toolName} — free college admissions tool by AdmitPath`;
}

/* ── Internal linking targets (per playbook Section 3) ─────────────── */
export const INTERNAL_LINK_TARGETS = {
  commonAppEssay: "/resources/common-app-essay",
  supplementalEssays: "/resources/supplemental-essays",
  financialAid: "/resources/financial-aid",
  scholarships: "/scholarships",
  collegeListBuilder: "/college-list-builder",
  calculator: "/calculator",
  quiz: "/quiz",
  essayExamples: "/college-essay-examples",
  timeline: "/college-application-timeline-2026",
  checklist: "/college-application-checklist",
  interviewPrep: "/interview-practice",
  merits: "/scholarship-match",
  netPrice: "/net-price",
  blog: "/blog",
  tools: "/tools",
  colleges: "/colleges",
  compare: "/compare",
  deadlines: "/deadlines",
  about: "/about",
  pricing: "/pricing",
  counselorToolkit: "/counselor-toolkit",
  forSchools: "/for-schools",
  admissionsTrends: "/data/2026-admissions-trends",
  stateDifficulty: "/data/state-admissions-difficulty",
  commonAppTrends: "/data/common-app-trends",
  floridaAdmitRates: "/data/florida-admit-rates",
  essayAngleStudy: "/data/essay-angle-study",
  worksheetBrainstorm: "/worksheets/common-app-essay-brainstorm",
  worksheetCollegeList: "/worksheets/college-list-generator",
  worksheetActivities: "/worksheets/activities-list-compressor",
  worksheetSupplemental: "/worksheets/supplemental-essay-strategist",
  brightFutures: "/scholarships/bright-futures",
  cocoColaScholars: "/scholarships/coca-cola-scholars",
  davidsonFellows: "/scholarships/davidson-fellows",
  regeneronSTS: "/scholarships/regeneron-sts",
  floridaGuide: "/florida/admissions-guide",
  edVsEa: "/resources/early-decision-vs-early-action",
  personalStatement: "/personal-statement-guide",
  testOptional: "/test-optional-schools-2026",
  collegeFit: "/tools/college-fit",
  essayBrainstorm: "/tools/essay-brainstorm",
  activitiesOptimizer: "/tools/activities-optimizer",
  collegeListBuilderTool: "/tools/college-list-builder",
  netPriceCalculatorTool: "/tools/net-price-calculator",
} as const;
