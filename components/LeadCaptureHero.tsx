"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, Sparkles, TrendingUp } from "lucide-react";

/**
 * LeadCaptureHero — email-gated lead capture component.
 *
 * Appears ABOVE the main hero for non-authenticated visitors. Captures email
 * before showing the app (Dropbox-style growth tactic). On submit, redirects
 * to /sign-up?email=X so the signup form is pre-filled.
 *
 * Social proof: "Early Access — Your feedback shapes what we build"
 * 3 value bullets with checkmarks.
 * DL design system tokens throughout.
 */
export function LeadCaptureHero() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const trimmed = email.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setError("Enter a valid email address.");
        return;
      }

      setSubmitting(true);
      // Redirect to sign-up with pre-filled email
      router.push(`/sign-up?email=${encodeURIComponent(trimmed)}`);
    },
    [email, router],
  );

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        background:
          "linear-gradient(135deg, var(--dl-brand-deep, #1E3352) 0%, var(--dl-brand, #4A6FA5) 60%, var(--dl-brand-dark, #2E4A6E) 100%)",
        borderColor: "rgba(0,0,0,0.06)",
      }}
    >
      {/* Subtle radial highlights */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 30% 40%, rgba(255,255,255,0.08), transparent)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 80% 60%, rgba(74,111,165,0.2), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-14 sm:py-20 text-center">
        {/* Social proof pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-6"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Users className="h-3.5 w-3.5" strokeWidth={2} />
          Early Access &mdash; Your feedback shapes what we build
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
          style={{ color: "#FFFFFF", lineHeight: 1.15, letterSpacing: "-0.03em" }}
        >
          Get your free college admissions score
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base mb-8"
          style={{ color: "rgba(255,255,255,0.8)", maxWidth: 480, margin: "0 auto 32px" }}
        >
          Enter your email for an instant 7-dimension profile analysis.
          See exactly where you stand and how to improve.
        </motion.p>

        {/* Email capture form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex flex-col sm:flex-row gap-3 max-w-md"
        >
          <div className="flex-1 relative">
            <label htmlFor="lead-capture-email" className="sr-only">
              Email address
            </label>
            <input
              id="lead-capture-email"
              type="email"
              placeholder="Enter your email for instant profile analysis"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-describedby={error ? "lead-capture-error" : undefined}
              aria-invalid={error ? true : undefined}
              className="w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-shadow focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#1E3352]"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "var(--dl-text-primary, #1B2030)",
                border: error ? "1px solid #FCA5A5" : "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="shrink-0 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "#FFFFFF",
              color: "var(--dl-brand, #4A6FA5)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {submitting ? (
              <motion.span
                className="inline-block h-4 w-4 rounded-full border-2 border-[#4A6FA5] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                Get My Free Score
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </>
            )}
          </button>
        </motion.form>

        {error && (
          <p
            id="lead-capture-error"
            role="alert"
            aria-live="assertive"
            className="mt-2 text-xs font-medium"
            style={{ color: "#FCA5A5" }}
          >
            {error}
          </p>
        )}

        {/* Value bullets */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          {[
            { icon: Sparkles, text: "7-dimension AI scoring in 5 minutes" },
            { icon: TrendingUp, text: "Personalized 90-day improvement plan" },
            { icon: CheckCircle2, text: "Calibrated to real CDS admissions data" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {text}
            </div>
          ))}
        </motion.div>

        <p
          className="mt-4 text-[10px]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          We do not sell your email. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
