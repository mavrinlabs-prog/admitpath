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

// LEGAL REVIEW NEEDED (2026-10-22): 7-day free-trial automatic-renewal disclosure (state auto-renewal laws).
// LEGAL REVIEW NEEDED (2026-10-18): referral, billing/discount, school
// agreement, AI-output, and limitation-of-liability language below was drafted
// for clarity by engineering and must be reviewed by counsel before relying on
// it. Avoid adding guarantees or unenforceable waivers.
const sections = [
  {
    h: "1. The service",
    p: "AdmitPath is a college-planning tool. It generates profile scores, essay feedback, college-list suggestions, and planning guidance from the information you provide. Outputs are advisory. They do not predict, promise, or guarantee admission, scholarships, or financial aid.",
  },
  {
    h: "2. Eligibility and student accounts",
    p: "You must be at least 13 years old to use AdmitPath. If you are under 18, you confirm a parent or guardian has agreed to these terms. AdmitPath is not directed to children under 13.",
  },
  {
    h: "3. AI-generated outputs",
    p: "Some features use third-party AI models. AI output can be incomplete or wrong; verify deadlines, requirements, and facts with each college. When AI services are unavailable, some features return rule-based (non-AI) results and say so. You own the content you submit; you may use the feedback you receive for your own applications.",
  },
  {
    h: "4. Academic integrity",
    p: "AdmitPath gives feedback; it does not write your application. Do not submit AI-generated text as your own essay or recommendation. Colleges set their own integrity policies and you are responsible for following them.",
  },
  {
    h: "5. Plans, billing, and cancellation",
    p: "The Free plan is $0 with usage limits shown in the product. Pro is $19.99 per month, billed in advance through Stripe until you cancel. Your first Pro subscription starts with a 7-day free trial; a payment card is required, and you are charged $19.99 when the trial ends unless you cancel before then. The trial is offered once per customer. You can cancel any time from Billing; access continues through the end of the paid period. Prices may change with advance notice for future billing periods.",
  },
  {
    h: "6. Refunds",
    p: "Except where required by law, payments are non-refundable and we do not provide refunds for partial billing periods. If you believe you were charged in error, contact us within 30 days.",
  },
  {
    h: "7. Referrals and promotional codes",
    p: "A referral link gives a new account a one-time discount on its first Pro payment (currently 50% off the first month). A referrer may receive a single-use reward code after a referred account completes a paid Pro purchase, up to 12 rewards. Discounts are limited to one per person and household account; self-referrals, duplicate or fake accounts, and shared payment methods are not eligible. Codes have no cash value, cannot be transferred or resold, and may be revoked if obtained through abuse. We may change or end the program for future referrals at any time.",
  },
  {
    h: "8. Schools, districts, and counselors",
    p: "School, district, and counselor plans are priced by quote. Any organizational use of AdmitPath with student records requires a separate written agreement covering scope, pricing, and data handling (including FERPA and applicable state student-privacy laws). Submitting an inquiry form does not create an agreement.",
  },
  {
    h: "9. Acceptable use and account integrity",
    p: "Do not misuse the service, create multiple accounts to avoid limits or obtain discounts, scrape or bulk-extract data, or interfere with security. We use privacy-respecting signals (such as account email, a device cookie, and hashed network information) to detect abuse and may suspend accounts or void discounts that violate these terms.",
  },
  {
    h: "10. Your data",
    p: "Our Privacy Policy explains what we collect and how you can export or delete your data. You can export your data and delete your account from Settings.",
  },
  {
    h: "11. Disclaimers and liability",
    p: "AdmitPath is provided \u201cas is\u201d to the extent permitted by law. We are not responsible for admissions or financial-aid decisions, missed deadlines, or choices made based on the service. Nothing in these terms limits liability that cannot be limited under applicable law.",
  },
  {
    h: "12. Changes and contact",
    p: "We may update these terms; we will post the new effective date and notify subscribers of material changes by email. Questions: maestro.committee@gmail.com.",
  },
];

export default function TermsPage() {
  return (
    <MarketingLayout
      eyebrow={`Legal · ${new Date("2026-10-18").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
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
