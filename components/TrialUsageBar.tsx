import Link from "next/link";

/**
 * TrialUsageBar — shows usage across all 4 free-tier caps with progress bars.
 *
 * Server component designed for the /dashboard page. Renders only for
 * free-plan users. Shows an upgrade CTA when any usage exceeds 80%.
 *
 * Uses the Discovery Labs design system: #4A6FA5 primary, glass card style,
 * cool blue-grey palette.
 */

interface UsageItem {
  label: string;
  used: number;
  limit: number;
}

interface TrialUsageBarProps {
  /** Number of analyses the user has run. */
  analysisCount: number;
  /** Number of essays reviewed. */
  essayCount?: number;
  /** Number of chat messages sent. */
  chatCount?: number;
  /** Number of colleges saved. */
  collegeCount?: number;
  /** Maximum analyses allowed on free plan (default 5). */
  limit?: number;
}

function UsageRow({ label, used, limit }: UsageItem) {
  const capped = Math.min(used, limit);
  const pct = Math.round((capped / limit) * 100);
  const isNearLimit = pct >= 80;
  const isAtLimit = capped >= limit;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p
          className="text-[12px] font-medium"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          {label}
        </p>
        <p
          className="text-[12px] font-bold tabular-nums"
          style={{ color: isAtLimit ? "#EF4444" : isNearLimit ? "#4A6FA5" : "var(--dl-text-muted, #5A6275)" }}
        >
          {capped}/{limit}
        </p>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: isAtLimit ? "#EF4444" : isNearLimit ? "#4A6FA5" : "rgba(74,111,165,0.5)",
          }}
        />
      </div>
    </div>
  );
}

export function TrialUsageBar({
  analysisCount,
  essayCount = 0,
  chatCount = 0,
  collegeCount = 0,
  limit = 5,
}: TrialUsageBarProps) {
  const items: UsageItem[] = [
    { label: "Profile analyses", used: analysisCount, limit },
    { label: "Essay reviews", used: essayCount, limit },
    { label: "Chat messages", used: chatCount, limit },
    { label: "Colleges saved", used: collegeCount, limit: 8 },
  ];

  const anyNearLimit = items.some((i) => Math.round((Math.min(i.used, i.limit) / i.limit) * 100) >= 80);
  const anyAtLimit = items.some((i) => Math.min(i.used, i.limit) >= i.limit);
  const totalPct = Math.round(
    items.reduce((sum, i) => sum + Math.min(i.used, i.limit) / i.limit, 0) / items.length * 100,
  );

  return (
    <section
      className="mb-6 border p-5"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: anyNearLimit ? "rgba(74,111,165,0.18)" : "rgba(0,0,0,0.06)",
        borderRadius: "14px",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-[13px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)" }}
        >
          Free plan usage
        </p>
        {anyNearLimit && (
          <Link
            href="/pricing"
            className="text-[12px] font-bold transition-colors hover:opacity-80"
            style={{ color: "#4A6FA5" }}
          >
            {anyAtLimit ? "Upgrade to continue" : "Remove Free-plan caps"} &rarr;
          </Link>
        )}
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <UsageRow key={item.label} {...item} />
        ))}
      </div>

      {anyNearLimit && !anyAtLimit && (
        <p
          className="mt-3 text-[12px]"
          style={{ color: "var(--dl-text-muted, #5A6275)" }}
        >
          You&apos;re approaching your Free-plan limits. Upgrade to Pro ($19.99/mo) to remove those caps.
        </p>
      )}

      {anyAtLimit && (
        <p
          className="mt-3 text-[12px]"
          style={{ color: "#EF4444" }}
        >
          You&apos;ve hit a free plan limit.{" "}
          <Link
            href="/pricing"
            className="font-semibold underline underline-offset-2"
            style={{ color: "#4A6FA5" }}
          >
            Upgrade to Pro
          </Link>{" "}
          to remove the Free-plan caps for analyses, essays, chat, and college saves.
        </p>
      )}
    </section>
  );
}
