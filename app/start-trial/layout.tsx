import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Trial",
  robots: { index: false, follow: false },
};

export default function StartTrialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
