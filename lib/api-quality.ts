/**
 * Shared API quality utilities: input sanitization, output validation,
 * response metadata, and quality scoring for AI outputs.
 *
 * Used across all AI routes to ensure consistent, high-quality responses
 * that resist prompt injection and validate LLM output structure.
 */

// ---------------------------------------------------------------------------
// Input sanitization — prevent prompt injection
// ---------------------------------------------------------------------------

/**
 * Strip common prompt-injection patterns from user-provided text.
 *
 * This is a defense-in-depth measure on top of the system prompt boundary.
 * We remove patterns that try to override system instructions, but we do NOT
 * remove legitimate content (e.g., a student who writes "ignore the haters"
 * in their essay should not have that sentence deleted).
 *
 * The function is intentionally conservative — it targets unambiguous
 * injection vectors and leaves plausibly-legitimate text alone.
 */
/** Maximum user input length (bytes). Inputs beyond this are truncated. */
const MAX_INPUT_LENGTH = 16_000;

export function sanitizeUserInput(text: string): string {
  // Length cap to prevent token-budget exhaustion attacks
  const capped = text.length > MAX_INPUT_LENGTH ? text.slice(0, MAX_INPUT_LENGTH) : text;

  return capped
    // Strip obvious injection attempts
    .replace(/\b(ignore|disregard|forget|override|bypass)\s+(all\s+)?(previous|prior|above|earlier|existing)\s+(instructions?|prompts?|rules?|system\s+messages?|context|constraints?)\b/gi, "[filtered]")
    .replace(/\b(you are now|act as|pretend to be|your new (role|instructions?|prompt)|switch to|enter .* mode)\b/gi, "[filtered]")
    .replace(/\bsystem\s*:\s*/gi, "")
    .replace(/\bassistant\s*:\s*/gi, "")
    // Strip ChatML / special token delimiters
    .replace(/<\|im_start\|>/gi, "")
    .replace(/<\|im_end\|>/gi, "")
    .replace(/<\|endoftext\|>/gi, "")
    // Strip markdown-fenced system prompt overrides
    .replace(/```(?:system|prompt|instructions?)[\s\S]*?```/gi, "[filtered]")
    // Strip XML-style system/instruction tags
    .replace(/<(?:system|instructions?|prompt)[^>]*>[\s\S]*?<\/(?:system|instructions?|prompt)>/gi, "[filtered]")
    // Cap consecutive whitespace to prevent token-budget attacks
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/ {10,}/g, "   ")
    .trim();
}

/**
 * Sanitize a structured object's string fields recursively.
 * Leaves non-string fields untouched.
 */
export function sanitizeInputObject<T>(obj: T): T {
  if (typeof obj === "string") return sanitizeUserInput(obj) as T;
  if (Array.isArray(obj)) return obj.map(sanitizeInputObject) as T;
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = sanitizeInputObject(v);
    }
    return out as T;
  }
  return obj;
}

// ---------------------------------------------------------------------------
// Output quality validation
// ---------------------------------------------------------------------------

export type QualityCheck = {
  passed: boolean;
  score: number; // 0-100
  issues: string[];
};

/**
 * Validate that an AI response contains structured, actionable content
 * rather than generic filler. Returns a quality score and list of issues.
 *
 * The check is intentionally lightweight (no LLM call) — it runs heuristics
 * on the output shape and content to catch the most common failure modes:
 *   - Missing required fields
 *   - Empty arrays where content is expected
 *   - Generic filler phrases that signal low-quality output
 *   - Score inflation (all scores > 85 with no justification)
 */
