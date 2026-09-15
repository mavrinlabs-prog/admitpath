import Link from "next/link";
import type { Metadata } from "next";
import {
  CheckSquare,
  FileText,
  Users,
  GraduationCap,
  DollarSign,
  Send,
  ShieldCheck,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Application Checklist 2026 | Free",
  description:
    "Complete college application checklist for 2026-2027: deadlines, documents, essays, rec letters, and financial aid steps. Download free.",
  alternates: { canonical: `${BASE}/college-application-checklist` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Application Checklist — 80+ Items",
    description: "Complete checklist: documents, accounts, recommenders, essays, financial aid, and submission steps.",
    url: `${BASE}/college-application-checklist`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Application+Checklist&subtitle=80%2B+items+across+7+categories`, width: 1200, height: 630, alt: "College Application Checklist" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Application Checklist — 80+ Items", description: "Complete checklist: documents, essays, financial aid, and submission.", images: [`${BASE}/api/og?title=Application+Checklist&subtitle=80%2B+items+across+7+categories`] },
};

const ACCOUNTS_AND_DOCUMENTS = [
  "Create a Common App account (commonapp.org) — use a personal email you'll keep after high school.",
  "Create a Coalition App account if any of your schools require or prefer it.",
  "Create College Board account (for SAT, AP scores, CSS Profile).",
  "Create ACT.org account if taking the ACT.",
  "Create FAFSA account at studentaid.gov (parent and student each need their own login).",
  "Create CSS Profile account (subset of schools — check school list).",
  "Request your official high school transcript through your counselor.",
  "Save digital copies of: birth certificate, social security card, parents' tax returns (most recent two years), W-2 forms, untaxed income records.",
  "Compile activities list with role, hours/week, weeks/year for each activity going back to grade 9. (AdmitPath's profile tool scores these across 7 dimensions.)",
  "Compile awards list with date received, level (school/regional/national/international), and selectivity. (National/international awards score highest in AdmitPath's Awards dimension.)",
  "Compile a 'brag sheet' for your counselor with key accomplishments, intended major, dream schools, and what you'd want them to highlight.",
];

const TESTING = [
  "Check each school's test policy -- Yale, Brown, Cornell, Dartmouth, MIT, Caltech now REQUIRE scores. Others remain test-optional. Decide per school.",
  "Take SAT/ACT once junior spring; retake once junior summer or senior fall if needed.",
  "Send official scores via the testing agency to each school you're applying to (this is the only way they're 'official').",
  "If sending AP scores, decide which to send (only send 4s and 5s; the College Board's auto-send sends ALL scores).",
  "If submitting subject-test alternatives (some international schools), confirm requirements per school.",
  "If you're an international applicant, take TOEFL/IELTS/Duolingo if required and send scores.",
];

const RECOMMENDERS = [
  "Identify two academic teachers (preferably junior year, in core subjects).",
  "Identify your school counselor — every Common App application requires their letter.",
  "Ask each recommender in person at end of junior year, or first week of senior year. Don't wait.",
  "Provide each recommender a brag sheet, your resume, and the schools you're applying to.",
  "Add recommenders to your Common App account and assign them to each school.",
  "Confirm with each recommender that they've submitted before the school's deadline.",
  "Send a thank-you note within a week of submission. Send another after decisions arrive.",
];

const COMMON_APP = [
  "Profile section: full legal name, address, demographic info, language proficiency.",
  "Family section: parents' names, occupations, education, sibling info.",
  "Education section: high school name, GPA, class rank if reported, course list.",
  "Testing section: SAT/ACT scores (or 'will not submit' for test-optional schools), AP scores.",
  "Activities list: 10 slots maximum. Use them all if you can; describe with action verbs.",
  "Honors section: 5 slots maximum. Most prestigious to least prestigious.",
  "Personal essay (650 words max) — start drafting summer before senior year.",
  "Additional Information section (650 words max, optional) — only use if there's substantive context.",
  "Common App Activities short answer (150 words) about your most meaningful activity.",
  "Disciplinary history disclosure (truthful — schools verify).",
  "Criminal history disclosure (some schools no longer ask; check your state).",
];

const SUPPLEMENTS_AND_ESSAYS = [
  "Read each school's supplemental essay prompts carefully — pay attention to word limits.",
  "Cluster schools with similar prompts (e.g., 'why us' essays) to reuse research efficiently.",
  "Draft each essay 6-8 weeks before the deadline. Use the AdmitPath essay scorer (/sign-up) for 6-dimension feedback.",
  "Get one round of substantive feedback (counselor, teacher, family member, or AdmitPath's AI essay feedback).",
  "Revise based on feedback — don't just accept all suggestions.",
  "Final read for typos, formatting, word limits.",
  "Save final essays in one folder, labeled by school + prompt.",
  "Don't submit until you've read each essay aloud at least once — catches awkward phrasing.",
];

const FINANCIAL_AID = [
  "FAFSA opens October 1 (or December for the simplified FAFSA in some years). File ASAP after opening.",
  "CSS Profile opens October 1 — required at ~250 schools (mostly private).",
  "Fee waivers: request from College Board / ACT / Common App if eligible (usually free/reduced lunch qualifies).",
  "Apply for outside scholarships (state and local — your high school's college office often has a list).",
  "Submit financial aid forms by each school's priority deadline (often earlier than the application deadline).",
  "Compare aid packages once admitted — net cost varies dramatically across schools.",
  "Negotiate aid: if your top choice has a worse package than a comparable school, write the financial aid office.",
];

const FINAL_SUBMISSION = [
  "Confirm Common App or Coalition App fee waiver applied (if eligible).",
  "Submit early decision/early action applications by November 1 (or November 15 for some schools).",
  "Check 'application status' portal for each school after submission to confirm receipt.",
  "Confirm transcript, recommendations, and test scores have all been received (this is on YOU, not the school).",
  "Submit regular decision applications by January 1 (or earlier — many are December 1).",
  "Submit mid-year report when first-semester senior grades come in (counselor handles).",
  "Wait. Don't email asking 'when will I hear back?' — schools have stated dates.",
  "When admitted: review aid package, compare options, make a decision by May 1.",
  "When deferred or waitlisted: write a Letter of Continued Interest (1-2 paragraphs).",
  "Submit final transcript to your chosen school by July 1.",
  "Decline other admissions offers in writing — short, gracious note. Frees up spots for waitlisted students.",
];

const COMMON_MISTAKES = [
  "Asking for recommendations in October of senior year — too late, teachers are overwhelmed.",
  "Submitting only 4-6 schools — too few; assemble a balanced list of 8-12.",
  "Treating all schools as 'reaches' or 'safeties' — assemble 4 bands of probability.",
  "Forgetting the supplemental essays exist until the deadline — they take real time.",
  "Not checking the application portal after submission for missing items.",
  "Skipping the financial aid forms because 'we're middle class' — many private schools meet 100% need for families up to $250K+.",
  "Not reading the FAQ on each school's admissions site — many specific questions are answered there.",
  "Submitting without proofreading — schools judge based on what's submitted.",
];

const PAGE_FAQS = [
  { q: "When should I start applying to college?", a: "Start preparing the summer before senior year. Create accounts (Common App, College Board, FAFSA) in August. Ask recommenders by end of junior year or first week of senior year. Draft your personal statement over the summer. Early Decision and Early Action deadlines are typically November 1." },
  { q: "How many colleges should I apply to?", a: "8-12 is the sweet spot for most students. Below 6 is statistically risky. Above 15 means each supplemental essay gets less attention. Distribute across probability bands: 2-3 safeties, 3-5 targets, 2-3 reaches." },
  { q: "What documents do I need for college applications?", a: "Official high school transcript (through your counselor), SAT/ACT scores (sent through the testing agency), two teacher recommendation letters, counselor letter, parents' tax returns and W-2s (for financial aid), and your activities list with hours and roles." },
  { q: "When is the FAFSA deadline?", a: "The FAFSA opens October 1 (some years December due to form updates). File as soon as possible after opening. Each school has its own priority financial aid deadline, which is often earlier than the application deadline. Late FAFSA submissions can mean less aid." },
  { q: "Do I need to fill out the CSS Profile?", a: "Only if your target schools require it — roughly 250 schools (mostly private) use the CSS Profile in addition to the FAFSA. The CSS Profile is more detailed and captures assets the FAFSA does not. Check each school's financial aid page for requirements." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-application-checklist#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College Application Checklist", item: `${BASE}/college-application-checklist` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-application-checklist#page`,
      url: `${BASE}/college-application-checklist`,
      name: "College Application Checklist — 80+ Items, Sourced & Organized",
      description: "Complete college application checklist with documents to gather, accounts to create, recommenders to ask, essays to draft, financial aid forms, and final submission steps.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-application-checklist#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/college-application-checklist#howto`,
      name: "How to complete a college application — step by step",
      description: "Seven categories of tasks needed to apply to college, in the order you should complete them.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Set up accounts and gather documents", text: "Create Common App, FAFSA, College Board, and ACT accounts. Gather transcripts, tax returns, activity records, and award documentation." },
        { "@type": "HowToStep", position: 2, name: "Complete testing", text: "Take or skip SAT/ACT per each school's test-optional policy. Send official scores through the testing agency." },
        { "@type": "HowToStep", position: 3, name: "Secure recommendations", text: "Ask 2-3 recommenders end of junior year or first week of senior year. Provide each a brag sheet and resume." },
        { "@type": "HowToStep", position: 4, name: "Complete the Common Application", text: "Profile, family, education, testing, activities (10 slots), honors (5 slots), personal essay (650 words), and disclosures." },
        { "@type": "HowToStep", position: 5, name: "Write supplemental essays", text: "Draft each supplement 6-8 weeks before the deadline. Cluster similar prompts to reuse research efficiently." },
        { "@type": "HowToStep", position: 6, name: "Submit financial aid forms", text: "FAFSA and CSS Profile open October 1. Submit by each school's priority deadline." },
        { "@type": "HowToStep", position: 7, name: "Submit, track, and decide", text: "Submit by deadline. Confirm receipt. Wait. When admitted, compare aid packages and decide by May 1." },
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

function ChecklistSection({
  title,
  Icon,
  items,
  description,
}: {
  title: string;
  Icon: typeof CheckSquare;
  items: string[];
  description?: string;
}) {
  return (
    <Section title={title} Icon={Icon} description={description}>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
            <CheckSquare className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
            <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default function CollegeApplicationChecklistPage() {
  const totalItems =
    ACCOUNTS_AND_DOCUMENTS.length +
    TESTING.length +
    RECOMMENDERS.length +
    COMMON_APP.length +
    SUPPLEMENTS_AND_ESSAYS.length +
    FINANCIAL_AID.length +
    FINAL_SUBMISSION.length;

  return (
    <MarketingLayout
      eyebrow="Application Reference"
      title="College Application Checklist"
      description={`Every task it takes to apply to college, in the order you should do them. ${totalItems}+ items across 7 categories — accounts, documents, testing, recommendations, the Common App, supplemental essays, financial aid, and final submission.`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ChecklistSection
        title="1. Accounts & documents"
        Icon={FileText}
        items={ACCOUNTS_AND_DOCUMENTS}
        description="The infrastructure of an application — accounts to create, files to gather, lists to compile. Get this done before October of senior year."
      />

      <ChecklistSection
        title="2. Testing"
        Icon={GraduationCap}
        items={TESTING}
        description="Test policies are shifting: Yale, Brown, Cornell, Dartmouth, MIT, and Caltech now require scores. Many others remain test-optional. Check each school. If submitting, send through the testing agency — not by uploading a screenshot."
      />

      <ChecklistSection
        title="3. Recommendations"
        Icon={Users}
        items={RECOMMENDERS}
        description="Your two teachers and your counselor each write a separate letter. Ask in person, ask early, and follow up with a thank-you. Each letter takes them 4-8 hours."
      />

      <ChecklistSection
        title="4. Common Application"
        Icon={FileText}
        items={COMMON_APP}
        description="Once submitted to one school, the Common App is reused across all your Common App schools. Get this done by mid-October so you can focus on supplements."
      />

      <ChecklistSection
        title="5. Supplemental essays"
        Icon={FileText}
        items={SUPPLEMENTS_AND_ESSAYS}
        description="Most schools require 1-4 additional essays. Read prompts carefully — wrong word counts and missed prompts are common reasons for rejection at otherwise strong applications."
      />

      <ChecklistSection
        title="6. Financial aid"
        Icon={DollarSign}
        items={FINANCIAL_AID}
        description="The form most likely to be missed. The FAFSA opens October 1 (some years December). Many private schools meet 100% need for families earning up to $250K+ — file even if you think you won't qualify."
      />

      <ChecklistSection
        title="7. Submission & post-submission"
        Icon={Send}
        items={FINAL_SUBMISSION}
        description="The application is submitted. Now confirm receipt, track decisions, compare aid packages, and decide by May 1. Don't email schools asking when you'll hear back."
      />

      {/* Common mistakes */}
      <section className="mb-12 rounded-2xl border p-6" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}>
        <h2
          className="mb-3 flex items-center gap-2 text-[22px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          <ShieldCheck className="h-5 w-5" style={{ color: "#4A6FA5" }} />
          Common mistakes that cost admissions
        </h2>
        <ul className="space-y-2.5">
          {COMMON_MISTAKES.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
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
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2
          className="mb-5 text-[22px] font-semibold"
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

      <MarketingCTA
        headline="AdmitPath tracks all of this for you."
        description="Personalized application checklist by school, deadline tracking, essay drafts in one place, real-time reminders. Free plan included. Pro $19.99/mo."
        buttonText="Build my checklist"
      />

      {/* Related links */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/timeline"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Application timeline
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Month-by-month, freshman through senior spring.
          </div>
        </Link>
        <Link
          href="/deadlines"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Application deadlines
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            ED, EA, REA, RD dates for 50 top schools.
          </div>
        </Link>
        <Link
          href="/resources/financial-aid"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Financial aid guide
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            FAFSA, CSS Profile, merit aid, and the timeline that maximizes your award.
          </div>
        </Link>
        <Link
          href="/college-list-builder"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            College list builder
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The 4-band probability framework for a balanced list.
          </div>
        </Link>
      </nav>
    </MarketingLayout>
  );
}
