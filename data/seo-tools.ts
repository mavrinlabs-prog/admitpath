/**
 * Free tool landing page data for /tools/[slug] SEO pages.
 * Per SEO playbook Section 6 Play 2: "Strip free versions of 4 worksheets
 * and put them at /tools/. Each one earns passive backlinks."
 *
 * These are the SEO-optimized landing pages for the free tools that drive
 * link bait and top-of-funnel traffic.
 */

export type ToolPage = {
  slug: string;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  volume: number;
  h1: string;
  heroSubheading: string;
  ctaText: string;
  ctaHref: string;
  features: string[];
  faq: { question: string; answer: string }[];
  internalLinks: string[];
};

export const TOOLS_PAGES: ToolPage[] = [
  {
    slug: "college-fit",
    name: "College Fit Quiz",
    shortName: "College Fit",
    metaTitle: "College Fit Quiz (2026) -- Find Your Best-Fit Schools Free",
    metaDescription: "Take the free College Fit Quiz. Answer 10 questions about your academic profile, interests, and preferences. Get a personalized list of best-fit colleges ranked by compatibility.",
    keyword: "college fit assessment",
    volume: 590,
    h1: "College Fit Quiz: Find Schools That Actually Match You",
    heroSubheading: "Answer 10 questions about your stats, interests, and campus preferences. Get a ranked list of best-fit colleges based on real IPEDS data. Free, no signup required.",
    ctaText: "Take the College Fit Quiz",
    ctaHref: "/quiz",
    features: [
      "10-question fit assessment covering academics, social, financial, and geographic preferences",
      "Ranked college list with fit scores from 0-100",
      "Results based on IPEDS data and Common Data Set statistics",
      "Screenshot-able results for sharing with parents and counselors",
      "No signup or account required",
      "Works on mobile and desktop",
    ],
    faq: [
      { question: "How does the College Fit Quiz work?", answer: "You answer 10 questions about your GPA, test scores, intended major, campus size preference, location preference, and budget. The quiz matches your profile against real admissions data from 500+ colleges and ranks them by fit." },
      { question: "Is the College Fit Quiz free?", answer: "Yes. The quiz is completely free with no signup required. It is part of AdmitPath's free tool suite." },
      { question: "What data does the quiz use?", answer: "IPEDS College Navigator data and Common Data Set statistics from 500+ US colleges. All data is from official government and institutional sources." },
      { question: "Can I save my results?", answer: "You can screenshot your results or create a free AdmitPath account to save your college list and track your application progress." },
      { question: "How accurate is the fit score?", answer: "The fit score is based on real admissions data, not opinions. It factors in acceptance rates, test score ranges, net price by income band, and program availability. It is a strong starting point, not a guarantee of admission." },
    ],
    internalLinks: [
      "/quiz",
      "/calculator",
      "/college",
      "/guides/how-to-choose-college",
      "/guides/safety-match-reach",
      "/guides/how-many-colleges",
      "/college-list-builder",
      "/net-price",
    ],
  },
  {
    slug: "essay-brainstorm",
    name: "Essay Brainstorm Generator",
    shortName: "Essay Brainstorm",
    metaTitle: "Essay Brainstorm Generator -- 5 College Essay Angles Free",
    metaDescription: "Free essay brainstorm tool. Enter your background and interests. Get 5 unique college essay angles ranked by admissions value, with hook sentences and structure outlines.",
    keyword: "college essay brainstorming",
    volume: 1300,
    h1: "Essay Brainstorm Generator: Find Your Best College Essay Topic",
    heroSubheading: "Stop staring at a blank page. Answer a few reflection prompts and get 5 essay angle ideas ranked by uniqueness and admissions value. Free, instant results.",
    ctaText: "Start Brainstorming",
    ctaHref: "/college-essay-topic-finder",
    features: [
      "5 unique essay angle suggestions ranked by admissions value",
      "Hook sentence for each angle to get you started",
      "Structure outline for your top pick",
      "Based on patterns from effective college essays",
      "Works for Common App, Coalition App, and supplemental essays",
      "Free with no signup required",
    ],
    faq: [
      { question: "How does the Essay Brainstorm Generator work?", answer: "You answer a series of reflection prompts about your background, identity, struggles, growth, and interests. The AI analyzes your responses for patterns that would stand out in an admissions context and generates 5 distinct essay angles." },
      { question: "Will this tool write my essay for me?", answer: "No. It generates topic ideas, angles, and structural starting points. You write the actual essay. Admissions offices can detect AI-written essays, and generic AI essays hurt your application." },
      { question: "Is the brainstorm generator free?", answer: "Yes. The basic brainstorm tool is free. The full Common App Essay Brainstorm Worksheet with detailed prompts and PDF export is available on the Free plan." },
      { question: "Can I use this for supplemental essays?", answer: "Yes. The brainstorm angles work for any college essay prompt. For school-specific supplemental essay strategy, see the Supplemental Essay Strategist worksheet." },
      { question: "How many times can I use it?", answer: "Unlimited. Run the brainstorm as many times as you want with different inputs to explore different angles." },
    ],
    internalLinks: [
      "/college-essay-topic-finder",
      "/guides/how-to-write-college-essay",
      "/guides/college-essay-examples",
      "/guides/common-app-prompts-2026",
      "/guides/topics-to-avoid",
      "/guides/essay-hooks",
      "/guides/show-dont-tell",
      "/college-essay-topic-finder",
    ],
  },
  {
    slug: "activities-optimizer",
    name: "Activities List Optimizer",
    shortName: "Activities Optimizer",
    metaTitle: "Activities List Optimizer -- 150-Char Common App Compressor",
    metaDescription: "Free activities list optimizer. Paste your activity description, get a 150-character optimized version for the Common App. Verb-first format that admissions officers prefer.",
    keyword: "common app activities character limit",
    volume: 1900,
    h1: "Activities List Optimizer: Compress to 150 Characters",
    heroSubheading: "The Common App gives you 150 characters per activity. Paste your description and get an optimized version that leads with impact verbs and quantified results. Free tool.",
    ctaText: "Optimize Your Activities",
    ctaHref: "/analyze",
    features: [
      "Compresses any activity description to 150 characters",
      "Verb-first format preferred by admissions officers",
      "Extracts impact, scale, and outcomes automatically",
      "2 alternative angle suggestions for each activity",
      "Context tips for making each activity stand out",
      "Handles Common App 10-activity format",
    ],
    faq: [
      { question: "What is the Common App activities character limit?", answer: "Each activity description on the Common App is limited to 150 characters. The activity name has a separate 50-character limit. The position/leadership title has a 50-character limit." },
      { question: "How should I format my activities list?", answer: "Lead with an action verb. Quantify results when possible (numbers, percentages, dollar amounts). Show scope and impact. Cut filler words like 'helped to' or 'was responsible for.'" },
      { question: "How many activities should I list?", answer: "The Common App allows up to 10 activities. List as many as are meaningful. Quality matters more than quantity. 5-7 strong activities beat 10 weak ones." },
      { question: "What order should activities be in?", answer: "Most important first. The Common App lets you reorder activities. Put your spike activity or deepest commitment at position 1." },
      { question: "Can I include work experience?", answer: "Yes. Paid employment, family responsibilities, and community service all count. The Common App has a specific category for work." },
    ],
    internalLinks: [
      "/analyze",
      "/guides/activities-list-guide",
      "/guides/activities-character-limit",
      "/guides/spike-vs-well-rounded",
      "/guides/high-school-resume",
      "/analyze",
      "/profile/create",
      "/college-application-checklist",
    ],
  },
  {
    slug: "college-list-builder",
    name: "College List Builder",
    shortName: "List Builder",
    metaTitle: "College List Builder (2026) -- Build Your School List Free",
    metaDescription: "Free college list builder. Enter your GPA, scores, and preferences to get a balanced list of reach, match, and safety schools with fit scores. Data from 500+ colleges.",
    keyword: "college list builder",
    volume: 2400,
    h1: "College List Builder: Build a Balanced School List in 10 Minutes",
    heroSubheading: "Enter your stats and preferences. Get a balanced list of reach, match, and safety schools with fit scores, net price estimates, and application strategy. Free tool.",
    ctaText: "Build Your College List",
    ctaHref: "/college-list-builder",
    features: [
      "Balanced list across reach, match, and safety tiers",
      "Fit scores based on real IPEDS and CDS data",
      "Net price estimates by family income band",
      "Application strategy per school (ED, EA, or RD)",
      "Customizable by geography, size, major, and budget",
      "Free with no signup required",
    ],
    faq: [
      { question: "How many colleges should be on my list?", answer: "Most counselors recommend 8-15 schools: 2-4 reach, 4-6 match, and 2-3 safety. The exact number depends on your financial situation and risk tolerance." },
      { question: "What is a reach vs match vs safety school?", answer: "A reach school admits less than 25% of your profile tier. A match school admits 25-75% of your profile tier. A safety school admits 75%+ and you are above the median stats." },
      { question: "Does the list builder use real admissions data?", answer: "Yes. All data comes from IPEDS College Navigator, Common Data Set reports, and College Scorecard. These are official government and institutional sources." },
      { question: "Can I customize the list?", answer: "Yes. Filter by location, school size, public vs private, major availability, and budget. The full College List Generator worksheet provides deeper customization." },
      { question: "How accurate are the fit scores?", answer: "Fit scores are based on statistical comparison to admitted student profiles using CDS data. They are directionally accurate but not predictive of individual admission decisions." },
    ],
    internalLinks: [
      "/college-list-builder",
      "/calculator",
      "/quiz",
      "/college",
      "/guides/how-many-colleges",
      "/guides/safety-match-reach",
      "/guides/how-to-choose-college",
      "/net-price",
    ],
  },
  {
    slug: "net-price-calculator",
    name: "Net Price Calculator with IPEDS Data",
    shortName: "Net Price Calculator",
    metaTitle: "Net Price Calculator (2026) -- Real College Costs by Income",
    metaDescription: "Free net price calculator using real IPEDS data. See what 500+ colleges actually cost after aid for your family income band. Compare true 4-year costs before you apply.",
    keyword: "net price calculator",
    volume: 5400,
    h1: "Net Price Calculator: What College Actually Costs Your Family",
    heroSubheading: "Sticker price is not real price. Enter your family income band and see the actual cost of attendance at 500+ colleges using official IPEDS data. Free, no signup required.",
    ctaText: "Calculate Your Net Price",
    ctaHref: "/net-price",
    features: [
      "Real IPEDS net price data by family income quintile",
      "500+ colleges with verified cost-of-attendance figures",
      "True 4-year cost projection including tuition increases",
      "Side-by-side cost comparison across schools",
      "Financial aid likelihood estimate based on institutional data",
      "Free with no signup required",
    ],
    faq: [
      { question: "What is net price?", answer: "Net price is what you actually pay after grants and scholarships. The sticker price (published tuition + fees + room + board) is what the college advertises. Net price is what your family writes the check for. IPEDS reports net price by income band for every Title IV institution." },
      { question: "Where does this data come from?", answer: "All data comes from the IPEDS College Navigator (National Center for Education Statistics). Colleges are required to report net price by income quintile. This is official U.S. government data." },
      { question: "Is this the same as the college's net price calculator?", answer: "No. Each college's NPC asks detailed financial questions. Our tool uses aggregate IPEDS data to give you a quick comparison across 500+ schools before you invest time in individual NPCs." },
      { question: "Does net price include room and board?", answer: "Yes. IPEDS net price includes tuition, fees, room, board, books, and personal expenses minus all grant and scholarship aid. It represents the true out-of-pocket cost." },
      { question: "Can I compare multiple colleges?", answer: "Yes. The calculator lets you compare net prices across multiple colleges side by side. This is the most important comparison before building your college list." },
    ],
    internalLinks: [
      "/net-price",
      "/net-price",
      "/aid-comparison",
      "/resources/financial-aid",
      "/fafsa-checklist",
      "/appeal-letter",
      "/guides/how-to-choose-college",
      "/scholarships/bright-futures",
    ],
  },
];

export const TOOL_SLUGS = TOOLS_PAGES.map((t) => t.slug);

export function findTool(slug: string): ToolPage | undefined {
  return TOOLS_PAGES.find((t) => t.slug === slug);
}
