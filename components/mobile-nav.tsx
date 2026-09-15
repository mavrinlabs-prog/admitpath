"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

/* Discovery Labs transition */
const DL_TRANSITION = "200ms cubic-bezier(0.4, 0, 0.2, 1)";

export function MobileNav({ signedIn = false }: { signedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Return focus to toggle button when menu closes (UX heuristic: user
  // control & freedom -- keyboard users need to know where focus went)
  const handleClose = useCallback(() => {
    setOpen(false);
    // Defer focus return so AnimatePresence exit completes first
    requestAnimationFrame(() => {
      toggleRef.current?.focus();
    });
  }, []);

  // Lock body scroll when open + close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the panel when it opens (WCAG 2.1: focus management)
    requestAnimationFrame(() => {
      const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, handleClose]);

  const navLinkStyle = {
    color: "#1B2030",
    borderRadius: 10,
    transition: `background-color ${DL_TRANSITION}, color ${DL_TRANSITION}`,
  };

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex h-11 w-11 items-center justify-center"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        style={{
          color: "#1B2030",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: 10,
          background: "rgba(255, 255, 255, 0.45)",
          transition: `background ${DL_TRANSITION}`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(74,111,165,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)"; }}
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          <Menu
            className="h-4 w-4 absolute"
            style={{
              opacity: open ? 0 : 1,
              transform: open ? "rotate(90deg) scale(0.5)" : "rotate(0) scale(1)",
              transition: `all ${DL_TRANSITION}`,
            }}
          />
          <X
            className="h-4 w-4 absolute"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.5)",
              transition: `all ${DL_TRANSITION}`,
            }}
          />
        </span>
      </button>
      <AnimatePresence>
      {open && (
        <>
          {/* Click-outside backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-16 z-40"
            style={{ background: "rgba(0, 0, 0, 0.12)", backdropFilter: "blur(4px)" }}
            onClick={handleClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute top-16 left-0 right-0 z-50 px-5 py-5 flex flex-col gap-1"
            style={{
              background: "rgba(255, 255, 255, 0.60)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "rgba(0,0,0,0.03) 0px 1px 3px, rgba(0,0,0,0.02) 0px 1px 2px",
            }}
          >
            {[
              { href: "#how-it-works", label: "How it works" },
              { href: "#parents", label: "For parents" },
              { href: "/for-schools", label: "For schools" },
              { href: "/counselor", label: "For counselors" },
              { href: "/tools", label: "Tools" },
              { href: "/pricing", label: "Pricing" },
              { href: "/blog", label: "Blog" },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  prefetch={false}
                  className="block px-3 py-3 text-base font-medium min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] focus-visible:ring-offset-2"
                  style={navLinkStyle}
                  onClick={(e) => {
                    // For hash links, restore body scroll BEFORE the
                    // browser tries to scroll to the anchor. Without
                    // this, overflow:hidden blocks the anchor scroll.
                    if (item.href.startsWith("#")) {
                      document.body.style.overflow = "";
                    }
                    handleClose();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(74,111,165,0.08)";
                    e.currentTarget.style.color = "#4A6FA5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#1B2030";
                  }}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
              <Link href={signedIn ? "/dashboard" : "/sign-up"} prefetch={false} className="dl-btn dl-btn-primary dl-btn-lg mt-2 w-full justify-center" onClick={() => setOpen(false)}>
                {signedIn ? "Open dashboard" : "Sign up free"} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </div>
  );
}
