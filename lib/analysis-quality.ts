export const ANALYSIS_DIMENSIONS = [
  "academicRigor",
  "leadership",
  "awards",
  "activityDepth",
  "spike",
  "essayQuality",
  "recommendations",
] as const;

export type AnalysisDimension = (typeof ANALYSIS_DIMENSIONS)[number];

export type AnalysisEvidence = {
  text: string;
  source: "confirmed_profile" | "system_calculation" | "ai_inference";
};

export type DimensionAssessment = {
  score: number;
  explanation: string;
  evidenceUsed: AnalysisEvidence[];
  inference: string;
  missingEvidence: string[];
  confidence: "low" | "medium" | "high";
  priorityAction: string;
};

export type PriorityGap = {
  rank: number;
  dimension: AnalysisDimension;
  gap: string;
  evidence: string;
  whyItMatters: string;
  action: string;
};

export type OrderedAction = {
  priority: number;
  timeframe: "next_30_days" | "next_90_days" | "long_term";
  action: string;
  reason: string;
  linkedDimension: AnalysisDimension;
  successMeasure: string;
};

type ActivityInput = {
  name: string;
  role?: string;
  impact?: string;
  hoursPerWeek?: number;
  yearsInvolved?: number;
};

export type AnalysisProfileInput = {
  gpa?: number;
  weightedGpa?: number;
  satScore?: number;
  actScore?: number;
  grade?: number;
  activities?: ActivityInput[];
  awards?: string[];
  courses?: string[];
  intendedMajor?: string;
  targetColleges?: string[];
  essaySnippet?: string;
  recommendationNote?: string;
};

type AnalysisLike = Record<string, unknown> & {
  scores?: Partial<Record<AnalysisDimension, number>>;
  scoreExplanations?: Partial<Record<AnalysisDimension, string>>;
  gaps?: string[];
  roadmap?: {
    next30Days?: string[];
    next90Days?: string[];
    next365Days?: string[];
  };
};

const LABELS: Record<AnalysisDimension, string> = {
  academicRigor: "Academic Rigor",
  leadership: "Leadership",
  awards: "Awards",
  activityDepth: "Activity Depth",
  spike: "Spike / Focus",
  essayQuality: "Essay Quality",
  recommendations: "Recommendations",
};

const missingByDimension: Record<AnalysisDimension, string[]> = {
  academicRigor: ["school course availability", "course-by-year progression"],
  leadership: ["scope of responsibility", "measurable outcomes"],
  awards: ["selection level", "size of the eligible pool"],
  activityDepth: ["weekly hours", "years involved", "measurable outcomes"],
  spike: ["connection between activities", "external validation of the focus"],
  essayQuality: ["a complete current essay draft"],
  recommendations: ["recommender relationship length", "specific anecdotes the recommender can cite"],
};

const defaultActions: Record<AnalysisDimension, string> = {
  academicRigor: "Add the exact advanced courses completed and planned, including course level and school availability.",
  leadership: "Document one leadership example with the decision you owned, who was affected, and a measurable result.",
  awards: "For each earned distinction, add the competition level, selection criteria, and number of candidates when known.",
  activityDepth: "Complete hours, years, role progression, and one concrete outcome for the activity with the greatest commitment.",
  spike: "Choose the strongest existing theme and connect two documented activities through one concrete next project.",
  essayQuality: "Revise one scene in your own voice, adding a specific action, sensory detail, and reflection before rescoring it.",
  recommendations: "Choose a recommender who can describe a specific moment of growth, contribution, or intellectual engagement.",
};

function clean(value: unknown, max = 220): string {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function score(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, Math.round(parsed))) : 0;
}

