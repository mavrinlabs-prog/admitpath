import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free guides to summer programs, scholarships, and competitions for college-bound students.",
  robots: { index: true, follow: true },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
