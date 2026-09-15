import type { Metadata } from "next";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Refer a Friend — Share AdmitPath",
  description:
    "Share AdmitPath with friends and classmates. Help them get the same college admissions guidance you use.",
  alternates: { canonical: `${BASE}/refer` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Refer a Friend — Share AdmitPath",
    description:
      "Share AdmitPath with friends and classmates applying to college.",
    url: `${BASE}/refer`,
    images: [{ url: `${BASE}/api/og?title=Refer+a+Friend&subtitle=Give+a+free+month.+Get+a+free+month.`, width: 1200, height: 630, alt: "Refer a Friend to AdmitPath" }],
  },
  twitter: { card: "summary_large_image", site: "@admitpath", title: "Refer a Friend — AdmitPath", description: "Share AdmitPath with friends applying to college.", images: [`${BASE}/api/og?title=Refer+a+Friend&subtitle=Give+a+free+month.+Get+a+free+month.`] },
};

export default function ReferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
