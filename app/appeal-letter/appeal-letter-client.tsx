"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ArrowLeft, FileText, Copy, CheckCircle2, Printer, Download } from "lucide-react";

const APPEAL_REASONS = [
  { id: "income_change", label: "Job loss or significant income decrease", prompt: "My family's income has decreased significantly since the FAFSA tax year due to [job loss/reduced hours/business closure]. Our current household income is approximately $[amount], compared to $[amount] reported on the FAFSA." },
  { id: "medical", label: "Major un-reimbursed medical expenses", prompt: "Our family has incurred significant un-reimbursed medical expenses totaling approximately $[amount] for [brief description]. These expenses were not reflected in our FAFSA submission." },
  { id: "family_change", label: "Death, divorce, or family emergency", prompt: "Our family has experienced [a death in the family / a divorce / a significant family emergency] since the FAFSA was filed, which has materially changed our financial situation." },
  { id: "sibling", label: "Sibling now enrolled in college", prompt: "My sibling [name] is now enrolled at [college name], which increases the number of family members in college to [number] and should reduce our expected family contribution." },
  { id: "competing_offer", label: "Better offer from a comparable school", prompt: "I have received a more favorable financial aid package from [school name], which offered $[amount] more in grant aid. I have attached their offer letter for your reference." },
  { id: "other", label: "Other special circumstances", prompt: "[Describe your specific circumstance here]" },
];

