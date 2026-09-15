import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { Section } from "@/components/marketing/Section";
import {
  Video,
  DollarSign,
  Lightbulb,
  Rocket,
  Play,
  Upload,
  Banknote,
  TrendingUp,
  FileText,
  BarChart3,
  MessageSquare,
  Eye,
} from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Creator Program — Earn $50-500 Per Video",
  description:
    "Create content about college admissions using AdmitPath. Earn $50-500 per video on TikTok, YouTube, and Instagram.",
  alternates: { canonical: `${BASE}/creators` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Creator Program — Earn $50-500 Per Video",
    description: "Create content about college admissions using AdmitPath. Earn $50-500 per video.",
    url: `${BASE}/creators`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=Creator+Program&subtitle=Earn+%2450-500+per+video`,
        width: 1200,
        height: 630,
        alt: "AdmitPath Creator Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "Creator Program | AdmitPath",
    description: "Create content about college admissions using AdmitPath. Earn $50-500 per video.",
    images: [`${BASE}/api/og?title=Creator+Program&subtitle=Earn+%2450-500+per+video`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/creators#page`,
      url: `${BASE}/creators`,
      name: "AdmitPath Creator Program",
      description: "Get paid to create college admissions content with AdmitPath.",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      mainEntity: {
        "@type": "Offer",
        name: "AdmitPath Creator Program",
        description: "Earn $50-500 per video creating content about college admissions using AdmitPath.",
        seller: { "@type": "Organization", name: "AdmitPath" },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Creator Program", item: `${BASE}/creators` },
      ],
    },
  ],
};

const HOW_IT_WORKS = [
  {
    icon: Play,
    title: "1. Create a video",
    description: "Record yourself using any AdmitPath tool — score your profile, review an essay, build your college list, or chat with our AI counselor.",
  },
  {
    icon: Upload,
    title: "2. Post it",
    description: "Share on TikTok, YouTube Shorts, Instagram Reels, or YouTube long-form. Tag @admitpath and include your referral link.",
  },
  {
    icon: Banknote,
    title: "3. Get paid",
    description: "Once your video hits the view threshold, we send payment. Simple as that — no complicated contracts.",
  },
];

const CONTENT_IDEAS = [
  {
    icon: BarChart3,
    title: "My 7-dimension score reaction",
    description: "React to your AdmitPath profile score live. These get great engagement because the scoring is brutally honest.",
  },
  {
    icon: FileText,
    title: "I scored my essay live",
    description: "Paste your Common App essay into AdmitPath and react to the 6-dimension feedback in real time.",
  },
  {
    icon: TrendingUp,
    title: "Building my college list",
    description: "Use the college match tool to build a balanced reach/match/safety list and explain your reasoning.",
  },
  {
    icon: MessageSquare,
    title: "My counselor chat session",
    description: "Have a live conversation with the AI counselor about your application strategy and record the highlights.",
  },
];

const COMPENSATION = [
  {
    views: "1,000+",
    payout: "$50",
    description: "Per video with 1,000+ views within 30 days of posting.",
  },
  {
    views: "10,000+",
    payout: "$200",
    description: "Per video with 10,000+ views within 30 days of posting.",
  },
  {
    views: "100,000+",
    payout: "$500",
    description: "Per video with 100,000+ views within 30 days of posting.",
  },
];

export default function CreatorsPage() {
  return (
    <MarketingLayout
      eyebrow="Creator Program"
      title="Get Paid to Share Your College Experience"
      description="Create content about college admissions using AdmitPath. Earn $50-500 per video."
      maxWidth="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* How it works */}
      <Section title="How it works" Icon={Rocket}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.title}
              className="border p-5 dl-card-hover"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
              }}
            >
              <div
                className="shrink-0 rounded-xl p-2.5 inline-block mb-3"
                style={{ background: "rgba(74,111,165,0.08)" }}
              >
                <step.icon className="h-5 w-5" style={{ color: "#4A6FA5" }} strokeWidth={1.75} />
              </div>
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Content ideas */}
      <Section title="Content ideas that perform" Icon={Lightbulb}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTENT_IDEAS.map((idea) => (
            <div
              key={idea.title}
              className="border p-5 dl-card-hover"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 rounded-xl p-2.5"
                  style={{ background: "rgba(74,111,165,0.08)" }}
                >
                  <idea.icon
                    className="h-5 w-5"
                    style={{ color: "#4A6FA5" }}
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold mb-1"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    {idea.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  >
                    {idea.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Compensation */}
      <Section title="Compensation" Icon={DollarSign}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COMPENSATION.map((tier) => (
            <div
              key={tier.views}
              className="border p-6 text-center dl-card-hover"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
              }}
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <Eye className="h-4 w-4" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {tier.views} views
                </p>
              </div>
              <p
                className="text-3xl font-extrabold mb-2"
                style={{ color: "#4A6FA5" }}
              >
                {tier.payout}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--dl-text-muted, #8890A5)" }}
              >
                {tier.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Apply CTA */}
      <Section title="Apply now" Icon={Video}>
        <div
          className="border p-8 text-center"
          style={{
            borderColor: "rgba(0,0,0,0.06)",
            background: "rgba(74,111,165,0.06)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "14px",
          }}
        >
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
          >
            Ready to start creating?
          </h3>
          <p
            className="text-sm leading-relaxed mb-5 max-w-lg mx-auto"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            Send us your social profiles and a brief intro. We accept creators of all sizes —
            micro-creators with engaged audiences do especially well.
          </p>
          <a
            href="mailto:maestro.committee@gmail.com?subject=Creator%20Program%20Application"
            className="dl-btn dl-btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"
          >
            Apply: maestro.committee@gmail.com
          </a>
        </div>
      </Section>

      {/* Bottom CTA */}
      <div className="mt-8">
        <MarketingCTA
          headline="Not a creator? Start using AdmitPath today"
          description="Get your free 7-dimension profile score and see where you stand."
          buttonText="Get free score"
          buttonHref="/sign-up"
        />
      </div>
    </MarketingLayout>
  );
}
