import { SAMPLE_PROFILE, lowestDimension } from "@/components/landing/sample-profile";

/**
 * "Maya R." profile report card — the /analyze report preview.
 *
 * Real HTML/CSS (no image): overall 81/100 ring, all 7 dimension scores with
 * bars, and the priority-gap callout. Server-renderable (no hooks) so it can
 * appear in the hero, the /analyze empty state, and anywhere else without
 * shipping client JS. Responsive down to 320px.
 */
export function ProfileReportPreview({
  compact = false,
  showUrlBar = true,
  className = "",
}: {
  compact?: boolean;
  showUrlBar?: boolean;
  className?: string;
}) {
  const gap = lowestDimension();
  const ring = 2 * Math.PI * 30;
  const offset = ring * (1 - SAMPLE_PROFILE.overall / 100);

  return (
    <figure
      className={`ap-report-card ${className}`}
      aria-label={`Example AdmitPath profile report for ${SAMPLE_PROFILE.name}: overall ${SAMPLE_PROFILE.overall} out of 100, priority gap ${gap.label}`}
    >
      {showUrlBar && (
        <div className="ap-report-chrome" aria-hidden>
          <span className="ap-report-dot" />
          <span className="ap-report-dot" />
          <span className="ap-report-dot" />
          <span className="ap-report-url">admith.vercel.app/analyze</span>
        </div>
      )}

      <div className={compact ? "ap-report-body ap-report-body--compact" : "ap-report-body"}>
        <header className="ap-report-header">
          <div className="ap-report-identity">
            <span className="ap-report-avatar" aria-hidden>{SAMPLE_PROFILE.initials}</span>
            <div className="min-w-0">
              <p className="ap-report-eyebrow">Profile report · Example</p>
              <p className="ap-report-name">
                {SAMPLE_PROFILE.name}
                <span className="ap-report-detail">{SAMPLE_PROFILE.detail}</span>
              </p>
            </div>
          </div>
          <div className="ap-report-score" aria-hidden>
            <svg viewBox="0 0 72 72" width="72" height="72" role="presentation">
              <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(74,111,165,0.14)" strokeWidth="7" />
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="var(--dl-brand, #4A6FA5)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={ring}
                strokeDashoffset={offset}
                transform="rotate(-90 36 36)"
              />
            </svg>
            <span className="ap-report-score-value">
              {SAMPLE_PROFILE.overall}
              <small>/100</small>
            </span>
          </div>
        </header>

        <div className="ap-report-meta">
          <span className="ap-report-chip">{SAMPLE_PROFILE.band}</span>
          <span className="ap-report-meta-text">7-dimension score · calibrated to CDS factors</span>
        </div>

        <ul className="ap-report-dims">
          {SAMPLE_PROFILE.dimensions.map((dimension) => {
            const isGap = dimension.key === gap.key;
            return (
              <li key={dimension.key} className={isGap ? "ap-report-dim ap-report-dim--gap" : "ap-report-dim"}>
                <span className="ap-report-dim-label">{dimension.label}</span>
                <span className="ap-report-bar" aria-hidden>
                  <span className="ap-report-bar-fill" style={{ width: `${dimension.score}%` }} />
                </span>
                <span className="ap-report-dim-score">{dimension.score}</span>
              </li>
            );
          })}
        </ul>

        <div className="ap-report-gap">
          <p className="ap-report-gap-title">
            Priority gap · {SAMPLE_PROFILE.priorityGap.dimension} {SAMPLE_PROFILE.priorityGap.score}
          </p>
          <p className="ap-report-gap-text">{SAMPLE_PROFILE.priorityGap.summary}</p>
          {!compact && <p className="ap-report-gap-next">Next step: {SAMPLE_PROFILE.priorityGap.nextStep}</p>}
        </div>
      </div>
    </figure>
  );
}
