import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap" style={{ fontSize: 13 }}>
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: "var(--dl-text-muted, #8890A5)" }}
                  aria-hidden
                />
              )}
              {isLast || !crumb.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-medium"
                  style={{
                    color: isLast
                      ? "var(--dl-brand, #4A6FA5)"
                      : "var(--dl-text-muted, #8890A5)",
                  }}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="font-medium transition-colors duration-200"
                  style={{ color: "var(--dl-text-muted, #8890A5)" }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
