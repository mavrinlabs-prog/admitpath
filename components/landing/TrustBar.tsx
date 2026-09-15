"use client";

import { BookOpen, School, Database, Layers, ShieldCheck, Lock, CreditCard, RefreshCw } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Trust signals row — metrics + security claims that reduce purchase friction.
 * Placed near pricing/CTA, not above-fold (where it would steal hero attention).
 * Server component — no client JS.
 *
 * Top row: product metrics (content depth / coverage).
 * Bottom row: security / billing trust signals.
 */
const METRICS = [
  {
    icon: BookOpen,
    title: "Admissions guides",
    body: "Practical guides with links to primary sources where available.",
  },
  {
    icon: School,
    title: "105 college records",
    body: "Detailed profiles with acceptance rates, test ranges, and factor weightings.",
  },
  {
    icon: Database,
    title: "CDS Section C7 data",
    body: "Scoring calibrated against each school's official admissions-factor weights.",
  },
  {
    icon: Layers,
    title: "7-dimension scoring",
    body: "Academics, leadership, awards, depth, spike, essays, and recommendations.",
  },
];

const SECURITY = [
  {
    icon: Lock,
    title: "Stripe-hosted payments",
    body: "Card details are collected by Stripe's hosted checkout, not by AdmitPath forms.",
  },
  {
    icon: ShieldCheck,
    title: "Account-scoped storage",
    body: "Authenticated requests use signed sessions and account-scoped database queries.",
  },
  {
    icon: CreditCard,
    title: "Free plan included",
    body: "5 analyses, 5 essay reviews, 5 chat messages, and 8 saved colleges at no cost.",
  },
  {
    icon: RefreshCw,
    title: "Flexible billing",
    body: "Monthly billing. Manage or cancel from the billing portal anytime.",
  },
];

function SignalGrid({ items }: { items: typeof METRICS }) {
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 24,
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}
      className="sm:!grid-cols-4"
    >
      {items.map((s) => {
        const Icon = s.icon;
        return (
          <li key={s.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span
              style={{
                flexShrink: 0,
                display: "flex",
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                background: "rgba(74, 111, 165, 0.08)",
                color: "var(--dl-brand)",
                marginTop: 2,
              }}
              aria-hidden
            >
              <Icon size={16} strokeWidth={2} />
            </span>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "var(--dl-text-primary)",
                }}
              >
                {s.title}
              </p>
              <p
                style={{
                  marginTop: 4,
                  marginBottom: 0,
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: "var(--dl-text-secondary)",
                }}
              >
                {s.body}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-10%",
  });

  return (
    <motion.section
      ref={ref}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      aria-labelledby="trust-heading"
      style={{
        borderTop: "1px solid rgba(0, 0, 0, 0.06)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        background: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "48px 36px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          id="trust-heading"
          className="dl-section-eyebrow"
          style={{ textAlign: "center", marginBottom: 28 }}
        >
          Built on real admissions data
        </p>
        <SignalGrid items={METRICS} />

        <div
          style={{
            height: 1,
            background: "rgba(0, 0, 0, 0.06)",
            margin: "32px 0",
          }}
        />

        <p
          className="dl-section-eyebrow"
          style={{ textAlign: "center", marginBottom: 28 }}
        >
          Current application safeguards
        </p>
        <SignalGrid items={SECURITY} />
      </div>
    </motion.section>
  );
}
