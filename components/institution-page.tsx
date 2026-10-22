import Link from "next/link";
import { BookOpen, Building2, FileText, KeyRound, MessageSquareText, ReceiptText, ShieldCheck } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section } from "@/components/marketing/Section";
import { SchoolInquiryForm } from "@/components/school-inquiry-form";

const CURRENT_TOOLS = [
  {
    icon: BookOpen,
    title: "Student profile planning",
    body: "Students organize academics, activities, awards, and goals and get a 7-dimension profile score with a prioritized plan.",
  },
  {
    icon: FileText,
    title: "Essay and application tools",
    body: "Structured essay feedback, college-list planning, application tracking, and deadline tools.",
  },
  {
    icon: MessageSquareText,
    title: "AI planning assistant",
    body: "Guided admissions questions answered in the student's workspace. It supplements — never replaces — a counselor.",
  },
];

/**
 * Shared page body for /for-schools and /for-counselors. School and district
 * pricing is quote-based (custom pricing and custom access codes); there is no
 * no-cost trial for organizations. Every CTA leads to the inquiry form, which saves to the
 * SchoolInquiry table and is visible at /admin/inquiries.
 */
export function InstitutionPage({
  audience,
  sourcePage,
  eyebrow,
  title,
  description,
  inquiryStatus,
}: {
  audience: "school" | "counselor";
  sourcePage: string;
  eyebrow: string;
  title: string;
  description: string;
  inquiryStatus?: string | null;
}) {
  return (
    <MarketingLayout eyebrow={eyebrow} title={title} description={description} maxWidth="max-w-4xl">
      <div className="mb-12 flex flex-col gap-3 sm:flex-row">
        <a href="#inquiry" className="dl-btn dl-btn-primary dl-btn-lg justify-center">Request pricing</a>
        <Link href={audience === "school" ? "/for-counselors" : "/for-schools"} className="dl-btn dl-btn-secondary dl-btn-lg justify-center">
          {audience === "school" ? "For counselors" : "For schools & districts"}
        </Link>
      </div>

      <Section title="What students get today" Icon={Building2} description="These capabilities are live in every student account.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CURRENT_TOOLS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg border border-black/10 bg-white/50 p-5">
                <Icon className="mb-3 h-5 w-5" style={{ color: "#4A6FA5" }} aria-hidden />
                <h3 className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{item.body}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        title="Pricing"
        Icon={ReceiptText}
        description="School, district, and counselor pricing is custom and quote-based."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="rounded-lg border border-black/10 bg-white/60 p-5">
            <h3 className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>Schools, districts &amp; counseling teams</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Paid annual or term licenses priced by number of students, features, and support needs. You receive a
              written quote; approved organizations can receive custom access codes for their students.
            </p>
          </article>
          <article className="rounded-lg border border-black/10 bg-white/60 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              <KeyRound className="h-4 w-4" style={{ color: "#4A6FA5" }} aria-hidden /> Individual students
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Students can always use the Free plan on their own, or upgrade to Pro for $19.99/month.{" "}
              <Link href="/pricing" className="font-semibold underline" style={{ color: "#2E4A6E" }}>See student plans</Link>.
            </p>
          </article>
        </div>
      </Section>

      <Section
        title="Privacy and student data"
        Icon={ShieldCheck}
        description="Before any school rollout we agree scope and data handling in writing."
      >
        <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          <li>We review your privacy, FERPA, state student-privacy, accessibility, and procurement requirements before student data is introduced.</li>
          <li>AdmitPath is designed for students 13 and older. It is not directed to children under 13 (COPPA).</li>
          <li>Pricing, term, support, and data handling are set in a signed agreement. This page is not an offer or contract.</li>
        </ul>
      </Section>

      <section id="inquiry" aria-labelledby="inquiry-heading" className="scroll-mt-24 rounded-2xl border border-black/10 bg-white/55 p-5 sm:p-8">
        <h2 id="inquiry-heading" className="text-[22px] font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
          Request pricing
        </h2>
        <p className="mb-6 mt-1 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          {`Tell us about your ${audience === "counselor" ? "students and caseload" : "school or district"} and we'll reply with a quote.`}
        </p>
        <SchoolInquiryForm audience={audience} sourcePage={sourcePage} initialStatus={inquiryStatus} />
      </section>
    </MarketingLayout>
  );
}
