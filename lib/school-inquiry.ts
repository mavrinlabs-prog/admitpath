import { z } from "zod";

/**
 * School / district / counselor inquiry contract. Shared by the client form
 * (instant validation) and the API (authoritative validation). Pricing for
 * schools is custom / quote-based; there is no free pilot.
 */

export const INQUIRY_ROLES = [
  { value: "counselor", label: "School counselor" },
  { value: "college_advisor", label: "College / career advisor" },
  { value: "teacher", label: "Teacher" },
  { value: "school_admin", label: "School administrator" },
  { value: "district_admin", label: "District administrator" },
  { value: "independent_counselor", label: "Independent counselor / consultant" },
  { value: "other", label: "Other" },
] as const;

export const INQUIRY_TIMELINES = [
  { value: "this_month", label: "This month" },
  { value: "this_semester", label: "This semester" },
  { value: "next_school_year", label: "Next school year" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const INQUIRY_NEEDS = [
  { value: "student_licenses", label: "Student licenses" },
  { value: "counselor_tools", label: "Counselor workflow tools" },
  { value: "essay_feedback", label: "Essay feedback at scale" },
  { value: "college_lists", label: "College list planning" },
  { value: "privacy_review", label: "Privacy / FERPA review" },
  { value: "custom_code", label: "Custom access codes" },
  { value: "other", label: "Something else" },
] as const;

export const INQUIRY_AUDIENCES = ["school", "district", "counselor"] as const;

const roleValues = INQUIRY_ROLES.map((role) => role.value) as [string, ...string[]];
const timelineValues = INQUIRY_TIMELINES.map((item) => item.value) as [string, ...string[]];
const needValues = INQUIRY_NEEDS.map((item) => item.value) as [string, ...string[]];

const FREE_MAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
  "aol.com", "icloud.com", "me.com", "proton.me", "protonmail.com", "gmx.com",
]);

/** True when the address looks like a personal mailbox rather than a school one. */
export function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim() ?? "";
  return FREE_MAIL_DOMAINS.has(domain);
}

const trimmed = (max: number, message: string) =>
  z.string({ required_error: message, invalid_type_error: message }).trim().min(1, message).max(max, `Keep this under ${max} characters.`);

export const schoolInquirySchema = z.object({
  name: trimmed(120, "Enter your name."),
  email: z.string({ required_error: "Enter your school email." })
    .trim()
    .toLowerCase()
    .max(254, "Email is too long.")
    .email("Enter a valid email address."),
  schoolName: trimmed(200, "Enter your school or district name."),
  role: z.enum(roleValues, { errorMap: () => ({ message: "Choose your role." }) }),
  phone: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value) || undefined,
    z.string().max(40, "Phone number is too long.")
      .regex(/^[+()\d\s.-]{7,40}$/, "Enter a valid phone number (digits, spaces, +, -, parentheses).")
      .optional(),
  ),
  studentCount: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) return undefined;
      const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
      return Number.isFinite(n) ? n : value;
    },
    z.number({ invalid_type_error: "Enter a number of students." })
      .int("Enter a whole number.")
      .min(1, "Enter at least 1 student.")
      .max(1_000_000, "Enter a realistic number of students."),
  ),
  timeline: z.enum(timelineValues, { errorMap: () => ({ message: "Choose a timeline." }) }),
  needs: z.preprocess(
    (value) => (typeof value === "string" ? [value] : value ?? []),
    z.array(z.enum(needValues)).min(1, "Choose at least one need.").max(needValues.length),
  ),
  message: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value) || undefined,
    z.string().max(3000, "Keep your message under 3,000 characters.").optional(),
  ),
  audience: z.enum(INQUIRY_AUDIENCES).default("school"),
  sourcePage: z.preprocess(
    (value) => (typeof value === "string" && /^\/[A-Za-z0-9/_-]{0,120}$/.test(value) ? value : "/for-schools"),
    z.string(),
  ),
  /** Honeypot — real users never fill this hidden field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SchoolInquiryInput = z.infer<typeof schoolInquirySchema>;

export type InquiryValidation =
  | { ok: true; data: SchoolInquiryInput }
  | { ok: false; fieldErrors: Record<string, string> };

export function validateSchoolInquiry(raw: unknown): InquiryValidation {
  const parsed = schoolInquirySchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  const fieldErrors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}

/** Convert a FormData submission (no-JS fallback) into the JSON shape. */
export function formDataToInquiry(form: FormData): Record<string, unknown> {
  return {
    name: form.get("name"),
    email: form.get("email"),
    schoolName: form.get("schoolName"),
    role: form.get("role"),
    phone: form.get("phone"),
    studentCount: form.get("studentCount"),
    timeline: form.get("timeline"),
    needs: form.getAll("needs").map(String),
    message: form.get("message"),
    audience: form.get("audience") ?? "school",
    sourcePage: form.get("sourcePage"),
    website: form.get("website") ?? "",
  };
}

export function labelFor(list: ReadonlyArray<{ value: string; label: string }>, value: string | null | undefined): string {
  return list.find((item) => item.value === value)?.label ?? value ?? "";
}
