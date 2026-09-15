"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, type LucideIcon } from "lucide-react";

export interface DashboardTool {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  done: boolean;
  proOnly?: boolean;
}

interface DashboardToolsGridProps {
  tools: DashboardTool[];
  effectivePlan: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/**
 * Client wrapper for the dashboard "Tools" grid. Adds a scroll-triggered
 * stagger entrance (60ms per child) without changing layout. Honors
 * prefers-reduced-motion via framer-motion's built-in handling.
 */
export function DashboardToolsGrid({ tools, effectivePlan }: DashboardToolsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={containerVariants}
      role="list"
      aria-label="Dashboard tools"
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isLocked = tool.proOnly && effectivePlan !== "pro";
        return (
          <motion.div key={tool.href} variants={itemVariants} role="listitem">
            <Link
              href={isLocked ? "/billing" : tool.href}
              className="group relative flex flex-col gap-5 rounded-2xl border p-6 transition-[border-color] duration-200 hover:border-[color:var(--dl-text-muted,#5A6275)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] focus-visible:ring-offset-2"
              style={{ background: "rgba(255,255,255,0.45)", borderColor: "rgba(0,0,0,0.06)" }}
              aria-label={`${tool.label}${isLocked ? " (Pro only -- upgrade to use)" : tool.done ? " (completed)" : ""}`}
            >
              {isLocked && (
                <span
                  className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: "#4A6FA5",
                    background: "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  Pro
                </span>
              )}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 group-hover:bg-[var(--color-primary-light)]"
                style={{ background: "rgba(255,255,255,0.45)" }}
              >
                <Icon
                  className="h-5 w-5 transition-colors duration-200 group-hover:text-[color:#4A6FA5]"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  strokeWidth={1.75}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="text-[16px] leading-tight"
                    style={{
                      color: "var(--dl-text-primary, #1B2030)",
                      fontFamily: "var(--font-instrument-sans)",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {tool.label}
                  </p>
                  {tool.done && (
                    <CheckCircle2
                      className="h-4 w-4 shrink-0"
                      style={{ color: "var(--color-success, #16A34A)" }}
                    />
                  )}
                </div>
                <p
                  className="mt-1.5 text-[13.5px] leading-relaxed"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[12px] font-medium" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                <span className="transition-colors group-hover:text-[color:#4A6FA5]">
                  {isLocked ? "Upgrade to use" : tool.done ? "Open" : "Get started"}
                </span>
                <ArrowRight className="h-3 w-3 transition-all group-hover:translate-x-0.5 group-hover:text-[color:#4A6FA5]" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
