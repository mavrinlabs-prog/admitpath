/**
 * Minimal radar-chart line-art illustration.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 * aria-hidden by default; pass `title` to expose to assistive tech.
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function EmptyAnalyses({ className, size = 120, title }: Props) {
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
      {/* outer pentagon */}
      <polygon points="70,18 122,55 102,118 38,118 18,55" stroke="#D5DCE8" />
      {/* mid pentagon */}
      <polygon points="70,42 102,65 90,108 50,108 38,65" stroke="#4A6FA5" opacity="0.35" />
      {/* inner pentagon */}
      <polygon points="70,66 82,75 78,96 62,96 58,75" stroke="#4A6FA5" opacity="0.2" />
      {/* spokes */}
      <line x1="70" y1="18" x2="70" y2="118" stroke="#D5DCE8" opacity="0.6" />
      <line x1="18" y1="55" x2="122" y2="55" stroke="#D5DCE8" opacity="0.6" />
      <line x1="38" y1="118" x2="102" y2="55" stroke="#D5DCE8" opacity="0.6" />
      <line x1="102" y1="118" x2="38" y2="55" stroke="#D5DCE8" opacity="0.6" />
      {/* data shape */}
      <polygon points="70,30 110,62 92,104 52,98 32,68" stroke="#4A6FA5" strokeWidth={1.8} />
      {/* vertex dots */}
      <circle cx="70" cy="30" r="2.5" fill="#4A6FA5" stroke="none" />
      <circle cx="110" cy="62" r="2.5" fill="#4A6FA5" stroke="none" />
      <circle cx="92" cy="104" r="2.5" fill="#4A6FA5" stroke="none" />
      <circle cx="52" cy="98" r="2.5" fill="#4A6FA5" stroke="none" />
      <circle cx="32" cy="68" r="2.5" fill="#4A6FA5" stroke="none" />
    </svg>
  );
}

export default EmptyAnalyses;
