"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";

/**
 * SocialProofToast — periodic feature-highlight notifications.
 *
 * Shows subtle bottom-left toast notifications that surface real product
 * capabilities (scoring rubrics, essay feedback axes, free-plan limits, etc.)
 * to educate visitors and logged-in users.
 *
 * - Rotates every 30 seconds
 * - Auto-dismisses after 5 seconds
 * - Respects prefers-reduced-motion (no auto-rotation)
 * - Landing variant: product feature highlights
 * - Dashboard variant: tips for logged-in users
 *
 * No fake user names, fabricated activity counts, or synthetic social proof.
 */

interface Notification {
  id: number;
  type: "score" | "active";
  text: string;
  subtext?: string;
}

// Feature highlight notifications — no fake user data or fabricated activity.
// These surface real product capabilities to educate visitors.
const FEATURE_NOTIFICATIONS: Omit<Notification, "id">[] = [
  { type: "score", text: "7-dimension scoring covers academics, leadership, awards, depth, spike, essays, and recs", subtext: "Calibrated to CDS data" },
  { type: "score", text: "Essay feedback scores your draft across 6 rubrics with line-level suggestions", subtext: "Authenticity, insight, specificity, storytelling, impact, voice" },
  { type: "active", text: "Free plan includes 5 profile analyses, 5 essay reviews, and 5 chat messages" },
  { type: "score", text: "Your spike score measures depth, trajectory, and tangible production in one area", subtext: "The hardest dimension to score well on" },
  { type: "active", text: "College list builder uses 4-band probability: Very Likely, Possible, Long Shot, Hail Mary" },
  { type: "score", text: "Action plans are 30/60/90-day roadmaps built from your specific gaps", subtext: "Not generic advice" },
  { type: "active", text: "All scoring is calibrated against CDS Section C7 admissions-factor weights" },
  { type: "score", text: "The Why-Us essay coach detects 27 generic phrases and counts school-specific signals", subtext: "Named courses, professors, traditions" },
];

// Dashboard feature tips for logged-in users — no fake friend data.
const DASHBOARD_NOTIFICATIONS: Omit<Notification, "id">[] = [
  { type: "score", text: "Re-running your analysis after profile changes shows your score trajectory over time" },
  { type: "active", text: "The essay version control lets you compare scores across drafts" },
  { type: "score", text: "Your weakest dimension is usually the highest-ROI area to improve", subtext: "Check your gap analysis" },
  { type: "active", text: "Add schools to your list to see per-school odds based on your profile" },
  { type: "score", text: "The What-If Modeler shows how GPA or SAT changes shift your admission bands", subtext: "Try it from the dashboard" },
  { type: "active", text: "Interview prep gives AI feedback on clarity, specificity, and authenticity" },
];

interface SocialProofToastProps {
  /** "landing" shows score/active notifications; "dashboard" adds friend-score notifications */
  variant?: "landing" | "dashboard";
}

export function SocialProofToast({ variant = "landing" }: SocialProofToastProps = {}) {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [index, setIndex] = useState(0);

  // Shuffle order on mount for variety
  const [shuffled] = useState(() => {
    const all: Omit<Notification, "id">[] = [];

    if (variant === "dashboard") {
      all.push(...DASHBOARD_NOTIFICATIONS);
    } else {
      all.push(...FEATURE_NOTIFICATIONS);
    }

    // Fisher-Yates shuffle for randomness
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  });

  // Single interval-based cycle with proper cleanup. Previous implementation
  // used recursive setTimeout without cleanup refs, causing a memory leak
  // when the component unmounted.
  useEffect(() => {
    // Respect prefers-reduced-motion — skip auto-rotating toasts entirely
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let dismissTimer: ReturnType<typeof setTimeout>;
    let cycleTimer: ReturnType<typeof setTimeout>;
    let localIndex = 0;

    function show() {
      const item = shuffled[localIndex % shuffled.length];
      setCurrent({ ...item, id: Date.now() });

      // Auto-dismiss after 5 seconds
      dismissTimer = setTimeout(() => setCurrent(null), 5000);

      localIndex += 1;
      setIndex(localIndex);

      // Schedule next notification in 30 seconds
      cycleTimer = setTimeout(show, 30000);
    }

    // Initial delay: 8 seconds before first notification
    const initialDelay = setTimeout(show, 8000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(dismissTimer);
      clearTimeout(cycleTimer);
    };
  }, [shuffled]);

  return (
    <div
      className="fixed bottom-5 left-5 z-[50] pointer-events-none"
      style={{ maxWidth: "340px" }}
    >
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5"
            style={{
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderColor: "rgba(0,0,0,0.06)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            {/* Icon */}
            <div
              className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background:
                  current.type === "score"
                    ? "linear-gradient(135deg, var(--dl-brand, #4A6FA5), var(--dl-brand-dark, #2E4A6E))"
                    : "rgba(74,111,165,0.10)",
              }}
            >
              {current.type === "score" ? (
                <TrendingUp
                  className="h-4 w-4"
                  strokeWidth={2}
                  style={{ color: "white" }}
                />
              ) : (
                <Users
                  className="h-4 w-4"
                  strokeWidth={2}
                  style={{ color: "var(--dl-brand, #4A6FA5)" }}
                />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold leading-snug"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {current.text}
              </p>
              {current.subtext && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--dl-text-muted, #5A6275)" }}
                >
                  {current.subtext}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
