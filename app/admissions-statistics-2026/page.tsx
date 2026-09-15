import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BarChart3, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Admissions Statistics 2026 — Rates & Trends",
  description:
    "2025-26 admissions statistics: admit rates at top schools, application volume trends, ED/EA splits, demographic shifts, and key data points.",
  alternates: { canonical: `${BASE}/admissions-statistics-2026` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Admissions Statistics 2026 — Rates & Trends",
    description: "2025-26 admissions statistics: admit rates, application volume trends, ED/EA splits, and demographic shifts.",
    url: `${BASE}/admissions-statistics-2026`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Admissions+Statistics+2026&subtitle=Rates+%C2%B7+trends+%C2%B7+ED%2FEA+splits`, width: 1200, height: 630, alt: "Admissions Statistics 2026" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Admissions Statistics 2026 — Rates & Trends", description: "Admit rates, application volume trends, ED/EA splits at top schools.", images: [`${BASE}/api/og?title=Admissions+Statistics+2026&subtitle=Rates+%C2%B7+trends+%C2%B7+ED%2FEA+splits`] },
};

type AdmitRow = {
  school: string;
  overall: string;
  ed: string;
  ea: string;
  applications: string;
  trend: "up" | "down" | "flat";
};

// Data sources: each school's published Class of 2029 (or most recent) admissions data
// from their Common Data Set Section C, press releases, and admissions blogs.
const ADMIT_TABLE: AdmitRow[] = [
  { school: "Harvard", overall: "3.6%", ed: "—", ea: "8.3% (REA)", applications: "54,008", trend: "down" },
  { school: "Yale", overall: "4.5%", ed: "—", ea: "9.4% (REA)", applications: "57,465", trend: "up" },
  { school: "Princeton", overall: "4.5%", ed: "—", ea: "10.1% (REA)", applications: "39,644", trend: "flat" },
  { school: "Stanford", overall: "3.7%", ed: "—", ea: "—", applications: "53,733", trend: "up" },
  { school: "MIT", overall: "4.5%", ed: "—", ea: "5.1% (EA)", applications: "28,232", trend: "up" },
  { school: "Caltech", overall: "3.3%", ed: "—", ea: "—", applications: "13,026", trend: "down" },
  { school: "Columbia", overall: "3.9%", ed: "11.0%", ea: "—", applications: "60,248", trend: "down" },
  { school: "Penn", overall: "5.4%", ed: "12.9%", ea: "—", applications: "65,236", trend: "flat" },
  { school: "Brown", overall: "5.1%", ed: "13.9%", ea: "—", applications: "51,302", trend: "up" },
  { school: "Dartmouth", overall: "5.3%", ed: "17.0%", ea: "—", applications: "31,656", trend: "up" },
  { school: "Cornell", overall: "7.5%", ed: "21.0%", ea: "—", applications: "67,846", trend: "flat" },
  { school: "Duke", overall: "6.0%", ed: "13.4%", ea: "—", applications: "54,194", trend: "up" },
  { school: "Northwestern", overall: "7.0%", ed: "20.0%", ea: "—", applications: "50,047", trend: "flat" },
  { school: "UChicago", overall: "5.0%", ed: "—", ea: "—", applications: "38,800", trend: "up" },
  { school: "Vanderbilt", overall: "6.7%", ed: "16.6%", ea: "—", applications: "47,022", trend: "flat" },
  { school: "Notre Dame", overall: "11.3%", ed: "—", ea: "16.0% (REA)", applications: "30,084", trend: "up" },
  { school: "UCLA", overall: "8.6%", ed: "—", ea: "—", applications: "146,279", trend: "up" },
  { school: "Berkeley", overall: "11.1%", ed: "—", ea: "—", applications: "128,191", trend: "up" },
  { school: "Michigan", overall: "17.7%", ed: "—", ea: "30.0% (EA)", applications: "98,113", trend: "up" },
  { school: "Williams", overall: "8.5%", ed: "29.0%", ea: "—", applications: "12,963", trend: "down" },
  { school: "Amherst", overall: "9.2%", ed: "27.7%", ea: "—", applications: "13,839", trend: "flat" },
  { school: "Pomona", overall: "6.8%", ed: "16.6%", ea: "—", applications: "11,985", trend: "up" },
];

const TRENDS = [
  {
    title: "Application volume continues to climb",
    body: "Top schools have seen 30-50% application growth since 2019. Harvard went from ~43K to ~54K. UCLA from ~110K to ~146K. The Common App ecosystem makes it cheaper to apply to more schools, and selective schools' brand visibility grew during pandemic-era media coverage. Practical effect: even with similar credentials, your odds at top schools are lower than they were 5 years ago.",
  },
  {
    title: "ED admit rates are 2-3x higher than RD at top schools",
    body: "Brown ED 13.9% vs RD ~3-4%. Penn ED 12.9% vs RD ~4-5%. Cornell ED 21% vs RD ~5-7%. The boost is real but partly self-selecting — ED applicants are stronger on average. The honest read: ED matters most when you have a clear top choice you'd attend regardless of aid comparisons.",
  },
  {
    title: "Test-optional policies are rolling back fast",
    body: "The test-optional era is ending at top schools. As of the 2025-26 cycle, Yale, Brown, Cornell, and Dartmouth have reinstated test requirements, joining MIT, Caltech, and Georgetown. Harvard, Princeton, Stanford, Penn, and Columbia remain test-optional but strongly favor score submitters. The trend is clear: expect more schools to re-require scores for 2027.",
  },
  {
    title: "Demographic shifts post-SCOTUS",
    body: "After the 2023 ruling banning race-conscious admissions, the Class of 2028 saw modest decreases in Black and Latino enrollment at most Ivies and modest increases in Asian American enrollment. Magnitude varied by school — Yale and Princeton saw smaller shifts than MIT. Most schools attribute their relative demographic stability to changes in essay supplements that emphasize identity and lived experience.",
  },
  {
    title: "Yield rates determine waitlist activity",
    body: "Yield (the % of admits who enroll) is more variable than ever. When schools over-yield, waitlists don't move. When they under-yield, waitlists move. Recent years: 2023 saw heavy waitlist movement at top schools (yield surprises after pandemic-era admit pool); 2024 was more normal; 2025 is mixed. Don't plan around waitlist movement — it's noise.",
  },
  {
    title: "First-gen admit rates are rising",
    body: "Several Ivies have publicly increased first-gen recruiting. Brown reported 19% of admitted Class of 2028 was first-gen — up from 13% in 2022. Princeton reports similar. The post-SCOTUS focus on socioeconomic and first-gen factors has accelerated this trend. If you're first-gen, the data says applying to top schools is a stronger play than it was 5 years ago.",
  },
];

const KEY_TAKEAWAYS = [
  "Apply to enough schools (8-12) to absorb statistical variance.",
  "Apply ED to your true first choice if you can afford it without comparing aid.",
  "Submit test scores if you have them. Yale, Brown, Cornell, Dartmouth, MIT, and Caltech now require them. At test-optional schools, submit if at or above the school's median.",
  "Don't game demographics — but if you're first-gen or from an under-represented background, top-tier admissions is a stronger play than the headline rates suggest.",
  "Don't plan around waitlist movement — commit to your best admit by May 1.",
  "Volume is rising; your odds at top schools are lower than 5 years ago. This isn't a personal failing — it's the math.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/admissions-statistics-2026#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Admissions Statistics 2026", item: `${BASE}/admissions-statistics-2026` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/admissions-statistics-2026#page`,
      url: `${BASE}/admissions-statistics-2026`,
      name: "College Admissions Statistics 2026",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/admissions-statistics-2026#breadcrumb` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/admissions-statistics-2026#dataset` },
    },
    {
      "@type": "Dataset",
      "@id": `${BASE}/admissions-statistics-2026#dataset`,
      name: "Top US College Admissions Statistics 2025-26",
      description:
        "Admit rates, ED/EA splits, application volume, and yield data for top US colleges, drawn from each school's published Common Data Set and admissions reports.",
      keywords: ["college admissions", "admit rates", "early decision", "test optional", "first-gen admissions"],
      datePublished: "2026-05-07",
      dateModified: "2026-05-07",
      creator: { "@id": `${BASE}/about#editorial-team` },
      isAccessibleForFree: true,
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the average college acceptance rate in 2026?", acceptedAnswer: { "@type": "Answer", text: "Average acceptance rates vary dramatically by tier. Ivy-plus schools range from 3.3% (Caltech) to 7.5% (Cornell). Top-20 schools range from 5-10%. Top-50 schools range from 10-25%. State flagships range from 25-75% depending on the state." } },
        { "@type": "Question", name: "Does applying Early Decision increase my chances?", acceptedAnswer: { "@type": "Answer", text: "Yes. ED admit rates are typically 1.5-3x higher than Regular Decision rates. For example, Columbia admits about 11% ED vs 3.9% overall. However, ED is binding -- you must attend if admitted. Apply ED only to a school you'd attend over all others, and verify financial fit first." } },
        { "@type": "Question", name: "Are college acceptance rates getting lower?", acceptedAnswer: { "@type": "Answer", text: "At most top schools, yes. Application volumes have increased steadily due to the Common App making it easy to apply to more schools, growing international demand, and (until recently) test-optional policies. As schools reinstate test requirements, volumes may stabilize, but the structural trend is unlikely to reverse." } },
      ],
    },
  ],
};

