import type { Metadata } from "next";
import {
  Star,
  GraduationCap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Honors Colleges Explained",
  description:
    "Honors colleges at top public universities: Schreyer, Barrett, Echols, and 15+ others. What they offer, who fits, and the honest tradeoffs.",
  alternates: { canonical: `${BASE}/honors-college-explained` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Honors Colleges Explained",
    description: "Schreyer, Barrett, Echols, and 15+ honors programs: what they offer, who fits, and honest tradeoffs.",
    url: `${BASE}/honors-college-explained`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Honors+Colleges+Explained&subtitle=Programs+%C2%B7+benefits+%C2%B7+tradeoffs`, width: 1200, height: 630, alt: "Honors Colleges Explained" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Honors Colleges Explained", description: "Schreyer, Barrett, Echols, and 15+ others. What they offer and who fits.", images: [`${BASE}/api/og?title=Honors+Colleges+Explained&subtitle=Programs+%C2%B7+benefits+%C2%B7+tradeoffs`] },
};

const TOP_PROGRAMS = [
  { name: "Schreyer Honors College", school: "Penn State", admits: "~300/year", strengths: "Strong research culture, $4K honors thesis grant, dedicated honors housing, smaller honors-only seminars." },
  { name: "Barrett, the Honors College", school: "Arizona State University", admits: "~1,500/year", strengths: "Largest honors college in US, excellent merit aid often making cost lower than in-state alternatives, residential community of 6,000+ honors students." },
  { name: "Echols Scholars Program", school: "UVA", admits: "~250/year", strengths: "No major required for first 2 years, no general education requirements, priority registration. Highly selective for in-state and out-of-state." },
  { name: "Honors College", school: "University of Pittsburgh", admits: "~500/year", strengths: "Strong pre-med pipeline, Pitt-specific honors classes, generous merit aid, urban Pittsburgh location with research hospital access." },
  { name: "Park Scholarships", school: "NC State", admits: "~40/year", strengths: "Full ride for out-of-state students. Highly selective. Leadership development focus." },
  { name: "Robertson Scholars Leadership Program", school: "UNC + Duke", admits: "~40/year", strengths: "Full scholarship; cross-enrollment between UNC and Duke; structured leadership development. Highly selective." },
  { name: "Morehead-Cain Scholarship", school: "UNC", admits: "~70/year", strengths: "Full ride, summer enrichment funding, leadership focus, alumni network." },
  { name: "Macaulay Honors College", school: "CUNY (multiple campuses)", admits: "~500/year", strengths: "Free tuition for NY residents, MacBook included, NYC cultural access, choice of CUNY campus." },
  { name: "Honors College", school: "University of South Carolina", admits: "~600/year", strengths: "Top-ranked among public university honors colleges, generous merit aid, Capstone Scholars program." },
  { name: "Hutton Honors College", school: "Indiana University", admits: "~1,200/year", strengths: "Honors-only courses, dedicated advising, summer research grants, broad strength across majors." },
  { name: "Plan II Honors", school: "UT Austin", admits: "~175/year", strengths: "Liberal arts honors curriculum (different from rest of UT), small classes, intellectually rigorous, in-state value." },
  { name: "Honors College", school: "University of Maryland", admits: "~3,000/year", strengths: "Multiple honors paths (University Honors, Gemstone, Design Cultures and Creativity), DC-area access, strong CS pipeline." },
  { name: "Banneker/Key Scholarship", school: "University of Maryland", admits: "~50/year", strengths: "Full ride for top admits regardless of residency. Highly selective." },
  { name: "Honors Tutorial College", school: "Ohio University", admits: "~50/year", strengths: "Oxford-style 1-on-1 tutorials with faculty, customized curriculum, full tuition typically covered." },
  { name: "Honors College", school: "Purdue", admits: "~500/year", strengths: "Strong engineering/CS pipeline, dedicated honors residential complex, capstone honors thesis." },
];

const BENEFITS = [
  "Smaller honors-only seminars (often 12-20 students vs 100+ in regular sections).",
  "Priority class registration — easier to get into specific courses and avoid scheduling conflicts.",
  "Honors-only or honors-priority housing, often newer or better-located dorms.",
  "Dedicated advising, often with smaller advisor-to-student ratios.",
  "Honors thesis or research project requirement, often with funding.",
  "Honors scholarships — many honors colleges include automatic merit aid.",
  "Networking with high-achieving peers (the strongest single benefit at many programs).",
  "Resume and grad-school application credential — 'University Honors' on the transcript.",
  "Sometimes additional perks: study abroad funding, honors-only events, honors center access.",
];

const TRADEOFFS = [
  "Higher GPA requirement to maintain honors status (often 3.5+; some 3.7+). Falling below means losing honors status.",
  "Honors thesis or research requirement adds workload your senior year.",
  "More structured curriculum may limit course flexibility — some honors colleges require specific honors courses each year.",
  "Smaller social pool than the broader university — some students find honors residential communities insular.",
  "Pressure of high-achieving peer environment can be stressful.",
  "Some honors programs are less rigorous than they sound — research the actual program before deciding.",
];

const WHO_FITS = [
  "Students admitted to a strong honors college that's significantly cheaper than a private alternative.",
  "Students who thrive on the academic culture of high-achieving peers.",
  "Students with clear academic goals (research, grad school, professional school) where the honors thesis adds value.",
  "Students who would benefit from priority registration and dedicated advising.",
  "Students for whom the merit aid in honors makes a quality 4-year experience financially possible.",
];

const WHO_DOESNT_FIT = [
  "Students who would feel boxed in by structured honors curriculum requirements.",
  "Students who plan to focus their college time on extracurriculars or internships rather than academics.",
  "Students whose intended major has weak departmental support at the school (the honors college doesn't fix that).",
  "Students who would graduate with similar opportunities and outcomes from regular admit at the same school.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/honors-college-explained#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Honors Colleges Explained", item: `${BASE}/honors-college-explained` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/honors-college-explained#page`,
      url: `${BASE}/honors-college-explained`,
      name: "Honors Colleges Explained — Top Programs, Benefits, Tradeoffs",
      description: "Honors colleges at top public universities offer Ivy-quality academics with significant merit aid. Comprehensive guide to 15+ top programs, benefits, tradeoffs, and fit considerations.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/honors-college-explained#breadcrumb` },
      inLanguage: "en-US",
    },
    {
      "@type": "ItemList",
      "@id": `${BASE}/honors-college-explained#list`,
      name: "Top Honors Colleges",
      description: "15+ top honors colleges at US public universities with admit numbers and program strengths.",
      numberOfItems: TOP_PROGRAMS.length,
      itemListElement: TOP_PROGRAMS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${p.name} at ${p.school}`,
        description: p.strengths,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is an honors college?", acceptedAnswer: { "@type": "Answer", text: "An honors college is a selective program within a larger university (usually public) that offers smaller classes, dedicated faculty, priority registration, special housing, research opportunities, and often significant merit scholarships. Examples include Schreyer at Penn State, Barrett at ASU, and Echols at UVA." } },
        { "@type": "Question", name: "Are honors colleges worth it?", acceptedAnswer: { "@type": "Answer", text: "Yes, especially for students choosing between a top private at full price and an honors college with merit aid. Honors colleges offer Ivy-quality academics (small seminars, faculty access, research) at a fraction of the cost. For students choosing between regular and honors admission at the same school, honors is almost always the better choice." } },
        { "@type": "Question", name: "How do you get into an honors college?", acceptedAnswer: { "@type": "Answer", text: "Most honors colleges require a separate application or invitation based on GPA and test scores. Some auto-admit based on stats (Barrett at ASU, Echols at UVA). Others require essays and interviews (Schreyer at Penn State). Typical admit profiles: 3.8+ GPA, 1400+ SAT or 32+ ACT, though this varies significantly by program." } },
      ],
    },
  ],
};

const PAGE_FAQS = [
  { q: "What is an honors college?", a: "An honors college is a selective program within a larger university (usually public) that offers smaller classes, dedicated faculty, priority registration, special housing, research opportunities, and often significant merit scholarships. Examples include Schreyer at Penn State, Barrett at ASU, and Echols at UVA." },
  { q: "Are honors colleges worth it?", a: "Yes, especially for students choosing between a top private at full price and an honors college with merit aid. Honors colleges offer Ivy-quality academics (small seminars, faculty access, research) at a fraction of the cost. For students choosing between regular and honors admission at the same school, honors is almost always the better choice." },
  { q: "How do you get into an honors college?", a: "Most honors colleges require a separate application or invitation based on GPA and test scores. Some auto-admit based on stats (Barrett at ASU, Echols at UVA). Others require essays and interviews (Schreyer at Penn State). Typical admit profiles: 3.8+ GPA, 1400+ SAT or 32+ ACT, though this varies significantly by program." },
];

export default function HonorsCollegeExplainedPage() {
  return (
    <MarketingLayout
      eyebrow="Public University Strategy"
      title="Honors Colleges Explained"
      description="Honors colleges at top public universities can offer Ivy-quality academics — small seminars, dedicated advising, research funding — at a fraction of the cost. Here's how to evaluate them, the 15+ programs worth knowing, and the honest tradeoffs."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* What an honors college actually is */}
      <Section title="What an honors college actually is" Icon={GraduationCap}>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          An honors college is a separate, more selective program within a
          larger university. Admitted students take honors-only seminars,
          often live in dedicated housing, get priority registration, and
          usually complete an honors thesis. At top programs, the
          experience can rival small private colleges — at significantly
          lower cost.
        </p>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Admit selectivity varies dramatically: Park Scholarships at NC
          State admit ~40 students/year (more selective than most
          Ivies); Barrett at ASU admits ~1,500/year (less selective but
          still significantly stronger than ASU&apos;s general admission).
        </p>
      </Section>

      {/* Top programs */}
      <Section title="Top honors programs to know" Icon={Star}>
        <p className="mb-4 text-[14px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          Listed alphabetically by program name. Admit numbers approximate.
        </p>
        <div className="space-y-3">
          {TOP_PROGRAMS.map((p) => (
            <article
              key={`${p.name}-${p.school}`}
              className="dl-card-hover rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <header className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {p.name}
                </h3>
                <span className="text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  · {p.school}
                </span>
                <span className="ml-auto text-[12px] font-medium" style={{ color: "#4A6FA5" }}>
                  {p.admits}
                </span>
              </header>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {p.strengths}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section title="Benefits at strong honors colleges" Icon={CheckCircle2}>
        <ul className="space-y-2">
          {BENEFITS.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{b}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Tradeoffs */}
      <Section title="Honest tradeoffs" Icon={XCircle}>
        <ul className="space-y-2">
          {TRADEOFFS.map((t, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-relaxed">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Who fits */}
      <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <h3 className="mb-3 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Who fits an honors college
          </h3>
          <ul className="space-y-2">
            {WHO_FITS.map((w, i) => (
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
          <h3 className="mb-3 text-[15px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Who doesn&apos;t fit
          </h3>
          <ul className="space-y-2">
            {WHO_DOESNT_FIT.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The honest comparison */}
      <section
        className="mb-12 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
      >
        <h2
          className="mb-3 text-[20px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          The honest comparison
        </h2>
        <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          For students admitted to a top private college (Yale, Penn, Cornell) AND a top honors college (Schreyer, Barrett, Echols), the choice depends on cost and culture. The honors college experience at Penn State Schreyer or UNC&apos;s Morehead-Cain is genuinely comparable to the academic experience at a top private — without the price tag.
        </p>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          For students choosing between regular admission at a state school and honors admission at the same school: honors is almost always the better choice. The marginal academic and resource benefits compound across 4 years.
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
        headline="Surface honors college fits in your list."
        description="AdmitPath finds honors colleges aligned with your stats and major — often at significantly lower cost than your private alternatives. Free plan included. Pro $19.99/mo."
        buttonText="Find honors fits"
      />
    </MarketingLayout>
  );
}
