import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "./MarketingNav";
import { SiteFooter } from "./SiteFooter";

export function MarketingLayout({
  children,
  backHref = "/",
  backLabel = "Home",
  eyebrow,
  title,
  description,
  maxWidth = "max-w-3xl",
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  eyebrow: string;
  title: string;
  description: string;
  maxWidth?: string;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
      <MarketingNav />

      <main id="main" className={`page-enter mx-auto ${maxWidth} px-4 py-12 sm:py-16`}>
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#4A6FA5" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>

        <p className="dl-section-eyebrow">{eyebrow}</p>
        <h1
          className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3"
          style={{
            color: "var(--dl-text-primary, #1B2030)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        <p
          className="max-w-2xl text-[15px] leading-relaxed mb-12"
          style={{ color: "var(--dl-text-secondary, #454B5E)" }}
        >
          {description}
        </p>

        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
