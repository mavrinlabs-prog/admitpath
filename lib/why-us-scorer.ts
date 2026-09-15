/**
 * Why-Us Specificity Scorer.
 *
 * A "Why Us?" supplement is the single biggest tell for lazy applicants.
 * Generic supplements ("you have great academics", "diverse student body",
 * "renowned faculty") read as substitutable. The score below quantifies
 * specificity using cheap heuristics — NO LLM call required, so it can
 * fire on every keystroke.
 *
 * The score (0-100) is composed of:
 *   - generic_phrase_density (penalty: phrases that work at any school)
 *   - school_name_density (small penalty for repeating the name as filler)
 *   - specific_signal_count (reward: course numbers, professor names,
 *     building names, club names)
 *   - personal_pronoun_balance (reward: "I" / "my" frequency that ties
 *     the school's offerings to the applicant's specific interests)
 *
 * Each signal is documented inline so the UI can surface ACTIONABLE
 * feedback ("you mentioned the school by name 7 times — replace 3 of
 * those with specific programs") rather than a black-box score.
 */

import type { College } from "@/data/colleges";

export type WhyUsBreakdown = {
  score: number;          // 0-100, higher = more specific to school
  wordCount: number;
  schoolMentions: number; // count of school name / shortName references
  genericPhrases: Array<{ phrase: string; index: number }>;
  specificSignals: Array<{ kind: SpecificSignalKind; match: string }>;
  feedback: string[];     // ordered, most-impactful first
};

type SpecificSignalKind =
  | "course-number"     // CS 101, BIO 215, etc.
  | "professor"         // "Professor Smith", "Dr. Patel"
  | "named-program"     // capitalized multi-word sequence likely a program
  | "club-or-org"       // "the [X] Club"
  | "research-keyword"  // "lab", "research", "thesis"
  | "first-person";     // "I want to", "my interest"

const GENERIC_PHRASES = [
  "great academics",
  "academic rigor",
  "rigorous academics",
  "world-class faculty",
  "renowned faculty",
  "diverse student body",
  "vibrant community",
  "rich history",
  "prestigious",
  "world-renowned",
  "ivy league",
  "top-ranked",
  "best of the best",
  "endless opportunities",
  "limitless opportunities",
  "well-rounded",
  "interdisciplinary approach",
  "passionate students",
  "i have always dreamed",
  "ever since i was",
  "since i was a child",
  "from a young age",
  "my dream school",
  "perfect fit for me",
  "would be honored",
  "looking forward to",
  "like-minded individuals",
  "make a difference",
  // Expanded: more generic filler commonly seen in weak supplements
  "cutting-edge research",
  "innovative programs",
  "global perspective",
  "collaborative environment",
  "small class sizes",
  "close-knit community",
  "beautiful campus",
  "state-of-the-art facilities",
  "nurturing environment",
  "holistic education",
  "intellectual curiosity",
  "culture of excellence",
  "spirit of innovation",
  "tradition of excellence",
  "supportive community",
  "leaders in their field",
  "world-class education",
  "unique learning environment",
  "diverse range of",
  "wide range of opportunities",
  "plethora of",
  "myriad of",
  "a wealth of",
  "unparalleled",
  "second to none",
  "go above and beyond",
  "take my education to the next level",
  "broaden my horizons",
  "expand my worldview",
  "contribute to the community",
  "give back to society",
];

