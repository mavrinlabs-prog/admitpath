"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PopoverPosition = "top" | "bottom" | "left" | "right";
type PopoverAlign = "start" | "center" | "end";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: PopoverPosition;
  align?: PopoverAlign;
}

const ARROW_SIZE = 6;
const GAP = 8;

function getTransformOrigin(position: PopoverPosition, align: PopoverAlign): string {
  const alignMap: Record<PopoverAlign, string> = { start: "left", center: "center", end: "right" };
  const vAlign = alignMap[align];
  switch (position) {
    case "top":    return `${vAlign} bottom`;
    case "bottom": return `${vAlign} top`;
    case "left":   return `right ${align === "start" ? "top" : align === "end" ? "bottom" : "center"}`;
    case "right":  return `left ${align === "start" ? "top" : align === "end" ? "bottom" : "center"}`;
  }
}

function getArrowStyle(position: PopoverPosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
  };
  const color = "rgba(255,255,255,0.72)";
  const transparent = "transparent";
  const sz = ARROW_SIZE;

  switch (position) {
    case "bottom":
      return { ...base, top: -sz, left: "50%", transform: "translateX(-50%)",
        borderWidth: `0 ${sz}px ${sz}px ${sz}px`, borderColor: `${transparent} ${transparent} ${color} ${transparent}` };
    case "top":
      return { ...base, bottom: -sz, left: "50%", transform: "translateX(-50%)",
        borderWidth: `${sz}px ${sz}px 0 ${sz}px`, borderColor: `${color} ${transparent} ${transparent} ${transparent}` };
    case "right":
      return { ...base, left: -sz, top: "50%", transform: "translateY(-50%)",
        borderWidth: `${sz}px ${sz}px ${sz}px 0`, borderColor: `${transparent} ${color} ${transparent} ${transparent}` };
    case "left":
      return { ...base, right: -sz, top: "50%", transform: "translateY(-50%)",
        borderWidth: `${sz}px 0 ${sz}px ${sz}px`, borderColor: `${transparent} ${transparent} ${transparent} ${color}` };
  }
}

export function Popover({ trigger, children, position = "bottom", align = "center" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [adjustedPos, setAdjustedPos] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        contentRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Auto-adjust position if overflowing
  useEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    let pos = position;

    if (position === "bottom" && triggerRect.bottom + contentRect.height + GAP > window.innerHeight) {
      pos = "top";
    } else if (position === "top" && triggerRect.top - contentRect.height - GAP < 0) {
      pos = "bottom";
    } else if (position === "right" && triggerRect.right + contentRect.width + GAP > window.innerWidth) {
      pos = "left";
    } else if (position === "left" && triggerRect.left - contentRect.width - GAP < 0) {
      pos = "right";
    }
    setAdjustedPos(pos);
  }, [open, position]);

  // Position styles
  const positionStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = { position: "absolute", zIndex: 50 };
    const offset = GAP + ARROW_SIZE;

    switch (adjustedPos) {
      case "bottom": styles.top = `calc(100% + ${offset}px)`; break;
      case "top":    styles.bottom = `calc(100% + ${offset}px)`; break;
      case "right":  styles.left = `calc(100% + ${offset}px)`; break;
      case "left":   styles.right = `calc(100% + ${offset}px)`; break;
    }

    if (adjustedPos === "top" || adjustedPos === "bottom") {
      switch (align) {
        case "start":  styles.left = 0; break;
        case "center": styles.left = "50%"; styles.transform = "translateX(-50%)"; break;
        case "end":    styles.right = 0; break;
      }
    } else {
      switch (align) {
        case "start":  styles.top = 0; break;
        case "center": styles.top = "50%"; styles.transform = "translateY(-50%)"; break;
        case "end":    styles.bottom = 0; break;
      }
    }

    return styles;
  };

  return (
    <div ref={triggerRef} className="relative inline-flex" style={{ position: "relative" }}>
      <div onClick={toggle} className="cursor-pointer" role="button" tabIndex={0} aria-expanded={open}>
        {trigger}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              ...positionStyle(),
              transformOrigin: getTransformOrigin(adjustedPos, align),
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
              padding: 12,
              minWidth: 160,
              fontFamily: "var(--font-inter, Inter, sans-serif)",
            }}
          >
            <div style={getArrowStyle(adjustedPos)} />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
