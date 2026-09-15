import type { ProfileActivity, ProfileAward, Provenance } from "@/lib/profile-contract";

type Activity = {
  name: string;
  role?: string;
  hoursPerWeek?: number;
  yearsInvolved?: number;
  impact?: string;
  provenance?: Provenance;
};

function identity(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  return values.flatMap((value) => {
    const clean = value.trim().replace(/\s+/g, " ");
    const key = identity(clean);
    if (!key || seen.has(key)) return [];
    seen.add(key);
    return [clean];
  });
}

export function uniqueActivities(values: Activity[]): Activity[] {
  const seen = new Set<string>();
  return values.flatMap((activity) => {
    const clean = {
      ...activity,
      name: activity.name.trim().replace(/\s+/g, " "),
      role: activity.role?.trim().replace(/\s+/g, " ") || undefined,
      impact: activity.impact?.trim().replace(/\s+/g, " ") || undefined,
    };
    const key = `${identity(clean.name)}|${identity(clean.role ?? "")}|${clean.yearsInvolved ?? ""}`;
    if (!clean.name || seen.has(key)) return [];
    seen.add(key);
    return [clean];
  });
}

function isManualProvenance(value: { provenance?: Provenance }): boolean {
  return !value.provenance || value.provenance === "MANUAL";
}

export function mergeResumeActivities(
  existing: ProfileActivity[],
  incoming: ProfileActivity[],
): ProfileActivity[] {
  const incomingManual = incoming.filter(isManualProvenance);
  const existingManual = existing.filter(isManualProvenance);
  const incomingExtracted = incoming
    .filter((activity) => !isManualProvenance(activity))
    .map((activity) => ({ ...activity, provenance: activity.provenance ?? "RESUME_EXTRACTED" as const }));
  return uniqueActivities([
    ...incomingManual,
    ...existingManual,
    ...incomingExtracted,
  ]);
}

function awardIdentity(award: ProfileAward): string {
  if (typeof award === "string") return identity(award);
  return `${identity(award.name)}|${identity(award.level ?? "")}|${award.year ?? ""}`;
}

function isManualAward(award: ProfileAward): boolean {
  return typeof award === "string" || !award.provenance || award.provenance === "MANUAL";
}

export function uniqueAwards(values: ProfileAward[]): ProfileAward[] {
  const seen = new Set<string>();
  return values.flatMap((award) => {
    const normalized: ProfileAward = typeof award === "string"
      ? award.trim().replace(/\s+/g, " ")
      : {
          ...award,
          name: award.name.trim().replace(/\s+/g, " "),
          level: award.level?.trim().replace(/\s+/g, " ") || undefined,
        };
    const key = awardIdentity(normalized);
    if (!key || seen.has(key)) return [];
    seen.add(key);
    return [normalized];
  });
}

export function mergeResumeAwards(existing: ProfileAward[], incoming: ProfileAward[]): ProfileAward[] {
  return uniqueAwards([
    ...incoming.filter(isManualAward),
    ...existing.filter(isManualAward),
    ...incoming.filter((award) => !isManualAward(award)),
  ]);
}