const COURSE_NUMBER_RE = /\b[A-Z]{2,4}\s?\d{2,4}\b/g;             // "CS 188", "BIO101"
const PROFESSOR_RE = /\b(?:Professor|Prof\.?|Dr\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g;
const CLUB_RE = /\b(?:the\s)?[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,3}\s(?:Club|Society|Initiative|Lab|Center|Institute|Project|Program)\b/g;
const RESEARCH_KEYWORDS = ["lab", "research", "thesis", "fellowship", "seminar", "workshop"];

export function scoreWhyUs(text: string, school: College): WhyUsBreakdown {
  const lower = text.toLowerCase();
  const wordCount = (text.trim().match(/\S+/g) ?? []).length;

  // 1) school mentions
  const escapedShort = school.shortName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedFull = school.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const schoolNameRe = new RegExp(`\\b(?:${escapedShort}|${escapedFull})\\b`, "gi");
  const schoolMentions = (text.match(schoolNameRe) ?? []).length;

  // 2) generic-phrase scan
  const genericPhrases: WhyUsBreakdown["genericPhrases"] = [];
  for (const phrase of GENERIC_PHRASES) {
    const idx = lower.indexOf(phrase);
    if (idx !== -1) genericPhrases.push({ phrase, index: idx });
  }

  // 3) specific-signal scan
  const specificSignals: WhyUsBreakdown["specificSignals"] = [];
  for (const m of Array.from(text.matchAll(COURSE_NUMBER_RE))) {
    if (m[0]) specificSignals.push({ kind: "course-number", match: m[0] });
  }
  for (const m of Array.from(text.matchAll(PROFESSOR_RE))) {
    if (m[0]) specificSignals.push({ kind: "professor", match: m[0] });
  }
  for (const m of Array.from(text.matchAll(CLUB_RE))) {
    if (m[0]) specificSignals.push({ kind: "club-or-org", match: m[0] });
  }
  for (const kw of RESEARCH_KEYWORDS) {
    if (lower.includes(kw)) specificSignals.push({ kind: "research-keyword", match: kw });
  }

  // 4) first-person count
  const firstPersonCount = (lower.match(/\b(i|my|me|i'm|i'll|i've|i'd)\b/g) ?? []).length;

  // ---- score composition ----
  // Anti-inflation: base at 40 (not 50). A 90+ "Why Us" should be
  // unmistakably written for ONE school — with verifiable details an
  // admissions officer recognizes. Most supplements score 40-60.
  let score = 40; // baseline

  // Reward specific signals with diminishing returns.
  // First 3 signals matter most; after 5, marginal value drops.
  const signalCount = specificSignals.length;
  if (signalCount >= 5) score += 35;
  else if (signalCount >= 3) score += 25;
  else if (signalCount >= 1) score += signalCount * 7;

  // Bonus for VARIETY of signal types (course + professor + club > 3x course)
  const signalKinds = new Set(specificSignals.map((s) => s.kind));
  if (signalKinds.size >= 3) score += 10;
  else if (signalKinds.size >= 2) score += 5;

  // Penalize generic phrases (each = -9, cap at -45). Harsher than before.
  score -= Math.min(45, genericPhrases.length * 9);

  // Penalize over-mention of the school name (>5 references in <500 words).
  if (wordCount > 0 && schoolMentions > 5 && schoolMentions / wordCount > 0.025) {
    score -= 8;
  }

  // Reward first-person pronouns (the essay should be ABOUT the applicant
  // at this school, not about the school itself).
  if (firstPersonCount >= 5) score += 5;
  if (firstPersonCount === 0 && wordCount > 100) score -= 10;

  // "Substitution test" heuristic: if NO specific signals AND NO school
  // mentions, this essay could be copy-pasted to any school — max penalty.
  if (signalCount === 0 && schoolMentions === 0 && wordCount > 100) {
    score -= 15; // fails the substitution test entirely
  }

  // Length penalty — calibrated to typical supplement word counts
  if (wordCount > 0 && wordCount < 50) score -= 20; // unserious
  else if (wordCount > 0 && wordCount < 80) score -= 12;
  // Over-writing penalty: supplements are typically 150-400 words.
  // 600+ suggests padding.
  if (wordCount > 600) score -= 5;

  // "I researched" signal — mentions of visiting campus, info sessions,
  // or connecting with current students show demonstrated interest
  const researchedRe = /\b(?:visited|campus visit|info(?:rmation)? session|open house|spoke with|talked to|emailed|reached out|sat in on|attended)\b/i;
  if (researchedRe.test(text)) {
    score += 6;
  }

  // Final clamp
  score = Math.max(0, Math.min(100, score));

  // ---- ordered feedback ----
  const feedback: string[] = [];
  if (genericPhrases.length > 0) {
    feedback.push(
      `${genericPhrases.length} generic phrase${genericPhrases.length === 1 ? "" : "s"} found ("${genericPhrases[0]!.phrase}"). Replace with something only ${school.shortName} offers.`
    );
  }
  if (specificSignals.length === 0 && wordCount > 50) {
    feedback.push(
      `No specific course numbers, professors, clubs, or programs mentioned. Add 2–3 references admissions officers can verify.`
    );
  }
  if (specificSignals.filter((s) => s.kind === "course-number").length === 0 && wordCount > 100) {
    feedback.push(
      `Try referencing a specific course (e.g., "${school.shortName}'s Computer Science 188 — Intro to AI") to anchor your interest.`
    );
  }
  if (specificSignals.filter((s) => s.kind === "professor").length === 0 && wordCount > 150) {
    feedback.push(
      `Mention a professor whose work overlaps with your interests. Browse the relevant department's faculty page.`
    );
  }
  if (firstPersonCount === 0 && wordCount > 100) {
    feedback.push(
      `No first-person language detected. The "Why Us?" essay must show what YOU would do at the school, not just describe the school.`
    );
  }
  if (schoolMentions === 0 && wordCount > 50) {
    feedback.push(
      `${school.shortName} is never named. Reference the school by name at least once to ground your specifics.`
    );
  }
  // Substitution test feedback
  if (signalCount === 0 && schoolMentions === 0 && wordCount > 100) {
    feedback.push(
      `This supplement fails the substitution test: you could paste it into any school's application without changing a word. That's what admissions officers check first.`
    );
  }
  // Signal variety feedback
  if (signalCount >= 2 && signalKinds.size === 1) {
    feedback.push(
      `All your specific references are the same type (${specificSignals[0]?.kind}). Vary your specifics — mention a course AND a professor AND a program to show breadth of research.`
    );
  }
  // Generic phrase density warning
  if (genericPhrases.length >= 3) {
    feedback.push(
      `${genericPhrases.length} generic phrases detected. Each one signals to the reader that you haven't researched ${school.shortName}. Replace every generic claim with a verifiable detail.`
    );
  }

  return {
    score,
    wordCount,
    schoolMentions,
    genericPhrases,
    specificSignals,
    feedback,
  };
}
