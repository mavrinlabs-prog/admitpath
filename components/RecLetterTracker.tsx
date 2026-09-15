"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  FileText,
  Check,
  Clock,
  PenLine,
  Send,
  Trash2,
  ChevronDown,
  X,
} from "lucide-react";

const STORAGE_KEY = "admitpath_rec_letters";

type RecStatus = "not_asked" | "asked" | "writing" | "submitted";

type Recommender = {
  id: string;
  name: string;
  subject: string;
  relationship: string;
  status: RecStatus;
};

const STATUS_CONFIG: Record<RecStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  not_asked: {
    label: "Not Asked",
    color: "var(--dl-text-muted, #5A6275)",
    bg: "rgba(0,0,0,0.04)",
    icon: Clock,
  },
  asked: {
    label: "Asked",
    color: "#4A6FA5",
    bg: "rgba(74,111,165,0.1)",
    icon: Send,
  },
  writing: {
    label: "Writing",
    color: "#D97706",
    bg: "rgba(217,119,6,0.1)",
    icon: PenLine,
  },
  submitted: {
    label: "Submitted",
    color: "#16A34A",
    bg: "rgba(22,163,74,0.1)",
    icon: Check,
  },
};

const STATUS_ORDER: RecStatus[] = ["not_asked", "asked", "writing", "submitted"];

function loadRecommenders(): Recommender[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Recommender[]) : [];
  } catch {
    return [];
  }
}

function saveRecommenders(recs: Recommender[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recs));
  } catch { /* quota */ }
}

export function RecLetterTracker() {
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", relationship: "" });
  const [openStatus, setOpenStatus] = useState<string | null>(null);

  useEffect(() => {
    setRecommenders(loadRecommenders());
  }, []);

  const persist = useCallback((recs: Recommender[]) => {
    setRecommenders(recs);
    saveRecommenders(recs);
  }, []);

  function addRecommender() {
    if (!form.name.trim()) return;
    const rec: Recommender = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      subject: form.subject.trim() || "General",
      relationship: form.relationship.trim() || "Teacher",
      status: "not_asked",
    };
    persist([...recommenders, rec]);
    setForm({ name: "", subject: "", relationship: "" });
    setShowAdd(false);
  }

  function updateStatus(id: string, status: RecStatus) {
    persist(recommenders.map((r) => (r.id === id ? { ...r, status } : r)));
    setOpenStatus(null);
  }

  function removeRecommender(id: string) {
    persist(recommenders.filter((r) => r.id !== id));
  }

  const submitted = recommenders.filter((r) => r.status === "submitted").length;
  const total = recommenders.length;

  return (
    <div>
      {/* Progress summary */}
      {total > 0 && (
        <div
          className="mb-6 border p-5"
          style={{
            background: "var(--dl-bg-card, rgba(255,255,255,0.45))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "var(--dl-border, rgba(0,0,0,0.06))",
            borderRadius: "14px",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[11px] uppercase"
              style={{ color: "#4A6FA5", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              Progress
            </p>
            <span
              className="text-[22px] leading-none tabular-nums"
              style={{ color: "#4A6FA5", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {submitted}
              <span className="text-[12px]" style={{ color: "#5A6275" }}>/{total}</span>
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${total > 0 ? (submitted / total) * 100 : 0}%`, background: "#4A6FA5" }}
            />
          </div>
        </div>
      )}

      {/* Recommender cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {recommenders.map((rec) => {
            const cfg = STATUS_CONFIG[rec.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="border p-5 relative"
                style={{
                  background: "var(--dl-bg-card, rgba(255,255,255,0.45))",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: rec.status === "submitted"
                    ? "rgba(22,163,74,0.2)"
                    : "var(--dl-border, rgba(0,0,0,0.06))",
                  borderRadius: "14px",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[16px] leading-tight"
                      style={{
                        color: "var(--dl-text-primary, #1B2030)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {rec.name}
                    </p>
                    <p className="mt-1 text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {rec.subject} &middot; {rec.relationship}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenStatus(openStatus === rec.id ? null : rec.id)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {openStatus === rec.id && (
                        <div
                          className="absolute right-0 top-full mt-1 z-10 min-w-[140px] border py-1 shadow-lg"
                          style={{
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(12px)",
                            borderColor: "var(--dl-border, rgba(0,0,0,0.06))",
                            borderRadius: "10px",
                          }}
                        >
                          {STATUS_ORDER.map((s) => {
                            const sc = STATUS_CONFIG[s];
                            const Icon = sc.icon;
                            return (
                              <button
                                key={s}
                                onClick={() => updateStatus(rec.id, s)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium hover:bg-[rgba(74,111,165,0.04)] transition-colors"
                                style={{ color: sc.color }}
                              >
                                <Icon className="h-3 w-3" />
                                {sc.label}
                                {rec.status === s && <Check className="ml-auto h-3 w-3" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeRecommender(rec.id)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                      aria-label={`Remove ${rec.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add recommender form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden border"
            style={{
              background: "var(--dl-bg-card, rgba(255,255,255,0.45))",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderColor: "rgba(74,111,165,0.15)",
              borderRadius: "14px",
            }}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-[14px] font-bold"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  Add recommender
                </p>
                <button
                  onClick={() => setShowAdd(false)}
                  className="rounded-lg p-1 hover:bg-[rgba(0,0,0,0.06)] transition-colors"
                >
                  <X className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Teacher name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A6FA5]"
                  style={{
                    borderColor: "var(--dl-border, rgba(0,0,0,0.08))",
                    background: "rgba(255,255,255,0.6)",
                    color: "var(--dl-text-primary, #1B2030)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Subject (e.g., AP Chemistry)"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="rounded-lg border px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A6FA5]"
                  style={{
                    borderColor: "var(--dl-border, rgba(0,0,0,0.08))",
                    background: "rgba(255,255,255,0.6)",
                    color: "var(--dl-text-primary, #1B2030)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g., Junior year teacher)"
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className="rounded-lg border px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A6FA5]"
                  style={{
                    borderColor: "var(--dl-border, rgba(0,0,0,0.08))",
                    background: "rgba(255,255,255,0.6)",
                    color: "var(--dl-text-primary, #1B2030)",
                  }}
                />
              </div>
              <button
                onClick={addRecommender}
                disabled={!form.name.trim()}
                className="dl-btn dl-btn-primary mt-4 text-[13px] disabled:opacity-40"
              >
                Add recommender
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(74,111,165,0.08)]"
            style={{
              background: "var(--dl-bg-card, rgba(255,255,255,0.45))",
              borderColor: "var(--dl-border, rgba(0,0,0,0.06))",
              color: "#4A6FA5",
            }}
          >
            <UserPlus className="h-4 w-4" />
            Add recommender
          </button>
        )}
        <a
          href="/api/rec-letter/brag-sheet"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(74,111,165,0.08)]"
          style={{
            background: "var(--dl-bg-card, rgba(255,255,255,0.45))",
            borderColor: "var(--dl-border, rgba(0,0,0,0.06))",
            color: "var(--dl-text-primary, #1B2030)",
          }}
        >
          <FileText className="h-4 w-4" style={{ color: "#4A6FA5" }} />
          Generate brag sheet
        </a>
      </div>
    </div>
  );
}
