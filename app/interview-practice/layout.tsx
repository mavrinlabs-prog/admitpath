import type { Metadata } from "next";
import { PaywallGate } from "@/components/paywall-gate";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "AI Interview Practice",
  description:
    "Practice college interview questions with feedback on clarity, specificity, authenticity, relevance, and confidence.",
  alternates: { canonical: "/interview-practice" },
  robots: { index: false, follow: false },
};

export default function InterviewPracticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaywallGate feature="AI interview practice" limitFeature="chat">
      <AppNav />
      {children}
    </PaywallGate>
  );
}
