"use client";

import { useMemo, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  returnTo?: string | null;
  collectEmailConsent?: boolean;
};

export function GoogleOAuthButton({ children, returnTo, collectEmailConsent = false }: Props) {
  const [emailConsent, setEmailConsent] = useState(false);
  const href = useMemo(() => {
    const params = new URLSearchParams();
    if (returnTo) params.set("redirect_url", returnTo);
    if (collectEmailConsent && emailConsent) params.set("email_consent", "1");
    const query = params.toString();
    return query ? `/api/auth/google?${query}` : "/api/auth/google";
  }, [collectEmailConsent, emailConsent, returnTo]);

  return (
    <>
      <a
        href={href}
        className="inline-flex items-center justify-center gap-3 w-full py-2.5 text-sm font-semibold text-white rounded-xl transition-colors"
        style={{ background: "#4A6FA5" }}
      >
        {children}
      </a>
      {collectEmailConsent && (
        <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={emailConsent}
            onChange={(event) => setEmailConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#4A6FA5] focus:ring-[#4A6FA5]"
          />
          <span className="text-[11px] leading-relaxed" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Send me optional product emails, reminders, and weekly progress updates. I can unsubscribe anytime.
          </span>
        </label>
      )}
    </>
  );
}
