"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, MapPin, Sparkles, TrendingUp, FileText, MessageSquare } from "lucide-react";

type DisplayProfile = {
  id: string;
  school: string;
  year: number;
  initials: string;
  state: string;
  spike: string;
  story: string;
  gpa: number;
  sat?: number;
  act?: number;
  tier: string;
  essayStrength: string;
  featuresUsed: string[];
};

const TIER_FILTERS = [
  { value: "all", label: "All Schools" },
  { value: "ivy", label: "Ivy League" },
  { value: "t20", label: "Top 20" },
  { value: "t50", label: "Top 50" },
  { value: "flagship", label: "State Flagship" },
];

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "Profile Score": <TrendingUp className="h-3 w-3" />,
  "Essay Feedback": <FileText className="h-3 w-3" />,
  "College Match": <MessageSquare className="h-3 w-3" />,
};

export function AdmitsWallClient({ profiles }: { profiles: DisplayProfile[] }) {
  const [tier, setTier] = useState("all");

  const filtered = useMemo(() => {
    if (tier === "all") return profiles;
    if (tier === "t20") return profiles.filter((p) => p.tier === "ivy" || p.tier === "t20");
    if (tier === "t50") return profiles.filter((p) => p.tier === "ivy" || p.tier === "t20" || p.tier === "t50");
    return profiles.filter((p) => p.tier === tier);
  }, [profiles, tier]);

  return (
    <>
      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TIER_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setTier(f.value)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: tier === f.value ? "#4A6FA5" : "rgba(255,255,255,0.45)",
              color: tier === f.value ? "#fff" : "var(--dl-text-secondary, #454B5E)",
              border: tier === f.value ? "1px solid #4A6FA5" : "1px solid rgba(0,0,0,0.06)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p
        className="mb-6 text-sm font-medium"
        style={{ color: "var(--dl-text-muted, #5A6275)" }}
      >
        Showing {filtered.length} success {filtered.length === 1 ? "story" : "stories"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="border p-5 dl-card-hover overflow-hidden"
              style={{
                borderColor: "rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="shrink-0 flex items-center justify-center rounded-full font-bold text-sm"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(74,111,165,0.1)",
                    color: "#4A6FA5",
                  }}
                >
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 shrink-0" style={{ color: "#4A6FA5" }} />
                    <h3
                      className="text-base font-bold truncate"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      {p.school}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" style={{ color: "var(--dl-text-muted, #8890A5)" }} />
                    <span
                      className="text-xs"
                      style={{ color: "var(--dl-text-muted, #8890A5)" }}
                    >
                      {p.state} &middot; Class of {p.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Spike */}
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles className="h-3 w-3" style={{ color: "#4A6FA5" }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "#4A6FA5" }}
                  >
                    Spike
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed line-clamp-2"
                  style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                >
                  {p.spike}
                </p>
              </div>

              {/* Story */}
              {p.story && (
                <div className="mb-3">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: "var(--dl-text-muted, #8890A5)" }}
                  >
                    What worked
                  </p>
                  <p
                    className="text-xs leading-relaxed line-clamp-3"
                    style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                  >
                    {p.story}
                  </p>
                </div>
              )}

              {/* Stats row */}
              <div className="flex gap-3 mb-3">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "var(--dl-text-muted, #8890A5)" }}
                  >
                    GPA
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--dl-text-primary, #1B2030)" }}
                  >
                    {p.gpa.toFixed(2)}
                  </p>
                </div>
                {p.sat && (
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--dl-text-muted, #8890A5)" }}
                    >
                      SAT
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      {p.sat}
                    </p>
                  </div>
                )}
                {p.act && (
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--dl-text-muted, #8890A5)" }}
                    >
                      ACT
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--dl-text-primary, #1B2030)" }}
                    >
                      {p.act}
                    </p>
                  </div>
                )}
              </div>

              {/* Features used */}
              <div className="flex flex-wrap gap-1.5">
                {p.featuresUsed.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: "rgba(74,111,165,0.08)",
                      color: "#4A6FA5",
                    }}
                  >
                    {FEATURE_ICONS[f]}
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
