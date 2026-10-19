import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { getSystemStatus } from "@/lib/system-status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Status",
  description: "Current status of AdmitPath services.",
  robots: { index: false, follow: true },
};

const LABELS: Record<string, string> = {
  website: "Website & accounts",
  database: "Database",
  aiServices: "AI analysis, essays & counselor",
  payments: "Payments (Stripe)",
};

export default async function StatusPage() {
  const status = await getSystemStatus();
  const ok = status.status === "operational";
  return (
    <MarketingLayout
      eyebrow="Status"
      title={ok ? "All systems operational" : "Some systems are degraded"}
      description={ok
        ? "Every AdmitPath service passed its latest check."
        : "Core pages work. Affected AI features fall back to rubric-based results until service is restored."}
    >
      <ul className="divide-y divide-black/5 rounded-2xl border border-black/10 bg-white/60">
        {Object.entries(status.components).map(([key, value]) => (
          <li key={key} className="flex items-center justify-between px-5 py-4 text-sm">
            <span className="flex items-center gap-2 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              <Activity className="h-4 w-4" style={{ color: "#4A6FA5" }} aria-hidden />
              {LABELS[key] ?? key}
            </span>
            <span className="flex items-center gap-2" style={{ color: value === "operational" ? "#2F7A55" : "#A15C07" }}>
              <span className={value === "operational" ? "ap-status-dot" : "ap-status-dot ap-status-dot--degraded"} aria-hidden />
              {value === "operational" ? "Operational" : "Degraded"}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
        Checked {new Date(status.checkedAt).toUTCString()}.
      </p>
    </MarketingLayout>
  );
}
