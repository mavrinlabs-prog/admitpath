/**
 * Abstract broken-cube / disconnected-line illustration for error pages.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function Error500({ className, size = 140, title }: Props) {
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
      {/* upper-left half of cube */}
      <path d="M70 22 L106 36 L106 56" stroke="#4A6FA5" />
      <path d="M70 22 L34 36 L34 84 L60 96" stroke="#4A6FA5" />
      <path d="M34 36 L70 50 L70 70" stroke="#4A6FA5" />
      <path d="M70 50 L106 36" stroke="#4A6FA5" />
      {/* lower-right detached half (offset to imply break) */}
      <g transform="translate(8 10)">
        <path d="M70 70 L106 84 L106 104 L70 118 L70 98" stroke="#2E4A6E" opacity="0.85" />
        <path d="M106 84 L106 56" stroke="#2E4A6E" opacity="0.85" />
        <path d="M70 70 L70 98" stroke="#2E4A6E" opacity="0.85" />
      </g>
      {/* spark / fracture marks between halves */}
      <line x1="64" y1="74" x2="72" y2="82" stroke="#D5DCE8" opacity="0.8" />
      <line x1="74" y1="70" x2="82" y2="78" stroke="#D5DCE8" opacity="0.8" />
      <line x1="58" y1="84" x2="66" y2="92" stroke="#D5DCE8" opacity="0.8" />
    </svg>
  );
}

export default Error500;
