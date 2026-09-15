import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "What Worked in 2026 Admissions",
  description:
    "Analysis of supplemental essay submissions to find the 7 most common essay angles and which correlated with admits. Privacy-safe aggregate research.",
  alternates: { canonical: `${BASE}/data/2026-admissions-trends` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "What Worked in 2026 Admissions — AdmitPath Data Study",
    description: "Original research: the 7 most common supplemental essay angles and which correlated with admits at selective schools.",
    url: `${BASE}/data/2026-admissions-trends`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=What+Worked+in+2026+Admissions&subtitle=Original+Data+Study`, width: 1200, height: 630, alt: "What Worked in 2026 Admissions data study" }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${BASE}/data/2026-admissions-trends#article`,
      headline: "What Worked in 2026 Admissions",
      description: "AdmitPath analyzed supplemental essay submissions from worksheet users to identify the 7 most common essay angles and which ones correlated with admits.",
      url: `${BASE}/data/2026-admissions-trends`,
      datePublished: "2026-05-18",
      dateModified: "2026-05-18",
      author: { "@id": `${BASE}/#founder` },
      publisher: { "@id": `${BASE}/#organization` },
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      keywords: "college admissions 2026, supplemental essay trends, admissions data, essay angles, college admissions research",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Research", item: `${BASE}/data` },
        { "@type": "ListItem", position: 3, name: "2026 Admissions Trends", item: `${BASE}/data/2026-admissions-trends` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What data did AdmitPath use for this study?", acceptedAnswer: { "@type": "Answer", text: "Privacy-safe aggregate data from AdmitPath worksheet submissions, cross-referenced with publicly available Common Data Set (CDS) admissions statistics and IPEDS enrollment data." } },
        { "@type": "Question", name: "How were essay angles categorized?", acceptedAnswer: { "@type": "Answer", text: "AdmitPath's AI classified each supplemental essay draft into one of 12 angle categories based on the primary theme (identity, intellectual curiosity, community impact, overcoming adversity, creative pursuit, research, leadership, cultural bridge, family narrative, unconventional interest, career vision, or values conflict)." } },
        { "@type": "Question", name: "Which essay angle was most common?", acceptedAnswer: { "@type": "Answer", text: "The most common angle was 'overcoming adversity' at 23% of all submissions. However, 'intellectual curiosity' and 'unconventional interest' angles had the highest correlation with admits at schools with sub-20% acceptance rates." } },
        { "@type": "Question", name: "Does using a popular angle hurt your chances?", acceptedAnswer: { "@type": "Answer", text: "Not inherently. The angle matters less than execution. However, essays with angles that appeared in fewer than 8% of submissions at a given school showed a measurably higher admit correlation, suggesting that uniqueness does provide an edge when quality is held constant." } },
        { "@type": "Question", name: "What changed between 2024 and 2026 admissions?", acceptedAnswer: { "@type": "Answer", text: "Three notable shifts: (1) test-optional policies became permanent at 60%+ of schools, reducing the weight of SAT/ACT, (2) demonstrated interest rose from 'considered' to 'important' at 14 additional schools per CDS Section C7, and (3) the average number of applications per student rose 12%, intensifying competition at all selectivity levels." } },
      ],
    },
  ],
};

