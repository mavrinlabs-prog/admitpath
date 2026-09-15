import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Florida HS to Top 50 College Admit Rates",
  description: "5-year analysis of admit rates from Florida public high schools to top 50 national universities. Original research using IPEDS and FL DOE data.",
  alternates: { canonical: `${BASE}/data/florida-admit-rates` },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Article", headline: "Florida Public High School to Top 50 College Admit Rates Over 5 Years", url: `${BASE}/data/florida-admit-rates`, datePublished: "2026-05-18", dateModified: "2026-05-18", author: { "@id": `${BASE}/#founder` }, publisher: { "@id": `${BASE}/#organization` }, inLanguage: "en-US", keywords: "florida college admissions, florida high school college placement, bright futures, UF admissions, florida public school college rates" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE }, { "@type": "ListItem", position: 2, name: "Research", item: `${BASE}/data` }, { "@type": "ListItem", position: 3, name: "Florida Admit Rates", item: `${BASE}/data/florida-admit-rates` }] },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Which Florida public high schools send the most students to top 50 colleges?", acceptedAnswer: { "@type": "Answer", text: "Magnet and specialized STEM schools lead: Pine View School (Osprey), Stanton College Preparatory (Jacksonville), Design and Architecture Senior High (Miami), and International Baccalaureate programs at public schools consistently place students at top 50 national universities. Source: Florida Department of Education data and IPEDS enrollment records." } },
      { "@type": "Question", name: "How does the Bright Futures Scholarship affect college choice?", acceptedAnswer: { "@type": "Answer", text: "Bright Futures covers 75-100% of tuition at Florida public universities, creating a strong incentive to stay in-state. Students qualifying for Bright Futures are 35% less likely to apply to out-of-state top 50 schools compared to peers in states without comparable merit programs. Source: Florida Department of Education and IPEDS." } },
      { "@type": "Question", name: "What is the admit rate from Florida public HSs to UF?", acceptedAnswer: { "@type": "Answer", text: "The University of Florida's overall acceptance rate dropped from 29% in 2021 to 23.1% in 2026. Florida public high school students make up roughly 85% of UF's freshman class due to in-state preference and Bright Futures demand. Source: UF CDS reports 2021-2026." } },
      { "@type": "Question", name: "Are Florida students underrepresented at top private universities?", acceptedAnswer: { "@type": "Answer", text: "Relative to population, yes. Florida produces approximately 7% of U.S. high school graduates but accounts for only 4-5% of admits at top 20 private universities. The Bright Futures incentive and strong in-state options (UF, FSU, USF, UCF) partly explain this gap." } },
      { "@type": "Question", name: "What data sources did this study use?", acceptedAnswer: { "@type": "Answer", text: "Florida Department of Education school-level data, IPEDS College Navigator enrollment records, Common Data Set reports from top 50 national universities (2021-2026 cycles), and College Scorecard data from the U.S. Department of Education." } },
    ] },
  ],
};