function evidenceFor(dimension: AnalysisDimension, input: AnalysisProfileInput): AnalysisEvidence[] {
  const activities = input.activities ?? [];
  const courses = input.courses ?? [];
  const awards = input.awards ?? [];
  const evidence: AnalysisEvidence[] = [];
  const confirmed = (text: string) => evidence.push({ text: clean(text), source: "confirmed_profile" });

  if (dimension === "academicRigor") {
    confirmed(`Submitted GPA: ${input.gpa ?? "not provided"}${input.weightedGpa ? `; weighted GPA: ${input.weightedGpa}` : ""}.`);
    confirmed(courses.length ? `Submitted courses: ${courses.slice(0, 8).join(", ")}.` : "No course list was submitted.");
    if (input.satScore || input.actScore) confirmed(`Submitted testing: ${input.satScore ? `SAT ${input.satScore}` : ""}${input.satScore && input.actScore ? "; " : ""}${input.actScore ? `ACT ${input.actScore}` : ""}.`);
  } else if (dimension === "leadership") {
    const roles = activities.filter((item) => item.role).slice(0, 5);
    confirmed(roles.length ? `Submitted roles: ${roles.map((item) => `${item.name} (${item.role})`).join("; ")}.` : "No explicit activity roles were submitted.");
    const outcomes = activities.filter((item) => item.impact).slice(0, 3);
    confirmed(outcomes.length ? `Submitted outcomes: ${outcomes.map((item) => `${item.name}: ${item.impact}`).join("; ")}.` : "No measurable leadership outcomes were submitted.");
  } else if (dimension === "awards") {
    confirmed(awards.length ? `Submitted awards: ${awards.slice(0, 8).join("; ")}.` : "No awards were submitted.");
  } else if (dimension === "activityDepth") {
    confirmed(activities.length ? `Submitted activities: ${activities.slice(0, 6).map((item) => `${item.name}${item.hoursPerWeek ? `, ${item.hoursPerWeek} hr/week` : ""}${item.yearsInvolved ? `, ${item.yearsInvolved} year(s)` : ""}`).join("; ")}.` : "No activities were submitted.");
  } else if (dimension === "spike") {
    confirmed(`Submitted intended major: ${input.intendedMajor || "undecided"}.`);
    confirmed(activities.length ? `Submitted activity themes: ${activities.slice(0, 6).map((item) => item.name).join(", ")}.` : "No activities were submitted to establish a focus.");
  } else if (dimension === "essayQuality") {
    if ((input.grade ?? 11) <= 10) confirmed(`Submitted grade: ${input.grade}; essay quality is not included in the overall score at this stage.`);
    else confirmed(input.essaySnippet?.trim() ? `A ${input.essaySnippet.trim().split(/\s+/).length}-word essay sample was submitted.` : "No essay sample was submitted; any displayed essay score is provisional.");
  } else {
    confirmed(input.recommendationNote?.trim() ? `Submitted recommendation context: ${input.recommendationNote}.` : "No recommendation context was submitted; this score is provisional.");
  }

  return evidence.filter((item) => item.text);
}

function missingEvidence(dimension: AnalysisDimension, input: AnalysisProfileInput): string[] {
  if (dimension === "essayQuality" && (input.grade ?? 11) <= 10) return [];
  const missing = [...missingByDimension[dimension]];
  if (dimension === "academicRigor" && (input.courses?.length ?? 0) === 0) missing.unshift("completed and planned course list");
  if ((dimension === "leadership" || dimension === "activityDepth" || dimension === "spike") && (input.activities?.length ?? 0) === 0) missing.unshift("activity history");
  if (dimension === "awards" && (input.awards?.length ?? 0) === 0) missing.unshift("earned distinctions, if any");
  if (dimension === "essayQuality" && !input.essaySnippet?.trim()) missing.unshift("essay sample");
  if (dimension === "recommendations" && !input.recommendationNote?.trim()) missing.unshift("recommender context");
  return Array.from(new Set(missing)).slice(0, 3);
}

function inferenceFor(dimension: AnalysisDimension, input: AnalysisProfileInput): string {
  if (dimension === "essayQuality" && (input.grade ?? 11) <= 10) {
    return "No writing-quality inference was used; this dimension is marked not applicable for the current grade.";
  }
  return `AI interpretation: the ${LABELS[dimension]} score estimates the strength of the submitted evidence only. Missing information was not treated as an accomplishment, and the score is not an admissions prediction.`;
}

