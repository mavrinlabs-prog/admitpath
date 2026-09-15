import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My College List",
  description: "Manage a private reach, target, and safety college list.",
  alternates: { canonical: "/colleges" },
  robots: { index: false, follow: false },
};

export default function CollegesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
