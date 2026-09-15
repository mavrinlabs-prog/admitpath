"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Sparkles, AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { apiErrorMessage, apiFetch, isApiError, redirectToSignIn } from "@/lib/api-client";
import type { ProfileSaveResponse, ResumeExtraction } from "@/lib/profile-contract";

/**
 * Resume / transcript / brag-sheet import flow. Per the owner email feedback
 * "auto-upload resume for admitpath", we let students paste their resume
 * text and AI-extract every relevant field — instead of typing the whole
 * 7-step wizard from scratch.
 *
 * Two-stage flow: (1) paste + parse, (2) confirm + save. The confirmation
 * step is non-skippable because LLM extraction hallucinates ~8% of the time
 * on AP scores (ADMITPATH-001). The user re-reads what we pulled before
 * we touch their profile.
 *
 * Paste import remains here as a low-friction fallback. The dashboard quick
 * import also supports PDF/DOCX/TXT uploads through /api/profile/extract-file.
 */

type Extracted = ResumeExtraction;
type ImportProgress = "Ready" | "Uploading" | "Reading document" | "Extracting details" | "Reviewing structure" | "Saving profile" | "Completed";

export default function ProfileImportPage() {
  const router = useRouter();
  const toast = useToast();

  const [text, setText] = useState("");
  const [stage, setStage] = useState<"paste" | "confirm">("paste");
  const [parsing, setParsing] = useState(false);
  const [extracted, setExtracted] = useState<Extracted | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<ImportProgress>("Ready");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);

  // The confirmation form lets the user edit every field before we save.
  // Initialized from the extraction; user changes win on save.
  const [confirmForm, setConfirmForm] = useState({
    gpa: "",
    weightedGpa: "",
    satScore: "",
    actScore: "",
    grade: "",
    state: "",
    intendedMajor: "",
    targetColleges: "",
    admissionsConcern: "",
    activitiesText: "",
    awardsText: "",
    apCourses: "",
    honorsCourses: "",
    dualEnrollmentCourses: "",
    ibCourses: "",
    research: "",
    projects: "",
    otherCommitments: "",
  });

  async function handleParse() {
    await handleParseText(text);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setProgress("Uploading");
    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      setProgress("Reading document");
      const result = await file.text();
      setText(result);
      await handleParseText(result);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setParsing(true);
    try {
      setProgress("Reading document");
      const res = await fetch("/api/profile/extract-file", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({})) as { text?: string; warning?: string; error?: unknown };
      if (!res.ok) {
        toast.error(apiErrorMessage(data, "Could not extract text from file. Try pasting instead."));
        return;
      }
      const extractedText = data.text ?? "";
      setText(extractedText);
      if (data.warning || extractedText.trim().length < 50) {
        toast.error(data.warning || "We could not read enough text from that file. Paste the content instead.");
        return;
      }
      await handleParseText(extractedText);
    } catch {
      if (controller.signal.aborted) return;
      toast.error("Upload failed. Try pasting the text instead.");
      setProgress("Ready");
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleParseText(sourceText: string) {
    if (sourceText.trim().length < 50) {
      toast.error("Paste at least 50 characters of your resume.");
      return;
    }
    if (sourceText.length > 30000) {
      toast.error("Resume text is too long. Please trim to 30,000 characters.");
      return;
    }
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setParsing(true);
    setProgress("Extracting details");
    try {
      const data = await apiFetch<Extracted>("/api/profile/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText }),
        signal: controller.signal,
      });
      setExtracted(data);
      setConfirmForm({
        gpa: data.academic.gpa != null ? String(data.academic.gpa) : "",
        weightedGpa: data.academic.weightedGpa != null ? String(data.academic.weightedGpa) : "",
        satScore: data.academic.satScore != null ? String(data.academic.satScore) : "",
        actScore: data.academic.actScore != null ? String(data.academic.actScore) : "",
        grade: data.academic.grade != null ? String(data.academic.grade) : "",
        state: data.academic.state ?? "",
        intendedMajor: data.academic.intendedMajor ?? "",
        targetColleges: "",
        admissionsConcern: "",
        activitiesText: "",
        awardsText: "",
        apCourses: "",
        honorsCourses: "",
        dualEnrollmentCourses: "",
        ibCourses: "",
        research: "",
        projects: "",
        otherCommitments: "",
      });
      setProgress("Reviewing structure");
      setStage("confirm");
    } catch (err) {
      if (controller.signal.aborted) {
        setProgress("Ready");
        return;
      }
      if (isApiError(err) && err.status === 401) {
        redirectToSignIn();
        return;
      }
      const msg =
        isApiError(err) && err.message
          ? err.message
          : "Couldn't parse your resume. Try a cleaner copy-paste.";
      toast.error(msg);
    } finally {
      setParsing(false);
    }
  }

  async function handleSave() {
    if (!extracted) return;
    setSaving(true);
    setProgress("Saving profile");
    try {
      // POST through the existing profile route — same shape as the 7-step
      // wizard's submit handler, just with a richer payload pulled from the
      // extraction.
      const profilePayload: Record<string, unknown> = {};
      if (confirmForm.gpa) profilePayload.gpa = parseFloat(confirmForm.gpa);
      if (confirmForm.weightedGpa) profilePayload.weightedGpa = parseFloat(confirmForm.weightedGpa);
      if (confirmForm.satScore) profilePayload.satScore = parseInt(confirmForm.satScore, 10);
      if (confirmForm.actScore) profilePayload.actScore = parseInt(confirmForm.actScore, 10);
      if (confirmForm.grade) profilePayload.grade = parseInt(confirmForm.grade, 10);
      if (confirmForm.state) profilePayload.state = confirmForm.state;
      if (confirmForm.intendedMajor) profilePayload.intendedMajor = confirmForm.intendedMajor;
      if (confirmForm.admissionsConcern) profilePayload.admissionsConcern = confirmForm.admissionsConcern;
      if (confirmForm.targetColleges) {
        profilePayload.targetColleges = confirmForm.targetColleges.split(",").map((s) => s.trim()).filter(Boolean);
      }
      const splitLines = (value: string) =>
        value
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter((s) => s && s.toLowerCase() !== "none");
      const manualActivities = splitLines(confirmForm.activitiesText).map((name) => ({
        name,
        provenance: "MANUAL" as const,
      }));
      const followUpActivities = [
        confirmForm.research
          ? { name: "Research not listed on resume", impact: confirmForm.research.slice(0, 500), provenance: "MANUAL" as const }
          : null,
        confirmForm.projects
          ? { name: "Independent projects not listed on resume", impact: confirmForm.projects.slice(0, 500), provenance: "MANUAL" as const }
          : null,
        confirmForm.otherCommitments
          ? { name: "Additional work, service, or family responsibilities", impact: confirmForm.otherCommitments.slice(0, 500), provenance: "MANUAL" as const }
          : null,
      ].filter((activity): activity is { name: string; impact: string; provenance: "MANUAL" } => activity !== null);
      const activities = [
        ...(extracted.activities ?? []).map(a => ({
          name: a.name,
          role: a.role || undefined,
          hoursPerWeek: a.hoursPerWeek || undefined,
          yearsInvolved: a.yearsInvolved || undefined,
          impact: a.impact || undefined,
          provenance: "RESUME_EXTRACTED" as const,
        })),
        ...manualActivities,
        ...followUpActivities,
      ];
      if (activities.length) profilePayload.activities = activities;
      const awards = [
        ...(extracted.awards ?? []).map(a => ({ ...a, provenance: "RESUME_EXTRACTED" as const })),
        ...splitLines(confirmForm.awardsText).map((name) => ({ name, provenance: "MANUAL" as const })),
      ];
      if (awards.length) profilePayload.awards = awards;
      const courses = [
        ...(extracted.courses ?? []).map((course) => course.name),
        ...splitLines(confirmForm.apCourses),
        ...splitLines(confirmForm.honorsCourses),
        ...splitLines(confirmForm.dualEnrollmentCourses),
        ...splitLines(confirmForm.ibCourses),
      ];
      if (courses.length) profilePayload.courses = Array.from(new Set(courses));
      profilePayload.mergeStrategy = "RESUME_REPLACE_AUTO";
      const saved = await apiFetch<ProfileSaveResponse>("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });
      if (saved.persisted !== true || !saved.profile) {
        throw new Error("The server did not confirm the saved profile.");
      }
      setProgress("Completed");
      toast.success("Profile imported. Taking you to your dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (isApiError(err) && err.status === 401) {
        redirectToSignIn();
        return;
      }
      toast.error("Couldn't save your profile. Try again or use the manual form.");
      setProgress("Reviewing structure");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Import resume · {stage === "paste" ? "Step 1 of 2" : "Step 2 of 2"}
          </span>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-10" aria-label="Resume import">
        {stage === "paste" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "#4A6FA5" }}>
              Faster than the 7-step form
            </p>
            <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
              Paste your resume.
              <br />
              <span style={{ fontStyle: "italic", color: "#4A6FA5" }}>We&apos;ll pull every field.</span>
            </h1>
            <p className="text-base mb-8 max-w-2xl" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Paste a resume, transcript, brag sheet, or your Common App activities export below.
              We extract your GPA, test scores, courses, activities, and awards — then you confirm
              what we found before anything is saved.
            </p>

            <label className="label" htmlFor="resume-text">
              Resume text
            </label>
            <textarea
              id="resume-text"
              className="input-field min-h-[280px] resize-y font-mono text-sm leading-relaxed"
              placeholder={`Example:

Maya R. — 11th grade · Lincoln High School · Portland, OR
Unweighted GPA: 3.94 | Weighted: 4.62 | SAT: 1480

Activities:
• President, DECA Chapter — 12 hrs/wk, 3 yrs · led team to State 1st Place
• Founder, Community Tutoring Org — 10 hrs/wk · 200+ students served
• AP Scholar with Distinction

Awards:
• BPA State 1st Place Personal Finance (2025)
• DECA District 1st Place

Courses: AP Calc BC (5), AP Stats (5), AP Bio (4), AP US History (5)`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {text.length.toLocaleString()} / 30,000 characters · Min 50 to extract
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="profile-import-file"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={parsing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-[rgba(74,111,165,0.06)]"
                style={{
                  borderColor: "rgba(74,111,165,0.20)",
                  color: "var(--dl-text-secondary, #454B5E)",
                }}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload PDF, DOCX, or TXT
              </button>
              <span className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Max 5MB
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {parsing && (
                <button
                  type="button"
                  onClick={() => {
                    requestControllerRef.current?.abort();
                    setParsing(false);
                    setProgress("Ready");
                  }}
                  className="text-sm font-medium"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleParse}
                disabled={parsing || text.trim().length < 50}
                className="btn-primary text-sm"
                aria-busy={parsing}
              >
                {parsing ? (
                  <motion.span
                    className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {parsing ? progress : "Extract my profile"}
              </button>
              <Link href="/profile/create" className="text-sm font-medium underline-animate" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                Skip — fill the 7-step form manually
              </Link>
            </div>

            <div
              className="dl-card-hover mt-8 p-4 rounded-xl border flex gap-3"
              style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
            >
              <FileText className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              <p className="text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                <strong>PDF or DOCX?</strong> Upload it here or paste the text directly. If a PDF is scanned,
                we&apos;ll try to read it and then ask you to paste the text if it is still unclear.
                Your resume is processed to extract profile fields. See the Privacy Policy for service-provider disclosures.
              </p>
            </div>
          </motion.div>
        )}

        {stage === "confirm" && extracted && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "#4A6FA5" }}>
              Confirm before we save
            </p>
            <h2 className="text-3xl font-extrabold mb-3" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
              Here&apos;s what we pulled.
            </h2>
            <p className="text-base mb-6 max-w-2xl" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Edit anything that&apos;s wrong. AI extraction isn&apos;t perfect — review every field before
              saving. We never auto-write your profile without confirmation.
            </p>

            {extracted.extractionNotes && (
              <div
                className="mb-6 p-4 rounded-xl border-l-4 flex gap-3"
                role="alert"
                style={{ borderLeftColor: "var(--warning)", backgroundColor: "var(--warning-light)" }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--warning)" }} aria-hidden="true" />
                <p className="text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  <strong>Extraction note:</strong> {extracted.extractionNotes}
                </p>
              </div>
            )}

            {/* Academic */}
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Academic
              </h2>
              <div className="dl-card-hover grid sm:grid-cols-2 gap-3 rounded-xl border p-4" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}>
                <ConfirmField label="Grade" value={confirmForm.grade} onChange={(v) => setConfirmForm({ ...confirmForm, grade: v })} placeholder="11" />
                <ConfirmField label="State" value={confirmForm.state} onChange={(v) => setConfirmForm({ ...confirmForm, state: v })} placeholder="Florida" />
                <ConfirmField label="GPA (unweighted)" value={confirmForm.gpa} onChange={(v) => setConfirmForm({ ...confirmForm, gpa: v })} placeholder="3.95" />
                <ConfirmField label="GPA (weighted)" value={confirmForm.weightedGpa} onChange={(v) => setConfirmForm({ ...confirmForm, weightedGpa: v })} placeholder="4.62" />
                <ConfirmField label="SAT score" value={confirmForm.satScore} onChange={(v) => setConfirmForm({ ...confirmForm, satScore: v })} placeholder="1480" />
                <ConfirmField label="ACT score" value={confirmForm.actScore} onChange={(v) => setConfirmForm({ ...confirmForm, actScore: v })} placeholder="34" />
                <div className="sm:col-span-2">
                  <ConfirmField label="Intended major" value={confirmForm.intendedMajor} onChange={(v) => setConfirmForm({ ...confirmForm, intendedMajor: v })} placeholder="Computer Science" />
                </div>
              </div>
            </section>

            {/* Activities (read-only summary — full edit happens after save in the wizard) */}
            <SummarySection
              label="Activities"
              count={extracted.activities.length}
              items={extracted.activities.slice(0, 5).map((a) => `${a.name}${a.role ? ` — ${a.role}` : ""}${a.hoursPerWeek ? ` · ${a.hoursPerWeek}h/wk` : ""}`)}
            />
            <SummarySection
              label="Awards"
              count={extracted.awards.length}
              items={extracted.awards.slice(0, 5).map((a) => `${a.name}${a.level ? ` — ${a.level}` : ""}${a.year ? ` (${a.year})` : ""}`)}
            />
            <SummarySection
              label="Courses"
              count={extracted.courses.length}
              items={extracted.courses.slice(0, 6).map((c) => `${c.name}${c.score ? ` (${c.score})` : ""}`)}
            />
            {extracted.summerPrograms && extracted.summerPrograms.length > 0 && (
              <SummarySection
                label="Summer programs"
                count={extracted.summerPrograms.length}
                items={extracted.summerPrograms.slice(0, 5).map((p) => `${p.name}${p.year ? ` (${p.year})` : ""}`)}
              />
            )}

            {/* Dynamic remaining questions — only ask what the resume didn't have */}
            <RemainingQuestions confirmForm={confirmForm} setConfirmForm={setConfirmForm} extracted={extracted} />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm"
              >
              {saving ? "Saving..." : "Save profile & go to dashboard"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setStage("paste");
                  setExtracted(null);
                }}
                className="text-sm font-medium underline-animate"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                ← Re-paste
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function ConfirmField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = `confirm-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  );
}

type ConfirmFormState = {
  gpa: string;
  weightedGpa: string;
  satScore: string;
  actScore: string;
  grade: string;
  state: string;
  intendedMajor: string;
  targetColleges: string;
  admissionsConcern: string;
  activitiesText: string;
  awardsText: string;
  apCourses: string;
  honorsCourses: string;
  dualEnrollmentCourses: string;
  ibCourses: string;
  research: string;
  projects: string;
  otherCommitments: string;
};

function RemainingQuestions({
  confirmForm,
  setConfirmForm,
  extracted,
}: {
  confirmForm: ConfirmFormState;
  setConfirmForm: (f: ConfirmFormState) => void;
  extracted: Extracted;
}) {
  const missing: Array<{ key: keyof ConfirmFormState; label: string; placeholder: string; type: "input" | "textarea" }> = [];

  if (!confirmForm.grade) missing.push({ key: "grade", label: "Current grade level", placeholder: "11", type: "input" });
  if (!confirmForm.gpa) missing.push({ key: "gpa", label: "What's your unweighted GPA?", placeholder: "3.85", type: "input" });
  if (!confirmForm.satScore && !confirmForm.actScore) missing.push({ key: "satScore", label: "SAT or ACT score (if you have one)", placeholder: "1450", type: "input" });
  if (!confirmForm.intendedMajor) missing.push({ key: "intendedMajor", label: "What do you want to study?", placeholder: "Computer Science, Biology, Undecided...", type: "input" });
  if (extracted.activities.length === 0) missing.push({ key: "activitiesText", label: "List your main extracurriculars", placeholder: "Debate team captain, volunteer at food bank, coding club...", type: "textarea" });
  if (extracted.awards.length === 0) missing.push({ key: "awardsText", label: "Any awards or honors?", placeholder: "AP Scholar, National Merit Semifinalist, 1st place Science Fair...", type: "textarea" });

  // Always ask these instead of guessing course rigor from a resume.
  missing.push({ key: "apCourses", label: "All AP courses", placeholder: "AP Biology, AP Calculus BC, or None", type: "textarea" });
  missing.push({ key: "honorsCourses", label: "All Honors courses", placeholder: "Honors Chemistry, Honors English 10, or None", type: "textarea" });
  missing.push({ key: "dualEnrollmentCourses", label: "All Dual Enrollment courses", placeholder: "ENC 1101, College Algebra, or None", type: "textarea" });
  missing.push({ key: "ibCourses", label: "All IB courses", placeholder: "IB History HL, IB Mathematics AA, or None", type: "textarea" });
  if (!extracted.activities.some((activity) => /research|lab|publication/i.test(activity.name))) {
    missing.push({ key: "research", label: "Research not listed on your resume", placeholder: "What did you study, build, discover, publish, or present? Include your role and impact.", type: "textarea" });
  }
  if (!extracted.activities.some((activity) => /project|app|website|prototype|portfolio/i.test(activity.name))) {
    missing.push({ key: "projects", label: "Independent projects not listed", placeholder: "Apps, businesses, creative work, engineering builds, campaigns, or other self-directed projects.", type: "textarea" });
  }
  missing.push({ key: "otherCommitments", label: "Other commitments the resume missed", placeholder: "Jobs, family responsibilities, community service, caregiving, or meaningful hobbies.", type: "textarea" });

  // Always ask — resumes rarely have these
  missing.push({ key: "targetColleges", label: "What are your dream schools?", placeholder: "MIT, Stanford, Georgia Tech, UF", type: "input" });
  missing.push({ key: "admissionsConcern", label: "Biggest admissions worry? (optional)", placeholder: "My GPA dipped sophomore year, not sure if my ECs stand out...", type: "textarea" });

  if (missing.length === 0) return null;

  const foundCount = [
    confirmForm.gpa, confirmForm.grade, confirmForm.satScore || confirmForm.actScore,
    confirmForm.intendedMajor, extracted.activities.length > 0 ? "yes" : "",
  ].filter(Boolean).length;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#4A6FA5" }}>
          {foundCount >= 4 ? "Almost done — just a few gaps" : "We need a bit more info"}
        </h2>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "rgba(74,111,165,0.10)", color: "#4A6FA5" }}
        >
          {missing.length} remaining
        </span>
      </div>
      <p className="text-xs mb-4" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
        Your resume covered a lot — fill in the rest so your score is as accurate as possible.
      </p>
      <div
        className="rounded-xl border p-4 space-y-4"
        style={{ borderColor: "rgba(74,111,165,0.20)", backgroundColor: "rgba(74,111,165,0.03)" }}
      >
        {missing.map((field) => (
          <div key={field.key}>
            <label className="label" htmlFor={`remaining-${field.key}`}>{field.label}</label>
            {field.type === "input" ? (
              <input
                id={`remaining-${field.key}`}
                type="text"
                className="input-field"
                value={(confirmForm as Record<string, string>)[field.key] ?? ""}
                onChange={(e) => setConfirmForm({ ...confirmForm, [field.key]: e.target.value })}
                placeholder={field.placeholder}
              />
            ) : (
              <textarea
                id={`remaining-${field.key}`}
                className="input-field min-h-[72px] resize-y text-sm"
                value={(confirmForm as Record<string, string>)[field.key] ?? ""}
                onChange={(e) => setConfirmForm({ ...confirmForm, [field.key]: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SummarySection({
  label,
  count,
  items,
}: {
  label: string;
  count: number;
  items: string[];
}) {
  if (count === 0) return null;
  return (
    <section className="mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          {label}
        </h2>
        <span className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
          {count} found
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            · {item}
          </li>
        ))}
        {count > items.length && (
          <li className="text-xs italic" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            + {count - items.length} more (edit after saving)
          </li>
        )}
      </ul>
    </section>
  );
}
