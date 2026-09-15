"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/**
 * "Get those hours back" — Discovery Labs dark-slate clone of the
 * counter-stats section. The original pattern was warm brown
 * (#1B1B18 → #2A1F14) which broke the cool blue-grey palette of the
 * rest of the rebrand. Switched to DL's brand-deep slate gradient
 * (#1E3352 → #2E4A6E → #1E3352) so the dark band reads as the same
 * brand pulled to its deepest end, not a separate dark theme.
 *
 * Counter numbers use JetBrains Mono (DL's display-number convention)
 * with a light brand tint so they stay readable on the deep slate.
 */
function AnimatedCounter({
  target,
  suffix = "",
  duration = 1800,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const counterStats = [
  { value: 7,  suffix: "",   label: "Dimensions scored",     sub: "Per profile analysis",      prefix: "" },
  { value: 6,  suffix: "",   label: "Essay rubric criteria", sub: "Per essay feedback run",    prefix: "" },
  { value: 102,suffix: "",   label: "Schools analyzed",       sub: "Real CDS data calibrated",  prefix: "" },
  { value: 24, suffix: "/7", label: "Availability",          sub: "No scheduling, no waitlist", prefix: "" },
];

export function HoursBackSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1E3352 0%, #2E4A6E 50%, #1E3352 100%)",
      }}
    >
      {/* DL-style decorative radials — subtle brand glow at offset positions */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(74,111,165,0.18), transparent)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 60% at 80% 30%, rgba(74,139,224,0.10), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#9DB4D9",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            The real cost of waiting
          </motion.p>
          <motion.h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              lineHeight: 1.1,
            }}
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.07 }}
          >
            Get those hours <em style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", color: "#9DB4D9" }}>back.</em>
          </motion.h2>
          <motion.p
            className="mt-4 mx-auto"
            style={{
              fontSize: 17,
              maxWidth: 640,
              color: "#B7C4DB",
              lineHeight: 1.6,
            }}
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.14 }}
          >
            Private counselors cost thousands and take weeks to schedule.
            AdmitPath gives you structured, on-demand profile feedback at a
            fraction of the price.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {counterStats.map((s, i) => (
            <motion.div
              key={s.label}
              style={{
                padding: 28,
                textAlign: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              initial={false}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.18 + i * 0.08 }}
            >
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: "#9DB4D9",
                  fontFamily: "var(--font-jetbrains-mono)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {s.prefix}
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: "#FFFFFF",
                }}
              >
                {s.label}
              </p>
              <p style={{ fontSize: 12, color: "#8DA4C7" }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
