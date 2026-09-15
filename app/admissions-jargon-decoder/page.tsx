import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Admissions Jargon Decoder — 50+ Terms",
  description:
    "Plain-language definitions of 50+ confusing admissions terms. What 'holistic,' 'demonstrated interest,' 'yield protection,' and more actually mean.",
  alternates: { canonical: `${BASE}/admissions-jargon-decoder` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Admissions Jargon Decoder — 50+ Terms",
    description: "Plain-language definitions of 50+ confusing admissions terms: holistic, demonstrated interest, yield protection, and more.",
    url: `${BASE}/admissions-jargon-decoder`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Admissions+Jargon+Decoder&subtitle=50%2B+terms+explained`, width: 1200, height: 630, alt: "Admissions Jargon Decoder" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Admissions Jargon Decoder — 50+ Terms", description: "Plain-language definitions of 50+ confusing admissions terms.", images: [`${BASE}/api/og?title=Admissions+Jargon+Decoder&subtitle=50%2B+terms+explained`] },
};

type Entry = {
  term: string;
  short: string;
  full: string;
  example?: string;
  category: "Decisions" | "Aid" | "Application" | "Strategy" | "Testing";
};

const ENTRIES: Entry[] = [
  // Decisions
  { term: "Admit", short: "Yes — you're in.", full: "A clean acceptance. You can attend if you commit by the deadline (May 1 for most schools).", category: "Decisions" },
  { term: "Likely Letter", short: "Early signal of admit, weeks before official decision.", full: "Sent by some Ivies and top schools to applicants they particularly want — usually recruited athletes, top scholarship candidates, or extraordinary applicants. Functionally an admission communicated early.", example: "Yale and Brown are known for sending these in late February.", category: "Decisions" },
  { term: "Deferred", short: "Application moved from early round to regular pool.", full: "You'll be re-read in February-March alongside RD applicants. Acceptance from the deferred pool: typically 5-15% at top schools. Better than rejection, worse than admission.", category: "Decisions" },
  { term: "Waitlisted", short: "On the bench until yields come in.", full: "Reserved for if the school's admit yield is lower than expected. Admit rates from waitlists vary wildly year to year — sometimes 0%, sometimes 20%+.", category: "Decisions" },
  { term: "Denied / Rejected", short: "No.", full: "Final decision. Almost never appealable. Rejection at top schools usually doesn't reflect that you're unqualified — they reject ~95% of qualified applicants.", category: "Decisions" },
  { term: "Rescinded", short: "Admission revoked after acceptance.", full: "Rare but real. Triggered by significant senior-year GPA drops, disciplinary actions, criminal charges, or material misrepresentation. Happens to <1% of admits per year.", category: "Decisions" },
  { term: "Z-list (Harvard)", short: "Admitted but with deferred enrollment.", full: "Harvard's specific term for applicants admitted to enroll after a gap year. Real admission, just on a different timeline.", category: "Decisions" },
  { term: "Matched (QuestBridge)", short: "Binding full-scholarship admit through QuestBridge.", full: "If you're in QuestBridge's National College Match and ranked schools, 'matched' means a partner school selected you for a binding full-scholarship admission. You're going there.", category: "Decisions" },

  // Application rounds
  { term: "Early Decision (ED)", short: "Binding apply-early-and-must-attend.", full: "Apply by Nov 1, decision by mid-December, must attend if admitted. ED admit rates are typically 1.5-3x regular round.", category: "Application" },
  { term: "Early Decision II (ED II)", short: "Second binding round, January deadline.", full: "Same binding commitment as ED but with January deadline. Useful if your top choice doesn't have ED I or you got rejected ED I and have a clear backup top choice.", category: "Application" },
  { term: "Early Action (EA)", short: "Non-binding apply-early.", full: "Apply by Nov 1-15, decision by mid-December. You can apply to multiple EAs and you're not committed even if admitted.", category: "Application" },
  { term: "Restrictive Early Action (REA)", short: "Non-binding but exclusive.", full: "Like EA but limits where else you can apply early. Stanford, Harvard, Yale, Princeton all have REA. You can't apply ED to private schools or EA to most other private schools.", category: "Application" },
  { term: "Regular Decision (RD)", short: "Standard application round.", full: "Deadlines January 1-15, decisions late March-early April. The largest pool of applicants and admits.", category: "Application" },
  { term: "Rolling Admissions", short: "Reviewed and decided as applications arrive.", full: "Common at state schools. Apply earlier, hear earlier. Usually no hard deadline beyond a final cutoff.", category: "Application" },

  // Aid
  { term: "Need-blind", short: "Aid request doesn't affect admit decision.", full: "Admissions reads your file without seeing your aid status. Only ~20 schools in the U.S. are need-blind for all applicants including international students.", category: "Aid" },
  { term: "Need-aware", short: "Aid request can affect admit decision.", full: "Most schools (and almost all schools for international applicants). Applying for aid is read alongside your application and can lower your admit chance, especially for borderline applicants.", category: "Aid" },
  { term: "Meets full need", short: "Admitted students have 100% of demonstrated need covered.", full: "Per the school's formula. Top need-blind + meets-full-need schools (Ivies, MIT, Stanford, top LACs) can be CHEAPER than state flagships for low-income families.", category: "Aid" },
  { term: "Demonstrated need", short: "What the school's formula says you can't pay.", full: "Calculated from FAFSA + sometimes CSS Profile. Different schools' formulas yield different demonstrated need numbers — this is why net prices vary across schools for the same family.", category: "Aid" },
  { term: "Net price", short: "What you actually pay after aid.", full: "Sticker price minus grants and scholarships. The number that matters when comparing schools. Federal law requires every school to have a net price calculator on their financial aid page.", category: "Aid" },
  { term: "Cost of Attendance (COA)", short: "Total estimated yearly cost.", full: "Tuition + fees + room + board + books + personal + travel. The 'sticker price' on the school's website. Most students don't pay this much.", category: "Aid" },
  { term: "EFC / SAI", short: "Expected Family Contribution / Student Aid Index.", full: "FAFSA's calculation of what your family is expected to pay. Renamed from EFC to SAI in 2024. Determines federal aid eligibility.", category: "Aid" },
  { term: "Pell Grant", short: "Federal need-based grant — doesn't repay.", full: "Up to $7,395/year for 2025-26. Available to families with low EFC/SAI. Major signal that admissions reads as 'low-income applicant.'", category: "Aid" },
  { term: "Merit aid", short: "Awarded for performance, not need.", full: "Schools offer merit scholarships to applicants whose academic profile would make them a 'catch.' Generally not available at top need-blind schools (Ivies, MIT, Stanford). Heavily available at second-tier private schools.", category: "Aid" },

  // Application
  { term: "Holistic admissions", short: "Every part of your file is read by humans.", full: "Decisions are made by synthesis, not formula. Both your numbers (GPA, SAT) AND your essays, activities, recommendations, and context are evaluated. Doesn't mean the academic bar is lower — means everything else also matters.", category: "Application" },
  { term: "CDS Section C7", short: "School's published admissions factor weights.", full: "From the Common Data Set. Each school publishes how heavily they weight: GPA, rigor, test scores, essays, activities, recommendations, etc. (0-3 scale). Useful for understanding what each school values.", category: "Application" },
  { term: "Common App", short: "The dominant application platform.", full: "Used by 1,000+ colleges. One application + per-school supplements. The default platform for most selective schools.", category: "Application" },
  { term: "Coalition App", short: "Alternate application platform, ~150 schools.", full: "Less common than Common App. Different essay prompts. Fewer activity slots. Mostly redundant — almost every Coalition school also accepts Common App.", category: "Application" },
  { term: "Naviance / SCOIR", short: "School-specific data on prior admits.", full: "Tools high schools use to track college admissions. Naviance shows scattergrams of prior students' GPA/SAT vs admit outcomes at specific schools. Strong predictor for students at schools with significant Naviance history.", category: "Application" },
  { term: "School profile", short: "Document your counselor sends with each application.", full: "Lists your school's course offerings, AP/IB participation, grading scale, peer schools, demographic data. Lets admissions read your transcript in context. Especially important from less-known schools.", category: "Application" },
  { term: "Common Data Set (CDS)", short: "Standardized data published by every school.", full: "Annual document with admissions stats, financial data, demographic breakdowns. Every accredited school publishes one. Most useful section: C7 (admissions factors) and C9 (test score middle 50%).", category: "Application" },

  // Strategy
  { term: "Hook", short: "A factor that gives admissions a reason to admit you.", full: "Recruited athlete, faculty kid, donor child, first-gen, URM, geographic, regional, artistic recruit. Hooks vary in strength — recruited athletes are ~80% admit rate; geographic might be a 5% nudge.", category: "Strategy" },
  { term: "Spike", short: "Sustained, deep engagement in one area with tangible production.", full: "Not 'leadership in 5 clubs.' Real evidence of going deep — research, competitions, products, creative work. Spike beats well-rounded at top-20 schools.", category: "Strategy" },
  { term: "Demonstrated interest", short: "Signals that you'll enroll if admitted.", full: "Some schools (Tulane, Northeastern, NYU, Wake Forest, USC) track open emails, virtual visits, info sessions. Most Ivies, MIT, Stanford do NOT track interest. Where it matters, it can be a real factor.", category: "Strategy" },
  { term: "Yield protection", short: "Schools rejecting overqualified applicants.", full: "If a school suspects an applicant is using them as a backup, they may reject (or waitlist) the applicant to protect their yield. Tufts, Wash U, NYU, BC/BU/Northeastern have been historically flagged.", category: "Strategy" },
  { term: "Tufts syndrome", short: "Old name for yield protection.", full: "Named after Tufts, which historically rejected high-stat applicants believed to be using them as a safety. Term still used colloquially.", category: "Strategy" },
  { term: "Reach / Target / Safety", short: "Probability buckets for your college list.", full: "Reach: low admit probability. Target: roughly your-profile-fits. Safety: high probability AND you'd attend AND you can afford. AdmitPath uses 4-band: Very Likely / Possible / Long Shot / Hail Mary instead of 3.", category: "Strategy" },
  { term: "Legacy", short: "Parental connection to the school.", full: "At most schools that use it: at least one parent attended undergrad at the institution. Not siblings or grandparents (usually). Boost is ~8-15% adjusted, not the 30-40% raw data suggests. Several schools have eliminated it.", category: "Strategy" },
  { term: "URM", short: "Under-Represented Minority.", full: "Pre-2023 SCOTUS ruling: a factor admissions could weight. Post-ruling: cannot be used as a checkbox factor. Schools can still read about how race shaped your life — but cannot use it as a category.", category: "Strategy" },
  { term: "First-gen", short: "Neither parent earned a 4-year U.S. bachelor's.", full: "Definition varies slightly by school. Often a positive factor — admissions reads with awareness of opportunity gaps. Many top schools recruit first-gen applicants explicitly.", category: "Strategy" },
  { term: "Brag sheet", short: "Document you give your counselor / teachers.", full: "1-2 pages with specific moments, achievements, context they need to write a strong recommendation. Not a resume. Most-leveraged document of the application process.", category: "Strategy" },

  // Testing
  { term: "Test-optional", short: "Submitting scores is your choice.", full: "Apply with or without scores. Submit if you're at or above the school's 50th percentile of admits. Skip if you're below the 25th percentile. The middle band is judgment.", category: "Testing" },
  { term: "Test-blind", short: "Scores not considered if submitted.", full: "Some UCs went test-blind. Most schools that say 'test-optional' will still read scores if submitted. Test-blind means literally won't look — your score doesn't help even if you submit.", category: "Testing" },
  { term: "Superscore", short: "Best section scores across multiple sittings.", full: "Many schools take your highest English/Reading and Math scores from different SAT sittings to form your 'superscore.' Some schools require you submit all attempts.", category: "Testing" },
  { term: "Score Choice", short: "Send only the scores you want.", full: "College Board's program lets you choose which test dates to send. Available at most schools, but some require all scores.", category: "Testing" },
  { term: "Concordance", short: "Converting between SAT and ACT scores.", full: "Official tables. SAT 1500 ≈ ACT 33. Used internally by admissions to compare applicants who took different tests.", category: "Testing" },
  { term: "PSAT/NMSQT", short: "Junior-year practice SAT — also National Merit qualifier.", full: "Take in October of junior year. Top scorers (~99th percentile) qualify for National Merit. PSAT score itself doesn't appear in college applications.", category: "Testing" },
  { term: "Subject Tests (SAT IIs)", short: "Discontinued in 2021.", full: "No longer exist. Some schools previously required them; AP scores now serve a similar function.", category: "Testing" },
];

const CATEGORIES = ["Decisions", "Application", "Strategy", "Aid", "Testing"] as const;

const PAGE_FAQS = [
  { q: "What does holistic admissions mean?", a: "Holistic review means the school considers the full application -- GPA, test scores, essays, activities, recommendations, and context -- rather than using a single cutoff. In practice, GPA and course rigor are still the strongest filters, but essays and activities matter significantly at schools with holistic review." },
  { q: "What is the difference between Early Decision and Early Action?", a: "Early Decision (ED) is binding: if admitted, you must attend and withdraw all other applications. Early Action (EA) is non-binding: you learn your decision early but can compare offers until May 1. ED admit rates are typically 1.5-3x higher than regular decision. Restrictive EA limits where else you can apply early." },
  { q: "What does test-optional actually mean?", a: "Test-optional means you can choose whether to submit SAT/ACT scores. If your scores are above the school's median, submitting generally helps. If below the 25th percentile of admits, not submitting is usually better. Test-optional is not test-blind -- schools that are test-blind (Caltech, UC system) don't look at scores at all." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/admissions-jargon-decoder#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Jargon Decoder", item: `${BASE}/admissions-jargon-decoder` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/admissions-jargon-decoder#page`,
      url: `${BASE}/admissions-jargon-decoder`,
      name: "Admissions Jargon Decoder",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/admissions-jargon-decoder#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/admissions-jargon-decoder#defined-list` },
    },
    {
      "@type": "DefinedTermSet",
      "@id": `${BASE}/admissions-jargon-decoder#defined-list`,
      name: "College Admissions Jargon",
      hasDefinedTerm: ENTRIES.map((e) => ({
        "@type": "DefinedTerm",
        name: e.term,
        description: e.full,
        inDefinedTermSet: `${BASE}/admissions-jargon-decoder#defined-list`,
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

export default function AdmissionsJargonDecoderPage() {
  return (
    <MarketingLayout
      eyebrow="Admissions Terms"
      title="Admissions Jargon Decoder"
      description={`Plain-language definitions for ${ENTRIES.length} confusing admissions terms. What each phrase actually means inside admissions offices — including the ones the marketing copy doesn't explain.`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Quick nav */}
      <nav aria-label="Categories" className="mb-12 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <a
            key={c}
            href={`#${c.toLowerCase()}`}
            className="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:border-[color:#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            {c} ({ENTRIES.filter((e) => e.category === c).length})
          </a>
        ))}
      </nav>

      {/* Sections */}
      {CATEGORIES.map((cat) => {
        const items = ENTRIES.filter((e) => e.category === cat);
        return (
          <section key={cat} id={cat.toLowerCase()} className="mb-12 scroll-mt-24">
            <h2
              className="mb-4 flex items-center gap-2 text-[20px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              <BookOpen className="h-5 w-5" style={{ color: "#4A6FA5" }} />
              {cat}
            </h2>
            <div className="space-y-3">
              {items.map((e, i) => (
                <div
                  key={i}
                  className="dl-card-hover rounded-xl border p-4"
                  style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="mb-1 flex flex-wrap items-baseline gap-3">
                    <h3
                      className="text-[15px] font-semibold"
                      style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                    >
                      {e.term}
                    </h3>
                    <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                      {e.short}
                    </p>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {e.full}
                  </p>
                  {e.example && (
                    <p
                      className="mt-2 text-[12px] italic"
                      style={{ color: "var(--dl-text-muted, #5A6275)" }}
                    >
                      Example: {e.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Cross-links */}
      <div
        className="mb-12 rounded-xl border p-5"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
      >
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Need a shorter version?
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/glossary"
            className="inline-flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "#4A6FA5" }}
          >
            Quick glossary <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "#4A6FA5" }}
          >
            Admissions FAQ <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "#4A6FA5" }}
          >
            Methodology <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

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

      {/* CTA */}
      <MarketingCTA
        headline="Get an honest take on your application"
        description="Skip the jargon — see where you actually stand with a calibrated 7-dimension profile score."
        buttonText="Try AdmitPath free"
      />
    </MarketingLayout>
  );
}
