"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, GraduationCap, Target, Shield, X, ExternalLink, ClipboardList } from "lucide-react";
import { EmptyColleges } from "@/components/illustrations/EmptyColleges";
import { findCollegeByName, type College as SeedCollege } from "@/data/colleges";
import { CollegeLogo as CollegeLogoComponent } from "@/components/college-logo";
import { useToast } from "@/components/ui/toast";
import { ResumeQuickImport } from "@/components/resume-quick-import";
import { AppNav } from "@/components/app-nav";

type College = {
  id: string;
  collegeName: string;
  category: string;
  matchScore: number | null;
  notes: string | null;
  createdAt: string;
};

// Source rgba alphas from semantic CSS vars where possible. The `lightBg` /
// `borderColor` / `badgeBg` literals are kept as inline rgba (rather than
// var(--color-reach-bg)) only because lightBg uses 0.06 (lighter than the
// shared --color-*-bg 0.08) for the calmer column wash. If/when those
// converge, swap directly to the CSS vars.
const COLUMNS = [
  {
    key: "reach" as const,
    label: "Reach",
    icon: GraduationCap,
    color: "var(--color-reach)",
    lightBg: "rgba(239,68,68,0.06)",
    borderColor: "var(--color-reach-border)",
    badgeBg: "var(--color-reach-bg)",
    description: "Ambitious — lower acceptance rate than your stats",
  },
  {
    key: "target" as const,
    label: "Target",
    icon: Target,
    color: "var(--color-target)",
    lightBg: "rgba(74,111,165,0.06)",
    borderColor: "var(--color-target-border)",
    badgeBg: "var(--color-target-bg)",
    description: "Well-matched to your current profile",
  },
  {
    key: "safety" as const,
    label: "Safety",
    icon: Shield,
    color: "var(--color-safety)",
    lightBg: "rgba(34,197,94,0.06)",
    borderColor: "var(--color-safety-border)",
    badgeBg: "var(--color-safety-bg)",
    description: "Strong acceptance likelihood",
  },
];

/**
 * Wrapper that maps the kanban's seed/fallbackName props to the canonical
 * 3-tier CollegeLogo component (Clearbit → local SVG → monogram).
 */
function CollegeLogo({ seed, fallbackName }: { seed: SeedCollege | undefined; fallbackName: string; color: string }) {
  return (
    <CollegeLogoComponent
      name={seed?.name ?? fallbackName}
      domain={seed?.domain}
      slug={seed?.slug}
      size={40}
      rounded={false}
    />
  );
}

