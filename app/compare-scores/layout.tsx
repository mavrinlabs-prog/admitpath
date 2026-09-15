import type { Metadata } from "next";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Compare Scores",
  description:
    "Compare your admissions profile against a friend across all 7 dimensions. Challenge someone and see who stacks up.",
  alternates: { canonical: `${BASE}/compare-scores` },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Compare Scores — Side-by-Side Profile Comparison | AdmitPath",
    description:
      "Compare your admissions profile against a friend across all 7 dimensions.",
    url: `${BASE}/compare-scores`,
    images: [{ url: `${BASE}/api/og?title=Compare+Scores&subtitle=Side-by-side+profile+comparison`, width: 1200, height: 630, alt: "Compare Scores" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Compare Scores — AdmitPath", description: "Compare your admissions profile against a friend.", images: [`${BASE}/api/og?title=Compare+Scores&subtitle=Side-by-side+profile+comparison`] },
};

export default function CompareScoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
