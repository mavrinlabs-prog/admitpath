import Link from "next/link";
import { LogoMark } from "@/components/admitpath-logo";
import { Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/parent", label: "For Parents" },
  { href: "/for-schools", label: "For Schools" },
  { href: "/counselor-toolkit", label: "For Counselors" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function MarketingNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300"
      style={{
        backgroundColor: "rgba(213,220,232,0.88)",
        borderColor: "rgba(0,0,0,0.06)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          <Link
            href="/"
            aria-label="AdmitPath home"
            className="flex items-center gap-2.5 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
          >
            <LogoMark size={32} />
            <span
              className="text-lg font-bold"
              style={{ color: "var(--dl-text-primary, #1B2030)" }}
            >
              AdmitPath
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className="text-[13px] font-medium transition-colors duration-200 hover:text-[#4A6FA5]"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/sign-up" prefetch={false} className="dl-btn dl-btn-primary dl-btn-sm">
              Get Started
            </Link>
            <details className="group relative md:hidden">
              <summary
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-black/10 bg-white/50 text-[#1B2030] [&::-webkit-details-marker]:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </summary>
              <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-black/10 bg-white p-2 shadow-xl">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#454B5E] hover:bg-[#4A6FA5]/10 hover:text-[#2E4A6E]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
