import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account preferences, notifications, and AdmitPath app settings.",
  alternates: { canonical: "/settings" },
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
