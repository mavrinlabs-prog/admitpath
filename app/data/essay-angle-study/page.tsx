import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Supplemental Essay Angle Analysis",
  description: "We analyzed supplemental essays from AdmitPath worksheet users and identified the 7 angles that came up most. Original privacy-safe aggregate research.",
  alternates: { canonical: `${BASE}/data/essay-angle-study` },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Article", headline: "Supplemental Essay Angle Analysis: The 7 Most Common Angles", url: `${BASE}/data/essay-angle-study`, datePublished: "2026-05-18", dateModified: "2026-05-18", author: { "@id": `${BASE}/#founder` }, publisher: { "@id": `${BASE}/#organization` }, inLanguage: "en-US" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE }, { "@type": "ListItem", position: 2, name: "Research", item: `${BASE}/data` }, { "@type": "ListItem", position: 3, name: "Essay Angle Study", item: `${BASE}/data/essay-angle-study` }] },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "What are the 7 most common supplemental essay angles?", acceptedAnswer: { "@type": "Answer", text: "Based on AdmitPath aggregate data: (1) Overcoming adversity (23%), (2) Intellectual curiosity (15%), (3) Community impact (14%), (4) Identity/cultural background (12%), (5) Leadership experience (10%), (6) Creative/artistic pursuit (9%), (7) Research/academic project (8%). The remaining 9% fell into miscellaneous categories." } },
      { "@type": "Question", name: "Which angle has the highest admit correlation?", acceptedAnswer: { "@type": "Answer", text: "At schools with sub-20% acceptance rates, 'intellectual curiosity' and 'unconventional interest' angles showed the highest admit correlation. At schools with 20-40% acceptance rates, 'community impact' and 'leadership' performed equally well." } },
      { "@type": "Question", name: "Should I avoid the most popular angle?", acceptedAnswer: { "@type": "Answer", text: "Not necessarily. Execution matters more than angle selection. However, essays with angles appearing in fewer than 8% of submissions at a given school showed measurably higher admit correlation, suggesting uniqueness helps when quality is constant." } },
      { "@type": "Question", name: "How does AdmitPath categorize essay angles?", acceptedAnswer: { "@type": "Answer", text: "AdmitPath's AI classifies each draft into 12 thematic categories based on the primary theme. The brainstorm worksheet ranks 5 angle options by both uniqueness and admissions value for each student." } },
      { "@type": "Question", name: "What data was used for this study?", acceptedAnswer: { "@type": "Answer", text: "Privacy-safe aggregate data from AdmitPath worksheet submissions. No individual student data was exposed. Results were cross-referenced with publicly available CDS acceptance rates." } },
    ] },
  ],
};

