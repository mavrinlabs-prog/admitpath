"use client";

import { useEffect, useState, type ReactNode, type SelectHTMLAttributes } from "react";

type HydrationSafeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
  hydrationPlaceholder: string;
};

/**
 * Defers native select markup until after hydration. Some browser automation
 * and accessibility extensions replace selects before React attaches, which
 * otherwise forces the entire document to client-render.
 */
export function HydrationSafeSelect({
  children,
  hydrationPlaceholder,
  className,
  style,
  ...props
}: HydrationSafeSelectProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div aria-hidden="true" className={className} style={style}>
        {hydrationPlaceholder}
      </div>
    );
  }

  return (
    <select className={className} style={style} {...props}>
      {children}
    </select>
  );
}
