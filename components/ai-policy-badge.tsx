/**
 * AiPolicyBadge — small chip surfacing a school's AI policy in the
 * essay editor and college detail page. Honest defaults: when a
 * school has not stated a policy, we render "Policy Unstated" rather
 * than green-light AI use.
 */

import { Bot } from "lucide-react";
import {
  AI_POLICY_STYLES,
  getAiPolicy,
  type AiPolicy,
} from "@/lib/ai-policy";

type Props = {
  /** College slug (matches data/colleges.ts). */
  slug: string;
  /** Show the 1-line summary inline instead of as a tooltip. */
  showSummary?: boolean;
  /** Visual size. */
  size?: "sm" | "md";
};

export function AiPolicyBadge({ slug, showSummary, size = "sm" }: Props) {
  const detail = getAiPolicy(slug);
  const style = AI_POLICY_STYLES[detail.policy];

  // Contextual icon for policy severity
  const policyEmphasis = detail.policy === "prohibited"
    ? "This school does NOT allow AI in essays."
    : detail.policy === "discouraged"
    ? "Use AI feedback cautiously with this school."
    : detail.policy === "permitted"
    ? "This school allows AI as a writing tool."
    : "No public AI policy -- treat as discouraged.";

  return (
    <div>
      <span
        className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider ${
          size === "md" ? "px-3 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]"
        }`}
        style={{ background: style.bg, color: style.fg }}
        title={detail.summary}
        role="status"
        aria-label={`AI policy: ${style.label}. ${policyEmphasis}`}
      >
        <Bot className={size === "md" ? "h-3 w-3" : "h-2.5 w-2.5"} aria-hidden />
        {style.label}
      </span>
      {showSummary && (
        <p
          className="mt-1 text-[12px] leading-relaxed"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          {detail.summary}
        </p>
      )}
      {detail.source && showSummary && (
        <a
          href={detail.source}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-block text-[10px] underline"
          style={{ color: "#4A6FA5" }}
        >
          View official policy
        </a>
      )}
    </div>
  );
}

export type { AiPolicy };
