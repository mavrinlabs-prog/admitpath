import Link from "next/link";
import type { Metadata } from "next";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Application Timeline 2026 | Dates",
  description:
    "Complete month-by-month college application timeline from sophomore spring through senior spring. Per-month actions, deadlines, priorities, and what to skip.",
  alternates: { canonical: `${BASE}/college-application-timeline-2026` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Application Timeline 2026",
    description:
      "Complete month-by-month college application timeline from sophomore spring through senior spring. Per-month actions, deadlines, priorities, and what to skip.",
    url: `${BASE}/college-application-timeline-2026`,
    type: "website",
    images: [{
      url: `${BASE}/api/og?title=Application+Timeline+2026&subtitle=Month-by-month+guide`,
      width: 1200,
      height: 630,
      alt: "AdmitPath Application Timeline 2026 — month-by-month guide",
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Application Timeline 2026", description: "Month-by-month timeline from sophomore spring through senior spring.", images: [`${BASE}/api/og?title=Application+Timeline+2026&subtitle=Month-by-month+guide`] },
};

const TIMELINE = [
  {
    period: "Sophomore Spring (March–May)",
    actions: [
      "Begin exploring interests — what subjects excite you?",
      "Take PSAT as practice if your school offers it.",
      "Start building depth in 1-2 activities (future spike).",
      "Research summer programs for the coming summer.",
      "Begin reading about college admissions process (general understanding).",
    ],
    priority: "Exploration. No commitments needed yet.",
  },
  {
    period: "Sophomore Summer (June–August)",
    actions: [
      "Engage in substantive summer activity (program, job, project, volunteering).",
      "Read widely in areas of interest.",
      "If possible, visit 2-3 colleges informally to get a sense of campus types.",
      "Begin thinking about standardized testing strategy (SAT vs ACT).",
    ],
    priority: "Build experiences. Don't stress about applications yet.",
  },
  {
    period: "Junior Fall (September–November)",
    actions: [
      "Take rigorous courses — junior year grades are the most-weighted.",
      "Take PSAT/NMSQT in October (National Merit qualifier).",
      "Deepen extracurricular engagement — aim for leadership and tangible impact.",
      "Take SAT/ACT diagnostic to determine which test fits.",
      "Begin standardized test prep.",
      "Apply to competitive summer programs (RSI, MITES, TASP — deadlines October–December).",
      "Begin self-reflection: what do you want from college?",
    ],
    priority: "Academic rigor + test prep + activity depth.",
  },
  {
    period: "Junior Winter (December–February)",
    actions: [
      "Continue test prep.",
      "Apply to remaining summer programs.",
      "Begin researching colleges — read CDS reports for 20-30 schools.",
      "Identify potential recommenders (teachers you have strong relationships with).",
      "Build initial school list of 30-50 schools (broad exploration).",
      "Attend local college fairs if available.",
    ],
    priority: "Research + test prep + recommender relationships.",
  },
  {
    period: "Junior Spring (March–May)",
    actions: [
      "Take SAT or ACT (first official attempt).",
      "Narrow school list from 30-50 to 15-25.",
      "Visit colleges during spring break if possible.",
      "Ask recommenders by late spring (give 4-6 weeks notice).",
      "Provide brag sheets to recommenders.",
      "Begin brainstorming personal statement topics (free-write, don't draft yet).",
      "Meet with school counselor about senior year course selection.",
      "Register for AP exams.",
    ],
    priority: "Testing + school list refinement + recommender setup.",
  },
  {
    period: "Junior Summer (June–August) — CRITICAL",
    actions: [
      "Engage in highest-impact summer experience (research, internship, program, project).",
      "Retake SAT/ACT if needed (summer test dates).",
      "Draft personal statement (aim for 2-3 drafts before senior year).",
      "Research 'why us' supplements for top 5-10 schools.",
      "Finalize school list to 12-18 schools.",
      "Apply 4-band probability framework (Hard Reach / Reach / Target / Likely).",
      "Begin Common App activities section.",
      "If applying ED: confirm school choice, run Net Price Calculator, verify financial fit.",
      "Update activities list with junior year accomplishments.",
    ],
    priority: "Production summer. Draft essays. Finalize strategy.",
  },
  {
    period: "Senior Fall — September",
    actions: [
      "Finalize school list (12-18 schools).",
      "Complete Common App core sections.",
      "Revise personal statement (aim for final or near-final version).",
      "Begin ED/EA supplements.",
      "Confirm recommenders have everything they need.",
      "Request transcripts from school.",
      "Verify test score reports sent to all schools.",
      "Take senior year courses at full rigor.",
    ],
    priority: "ED/EA applications. Organization. Quality.",
  },
  {
    period: "Senior Fall — October",
    actions: [
      "Complete ED application by October 20 (10-day buffer before Nov 1).",
      "Complete EA applications by October 25.",
      "Follow up with recommenders on submission status.",
      "Begin RD supplement research and drafting.",
      "Continue strong academic performance.",
      "Take SAT/ACT retake if needed (October test date).",
    ],
    priority: "Submit early applications with quality.",
  },
  {
    period: "Senior Fall — November",
    actions: [
      "Submit ED and EA applications by deadlines (November 1-15).",
      "Begin drafting RD supplements (3-4 per week).",
      "Prepare FAFSA materials (opens December 1).",
      "Complete CSS Profile for schools requiring it.",
      "Continue strong academic performance.",
    ],
    priority: "Early apps submitted. Shift to RD + financial aid.",
  },
  {
    period: "Senior Fall — December",
    actions: [
      "Submit FAFSA first week of December.",
      "Complete and submit CSS Profile by school-specific deadlines.",
      "Complete remaining RD supplements.",
      "Review all RD applications before submission.",
      "Submit RD applications by December 20-25 (buffer before Jan 1).",
      "ED decisions arrive mid-December — adjust strategy if deferred or rejected.",
      "If deferred from ED: write LOCI within 1-2 weeks. Reconfigure RD list.",
      "If admitted ED: withdraw all other applications. Celebrate.",
    ],
    priority: "Financial aid + RD submission + ED decisions.",
  },
  {
    period: "Senior Spring — January",
    actions: [
      "Submit any remaining January 15 deadline applications.",
      "Verify all applications are complete (check portals).",
      "Apply for scholarships with January-February deadlines.",
      "Mid-year report sent by counselor (January-February).",
      "Continue strong academic performance (senior grades still matter).",
      "If considering ED2: submit by January 1-15 deadline.",
    ],
    priority: "Final submissions. Financial aid. Maintain grades.",
  },
  {
    period: "Senior Spring — February–March",
    actions: [
      "Wait for decisions (most arrive late March - early April).",
      "Continue strong academic performance.",
      "Apply for remaining scholarships.",
      "Prepare for potential waitlist decisions (research LOCI framework).",
      "Begin thinking about decision framework if multiple admits.",
      "Limit portal-checking anxiety (set daily check time).",
    ],
    priority: "Waiting period. Maintain grades. Manage anxiety.",
  },
  {
    period: "Senior Spring — April",
    actions: [
      "Decisions arrive. Process each one.",
      "Compare financial aid packages across admits (real cost = COA - grants - scholarships).",
      "Visit admitted student events at top 2-3 choices.",
      "Talk to current students at finalist schools.",
      "Negotiate financial aid if competing offers exist.",
      "If waitlisted: submit LOCI within 1-2 weeks. Commit to backup by May 1.",
      "Make final decision by May 1.",
    ],
    priority: "Decision-making. Financial comparison. Visits.",
  },
  {
    period: "Senior Spring — May 1 and Beyond",
    actions: [
      "Commit to your school by May 1 (National Candidate Reply Date).",
      "Pay enrollment deposit.",
      "Decline other admits (professional).",
      "Send thank-you notes to recommenders.",
      "Update counselor on your decision.",
      "Complete housing forms, orientation registration, course pre-registration.",
      "If on waitlist: continue pursuing if genuine top choice. Move on emotionally.",
      "Maintain academic performance through graduation (Final Report matters).",
    ],
    priority: "Commitment. Transition planning. Gratitude.",
  },
];

const COMMON_TIMELINE_MISTAKES = [
  "Starting too late — rushing senior fall when junior year prep would have helped.",
  "Not asking recommenders early enough — late requests produce weaker letters.",
  "Waiting until November to start supplements — quality suffers under deadline pressure.",
  "Not filing FAFSA/CSS on time — missing financial aid deadlines loses money.",
  "Neglecting senior year grades — schools see final transcript; rescindment is real.",
  "Not visiting admitted student events — the best way to make final decisions.",
  "Comparing to peers' timelines — different students, different paces.",
  "Over-planning sophomore year — exploration matters more than optimization at that stage.",
];

const PAGE_FAQS = [
  { q: "When should I start preparing for college?", a: "Informally in 9th grade with strong grades and activity exploration. Structured preparation begins junior year with testing, the college list, and recommender setup. The summer before senior year is the critical essay-writing window." },
  { q: "What's the most important month for college applications?", a: "October of senior year. ED/EA deadlines are November 1, so October is when essays must be finalized, recommendations confirmed, and applications submitted with a buffer." },
  { q: "Is it too late to start junior spring?", a: "No. Junior spring is actually the ideal time to take the SAT/ACT for the first time, narrow your school list, and ask recommenders. You're right on schedule." },
  { q: "When should I file the FAFSA?", a: "As soon as it opens (October 1 in most years, December in some). Many state grants and institutional aid are first-come-first-served. Late FAFSA submissions can mean less aid." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-application-timeline-2026#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Application Timeline 2026", item: `${BASE}/college-application-timeline-2026` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-application-timeline-2026#page`,
      url: `${BASE}/college-application-timeline-2026`,
      name: "College Application Timeline 2026 — Month-by-Month Guide",
      description: "Complete month-by-month college application timeline from sophomore spring through senior spring.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-application-timeline-2026#breadcrumb` },
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

export default function CollegeApplicationTimeline2026Page() {
  return (
    <MarketingLayout
      eyebrow="Timeline"
      title="College Application Timeline 2026"
      description="Month-by-month guide from sophomore spring through commitment day. Each period has specific actions, priorities, and what to focus on. Use this as your master calendar — adjust timing to your specific situation."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-4">
        {TIMELINE.map((t) => (
          <article
            key={t.period}
            className="dl-card-hover rounded-xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5" style={{ color: "#4A6FA5" }} />
              <h2 className="text-[16px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
                {t.period}
              </h2>
            </div>
            <ul className="mb-2.5 space-y-1.5">
              {t.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{a}</span>
                </li>
              ))}
            </ul>
            <p className="text-[12.5px] font-medium" style={{ color: "#4A6FA5" }}>
              Priority: {t.priority}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-12 mb-12">
        <h2
          className="mb-2 flex items-center gap-2 text-[22px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          <AlertCircle className="h-5 w-5" style={{ color: "#4A6FA5" }} />
          Common timeline mistakes
        </h2>
        <ul className="space-y-2">
          {COMMON_TIMELINE_MISTAKES.map((m, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-12 mb-12">
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
        headline="Stay on track with calibrated timeline."
        description="AdmitPath helps you track your application timeline with per-school deadline management and strategic planning. Free plan included. Pro $19.99/mo."
        buttonText="Plan your timeline"
      />

      {/* Related links */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
        <Link
          href="/college-application-checklist"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Application Checklist
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            80+ items across 7 categories.
          </div>
        </Link>
        <Link
          href="/deadlines"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Application Deadlines
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            ED, EA, REA, RD dates for 50 top schools.
          </div>
        </Link>
        <Link
          href="/fafsa-checklist"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            FAFSA Checklist
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            7-step interactive FAFSA filing guide.
          </div>
        </Link>
        <Link
          href="/college-list-builder"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            College List Builder
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The 4-band probability framework.
          </div>
        </Link>
      </nav>
    </MarketingLayout>
  );
}
