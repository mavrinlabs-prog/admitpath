"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import {
  ArrowLeft, Send, GraduationCap, FileText, BookOpen, Users, Lightbulb,
  Sparkles, ChevronDown, Download, Square, MessageSquare, Plus, Trash2, Clock,
} from "lucide-react";
import { EmptyChat } from "@/components/illustrations/EmptyChat";
import { ResumeQuickImport } from "@/components/resume-quick-import";
import {
  buildSameOriginCounselorUrl,
  COUNSELOR_CLIENT_TIMEOUT_MS,
  createCounselorDeadline,
  restoreFailedCounselorDraft,
  rollbackFailedCounselorTurn,
} from "@/lib/counselor-request-lifecycle";

type Message = { role: "user" | "assistant"; content: string; timestamp: number };

/* ── localStorage chat persistence ───────────────────────────────────── */
const STORAGE_KEY = "admitpath-chat-conversations";
const MAX_MESSAGES_PER_CONVO = 100;
const MAX_CONVERSATIONS = 20;

type Conversation = {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

type ConversationIndex = {
  activeId: string | null;
  conversations: Conversation[];
};

function loadConversations(): ConversationIndex {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { activeId: null, conversations: [] };
    const parsed = JSON.parse(raw) as ConversationIndex;
    // Validate shape
    if (!Array.isArray(parsed.conversations)) return { activeId: null, conversations: [] };
    return parsed;
  } catch {
    return { activeId: null, conversations: [] };
  }
}

function saveConversations(index: ConversationIndex) {
  try {
    // Enforce limits
    const trimmed: ConversationIndex = {
      activeId: index.activeId,
      conversations: index.conversations.slice(0, MAX_CONVERSATIONS).map((c) => ({
        ...c,
        messages: c.messages.slice(-MAX_MESSAGES_PER_CONVO),
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full — silently fail
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function currentTimestamp(): number {
  return Date.now();
}

async function* readTextStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (!chunk) continue;
      accumulated += chunk;
      yield accumulated;
    }

    const tail = decoder.decode();
    if (tail) {
      accumulated += tail;
      yield accumulated;
    }
  } finally {
    reader.releaseLock();
  }
}

function getPreview(convo: Conversation): string {
  const firstUser = convo.messages.find((m) => m.role === "user");
  if (!firstUser) return "New conversation";
  return firstUser.content.length > 60
    ? firstUser.content.slice(0, 60) + "..."
    : firstUser.content;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const SUGGESTIONS = [
  { icon: GraduationCap, label: "How do I build a strong college list?" },
  { icon: FileText, label: "What makes a great Common App essay?" },
  { icon: BookOpen, label: "How important is GPA vs test scores?" },
  { icon: Users, label: "How do I get strong recommendation letters?" },
  { icon: Lightbulb, label: "What extracurriculars do top schools want?" },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--dl-text-muted, #5A6275)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/**
 * Tiny safe markdown renderer for assistant messages.
 *
 * The chat backend often returns lightly-formatted markdown (bold, lists,
 * inline code). Rendering it raw shows literal `**stars**` to the user — ugly
 * and unprofessional. We intentionally do NOT pull in `react-markdown` here:
 * the surface is small and we'd rather not ship a parser. Supports:
 *   - **bold**, *italic*, `inline code`
 *   - "- " / "* " bullet lists
 *   - blank-line paragraphs
 *
 * All other input is escaped before substitution; the only HTML this can
 * emit is the whitelisted tags above. Safe against XSS from model output.
 */
function renderInline(text: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  return escape(text)
    .replace(/`([^`]+)`/g, '<code style="background:rgba(74,111,165,0.10);padding:1px 5px;border-radius:4px;font-size:0.9em;">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

function MarkdownContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const trimmed = block.trimStart();

        /* ── Headings ── */
        const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const Tag = `h${level + 1}` as "h2" | "h3" | "h4"; // shift down one level inside a bubble
          const sizes: Record<string, string> = { h2: "text-base font-bold", h3: "text-sm font-semibold", h4: "text-sm font-medium" };
          return (
            <Tag
              key={bi}
              className={sizes[Tag]}
              style={{ color: "var(--dl-text-primary, #1B2030)" }}
              dangerouslySetInnerHTML={{ __html: renderInline(headingMatch[2]) }}
            />
          );
        }

        const lines = trimmed.split("\n");

        /* ── Unordered lists ── */
        const isUnordered = lines.every((l) => /^\s*[-*]\s+/.test(l));
        if (isUnordered) {
          return (
            <ul key={bi} className="list-disc pl-5 space-y-1">
              {lines.map((l, li) => (
                <li
                  key={li}
                  dangerouslySetInnerHTML={{
                    __html: renderInline(l.replace(/^\s*[-*]\s+/, "")),
                  }}
                />
              ))}
            </ul>
          );
        }

        /* ── Numbered lists ── */
        const isOrdered = lines.every((l) => /^\s*\d+[.)]\s+/.test(l));
        if (isOrdered) {
          return (
            <ol key={bi} className="list-decimal pl-5 space-y-1">
              {lines.map((l, li) => (
                <li
                  key={li}
                  dangerouslySetInnerHTML={{
                    __html: renderInline(l.replace(/^\s*\d+[.)]\s+/, "")),
                  }}
                />
              ))}
            </ol>
          );
        }

        /* ── Horizontal rule ── */
        if (/^[-*_]{3,}\s*$/.test(trimmed)) {
          return <hr key={bi} className="border-t my-1" style={{ borderColor: "rgba(0,0,0,0.08)" }} />;
        }

        /* ── Regular paragraph ── */
        return (
          <p
            key={bi}
            dangerouslySetInnerHTML={{
              __html: renderInline(block).replace(/\n/g, "<br/>"),
            }}
          />
        );
      })}
    </div>
  );
}

function formatTime(ts: number): string {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function MessageBubble({
  msg,
  index,
  showCaret,
}: {
  msg: Message;
  index: number;
  showCaret?: boolean;
}) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`group flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
          style={{ background: "#4A6FA5" }}
        >
          AP
        </div>
      )}
      <div
        className="relative max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-200"
        style={
          isUser
            ? {
                background: "rgba(74,111,165,0.12)",
                color: "var(--dl-text-primary, #1B2030)",
                borderBottomRightRadius: "4px",
                border: "1px solid rgba(74,111,165,0.08)",
              }
            : {
                backgroundColor: "transparent",
                color: "var(--dl-text-primary, #1B2030)",
                borderBottomLeftRadius: "4px",
              }
        }
      >
        {isUser ? (
          msg.content
        ) : (
          <>
            <MarkdownContent content={msg.content} />
            {showCaret && <span className="streaming-caret" aria-hidden />}
          </>
        )}
        <span
          className="pointer-events-none absolute bottom-1 right-2 text-[11px] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{
            color: "var(--dl-text-muted, #5A6275)",
          }}
        >
          {formatTime(msg.timestamp)}
        </span>
      </div>
      {isUser && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-white"
          style={{ backgroundColor: "var(--dl-text-muted, #5A6275)" }}
        >
          You
        </div>
      )}
    </motion.div>
  );
}

