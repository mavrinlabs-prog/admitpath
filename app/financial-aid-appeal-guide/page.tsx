import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Financial Aid Appeal Guide — 6 Grounds",
  description:
    "Financial aid appeal guide: 6 valid grounds schools accept, the appeal letter framework, what schools budge on, and next steps.",
  alternates: { canonical: `${BASE}/financial-aid-appeal-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Financial Aid Appeal Guide",
    description:
      "Financial aid appeal guide: 6 valid grounds, the appeal letter framework, and what schools will budge on.",
    url: `${BASE}/financial-aid-appeal-guide`,
    type: "website",
    images: [{
      url: `${BASE}/api/og?title=Financial+Aid+Appeal+Guide&subtitle=6+grounds+%C2%B7+7-step+letter+framework`,
      width: 1200,
      height: 630,
      alt: "AdmitPath Financial Aid Appeal Guide — 6 grounds and 7-step letter framework",
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Financial Aid Appeal Guide", description: "6 valid grounds, the appeal letter framework, and what schools will budge on.", images: [`${BASE}/api/og?title=Financial+Aid+Appeal+Guide&subtitle=6+grounds+%C2%B7+7-step+letter+framework`] },
};

const APPEAL_GROUNDS = [
  {
    ground: "Significant income change since the FAFSA",
    desc: "Job loss, salary reduction, business failure, or medical disability since the income year reported on FAFSA. The most successful appeal ground.",
    docs: "Layoff letter, recent pay stubs showing reduced income, unemployment claim documentation, or employer letter confirming hours/salary reduction.",
    success: "High — schools regularly grant Professional Judgment adjustments based on documented income changes.",
  },
  {
    ground: "Major unreimbursed medical expenses",
    desc: "Medical bills not covered by insurance, ongoing medical care for self or family member, or recent significant medical expenses (surgery, hospitalization, chronic illness treatment).",
    docs: "Medical bills, EOB statements showing what insurance covered, ongoing prescription costs, expected future medical costs.",
    success: "High when expenses are documented and substantial (>$5K-10K depending on family size).",
  },
  {
    ground: "Special family circumstances",
    desc: "Recent divorce, death of a parent, family member with disability requiring care, or unusual family responsibilities (caring for elderly relative, supporting siblings).",
    docs: "Divorce decree, death certificate, disability documentation, or letter explaining the family situation.",
    success: "Moderate to high depending on documentation and how recent.",
  },
  {
    ground: "Competing offers from peer schools",
    desc: "You received a stronger aid package from a comparable school. Some schools will negotiate; others won't. Schools that meet 100% of demonstrated need rarely budge on need-based offers; merit-aid schools more likely to negotiate.",
    docs: "Copy of the competing aid letter showing the difference, ideally accompanied by reasoning why this school remains your preference.",
    success: "Variable — Vanderbilt, Notre Dame, Tufts often negotiate; Stanford, Harvard, Princeton rarely do because of policy.",
  },
  {
    ground: "Error or missing information",
    desc: "Your FAFSA or CSS has an error: misreported income, missed asset, family size discrepancy, or recently corrected tax information. Easiest appeals to win because they're factual.",
    docs: "Corrected tax returns, updated FAFSA filing, or written explanation of the error with supporting documentation.",
    success: "Very high — schools will recalculate based on corrected information.",
  },
  {
    ground: "Multiple students in college simultaneously",
    desc: "FAFSA used to discount EFC for siblings in college; SAI no longer does. If you have siblings now in college and a school's policy still considers it, surface it. Some schools (especially those using CSS Profile) still consider this.",
    docs: "Sibling enrollment documentation, financial aid statements from sibling's school.",
    success: "Variable depending on school's specific policy.",
  },
];

const APPEAL_LETTER_FRAMEWORK = [
  {
    step: "1. Open with clarity",
    detail: "Subject line: 'Financial Aid Appeal — [Your Name], Student ID [#]'. Open with: 'I am writing to request a reconsideration of my financial aid package. Specifically, [the change you're requesting].'",
  },
  {
    step: "2. State the specific circumstance",
    detail: "One paragraph explaining what changed or what should be reconsidered. Use specific numbers, dates, and facts. 'My father lost his job at [Company] in March 2026. Documentation attached.' Specifics get results.",
  },
  {
    step: "3. Quantify the financial impact",
    detail: "How much income has been lost? What new expenses do you face? Show the math. 'Family income dropped from $95K to $40K — a 58% reduction. Net change to college affordability: ~$25,000 less per year.'",
  },
  {
    step: "4. Reference what you'd like the school to consider",
    detail: "Ask specifically. 'I am requesting that the school re-evaluate my Expected Family Contribution given the documented income change' or 'I am asking the school to consider matching the institutional aid offered by [Peer School].' Be specific.",
  },
  {
    step: "5. Demonstrate continued commitment to the school",
    detail: "Reaffirm that this remains your top choice and that you'd attend if the aid is sufficient. Schools want to know they're investing aid in students who'll matriculate and thrive.",
  },
  {
    step: "6. Attach documentation",
    detail: "Tax returns, layoff letters, medical bills, divorce decrees, sibling enrollment letters, peer school aid offers. Documentation is the difference between a successful appeal and a denied one.",
  },
  {
    step: "7. Sign and follow up",
    detail: "Sign formally. Provide your contact information. Mention you're available to provide additional documentation. Send via the school's official appeal portal or email to financial aid office (not admissions). Confirm receipt within 1 week.",
  },
];

const WHAT_SCHOOLS_WILL = [
  "Recalculate EFC/SAI based on documented income changes since FAFSA filing",
  "Apply Professional Judgment for documented unusual circumstances (medical, family death, disability)",
  "Correct factual errors in your FAFSA or CSS submission",
  "Increase need-based aid up to the full demonstrated need at meets-100% schools",
  "Reconsider merit aid based on competing offers (at some schools)",
  "Increase grants vs loans in the package (at some schools, when justified)",
];

const WHAT_SCHOOLS_WONT = [
  "Match every competing offer (especially at meets-100%-need schools where the formula is fixed)",
  "Increase aid based on emotional appeal or 'we really need help' alone",
  "Adjust for lifestyle expenses (cars, vacations, large mortgages they consider non-essential)",
  "Override federal aid limits (Pell Grant max, Direct Loan max)",
  "Issue aid based on academic merit alone (merit aid is administered separately)",
  "Re-evaluate without documentation, no matter how compelling the story",
  "Always respond quickly during peak appeal seasons (mid-Jan through early April)",
];

const TIMELINE = [
  { phase: "Submit appeal", time: "Within 2 weeks of receiving award letter (or as soon as the documentation is ready)" },
  { phase: "Confirm receipt", time: "Within 1 week — email the office to verify they have your appeal" },
  { phase: "School responds", time: "2-6 weeks typically; longer during peak season (Jan-April)" },
  { phase: "Provide additional documentation if requested", time: "Within 1 week of request" },
  { phase: "Final decision", time: "Generally before May 1 deposit deadline if appeal submitted by mid-April" },
  { phase: "Follow-up if no response", time: "After 4 weeks, follow up politely. After 6 weeks, ask to speak with the financial aid director." },
];

const COMMON_MISTAKES = [
  "Sending the appeal to admissions instead of the financial aid office. Different departments. Use the correct one.",
  "Vague hardship language without documentation. 'We're struggling' isn't an appeal; documented income change is.",
  "Aggressive or threatening tone. Counterproductive. Officers respond to professional, specific requests.",
  "Comparing to other schools without sending the actual offer letter. Specifics required.",
  "Skipping documentation. The single biggest difference between successful and denied appeals.",
  "Overstating circumstances. If discovered, undermines credibility for the entire appeal.",
  "Multiple aggressive follow-ups within days. One follow-up after 2 weeks is appropriate.",
  "Not following up at all. Silence often means your appeal got lost in queue, not denied.",
];

const PAGE_FAQS = [
  { q: "Can you really negotiate financial aid?", a: "Yes. Financial aid offices have discretion to adjust packages through a process formally called 'Professional Judgment.' The most successful appeals involve documented income changes, medical expenses, or competing offers from peer schools. About 30-50% of well-documented appeals result in some increase." },
  { q: "When should I submit a financial aid appeal?", a: "Within 2 weeks of receiving your award letter, or as soon as documentation is ready. Submit at least 2-3 weeks before May 1. Appeals submitted during peak season (January-April) take longer to process. Confirm receipt within 1 week of sending." },
  { q: "What should I include in a financial aid appeal letter?", a: "The specific circumstance (with dates and numbers), the financial impact quantified, what you're requesting, documentation (tax returns, layoff letters, medical bills, competing offer letters), and a statement that this school remains your top choice. Address it to the financial aid office, not admissions." },
  { q: "What if my financial aid appeal is denied?", a: "Three options: (1) Request a meeting with the financial aid director, who has more discretion than line officers. (2) Re-appeal with stronger documentation if circumstances have changed. (3) Make the honest assessment of whether the school is affordable without unsustainable debt, and consider schools with better packages." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/financial-aid-appeal-guide#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Financial Aid Appeal Guide", item: `${BASE}/financial-aid-appeal-guide` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/financial-aid-appeal-guide#page`,
      url: `${BASE}/financial-aid-appeal-guide`,
      name: "Financial Aid Appeal Guide — How to Negotiate Your Aid Package",
      description: "Definitive guide to financial aid appeals. 6 grounds for appeal, letter framework, what schools will/won't do, timeline.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/financial-aid-appeal-guide#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": `${BASE}/financial-aid-appeal-guide#howto`,
      name: "How to Write a Financial Aid Appeal Letter",
      description: "7-step framework for writing a successful financial aid appeal letter.",
      step: APPEAL_LETTER_FRAMEWORK.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.step.replace(/^\d+\.\s*/, ""),
        text: s.detail,
      })),
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

