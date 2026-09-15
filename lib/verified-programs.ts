/**
 * Verified program whitelist — hallucination grounding for school-specific
 * references in AI output (schoolMicroStrategies.departmentReference,
 * essayAngle, etc.).
 *
 * Every entry here is a widely documented, real program/curriculum feature
 * at the named school. This list is intentionally conservative: when in
 * doubt, leave a school's list empty — the grounding logic then appends a
 * "verify on the official site" note instead of trusting the model.
 *
 * Maintenance: refresh annually against each school's official website.
 * Do NOT add programs from memory or model output — official sources only.
 */

export const VERIFIED_PROGRAMS: Record<string, string[]> = {
  "massachusetts-institute-of-technology": [
    "UROP",
    "Undergraduate Research Opportunities Program",
    "MIT Media Lab",
  ],
  "stanford-university": [
    "Symbolic Systems",
    "d.school",
    "Hasso Plattner Institute of Design",
  ],
  "harvard-university": [
    "Harvard College Research Program",
    "HCRP",
    "Harvard Innovation Labs",
  ],
  "yale-university": ["Directed Studies", "Yale Daily News"],
  "princeton-university": [
    "senior thesis",
    "High Meadows Environmental Institute",
  ],
  "university-of-pennsylvania": [
    "Jerome Fisher Program in Management & Technology",
    "M&T Program",
    "Wharton",
  ],
  "columbia-university": ["Core Curriculum"],
  "brown-university": [
    "Open Curriculum",
    "PLME",
    "Program in Liberal Medical Education",
  ],
  "cornell-university": ["Dyson School"],
  "duke-university": ["DukeEngage", "Bass Connections"],
  "northwestern-university": ["Medill"],
  "johns-hopkins-university": [
    "PURA",
    "Provost's Undergraduate Research Award",
  ],
  "university-of-chicago": ["Core curriculum", "Metcalf Internship"],
  "carnegie-mellon-university": ["School of Computer Science", "Tepper"],
  "california-institute-of-technology": [
    "SURF",
    "Summer Undergraduate Research Fellowships",
  ],
  "university-of-california-berkeley": ["EECS", "Haas"],
  "university-of-michigan": ["UROP", "Undergraduate Research Opportunity Program"],
  "new-york-university": ["Stern", "Tisch"],
  "university-of-southern-california": [
    "Iovine and Young Academy",
    "Marshall",
  ],
  "vanderbilt-university": ["Immersion Vanderbilt"],
  "georgetown-university": ["School of Foreign Service", "SFS"],
};

/** Verified programs for a college slug ([] when we have none on file). */
export function getVerifiedPrograms(slug: string): string[] {
  return VERIFIED_PROGRAMS[slug] ?? [];
}

export type GroundingResult = {
  text: string;
  /** true when the reference matched our verified whitelist */
  verified: boolean;
};

/**
 * Ground a school-specific program reference. If the school has a verified
 * list and the text cites one of those programs, it passes as verified.
 * Otherwise we keep the model's text but append an explicit verification
 * note — never let an unverified program name read as established fact.
 */
export function groundProgramReference(
  slug: string | undefined,
  domain: string | undefined,
  text: string,
): GroundingResult {
  if (!text || typeof text !== "string") return { text, verified: false };
  const programs = slug ? getVerifiedPrograms(slug) : [];
  const lower = text.toLowerCase();
  if (programs.some((p) => lower.includes(p.toLowerCase()))) {
    return { text, verified: true };
  }
  const note = ` (Program names not independently verified — confirm on ${domain ?? "the school's official website"} before citing them in your application.)`;
  // Avoid stacking notes when a response is re-processed.
  if (text.includes("not independently verified")) {
    return { text, verified: false };
  }
  return { text: text + note, verified: false };
}
