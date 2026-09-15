"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  show: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; color: string; bg: string; border: string; prefix: string }> = {
  success: { icon: CheckCircle2, color: "#16a34a", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.40)", prefix: "Nailed it!" },
  error:   { icon: AlertCircle,  color: "#dc2626", bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.40)", prefix: "Hmm, that didn't work." },
  info:    { icon: Info,         color: "#4A6FA5", bg: "rgba(74,111,165,0.10)",  border: "rgba(74,111,165,0.40)", prefix: "Quick heads up --" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = `t${++idRef.current}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, variant === "error" ? 5000 : 4000);
  }, []);

  const success = useCallback((m: string) => show(m, "success"), [show]);
  const error = useCallback((m: string) => show(m, "error"), [show]);
  const info = useCallback((m: string) => show(m, "info"), [show]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none"
        style={{ width: "360px", maxWidth: "calc(100vw - 2.5rem)" }}
      >
        {toasts.map((t) => {
          const v = VARIANT_STYLES[t.variant];
          const Icon = v.icon;
          return (
            <div
              key={t.id}
              role={t.variant === "error" ? "alert" : "status"}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5 animate-toast-in"
              style={{
                background: "rgba(255,255,255,0.45)",
                borderColor: "rgba(0,0,0,0.06)",
                borderLeft: `3px solid ${v.color}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: v.color }} aria-hidden />
              <p className="flex-1 text-sm leading-snug" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                <span className="font-bold" style={{ color: v.color }}>{v.prefix}</span>{" "}
                <span className="font-medium">{t.message}</span>
              </p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 -mr-1 rounded-lg p-1 transition-colors hover:bg-[rgba(255,255,255,0.45)]"
              >
                <X className="h-4 w-4" style={{ color: "var(--dl-text-muted, #5A6275)" }} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx) return ctx;
  // Fallback when used outside provider — degrades to native alert so callers don't crash.
  return {
    show: (m) => { if (typeof window !== "undefined") window.alert(m); },
    success: (m) => { if (typeof window !== "undefined") window.alert(m); },
    error: (m) => { if (typeof window !== "undefined") window.alert(m); },
    info: (m) => { if (typeof window !== "undefined") window.alert(m); },
  };
}

// Animation keyframes (CSS-in-JS via globals.css would be cleaner but we keep self-contained)
export const TOAST_KEYFRAMES = `
@keyframes toastIn { from { opacity: 0; transform: translateY(10px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-toast-in { animation: toastIn 200ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
`;
