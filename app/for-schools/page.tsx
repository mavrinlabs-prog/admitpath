import { InstitutionPage } from "@/components/institution-page";

type PageProps = {
  searchParams: Promise<{ inquiry?: string }>;
};

export default async function ForSchoolsPage({ searchParams }: PageProps) {
  const { inquiry } = await searchParams;
  return (
    <InstitutionPage
      audience="school"
      sourcePage="/for-schools"
      eyebrow="For schools and districts"
      title="AdmitPath for schools and districts"
      description="Give every student a structured college-planning workspace — profile scoring, essay feedback, and college-list tools — with custom pricing for your school or district."
      inquiryStatus={inquiry ?? null}
    />
  );
}
