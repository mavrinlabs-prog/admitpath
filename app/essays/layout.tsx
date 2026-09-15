import type { Metadata } from "next";
import { PaywallGate } from "@/components/paywall-gate";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "Essay Feedback Tool",
  description:
    "College essay feedback scored across 6 dimensions: authenticity, insight, specificity, storytelling, impact, and voice. Paste a draft and get line-level edits with a clear verdict.",
  alternates: { canonical: "/essays" },
  robots: { index: false, follow: false },
};

export default function EssaysLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaywallGate feature="essay feedback" limitFeature="essays">
      <AppNav />
      {children}
    </PaywallGate>
  );
}
