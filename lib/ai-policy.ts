/**
 * Per-school AI policy data — sourced from public admissions-page
 * statements about AI use in application materials.
 *
 * Categories (deliberately conservative — when in doubt, stricter side):
 *
 *   - "prohibited"  → School says "do not use generative AI to write
 *                     any portion of your application." Surfacing AI
 *                     polish in the essay editor is risky.
 *   - "discouraged" → School warns against AI but stops short of
 *                     prohibiting it. Use AI for brainstorming /
 *                     line edits, not generation.
 *   - "permitted"   → School treats AI as a writing tool like any
 *                     other (Grammarly, spellcheck) — must be the
 *                     student's own ideas, voice, and structure.
 *   - "unstated"    → School has no public AI policy. Default
 *                     guidance: treat as discouraged.
 *
 * The badge surfaces in the essay editor and the college detail
 * page so students don't accidentally cross a policy line.
 */

export type AiPolicy = "prohibited" | "discouraged" | "permitted" | "unstated";

export type AiPolicyDetail = {
  policy: AiPolicy;
  summary: string;        // 1-line for badge tooltip
  source?: string;        // school admissions URL
};

export const AI_POLICIES: Record<string, AiPolicyDetail> = {
  "harvard-university":  { policy: "discouraged", summary: "Harvard expects authentic, student-written essays. AI for brainstorming only — never generation." },
  "yale-university":     { policy: "discouraged", summary: "Yale asks for your authentic voice. Use AI as you would Grammarly — not as a co-writer." },
  "princeton-university":{ policy: "discouraged", summary: "Princeton wants your own voice. AI may be used for editing assistance, not authorship." },
  "stanford-university": { policy: "permitted",   summary: "Stanford permits AI as a writing tool, similar to spellcheck — ideas and voice must be yours." },
  "massachusetts-institute-of-technology": { policy: "prohibited", summary: "MIT prohibits use of generative AI in essays. Submitted work must be entirely your own." },
  "california-institute-of-technology":    { policy: "prohibited", summary: "Caltech expects all written submissions to be the applicant's own work, without AI assistance." },
  "duke-university":     { policy: "discouraged", summary: "Duke wants authentic voices. Light AI editing acceptable; AI-generated essays are not." },
  "northwestern-university": { policy: "permitted", summary: "Northwestern treats AI like other writing tools — your ideas, your voice, AI for polish only." },
  "johns-hopkins-university": { policy: "discouraged", summary: "Hopkins expects your authentic perspective. AI brainstorming OK, AI generation is not." },
  "university-of-pennsylvania": { policy: "discouraged", summary: "Penn wants your voice and ideas. Editing assistance is fine; ghostwriting (human or AI) is not." },
  "columbia-university": { policy: "discouraged", summary: "Columbia values authentic self-presentation. AI may polish, not generate." },
  "brown-university":    { policy: "permitted",   summary: "Brown permits AI tools as part of your editing process. Your voice and ideas must remain central." },
  "cornell-university":  { policy: "discouraged", summary: "Cornell expects authentic essays. Use AI sparingly for editing, never for generation." },
  "dartmouth-college":   { policy: "discouraged", summary: "Dartmouth wants your honest voice. AI brainstorming OK; AI-written essays are not." },
  "university-of-chicago": { policy: "permitted", summary: "UChicago accepts AI as a writing aid — but the strongest essays are unmistakably yours." },
  "university-of-notre-dame": { policy: "discouraged", summary: "Notre Dame expects authentic, student-written essays. Use AI for editing, not authorship." },
  "vanderbilt-university": { policy: "discouraged", summary: "Vanderbilt wants your genuine voice. AI editing is fine; AI generation is not." },
  "rice-university":     { policy: "permitted",   summary: "Rice treats AI like other writing tools — your perspective and ideas must lead." },
  "georgetown-university": { policy: "prohibited", summary: "Georgetown explicitly prohibits use of AI in essay writing. All work must be your own." },
  "carnegie-mellon-university": { policy: "permitted", summary: "CMU acknowledges AI as a writing tool. Use it transparently, with your ideas and voice." },
  "washington-university-in-st-louis": { policy: "discouraged", summary: "WashU wants your authentic voice. Light editing aid OK, content generation is not." },
  "emory-university":    { policy: "discouraged", summary: "Emory expects authentic essays. Use AI for proofreading, not for writing your story." },
  "ucla":                { policy: "prohibited", summary: "UC system explicitly states essays must be the applicant's own work — no AI generation." },
  "uc-berkeley":         { policy: "prohibited", summary: "UC system explicitly states essays must be the applicant's own work — no AI generation." },
  "university-of-virginia": { policy: "discouraged", summary: "UVA wants your voice. AI may help polish, not produce." },
  "university-of-michigan": { policy: "discouraged", summary: "Michigan expects authentic essays. Use AI for editing assistance, not for generating content." },
};

/** Lookup. Defaults to "unstated" when no policy is on file. */
export function getAiPolicy(slug: string): AiPolicyDetail {
  return AI_POLICIES[slug] ?? {
    policy: "unstated",
    summary: "This school has no public AI policy. Treat as discouraged — your authentic voice should lead.",
  };
}

/** Visual tokens for the badge component. */
export const AI_POLICY_STYLES: Record<AiPolicy, { bg: string; fg: string; label: string }> = {
  prohibited:  { bg: "rgba(220,38,38,0.10)", fg: "#DC2626", label: "AI Prohibited" },
  discouraged: { bg: "rgba(245,158,11,0.12)", fg: "#D97706", label: "AI Discouraged" },
  permitted:   { bg: "rgba(22,163,74,0.10)",  fg: "#16A34A", label: "AI Permitted" },
  unstated:    { bg: "var(--surface-sunken)", fg: "var(--text-muted)", label: "Policy Unstated" },
};

/** Guidance text for the essay editor based on the school's AI policy. */
export function getAiGuidanceForEditor(slug: string): {
  warning: string | null;
  allowPolish: boolean;
  allowGeneration: boolean;
} {
  const { policy } = getAiPolicy(slug);
  switch (policy) {
    case "prohibited":
      return {
        warning: "This school prohibits AI in essay writing. AdmitPath feedback shows what to improve — but the writing must be entirely yours.",
        allowPolish: false,
        allowGeneration: false,
      };
    case "discouraged":
      return {
        warning: "This school discourages AI-generated content. Use AdmitPath for feedback and brainstorming, not for writing your essay.",
        allowPolish: true,
        allowGeneration: false,
      };
    case "permitted":
      return {
        warning: null,
        allowPolish: true,
        allowGeneration: false, // We never generate — always the student's voice
      };
    case "unstated":
      return {
        warning: "This school has no public AI policy. We recommend treating it as discouraged — your authentic voice should lead.",
        allowPolish: true,
        allowGeneration: false,
      };
  }
}

/** Check if any schools in a list have a strict AI policy. */
export function hasStrictAiPolicy(slugs: string[]): boolean {
  return slugs.some((slug) => {
    const { policy } = getAiPolicy(slug);
    return policy === "prohibited";
  });
}
