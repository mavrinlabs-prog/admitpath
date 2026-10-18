"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { analytics } from "@/lib/analytics";
import { ProfileReportPreview } from "@/components/landing/ProfileReportPreview";

/**
 * Hero — Discovery Labs `.dl-hero` pixel-clone (rebrand 2026-05-05).
 *
 * Layout mirrors frontend_template/src/pages/Landing.jsx:
 *   <section class="dl-hero">
 *     <div class="dl-hero-inner">                      ← 1fr 1fr grid, 64px gap
 *       <div class="dl-hero-content">
 *         <h1 class="dl-hero-title">… <em>italics</em> …</h1>
 *         <p class="dl-hero-desc">…</p>
 *         <div class="dl-hero-cta"><a class="dl-btn dl-btn-primary dl-btn-xl">…</a></div>
 *         <div class="dl-hero-stats">…</div>
 *       </div>
 *       <div class="dl-hero-preview">                  ← 3D-tilted preview card
 *         <div class="dl-preview-card">…score-bars…</div>
 *       </div>
 *     </div>
 *   </section>
 *
 * Hard rules from the DL system:
 *   - <em> renders in Lora italic via the global em rule in globals.css.
 *   - Hero title font-weight 800 + letter-spacing -0.04em (set in .dl-hero-title).
 *   - Preview card uses CSS-only 3D tilt; no Framer Motion needed for the
 *     mockup itself. Hover restores it. Avoiding motion lets the card SSR
 *     without the layout-shift the prior framer hero introduced.
 */
export function HeroSection({ signedIn = false }: { signedIn?: boolean }) {
  return (
    // reducedMotion="user" makes the framer-motion entrance animations below
    // respect the visitor's OS "reduce motion" setting. The global CSS
    // prefers-reduced-motion block only neutralizes CSS animations, not these
    // JS-driven motion props (ui-ux-pro-max rule #1 `reduced-motion`).
    <MotionConfig reducedMotion="user">
    <section className="dl-hero dl-hero-bg" aria-labelledby="hero-heading">
      <div className="dl-hero-inner">
        {/* Left column — copy + CTA + stats */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
          <p
            className="dl-hero-badge"
            style={{ fontFamily: "var(--dl-font-sans, Inter, sans-serif)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}
          >
            Calibrated to real CDS admissions data from 102 schools
          </p>

          <h1 id="hero-heading" className="dl-hero-title" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.05 }}>
            Know exactly where you stand.{" "}
            <em><span className="text-gradient">Get the plan to get in.</span></em>
          </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
          <p className="dl-hero-desc" style={{ maxWidth: "540px", fontSize: 15, lineHeight: 1.7, color: "var(--dl-text-muted, #5A6275)", fontStyle: "italic", marginBottom: 12 }}>
            You&rsquo;ve Googled &ldquo;chances at [school]&rdquo; at 2am. You&rsquo;ve compared your stats to Reddit chanceme posts. You&rsquo;ve wondered if your counselor is giving you real advice or just being nice.
          </p>
          <p className="dl-hero-desc" style={{ maxWidth: "540px", fontSize: 17, lineHeight: 1.65, color: "var(--dl-text-secondary, #454B5E)" }}>
            Score your application across 7&nbsp;dimensions calibrated to
            published CDS admissions-factor data from 102&nbsp;schools. See the reasoning
            behind every score, get a prioritized plan for your biggest gaps,
            and stop guessing &mdash; you make every final call.
          </p>

          <div className="dl-hero-cta flex flex-col sm:flex-row gap-3">
            <Link href={signedIn ? "/dashboard" : "/sign-up"} className="dl-btn dl-btn-primary dl-btn-xl" onClick={() => analytics.ctaClicked("hero_primary", "hero")}>
              {signedIn ? "Open dashboard" : "See where you really stand"} <ArrowRight size={16} strokeWidth={2} />
            </Link>
            {signedIn && (
              <Link href="/analyze" className="dl-btn dl-btn-secondary dl-btn-lg">
                Run new analysis
              </Link>
            )}
          </div>

          <p
            className="text-xs"
            style={{ color: "var(--dl-text-muted)", marginTop: "12px", marginBottom: "16px", letterSpacing: "0.01em" }}
          >
            Free to start &middot; Takes 5 minutes &middot; No card required
          </p>


          <div className="dl-hero-stats">
            <div className="dl-hero-stat">
              <div className="dl-hero-stat-num">7</div>
              <div className="dl-hero-stat-label">Scoring dimensions</div>
            </div>
            <div className="dl-hero-stat">
              <div className="dl-hero-stat-num">3</div>
              <div className="dl-hero-stat-label">Core tools</div>
            </div>
            <div className="dl-hero-stat">
              <div className="dl-hero-stat-num">102</div>
              <div className="dl-hero-stat-label">Schools&rsquo; data</div>
            </div>
          </div>
          </motion.div>
        </div>

        {/* Right column — DL-style preview card with 3D tilt */}
        <motion.div
          className="dl-hero-preview"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProfileReportPreview className="mx-auto" />
        </motion.div>
      </div>

      <div className="scroll-hint absolute bottom-6 left-1/2 -translate-x-1/2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4 L10 16 M5 11 L10 16 L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: "var(--dl-text-muted)"}}/>
        </svg>
      </div>
    </section>
    </MotionConfig>
  );
}
