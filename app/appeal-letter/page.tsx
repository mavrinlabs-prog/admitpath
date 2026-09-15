import type { Metadata } from "next";
import { AppealLetterClient } from "./appeal-letter-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Aid Appeal Letter Generator",
  description:
    "Generate a professional financial aid appeal letter. Fill in your details, select your reason, and get a customizable letter ready to send. Free.",
  alternates: { canonical: `${BASE}/appeal-letter` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Financial Aid Appeal Letter Generator",
    description: "Generate a professional aid appeal letter. Free template with 6 valid grounds.",
    url: `${BASE}/appeal-letter`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Appeal+Letter+Generator&subtitle=Free+template+%C2%B7+6+valid+grounds`, width: 1200, height: 630, alt: "Financial Aid Appeal Letter Generator" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Financial Aid Appeal Letter Generator", description: "Free appeal letter template with 6 valid grounds.", images: [`${BASE}/api/og?title=Appeal+Letter+Generator&subtitle=Free+template+%C2%B7+6+valid+grounds`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/appeal-letter#page`,
      url: `${BASE}/appeal-letter`,
      name: "Financial Aid Appeal Letter Generator",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE}/appeal-letter#app`,
      name: "AdmitPath Appeal Letter Generator",
      description: "Generate financial aid appeal letters with customizable templates.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: `${BASE}/appeal-letter`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
  ],
};

export default function AppealLetterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppealLetterClient />
    </>
  );
}
