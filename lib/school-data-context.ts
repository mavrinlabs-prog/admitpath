/**
 * School data context builder for the AI counselor chat.
 *
 * Detects school names mentioned in user messages, looks up real data from
 * our data files (colleges.ts, college-details.ts, cds-weights.ts), and
 * returns a formatted context block that gets injected into the system prompt.
 *
 * This ensures the LLM uses REAL admissions data instead of hallucinating
 * school-specific facts from its training data.
 */

import { COLLEGES, type College } from "@/data/colleges";
import { COLLEGE_DETAILS, type CollegeDetail } from "@/data/college-details";
import { CDS_WEIGHTS, type CdsWeights } from "@/lib/cds-weights";
import { ADMITTED_PROFILES } from "@/data/admitted-profiles";

// ---------------------------------------------------------------------------
// Name → slug mapping
// ---------------------------------------------------------------------------

type SchoolMatch = {
  college: College | undefined;
  detail: CollegeDetail | undefined;
  cdsWeights: CdsWeights | undefined;
};

/**
 * Build a lookup table of aliases → college slug (from colleges.ts).
 * Includes: full name, shortName, slug, and common abbreviations.
 */
function buildAliasMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of COLLEGES) {
    // Full name: "Massachusetts Institute of Technology"
    map.set(c.name.toLowerCase(), c.slug);
    // Short name: "MIT"
    map.set(c.shortName.toLowerCase(), c.slug);
    // Slug without hyphens: "massachusetts institute of technology"
    map.set(c.slug.replace(/-/g, " "), c.slug);
  }
  // Hand-curated aliases for common casual references
  const ALIASES: Record<string, string> = {
    "harvard": "harvard-university",
    "yale": "yale-university",
    "princeton": "princeton-university",
    "columbia": "columbia-university",
    "penn": "university-of-pennsylvania",
    "upenn": "university-of-pennsylvania",
    "brown": "brown-university",
    "dartmouth": "dartmouth-college",
    "cornell": "cornell-university",
    "stanford": "stanford-university",
    "mit": "massachusetts-institute-of-technology",
    "caltech": "california-institute-of-technology",
    "duke": "duke-university",
    "northwestern": "northwestern-university",
    "johns hopkins": "johns-hopkins-university",
    "jhu": "johns-hopkins-university",
    "hopkins": "johns-hopkins-university",
    "uchicago": "university-of-chicago",
    "u chicago": "university-of-chicago",
    "chicago": "university-of-chicago",
    "vanderbilt": "vanderbilt-university",
    "vandy": "vanderbilt-university",
    "rice": "rice-university",
    "notre dame": "university-of-notre-dame",
    "washu": "washington-university-in-st-louis",
    "wash u": "washington-university-in-st-louis",
    "wustl": "washington-university-in-st-louis",
    "emory": "emory-university",
    "georgetown": "georgetown-university",
    "cmu": "carnegie-mellon-university",
    "carnegie mellon": "carnegie-mellon-university",
    "nyu": "new-york-university",
    "uc berkeley": "university-of-california-berkeley",
    "berkeley": "university-of-california-berkeley",
    "cal": "university-of-california-berkeley",
    "ucla": "university-of-california-los-angeles",
    "michigan": "university-of-michigan",
    "umich": "university-of-michigan",
    "u of m": "university-of-michigan",
    "uva": "university-of-virginia",
    "unc": "university-of-north-carolina-chapel-hill",
    "chapel hill": "university-of-north-carolina-chapel-hill",
    "georgia tech": "georgia-institute-of-technology",
    "gatech": "georgia-institute-of-technology",
    "gt": "georgia-institute-of-technology",
    "tufts": "tufts-university",
    "wake forest": "wake-forest-university",
    "bc": "boston-college",
    "boston college": "boston-college",
    "bu": "boston-university",
    "boston university": "boston-university",
    "brandeis": "brandeis-university",
    "case western": "case-western-reserve-university",
    "cwru": "case-western-reserve-university",
    "lehigh": "lehigh-university",
    "northeastern": "northeastern-university",
    "tulane": "tulane-university",
    "villanova": "villanova-university",
    "rochester": "university-of-rochester",
    "rpi": "rensselaer-polytechnic-institute",
    "rensselaer": "rensselaer-polytechnic-institute",
    "santa clara": "santa-clara-university",
    "lmu": "loyola-marymount-university",
    "pepperdine": "pepperdine-university",
    "fordham": "fordham-university",
    "gw": "george-washington-university",
    "george washington": "george-washington-university",
    "american": "american-university",
    "syracuse": "syracuse-university",
    "miami": "university-of-miami",
    "drexel": "drexel-university",
    "stevens": "stevens-institute-of-technology",
    "wpi": "worcester-polytechnic-institute",
    "rose hulman": "rose-hulman-institute-of-technology",
    "rose-hulman": "rose-hulman-institute-of-technology",
    "uf": "university-of-florida",
    "florida": "university-of-florida",
    "wisconsin": "university-of-wisconsin-madison",
    "uiuc": "university-of-illinois-urbana-champaign",
    "illinois": "university-of-illinois-urbana-champaign",
    "ucsd": "university-of-california-san-diego",
    "uc davis": "university-of-california-davis",
    "ucsb": "university-of-california-santa-barbara",
    "uci": "university-of-california-irvine",
    "ucsc": "university-of-california-santa-cruz",
    "purdue": "purdue-university",
    "ohio state": "ohio-state-university",
    "osu": "ohio-state-university",
    "penn state": "penn-state-university",
    "ut austin": "university-of-texas-austin",
    "texas": "university-of-texas-austin",
    "texas a&m": "texas-am-university",
    "tamu": "texas-am-university",
    "uw": "university-of-washington",
    "u dub": "university-of-washington",
    "umd": "university-of-maryland-college-park",
    "maryland": "university-of-maryland-college-park",
    "pitt": "university-of-pittsburgh",
    "pittsburgh": "university-of-pittsburgh",
    "minnesota": "university-of-minnesota",
    "cu boulder": "university-of-colorado-boulder",
    "uga": "university-of-georgia",
    "clemson": "clemson-university",
    "virginia tech": "virginia-tech",
    "vt": "virginia-tech",
    "fsu": "florida-state-university",
    "indiana": "indiana-university-bloomington",
    "iu": "indiana-university-bloomington",
    "uconn": "university-of-connecticut",
    "rutgers": "rutgers-university",
    "stony brook": "stony-brook-university",
    "umass": "university-of-massachusetts-amherst",
    "usf": "university-of-south-florida",
    "williams": "williams-college",
    "amherst": "amherst-college",
    "swarthmore": "swarthmore-college",
    "pomona": "pomona-college",
    "wellesley": "wellesley-college",
    "bowdoin": "bowdoin-college",
    "cmc": "claremont-mckenna-college",
    "claremont mckenna": "claremont-mckenna-college",
    "middlebury": "middlebury-college",
    "carleton": "carleton-college",
    "colby": "colby-college",
    "davidson": "davidson-college",
    "grinnell": "grinnell-college",
    "hamilton": "hamilton-college",
    "haverford": "haverford-college",
    "vassar": "vassar-college",
    "colgate": "colgate-university",
    "barnard": "barnard-college",
    "smith": "smith-college",
    "colorado college": "colorado-college",
    "cc": "colorado-college",
    "oberlin": "oberlin-college",
    "usc": "university-of-southern-california",
    "harvey mudd": "harvey-mudd-college",
  };
  for (const [alias, slug] of Object.entries(ALIASES)) {
    map.set(alias, slug);
  }
  return map;
}

