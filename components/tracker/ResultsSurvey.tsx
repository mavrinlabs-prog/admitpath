"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, X, Send } from "lucide-react";

/**
 * Results survey prompt — shown in the tracker after May 1 (decision day).
 *
 * Asks students to report:
 *   1. Which school they committed to
 *   2. Other schools they were admitted to
 *   3. Financial aid amount at committed school
 *
 * Data is POSTed to /api/tracker/survey and becomes the outcomes dataset
 * that powers the /outcomes page.
 */
export function ResultsSurvey() {
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [committedSchool, setCommittedSchool] = useState("");
  const [otherAdmits, setOtherAdmits] = useState("");
  const [aidAmount, setAidAmount] = useState("");

  // Show May through August (the commitment + post-decision window).
  // Before May: too early. After August: the student has moved on.
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const showSurvey = month >= 4 && month <= 7; // May (4) through August (7)
  if (!showSurvey || dismissed) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!committedSchool.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/tracker/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          committedSchool: committedSchool.trim(),
          otherAdmits: otherAdmits
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          financialAidAmount: aidAmount ? Number(aidAmount) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not submit survey");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit survey");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mb-8 border p-6 relative"
        style={{
          borderColor: "rgba(0,0,0,0.06)",
          background: "rgba(74,111,165,0.06)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "14px",
        }}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.45)]"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
          aria-label="Dismiss survey"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <GraduationCap
              className="h-8 w-8 mx-auto mb-3"
              style={{ color: "#047857" }}
              strokeWidth={1.75}
            />
            <p
              className="text-base font-semibold mb-1"
              style={{ color: "var(--dl-text-primary, #1B2030)" }}
            >
              Thank you — and congratulations.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Your response helps us give better guidance to next year&apos;s
              students. We hope AdmitPath played a small part in getting you
              here. Good luck at {committedSchool || "your new school"}!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap
                className="h-5 w-5"
                style={{ color: "#4A6FA5" }}
                strokeWidth={1.75}
              />
              <p
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "#4A6FA5" }}
              >
                Results survey
              </p>
            </div>

            <h3
              className="text-base font-semibold mb-1"
              style={{ color: "var(--dl-text-primary, #1B2030)" }}
            >
              Where did you commit?
            </h3>
            <p
              className="text-sm mb-5 leading-relaxed"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Tell us so we can improve for next year&apos;s students. Your data
              is anonymized and only used in aggregate on our{" "}
              <a
                href="/outcomes"
                className="underline"
                style={{ color: "#4A6FA5" }}
              >
                outcomes page
              </a>
              .
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  School you are committing to *
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Michigan"
                  value={committedSchool}
                  onChange={(e) => setCommittedSchool(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{
                    borderColor: "rgba(0,0,0,0.06)",
                    background: "rgba(255,255,255,0.55)",
                    color: "#1B2030",
                  }}
                />
              </label>

              <label className="block">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  Other schools you were admitted to (comma-separated)
                </span>
                <input
                  type="text"
                  placeholder="e.g. NYU, Boston College, UVA"
                  value={otherAdmits}
                  onChange={(e) => setOtherAdmits(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{
                    borderColor: "rgba(0,0,0,0.06)",
                    background: "rgba(255,255,255,0.55)",
                    color: "#1B2030",
                  }}
                />
              </label>

              <label className="block">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  Financial aid at committed school ($)
                </span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  placeholder="e.g. 25000"
                  value={aidAmount}
                  onChange={(e) => setAidAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{
                    borderColor: "rgba(0,0,0,0.06)",
                    background: "rgba(255,255,255,0.55)",
                    color: "#1B2030",
                  }}
                />
              </label>

              {error && (
                <p className="text-sm" style={{ color: "#B91C1C" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !committedSchool.trim()}
                className="dl-btn dl-btn-primary text-sm px-5 py-2.5 disabled:opacity-60 inline-flex items-center gap-2"
              >
                <Send className="h-4 w-4" strokeWidth={1.75} />
                {submitting ? "Submitting..." : "Submit results"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
