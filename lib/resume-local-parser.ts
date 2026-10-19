/**
 * Deterministic, section-aware resume parser used when the AI parser is
 * unavailable (no keys, timeout, provider outage).
 *
 * Bug fixed (2026-10): the previous fallback split text on every period, so
 * "Led team of 24 to state finals." became its own activity, "AP Scholar with
 * Distinction" (an award) was echoed into Courses, and weighted GPA, intended
 * major, school, and state were never filled. This parser reads headed
 * sections (ACTIVITIES / AWARDS / COURSES / ...) line by line and only puts a
 * value in a field when the line matches that field.
 */

export type LocalActivity = {
  name: string;
  role: string | null;
  hoursPerWeek: number | null;
  yearsInvolved: number | null;
  impact: string | null;
  leadershipRole: boolean;
};

export type LocalResume = {
  academic: {
    gpa: number | null;
    weightedGpa: number | null;
    satScore: number | null;
    actScore: number | null;
    grade: number | null;
    school: string | null;
    state: string | null;
    intendedMajor: string | null;
  };
  activities: LocalActivity[];
  awards: Array<{ name: string; level: string; year: number | null }>;
  courses: Array<{ name: string; type: string }>;
};

type Section = "activities" | "awards" | "courses" | "education" | "skills" | "summer" | "other";

const HEADINGS: Array<[RegExp, Section]> = [
  [/^(extra[- ]?curricular|activities|leadership|experience|work experience|employment|volunteer(ing)?|community service|service)\b/i, "activities"],
  [/^(awards?|honou?rs?|achievements?|recognition|distinctions?)\b/i, "awards"],
  [/^(courses?|coursework|academics?|classes|ap\s*\/?\s*ib courses|rigor)\b/i, "courses"],
  [/^(education|school)\b/i, "education"],
  [/^(skills|languages|interests)\b/i, "skills"],
  [/^(summer|summer programs?)\b/i, "summer"],
];

const STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
  MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
  WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
};

const LEADERSHIP = /\b(president|vice president|founder|co-founder|captain|co-captain|editor(?:-in-chief)?|director|chair(?:person)?|head|lead(?:er)?|officer|treasurer|secretary|manager|organizer|coordinator)\b/i;
const COURSE_PREFIX = /^(AP|IB(?:\s+(?:HL|SL))?|Honors|Dual Enrollment|DE)\s+/i;
const AWARD_WORDS = /\b(award|prize|medal|finalist|semifinalist|scholar|winner|honou?r roll|place|champion|recognition|merit|olympiad|gold|silver|bronze)\b/i;

function inRange(value: number, min: number, max: number): number | null {
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

function headingFor(line: string): Section | null {
  if (/:\s*\S/.test(line)) return null; // "Courses: AP Bio" is inline content, handled by caller
  const cleaned = line.replace(/[:\-–—]+$/, "").trim();
  if (cleaned.length > 40 || cleaned.split(/\s+/).length > 4) return null;
  for (const [pattern, section] of HEADINGS) {
    if (pattern.test(cleaned)) return section;
  }
  return null;
}

function stripBullet(line: string): string {
  return line.replace(/^\s*(?:[-*•▪◦·‣]|\d+[.)])\s*/, "").replace(/\s+/g, " ").trim();
}

