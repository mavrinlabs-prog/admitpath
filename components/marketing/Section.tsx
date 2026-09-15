import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

export function Section({
  title,
  Icon,
  children,
  description,
  id,
}: {
  title: string;
  Icon: LucideIcon;
  children: React.ReactNode;
  description?: string;
  id?: string;
}) {
  const headingId = id ?? `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <ScrollReveal>
      <section className="mb-12" aria-labelledby={headingId}>
        <h2
          id={headingId}
          className="mb-2 flex items-center gap-2 text-[22px] font-semibold"
          style={{ color: "var(--dl-text-primary, #1B2030)" }}
        >
          <Icon className="h-5 w-5" style={{ color: "#4A6FA5" }} aria-hidden />
          {title}
        </h2>
        {description && (
          <p className="mb-3 text-[14px] leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            {description}
          </p>
        )}
        {children}
      </section>
    </ScrollReveal>
  );
}
