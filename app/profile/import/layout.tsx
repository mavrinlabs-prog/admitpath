import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import Profile",
  description:
    "Paste a resume or activity list and AdmitPath extracts your profile fields automatically.",
  alternates: { canonical: "/profile/import" },
  robots: { index: false, follow: false },
};

export default function ProfileImportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
