import { z } from "zod";

/**
 * Request contract for POST /api/analyze.
 *
 * Production incident (2026-10): students who filled the profile manually
 * saw "/api/analyze 400 / Failed to load resource 400". Root causes found by
 * reproducing locally:
 *   - every line of the Activities textarea became one activity, so pasting a
 *     resume produced > 30 activities and the strict `.max(30)` rejected it;
 *   - weighted GPAs on 6.0 scales (common in TX/FL/GA) exceeded `.max(5.5)`;
 *   - long free-text lines exceeded per-item max lengths;
 *   - the client showed a generic message and never highlighted the field.
 *
 * The contract now NORMALIZES recoverable input (truncate long text, keep the
 * first N list items, drop out-of-range optional numbers) and records a
 * human-readable warning for each adjustment. It only REJECTS values that would
 * make the analysis wrong (e.g. an unweighted GPA of 9.2), and every rejection
 * carries a field-specific message the form renders next to the input.
 */

export const ANALYZE_LIMITS = {
  activities: 30,
  awards: 30,
  courses: 60,
  targetColleges: 40,
  activityName: 200,
  activityRole: 120,
  activityImpact: 500,
  award: 200,
  course: 120,
  college: 160,
  intendedMajor: 120,
  admissionsConcern: 2000,
  essaySnippet: 8000,
  recommendationNote: 2000,
} as const;

export type AnalyzeWarning = { field: string; message: string };

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

function toNumber(value: unknown): number | undefined {
  const cleaned = emptyToUndefined(value);
  if (typeof cleaned === "number") return Number.isFinite(cleaned) ? cleaned : undefined;
  if (typeof cleaned !== "string") return undefined;
  const match = cleaned.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function cleanString(value: unknown): string | undefined {
  const cleaned = emptyToUndefined(value);
  if (typeof cleaned === "number") return String(cleaned);
  if (typeof cleaned !== "string") return undefined;
  const trimmed = cleaned.replace(/\s+/g, " ").trim();
  return trimmed || undefined;
}

function listOfStrings(value: unknown, keys: string[] = ["name", "title", "course"]): string[] {
  if (typeof value === "string") {
    return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  }
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        for (const key of keys) {
          if (typeof record[key] === "string" && (record[key] as string).trim()) return (record[key] as string).trim();
        }
      }
      return "";
    })
    .filter(Boolean);
}

type RawActivity = {
  name: string;
  role?: string;
  impact?: string;
  hoursPerWeek?: number;
  yearsInvolved?: number;
};

function listOfActivities(value: unknown): RawActivity[] {
  const items = typeof value === "string"
    ? value.split(/\n/).map((line) => ({ name: line }))
    : Array.isArray(value) ? value : [];
  return items
    .map((item): RawActivity | null => {
      if (typeof item === "string") return { name: item.trim() };
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const name = cleanString(record.name ?? record.title ?? record.activity);
      if (!name) return null;
      return {
        name,
        role: cleanString(record.role),
        impact: cleanString(record.impact ?? record.description),
        hoursPerWeek: toNumber(record.hoursPerWeek),
        yearsInvolved: toNumber(record.yearsInvolved),
      };
    })
    .filter((item): item is RawActivity => Boolean(item && item.name.trim()));
}

/**
 * Normalize an arbitrary JSON body into the shape the analyzer expects and
 * collect warnings + blocking field errors. Pure — unit tested.
 */
