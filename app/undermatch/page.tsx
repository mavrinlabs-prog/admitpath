import type { Metadata } from "next";
import { UndermatchClient } from "./undermatch-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Are You Undermatching? Free Self-Check",
  description:
    "Explore whether your current college list overlooks schools with need-based aid. Results are research prompts, not admission or price estimates.",
  alternates: { canonical: `${BASE}/undermatch` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Are You Undermatching? Free Self-Check",
    description: "High-stat low-income students often miss T20 schools that cost less than their flagship. Check in 30 seconds.",
    url: `${BASE}/undermatch`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Undermatching+Self-Check&subtitle=Research-backed+%C2%B7+30+seconds+%C2%B7+free`, width: 1200, height: 630, alt: "Undermatching Self-Check" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Are You Undermatching? Free Self-Check", description: "Check if you're undermatching in 30 seconds. Research-backed, free.", images: [`${BASE}/api/og?title=Undermatching+Self-Check&subtitle=Research-backed+%C2%B7+30+seconds+%C2%B7+free`] },
};

const undermatchSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/undermatch#page`,
      url: `${BASE}/undermatch`,
      name: "Undermatching Self-Check",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
      mainEntity: { "@id": `${BASE}/undermatch#app` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/undermatch#app`,
      name: "AdmitPath Undermatching Self-Check",
      description:
        "Research-backed (Hoxby & Avery 2013) check for high-stat low-income students who systematically under-apply to T20 meets-full-need schools.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${BASE}/undermatch`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
  ],
};

export default function UndermatchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(undermatchSchema) }}
      />
      <h1 className="sr-only">Undermatch Detector</h1>
      <UndermatchClient />
    </>
  );
}
