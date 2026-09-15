import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  Target,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Brain,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Admissions Framework 2026 — 200+ Articles",
  description:
    "The definitive guide to college admissions in 2026: 200+ articles, 22 reference pages, and 45 tools covering every step from academics to financial aid.",
  alternates: { canonical: `${BASE}/college-admissions-framework-2026` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "The Complete College Admissions Framework 2026",
    description:
      "200+ articles, 22 reference pages, and 44 tools covering academics, testing, essays, and financial aid.",
    url: `${BASE}/college-admissions-framework-2026`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{
      url: `${BASE}/api/og?title=Complete+Admissions+Framework&subtitle=200%2B+articles+%C2%B7+45+free+tools`,
      width: 1200,
      height: 630,
      alt: "AdmitPath Complete Admissions Framework — 200+ articles and 45 tools",
    }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Complete Admissions Framework 2026", description: "200+ articles, 22 reference pages, and 45 tools covering every step.", images: [`${BASE}/api/og?title=Complete+Admissions+Framework&subtitle=200%2B+articles+%C2%B7+45+free+tools`] },
};

const FRAMEWORK_SECTIONS = [
  {
    title: "Academic Foundation",
    Icon: BookOpen,
    description: "GPA, course rigor, testing strategy — the baseline every application needs.",
    links: [
      { href: "/blog/how-many-aps-is-enough", label: "How many APs is enough?" },
      { href: "/blog/balancing-senior-year-course-rigor", label: "Senior year course rigor" },
      { href: "/blog/the-data-on-test-scores-2026", label: "Test scores in 2026" },
      { href: "/blog/should-i-apply-test-optional", label: "Test-optional strategy" },
      { href: "/test-optional-schools-2026", label: "Test-optional schools reference" },
      { href: "/blog/the-difference-between-test-required-and-test-optional-strategy", label: "Test-required vs test-optional" },
      { href: "/blog/when-to-take-the-act-instead-of-sat", label: "ACT vs SAT" },
      { href: "/application-component-weighting", label: "Component weighting reference" },
    ],
  },
  {
    title: "Extracurricular Spike",
    Icon: Target,
    description: "Building depth in 1-2 areas. Why spike beats well-rounded.",
    links: [
      { href: "/blog/what-counts-as-a-spike", label: "What counts as a spike" },
      { href: "/blog/the-difference-between-spike-and-pile", label: "Spike vs pile" },
      { href: "/blog/what-colleges-look-for-in-your-spike", label: "What colleges look for in your spike" },
      { href: "/blog/how-to-build-a-winning-research-experience", label: "Building research experience" },
      { href: "/blog/the-real-impact-of-extracurricular-titles", label: "Do titles matter?" },
      { href: "/blog/how-to-write-a-compelling-activities-list-description", label: "Activities list descriptions" },
      { href: "/summer-experience-strategy", label: "Summer experience strategy" },
    ],
  },
  {
    title: "Essays",
    Icon: FileText,
    description: "Personal statement, supplements, authenticity — the highest-leverage component.",
    links: [
      { href: "/college-essay-topic-finder", label: "Essay topic finder" },
      { href: "/college-essay-revision-checklist", label: "Essay revision checklist" },
      { href: "/personal-statement-guide", label: "Personal statement guide" },
      { href: "/blog/what-makes-a-college-essay-memorable", label: "What makes essays memorable" },
      { href: "/blog/the-real-purpose-of-college-supplements", label: "What supplements test" },
      { href: "/blog/how-to-write-the-why-major-essay", label: "Why major essay" },
      { href: "/blog/when-to-write-about-trauma-in-essays", label: "Writing about trauma" },
      { href: "/blog/what-to-do-when-your-essay-doesnt-feel-authentic", label: "Recovering authenticity" },
      { href: "/blog/the-art-of-the-college-personal-statement-second-paragraph", label: "The second paragraph" },
      { href: "/blog/the-art-of-the-college-personal-statement-conclusion", label: "The conclusion" },
      { href: "/blog/how-to-write-about-failure-without-cliche", label: "Writing about failure" },
      { href: "/college-essay-examples", label: "Essay examples" },
    ],
  },
  {
    title: "Recommendations",
    Icon: Users,
    description: "Choosing recommenders, brag sheets, and what strong letters look like.",
    links: [
      { href: "/blog/what-the-best-college-letters-of-rec-include", label: "What strong letters include" },
      { href: "/blog/how-recommendations-affect-marginal-admit-decisions", label: "Rec letters at the margin" },
      { href: "/blog/what-strong-recommendation-language-actually-says", label: "Recommendation language decoded" },
      { href: "/blog/what-recommenders-secretly-think-when-asked", label: "What recommenders think" },
      { href: "/blog/school-counselor-letter-strategy", label: "Counselor letter strategy" },
      { href: "/blog/brag-sheet-counselor-recommendation", label: "Brag sheet guide" },
    ],
  },
  {
    title: "School List & Strategy",
    Icon: Target,
    description: "Building a balanced school list. ED/EA/RD strategy. Research framework.",
    links: [
      { href: "/college-list-builder", label: "College list builder" },
      { href: "/college-research-strategy", label: "Research strategy" },
      { href: "/blog/how-to-evaluate-a-school-list", label: "Evaluating your school list" },
      { href: "/blog/the-ed-ea-rea-strategy-explained", label: "ED/EA/REA strategy" },
      { href: "/blog/how-to-choose-between-ed1-schools", label: "Choosing your ED school" },
      { href: "/blog/how-yield-protection-actually-works", label: "Yield protection" },
      { href: "/blog/the-honest-guide-to-demonstrated-interest-2026", label: "Demonstrated interest 2026" },
      { href: "/blog/the-cost-of-not-applying-broadly", label: "Why apply broadly" },
      { href: "/blog/what-rejected-applications-have-in-common", label: "Why applications get rejected" },
      { href: "/college-application-timeline-2026", label: "Application timeline 2026" },
      { href: "/college-application-checklist", label: "Application checklist" },
    ],
  },
  {
    title: "Financial Strategy",
    Icon: DollarSign,
    description: "Financial aid, cost comparison, merit aid, and the honest economics.",
    links: [
      { href: "/financial-aid-appeal-guide", label: "Financial aid appeal guide" },
      { href: "/blog/how-to-research-financial-aid-policies", label: "Researching aid policies" },
      { href: "/blog/the-cost-comparison-trap-most-families-fall-into", label: "Cost comparison trap" },
      { href: "/blog/what-financial-aid-officers-actually-do", label: "What aid officers do" },
      { href: "/blog/what-financial-aid-renewal-actually-requires", label: "Aid renewal requirements" },
      { href: "/blog/the-honest-cost-of-attending-out-of-state", label: "Out-of-state cost" },
      { href: "/blog/the-honest-economics-of-college-degrees-2026", label: "Economics of college degrees" },
      { href: "/blog/when-to-pursue-financial-aid-vs-cost-of-attendance", label: "Aid vs cost of attendance" },
      { href: "/blog/the-hidden-cost-of-prestige-chasing", label: "Cost of prestige-chasing" },
      { href: "/need-blind-vs-need-aware-schools", label: "Need-blind vs need-aware reference" },
      { href: "/scholarship-application-guide", label: "Scholarship guide" },
      { href: "/net-price", label: "Net price estimator" },
      { href: "/net-price", label: "Net price estimator" },
    ],
  },
  {
    title: "Decision-Making",
    Icon: Brain,
    description: "Comparing offers, handling rejection, the psychology of choice.",
    links: [
      { href: "/college-decision-comparison-guide", label: "Decision comparison guide" },
      { href: "/college-decision-day", label: "Decision day framework" },
      { href: "/college-rejection-recovery", label: "Rejection recovery (5 paths)" },
      { href: "/college-rejection-recovery-checklist", label: "Rejection recovery checklist" },
      { href: "/blog/how-to-handle-college-application-rejection-emotionally", label: "Handling rejection emotionally" },
      { href: "/blog/the-honest-guide-to-college-waitlist-odds", label: "Waitlist odds 2026" },
      { href: "/blog/what-to-do-after-being-waitlisted", label: "What to do after waitlist" },
      { href: "/blog/the-psychology-of-college-choice", label: "Psychology of college choice" },
      { href: "/college-acceptance-letter-decoder", label: "Acceptance letter decoder" },
    ],
  },
  {
    title: "Planning & Mindset",
    Icon: Calendar,
    description: "Junior year strategy, mental models, self-reflection, and the quiet skills.",
    links: [
      { href: "/blog/how-to-think-about-college-during-junior-year", label: "Junior year planning" },
      { href: "/blog/the-mental-models-of-strong-applicants", label: "Mental models" },
      { href: "/blog/the-overlooked-step-of-college-applications", label: "Self-reflection" },
      { href: "/blog/the-quiet-skill-of-applying-to-college", label: "The quiet skills" },
      { href: "/blog/what-students-secretly-do-during-application-cycle", label: "What students secretly do" },
      { href: "/blog/how-to-handle-anxiety-after-applications-submitted", label: "Managing anxiety" },
      { href: "/blog/how-to-handle-multiple-conflicting-deadlines", label: "Managing deadlines" },
      { href: "/blog/what-to-do-during-senior-spring-after-applications", label: "Senior spring playbook" },
      { href: "/blog/how-to-make-the-most-of-your-college-experience", label: "Making the most of college" },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE}/college-admissions-framework-2026#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Admissions Framework 2026", item: `${BASE}/college-admissions-framework-2026` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/college-admissions-framework-2026#page`,
      url: `${BASE}/college-admissions-framework-2026`,
      name: "The Complete College Admissions Framework 2026",
      description: "The definitive guide to college admissions in 2026. 200+ articles, 22 reference pages, 44 tools.",
      isPartOf: { "@id": `${BASE}/#website` },
      breadcrumb: { "@id": `${BASE}/college-admissions-framework-2026#breadcrumb` },
      inLanguage: "en-US",
    },
  ],
};

