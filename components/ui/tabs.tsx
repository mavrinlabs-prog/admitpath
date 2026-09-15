"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = { id: string; label: string; icon?: React.ReactNode };

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  children: (activeTab: string) => React.ReactNode;
}

const TRANSITION = { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] };

export function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div
        className="inline-flex gap-1 p-1 rounded-[14px]"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleChange(tab.id)}
              className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-[10px] transition-colors duration-200"
              style={{
                color: isActive ? "#4A6FA5" : "#454B5E",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-[10px]"
                  style={{
                    background: "rgba(74,111,165,0.08)",
                    border: "1px solid rgba(74,111,165,0.15)",
                  }}
                  transition={TRANSITION}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={TRANSITION}
        >
          {children(active)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
