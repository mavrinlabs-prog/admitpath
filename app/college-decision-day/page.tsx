import Link from "next/link";
import type { Metadata } from "next";
import {
  CalendarCheck,
  DollarSign,
  Scale,
  PenLine,
  Users,
  Compass,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Decision Day — Choose, Negotiate, Commit",
  description:
    "May 1 decision framework: comparing offers, negotiating aid, the LOCI waitlist playbook, gap year considerations, and committing with confidence.",
  alternates: { canonical: `${BASE}/college-decision-day` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Decision Day — Choose, Negotiate, Commit",
    description: "May 1 decision framework: comparing offers, negotiating aid, LOCI playbook, and committing with confidence.",
    url: `${BASE}/college-decision-day`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=College+Decision+Day&subtitle=Compare+%C2%B7+negotiate+%C2%B7+commit`, width: 1200, height: 630, alt: "College Decision Day Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Decision Day — Choose, Negotiate, Commit", description: "May 1 decision framework: offers, aid negotiation, LOCI playbook.", images: [`${BASE}/api/og?title=College+Decision+Day&subtitle=Compare+%C2%B7+negotiate+%C2%B7+commit`] },
};

const COMPARISON_FACTORS = [
  { factor: "Real cost", weight: "Heavy", note: "Net cost after grants and scholarships only — not after loans. The single most important factor for most students." },
  { factor: "Academic fit (your major)", weight: "Heavy", note: "Strength of your specific department, course availability, faculty access, research opportunities. A top-tier school with a weak department in your major is worse than a mid-tier school with a strong one." },
  { factor: "Career outcomes for your field", weight: "Heavy", note: "First-job placement rates, alumni network strength in your field, geographic concentration of employers. Use the school's First Destinations report and LinkedIn alumni search by major + employer." },
  { factor: "Cultural fit", weight: "Medium", note: "Can you see yourself happy SOPHOMORE year? Pre-professional vs intellectual culture, urban vs rural, residential vs commuter. Visit if you can." },
  { factor: "Distance and family situation", weight: "Medium", note: "Travel cost, ability to come home for breaks, family circumstances that might require proximity." },
  { factor: "Honors college, scholars program, or special admit status", weight: "Medium", note: "Schreyer at Penn State, Barrett at ASU, Honors at Pitt, Park at NC State, Echols at UVA. These can offer Ivy-quality academics with significant aid." },
  { factor: "Brand prestige", weight: "Lighter than you think", note: "Real for first job at certain companies (consulting, finance, top tech). Decreasing in importance after 5 years out. Should not override real cost or major fit." },
  { factor: "Weather and geography", weight: "Light", note: "Real for some students (seasonal affective disorder, outdoor lifestyle). Don't over-index — most students adapt." },
];

const NEGOTIATION_GROUNDS = [
  "Job loss or significant income decrease since the FAFSA tax year — provide documentation (termination letter, recent paystubs).",
  "Major un-reimbursed medical expenses for any family member.",
  "Death or divorce in the family since FAFSA submission.",
  "A sibling now enrolled in a 4-year college (some schools recalculate parental contribution).",
  "Cost-of-living increase not reflected in formulaic aid calculations (e.g., recent regional inflation).",
  "Significantly different aid package from a comparable competing school (especially at private schools where you're a top-tier admit).",
];

const NEGOTIATION_STEPS = [
  "Write a 1-page letter to the financial aid office (NOT the admissions office). Address the financial aid director by name where possible.",
  "State your situation specifically: the school is your top choice, and you'd attend if the gap can be closed.",
  "Provide the specific number you need to close the gap (don't ask 'for more aid').",
  "Attach documentation: tax return changes, medical bills, the competing offer letter (if applicable).",
  "Send the letter at least 2-3 weeks before May 1. Offices process appeals throughout April; later requests get less attention.",
  "Follow up once if you haven't heard back in 10 business days. Don't badger.",
];

const WAITLIST_LOCI_GUIDE = [
  "Confirm in 1 sentence that the school is your first choice and you'd attend if admitted (don't lie — this is binding).",
  "Share 1-2 substantive updates from the past few months: a major award, a strong senior fall transcript, a new accomplishment, a significant project completed.",
  "Reference one specific reason you fit the school (a class, professor, program, or opportunity — same specificity as the original Why Us essay).",
  "Keep it 200-300 words. Anything longer reads as anxious.",
  "Send via the school's official waitlist portal or by email to the admissions office (NOT a regional rep).",
  "Send within 2-3 weeks of the waitlist offer; don't wait for May 1.",
];

const GAP_YEAR_CONSIDERATIONS = [
  "Gap year done WELL: substantive work (paid full-time, real internship, focused independent project) or a structured program (Americorps, NOLS, focused study abroad).",
  "Gap year done BADLY: living at home with no structure, working part-time retail, gaming, traveling without intention.",
  "Most schools accept deferrals for one year — apply now for May 1 commitment, then defer formally.",
  "Some schools (Princeton, Tufts, Harvard) have formal gap year programs that may pay for some experiences.",
  "Re-applying after a gap year (vs deferring) is a different path — you'll be a different applicant, and your acceptance may be revoked.",
  "Financial aid generally re-runs each year — your aid for the gap-year-deferred year may differ slightly from the original offer.",
];

const COMMITMENT_CHECKLIST = [
  "Submit your enrollment deposit by May 1 (or the school's stated deadline). Most are non-refundable.",
  "Submit only one enrollment deposit. Double-depositing is grounds for rescinded admission at most schools.",
  "Decline other admissions offers in writing. Be brief and gracious — frees up spots for waitlisted students.",
  "Submit the housing deposit by the school's deadline (often within 2-4 weeks of enrollment).",
  "Submit final transcript when senior year ends (school sends, but verify with your counselor).",
  "Submit any remaining financial aid documentation (verification, signed Master Promissory Notes for loans).",
  "Begin school-specific orientation steps: meningitis vaccine documentation, course registration, advising sign-up.",
];

const PAGE_FAQS = [
  { q: "What is National College Decision Day?", a: "May 1 is the National Candidate Reply Date, the deadline by which admitted students must commit to one school by submitting an enrollment deposit. Submitting deposits to multiple schools (double-depositing) is prohibited by most schools and can result in rescinded admission." },
  { q: "Can I negotiate my financial aid package?", a: "Yes. Financial aid offices have discretion to adjust packages based on documented circumstances: job loss, medical expenses, divorce, or competing offers from peer schools. Write a 1-page letter to the financial aid office (not admissions) with specific documentation. Submit at least 2-3 weeks before May 1." },
  { q: "What should I do if I'm on a waitlist?", a: "Submit a Letter of Continued Interest (LOCI) within 2-3 weeks of the waitlist offer. Keep it 200-300 words with 1-2 substantive updates. Commit to your best non-waitlist school by May 1. Most waitlists admit 0-10% of waitlisted students." },
  { q: "How do I compare financial aid offers from different schools?", a: "Calculate real cost for each school: Total Cost of Attendance minus grants and scholarships only. Loans and work-study are not free money. A school offering $45K in 'aid' that includes $15K in loans has a higher real cost than a school offering $35K in pure grants." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-decision-day#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College Decision Day", item: `${BASE}/college-decision-day` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-decision-day#page`,
      url: `${BASE}/college-decision-day`,
      name: "College Decision Day — Choose, Negotiate, Commit",
      description: "Decision-making framework for May 1: comparing offers, negotiating financial aid, the LOCI playbook for waitlists, gap year considerations, and committing without regret.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-decision-day#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/college-decision-day#howto`,
      name: "How to choose between college admissions offers — May 1 decision framework",
      description: "Six-step framework for comparing offers, negotiating aid, handling waitlists, and committing.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Calculate real cost for each school", text: "Real cost = Total Cost of Attendance − grants and scholarships only. Loans and work-study are not aid in the same sense." },
        { "@type": "HowToStep", position: 2, name: "Weigh academic fit and career outcomes", text: "Department strength in your specific major, faculty access, and First Destinations career outcomes for your field." },
        { "@type": "HowToStep", position: 3, name: "Compare cultural fit", text: "Can you see yourself happy sophomore year? Visit if you can; if not, talk to current students through the alumni network." },
        { "@type": "HowToStep", position: 4, name: "Negotiate aid if needed", text: "Need-based grounds (job loss, medical, divorce) or merit leverage (competing offer). 1-page letter to financial aid office, not admissions." },
        { "@type": "HowToStep", position: 5, name: "Handle waitlists", text: "Submit a 200-300 word LOCI within 2-3 weeks of waitlist offer. Specific updates only — no pleading." },
        { "@type": "HowToStep", position: 6, name: "Commit and follow through", text: "Submit one enrollment deposit by May 1. Decline other offers in writing. Complete housing, financial aid, and orientation steps." },
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

export default function CollegeDecisionDayPage() {
  return (
    <MarketingLayout
      eyebrow="May 1 Decision"
      title="College Decision Day"
      description="You have admissions offers. You have a deadline. Here's the honest framework for comparing them, the negotiation playbook when the package isn't enough, and the steps to commit without regret."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section title="1. Compare offers honestly" Icon={Scale}>
        <p className="mb-4 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Brand prestige is real but smaller than students think. The factors that actually shape your 4 years and your 10-year outcomes are below, ranked by weight.
        </p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <table className="w-full text-[13.5px]">
            <thead style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}>
              <tr>
                <th className="px-3 py-2 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Factor</th>
                <th className="px-3 py-2 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Weight</th>
                <th className="px-3 py-2 text-left font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Why</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FACTORS.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-3 py-2.5 align-top font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{row.factor}</td>
                  <td className="px-3 py-2.5 align-top whitespace-nowrap" style={{ color: "#4A6FA5" }}>{row.weight}</td>
                  <td className="px-3 py-2.5 align-top" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="2. Calculate real cost (not headline aid)" Icon={DollarSign}>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Most aid letters bundle grants, scholarships, work-study, and loans into a single &ldquo;total aid&rdquo; figure. That number is misleading. The real cost calculation is:
        </p>
        <div
          className="mb-4 rounded-xl p-4 text-[14.5px]"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p style={{ color: "var(--dl-text-primary, #1B2030)", fontWeight: 600 }}>Real cost = Total Cost of Attendance − Grants − Scholarships</p>
          <p style={{ color: "var(--dl-text-muted, #5A6275)", fontSize: 13, marginTop: 4 }}>
            Loans and work-study are NOT subtractive — loans must be repaid; work-study is a job, not aid in the same sense.
          </p>
        </div>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Example: School A offers $30K grants + $15K loans (=&ldquo;$45K aid&rdquo;). School B offers $35K grants + $0 loans (=&ldquo;$35K aid&rdquo;). School B is the better offer despite the lower headline total — your real cost is lower and you graduate without debt.
        </p>
      </Section>

      <Section title="3. Negotiate when the package isn't enough" Icon={PenLine}>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Financial aid offices DO negotiate. The grounds that work:
        </p>
        <ul className="mb-4 space-y-2">
          {NEGOTIATION_GROUNDS.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{g}</span>
            </li>
          ))}
        </ul>
        <h3 className="mb-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
          How to actually do it
        </h3>
        <ol className="space-y-2">
          {NEGOTIATION_STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="4. Handle the waitlist (LOCI playbook)" Icon={Users}>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          If you&apos;re on a waitlist for a school you&apos;d still choose, the Letter of Continued Interest is your move. It&apos;s 200-300 words, sent within 2-3 weeks of the waitlist offer, with substantive new information.
        </p>
        <ul className="space-y-2">
          {WAITLIST_LOCI_GUIDE.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13.5px]" style={{ color: "var(--dl-text-muted, #5A6275)", fontStyle: "italic" }}>
          Reality check: most waitlists admit 0-10% of waitlisted students; some admit 0%. Submit a deposit at your best non-waitlist school by May 1 (you&apos;ll lose it if pulled off the waitlist, but that&apos;s the cost of the option).
        </p>
      </Section>

      <Section title="5. Consider a gap year (carefully)" Icon={Compass}>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          A well-structured gap year can be the highest-leverage year of your young adulthood. A passive gap year is a lost year.
        </p>
        <ul className="space-y-2">
          {GAP_YEAR_CONSIDERATIONS.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="6. Commit and follow through" Icon={CalendarCheck}>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          The decision is made. Now execute the commitment cleanly.
        </p>
        <ol className="space-y-2">
          {COMMITMENT_CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item}</span>
            </li>
          ))}
        </ol>
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
        headline="Compare your offers in one place."
        description="Side-by-side comparison of net cost, academic fit, and outcomes for the schools you've been admitted to. Free plan included. Pro $19.99/mo."
        buttonText="Compare admits"
      />

      {/* Related links */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/net-price"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Net price estimator
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Family income → estimated real cost at 24 top colleges.
          </div>
        </Link>
        <Link
          href="/compare"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Compare colleges
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Side-by-side: acceptance rate, SAT, GPA, type, location.
          </div>
        </Link>
        <Link
          href="/net-price"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            40-year ROI calculator
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Long-term financial return: net cost, major, cash-vs-loan split.
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
      </nav>
    </MarketingLayout>
  );
}
