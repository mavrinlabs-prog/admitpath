/**
 * Chat bubble with typing dots -- line-art empty state for chat.
 * Uses Discovery Labs brand colors (#4A6FA5 primary, #2E4A6E dark, #D5DCE8 bg).
 */
import * as React from "react";

type Props = { className?: string; size?: number; title?: string };

export function EmptyChat({ className, size = 120, title }: Props) {
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
      {/* big bubble */}
      <path
        d="M22 38 Q22 28 32 28 L100 28 Q110 28 110 38 L110 78 Q110 88 100 88 L52 88 L40 102 L40 88 L32 88 Q22 88 22 78 Z"
        stroke="#4A6FA5"
      />
      {/* typing dots */}
      <circle cx="50" cy="58" r="3" fill="#4A6FA5" stroke="none" />
      <circle cx="66" cy="58" r="3" fill="#4A6FA5" stroke="none" opacity="0.7" />
      <circle cx="82" cy="58" r="3" fill="#4A6FA5" stroke="none" opacity="0.4" />
      {/* small companion bubble */}
      <path
        d="M86 100 Q86 94 92 94 L120 94 Q126 94 126 100 L126 114 Q126 120 120 120 L104 120 L96 128 L96 120 L92 120 Q86 120 86 114 Z"
        stroke="#2E4A6E"
        opacity="0.5"
      />
    </svg>
  );
}

export default EmptyChat;
