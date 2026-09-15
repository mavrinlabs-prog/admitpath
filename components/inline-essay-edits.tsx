"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

type LineEdit = { original: string; suggestion: string; reason: string; direction?: string; severity?: "critical" | "suggestion" | "polish" };

/**
 * Renders the essay content with inline annotations for each line edit.
 * Matches `original` text in the essay body and highlights it with a
 * tooltip-style suggestion popover.
 *
 * Falls back gracefully: if an `original` string doesn't match anything
 * in the content (LLM gave a slightly different quote), the edit is shown
 * in the overflow list at the bottom.
 */
export function InlineEssayEdits({
  content,
  lineEdits,
}: {
  content: string;
  lineEdits: LineEdit[];
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [appliedEdits, setAppliedEdits] = useState<Set<number>>(new Set());

  if (!content || lineEdits.length === 0) return null;

  // Severity-based ordering: critical edits surface first in the overflow list
  const severityOrder = { critical: 0, suggestion: 1, polish: 2 };
  const severityColor = (s?: string) =>
    s === "critical" ? "#DC2626" : s === "polish" ? "#4A6FA5" : "#D97706";
  const severityLabel = (s?: string) =>
    s === "critical" ? "Critical" : s === "polish" ? "Polish" : "Suggestion";

  // Split edits into matched (found in content) and unmatched
  const matched: Array<LineEdit & { startIdx: number }> = [];
  const unmatched: LineEdit[] = [];

  for (const edit of lineEdits) {
    const idx = content.toLowerCase().indexOf(edit.original.toLowerCase());
    if (idx >= 0) {
      matched.push({ ...edit, startIdx: idx });
    } else {
      unmatched.push(edit);
    }
  }

  // Sort matched by position so we can render in order
  matched.sort((a, b) => a.startIdx - b.startIdx);

  // Build annotated content segments
  const segments: Array<{ type: "text" | "highlight"; text: string; edit?: LineEdit; editIdx?: number }> = [];
  let cursor = 0;

  for (let i = 0; i < matched.length; i++) {
    const m = matched[i];
    // Text before this match
    if (m.startIdx > cursor) {
      segments.push({ type: "text", text: content.slice(cursor, m.startIdx) });
    }
    // The highlighted segment
    const endIdx = m.startIdx + m.original.length;
    segments.push({
      type: "highlight",
      text: content.slice(m.startIdx, endIdx),
      edit: m,
      editIdx: i,
    });
    cursor = endIdx;
  }
  // Remaining text
  if (cursor < content.length) {
    segments.push({ type: "text", text: content.slice(cursor) });
  }

  const totalEdits = matched.length + unmatched.length;
  const reviewedCount = appliedEdits.size;

  return (
    <div className="space-y-4" role="region" aria-label="Inline essay edit suggestions">
      {/* Annotated essay view */}
      <div className="dl-card-hover card" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" style={{ color: "#4A6FA5" }} aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Your essay with inline suggestions ({matched.length} found)
            </p>
          </div>
          {totalEdits > 0 && (
            <p className="text-[10px] tabular-nums" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {reviewedCount}/{totalEdits} reviewed
            </p>
          )}
        </div>
        <div
          className="whitespace-pre-wrap"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            fontFamily: "var(--font-lora), Georgia, serif",
            fontSize: "15px",
            lineHeight: "1.8",
          }}
        >
          {segments.map((seg, i) => {
            if (seg.type === "text") {
              return <span key={i}>{seg.text}</span>;
            }

            const isExpanded = expandedIdx === seg.editIdx;
            return (
              <span key={i} className="relative inline">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedIdx(isExpanded ? null : (seg.editIdx ?? null))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedIdx(isExpanded ? null : (seg.editIdx ?? null));
                    }
                  }}
                  className="cursor-pointer rounded px-0.5"
                  style={{
                    backgroundColor: isExpanded ? "rgba(74,111,165,0.22)" : "rgba(74,111,165,0.10)",
                    borderBottom: "2px solid #4A6FA5",
                    color: "var(--dl-text-primary, #1B2030)",
                    transition: "background-color 150ms ease, box-shadow 150ms ease",
                    boxShadow: isExpanded ? "0 1px 4px rgba(74,111,165,0.18)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(74,111,165,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(74,111,165,0.10)";
                  }}
                  title="Click to see suggestion"
                >
                  {seg.text}
                </span>
                <AnimatePresence>
                  {isExpanded && seg.edit && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="block mt-1.5 mb-2 rounded-xl border p-4 text-[13px]"
                      style={{
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(8px)",
                        borderColor: "rgba(74,111,165,0.25)",
                        borderLeftWidth: "3px",
                        borderLeftColor: "#4A6FA5",
                        boxShadow: "0 4px 12px rgba(74,111,165,0.08)",
                      }}
                    >
                      <span className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-[12px] font-bold uppercase tracking-wider"
                          style={{ color: "#4A6FA5" }}
                        >
                          Suggested edit
                        </span>
                        {seg.edit.severity && (
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider rounded-full px-1.5 py-0.5"
                            style={{ color: severityColor(seg.edit.severity), background: `${severityColor(seg.edit.severity)}12` }}
                          >
                            {severityLabel(seg.edit.severity)}
                          </span>
                        )}
                      </span>
                      <span
                        className="block font-medium"
                        style={{ color: "var(--dl-text-primary, #1B2030)", fontSize: "14px", lineHeight: "1.6" }}
                      >
                        {seg.edit.suggestion}
                      </span>
                      {seg.edit.direction && (
                        <span
                          className="block mt-2 text-[12.5px] leading-relaxed"
                          style={{
                            color: "var(--dl-text-secondary, #454B5E)",
                            borderTop: "1px solid rgba(0,0,0,0.06)",
                            paddingTop: "8px",
                            marginTop: "8px",
                          }}
                        >
                          {seg.edit.direction}
                        </span>
                      )}
                      <span className="block mt-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        {seg.edit.reason}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            );
          })}
        </div>
      </div>

      {/* Unmatched edits — shown as a fallback list */}
      {unmatched.length > 0 && (
        <div className="dl-card-hover card" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Additional suggestions
          </p>
          <div className="space-y-2">
            {unmatched.map((e, i) => (
              <div
                key={i}
                className="rounded-lg p-3 text-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
              >
                <p className="font-mono text-xs line-through" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  {e.original}
                </p>
                <p className="mt-1 font-mono text-xs font-semibold" style={{ color: "#4A6FA5" }}>
                  {e.suggestion}
                </p>
                {e.direction && (
                  <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {e.direction}
                  </p>
                )}
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  {e.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