export function normalizeAnalyzeRequest(raw: unknown): {
  data: Record<string, unknown>;
  warnings: AnalyzeWarning[];
  fieldErrors: Record<string, string[]>;
} {
  const body = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const warnings: AnalyzeWarning[] = [];
  const fieldErrors: Record<string, string[]> = {};
  const fail = (field: string, message: string) => {
    (fieldErrors[field] ??= []).push(message);
  };
  const truncate = (field: string, value: string | undefined, max: number): string | undefined => {
    if (!value) return value;
    if (value.length <= max) return value;
    warnings.push({ field, message: `Shortened to ${max} characters.` });
    return value.slice(0, max);
  };
  const cap = <T,>(field: string, list: T[], max: number, label: string): T[] => {
    if (list.length <= max) return list;
    warnings.push({ field, message: `Only the first ${max} ${label} were analyzed (${list.length} provided).` });
    return list.slice(0, max);
  };

  // GPA: required for a meaningful score, 0-5 scale. A 100-point GPA is the
  // most common mistake, so the message says exactly what to do.
  let gpa = toNumber(body.gpa);
  if (gpa === undefined) {
    gpa = 3.0;
    warnings.push({ field: "gpa", message: "No GPA entered; a 3.0 placeholder was used. Add your GPA for an accurate score." });
  } else if (gpa < 0 || gpa > 5) {
    fail("gpa", gpa > 5 && gpa <= 100
      ? "Enter your unweighted GPA on a 0–5 scale (for example 3.8). Percentage GPAs are not supported yet."
      : "Enter an unweighted GPA between 0.0 and 5.0.");
  }

  let weightedGpa = toNumber(body.weightedGpa);
  if (weightedGpa !== undefined && (weightedGpa < 0 || weightedGpa > 6)) {
    warnings.push({ field: "weightedGpa", message: "Weighted GPA was outside the 0–6 range and was ignored." });
    weightedGpa = undefined;
  }

  const satScore = toNumber(body.satScore);
  if (satScore !== undefined && (satScore < 400 || satScore > 1600 || !Number.isInteger(satScore))) {
    fail("satScore", "SAT must be a whole number between 400 and 1600, or leave it blank.");
  }
  const actScore = toNumber(body.actScore);
  if (actScore !== undefined && (actScore < 1 || actScore > 36 || !Number.isInteger(actScore))) {
    fail("actScore", "ACT must be a whole number between 1 and 36, or leave it blank.");
  }

  let grade = toNumber(body.grade);
  if (grade === undefined) grade = 11;
  if (!Number.isInteger(grade) || grade < 7 || grade > 12) {
    fail("grade", "Choose a grade between 7 and 12.");
  }

  const activities = cap("activities", listOfActivities(body.activities), ANALYZE_LIMITS.activities, "activities")
    .map((activity, index) => {
      const field = `activities.${index}`;
      const hours = activity.hoursPerWeek;
      const years = activity.yearsInvolved;
      return {
        name: truncate(field, activity.name, ANALYZE_LIMITS.activityName) ?? "",
        role: truncate(field, activity.role, ANALYZE_LIMITS.activityRole),
        impact: truncate(field, activity.impact, ANALYZE_LIMITS.activityImpact),
        hoursPerWeek: hours !== undefined && hours >= 0 && hours <= 168 ? hours : undefined,
        yearsInvolved: years !== undefined && years >= 0 && years <= 12 ? years : undefined,
      };
    });

  const awards = cap("awards", listOfStrings(body.awards), ANALYZE_LIMITS.awards, "awards")
    .map((award) => truncate("awards", award, ANALYZE_LIMITS.award) ?? "");
  const courses = cap("courses", listOfStrings(body.courses), ANALYZE_LIMITS.courses, "courses")
    .map((course) => truncate("courses", course, ANALYZE_LIMITS.course) ?? "");
  const targetColleges = cap("targetColleges", listOfStrings(body.targetColleges), ANALYZE_LIMITS.targetColleges, "colleges")
    .map((college) => truncate("targetColleges", college, ANALYZE_LIMITS.college) ?? "");

  return {
    data: {
      gpa,
      weightedGpa,
      satScore,
      actScore,
      grade,
      activities,
      awards,
      courses,
      intendedMajor: truncate("intendedMajor", cleanString(body.intendedMajor), ANALYZE_LIMITS.intendedMajor),
      targetColleges,
      admissionsConcern: truncate("admissionsConcern", cleanString(body.admissionsConcern), ANALYZE_LIMITS.admissionsConcern),
      essaySnippet: truncate("essaySnippet", typeof body.essaySnippet === "string" ? body.essaySnippet.trim() || undefined : undefined, ANALYZE_LIMITS.essaySnippet),
      recommendationNote: truncate("recommendationNote", cleanString(body.recommendationNote), ANALYZE_LIMITS.recommendationNote),
    },
    warnings,
    fieldErrors,
  };
}

/** Strict schema for the already-normalized payload (defence in depth). */
export const analyzeSchema = z.object({
  gpa: z.number().min(0).max(5),
  weightedGpa: z.number().min(0).max(6).optional(),
  satScore: z.number().int().min(400).max(1600).optional(),
  actScore: z.number().int().min(1).max(36).optional(),
  grade: z.number().int().min(7).max(12),
  activities: z.array(z.object({
    name: z.string().max(ANALYZE_LIMITS.activityName),
    role: z.string().max(ANALYZE_LIMITS.activityRole).optional(),
    impact: z.string().max(ANALYZE_LIMITS.activityImpact).optional(),
    hoursPerWeek: z.number().min(0).max(168).optional(),
    yearsInvolved: z.number().min(0).max(12).optional(),
  })).max(ANALYZE_LIMITS.activities),
  awards: z.array(z.string().max(ANALYZE_LIMITS.award)).max(ANALYZE_LIMITS.awards),
  courses: z.array(z.string().max(ANALYZE_LIMITS.course)).max(ANALYZE_LIMITS.courses),
  intendedMajor: z.string().max(ANALYZE_LIMITS.intendedMajor).optional(),
  targetColleges: z.array(z.string().max(ANALYZE_LIMITS.college)).max(ANALYZE_LIMITS.targetColleges),
  admissionsConcern: z.string().max(ANALYZE_LIMITS.admissionsConcern).optional(),
  essaySnippet: z.string().max(ANALYZE_LIMITS.essaySnippet).optional(),
  recommendationNote: z.string().max(ANALYZE_LIMITS.recommendationNote).optional(),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;

export type AnalyzeParseResult =
  | { ok: true; data: AnalyzeInput; warnings: AnalyzeWarning[] }
  | { ok: false; fieldErrors: Record<string, string[]>; warnings: AnalyzeWarning[] };

export function parseAnalyzeRequest(raw: unknown): AnalyzeParseResult {
  const normalized = normalizeAnalyzeRequest(raw);
  if (Object.keys(normalized.fieldErrors).length > 0) {
    return { ok: false, fieldErrors: normalized.fieldErrors, warnings: normalized.warnings };
  }
  const parsed = analyzeSchema.safeParse(normalized.data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { ok: false, fieldErrors, warnings: normalized.warnings };
  }
  return { ok: true, data: parsed.data, warnings: normalized.warnings };
}

/** Labels the form uses when summarizing field errors. */
export const ANALYZE_FIELD_LABELS: Record<string, string> = {
  gpa: "Unweighted GPA",
  weightedGpa: "Weighted GPA",
  satScore: "SAT",
  actScore: "ACT",
  grade: "Grade",
  activities: "Activities",
  awards: "Awards",
  courses: "Courses",
  intendedMajor: "Intended major",
  targetColleges: "Target colleges",
  admissionsConcern: "Biggest concern",
  essaySnippet: "Essay excerpt",
};
