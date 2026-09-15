"use client";

import { useCallback, useEffect, useState } from "react";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Crown,
  Download,
  Trash2,
  Loader2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

/* ── Types ───────────────────────────────────────────────────────────── */

interface SettingsClientProps {
  userName: string;
  userEmail: string;
  isPaid: boolean;
  isStripePaid: boolean;
  planLabel: string;
  planDescription: string;
  cancelAtPeriodEnd: boolean;
  periodEnd: string | null;
}

interface NotificationPrefs {
  weeklyProgress: boolean;
  essayTips: boolean;
  deadlineReminders: boolean;
  productUpdates: boolean;
}

/* ── Constants ───────────────────────────────────────────────────────── */

const BRAND = "#4A6FA5";
const BRAND_HOVER = "#2E4A6E";

const DEFAULT_PREFS: NotificationPrefs = {
  weeklyProgress: true,
  essayTips: true,
  deadlineReminders: true,
  productUpdates: true,
};

const STORAGE_KEY = "ap_email_prefs";

function loadPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    // corrupted
  }
  return DEFAULT_PREFS;
}

/* ── Main Component ──────────────────────────────────────────────────── */

export default function SettingsClient({
  userName,
  userEmail,
  isPaid,
  isStripePaid,
  planLabel,
  planDescription,
  cancelAtPeriodEnd,
  periodEnd,
}: SettingsClientProps) {
  const toast = useToast();

  // ── Notifications ──────────────────────────────────────────────────
  const [notif, setNotif] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [notifMounted, setNotifMounted] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);

  // ── Upgrade / Portal ────────────────────────────────────────────────
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);

  // ── Data / Delete ──────────────────────────────────────────────────
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ── Training-data consent (opt-in, off by default) ─────────────────
  const [trainingConsent, setTrainingConsent] = useState(false);
  const [consentSaving, setConsentSaving] = useState(false);

  // Load notification prefs from localStorage + attempt server sync
  useEffect(() => {
    // This is a client-only preference source; post-hydration synchronization is intentional.
    setNotif(loadPrefs());
    setNotifMounted(true);
  }, []);

  // Load training-consent state from the server
  useEffect(() => {
    fetch("/api/account/training-consent")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.trainingConsent === "boolean") {
          setTrainingConsent(data.trainingConsent);
        }
      })
      .catch(() => {});
  }, []);

  const updateTrainingConsent = useCallback((value: boolean) => {
    setTrainingConsent(value);
    setConsentSaving(true);
    fetch("/api/account/training-consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent: value }),
    })
      .then((res) => {
        if (!res.ok) {
          setTrainingConsent(!value);
          toast.error("Couldn't save your preference. Please try again.");
        }
      })
      .catch(() => {
        setTrainingConsent(!value);
        toast.error("Couldn't save your preference. Please try again.");
      })
      .finally(() => setConsentSaving(false));
  }, [toast]);

  const updateNotifPref = useCallback(
    (key: keyof NotificationPrefs, value: boolean) => {
      setNotif((prev) => {
        const next = { ...prev, [key]: value };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // storage full
        }
        // Best-effort server sync
        setNotifSaving(true);
        fetch("/api/account/email-preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        })
          .catch(() => {})
          .finally(() => setNotifSaving(false));
        return next;
      });
    },
    [],
  );

  // ── Handlers ───────────────────────────────────────────────────────

  async function handleUpgrade() {
    setUpgradeError("");
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey: "pro" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        setUpgradeError(data.error || "Could not start checkout");
        setUpgradeLoading(false);
      }
    } catch {
      setUpgradeError("Could not reach checkout. Please try again.");
      setUpgradeLoading(false);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        throw new Error(data.error ?? "Could not open billing portal");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't open billing portal.");
      setPortalLoading(false);
    }
  }

  async function exportData() {
    if (exportLoading) return;
    setExportLoading(true);
    try {
      const res = await fetch("/api/account/export", { method: "POST" });
      if (!res.ok) {
        toast.error("Export failed. Please try again.");
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(cd);
      const filename = match?.[1] ?? `admitpath-export-${Date.now()}.json`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Your data export is downloading.");
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  }

  async function deleteAccount() {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "DELETE MY ACCOUNT" }),
      });
      if (!res.ok) {
        toast.error("Delete failed. Contact support.");
        setDeleteLoading(false);
        setConfirmDelete(false);
        return;
      }
      toast.success("Account deleted. Goodbye.");
      setTimeout(() => { window.location.assign("/sign-in"); }, 600);
    } catch {
      toast.error("Delete failed. Contact support.");
      setDeleteLoading(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: BRAND }}>
          Account
        </p>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#1B2030" }}>
          Settings
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "#454B5E" }}>
          Manage your account, subscription, and preferences.
        </p>
      </header>

      <div className="space-y-4">
        {/* 1. Account */}
        <SectionCard
          icon={<User className="w-4 h-4" />}
          title="Account"
          description="Your identity details. Email is managed by your Google account."
        >
          <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <InfoRow label="Name" value={userName || "---"} />
            <InfoRow label="Email" value={userEmail || "---"} mono />
          </div>
        </SectionCard>

        {/* 2. Plan */}
        <SectionCard
          icon={<CreditCard className="w-4 h-4" />}
          title="Plan"
          description="Your subscription and billing."
        >
          <div className="flex items-center justify-between rounded-xl border p-4 mb-4" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: isPaid ? BRAND : "#E8EFF8", color: isPaid ? "#fff" : BRAND }}
              >
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1B2030" }}>{planLabel}</p>
                <p className="text-xs" style={{ color: "#454B5E" }}>{planDescription}</p>
              </div>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: isPaid ? "rgba(22,163,74,0.08)" : "rgba(0,0,0,0.04)",
                color: isPaid ? "#15803D" : "#454B5E",
                border: `1px solid ${isPaid ? "rgba(22,163,74,0.2)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              {isPaid ? "$19.99/mo" : "$0"}
            </span>
          </div>

          {/* Billing facts */}
          {(cancelAtPeriodEnd || isStripePaid) && periodEnd && (
            <ul className="mb-4 text-xs space-y-1.5 leading-relaxed" style={{ color: "#454B5E" }}>
              {cancelAtPeriodEnd && (
                <li className="flex gap-1.5">
                  <span style={{ color: "#94A3B8" }}>-</span>
                  <span>Cancellation scheduled — access ends {periodEnd}.</span>
                </li>
              )}
              {isStripePaid && !cancelAtPeriodEnd && (
                <li className="flex gap-1.5">
                  <span style={{ color: "#94A3B8" }}>-</span>
                  <span>Renews {periodEnd}.</span>
                </li>
              )}
            </ul>
          )}

          <div className="flex flex-wrap gap-2">
            {isPaid && isStripePaid ? (
              <button
                type="button"
                onClick={handlePortal}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={(e) => { if (!portalLoading) e.currentTarget.style.backgroundColor = BRAND_HOVER; }}
                onMouseLeave={(e) => { if (!portalLoading) e.currentTarget.style.backgroundColor = BRAND; }}
              >
                {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                {portalLoading ? "Opening..." : "Manage Billing"}
              </button>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: BRAND }}
                  onMouseEnter={(e) => { if (!upgradeLoading) e.currentTarget.style.backgroundColor = BRAND_HOVER; }}
                  onMouseLeave={(e) => { if (!upgradeLoading) e.currentTarget.style.backgroundColor = BRAND; }}
                >
                  {upgradeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                  {upgradeLoading ? "Redirecting to checkout..." : "Upgrade to Pro"}
                </button>
                {upgradeError && (
                  <p className="mt-1.5 text-xs text-red-600">{upgradeError}</p>
                )}
              </div>
            )}
          </div>
        </SectionCard>

        {/* 3. Notifications */}
        <SectionCard
          icon={<Bell className="w-4 h-4" />}
          title="Notifications"
          description="Choose which emails we send you."
        >
          {!notifMounted ? (
            <p className="text-xs flex items-center gap-1.5" style={{ color: "#94A3B8" }}>
              <Loader2 className="w-3 h-3 animate-spin" /> Loading preferences...
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                <ToggleRow
                  label="Weekly progress emails"
                  description="A summary of your analyses, essays, and score changes each week."
                  checked={notif.weeklyProgress}
                  onChange={(v) => updateNotifPref("weeklyProgress", v)}
                />
                <ToggleRow
                  label="Essay tips"
                  description="Occasional writing tips and strategies for stronger essays."
                  checked={notif.essayTips}
                  onChange={(v) => updateNotifPref("essayTips", v)}
                />
                <ToggleRow
                  label="Deadline reminders"
                  description="Alerts when your application deadlines are approaching."
                  checked={notif.deadlineReminders}
                  onChange={(v) => updateNotifPref("deadlineReminders", v)}
                />
                <ToggleRow
                  label="Product updates"
                  description="New features and improvements to AdmitPath."
                  checked={notif.productUpdates}
                  onChange={(v) => updateNotifPref("productUpdates", v)}
                />
              </div>
              <p className="text-xs" style={{ color: "#78786F" }}>
                {notifSaving ? "Saving..." : "You can also unsubscribe from any email using the link in its footer."}
              </p>
            </>
          )}
        </SectionCard>

        {/* 4. Data & Privacy */}
        <SectionCard
          icon={<Shield className="w-4 h-4" />}
          title="Data & Privacy"
          description="Export your data or delete your account."
        >
          <div className="space-y-3 mb-4">
            <ToggleRow
              label="Help improve AdmitPath's AI"
              description="Allow your anonymized analyses and essay feedback (with emails, phone numbers, and IDs removed) to be used to improve our AI. Off by default — nothing is stored for training unless you turn this on."
              checked={trainingConsent}
              onChange={updateTrainingConsent}
            />
            {consentSaving && (
              <p className="text-xs" style={{ color: "#78786F" }}>Saving...</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={exportData}
              disabled={exportLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:border-[#4A6FA5] hover:text-[#4A6FA5] disabled:opacity-50"
              style={{ borderColor: "rgba(0,0,0,0.06)", color: "#1B2030" }}
            >
              {exportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exportLoading ? "Exporting..." : "Export my data (JSON)"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-red-50"
              style={{ borderColor: "rgba(239,68,68,0.2)", color: "#DC2626" }}
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "#78786F" }}>
            Your data is stored securely. Contact maestro.committee@gmail.com for support.
          </p>
        </SectionCard>

        <form action="/api/auth/signout" method="post" className="flex justify-center">
          <button
            type="submit"
            className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-white"
            style={{ borderColor: "rgba(0,0,0,0.1)", color: "#454B5E" }}
          >
            Sign out
          </button>
        </form>
        <p className="text-center text-xs" style={{ color: "#78786F" }}>
          Account managed through Google. Contact maestro.committee@gmail.com for support.
        </p>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <ConfirmDeleteModal
          email={userEmail || "your account"}
          loading={deleteLoading}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={deleteAccount}
        />
      )}
    </div>
  );
}

/* ── Subcomponents ────────────────────────────────────────────────────── */

function SectionCard({
  icon,
  title,
  description,
  iconBg,
  iconColor,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  iconBg?: string;
  iconColor?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
    >
      <header className="flex items-start gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg ?? "#E8EFF8", color: iconColor ?? BRAND }}
        >
          {icon}
        </div>
        <div>
          <h2 className="font-semibold" style={{ color: "#1B2030" }}>{title}</h2>
          {description ? <p className="text-xs mt-0.5" style={{ color: "#454B5E" }}>{description}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span style={{ color: "#454B5E" }}>{label}</span>
      <span className={mono ? "font-mono text-sm" : "font-medium"} style={{ color: "#1B2030" }}>{value}</span>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div>
        <p className="text-sm font-medium" style={{ color: "#1B2030" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#454B5E" }}>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30"
        style={{ backgroundColor: checked ? BRAND : "#CBD5E1" }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(24px)" : "translateX(4px)" }}
        />
      </button>
    </label>
  );
}

function ConfirmDeleteModal({
  email,
  loading,
  onCancel,
  onConfirm,
}: {
  email: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  const matches = typed.trim().toLowerCase() === email.trim().toLowerCase();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loading, onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[900] flex items-center justify-center bg-slate-900/50 p-4"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Delete account?</h3>
            <p className="text-sm text-slate-600 mt-1">
              This permanently removes your profile, analyses, essays, college lists, and cancels any active subscription. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#64748B" }}>
            Type <span className="normal-case" style={{ color: "#1B2030" }}>{email}</span> to confirm
          </label>
          <input
            type="email"
            autoComplete="off"
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#F8FAFC", color: "#1B2030" }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            style={{ borderColor: "rgba(0,0,0,0.1)", color: "#1B2030" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !matches}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Deleting..." : "Yes, delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}
