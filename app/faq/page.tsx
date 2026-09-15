import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, HelpCircle } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Admissions FAQ",
  description:
    "Honest, sourced answers to 30 common college admissions questions. Acceptance rates, essays, deadlines, financial aid, and what matters in 2026.",
  alternates: { canonical: `${BASE}/faq` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Admissions FAQ",
    description: "Sourced answers to the 30 most common college admissions questions: rates, essays, deadlines, and aid.",
    url: `${BASE}/faq`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=College+Admissions+FAQ&subtitle=30+most-asked+questions+answered`,
        width: 1200,
        height: 630,
        alt: "College Admissions FAQ — 30 questions answered",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "College Admissions FAQ",
    description: "Sourced answers to the 30 most common college admissions questions.",
    images: [
      {
        url: `${BASE}/api/og?title=College+Admissions+FAQ&subtitle=30+most-asked+questions+answered`,
        alt: "College Admissions FAQ",
      },
    ],
  },
};

type FAQ = { q: string; a: string; slug?: string };
type Section = { name: string; id: string; faqs: FAQ[] };

const SECTIONS: Section[] = [
  {
    name: "The basics",
    id: "basics",
    faqs: [
      {
        q: "When should I start preparing for college applications?",
        a: "The college application timeline starts informally in 9th grade with grades and habit-building, becomes structured in junior year with testing and the college list, and peaks senior fall with applications. Most students underestimate how much of the work happens in 11th grade — by the time senior year starts, your transcript, scores, recommendations, and major activities are largely fixed. The summer before senior year is the right window for essays.",
        slug: "freshman-sophomore-year-college-prep",
      },
      {
        q: "How many colleges should I apply to?",
        a: "8–12 is the sweet spot for most students: 2–3 reaches, 3–5 targets, 2–3 safeties. Below 6 leaves you exposed if results disappoint; above 15 means each application gets less attention. With Common App fee waivers, the financial cost is zero — but the time cost of supplements adds up fast.",
        slug: "how-to-build-a-college-list",
      },
      {
        q: "What is a 'reach,' 'target,' and 'safety' school?",
        a: "A reach has an acceptance rate well below your profile's typical band (e.g., your 25th-percentile or below). A target has a rate where your profile sits in the middle 50%. A safety has a rate where your profile is above the 75th percentile and you're confident you can afford to attend if admitted. Note: any school under ~20% acceptance is a reach for almost everyone.",
        slug: "how-to-build-a-college-list",
      },
      {
        q: "Are college applications still worth it given how competitive they've become?",
        a: "Yes. Acceptance rates at the top 20 are brutal (3–7%), but there are 200+ excellent four-year colleges in the U.S. — many with 30%+ acceptance rates and strong outcomes. The trick is building a balanced list, not chasing only the brand-name reaches. The data is consistent: graduating from a top-100 school with strong grades and engagement matters more than the brand of the diploma.",
      },
    ],
  },
  {
    name: "Test scores",
    id: "tests",
    faqs: [
      {
        q: "What is a good SAT score for top colleges?",
        a: "For Ivy+ schools, the middle 50% is roughly 1490–1570. For T20 schools broadly, 1450–1550 is competitive. For T50, 1350–1500. Your score should be at or above the school's 50th percentile to be considered competitive without other compensating factors. Below the 25th percentile, the score becomes a liability rather than a hook.",
        slug: "what-is-a-good-sat-score",
      },
      {
        q: "Should I apply test-optional?",
        a: "First, check if the school requires scores -- Yale, Brown, Cornell, Dartmouth, MIT, Caltech, and Georgetown now require SAT/ACT. At test-optional schools, submit if you're at or above the 50th percentile of admitted students. Don't submit if below the 25th percentile. The middle band is judgment -- generally lean toward submitting. Test-optional doesn't mean test-blind: scores submitted are read.",
        slug: "should-i-apply-test-optional",
      },
      {
        q: "How many times can I take the SAT?",
        a: "Officially unlimited, but practically 2–3 attempts. Score improvement diminishes after the second take. Most students see a 30–50 point bump on attempt 2; attempt 3 typically yields ~20 points or less. Schools that superscore will combine your best section scores across sittings; schools that require all scores see your full history.",
      },
      {
        q: "Is the SAT or ACT better?",
        a: "Colleges accept both equally. The SAT is more reading/grammar/algebra heavy with one quantitative section; the ACT has a separate science section (mostly graph reading) and is faster paced. Take a practice test of each — most students score meaningfully better on one. Pick that one and stop comparing.",
      },
    ],
  },
  {
    name: "Essays",
    id: "essays",
    faqs: [
      {
        q: "How long should the Common App essay be?",
        a: "The hard limit is 650 words. Most strong essays are 600–650 words. Anything under 500 reads as undercooked. The Common App portal cuts off anything over 650 mid-sentence.",
        slug: "how-long-should-a-college-essay-be",
      },
      {
        q: "Can I use ChatGPT for my college essay?",
        a: "For brainstorming, outlining, and feedback — yes, most schools allow this. For writing the prose itself — no, even at schools without explicit AI policies, the Common App honor pledge requires the work to be your own. Voice mismatch with the rest of your application is the most common giveaway.",
        slug: "using-ai-on-college-essays",
      },
      {
        q: "What should I write my Common App essay about?",
        a: "A specific, vivid, you-shaped story that reveals something the rest of your application can't show. Specificity beats abstraction every time. Write about a particular moment, conversation, or realization — not a list of accomplishments. The prompt barely matters; pick the one that fits your story.",
        slug: "common-app-essay-prompts",
      },
      {
        q: "How do I write a 'Why Us' supplemental essay?",
        a: "Go specific. Name 3–5 concrete things about that school: a specific professor's research you'd want to join, a class you've already pulled from the registry, a tradition or organization that maps to your interests. Avoid 'beautiful campus,' 'collaborative environment,' or anything that could be copy-pasted to another school. The test: if you swap the school name, does the essay still work? If yes, it's broken.",
        slug: "why-us-essay-guide",
      },
    ],
  },
  {
    name: "Activities and extracurriculars",
    id: "activities",
    faqs: [
      {
        q: "How important is having a 'spike' versus being well-rounded?",
        a: "At T20 schools, a spike beats well-rounded most of the time. A spike is sustained, deep engagement in one area with measurable results — a research publication, a national-level competition, a real product or business, a meaningful body of artistic work. Well-rounded competes against thousands of identical applicants; a spike makes you legible.",
        slug: "spike-vs-well-rounded-what-t20-schools-want",
      },
      {
        q: "How many AP classes should I take?",
        a: "For top schools, 5–8 APs by graduation is the typical range. Quality over quantity — taking 12 APs and doing poorly is worse than 6 APs with strong performance. Start small (1–2 APs sophomore year), peak junior year (3–4), and back off senior spring. AP scores themselves are less important than course rigor on the transcript.",
        slug: "how-many-aps-is-enough",
      },
      {
        q: "What activities look impressive to colleges?",
        a: "Any activity where you demonstrate genuine commitment, tangible impact, and growth. Founding something is not inherently better than joining and rising within an existing organization. National-level competition wins, published work, paid jobs (especially as a primary income earner), and original research are objectively impressive. But specificity and depth matter more than category.",
        slug: "common-app-activities-list-guide",
      },
      {
        q: "Do colleges care about volunteer hours?",
        a: "They care about engagement, not hours. 500 hours of generic community service (one-off events, food bank shifts) are weaker than 50 hours of sustained, substantive involvement in one organization where you took on responsibility. Stop counting hours; start describing what you actually did.",
      },
    ],
  },
  {
    name: "Deadlines and decision rounds",
    id: "deadlines",
    faqs: [
      {
        q: "What's the difference between Early Decision, Early Action, and REA?",
        a: "ED is binding — if admitted, you must attend, and applications are due Nov 1 with decisions in mid-December. EA is non-binding and lets you apply to multiple schools early. REA (Restrictive Early Action) is non-binding but limits where else you can apply early (no other private EDs). Acceptance rates for ED and REA are typically 1.5–3× the regular round, but the pool is also more self-selected.",
        slug: "early-decision-vs-early-action",
      },
      {
        q: "Should I apply Early Decision?",
        a: "Apply ED only if (1) the school is your clear first choice, (2) you can afford it without comparing financial aid offers from other schools, and (3) your application will be at its strongest by November 1. ED is a commitment device — it boosts admit rates because it shows you'll attend, but you forfeit the right to compare offers.",
        slug: "ed-vs-ea-decision-tree",
      },
      {
        q: "When are college application deadlines?",
        a: "Most ED/EA/REA deadlines are November 1. Some are November 15 (UC system) or November 30. Regular Decision deadlines are January 1, January 5, or January 15 depending on the school. Financial aid (FAFSA) opens October 1. CSS Profile also opens October 1. Confirm each school's specific deadline on their admissions page.",
        slug: "college-application-deadlines",
      },
      {
        q: "What happens if I get deferred from my ED school?",
        a: "Your application moves to the regular decision pool. Acceptance rates after deferral are typically 5–15% — better than rejection, but the bulk of available spots are gone. Write a strong Letter of Continued Interest within 2 weeks: 1 page, what you've accomplished since November, why this school is still your first choice, no whining. Continue the regular round at full strength elsewhere.",
      },
    ],
  },
  {
    name: "Financial aid",
    id: "money",
    faqs: [
      {
        q: "When should I file the FAFSA?",
        a: "FAFSA opens October 1 for the following academic year. File as early as possible — many state grants and some institutional aid are first-come-first-served. Required for federal aid (Pell, federal loans, work-study) and used by most schools for institutional aid as well.",
        slug: "fafsa-strategy-2026",
      },
      {
        q: "What is the CSS Profile and do I need it?",
        a: "The CSS Profile is a more detailed financial aid form used by ~250 colleges (including most Ivies and selective private schools) for institutional aid. It's separate from the FAFSA and typically asks for more detail — home equity, non-custodial parent income, business assets. Costs $25/school but is waived under ~$100K family income. Required by many top private schools.",
        slug: "what-is-the-css-profile",
      },
      {
        q: "What's the difference between need-blind and meets-full-need admissions?",
        a: "Need-blind means the admissions office doesn't see your financial need when deciding to admit you. Meets-full-need means the financial aid office covers 100% of the demonstrated need (per their formula) of admitted students with grants. Only ~20 schools in the U.S. are both need-blind AND meets-full-need for all applicants — those schools are typically the most generous.",
        slug: "need-blind-vs-meets-full-need",
      },
      {
        q: "Will applying for financial aid hurt my chances?",
        a: "At need-blind schools, no — admissions doesn't see your aid status. At need-aware schools (which include some top liberal arts colleges and most international applicant pools), yes, applying for aid can affect admission decisions for borderline applicants. Most students applying to need-blind schools should apply for aid — there's no penalty and you might receive it.",
      },
    ],
  },
  {
    name: "Recommendations and the rest",
    id: "rest",
    faqs: [
      {
        q: "Who should I ask for recommendation letters?",
        a: "Two academic teachers from junior year (one STEM, one humanities is the typical balance) plus your guidance counselor. Pick teachers who know you well, ideally from a course where you struggled and grew, not just where you got an A. The most useful letters describe specific moments, not generic praise.",
        slug: "recommendation-letter-strategy",
      },
      {
        q: "Should I do a college interview?",
        a: "If offered, yes. Alumni interviews don't move the needle much (they're rarely a deciding factor), but they're an opportunity, not a risk — bad interviews are very hard to do unless you're rude or unprepared. On-campus interviews at smaller schools (Bowdoin, Wesleyan, etc.) carry more weight than alumni interviews at larger schools.",
        slug: "college-interview-prep-tactics",
      },
      {
        q: "What is demonstrated interest and which schools track it?",
        a: "Demonstrated interest = signals that you'll enroll if admitted. Schools that track it include Tulane, Northeastern, BU, Case Western, NYU, USC, Wake Forest, Vanderbilt and many liberal arts colleges. Schools that don't include the Ivies, MIT, Stanford, UChicago, and most state flagships. Where it matters: open emails, visit (virtual or in-person), attend info sessions, write a strong 'Why Us' essay.",
        slug: "demonstrated-interest-college-admissions",
      },
      {
        q: "What should I do if I get rejected from my dream school?",
        a: "Take a week to feel it. Then: review the schools you DID get into with fresh eyes — most students underestimate how good their second-choice options are. The data on outcomes is consistent: graduating with strong grades from a school 10 spots down the rankings produces better outcomes than barely surviving at the top-ranked school. Your dream school decision was someone else's threshold call; the rest of your life isn't.",
        slug: "what-to-do-if-rejected-from-dream-school",
      },
    ],
  },
  {
    name: "About AdmitPath",
    id: "admitpath",
    faqs: [
      {
        q: "What does AdmitPath score?",
        a: "AdmitPath scores your profile across 7 dimensions: Academic Rigor, Leadership, Awards, Activity Depth, Spike, Essay Quality, and Recommendations. Each dimension is scored 0-100 and calibrated against real admissions data using CDS Section C7 weights. The essay tool uses a separate 6-dimension rubric (authenticity, insight, specificity, storytelling, impact, voice) plus a 4-axis voice rubric based on the College Essay Guy framework (place, detail, vulnerability, surprise).",
        slug: "methodology",
      },
      {
        q: "How much does AdmitPath cost?",
        a: "AdmitPath has a permanent Free plan (5 profile analyses, 5 essay reviews, 5 counselor chat messages, 8 saved colleges -- no time limit). Pro is $19.99/month and removes those Free-plan caps while adding the current personalized planning tools.",
        slug: "pricing",
      },
      {
        q: "Is the free plan permanent?",
        a: "Yes. The Free plan never expires. You get 5 AI profile analyses, 5 essay feedback runs, 5 counselor chat messages, and can save up to 8 colleges. Upgrade to Pro anytime to remove those Free-plan caps.",
        slug: "pricing",
      },
      {
        q: "How is AdmitPath different from other college admissions tools?",
        a: "AdmitPath is the only tool that (1) publishes its full scoring methodology, (2) calibrates scores against CDS Section C7 weights per school, (3) uses 4-band probability instead of false-precision percentages, and (4) deliberately anti-inflates scores. Most tools inflate to make users feel good. AdmitPath tells you when you're a Long Shot.",
        slug: "methodology",
      },
    ],
  },
];

const ALL_FAQS = SECTIONS.flatMap((s) => s.faqs);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/faq#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "FAQ", item: `${BASE}/faq` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/faq#page`,
      url: `${BASE}/faq`,
      name: "College Admissions FAQ — 30 Most-Asked Questions Answered",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/faq#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/faq#faq` },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE}/faq#faq`,
      mainEntity: ALL_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ],
};

