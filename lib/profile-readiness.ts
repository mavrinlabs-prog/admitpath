export type AnalysisProfile = {
  grade?: number | null;
  gpa?: number | null;
  activities?: unknown[] | null;
};

export function missingAnalysisProfileFields(profile: AnalysisProfile): string[] {
  const missing: string[] = [];
  if (!profile.grade || profile.grade < 7 || profile.grade > 12) missing.push("current grade");
  if (typeof profile.gpa !== "number" || profile.gpa < 0 || profile.gpa > 4.5) missing.push("unweighted GPA");
  if (!Array.isArray(profile.activities) || profile.activities.length === 0) missing.push("at least one activity");
  return missing;
}
