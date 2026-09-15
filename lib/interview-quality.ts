export const INTERVIEW_DIMENSIONS = ["clarity", "specificity", "authenticity", "relevance", "confidence"] as const;
export type InterviewDimension = (typeof INTERVIEW_DIMENSIONS)[number];

type InterviewLike = Record<string, unknown> & {
  scores?: Partial<Record<InterviewDimension, number>>;
  strengths?: string[];
  improvements?: string[];
  dimensionFeedback?: Partial<Record<InterviewDimension, {
    evidence?: string;
    explanation?: string;
    practiceAction?: string;
  }>>;
};

function clamp(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, Math.round(parsed))) : 0;
}

function exactEvidence(answer: string, candidate: unknown, fallback: string): string {
  const raw = String(candidate ?? "").trim().replace(/^["“]|["”]$/g, "");
  return raw && answer.includes(raw) ? raw.slice(0, 300) : fallback;
}

export function normalizeInterviewFeedback<T extends InterviewLike>(feedback: T, question: string, answer: string): T & {
  dimensionFeedback: Record<InterviewDimension, { score: number; evidence: string; explanation: string; practiceAction: string }>;
  practicePlan: Array<{ priority: number; action: string; successCheck: string }>;
  assessmentDisclaimer: string;
} {
  const firstSentence = answer.match(/[^.!?]+[.!?]?/)?.[0]?.trim() || answer.slice(0, 240);
  const improvements = (feedback.improvements ?? []).map(String).filter(Boolean);
  const dimensionFeedback = Object.fromEntries(INTERVIEW_DIMENSIONS.map((dimension, index) => {
    const proposed = feedback.dimensionFeedback?.[dimension];
    return [dimension, {
      score: clamp(feedback.scores?.[dimension]),
      evidence: exactEvidence(answer, proposed?.evidence, firstSentence),
      explanation: String(proposed?.explanation ?? improvements[index] ?? `This score reflects how the submitted answer demonstrates ${dimension}; it does not measure the student's worth or predict an interview outcome.`),
      practiceAction: String(proposed?.practiceAction ?? `Record one new answer to "${question.slice(0, 120)}" that improves ${dimension} while keeping every fact truthful and in your natural speaking voice.`),
    }];
  })) as Record<InterviewDimension, { score: number; evidence: string; explanation: string; practiceAction: string }>;

  const priorities = [...INTERVIEW_DIMENSIONS]
    .sort((a, b) => dimensionFeedback[a].score - dimensionFeedback[b].score)
    .slice(0, 3);
  const practicePlan = priorities.map((dimension, index) => ({
    priority: index + 1,
    action: dimensionFeedback[dimension].practiceAction,
    successCheck: index === 0
      ? "The answer includes one truthful, concrete example and directly answers the question in the first 20 seconds."
      : index === 1
        ? "A listener can quote one memorable detail and explain why it matters to the student."
        : "The answer sounds conversational when read aloud and stays within roughly one to three minutes.",
  }));

  return Object.assign(feedback, {
    dimensionFeedback,
    practicePlan,
    assessmentDisclaimer: "This feedback evaluates one written practice answer. It cannot measure delivery, rapport, or an admission outcome, and it does not guarantee interview performance.",
  });
}
