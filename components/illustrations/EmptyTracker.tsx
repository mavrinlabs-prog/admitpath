/**
 * Checklist clipboard -- line-art empty state for application tracker.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function EmptyTracker({ className, size = 120, title }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 140 140"
      width={size}
      height={size}
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {/* clipboard body */}
      <rect x="30" y="28" width="80" height="100" rx="6" stroke="#4A6FA5" />
      {/* clipboard clip */}
      <path d="M56 28 L56 20 Q56 14 64 14 L76 14 Q84 14 84 20 L84 28" stroke="#2E4A6E" />
      <rect x="60" y="12" width="20" height="8" rx="3" stroke="#2E4A6E" opacity="0.6" />
      {/* checklist item 1 -- checked */}
      <rect x="40" y="42" width="14" height="14" rx="3" stroke="#4A6FA5" />
      <polyline points="43,49 47,53 54,44" stroke="#4A6FA5" strokeWidth="2" />
      <line x1="62" y1="49" x2="100" y2="49" stroke="#4A6FA5" opacity="0.5" />
      {/* checklist item 2 -- checked */}
      <rect x="40" y="64" width="14" height="14" rx="3" stroke="#4A6FA5" />
      <polyline points="43,71 47,75 54,66" stroke="#4A6FA5" strokeWidth="2" />
      <line x1="62" y1="71" x2="94" y2="71" stroke="#4A6FA5" opacity="0.5" />
      {/* checklist item 3 -- empty */}
      <rect x="40" y="86" width="14" height="14" rx="3" stroke="#D5DCE8" />
      <line x1="62" y1="93" x2="96" y2="93" stroke="#D5DCE8" opacity="0.7" />
      {/* checklist item 4 -- empty */}
      <rect x="40" y="108" width="14" height="14" rx="3" stroke="#D5DCE8" />
      <line x1="62" y1="115" x2="88" y2="115" stroke="#D5DCE8" opacity="0.7" />
    </svg>
  );
}

export default EmptyTracker;
