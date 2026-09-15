"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail } from "lucide-react";

interface Preferences {
  weeklyProgress: boolean;
  essayTips: boolean;
  deadlineReminders: boolean;
  productUpdates: boolean;
}

const STORAGE_KEY = "ap_email_prefs";

const DEFAULT_PREFS: Preferences = {
  weeklyProgress: true,
  essayTips: true,
  deadlineReminders: true,
  productUpdates: true,
};

function loadPrefs(): Preferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    // corrupted — fall back to defaults
  }
  return DEFAULT_PREFS;
}

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: checked ? "var(--dl-brand, #4A6FA5)" : "rgba(0,0,0,0.12)",
      }}
    >
      <span
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}

const PREF_OPTIONS: { key: keyof Preferences; label: string; description: string }[] = [
  {
    key: "weeklyProgress",
    label: "Weekly progress emails",
    description: "A summary of your analyses, essays, and score changes each week.",
  },
  {
    key: "essayTips",
    label: "Essay tips",
    description: "Occasional writing tips and strategies for stronger essays.",
  },
  {
    key: "deadlineReminders",
    label: "Deadline reminders",
    description: "Alerts when your application deadlines are approaching.",
  },
  {
    key: "productUpdates",
    label: "Product updates",
    description: "New features and improvements to AdmitPath.",
  },
];

export default function EmailPreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setMounted(true);
  }, []);

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const updatePref = useCallback(
    (key: keyof Preferences, value: boolean) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        // Persist locally as immediate fallback
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // storage full -- ignore
        }
        // Attempt server sync (best-effort, don't block UI)
        setSaving(true);
        fetch("/api/account/email-preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        })
          .then((r) => {
            if (r.ok) setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          })
          .catch(() => {
            // Server sync failed -- local storage has the value, so no data loss
          })
          .finally(() => setSaving(false));
        return next;
      });
    },
    [],
  );

  if (!mounted) return null;

  return (
    <div className="dl-card-hover card">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ background: "#4A6FA5" }}
        >
          <Mail className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2
            className="font-bold"
            style={{
              color: "#1B2030",
              fontFamily: "var(--font-inter)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Email Preferences
          </h2>
          <p className="text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Choose which emails you want to receive.
          </p>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        {PREF_OPTIONS.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-3.5"
          >
            <label htmlFor={`pref-${key}`} className="flex-1 cursor-pointer">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--dl-text-primary, #1B2030)" }}
              >
                {label}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
              >
                {description}
              </p>
            </label>
            <Toggle
              id={`pref-${key}`}
              checked={prefs[key]}
              onChange={(v) => updatePref(key, v)}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p
          className="text-xs"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          You can also unsubscribe from any email by clicking the link in its footer.
        </p>
        {saving && (
          <p className="text-[10px] font-medium" style={{ color: "#4A6FA5" }}>
            Saving...
          </p>
        )}
        {!saving && lastSaved && (
          <p className="text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Saved at {lastSaved}
          </p>
        )}
      </div>
    </div>
  );
}
