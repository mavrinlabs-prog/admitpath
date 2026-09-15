import Link from "next/link";
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FileText, AlertTriangle, Lightbulb, Users, ArrowRight } from "lucide-react";
import {
  COMMON_APP_PROMPTS_DETAILED,
  COMMON_APP_WORD_LIMIT,
  COMMON_APP_MIN_WORDS,
  COMMON_APP_CYCLE,
} from "@/data/common-app-prompts";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: `How to Write the Common App Essay | ${COMMON_APP_CYCLE} | AdmitPath` },
  description: `Complete guide to the Common App essay ${COMMON_APP_CYCLE}: all 7 prompts analyzed, brainstorm framework, annotated examples, and mistakes to avoid. Free.`,
  alternates: { canonical: `${BASE}/resources/common-app-essay` },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Common App Essay Prompts ${COMMON_APP_CYCLE}`,
    description: `All 7 prompts with coaching: word limits, intent, pitfalls. Free.`,
    url: `${BASE}/resources/common-app-essay`,
    type: "article",
    images: [{
      url: `${BASE}/api/og?title=${encodeURIComponent(`Common App Essay Prompts ${COMMON_APP_CYCLE}`)}&subtitle=${encodeURIComponent(`All 7 prompts • ${COMMON_APP_WORD_LIMIT}-word limit • coaching included`)}`,
      width: 1200,
      height: 630,
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: `Common App Essay Prompts ${COMMON_APP_CYCLE}`, description: `All 7 prompts with coaching: word limits, intent, pitfalls. Free.`, images: [`${BASE}/api/og?title=${encodeURIComponent(`Common App Essay Prompts ${COMMON_APP_CYCLE}`)}&subtitle=${encodeURIComponent(`All 7 prompts • ${COMMON_APP_WORD_LIMIT}-word limit • coaching included`)}`] },
};

export default function CommonAppEssayPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE}/resources/common-app-essay#page`,
        url: `${BASE}/resources/common-app-essay`,
        name: `Common App Essay Prompts ${COMMON_APP_CYCLE}`,
        isPartOf: { "@id": `${BASE}/#website` },
        inLanguage: "en-US",
        breadcrumb: { "@id": `${BASE}/resources/common-app-essay#breadcrumbs` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/resources/common-app-essay#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
          { "@type": "ListItem", position: 3, name: "Common App Essay" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE}/resources/common-app-essay#faq`,
        mainEntity: COMMON_APP_PROMPTS_DETAILED.map((p) => ({
          "@type": "Question",
          name: `Common App Prompt ${p.number}: ${p.title}`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Best for: ${p.bestFor} What they're looking for: ${p.guidance.join(" ")} Common pitfalls: ${p.pitfalls.join(" ")}`,
          },
        })),
      },
      {
        "@type": "LearningResource",
        "@id": `${BASE}/resources/common-app-essay#resource`,
        name: `Common App Essay Prompts ${COMMON_APP_CYCLE}`,
        description: `All 7 official Common App personal statement prompts for ${COMMON_APP_CYCLE} with what each prompt rewards, what admissions wants, and pitfalls.`,
        url: `${BASE}/resources/common-app-essay`,
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
      backHref="/resources"
      backLabel="All resources"
      eyebrow={`${COMMON_APP_CYCLE} Cycle • ${COMMON_APP_PROMPTS_DETAILED.length} prompts • ${COMMON_APP_WORD_LIMIT}-word limit`}
      title="The Common App essay prompts."
      description={`The personal statement is the ${COMMON_APP_WORD_LIMIT}-word essay every applicant writes. Aim for ${COMMON_APP_MIN_WORDS}–${COMMON_APP_WORD_LIMIT} words. Pick the prompt your story actually fits — not the most impressive-sounding one.`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

        <ol className="space-y-8">
          {COMMON_APP_PROMPTS_DETAILED.map((p, idx) => (
            <ScrollReveal key={p.number} delay={idx * 0.06}>
            <li
              className="dl-card-hover rounded-2xl border p-5 sm:p-7"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
                <h2
                  className="text-[20px] font-semibold"
                  style={{
                    color: "var(--dl-text-primary, #1B2030)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  Prompt {p.number}: {p.title}
                </h2>
              </div>

              <div className="flex items-start gap-2 mb-4">
                <FileText className="h-4 w-4 mt-1 shrink-0" style={{ color: "#4A6FA5" }} />
                <p
                  className="text-[14px] leading-relaxed italic"
                  style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
                >
                  {p.prompt}
                </p>
              </div>

              <div
                className="mb-4 rounded-lg p-3"
                style={{ background: "rgba(255,255,255,0.45)" }}
              >
                <p
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  <Users className="h-3 w-3" />
                  Best for
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {p.bestFor}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg p-3" style={{ background: "rgba(74,111,165,0.07)" }}>
                  <p
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "#4A6FA5" }}
                  >
                    <Lightbulb className="h-3 w-3" />
                    What they really want
                  </p>
                  <ul className="space-y-1">
                    {p.guidance.map((g, gi) => (
                      <li
                        key={gi}
                        className="text-[12px] leading-relaxed pl-2.5"
                        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        • {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg p-3" style={{ background: "rgba(156,46,46,0.06)" }}>
                  <p
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "#9C2E2E" }}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Avoid
                  </p>
                  <ul className="space-y-1">
                    {p.pitfalls.map((pf, pi) => (
                      <li
                        key={pi}
                        className="text-[12px] leading-relaxed pl-2.5"
                        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        • {pf}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            </ScrollReveal>
          ))}
        </ol>

        {/* Related resources */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/resources/supplemental-essays"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Supplemental Essay Prompts
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Official 2026-27 prompts from top schools with word limits, intent, and pitfalls for each.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Read the prompts <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/college-essay-topic-finder"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Essay Topic Finder
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Stuck on what to write about? Get AI-generated topic suggestions based on your profile and experiences.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Find your topic <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <div
          className="mt-10 rounded-2xl border p-6 text-center"
          style={{
            background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
            borderColor: "#4A6FA5",
          }}
        >
          <p
            className="text-[20px] font-bold mb-2"
            style={{ color: "#fff", fontFamily: "var(--font-inter)" }}
          >
            Score your draft against the six-dimension rubric.
          </p>
          <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
            Free tier includes 5 essay scorings + 5 AI topic suggestions tailored to your profile.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
            style={{ background: "#fff", color: "#1E3352" }}
          >
            Start free
          </Link>
        </div>
    </MarketingLayout>
  );
}
