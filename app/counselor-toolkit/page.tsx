import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { CheckCircle2, Download, ArrowRight, BookOpen, PenLine, Target, GraduationCap, FileText } from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Free High School Counselor Toolkit",
  description:
    "Free college admissions resources for high school counselors: worksheets, checklists, essay guides, and data-backed tools. No signup required.",
  alternates: { canonical: `${BASE}/counselor-toolkit` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free High School Counselor Toolkit — AdmitPath",
    description: "Free college admissions resources for counselors: worksheets, checklists, essay guides, and data tools. No signup required.",
    url: `${BASE}/counselor-toolkit`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Counselor+Toolkit&subtitle=Free+worksheets+%C2%B7+checklists+%C2%B7+guides`, width: 1200, height: 630, alt: "Free Counselor Toolkit" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Free Counselor Toolkit — AdmitPath", description: "Free college admissions resources for counselors.", images: [`${BASE}/api/og?title=Counselor+Toolkit&subtitle=Free+worksheets+%C2%B7+checklists+%C2%B7+guides`] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/counselor-toolkit#page`,
      url: `${BASE}/counselor-toolkit`,
      name: "Free High School Counselor Toolkit",
      description: "Free college admissions resources for high school counselors: worksheets, checklists, essay guides, and data-backed tools.",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Counselor Toolkit", item: `${BASE}/counselor-toolkit` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is the counselor toolkit really free?", acceptedAnswer: { "@type": "Answer", text: "Yes. Every resource in the toolkit is free with no signup required. We built this because high school counselors manage 400+ students each and need practical, data-backed tools they can share immediately." } },
        { "@type": "Question", name: "Can I share these resources with my students?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Every tool and guide is designed to be shared with students and parents. Links work without login. Print-friendly versions are available for offline use." } },
        { "@type": "Question", name: "What data sources does AdmitPath use?", acceptedAnswer: { "@type": "Answer", text: "IPEDS College Navigator (NCES), each college's official Common Data Set (CDS), College Scorecard API (U.S. Department of Education), and Common App aggregate statistics. All data is cited with publication year and source." } },
        { "@type": "Question", name: "Is there a school/district plan?", acceptedAnswer: { "@type": "Answer", text: "A contracted school plan is not generally available. Schools can contact AdmitPath to discuss requirements and a possible scoped evaluation." } },
        { "@type": "Question", name: "Who built AdmitPath?", acceptedAnswer: { "@type": "Answer", text: "AdmitPath is built as an AI college counseling workspace focused on application strategy, essays, college lists, and planning." } },
      ],
    },
  ],
};

const toolkitSections = [
  {
    title: "College Research Tools",
    icon: Target,
    items: [
      { name: "College Admissions Calculator", href: "/calculator", desc: "Free calculator calibrated to CDS data from 102+ schools." },
      { name: "College Chances Quiz", href: "/quiz", desc: "2-minute quiz to see chances at target schools." },
      { name: "Net Price Calculator", href: "/net-price", desc: "Real net price by income band from IPEDS data." },
      { name: "Scholarship Finder", href: "/scholarship-match", desc: "Review possible matches and verify current criteria with each provider." },
      { name: "College Comparison Tool", href: "/compare", desc: "Side-by-side comparison of acceptance rates, price, and outcomes." },
      { name: "Net Price Estimator", href: "/net-price", desc: "Income-band planning estimates with official-calculator reminders." },
    ],
  },
  {
    title: "Essay & Writing Resources",
    icon: PenLine,
    items: [
      { name: "College Essay Examples", href: "/college-essay-examples", desc: "50+ annotated examples that worked (Common App, supplementals, Why Us)." },
      { name: "Common App Essay Guide 2026", href: "/resources/common-app-essay", desc: "All 7 prompts analyzed with brainstorm framework." },
      { name: "Supplemental Essay Guide", href: "/resources/supplemental-essays", desc: "Prompt analysis and angle strategies for top schools." },
      { name: "Essay Topic Finder", href: "/college-essay-topic-finder", desc: "Interactive tool to find unique essay angles." },
      { name: "Essay Revision Checklist", href: "/college-essay-revision-checklist", desc: "Step-by-step revision guide for self-editing." },
      { name: "Personal Statement Guide", href: "/personal-statement-guide", desc: "Complete writing guide with structure template." },
    ],
  },
  {
    title: "Application Planning",
    icon: BookOpen,
    items: [
      { name: "College Application Checklist", href: "/college-application-checklist", desc: "Complete 2026-2027 checklist: deadlines, docs, essays, rec letters." },
      { name: "Application Timeline 2026", href: "/college-application-timeline-2026", desc: "Month-by-month timeline for ED, EA, and RD." },
      { name: "College List Builder", href: "/college-list-builder", desc: "Build a balanced reach/match/safety list." },
      { name: "Deadlines Calendar", href: "/deadlines", desc: "Searchable application deadlines for 2026-2027." },
      { name: "Letter of Recommendation Guide", href: "/resources/rec-letters", desc: "Who to ask, when, and brag sheet template." },
      { name: "College Interview Prep", href: "/interview-practice", desc: "50+ real questions with AI practice feedback." },
    ],
  },
  {
    title: "Financial Aid & Scholarships",
    icon: GraduationCap,
    items: [
      { name: "Financial Aid Guide", href: "/resources/financial-aid", desc: "FAFSA, CSS Profile, merit, need-based, and appeals." },
      { name: "FAFSA Checklist", href: "/fafsa-checklist", desc: "Step-by-step with documents needed and common mistakes." },
      { name: "Scholarship Guide", href: "/resources/scholarships", desc: "40+ scholarships with deadlines and award amounts." },
      { name: "Scholarship Match", href: "/scholarship-match", desc: "Filter by GPA, scores, major, and state." },
      { name: "Financial Aid Appeal Guide", href: "/financial-aid-appeal-guide", desc: "Letter templates and negotiation tactics." },
      { name: "Aid Comparison Tool", href: "/aid-comparison", desc: "Compare financial aid packages side by side." },
    ],
  },
  {
    title: "Data & Research",
    icon: FileText,
    items: [
      { name: "Admissions Statistics 2026", href: "/admissions-statistics-2026", desc: "Acceptance rates, SAT/ACT ranges, yield rates from CDS." },
      { name: "What Worked in 2026", href: "/data/2026-admissions-trends", desc: "Original research on essay angles and admit correlation." },
      { name: "State Admissions Difficulty", href: "/data/state-admissions-difficulty", desc: "All 50 states ranked by in-state difficulty." },
      { name: "College Admissions Framework", href: "/college-admissions-framework-2026", desc: "The 7-dimension framework for 2026." },
      { name: "Test-Optional Schools 2026", href: "/test-optional-schools-2026", desc: "Complete list of test-optional and test-blind schools." },
      { name: "Admissions Glossary", href: "/glossary", desc: "200+ terms in plain language." },
    ],
  },
];

