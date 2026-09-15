export const ESSAY_TYPE_VALUES = [
  "personal_statement",
  "supplemental",
  "why_us",
  "activity",
  "other",
] as const;

export type EssayType = (typeof ESSAY_TYPE_VALUES)[number];

export const ESSAY_TYPE_LABELS: Record<EssayType, string> = {
  personal_statement: "Personal statement",
  supplemental: "Supplemental essay",
  why_us: "Why this college",
  activity: "Activity essay",
  other: "Other",
};
