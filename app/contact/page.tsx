import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Contact Us — AdmitPath Support",
  description:
    "Get in touch with the AdmitPath team. Questions about college admissions AI, billing, or your account? We respond within 24 hours.",
  alternates: { canonical: `${BASE}/contact` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact Us — AdmitPath",
    description: "Questions about AdmitPath? We respond within 24 hours.",
    url: `${BASE}/contact`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Contact+Us&subtitle=We+respond+within+24+hours`, width: 1200, height: 630, alt: "Contact AdmitPath" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "Contact Us — AdmitPath",
    description: "Questions about AdmitPath? We respond within 24 hours.",
    images: [`${BASE}/api/og?title=Contact+Us&subtitle=We+respond+within+24+hours`],
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${BASE}/contact#page`,
      url: `${BASE}/contact`,
      name: "Contact Us — AdmitPath",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${BASE}/contact` },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <main id="main" className="min-h-screen" style={{ background: "var(--color-bg, #D5DCE8)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: "var(--color-text-secondary, #454B5E)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: "var(--color-text-primary, #1B2030)" }}
        >
          Contact Us
        </h1>

        <p
          className="mt-4 text-base leading-relaxed"
          style={{ color: "var(--color-text-secondary, #454B5E)" }}
        >
          Have a question, feedback, or need help with your account? We respond
          to every message within 24 hours.
        </p>

        <div
          className="mt-8 rounded-xl p-6"
          style={{
            background: "var(--color-surface-raised, #FFFFFF)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: "#4A6FA5" }}
            >
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary, #1B2030)" }}
              >
                Email
              </p>
              <a
                href="mailto:maestro.committee@gmail.com"
                className="text-sm transition-colors hover:underline"
                style={{ color: "#4A6FA5" }}
              >
                maestro.committee@gmail.com
              </a>
            </div>
          </div>
        </div>

        <p
          className="mt-6 text-xs"
          style={{ color: "var(--color-text-muted, #8890A5)" }}
        >
          For urgent account issues (billing, data deletion), include your
          account email in the subject line and we will prioritize your request.
        </p>
      </div>
    </main>
  );
}