/** Mapping from college-details short slugs → colleges.ts long slugs. */
const DETAIL_SLUG_TO_COLLEGE_SLUG: Record<string, string> = {
  "harvard": "harvard-university",
  "yale": "yale-university",
  "princeton": "princeton-university",
  "stanford": "stanford-university",
  "mit": "massachusetts-institute-of-technology",
  "caltech": "california-institute-of-technology",
  "columbia": "columbia-university",
  "upenn": "university-of-pennsylvania",
  "brown": "brown-university",
  "dartmouth": "dartmouth-college",
  "cornell": "cornell-university",
  "duke": "duke-university",
  "northwestern": "northwestern-university",
  "johns-hopkins": "johns-hopkins-university",
  "rice": "rice-university",
  "vanderbilt": "vanderbilt-university",
  "washu": "washington-university-in-st-louis",
  "notre-dame": "university-of-notre-dame",
  "georgetown": "georgetown-university",
  "usc": "university-of-southern-california",
  "ucla": "university-of-california-los-angeles",
  "uc-berkeley": "university-of-california-berkeley",
  "umich": "university-of-michigan",
  "uva": "university-of-virginia",
  "unc": "university-of-north-carolina-chapel-hill",
  // Existing 25 entries above + all below added to cover the full 103-school database
  "emory": "emory-university",
  "carnegie-mellon": "carnegie-mellon-university",
  "tufts": "tufts-university",
  "nyu": "new-york-university",
  "boston-college": "boston-college",
  "wake-forest": "wake-forest-university",
  "william-mary": "william-mary", // not in colleges.ts but exists in details
  "georgia-tech": "georgia-institute-of-technology",
  "uf": "university-of-florida",
  "ohio-state": "ohio-state-university",
  "penn-state": "penn-state-university",
  "ut-austin": "university-of-texas-austin",
  "uw-madison": "university-of-wisconsin-madison",
  "purdue": "purdue-university",
  "uiuc": "university-of-illinois-urbana-champaign",
  "uw": "university-of-washington",
  "northeastern": "northeastern-university",
  "case-western": "case-western-reserve-university",
  "tulane": "tulane-university",
  "rochester": "university-of-rochester",
  "brandeis": "brandeis-university",
  "lehigh": "lehigh-university",
  "colgate": "colgate-university",
  "boston-university": "boston-university",
  "villanova": "villanova-university",
  // New entries (53 schools)
  "uchicago": "university-of-chicago",
  "rpi": "rensselaer-polytechnic-institute",
  "santa-clara": "santa-clara-university",
  "lmu": "loyola-marymount-university",
  "pepperdine": "pepperdine-university",
  "fordham": "fordham-university",
  "gw": "george-washington-university",
  "american": "american-university",
  "syracuse": "syracuse-university",
  "miami": "university-of-miami",
  "drexel": "drexel-university",
  "stevens": "stevens-institute-of-technology",
  "wpi": "worcester-polytechnic-institute",
  "rose-hulman": "rose-hulman-institute-of-technology",
  "ucsd": "university-of-california-san-diego",
  "uc-davis": "university-of-california-davis",
  "ucsb": "university-of-california-santa-barbara",
  "uci": "university-of-california-irvine",
  "ucsc": "university-of-california-santa-cruz",
  "texas-am": "texas-am-university",
  "umd": "university-of-maryland-college-park",
  "pitt": "university-of-pittsburgh",
  "minnesota": "university-of-minnesota",
  "cu-boulder": "university-of-colorado-boulder",
  "uga": "university-of-georgia",
  "clemson": "clemson-university",
  "virginia-tech": "virginia-tech",
  "fsu": "florida-state-university",
  "indiana": "indiana-university-bloomington",
  "uconn": "university-of-connecticut",
  "rutgers": "rutgers-university",
  "stony-brook": "stony-brook-university",
  "umass": "university-of-massachusetts-amherst",
  "usf": "university-of-south-florida",
  "williams": "williams-college",
  "amherst": "amherst-college",
  "swarthmore": "swarthmore-college",
  "pomona": "pomona-college",
  "wellesley": "wellesley-college",
  "bowdoin": "bowdoin-college",
  "cmc": "claremont-mckenna-college",
  "middlebury": "middlebury-college",
  "carleton": "carleton-college",
  "colby": "colby-college",
  "davidson": "davidson-college",
  "grinnell": "grinnell-college",
  "hamilton": "hamilton-college",
  "haverford": "haverford-college",
  "vassar": "vassar-college",
  "barnard": "barnard-college",
  "smith": "smith-college",
  "colorado-college": "colorado-college",
  "oberlin": "oberlin-college",
};

