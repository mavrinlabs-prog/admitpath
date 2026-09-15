import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Florida College Admissions Guide 2026",
  description:
    "College admissions guide for Florida students. Bright Futures, UF/FSU/UCF/USF strategies, in-state vs out-of-state, and Florida-specific tips.",
  alternates: { canonical: `${BASE}/florida/admissions-guide` },
  keywords: [
    "college admissions for florida students",
    "florida college admissions",
    "bright futures scholarship",
    "university of florida admissions",
    "fsu admissions",
    "ucf admissions",
    "usf admissions",
    "florida high school college prep",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Admissions for Florida Students — 2026 Guide",
    description: "Complete Florida-specific college admissions guide: Bright Futures, state university strategies, and in-state advantages.",
    url: `${BASE}/florida/admissions-guide`,
    type: "article",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Florida+Admissions+Guide&subtitle=Bright+Futures+%C2%B7+UF+%C2%B7+FSU+%C2%B7+UCF`, width: 1200, height: 630, alt: "Florida College Admissions Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Florida College Admissions Guide 2026", description: "Bright Futures, state university strategies, and Florida-specific tips.", images: [`${BASE}/api/og?title=Florida+Admissions+Guide&subtitle=Bright+Futures+%C2%B7+UF+%C2%B7+FSU+%C2%B7+UCF`] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${BASE}/florida/admissions-guide#article`,
      headline: "College Admissions for Florida Students: The Complete 2026 Guide",
      description: "Florida-specific college admissions strategies including Bright Futures, state flagship tactics, and in-state vs out-of-state analysis.",
      url: `${BASE}/florida/admissions-guide`,
      datePublished: "2026-05-18",
      dateModified: "2026-05-18",
      author: { "@id": `${BASE}/#founder` },
      publisher: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
      keywords: "college admissions for florida students, bright futures scholarship, UF admissions, FSU admissions, florida college guide",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Florida", item: `${BASE}/florida` },
        { "@type": "ListItem", position: 3, name: "Admissions Guide", item: `${BASE}/florida/admissions-guide` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is Bright Futures and how do I qualify?", acceptedAnswer: { "@type": "Answer", text: "Bright Futures is Florida's merit-based scholarship covering 75-100% of tuition at Florida public universities. The Florida Academic Scholars (FAS) award covers 100% of tuition and requires a weighted 3.5 GPA, 1330 SAT or 29 ACT, 100 volunteer hours, and completion of specific coursework. The Florida Medallion Scholars (FMS) award covers 75% and has lower thresholds. Source: Florida Department of Education." } },
        { "@type": "Question", name: "Is UF harder to get into than other state schools?", acceptedAnswer: { "@type": "Answer", text: "Yes. The University of Florida had a 23.1% acceptance rate in 2025-2026, making it the most selective Florida public university. FSU accepted approximately 32%, UCF approximately 42%, and USF approximately 45%. All are trending more selective. Source: CDS reports for each institution." } },
        { "@type": "Question", name: "Should Florida students apply out of state?", acceptedAnswer: { "@type": "Answer", text: "It depends on your goals and finances. Bright Futures makes Florida public universities an exceptional value. However, students aiming for specific programs not well-represented in Florida (e.g., certain engineering specializations, liberal arts colleges) should consider selective out-of-state options. Use AdmitPath's Net Price Calculator to compare true costs." } },
        { "@type": "Question", name: "Do Florida students have an advantage at Florida schools?", acceptedAnswer: { "@type": "Answer", text: "Yes. Florida public universities reserve the majority of freshman seats for in-state students. In-state acceptance rates are typically 10-20 percentage points higher than out-of-state rates. Additionally, Bright Futures, prepaid tuition plans, and in-state tuition create significant financial advantages." } },
        { "@type": "Question", name: "What makes Pine View and other Florida magnet schools different?", acceptedAnswer: { "@type": "Answer", text: "Florida magnet and IB schools like Pine View (Osprey), Stanton College Prep (Jacksonville), and DASH (Miami) offer rigorous college-prep curricula and consistently place students at top 50 national universities at higher rates than standard Florida public high schools. Their coursework, teacher quality, and college counseling resources approximate those of competitive private schools." } },
        { "@type": "Question", name: "How does dual enrollment affect Florida college admissions?", acceptedAnswer: { "@type": "Answer", text: "Dual enrollment is widely available in Florida through state colleges and universities. Taking college courses while in high school demonstrates academic rigor and can earn college credit. It is viewed favorably by admissions committees. Florida's dual enrollment program is free for public school students, making it one of the best-value academic enrichment options in the country." } },
      ],
    },
  ],
};

