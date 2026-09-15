import { z } from "zod";

export const provenanceSchema = z.enum([
  "MANUAL",
  "RESUME_EXTRACTED",
  "IMPORT",
  "AI_INFERRED",
]);
export type Provenance = z.infer<typeof provenanceSchema>;

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const optionalString = (maxLength: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(maxLength).optional());

const nullableString = (maxLength: number) =>
  z.string().trim().max(maxLength).nullable().default(null);

const nullableNumber = (min: number, max: number) =>
  z.number().min(min).max(max).nullable().default(null);

const stringArray = (maxItemLength: number, maxItems: number) =>
  z.preprocess((value) => {
    if (value === "" || value === null) return undefined;
    if (typeof value === "string") {
      return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
    }
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return value;
  }, z.array(z.string().trim().min(1).max(maxItemLength)).max(maxItems).optional());

export const profileActivitySchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: optionalString(120),
  hoursPerWeek: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(168).optional()),
  yearsInvolved: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(12).optional()),
  impact: optionalString(500),
  provenance: z.preprocess(emptyToUndefined, provenanceSchema.optional()),
});

export const profileAwardSchema = z.union([
  z.string().trim().min(1).max(200),
  z.object({
    name: z.string().trim().min(1).max(200),
    level: optionalString(80),
    year: z.preprocess(emptyToUndefined, z.coerce.number().min(1990).max(2040).optional()),
    provenance: z.preprocess(emptyToUndefined, provenanceSchema.optional()),
  }),
]);

const activitiesSchema = z.preprocess((value) => {
  if (value === "" || value === null) return undefined;
  if (!Array.isArray(value)) return value;
  return value.filter((item) =>
    Boolean(item && typeof item === "object" && String((item as Record<string, unknown>).name ?? "").trim()),
  );
}, z.array(profileActivitySchema).max(30).optional());

const awardsSchema = z.preprocess((value) => {
  if (value === "" || value === null) return undefined;
  if (!Array.isArray(value)) return value;
  return value.filter((item) =>
    typeof item === "string"
      ? item.trim().length > 0
      : Boolean(item && typeof item === "object" && String((item as Record<string, unknown>).name ?? "").trim()),
  );
}, z.array(profileAwardSchema).max(30).optional());

export const profileWriteSchema = z.object({
  grade: z.preprocess(emptyToUndefined, z.coerce.number().min(7).max(12).optional()),
  gpa: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(4.5).optional()),
  weightedGpa: z.preprocess(emptyToUndefined, z.coerce.number().min(0).max(5.5).optional()),
  satScore: z.preprocess(emptyToUndefined, z.coerce.number().min(400).max(1600).optional()),
  actScore: z.preprocess(emptyToUndefined, z.coerce.number().min(1).max(36).optional()),
  intendedMajor: optionalString(500),
  state: optionalString(60),
  targetColleges: stringArray(160, 40),
  admissionsConcern: optionalString(2000),
  activities: activitiesSchema,
  awards: awardsSchema,
  courses: stringArray(120, 60),
  householdIncome: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(10_000_000).optional()),
  siblingsInCollege: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).max(20).optional()),
  mergeStrategy: z.enum(["REPLACE", "RESUME_REPLACE_AUTO"]).default("REPLACE"),
});

export type ProfileWriteInput = z.infer<typeof profileWriteSchema>;
export type ProfileActivity = z.infer<typeof profileActivitySchema>;
export type ProfileAward = z.infer<typeof profileAwardSchema>;

export const resumeParseRequestSchema = z.object({
  text: z.string().trim().min(50).max(30_000),
});

const resumeFactSchema = z.object({
  title: z.string().trim().max(200),
  organization: z.string().trim().max(200).nullable().default(null),
  startDate: z.string().trim().max(40).nullable().default(null),
  endDate: z.string().trim().max(40).nullable().default(null),
  details: z.string().trim().max(1000).nullable().default(null),
  provenance: provenanceSchema.default("RESUME_EXTRACTED"),
});