function CollegeCard({
  college,
  color,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging,
  onKeyboardMove,
}: {
  college: College;
  color: string;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onKeyboardMove: (id: string, key: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const seed = findCollegeByName(college.collegeName);
  const acceptanceLabel = seed
    ? seed.acceptanceRate < 1
      ? `<1%`
      : `${seed.acceptanceRate.toFixed(seed.acceptanceRate < 10 ? 1 : 0)}%`
    : null;

  return (
    <div
      draggable
      tabIndex={0}
      role="button"
      aria-label={`${college.collegeName} in ${college.category}. Use arrow keys to move; R, T, S to assign reach, target, safety.`}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", college.id);
        onDragStart(college.id);
      }}
      onDragEnd={onDragEnd}
      onKeyDown={(e) => {
        const handled = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "r", "R", "t", "T", "s", "S"];
        if (handled.includes(e.key)) {
          e.preventDefault();
          onKeyboardMove(college.id, e.key);
        }
      }}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="rounded-2xl cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -8 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative border p-4 transition-[border-color] duration-200 ease-out dl-card-hover"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: hovered ? color : "rgba(0,0,0,0.06)",
        borderRadius: "14px",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <CollegeLogo seed={seed} fallbackName={college.collegeName} color={color} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p
                className="truncate font-semibold leading-tight"
                style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
                title={college.collegeName}
              >
                {seed?.shortName ?? college.collegeName}
              </p>
              {seed?.ivy && (
                <span
                  className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(74,111,165,0.12)", color: "#1E3352" }}
                >
                  Ivy
                </span>
              )}
            </div>
            {seed && (
              <p className="mt-0.5 truncate text-xs" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                {seed.city}, {seed.state}
              </p>
            )}
            {college.matchScore !== null && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${college.matchScore}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs font-bold tabular-nums" style={{ color }}>
                  {college.matchScore}%
                </span>
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => onDelete(college.id)}
              aria-label={`Remove ${college.collegeName}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: "var(--error-light)", color: "var(--error)" }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {seed && (
        <div
          className="mt-3 grid grid-cols-3 gap-2 rounded-lg border px-2 py-2 text-center"
          style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Admit
            </p>
            <p className="text-xs font-bold tabular-nums" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              {acceptanceLabel}
            </p>
          </div>
          <div style={{ borderLeft: "1px solid rgba(0,0,0,0.06)", borderRight: "1px solid rgba(0,0,0,0.06)" }}>
            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              SAT
            </p>
            <p className="text-xs font-bold tabular-nums" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              {seed.sat25}–{seed.sat75}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Avg GPA
            </p>
            <p className="text-xs font-bold tabular-nums" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              {seed.gpaAvg.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {seed && (
        <a
          href={`https://${seed.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold transition-colors"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          {seed.domain}
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      )}
    </motion.div>
    </div>
  );
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"reach" | "target" | "safety">("target");
  const [addError, setAddError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<"reach" | "target" | "safety" | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Guard against an expired session: if the API returns 401/4xx, don't
    // try to render `{error: ...}` as a College[] — we'd crash on .filter/.map.
    fetch("/api/colleges")
      .then(async (r) => {
        if (r.status === 401) {
          const here = window.location.pathname;
          window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(here)}`);
          return [] as College[];
        }
        if (!r.ok) return [] as College[];
        const data = (await r.json()) as unknown;
        return Array.isArray(data) ? (data as College[]) : ([] as College[]);
      })
      .then((d) => setColleges(d))
      .catch(() => setColleges([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    // Block dupes client-side. The server is authoritative (it dedupes by
    // name+userId) but the user shouldn't see "Failed to add" for what is
    // really a duplicate — surface a friendlier message immediately.
    const dup = colleges.find(
      (c) => c.collegeName.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (dup) {
      setAddError(`"${dup.collegeName}" is already on your list.`);
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch("/api/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeName: name, category }),
      });
      if (res.ok) {
        const newCollege = (await res.json()) as College;
        setColleges((c) => [...c, newCollege]);
        setName("");
        setShowForm(false);
      } else if (res.status === 401) {
        const here = window.location.pathname;
        window.location.assign(`/sign-in?redirect_url=${encodeURIComponent(here)}`);
        return;
      } else if (res.status === 429) {
        setAddError("Slow down — too many requests. Try again in a minute.");
      } else {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setAddError(
          res.status === 403
            ? "Upgrade to Pro to add more colleges."
            : (d.error ?? "Failed to add college.")
        );
      }
    } catch {
      setAddError("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  // Keyboard reordering / column assignment for the kanban. ArrowUp/Down
  // moves within a column; ArrowLeft/Right (or R/T/S) reassigns columns.
  // Reordering within a column is local (no persisted "position" field) but
  // still useful for screen-reader users navigating the list.
  function handleKeyboardMove(id: string, key: string) {
    const card = colleges.find((c) => c.id === id);
    if (!card) return;
    const cat = card.category as "reach" | "target" | "safety";
    const k = key.toLowerCase();
    let newCat: "reach" | "target" | "safety" | null = null;
    if (k === "r") newCat = "reach";
    else if (k === "t") newCat = "target";
    else if (k === "s") newCat = "safety";
    else if (key === "ArrowLeft") newCat = cat === "safety" ? "target" : cat === "target" ? "reach" : "reach";
    else if (key === "ArrowRight") newCat = cat === "reach" ? "target" : cat === "target" ? "safety" : "safety";
    else if (key === "ArrowUp" || key === "ArrowDown") {
      const list = colleges.filter((c) => c.category === cat);
      const idx = list.findIndex((c) => c.id === id);
      const targetIdx = key === "ArrowUp" ? Math.max(0, idx - 1) : Math.min(list.length - 1, idx + 1);
      if (idx === targetIdx) return;
      const ids = list.map((c) => c.id);
      [ids[idx], ids[targetIdx]] = [ids[targetIdx], ids[idx]];
      setColleges((all) => {
        const others = all.filter((c) => c.category !== cat);
        const reordered = ids.map((cid) => all.find((c) => c.id === cid)!).filter(Boolean);
        return [...others, ...reordered];
      });
      setAnnouncement(`Moved ${card.collegeName} ${key === "ArrowUp" ? "up" : "down"} within ${cat}.`);
      return;
    }
    if (newCat && newCat !== cat) {
      handleCategoryChange(id, newCat);
      setAnnouncement(`Moved ${card.collegeName} to ${newCat}.`);
    }
  }

  async function handleCategoryChange(id: string, newCategory: "reach" | "target" | "safety") {
    const target = colleges.find((c) => c.id === id);
    if (!target || target.category === newCategory) return;
    const prev = colleges;
    // Optimistic update
    setColleges((cs) => cs.map((c) => (c.id === id ? { ...c, category: newCategory } : c)));
    try {
      const res = await fetch(`/api/colleges/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory }),
      });
      if (!res.ok) setColleges(prev);
    } catch {
      setColleges(prev);
    }
  }

  async function handleDelete(id: string) {
    // Confirm before deleting — accidental clicks on the trash button
    // previously vanished a college with no undo.
    const target = colleges.find((c) => c.id === id);
    if (target && typeof window !== "undefined") {
      const ok = window.confirm(`Remove "${target.collegeName}" from your list?`);
      if (!ok) return;
    }
    const prev = colleges;
    setColleges((c) => c.filter((col) => col.id !== id));
    try {
      const res = await fetch(`/api/colleges/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setColleges(prev);
        toast.error("Couldn't remove that college. Please try again.");
        return;
      }
      if (target) toast.success(`Removed ${target.collegeName} from your list.`);
    } catch {
      setColleges(prev);
      toast.error("Network error. Please check your connection.");
    }
  }

  const grouped = {
    reach: colleges.filter((c) => c.category === "reach"),
    target: colleges.filter((c) => c.category === "target"),
    safety: colleges.filter((c) => c.category === "safety"),
  };

  const totalColleges = colleges.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <AppNav />
      {/* Page action bar */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" style={{ color: "#4A6FA5" }} />
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
            >
              College List
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {totalColleges > 0 && (
              <span className="badge-muted text-[11px]">{totalColleges} schools</span>
            )}
            {totalColleges > 0 && (
              <Link
                href="/tracker"
                className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 hover:border-[rgba(74,111,165,0.25)] hover:shadow-sm"
                style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)", background: "rgba(255,255,255,0.45)" }}
              >
                <ClipboardList className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                Track applications
              </Link>
            )}
            <button
              onClick={() => setShowForm((v) => !v)}
              className="dl-btn dl-btn-primary py-2 px-4 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add college
            </button>
          </div>
        </div>
      </div>

{/* Add form panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b"
            style={{
              backgroundColor: "rgba(74,111,165,0.08)",
              borderColor: "rgba(74,111,165,0.2)",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="label">College name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Harvard University"
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdd();
                      if (e.key === "Escape") setShowForm(false);
                    }}
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    {COLUMNS.map((col) => (
                      <button
                        key={col.key}
                        onClick={() => setCategory(col.key)}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold transition-all duration-150"
                        style={
                          category === col.key
                            ? { backgroundColor: col.color, color: "white" }
                            : { backgroundColor: "rgba(255,255,255,0.45)", color: "var(--dl-text-secondary, #454B5E)" }
                        }
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={adding || !name.trim()}
                    className="dl-btn dl-btn-primary px-6 py-2.5 text-sm disabled:opacity-60"
                  >
                    {adding ? "Adding…" : "Add"}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setAddError(null); }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.45)", color: "var(--dl-text-muted, #5A6275)" }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {addError && (
                <p className="mt-3 text-sm" style={{ color: "var(--error)" }}>
                  {addError}{" "}
                  {addError.includes("Upgrade") && (
                    <Link href="/billing" className="font-bold underline">
                      Upgrade →
                    </Link>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <main id="main" className="mx-auto max-w-7xl px-4 py-10">
        <ResumeQuickImport context="colleges" />
        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.key} className="space-y-3">
                <div className="h-8 w-24 rounded-xl animate-shimmer" />
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 w-full rounded-2xl animate-shimmer" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {COLUMNS.map((col) => {
              const Icon = col.icon;
              const items = grouped[col.key];
              const isDropTarget = dragOverColumn === col.key;
              return (
                <div
                  key={col.key}
                  role="region"
                  aria-labelledby={`col-heading-${col.key}`}
                  className="flex flex-col gap-4 rounded-3xl transition-all"
                  style={{
                    outline: isDropTarget ? `2px dashed ${col.color}` : "2px dashed transparent",
                    outlineOffset: 4,
                    backgroundColor: isDropTarget ? col.lightBg : undefined,
                  }}
                  onDragOver={(e) => {
                    if (!draggingId) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverColumn !== col.key) setDragOverColumn(col.key);
                  }}
                  onDragLeave={(e) => {
                    // Only clear if leaving the column container itself
                    if (e.currentTarget === e.target) setDragOverColumn(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    setDragOverColumn(null);
                    if (id) handleCategoryChange(id, col.key);
                  }}
                >
                  {/* Column header */}
                  <div
                    className="flex items-center justify-between rounded-2xl border px-4 py-3"
                    style={{
                      backgroundColor: col.lightBg,
                      borderColor: col.borderColor,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                        style={{ backgroundColor: col.badgeBg }}
                      >
                        <Icon className="h-4 w-4" style={{ color: col.color }} />
                      </div>
                      <div>
                        <p id={`col-heading-${col.key}`} className="text-sm font-bold" style={{ color: col.color }}>
                          {col.label}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                          {col.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: col.badgeBg, color: col.color }}
                    >
                      {items.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {items.map((c) => (
                        <CollegeCard
                          key={c.id}
                          college={c}
                          color={col.color}
                          onDelete={handleDelete}
                          onDragStart={(id) => setDraggingId(id)}
                          onDragEnd={() => { setDraggingId(null); setDragOverColumn(null); }}
                          isDragging={draggingId === c.id}
                          onKeyboardMove={handleKeyboardMove}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Empty state */}
                  {items.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex min-h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed"
                      style={{ borderColor: col.borderColor }}
                    >
                      <Icon className="mb-2 h-6 w-6 opacity-30" style={{ color: col.color }} />
                      <p className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        No {col.label.toLowerCase()} schools yet
                      </p>
                      <button
                        onClick={() => { setCategory(col.key); setShowForm(true); }}
                        className="mt-2 text-xs font-medium transition-colors"
                        style={{ color: col.color }}
                      >
                        + Add one
                      </button>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty overall state */}
        {!loading && colleges.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl border-2 border-dashed py-16 text-center"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div
              className="mx-auto mb-4 flex items-center justify-center"
              style={{ color: "#4A6FA5" }}
            >
              <EmptyColleges size={120} />
            </div>
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
            >
              Build your college list
            </h3>
            <p className="mt-2 text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Add schools to reach, target, and safety columns. Aim for 3–5 per category.
            </p>
            <button onClick={() => setShowForm(true)} className="dl-btn dl-btn-primary mt-6 px-8 py-3">
              <Plus className="h-4 w-4" />
              Add your first school
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
