"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Trash2, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

/**
 * Data & Privacy controls. Two interactive rows:
 *  1. Export — POSTs to /api/account/export, downloads JSON blob.
 *  2. Delete — uses an inline confirmation dialog with typed phrase
 *     "DELETE MY ACCOUNT", POSTs to /api/account/delete, then redirects
 *     to /sign-in.
 *
 * No new color tokens — destructive button uses #DC2626 inline per
 * CLAUDE.md hard rule (brand locked to blue).
 */

/** Inline confirmation dialog for account deletion (replaces window.confirm/prompt). */
function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  deleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (phrase: string) => void;
  deleting: boolean;
}) {
  const [phrase, setPhrase] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPhrase("");
      // Defer focus so the dialog renders first
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canConfirm = phrase === "DELETE MY ACCOUNT";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(15,23,42,0.45)" }}
        aria-hidden
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border p-6"
        style={{
          background: "#FFFFFF",
          borderColor: "rgba(220,38,38,0.3)",
          boxShadow: "0 24px 64px rgba(15,23,42,0.25)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Cancel deletion"
          className="absolute right-4 top-4 rounded-lg p-1 transition-colors hover:bg-black/5"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(220,38,38,0.08)" }}
          >
            <AlertTriangle className="h-5 w-5" style={{ color: "#DC2626" }} />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="text-base font-bold" style={{ color: "#DC2626" }}>
              Delete your account?
            </h3>
          </div>
        </div>

        <p id="delete-dialog-desc" className="text-sm mb-4 leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
          This permanently deletes your AdmitPath account, all profile data, analyses, essays, and college lists. Any active subscription will be cancelled. <strong style={{ color: "#DC2626" }}>This cannot be undone.</strong>
        </p>

        <label className="block mb-4">
          <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
            Type <span className="font-mono font-bold" style={{ color: "#DC2626" }}>DELETE MY ACCOUNT</span> to confirm
          </p>
          <input
            ref={inputRef}
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && canConfirm) onConfirm(phrase); }}
            placeholder="DELETE MY ACCOUNT"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none transition-colors focus:border-[#DC2626]"
            style={{ borderColor: "rgba(0,0,0,0.12)", color: "var(--dl-text-primary, #1B2030)" }}
          />
        </label>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-black/5"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-primary, #1B2030)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(phrase)}
            disabled={!canConfirm || deleting}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#DC2626" }}
          >
            {deleting ? "Deleting..." : "Delete forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DataControls() {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const toast = useToast();

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
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
    } catch (err) {
      console.error("[DataControls] export failed:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  const handleDeleteConfirm = useCallback(async (phrase: string) => {
    if (phrase !== "DELETE MY ACCOUNT" || deleting) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: phrase }),
      });
      if (!res.ok) {
        toast.error("Delete failed. Please contact support.");
        setDeleting(false);
        return;
      }
      window.location.assign("/sign-in");
    } catch (err) {
      console.error("[DataControls] delete failed:", err);
      toast.error("Delete failed. Please contact support.");
      setDeleting(false);
    }
  }, [deleting, toast]);

  return (
    <div className="card">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ background: "linear-gradient(135deg, #4A6FA5 0%, #2E4A6E 100%)" }}
        >
          <Download className="h-5 w-5 text-white" />
        </div>
        <h2
          className="font-bold"
          style={{ color: "var(--dl-text-primary, #1B2030)" }}
        >
          Data & Privacy
        </h2>
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        {/* Export */}
        <div className="flex items-start justify-between gap-4 py-3.5 text-sm">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              <Download className="h-4 w-4" style={{ color: "#4A6FA5" }} />
              Export your data
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Get a JSON dump of your profile, analyses, college list, and essays.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="focus-ring rounded-md border px-3 py-2 text-xs font-semibold transition-[filter] duration-150 ease-in-out hover:brightness-95 active:brightness-90 disabled:opacity-60"
            style={{
              borderColor: "rgba(0,0,0,0.06)",
              backgroundColor: "rgba(255,255,255,0.45)",
              color: "var(--dl-text-primary, #1B2030)",
            }}
          >
            {exporting ? "Preparing…" : "Download JSON"}
          </button>
        </div>

        {/* Delete */}
        <div className="flex items-start justify-between gap-4 py-3.5 text-sm">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 font-medium" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
              <Trash2 className="h-4 w-4" style={{ color: "#DC2626" }} />
              Delete account
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
              Soft-deletes your account and cancels any active subscription. Cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleting}
            className="focus-ring rounded-md px-3 py-2 text-xs font-semibold text-white transition-[filter] duration-150 ease-in-out hover:brightness-95 active:brightness-90 disabled:opacity-60"
            style={{
              backgroundColor: "#DC2626",
              border: "1px solid #DC2626",
            }}
          >
            {deleting ? "Deleting..." : "Delete account..."}
          </button>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
}
