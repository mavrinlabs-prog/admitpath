"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// UserButton removed — using Google OAuth
import {
  LayoutGrid,
  BarChart3,
  PenLine,
  GraduationCap,
  MessageCircle,
  CreditCard,
  Menu,
  X,
  BookOpen,
  Newspaper,
  Settings,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FreeLimitBanner, PlanUsageChip } from "@/components/trial-banner";
import { LogoMark } from "@/components/admitpath-logo";
import { Search } from "lucide-react";
// User avatar button (sign-out removed — permanent session)
function SafeUserButton(_props: Record<string, unknown>) {
  void _props;
  return (
    <a
      href="/settings"
      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ background: "var(--dl-brand, #4A6FA5)" }}
      title="Settings"
      aria-label="Settings"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </a>
  );
}

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/analyze", label: "Analyze", icon: BarChart3 },
  { href: "/essays", label: "Essays", icon: PenLine },
  { href: "/colleges", label: "Colleges", icon: GraduationCap },
  { href: "/chat", label: "Counselor", icon: MessageCircle },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
] as const;

/* Discovery Labs transition */
const DL_TRANSITION = "200ms cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * Sidebar navigation for all in-app routes.
 * Uses Discovery Labs design tokens throughout.
 *
 * Active item = brand-color text with left accent border.
 * Inactive  = secondary text with subtle hover.
 */
export function AppNav() {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      // Browser platform is unavailable during server rendering.
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
    }
  }, []);

  // Close mobile nav and restore focus (UX: user control & freedom)
  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
    requestAnimationFrame(() => {
      mobileToggleRef.current?.focus();
    });
  }, []);

  // Close on Escape key in mobile nav
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileNav();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobileNav]);

  const openPalette = () => {
    const evt = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    window.dispatchEvent(evt);
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="no-print hidden md:flex flex-col fixed top-0 left-0 h-screen z-40"
        style={{
          width: 240,
          background: "rgba(255, 255, 255, 0.60)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRight: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Logo area */}
        <div
          className="flex items-center gap-2.5 px-5 py-5"
          style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5"
            style={{ transition: `opacity ${DL_TRANSITION}` }}
          >
            <LogoMark size={28} />

            <span
              className="text-[15px] font-bold tracking-tight"
              style={{
                color: "#1B2030",
              }}
            >
              AdmitPath
            </span>
          </Link>
        </div>

        {/* Search / command palette */}
        <div className="px-3 pt-4 pb-2">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open command palette"
            className="flex w-full items-center gap-2 px-3 py-2 text-[13px]"
            style={{
              color: "#5A6275",
              background: "rgba(255, 255, 255, 0.45)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: 10,
              transition: `background ${DL_TRANSITION}`,
              boxShadow: "rgba(0,0,0,0.03) 0px 1px 3px, rgba(0,0,0,0.02) 0px 1px 2px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(74,111,165,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.45)"; }}
          >
            <Search className="h-[14px] w-[14px]" style={{ color: "#5A6275" }} />
            <span>Search</span>
            <kbd
              className="ml-auto text-[10px] font-semibold px-1.5 py-0.5"
              style={{
                color: "#5A6275",
                background: "rgba(255, 255, 255, 0.45)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: 6,
              }}
            >
              {isMac ? "⌘K" : "^K"}
            </kbd>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="App navigation">
          <div className="flex flex-col gap-0.5">
            {tabs.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="group flex items-center gap-2.5 px-3 py-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]/40 focus-visible:ring-offset-1"
                  style={{
                    fontSize: 14,
                    borderRadius: 8,
                    color: active ? "#1B2030" : "#5A6275",
                    background: active ? "rgba(74,111,165,0.06)" : "transparent",
                    borderLeft: active ? "2.5px solid #4A6FA5" : "2.5px solid transparent",
                    transition: `all ${DL_TRANSITION}`,
                    fontWeight: active ? 600 : 450,
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(74,111,165,0.08)";
                      e.currentTarget.style.color = "#1B2030";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#454B5E";
                    }
                  }}
                >
                  <Icon
                    className="transition-transform"
                    style={{
                      width: 18,
                      height: 18,
                      color: "inherit",
                      transitionDuration: "200ms",
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    strokeWidth={2}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom: plan usage chip + user */}
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ borderTop: "1px solid rgba(0, 0, 0, 0.06)" }}
        >
          <SafeUserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "h-8 w-8" } }}
          />
          <PlanUsageChip />
        </div>
      </aside>

      {/* Desktop: offset page content past the fixed sidebar */}
      <style>{`@media (min-width: 768px) { body { padding-left: 240px; } }`}</style>

      {/* ── Mobile top bar ── */}
      <div
        className="no-print md:hidden sticky top-0 z-40"
        style={{
          background: "rgba(255, 255, 255, 0.60)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LogoMark size={24} />
            <span
              className="text-sm font-bold"
              style={{
                color: "#1B2030",
              }}
            >
              AdmitPath
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <PlanUsageChip />
            <SafeUserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "h-7 w-7" } }}
            />
            <button
              ref={mobileToggleRef}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center"
              style={{
                color: "#1B2030",
                borderRadius: 10,
                transition: `background ${DL_TRANSITION}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(74,111,165,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Menu
                  className="h-5 w-5 absolute"
                  style={{
                    opacity: mobileOpen ? 0 : 1,
                    transform: mobileOpen ? "rotate(90deg) scale(0.5)" : "rotate(0) scale(1)",
                    transition: `all ${DL_TRANSITION}`,
                  }}
                />
                <X
                  className="h-5 w-5 absolute"
                  style={{
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.5)",
                    transition: `all ${DL_TRANSITION}`,
                  }}
                />
              </span>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.60)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div className="px-3 pb-3 pt-1 grid grid-cols-3 gap-2">
                {tabs.map(({ href, label, icon: Icon }, i) => {
                  const active =
                    pathname === href || pathname.startsWith(href + "/");
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                    >
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        onClick={closeMobileNav}
                        className="group flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]/40"
                        style={{
                          borderRadius: 8,
                          color: active ? "#1B2030" : "#5A6275",
                          background: active
                            ? "rgba(74,111,165,0.06)"
                            : "rgba(255, 255, 255, 0.35)",
                          border: active
                            ? "1px solid rgba(74,111,165,0.15)"
                            : "1px solid rgba(0, 0, 0, 0.04)",
                          transition: `all ${DL_TRANSITION}`,
                          boxShadow: "none",
                          fontWeight: active ? 600 : 450,
                        }}
                      >
                        <Icon
                          style={{
                            width: 18,
                            height: 18,
                            color: "inherit",
                            transition: `transform ${DL_TRANSITION}`,
                          }}
                          strokeWidth={2}
                        />
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FreeLimitBanner />
    </>
  );
}
