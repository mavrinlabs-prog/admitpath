import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import data from "@/../../public/demonstrated-interest.json";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Demonstrated Interest — Which Schools Track It",
  description:
    "17 schools that track demonstrated interest, 16 that don't, and 11 specific actions ranked by weight. Free guide.",
  alternates: { canonical: `${BASE}/resources/demonstrated-interest` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Demonstrated Interest — Which Schools Track It",
    description: "17 schools that track demonstrated interest, 16 that don't, and the 11 actions that move the needle.",
    url: `${BASE}/resources/demonstrated-interest`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Demonstrated+Interest&subtitle=Which+schools+track+it`, width: 1200, height: 630, alt: "Demonstrated Interest Guide" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Demonstrated Interest — Which Schools Track It", description: "17 schools that track it, 16 that don't, and the 11 actions that matter.", images: [`${BASE}/api/og?title=Demonstrated+Interest&subtitle=Which+schools+track+it`] },
};

type Tracked = { school: string; level: string };
type Action = { action: string; weight: string; tip: string };
type Category = { category: string; items: Action[] };

export default function DemonstratedInterestPage() {
  const { tracked, notTracked, actions } = data as {
    tracked: Tracked[];
    notTracked: string[];
    actions: Category[];
  };

  const allActions = actions.flatMap((c) => c.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/resources/demonstrated-interest#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE}/resources` },
          { "@type": "ListItem", position: 3, name: "Demonstrated Interest", item: `${BASE}/resources/demonstrated-interest` },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${BASE}/resources/demonstrated-interest#page`,
        url: `${BASE}/resources/demonstrated-interest`,
        name: "Demonstrated Interest — Which Schools Track It",
        isPartOf: { "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${BASE}/resources/demonstrated-interest#breadcrumb` },
        inLanguage: "en-US",
        mainEntity: { "@id": `${BASE}/resources/demonstrated-interest#howto` },
      },
      {
        "@type": "HowTo",
        "@id": `${BASE}/resources/demonstrated-interest#howto`,
        name: "How to Demonstrate Interest in Colleges",
        description:
          "Specific, weighted actions you can take to signal genuine interest to colleges that track it.",
        totalTime: "P12M",
        step: allActions.map((a, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: a.action,
          text: a.tip,
        })),
      },
      {
        "@type": "LearningResource",
        "@id": `${BASE}/resources/demonstrated-interest#resource`,
        name: "Demonstrated Interest Guide",
        description: `Which schools track demonstrated interest, which don't, and ${allActions.length} specific actions ranked by weight.`,
        url: `${BASE}/resources/demonstrated-interest`,
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
      title="Demonstrated Interest"
      description="A school's measure of how likely you are to enroll if admitted. At the schools that track it, getting it wrong can cost you the admit. At the ones that don't, hours of effort go to waste."
      backHref="/resources"
      backLabel="All resources"
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

        {/* Tracked vs not tracked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div
            className="dl-card-hover rounded-xl border p-5"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <h2 className="flex items-center gap-2 text-[15px] font-semibold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              <Eye className="h-4 w-4" style={{ color: "#4A6FA5" }} /> Schools that TRACK demonstrated interest
            </h2>
            <ul className="space-y-1.5 text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {tracked.map((t) => (
                <li key={t.school} className="flex items-center justify-between gap-2">
                  <span>{t.school}</span>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: t.level === "Important" ? "#DC2626" : "#4A6FA5" }}
                  >
                    {t.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="dl-card-hover rounded-xl border p-5"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <h2 className="flex items-center gap-2 text-[15px] font-semibold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              <EyeOff className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} /> Schools that DON&apos;T track
            </h2>
            <ul className="space-y-1.5 text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {notTracked.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action checklist */}
        {actions.map((cat) => (
          <section key={cat.category} className="mb-10">
            <h2
              className="text-[18px] font-semibold mb-4"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
            >
              {cat.category}
            </h2>
            <div className="space-y-3">
              {cat.items.map((a, i) => (
                <div
                  key={i}
                  className="dl-card-hover rounded-xl border p-4"
                  style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-start gap-2.5 mb-1">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <h3 className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                          {a.action}
                        </h3>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            color: a.weight === "Highest" ? "#DC2626" : a.weight === "High" ? "#4A6FA5" : a.weight === "Medium" ? "#2E4A6E" : "var(--dl-text-muted, #5A6275)",
                            background: a.weight === "Highest" ? "rgba(220,38,38,0.08)" : a.weight === "High" ? "rgba(74,111,165,0.08)" : a.weight === "Medium" ? "rgba(46,74,110,0.08)" : "rgba(255,255,255,0.45)",
                          }}
                        >
                          {a.weight}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        {a.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Disclaimer */}
        <div
          className="mb-10 flex items-start gap-3 rounded-xl border p-4"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Schools&apos; DI policies change year to year. The most reliable signal is
            still applying ED to your true first choice and writing a strong
            school-specific supplement. Don&apos;t turn DI into a stalking exercise —
            quality contact beats quantity every time.
          </p>
        </div>

        {/* Related resources */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/resources/interview-prep"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Interview Prep
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Interviews are a high-weight form of demonstrated interest. 22 real questions with what to say and what to avoid.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Prep for interviews <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <Link
            href="/resources/supplemental-essays"
            className="dl-card-hover rounded-2xl border p-5 flex flex-col gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-[14px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              Supplemental Essays
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              A strong &ldquo;Why us?&rdquo; supplement is the single highest-weight demonstrated interest signal. See prompts from top schools.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#4A6FA5" }}>
              Read the prompts <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* CTA */}
        <MarketingCTA
          headline="Want a personalized DI checklist?"
          description="Create your free profile and get a personalized demonstrated interest checklist for your college list."
          buttonText="Create your free profile"
        />
    </MarketingLayout>
  );
}
