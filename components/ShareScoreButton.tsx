"use client";

import { useCallback, useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface ShareScoreButtonProps {
  score: number;
  spike?: number;
  academic?: number;
  leadership?: number;
  awards?: number;
  depth?: number;
  essay?: number;
  recs?: number;
  name?: string;
  /** Optional className override */
  className?: string;
}

/**
 * ShareScoreButton — viral loop component.
 *
 * Copies a share link or opens the native share sheet (Web Share API on
 * mobile). The shared text includes the student's score and a link back
 * to admith.vercel.app/quiz to drive signups.
 *
 * The share URL points to /api/share which generates a branded OG image
 * so Twitter/iMessage/Instagram previews show the score card automatically.
 */
export function ShareScoreButton({
  score,
  spike = 0,
  academic = 0,
  leadership = 0,
  awards = 0,
  depth = 0,
  essay = 0,
  recs = 0,
  name = "Student",
  className,
}: ShareScoreButtonProps) {
  const [copied, setCopied] = useState(false);

  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://admith.vercel.app";

  const shareUrl = `${base}/api/share?score=${score}&spike=${spike}&academic=${academic}&leadership=${leadership}&awards=${awards}&depth=${depth}&essay=${essay}&recs=${recs}&name=${encodeURIComponent(name)}`;
  const quizUrl = `${base}/quiz`;

  const shareText = `I scored ${score}/100 on AdmitPath! See where you stand: ${quizUrl}`;

  const handleShare = useCallback(async () => {
    // Try native Web Share API first (mobile + some desktop browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `My AdmitPath Score: ${score}/100`,
          text: shareText,
          url: quizUrl,
        });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Last resort: prompt-based copy
      if (typeof window !== "undefined") {
        window.prompt("Copy this link:", shareText);
      }
    }
  }, [score, shareText, quizUrl]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied to clipboard" : `Share your score of ${score} out of 100`}
      className={
        className ||
        "dl-btn dl-btn-primary dl-btn-sm inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] focus-visible:ring-offset-2 transition-transform duration-200 active:scale-[0.97]"
      }
      style={{ minWidth: 160 }}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" strokeWidth={2} aria-hidden />
          Share your score
        </>
      )}
    </button>
  );
}
