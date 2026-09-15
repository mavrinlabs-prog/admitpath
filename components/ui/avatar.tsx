import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: 32, md: 40, lg: 56 } as const;
const ICON_SIZES = { sm: 14, md: 18, lg: 24 } as const;
const TEXT_SIZES = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function Avatar({ src, alt, name, size = "md", className = "" }: AvatarProps) {
  const px = SIZES[size];

  const containerStyle: React.CSSProperties = {
    width: px,
    height: px,
    border: "2px solid rgba(0,0,0,0.06)",
  };

  // Image avatar
  if (src) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 ${className}`}
        style={containerStyle}
      >
        <Image
          src={src}
          alt={alt ?? name ?? "Avatar"}
          fill
          className="object-cover"
          sizes={`${px}px`}
        />
      </div>
    );
  }

  // Initials fallback
  if (name) {
    return (
      <div
        className={`flex items-center justify-center rounded-full shrink-0 ${TEXT_SIZES[size]} font-semibold text-white select-none ${className}`}
        style={{
          ...containerStyle,
          background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)",
        }}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  // Generic fallback
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{
        ...containerStyle,
        background: "rgba(74,111,165,0.08)",
      }}
      aria-label="User"
    >
      <User
        style={{ width: ICON_SIZES[size], height: ICON_SIZES[size], color: "#8890A5" }}
      />
    </div>
  );
}