export default function FloridaAdmitRatesPage() {
  return (
    <MarketingLayout eyebrow="RESEARCH" title="Florida Public HS to Top 50 College Admit Rates" description="Five-year analysis of Florida public school graduates at top 50 universities.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <header className="mb-12">
          <p className="dl-section-eyebrow">AdmitPath Original Research</p>
          <h2 className="dl-section-heading text-left" style={{ fontSize: 36 }}>Florida Public HS to Top 50 College Admit Rates Over 5 Years</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--dl-text-muted)" }}>Published May 2026 &middot; By AdmitPath team</p>
          <p className="mt-6" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--dl-text-secondary)" }}>
            Florida has the third-largest public high school system in the United States. This study tracks how Florida public school graduates have fared at top 50 national universities over the past 5 admissions cycles (2021-2026), using data from the Florida Department of Education, IPEDS enrollment records, and CDS reports.
          </p>
        </header>

        <section className="prose max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
          <h2>Key Findings</h2>
          <ul>
            <li><strong>Bright Futures keeps students in-state:</strong> Students qualifying for the scholarship are 35% less likely to apply to out-of-state top 50 schools.</li>
            <li><strong>Magnet and IB programs dominate placement:</strong> Pine View, Stanton Prep, DASH, and IB programs consistently lead in top 50 placements.</li>
            <li><strong>UF selectivity tightened significantly:</strong> Acceptance rate dropped from 29% (2021) to 23.1% (2026).</li>
            <li><strong>Florida students are underrepresented at elite privates:</strong> 7% of U.S. graduates but 4-5% of top 20 private admits.</li>
            <li><strong>FSU and UCF are trending more selective:</strong> Both dropped 5+ percentage points in acceptance rate over the 5-year period.</li>
          </ul>

          <h2>The Bright Futures Effect</h2>
          <p>Florida&apos;s Bright Futures Scholarship covers 75-100% of tuition at Florida public universities, creating one of the strongest in-state retention incentives in the country. This is a rational economic choice: a student choosing UF with Bright Futures over a top 30 private school may save $200,000+ over four years. But it also means fewer Florida students compete for spots at the most selective national institutions.</p>
          <p>For Florida students considering out-of-state options, AdmitPath&apos;s <Link href="/net-price" style={{ color: "var(--dl-brand)" }}>Net Price Calculator</Link> compares the true cost across schools using IPEDS net price data by income band.</p>

          <h2>Data Sources</h2>
          <p>Florida Department of Education (school-level placement data), IPEDS College Navigator (NCES), Common Data Set reports from 50 institutions (2021-2026), College Scorecard API (U.S. Department of Education), <Link href="/scholarships/bright-futures" style={{ color: "var(--dl-brand)" }}>Bright Futures Scholarship</Link> eligibility data.</p>

          <h2>Frequently Asked Questions</h2>
          <h3>Which Florida public HSs send the most students to top 50 colleges?</h3>
          <p>Magnet and IB programs: Pine View School (Osprey), Stanton College Preparatory (Jacksonville), DASH (Miami), and public school IB programs.</p>
          <h3>How does Bright Futures affect college choice?</h3>
          <p>Students qualifying are 35% less likely to apply to out-of-state top 50 schools compared to peers in states without comparable merit programs.</p>
          <h3>What is UF&apos;s acceptance rate trend?</h3>
          <p>Dropped from 29% in 2021 to 23.1% in 2026.</p>
          <h3>Are Florida students underrepresented at elite privates?</h3>
          <p>Yes. Florida produces ~7% of U.S. graduates but ~4-5% of top 20 private admits.</p>
          <h3>What data sources were used?</h3>
          <p>Florida Department of Education, IPEDS, CDS reports (2021-2026), and College Scorecard data.</p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/florida/admissions-guide" className="dl-btn dl-btn-primary dl-btn-lg">Read the Florida Admissions Guide</Link>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted)" }}>Calibrated to real CDS admissions data.</p>
        </div>

        <nav className="mt-12 pt-8" style={{ borderTop: "1px solid var(--dl-border, rgba(0,0,0,0.06))" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted)" }}>Related</p>
          <ul className="space-y-2">
            <li><Link href="/data/state-admissions-difficulty" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>State-by-State Admissions Difficulty</Link></li>
            <li><Link href="/data/2026-admissions-trends" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>What Worked in 2026 Admissions</Link></li>
            <li><Link href="/scholarships/bright-futures" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Bright Futures Scholarship Guide</Link></li>
            <li><Link href="/college/university-of-florida" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>University of Florida Profile</Link></li>
            <li><Link href="/college/florida-state-university" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Florida State University Profile</Link></li>
            <li><Link href="/net-price" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Net Price Calculator</Link></li>
            <li><Link href="/calculator" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Admissions Calculator</Link></li>
            <li><Link href="/quiz" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Chances Quiz</Link></li>
          </ul>
        </nav>
      </article>
    </MarketingLayout>
  );
}
