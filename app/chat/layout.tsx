import type { Metadata } from "next";
import { PaywallGate } from "@/components/paywall-gate";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "AI Counselor Chat",
  description:
    "Use the account-aware AI planning chat for essay, college-fit, and scholarship questions. Availability and plan limits are shown in the product.",
  alternates: { canonical: "/chat" },
  robots: { index: false, follow: false },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaywallGate feature="the AI counselor" limitFeature="chat">
      <AppNav />
      {children}
    </PaywallGate>
  );
}
