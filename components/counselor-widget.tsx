"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Eye, MessageCircle } from "lucide-react";
import {
  buildSameOriginCounselorUrl,
  COUNSELOR_CLIENT_TIMEOUT_MS,
  createCounselorDeadline,
  restoreFailedCounselorDraft,
  rollbackFailedCounselorTurn,
} from "@/lib/counselor-request-lifecycle";

type Msg = { role: "user" | "assistant"; content: string };

function captureVisibleText(): string {
  if (typeof document === "undefined") return "";
  // Prefer <main> if present, else body. Strip the widget itself.
  const root = document.querySelector("main") ?? document.body;
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-counselor-widget]").forEach((el) => el.remove());
  clone.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
  const text = (clone.innerText || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 7500);
}

export function CounselorWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Allow external triggers (e.g. nav chat icon) to open the widget
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-counselor", handler);
    return () => window.removeEventListener("open-counselor", handler);
  }, []);
  const pathname = usePathname();

  // Reset error when reopening
  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  // Focus management + Escape-to-close. On open, move focus into the panel
  // (the textarea is the first useful target). On close, return focus to the
  // FAB so keyboard users don't get stranded at <body>.
  useEffect(() => {
    if (!open) return;
    const focusTarget = panelRef.current?.querySelector<HTMLElement>("textarea, button");
    focusTarget?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) {
      // Defer so the panel unmounts before refocusing the FAB
      requestAnimationFrame(() => fabRef.current?.focus({ preventScroll: true }));
    }
  }, [open]);

  // Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setError(null);
    // Reset textarea height after clearing input
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setSending(true);
    let sentSuccessfully = false;
    const deadline = createCounselorDeadline(COUNSELOR_CLIENT_TIMEOUT_MS);

    try {
      const res = await fetch("/api/counselor-widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          pageContext: {
            pathname,
            title: document.title,
            visibleText: captureVisibleText(),
          },
        }),
        signal: deadline.signal,
      });

      if (res.status === 401) {
        setError("Sign in to use the AI counselor.");
        return;
      }

      if (res.status === 403) {
        const data = (await res.json()) as { error?: string; upgrade?: string };
        setError(data.error ?? "Upgrade to Pro to chat with the counselor.");
        // Soft nudge to /pricing after a beat
        setTimeout(() => {
          if (typeof window === "undefined") return;
          const upgradeUrl = buildSameOriginCounselorUrl(
            window.location.href,
            data.upgrade ?? "/pricing",
            "/pricing",
          );
          window.location.assign(upgradeUrl.href);
        }, 1200);
        return;
      }

      if (res.status === 429) {
        setError("Slow down — too many messages. Try again in a minute.");
        return;
      }
      let data: { reply?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        setError("Server returned an invalid response. Please try again.");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Could not send your message. Please try again.");
        return;
      }
      setMessages([...next, { role: "assistant", content: data.reply ?? "" }]);
      sentSuccessfully = true;
    } catch (err) {
      if (deadline.didTimeOut()) {
        setError("The counselor took too long to respond. Your question is back in the composer.");
      } else {
        const msg = err instanceof Error ? err.message : "Could not reach the server";
        setError(`Connection issue: ${msg}. Please check your internet and try again.`);
      }
    } finally {
      deadline.dispose();
      if (!sentSuccessfully) {
        setMessages((current) => rollbackFailedCounselorTurn(current, false));
        setInput((current) => restoreFailedCounselorDraft(current, text));
      }
      setSending(false);
    }
  }

  return (
    <div
      data-counselor-widget
      className="fixed bottom-5 right-5 z-[60] flex flex-col items-end"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
    >
      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="counselor-panel-title"
          className="mb-3 flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            height: "min(560px, calc(100vh - 6rem))",
            background: "#FFFFFF",
            borderColor: "rgba(0,0,0,0.06)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(74,111,165,0.10)",
          }}
        >
          {/* Header — flat surface, hairline border. The chunky duotone
              gradient was loud against the calm chat body. */}
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.45)",
              borderColor: "rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: "var(--color-primary-light)" }}
              >
                <Sparkles className="h-4 w-4" style={{ color: "#4A6FA5" }} strokeWidth={1.75} />
              </div>
              <div>
                <p
                  id="counselor-panel-title"
                  className="text-[14px] leading-tight"
                  style={{
                    color: "var(--dl-text-primary, #1B2030)",
                    fontFamily: "var(--font-instrument-sans)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  AdmitPath Counselor
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  <Eye className="h-3 w-3" strokeWidth={1.75} />
                  Sees this page
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close counselor"
              className="rounded-lg p-1.5 transition-colors hover:bg-[color:rgba(255,255,255,0.45)]"
              style={{ color: "var(--dl-text-muted, #5A6275)" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
          >
            {messages.length === 0 && (
              <div className="space-y-4">
                <p
                  className="text-[14px] italic leading-relaxed"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  Ask anything about what&apos;s on screen — your profile, scores, essays, or what to do next.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Is my profile strong enough?",
                    "What should my essay be about?",
                    "Should I upgrade to Pro?",
                    "What's my weakest dimension?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="rounded-full border px-3 py-1.5 text-[12px] transition-colors hover:bg-[color:rgba(255,255,255,0.45)] hover:text-[color:var(--dl-text-primary, #1B2030)]"
                      style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--dl-text-secondary, #454B5E)" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={`${m.role}-${i}-${m.content.slice(0, 20)}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed"
                  style={
                    m.role === "user"
                      ? {
                          background: "#4A6FA5",
                          color: "#fff",
                          borderBottomRightRadius: "6px",
                        }
                      : {
                          background: "rgba(255,255,255,0.45)",
                          color: "var(--dl-text-primary, #1B2030)",
                          border: "1px solid rgba(0,0,0,0.06)",
                          borderBottomLeftRadius: "6px",
                        }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start" role="status" aria-label="Counselor is typing">
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: "#4A6FA5", animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: "#4A6FA5", animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: "#4A6FA5", animationDelay: "300ms" }} />
                  </div>
                  <span className="sr-only">Counselor is thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#FECACA", background: "#FEF2F2", color: "#991B1B" }}>
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#FFFFFF" }}>
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-grow: reset height then set to scrollHeight
                  const el = e.target;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask about anything on screen…"
                rows={1}
                className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none transition-colors focus:border-[#4A6FA5]"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  borderColor: "rgba(0,0,0,0.06)",
                  color: "var(--dl-text-primary, #1B2030)",
                  maxHeight: "120px",
                  overflow: "hidden",
                }}
              />
              <button
                onClick={send}
                disabled={sending || !input.trim()}
                aria-label="Send message"
                className="btn-primary flex h-9 w-9 shrink-0 items-center justify-center !p-0 !rounded-xl disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Sees the visible page to give specific advice
              </p>
              {messages.length > 0 && (
                <p className="text-[10px] tabular-nums" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                  {messages.filter((m) => m.role === "user").length} message{messages.filter((m) => m.role === "user").length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating launcher — 56×56 rounded-square, spring entry, pulse ring first visit */}
      <motion.button
        ref={fabRef}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI counselor chat" : "Open AI counselor chat"}
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-[16px] text-white"
        style={{
          background: "#4A6FA5",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(74,111,165,0.32)",
        }}
      >
        {/* Pulse ring — visible when closed (first-visit feel) */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-[16px]"
            animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "rgba(74,111,165,0.35)" }}
            aria-hidden
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="icon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle className="h-6 w-6" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-extrabold"
            style={{ background: "#22C55E", color: "#fff", border: "2px solid var(--dl-bg-root, #D5DCE8)" }}
          >
            <Sparkles className="h-2.5 w-2.5" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
