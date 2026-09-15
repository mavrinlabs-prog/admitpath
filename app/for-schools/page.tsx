import { BookOpen, Building2, FileText, MessageCircle, ShieldCheck } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section } from "@/components/marketing/Section";

const CURRENT_TOOLS = [
  {
    icon: BookOpen,
    title: "Student profile planning",
    body: "Students can organize academics, activities, awards, goals, and college preferences in their own accounts.",
  },
  {
    icon: FileText,
    title: "Essay and application tools",
    body: "Students can request structured essay feedback, work through planning worksheets, and maintain college lists.",
  },
  {
    icon: MessageCircle,
    title: "AI planning assistance",
    body: "The student workspace includes guided admissions questions and planning suggestions. It does not replace a school counselor.",
  },
];

type PageProps = {
  searchParams: Promise<{ inquiry?: string }>;
};

export default async function ForSchoolsPage({ searchParams }: PageProps) {
  const { inquiry } = await searchParams;
  const notice = inquiry === "sent"
    ? "Your inquiry was delivered. We will review it and follow up as availability allows."
    : inquiry === "failed"
      ? "We could not deliver the form. Please email maestro.committee@gmail.com directly."
      : inquiry === "invalid"
        ? "Enter a valid work email and school or organization name."
        : inquiry === "rate-limited"
          ? "Too many submissions were received from this connection. Please wait and try again."
          : null;

  return (
    <MarketingLayout
      eyebrow="For schools and counselors"
      title="Explore a school partnership"
      description="AdmitPath is currently a student-facing college-planning workspace. Schools may contact us to discuss needs, privacy review, accessibility, and a possible scoped evaluation."
      maxWidth="max-w-4xl"
    >
      <Section
        title="What is available today"
        Icon={Building2}
        description="These are the current student-facing capabilities. A counselor dashboard, bulk roster import, district SSO, and contracted school plan are not generally available."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CURRENT_TOOLS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg border border-black/10 bg-white/45 p-5">
                <Icon className="mb-3 h-5 w-5" style={{ color: "#4A6FA5" }} aria-hidden />
                <h3 className="text-sm font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        title="Before any school rollout"
        Icon={ShieldCheck}
        description="Any evaluation would require a written scope and review of the school's requirements before student data is introduced."
      >
        <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          <li>Confirm the intended users, workflows, support owner, and success criteria.</li>
          <li>Review privacy, data retention, accessibility, security, and procurement requirements.</li>
          <li>Agree on pricing, duration, support, and data handling in writing. This page does not constitute an offer or contract.</li>
        </ul>
      </Section>

      <Section title="Contact the team" Icon={FileText} description="Tell us about your organization and the workflow you need.">
        {notice && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-black/10 bg-white/55 px-4 py-3 text-sm"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          >
            {notice}
          </p>
        )}
        <form action="/api/school-inquiry-form" method="post" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Work email
            <input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1.5 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            School or organization
            <input name="schoolName" required maxLength={300} autoComplete="organization" className="mt-1.5 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Approximate student count
            <input name="studentCount" type="number" min={0} max={100000} inputMode="numeric" className="mt-1.5 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2.5" />
          </label>
          <div className="flex items-end">
            <button type="submit" className="dl-btn dl-btn-primary dl-btn-lg w-full sm:w-auto">
              Send inquiry
            </button>
          </div>
        </form>
      </Section>
    </MarketingLayout>
  );
}
