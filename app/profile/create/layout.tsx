import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Profile",
  description: "Enter your GPA, test scores, activities, awards, and intended major. AdmitPath scores your profile across 7 dimensions and returns prioritized admissions guidance.",
  alternates: { canonical: "/profile/create" },
  robots: { index: false, follow: false },
};

export default function ProfileCreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
