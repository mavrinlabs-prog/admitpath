"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Minus, GitCompare } from "lucide-react";

type DiffOp = { type: "equal" | "insert" | "delete"; text: string };
type DiffSummary = {
  wordsAdded: number;
  wordsRemoved: number;
  wordsKept: number;
  similarity: number;
};
type DiffPayload = {
  from: number;
  to: number;
  ops: DiffOp[];
  summary: DiffSummary;
  scoreDelta: number | null;
};

/**
 * Essay version history + side-by-side diff. Loads the version list
 * (lightweight — id, version, score, wordCount, createdAt only), then
 * lazy-loads two full versions when the user picks them.
 *
 * Default selection: most-recent two versions (or just the latest if only
 * one exists). The score-delta line uses up/down/neutral arrows so the
 * change between drafts is the first thing the eye lands on.
 */

type VersionMeta = {
  id: string;
  version: number;
  score: number | null;
  wordCount: number | null;
  createdAt: string;
};

type VersionDetail = VersionMeta & {
  content: string;
  feedback: unknown;
};

type EssayMeta = {
  id: string;
  prompt: string;
  college: string | null;
  version: number;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ScoreDelta({ from, to }: { from: number | null; to: number | null }) {
  if (from == null || to == null) {
    return <span className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>No score delta</span>;
  }
  const diff = to - from;
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus;
  const color = diff > 0 ? "var(--success)" : diff < 0 ? "var(--error)" : "var(--dl-text-muted, #5A6275)";
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color }}>
      <Icon className="h-3 w-3" />
      {diff > 0 ? "+" : ""}{diff.toFixed(0)} pts
    </span>
  );
}