export default function CollegeAdmissionsFramework2026Page() {
  return (
    <MarketingLayout
      eyebrow="Complete Framework"
      title="The Complete College Admissions Framework"
      description="Everything that matters for college admissions in 2026, organized into 8 dimensions. 200+ deep-dive articles. 22 reference pages. 44 tools. The most comprehensive free resource for college admissions on the web."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p
        className="max-w-2xl text-[13px] leading-relaxed mb-12 -mt-8"
        style={{ color: "var(--dl-text-muted, #5A6275)" }}
      >
        Start with the section most relevant to where you are in the
        process. Each section links to specific articles and tools.
      </p>

      <div className="space-y-8">
        {FRAMEWORK_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2
              className="mb-2 flex items-center gap-2 text-[20px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              <section.Icon className="h-5 w-5" style={{ color: "#4A6FA5" }} />
              {section.title}
            </h2>
            <p className="mb-3 text-[13.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {section.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5]"
                  style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-12 mb-12">
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderLeft: "3px solid #4A6FA5" }}
        >
          <h2
            className="mb-2 text-[18px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            The honest truth
          </h2>
          <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            College admissions is partly a meritocracy, partly an
            institutional needs exercise, and partly random. You
            can&apos;t control all of it. What you can do: build the
            strongest application possible across all dimensions, apply
            strategically to a balanced school list, manage the process
            without letting it consume your mental health, and trust
            that wherever you end up, the experience you build matters
            more than the name on the building.
          </p>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            The school you attend is one variable. What you do there is
            many variables. Optimize both.
          </p>
        </div>
      </section>

      <MarketingCTA
        headline="Navigate admissions with the complete framework."
        description="AdmitPath combines this framework with personalized guidance for your specific profile. 200+ articles. 44 tools. Honest data. Free plan included. Pro $19.99/mo."
        buttonText="Get started free"
      />
    </MarketingLayout>
  );
}