export default function FinancialAidAppealGuidePage() {
  return (
    <MarketingLayout
      eyebrow="Financial Aid"
      title="Financial Aid Appeal Guide"
      description="Most financial aid offices have discretion to adjust packages. The difference between successful and denied appeals is documentation and specificity. Here's the comprehensive framework: 6 valid grounds, the 7-step letter framework, what schools will and won't budge on, timeline expectations, and 8 common mistakes that get appeals denied."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        title="6 valid grounds for appeal"
        Icon={FileText}
        description="What schools recognize as legitimate appeal reasons. Documentation requirements and success rates for each."
      >
        <div className="space-y-3">
          {APPEAL_GROUNDS.map((g) => (
            <article
              key={g.ground}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {g.ground}
              </h3>
              <p className="mb-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {g.desc}
              </p>
              <p className="mb-1 text-[13px]" style={{ color: "#4A6FA5", fontWeight: 500 }}>
                Documentation: {g.docs}
              </p>
              <p className="text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)", fontStyle: "italic" }}>
                Success rate: {g.success}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="The 7-step appeal letter framework"
        Icon={Send}
        description="The structure that gets responses. Specific, documented, professional."
      >
        <ol className="space-y-3">
          {APPEAL_LETTER_FRAMEWORK.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <div>
                <p className="mb-1 text-[14.5px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {s.step.replace(/^\d+\.\s*/, "")}
                </p>
                <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {s.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="What schools will and won't do"
        Icon={CheckCircle2}
        description="Calibrate your appeal expectations to what's actually possible."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <h3 className="mb-2 text-[15px] font-semibold" style={{ color: "#4A6FA5" }}>
              Schools will
            </h3>
            <ul className="space-y-1.5">
              {WHAT_SCHOOLS_WILL.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <h3 className="mb-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Schools won&apos;t
            </h3>
            <ul className="space-y-1.5">
              {WHAT_SCHOOLS_WONT.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        title="Appeal timeline"
        Icon={Clock}
        description="When to submit, when to follow up, what to expect."
      >
        <div className="space-y-3">
          {TIMELINE.map((t) => (
            <article
              key={t.phase}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {t.phase}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {t.time}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="8 common appeal mistakes" Icon={AlertCircle}>
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
        title="If your appeal is denied"
        Icon={FileText}
      >
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            If your appeal is denied (or the increase is insufficient), three options remain: (1) Request a meeting with the financial aid director to discuss alternatives. They have more discretion than line officers. (2) Re-appeal with additional or stronger documentation if your circumstances have changed. (3) Make the honest assessment: is this school affordable without going into unsustainable debt? If not, consider attending a school where you have a better aid package.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The &apos;best&apos; school you can&apos;t afford to attend is not actually the best school for you. A school you can attend without crushing debt is. Make the honest financial decision, not the aspirational one.
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

      {/* Related resources */}
      <section className="mt-10 mb-10">
        <h2
          className="mb-3 text-[17px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Related resources
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/need-blind-vs-need-aware-schools"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Need-blind vs need-aware schools
          </Link>
          <Link
            href="/net-price"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Net price estimator
          </Link>
          <Link
            href="/scholarship-application-guide"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Scholarship application guide
          </Link>
        </div>
      </section>

      <MarketingCTA
        headline="Negotiate your aid with calibrated framework."
        description="AdmitPath helps you understand your aid package, identify schools where your aid will be strong, and structure successful appeals. Free plan included. Pro $19.99/mo."
        buttonText="Get aid clarity"
      />
    </MarketingLayout>
  );
}