export default function FAQPage() {
  return (
    <MarketingLayout
      eyebrow="FAQ"
      title="College Admissions FAQ"
      description={`Honest, sourced answers to the ${ALL_FAQS.length} most common questions we get from students and parents. No fluff. Where there's a longer guide on the topic, we link out to it.`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* Quick nav */}
        <nav aria-label="FAQ sections" className="mb-12 flex flex-wrap gap-1.5">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:border-[color:#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {s.name}
            </a>
          ))}
        </nav>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
            <h2
              className="mb-5 flex items-center gap-2 text-[20px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              <HelpCircle className="h-5 w-5" style={{ color: "#4A6FA5" }} />
              {section.name}
            </h2>

            <div className="space-y-4">
              {section.faqs.map((f, i) => (
                <details
                  key={i}
                  className="dl-card-hover group rounded-xl border p-4 transition-colors hover:border-[color:var(--dl-text-muted, #5A6275)]"
                  style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <summary
                    className="cursor-pointer list-none text-[15px] font-semibold flex items-start justify-between gap-3"
                    style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                  >
                    <span className="flex-1">{f.q}</span>
                    <span
                      className="shrink-0 text-[18px] leading-none transition-transform group-open:rotate-45"
                      aria-hidden
                      style={{ color: "var(--dl-text-muted, #5A6275)" }}
                    >
                      +
                    </span>
                  </summary>
                  <div className="mt-3 space-y-3">
                    <p
                      className="text-[14px] leading-relaxed"
                      style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
                    >
                      {f.a}
                    </p>
                    {f.slug && (
                      <Link
                        href={`/blog/${f.slug}`}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold"
                        style={{ color: "#4A6FA5" }}
                      >
                        Read the full guide
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* Related resources */}
        <section className="mt-12 mb-10">
          <h2
            className="mb-3 text-[17px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Related resources
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/glossary"
              className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Admissions Glossary
            </Link>
            <Link
              href="/admissions-jargon-decoder"
              className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Jargon Decoder
            </Link>
            <Link
              href="/college-application-checklist"
              className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Application Checklist
            </Link>
            <Link
              href="/college-application-timeline-2026"
              className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Timeline 2026
            </Link>
            <Link
              href="/tools"
              className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              All Free Tools
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Have a question we didn&apos;t answer?
          </p>
          <Link
            href="/sign-up"
            className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            Get personalized advice -- free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
    </MarketingLayout>
  );
}