export default function CounselorToolkitPage() {
  return (
    <MarketingLayout
      eyebrow="FOR COUNSELORS"
      title="Free Counselor Toolkit"
      description="Free resources to help your students navigate college admissions with confidence."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="text-center mb-14">
          <p className="dl-section-eyebrow">For high school counselors</p>
          <h2 className="dl-section-heading">
            Free Counselor <em>Toolkit</em>
          </h2>
          <p className="dl-section-sub" style={{ maxWidth: 600 }}>
            You manage 400+ students. You need practical, shareable, data-backed resources &mdash; not another login. Every tool below is free, no signup required.
          </p>
        </div>

        {toolkitSections.map((section) => (
          <div key={section.title} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="dl-feature-icon" style={{ width: 36, height: 36 }}>
                <section.icon size={18} strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: "var(--dl-text-primary)" }}>{section.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="dl-feature-card dl-card-hover"
                  style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <h3 className="dl-feature-title" style={{ fontSize: 14 }}>{item.name}</h3>
                  <p className="dl-feature-desc" style={{ fontSize: 12 }}>{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold mt-auto" style={{ color: "var(--dl-brand)" }}>
                    Open free <ArrowRight size={12} strokeWidth={2} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--dl-text-primary)" }}>Exploring a school evaluation?</h2>
          <p className="text-sm mb-6" style={{ color: "var(--dl-text-secondary)", maxWidth: 500, margin: "0 auto 24px" }}>
            A contracted school plan is not generally available. Contact us to discuss your workflow, privacy review, accessibility, and evaluation requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/for-schools" className="dl-btn dl-btn-primary dl-btn-lg">
              School partnership information <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link href="/contact" className="dl-btn dl-btn-secondary dl-btn-lg">
              Contact us
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted)" }}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is the toolkit really free?", a: "Yes. Every resource is free with no signup. We built this because counselors managing 400+ students need practical, shareable tools." },
              { q: "Can I share these with students?", a: "Absolutely. Every tool and guide works without login. Print-friendly versions available." },
              { q: "What data sources does AdmitPath use?", a: "IPEDS College Navigator, official CDS reports, College Scorecard API, and Common App statistics. All cited with publication year." },
              { q: "Is there a school plan?", a: "A contracted school plan is not generally available. Schools can contact us to discuss a possible scoped evaluation." },
              { q: "Who built AdmitPath?", a: "AdmitPath is built as an AI college counseling workspace focused on application strategy, essays, college lists, and planning." },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--dl-text-primary)" }}>{faq.q}</h3>
                <p className="text-sm mt-1" style={{ color: "var(--dl-text-secondary)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