const legacyResearchSchema = z.object({
  title: z.string().trim().max(200),
  field: z.string().trim().max(120).nullable().optional().default(null),
  outcome: z.string().trim().max(120).nullable().optional().default(null),
  venue: z.string().trim().max(200).nullable().optional().default(null),
});

const extractionNotesSchema = z.preprocess(
  (value) => Array.isArray(value)
    ? value.filter((note): note is string => typeof note === "string").join("\n")
    : value,
  nullableString(2000),
);

const extractionAuditSchema = z.object({
  field: z.string().trim().max(200),
  extractedValue: z.string().trim().max(500),
  sourceExcerpt: z.string().trim().max(500).nullable().default(null),
  status: z.enum(["confirmed", "inferred", "missing"]),
  confidence: z.enum(["high", "medium", "low"]),
});

export const resumeExtractionSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  personal: z.object({
    name: nullableString(160),
    email: nullableString(254),
    phone: nullableString(40),
    location: nullableString(160),
  }).default({}),
  education: z.array(resumeFactSchema).max(10).default([]),
  coursework: z.array(resumeFactSchema).max(60).default([]),
  testing: z.array(resumeFactSchema).max(20).default([]),
  employment: z.array(resumeFactSchema).max(30).default([]),
  projects: z.array(resumeFactSchema).max(30).default([]),
  volunteering: z.array(resumeFactSchema).max(30).default([]),
  skills: z.array(z.string().trim().max(120)).max(100).default([]),
  publicationsResearch: z.array(resumeFactSchema).max(30).default([]),
  research: z.array(legacyResearchSchema).max(30).default([]),
  certifications: z.array(resumeFactSchema).max(30).default([]),
  additionalContext: z.array(z.string().trim().max(500)).max(30).default([]),
  academic: z.object({
    gpa: nullableNumber(0, 4.5),
    weightedGpa: nullableNumber(0, 5.5),
    satScore: nullableNumber(400, 1600),
    satMath: nullableNumber(200, 800).optional().default(null),
    satEbrw: nullableNumber(200, 800).optional().default(null),
    actScore: nullableNumber(1, 36),
    grade: nullableNumber(7, 12),
    school: nullableString(200).optional().default(null),
    state: nullableString(60),
    intendedMajor: nullableString(200),
  }),
  activities: z.array(z.object({
    name: z.string().trim().min(1).max(200),
    role: nullableString(120),
    hoursPerWeek: nullableNumber(0, 168).optional().default(null),
    yearsInvolved: nullableNumber(0, 12).optional().default(null),
    category: z.string().trim().max(80).optional().default("Other"),
    leadershipRole: z.boolean().optional().default(false),
    impact: nullableString(1000).optional().default(null),
    provenance: provenanceSchema.default("RESUME_EXTRACTED"),
  })).max(30).default([]),
  awards: z.array(z.object({
    name: z.string().trim().min(1).max(200),
    level: z.string().trim().max(80).default("Other"),
    year: nullableNumber(1990, 2040).optional().default(null),
    provenance: provenanceSchema.default("RESUME_EXTRACTED"),
  })).max(30).default([]),
  courses: z.array(z.object({
    name: z.string().trim().min(1).max(160),
    type: z.string().trim().max(80).default("Other"),
    score: nullableString(40).optional().default(null),
  })).max(60).default([]),
  summerPrograms: z.array(z.object({
    name: z.string().trim().min(1).max(200),
    year: nullableNumber(1990, 2040).optional().default(null),
    type: z.string().trim().max(80).default("Other"),
  })).max(30).default([]),
  extractionNotes: extractionNotesSchema,
  extractionAudit: z.array(extractionAuditSchema).max(200).default([]),
  uncertainFields: z.array(z.string().trim().max(200)).max(100).default([]),
  missingCriticalFields: z.array(z.string().trim().max(200)).max(30).default([]),
}).passthrough().transform((data) => ({
  ...data,
  publicationsResearch: data.publicationsResearch.length > 0
    ? data.publicationsResearch
    : data.research.map((item) => ({
        title: item.title,
        organization: item.venue,
        startDate: null,
        endDate: null,
        details: [item.field, item.outcome].filter(Boolean).join("; ") || null,
        provenance: "RESUME_EXTRACTED" as const,
      })),
}));

