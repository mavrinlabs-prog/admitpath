import type { Metadata } from "next";
import { ProFeatureGate } from "@/components/pro-feature-gate";

export const metadata: Metadata = {
  title: "Share Your Outcomes",
  robots: { index: false, follow: false },
};

export default function OutcomesLayout({ children }: { children: React.ReactNode }) {
  return <ProFeatureGate feature="outcomes">{children}</ProFeatureGate>;
}
