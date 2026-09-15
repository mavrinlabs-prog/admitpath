import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Privacy Policy — Data Protection Practices",
  description:
    "How AdmitPath collects, uses, shares, and protects account, profile, billing, analytics, and AI request data.",
  alternates: { canonical: `${BASE}/privacy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy — AdmitPath",
    description: "How AdmitPath collects, uses, and protects your data. We never sell your information.",
    url: `${BASE}/privacy`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Privacy+Policy&subtitle=Data+protection+practices`, width: 1200, height: 630, alt: "AdmitPath Privacy Policy" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Privacy Policy — AdmitPath", description: "How AdmitPath protects your data. We never sell your information.", images: [`${BASE}/api/og?title=Privacy+Policy&subtitle=Data+protection+practices`] },
};

const privacySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/privacy#page`,
      url: `${BASE}/privacy`,
      name: "Privacy Policy — AdmitPath",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${BASE}/privacy` },
      ],
    },
  ],
};

const sections = [
  {
    h: "1. What we collect",
    p: "When you sign in with Google, we receive your name, email address, profile image, and Google account identifier. We store the academic, extracurricular, essay, college-list, and other content you choose to enter. Stripe collects payment details in its hosted checkout; AdmitPath does not receive or store full card numbers.",
  },
  {
    h: "2. How we use it",
    p: "We use account and profile data to provide analyses, essay feedback, college planning, support, billing, security, and product operations. We do not sell personal information or use it for third-party advertising. We share data with service providers only as needed to operate these functions or comply with law.",
  },
  {
    h: "3. AI model providers",
    p: "Relevant profile or essay context may be sent to Groq, Cerebras, and, for eligible requests when configured, Anthropic to generate analyses, feedback, and counselor responses. Their handling of request data is governed by their service terms and privacy policies. Do not submit sensitive information that is not needed for the feature.",
  },
  {
    h: "4. Cookies & analytics",
    p: "We use essential first-party cookies for signed Google OAuth sessions and preferences. Vercel Analytics is loaded only after analytics consent. Stripe may set cookies on its hosted checkout and billing pages. We do not use third-party advertising trackers.",
  },
  {
    h: "5. Optional product-improvement data",
    p: "Training-data collection is off by default. If you explicitly enable it in Settings, selected analyses and feedback may be stored for product improvement after direct identifiers are removed. You can withdraw that consent in Settings; withdrawal applies to future collection.",
  },
  {
    h: "6. Storage, email, and service providers",
    p: "Account data is stored in the configured Postgres database and the application is hosted on Vercel. Resend may process email addresses and message content for transactional or consented marketing email. Operational providers receive only the information needed for their role.",
  },
  {
    h: "7. Your rights",
    p: "You can export, edit, or delete your profile data at any time from /settings. To request full account deletion, email maestro.committee@gmail.com — we will remove your records within 30 days.",
  },
  {
    h: "8. Children",
    p: "AdmitPath is intended for high school students aged 13 and older. If you are under 13, do not create an account.",
  },
  {
    h: "9. Changes",
    p: "We may update this policy. The effective date below will reflect the most recent revision. Material changes will be announced by email to subscribed users.",
  },
  {
    h: "10. Contact",
    p: "Questions? Email maestro.committee@gmail.com.",
  },
];

export default function PrivacyPage() {
  return (
    <MarketingLayout
      eyebrow={`Legal · ${new Date("2026-07-13").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
      title="Privacy Policy"
      description="How AdmitPath collects, uses, and protects your data. We never sell your information."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
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
        <Link href="/terms" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Terms of Service →
        </Link>
        <Link href="/security" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Security & Privacy →
        </Link>
        <Link href="/sign-up" className="text-sm font-medium" style={{ color: "#4A6FA5" }}>
          Create your free account →
        </Link>
      </div>
    </MarketingLayout>
  );
}
