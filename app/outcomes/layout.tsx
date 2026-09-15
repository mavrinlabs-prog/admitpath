import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Outcomes",
  robots: { index: false, follow: false },
};

export default function OutcomesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
