/**
 * Single source of truth for the illustrative "Maya R." sample profile used in
 * marketing previews (hero report card, /analyze empty state, command-center
 * preview). These are clearly-labelled EXAMPLE values, not a real student and
 * not a claim about outcomes.
 */
export const SAMPLE_PROFILE = {
  name: "Maya R.",
  initials: "MR",
  detail: "Junior · Georgia",
  overall: 81,
  percentileLabel: "Top 18%",
  band: "Competitive",
  completion: 68,
  dimensions: [
    { key: "academicRigor", label: "Academic Rigor", score: 88 },
    { key: "leadership", label: "Leadership", score: 74 },
    { key: "awards", label: "Awards", score: 91 },
    { key: "activityDepth", label: "Activity Depth", score: 67 },
    { key: "spike", label: "Spike", score: 82 },
    { key: "essayQuality", label: "Essay Quality", score: 79 },
    { key: "recommendations", label: "Recommendations", score: 85 },
  ],
  priorityGap: {
    dimension: "Activity Depth",
    score: 67,
    summary: "Your biggest opportunity. Go deeper in one or two commitments instead of adding new ones.",
    nextStep: "Turn tutoring into a measurable program: track students served and hours per week this semester.",
  },
  actionPlan: [
    { text: "Take on a leadership role in Science Olympiad", priority: "High", done: false },
    { text: "Revise Common App draft — add two specific scenes", priority: "High", done: false },
    { text: "Ask Ms. Patel for a recommendation by Oct 1", priority: "Medium", done: true },
    { text: "Balance list: add two target schools", priority: "Medium", done: false },
  ],
} as const;

export type SampleDimension = (typeof SAMPLE_PROFILE.dimensions)[number];

export function lowestDimension(): SampleDimension {
  return [...SAMPLE_PROFILE.dimensions].sort((a, b) => a.score - b.score)[0];
}