// Build once at module load time
const ALIAS_MAP = buildAliasMap();

// Sorted aliases by length (longest first) for greedy matching
const SORTED_ALIASES = Array.from(ALIAS_MAP.keys()).sort(
  (a, b) => b.length - a.length
);

// ---------------------------------------------------------------------------
// School detection
// ---------------------------------------------------------------------------

/**
 * Detect school names mentioned in user messages. Returns deduplicated
 * college slugs (from colleges.ts) found across all user messages.
 *
 * Limits to 5 schools max to keep context budget sane.
 */
export function detectSchoolsInMessages(
  messages: { role: string; content: string }[]
): string[] {
  const found = new Set<string>();

  // Only scan user messages (not assistant messages)
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  for (const alias of SORTED_ALIASES) {
    if (found.size >= 5) break;
    // Word-boundary-ish check: alias must not be part of a larger word
    const idx = userText.indexOf(alias);
    if (idx === -1) continue;

    // Check boundaries: char before and after must be non-alpha
    const before = idx > 0 ? userText[idx - 1] : " ";
    const after =
      idx + alias.length < userText.length
        ? userText[idx + alias.length]
        : " ";

    const isWordBoundaryBefore = !/[a-z]/.test(before!);
    const isWordBoundaryAfter = !/[a-z]/.test(after!);

    if (isWordBoundaryBefore && isWordBoundaryAfter) {
      found.add(ALIAS_MAP.get(alias)!);
    }
  }

  return Array.from(found);
}

