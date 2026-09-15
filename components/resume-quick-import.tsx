"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Sparkles, X, Check, ChevronDown, Upload } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { apiErrorMessage, apiFetch, isApiError, redirectToSignIn } from "@/lib/api-client";
import type { ProfileSaveResponse, ResumeExtraction } from "@/lib/profile-contract";

export type Extracted = ResumeExtraction;

type ProgressState =
  | "idle"
  | "uploading"
  | "reading"
  | "extracting"
  | "reviewing"
  | "saving"
  | "starting-analysis"
  | "completed";

const PROGRESS_LABELS: Record<ProgressState, string> = {
  idle: "Ready",
  uploading: "Uploading",
  reading: "Reading document",
  extracting: "Extracting details",
  reviewing: "Reviewing structure",
  saving: "Saving profile",
  "starting-analysis": "Starting analysis",
  completed: "Completed",
};

type ResumeQuickImportProps = {
  onImported?: (data: Extracted) => void;
  onReviewStateChange?: (reviewing: boolean) => void;
  context?: "analyze" | "essay" | "chat" | "colleges" | "dashboard" | "general";
};

/**
 * Inline editable field for the review step.
 * Shows a label + value that the user can click to edit before saving.
 */
function EditableField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number | null;
  onChange: (v: string) => void;
  type?: "text" | "number";
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className="text-[11px] font-medium w-28 shrink-0"
        style={{ color: "var(--dl-text-muted, #8890A5)" }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-xs px-2 py-1 rounded-md border bg-transparent transition-colors focus:outline-none focus:border-[#4A6FA5]"
        style={{
          borderColor: "rgba(74,111,165,0.15)",
          color: "var(--dl-text-primary, #1B2030)",
        }}
      />
    </div>
  );
}

const CONTEXT_COPY: Record<string, { cta: string; benefit: string }> = {
  analyze: { cta: "Paste resume to auto-fill your profile", benefit: "Get an accurate 7-dimension score without typing everything" },
  essay: { cta: "Paste resume for better essay feedback", benefit: "The AI uses your activities and awards to give personalized advice" },
  chat: { cta: "Paste resume so the counselor knows you", benefit: "Get advice based on YOUR profile, not generic tips" },
  colleges: { cta: "Paste resume to find your best-fit schools", benefit: "We match schools to your actual stats and activities" },
  dashboard: { cta: "Paste your resume to get started fast", benefit: "Skip the 7-step form — we extract everything in seconds" },
  general: { cta: "Paste your resume to auto-fill", benefit: "AI extracts GPA, scores, activities, awards, and courses" },
};

