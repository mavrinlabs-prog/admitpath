/**
 * AdmitPath Combo SEO Data for massive page generation.
 * - 500 colleges x 4 subpages = 2,000
 * - 50 states x 4 subpages = 200
 * - 20 majors x 50 colleges = 1,000 combos
 * Total target: 5,000+ pages
 */

// ── College Subpage Types ──
export const COLLEGE_SUBPAGES = ["profile", "essays", "majors", "scholarships"] as const;
export type CollegeSubpage = typeof COLLEGE_SUBPAGES[number];

export const COLLEGE_SUBPAGE_META: Record<CollegeSubpage, { titleSuffix: string; descTemplate: string }> = {
  profile: {
    titleSuffix: "Admissions Profile & Stats",
    descTemplate: "Complete admissions profile for {college}: acceptance rate, SAT/ACT scores, GPA, application deadlines, and CDS data. Updated for 2026-2027.",
  },
  essays: {
    titleSuffix: "Essay Prompts & Examples",
    descTemplate: "{college} supplemental essay prompts for 2026-2027 with strategy tips, word counts, and example approaches. Free AI essay feedback.",
  },
  majors: {
    titleSuffix: "Popular Majors & Programs",
    descTemplate: "Most popular majors at {college}: acceptance rates by major, program strengths, research opportunities, and career outcomes.",
  },
  scholarships: {
    titleSuffix: "Scholarships & Financial Aid",
    descTemplate: "{college} scholarships and financial aid: merit awards, need-based aid, average package, FAFSA tips, and appeal strategies.",
  },
};

// ── State Subpage Types ──
export const STATE_SUBPAGES = ["colleges", "admissions-guide", "scholarships", "deadlines"] as const;
export type StateSubpage = typeof STATE_SUBPAGES[number];

export const ALL_STATES = [
  { slug: "alabama", name: "Alabama", abbr: "AL" }, { slug: "alaska", name: "Alaska", abbr: "AK" },
  { slug: "arizona", name: "Arizona", abbr: "AZ" }, { slug: "arkansas", name: "Arkansas", abbr: "AR" },
  { slug: "california", name: "California", abbr: "CA" }, { slug: "colorado", name: "Colorado", abbr: "CO" },
  { slug: "connecticut", name: "Connecticut", abbr: "CT" }, { slug: "delaware", name: "Delaware", abbr: "DE" },
  { slug: "florida", name: "Florida", abbr: "FL" }, { slug: "georgia", name: "Georgia", abbr: "GA" },
  { slug: "hawaii", name: "Hawaii", abbr: "HI" }, { slug: "idaho", name: "Idaho", abbr: "ID" },
  { slug: "illinois", name: "Illinois", abbr: "IL" }, { slug: "indiana", name: "Indiana", abbr: "IN" },
  { slug: "iowa", name: "Iowa", abbr: "IA" }, { slug: "kansas", name: "Kansas", abbr: "KS" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY" }, { slug: "louisiana", name: "Louisiana", abbr: "LA" },
  { slug: "maine", name: "Maine", abbr: "ME" }, { slug: "maryland", name: "Maryland", abbr: "MD" },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA" }, { slug: "michigan", name: "Michigan", abbr: "MI" },
  { slug: "minnesota", name: "Minnesota", abbr: "MN" }, { slug: "mississippi", name: "Mississippi", abbr: "MS" },
  { slug: "missouri", name: "Missouri", abbr: "MO" }, { slug: "montana", name: "Montana", abbr: "MT" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE" }, { slug: "nevada", name: "Nevada", abbr: "NV" },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH" }, { slug: "new-jersey", name: "New Jersey", abbr: "NJ" },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM" }, { slug: "new-york", name: "New York", abbr: "NY" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC" }, { slug: "north-dakota", name: "North Dakota", abbr: "ND" },
  { slug: "ohio", name: "Ohio", abbr: "OH" }, { slug: "oklahoma", name: "Oklahoma", abbr: "OK" },
  { slug: "oregon", name: "Oregon", abbr: "OR" }, { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA" },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI" }, { slug: "south-carolina", name: "South Carolina", abbr: "SC" },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD" }, { slug: "tennessee", name: "Tennessee", abbr: "TN" },
  { slug: "texas", name: "Texas", abbr: "TX" }, { slug: "utah", name: "Utah", abbr: "UT" },
  { slug: "vermont", name: "Vermont", abbr: "VT" }, { slug: "virginia", name: "Virginia", abbr: "VA" },
  { slug: "washington", name: "Washington", abbr: "WA" }, { slug: "west-virginia", name: "West Virginia", abbr: "WV" },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI" }, { slug: "wyoming", name: "Wyoming", abbr: "WY" },
] as const;

