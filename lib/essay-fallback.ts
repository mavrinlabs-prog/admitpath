import type { VoiceRubricResult } from "@/lib/voice-rubric";

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function quote(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 240) : fallback;
}

type EssayFeedbackLike = Record<string, unknown> & {
  lineEdits?: Array<{ original?: string; suggestion?: string; direction?: string; reason?: string }>;
  structureAnalysis?: { arc?: string; momentumDrop?: string; endingVerdict?: string };
  scores?: Record<string, number>;
  criticalIssues?: string[];
  voiceRubric?: Record<string, { evidence?: string } | number>;
};

function exactQuote(content: string, candidate: unknown, fallback: string): string {
  const value = String(candidate ?? "").trim().replace(/^["“]|["”]$/g, "");
  if (value && content.includes(value)) return value.slice(0, 300);
  return fallback;
}

/** Enforce the production essay-coaching contract for both model and fallback output. */
export function normalizeEssayFeedback<T extends EssayFeedbackLike>(feedback: T, content: string): T & {
  craftAnalysis: Record<
    "structure" | "clarity" | "voice" | "specificity" | "reflection" | "narrativeCoherence" |
    "opening" | "conclusion" | "redundancy" | "sentenceLevelOpportunities" | "authenticityRisks",
    string
  >;
  revisionPriorities: Array<{
    rank: number;
    issue: string;
    evidence: string;
    instruction: string;
    successCheck: string;
  }>;
  authorshipPolicy: string;
} {
  const sentences = content.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
  const first = sentences[0] ?? content.trim().slice(0, 240) ?? "Opening not detected";
  const last = sentences.at(-1) ?? content.trim().slice(-240) ?? "Conclusion not detected";
  const structure = feedback.structureAnalysis ?? {};
  const lineEdits = (feedback.lineEdits ?? []).flatMap((edit) => {
    const original = exactQuote(content, edit.original, "");
    if (!original) return [];
    const rawSuggestion = String(edit.suggestion ?? "").trim();
    const suggestionWordCount = rawSuggestion.split(/\s+/).filter(Boolean).length;
    return [{
      ...edit,
      original,
      suggestion: suggestionWordCount > 40
        ? "Revise this sentence in your own words using the direction below; do not copy a replacement sentence."
        : rawSuggestion || "Revise this sentence in your own words using the direction below.",
      direction: String(edit.direction ?? "Preserve the event and meaning while making the sentence more precise in your natural speaking voice.").trim(),
      reason: String(edit.reason ?? "clarity").trim(),
    }];
  }).slice(0, 6);
  feedback.lineEdits = lineEdits;

  const issues = (feedback.criticalIssues ?? []).map((issue) => String(issue).trim()).filter(Boolean);
  const openingEvidence = exactQuote(content, first, first.slice(0, 240));
  const conclusionEvidence = exactQuote(content, last, last.slice(0, 240));
  const voiceEvidence = feedback.voiceRubric?.detail;
  const detailEvidence = typeof voiceEvidence === "object" ? String(voiceEvidence.evidence ?? "") : "";
  const repeated = Array.from(new Set(
    content.toLowerCase().match(/\b[a-z]{4,}\b/g)?.filter((word, _, all) => all.filter((candidate) => candidate === word).length >= 4) ?? [],
  )).slice(0, 5);

  const craftAnalysis = {
    structure: String(structure.arc ?? "Identify the setup, complication, and change in understanding; each section should alter what the reader knows."),
    clarity: lineEdits[0]
      ? `The sentence "${lineEdits[0].original}" is the first sentence-level clarity opportunity. Use the direction provided without replacing the student's natural phrasing wholesale.`
      : "The draft is readable at sentence level; the next pass should test whether every sentence advances scene, tension, or reflection.",
    voice: `Preserve the student's existing diction and rhythm. ${detailEvidence || "Use edits to clarify the student's own meaning, not to make the prose sound older, more formal, or counselor-written."}`,
    specificity: detailEvidence || `Test every broad claim against a concrete object, action, line of dialogue, number, or setting already available in the student's experience.`,
    reflection: `Check whether the draft explains why the experience changed the student's thinking without reducing it to a universal lesson or tidy moral.`,
    narrativeCoherence: String(structure.momentumDrop ?? "Each paragraph should follow causally or thematically from the previous one; mark any transition where the reader must infer a missing connection."),
    opening: `Opening evidence: "${openingEvidence}" Decide whether it creates a specific question or image rather than explaining the topic before the story begins.`,
    conclusion: String(structure.endingVerdict ?? `Conclusion evidence: "${conclusionEvidence}" Test whether the ending deepens or reframes the opening rather than restating the lesson.`),
    redundancy: repeated.length
      ? `Review repeated content words (${repeated.join(", ")}) and repeated lessons; keep repetition only when it creates deliberate emphasis or a changed meaning.`
      : "No obvious repeated content word dominates the draft; still cut any sentence that repeats a lesson the scene already demonstrates.",
    sentenceLevelOpportunities: lineEdits.length
      ? `${lineEdits.length} exact, draft-grounded sentence opportunities are listed below. Each is coaching direction, not a replacement paragraph.`
      : "No model-proposed exact quote could be verified in the draft. Re-run the review or revise the opening and conclusion using the evidence above.",
    authenticityRisks: "Watch for abrupt vocabulary changes, polished universal lessons, or edits the student would not naturally say aloud. These are risks to voice, not proof of AI use or dishonesty.",
  };

  const prioritySeeds = [
    issues[0] ?? craftAnalysis.narrativeCoherence,
    issues[1] ?? craftAnalysis.reflection,
    issues[2] ?? craftAnalysis.conclusion,
  ];
  const revisionPriorities = prioritySeeds.map((issue, index) => ({
    rank: index + 1,
    issue,
    evidence: index === 0 ? openingEvidence : index === 1 ? (lineEdits[0]?.original ?? openingEvidence) : conclusionEvidence,
    instruction: index === 0
      ? "Fix the largest structural or clarity problem first while keeping the student's events and point of view unchanged."
      : index === 1
        ? "Deepen one existing moment with the student's own observation and reflection; do not add invented details."
        : "Read the revised draft aloud and remove wording the student would not naturally use, then verify that the ending earns its insight.",
    successCheck: index === 0
      ? "A reader can state what changes between the opening, middle, and ending without guessing at a missing link."
      : index === 1
        ? "The revised passage contains a specific observation and a personal interpretation rather than a generic lesson."
        : "The student can explain and defend every sentence as their own language and lived experience.",
  }));

  return Object.assign(feedback, {
    craftAnalysis,
    revisionPriorities,
    authorshipPolicy: "AdmitPath provides coaching, diagnostics, and bounded sentence-level examples. It does not rewrite the essay. Keep the student's events, meaning, age, diction, and natural voice; the student must make every final wording choice.",
  });
}

