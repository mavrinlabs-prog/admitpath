import type { Metadata } from "next";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app")
  .trim()
  .replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Scholarship Finder",
  description:
    "Filter a maintained scholarship catalog by GPA, SAT, state, major, and background. Verify requirements and deadlines with each provider.",
  alternates: { canonical: `${BASE}/scholarship-match` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Scholarship Finder",
    description:
      "Filter a maintained scholarship catalog by profile fields, then verify eligibility and deadlines on each provider's official page.",
    url: `${BASE}/scholarship-match`,
    type: "website",
    locale: "en_US",
    siteName: "AdmitPath",
    images: [
      {
        url: `${BASE}/api/og?title=Scholarship+Finder&subtitle=Filter+the+catalog+and+verify+with+providers`,
        width: 1200,
        height: 630,
        alt: "Scholarship Finder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@admitpath",
    title: "Scholarship Finder",
    description: "Filter the scholarship catalog by profile fields and verify details with each provider.",
    images: [`${BASE}/api/og?title=Scholarship+Finder&subtitle=Filter+the+catalog+and+verify+with+providers`],
  },
};

export default function ScholarshipMatchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
