"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// Clerk removed — using Google OAuth
import {
  Search,
  LayoutGrid,
  BarChart3,
  PenLine,
  GraduationCap,
  MessageCircle,
  CreditCard,
  Settings as SettingsIcon,
  Sparkles,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

/**
 * Global ⌘K command palette. Opens with cmd-k or ctrl-k anywhere in the
 * signed-in app. Type to filter, ↑↓ to navigate, ⏎ to execute, esc to close.
 *
 * Items are kept inline so the palette has zero external state — adding a
 * route is a one-line change.
 */
type CmdItem = {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Search;
  group: "Navigate" | "Quick actions" | "Account";
  run: () => void;
  keywords?: string;
};

export function CommandPalette() {
  const router = useRouter();
  // Sign-out disabled — permanent session policy
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (isCmdK) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      // Defer focus so the modal is mounted
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (path: string) => {
      router.push(path);
      close();
    },
    [router, close]
  );

  const items: CmdItem[] = useMemo(
    () => [
      { id: "nav-dashboard", group: "Navigate", label: "Dashboard", icon: LayoutGrid, hint: "Home", run: () => go("/dashboard"), keywords: "home overview" },
      { id: "nav-analyze", group: "Navigate", label: "Analyze profile", icon: BarChart3, hint: "7-dimension scoring", run: () => go("/analyze"), keywords: "score rating" },
      { id: "nav-essays", group: "Navigate", label: "Essays", icon: PenLine, hint: "Essay feedback", run: () => go("/essays"), keywords: "writing personal statement" },
      { id: "nav-chat", group: "Navigate", label: "Counselor chat", icon: MessageCircle, hint: "AI counselor", run: () => go("/chat"), keywords: "ask question advice" },
      { id: "nav-colleges", group: "Navigate", label: "Colleges", icon: GraduationCap, hint: "Reach / target / safety", run: () => go("/colleges"), keywords: "school list university" },
      { id: "nav-billing", group: "Navigate", label: "Billing", icon: CreditCard, hint: "Plan & invoices", run: () => go("/billing"), keywords: "subscription payment cancel" },
      { id: "nav-settings", group: "Navigate", label: "Settings", icon: SettingsIcon, hint: "Account preferences", run: () => go("/settings"), keywords: "profile preferences" },

      { id: "act-new-analysis", group: "Quick actions", label: "Start a new analysis", icon: Sparkles, run: () => go("/analyze"), keywords: "score rate" },
      { id: "act-add-college", group: "Quick actions", label: "Add a college", icon: PlusCircle, run: () => go("/colleges"), keywords: "list reach target safety" },
      { id: "act-submit-essay", group: "Quick actions", label: "Submit an essay for feedback", icon: PenLine, run: () => go("/essays"), keywords: "review" },

      { id: "acc-help", group: "Account", label: "Help & support", icon: HelpCircle, run: () => { window.location.assign("mailto:maestro.committee@gmail.com"); close(); } },
    ],
    [go, close]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      const hay = `${i.label} ${i.hint ?? ""} ${i.keywords ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  // Keep activeIdx in range after filtering
  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(0);
  }, [filtered.length, activeIdx]);

  // Group rendering
  const grouped = useMemo(() => {
    const map = new Map<CmdItem["group"], CmdItem[]>();
    for (const i of filtered) {
      const arr = map.get(i.group) ?? [];
      arr.push(i);
      map.set(i.group, arr);
    }
    return map;
  }, [filtered]);

  // ↑↓ Enter handling
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIdx]?.run();
    }
  };

  // Scroll active into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  let runningIdx = 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]"
      onClick={close}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: "rgba(15,23,42,0.45)" }}
        aria-hidden
      />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border animate-toast-in"
        style={{
          background: "rgba(255,255,255,0.45)",
          borderColor: "rgba(0,0,0,0.06)",
          boxShadow: "0 24px 64px rgba(15,23,42,0.30), 0 8px 16px rgba(15,23,42,0.10)",
        }}
      >
        {/* Search row */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, actions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-60"
            style={{ color: "var(--dl-text-primary, #1B2030)" }}
          />
          <kbd
            className="hidden sm:inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-muted, #5A6275)", background: "rgba(255,255,255,0.45)" }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              No matches for &quot;{query}&quot;
            </div>
          ) : (
            Array.from(grouped.entries()).map(([group, list]) => (
              <div key={group} className="mb-1">
                <p
                  className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  {group}
                </p>
                {list.map((item) => {
                  const idx = runningIdx++;
                  const isActive = idx === activeIdx;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      data-idx={idx}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => item.run()}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.45)" : "transparent",
                      }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, #4A6FA5, #1E3352)"
                            : "rgba(255,255,255,0.45)",
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: isActive ? "#fff" : "var(--dl-text-secondary, #454B5E)" }} strokeWidth={2.25} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-semibold"
                          style={{ color: "var(--dl-text-primary, #1B2030)" }}
                        >
                          {item.label}
                        </p>
                        {item.hint && (
                          <p className="truncate text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                            {item.hint}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <kbd
                          className="hidden sm:inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider"
                          style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-muted, #5A6275)", background: "rgba(255,255,255,0.45)" }}
                        >
                          ↵
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 border-t px-4 py-2.5 text-[11px]"
          style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-muted, #5A6275)" }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border px-1 py-0.5 text-[10px]" style={{ borderColor: "rgba(0,0,0,0.06)" }}>↑</kbd>
              <kbd className="rounded border px-1 py-0.5 text-[10px]" style={{ borderColor: "rgba(0,0,0,0.06)" }}>↓</kbd>
              <span>navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border px-1 py-0.5 text-[10px]" style={{ borderColor: "rgba(0,0,0,0.06)" }}>↵</kbd>
              <span>select</span>
            </span>
          </div>
          <span className="hidden sm:inline">AdmitPath</span>
        </div>
      </div>
    </div>
  );
}
