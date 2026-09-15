/**
 * Recommendation-letter heuristics.
 *
 * Two parts:
 *   1. selectRecommenders — given a student's courses, surface the most
 *      likely-strong recommenders. Strong recommender criteria (per the
 *      AdmitPath master PRD + general admissions consensus):
 *        - Taught the student in 11th or 12th grade (recency)
 *        - Academic subject — math/science/english/history/language
 *          (admissions weight academic teachers more than electives/PE)
 *        - Honors/AP/IB course (rigor signals the teacher saw academic depth)
 *        - "Knows you well" cannot be inferred from the schema, so we fall
 *          back to course-rigor + recency as proxies
 *
 *   2. buildBragSheet — assemble the brag-sheet text the student gives the
 *      teacher when asking for a letter. Pure template; no LLM call needed.
 *      The student edits the closing paragraph in the UI before sending.
 *
 * Both functions are pure — no Prisma, no fetch — so they're trivially
 * testable and the API route can call them with a coerced profile shape.
 */

export type CourseHint = {
  name: string;
  grade?: number | null;       // 9, 10, 11, 12
  type?: "ap" | "ib" | "honors" | "regular" | "dual_enrollment" | null;
  subject?: "math" | "science" | "english" | "history" | "language" | "other" | null;
  finalGrade?: string | null;  // "A", "A-", "B+"
};

export type RecommenderPick = {
  course: string;
  reason: string;
  priority: "primary" | "secondary" | "skip";
  flags: string[]; // e.g. ["AP course", "Senior year"]
};

const ACADEMIC_SUBJECTS: ReadonlySet<string> = new Set([
  "math",
  "science",
  "english",
  "history",
  "language",
]);

// Subject inference from a course name when the schema didn't provide one.
// Conservative — only labels we're highly confident about.
const SUBJECT_REGEXES: { subject: NonNullable<CourseHint["subject"]>; re: RegExp }[] = [
  { subject: "math",     re: /\b(calc|algebra|geometry|trig|stats|statistics|precalc)\b/i },
  { subject: "science",  re: /\b(bio|chem|physics|environmental|computer science|cs|psych)\b/i },
  { subject: "english",  re: /\b(english|lit|literature|composition|writing|lang)\b/i },
  { subject: "history",  re: /\b(history|gov|government|economics|macro|micro|world)\b/i },
  { subject: "language", re: /\b(spanish|french|latin|chinese|japanese|german|italian|arabic)\b/i },
];

const RIGOR_REGEX = /\b(AP|IB|Honors|Honors-level|Dual Enrollment|DE)\b/i;

function inferSubject(course: CourseHint): NonNullable<CourseHint["subject"]> | null {
  if (course.subject) return course.subject;
  for (const { subject, re } of SUBJECT_REGEXES) {
    if (re.test(course.name)) return subject;
  }
  return null;
}

function isRigor(course: CourseHint): boolean {
  if (course.type && ["ap", "ib", "honors", "dual_enrollment"].includes(course.type)) return true;
  return RIGOR_REGEX.test(course.name);
}

/**
 * Score a course as a recommender candidate. Higher score = stronger pick.
 * Returns 0 for ineligible (PE, art elective, freshman-only courses).
 */
function scoreCourse(course: CourseHint): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;

  // Hard ineligibility — non-academic subjects rarely produce strong letters.
  const subject = inferSubject(course);
  if (!subject || !ACADEMIC_SUBJECTS.has(subject)) {
    return { score: 0, flags: ["Non-academic — rarely produces strong letters"] };
  }

  // Recency — 11th/12th grade teachers know you most recently and most
  // college-readiness-relevant. 9th/10th teachers can work but are weaker.
  if (course.grade === 11) {
    score += 40;
    flags.push("Junior year — admissions sweet spot");
  } else if (course.grade === 12) {
    score += 35;
    flags.push("Senior year — most recent");
  } else if (course.grade === 10) {
    score += 15;
    flags.push("Sophomore year — older but possible");
  } else {
    // No grade info or freshman-only — modest baseline so we don't drop the
    // entire course just because grade wasn't filled in.
    score += 10;
  }

  // Rigor — AP/IB/Honors signals the teacher saw academic depth, not just
  // attendance. Worth a meaningful boost.
  if (isRigor(course)) {
    score += 30;
    flags.push("Rigorous course");
  }

  // Subject prestige — math + science slightly more weight for STEM-bound
  // applicants; english + history for humanities. Without intended-major
  // info we treat them equally except for a neutral baseline.
  score += 15; // baseline for being academic at all

  // Final grade — an A or A- earned in a rigor course is a stronger signal.
  // We don't penalize lower grades because growth-arc letters ("started B+,
  // ended A") are sometimes the strongest.
  const grade = course.finalGrade?.trim().toUpperCase();
  if (grade && ["A", "A+", "A-"].includes(grade)) {
    score += 10;
    flags.push("Strong grade");
  }

  return { score, flags };
}

/**
 * Pick the top 2 primary recommenders + 1-2 secondary, skipping anything
 * that scored 0. We deliberately return at most 4 entries so the UI doesn't
 * dilute the recommendation. If we can't find any academic course at all,
 * the caller should surface "fill out your courses" instead of running this.
 */