export type ResumeExtraction = z.infer<typeof resumeExtractionSchema>;

function sourceExcerpt(text: string, value: string): string | null {
  const normalizedValue = value.trim();
  if (!normalizedValue) return null;
  const index = text.toLowerCase().indexOf(normalizedValue.toLowerCase());
  if (index < 0) return null;
  return text.slice(Math.max(0, index - 60), Math.min(text.length, index + normalizedValue.length + 60)).replace(/\s+/g, " ").trim();
}

/** Attach provenance and uncertainty without inventing new resume facts. */
export function auditResumeExtraction(extraction: ResumeExtraction, text: string): ResumeExtraction {
  const audit: Array<z.infer<typeof extractionAuditSchema>> = [];
  const add = (field: string, value: unknown, classification = false) => {
    if (value === null || value === undefined || value === "") return;
    const extractedValue = String(value);
    const excerpt = sourceExcerpt(text, extractedValue);
    audit.push({
      field,
      extractedValue: extractedValue.slice(0, 500),
      sourceExcerpt: excerpt,
      status: classification || !excerpt ? "inferred" : "confirmed",
      confidence: excerpt && !classification ? "high" : classification && excerpt ? "medium" : "low",
    });
  };

  for (const [key, value] of Object.entries(extraction.academic)) add(`academic.${key}`, value);
  extraction.activities.forEach((activity, index) => {
    add(`activities.${index}.name`, activity.name);
    add(`activities.${index}.role`, activity.role);
    add(`activities.${index}.hoursPerWeek`, activity.hoursPerWeek);
    add(`activities.${index}.yearsInvolved`, activity.yearsInvolved);
    add(`activities.${index}.impact`, activity.impact);
    add(`activities.${index}.category`, activity.category, true);
    if (activity.leadershipRole) add(`activities.${index}.leadershipRole`, "true", true);
  });
  extraction.awards.forEach((award, index) => {
    add(`awards.${index}.name`, award.name);
    add(`awards.${index}.level`, award.level, true);
    add(`awards.${index}.year`, award.year);
  });
  extraction.courses.forEach((course, index) => {
    add(`courses.${index}.name`, course.name);
    add(`courses.${index}.type`, course.type, true);
    add(`courses.${index}.score`, course.score);
  });

  const missingCriticalFields = [
    extraction.academic.gpa === null ? "GPA" : null,
    extraction.academic.grade === null ? "grade" : null,
    extraction.courses.length === 0 ? "course list, including AP/IB/honors/dual enrollment" : null,
    extraction.activities.length === 0 ? "activities and commitments" : null,
    extraction.academic.intendedMajor === null ? "intended major or academic interests" : null,
  ].filter((value): value is string => Boolean(value));
  const uncertainFields = audit.filter((item) => item.status === "inferred").map((item) => item.field);

  return resumeExtractionSchema.parse({
    ...extraction,
    extractionAudit: audit,
    uncertainFields,
    missingCriticalFields,
  });
}