function selectRoadmapAction(result: AnalysisLike, dimension: AnalysisDimension, index: number): string {
  const candidates = [
    ...(result.roadmap?.next30Days ?? []),
    ...(result.roadmap?.next90Days ?? []),
    ...(result.roadmap?.next365Days ?? []),
  ].map((item) => clean(item, 320)).filter(Boolean);
  return candidates[index] ?? defaultActions[dimension];
}

export function normalizeAnalysisQuality<T extends AnalysisLike>(result: T, input: AnalysisProfileInput): T & {
  dimensionAssessments: Record<AnalysisDimension, DimensionAssessment>;
  priorityGaps: PriorityGap[];
  actionPlan: OrderedAction[];
  outcomeDisclaimer: string;
} {
  const scores = result.scores ?? {};
  const sorted = [...ANALYSIS_DIMENSIONS]
    .filter((dimension) => !((input.grade ?? 11) <= 10 && dimension === "essayQuality"))
    .sort((a, b) => score(scores[a]) - score(scores[b]));

  const dimensionAssessments = Object.fromEntries(ANALYSIS_DIMENSIONS.map((dimension, index) => {
    const evidenceUsed = evidenceFor(dimension, input);
    const gaps = missingEvidence(dimension, input);
    const explanation = clean(result.scoreExplanations?.[dimension], 700) ||
      `${LABELS[dimension]} is ${score(scores[dimension])}/100 based on the submitted evidence listed below. Add the missing evidence before treating this as a complete assessment.`;
    const confidence: DimensionAssessment["confidence"] = gaps.length === 0 ? "high" : evidenceUsed.length >= 2 && !/No |not submitted|provisional/i.test(evidenceUsed.map((item) => item.text).join(" ")) ? "medium" : "low";
    return [dimension, {
      score: score(scores[dimension]),
      explanation,
      evidenceUsed,
      inference: inferenceFor(dimension, input),
      missingEvidence: gaps,
      confidence,
      priorityAction: selectRoadmapAction(result, dimension, index),
    } satisfies DimensionAssessment];
  })) as Record<AnalysisDimension, DimensionAssessment>;

  const priorityGaps = sorted.slice(0, 3).map((dimension, index) => {
    const assessment = dimensionAssessments[dimension];
    return {
      rank: index + 1,
      dimension,
      gap: clean(result.gaps?.[index], 400) || `${LABELS[dimension]} has the lowest current evidence score (${assessment.score}/100).`,
      evidence: assessment.evidenceUsed.map((item) => item.text).join(" "),
      whyItMatters: `This is a planning priority because it is currently among the three lowest evidence-backed dimensions; it does not determine an admissions outcome by itself.`,
      action: assessment.priorityAction,
    };
  });

  const horizon: OrderedAction["timeframe"][] = ["next_30_days", "next_90_days", "long_term"];
  const actionPlan = priorityGaps.map((gap, index) => ({
    priority: index + 1,
    timeframe: horizon[index],
    action: gap.action,
    reason: `Targets ${LABELS[gap.dimension]} (${dimensionAssessments[gap.dimension].score}/100) using the submitted evidence and identified gaps.`,
    linkedDimension: gap.dimension,
    successMeasure: index === 0
      ? "The profile contains a new verified fact or measurable result that directly addresses this gap."
      : index === 1
        ? "A completed artifact, documented outcome, or confirmed plan can be added to the profile."
        : "Sustained progress is documented with dates, scope, and a result that can be independently described.",
  }));

  return Object.assign(result, {
    dimensionAssessments,
    priorityGaps,
    actionPlan,
    outcomeDisclaimer: "This report is an evidence-based planning aid, not a prediction or guarantee. Admissions decisions depend on institutional priorities and application materials that may not be represented here.",
  });
}
