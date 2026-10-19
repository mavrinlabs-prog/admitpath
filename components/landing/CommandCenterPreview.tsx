import { ArrowRight, Brain, GraduationCap, PenLine } from "lucide-react";
import { SAMPLE_PROFILE } from "@/components/landing/sample-profile";

/**
 * "Inside the product" command-center preview. Exactly the sections the owner
 * asked for: Maya R., overall score, Top 18%, full 7-dimension breakdown,
 * Run Analysis / Essay Feedback / College List actions, action plan, and
 * profile completion. Static, server-rendered HTML; example data only.
 */
const ACTIONS = [
  { Icon: Brain, label: "Run Analysis", hint: "Re-score after updates" },
  { Icon: PenLine, label: "Essay Feedback", hint: "6-dimension review" },
  { Icon: GraduationCap, label: "College List", hint: "Reach · target · likely" },
];

export function CommandCenterPreview() {
  return (
    <div
      className="ap-cc"
      role="img"
      aria-label={`Example AdmitPath dashboard for ${SAMPLE_PROFILE.name}: overall score ${SAMPLE_PROFILE.overall}, ${SAMPLE_PROFILE.percentileLabel}, seven-dimension breakdown, quick actions, action plan, and profile ${SAMPLE_PROFILE.completion}% complete`}
    >
      <div className="ap-cc-top">
        <div className="flex min-w-0 items-center gap-3">
          <span className="ap-report-avatar" aria-hidden>{SAMPLE_PROFILE.initials}</span>
          <div className="min-w-0">
            <p className="ap-report-eyebrow">Dashboard · Example</p>
            <p className="truncate text-[15px] font-bold" style={{ color: "var(--dl-text-primary)" }}>
              Welcome back, {SAMPLE_PROFILE.name}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2" style={{ background: "var(--dl-bg-page)", border: "1px solid var(--dl-border)" }}>
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--dl-text-muted)" }}>Overall score</p>
            <p className="text-[26px] font-extrabold leading-none tabular-nums" style={{ color: "var(--dl-brand)" }}>
              {SAMPLE_PROFILE.overall}
              <span className="text-[11px] font-semibold" style={{ color: "var(--dl-text-muted)" }}>/100</span>
            </p>
          </div>
          <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ background: "rgba(77,166,122,0.12)", color: "#2F7A55" }}>
            {SAMPLE_PROFILE.percentileLabel}
          </span>
        </div>
      </div>

      <div className="ap-cc-grid">
        <div className="grid gap-4">
          <section className="ap-cc-panel" aria-label="7-dimension breakdown">
            <p className="ap-cc-label">7-dimension breakdown</p>
            <ul className="ap-report-dims">
              {SAMPLE_PROFILE.dimensions.map((dimension) => (
                <li key={dimension.key} className="ap-report-dim">
                  <span className="ap-report-dim-label">{dimension.label}</span>
                  <span className="ap-report-bar" aria-hidden>
                    <span className="ap-report-bar-fill" style={{ width: `${dimension.score}%` }} />
                  </span>
                  <span className="ap-report-dim-score">{dimension.score}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="ap-cc-actions">
            {ACTIONS.map(({ Icon, label, hint }) => (
              <div key={label} className="ap-cc-action">
                <span className="ap-cc-action-icon"><Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden /></span>
                {label}
                <span className="text-[11px] font-medium" style={{ color: "var(--dl-text-muted)" }}>{hint}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--dl-brand)" }}>
                  Open <ArrowRight className="h-3 w-3" aria-hidden />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid content-start gap-4">
          <section className="ap-cc-panel" aria-label="Action plan">
            <p className="ap-cc-label">Action plan</p>
            <ul className="ap-cc-plan">
              {SAMPLE_PROFILE.actionPlan.map((item) => (
                <li key={item.text}>
                  <span className={item.done ? "ap-cc-check ap-cc-check--done" : "ap-cc-check"} aria-hidden>
                    {item.done ? "✓" : ""}
                  </span>
                  <span style={item.done ? { textDecoration: "line-through", color: "var(--dl-text-muted)" } : undefined}>
                    {item.text}
                  </span>
                  <span className="ap-cc-priority">{item.priority}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="ap-cc-panel" aria-label="Profile completion">
            <div className="flex items-center justify-between">
              <p className="ap-cc-label" style={{ margin: 0 }}>Profile completion</p>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: "var(--dl-brand)" }}>{SAMPLE_PROFILE.completion}%</span>
            </div>
            <div className="ap-report-bar mt-3" aria-hidden>
              <span className="ap-report-bar-fill" style={{ width: `${SAMPLE_PROFILE.completion}%` }} />
            </div>
            <p className="mt-2 text-[11.5px]" style={{ color: "var(--dl-text-muted)" }}>
              Add test scores and two awards to finish your profile.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
