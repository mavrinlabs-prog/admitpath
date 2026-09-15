import Link from "next/link";
import type { Metadata } from "next";
import {
  Award,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Rankings Explained (2026)",
  description:
    "What US News, Forbes, and Niche college rankings actually measure, methodology flaws, and how to use rankings in your college search.",
  alternates: { canonical: `${BASE}/college-rankings-explained` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Rankings Explained — What They Measure",
    description: "What college rankings actually measure, methodology critiques, and how to use them in your search.",
    url: `${BASE}/college-rankings-explained`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=College+Rankings+Explained&subtitle=What+they+measure+and+what+they+miss`, width: 1200, height: 630, alt: "College Rankings Explained" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Rankings Explained", description: "What college rankings actually measure and how to use them.", images: [`${BASE}/api/og?title=College+Rankings+Explained&subtitle=What+they+measure+and+what+they+miss`] },
};

type Ranking = {
  name: string;
  publisher: string;
  who: string;
  weight: { factor: string; weight: string }[];
  whatItMeasures: string;
  caveats: string[];
  url: string;
};

const RANKINGS: Ranking[] = [
  {
    name: "US News & World Report — Best National Universities",
    publisher: "U.S. News",
    who: "American students choosing among national universities",
    weight: [
      { factor: "Graduation & retention rates", weight: "20%" },
      { factor: "Pell graduation rates & social mobility", weight: "11%" },
      { factor: "Faculty salaries", weight: "9%" },
      { factor: "Class size", weight: "8%" },
      { factor: "Financial resources per student", weight: "8%" },
      { factor: "Alumni giving rate (removed in 2024)", weight: "0%" },
      { factor: "Citation impact (research)", weight: "6%" },
      { factor: "First-generation graduation rate", weight: "5%" },
      { factor: "Other (debt at graduation, peer assessment)", weight: "33%" },
    ],
    whatItMeasures: "A weighted composite of graduation outcomes, instructional resources, and reputational survey results. Heavily favors well-funded private universities with high graduation rates.",
    caveats: [
      "Methodology has changed substantially since 2023 (added social mobility weights, removed alumni giving). Prior-year ranks aren't directly comparable.",
      "Peer-assessment surveys are filled out by other school presidents and deans — circular.",
      "Doesn't measure undergraduate teaching quality directly.",
      "Schools have been caught (and admitted to) gaming inputs: misreporting class sizes, SAT ranges, financial data.",
    ],
    url: "https://www.usnews.com/best-colleges",
  },
  {
    name: "US News & World Report — Best Liberal Arts Colleges",
    publisher: "U.S. News",
    who: "Students considering small, undergraduate-focused colleges",
    weight: [
      { factor: "Same methodology as National Universities, applied to LACs", weight: "Same" },
    ],
    whatItMeasures: "Same composite as national universities. Williams, Amherst, and Swarthmore consistently top this list.",
    caveats: [
      "Same caveats apply.",
      "The 'liberal arts college' definition (small, undergraduate-focused, residential) is narrower than students assume — military academies, women's colleges, and HBCUs are ranked separately.",
    ],
    url: "https://www.usnews.com/best-colleges/rankings/national-liberal-arts-colleges",
  },
  {
    name: "QS World University Rankings",
    publisher: "Quacquarelli Symonds (UK)",
    who: "International students; useful for cross-border comparisons",
    weight: [
      { factor: "Academic reputation (peer survey)", weight: "30%" },
      { factor: "Employer reputation (employer survey)", weight: "15%" },
      { factor: "Citations per faculty", weight: "20%" },
      { factor: "Faculty/student ratio", weight: "10%" },
      { factor: "International faculty ratio", weight: "5%" },
      { factor: "International students ratio", weight: "5%" },
      { factor: "Sustainability + employment outcomes + international research network", weight: "15%" },
    ],
    whatItMeasures: "Heavily weighted toward research output and reputation among academics and employers. Massive bias toward universities with strong research and large international footprints.",
    caveats: [
      "45% of the score comes from two reputational surveys with documented response biases.",
      "Favors large research universities; undergraduate experience is barely measured.",
      "Best used to identify well-known universities globally, not to compare two close peers.",
    ],
    url: "https://www.topuniversities.com",
  },
  {
    name: "Times Higher Education World University Rankings",
    publisher: "Times Higher Education (UK)",
    who: "Students considering both U.S. and international universities",
    weight: [
      { factor: "Teaching environment (incl. reputation, staff/student, doctorate ratios)", weight: "29.5%" },
      { factor: "Research environment", weight: "29%" },
      { factor: "Citations (research influence)", weight: "30%" },
      { factor: "International outlook", weight: "7.5%" },
      { factor: "Industry income", weight: "4%" },
    ],
    whatItMeasures: "60% weighted toward research metrics. Best at identifying world-class research universities; weak at evaluating undergraduate teaching.",
    caveats: [
      "Citations metric favors STEM-heavy universities over liberal arts colleges.",
      "Liberal arts colleges (Williams, Amherst, Pomona) are usually unranked — they don't generate the citation volume.",
    ],
    url: "https://www.timeshighereducation.com",
  },
  {
    name: "Forbes — America's Top Colleges",
    publisher: "Forbes",
    who: "Outcomes-focused students and parents",
    weight: [
      { factor: "Alumni salary (PayScale data)", weight: "20%" },
      { factor: "Debt", weight: "15%" },
      { factor: "Return on investment", weight: "15%" },
      { factor: "Graduation rate", weight: "15%" },
      { factor: "Forbes American Leaders List (alumni success)", weight: "15%" },
      { factor: "Retention rate", weight: "10%" },
      { factor: "Academic success (Rhodes, NSF, etc.)", weight: "10%" },
    ],
    whatItMeasures: "Outcomes-driven rankings. Heavy emphasis on salary and ROI vs U.S. News' inputs-focused approach.",
    caveats: [
      "Salary data heavily favors STEM and finance-pipeline schools.",
      "Doesn't account for selection bias (Stanford grads earn more partly because Stanford admits high-earning-trajectory students).",
      "ROI calculation favors schools with strong financial aid (which lowers the cost denominator).",
    ],
    url: "https://www.forbes.com/top-colleges",
  },
  {
    name: "Niche — Best Colleges in America",
    publisher: "Niche.com",
    who: "Students who want crowd-sourced student/parent reviews",
    weight: [
      { factor: "Academic grade (33%)", weight: "33%" },
      { factor: "Student life (10%)", weight: "10%" },
      { factor: "Diversity (8%)", weight: "8%" },
      { factor: "Value (10%)", weight: "10%" },
      { factor: "Other categories (admissions, campus, athletics, etc.)", weight: "39%" },
    ],
    whatItMeasures: "Combines federal data with student/parent surveys. More accessible than U.S. News for vibes, less rigorous on outcomes.",
    caveats: [
      "User reviews are self-selected and skew positive at small schools, mixed at large schools.",
      "Student-survey results can be gamed by mobilizing campus.",
      "Best used for qualitative information (student life, vibe, location), not as a definitive ranking.",
    ],
    url: "https://www.niche.com",
  },
];

const HOW_TO_USE = [
  {
    do: "Use rankings to identify the universe of plausible schools — schools you might not have heard of that share characteristics with schools you know",
    dont: "Don't use rankings to pick between Brown and Penn. The two-spot difference is methodological noise.",
  },
  {
    do: "Cross-reference multiple rankings. If a school is top 30 across U.S. News, Forbes, and Niche, that's signal. If it's #25 on one and #80 on another, that's noise.",
    dont: "Don't pick the school that ranks higher on the methodology that flatters it.",
  },
  {
    do: "Look at outcomes data directly: graduation rate, employment rate, median earnings 6 years after enrollment (College Scorecard data).",
    dont: "Don't trust salary numbers from PayScale or LinkedIn — heavy self-selection bias.",
  },
  {
    do: "Look at financial aid data: published need-met %, average debt at graduation, median net price by income band.",
    dont: "Don't use 'sticker price' from rankings — most students don't pay it.",
  },
  {
    do: "Read methodology pages. Each ranking publisher posts theirs. The 5 minutes you spend reading reveals what each ranking actually measures.",
    dont: "Don't assume rankings measure 'best.' They measure what their methodology measures.",
  },
];

const RANKINGS_FAQS = [
  { q: "Are college rankings accurate?", a: "Rankings measure what their methodology measures -- graduation rates, research output, reputation surveys, and financial resources. They do not measure teaching quality, student satisfaction, or fit for any individual student. Use them to discover schools, not to decide between them." },
  { q: "Should I pick a higher-ranked school over a lower-ranked one?", a: "Not necessarily. A two-spot difference (e.g., #12 vs #14) is methodological noise. Focus on fit, financial aid, program strength in your intended major, and campus culture. The data consistently shows that what you do at college matters more than which college you attend." },
  { q: "Why do rankings differ so much between publishers?", a: "Each publisher uses different methodologies and weights. US News emphasizes graduation rates and peer surveys. Forbes emphasizes salary and ROI. QS emphasizes research citations. The same school can be #10 on one list and #40 on another." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-rankings-explained#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "College Rankings Explained", item: `${BASE}/college-rankings-explained` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-rankings-explained#page`,
      url: `${BASE}/college-rankings-explained`,
      name: "College Rankings Explained — What US News, QS, Forbes Actually Measure",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-rankings-explained#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/college-rankings-explained#article` },
    },
    {
      "@type": "Article",
      "@id": `${BASE}/college-rankings-explained#article`,
      headline: "College Rankings Explained — What US News, QS, Forbes Actually Measure",
      description:
        "An honest breakdown of what college rankings actually measure, methodology critiques, and how to use them strategically.",
      datePublished: "2026-05-05",
      dateModified: "2026-05-14",
      author: { "@id": `${BASE}/about#editorial-team` },
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: RANKINGS_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function CollegeRankingsExplainedPage() {
  return (
    <MarketingLayout
      eyebrow="Rankings Guide"
      title="College Rankings, Explained"
      description="An honest breakdown of what each major ranking actually measures, the methodology critiques you should know about, and how to use rankings as one input — not the input."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top callout */}
      <div
        className="mb-12 rounded-xl border p-5"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
      >
        <p
          className="mb-2 flex items-center gap-2 text-[14px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          <Info className="h-4 w-4" style={{ color: "#4A6FA5" }} />
          The honest summary up front
        </p>
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          College rankings are not measuring &quot;best.&quot; They are
          measuring whatever their methodology measures, weighted however the
          publisher chose, with inputs the schools sometimes have incentives
          to game. Rankings are useful for identifying schools you might not
          know about and for sanity-checking your assumptions. They are not a
          decision-making tool for picking between similar schools.
        </p>
      </div>

      {/* Rankings cards */}
      {RANKINGS.map((r) => (
        <article
          key={r.name}
          className="dl-card-hover mb-12 rounded-2xl border p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Award className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            <h2
              className="text-[18px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              {r.name}
            </h2>
          </div>
          <p className="mb-4 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Published by {r.publisher} · Best for: {r.who}
          </p>

          <p
            className="mb-5 text-[14px] leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
          >
            {r.whatItMeasures}
          </p>

          {/* Methodology weights */}
          <div className="mb-5">
            <p
              className="mb-2 text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              Methodology weights
            </p>
            <div
              className="overflow-hidden rounded-lg border"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <table className="w-full text-left text-[12px]">
                <tbody>
                  {r.weight.map((w, i) => (
                    <tr
                      key={i}
                      className="border-t first:border-t-0"
                      style={{ borderColor: "rgba(0,0,0,0.06)" }}
                    >
                      <td className="px-3 py-2" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{w.factor}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{w.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Caveats */}
          <div>
            <p
              className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "#DC2626" }}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              What to know about it
            </p>
            <ul className="space-y-1.5">
              {r.caveats.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: "#DC2626" }} />
                  <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}

      {/* How to use */}
      <section className="mb-14">
        <h2
          className="mb-5 text-[20px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          How to use rankings (and how not to)
        </h2>
        <div className="space-y-4">
          {HOW_TO_USE.map((h, i) => (
            <div
              key={i}
              className="dl-card-hover grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border p-4"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
            >
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#16A34A" }}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Do
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{h.do}</p>
              </div>
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#DC2626" }}>
                  <XCircle className="h-3.5 w-3.5" />
                  Don&apos;t
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{h.dont}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-14">
        <h2
          className="mb-5 text-[20px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {RANKINGS_FAQS.map(({ q, a }) => (
            <details key={q} className="dl-card-hover rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}>
              <summary className="cursor-pointer font-bold text-base" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{q}</summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related resources */}
      <section className="mb-10">
        <h2
          className="mb-3 text-[17px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
        >
          Related resources
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/college-list-builder"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            College List Builder
          </Link>
          <Link
            href="/methodology"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            AdmitPath Methodology
          </Link>
          <Link
            href="/compare"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Compare Colleges
          </Link>
          <Link
            href="/admissions-statistics-2026"
            className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
          >
            2026 Admissions Statistics
          </Link>
        </div>
      </section>

      {/* CTA */}
      <MarketingCTA
        headline="Build a rankings-aware college list"
        description="AdmitPath calibrates your odds against real admissions data -- not just ranking position."
        buttonText="Take the chances quiz"
        buttonHref="/quiz"
      />
    </MarketingLayout>
  );
}