/** Complete evidence-based feedback when an external essay provider is unavailable. */
export function buildEssayFallbackFeedback(
  content: string,
  prompt: string,
  voice: VoiceRubricResult,
) {
  const sentences = content.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
  const first = quote(sentences[0] ?? content, "Opening sentence not detected");
  const last = quote(sentences.at(-1) ?? content, "Closing sentence not detected");
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const paragraphs = content.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length;
  const clichePatterns = [
    /from a young age/i,
    /i (?:have )?always (?:been )?passionate/i,
    /this (?:experience )?taught me/i,
    /i learned (?:the value|the importance)/i,
    /in today'?s society/i,
  ];
  const cliches = sentences
    .filter((sentence) => clichePatterns.some((pattern) => pattern.test(sentence)))
    .slice(0, 3)
    .map((sentence) => ({
      phrase: quote(sentence, ""),
      location: "essay body",
      why: "This familiar phrasing summarizes a lesson instead of revealing a specific moment.",
      alternative: "Return to the exact action, object, dialogue, or decision that lets the reader infer the lesson.",
    }));

  const specificity = clamp((voice.scores.place + voice.scores.detail) / 2);
  const insight = clamp(voice.scores.vulnerability * 0.7 + (content.match(/\b(realized|understood|wondered|questioned|noticed)\b/gi)?.length ?? 0) * 5 + 20);
  const storytelling = clamp(48 + Math.min(16, paragraphs * 4) + Math.min(12, sentences.length));
  const authenticity = clamp(58 + Math.min(14, (content.match(/\b(I|my|me)\b/g)?.length ?? 0) / 3) - cliches.length * 5);
  const impact = clamp((specificity + insight + voice.scores.surprise) / 3);
  const voiceScore = clamp(voice.composite);
  const scores = { authenticity, insight, specificity, storytelling, impact, voice: voiceScore };
  const overallScore = clamp(
    authenticity * 0.2 + insight * 0.15 + specificity * 0.2 + storytelling * 0.15 + impact * 0.15 + voiceScore * 0.15,
  );
  const weakestAxis = Object.entries(voice.scores).sort(([, left], [, right]) => left - right)[0]?.[0] ?? "detail";

  return normalizeEssayFeedback({
    scores,
    overallScore,
    wordCount,
    voiceRubric: {
      place: { score: voice.scores.place, evidence: voice.feedback[0] ?? "Add a named physical setting and sensory anchor." },
      detail: { score: voice.scores.detail, evidence: voice.feedback[1] ?? "Replace broad summary with one observable detail." },
      vulnerability: { score: voice.scores.vulnerability, evidence: voice.feedback[2] ?? "Name the unresolved doubt, tension, or mistake without rushing to a lesson." },
      surprise: { score: voice.scores.surprise, evidence: voice.feedback[3] ?? "Build an unexpected connection that changes the meaning of the opening." },
    },
    promptFit: {
      score: prompt.trim() ? 65 : 40,
      feedback: prompt.trim()
        ? `The draft addresses the supplied prompt, but verify that each paragraph advances the exact question: "${prompt.slice(0, 180)}".`
        : "Add the exact application prompt before treating prompt fit as final.",
    },
    promptRecommendation: "Keep the current prompt provisionally; reassess after the next structural revision.",
    topStrengths: [
      `The opening gives the reader a concrete entry point: "${first}"`,
      `The strongest current voice signal is ${Object.entries(voice.scores).sort(([, left], [, right]) => right - left)[0]?.[0] ?? "detail"}.`,
    ],
    criticalIssues: [
      `The weakest voice axis is ${weakestAxis}; revise one paragraph around a specific scene rather than summary.`,
      `The ending currently reads: "${last}" Decide whether it leaves a concrete image or merely announces the lesson.`,
    ],
    cliches,
    redFlags: [],
    aiSignals: [],
    lineEdits: [
      {
        original: first,
        suggestion: "Revise the opening to begin at the most specific decision, object, or line of dialogue in this moment.",
        direction: "Keep the underlying event, but remove setup the reader can infer. The first line should create a question that the next paragraph must answer.",
        reason: "specificity",
      },
      {
        original: last,
        suggestion: "Revise the ending toward a concrete image or unresolved tension instead of a stated moral.",
        direction: "Echo a detail from the opening only if its meaning has changed. Let the reader infer the lesson from the final action or image.",
        reason: "impact",
      },
    ],
    structureAnalysis: {
      arc: paragraphs > 1 ? `The draft has ${paragraphs} visible sections; make each one change the reader's understanding.` : "The draft reads as one continuous section; separate scene, complication, and reflection during revision.",
      momentumDrop: `Review the middle of the draft for summary. Replace the broadest sentence near the midpoint with action, dialogue, or an observed detail.`,
      endingVerdict: `The final line is "${last}" Test whether it is earned by the preceding scene rather than explained after it.`,
    },
    counselorNote: `This is a provisional evidence-based score of ${overallScore}/100 because the external essay model was unavailable. The draft's strongest signal is the existing voice, while ${weakestAxis} needs the most attention. Revise the opening and ending around exact details, then run the full review again.`,
    summary: `This draft currently scores ${overallScore}/100 on the local six-dimension rubric. Its best starting point is "${first}". The highest-leverage revision is to strengthen ${weakestAxis} with a specific scene and an ending the reader can infer rather than a stated lesson. Review the two line directions above before submitting.`,
    _fallback: {
      used: true,
      reason: "provider_unavailable",
      message: "The AI provider was unavailable, so AdmitPath returned a complete local rubric review. Re-run later for the deeper model review.",
    },
  }, content);
}