const GREETING_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm your AI college counselor. Ask me anything about college admissions — essay strategy, college list building, financial aid, interview prep, or anything else on your mind.",
  timestamp: 0,
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([GREETING_MESSAGE]);
  const [input, setInput] = useState("");
  const CHAR_LIMIT = 2000;
  const [loading, setLoading] = useState(false);
  // Conversation management
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Tracks the in-flight stream once the FIRST delta has landed. Distinct
  // from `loading` (which spans the whole request) so TypingDots can hide
  // the moment tokens start arriving while the streaming caret on the
  // assistant bubble takes over until the stream closes.
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Fire chat_sent only once per page-life session — funnel cares about
  // chat-activation, not raw message volume.
  const chatSentTracked = useRef(false);
  // Tracks the in-flight stream so an unmount (or page nav) can abort it
  // cleanly instead of letting the reader leak.
  const abortRef = useRef<{ abort: () => void } | null>(null);
  const hasUserMessages = messages.some((m) => m.role === "user");
  // Effective plan label for the header badge. Fetched lazily from /api/me so
  // we never falsely show "Pro" to a Free user (was previously hardcoded).
  const [planLabel, setPlanLabel] = useState<"Free" | "Pro" | null>(null);
  // Chat usage tracking for free-tier message counter
  const [chatUsage, setChatUsage] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        const p = (d.effectivePlan ?? d.plan) as string | undefined;
        if (p === "pro" || p === "plus") setPlanLabel("Pro");
        else setPlanLabel("Free");
        // Extract chat usage for free-tier message counter
        const chatU = d?.freeUsage?.usage?.chat;
        if (chatU && typeof chatU === "object") {
          setChatUsage({ used: chatU.used ?? 0, limit: chatU.limit ?? 5 });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Load conversations from localStorage on mount ──
  useEffect(() => {
    const index = loadConversations();
    setConversations(index.conversations);
    if (index.activeId) {
      const active = index.conversations.find((c) => c.id === index.activeId);
      if (active && active.messages.length > 0) {
        setActiveConvoId(active.id);
        setMessages(active.messages);
        return; // skip greeting rewrite — loaded messages have real timestamps
      }
    }
    // No saved conversation — start fresh with a new id
    const newId = generateId();
    setActiveConvoId(newId);
    setMessages((m) =>
      m.map((msg) => (msg.timestamp === 0 ? { ...msg, timestamp: currentTimestamp() } : msg)),
    );
  }, []);

  // ── Persist messages to localStorage after each exchange ──
  const persistMessages = useCallback(
    (msgs: Message[], convoId: string | null) => {
      if (!convoId) return;
      const index = loadConversations();
      const existing = index.conversations.findIndex((c) => c.id === convoId);
      const convo: Conversation = {
        id: convoId,
        messages: msgs,
        createdAt: existing >= 0 ? index.conversations[existing].createdAt : currentTimestamp(),
        updatedAt: currentTimestamp(),
      };
      let updated: Conversation[];
      if (existing >= 0) {
        updated = [...index.conversations];
        updated[existing] = convo;
      } else {
        updated = [convo, ...index.conversations];
      }
      // Sort by most recently updated
      updated.sort((a, b) => b.updatedAt - a.updatedAt);
      saveConversations({ activeId: convoId, conversations: updated });
      setConversations(updated);
    },
    [],
  );

  // Save whenever messages change (debounced by the streaming — final save
  // happens when streaming ends and the message array stabilizes).
  const prevMsgCountRef = useRef(0);
  useEffect(() => {
    // Only persist when a message is added or completed (not during streaming
    // character-by-character updates — we check length change).
    if (messages.length !== prevMsgCountRef.current) {
      prevMsgCountRef.current = messages.length;
      persistMessages(messages, activeConvoId);
    }
  }, [messages, activeConvoId, persistMessages]);

  // Also persist when streaming ends (final content of last message).
  useEffect(() => {
    if (!streaming && !loading && messages.length > 1) {
      persistMessages(messages, activeConvoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming, loading]);

  // ── Conversation management handlers ──
  function handleNewConversation() {
    const newId = generateId();
    setActiveConvoId(newId);
    setMessages([{ ...GREETING_MESSAGE, timestamp: currentTimestamp() }]);
    setInput("");
    setError(null);
    setSidebarOpen(false);
  }

  function handleLoadConversation(convo: Conversation) {
    setActiveConvoId(convo.id);
    setMessages(convo.messages);
    setInput("");
    setError(null);
    setSidebarOpen(false);
    // Update activeId in storage
    const index = loadConversations();
    saveConversations({ ...index, activeId: convo.id });
  }

  function handleDeleteConversation(convoId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const index = loadConversations();
    const updated = index.conversations.filter((c) => c.id !== convoId);
    const newActiveId = convoId === activeConvoId ? null : index.activeId;
    saveConversations({ activeId: newActiveId, conversations: updated });
    setConversations(updated);
    if (convoId === activeConvoId) {
      handleNewConversation();
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    // On unmount, cancel any in-flight stream so the reader closes and we
    // don't keep mutating state after teardown.
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg, timestamp: currentTimestamp() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setError(null);

    const history = [...messages, userMsg];

    if (!chatSentTracked.current) {
      chatSentTracked.current = true;
      // No PII — message body stays client-side. Just plan tier + path.
      track("chat_sent", { path: "/chat", plan: planLabel ?? "unknown" });
    }

    const deadline = createCounselorDeadline(COUNSELOR_CLIENT_TIMEOUT_MS);
    abortRef.current = deadline;
    let assistantAppended = false;
    const recoverFailedTurn = (hasAssistant: boolean) => {
      setMessages((current) => rollbackFailedCounselorTurn(current, hasAssistant));
      setInput((current) => restoreFailedCounselorDraft(current, msg));
    };
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: deadline.signal,
      });

      // Pre-stream gates fire BEFORE the body opens, so res.status reads
      // cleanly here — no need to peek into the stream to disambiguate.
      if (res.status === 401) {
        const here = `${window.location.pathname}${window.location.search}`;
        const signInUrl = buildSameOriginCounselorUrl(
          window.location.href,
          "/sign-in",
          "/sign-in",
        );
        signInUrl.searchParams.set("redirect_url", here);
        window.location.assign(signInUrl.href);
        return;
      }
      if (res.status === 403) {
        setError("upgrade");
        recoverFailedTurn(false);
        return;
      }
      if (res.status === 429) {
        // Check if this is a plan limit (free messages exhausted) vs rate-limit
        try {
          const body = await res.json();
          if (body?.reason === "free_limit_reached") {
            setError("upgrade");
          } else {
            setError("rate_limited");
          }
        } catch {
          setError("rate_limited");
        }
        recoverFailedTurn(false);
        return;
      }
      if (!res.ok || !res.body) throw new Error("Chat failed");

      for await (const content of readTextStream(res.body)) {
        if (!assistantAppended) {
          // First delta in: drop the typing dots, install the placeholder
          // bubble, then stream into it on subsequent reads.
          assistantAppended = true;
          setStreaming(true);
          setMessages((m) => [...m, { role: "assistant", content, timestamp: currentTimestamp() }]);
        } else {
          setMessages((m) => {
            const next = m.slice();
            const prev = next[next.length - 1];
            next[next.length - 1] = {
              role: "assistant",
              content,
              timestamp: prev?.timestamp ?? currentTimestamp(),
            };
            return next;
          });
        }
      }
      if (!assistantAppended) {
        // Stream closed without a single delta — treat as a soft failure.
        throw new Error("Empty stream");
      }
      // Update the local usage counter so the UI reflects the sent message
      if (planLabel === "Free" && chatUsage) {
        setChatUsage((prev) => prev ? { ...prev, used: prev.used + 1 } : prev);
      }
    } catch (err) {
      // User-requested cancellation keeps the submitted turn and any partial
      // answer. Timeouts and provider failures restore the draft for retry.
      if ((err as { name?: string }).name === "AbortError" && !deadline.didTimeOut()) return;
      setError(deadline.didTimeOut() ? "timed_out" : "something_went_wrong");
      recoverFailedTurn(assistantAppended);
    } finally {
      deadline.dispose();
      abortRef.current = null;
      setLoading(false);
      setStreaming(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    // Don't roll the partial message back — the user explicitly chose to
    // keep what was already streamed. setLoading/setStreaming flip in the
    // finally block above when the reader settles.
  }

  function handleExport() {
    const date = new Date();
    const headerDate = date.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
    const fileDate = date.toISOString().slice(0, 10);
    const lines: string[] = [`# AdmitPath conversation · ${headerDate}`, ""];
    for (const m of messages) {
      lines.push(m.role === "user" ? "## You" : "## AI Counselor");
      lines.push("");
      lines.push(m.content);
      lines.push("");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admitpath-chat-${fileDate}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      {/* Header — minimal chrome */}
      <header
        className="backdrop-blur-md"
        style={{
          backgroundColor: "rgba(213,220,232,0.85)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex h-14 items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 hover:opacity-70"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{ background: "#4A6FA5" }}
              >
                AP
              </div>
              <div>
                <p
                  className="text-sm font-semibold leading-none"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  AI Counselor
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px]" style={{ color: "var(--success)" }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  Online
                </p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle conversation history"
                className="focus-ring flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-all duration-150 hover:bg-[rgba(255,255,255,0.6)]"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {conversations.length > 0 && (
                  <span
                    className="flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                    style={{ background: "#4A6FA5" }}
                  >
                    {conversations.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleNewConversation}
                aria-label="New conversation"
                className="focus-ring flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-all duration-150 hover:bg-[rgba(255,255,255,0.6)]"
                style={{ color: "var(--dl-text-secondary, #454B5E)" }}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleExport}
                disabled={messages.length <= 1}
                aria-label="Export conversation as Markdown"
                className="focus-ring flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-all duration-150 disabled:opacity-40 hover:bg-[rgba(255,255,255,0.6)]"
                style={{
                  color: "var(--dl-text-secondary, #454B5E)",
                }}
              >
                <Download className="h-3.5 w-3.5" />
              </button>
              {planLabel && planLabel !== "Free" ? (
                <span className="badge-primary text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  {planLabel}
                </span>
              ) : planLabel === "Free" ? (
                <Link
                  href="/pricing"
                  className="text-[10px] font-semibold underline"
                  style={{ color: "#4A6FA5" }}
                >
                  Upgrade
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* ── Conversation history sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Panel */}
            <motion.div
              key="sidebar-panel"
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col"
              style={{
                backgroundColor: "rgba(239,242,248,0.97)",
                backdropFilter: "blur(16px)",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex h-14 items-center justify-between px-4">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--dl-text-primary, #1B2030)" }}
                >
                  Conversations
                </p>
                <button
                  onClick={handleNewConversation}
                  className="focus-ring flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-all duration-150 hover:bg-[rgba(74,111,165,0.08)]"
                  style={{ color: "#4A6FA5" }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  New chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                {conversations.length === 0 ? (
                  <p
                    className="px-2 py-8 text-center text-xs"
                    style={{ color: "var(--dl-text-muted, #5A6275)" }}
                  >
                    No saved conversations yet. Start chatting and your history will appear here.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((convo) => {
                      const isActive = convo.id === activeConvoId;
                      const msgCount = convo.messages.filter((m) => m.role === "user").length;
                      return (
                        <button
                          key={convo.id}
                          onClick={() => handleLoadConversation(convo)}
                          className="group flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-150"
                          style={{
                            backgroundColor: isActive
                              ? "rgba(74,111,165,0.10)"
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = "rgba(74,111,165,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <MessageSquare
                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                            style={{ color: isActive ? "#4A6FA5" : "var(--dl-text-muted, #5A6275)" }}
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-xs font-medium"
                              style={{ color: "var(--dl-text-primary, #1B2030)" }}
                            >
                              {getPreview(convo)}
                            </p>
                            <p
                              className="mt-0.5 flex items-center gap-1.5 text-[10px]"
                              style={{ color: "var(--dl-text-muted, #5A6275)" }}
                            >
                              <Clock className="h-2.5 w-2.5" />
                              {formatDate(convo.updatedAt)}
                              <span className="opacity-60">
                                · {msgCount} msg{msgCount !== 1 ? "s" : ""}
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(convo.id, e)}
                            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-[rgba(220,38,38,0.08)]"
                            aria-label="Delete conversation"
                          >
                            <Trash2
                              className="h-3 w-3"
                              style={{ color: "#DC2626" }}
                            />
                          </button>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Messages */}
      <main id="main" className="flex-1 overflow-y-auto" aria-live="polite" aria-busy={loading}>
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Resume quick import — shown before any messages */}
          {!hasUserMessages && (
            <div className="mb-6 max-w-xl mx-auto">
              <ResumeQuickImport context="chat" />
            </div>
          )}

          {/* Welcome hero — shown before any user message */}
          <AnimatePresence>
            {!hasUserMessages && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-10 text-center"
              >
                <div className="mx-auto mb-5 flex items-center justify-center" style={{ color: "#4A6FA5" }}>
                  <EmptyChat size={96} />
                </div>
                <h1
                  className="mb-2 text-2xl font-bold"
                  style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
                >
                  Your personal college counselor
                </h1>
                <p className="mt-1.5 max-w-md mx-auto text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                  Ask anything about college admissions -- essay strategy, school selection,
                  financial aid, interview prep. Your counselor has context from your profile
                  and analyses to give personalized advice.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-5">
            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1;
              const showCaret = streaming && isLast && msg.role === "assistant";
              return <MessageBubble key={i} msg={msg} index={i} showCaret={showCaret} />;
            })}

            {/* Typing indicator — only before the first delta arrives. Once
                streaming begins, the caret on the last bubble takes over. */}
            <AnimatePresence>
              {loading && !streaming && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-3"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                    style={{ background: "#4A6FA5" }}
                  >
                    AP
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.45)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderBottomLeftRadius: "4px",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error states */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  {error === "upgrade" ? (
                    <div
                      className="w-full max-w-md rounded-2xl border px-5 py-5 text-center"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.45)",
                        borderColor: "rgba(74,111,165,0.2)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      }}
                    >
                      <div
                        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ background: "#4A6FA5" }}
                      >
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-sm font-bold mb-1" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
                        You&apos;ve used your free chat messages
                      </p>
                      <p className="text-xs mb-3" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                        Upgrade to Pro to remove the Free-plan counselor cap and continue with personalized planning questions.
                      </p>
                      <p className="text-[11px] mb-4" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                        Pro removes the Free-plan chat cap for $19.99/month, subject to abuse safeguards and service availability.
                      </p>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/pricing"
                          className="dl-btn dl-btn-primary py-2.5 px-5 text-xs w-full justify-center"
                        >
                          View plans
                        </Link>
                        <Link
                          href="/pricing"
                          className="text-xs font-semibold underline"
                          style={{ color: "#4A6FA5" }}
                        >
                          Compare plans
                        </Link>
                      </div>
                    </div>
                  ) : error === "rate_limited" ? (
                    <p className="text-sm" style={{ color: "var(--error)" }}>
                      Slow down — too many messages. Try again in a minute.
                    </p>
                  ) : error === "timed_out" ? (
                    <p className="text-sm" style={{ color: "var(--error)" }}>
                      The counselor took too long to respond. Your message is back in the composer.
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--error)" }}>
                      Couldn&apos;t reach the counselor. Check your connection and resend the message.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestion chips — shown before first message */}
          <AnimatePresence>
            {!hasUserMessages && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-wrap justify-center gap-2"
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.label)}
                    className="chat-suggestion-chip flex min-h-[44px] items-center gap-2 border px-3.5 py-2 text-xs font-medium transition-all duration-200 hover:bg-[rgba(74,111,165,0.06)]"
                    style={{
                      borderRadius: "14px",
                      backgroundColor: "rgba(255,255,255,0.35)",
                      backdropFilter: "blur(8px)",
                      borderColor: "rgba(0,0,0,0.06)",
                      color: "var(--dl-text-secondary, #454B5E)",
                    }}
                  >
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stop generation pill — visible while a request is in flight.
              Aborts the existing controller; partial output stays in the
              conversation by design. */}
          <AnimatePresence>
            {(loading || streaming) && (
              <motion.div
                key="stop-gen"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="mt-6 flex justify-center"
              >
                <button
                  onClick={handleStop}
                  className="focus-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-[border-color,color] duration-150"
                  style={{
                    borderColor: "var(--border-strong)",
                    color: "var(--dl-text-secondary, #454B5E)",
                    backgroundColor: "rgba(255,255,255,0.45)",
                  }}
                  aria-label="Stop generating response"
                >
                  <Square className="h-3 w-3" fill="currentColor" />
                  Stop generating
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} className="h-4" />
        </div>
      </main>

      {/* Input bar — glassmorphism */}
      <div
        className="px-4 py-4"
        style={{
          backgroundColor: "rgba(255,255,255,0.35)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <div
            className="relative flex items-end gap-3 border p-3 transition-all duration-200"
            style={{
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderColor: input.trim() ? "rgba(74,111,165,0.3)" : "rgba(0,0,0,0.06)",
              boxShadow: input.trim() ? "0 0 0 3px rgba(74,111,165,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <textarea
              ref={textareaRef}
              aria-label="Message AI counselor"
              className="flex-1 resize-none bg-transparent text-sm outline-none"
              style={{
                color: "var(--dl-text-primary, #1B2030)",
                minHeight: "44px",
                maxHeight: "140px",
                lineHeight: "1.6",
              }}
              placeholder="Ask anything about college admissions..."
              value={input}
              maxLength={CHAR_LIMIT}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
                autoResize();
              }}
              onKeyDown={(e) => {
                // Cmd+Enter (mac) and Ctrl+Enter (win/linux) always submit —
                // muscle memory from Slack/iMessage/etc. Plain Enter (no
                // modifier) keeps existing behavior. Shift+Enter still
                // inserts a newline.
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSend();
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
            />
            {/* Character count — only shows when approaching the limit */}
            {input.length > CHAR_LIMIT * 0.8 && (
              <span
                className="absolute bottom-1 right-14 text-[10px] tabular-nums"
                style={{
                  color: input.length >= CHAR_LIMIT ? "var(--error, #DC2626)" : "var(--dl-text-muted, #5A6275)",
                }}
              >
                {input.length}/{CHAR_LIMIT}
              </span>
            )}
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="chat-send-btn focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-150 disabled:opacity-40 sm:h-10 sm:w-10"
              style={
                input.trim() && !loading
                  ? {
                      background: "#4A6FA5",
                      color: "white",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.45)",
                      color: "var(--dl-text-muted, #5A6275)",
                    }
              }
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {/* Keep the usage reminder aligned with the server-enforced Free plan. */}
          <p className="mt-2 text-center text-[10px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Shift + Enter for new line · ⌘/Ctrl + Enter to send · Responses are AI-generated and not a substitute for professional advice
          </p>
        </div>
      </div>
    </div>
  );
}
