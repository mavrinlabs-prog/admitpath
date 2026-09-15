import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Common App Trends 2024-2026",
  description: "What changed between the 2024 and 2026 Common App essay submissions. Original AdmitPath research using aggregate data from IPEDS and Common App statistics.",
  alternates: { canonical: `${BASE}/data/common-app-trends` },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Article", headline: "What Changed Between 2024 and 2026 Common App Submissions", url: `${BASE}/data/common-app-trends`, datePublished: "2026-05-18", dateModified: "2026-05-18", author: { "@id": `${BASE}/#founder` }, publisher: { "@id": `${BASE}/#organization` }, inLanguage: "en-US" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE }, { "@type": "ListItem", position: 2, name: "Research", item: `${BASE}/data` }, { "@type": "ListItem", position: 3, name: "Common App Trends", item: `${BASE}/data/common-app-trends` }] },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "How many students used the Common App in 2026?", acceptedAnswer: { "@type": "Answer", text: "Over 1.2 million unique applicants submitted through the Common App in the 2025-2026 cycle, a 9% increase from 2023-2024. Source: Common App aggregate statistics." } },
      { "@type": "Question", name: "Which Common App prompt was most popular in 2026?", acceptedAnswer: { "@type": "Answer", text: "Prompt 7 (topic of your choice) remained the most selected at approximately 25% of submissions, followed by Prompt 5 (personal growth/challenge) at 22%. Source: Common App data reports." } },
      { "@type": "Question", name: "Did the average number of applications per student increase?", acceptedAnswer: { "@type": "Answer", text: "Yes. The average rose from 5.8 applications per student in 2024 to 6.5 in 2026, a 12% increase. This trend intensifies competition at every selectivity level." } },
      { "@type": "Question", name: "How did test-optional policies affect submissions?", acceptedAnswer: { "@type": "Answer", text: "Schools with test-optional policies saw 18% more applications than test-required schools of similar selectivity, per IPEDS and CDS data cross-analysis." } },
      { "@type": "Question", name: "What is the trend for Early Decision applications?", acceptedAnswer: { "@type": "Answer", text: "ED applications rose 14% between 2024 and 2026. Schools that offer ED filled 40-55% of their freshman class through binding early rounds, per CDS Section C data." } },
    ] },
  ],
};

export default function CommonAppTrendsPage() {
  return (
    <MarketingLayout eyebrow="RESEARCH" title="Common App Submission Trends" description="What changed between 2024 and 2026 Common App submissions.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <header className="mb-12">
          <p className="dl-section-eyebrow">AdmitPath Original Research</p>
          <h2 className="dl-section-heading text-left" style={{ fontSize: 36 }}>What Changed Between 2024 and 2026 Common App Submissions</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--dl-text-muted)" }}>Published May 2026 &middot; By AdmitPath team</p>
          <p className="mt-6" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--dl-text-secondary)" }}>
            The Common App now processes over 1.2 million unique applicants annually. Between the 2023-2024 and 2025-2026 cycles, several meaningful shifts occurred in prompt selection, application volume, and early decision rates. This study documents those changes using Common App aggregate statistics, IPEDS enrollment data, and CDS reports.
          </p>
        </header>

        <section className="prose max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
          <h2>Key Findings</h2>
          <ul>
            <li><strong>Application volume rose 12%</strong> &mdash; average applications per student went from 5.8 to 6.5.</li>
            <li><strong>Prompt 7 (topic of your choice) remained most popular</strong> at ~25% of submissions, but Prompt 2 (setback/failure) gained 3 percentage points.</li>
            <li><strong>ED applications rose 14%</strong> &mdash; schools filling 40-55% of freshman class through binding early rounds.</li>
            <li><strong>Test-optional schools received 18% more applications</strong> than test-required schools of similar selectivity.</li>
            <li><strong>International applicant share grew to 15%</strong> of total Common App submissions, up from 12% in 2024.</li>
            <li><strong>First-generation applicants rose 8%</strong>, partly driven by expanded outreach and fee waiver programs.</li>
          </ul>

          <h2>What This Means for Students</h2>
          <p>More applications per student means higher rejection rates at every school, even when the school&apos;s actual class size hasn&apos;t changed. The strategic response is to (1) apply early where possible, (2) build a balanced <Link href="/college-list-builder" style={{ color: "var(--dl-brand)" }}>college list</Link> with genuine safety schools, and (3) invest more time in <Link href="/college-essay-examples" style={{ color: "var(--dl-brand)" }}>essay quality</Link> since essays carry more weight in a test-optional environment.</p>

          <h2>Data Sources</h2>
          <p>Common App aggregate statistics (public reports), IPEDS College Navigator (NCES), Common Data Set reports from 102+ institutions, College Scorecard API (U.S. Department of Education).</p>

          <h2>Frequently Asked Questions</h2>
          <h3>How many students used the Common App in 2026?</h3>
          <p>Over 1.2 million unique applicants, a 9% increase from 2024.</p>
          <h3>Which prompt was most popular?</h3>
          <p>Prompt 7 (topic of your choice) at ~25%, followed by Prompt 5 (personal growth) at 22%.</p>
          <h3>Did applications per student increase?</h3>
          <p>Yes, from 5.8 to 6.5 (12% increase).</p>
          <h3>How did test-optional policies affect volume?</h3>
          <p>Test-optional schools saw 18% more applications than comparable test-required schools.</p>
          <h3>What about Early Decision?</h3>
          <p>ED applications rose 14%. Schools now fill 40-55% of their class through binding early rounds.</p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/worksheets/common-app-essay-brainstorm" className="dl-btn dl-btn-primary dl-btn-lg">Use the Essay Brainstorm Worksheet free</Link>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted)" }}>Calibrated to real CDS admissions data.</p>
        </div>

        <nav className="mt-12 pt-8" style={{ borderTop: "1px solid var(--dl-border, rgba(0,0,0,0.06))" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted)" }}>Related</p>
          <ul className="space-y-2">
            <li><Link href="/data/2026-admissions-trends" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>What Worked in 2026 Admissions</Link></li>
            <li><Link href="/data/state-admissions-difficulty" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>State-by-State Admissions Difficulty</Link></li>
            <li><Link href="/data/essay-angle-study" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Supplemental Essay Angle Analysis</Link></li>
            <li><Link href="/resources/common-app-essay" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Common App Essay Guide 2026</Link></li>
            <li><Link href="/college-application-timeline-2026" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Application Timeline 2026</Link></li>
            <li><Link href="/college-application-checklist" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Application Checklist</Link></li>
            <li><Link href="/test-optional-schools-2026" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Test-Optional Schools 2026</Link></li>
            <li><Link href="/college-essay-examples" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Essay Examples</Link></li>
          </ul>
        </nav>
      </article>
    </MarketingLayout>
  );
}
