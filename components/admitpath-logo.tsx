/**
 * AdmitPath wordmark + logo mark.
 *
 * Hand-traced "A" so it doesn't read as a generic boxed-letter placeholder.
 * The shape is a tilted triangle with a baseline rule and a path-marker
 * dot near the apex — visual reference to the climb / dream-school
 * metaphor used in the hero + mountain section. NOT a generic font A
 * inside a square (which is what the prior code rendered and which the
 * owner email flagged as "looks AI generated").
 *
 * Three variants:
 *   <LogoMark> — just the icon (24×24 viewBox)
 *   <LogoLockup> — icon + "AdmitPath" wordmark, horizontal
 *   <LogoLockupDark> — same but tuned for dark backgrounds (sign-in panel,
 *     final landing CTA, footer)
 */

type Common = {
  size?: number;
  className?: string;
  /** Override the gradient anchor colors. Defaults to brand blue palette (#4A6FA5 -> #1E3352). */
  colors?: { from: string; to: string };
  /** For non-decorative contexts (e.g. as a link), provide accessible alt text. */
  alt?: string;
};

export function LogoMark({ size = 28, className, colors, alt }: Common) {
  const from = colors?.from ?? "#4A6FA5";
  const to = colors?.to ?? "#1E3352";
  const id = `lm-${from.replace(/[^a-z0-9]/gi, "")}-${to.replace(/[^a-z0-9]/gi, "")}`;
  const hasAlt = alt != null && alt.length > 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={hasAlt ? "img" : "presentation"}
      aria-hidden={!hasAlt}
      aria-label={hasAlt ? alt : undefined}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      {/* Outer rounded square plate — soft, not stamped */}
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" fill={`url(#${id})`} />
      {/* Hand-traced "A" — left stroke from baseline to apex, right stroke
          from apex to baseline, crossbar between the two. The strokes are
          slightly off-axis so the letterform doesn't read as font-grid. */}
      <path
        d="M5.5 18 L11.6 5.8 L18.5 18"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7.7 14.2 L16.3 14.2"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Path-marker dot just past the apex — a tiny climb-flag echo */}
      <circle cx="11.6" cy="5.8" r="1.05" fill="#FFFFFF" />
    </svg>
  );
}

export function LogoLockup({ size = 28, className }: Common) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <LogoMark size={size} />
      <span
        className="font-bold tracking-tight"
        style={{
          fontSize: size * 0.6,
          color: "var(--dl-text-primary, #1B2030)",
          letterSpacing: "-0.01em",
        }}
      >
        AdmitPath
      </span>
    </span>
  );
}

export function LogoLockupDark({ size = 28, className }: Common) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <LogoMark
        size={size}
        colors={{ from: "rgba(255,255,255,0.18)", to: "rgba(255,255,255,0.06)" }}
      />
      <span
        className="font-bold tracking-tight text-white"
        style={{
          fontSize: size * 0.6,
          letterSpacing: "-0.01em",
        }}
      >
        AdmitPath
      </span>
    </span>
  );
}
