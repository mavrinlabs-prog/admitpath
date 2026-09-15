import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MarketingCTA({
  headline,
  heading,
  description,
  buttonText,
  buttonHref = "/sign-up",
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  headline?: string;
  heading?: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  const resolvedHeadline = headline || heading || "Get started";
  const resolvedButtonText = buttonText || primaryLabel || "Get started";
  const resolvedButtonHref = primaryHref || buttonHref;

  return (
    <section
      aria-label={resolvedHeadline}
      className="p-8 sm:p-10 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #4A6FA5, #1E3352)",
        color: "#fff",
        borderRadius: "24px",
      }}
    >
      {/* Subtle radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.06), transparent)",
        }}
      />
      <div className="relative">
        <h2
          className="mb-3 text-2xl sm:text-3xl font-extrabold tracking-tight"
          style={{ opacity: 0.97, letterSpacing: "-0.02em" }}
        >
          {resolvedHeadline}
        </h2>
        <p
          className="mb-6 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          style={{ opacity: 0.9 }}
        >
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={resolvedButtonHref}
            className="dl-btn dl-btn-secondary dl-btn-xl inline-flex items-center gap-2 transition-transform duration-200 hover:-translate-y-0.5"
          >
            {resolvedButtonText}
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {secondaryLabel}
              <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
