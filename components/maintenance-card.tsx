"use client";

/**
 * Reusable maintenance / degraded-service card. Drop-in primitive — ops can
 * mount this on any page that loses its backing service (LLM down, DB blip,
 * Stripe portal degraded). Hairline border, no shadow, single refresh CTA.
 *
 * Uses `aria-live="polite"` and `role="status"` so screen readers announce
 * the maintenance state without interrupting the user.
 *
 * Usage:
 *   <MaintenanceCard />
 *   <MaintenanceCard service="Essay feedback" eta="a few minutes" />
 */

type MaintenanceCardProps = {
  /** Optional service name shown in the eyebrow ("ESSAY FEEDBACK · MAINTENANCE"). */
  service?: string;
  /** Optional override for the body line. */
  message?: string;
  /** Optional ETA string, e.g. "a few minutes" or "~15 minutes". */
  eta?: string;
};

export function MaintenanceCard({ service, message, eta }: MaintenanceCardProps) {
  const eyebrow = service ? `${service.toUpperCase()} · MAINTENANCE` : "MAINTENANCE";
  const body =
    message ??
    "We're working on it. The rest of AdmitPath is up — this surface should be back shortly.";

  function refresh() {
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-md mx-auto rounded-md border p-8"
      style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.45)" }}
    >
      <p
        className="mb-5 text-[11px] font-medium uppercase"
        style={{
          fontFamily: "var(--font-inter)",
          letterSpacing: "0.08em",
          color: "var(--dl-text-muted, #5A6275)",
        }}
      >
        {eyebrow}
      </p>

      <h2
        className="mb-3 text-xl sm:text-2xl"
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          color: "var(--dl-text-primary, #1B2030)",
        }}
      >
        Working on it.
      </h2>

      <p
        className="mb-2 text-sm leading-relaxed"
        style={{ color: "var(--dl-text-secondary, #454B5E)" }}
      >
        {body}
      </p>

      {eta && (
        <p
          className="mb-6 text-xs"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          Estimated return: {eta}
        </p>
      )}

      {!eta && <div className="mb-4" />}

      <div
        className="mb-6 h-px w-full"
        style={{ background: "rgba(0,0,0,0.06)" }}
        aria-hidden
      />

      <button
        type="button"
        onClick={refresh}
        className="btn-primary focus-ring"
      >
        Refresh
      </button>
    </div>
  );
}

export default MaintenanceCard;
