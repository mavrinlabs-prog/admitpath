"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * Newsletter / lead-capture section. Mirrors the Discovery Labs "white
 * card on warm bg" treatment: prominent headline, single email input,
 * trust copy, no friction. Submits to /api/newsletter (POST { email }).
 *
 * Local-only state — no analytics dep, no formspark, no Mailchimp SDK.
 * The endpoint accepts the address and forwards to Resend Audiences.
 * Failure mode is silent-success-with-retry-prompt; we never show a
 * modal that interrupts the page.
 */
export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) setEmail("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <section
      className="dl-features"
      aria-labelledby="newsletter-heading"
      style={{ background: "var(--dl-bg-page)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 880, padding: "0 36px" }}>
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="dl-feature-card"
          style={{
            padding: "48px 40px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(74,111,165,0.08)",
          }}
        >
          <div className="dl-feature-icon" style={{ margin: "0 auto 20px" }}>
            <Mail size={22} strokeWidth={1.75} aria-hidden />
          </div>
          <h2 id="newsletter-heading" className="dl-section-heading" style={{ marginBottom: 12 }}>
            Sunday Strategy <em>Brief.</em>
          </h2>
          <p
            style={{
              maxWidth: 540,
              margin: "0 auto 32px",
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--dl-text-secondary)",
            }}
          >
            Application strategy you&apos;d pay $200/hr for — distilled into a 2-minute
            Sunday read. No fluff, no spam, unsubscribe in one click.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md flex-col items-stretch gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              autoComplete="email"
              enterKeyHint="send"
              aria-describedby={
                status === "err"
                  ? "newsletter-error"
                  : status === "ok"
                    ? "newsletter-success"
                    : undefined
              }
              aria-invalid={status === "err" || undefined}
              className="flex-1 focus:ring-2 focus:ring-[#4A6FA5] focus:ring-offset-2"
              style={{
                padding: "10px 14px",
                fontSize: 14,
                borderRadius: 8,
                border: status === "err"
                  ? "1px solid rgba(220,38,38,0.4)"
                  : "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: "var(--dl-text-primary, #1B2030)",
                outline: "none",
                transition: "border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="dl-btn dl-btn-primary dl-btn-lg"
            >
              {status === "ok" ? (
                <>
                  <CheckCircle2 size={14} strokeWidth={2} />
                  Subscribed
                </>
              ) : status === "loading" ? (
                "Subscribing…"
              ) : (
                <>
                  Get the Sunday tip
                  <ArrowRight size={14} strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {status === "err" && (
            <p
              id="newsletter-error"
              role="alert"
              aria-live="assertive"
              style={{ marginTop: 16, fontSize: 13, color: "var(--dl-red)" }}
            >
              Couldn&apos;t subscribe right now — try again in a moment.
            </p>
          )}

          {status === "ok" && (
            <p
              id="newsletter-success"
              role="status"
              aria-live="polite"
              style={{ marginTop: 16, fontSize: 13, color: "var(--dl-green)" }}
            >
              You&apos;re subscribed! Check your inbox for a confirmation.
            </p>
          )}

          <p style={{ marginTop: 20, fontSize: 12, color: "var(--dl-text-muted)" }}>
            Free · Weekly · CAN-SPAM compliant unsubscribe
          </p>
        </motion.div>
      </div>
    </section>
  );
}
