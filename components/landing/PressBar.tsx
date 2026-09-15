/**
 * Press / "Calibrated against admissions data from" bar.
 *
 * Infinite-scroll marquee of school names for social proof polish.
 * Pure server component — CSS-only animation, no client JS.
 * The track is duplicated so the loop is seamless.
 */
const SCHOOLS = [
  "MIT",
  "Stanford",
  "Harvard",
  "Princeton",
  "Yale",
  "UC Berkeley",
  "Columbia",
  "UPenn",
  "Caltech",
  "Duke",
];

export function PressBar() {
  // Duplicate the list so the marquee loops seamlessly
  const doubled = [...SCHOOLS, ...SCHOOLS];

  return (
    <section
      aria-label="Calibrated against admissions data from"
      style={{
        borderTop: "1px solid rgba(0, 0, 0, 0.06)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        background: "rgba(255, 255, 255, 0.4)",
        padding: "28px 0",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "var(--dl-text-secondary)",
          textTransform: "uppercase",
          fontFamily: "var(--dl-font-sans)",
          margin: "0 0 16px",
          textAlign: "center",
        }}
      >
        Calibrated against admissions data from
      </p>

      <div className="dl-marquee-track">
        {doubled.map((s, i) => (
          <span
            key={`${s}-${i}`}
            style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "var(--dl-text-primary)",
              fontFamily: "var(--dl-font-sans)",
              padding: "0 32px",
              whiteSpace: "nowrap",
              opacity: 0.7,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
