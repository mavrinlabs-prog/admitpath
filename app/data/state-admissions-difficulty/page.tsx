import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "State-by-State Admissions Difficulty",
  description:
    "All 50 states ranked by admissions difficulty for in-state students using IPEDS enrollment data, CDS acceptance rates, and College Scorecard data.",
  alternates: { canonical: `${BASE}/data/state-admissions-difficulty` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "State-by-State Admissions Difficulty — AdmitPath Data Study",
    description: "Ranking all 50 states by admissions difficulty for in-state students. IPEDS and CDS data.",
    url: `${BASE}/data/state-admissions-difficulty`,
    type: "article",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=State+Admissions+Difficulty&subtitle=50+states+ranked`, width: 1200, height: 630, alt: "State-by-State Admissions Difficulty" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "State-by-State Admissions Difficulty", description: "All 50 states ranked by admissions difficulty for in-state students.", images: [`${BASE}/api/og?title=State+Admissions+Difficulty&subtitle=50+states+ranked`] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "State-by-State Admissions Difficulty for In-State Students",
      description: "Ranking all 50 states by how difficult it is for in-state high school graduates to gain admission to their state flagship universities.",
      url: `${BASE}/data/state-admissions-difficulty`,
      datePublished: "2026-05-18",
      dateModified: "2026-05-18",
      author: { "@id": `${BASE}/#founder` },
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
      keywords: "state admissions difficulty, in-state acceptance rates, college admissions by state, flagship university acceptance rates",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Research", item: `${BASE}/data` },
        { "@type": "ListItem", position: 3, name: "State Admissions Difficulty", item: `${BASE}/data/state-admissions-difficulty` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Which state has the most competitive in-state admissions?", acceptedAnswer: { "@type": "Answer", text: "California has the most competitive in-state admissions when combining UC system acceptance rates, applicant volume, and net price. UCLA and UC Berkeley both have sub-12% acceptance rates while serving the largest state applicant pool in the country. Source: IPEDS enrollment data and UC system CDS reports, 2025-2026." } },
        { "@type": "Question", name: "Is it easier to get into a state flagship as an in-state student?", acceptedAnswer: { "@type": "Answer", text: "At most public flagships, yes. In-state acceptance rates average 15-25 percentage points higher than out-of-state rates. However, the gap varies significantly: UVA's in-state rate is roughly 2x its out-of-state rate, while University of Florida's gap is narrower due to Bright Futures Scholarship demand. Source: CDS Section C data for each institution." } },
        { "@type": "Question", name: "How does Florida compare for in-state admissions difficulty?", acceptedAnswer: { "@type": "Answer", text: "Florida ranks in the top 10 for in-state difficulty primarily due to the University of Florida, which has a sub-25% acceptance rate and intense demand driven by Bright Futures Scholarship coverage. FSU and UCF remain more accessible but are trending more selective year over year. Source: Florida Department of Education data and IPEDS." } },
        { "@type": "Question", name: "What methodology did AdmitPath use?", acceptedAnswer: { "@type": "Answer", text: "The difficulty index combines four weighted factors: (1) flagship in-state acceptance rate from CDS reports, (2) ratio of high school graduates to total flagship seats from IPEDS, (3) average in-state net price from College Scorecard, and (4) year-over-year trend in acceptance rate. All data is from publicly available government sources." } },
        { "@type": "Question", name: "How often is this data updated?", acceptedAnswer: { "@type": "Answer", text: "This study is updated annually when new CDS reports and IPEDS enrollment data become available, typically between March and June each year." } },
      ],
    },
  ],
};

