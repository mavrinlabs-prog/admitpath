import Link from "next/link";
import type { Metadata } from "next";
import { MessageCircle, Lightbulb, AlertTriangle, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import interviewData from "@/../../public/interview-prep.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "College Interview Prep — 22 Questions & Tips",
  description:
    "22 real college interview questions across 5 categories. What to say, what to avoid, and how to prepare. Free guide.",
  alternates: { canonical: `${BASE}/resources/interview-prep` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "College Interview Prep — Questions & Tips",
    description: "22 common college interview questions across 5 categories with tips on what to say and avoid.",
    url: `${BASE}/resources/interview-prep`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Interview+Prep&subtitle=22+questions+%C2%B7+5+categories+%C2%B7+tips`, width: 1200, height: 630, alt: "College Interview Prep" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "College Interview Prep — Questions & Tips", description: "22 common interview questions with tips on what to say and avoid.", images: [`${BASE}/api/og?title=Interview+Prep&subtitle=22+questions+%C2%B7+5+categories+%C2%B7+tips`] },
};

type Question = {
  question: string;
  tip: string;
  avoid: string;
};

type Category = {
  name: string;
  description: string;
  questions: Question[];
};

export default function InterviewPrepPage() {
  const { categories, tips } = interviewData as {
    categories: Category[];
    tips: string[];
  };

  const totalQuestions = categories.reduce((sum, c) => sum + c.questions.length, 0);

  // Build FAQPage schema from interview Q&A — each question becomes an
  // FAQ entity with the "tip" as the answer. Eligible for FAQ rich result.
  const allQuestions = categories.flatMap((c) => c.questions);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/resources/interview-prep#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
          { "@type": "ListItem", position: 3, name: "Interview Prep", item: `${BASE}/resources/interview-prep` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${BASE}/resources/interview-prep#page`,
        url: `${BASE}/resources/interview-prep`,
        name: "College Interview Prep — Questions, Tips & What to Avoid",
        isPartOf: { "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${BASE}/resources/interview-prep#breadcrumb` },
        inLanguage: "en-US",
        mainEntity: { "@id": `${BASE}/resources/interview-prep#faq` },
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE}/resources/interview-prep#faq`,
        mainEntity: allQuestions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.tip,
          },
        })),
      },
      {
        "@type": "LearningResource",
        "@id": `${BASE}/resources/interview-prep#resource`,
        name: "College Interview Prep Guide",
        description: `${totalQuestions} common college interview questions across ${categories.length} categories with expert tips on what to say and what to avoid.`,
        url: `${BASE}/resources/interview-prep`,
        learningResourceType: "Reference",
        educationalLevel: ["HighSchool"],
        audience: { "@type": "EducationalAudience", educationalRole: "student" },
        isAccessibleForFree: true,
        inLanguage: "en-US",
        provider: { "@id": `${BASE}/#organization` },
      },
    ],
  };

  return (
    <MarketingLayout
      eyebrow="Resources"
      title="Interview Prep"
      description={`${totalQuestions} questions across ${categories.length} categories. Each one comes with a concrete tip and the most common mistake to avoid.`}
      backHref="/resources"
      backLabel="All resources"
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* Category quick nav */}
        <div className="mb-10 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={`#${cat.name.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "")}`}
              className="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:border-[color:#4A6FA5]"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {cat.name} ({cat.questions.length})
            </a>
          ))}
        </div>

        {/* Questions by category */}
        {categories.map((cat) => (
          <section
            key={cat.name}
            className="mb-12"
            id={cat.name.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "")}
          >
            <h2
              className="mb-2 flex items-center gap-2 text-[18px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
            >
              <MessageCircle className="h-4 w-4" style={{ color: "#4A6FA5" }} />
              {cat.name}
            </h2>
            <p className="mb-5 text-[13px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {cat.description}
            </p>

            <div className="space-y-4">
              {cat.questions.map((q, i) => (
                <div
                  key={i}
                  className="dl-card-hover rounded-xl border p-5"
                  style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <h3
                    className="text-[15px] font-semibold mb-3"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    &ldquo;{q.question}&rdquo;
                  </h3>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#16A34A" }} />
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        <span className="font-semibold" style={{ color: "#16A34A" }}>Do: </span>
                        {q.tip}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#DC2626" }} />
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        <span className="font-semibold" style={{ color: "#DC2626" }}>Avoid: </span>
                        {q.avoid}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* General Tips */}
        <section className="mb-12">
          <h2
            className="mb-4 text-[18px] font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
          >
            General Interview Tips
          </h2>
          <div
            className="dl-card-hover rounded-xl border p-5 space-y-3"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: "rgba(74,111,165,0.08)", color: "#4A6FA5" }}
                >
                  {i + 1}
                </span>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Practice CTA */}
        <section className="mb-12">
          <div
            className="dl-card-hover rounded-xl border p-6 text-center"
            style={{ background: "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(46,74,110,0.03))", borderColor: "rgba(74,111,165,0.15)" }}
          >
            <h2
              className="mb-2 text-[18px] font-semibold"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
            >
              Ready to practice? Try the AI Interview Coach.
            </h2>
            <p className="mb-4 text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              51 real questions. 2-minute timer. AI scores your answers on clarity, specificity, authenticity, relevance, and confidence.
            </p>
            <a
              href="/interview-practice"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}
            >
              Start practicing
            </a>
          </div>
        </section>

        {/* Related resources */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/resources/demonstrated-interest"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Demonstrated Interest
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Interviews are a key form of demonstrated interest at schools that track it. See which schools care.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Check your schools <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/resources/common-app-essay"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Common App Essay
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Interviewers often ask about your essay topics. Knowing your narrative helps you stay consistent across your application.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Read the prompts <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <MarketingCTA
          headline="Practice with mock interviews"
          description="Create your free profile and practice answering these questions with real-time AI feedback."
          buttonText="Create your free profile"
        />
    </MarketingLayout>
  );
}
