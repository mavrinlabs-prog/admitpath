import type { Metadata } from "next";
import { PeerProfilesClient } from "./peer-profiles-client";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Admitted Student Profiles",
  description:
    "See anonymized profiles of students accepted and rejected at Harvard, MIT, Stanford, Yale, Princeton, and Columbia. Understand what patterns lead to admission.",
  alternates: { canonical: `${BASE}/peer-profiles` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Admitted Student Profiles — Peer Comparison",
    description: "Anonymized profiles of accepted and rejected students at top schools. See the patterns.",
    url: `${BASE}/peer-profiles`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [{ url: `${BASE}/api/og?title=Peer+Profiles&subtitle=Anonymized+admit+%26+reject+patterns`, width: 1200, height: 630, alt: "Admitted Student Profiles" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Admitted Student Profiles", description: "Anonymized profiles of accepted and rejected students at top schools.", images: [`${BASE}/api/og?title=Peer+Profiles&subtitle=Anonymized+admit+%26+reject+patterns`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/peer-profiles#page`,
      url: `${BASE}/peer-profiles`,
      name: "Admitted Student Profiles — Anonymized Peer Comparison",
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: "en-US",
    },
  ],
};

export default function PeerProfilesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PeerProfilesClient />
    </>
  );
}
