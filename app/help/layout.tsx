import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers about AdmitPath accounts, profile reviews, essay feedback, college planning, pricing, and privacy.",
  alternates: { canonical: "/help" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AdmitPath Help Center",
    description: "Answers about accounts, planning tools, pricing, and privacy.",
    url: "/help",
    siteName: "AdmitPath",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdmitPath Help Center",
    description: "Answers about accounts, planning tools, pricing, and privacy.",
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
