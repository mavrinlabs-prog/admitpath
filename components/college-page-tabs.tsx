"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

export function CollegePageTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Full ARIA keyboard navigation per WAI-ARIA Tabs pattern:
  // Arrow Left/Right cycles tabs, Home/End jump to first/last.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIdx = tabs.findIndex((t) => t.id === active);
      let nextIdx: number | null = null;

      switch (e.key) {
        case "ArrowRight":
          nextIdx = (currentIdx + 1) % tabs.length;
          break;
        case "ArrowLeft":
          nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          nextIdx = 0;
          break;
        case "End":
          nextIdx = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      const nextTab = tabs[nextIdx];
      if (nextTab) {
        setActive(nextTab.id);
        tabRefs.current.get(nextTab.id)?.focus();
      }
    },
    [active, tabs]
  );

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex gap-1 overflow-x-auto mb-8 rounded-xl border p-1"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(0,0,0,0.06)",
        }}
        role="tablist"
        aria-label="College information tabs"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                if (el) tabRefs.current.set(t.id, el);
              }}
              id={`tab-${t.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.id)}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] focus-visible:ring-offset-1"
              style={{
                color: isActive ? "#FFFFFF" : "var(--dl-text-secondary, #454B5E)",
                background: isActive ? "#4A6FA5" : "transparent",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          tabIndex={0}
        >
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  );
}