const PAGE_FAQS = [
  { q: "What is the average college acceptance rate in 2026?", a: "Average acceptance rates vary dramatically by tier. Ivy-plus schools range from 3.3% (Caltech) to 7.5% (Cornell). Top-20 schools range from 5-10%. Top-50 schools range from 10-25%. State flagships range from 25-75% depending on the state." },
  { q: "Does applying Early Decision increase my chances?", a: "Yes. ED admit rates are typically 1.5-3x higher than Regular Decision rates. For example, Columbia admits about 11% ED vs 3.9% overall. However, ED is binding -- you must attend if admitted. Apply ED only to a school you'd attend over all others, and verify financial fit first." },
  { q: "Are college acceptance rates getting lower?", a: "At most top schools, yes. Application volumes have increased steadily due to the Common App making it easy to apply to more schools, growing international demand, and (until recently) test-optional policies. More applications with roughly the same class sizes drive rates lower. As schools like Yale, Brown, Cornell, and Dartmouth reinstate test requirements, application volumes may stabilize somewhat -- but the structural trend is unlikely to reverse." },
];

export default function AdmissionsStatistics2026Page() {
  return (
    <MarketingLayout
      eyebrow="Admissions data"
      title="College Admissions Statistics 2026"
      description="Current admit rates, ED/EA splits, application volume, and the structural trends that explain them. Sourced from each school's Common Data Set and admissions reports for the 2025-26 cycle."
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* Data freshness disclaimer */}
        <div
          className="mb-10 flex items-start gap-3 rounded-xl border p-4"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Data reflects published Class of 2029 results where available
            (some schools haven&apos;t published yet — those rows show 2024-25
            cycle data). Numbers can shift by ±0.5 percentage points between
            preliminary and final reporting. Always verify on the school&apos;s
            admissions page before making decisions.
          </p>
        </div>

        {/* Admit rate table */}
        <section className="mb-14">
          <h2
            className="mb-3 flex items-center gap-2 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            <BarChart3 className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            Admit rates at top schools
          </h2>
          <div
            className="overflow-x-auto rounded-xl border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <table className="w-full text-left text-[13px]">
              <thead style={{ background: "var(--dl-bg-sunken, #E3E8F1)" }}>
                <tr>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>School</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Overall</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>ED</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>EA / REA</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Apps</th>
                  <th className="px-4 py-2.5 font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {ADMIT_TABLE.map((r) => (
                  <tr key={r.school} className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <td className="px-4 py-2 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{r.school}</td>
                    <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{r.overall}</td>
                    <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{r.ed}</td>
                    <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{r.ea}</td>
                    <td className="px-4 py-2 tabular-nums" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{r.applications}</td>
                    <td className="px-4 py-2">
                      {r.trend === "up" && <TrendingUp className="h-4 w-4" style={{ color: "#DC2626" }} aria-label="Apps up — admit harder" />}
                      {r.trend === "down" && <TrendingDown className="h-4 w-4" style={{ color: "#16A34A" }} aria-label="Apps down — admit slightly easier" />}
                      {r.trend === "flat" && <span className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Trend column reflects year-over-year change in application volume — up means more competitive, down means slightly less.
          </p>
          <p className="mt-1.5 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Sources: Each school&apos;s published Common Data Set (Section C), official admissions blogs, and press releases for the Class of 2029 cycle. Where Class of 2029 data is not yet published, Class of 2028 data is shown. Figures may shift by &plusmn;0.5 pp between preliminary and final reporting. Last updated May 2026.
          </p>
        </section>

        {/* Trends */}
        <section className="mb-14">
          <h2
            className="mb-5 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            6 structural trends shaping 2026 admissions
          </h2>
          <div className="space-y-4">
            {TRENDS.map((t, i) => (
              <article
                key={i}
                className="dl-card-hover rounded-xl border p-5"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <p
                  className="mb-2 text-[15px] font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {i + 1}. {t.title}
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {t.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Takeaways */}
        <section className="mb-14">
          <h2
            className="mb-3 text-[20px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            What the data means for your application
          </h2>
          <ul className="space-y-2.5">
            {KEY_TAKEAWAYS.map((k, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
                <span
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: "#4A6FA5" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{k}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="mb-5 text-[20px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
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
        <div
          className="mt-8 rounded-2xl border p-8 text-center"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <p className="text-sm mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            See how your profile stands against current admit-rate data
          </p>
          <Link
            href="/quiz"
            className="btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm"
          >
            Take the chances quiz
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Related */}
        <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Related resources">
          <Link href="/college-rankings-explained" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Rankings explained</div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>How US News, Forbes, and Niche rankings work.</div>
          </Link>
          <Link href="/test-optional-schools-2026" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Test-optional schools 2026</div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Current test policies and submit/skip strategy.</div>
          </Link>
          <Link href="/application-component-weighting" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>How schools weight your application</div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>CDS data on GPA, essays, activities weighting.</div>
          </Link>
          <Link href="/college-application-timeline-2026" className="rounded-xl border p-4 transition-shadow hover:shadow-md" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <div className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Application timeline 2026</div>
            <div className="text-[13px] mt-1" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>Month-by-month guide from sophomore to senior.</div>
          </Link>
        </nav>
    </MarketingLayout>
  );
}
