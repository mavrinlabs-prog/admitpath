/**
 * Three columned squares (kanban) -- line-art empty state for colleges.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function EmptyColleges({ className, size = 120, title }: Props) {
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
      {/* column 1 */}
      <rect x="14" y="28" width="34" height="84" rx="4" stroke="#4A6FA5" />
      <rect x="20" y="36" width="22" height="14" rx="2" stroke="#4A6FA5" opacity="0.5" />
      <rect x="20" y="56" width="22" height="14" rx="2" stroke="#4A6FA5" opacity="0.5" />
      {/* column 2 */}
      <rect x="53" y="28" width="34" height="84" rx="4" stroke="#4A6FA5" />
      <rect x="59" y="36" width="22" height="14" rx="2" stroke="#4A6FA5" opacity="0.5" />
      <rect x="59" y="56" width="22" height="14" rx="2" stroke="#4A6FA5" opacity="0.5" />
      <rect x="59" y="76" width="22" height="14" rx="2" stroke="#4A6FA5" opacity="0.5" />
      {/* column 3 */}
      <rect x="92" y="28" width="34" height="84" rx="4" stroke="#4A6FA5" />
      <rect x="98" y="36" width="22" height="14" rx="2" stroke="#4A6FA5" opacity="0.5" />
      {/* column headers */}
      <line x1="20" y1="20" x2="42" y2="20" stroke="#2E4A6E" opacity="0.55" />
      <line x1="59" y1="20" x2="81" y2="20" stroke="#2E4A6E" opacity="0.55" />
      <line x1="98" y1="20" x2="120" y2="20" stroke="#2E4A6E" opacity="0.55" />
    </svg>
  );
}

export default EmptyColleges;