function uniqueText(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Conservative local extraction used when the external resume parser is slow. */
export function buildLocalResumeFallback(text: string): ResumeExtraction {
  const gpaMatch = text.match(/\bgpa\s*[:=-]?\s*([0-5](?:\.\d{1,2})?)/i);
  const gradeMatch = text.match(/\bgrade(?:\s+level)?\s*[:=-]?\s*(7|8|9|10|11|12)\b/i);
  const satMatch = text.match(/\bsat(?:\s+score)?\s*[:=-]?\s*(\d{3,4})\b/i);
  const actMatch = text.match(/\bact(?:\s+score)?\s*[:=-]?\s*(\d{1,2})\b/i);
  const clauses = uniqueText(
    text.split(/[.;\n]+/).map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean),
  );

  const courseNames = uniqueText(Array.from(
    text.matchAll(/\b(AP|IB|Honors|Dual Enrollment)\s+([^,.;\n]{2,60}?)(?=\s+and\s+(?:AP|IB|Honors|Dual Enrollment)\s+|[,.;\n]|$)/gi),
    (match) => `${match[1]} ${match[2]}`.replace(/\s+/g, " ").trim(),
  ));

  const leadershipActivities = clauses.flatMap((clause) => {
    const match = clause.match(/\b(president|captain|founder|co-founder|vice president|editor|director|chair|lead)\s+(?:of\s+)?(.{2,100})/i);
    if (!match) return [];
    const name = match[2].replace(/\bfor\s+(?:the\s+)?(?:past\s+)?\w+\s+years?\b.*$/i, "").trim();
    const yearsMatch = clause.match(/\b(\d+(?:\.\d+)?)\s+years?\b/i);
    return [{
      name,
      role: match[1],
      yearsInvolved: yearsMatch ? Number(yearsMatch[1]) : null,
      impact: clause,
      provenance: "RESUME_EXTRACTED" as const,
    }];
  });
  const leadershipNames = new Set(leadershipActivities.map((activity) => activity.name.toLowerCase()));
  const otherActivities = clauses
    .filter((clause) => /\b(volunteer|tutor|research|intern|project|club|team|work|job|caregiv)/i.test(clause))
    .filter((clause) => !courseNames.some((course) => clause.toLowerCase() === course.toLowerCase()))
    .filter((clause) => !Array.from(leadershipNames).some((name) => clause.toLowerCase().includes(name)))
    .slice(0, 20)
    .map((clause) => ({
      name: clause.slice(0, 200),
      role: null,
      impact: clause,
      provenance: "RESUME_EXTRACTED" as const,
    }));

  const awardClauses = clauses.filter((clause) =>
    /\b(award|finalist|semifinalist|winner|honou?r|scholar|medal)\b/i.test(clause),
  );

  return resumeExtractionSchema.parse({
    academic: {
      gpa: gpaMatch ? Number(gpaMatch[1]) : null,
      weightedGpa: null,
      satScore: satMatch ? Number(satMatch[1]) : null,
      actScore: actMatch ? Number(actMatch[1]) : null,
      grade: gradeMatch ? Number(gradeMatch[1]) : null,
      state: null,
      intendedMajor: null,
    },
    activities: [...leadershipActivities, ...otherActivities],
    awards: awardClauses.map((name) => ({
      name: name.slice(0, 200),
      level: /\bnational|international\b/i.test(name)
        ? "National"
        : /\bstate\b/i.test(name)
          ? "State"
          : /\bregional\b/i.test(name)
            ? "Regional"
            : "Other",
      provenance: "RESUME_EXTRACTED",
    })),
    courses: courseNames.map((name) => ({
      name,
      type: name.match(/^(AP|IB|Honors|Dual Enrollment)/i)?.[1] ?? "Other",
    })),
    extractionNotes: "The AI parser was unavailable, so these fields were extracted locally. Review every field before saving; unstructured details may remain in the original text.",
    _fallback: { used: true, reason: "provider_unavailable" },
  });
}

export type ProfileSaveResponse = {
  persisted: true;
  requestId: string;
  profile: Record<string, unknown>;
};

export function profileCompletionPct(profile: Record<string, unknown>): number {
  const fields = ["gpa", "grade", "state", "activities", "awards", "courses", "intendedMajor", "targetColleges"];
  let filled = fields.filter((key) => {
    const value = profile[key];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return typeof value === "number";
  }).length;
  if (typeof profile.satScore === "number" || typeof profile.actScore === "number") filled += 1;
  return Math.min(100, Math.round((filled / (fields.length + 1)) * 100));
}
