import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essay Version History",
  description: "Compare essay drafts side-by-side and track score changes across revisions.",
  robots: { index: false, follow: false },
};

export default function VersionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