export function parseActivityLine(line: string): LocalActivity {
  const text = stripBullet(line);
  const [head, ...rest] = text.split(/\s+[—–-]\s+|\s*[|·]\s*/);
  const tail = rest.join(" — ");
  const hours = text.match(/(\d+(?:\.\d+)?)\s*(?:hrs?|hours?)\s*(?:\/|per\s*)?\s*(?:wk|week)/i);
  const years = text.match(/(\d+(?:\.\d+)?)\s*(?:yrs?|years?)\b/i);
  let role: string | null = null;
  let name = head.trim();
  const comma = head.split(/,\s*/);
  if (comma.length >= 2 && LEADERSHIP.test(comma[0])) {
    role = comma[0].trim();
    name = comma.slice(1).join(", ").trim();
  } else {
    const of = head.match(/^(.{2,60}?)\s+of\s+(.+)$/i);
    if (of && LEADERSHIP.test(of[1])) {
      role = of[1].trim();
      name = of[2].trim();
    }
  }
  const impactSource = tail
    .replace(/^[^.]*?\b\d+(?:\.\d+)?\s*(?:hrs?|hours?)[^.—·]*?(?:\.|—|$)/i, "")
    .replace(/^\s*\d+(?:\.\d+)?\s*(?:yrs?|years?)\.?\s*(?:—\s*)?/i, "")
    .replace(/^[—\s]+/, "")
    .trim();
  return {
    name: name.slice(0, 200) || text.slice(0, 200),
    role: role ? role.slice(0, 120) : null,
    hoursPerWeek: hours ? inRange(Number(hours[1]), 0, 168) : null,
    yearsInvolved: years ? inRange(Number(years[1]), 0, 12) : null,
    impact: impactSource ? impactSource.slice(0, 1000) : null,
    leadershipRole: Boolean(role) || LEADERSHIP.test(head),
  };
}

function awardLevel(name: string): string {
  if (/\binternational\b/i.test(name)) return "International";
  if (/\b(national|usaco|usamo|aime|national merit|regeneron|isef)\b/i.test(name)) return "National";
  if (/\bstate\b/i.test(name)) return "State";
  if (/\b(regional|district|county)\b/i.test(name)) return "Regional";
  if (/\bschool\b/i.test(name)) return "School";
  return "Other";
}

function splitCourses(line: string): string[] {
  return stripBullet(line)
    .split(/\s*[,;]\s*|\s+and\s+(?=(?:AP|IB|Honors|Dual Enrollment)\b)/i)
    .map((item) => item.replace(/\s*\(\d\)\s*$/, "").trim())
    .filter((item) => item.length >= 3 && item.length <= 160)
    .filter((item) => !/\bscholar\b/i.test(item));
}

