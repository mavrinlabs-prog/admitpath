"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

/**
 * Small entry point to the AI counselor. The floating widget was removed from
 * the global layout, so this links to the dedicated counselor page instead.
 */
export function OpenCounselorButton() {
  return (
    <Link
      href="/counselor"
      prefetch={false}
      aria-label="Open AI counselor chat"
      className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(74,111,165,0.08)]"
      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
    >
      <MessageCircle size={18} strokeWidth={1.75} />
    </Link>
  );
}