export function selectRecommenders(courses: CourseHint[]): RecommenderPick[] {
  const scored = courses
    .map((c) => ({ course: c, ...scoreCourse(c) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return [];

  const picks: RecommenderPick[] = [];
  const usedSubjects = new Set<string>();

  // First pass: top 2 distinct-subject courses → primary picks. Diversity
  // matters because admissions read two letters from the same subject as a
  // weak signal ("could only find two teachers in one department").
  for (const s of scored) {
    if (picks.filter((p) => p.priority === "primary").length >= 2) break;
    const subject = inferSubject(s.course);
    if (subject && usedSubjects.has(subject)) continue;
    if (subject) usedSubjects.add(subject);
    picks.push({
      course: s.course.name,
      reason: pickReason(s.flags, "primary"),
      priority: "primary",
      flags: s.flags,
    });
  }

  // Second pass: 1-2 secondary picks from remaining courses. Same-subject
  // duplicates allowed here since the student would only use these as
  // backups if a primary teacher declines.
  for (const s of scored) {
    if (picks.length >= 4) break;
    if (picks.find((p) => p.course === s.course.name)) continue;
    picks.push({
      course: s.course.name,
      reason: pickReason(s.flags, "secondary"),
      priority: "secondary",
      flags: s.flags,
    });
  }

  return picks;
}

function pickReason(flags: string[], priority: "primary" | "secondary"): string {
  const has = (f: string) => flags.some((x) => x.includes(f));
  if (priority === "primary") {
    if (has("Junior") && has("Rigorous")) {
      return "Recent teacher from a rigorous course; confirm they can describe specific classroom moments before treating this as a primary choice.";
    }
    if (has("Junior")) {
      return "Junior-year academic teacher with recent classroom context; confirm they know your work well enough to provide specific examples.";
    }
    if (has("Senior")) {
      return "Senior-year academic teacher with current context; confirm the relationship includes enough specific evidence for a detailed letter.";
    }
    return "Academic teacher who saw you in a graded class.";
  }
  return "Strong backup if your first pick declines.";
}

export type BragSheetInput = {
  studentName?: string | null;
  grade?: number | null;
  gpa?: number | null;
  satScore?: number | null;
  actScore?: number | null;
  apCount?: number;
  topActivities?: string[];   // formatted "name (role)" strings
  topAwards?: string[];       // formatted strings
  topCourses?: string[];      // formatted strings, e.g. "AP Calc BC — A"
  targetColleges?: string[];  // school short names
  // Optional free-form student-supplied paragraph — what they want the
  // teacher to highlight. The UI surfaces a textarea pre-filled with a
  // neutral default the student edits before printing.
  whyAskingThem?: string | null;
};

const DEFAULT_WHY = `Your class was the most challenging and meaningful course I've taken. You saw me struggle with material early on, work through it in office hours, and grow into someone who could engage with the subject at a higher level. I'd be grateful if you could speak to that growth and to my work ethic in your letter.`;

/**
 * Render a printable brag-sheet string the student hands to the teacher.
 * Plain text on purpose — most teachers print these. The UI renders it in
 * a monospace block with a Copy + Print button so the student can edit
 * any field before sending.
 */
/**
 * Validate brag sheet input. Returns an array of field-level errors.
 * Empty array = valid.
 */
export function validateBragSheetInput(input: BragSheetInput): string[] {
  const errors: string[] = [];
  if (input.gpa != null && (input.gpa < 0 || input.gpa > 5)) {
    errors.push("GPA must be between 0 and 5.0");
  }
  if (input.satScore != null && (input.satScore < 400 || input.satScore > 1600)) {
    errors.push("SAT score must be between 400 and 1600");
  }
  if (input.actScore != null && (input.actScore < 1 || input.actScore > 36)) {
    errors.push("ACT score must be between 1 and 36");
  }
  if (input.grade != null && (input.grade < 9 || input.grade > 12)) {
    errors.push("Grade must be between 9 and 12");
  }
  return errors;
}

export function buildBragSheet(input: BragSheetInput): string {
  const lines: string[] = [];
  lines.push("BRAG SHEET FOR RECOMMENDATION LETTER");
  if (input.studentName) lines.push(`Student: ${input.studentName.trim()}`);
  if (input.grade) lines.push(`Grade: ${input.grade}`);
  lines.push("");

  lines.push("ACADEMIC SNAPSHOT:");
  if (input.gpa) lines.push(`- GPA: ${input.gpa}`);
  if (input.satScore) lines.push(`- SAT: ${input.satScore}`);
  if (input.actScore) lines.push(`- ACT: ${input.actScore}`);
  if (input.apCount && input.apCount > 0) lines.push(`- AP courses taken: ${input.apCount}`);
  if (input.topCourses?.length) {
    lines.push(`- Notable courses:`);
    for (const c of input.topCourses) lines.push(`  • ${c}`);
  }

  if (input.topActivities?.length) {
    lines.push("", "ACTIVITIES & LEADERSHIP:");
    for (const a of input.topActivities) lines.push(`- ${a}`);
  }

  if (input.topAwards?.length) {
    lines.push("", "AWARDS:");
    for (const a of input.topAwards) lines.push(`- ${a}`);
  }

  if (input.targetColleges?.length) {
    lines.push("", "TARGET SCHOOLS:");
    for (const t of input.targetColleges) lines.push(`- ${t}`);
  }

  lines.push("", "WHY I'M ASKING YOU:");
  lines.push((input.whyAskingThem ?? DEFAULT_WHY).trim());

  lines.push("", "Thank you for considering writing me a letter.");
  return lines.join("\n");
}