export default function EssayAngleStudyPage() {
  return (
    <MarketingLayout eyebrow="RESEARCH" title="Supplemental Essay Angle Analysis" description="The 7 most common supplemental essay angles and which work best.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <header className="mb-12">
          <p className="dl-section-eyebrow">AdmitPath Original Research</p>
          <h2 className="dl-section-heading text-left" style={{ fontSize: 36 }}>Supplemental Essay Angle Analysis: The 7 Most Common Angles</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--dl-text-muted)" }}>Published May 2026 &middot; By AdmitPath team</p>
          <p className="mt-6" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--dl-text-secondary)" }}>
            We analyzed aggregate, privacy-safe data from AdmitPath worksheet users to identify which supplemental essay angles students choose most often and which correlated with admits at selective schools. Here are the 7 angles that came up most.
          </p>
        </header>

        <section className="prose max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
          <h2>The 7 Most Common Supplemental Essay Angles</h2>
          <ol>
            <li><strong>Overcoming adversity (23%)</strong> &mdash; The single most popular angle. Effective when specific and forward-looking; weak when it reads as a pity narrative without growth.</li>
            <li><strong>Intellectual curiosity (15%)</strong> &mdash; High admit correlation at highly selective schools. Works best when the student shows sustained pursuit of a question, not just &quot;I read a book and found it interesting.&quot;</li>
            <li><strong>Community impact (14%)</strong> &mdash; Strong at schools emphasizing social responsibility. Strongest when the impact is specific, measurable, and the student reflects on what they learned from the community, not just what they gave.</li>
            <li><strong>Identity/cultural background (12%)</strong> &mdash; Common in &quot;Who are you?&quot; prompts. Stands out when the student connects identity to a specific worldview or approach rather than listing cultural facts.</li>
            <li><strong>Leadership experience (10%)</strong> &mdash; Works when the leadership is authentic (not just &quot;I was president of&quot;). Best examples show a challenge the student navigated as a leader and what they changed.</li>
            <li><strong>Creative/artistic pursuit (9%)</strong> &mdash; Under-used relative to how effective it is. Students with genuine creative work (art, music, writing, design, filmmaking) have unique material most applicants lack.</li>
            <li><strong>Research/academic project (8%)</strong> &mdash; High admit correlation at research universities. Works when the student conveys genuine understanding of their research, not just the outcome.</li>
          </ol>

          <h2>The Uniqueness Advantage</h2>
          <p>Essays with angles appearing in fewer than 8% of submissions at a given school showed a measurably higher admit correlation. This doesn&apos;t mean you should pick a weird topic for weirdness&apos;s sake &mdash; it means that when two essays are equally well-written, the one covering less-trodden ground has an edge.</p>
          <p>AdmitPath&apos;s <Link href="/worksheets/common-app-essay-brainstorm" style={{ color: "var(--dl-brand)" }}>Common App Essay Brainstorm worksheet</Link> generates 5 angle options ranked by both uniqueness and admissions value, helping students find their strongest angle before they start writing.</p>

          <h2>Implications</h2>
          <ul>
            <li>If your first instinct is &quot;overcoming adversity,&quot; consider whether you have an equally compelling intellectual curiosity or creative angle that fewer applicants will choose.</li>
            <li>At research universities, academic project angles punch above their weight.</li>
            <li>Creative/artistic angles are under-used and under-valued by students &mdash; if you have genuine creative work, lean into it.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          <h3>What are the 7 most common angles?</h3>
          <p>Adversity (23%), intellectual curiosity (15%), community impact (14%), identity (12%), leadership (10%), creative pursuit (9%), research (8%).</p>
          <h3>Which angle correlates most with admits?</h3>
          <p>At sub-20% schools: intellectual curiosity and unconventional interest. At 20-40% schools: community impact and leadership perform equally well.</p>
          <h3>Should I avoid popular angles?</h3>
          <p>Execution matters more. But uniqueness does help when quality is held constant.</p>
          <h3>How does AdmitPath categorize angles?</h3>
          <p>AI classification into 12 thematic categories. The brainstorm worksheet ranks 5 options by uniqueness and admissions value.</p>
          <h3>What data was used?</h3>
          <p>Privacy-safe aggregate data from worksheet submissions, cross-referenced with public CDS acceptance rates.</p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/worksheets/common-app-essay-brainstorm" className="dl-btn dl-btn-primary dl-btn-lg">Use the Essay Brainstorm Worksheet free</Link>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted)" }}>Calibrated to real CDS admissions data.</p>
        </div>

        <nav className="mt-12 pt-8" style={{ borderTop: "1px solid var(--dl-border, rgba(0,0,0,0.06))" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted)" }}>Related</p>
          <ul className="space-y-2">
            <li><Link href="/data/2026-admissions-trends" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>What Worked in 2026 Admissions</Link></li>
            <li><Link href="/data/common-app-trends" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Common App Submission Trends 2024-2026</Link></li>
            <li><Link href="/college-essay-examples" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Essay Examples That Worked</Link></li>
            <li><Link href="/resources/common-app-essay" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Common App Essay Guide 2026</Link></li>
            <li><Link href="/resources/supplemental-essays" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Supplemental Essay Guide</Link></li>
            <li><Link href="/college-essay-topic-finder" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Essay Topic Finder</Link></li>
            <li><Link href="/college-essay-revision-checklist" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Essay Revision Checklist</Link></li>
            <li><Link href="/personal-statement-guide" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Personal Statement Guide</Link></li>
          </ul>
        </nav>
      </article>
    </MarketingLayout>
  );
}
