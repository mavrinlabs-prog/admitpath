import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AUDIENCE_LINKS } from "./nav-links";

/** "Who it's for" submenu — CSS-only (details/summary), no client JS. */
export function AudienceMenu({ className = "" }: { className?: string }) {
  return (
    <details className={`group relative ${className}`}>
      <summary className="flex cursor-pointer list-none items-center gap-1 text-[13px] font-medium text-[#454B5E] hover:text-[#2E4A6E] [&::-webkit-details-marker]:hidden">
        Who it&apos;s for <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="absolute left-0 top-8 z-50 w-56 rounded-lg border border-black/10 bg-white p-2 shadow-xl">
        {AUDIENCE_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className="block rounded-md px-3 py-2 text-sm font-medium text-[#454B5E] hover:bg-[#4A6FA5]/10 hover:text-[#2E4A6E]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
