"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ListChecks,
  Clock,
} from "lucide-react";
import { EmptyTracker } from "@/components/illustrations/EmptyTracker";
import { ResultsSurvey } from "@/components/tracker/ResultsSurvey";
import { CelebrationModal } from "@/components/tracker/CelebrationModal";

type Application = {
  id: string;
  collegeSlug: string;
  collegeName: string;
  applicationRound: string | null;
  status: string;
  essaysDrafted: boolean;
  recsRequested: boolean;
  transcriptSent: boolean;
  fafsaSubmitted: boolean;
  decisionDate: string | null;
  notes: string | null;
  updatedAt: string;
  // Outcome tracking
  financialAidAmount: number | null;
  enrolled: boolean;
  acceptedAt: string | null;
  rejectedAt: string | null;
  waitlistedAt: string | null;
  enrolledAt: string | null;
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "submitted", label: "Submitted" },
  { value: "accepted", label: "Accepted" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "deferred", label: "Deferred" },
  { value: "withdrawn", label: "Withdrawn" },
];

const ROUND_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Round (undecided)" },
  { value: "ED", label: "ED" },
  { value: "EA", label: "EA" },
  { value: "REA", label: "REA" },
  { value: "RD", label: "RD" },
  { value: "RD_2", label: "RD 2" },
  { value: "rolling", label: "Rolling" },
];

// Distinct dot colors for each status — rendered as a small circle next to the name.
const STATUS_DOT: Record<string, string> = {
  not_started: "#8890A5",
  in_progress: "#4A6FA5",
  submitted: "#0369A1",
  accepted: "#047857",
  waitlisted: "#92400E",
  rejected: "#B91C1C",
  deferred: "#3730A3",
  withdrawn: "#8890A5",
};

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  not_started: { bg: "rgba(255,255,255,0.45)", fg: "var(--dl-text-muted, #5A6275)" },
  in_progress: { bg: "rgba(74,111,165,0.08)", fg: "#4A6FA5" },
  submitted: { bg: "#E0F2FE", fg: "#0369A1" },
  accepted: { bg: "#D1FAE5", fg: "#047857" },
  waitlisted: { bg: "#FEF3C7", fg: "#92400E" },
  rejected: { bg: "#FEE2E2", fg: "#B91C1C" },
  deferred: { bg: "#E0E7FF", fg: "#3730A3" },
  withdrawn: { bg: "rgba(255,255,255,0.45)", fg: "var(--dl-text-muted, #5A6275)" },
};

