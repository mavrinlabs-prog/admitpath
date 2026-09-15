/**
 * Abstract compass-needle-off-course illustration for 404 pages.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 * Suggests "lost direction" without being cute or cartoonish.
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function Error404({ className, size = 140, title }: Props) {
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
      {/* Outer compass ring */}
      <circle cx="70" cy="70" r="48" stroke="#D5DCE8" opacity="0.6" />
      <circle cx="70" cy="70" r="42" stroke="#D5DCE8" opacity="0.3" />
      {/* Cardinal ticks */}
      <line x1="70" y1="22" x2="70" y2="30" stroke="#4A6FA5" opacity="0.5" />
      <line x1="70" y1="110" x2="70" y2="118" stroke="#4A6FA5" opacity="0.5" />
      <line x1="22" y1="70" x2="30" y2="70" stroke="#4A6FA5" opacity="0.5" />
      <line x1="110" y1="70" x2="118" y2="70" stroke="#4A6FA5" opacity="0.5" />
      {/* Compass needle - askew / off-center to suggest being lost */}
      <line x1="70" y1="70" x2="48" y2="38" stroke="#2E4A6E" strokeWidth="2.5" opacity="0.85" />
      <line x1="70" y1="70" x2="92" y2="102" stroke="#4A6FA5" strokeWidth="2" opacity="0.5" />
      {/* Center dot */}
      <circle cx="70" cy="70" r="3" fill="#4A6FA5" stroke="none" opacity="0.6" />
      {/* Dashed path suggesting a lost route */}
      <path
        d="M30 105 Q50 90 55 75 Q60 60 80 55 Q100 50 115 35"
        strokeDasharray="4 6"
        stroke="#D5DCE8"
        opacity="0.5"
        strokeWidth="1.5"
      />
      {/* Question mark accent */}
      <path d="M98 28 Q104 24 104 32 Q104 36 98 38" stroke="#4A6FA5" opacity="0.45" strokeWidth="1.5" />
      <circle cx="98" cy="44" r="1" fill="#4A6FA5" stroke="none" opacity="0.4" />
    </svg>
  );
}

export default Error404;