export function validateAIOutput(
  output: unknown,
  config: {
    requiredFields?: string[];
    requiredArrays?: string[];
    scoreFields?: string[];
    minScoreSpread?: number; // minimum range across scores
  } = {}
): QualityCheck {
  const issues: string[] = [];
  let score = 100;

  if (!output || typeof output !== "object") {
    return { passed: false, score: 0, issues: ["AI returned non-object output"] };
  }

  const obj = output as Record<string, unknown>;

  // Check required fields
  for (const field of config.requiredFields ?? []) {
    const value = getNestedValue(obj, field);
    if (value === undefined || value === null || value === "") {
      issues.push(`Missing required field: ${field}`);
      score -= 10;
    }
  }

  // Check required arrays
  for (const field of config.requiredArrays ?? []) {
    const value = getNestedValue(obj, field);
    if (!Array.isArray(value) || value.length === 0) {
      issues.push(`Empty or missing array: ${field}`);
      score -= 8;
    }
  }

  // Check score inflation
  if (config.scoreFields && config.scoreFields.length > 0) {
    const scores: number[] = [];
    for (const field of config.scoreFields) {
      const value = getNestedValue(obj, field);
      if (typeof value === "number") scores.push(value);
    }
    if (scores.length >= 3) {
      const allHigh = scores.every((s) => s >= 85);
      if (allHigh) {
        issues.push("Score inflation detected: all dimensions scored 85+. This is unlikely for any real applicant.");
        score -= 15;
      }
      const spread = Math.max(...scores) - Math.min(...scores);
      const minSpread = config.minScoreSpread ?? 15;
      if (spread < minSpread) {
        issues.push(`Score spread too narrow (${spread} pts). Real profiles have meaningful variation across dimensions.`);
        score -= 10;
      }
    }
  }

  // Check for generic filler phrases.
  // Source: Master brand voice Section 9 quality standard — "Be specific, be
  // honest, be direct. No wasted words." These phrases signal low-quality AI
  // output that would not pass a careful evidence and specificity review.
  const stringified = JSON.stringify(obj).toLowerCase();
  const FILLER_PHRASES = [
    // Generic positive affirmations (sycophantic pattern)
    "your profile is strong",
    "you have a great profile",
    "keep up the good work",
    "you're on the right track",
    "continue doing what you're doing",
    "overall impressive",
    "you show great potential",
    "your application stands out",
    "you are a competitive applicant",
    "your dedication is evident",
    "this demonstrates strong commitment",
    "colleges will be impressed",
    "you have a well-rounded profile",
    // Corporate/AI-speak that violates the "smart friend" voice
    "in today's rapidly evolving",
    "in today's competitive landscape",
    "your journey",
    "passion for learning",
    "opportunities for growth",
    "holistic approach",
    "unique perspective",
    "diverse experiences",
    "well-rounded individual",
    // Sycophantic openers the counselor prompt explicitly bans
    "great question",
    "that's a wonderful goal",
    "love that you're thinking about",
    "i'd be happy to help",
    "absolutely!",
    // Vague advice that should be specific
    "work on your extracurriculars",
    "focus on your strengths",
    "consider improving",
    "try to stand out",
  ];
  for (const filler of FILLER_PHRASES) {
    if (stringified.includes(filler)) {
      issues.push(`Generic filler detected: "${filler}". Output should be specific to the student.`);
      score -= 5;
    }
  }

  // Check for vague advice without specifics (brand voice rule: every mention
  // of a school, competition, or strategy must include specifics — proper
  // nouns, numbers, deadlines). This catches output that says "consider some
  // competitions" instead of naming USACO, AMC, Science Olympiad.
  const VAGUE_ADVICE_PATTERNS = [
    "some competitions",
    "certain schools",
    "various activities",
    "many colleges",
    "several programs",
    "a number of",
    "explore options",
    "look into programs",
    "consider various",
    "research different",
  ];
  const vagueHits = VAGUE_ADVICE_PATTERNS.filter((p) => stringified.includes(p));
  if (vagueHits.length >= 2) {
    issues.push(`Vague advice detected (${vagueHits.length} instances). Name specific programs, schools, and deadlines instead of "${vagueHits[0]}".`);
    score -= 5;
  }

  return {
    passed: score >= 60,
    score: Math.max(0, score),
    issues,
  };
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

// ---------------------------------------------------------------------------
// Response metadata
// ---------------------------------------------------------------------------

export type ResponseMeta = {
  scoringVersion: string;
  tierUsed?: number;
  processingTimeMs?: number;
  dataSourcesUsed?: string[];
  confidenceLevel?: "high" | "medium" | "low";
  qualityScore?: number;
};

/** Current scoring version — bump when prompt templates or scoring rubrics change. */
export const SCORING_VERSION = "2.2.0";

/**
 * Build metadata block for API responses. Included in every AI route response
 * so the client knows which model/version produced the output and can show
 * confidence indicators.
 */
export function buildResponseMeta(opts: {
  tierUsed?: number;
  startTime?: number;
  dataSources?: string[];
  confidenceLevel?: "high" | "medium" | "low";
  qualityScore?: number;
}): ResponseMeta {
  const meta: ResponseMeta = {
    scoringVersion: SCORING_VERSION,
  };
  if (opts.tierUsed != null) meta.tierUsed = opts.tierUsed;
  if (opts.startTime != null) meta.processingTimeMs = Date.now() - opts.startTime;
  if (opts.dataSources?.length) meta.dataSourcesUsed = opts.dataSources;
  if (opts.confidenceLevel) meta.confidenceLevel = opts.confidenceLevel;
  if (opts.qualityScore != null) meta.qualityScore = opts.qualityScore;
  return meta;
}

// ---------------------------------------------------------------------------
// Next steps builder
// ---------------------------------------------------------------------------

/**
 * Generate actionable next steps based on the route and output.
 * Every AI response should include 1-3 concrete next steps so the
 * student always knows what to do after viewing the output.
 */
export function buildNextSteps(
  route: "analyze" | "essay" | "essay-topics" | "essay-why-us" | "interview" | "chat" | "resume-parse",
  output?: Record<string, unknown>
): string[] {
  switch (route) {
    case "analyze": {
      const steps: string[] = [];
      const scores = output?.scores as Record<string, number> | undefined;
      if (scores) {
        // Sort dimensions to find both weakest and strongest for anticipatory coaching
        const sorted = Object.entries(scores).sort(([, a], [, b]) => a - b);
        const weakest = sorted[0];
        const strongest = sorted[sorted.length - 1];
        if (weakest && weakest[1] < 65) {
          steps.push(`Focus on improving your ${weakest[0]} score (currently ${weakest[1]}/100) — this is your biggest leverage point right now.`);
        }
        // Anticipatory coaching: if spike is weak but activityDepth is strong,
        // suggest deepening into spike territory
        if (scores.spike !== undefined && scores.activityDepth !== undefined) {
          if (scores.spike < 60 && scores.activityDepth >= 70) {
            steps.push("Your activity depth is solid, but your spike score needs work. Pick your strongest activity and go deeper — competitions, publications, or measurable impact.");
          }
        }
        // If essayQuality is a placeholder zero, prompt them
        if (scores.essayQuality !== undefined && scores.essayQuality === 0) {
          steps.push("Run the essay coach on your Common App draft to get your essayQuality score from a placeholder to a real number.");
        }
        // Encourage strength awareness (not just gaps)
        if (strongest && strongest[1] >= 85) {
          steps.push(`Your ${strongest[0]} at ${strongest[1]}/100 is genuinely competitive — make sure your essays and school list leverage this strength.`);
        }
      }
      if (steps.length === 0) {
        steps.push("Run the essay coach on your Common App draft to get your essayQuality score from a placeholder to a real number.");
      }
      if (steps.length < 3) {
        steps.push("Review the 30-day roadmap items and complete the first action this week.");
      }
      return steps.slice(0, 3);
    }
    case "essay": {
      const steps: string[] = [];
      const overall = typeof output?.overallScore === "number" ? output.overallScore : null;
      if (overall !== null && overall < 70) {
        steps.push("Address the critical issues listed above, then re-score to track improvement.");
      } else if (overall !== null && overall >= 80) {
        steps.push("This essay is competitive. Focus on the line edits to push it from strong to memorable.");
      }
      steps.push("Read your essay aloud — if any sentence sounds stilted when spoken, rewrite it.");
      steps.push("Share this draft with a trusted reader (teacher, mentor, parent) for a second perspective.");
      return steps.slice(0, 3);
    }
    case "essay-topics":
      return [
        "Pick the topic rated 'very_strong' and write a rough first draft (500 words) within 48 hours.",
        "Focus on the specific moment or anchor listed for your chosen topic — that is your opening scene.",
        "After your first draft, run it through the essay coach for a 6-dimension score.",
      ];
    case "essay-why-us": {
      const score = typeof output?.score === "number" ? output.score : null;
      if (score !== null && score < 50) {
        return [
          "Spend 30 minutes on the school's department website finding a specific professor, course, or lab.",
          "Replace every generic phrase flagged above with a specific reference connected to YOUR experience.",
          "Re-run this check after your revisions to track your specificity score improvement.",
        ];
      }
      return [
        "Connect each school-specific reference to something from YOUR personal experience.",
        "Add at least one more specific reference from a category you're missing (course, club, or tradition).",
        "Re-run this check after revisions to verify the swap-test percentage improved.",
      ];
    }
    case "interview":
      return [
        "Practice your revised answer out loud 3 times — timing yourself to stay under 2 minutes.",
        "Record yourself answering and listen back — you will catch issues your eyes miss.",
        "Prepare for the predicted follow-up question listed above.",
      ];
    case "resume-parse":
      return [
        "Review each extracted field carefully — AI extraction can misparse AP scores and award levels.",
        "Add hours-per-week and years-involved for activities if not extracted — these feed the depth scoring.",
        "After confirming, save your profile and run a full analysis to get your 7-dimension scores.",
      ];
    case "chat":
      return [];
    default:
      return [];
  }
}
