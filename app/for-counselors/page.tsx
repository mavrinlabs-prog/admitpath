import type { Metadata } from "next";
import { InstitutionPage } from "@/components/institution-page";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app").trim().replace(/\/+$/, "");

export const metadata: Metadata = {
  title: { absolute: "AdmitPath for Counselors | Custom Pricing" },
  description: "Help every student on your caseload plan applications with AdmitPath. Custom, quote-based pricing for school and independent counselors.",
  alternates: { canonical: `${BASE}/for-counselors` },
  robots: { index: true, follow: true },
};

type PageProps = {
  searchParams: Promise<{ inquiry?: string }>;
};

export default async function ForCounselorsPage({ searchParams }: PageProps) {
  const { inquiry } = await searchParams;
  return (
    <InstitutionPage
      audience="counselor"
      sourcePage="/for-counselors"
      eyebrow="For counselors"
      title="AdmitPath for school and independent counselors"
      description="Students do the repeatable, data-heavy planning work in AdmitPath so your time goes to the conversations only you can have. Pricing is custom and based on your caseload."
      inquiryStatus={inquiry ?? null}
    />
  );
}