export default function FloridaAdmissionsGuidePage() {
  return (
    <MarketingLayout eyebrow="FLORIDA GUIDE" title="College Admissions for Florida Students" description="The complete 2026 guide for Florida high school students.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <header className="mb-12">
          <p className="dl-section-eyebrow">Florida-specific guidance</p>
          <h2 className="dl-section-heading text-left" style={{ fontSize: 36 }}>
            College Admissions for Florida Students: The Complete 2026 Guide
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--dl-text-muted)" }}>Published May 2026 &middot; Updated for 2025-2026 cycle &middot; By AdmitPath team</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold" style={{ background: "rgba(74,111,165,0.08)", color: "#4A6FA5" }}>
            Written by a current Florida HS student at Pine View School
          </div>
          <p className="mt-6" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--dl-text-secondary)" }}>
            Florida has the third-largest public high school system in the country, one of the most generous merit scholarship programs (Bright Futures), and increasingly selective state flagship universities. This guide covers everything Florida students need to know about college admissions in 2026 &mdash; from Bright Futures eligibility to out-of-state strategy.
          </p>
        </header>

        <section className="prose max-w-none" style={{ color: "var(--dl-text-secondary)" }}>
          <h2>Bright Futures Scholarship</h2>
          <p>
            <Link href="/scholarships/bright-futures" style={{ color: "var(--dl-brand)" }}>Bright Futures</Link> is Florida&apos;s merit-based scholarship program covering 75-100% of tuition at Florida public universities. Two main award levels:
          </p>
          <ul>
            <li><strong>Florida Academic Scholars (FAS):</strong> 100% tuition. Requires weighted 3.5 GPA, 1330 SAT or 29 ACT, 100 volunteer hours, and specific coursework completion.</li>
            <li><strong>Florida Medallion Scholars (FMS):</strong> 75% tuition. Lower GPA and test score thresholds.</li>
          </ul>
          <p>
            Bright Futures creates a strong economic incentive to stay in-state. A student choosing UF with FAS over a top 30 private school can save $200,000+ over four years. This is a rational financial choice &mdash; but it also means many qualified Florida students never explore strong out-of-state options. Source: Florida Department of Education.
          </p>

          <h2>Florida State University System: Selectivity Trends</h2>
          <p>All four major Florida flagships are trending more selective (source: CDS reports 2021-2026):</p>
          <ul>
            <li><strong><Link href="/college/university-of-florida" style={{ color: "var(--dl-brand)" }}>University of Florida</Link>:</strong> 23.1% acceptance rate (down from 29% in 2021). The most selective Florida public university.</li>
            <li><strong><Link href="/college/florida-state-university" style={{ color: "var(--dl-brand)" }}>Florida State University</Link>:</strong> ~32% acceptance rate. Strong in business, film, and social sciences.</li>
            <li><strong><Link href="/college/university-of-central-florida" style={{ color: "var(--dl-brand)" }}>University of Central Florida</Link>:</strong> ~42% acceptance rate. Largest university in the state by enrollment.</li>
            <li><strong><Link href="/college/university-of-south-florida" style={{ color: "var(--dl-brand)" }}>University of South Florida</Link>:</strong> ~45% acceptance rate. Rising research profile and medical school strength.</li>
          </ul>

          <h2>In-State Advantage</h2>
          <p>
            Florida public universities reserve the majority of freshman seats for in-state students. In-state acceptance rates are typically 10-20 percentage points higher than out-of-state rates. Combined with Bright Futures and prepaid tuition plans, the financial advantage is significant.
          </p>

          <h2>Florida Magnet and IB Schools</h2>
          <p>
            Schools like Pine View (Osprey), Stanton College Prep (Jacksonville), DASH (Miami), and IB programs at public schools consistently place students at top 50 national universities at higher rates than standard Florida public high schools. If you attend one of these programs, your coursework rigor is comparable to competitive private schools.
          </p>

          <h2>Dual Enrollment in Florida</h2>
          <p>
            Florida&apos;s dual enrollment program is free for public school students and widely available through state colleges. Taking college courses demonstrates academic rigor and earns transferable credit. It is viewed favorably by admissions committees at both in-state and out-of-state schools. See our <Link href="/guides/dual-enrollment" style={{ color: "var(--dl-brand)" }}>dual enrollment guide</Link> for strategy details.
          </p>

          <h2>Out-of-State Strategy for Florida Students</h2>
          <p>
            Florida students are underrepresented at top private universities relative to the state&apos;s population (see our <Link href="/data/florida-admit-rates" style={{ color: "var(--dl-brand)" }}>Florida admit rates study</Link>). If you&apos;re considering out-of-state options:
          </p>
          <ul>
            <li>Use AdmitPath&apos;s <Link href="/net-price" style={{ color: "var(--dl-brand)" }}>Net Price Calculator</Link> to compare true costs across schools using IPEDS data.</li>
            <li>Review institutional merit aid at schools that offer it &mdash; some private institutions may become competitive after aid. Use our <Link href="/scholarship-match" style={{ color: "var(--dl-brand)" }}>Scholarship Match tool</Link> and verify every award on the school&apos;s official site.</li>
            <li>Build a balanced <Link href="/college-list-builder" style={{ color: "var(--dl-brand)" }}>college list</Link> with 2-3 reach, 3-4 target, and 2-3 safety schools.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          <h3>What is Bright Futures and how do I qualify?</h3>
          <p>Bright Futures covers 75-100% of tuition at Florida public universities. FAS requires a weighted 3.5 GPA, 1330 SAT or 29 ACT, and 100 volunteer hours. FMS covers 75% with lower thresholds.</p>

          <h3>Is UF harder to get into than other state schools?</h3>
          <p>Yes. UF had a 23.1% acceptance rate in 2025-2026. FSU: ~32%, UCF: ~42%, USF: ~45%. All are trending more selective.</p>

          <h3>Should Florida students apply out of state?</h3>
          <p>It depends on goals and finances. Bright Futures makes in-state an exceptional value, but some programs are better represented out of state.</p>

          <h3>Do Florida students have an in-state advantage?</h3>
          <p>Yes. In-state acceptance rates are 10-20 percentage points higher, plus Bright Futures, prepaid tuition, and in-state tuition rates.</p>

          <h3>How does dual enrollment help?</h3>
          <p>Dual enrollment is free, demonstrates rigor, and earns transferable credit. It is viewed favorably by admissions committees.</p>

          <h3>What makes Florida magnets different?</h3>
          <p>Pine View, Stanton Prep, DASH, and IB programs offer rigorous curricula and consistently place students at top 50 universities at higher rates.</p>
        </section>

        <div className="mt-12 text-center">
          <Link href="/quiz" className="dl-btn dl-btn-primary dl-btn-lg">Check your chances at Florida schools free</Link>
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted)" }}>Calibrated to real CDS admissions data.</p>
        </div>

        <nav className="mt-12 pt-8" style={{ borderTop: "1px solid var(--dl-border, rgba(0,0,0,0.06))" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted)" }}>Related</p>
          <ul className="space-y-2">
            <li><Link href="/scholarships/bright-futures" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Bright Futures Scholarship Guide</Link></li>
            <li><Link href="/data/florida-admit-rates" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Florida Public HS to Top 50 Admit Rates</Link></li>
            <li><Link href="/data/state-admissions-difficulty" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>State-by-State Admissions Difficulty</Link></li>
            <li><Link href="/college/university-of-florida" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>University of Florida Profile</Link></li>
            <li><Link href="/college/florida-state-university" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Florida State University Profile</Link></li>
            <li><Link href="/net-price" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Net Price Calculator</Link></li>
            <li><Link href="/scholarship-match" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Scholarship Match Tool</Link></li>
            <li><Link href="/college-list-builder" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College List Builder</Link></li>
            <li><Link href="/calculator" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Admissions Calculator</Link></li>
            <li><Link href="/college-application-checklist" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>College Application Checklist</Link></li>
            <li><Link href="/guides/dual-enrollment" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Dual Enrollment Guide</Link></li>
            <li><Link href="/guides/ap-vs-ib" className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>AP vs IB for Admissions</Link></li>
          </ul>
        </nav>
      </article>
    </MarketingLayout>
  );
}
