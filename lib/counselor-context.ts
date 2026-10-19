export const MAX_COUNSELOR_PROFILE_CONTEXT_CHARS = 1_600;

type CounselorProfile = {
  grade?: number | null;
  gpa?: number | null;
  weightedGpa?: number | null;
  satScore?: number | null;
  actScore?: number | null;
  intendedMajor?: string | null;
  targetColleges?: unknown;
  admissionsConcern?: string | null;
  state?: string | null;
};

type CounselorAnalysis = {
  result?: unknown;
} | null;

function compactValue(value: unknown, maxChars = 120): string | null {
  if (typeof value !== "string") return null;
  const compacted = value.replace(/\s+/g, " ").trim();
  return compacted ? compacted.slice(0, maxChars) : null;
}

function compactTargetColleges(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((college) => compactValue(college, 80))
    .filter((college): college is string => Boolean(college))
    .slice(0, 6);
}

export function buildCounselorProfileContext(input: {
  profile: CounselorProfile | null;
  latestAnalysis?: CounselorAnalysis;
  plan?: string | null;
  /** Aggregate prior activity only — never essay text or other students' data. */
  activity?: {
    analysesRun?: number;
    essaysSaved?: number;
    latestEssayScore?: number | null;
    collegesSaved?: number;
  } | null;
  /** Route the student opened the counselor from, e.g. "/essays". */
  currentPage?: string | null;
}): string {
  const { profile, latestAnalysis } = input;
  const lines: string[] = ["[STUDENT CONTEXT]"];

  if (!profile) {
    lines.push("- Profile: not created");
  } else {
    if (profile.grade != null) lines.push(`- Grade: ${profile.grade}`);
    if (profile.gpa != null) lines.push(`- GPA: ${profile.gpa}`);
    if (profile.weightedGpa != null) lines.push(`- Weighted GPA: ${profile.weightedGpa}`);
    if (profile.satScore != null) lines.push(`- SAT: ${profile.satScore}`);
    if (profile.actScore != null) lines.push(`- ACT: ${profile.actScore}`);

    const major = compactValue(profile.intendedMajor);
    if (major) lines.push(`- Intended major: ${major}`);
    const state = compactValue(profile.state, 60);
    if (state) lines.push(`- State: ${state}`);

    const colleges = compactTargetColleges(profile.targetColleges);
    if (colleges.length) lines.push(`- Target schools: ${colleges.join(", ")}`);
    const concern = compactValue(profile.admissionsConcern, 240);
    if (concern) lines.push(`- Main concern: ${concern}`);
  }

  const result = latestAnalysis?.result;
  if (result && typeof result === "object") {
    const analysis = result as Record<string, unknown>;
    if (typeof analysis.overallScore === "number") {
      lines.push(`- Latest overall score: ${analysis.overallScore}/100`);
    }

    const scores = analysis.scores;
    if (scores && typeof scores === "object" && !Array.isArray(scores)) {
      const compactScores = Object.entries(scores as Record<string, unknown>)
        .filter((entry): entry is [string, number] => typeof entry[1] === "number")
        .slice(0, 7)
        .map(([name, score]) => `${name.slice(0, 32)} ${score}`);
      if (compactScores.length) lines.push(`- Dimension scores: ${compactScores.join(", ")}`);
    }
  }

  const activity = input.activity;
  if (activity) {
    const parts = [
      typeof activity.analysesRun === "number" ? `${activity.analysesRun} analyses run` : null,
      typeof activity.essaysSaved === "number" ? `${activity.essaysSaved} essays saved` : null,
      typeof activity.latestEssayScore === "number" ? `latest essay score ${activity.latestEssayScore}/100` : null,
      typeof activity.collegesSaved === "number" ? `${activity.collegesSaved} colleges on list` : null,
    ].filter(Boolean);
    if (parts.length) lines.push(`- Prior activity: ${parts.join(", ")}`);
  }

  const plan = compactValue(input.plan, 24);
  if (plan) lines.push(`- Plan: ${plan === "pro" ? "Pro (all tools unlocked)" : "Free (usage-capped; Pro tools locked — mention upgrade only if directly relevant)"}`);
  const page = compactValue(input.currentPage, 80);
  if (page) lines.push(`- Currently on screen: ${page}`);

  return lines.join("\n").slice(0, MAX_COUNSELOR_PROFILE_CONTEXT_CHARS);
}
