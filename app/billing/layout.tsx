import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "Billing & Subscription",
  description: "Manage your AdmitPath subscription, payment method, and billing history.",
  alternates: { canonical: "/billing" },
  robots: { index: false, follow: false },
};

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
