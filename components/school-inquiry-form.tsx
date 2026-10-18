"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  INQUIRY_NEEDS,
  INQUIRY_ROLES,
  INQUIRY_TIMELINES,
  isPersonalEmail,
  validateSchoolInquiry,
} from "@/lib/school-inquiry";

type Props = {
  audience: "school" | "district" | "counselor";
  sourcePage: string;
  /** Server-side status from the no-JS fallback redirect (?inquiry=...). */
  initialStatus?: string | null;
};

type FormState = {
  name: string;
  email: string;
  schoolName: string;
  role: string;
  phone: string;
  studentCount: string;
  timeline: string;
  needs: string[];
  message: string;
  website: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  schoolName: "",
  role: "",
  phone: "",
  studentCount: "",
  timeline: "",
  needs: [],
  message: "",
  website: "",
};

const inputClass =
  "mt-1.5 w-full rounded-lg border bg-white/80 px-3 py-2.5 text-sm text-[#1B2030] outline-none transition-colors focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#4A6FA5]/20";

export function SchoolInquiryForm({ audience, sourcePage, initialStatus }: Props) {
  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    role: audience === "counselor" ? "counselor" : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">(
    initialStatus === "sent" ? "sent" : "idle",
  );
  const [serverMessage, setServerMessage] = useState<string | null>(
    initialStatus === "failed"
      ? "We could not save your inquiry. Please try again."
      : initialStatus === "invalid"
        ? "Some fields were missing or invalid. Please complete the form below."
        : initialStatus === "rate-limited"
          ? "Too many submissions from this connection. Please wait 10 minutes."
          : null,
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function toggleNeed(value: string) {
    set("needs", form.needs.includes(value) ? form.needs.filter((need) => need !== value) : [...form.needs, value]);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMessage(null);
    const payload = { ...form, audience, sourcePage };
    const validation = validateSchoolInquiry(payload);
    if (!validation.ok) {
      setErrors(validation.fieldErrors);
      const first = Object.keys(validation.fieldErrors)[0];
      document.getElementById(`inquiry-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/school-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({})) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (res.ok && body.ok) {
        setStatus("sent");
        setForm(EMPTY);
        return;
      }
      if (body.fieldErrors) setErrors(body.fieldErrors);
      setServerMessage(body.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerMessage("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl border border-[#4DA67A]/30 bg-[#4DA67A]/10 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2F7A55]" aria-hidden />
          <div>
            <p className="font-bold text-[#1B2030]">Inquiry received — thank you.</p>
            <p className="mt-1 text-sm leading-relaxed text-[#454B5E]">
              Your details are saved and the AdmitPath team will reply to your school email with pricing options for
              your student count and timeline, usually within two business days.
            </p>
            <button type="button" className="mt-3 text-sm font-semibold text-[#2E4A6E] underline" onClick={() => setStatus("idle")}>
              Send another inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const err = (key: string) => errors[key] ? (
    <p id={`inquiry-${key}-error`} className="mt-1 text-xs font-medium text-[#B42318]">{errors[key]}</p>
  ) : null;
  const invalid = (key: string) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `inquiry-${key}-error` : undefined,
    style: { borderColor: errors[key] ? "#B42318" : "rgba(0,0,0,0.12)" },
  });

  return (
    <form
      action="/api/school-inquiry-form"
      method="post"
      noValidate
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      aria-label="School and counselor pricing inquiry"
    >
      <input type="hidden" name="audience" value={audience} />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <div className="hidden" aria-hidden>
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} /></label>
      </div>

      <label className="text-sm font-medium text-[#1B2030]" htmlFor="inquiry-name">
        Your name *
        <input id="inquiry-name" name="name" autoComplete="name" className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} {...invalid("name")} />
        {err("name")}
      </label>
      <label className="text-sm font-medium text-[#1B2030]" htmlFor="inquiry-email">
        School email *
        <input id="inquiry-email" name="email" type="email" autoComplete="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} {...invalid("email")} />
        {err("email") ?? (form.email.includes("@") && isPersonalEmail(form.email) ? (
          <p className="mt-1 text-xs text-[#5A6275]">A school or district address helps us verify your organization.</p>
        ) : null)}
      </label>
      <label className="text-sm font-medium text-[#1B2030]" htmlFor="inquiry-schoolName">
        School or district name *
        <input id="inquiry-schoolName" name="schoolName" autoComplete="organization" className={inputClass} value={form.schoolName} onChange={(e) => set("schoolName", e.target.value)} {...invalid("schoolName")} />
        {err("schoolName")}
      </label>
      <label className="text-sm font-medium text-[#1B2030]" htmlFor="inquiry-role">
        Your role *
        <select id="inquiry-role" name="role" className={inputClass} value={form.role} onChange={(e) => set("role", e.target.value)} {...invalid("role")}>
          <option value="">Select a role</option>
          {INQUIRY_ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
        </select>
        {err("role")}
      </label>
      <label className="text-sm font-medium text-[#1B2030]" htmlFor="inquiry-phone">
        Phone <span className="font-normal text-[#5A6275]">(optional)</span>
        <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} {...invalid("phone")} />
        {err("phone")}
      </label>
      <label className="text-sm font-medium text-[#1B2030]" htmlFor="inquiry-studentCount">
        Number of students *
        <input id="inquiry-studentCount" name="studentCount" inputMode="numeric" className={inputClass} placeholder="e.g. 350" value={form.studentCount} onChange={(e) => set("studentCount", e.target.value)} {...invalid("studentCount")} />
        {err("studentCount")}
      </label>
      <label className="text-sm font-medium text-[#1B2030] sm:col-span-2" htmlFor="inquiry-timeline">
        Timeline *
        <select id="inquiry-timeline" name="timeline" className={inputClass} value={form.timeline} onChange={(e) => set("timeline", e.target.value)} {...invalid("timeline")}>
          <option value="">Select a timeline</option>
          {INQUIRY_TIMELINES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        {err("timeline")}
      </label>
      <fieldset className="sm:col-span-2" aria-describedby={errors.needs ? "inquiry-needs-error" : undefined}>
        <legend className="text-sm font-medium text-[#1B2030]">What do you need? *</legend>
        <div id="inquiry-needs" tabIndex={-1} className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {INQUIRY_NEEDS.map((need) => (
            <label key={need.value} className="flex items-center gap-2 rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm text-[#454B5E]">
              <input type="checkbox" name="needs" value={need.value} checked={form.needs.includes(need.value)} onChange={() => toggleNeed(need.value)} className="h-4 w-4 accent-[#4A6FA5]" />
              {need.label}
            </label>
          ))}
        </div>
        {err("needs")}
      </fieldset>
      <label className="text-sm font-medium text-[#1B2030] sm:col-span-2" htmlFor="inquiry-message">
        Message <span className="font-normal text-[#5A6275]">(optional)</span>
        <textarea id="inquiry-message" name="message" rows={4} className={inputClass} value={form.message} onChange={(e) => set("message", e.target.value)} {...invalid("message")} />
        {err("message")}
      </label>

      {serverMessage && (
        <p role="alert" className="sm:col-span-2 rounded-lg border border-[#B42318]/25 bg-[#B42318]/5 px-4 py-3 text-sm text-[#B42318]">
          {serverMessage}
        </p>
      )}
      <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-[#5A6275]">
          We use these details only to respond to your inquiry. Do not include student records or personal student information.
        </p>
        <button type="submit" disabled={status === "submitting"} className="dl-btn dl-btn-primary dl-btn-lg w-full justify-center sm:w-auto">
          {status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…</> : "Request pricing"}
        </button>
      </div>
    </form>
  );
}
