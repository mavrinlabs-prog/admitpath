"use client";

import { useState } from "react";

/**
 * Client-only button that copies a referral URL to the clipboard.
 * Extracted from the dashboard (server component) because onClick
 * handlers cannot run in React Server Components.
 */
export function CopyReferralButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS or permission denied
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      className="text-[11px] font-semibold uppercase tracking-wider rounded-md px-2.5 py-1 transition-colors hover:bg-[rgba(74,111,165,0.12)]"
      style={{
        color: "var(--dl-brand, #4A6FA5)",
        background: "rgba(74,111,165,0.08)",
      }}
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy referral link"}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
