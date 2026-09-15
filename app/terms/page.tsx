import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Terms of Service — User Agreement",
  description:
    "AdmitPath Terms of Service. AI college counseling guidance, billing, refund policy, and acceptable use.",
  alternates: { canonical: `${BASE}/terms` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service — AdmitPath",
    description: "AdmitPath Terms of Service: AI counseling guidance, billing, refund policy, and acceptable use.",
    url: `${BASE}/terms`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Terms+of+Service&subtitle=User+agreement`, width: 1200, height: 630, alt: "AdmitPath Terms of Service" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Terms of Service — AdmitPath", description: "AdmitPath Terms of Service: billing, refunds, acceptable use.", images: [`${BASE}/api/og?title=Terms+of+Service&subtitle=User+agreement`] },
};

const termsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/terms#page`,
      url: `${BASE}/terms`,
      name: "Terms of Service — AdmitPath",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${BASE}/terms` },
      ],
    },
  ],
};

const sections = [
  {
    h: "1. The service",
    p: "AdmitPath is a college admissions guidance tool. It generates analyses, scores, and suggestions based on the information you provide. Outputs are advisory and do not predict, promise, or guarantee admission to any college or university.",
  },
  {
    h: "2. Eligibility",
    p: "You must be at least 13 years old to use AdmitPath. If you are under 18, you confirm you have permission from a parent or guardian.",
  },
  {
    h: "3. Subscriptions & billing",
    p: "Pro is $19.99/month. You are charged at the time of subscription and your card is billed monthly thereafter until you cancel. Cancel any time from /billing — you keep access through the end of the current billing period.",
  },
  {
    h: "4. Refunds",
    p: "We do not offer refunds for partial billing periods. If you cancel after a renewal, your access remains active through the end of the current period and you will not be charged again.",
  },
  {
    h: "5. Acceptable use",
    p: "Do not use AdmitPath to submit AI output as your own admissions essay, transcript, or recommendation. AdmitPath is a feedback and planning tool, not an essay writer. Misrepresenting AI-generated content as your own to a university is a violation of their academic integrity policies — not ours to enforce, but worth saying clearly.",
  },
  {
    h: "6. AI accuracy",
    p: "AI outputs are directional and based on calibration to publicly known admissions standards. They are not factual claims about any specific applicant's chances and should not be treated as such. Use them to find weak spots, not to predict outcomes.",
  },
  {
    h: "7. Account suspension",
    p: "We may suspend or terminate accounts that abuse the service, attempt to extract bulk data, or violate these terms.",
  },
  {
    h: "8. Liability",
    p: "AdmitPath is provided as-is. We are not responsible for college admissions outcomes, missed deadlines, or decisions made based on AI output. You alone are responsible for your applications.",
  },
  {
    h: "9. Changes",
    p: "We may update these terms. Continued use of AdmitPath after an update constitutes acceptance of the new terms.",
  },
  {
    h: "10. Contact",
    p: "Questions about billing or these terms? Email maestro.committee@gmail.com.",
  },
];

export default function TermsPage() {
  return (
    <MarketingLayout
      eyebrow={`Legal · ${new Date("2026-04-24").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
      title="Terms of Service"
      description="AI college counseling guidance, billing, refund policy, and acceptable use."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />

      <div className="space-y-8">
        {sections.map((s) => (
          <section
            key={s.h}
            className="dl-card-hover rounded-xl border p-5"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <h2
              className="text-base font-bold mb-2"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              {s.h}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {s.p}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t flex flex-wrap gap-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <Link href="/privacy" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Privacy Policy →
        </Link>
        <Link href="/security" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Security & Privacy →
        </Link>
        <Link href="/pricing" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          View pricing plans →
        </Link>
      </div>
    </MarketingLayout>
  );
}