// ---------------------------------------------------------------------------
// Data lookup
// ---------------------------------------------------------------------------

/**
 * Look up all available data for a college slug (colleges.ts slug format).
 */
function lookupSchool(collegeSlug: string): SchoolMatch {
  const college = COLLEGES.find((c) => c.slug === collegeSlug);
  // college-details uses short slugs, so try reverse-mapping
  const detailSlug = Object.entries(DETAIL_SLUG_TO_COLLEGE_SLUG).find(
    ([, longSlug]) => longSlug === collegeSlug
  )?.[0];
  const detail = detailSlug
    ? COLLEGE_DETAILS.find((d) => d.slug === detailSlug)
    : undefined;
  const cdsWeights = CDS_WEIGHTS[collegeSlug] ?? undefined;

  return { college, detail, cdsWeights };
}

// ---------------------------------------------------------------------------
// Context formatting
// ---------------------------------------------------------------------------

function formatCdsWeightLabel(val: 0 | 1 | 2 | 3): string {
  switch (val) {
    case 3: return "Very Important";
    case 2: return "Important";
    case 1: return "Considered";
    case 0: return "Not Considered";
  }
}

/**
 * Format a single school's data as a concise context block.
 */
function formatSchoolContext(slug: string): string | null {
  const { college, detail, cdsWeights } = lookupSchool(slug);
  if (!college && !detail) return null;

  const name = detail?.name ?? college?.name ?? slug;
  const lines: string[] = [`[${name}]`];

  // Admissions data — prefer detail (richer) over college
  if (detail) {
    const a = detail.admissions;
    lines.push(`  Acceptance rate: ${a.acceptanceRate}% overall`);
    if (a.edAcceptanceRate != null) lines.push(`  ED rate: ${a.edAcceptanceRate}%`);
    if (a.eaAcceptanceRate != null) lines.push(`  EA rate: ${a.eaAcceptanceRate}%`);
    if (a.reaAcceptanceRate != null) lines.push(`  REA rate: ${a.reaAcceptanceRate}%`);
    if (a.rdAcceptanceRate != null) lines.push(`  RD rate: ${a.rdAcceptanceRate}%`);
    lines.push(`  SAT range: ${a.satRange.p25}–${a.satRange.p75} | ACT range: ${a.actRange.p25}–${a.actRange.p75}`);
    lines.push(`  Avg GPA: ${a.gpaAvg}`);
    lines.push(`  Test policy: ${a.testPolicy}`);
    lines.push(`  Demonstrated interest: ${a.demonstratedInterest}`);
    lines.push(`  Interview: ${a.interviewPolicy} | Legacy: ${a.legacyPolicy}`);

    // Deadlines
    const d = a.applicationDeadlines;
    const deadlineParts: string[] = [];
    if (d.ed) deadlineParts.push(`ED: ${d.ed}`);
    if (d.ed1) deadlineParts.push(`ED1: ${d.ed1}`);
    if (d.ed2) deadlineParts.push(`ED2: ${d.ed2}`);
    if (d.ea) deadlineParts.push(`EA: ${d.ea}`);
    if (d.rea) deadlineParts.push(`REA: ${d.rea}`);
    deadlineParts.push(`RD: ${d.rd}`);
    lines.push(`  Deadlines: ${deadlineParts.join(" | ")}`);
  } else if (college) {
    lines.push(`  Acceptance rate: ${college.acceptanceRate}%`);
    lines.push(`  SAT range: ${college.sat25}–${college.sat75}`);
    lines.push(`  Avg GPA: ${college.gpaAvg}`);
    if (college.testPolicy) lines.push(`  Test policy: ${college.testPolicy}`);
    if (college.needBlind != null) lines.push(`  Need-blind: ${college.needBlind ? "yes" : "no"}`);
    if (college.meetsFullNeed != null) lines.push(`  Meets full need: ${college.meetsFullNeed ? "yes" : "no"}`);
    if (college.earlyOption) lines.push(`  Early option: ${college.earlyOption}`);
  }

  // Financial data from detail
  if (detail) {
    const f = detail.financial;
    lines.push(`  Financial: need-blind=${f.needBlind}, meets-full-need=${f.meetsFullNeed}, no-loan=${f.noLoanPolicy}`);
    lines.push(`  Total COA: $${f.totalCOA.toLocaleString()} | Avg aid: $${f.avgFinancialAid.toLocaleString()} | ${f.pctReceivingAid}% receive aid`);
    lines.push(`  Net price <$30k income: $${f.netPriceByIncome.under30k.toLocaleString()} | $30-48k: $${f.netPriceByIncome.from30to48k.toLocaleString()} | $48-75k: $${f.netPriceByIncome.from48to75k.toLocaleString()}`);
  }

  // Academics from detail
  if (detail) {
    const ac = detail.academics;
    lines.push(`  Student-faculty ratio: ${ac.studentFacultyRatio} | Avg class: ${ac.avgClassSize} | ${ac.pctClassesUnder20}% classes <20`);
    lines.push(`  Top majors: ${ac.topMajors.slice(0, 5).join(", ")}`);
    if (ac.specialPrograms.length) {
      lines.push(`  Special programs: ${ac.specialPrograms.slice(0, 4).join(", ")}`);
    }
    lines.push(`  Grad rates: ${ac.gradRate4yr}% (4yr) / ${ac.gradRate6yr}% (6yr) | Retention: ${ac.retentionRate}%`);
  }

  // CDS C7 weights
  if (cdsWeights) {
    const w = cdsWeights;
    lines.push(`  CDS C7 weights: rigor=${formatCdsWeightLabel(w.academicRigor)}, leadership=${formatCdsWeightLabel(w.leadership)}, awards=${formatCdsWeightLabel(w.awards)}, activities=${formatCdsWeightLabel(w.activityDepth)}, spike=${formatCdsWeightLabel(w.spike)}, essay=${formatCdsWeightLabel(w.essayQuality)}, recs=${formatCdsWeightLabel(w.recommendations)}`);
  } else if (detail) {
    // Use CDS weights from detail file
    const w = detail.cdsWeights;
    lines.push(`  CDS C7 weights: rigor=${w.rigor}, GPA=${w.gpa}, essay=${w.essay}, recs=${w.recommendations}, ECs=${w.extracurriculars}, talent=${w.talent}, interest=${w.interest}`);
  }

  // Campus life & culture from detail
  if (detail) {
    const cl = detail.campusLife;
    lines.push(`  Enrollment: ${cl.housing.pctOnCampus}% on campus | ${cl.clubsAndOrgs} clubs | Greek: ${cl.greekLife.pctMen}%M/${cl.greekLife.pctWomen}%W`);
    lines.push(`  Athletics: ${cl.athletics.division} ${cl.athletics.conference}${cl.athletics.notable.length ? " — " + cl.athletics.notable.slice(0, 3).join(", ") : ""}`);
    lines.push(`  Social scene: ${cl.socialScene}`);
    lines.push(`  Diversity: ${cl.diversity.white}% White, ${cl.diversity.asian}% Asian, ${cl.diversity.hispanic}% Hispanic, ${cl.diversity.black}% Black, ${cl.diversity.international}% International, ${cl.diversity.firstGen}% First-gen`);
  }

  // Outcomes from detail
  if (detail) {
    const o = detail.outcomes;
    lines.push(`  Median earnings 10yr: $${o.medianEarnings10yr.toLocaleString()} | ${o.pctEmployed6mo}% employed in 6mo | ${o.pctGradSchool}% grad school`);
    lines.push(`  Top employers: ${o.topEmployers.slice(0, 5).join(", ")}`);
    if (o.notableAlumni.length) lines.push(`  Notable alumni: ${o.notableAlumni.slice(0, 4).join(", ")}`);
  }

  // Strategy tips from detail
  if (detail) {
    if (detail.strategy.whatTheyLookFor.length) {
      lines.push(`  What they look for: ${detail.strategy.whatTheyLookFor.slice(0, 4).join(" | ")}`);
    }
    if (detail.strategy.insiderTips.length) {
      lines.push(`  Insider tips: ${detail.strategy.insiderTips.slice(0, 4).join(" | ")}`);
    }
    if (detail.strategy.bestFitFor.length) {
      lines.push(`  Best fit for: ${detail.strategy.bestFitFor.slice(0, 3).join(", ")}`);
    }
    if (detail.strategy.worstFitFor.length) {
      lines.push(`  Worst fit for: ${detail.strategy.worstFitFor.slice(0, 3).join(", ")}`);
    }
    if (detail.strategy.commonMistakes.length) {
      lines.push(`  Common mistakes: ${detail.strategy.commonMistakes.slice(0, 3).join(" | ")}`);
    }
    if (detail.strategy.supplementEssays.length) {
      lines.push(`  Supplement essays: ${detail.strategy.supplementEssays.map(e => `"${e.prompt}" (${e.wordLimit} words — tip: ${e.tip})`).slice(0, 2).join(" | ")}`);
    }
  }

  // Admitted profiles (if available) — show 1-2 examples
  const profiles = ADMITTED_PROFILES.filter(p => {
    const pSchool = p.school.toLowerCase();
    const cShort = college?.shortName?.toLowerCase() ?? "";
    return pSchool === cShort || pSchool === name.toLowerCase();
  }).slice(0, 2);
  if (profiles.length > 0) {
    lines.push(`  Example admitted students:`);
    for (const p of profiles) {
      lines.push(`    - ${p.year} ${p.program ?? ""}: GPA ${p.gpa}${p.sat ? `, SAT ${p.sat}` : ""}${p.act ? `, ACT ${p.act}` : ""} | Spike: ${p.spike.slice(0, 100)} | Essay: ${p.essayTopic.slice(0, 80)}`);
    }
  }

  return lines.join("\n");
}

