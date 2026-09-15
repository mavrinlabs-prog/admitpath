import type { Metadata } from "next";
import { PaywallGate } from "@/components/paywall-gate";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "AI Profile Analysis — 7 Dimensions",
  description:
    "Run an AI analysis of your college admissions profile across 7 dimensions: academic rigor, leadership, awards, activity depth, spike, essay quality, and recommendations. Get a 0–100 score per dimension and a prioritized action plan.",
  alternates: { canonical: "/analyze" },
  robots: { index: false, follow: false },
};

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaywallGate feature="AI profile analysis" limitFeature="analyses">
      <AppNav />
      {children}
    </PaywallGate>
  );
}
