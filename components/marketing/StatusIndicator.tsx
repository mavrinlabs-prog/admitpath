"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Footer status pill. Text reflects the live /api/status check, never a hard-coded claim. */
export function StatusIndicator() {
  const [state, setState] = useState<"unknown" | "operational" | "degraded">("unknown");
  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { status?: string } | null) => {
        if (!cancelled) setState(data?.status === "operational" ? "operational" : data ? "degraded" : "unknown");
      })
      .catch(() => !cancelled && setState("unknown"));
    return () => {
      cancelled = true;
    };
  }, []);
  const label = state === "operational" ? "All systems operational" : state === "degraded" ? "Some systems degraded" : "System status";
  const dot = state === "operational" ? "ap-status-dot" : state === "degraded" ? "ap-status-dot ap-status-dot--degraded" : "ap-status-dot ap-status-dot--unknown";
  return (
    <Link href="/status" prefetch={false} className="ap-status-link text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.7)" }}>
      <span className={dot} aria-hidden />
      {label}
    </Link>
  );
}
