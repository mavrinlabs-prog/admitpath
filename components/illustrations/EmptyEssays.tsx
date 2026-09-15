/**
 * Stack of papers with a pencil -- line-art empty state for essays.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function EmptyEssays({ className, size = 120, title }: Props) {
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
      {/* back paper */}
      <rect x="34" y="22" width="64" height="80" rx="4" stroke="#D5DCE8" opacity="0.8" />
      {/* mid paper */}
      <rect x="28" y="32" width="64" height="80" rx="4" stroke="#4A6FA5" opacity="0.5" />
      {/* front paper */}
      <rect x="22" y="42" width="64" height="80" rx="4" stroke="#4A6FA5" />
      {/* text lines */}
      <line x1="32" y1="58" x2="76" y2="58" stroke="#4A6FA5" opacity="0.6" />
      <line x1="32" y1="68" x2="72" y2="68" stroke="#4A6FA5" opacity="0.6" />
      <line x1="32" y1="78" x2="76" y2="78" stroke="#4A6FA5" opacity="0.6" />
      <line x1="32" y1="88" x2="62" y2="88" stroke="#4A6FA5" opacity="0.6" />
      <line x1="32" y1="98" x2="68" y2="98" stroke="#4A6FA5" opacity="0.6" />
      {/* pencil */}
      <g transform="rotate(38 100 70)">
        <rect x="80" y="64" width="46" height="12" rx="2" stroke="#2E4A6E" />
        <line x1="92" y1="64" x2="92" y2="76" stroke="#2E4A6E" />
        <path d="M126 64 L132 70 L126 76 Z" stroke="#2E4A6E" fill="#D5DCE8" />
        <line x1="80" y1="64" x2="80" y2="76" stroke="#2E4A6E" />
      </g>
    </svg>
  );
}

export default EmptyEssays;
