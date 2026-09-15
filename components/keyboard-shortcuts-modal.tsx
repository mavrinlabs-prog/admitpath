"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Keyboard shortcuts help modal. Triggered by `?` (see app/layout.tsx
 * ShortcutsProvider). Renders the available shortcuts in a clean two-column
 * layout. Closes on Escape or backdrop click.
 */
export type Shortcut = {
  keys: string[]; // e.g. ["⌘", "K"] or ["G", "D"]
  keysWin?: string[]; // Windows/Linux alternative (e.g. ["Ctrl", "K"])
  label: string;
  group: "Navigate" | "General";
};

/** Detect if user is on macOS for showing correct modifier keys. */
function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform ?? "");
}

export const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], keysWin: ["Ctrl", "K"], label: "Open command palette", group: "General" },
  { keys: ["?"], label: "Show this help", group: "General" },
  { keys: ["Esc"], label: "Close any open modal", group: "General" },
  { keys: ["G", "D"], label: "Go to Dashboard", group: "Navigate" },
  { keys: ["G", "A"], label: "Go to Analyze", group: "Navigate" },
  { keys: ["G", "E"], label: "Go to Essays", group: "Navigate" },
  { keys: ["G", "C"], label: "Go to Colleges", group: "Navigate" },
  { keys: ["G", "S"], label: "Go to Settings", group: "Navigate" },
  { keys: ["G", "P"], label: "Go to Profile", group: "Navigate" },
];

export function KeyboardShortcutsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const mac = isMac();
  const groups: Shortcut["group"][] = ["General", "Navigate"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kbd-shortcuts-title"
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[14vh]"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 backdrop-blur-md animate-modal-backdrop-in"
        style={{ background: "rgba(15,23,42,0.45)" }}
        aria-hidden
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border animate-modal-in"
        style={{
          background: "rgba(255,255,255,0.45)",
          borderColor: "rgba(0,0,0,0.06)",
          boxShadow: "0 24px 64px rgba(15,23,42,0.30), 0 8px 16px rgba(15,23,42,0.10)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-3.5"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <h2
            id="kbd-shortcuts-title"
            className="text-sm font-semibold"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-instrument-sans)" }}
          >
            Keyboard shortcuts
          </h2>
          <button
            autoFocus
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="rounded-lg p-1.5 transition-colors hover:bg-[color:rgba(255,255,255,0.45)]"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          {groups.map((group) => (
            <div key={group} className="mb-4 last:mb-0">
              <p
                className="mb-2 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                {group}
              </p>
              <ul className="grid grid-cols-1 gap-1.5">
                {SHORTCUTS.filter((s) => s.group === group).map((s) => (
                  <li
                    key={s.label}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md px-2 py-1.5"
                  >
                    <span className="text-[13px]" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                      {s.label}
                    </span>
                    <span className="flex items-center gap-1">
                      {((!mac && s.keysWin) ? s.keysWin : s.keys).map((k, i) => (
                        <kbd
                          key={i}
                          className="inline-flex min-w-[22px] items-center justify-center rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            borderColor: "rgba(0,0,0,0.06)",
                            color: "var(--dl-text-secondary, #454B5E)",
                            background: "rgba(255,255,255,0.45)",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="border-t px-5 py-2.5 text-[11px]"
          style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-muted, #5A6275)" }}
        >
          Press{" "}
          <kbd
            className="inline-flex items-center rounded border px-1 py-0.5 text-[10px]"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            Esc
          </kbd>{" "}
          to close.
        </div>
      </div>
    </div>
  );
}
