import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Users,
  Search,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "How to Pick a College Counselor",
  description:
    "How to evaluate private college counselors: fair pricing, red flags, and what counselors actually do well vs. what AI tools handle better.",
  alternates: { canonical: `${BASE}/how-to-pick-a-counselor` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How to Pick a College Counselor — Red Flags",
    description: "How to evaluate private counselors: fair pricing, red flags, and what counselors do well vs. AI tools.",
    url: `${BASE}/how-to-pick-a-counselor`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Pick+a+College+Counselor&subtitle=Red+flags+%C2%B7+fair+pricing+%C2%B7+AI+vs+human`, width: 1200, height: 630, alt: "How to Pick a College Counselor" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "How to Pick a College Counselor", description: "Fair pricing, red flags, and what counselors do well vs. AI.", images: [`${BASE}/api/og?title=Pick+a+College+Counselor&subtitle=Red+flags+%C2%B7+fair+pricing+%C2%B7+AI+vs+human`] },
};

const RED_FLAGS = [
  { flag: "Guaranteed admission to any specific school", why: "No counselor can guarantee admission. Anyone who claims to is either lying or running a scam." },
  { flag: "Pressure-selling — 'sign now or lose this rate'", why: "Reputable counselors don't pressure-sell. Strong counselors are typically booked and don't need to discount or rush." },
  { flag: "$30K+ per package without explicit deliverable list", why: "Some counselors charge $30K-$70K. That price can be reasonable IF deliverables are clear and specific. Vague packages at this price tier are a major red flag." },
  { flag: "Ghostwriting essays for clients", why: "Most reputable counselors do not write your essay. A counselor who offers to 'fix' your essay by rewriting it for you is operating in a gray area that schools take very seriously when discovered." },
  { flag: "Does not have a clear process or methodology", why: "Strong counselors can articulate their approach: how they build a list, how they coach essays, how they communicate progress. Vague methodology = inconsistent work." },
  { flag: "Promises specific score outcomes from test prep", why: "Reasonable counselors can describe expected ranges; predicting specific scores is overpromising." },
  { flag: "No references from past clients", why: "Reputable counselors have past clients willing to vouch (with permission). No references = either new or has unhappy clients." },
  { flag: "Refuses to share their schools-counseled list or won't talk about specific outcomes", why: "Real counselors discuss their typical client outcomes (with appropriate privacy) and can talk about which schools they have experience with." },
];

const WHAT_COUNSELORS_DO_WELL = [
  "Strategic school list construction with knowledge of yield trends and institutional priorities.",
  "Calibrating essay drafts (NOT writing them) — a strong counselor reads 50-100 essays per year and has perspective.",
  "Course planning advice for sophomores and juniors who haven't decided on their academic direction.",
  "Family mediation when parents and students disagree about strategy.",
  "Process management — keeping deadlines tracked, materials organized, drafts iterating.",
  "Personal relationships at certain schools (some counselors have 20+ years of relationships with admissions offices).",
];

const WHAT_COUNSELORS_DONT_DO_WELL = [
  "Writing essays for you — most reputable counselors won't, and the ones who do put your application at risk.",
  "Guaranteeing admission. Calibrated counselors talk in probabilities, not promises.",
  "Replacing your effort. The work is yours; counselors guide and review.",
  "Improving your transcript or test scores. Those are functions of academic effort, not counseling.",
  "Knowing every school equally well — counselors have specialties.",
  "Fixing fundamental fit issues. If your spike doesn't match the schools, no counselor closes that gap.",
];

const QUESTIONS_TO_ASK = [
  "What's your methodology for building a college list?",
  "How many essays do you read per year? How many drafts do you typically work through with each student?",
  "Can I see a sample essay you've coached (with the student's permission)?",
  "Can you share 2-3 references from clients in the past 2 years?",
  "What schools do most of your clients apply to? Where have they been admitted?",
  "How do you handle disagreements between students and parents?",
  "What do you NOT do? (Listen for: 'we don't write essays' — that's a good answer.)",
  "How do you communicate progress? (Email cadence, weekly check-ins, parent updates?)",
  "What's your fee structure? Is it hourly, package, or commission-based?",
  "Are you a member of IECA, HECA, or NACAC? (Professional certifications signal accountability.)",
];

const FAIR_PRICING = [
  { tier: "Hourly consultations", rate: "Varies", note: "Useful for specific questions, essay reviews, or a school-list audit. Request the current hourly rate and cancellation policy in writing." },
  { tier: "Limited packages", rate: "Varies", note: "Compare the included hours, number of essay reviews, response times, and named deliverables." },
  { tier: "Full-service packages", rate: "Varies", note: "Confirm the service period, assigned counselor, meeting cadence, and what happens if staff changes." },
  { tier: "Boutique services", rate: "Varies", note: "Price alone is not a quality signal. Review credentials, references, methodology, and refund terms." },
];

const ALTERNATIVES = [
  { type: "Your school counselor", desc: "Free. Quality varies wildly. Best when relationships are built over multiple years; weaker for last-minute strategy." },
  { type: "Free online tools (AdmitPath, College Confidential, public CDS data)", desc: "Free. Calibrated probability, score targeting, list ideas. Limit: doesn't replace personalized 1-on-1 coaching for essays." },
  { type: "Paid AI planning tools (AdmitPath Pro)", desc: "$19.99/month. Seven-dimension scoring, planning estimates, personalized action plans, and essay feedback. It supplements rather than replaces human counseling." },
  { type: "Hourly subject-matter help", desc: "Targeted consultations on a specific essay, school list, or strategy question. Ask providers for current rates and written deliverables." },
  { type: "Free community resources", desc: "QuestBridge (for low-income high-achievers), Matriculate, Bottom Line, College Possible — free counseling for eligible applicants." },
];

const PAGE_FAQS = [
  { q: "Is a private college counselor worth the cost?", a: "It depends on your needs. A qualified counselor can add value through school-list strategy, essay coaching, and family mediation. Compare credentials, references, methodology, availability, and written deliverables rather than assuming price predicts outcomes." },
  { q: "How much does a private college counselor cost?", a: "Rates and packages vary widely by provider, location, service period, and scope. Request a current written quote that lists hours, deliverables, assigned staff, cancellation terms, and refund policy." },
  { q: "What are the red flags when hiring a college counselor?", a: "Walk away if they guarantee admission to specific schools, pressure-sell with urgency tactics, offer to ghostwrite essays, charge high fees without clear deliverables, have no references from past clients, or promise specific test score outcomes." },
  { q: "What free alternatives exist to private college counselors?", a: "Your school counselor (free), QuestBridge (free for low-income high-achievers), Matriculate and College Possible (free for eligible applicants), AI tools like AdmitPath (free tier available), and community organizations (Rotary, NACAC). These collectively cover most of what a private counselor provides." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/how-to-pick-a-counselor#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "How to Pick a College Counselor", item: `${BASE}/how-to-pick-a-counselor` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/how-to-pick-a-counselor#page`,
      url: `${BASE}/how-to-pick-a-counselor`,
      name: "How to Pick a College Counselor — Avoiding Pitfalls",
      description: "Comprehensive guide on evaluating private college counselors: red flags, fair pricing, what they do well versus not, and free/lower-cost alternatives.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/how-to-pick-a-counselor#breadcrumb` },
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

export default function HowToPickACounselorPage() {
  return (
    <MarketingLayout
      eyebrow="Counselor evaluation"
      title="How to Pick a College Counselor"
      description="If you've decided to hire a private counselor, here's how to evaluate the options honestly. The red flags that should make you walk away. What fair pricing actually looks like. And the free or lower-cost alternatives many families don't consider."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Red flags */}
      <Section title="8 red flags to walk away from" Icon={AlertTriangle}>
        <div className="space-y-3">
          {RED_FLAGS.map((r, i) => (
            <article
              key={i}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {r.flag}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {r.why}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* What counselors actually do */}
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            <CheckCircle2 className="h-4 w-4" style={{ color: "#4A6FA5" }} />
            What counselors do well
          </h3>
          <ul className="space-y-2">
            {WHAT_COUNSELORS_DO_WELL.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A6FA5" }} />
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
            What they don&apos;t do well
          </h3>
          <ul className="space-y-2">
            {WHAT_COUNSELORS_DONT_DO_WELL.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Questions to ask */}
      <Section title="10 questions to ask before signing" Icon={Search}>
        <ol className="space-y-2">
          {QUESTIONS_TO_ASK.map((q, i) => (
            <li key={i} className="flex items-start gap-3 text-[14.5px] leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Fair pricing */}
      <Section title="What fair pricing looks like" Icon={DollarSign} description="US private college counseling pricing as of 2026. Quality and value vary wildly within each tier — price alone is not a quality signal.">
        <div className="space-y-3">
          {FAIR_PRICING.map((p) => (
            <article
              key={p.tier}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <header className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {p.tier}
                </h3>
                <span className="ml-auto text-[14px] font-semibold" style={{ color: "#4A6FA5" }}>
                  {p.rate}
                </span>
              </header>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.note}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Alternatives */}
      <Section title="Free and lower-cost alternatives" Icon={Users}>
        <div className="space-y-3">
          {ALTERNATIVES.map((a) => (
            <article
              key={a.type}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="mb-1 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                {a.type}
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {a.desc}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Honest framing */}
      <section
        className="mb-12 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
      >
        <h2
          className="mb-3 text-[20px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Honest framing
        </h2>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Strong private counselors are real and add real value, especially
          for families who need sustained guidance over 18-24 months,
          family mediation, or established relationships at specific
          schools.
        </p>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          The right level of support depends on the student. A school
          counselor, structured planning tools such as AdmitPath, community
          programs, and targeted consultations can be combined based on need.
          No tool or service can guarantee an admissions outcome.
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
        headline="Compare AdmitPath against private counseling."
        description="Review the current product scope, limits, and places where qualified human counseling provides support software cannot. Free plan included. Pro is $19.99/month."
        buttonText="See the comparison"
        buttonHref="/vs-college-counselor"
      />
    </MarketingLayout>
  );
}
