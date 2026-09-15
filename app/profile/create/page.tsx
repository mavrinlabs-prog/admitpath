"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { apiFetch, isApiError, redirectToSignIn } from "@/lib/api-client";
import {
  ArrowLeft, ArrowRight, Check, GraduationCap, MapPin,
  BarChart3, Users, BookOpen, Award, Heart,
} from "lucide-react";
import { Stepper, StepperLabels } from "@/components/ui/stepper";
import { analytics } from "@/lib/analytics";
import { ResumeQuickImport, type Extracted as ResumeExtracted } from "@/components/resume-quick-import";
import type { ProfileSaveResponse } from "@/lib/profile-contract";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const TOTAL_STEPS = 7;
const DRAFT_KEY = "admitpath:profile-draft:v1";

function formatSavedAt(d: Date) {
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

const STEP_META = [
  { icon: GraduationCap, label: "Grade" },
  { icon: MapPin, label: "Colleges" },
  { icon: BarChart3, label: "Scores" },
  { icon: Users, label: "Activities" },
  { icon: BookOpen, label: "Major" },
  { icon: Award, label: "Extras" },
  { icon: Heart, label: "Concerns" },
];

export default function ProfileCreatePage() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState(1);
  const [shakeKey, setShakeKey] = useState(0);

  const [form, setForm] = useState({
    grade: "",
    targetColleges: "",
    gpa: "",
    weightedGpa: "",
    satScore: "",
    actScore: "",
    activities: "",
    intendedMajor: "",
    admissionsConcern: "",
    awards: "",
    courses: "",
    state: "",
  });

  // Hydration-safe: only render the draft banner / saved indicator after the
  // first client effect runs. Server output never reads localStorage, so the
  // initial DOM has neither piece of UI; we flip `mounted` on once we've
  // checked storage to avoid SSR/client mismatch flashes.
  const [mounted, setMounted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const STEP_ENCOURAGEMENTS: Record<number, string> = {
    1: "Great start!",
    2: "Nice choices!",
    3: "Looking strong!",
    4: "Keep going!",
    5: "Almost there!",
    6: "Almost there!",
    7: "Last step!",
  };

  const STEPPER_STEPS = STEP_META.map((meta, i) => ({
    id: `step-${i + 1}`,
    label: meta.label,
  }));

  // Restore-on-mount: if a non-empty draft is stashed in localStorage, hydrate
  // the form state from it and show the "Restored from draft" banner. We
  // always restore (simpler approach per spec) — if the user has already
  // submitted, they'll just see their last draft and can hit "Start over".
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<typeof form>;
        const hasAnyValue = Object.values(parsed).some((v) => typeof v === "string" && v.trim().length > 0);
        if (hasAnyValue) {
          setForm((f) => ({ ...f, ...parsed }));
          setRestored(true);
        }
      }
    } catch {
      // Ignore corrupt JSON / SecurityError — fall through to a clean form.
    }
    setMounted(true);
    analytics.profileStarted();
  }, []);

  useEffect(() => {
    let cancelled = false;
    void apiFetch<Record<string, unknown>>("/api/profile")
      .then((profile) => {
        if (cancelled || !profile || Object.keys(profile).length === 0) return;
        const stringList = (value: unknown) =>
          Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").join("\n") : "";
        const activityList = Array.isArray(profile.activities)
          ? profile.activities.flatMap((item) => {
              if (!item || typeof item !== "object") return [];
              const activity = item as Record<string, unknown>;
              const name = typeof activity.name === "string" ? activity.name : "";
              const role = typeof activity.role === "string" ? activity.role : "";
              return name ? [[name, role].filter(Boolean).join(" - ")] : [];
            }).join("\n")
          : "";
        const awardList = Array.isArray(profile.awards)
          ? profile.awards.flatMap((item) => {
              if (typeof item === "string") return [item];
              if (!item || typeof item !== "object") return [];
              const award = item as Record<string, unknown>;
              const name = typeof award.name === "string" ? award.name : "";
              const level = typeof award.level === "string" ? award.level : "";
              return name ? [[name, level].filter(Boolean).join(" - ")] : [];
            }).join("\n")
          : "";
        setForm((current) => ({
          grade: current.grade || (typeof profile.grade === "number" ? String(profile.grade) : ""),
          targetColleges: current.targetColleges || stringList(profile.targetColleges),
          gpa: current.gpa || (typeof profile.gpa === "number" ? String(profile.gpa) : ""),
          weightedGpa: current.weightedGpa || (typeof profile.weightedGpa === "number" ? String(profile.weightedGpa) : ""),
          satScore: current.satScore || (typeof profile.satScore === "number" ? String(profile.satScore) : ""),
          actScore: current.actScore || (typeof profile.actScore === "number" ? String(profile.actScore) : ""),
          activities: current.activities || activityList,
          intendedMajor: current.intendedMajor || (typeof profile.intendedMajor === "string" ? profile.intendedMajor : ""),
          admissionsConcern: current.admissionsConcern || (typeof profile.admissionsConcern === "string" ? profile.admissionsConcern : ""),
          awards: current.awards || awardList,
          courses: current.courses || stringList(profile.courses),
          state: current.state || (typeof profile.state === "string" ? profile.state : ""),
        }));
      })
      .catch((error) => {
        if (isApiError(error) && error.status === 401) redirectToSignIn();
      });
    return () => { cancelled = true; };
  }, []);

  // Debounced auto-save. 500ms after the last change we serialize the whole
  // form object. The cleanup clears any pending timer so a fast typist
  // doesn't queue up overlapping writes.
  useEffect(() => {
    if (!mounted) return;
    setSavingDraft(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        setSavedAt(new Date());
      } catch {
        // Storage quota / private mode — silently no-op.
      } finally {
        setSavingDraft(false);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, mounted]);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (inlineError) setInlineError(null);
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    setForm({
      grade: "", targetColleges: "", gpa: "", weightedGpa: "",
      satScore: "", actScore: "", activities: "", intendedMajor: "",
      admissionsConcern: "", awards: "", courses: "", state: "",
    });
    setRestored(false);
    setSavedAt(null);
  }

  function handleResumeImported(data: ResumeExtracted) {
    const courseStrings = (data.courses ?? []).map((course) =>
      [course.type, course.name, course.score ? `(${course.score})` : ""]
        .filter(Boolean)
        .join(" ")
        .trim()
    );

    setForm((current) => ({
      ...current,
      grade: data.academic.grade ? String(data.academic.grade) : current.grade,
      gpa: data.academic.gpa != null ? String(data.academic.gpa) : current.gpa,
      weightedGpa: data.academic.weightedGpa != null ? String(data.academic.weightedGpa) : current.weightedGpa,
      satScore: data.academic.satScore != null ? String(data.academic.satScore) : current.satScore,
      actScore: data.academic.actScore != null ? String(data.academic.actScore) : current.actScore,
      state: data.academic.state ?? current.state,
      intendedMajor: data.academic.intendedMajor ?? current.intendedMajor,
      activities:
        data.activities.length > 0
          ? data.activities.map((a) => [a.name, a.role].filter(Boolean).join(" - ")).join("\n")
          : current.activities,
      awards:
        data.awards.length > 0
          ? data.awards.map((a) => [a.name, a.level].filter(Boolean).join(" - ")).join("\n")
          : current.awards,
      courses: courseStrings.length > 0 ? courseStrings.join("\n") : current.courses,
    }));
    setRestored(true);
    setInlineError(null);
    toast.success("Resume details filled into the profile form.");
  }

  // Per-step validation. Returns null if valid, or a short error message.
  // Keeps the form honest — users can't click straight through with empty
  // fields and submit a hollow profile that breaks downstream scoring.
  function validateStep(s: Step, f: typeof form): string | null {
    switch (s) {
      case 1: {
        const g = parseInt(f.grade, 10);
        if (!Number.isFinite(g) || g < 7 || g > 12) {
          return "Pick the grade you're in (7–12).";
        }
        return null;
      }
      case 3: {
        const gpa = parseFloat(f.gpa);
        if (!Number.isFinite(gpa) || gpa < 0 || gpa > 4.0) {
          return "Enter a valid unweighted GPA (0.0–4.0).";
        }
        if (f.satScore) {
          const sat = parseInt(f.satScore, 10);
          if (!Number.isFinite(sat) || sat < 400 || sat > 1600) {
            return "SAT must be between 400 and 1600 (or leave blank).";
          }
        }
        if (f.actScore) {
          const act = parseInt(f.actScore, 10);
          if (!Number.isFinite(act) || act < 1 || act > 36) {
            return "ACT must be between 1 and 36 (or leave blank).";
          }
        }
        return null;
      }
      // Steps 2, 4–7 are optional / soft-validated; users can continue
      // without filling them.
      default:
        return null;
    }
  }

  const stepError = validateStep(step, form);
  const [inlineError, setInlineError] = useState<string | null>(null);

  function goNext() {
    const err = validateStep(step, form);
    if (err) {
      toast.error(err);
      setInlineError(err);
      setShakeKey((k) => k + 1);
      return;
    }
    setInlineError(null);
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step);
  }
  function goPrev() {
    setInlineError(null);
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1) as Step);
  }

  // Keyboard navigation: arrow left/right to step between wizard steps.
  // Only fires when focus is not inside an input/textarea so normal typing
  // is never intercepted. Re-attaches on step/form change so goNext/goPrev
  // closures always reference current state.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, form]);

  async function handleSubmit() {
    // Re-validate every gating step before submit — guards against URL/state
    // tampering and catches anyone who clicked back into an invalid state.
    for (const s of [1, 3] as Step[]) {
      const err = validateStep(s, form);
      if (err) {
        setStep(s);
        toast.error(err);
        return;
      }
    }
    setSaving(true);
    try {
      const payload = {
        grade: parseInt(form.grade) || undefined,
        gpa: parseFloat(form.gpa) || undefined,
        weightedGpa: form.weightedGpa ? parseFloat(form.weightedGpa) : undefined,
        satScore: form.satScore ? parseInt(form.satScore) : undefined,
        actScore: form.actScore ? parseInt(form.actScore) : undefined,
        intendedMajor: form.intendedMajor || undefined,
        state: form.state || undefined,
        targetColleges: form.targetColleges
          ? form.targetColleges.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
          : [],
        admissionsConcern: form.admissionsConcern || undefined,
        activities: form.activities ? form.activities.split("\n").map((a) => a.trim()).filter(Boolean).map((a) => ({ name: a, provenance: "MANUAL" as const })) : [],
        awards: form.awards ? form.awards.split("\n").filter(Boolean) : [],
        courses: form.courses ? form.courses.split("\n").filter(Boolean) : [],
      };

      try {
        const saved = await apiFetch<ProfileSaveResponse>("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (saved.persisted !== true || !saved.profile) {
          throw new Error("The server did not confirm the saved profile.");
        }
        // Submitted cleanly — wipe the draft so the next visit isn't haunted
        // by stale data from the version they just saved server-side.
        try { localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
        analytics.profileCompleted(TOTAL_STEPS);
        // Show celebration screen, then auto-redirect to /analyze with auto-run
        setShowCelebration(true);
        setTimeout(() => router.push("/analyze?autorun=1"), 1500);
      } catch (e) {
        if (isApiError(e)) {
          if (e.isAuth) { redirectToSignIn(); return; }
          if (e.isRateLimited) { toast.error("Slow down — try again in a minute."); return; }
          toast.error(e.message);
        } else {
          toast.error("Failed to save profile. Please try again.");
        }
      }
    } finally {
      setSaving(false);
    }
  }

  const steps: Array<{ title: string; subtitle: string; content: React.ReactNode }> = [
    {
      title: "Select your grade",
      subtitle: "Whether you're planning ahead or applying now, we tailor your roadmap to your year.",
      content: (
        <div>
          <label className="label" id="grade-label">Current grade</label>
          <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-labelledby="grade-label">
            {[7, 8, 9, 10, 11, 12].map((g) => (
              <button
                key={g}
                role="radio"
                aria-checked={form.grade === String(g)}
                onClick={() => update("grade", String(g))}
                className="dl-card-hover rounded-2xl border-2 py-4 text-center font-bold transition-all duration-200"
                style={
                  form.grade === String(g)
                    ? { borderColor: "#4A6FA5", backgroundColor: "rgba(74,111,165,0.08)", color: "#4A6FA5" }
                    : { borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)", color: "var(--dl-text-secondary, #454B5E)" }
                }
              >
                <span className="block text-2xl font-bold" style={{ fontFamily: "var(--font-inter)" }}>{g}</span>
                <span className="text-xs">Grade</span>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Which colleges are you targeting?",
      subtitle: "List your dream schools — we'll use these for match scoring.",
      content: (
        <div>
          <label className="label" htmlFor="profile-targets">Target colleges (one per line or comma-separated)</label>
          <textarea
            id="profile-targets"
            className="input-field h-36 resize-none"
            placeholder={"Harvard\nMIT\nStanford\nUniversity of Florida\nFSU"}
            value={form.targetColleges}
            onChange={(e) => update("targetColleges", e.target.value)}
          />
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Include reach, target, and safety schools for the best recommendations.
          </p>
        </div>
      ),
    },
    {
      title: "GPA and test scores",
      subtitle: "Leave blank if you haven't tested yet — no worries.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="profile-gpa">Unweighted GPA (0–4.0)</label>
              <input
                id="profile-gpa"
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                className="input-field"
                placeholder="3.85"
                value={form.gpa}
                onChange={(e) => update("gpa", e.target.value)}
              />
              <p className="mt-1 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Your standard 4.0-scale GPA without AP/honors weighting.
              </p>
            </div>
            <div>
              <label className="label" htmlFor="profile-weighted-gpa">Weighted GPA (optional)</label>
              <input
                id="profile-weighted-gpa"
                type="number"
                step="0.01"
                min="0"
                max="5.5"
                className="input-field"
                placeholder="4.20"
                value={form.weightedGpa}
                onChange={(e) => update("weightedGpa", e.target.value)}
              />
              <p className="mt-1 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                Includes AP/honors boost. Check your transcript or ask your counselor.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="profile-sat">SAT score (400–1600)</label>
              <input
                id="profile-sat"
                type="number"
                min="400"
                max="1600"
                className="input-field"
                placeholder="1450"
                value={form.satScore}
                onChange={(e) => update("satScore", e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="profile-act">ACT score (1–36)</label>
              <input
                id="profile-act"
                type="number"
                min="1"
                max="36"
                className="input-field"
                placeholder="32"
                value={form.actScore}
                onChange={(e) => update("actScore", e.target.value)}
              />
            </div>
          </div>
          <p className="text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Many schools are test-optional. Leave blank if you haven&apos;t tested yet -- we&apos;ll still score your profile accurately.
          </p>
        </div>
      ),
    },
    {
      title: "Tell us about your activities",
      subtitle: "List your 3–10 most meaningful activities. Include hours per week if possible.",
      content: (
        <div>
          <label className="label" htmlFor="profile-activities">Activities (one per line)</label>
          <textarea
            id="profile-activities"
            className="input-field h-40 resize-none"
            placeholder={"Varsity soccer captain, 15h/wk\nSchool newspaper editor, 8h/wk\nNational Honor Society president"}
            value={form.activities}
            onChange={(e) => update("activities", e.target.value)}
          />
          <p className="mt-2 text-xs" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Be specific — leadership roles, impact, and time commitment all matter.
          </p>
        </div>
      ),
    },
    {
      title: "What do you want to study?",
      subtitle: "Undecided is fine. You can pick multiple if you're exploring.",
      content: (
        <div>
          <label className="label" htmlFor="profile-major">Intended major(s)</label>
          <input
            id="profile-major"
            type="text"
            className="input-field"
            placeholder="e.g. Computer Science, Pre-med, Undecided"
            value={form.intendedMajor}
            onChange={(e) => update("intendedMajor", e.target.value)}
          />
          <p className="mt-1 text-[11px]" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
            Separate multiple majors with commas. Tap chips below to add quickly.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Computer Science", "Pre-med", "Business", "Engineering", "Liberal Arts", "Psychology", "Biology", "Undecided"].map((major) => {
              const currentMajors = form.intendedMajor.split(",").map(m => m.trim().toLowerCase()).filter(Boolean);
              const selected = currentMajors.includes(major.toLowerCase());
              return (
                <motion.button
                  key={major}
                  layout
                  initial={false}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    if (selected) {
                      // Remove this major from the list
                      const updated = form.intendedMajor.split(",").map(m => m.trim()).filter(m => m.toLowerCase() !== major.toLowerCase()).join(", ");
                      update("intendedMajor", updated);
                    } else {
                      // Add this major to the list
                      const current = form.intendedMajor.trim();
                      update("intendedMajor", current ? `${current}, ${major}` : major);
                    }
                  }}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150"
                  style={
                    selected
                      ? { borderColor: "#4A6FA5", backgroundColor: "rgba(74,111,165,0.08)", color: "#4A6FA5" }
                      : { borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)", color: "var(--dl-text-secondary, #454B5E)" }
                  }
                >
                  {major}
                </motion.button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Awards, courses, and location",
      subtitle: "Every honor strengthens your profile.",
      content: (
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="profile-awards">Awards and honors (one per line)</label>
            <textarea
              id="profile-awards"
              className="input-field h-24 resize-none"
              placeholder={"National Merit Semifinalist\nState DECA placer\nPresidential Scholar nominee"}
              value={form.awards}
              onChange={(e) => update("awards", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="profile-courses">AP / IB / Honors courses (one per line)</label>
            <textarea
              id="profile-courses"
              className="input-field h-20 resize-none"
              placeholder={"AP Calculus BC\nAP Computer Science A\nIB English HL"}
              value={form.courses}
              onChange={(e) => update("courses", e.target.value)}
            />
            {/* Structured course chips — toggle the top APs so students who
                don't want to type can just tap. The chips append/remove
                lines from the textarea using the same pattern as the
                concerns chips in step 7, so the underlying form state
                stays a single string the API already understands. */}
            <p className="mt-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Tap the ones you&apos;ve taken (or are taking)
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                // Top APs by enrollment, plus IB markers + an Honors flag.
                // Keeping list focused so the chip cluster doesn't overwhelm —
                // any course not here gets typed into the textarea above.
                "AP Calculus AB", "AP Calculus BC", "AP Statistics",
                "AP Biology", "AP Chemistry", "AP Physics 1",
                "AP Physics C: Mechanics", "AP Computer Science A",
                "AP Computer Science Principles", "AP English Lang",
                "AP English Lit", "AP US History", "AP World History",
                "AP European History", "AP US Government", "AP Macroeconomics",
                "AP Microeconomics", "AP Psychology", "AP Spanish",
                "AP French", "AP Latin", "AP Art History",
                "AP Studio Art", "AP Music Theory", "AP Environmental Science",
                "AP Human Geography", "AP Seminar", "AP Research",
                "IB English HL", "IB Math AA HL", "IB Math AI SL",
                "IB Biology HL", "IB Chemistry HL", "IB History HL",
                "IB Theory of Knowledge", "Honors Math", "Honors English",
                "Dual Enrollment",
              ].map((course) => {
                const current = form.courses;
                const has = current
                  .split(/\r?\n/)
                  .some((line) => line.trim().toLowerCase() === course.toLowerCase());
                return (
                  <motion.button
                    key={`${course}-${has}`}
                    type="button"
                    initial={{ scale: 0.94 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => {
                      if (has) {
                        const next = current
                          .split(/\r?\n/)
                          .filter((line) => line.trim().toLowerCase() !== course.toLowerCase())
                          .join("\n")
                          .replace(/\n{2,}/g, "\n")
                          .replace(/^\s+|\s+$/g, "");
                        update("courses", next);
                      } else {
                        update(
                          "courses",
                          current.trim() ? `${current.replace(/\s+$/, "")}\n${course}` : course
                        );
                      }
                    }}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150"
                    style={
                      has
                        ? { borderColor: "#4A6FA5", backgroundColor: "rgba(74,111,165,0.08)", color: "#4A6FA5" }
                        : { borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)", color: "var(--dl-text-secondary, #454B5E)" }
                    }
                  >
                    {course}
                  </motion.button>
                );
              })}
            </div>
          </div>
          {/* Math progression — by-year tracker. Admissions officers
              care about where you are in the math sequence relative to
              grade. This adds a single "Current math: <level>" line to
              the courses textarea. */}
          <div>
            <p className="label">Current math level</p>
            <p className="text-[11px] mb-2" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              Where are you in the math sequence right now?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Pre-Algebra",
                "Algebra I",
                "Geometry",
                "Algebra II",
                "Precalculus",
                "AP Calculus AB",
                "AP Calculus BC",
                "AP Statistics",
                "Multivariable Calc",
                "Linear Algebra",
              ].map((level) => {
                const prefix = "Current math: ";
                const has = form.courses
                  .split(/\r?\n/)
                  .some((line) => line.trim() === `${prefix}${level}`);
                return (
                  <motion.button
                    key={`math-${level}-${has}`}
                    type="button"
                    initial={{ scale: 0.94 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => {
                      // Remove any existing math level line first
                      const stripped = form.courses
                        .split(/\r?\n/)
                        .filter((line) => !line.trim().startsWith(prefix))
                        .join("\n")
                        .replace(/\n{2,}/g, "\n")
                        .replace(/^\s+|\s+$/g, "");
                      if (has) {
                        // Deselect
                        update("courses", stripped);
                      } else {
                        // Select this level (exclusive — only one math level at a time)
                        update(
                          "courses",
                          stripped ? `${prefix}${level}\n${stripped}` : `${prefix}${level}`
                        );
                      }
                    }}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150"
                    style={
                      has
                        ? { borderColor: "#4A6FA5", backgroundColor: "rgba(74,111,165,0.08)", color: "#4A6FA5" }
                        : { borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)", color: "var(--dl-text-secondary, #454B5E)" }
                    }
                  >
                    {level}
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="profile-state">State of residence</label>
            <input
              id="profile-state"
              type="text"
              className="input-field"
              placeholder="e.g. Florida"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "What's your biggest admissions concern?",
      subtitle: "Honesty helps us build a better roadmap for you.",
      content: (
        <div>
          <label className="label" htmlFor="profile-concern">Biggest concern</label>
          <textarea
            id="profile-concern"
            className="input-field h-32 resize-none"
            placeholder={"e.g. My GPA dropped junior year.\nMy extracurriculars aren't very impressive.\nI don't know how to write a compelling essay."}
            value={form.admissionsConcern}
            onChange={(e) => update("admissionsConcern", e.target.value)}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Low GPA", "No standout activity", "Weak essays",
              "Test scores", "Late start", "Major uncertainty",
            ].map((concern) => {
              // Append/toggle instead of clobber. Concerns are a textarea —
              // users frequently combine 2–3 of them, and the prior behavior
              // wiped freeform text on every chip click.
              const current = form.admissionsConcern;
              const has = current.toLowerCase().includes(concern.toLowerCase());
              return (
                <motion.button
                  key={`${concern}-${has}`}
                  initial={{ scale: 0.94 }}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    if (has) {
                      // Remove the chip phrase (and any trailing comma/newline).
                      const next = current
                        .replace(new RegExp(`(^|[\\n,])\\s*${concern}\\s*(?=[\\n,]|$)`, "i"), "$1")
                        .replace(/^[\s,\n]+|[\s,\n]+$/g, "");
                      update("admissionsConcern", next);
                    } else {
                      update(
                        "admissionsConcern",
                        current.trim() ? `${current.replace(/\s+$/, "")}\n${concern}` : concern
                      );
                    }
                  }}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150"
                  style={
                    has
                      ? { borderColor: "#4A6FA5", backgroundColor: "rgba(74,111,165,0.08)", color: "#4A6FA5" }
                      : { borderColor: "rgba(0,0,0,0.06)", backgroundColor: "rgba(255,255,255,0.45)", color: "var(--dl-text-secondary, #454B5E)" }
                  }
                >
                  {concern}
                </motion.button>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step - 1];
  const StepIcon = STEP_META[step - 1].icon;

  // Celebration screen — shown after successful profile save
  if (showCelebration) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
      >
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated check circle */}
          <motion.div
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, #4A6FA5, #2E4A6E)" }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </motion.div>

          {/* Confetti-style floating particles — deterministic positions
              from index to avoid hydration mismatches (no Math.random). */}
          {[...Array(12)].map((_, i) => {
            // Deterministic pseudo-random spread seeded from index
            const seed = ((i * 7 + 3) % 11) / 11; // 0..1 deterministic per i
            const size = 8 + seed * 8;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: ["#4A6FA5", "#2E4A6E", "#1E3352", "#22C55E", "#EAB308"][i % 5],
                  left: `${20 + (i * 5) % 60}%`,
                  top: `${30 + (i * 3) % 20}%`,
                }}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -80 - seed * 120],
                  x: (seed - 0.5) * 200,
                }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.08, ease: "easeOut" }}
              />
            );
          })}

          <motion.h1
            className="text-[32px] font-bold leading-tight"
            style={{ color: "#1B2030", letterSpacing: "-0.02em", fontFamily: "var(--font-inter)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            Profile saved. Let&apos;s see your score.
          </motion.h1>
          <motion.p
            className="mt-3 text-[16px] leading-relaxed"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Running your 7-dimension analysis now...
          </motion.p>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <button
              onClick={() => router.push("/analyze?autorun=1")}
              className="dl-btn dl-btn-primary px-8 py-3 text-sm"
            >
              See my score now
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      {/* Top bar */}
      <div className="border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "var(--dl-text-secondary, #454B5E)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium" style={{ color: step >= 5 ? "#4A6FA5" : "var(--dl-text-muted, #5A6275)", fontWeight: step >= 5 ? 700 : 500 }}>
              {step >= 5 ? "Almost there!" : "~3 min"}
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--dl-text-muted, #5A6275)" }}>
              {step} of {TOTAL_STEPS}
            </span>
          </div>
        </div>
        {step === 1 && (
          <div className="mx-auto max-w-2xl px-4 pb-4 -mt-1">
            <ResumeQuickImport context="dashboard" onImported={handleResumeImported} />
          </div>
        )}

        {/* Stepper progress indicator */}
        <div className="mx-auto max-w-2xl px-4 pb-4">
          <Stepper
            steps={STEPPER_STEPS}
            currentStep={step - 1}
            onStepClick={(i) => {
              // Allow clicking back to completed steps only
              if (i < step - 1) {
                setDirection(-1);
                setStep((i + 1) as Step);
              }
            }}
          />
          <StepperLabels steps={STEPPER_STEPS} currentStep={step - 1} />
        </div>
      </div>

      {/* Step content */}
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Hydration-gated draft banner + saved indicator. Rendered only
              after `mounted` is true so the SSR HTML never disagrees with
              the post-hydration tree. */}
          {mounted && (
            <div className="mb-4 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em]">
              <div style={{ color: "var(--dl-text-muted, #5A6275)" }}>
                {restored ? (
                  <span>
                    Restored from draft ·{" "}
                    <button
                      type="button"
                      onClick={clearDraft}
                      className="underline hover:opacity-80"
                      style={{ color: "var(--dl-text-secondary, #454B5E)" }}
                      aria-label="Clear draft and start over"
                    >
                      Start over
                    </button>
                  </span>
                ) : (
                  <span>&nbsp;</span>
                )}
              </div>
              <div
                style={{ color: "var(--dl-text-muted, #5A6275)" }}
                aria-live="polite"
                aria-atomic="true"
              >
                {savingDraft
                  ? "Saving…"
                  : savedAt
                  ? `Saved ${formatSavedAt(savedAt)}`
                  : ""}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {/* Step header with encouragement micro-copy */}
              <div className="mb-8 flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: "#4A6FA5" }}
                >
                  <StepIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  {step > 1 && (
                    <motion.p
                      key={`encourage-${step}`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1"
                      style={{ color: "#4A6FA5" }}
                    >
                      {STEP_ENCOURAGEMENTS[step]}
                    </motion.p>
                  )}
                  <h1
                    className="text-2xl font-bold leading-tight"
                    style={{ color: "#1B2030", fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    {current.title}
                  </h1>
                  <p className="mt-1.5 text-sm" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
                    {current.subtitle}
                  </p>
                </div>
              </div>

              {/* Card */}
              <motion.div
                className="card dl-card-hover"
                key={`card-${step}-${shakeKey}`}
                animate={shakeKey > 0 ? { x: [0, -8, 8, -4, 4, 0] } : undefined}
                transition={{ duration: 0.32, ease: "easeInOut" }}
              >
                {current.content}

                {/* Inline validation error */}
                <AnimatePresence mode="wait">
                  {inlineError && (
                    <motion.p
                      key={inlineError}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="mt-4 text-sm font-medium rounded-lg px-3 py-2"
                      style={{ color: "#B91C1C", backgroundColor: "rgba(185,28,28,0.06)" }}
                    >
                      {inlineError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      onClick={goPrev}
                      aria-label={`Back to step ${step - 1}: ${STEP_META[step - 2]?.label}`}
                      className="flex items-center gap-2 rounded-md border px-5 py-2.5 min-h-[44px] text-sm font-medium transition-[filter] duration-150 ease-out hover:brightness-95 active:brightness-90"
                      style={{
                        borderColor: "rgba(0,0,0,0.06)",
                        color: "var(--dl-text-secondary, #454B5E)",
                        backgroundColor: "rgba(255,255,255,0.45)",
                      }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-3">
                    {/* Show "Skip for now" on optional steps (2, 4, 5, 6, 7) */}
                    {step < TOTAL_STEPS && step !== 1 && step !== 3 && (
                      <button
                        onClick={() => {
                          setInlineError(null);
                          setDirection(1);
                          setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step);
                        }}
                        className="text-sm font-medium transition-colors hover:opacity-70"
                        style={{ color: "var(--dl-text-muted, #5A6275)" }}
                      >
                        Skip for now
                      </button>
                    )}
                  {step < TOTAL_STEPS ? (
                    <button
                      onClick={goNext}
                      aria-label={`Continue to step ${step + 1}: ${STEP_META[step]?.label}`}
                      className="dl-btn dl-btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="dl-btn dl-btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <motion.span
                            className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </button>
                  )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
