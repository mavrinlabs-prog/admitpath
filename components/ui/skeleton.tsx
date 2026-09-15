import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-xl ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  const widths = ["100%", "92%", "78%", "85%", "65%"];
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3.5 rounded-md"
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-[14px] p-5 flex flex-col gap-4"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-2/5 rounded-md" />
          <Skeleton className="h-3 w-1/4 rounded-md" />
        </div>
      </div>
      {/* Body */}
      <SkeletonText lines={3} />
      {/* Footer */}
      <div className="flex items-center gap-3 pt-1">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

const AVATAR_SIZES = { sm: 32, md: 40, lg: 56 } as const;

export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const px = AVATAR_SIZES[size];
  return (
    <Skeleton
      className="rounded-full shrink-0"
      style={{ width: px, height: px }}
    />
  );
}