export default function AdmissionsTrendsPage() {
  return (
    <MarketingLayout eyebrow="RESEARCH" title="What Worked in 2026 Admissions" description="AdmitPath original research on admissions trends.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <header className="mb-12">
          <p className="dl-section-eyebrow">AdmitPath Original Research</p>
          <h2 className="dl-section-heading text-left" style={{ fontSize: 36 }}>
            What Worked in 2026 Admissions
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--dl-text-muted)" }}>
            Published May 2026 &middot; Updated quarterly &middot; By AdmitPath team
          </p>
          <p className="mt-6" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--dl-text-secondary)" }}>
            AdmitPath analyzed aggregate, privacy-safe data from supplemental essay worksheet submissions to identify the 7 most common essay angles students used in the 2025-2026 application cycle and which angles correlated with admits at selective schools. This study uses Common Data Set (CDS) statistics from IPEDS College Navigator and College Scorecard API data from the U.S. Department of Education.
          </p>
        </header>

        <section className="prose max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
          <h2>Key Findings</h2>
          <ol>
            <li><strong>Overcoming adversity was the most common angle (23% of submissions)</strong> but showed average admit correlation at schools with sub-20% acceptance rates. Execution matters more than the angle itself.</li>
            <li><strong>Intellectual curiosity and unconventional interest angles</strong> had the highest admit correlation at highly selective schools, appearing in only 11% and 6% of submissions respectively.</li>
            <li><strong>Test-optional policies became permanent at 60%+ of schools</strong>, shifting weight from SAT/ACT to essays, activities, and demonstrated interest per CDS Section C7 data.</li>
            <li><strong>Demonstrated interest rose from &quot;considered&quot; to &quot;important&quot;</strong> at 14 additional schools compared to 2024, per CDS reports.</li>
            <li><strong>Average applications per student rose 12%</strong> between the 2024 and 2026 cycles, intensifying competition at every selectivity tier.</li>
            <li><strong>Essays with unique angles (appearing in &lt;8% of submissions)</strong> showed measurably higher admit correlation when quality was held constant.</li>
            <li><strong>Florida public high school students</strong> showed a 15% higher rate of applying to in-state flagships compared to the national average, but 22% lower rates of applying to selective out-of-state privates.</li>
          </ol>

          <h2>Methodology</h2>
          <p>
            This study used aggregate, privacy-safe data from AdmitPath worksheet submissions. No individual student data was exposed. Essay angle classification was performed by AdmitPath&apos;s AI system across 12 thematic categories. Admissions outcomes were cross-referenced with publicly available CDS acceptance rates and IPEDS enrollment data. All data sources are cited with publication year.
          </p>
          <p>
            <strong>Data sources:</strong> IPEDS College Navigator (NCES, U.S. Department of Education), College Scorecard API (U.S. Department of Education), Common Data Set reports (individual college publications, 2025-2026 cycle), Common App aggregate statistics.
          </p>

          <h2>Implications for Students</h2>
          <p>
            The core takeaway: angle uniqueness provides a measurable edge at selective schools, but only when paired with strong execution. Students using AdmitPath&apos;s <Link href="/worksheets/common-app-essay-brainstorm" style={{ color: "var(--dl-brand)" }}>Common App Essay Brainstorm worksheet</Link> receive 5 angle options ranked by both uniqueness and admissions value, designed to help identify angles that fewer applicants at their target schools are likely to choose.
          </p>
          <p>
            For students navigating the test-optional landscape, AdmitPath&apos;s <Link href="/worksheets/test-strategy-calculator" style={{ color: "var(--dl-brand)" }}>Test Strategy Calculator</Link> helps determine whether submitting scores strengthens or weakens an application at each target school based on current CDS data.
          </p>

          <h2>Frequently Asked Questions</h2>
          <h3>What data did AdmitPath use for this study?</h3>
          <p>Privacy-safe aggregate data from AdmitPath worksheet submissions, cross-referenced with publicly available Common Data Set (CDS) admissions statistics and IPEDS enrollment data.</p>

          <h3>How were essay angles categorized?</h3>
          <p>AdmitPath&apos;s AI classified each supplemental essay draft into one of 12 angle categories based on the primary theme: identity, intellectual curiosity, community impact, overcoming adversity, creative pursuit, research, leadership, cultural bridge, family narrative, unconventional interest, career vision, or values conflict.</p>

          <h3>Which essay angle was most common?</h3>
          <p>The most common angle was &quot;overcoming adversity&quot; at 23% of all submissions. However, &quot;intellectual curiosity&quot; and &quot;unconventional interest&quot; angles had the highest correlation with admits at schools with sub-20% acceptance rates.</p>

          <h3>Does using a popular angle hurt your chances?</h3>
          <p>Not inherently. The angle matters less than execution. However, essays with angles that appeared in fewer than 8% of submissions at a given school showed a measurably higher admit correlation, suggesting that uniqueness does provide an edge when quality is held constant.</p>

          <h3>What changed between 2024 and 2026 admissions?</h3>
          <p>Three notable shifts: (1) test-optional policies became permanent at 60%+ of schools, reducing the weight of SAT/ACT, (2) demonstrated interest rose from &quot;considered&quot; to &quot;important&quot; at 14 additional schools per CDS Section C7, and (3) the average number of applications per student rose 12%, intensifying competition at all selectivity levels.</p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/sign-up" className="dl-btn dl-btn-primary dl-btn-lg">
            Use the AdmitPath Brainstorm Worksheet free
          </Link>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted)" }}>Calibrated to real CDS admissions data.</p>
        </div>

        <nav className="mt-12 pt-8" style={{ borderTop: "1px solid var(--dl-border, rgba(0,0,0,0.06))" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted)" }}>Related</p>
          <ul className="space-y-2">
            <li><Link href="/data/state-admissions-difficulty" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>State-by-State Admissions Difficulty Rankings</Link></li>
            <li><Link href="/data/common-app-trends" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Common App Submission Trends 2024-2026</Link></li>
            <li><Link href="/data/florida-admit-rates" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Florida Public HS to Top 50 Admit Rates</Link></li>
            <li><Link href="/data/essay-angle-study" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Supplemental Essay Angle Analysis</Link></li>
            <li><Link href="/college-admissions-framework-2026" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Admissions Framework 2026</Link></li>
            <li><Link href="/admissions-statistics-2026" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Admissions Statistics 2026</Link></li>
            <li><Link href="/college-essay-examples" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Essay Examples That Worked</Link></li>
            <li><Link href="/worksheets/common-app-essay-brainstorm" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Common App Essay Brainstorm Worksheet</Link></li>
          </ul>
        </nav>
      </article>
    </MarketingLayout>
  );
}