/**
 * Build the full school data context block for injection into the system
 * prompt. Returns empty string if no schools detected.
 *
 * Cap: 5 schools max to stay within context budget.
 */
export function buildSchoolDataContext(
  messages: { role: string; content: string }[]
): string {
  const slugs = detectSchoolsInMessages(messages);

  const blocks: string[] = [];
  for (const slug of slugs) {
    const block = formatSchoolContext(slug);
    if (block) blocks.push(block);
  }

  // Detect potential school names NOT in our database
  const unknownSchools = detectUnknownSchools(messages, slugs);

  if (blocks.length === 0 && unknownSchools.length === 0) return "";

  const parts: string[] = ["", "—"];

  if (blocks.length > 0) {
    parts.push(
      "REAL SCHOOL DATA (use these exact numbers — do NOT use your training data for stats listed here):",
      ...blocks,
      "(Data from AdmitPath database, Class of 2027-2028 era CDS reports.)",
    );
  }

  if (unknownSchools.length > 0) {
    parts.push(
      "",
      "SCHOOLS MENTIONED BUT NOT IN DATABASE:",
      `The student mentioned: ${unknownSchools.join(", ")}`,
      "These schools are NOT in our 102-school database. Follow the UNKNOWN SCHOOL PROTOCOL:",
      "1. Acknowledge you don't have their specific CDS data",
      "2. Use your training knowledge (labeled as 'verify for current cycle')",
      "3. Recommend the student search for '[school] common data set 2024-2025 filetype:pdf'",
      "4. Suggest checking collegescorecard.ed.gov for federal data",
      "5. Point them to the school's official admissions page for deadlines and requirements",
      "6. Compare to similar schools in our database to give directional guidance",
    );
  }

  return parts.join("\n");
}

/**
 * Detect potential school/university names in messages that are NOT
 * in our database. Uses heuristic patterns to find "University of X",
 * "X College", "X Institute", etc.
 */
function detectUnknownSchools(
  messages: { role: string; content: string }[],
  foundSlugs: string[],
): string[] {
  if (foundSlugs.length > 0) return [];

  const unknowns: string[] = [];
  const patterns = [
    /\b(University\s+of\s+[A-Z][a-zA-Z\s]+)/g,
    /\b([A-Z][a-zA-Z]+\s+University)\b/g,
    /\b([A-Z][a-zA-Z]+\s+College)\b/g,
    /\b([A-Z][a-zA-Z]+\s+Institute\s+of\s+[A-Z][a-zA-Z]+)\b/g,
    /\b([A-Z][a-zA-Z]+\s+State)\b(?:\s+University)?/g,
  ];

  for (const msg of messages) {
    if (msg.role !== "user") continue;
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(msg.content)) !== null) {
        const name = match[1].trim();
        if (name.length > 5 && name.length < 60) {
          unknowns.push(name);
        }
      }
    }
  }

  return Array.from(new Set(unknowns)).slice(0, 3);
}