export function AppealLetterClient() {
  const [studentName, setStudentName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [reasonId, setReasonId] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [gapAmount, setGapAmount] = useState("");
  const [competingSchool, setCompetingSchool] = useState("");
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fieldErrors = {
    studentName: touched.studentName && !studentName.trim() ? "Required" : "",
    schoolName: touched.schoolName && !schoolName.trim() ? "Required" : "",
    reasonId: touched.reasonId && !reasonId ? "Select a reason" : "",
    gapAmount: touched.gapAmount && gapAmount && Number(gapAmount) < 0 ? "Amount cannot be negative" : "",
  };

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const reason = APPEAL_REASONS.find((r) => r.id === reasonId);

  const letter = useMemo(() => {
    if (!studentName.trim() || !schoolName.trim() || !reasonId) return "";

    const reasonText = customReason.trim() || reason?.prompt || "";
    const gap = gapAmount ? `$${Number(gapAmount).toLocaleString()}` : "[specific amount]";

    return `Dear Financial Aid Office at ${schoolName},

I am writing to respectfully request a review of my financial aid package for the ${new Date().getFullYear()}-${new Date().getFullYear() + 1} academic year. ${schoolName} is my top-choice school, and I am deeply committed to attending. However, I need your help to make this financially possible for my family.

REASON FOR APPEAL:
${reasonText}

${competingSchool ? `I have also received a more favorable offer from ${competingSchool}, but ${schoolName} remains my first choice. I would choose ${schoolName} over ${competingSchool} if the financial gap of approximately ${gap} per year can be addressed.` : `The current gap between what my family can afford and the cost of attendance is approximately ${gap} per year. Any additional grant aid you could provide would make a meaningful difference.`}

I understand that financial aid resources are limited, and I am grateful for the aid already offered. I am simply asking for any additional consideration that may be possible given my family's circumstances.

I have attached supporting documentation for your review:
- [List relevant documents: updated tax returns, medical bills, competing offer letter, etc.]

Thank you for your time and consideration. I would welcome the opportunity to discuss this further.

Sincerely,
${studentName}
[Phone number]
[Email address]
[Student ID number]`;
  }, [studentName, schoolName, reasonId, customReason, gapAmount, competingSchool, reason]);

  async function copyLetter() {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = letter;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function printLetter() {
    if (!letter) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre style="font-family:Georgia,serif;font-size:13px;line-height:1.8;max-width:700px;margin:40px auto;white-space:pre-wrap">${letter.replace(/</g, "&lt;")}</pre>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <Link
          href="/tools"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#4A6FA5" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tools
        </Link>

        <p
          className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          Free tool
        </p>
        <h1
          className="text-3xl sm:text-4xl leading-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-inter)",
            letterSpacing: "-0.02em",
          }}
        >
          Financial Aid Appeal Letter Generator
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-10"
          style={{ color: "var(--dl-text-secondary, #454B5E)", fontFamily: "var(--font-inter)" }}
        >
          Generate a professional appeal letter to request more financial aid.
          Fill in your details and we will create a letter you can customize,
          copy, and send.
        </p>

        {/* Form */}
        <div
          className="border rounded-xl p-6 mb-8 space-y-5"
          style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
        >
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Your full name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onBlur={() => markTouched("studentName")}
              placeholder="Jane Smith"
              className="input-field w-full text-[13px]"
              style={{ minHeight: "42px", borderColor: fieldErrors.studentName ? "#DC2626" : undefined }}
              aria-invalid={!!fieldErrors.studentName}
              required
            />
            {fieldErrors.studentName && <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>{fieldErrors.studentName}</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              School you are appealing to
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              onBlur={() => markTouched("schoolName")}
              placeholder="University of Michigan"
              className="input-field w-full text-[13px]"
              style={{ minHeight: "42px", borderColor: fieldErrors.schoolName ? "#DC2626" : undefined }}
              aria-invalid={!!fieldErrors.schoolName}
              required
            />
            {fieldErrors.schoolName && <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>{fieldErrors.schoolName}</p>}
          </div>
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Reason for appeal
            </label>
            <select
              value={reasonId}
              onChange={(e) => setReasonId(e.target.value)}
              className="input-field w-full text-[13px]"
              style={{ minHeight: "42px" }}
            >
              <option value="">Select a reason...</option>
              {APPEAL_REASONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
          {reasonId && (
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Customize your reason (fill in the brackets)
              </label>
              <textarea
                value={customReason || reason?.prompt || ""}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={4}
                className="input-field w-full text-[13px]"
              />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Financial gap per year ($)
              </label>
              <input
                type="number"
                value={gapAmount}
                onChange={(e) => setGapAmount(e.target.value)}
                placeholder="10000"
                className="input-field w-full text-[13px]"
                style={{ minHeight: "42px" }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Competing school with better offer (optional)
              </label>
              <input
                type="text"
                value={competingSchool}
                onChange={(e) => setCompetingSchool(e.target.value)}
                placeholder="Georgia Tech"
                className="input-field w-full text-[13px]"
                style={{ minHeight: "42px" }}
              />
            </div>
          </div>
        </div>

        {/* Generated Letter */}
        {letter && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-bold flex items-center gap-2" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                <FileText className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                Your appeal letter
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyLetter}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ backgroundColor: copied ? "rgba(22,163,74,0.1)" : "rgba(74,111,165,0.1)", color: copied ? "#16A34A" : "#4A6FA5" }}
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={printLetter}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ backgroundColor: "rgba(74,111,165,0.1)", color: "#4A6FA5" }}
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
              </div>
            </div>
            <div
              className="border rounded-xl p-6"
              style={{ background: "var(--dl-bg-card)", borderColor: "var(--dl-border)", boxShadow: "var(--dl-shadow-sm)" }}
            >
              <pre
                className="whitespace-pre-wrap text-[13px] leading-relaxed"
                style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
              >
                {letter}
              </pre>
            </div>
          </div>
        )}

        {/* Tips */}
        <div
          className="border rounded-xl p-5"
          style={{ background: "rgba(74,111,165,0.04)", borderColor: "rgba(74,111,165,0.15)" }}
        >
          <h3 className="text-[13px] font-bold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Appeal tips
          </h3>
          <ul className="space-y-2">
            {[
              "Send at least 2-3 weeks before May 1. Offices process appeals throughout April -- later requests get less attention.",
              "Address the financial aid director by name (find it on the school's website).",
              "Attach documentation: tax returns, medical bills, termination letters, competing offer letters.",
              "Be specific about the dollar amount you need. Do NOT just ask for 'more aid.'",
              "State clearly that the school is your top choice and you would attend if the gap is closed.",
              "Be respectful and grateful for the aid already offered.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