export default function EssayVersionsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [meta, setMeta] = useState<EssayMeta | null>(null);
  const [versions, setVersions] = useState<VersionMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leftId, setLeftId] = useState<number | null>(null);
  const [rightId, setRightId] = useState<number | null>(null);
  const [leftDetail, setLeftDetail] = useState<VersionDetail | null>(null);
  const [rightDetail, setRightDetail] = useState<VersionDetail | null>(null);
  const [diff, setDiff] = useState<DiffPayload | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/essay/${id}/versions`)
      .then(async (r) => {
        if (!r.ok) throw new Error(r.status === 404 ? "Essay not found" : "Failed to load versions");
        return r.json();
      })
      .then((data: { essay: EssayMeta; versions: VersionMeta[] }) => {
        if (!mounted) return;
        setMeta(data.essay);
        setVersions(data.versions);
        // Default to most-recent two (or latest one if only one exists).
        if (data.versions.length >= 2) {
          setLeftId(data.versions[1].version);
          setRightId(data.versions[0].version);
        } else if (data.versions.length === 1) {
          setRightId(data.versions[0].version);
        }
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(String(e.message || e));
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);
  const [loadingDiff, setLoadingDiff] = useState(false);

  // Detail-fetch when either pane's selection changes. Pre-loaded versions
  // are not cached client-side; the API layer is fast enough that re-fetch
  // on toggle keeps the code simple.
  useEffect(() => {
    if (leftId == null) {
      setLeftDetail(null);
      return;
    }
    let mounted = true;
    setLoadingLeft(true);
    fetch(`/api/essay/${id}/versions/${leftId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (mounted) setLeftDetail(d); })
      .catch(() => { if (mounted) setLeftDetail(null); })
      .finally(() => { if (mounted) setLoadingLeft(false); });
    return () => { mounted = false; };
  }, [id, leftId]);

  useEffect(() => {
    if (rightId == null) {
      setRightDetail(null);
      return;
    }
    let mounted = true;
    setLoadingRight(true);
    fetch(`/api/essay/${id}/versions/${rightId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (mounted) setRightDetail(d); })
      .catch(() => { if (mounted) setRightDetail(null); })
      .finally(() => { if (mounted) setLoadingRight(false); });
    return () => { mounted = false; };
  }, [id, rightId]);

  // Word-level diff: fetched whenever both versions are picked and they
  // differ. The dedicated /diff endpoint is cheaper than diffing in the
  // browser because the LCS table can blow up for long essays.
  useEffect(() => {
    if (leftId == null || rightId == null || leftId === rightId) {
      setDiff(null);
      return;
    }
    let mounted = true;
    setLoadingDiff(true);
    fetch(`/api/essay/${id}/diff?from=${leftId}&to=${rightId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: DiffPayload | null) => { if (mounted) setDiff(d); })
      .catch(() => { if (mounted) setDiff(null); })
      .finally(() => { if (mounted) setLoadingDiff(false); });
    return () => { mounted = false; };
  }, [id, leftId, rightId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        <p style={{ color: "var(--dl-text-muted, #5A6275)" }}>Loading version history…</p>
      </div>
    );
  }

  if (error || !meta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>{error ?? "Couldn't load this essay."}</p>
        <Link href="/essays" className="btn-secondary text-sm">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to essays
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <div className="border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/essays"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            All essays
          </Link>
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Version history · {versions.length} draft{versions.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#4A6FA5" }}>
            {meta.college ?? "Common App"}
          </p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}>
            Compare drafts side-by-side
          </h1>
          <p className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Prompt: {meta.prompt}
          </p>
        </div>

        {/* Score delta + version pickers */}
        {leftDetail && rightDetail && (
          <div
            className="dl-card-hover mb-6 p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-3"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <div className="text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              <span className="font-mono">v{leftDetail.version}</span>
              {leftDetail.score != null && <span> · {leftDetail.score.toFixed(0)}/100</span>}
              <span className="mx-2">→</span>
              <span className="font-mono">v{rightDetail.version}</span>
              {rightDetail.score != null && <span> · {rightDetail.score.toFixed(0)}/100</span>}
            </div>
            <ScoreDelta from={leftDetail.score} to={rightDetail.score} />
          </div>
        )}

        {/* Word-level diff strip */}
        {loadingDiff && leftId != null && rightId != null && leftId !== rightId && (
          <div
            className="dl-card-hover mb-6 rounded-2xl border p-5 text-center"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <p className="text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Computing word-level diff...
            </p>
          </div>
        )}
        {!loadingDiff && diff && diff.ops.length > 0 && (
          <div
            className="dl-card-hover mb-6 rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
          >
            <div
              className="px-5 py-3 border-b flex items-center justify-between flex-wrap gap-3"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" style={{ color: "#4A6FA5" }} />
                <p
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "#4A6FA5" }}
                >
                  Word-level changes
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                <span style={{ color: "#047857" }}>+{diff.summary.wordsAdded}</span>
                <span style={{ color: "#B91C1C" }}>−{diff.summary.wordsRemoved}</span>
                <span>· {(diff.summary.similarity * 100).toFixed(0)}% similar</span>
              </div>
            </div>
            <div className="p-5 max-h-[40vh] overflow-y-auto">
              <p
                className="whitespace-pre-wrap"
                style={{
                  color: "var(--dl-text-primary, #1B2030)",
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontSize: "15px",
                  lineHeight: "1.8",
                }}
              >
                {diff.ops.map((op, i) => {
                  if (op.type === "equal") return <span key={i}>{op.text}</span>;
                  if (op.type === "insert")
                    return (
                      <span
                        key={i}
                        style={{
                          background: "rgba(4,120,87,0.15)",
                          color: "#047857",
                          textDecoration: "none",
                          padding: "1px 2px",
                          borderRadius: "3px",
                          fontWeight: 500,
                        }}
                      >
                        {op.text}
                      </span>
                    );
                  return (
                    <span
                      key={i}
                      style={{
                        background: "rgba(185,28,28,0.10)",
                        color: "#B91C1C",
                        textDecoration: "line-through",
                        padding: "1px 2px",
                        borderRadius: "3px",
                        opacity: 0.75,
                      }}
                    >
                      {op.text}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {/* LEFT pane */}
          <VersionPane
            label="Older draft"
            versions={versions}
            selected={leftId}
            onChange={setLeftId}
            detail={leftDetail}
            loading={loadingLeft}
          />
          {/* RIGHT pane */}
          <VersionPane
            label="Newer draft"
            versions={versions}
            selected={rightId}
            onChange={setRightId}
            detail={rightDetail}
            loading={loadingRight}
          />
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/essays?id=${id}`}
            className="text-sm font-medium underline-animate"
            style={{ color: "#4A6FA5" }}
          >
            Open this essay in the editor →
          </Link>
        </div>
      </div>
    </div>
  );
}

function VersionPane({
  label,
  versions,
  selected,
  onChange,
  detail,
  loading,
}: {
  label: string;
  versions: VersionMeta[];
  selected: number | null;
  onChange: (v: number | null) => void;
  detail: VersionDetail | null;
  loading?: boolean;
}) {
  return (
    <div
      className="dl-card-hover rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)" }}
    >
      <div className="px-5 py-3 border-b flex items-center justify-between gap-3" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            {label}
          </p>
          {detail && (
            <p className="text-xs mt-0.5" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              {formatDate(detail.createdAt)} · {detail.wordCount ?? "—"} words
            </p>
          )}
        </div>
        <select
          value={selected ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : parseInt(v, 10));
          }}
          className="select-field text-xs"
          aria-label={`Select ${label.toLowerCase()}`}
          style={{ minWidth: 110 }}
        >
          <option value="">—</option>
          {versions.map((v) => (
            <option key={v.id} value={v.version}>
              v{v.version}{v.score != null ? ` · ${v.score.toFixed(0)}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="p-5 max-h-[60vh] overflow-y-auto">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Loading draft...
            </p>
          </div>
        ) : detail ? (
          <pre
            className="whitespace-pre-wrap"
            style={{
              color: "var(--dl-text-primary, #1B2030)",
              fontFamily: "var(--font-lora), Georgia, serif",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          >
            {detail.content}
          </pre>
        ) : (
          <p className="text-sm text-center py-12" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Pick a version above
          </p>
        )}
      </div>
    </div>
  );
}
