/**
 * Open notebook with a small bookmark -- line-art empty state for dashboard.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function EmptyDashboard({ className, size = 120, title }: Props) {
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
      {/* left page */}
      <path d="M70 36 Q52 28 22 30 L22 110 Q52 108 70 116 Z" stroke="#4A6FA5" />
      {/* right page */}
      <path d="M70 36 Q88 28 118 30 L118 110 Q88 108 70 116 Z" stroke="#4A6FA5" />
      {/* spine */}
      <line x1="70" y1="36" x2="70" y2="116" stroke="#2E4A6E" />
      {/* left lines */}
      <line x1="32" y1="48" x2="60" y2="50" stroke="#4A6FA5" opacity="0.5" />
      <line x1="32" y1="60" x2="60" y2="62" stroke="#4A6FA5" opacity="0.5" />
      <line x1="32" y1="72" x2="56" y2="74" stroke="#4A6FA5" opacity="0.5" />
      {/* right lines */}
      <line x1="80" y1="50" x2="108" y2="48" stroke="#4A6FA5" opacity="0.5" />
      <line x1="80" y1="62" x2="108" y2="60" stroke="#4A6FA5" opacity="0.5" />
      <line x1="80" y1="74" x2="104" y2="72" stroke="#4A6FA5" opacity="0.5" />
      {/* bookmark */}
      <path d="M96 28 L96 52 L102 46 L108 52 L108 28 Z" stroke="#2E4A6E" fill="#D5DCE8" opacity="0.7" />
    </svg>
  );
}

export default EmptyDashboard;