export function TrackerClient() {
  const [apps, setApps] = useState<Application[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const [celebratingSchool, setCelebratingSchool] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tracker");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load");
      setApps(Array.isArray(data.applications) ? data.applications : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoading(false);
    }
  }

  async function addSchool() {
    const slug = newSlug.trim().toLowerCase();
    if (!slug) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not add");
      setNewSlug("");
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add");
    } finally {
      setAdding(false);
    }
  }

  async function patch(id: string, body: Partial<Application>) {
    // Detect status change to "accepted" → show celebration modal
    if (body.status === "accepted") {
      const app = apps?.find((a) => a.id === id);
      if (app && app.status !== "accepted") {
        setCelebratingSchool(app.collegeName);
      }
    }

    // Optimistic — flip the row immediately so checkboxes feel instant.
    // If the server rejects, we re-fetch which restores truth.
    setApps((prev) =>
      prev ? prev.map((a) => (a.id === id ? { ...a, ...body } : a)) : prev
    );
    try {
      const res = await fetch(`/api/tracker/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Update failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
      void load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this school from your tracker?")) return;
    setApps((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
    try {
      const res = await fetch(`/api/tracker/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Delete failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      void load();
    }
  }

  const counts = useMemo(() => {
    if (!apps) return null;
    return {
      total: apps.length,
      submitted: apps.filter((a) => a.status === "submitted").length,
      accepted: apps.filter((a) => a.status === "accepted").length,
      pending: apps.filter((a) => ["submitted", "in_progress"].includes(a.status)).length,
    };
  }, [apps]);

  // Upcoming-deadline panel: only show schools where the student has set a
  // decisionDate AND the row hasn't been resolved (accepted/rejected/withdrawn).
  // Sorted ascending so the most urgent is first.
  //
  // Surface window: 30 days into the past (still actionable — late submit,
  // appeal, deferred-action follow-up) up to 180 days into the future.
  // Bounding the past prevents stale 2-year-old deadlines from cluttering
  // the panel when a student forgets to update a row.
  const upcomingDeadlines = useMemo(() => {
    if (!apps) return [];
    const now = Date.now();
    const DAY = 1000 * 60 * 60 * 24;
    const FUTURE_HORIZON = DAY * 180;
    const PAST_HORIZON = DAY * 30;
    return apps
      .filter((a) => a.decisionDate)
      .filter((a) => !["accepted", "rejected", "withdrawn"].includes(a.status))
      .map((a) => {
        const ts = new Date(a.decisionDate as string).getTime();
        return { app: a, ts, daysAway: Math.ceil((ts - now) / DAY) };
      })
      .filter((x) => Number.isFinite(x.ts))
      .filter((x) => x.ts - now < FUTURE_HORIZON && x.ts - now > -PAST_HORIZON)
      .sort((a, b) => a.ts - b.ts);
  }, [apps]);

  // Tone bands for urgency chip — same 3-tier scale used elsewhere.
  function urgencyTone(daysAway: number): { bg: string; fg: string; label: string } {
    if (daysAway < 0) return { bg: "rgba(255,255,255,0.45)", fg: "var(--dl-text-muted, #5A6275)", label: "past due" };
    if (daysAway <= 7) return { bg: "#FEE2E2", fg: "#B91C1C", label: `${daysAway}d` };
    if (daysAway <= 30) return { bg: "#FEF3C7", fg: "#92400E", label: `${daysAway}d` };
    return { bg: "rgba(74,111,165,0.08)", fg: "#4A6FA5", label: `${daysAway}d` };
  }

  // Inline deadline countdown for individual cards.
  function deadlineCountdown(app: Application): { text: string; color: string } | null {
    if (!app.decisionDate) return null;
    if (["accepted", "rejected", "withdrawn"].includes(app.status)) return null;
    const now = Date.now();
    const DAY = 1000 * 60 * 60 * 24;
    const ts = new Date(app.decisionDate).getTime();
    if (!Number.isFinite(ts)) return null;
    const daysAway = Math.ceil((ts - now) / DAY);
    if (daysAway < 0) return { text: "Overdue", color: "#B91C1C" };
    if (daysAway === 0) return { text: "Due today!", color: "#B91C1C" };
    if (daysAway <= 7) return { text: `${daysAway} day${daysAway === 1 ? "" : "s"} — urgent!`, color: "#B91C1C" };
    if (daysAway <= 30) return { text: `${daysAway} days until deadline`, color: "#92400E" };
    return { text: `${daysAway} days until deadline`, color: "#047857" };
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <h1
          className="font-bold tracking-tight mb-3"
          style={{
            color: "#1B2030",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontWeight: 700,
          }}
        >
          Application tracker
        </h1>
        <p className="mb-8 text-base" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          Status board for every school you&apos;re applying to. Toggle the
          checkboxes as you knock things out — essays, recs, transcripts,
          FAFSA — and update each row as decisions land.
        </p>

        {counts && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Tracked" value={counts.total} />
            <Stat label="Submitted" value={counts.submitted} />
            <Stat label="Accepted" value={counts.accepted} highlight />
            <Stat label="Open" value={counts.pending} />
          </div>
        )}

        {upcomingDeadlines.length > 0 && (
          <div
            className="mb-8 border p-5 dl-card-hover overflow-hidden"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "14px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" style={{ color: "#4A6FA5" }} strokeWidth={1.75} />
              <p
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "#4A6FA5" }}
              >
                Upcoming deadlines
              </p>
            </div>
            <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {upcomingDeadlines.slice(0, 6).map(({ app, daysAway, ts }) => {
                const tone = urgencyTone(daysAway);
                const dateStr = new Date(ts).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                return (
                  <li key={app.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p
                        className="text-[14px] font-semibold truncate"
                        style={{ color: "var(--dl-text-primary, #1B2030)" }}
                      >
                        {app.collegeName}
                      </p>
                      <p className="text-[12px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        {dateStr}
                        {app.applicationRound ? ` • ${app.applicationRound}` : ""}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-mono font-semibold tabular-nums"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {tone.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Results survey prompt — shown after May 1 decision day */}
        <ResultsSurvey />

        {/* Add school */}
        <div
          className="mb-8 border p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
          style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "14px" }}
        >
          <input
            type="text"
            placeholder="College name (e.g. harvard, mit, stanford)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void addSchool();
            }}
            className="flex-1 w-full px-4 py-2.5 border text-sm"
            style={{
              borderColor: "rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "14px",
              color: "#1B2030",
            }}
          />
          <button
            onClick={addSchool}
            disabled={adding || !newSlug.trim()}
            className="dl-btn dl-btn-primary text-sm px-5 py-2.5 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            {adding ? "Adding…" : "Add school"}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 border p-4 flex items-start gap-3"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "14px" }}
            >
              <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#DC2626" }} />
              <p className="text-sm" style={{ color: "var(--dl-text-primary, #1B2030)" }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        {loading && !apps && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border p-5 animate-pulse"
                style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", borderRadius: "14px" }}
              >
                <div className="h-5 w-48 rounded mb-3" style={{ background: "rgba(0,0,0,0.06)" }} />
                <div className="h-3 w-32 rounded mb-4" style={{ background: "rgba(0,0,0,0.04)" }} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-9 rounded-xl" style={{ background: "rgba(0,0,0,0.04)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {apps?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-2 border-dashed py-16 text-center"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div
              className="mx-auto mb-5 flex items-center justify-center"
              style={{ color: "#4A6FA5" }}
            >
              <EmptyTracker size={108} />
            </div>
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
            >
              Track every application in one place
            </h2>
            <p
              className="mx-auto mt-2 max-w-md text-sm leading-relaxed"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              Add the schools you are applying to and track essays, recs, transcripts,
              and FAFSA for each one. Update statuses as decisions roll in so you always
              know where things stand.
            </p>
            <button
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('input[placeholder*="College"]');
                if (input) input.focus();
              }}
              className="dl-btn dl-btn-primary mt-6 px-8 py-3"
            >
              <Plus className="h-4 w-4" />
              Add your first school
            </button>
          </motion.div>
        )}

        {/* Rows */}
        <div className="space-y-3">
          {apps?.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border p-5 dl-card-hover overflow-hidden"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "14px" }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="shrink-0 inline-block rounded-full"
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: STATUS_DOT[a.status] ?? "#8890A5",
                      }}
                      title={STATUS_OPTIONS.find((o) => o.value === a.status)?.label ?? a.status}
                    />
                    <h3
                      className="text-lg font-semibold truncate"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      {a.collegeName}
                    </h3>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                    {a.collegeSlug}
                  </p>
                  {(() => {
                    const dl = deadlineCountdown(a);
                    if (!dl) return null;
                    return (
                      <p
                        className="text-xs font-semibold mt-1"
                        style={{ color: dl.color }}
                      >
                        {dl.text}
                      </p>
                    );
                  })()}
                </div>
                <button
                  onClick={() => remove(a.id)}
                  aria-label="Remove school"
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.45)]"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Status + Round selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <Select
                  label="Status"
                  value={a.status}
                  options={STATUS_OPTIONS}
                  onChange={(v) => void patch(a.id, { status: v })}
                  toneFor={a.status}
                />
                <Select
                  label="Round"
                  value={a.applicationRound ?? ""}
                  options={ROUND_OPTIONS}
                  onChange={(v) => void patch(a.id, { applicationRound: v || null })}
                />
              </div>

              {/* Sub-task checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Check label="Essays drafted" checked={a.essaysDrafted} onChange={(v) => void patch(a.id, { essaysDrafted: v })} />
                <Check label="Recs requested" checked={a.recsRequested} onChange={(v) => void patch(a.id, { recsRequested: v })} />
                <Check label="Transcript sent" checked={a.transcriptSent} onChange={(v) => void patch(a.id, { transcriptSent: v })} />
                <Check label="FAFSA filed" checked={a.fafsaSubmitted} onChange={(v) => void patch(a.id, { fafsaSubmitted: v })} />
              </div>

              {/* Outcome tracking — visible when a decision has landed */}
              {["accepted", "waitlisted", "rejected"].includes(a.status) && (
                <div
                  className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-3"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <label className="block">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
                      style={{ color: "var(--dl-text-muted, #5A6275)" }}
                    >
                      Financial aid offered ($)
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="e.g. 35000"
                      value={a.financialAidAmount ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        void patch(a.id, {
                          financialAidAmount: val ? Number(val) : null,
                        } as Partial<Application>);
                      }}
                      className="w-full px-3 py-2 rounded-xl border text-sm font-medium"
                      style={{
                        borderColor: "rgba(0,0,0,0.06)",
                        background: "rgba(255,255,255,0.45)",
                        color: "var(--dl-text-primary, #1B2030)",
                      }}
                    />
                  </label>

                  {a.status === "accepted" && (
                    <div className="flex items-end">
                      <Check
                        label="I am enrolling here"
                        checked={a.enrolled}
                        onChange={(v) =>
                          void patch(a.id, {
                            enrolled: v,
                            enrolledAt: v ? new Date().toISOString() : null,
                          } as Partial<Application>)
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Celebration modal — triggered when a school status changes to "accepted" */}
        {celebratingSchool && (
          <CelebrationModal
            schoolName={celebratingSchool}
            onClose={() => setCelebratingSchool(null)}
          />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className="border p-4 dl-card-hover overflow-hidden"
      style={{
        borderColor: "rgba(0,0,0,0.06)",
        background: highlight ? "rgba(74,111,165,0.08)" : "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "14px",
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-1"
        style={{ color: "var(--dl-text-muted, #5A6275)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-extrabold"
        style={{ color: highlight ? "#4A6FA5" : "var(--dl-text-primary, #1B2030)" }}
      >
        {value}
      </p>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  toneFor,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  toneFor?: string;
}) {
  const tone = toneFor ? STATUS_TONE[toneFor] : undefined;
  return (
    <label className="block">
      <span
        className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
        style={{ color: "var(--dl-text-muted, #5A6275)" }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border text-sm font-medium"
        style={{
          borderColor: "rgba(0,0,0,0.06)",
          background: tone?.bg ?? "rgba(255,255,255,0.45)",
          color: tone?.fg ?? "var(--dl-text-primary, #1B2030)",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium"
      style={{
        borderColor: checked ? "#4A6FA5" : "rgba(0,0,0,0.06)",
        background: checked ? "rgba(74,111,165,0.08)" : "rgba(255,255,255,0.45)",
        color: checked ? "#4A6FA5" : "var(--dl-text-secondary, #454B5E)",
      }}
    >
      {checked ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2.25} />
      ) : (
        <Circle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      )}
      {label}
    </button>
  );
}
