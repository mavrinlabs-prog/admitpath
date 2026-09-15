/**
 * Summer program reach / target / safety tiering.
 *
 * Selectivity in the JSON is a free-text string ("Very High (~5%)",
 * "High (~10%)", "Medium", "Low"). We bucket it into a numeric tier so we
 * can compare against student profile strength.
 *
 * Tiering rule:
 *   reach   = program selectivity > student profile strength + 1
 *   target  = within 1 tier of profile strength
 *   safety  = program selectivity < profile strength - 1
 */

export type ProgramRow = {
  name: string;
  host: string;
  location: string;
  duration: string;
  deadline: string;
  cost: string;
  selectivity: string;
  category: string;
  grades: string[];
  url: string;
  description: string;
};

export type ProgramSignals = {
  grade: number | null;
  gpa: number | null;
  satScore: number | null;
  intendedMajor: string | null;
};

export type Tier = "reach" | "target" | "safety";

export type ProgramMatch = {
  program: ProgramRow;
  tier: Tier;
  matchScore: number;     // 0-100
  reasons: string[];
  flags: string[];
};

// Numeric percentage tiers MUST be word-bounded — without `\b`, `[1-5]%`
// matches the "5%" inside "25%", so "Moderate (~25%)" was being flagged
// as a Tier 5 (top 5%) program. Real bug found against the actual JSON.
//
// We also check the numeric ranges BEFORE the keyword fallbacks, but
// keyword tiers (very high / high / moderate / low) win when no number is
// present.
const SELECTIVITY_TIERS: Array<{ pattern: RegExp; tier: number }> = [
  { pattern: /very high|elite/i, tier: 5 },
  { pattern: /\b[1-5]\s*%/, tier: 5 },                  // 1-5% accept
  { pattern: /\b(6|7|8|9|1[0-4])\s*%/, tier: 4 },        // 6-14% accept
  { pattern: /\b(1[5-9]|2[0-9]|3[0-9])\s*%/, tier: 3 },  // 15-39% accept
  { pattern: /\bhigh\b/i, tier: 4 },
  { pattern: /selective/i, tier: 3 },
  { pattern: /medium|moderate/i, tier: 2 },
  { pattern: /\b(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\s*%/, tier: 1 }, // 40%+ accept
  { pattern: /low|open|rolling|non[-\s]?selective/i, tier: 1 },
];

function selectivityTier(s: string): number {
  for (const row of SELECTIVITY_TIERS) {
    if (row.pattern.test(s)) return row.tier;
  }
  return 3; // unknown → middle of the road
}

/**
 * Profile strength, 1-5. Mirrors the 5-tier selectivity scale so we can
 * compare directly. Inputs that aren't set get a neutral 3 — better than
 * forcing every uninformed student into "everything is a reach."
 */
function profileStrength(p: ProgramSignals): number {
  let pts = 0;
  let signals = 0;

  if (p.gpa !== null) {
    signals++;
    if (p.gpa >= 3.95) pts += 5;
    else if (p.gpa >= 3.85) pts += 4;
    else if (p.gpa >= 3.7) pts += 3;
    else if (p.gpa >= 3.4) pts += 2;
    else pts += 1;
  }

  if (p.satScore !== null) {
    signals++;
    if (p.satScore >= 1550) pts += 5;
    else if (p.satScore >= 1500) pts += 4;
    else if (p.satScore >= 1400) pts += 3;
    else if (p.satScore >= 1250) pts += 2;
    else pts += 1;
  }

  if (signals === 0) return 3;
  return Math.round(pts / signals);
}

const STEM_RE = /(comput|engineer|math|physics|chem|bio|stat|data|robot|astro|neuro|cs)/i;
const HUMANITIES_RE = /(english|history|literature|philosophy|writing|journal|poet)/i;
const ARTS_RE = /(art|music|theater|dance|film|design)/i;
const BUSINESS_RE = /(business|economic|finance|entrepren)/i;

function categoryAlignsWithMajor(category: string, major: string | null): boolean {
  if (!major) return false;
  const cat = category.toLowerCase();
  if (STEM_RE.test(major) && /(stem|science|engineer|math|tech|comput|research|biomed)/i.test(cat)) return true;
  if (HUMANITIES_RE.test(major) && /(humanit|writing|english|history)/i.test(cat)) return true;
  if (ARTS_RE.test(major) && /(art|music|theater|design|creative)/i.test(cat)) return true;
  if (BUSINESS_RE.test(major) && /(business|economic|leadership|entrepren)/i.test(cat)) return true;
  return false;
}

/** Known elite programs that carry significant admissions weight. */
const ELITE_PROGRAMS_RE = /\b(RSI|MITES|MOSTEC|SIMR|Garcia|Clark Scholar|SAMS|Telluride|TASP|PROMYS|Hampshire|Canada.USA Mathcamp|Ross Mathematics|SuMAC|LaunchX|SSP|Summer Science Program|Governors? School|COSMOS|NIH.+Intern|SIP.+UCSC|Science Internship Program)\b/i;

/** Programs known to have minimal selectivity — good experience but
 *  won't differentiate an application at T20 schools. */
const LOW_IMPACT_RE = /\b(camp|workshop|introductory|beginner|open enrollment|no application|anyone can apply)\b/i;

export function scoreProgram(p: ProgramRow, s: ProgramSignals): ProgramMatch {
  const reasons: string[] = [];
  const flags: string[] = [];
  // Anti-inflation: base at 40 (not 50). 90+ should mean "this program
  // is both highly selective AND directly aligned with your spike."
  let score = 40;

  const sel = selectivityTier(p.selectivity);
  const strength = profileStrength(s);
  const delta = sel - strength;

  let tier: Tier;
  if (delta >= 2) tier = "reach";
  else if (delta <= -2) tier = "safety";
  else tier = "target";

  // Grade gate (must-match for current cycle)
  const studentGrade = s.grade?.toString();
  if (p.grades.length > 0) {
    if (studentGrade && p.grades.includes(studentGrade)) {
      score += 20;
      reasons.push(`Open to grade ${studentGrade}`);
    } else {
      score -= 35;
      flags.push(`Targets grade${p.grades.length > 1 ? "s" : ""} ${p.grades.join("/")}`);
    }
  }

  if (categoryAlignsWithMajor(p.category, s.intendedMajor)) {
    score += 20;
    reasons.push(`Aligns with ${s.intendedMajor}`);
  }

  // Cost signal — tiered
  const costText = p.cost ?? "";
  if (/free|fully funded|stipend|\$0/i.test(costText)) {
    score += 10;
    reasons.push("No cost — fully funded");
  } else if (/need.based|financial aid|scholarship available/i.test(costText)) {
    score += 5;
    reasons.push("Financial aid available");
  } else {
    // Parse cost amount for flagging
    const costMatch = costText.match(/\$\s*([\d,]+)/);
    const costAmount = costMatch ? parseInt(costMatch[1]!.replace(/,/g, ""), 10) : 0;
    if (costAmount > 5000) {
      flags.push(`Cost: ${costText} — verify financial aid options`);
    }
  }

  // Elite program detection — these carry serious admissions weight
  const nameAndDesc = `${p.name} ${p.description ?? ""}`;
  if (ELITE_PROGRAMS_RE.test(nameAndDesc)) {
    score += 12;
    reasons.push("Elite program — recognized by T20 admissions officers as a strong signal");
    if (strength < 4) {
      flags.push("Very selective program — acceptance rates often <10%. Strong profile recommended.");
    }
  }

  // Low-impact program detection
  if (LOW_IMPACT_RE.test(nameAndDesc) && sel <= 1) {
    score -= 5;
    flags.push("Limited admissions impact — good experience but won't differentiate your application at selective schools");
  }

  // Duration signal — longer programs show deeper commitment
  const duration = (p.duration ?? "").toLowerCase();
  if (/6\+?\s*weeks?|7\s*weeks?|8\s*weeks?|2\s*months?|summer.long/i.test(duration)) {
    score += 5;
    reasons.push("Extended program — demonstrates serious commitment");
  }

  // Deadline proximity
  if (p.deadline) {
    const deadlineDate = new Date(p.deadline);
    const now = new Date();
    const daysUntil = Math.round((deadlineDate.getTime() - now.getTime()) / 86400000);
    if (daysUntil < 0 && daysUntil > -120) {
      score -= 10;
      flags.push(`Application deadline passed (${p.deadline})`);
    } else if (daysUntil >= 0 && daysUntil <= 14) {
      score += 3;
      flags.push(`Deadline in ${daysUntil} days — apply immediately`);
    } else if (daysUntil >= 0 && daysUntil <= 45) {
      score += 2;
      reasons.push("Upcoming deadline");
    }
  }

  // Tier-appropriate reasons with more specific messaging
  if (tier === "target") reasons.push("Selectivity matches your profile — competitive but realistic");
  if (tier === "reach") {
    const selPct = p.selectivity.match(/(\d+)\s*%/);
    const pctStr = selPct ? ` (~${selPct[1]}% acceptance)` : "";
    flags.push(`Reach${pctStr} — prepare a strong application`);
  }
  if (tier === "safety") reasons.push("Strong odds given your stats — high-confidence admission");

  return {
    program: p,
    tier,
    matchScore: Math.max(0, Math.min(100, score)),
    reasons,
    flags,
  };
}

export function recommendPrograms(
  pool: ProgramRow[],
  signals: ProgramSignals,
): { reach: ProgramMatch[]; target: ProgramMatch[]; safety: ProgramMatch[] } {
  const scored = pool.map((p) => scoreProgram(p, signals));
  scored.sort((a, b) => b.matchScore - a.matchScore);
  return {
    reach: scored.filter((m) => m.tier === "reach").slice(0, 6),
    target: scored.filter((m) => m.tier === "target").slice(0, 6),
    safety: scored.filter((m) => m.tier === "safety").slice(0, 6),
  };
}
