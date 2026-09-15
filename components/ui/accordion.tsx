"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type AccordionItem = { id: string; title: string; content: React.ReactNode };

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

const TRANSITION = { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] };

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className="rounded-[14px] dl-card-hover overflow-hidden transition-shadow duration-200"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              borderLeft: isOpen ? "3px solid #4A6FA5" : "3px solid transparent",
            }}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: isOpen ? "#4A6FA5" : "#1B2030" }}
              >
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={TRANSITION}
                className="shrink-0 ml-3"
              >
                <ChevronDown
                  className="h-4 w-4"
                  style={{ color: isOpen ? "#4A6FA5" : "#8890A5" }}
                />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={TRANSITION}
                  className="overflow-hidden"
                >
                  <div
                    className="px-5 pb-4 text-sm leading-relaxed"
                    style={{ color: "#454B5E" }}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