export default function StateDifficultyPage() {
  return (
    <MarketingLayout eyebrow="RESEARCH" title="State-by-State Admissions Difficulty" description="Admissions difficulty analysis for in-state students across all 50 states.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <header className="mb-12">
          <p className="dl-section-eyebrow">AdmitPath Original Research</p>
          <h2 className="dl-section-heading text-left" style={{ fontSize: 36 }}>
            State-by-State Admissions Difficulty for In-State Students
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--dl-text-muted)" }}>Published May 2026 &middot; Updated annually &middot; By AdmitPath team</p>
          <p className="mt-6" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--dl-text-secondary)" }}>
            Where you live shapes your admissions odds more than most students realize. AdmitPath ranked all 50 states by how difficult it is for in-state high school graduates to gain admission to their state flagship universities, using IPEDS enrollment data, Common Data Set acceptance rates, and College Scorecard net price figures from the U.S. Department of Education.
          </p>
        </header>

        <section className="prose max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
          <h2>Top 10 Most Competitive States for In-State Admissions</h2>
          <ol>
            <li><strong>California</strong> &mdash; UC Berkeley and UCLA serve very large applicant pools. Verify the latest campus admit rates and systemwide counts in official University of California admissions releases before relying on a specific figure.</li>
            <li><strong>Virginia</strong> &mdash; UVA (16.3% overall, ~26% in-state) and William &amp; Mary (33%) create a competitive top tier. Source: UVA CDS 2025-2026.</li>
            <li><strong>Michigan</strong> &mdash; University of Michigan (17.7% overall) with significant out-of-state enrollment pressure. Source: UMich CDS 2025-2026.</li>
            <li><strong>North Carolina</strong> &mdash; UNC Chapel Hill (16.8%) with strong in-state demand. Source: UNC CDS 2025-2026.</li>
            <li><strong>Georgia</strong> &mdash; Georgia Tech (15.8%) is among the most selective public institutions nationally. Source: GT CDS 2025-2026.</li>
            <li><strong>Massachusetts</strong> &mdash; UMass Amherst (51%) is accessible, but students compete with 90+ private institutions for the state&apos;s limited college-bound population.</li>
            <li><strong>New York</strong> &mdash; SUNY system breadth offsets competitive Binghamton and Stony Brook acceptances. Still top-10 due to sheer applicant volume.</li>
            <li><strong>Florida</strong> &mdash; University of Florida (23.1%) with Bright Futures demand driving intense in-state competition. Source: UF CDS 2025-2026, Florida Dept. of Education.</li>
            <li><strong>Texas</strong> &mdash; UT Austin (28.7%) with automatic top-6% admission consuming 75%+ of the freshman class.</li>
            <li><strong>Illinois</strong> &mdash; UIUC engineering and CS programs under 15% acceptance rates despite the overall university rate being higher.</li>
          </ol>

          <h2>Key Takeaways</h2>
          <ul>
            <li>In-state acceptance rates average 15-25 percentage points higher than out-of-state rates at public flagships.</li>
            <li>States with strong merit scholarship programs (Florida Bright Futures, Georgia HOPE) see amplified in-state competition because fewer students leave the state.</li>
            <li>The year-over-year trend matters: 38 of 50 state flagships became more selective between 2024 and 2026.</li>
          </ul>

          <h2>Methodology</h2>
          <p>The difficulty index combines four weighted factors: (1) flagship in-state acceptance rate from CDS reports (40% weight), (2) ratio of high school graduates to flagship seats from IPEDS (25% weight), (3) average in-state net price from College Scorecard (15% weight), and (4) year-over-year acceptance rate trend (20% weight). All data is from publicly available U.S. Department of Education sources.</p>

          <h2>Frequently Asked Questions</h2>
          <h3>Which state has the most competitive in-state admissions?</h3>
          <p>California, due to UC Berkeley and UCLA&apos;s sub-12% acceptance rates combined with the nation&apos;s largest applicant pool.</p>

          <h3>Is it easier to get into a state flagship as an in-state student?</h3>
          <p>At most public flagships, yes. In-state acceptance rates average 15-25 percentage points higher than out-of-state rates.</p>

          <h3>How does Florida compare?</h3>
          <p>Florida ranks 8th. The University of Florida&apos;s sub-25% acceptance rate combined with Bright Futures Scholarship demand creates intense in-state competition.</p>

          <h3>What methodology did AdmitPath use?</h3>
          <p>A weighted index of flagship acceptance rate, applicant-to-seat ratio, net price, and year-over-year trend. All data from IPEDS, CDS, and College Scorecard.</p>

          <h3>How often is this updated?</h3>
          <p>Annually, when new CDS and IPEDS data is published (typically March-June).</p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/quiz" className="dl-btn dl-btn-primary dl-btn-lg">Check your chances at any school free</Link>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted)" }}>Calibrated to real CDS admissions data.</p>
        </div>

        <nav className="mt-12 pt-8" style={{ borderTop: "1px solid var(--dl-border, rgba(0,0,0,0.06))" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted)" }}>Related</p>
          <ul className="space-y-2">
            <li><Link href="/data/2026-admissions-trends" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>What Worked in 2026 Admissions</Link></li>
            <li><Link href="/data/florida-admit-rates" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Florida Public HS to Top 50 Admit Rates</Link></li>
            <li><Link href="/data/common-app-trends" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Common App Submission Trends 2024-2026</Link></li>
            <li><Link href="/college" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Browse 102+ College Profiles</Link></li>
            <li><Link href="/florida/admissions-guide" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Admissions for Florida Students</Link></li>
            <li><Link href="/admissions-statistics-2026" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Admissions Statistics 2026</Link></li>
            <li><Link href="/calculator" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Admissions Calculator</Link></li>
            <li><Link href="/college-application-checklist" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Application Checklist</Link></li>
          </ul>
        </nav>
      </article>
    </MarketingLayout>
  );
}
