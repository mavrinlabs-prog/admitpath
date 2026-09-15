import Link from "next/link";
import type { Metadata } from "next";
import {
  Heart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Rejection Recovery — Next Steps",
  description:
    "Getting rejected is hard. An honest framework: emotional processing, what comes next, gap year and transfer paths, and how students end up.",
  alternates: { canonical: `${BASE}/college-rejection-recovery` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Rejection Recovery — Next Steps",
    description: "Honest framework for rejection: emotional processing, gap year, transfer paths, and how students actually end up.",
    url: `${BASE}/college-rejection-recovery`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Rejection+Recovery&subtitle=Next+steps+after+rejection`, width: 1200, height: 630, alt: "College Rejection Recovery" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Rejection Recovery — Next Steps", description: "Honest framework: emotional processing, transfer paths, and next steps.", images: [`${BASE}/api/og?title=Rejection+Recovery&subtitle=Next+steps+after+rejection`] },
};

const FIRST_24_HOURS = [
  "Allow yourself to feel it. Disappointment, anger, sadness, embarrassment — all are normal.",
  "Don't post on social media in the first 24 hours. Things you say in this state are hard to take back.",
  "Don't message your friends comparing decisions. Comparison amplifies pain.",
  "Tell at least one trusted adult — parent, counselor, or close friend's parent. Saying it out loud reduces the spiral.",
  "Eat. Sleep. Don't skip the basics because you're upset.",
  "Don't make decisions about your other applications, future choices, or the school you're admitted to in this state.",
];

const FIRST_WEEK = [
  "Talk to your counselor. They've supported many students through rejections; they have perspective.",
  "Look at where you HAVE been admitted with fresh eyes. Often the rejected schools were ranked first by reputation, not fit.",
  "Talk to current students at the schools you've been admitted to. The 'less selective' school often has students just as smart and engaged.",
  "Recognize: many students end up at schools they're genuinely happy at — including schools they hadn't considered seriously in October.",
  "Don't sink into 'what if' thinking. The decision is made; your time is better spent on what's next.",
];

const PATHS_FORWARD = [
  {
    path: "Choose your best admit",
    desc: "For most students, this is the right answer. The school you'd be happiest at, given your admits and aid offers. Many students end up genuinely thriving at schools they initially undervalued. Visit if you can; talk to current students.",
    when: "When you have at least one admit you'd be willing to attend and the financial fit works.",
  },
  {
    path: "Take a gap year",
    desc: "A well-structured gap year can dramatically strengthen a re-application. Substantive paid work, real internship, focused independent project, or community-college course load. NOT 'living at home with no structure.'",
    when: "When your strongest admits don't feel like fits AND you can structure a meaningful gap year activity AND your family supports it.",
  },
  {
    path: "Community college transfer pipeline",
    desc: "California CCs → UC system via TAG, USC Transfer, Cornell Transfer Option, Northwestern Transfer Program. Strong performance at CC + thoughtful 'why transfer' essay produces admissions to top schools.",
    when: "When your strongest admits don't fit AND you can commit to 1-2 years of focused community college work AND you'd transfer to specific target schools.",
  },
  {
    path: "Late-deadline applications",
    desc: "NACAC publishes a 'College Openings Update' each May 1 listing schools still accepting applications. Many regional flagships and second-tier privates have rolling admissions through summer.",
    when: "When you didn't apply broadly enough and want to add schools without taking a gap year.",
  },
  {
    path: "Reapply next year",
    desc: "Some students reapply as first-year applicants the next cycle (often after a gap year). This is a different path than transfer — you're a different applicant with a different application.",
    when: "Rare. When you've genuinely changed in ways that warrant re-application AND you have the time and resources.",
  },
];

const SCHOOLS_NOT_REPRESENTED = [
  "Strong honors colleges at less-selective state schools (Schreyer at Penn State, Barrett at ASU, Honors at Pitt, Park at NC State) — these can offer Ivy-quality experiences with merit aid.",
  "Less-known LACs with strong outcomes (Macalester, Lawrence, Whitman, Earlham, Knox).",
  "Specialized schools (Cooper Union, Olin College, Webb Institute) for specific interests.",
  "International schools (St Andrews, Trinity College Dublin, McGill, UofT) — significantly cheaper than US privates.",
  "Regional flagships in states you haven't lived in — many offer significant merit aid to non-residents.",
];

const WHAT_TO_AVOID = [
  "Posting your rejection list publicly. The internet is permanent.",
  "Engaging with peer comparison. Other students' admits don't change yours.",
  "Reading r/[School Name] subreddits about why you were rejected. They don't know.",
  "Treating this as evidence about your worth. The application reflects 17 years; one decision in March doesn't change those 17 years.",
  "Making major life decisions in the first 48 hours. Wait for the emotional intensity to subside.",
  "Treating community college transfer as a 'lesser path.' It's a real and underappreciated path to top schools.",
];

const WHAT_HELPS = [
  "Time. Most students who feel devastated in March feel grateful for their actual outcome by September.",
  "Talking to current students at schools you'd be attending — they often shift the narrative from 'lesser' to 'real opportunity.'",
  "Recognizing that career outcomes correlate weakly with school selectivity for many fields. The student who applies themselves at a less-selective school often outperforms the disengaged student at a more-selective one.",
  "Finding peer support. Other students experiencing the same thing reduces isolation.",
  "Therapy or counseling if the impact is significant. The emotional weight of a rejected dream is real.",
];

const PAGE_FAQS = [
  { q: "Is it normal to feel devastated after a college rejection?", a: "Yes. College rejection grief is real and well-documented. The rejection represents the loss of an imagined future, which triggers genuine grief responses. Most students who feel devastated in March feel genuinely happy at their actual school by September. Allow yourself to feel it without minimizing." },
  { q: "Should I transfer if I got rejected from my dream school?", a: "Don't decide to transfer before you've attended your admit school. Transfer admit rates at top private schools are typically 3-7%. Engage fully with your school first. If after a year you genuinely feel mismatched (not just comparing to the rejected school), then transfer is a real option." },
  { q: "Can I appeal a college rejection?", a: "Some schools allow reconsideration appeals, but success rates are very low (1-3% at top schools). Appeals are worth pursuing only if you have substantively new information: major awards, research breakthroughs, or dramatic changes in circumstances. Simply arguing the decision is not effective." },
  { q: "Does the school I attend really matter for my career?", a: "Career outcomes correlate weakly with school selectivity for many fields. School name matters most for the first job in consulting, finance, and top tech — and decreases in importance after 5 years. The student who applies themselves at a less-selective school often outperforms the disengaged student at a selective one." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-rejection-recovery#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College Rejection Recovery", item: `${BASE}/college-rejection-recovery` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-rejection-recovery#page`,
      url: `${BASE}/college-rejection-recovery`,
      name: "College Rejection Recovery — Processing Decisions and Moving Forward",
      description: "Honest framework for processing college rejections: emotional recovery in the first 24 hours, the first week, paths forward (best admit, gap year, transfer pipeline, late-deadline applications), schools you may not have considered, and the bigger picture.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-rejection-recovery#breadcrumb` },
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

export default function CollegeRejectionRecoveryPage() {
  return (
    <MarketingLayout
      eyebrow="Decisions Recovery"
      title="College Rejection Recovery"
      description="Getting rejected from your top choices is hard. The disappointment is real. Here's an honest framework for processing the decisions, the paths forward (best admit, gap year, transfer pipeline, late deadlines), and the bigger picture most students eventually arrive at."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section title="The first 24 hours" Icon={Heart}>
        <ul className="space-y-2">
          {FIRST_24_HOURS.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="The first week" Icon={ArrowRight}>
        <ul className="space-y-2">
          {FIRST_WEEK.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{f}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Paths forward"
        Icon={ArrowRight}
        description="Five real options for what to do next. The right path depends on your specific admit set, financial situation, and goals."
      >
        <div className="space-y-3">
          {PATHS_FORWARD.map((p) => (
            <article
              key={p.path}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {p.path}
              </h3>
              <p className="mb-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.desc}
              </p>
              <p className="text-[13px]" style={{ color: "#4A6FA5", fontWeight: 500 }}>
                When: {p.when}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Schools you may not have considered"
        Icon={ArrowRight}
        description="Often the path forward isn't more reaches — it's schools you didn't include in your initial list."
      >
        <ul className="space-y-2">
          {SCHOOLS_NOT_REPRESENTED.map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What to avoid" Icon={AlertCircle}>
        <ul className="space-y-2">
          {WHAT_TO_AVOID.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What helps" Icon={Heart}>
        <ul className="space-y-2">
          {WHAT_HELPS.map((w, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* The bigger picture */}
      <section
        className="mb-12 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
      >
        <h2
          className="mb-3 text-[20px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          The bigger picture
        </h2>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Many of the most successful adults you&apos;ll meet didn&apos;t
          attend their top choice. Many didn&apos;t attend particularly
          prestigious colleges at all. The school where you finish matters
          less than how you use those four years.
        </p>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          By September, most students who felt devastated in March are at
          schools they&apos;re genuinely happy at — often schools they
          initially undervalued. The pain of rejection is real but
          time-limited. The career and life you build is what actually matters.
        </p>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          If the rejection is hitting you hard right now: this feeling will
          pass. Take care of yourself in the meantime.
        </p>
      </section>

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
        headline="Plan your next move."
        description="AdmitPath surfaces transfer pipelines, late-application schools, and gap year strategies aligned with your situation. Free plan included. Pro $19.99/mo."
        buttonText="Plan my path forward"
      />

      {/* Related */}
      <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/transfer-college-strategy"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Transfer college strategy
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Top transfer pipelines and the &lsquo;why transfer&rsquo; essay framework.
          </div>
        </Link>
        <Link
          href="/honors-college-explained"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Honors colleges explained
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Top honors programs at less-selective schools — Ivy-quality at lower cost.
          </div>
        </Link>
        <Link
          href="/college-decision-day"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            May 1 decision day framework
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Compare offers, calculate real cost, negotiate, handle waitlist, commit.
          </div>
        </Link>
        <Link
          href="/diverse-college-list"
          className="rounded-xl border p-4 transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            First-gen & low-income schools guide
          </div>
          <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Schools with strong support systems and partner programs.
          </div>
        </Link>
      </nav>
    </MarketingLayout>
  );
}