export const STATE_SUBPAGE_META: Record<StateSubpage, { titleSuffix: string; descTemplate: string }> = {
  colleges: {
    titleSuffix: "Top Colleges & Universities",
    descTemplate: "Best colleges in {state}: acceptance rates, SAT scores, tuition, and rankings. Complete list of 4-year universities in {abbr}.",
  },
  "admissions-guide": {
    titleSuffix: "College Admissions Guide",
    descTemplate: "College admissions guide for {state} students: state university applications, deadlines, requirements, and strategies for {abbr} residents.",
  },
  scholarships: {
    titleSuffix: "Scholarships for Students",
    descTemplate: "{state} scholarships for college students: state grants, merit awards, need-based aid, and FAFSA tips for {abbr} residents.",
  },
  deadlines: {
    titleSuffix: "Application Deadlines",
    descTemplate: "College application deadlines for {state} universities: Early Decision, Early Action, Regular Decision, and financial aid dates for 2026-2027.",
  },
};

// ── Major x College Combos ──
export const TOP_MAJORS = [
  { slug: "computer-science", name: "Computer Science" },
  { slug: "business-administration", name: "Business Administration" },
  { slug: "engineering", name: "Engineering" },
  { slug: "biology", name: "Biology" },
  { slug: "psychology", name: "Psychology" },
  { slug: "nursing", name: "Nursing" },
  { slug: "economics", name: "Economics" },
  { slug: "political-science", name: "Political Science" },
  { slug: "english", name: "English" },
  { slug: "mathematics", name: "Mathematics" },
  { slug: "chemistry", name: "Chemistry" },
  { slug: "physics", name: "Physics" },
  { slug: "finance", name: "Finance" },
  { slug: "communications", name: "Communications" },
  { slug: "pre-med", name: "Pre-Med" },
  { slug: "data-science", name: "Data Science" },
  { slug: "environmental-science", name: "Environmental Science" },
  { slug: "mechanical-engineering", name: "Mechanical Engineering" },
  { slug: "electrical-engineering", name: "Electrical Engineering" },
  { slug: "international-relations", name: "International Relations" },
] as const;

// Top 50 colleges for combo pages (must match colleges.ts slugs)
export const TOP_50_COLLEGE_SLUGS = [
  "harvard-university", "yale-university", "princeton-university", "columbia-university",
  "university-of-pennsylvania", "brown-university", "dartmouth-college", "cornell-university",
  "mit", "stanford-university", "caltech", "duke-university", "northwestern-university",
  "johns-hopkins-university", "rice-university", "vanderbilt-university", "emory-university",
  "georgetown-university", "carnegie-mellon-university", "usc", "nyu", "uc-berkeley",
  "ucla", "university-of-michigan", "university-of-virginia", "unc-chapel-hill",
  "georgia-tech", "university-of-texas-austin", "university-of-florida",
  "university-of-illinois", "university-of-wisconsin", "ohio-state-university",
  "penn-state-university", "purdue-university", "university-of-washington",
  "boston-university", "tufts-university", "wake-forest-university", "william-and-mary",
  "university-of-rochester", "case-western-reserve", "tulane-university",
  "university-of-miami", "florida-state-university", "university-of-south-florida",
  "ucf", "university-of-colorado-boulder", "indiana-university", "rutgers-university",
  "university-of-maryland",
] as const;

/** Generate all college subpage static params */
export function getAllCollegeSubpageParams(collegeSlugs: string[]) {
  const params: { slug: string; subpage: string }[] = [];
  for (const slug of collegeSlugs) {
    for (const subpage of COLLEGE_SUBPAGES) {
      params.push({ slug, subpage });
    }
  }
  return params;
}

/** Generate all state subpage static params */
export function getAllStateSubpageParams() {
  const params: { state: string; subpage: string }[] = [];
  for (const state of ALL_STATES) {
    for (const subpage of STATE_SUBPAGES) {
      params.push({ state: state.slug, subpage });
    }
  }
  return params;
}

/** Generate all major x college combo params */
export function getAllMajorCollegeParams() {
  const params: { major: string; college: string }[] = [];
  for (const major of TOP_MAJORS) {
    for (const college of TOP_50_COLLEGE_SLUGS) {
      params.push({ major: major.slug, college });
    }
  }
  return params;
}

/** Get total page count estimate */
export function getTotalPageCount(collegeCount: number) {
  const collegeSubpages = collegeCount * COLLEGE_SUBPAGES.length;
  const stateSubpages = ALL_STATES.length * STATE_SUBPAGES.length;
  const majorCombos = TOP_MAJORS.length * TOP_50_COLLEGE_SLUGS.length;
  return collegeSubpages + stateSubpages + majorCombos;
}
// Example: 500 colleges x 4 = 2,000 + 50 x 4 = 200 + 20 x 50 = 1,000 = 3,200 new pages
// Plus existing: ~500 college profiles + ~50 blog + guides + tools = ~5,000+ total
