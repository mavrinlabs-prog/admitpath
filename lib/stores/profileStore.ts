import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Activity {
  name: string;
  role?: string;
  hoursPerWeek?: number;
  yearsInvolved?: number;
}

/** Strongly-typed onboarding data matching the Profile model and analyze API. */
export interface OnboardingData {
  // Academics
  gpa?: number;
  weightedGpa?: number;
  satScore?: number;
  actScore?: number;
  grade?: number;
  state?: string;

  // Extracurriculars & achievements
  activities?: Activity[];
  awards?: string[];
  courses?: string[];

  // Goals
  intendedMajor?: string;
  targetColleges?: string[];
  admissionsConcern?: string;

  // Financial (optional, powers /money)
  householdIncome?: number;
  siblingsInCollege?: number;
}

/** Fields that contribute to profile-completion percentage. */
const COMPLETION_FIELDS: (keyof OnboardingData)[] = [
  "gpa",
  "grade",
  "state",
  "activities",
  "awards",
  "courses",
  "intendedMajor",
  "targetColleges",
  "satScore", // SAT or ACT — either counts
];

interface ProfileState {
  // -- Onboarding wizard --
  onboardingStep: number;
  onboardingData: OnboardingData;

  // -- Async flags --
  analysisInProgress: boolean;

  // -- Derived (computed on every set) --
  /** 0-100 profile completion percentage. */
  profileCompletePct: number;

  // -- Actions --
  setOnboardingStep: (step: number) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  setAnalysisInProgress: (v: boolean) => void;

  /** Replace onboarding data wholesale (e.g. hydrating from server). */
  hydrateOnboardingData: (data: OnboardingData) => void;

  /** Clean reset — returns store to its initial empty state. */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Sanitize and validate incoming onboarding data before merging. */
function validateOnboardingData(raw: Partial<OnboardingData>): Partial<OnboardingData> {
  const clean: Partial<OnboardingData> = { ...raw };

  if (clean.gpa !== undefined) {
    clean.gpa = clamp(Number(clean.gpa) || 0, 0, 4.5);
  }
  if (clean.weightedGpa !== undefined) {
    clean.weightedGpa = clamp(Number(clean.weightedGpa) || 0, 0, 5.5);
  }
  if (clean.satScore !== undefined) {
    clean.satScore = clamp(Math.round(Number(clean.satScore) || 0), 400, 1600);
  }
  if (clean.actScore !== undefined) {
    clean.actScore = clamp(Math.round(Number(clean.actScore) || 0), 1, 36);
  }
  if (clean.grade !== undefined) {
    clean.grade = clamp(Math.round(Number(clean.grade) || 9), 7, 12);
  }
  if (clean.householdIncome !== undefined) {
    clean.householdIncome = Math.max(0, Math.round(Number(clean.householdIncome) || 0));
  }
  if (clean.siblingsInCollege !== undefined) {
    clean.siblingsInCollege = clamp(Math.round(Number(clean.siblingsInCollege) || 0), 0, 20);
  }
  if (clean.activities !== undefined) {
    clean.activities = (clean.activities ?? []).slice(0, 30);
  }
  if (clean.awards !== undefined) {
    clean.awards = (clean.awards ?? []).slice(0, 30);
  }
  if (clean.courses !== undefined) {
    clean.courses = (clean.courses ?? []).slice(0, 60);
  }
  if (clean.targetColleges !== undefined) {
    clean.targetColleges = (clean.targetColleges ?? []).slice(0, 40);
  }
  if (clean.admissionsConcern !== undefined) {
    clean.admissionsConcern = (clean.admissionsConcern ?? "").slice(0, 2000);
  }
  if (clean.intendedMajor !== undefined) {
    clean.intendedMajor = (clean.intendedMajor ?? "").slice(0, 120);
  }

  return clean;
}

// ---------------------------------------------------------------------------
// Completion calculator
// ---------------------------------------------------------------------------

function computeCompletionPct(data: OnboardingData): number {
  const filled = COMPLETION_FIELDS.filter((key) => {
    const val = data[key];
    if (val === undefined || val === null) return false;
    if (typeof val === "string") return val.trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "number") return true;
    return false;
  });

  // SAT or ACT counts as one field -- don't double-count
  const hasTestScore = data.satScore !== undefined || data.actScore !== undefined;
  const totalFields = COMPLETION_FIELDS.length; // satScore is already in list
  const filledCount = filled.length;

  // Bonus: having ACT when SAT is already counted doesn't add extra,
  // but we don't penalize for missing one if the other is present.
  const adjusted = hasTestScore && !filled.includes("satScore")
    ? filledCount + 1
    : filledCount;

  return Math.min(100, Math.round((adjusted / totalFields) * 100));
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const INITIAL_STATE = {
  onboardingStep: 0,
  onboardingData: {} as OnboardingData,
  analysisInProgress: false,
  profileCompletePct: 0,
} as const;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setOnboardingStep: (step) =>
        set({ onboardingStep: Math.max(0, step) }),

      setOnboardingData: (data) =>
        set((s) => {
          const validated = validateOnboardingData(data);
          const merged = { ...s.onboardingData, ...validated };
          return {
            onboardingData: merged,
            profileCompletePct: computeCompletionPct(merged),
          };
        }),

      setAnalysisInProgress: (v) =>
        set({ analysisInProgress: v }),

      hydrateOnboardingData: (data) =>
        set({
          onboardingData: data,
          profileCompletePct: computeCompletionPct(data),
        }),

      reset: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: "admitpath-profile",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      // Only persist the data that should survive navigation, not transient flags.
      partialize: (state) => ({
        onboardingStep: state.onboardingStep,
        onboardingData: state.onboardingData,
        profileCompletePct: state.profileCompletePct,
      }),
    }
  )
);