export function parseResumeLocally(text: string): LocalResume {
  const normalized = text.replace(/\r\n?/g, "\n");
  const flat = normalized.replace(/\s+/g, " ");

  const weighted = flat.match(/(?<!un)weighted(?:\s+gpa)?\s*[:=]?\s*([0-9](?:\.\d{1,3})?)/i)
    ?? flat.match(/\bgpa\s*[:=]?\s*[0-9.]+\s*(?:uw|unweighted)?\s*[/,|]\s*([0-9](?:\.\d{1,3})?)\s*(?:w|weighted)\b/i);
  const unweighted = flat.match(/\bunweighted\s+gpa\s*[:=]?\s*([0-9](?:\.\d{1,3})?)/i)
    ?? flat.match(/(?<!weighted\s)\bgpa\s*[:=]?\s*([0-9](?:\.\d{1,3})?)/i);
  const sat = flat.match(/\bsat(?:\s+score)?\s*[:=]?\s*(\d{3,4})\b/i);
  const act = flat.match(/\bact(?:\s+score)?\s*[:=]?\s*(\d{1,2})\b/i);
  const grade = flat.match(/\bgrade(?:\s+level)?\s*[:=]?\s*(7|8|9|10|11|12)\b/i)
    ?? flat.match(/\b(7|8|9|10|11|12)(?:th)\s+grade\b/i)
    ?? (/\bjunior\b/i.test(flat) ? ["", "11"] : /\bsenior\b/i.test(flat) ? ["", "12"] : /\bsophomore\b/i.test(flat) ? ["", "10"] : /\bfreshman\b/i.test(flat) ? ["", "9"] : null);
  const major = normalized.match(/\b(?:intended\s+major|major(?:\s+interest)?|academic\s+interests?)\s*[:=]\s*([^|\n.;]{2,80})/i);
  const school = normalized.match(/^.*?\b([A-Z][A-Za-z.'&-]*(?:\s+[A-Z][A-Za-z.'&-]*){0,5}\s+(?:High School|Academy|Preparatory School|Prep|School))\b/m);
  const stateCode = flat.match(/,\s*([A-Z]{2})\b(?!\w)/);
  const stateName = Object.values(STATES).find((name) => new RegExp(`\\b${name}\\b`).test(flat));

  const activities: LocalActivity[] = [];
  const awards: LocalResume["awards"] = [];
  const courses: LocalResume["courses"] = [];
  const seen = new Set<string>();
  const push = <T,>(list: T[], key: string, item: T) => {
    const k = key.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    list.push(item);
  };

  let section: Section = "other";
  let sawHeading = false;
  for (const rawLine of normalized.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const heading = headingFor(line);
    let item: string;
    if (heading) {
      section = heading;
      sawHeading = true;
      continue;
    }
    const inline = line.match(/^([A-Za-z /&-]{3,30}):\s*(.+)$/);
    const inlineHeading = inline ? headingFor(inline[1]) : null;
    if (inline && inlineHeading) {
      section = inlineHeading;
      sawHeading = true;
      item = stripBullet(inline[2]);
    } else {
      item = stripBullet(line);
    }
    if (!item) continue;
    if (section === "activities") {
      // Continuation lines ("Led team of 24 ...") belong to the previous activity.
      const isContinuation = activities.length > 0 && /^[a-z]/.test(item) || (activities.length > 0 && !/[,—–|-]/.test(item) && !LEADERSHIP.test(item) && /^(led|built|taught|raised|organized|created|managed|won|helped|developed|grew)\b/i.test(item));
      if (isContinuation) {
        const prev = activities[activities.length - 1];
        prev.impact = [prev.impact, item].filter(Boolean).join(" ").slice(0, 1000);
      } else {
        const activity = parseActivityLine(item);
        push(activities, `a:${activity.name}`, activity);
      }
    } else if (section === "awards") {
      const year = item.match(/\b(19[9]\d|20[0-4]\d)\b/);
      push(awards, `w:${item}`, { name: item.slice(0, 200), level: awardLevel(item), year: year ? Number(year[1]) : null });
    } else if (section === "courses") {
      for (const course of splitCourses(item)) {
        const type = course.match(COURSE_PREFIX)?.[1] ?? "Other";
        push(courses, `c:${course}`, { name: course, type: /^DE$/i.test(type) ? "Dual Enrollment" : type.replace(/\s+(HL|SL)$/i, "") });
      }
    }
  }

  // Un-headed resumes: fall back to conservative pattern matching per line.
  if (!sawHeading) {
    for (const rawLine of normalized.split(/\n|(?<=\.)\s+(?=[A-Z])/)) {
      const item = stripBullet(rawLine);
      if (!item || item.length < 4) continue;
      if (COURSE_PREFIX.test(item) && !/\bscholar\b/i.test(item)) {
        for (const course of splitCourses(item)) {
          if (COURSE_PREFIX.test(course)) push(courses, `c:${course}`, { name: course, type: course.match(COURSE_PREFIX)?.[1] ?? "Other" });
        }
      } else if (AWARD_WORDS.test(item) && !/\b(gpa|sat|act)\b/i.test(item)) {
        push(awards, `w:${item}`, { name: item.slice(0, 200), level: awardLevel(item), year: null });
      } else if (LEADERSHIP.test(item) || /\b(club|team|volunteer|tutor|research|intern|job|work|band|orchestra|theater|newspaper)\b/i.test(item)) {
        const activity = parseActivityLine(item);
        push(activities, `a:${activity.name}`, activity);
      }
    }
  }

  const gpaValue = unweighted ? inRange(Number(unweighted[1]), 0, 4.5) : null;
  const weightedValue = weighted ? inRange(Number(weighted[1]), 0, 5.5) : null;
  return {
    academic: {
      gpa: gpaValue,
      weightedGpa: weightedValue !== null && weightedValue !== gpaValue ? weightedValue : null,
      satScore: sat ? inRange(Number(sat[1]), 400, 1600) : null,
      actScore: act ? inRange(Number(act[1]), 1, 36) : null,
      grade: grade ? inRange(Number(grade[1]), 7, 12) : null,
      school: school ? school[1].trim().slice(0, 200) : null,
      state: stateCode && STATES[stateCode[1]] ? STATES[stateCode[1]] : stateName ?? null,
      intendedMajor: major ? major[1].trim().replace(/[,\s]+$/, "").slice(0, 200) : null,
    },
    activities: activities.slice(0, 30),
    awards: awards.slice(0, 30),
    courses: courses.slice(0, 60),
  };
}