export function ResumeQuickImport({ onImported, onReviewStateChange, context = "general" }: ResumeQuickImportProps) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [reviewData, setReviewData] = useState<Extracted | null>(null);
  const [progress, setProgress] = useState<ProgressState>("idle");
  const [supplemental, setSupplemental] = useState({
    apCourses: "",
    honorsCourses: "",
    dualEnrollmentCourses: "",
    ibCourses: "",
    research: "",
    projects: "",
    otherCommitments: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const lastParsedTextRef = useRef("");

  const copy = CONTEXT_COPY[context] || CONTEXT_COPY.general;

  useEffect(() => {
    onReviewStateChange?.(reviewData !== null);
  }, [onReviewStateChange, reviewData]);

  useEffect(() => () => onReviewStateChange?.(false), [onReviewStateChange]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setProgress("uploading");
    // For .txt files, read directly
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      setParsing(true);
      try {
        setProgress("reading");
        const result = await file.text();
        if (controller.signal.aborted) return;
        setText(result);
        await parseResumeText(result);
      } catch {
        if (!controller.signal.aborted) {
          setProgress("idle");
          toast.error("Could not read that text file. Try pasting the content instead.");
        }
      } finally {
        setParsing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      return;
    }
    // For PDF/DOCX, send to server for extraction
    const formData = new FormData();
    formData.append("file", file);
    setParsing(true);
    try {
      setProgress("reading");
      const res = await fetch("/api/profile/extract-file", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      if (res.status === 401) {
        redirectToSignIn();
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(apiErrorMessage(d, "Could not extract text from file. Try pasting instead."));
        return;
      }
      const data = await res.json() as { text?: string; warning?: string };
      const extractedText = data.text ?? "";
      setText(extractedText);
      if (data.warning || extractedText.trim().length < 50) {
        toast.error(data.warning || "We could not read enough text from that file. Paste the content instead.");
        return;
      }
      await parseResumeText(extractedText);
    } catch (error) {
      if (controller.signal.aborted) return;
      toast.error("Upload failed. Try pasting the text instead.");
      setProgress("idle");
    } finally {
      setParsing(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function parseResumeText(sourceText: string) {
    if (sourceText.trim().length < 50) {
      toast.error("Paste at least 50 characters.");
      return;
    }
    const normalizedText = sourceText.trim();
    if (lastParsedTextRef.current === normalizedText && reviewData) {
      setProgress("reviewing");
      return;
    }
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setParsing(true);
    setProgress("extracting");
    try {
      const data = await apiFetch<Extracted>("/api/profile/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText }),
        signal: controller.signal,
      });

      // Show the review step so the user can verify/edit before saving.
      // This is the ADMITPATH-001 trust-verify gate: never auto-save LLM
      // extractions because AP scores get hallucinated ~8% of the time.
      lastParsedTextRef.current = normalizedText;
      setReviewData(data);
      setProgress("reviewing");
    } catch (err) {
      if (controller.signal.aborted) {
        setProgress("idle");
        return;
      }
      if (isApiError(err) && err.status === 401) {
        redirectToSignIn();
        return;
      }
      toast.error("Couldn't parse. Try a cleaner copy-paste or fill in manually.");
      setProgress("idle");
    } finally {
      setParsing(false);
    }
  }

  async function handleParse() {
    await parseResumeText(text);
  }

  function cancelParsing() {
    requestControllerRef.current?.abort();
    setParsing(false);
    setProgress("idle");
  }

  /** Save reviewed (and possibly edited) data to the user's profile. */
  async function handleSave() {
    if (!reviewData) return;
    setSaving(true);
    setProgress("saving");
    try {
      const splitLines = (value: string) =>
        value
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter((item) => item && item.toLowerCase() !== "none");
      const confirmedCourses = [
        ...splitLines(supplemental.apCourses),
        ...splitLines(supplemental.honorsCourses),
        ...splitLines(supplemental.dualEnrollmentCourses),
        ...splitLines(supplemental.ibCourses),
      ];
      const followUpActivities = [
        supplemental.research
          ? { name: "Research not listed on resume", impact: supplemental.research.slice(0, 500), provenance: "MANUAL" as const }
          : null,
        supplemental.projects
          ? { name: "Independent projects not listed on resume", impact: supplemental.projects.slice(0, 500), provenance: "MANUAL" as const }
          : null,
        supplemental.otherCommitments
          ? { name: "Additional work, service, or family responsibilities", impact: supplemental.otherCommitments.slice(0, 500), provenance: "MANUAL" as const }
          : null,
      ].filter((activity): activity is { name: string; impact: string; provenance: "MANUAL" } => activity !== null);

      const saved = await apiFetch<ProfileSaveResponse>("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gpa: reviewData.academic.gpa,
          weightedGpa: reviewData.academic.weightedGpa,
          satScore: reviewData.academic.satScore,
          actScore: reviewData.academic.actScore,
          grade: reviewData.academic.grade,
          state: reviewData.academic.state,
          intendedMajor: reviewData.academic.intendedMajor,
          activities: [
            ...reviewData.activities.map((activity) => ({ ...activity, provenance: "RESUME_EXTRACTED" as const })),
            ...followUpActivities,
          ],
          awards: reviewData.awards.map((award) => ({ ...award, provenance: "RESUME_EXTRACTED" as const })),
          courses: Array.from(new Set([
            ...reviewData.courses.map((course) => course.name),
            ...confirmedCourses,
          ])),
          mergeStrategy: "RESUME_REPLACE_AUTO",
        }),
      });
      if (saved.persisted !== true || !saved.profile) {
        throw new Error("The profile save was not confirmed by the server.");
      }

      setDone(true);
      setProgress("completed");
      toast.success("Profile updated from your resume!");
      if (context === "dashboard") {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      if (context === "analyze") {
        setProgress("starting-analysis");
        router.replace("/analyze?autorun=1");
        router.refresh();
        return;
      }
      onImported?.(reviewData);
      setTimeout(() => setOpen(false), 1500);
    } catch (err) {
      if (isApiError(err) && err.status === 401) {
        redirectToSignIn();
        return;
      }
      toast.error("Couldn't save profile. Please try again.");
      setProgress("reviewing");
    } finally {
      setSaving(false);
    }
  }

  function updateAcademic(field: keyof Extracted["academic"], value: string) {
    if (!reviewData) return;
    const numFields = ["gpa", "weightedGpa", "satScore", "actScore", "grade"];
    setReviewData({
      ...reviewData,
      academic: {
        ...reviewData.academic,
        [field]: numFields.includes(field)
          ? value === "" ? null : Number(value)
          : value || null,
      },
    });
  }

  if (done) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
        style={{ backgroundColor: "rgba(34,197,94,0.08)", color: "#16a34a" }}
      >
        <Check className="h-3.5 w-3.5" />
        Resume imported — profile updated
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 w-full px-3.5 py-3 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5"
          style={{
            borderColor: "rgba(74,111,165,0.20)",
            backgroundColor: "rgba(74,111,165,0.04)",
          }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "rgba(74,111,165,0.10)" }}
          >
            <FileText className="h-4 w-4" style={{ color: "#4A6FA5" }} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              {copy.cta}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
              {copy.benefit}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(74,111,165,0.20)", backgroundColor: "rgba(255,255,255,0.5)" }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                    Paste your resume
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setOpen(false); setText(""); }}
                  className="p-1 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
                </button>
              </div>

              <textarea
                className="input-field min-h-[160px] resize-y font-mono text-xs leading-relaxed"
                placeholder="Paste resume, transcript, brag sheet, or Common App activities here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />

              {/* File upload for PDF/DOCX/TXT */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-file-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={parsing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors hover:bg-[rgba(74,111,165,0.06)]"
                  style={{
                    borderColor: "rgba(74,111,165,0.20)",
                    color: "var(--dl-text-secondary, #454B5E)",
                  }}
                >
                  <Upload className="h-3 w-3" />
                  Upload PDF, DOCX, or TXT
                </button>
                <span className="text-[10px]" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  Max 5MB
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px]" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  {parsing ? PROGRESS_LABELS[progress] : `${text.length.toLocaleString()} chars${text.length < 50 && text.length > 0 ? ` · need ${50 - text.length} more` : ""}`}
                </span>
                <div className="flex items-center gap-2">
                  {parsing && (
                    <button type="button" onClick={cancelParsing} className="text-xs px-3 py-2" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleParse}
                    disabled={parsing || text.trim().length < 50}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    {parsing ? (
                      <motion.span
                        className="inline-block h-3 w-3 rounded-full border-2 border-white border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    {parsing ? PROGRESS_LABELS[progress] : "Extract"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Review & edit step (ADMITPATH-001 trust-verify gate) ── */}
      {reviewData && !done && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(74,111,165,0.20)", backgroundColor: "rgba(255,255,255,0.5)" }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                    Review extracted data
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewData(null)}
                  className="p-1 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                  aria-label="Discard extraction"
                >
                  <X className="h-4 w-4" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
                </button>
              </div>
              <p className="text-[11px] mb-3" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                Fix anything wrong before saving. LLM extractions can misread scores.
              </p>

              {(reviewData.uncertainFields.length > 0 || reviewData.missingCriticalFields.length > 0) && (
                <div className="mb-4 border-l-2 pl-3 text-[11px] leading-relaxed" style={{ borderColor: "#D97706", color: "var(--dl-text-secondary, #454B5E)" }}>
                  {reviewData.uncertainFields.length > 0 && (
                    <p><span className="font-semibold">Needs confirmation:</span> {reviewData.uncertainFields.slice(0, 8).join(", ")}{reviewData.uncertainFields.length > 8 ? `, plus ${reviewData.uncertainFields.length - 8} more` : ""}. These values were classified or could not be matched verbatim to the document.</p>
                  )}
                  {reviewData.missingCriticalFields.length > 0 && (
                    <p className="mt-1"><span className="font-semibold">Not found:</span> {reviewData.missingCriticalFields.join("; ")}.</p>
                  )}
                </div>
              )}

              {/* Academic fields */}
              <div className="space-y-0.5">
                <EditableField label="GPA" value={reviewData.academic.gpa} type="number" onChange={(v) => updateAcademic("gpa", v)} />
                <EditableField label="Weighted GPA" value={reviewData.academic.weightedGpa} type="number" onChange={(v) => updateAcademic("weightedGpa", v)} />
                <EditableField label="SAT Score" value={reviewData.academic.satScore} type="number" onChange={(v) => updateAcademic("satScore", v)} />
                <EditableField label="ACT Score" value={reviewData.academic.actScore} type="number" onChange={(v) => updateAcademic("actScore", v)} />
                <EditableField label="Grade" value={reviewData.academic.grade} type="number" onChange={(v) => updateAcademic("grade", v)} />
                <EditableField label="State" value={reviewData.academic.state} onChange={(v) => updateAcademic("state", v)} />
                <EditableField label="Intended Major" value={reviewData.academic.intendedMajor} onChange={(v) => updateAcademic("intendedMajor", v)} />
              </div>

              <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "rgba(74,111,165,0.18)", background: "rgba(74,111,165,0.03)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                  Complete what a resume may leave out
                </p>
                <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  We do not guess these. List every course or experience that applies so your score reflects your full profile.
                </p>
                <div className="mt-3 space-y-3">
                  <SupplementalField label="All AP courses" value={supplemental.apCourses} onChange={(value) => setSupplemental({ ...supplemental, apCourses: value })} placeholder="AP Biology, AP Calculus BC, or None" />
                  <SupplementalField label="All Honors courses" value={supplemental.honorsCourses} onChange={(value) => setSupplemental({ ...supplemental, honorsCourses: value })} placeholder="Honors Chemistry, Honors English 10, or None" />
                  <SupplementalField label="All Dual Enrollment courses" value={supplemental.dualEnrollmentCourses} onChange={(value) => setSupplemental({ ...supplemental, dualEnrollmentCourses: value })} placeholder="ENC 1101, College Algebra, or None" />
                  <SupplementalField label="All IB courses" value={supplemental.ibCourses} onChange={(value) => setSupplemental({ ...supplemental, ibCourses: value })} placeholder="IB History HL, IB Mathematics AA, or None" />
                  {!reviewData.activities.some((activity) => /research|lab|publication/i.test(activity.name)) && (
                    <SupplementalField multiline label="Research not listed on your resume" value={supplemental.research} onChange={(value) => setSupplemental({ ...supplemental, research: value })} placeholder="What did you study, build, discover, publish, or present? Include your role and impact." />
                  )}
                  {!reviewData.activities.some((activity) => /project|app|website|prototype|portfolio/i.test(activity.name)) && (
                    <SupplementalField multiline label="Independent projects not listed" value={supplemental.projects} onChange={(value) => setSupplemental({ ...supplemental, projects: value })} placeholder="Apps, businesses, creative work, engineering builds, campaigns, or other self-directed projects." />
                  )}
                  <SupplementalField multiline label="Other commitments the resume missed" value={supplemental.otherCommitments} onChange={(value) => setSupplemental({ ...supplemental, otherCommitments: value })} placeholder="Jobs, family responsibilities, community service, caregiving, or meaningful hobbies." />
                </div>
              </div>

              {/* Activities summary */}
              {reviewData.activities.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] font-medium mb-1" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                    Activities ({reviewData.activities.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {reviewData.activities.map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(74,111,165,0.08)", color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        {a.name}{a.role ? ` (${a.role})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards summary */}
              {reviewData.awards.length > 0 && (
                <div className="mt-2">
                  <p className="text-[11px] font-medium mb-1" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                    Awards ({reviewData.awards.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {reviewData.awards.map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(74,111,165,0.08)", color: "var(--dl-text-secondary, #454B5E)" }}
                      >
                        {a.name} ({a.level})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extraction notes */}
              {reviewData.extractionNotes && (
                <p className="mt-2 text-[10px] italic" style={{ color: "var(--dl-text-muted, #8890A5)" }}>
                  Note: {reviewData.extractionNotes}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setReviewData(null)}
                  className="text-[11px] px-3 py-1.5 rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary text-xs px-4 py-2"
                >
                  {saving ? (
                    <motion.span
                      className="inline-block h-3 w-3 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  {saving ? "Saving..." : "Save to profile"}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function SupplementalField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const id = `resume-follow-up-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input-field mt-1 min-h-[68px] resize-y text-xs" />
      ) : (
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input-field mt-1 text-xs" />
      )}
    </div>
  );
}
