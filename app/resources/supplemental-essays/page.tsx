import Link from "next/link";
import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FileText, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { SUPPLEMENTAL_ESSAYS } from "@/data/supplemental-essays";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Supplemental Essay Guide 2026 | Tips | AdmitPath",
  description:
    "How to write supplemental essays for top colleges. Prompt analysis, angle strategies, and annotated examples for Why Us and community essays.",
  alternates: { canonical: `${BASE}/resources/supplemental-essays` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Supplemental Essay Prompts 2026-27",
    description:
      "Official supplemental prompts from top US colleges with word limits, what they want, and pitfalls. Free.",
    url: `${BASE}/resources/supplemental-essays`,
    type: "article",
    images: [{
      url: `${BASE}/api/og?title=${encodeURIComponent("Supplemental Essay Prompts 2026-27")}&subtitle=${encodeURIComponent("20 top US colleges + word limits + coaching")}`,
      width: 1200,
      height: 630,
    }],
    locale: "en_US",
    siteName: "AdmitPath",
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Supplemental Essay Prompts 2026-27", description: "Official supplemental prompts from top US colleges with word limits and coaching. Free.", images: [`${BASE}/api/og?title=${encodeURIComponent("Supplemental Essay Prompts 2026-27")}&subtitle=${encodeURIComponent("20 top US colleges + word limits + coaching")}`] },
};

export default function SupplementalEssaysPage() {
  const totalPrompts = SUPPLEMENTAL_ESSAYS.reduce(
    (sum, s) => sum + s.prompts.length,
    0,
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE}/resources/supplemental-essays#page`,
        url: `${BASE}/resources/supplemental-essays`,
        name: "Supplemental Essay Prompts 2026–27",
        isPartOf: { "@id": `${BASE}/#website` },
        inLanguage: "en-US",
        breadcrumb: { "@id": `${BASE}/resources/supplemental-essays#breadcrumbs` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/resources/supplemental-essays#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
          { "@type": "ListItem", position: 3, name: "Supplemental Essays" },
        ],
      },
      {
        "@type": "LearningResource",
        "@id": `${BASE}/resources/supplemental-essays#resource`,
        name: "Supplemental Essay Prompts 2026–27 with Coaching",
        description: `Official supplemental essay prompts for ${SUPPLEMENTAL_ESSAYS.length} top US colleges with word limits, intent, and pitfalls to avoid.`,
        url: `${BASE}/resources/supplemental-essays`,
        learningResourceType: "Reference",
        educationalLevel: ["HighSchool"],
        audience: { "@type": "EducationalAudience", educationalRole: "student" },
        isAccessibleForFree: true,
        inLanguage: "en-US",
        provider: { "@id": `${BASE}/#organization` },
        about: SUPPLEMENTAL_ESSAYS.map((s) => ({ "@type": "CollegeOrUniversity", name: s.name })),
      },
    ],
  };

  return (
    <MarketingLayout
      backHref="/resources"
      backLabel="All resources"
      eyebrow={`${SUPPLEMENTAL_ESSAYS.length} schools • ${totalPrompts} prompts • 2026–27 cycle`}
      title="Supplemental Essay Prompts"
      description={`${SUPPLEMENTAL_ESSAYS.length} schools, ${totalPrompts} prompts for the 2026–27 cycle. Each prompt comes with what they really want and the most common pitfalls — written by AdmitPath, not the school.`}
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

        <div className="space-y-8">
          {SUPPLEMENTAL_ESSAYS.map((school, idx) => (
            <ScrollReveal key={school.slug} delay={idx * 0.04}>
            <section
              className="dl-card-hover rounded-2xl border p-5 sm:p-7"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
                <Link
                  href={`/supplemental/${school.slug}`}
                  className="text-[20px] font-semibold transition-colors hover:opacity-80"
                  style={{
                    color: "var(--dl-text-primary, #1B2030)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {school.name} →
                </Link>
                <span
                  className="text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  {school.cycle} • {school.prompts.length} prompt{school.prompts.length === 1 ? "" : "s"}
                </span>
              </div>

              {school.promptsCommonNote && (
                <p
                  className="text-[13px] italic leading-relaxed mb-5 rounded-lg p-3"
                  style={{
                    color: "var(--dl-text-secondary, #454B5E)",
                    fontFamily: "var(--font-inter)",
                    background: "rgba(255,255,255,0.45)",
                  }}
                >
                  {school.promptsCommonNote}
                </p>
              )}

              <ol className="space-y-6">
                {school.prompts.map((p, i) => (
                  <li key={i}>
                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="h-3.5 w-3.5 mt-1 shrink-0" style={{ color: "#4A6FA5" }} />
                      <p
                        className="text-[14px] leading-relaxed"
                        style={{ color: "var(--dl-text-primary, #1B2030)" }}
                      >
                        <span className="font-semibold">Prompt {i + 1}:</span> {p.prompt}
                      </p>
                    </div>
                    <div className="ml-5 flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                        style={{
                          color: "#4A6FA5",
                          background: "rgba(74,111,165,0.08)",
                        }}
                      >
                        {p.wordLimit === 0 ? "no limit" : `${p.wordLimit} words`}
                      </span>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                        style={{
                          color: p.required ? "#9C2E2E" : "var(--dl-text-muted, #5A6275)",
                          background: p.required ? "rgba(156,46,46,0.08)" : "rgba(255,255,255,0.45)",
                        }}
                      >
                        {p.required ? "required" : "optional"}
                      </span>
                    </div>

                    <div className="ml-5 grid sm:grid-cols-2 gap-3 mb-1">
                      <div
                        className="rounded-lg p-3"
                        style={{ background: "rgba(74,111,165,0.07)" }}
                      >
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
                      <div
                        className="rounded-lg p-3"
                        style={{ background: "rgba(156,46,46,0.06)" }}
                      >
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
                ))}
              </ol>
            </section>
            </ScrollReveal>
          ))}
        </div>

        {/* Related resources */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/resources/common-app-essay"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Common App Essay Prompts
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              All 7 official prompts with coaching on what each rewards and what to avoid.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Read the guide <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/resources/demonstrated-interest"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Demonstrated Interest
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Writing a strong &ldquo;Why us?&rdquo; supplement is the highest-impact form of demonstrated interest. See which schools track it.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Check your schools <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <MarketingCTA
            headline="Score your supplemental drafts"
            description="Free essay scorer grades your drafts on six dimensions and flags the pitfalls admissions readers notice first."
            buttonText="Start free"
          />
        </div>
    </MarketingLayout>
  );
}
