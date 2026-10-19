import type { Metadata } from "next";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "AdmitPath for Schools & Districts | Custom Pricing" },
  description:
    "College-planning tools for every student. Custom, quote-based pricing for schools and districts — request a quote.",
  alternates: { canonical: `${BASE}/for-schools` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AdmitPath for Schools & Districts",
    description: "Custom, quote-based pricing for schools and districts.",
    url: `${BASE}/for-schools`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/for-schools#page`,
  url: `${BASE}/for-schools`,
  name: "AdmitPath for Schools and Districts",
  description: "Custom-priced AdmitPath licenses for schools and districts.",
  isPartOf: { "@id": `${BASE}/#website` },
  inLanguage: "en-US",
};

export default function ForSchoolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
