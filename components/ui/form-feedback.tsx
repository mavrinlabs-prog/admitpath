"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info } from "lucide-react";
import { springBounce } from "@/lib/motion-presets";

/* ------------------------------------------------------------------ */
/*  Field-level feedback                                               */
/* ------------------------------------------------------------------ */

export function FieldSuccess({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={springBounce}
      >
        <Check className="h-3.5 w-3.5" style={{ color: "#16a34a" }} aria-hidden />
      </motion.span>
      <motion.p
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="text-xs font-medium"
        style={{ color: "#16a34a" }}
        role="status"
      >
        {message}
      </motion.p>
    </div>
  );
}

export function FieldError({ message, id }: { message: string; id?: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-1" role="alert" aria-live="assertive">
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -8, 8, -6, 4, 0] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <AlertCircle className="h-3.5 w-3.5" style={{ color: "#dc2626" }} aria-hidden />
      </motion.span>
      <motion.p
        id={id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="text-xs font-medium"
        style={{ color: "#dc2626" }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export function FieldHint({ message, id }: { message: string; id?: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <Info
        className="h-3.5 w-3.5 shrink-0"
        style={{ color: "var(--dl-brand, #4A6FA5)" }}
        aria-hidden
      />
      <p
        id={id}
        className="text-xs"
        style={{ color: "var(--dl-text-muted, #8890A5)" }}
      >
        {message}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form-level banners                                                 */
/* ------------------------------------------------------------------ */

export function FormSuccess({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-start gap-3 rounded-xl border px-4 py-3.5"
      style={{
        background: "rgba(34,197,94,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(34,197,94,0.25)",
      }}
      role="status"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={springBounce}
        className="mt-0.5"
      >
        <Check
          className="h-5 w-5"
          style={{ color: "#16a34a" }}
          aria-hidden
        />
      </motion.span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: "#15803d" }}
        >
          {title}
        </p>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: "#166534" }}
        >
          {message}
        </p>
      </div>
    </motion.div>
  );
}

export function FormError({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: [0, -6, 6, -4, 3, 0] }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex items-start gap-3 rounded-xl border px-4 py-3.5"
      style={{
        background: "rgba(239,68,68,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(239,68,68,0.25)",
      }}
      role="alert"
    >
      <AlertCircle
        className="h-5 w-5 shrink-0 mt-0.5"
        style={{ color: "#dc2626" }}
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: "#b91c1c" }}
        >
          {title}
        </p>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: "#991b1b" }}
        >
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 self-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
          style={{
            color: "#dc2626",
            background: "rgba(239,68,68,0.12)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,0.12)")
          }
        >
          Retry
        </button>
      )}
    </motion.div>
  );
}
