export const WORKSHEET_DESTINATIONS = {
  "common-app-essay-brainstorm": "/college-essay-topic-finder",
  "college-list-generator": "/college-list-builder",
  "activities-list-compressor": "/profile",
  "supplemental-essay-strategist": "/supplemental",
  "resume-architect": "/profile",
  "four-year-academic-plan": "/timeline",
  "activity-portfolio-audit": "/analyze",
  "summer-program-match": "/summer",
  "major-exploration-map": "/choose-a-major",
  "test-strategy-calculator": "/test-prep-guide",
  "letter-of-rec-strategy": "/rec-letters",
  "decision-day-analyzer": "/decision-matrix",
} as const;

export type WorksheetSlug = keyof typeof WORKSHEET_DESTINATIONS;
