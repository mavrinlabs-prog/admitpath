"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { AnimatedNumber } from "@/components/animated-number";

const stats = [
  { value: 102, label: "maintained college records", display: "number" as const, suffix: "" },
  { value: 7, label: "scoring dimensions", display: "number" as const, suffix: "" },
  { value: 200, label: "expert articles", display: "number" as const, suffix: "+" },
  { value: 45, label: "tools", display: "number" as const, suffix: "+" },
];

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-10%",
  });

  return (
    <section
      ref={ref}
      className="border-y"
      aria-label="AdmitPath key metrics"
      style={{
        backgroundColor: "rgba(255,255,255,0.45)",
        borderColor: "rgba(0,0,0,0.06)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-[color:rgba(0,0,0,0.06)]">
          {stats.map((s) => (
            <div key={s.label} className="text-center px-6">
              <p
                className="text-2xl font-bold"
                style={{
                  color: "var(--dl-text-primary, #1B2030)",
                }}
              >
                {s.display === "number" && isInView ? (
                  <><AnimatedNumber value={s.value as number} duration={1.4} />{s.suffix}</>
                ) : (
                  <>{s.value}{s.suffix}</>
                )}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
