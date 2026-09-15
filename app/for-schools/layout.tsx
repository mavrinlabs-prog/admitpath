import type { Metadata } from "next";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "School Partnership Inquiries | AdmitPath" },
  description:
    "Review AdmitPath's current student-facing planning tools and contact the team to discuss a scoped school evaluation.",
  alternates: { canonical: `${BASE}/for-schools` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "School Partnership Inquiries | AdmitPath",
    description: "Discuss school requirements, privacy review, accessibility, and a possible scoped evaluation.",
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
  name: "School Partnership Inquiries",
  description: "Information for schools considering a scoped evaluation of AdmitPath's student-facing tools.",
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
