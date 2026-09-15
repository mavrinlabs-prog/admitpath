"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Copy, Check, GraduationCap } from "lucide-react";

// CSS-based confetti — no external dependencies
// Pieces are memoized so random values stay stable across re-renders.
function confettiValue(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

const CONFETTI_COLORS = ["#4A6FA5", "#2E4A6E", "#047857", "#0369A1", "#D4AF37", "#1E3352"];
const CONFETTI_PIECES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: confettiValue(i * 8 + 1) * 100,
  top: 20 + confettiValue(i * 8 + 2) * 60,
  delay: confettiValue(i * 8 + 3) * 0.5,
  duration: 1.5 + confettiValue(i * 8 + 4) * 2,
  color: CONFETTI_COLORS[
    Math.floor(confettiValue(i * 8 + 5) * CONFETTI_COLORS.length)
  ],
  size: 6 + confettiValue(i * 8 + 6) * 8,
  rotation: confettiValue(i * 8 + 7) * 360,
  xDrift: (confettiValue(i * 8 + 8) - 0.5) * 200,
}));

function Confetti() {
  const prefersReduced = useReducedMotion();

  // Respect prefers-reduced-motion: show confetti as static dots briefly
  if (prefersReduced) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONFETTI_PIECES.slice(0, 12).map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
              borderRadius: 2,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {CONFETTI_PIECES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: 600,
            x: p.xDrift,
            rotate: p.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

export function CelebrationModal({
  schoolName,
  onClose,
}: {
  schoolName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [addToWall, setAddToWall] = useState(true);

  const shareText = `I got into ${schoolName} with AdmitPath!`;
  const shareUrl = "https://admith.vercel.app/admits-wall";
  const fullShareText = `${shareText} Check it out: ${shareUrl}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(fullShareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Congratulations on your acceptance to ${schoolName}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md border overflow-hidden"
          style={{
            borderColor: "rgba(0,0,0,0.06)",
            background: "#fff",
            borderRadius: "20px",
          }}
        >
          <Confetti />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close celebration"
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: "var(--dl-text-muted, #8890A5)" }}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Graduation cap icon */}
            <div
              className="mx-auto mb-4 flex items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                background: "rgba(74,111,165,0.1)",
              }}
            >
              <GraduationCap className="h-8 w-8" style={{ color: "#4A6FA5" }} />
            </div>

            <h2
              className="text-2xl font-extrabold mb-2"
              style={{
                color: "var(--dl-text-primary, #1B2030)",
                letterSpacing: "-0.02em",
              }}
            >
              Congratulations!
            </h2>
            <p
              className="text-lg font-semibold mb-1"
              style={{ color: "#4A6FA5" }}
            >
              You got into {schoolName}!
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              All that work paid off. You earned this. Share the good news!
            </p>

            {/* Shareable card preview */}
            <div
              className="mb-6 p-5 mx-auto max-w-xs"
              style={{
                background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
                borderRadius: "14px",
                color: "#fff",
              }}
            >
              <p className="text-lg font-bold mb-1">
                I got into {schoolName}
              </p>
              <p className="text-sm opacity-80">with AdmitPath</p>
            </div>

            {/* Share: copy link only */}
            <div className="mb-5">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50"
                style={{
                  borderColor: "rgba(0,0,0,0.06)",
                  color: "var(--dl-text-primary, #1B2030)",
                }}
              >
                {copied ? (
                  <Check className="h-4 w-4" style={{ color: "#047857" }} />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>

            {/* Add to wall checkbox */}
            <label
              className="flex items-center justify-center gap-2 text-sm cursor-pointer"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              <input
                type="checkbox"
                checked={addToWall}
                onChange={(e) => setAddToWall(e.target.checked)}
                className="rounded"
                style={{ accentColor: "#4A6FA5" }}
              />
              Add my result to the Admits Wall (anonymized)
            </label>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
