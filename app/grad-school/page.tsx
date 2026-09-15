import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  FileText,
  ListChecks,
  Clock,
  ArrowRight,
  Mail,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/grad-school#page`,
      url: `${BASE}/grad-school`,
      name: "Graduate Admissions — MBA, Med, Law, PhD",
      description:
        "MBA, Med School, Law School, PhD admissions guidance. Same data-driven framework, adapted for graduate programs.",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Graduate Admissions", item: `${BASE}/grad-school` },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: "Graduate Admissions — MBA, Med, Law, PhD",
  description:
    "MBA, Med School, Law School, PhD admissions guidance. Profile scoring adapted for graduate programs, personal statement feedback, and school list building.",
  alternates: { canonical: `${BASE}/grad-school` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Graduate Admissions — AdmitPath",
    description:
      "Same data-driven framework, adapted for MBA, Med School, Law School, and PhD programs.",
    url: `${BASE}/grad-school`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=Graduate+Admissions&subtitle=MBA,+Med+School,+Law+School,+PhD`,
        width: 1200,
        height: 630,
        alt: "Graduate Admissions — AdmitPath",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "Graduate Admissions — AdmitPath",
    description:
      "Same data-driven framework, adapted for MBA, Med School, Law School, and PhD programs.",
    images: [
      `${BASE}/api/og?title=Graduate+Admissions&subtitle=MBA,+Med+School,+Law+School,+PhD`,
    ],
  },
};

export default function GradSchoolPage() {
  return (
    <MarketingLayout
      eyebrow="Graduate Admissions"
      title="MBA, Med School, Law School, PhD — Same Framework, Higher Stakes"
      description="The AdmitPath scoring framework works for undergraduate admissions. We're adapting it for graduate programs where the stakes — and the process — are fundamentally different."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Why grad admissions is different ── */}
      <Section title="Why grad admissions is different" Icon={GraduationCap}>
        <div
          className="rounded-2xl p-6 sm:p-8 space-y-5"
          style={{
            background: "var(--dl-bg-white, #fff)",
            border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
            boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
            borderRadius: "var(--dl-radius-lg, 16px)",
          }}
        >
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Graduate admissions is not a scaled-up version of undergrad. The
            evaluation criteria, the tests, and the weight of each component
            shift dramatically depending on the program type.
          </p>
          <ul className="space-y-3">
            {[
              {
                label: "Standardized tests change entirely",
                detail:
                  "GMAT for MBA, MCAT for med school, LSAT for law school, GRE for PhD — each has its own scoring scale, prep timeline, and weight in admissions decisions.",
              },
              {
                label: "Work experience matters",
                detail:
                  "MBA programs expect 3-5 years of post-college work. Med schools want clinical hours and research. Law schools care about your personal trajectory. PhD programs weigh research fit above almost everything else.",
              },
              {
                label: "Research fit is critical for PhD",
                detail:
                  "Getting into a PhD program is less about your overall profile and more about finding a faculty advisor whose research aligns with yours. A perfect GPA means nothing if no professor wants to supervise your work.",
              },
              {
                label: "Essays shift from narrative to professional",
                detail:
                  "Personal statements for grad school need to demonstrate professional maturity, clear goals, and self-awareness — not the coming-of-age story that works for undergrad.",
              },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <div
                  className="mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(74,111,165,0.10)",
                    color: "var(--dl-brand, #4A6FA5)",
                  }}
                >
                  <BookOpen className="h-3 w-3" />
                </div>
                <div>
                  <p
                    className="text-[14px] font-semibold"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[13px] leading-relaxed mt-0.5"
                    style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  >
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── What AdmitPath covers ── */}
      <Section title="What AdmitPath covers" Icon={FileText}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Profile scoring for grad",
              description:
                "Our 7-dimension framework re-weighted for graduate programs: academic rigor, test scores, work experience, research output, recommendations, essays, and program fit.",
              Icon: ListChecks,
            },
            {
              title: "Essay feedback",
              description:
                "Line-by-line AI feedback adapted for personal statements, diversity essays, and the 'why this program' prompts that graduate schools require.",
              Icon: FileText,
            },
            {
              title: "School list building",
              description:
                "Data-driven reach/target/safety lists for graduate programs, calibrated to real acceptance rates and your specific profile.",
              Icon: GraduationCap,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: "var(--dl-bg-white, #fff)",
                border: "1px solid var(--dl-border, rgba(0,0,0,0.06))",
                boxShadow: "var(--dl-shadow-sm, 0 1px 4px rgba(0,0,0,0.06))",
                borderRadius: "var(--dl-radius-lg, 16px)",
              }}
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: "rgba(74,111,165,0.10)",
                  color: "var(--dl-brand, #4A6FA5)",
                }}
              >
                <card.Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <h3
                className="text-[15px] font-semibold mb-1"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {card.title}
              </h3>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Coming soon ── */}
      <Section title="Coming soon" Icon={Clock}>
        <div
          className="rounded-2xl p-6 sm:p-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(74,111,165,0.06), rgba(74,111,165,0.02))",
            border: "1.5px dashed rgba(74,111,165,0.25)",
            borderRadius: "var(--dl-radius-lg, 16px)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-4"
            style={{
              background: "rgba(74,111,165,0.10)",
              color: "var(--dl-brand, #4A6FA5)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--dl-font-mono, monospace)",
            }}
          >
            Beta / Waitlist
          </div>
          <p
            className="text-[15px] leading-relaxed max-w-lg mx-auto mb-6"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Graduate admissions features are in active development. Join the
            waitlist to get early access and help shape what we build.
          </p>
          <a
            href="mailto:maestro.committee@gmail.com?subject=Grad%20School%20Waitlist&body=I%27m%20interested%20in%20AdmitPath%20for%20graduate%20admissions.%20Program%20type%3A%20"
            className="dl-btn dl-btn-primary dl-btn-lg inline-flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Join the grad school waitlist
          </a>
        </div>
      </Section>

      {/* ── CTA ── */}
      <MarketingCTA
        headline="Join the grad school waitlist"
        description="Be the first to know when AdmitPath launches graduate admissions features. Same framework. Higher stakes. Better outcomes."
        buttonText="Join the waitlist"
        buttonHref="mailto:maestro.committee@gmail.com?subject=Grad%20School%20Waitlist&body=I%27m%20interested%20in%20AdmitPath%20for%20graduate%20admissions."
      />
    </MarketingLayout>
  );
}
