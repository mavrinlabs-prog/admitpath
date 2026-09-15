export type SummerProgramResource = {
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

export type ScholarshipResource = {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  eligibility: string;
  category: string;
  renewable: boolean;
  url: string;
  description: string;
};

type SummerProgramFilters = {
  query?: string;
  category?: string;
  grade?: string;
};

type ScholarshipFilters = {
  query?: string;
  category?: string;
  renewableOnly?: boolean;
};

function includesQuery(values: string[], query: string | undefined): boolean {
  const normalizedQuery = query?.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;
  return values.some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
}

export function filterSummerPrograms(
  programs: SummerProgramResource[],
  { query, category = "all", grade = "all" }: SummerProgramFilters,
): SummerProgramResource[] {
  return programs.filter((program) => (
    includesQuery(
      [program.name, program.host, program.location, program.category, program.description],
      query,
    ) &&
    (category === "all" || program.category === category) &&
    (grade === "all" || program.grades.includes(grade))
  ));
}

export function filterScholarships(
  scholarships: ScholarshipResource[],
  { query, category = "all", renewableOnly = false }: ScholarshipFilters,
): ScholarshipResource[] {
  return scholarships.filter((scholarship) => (
    includesQuery(
      [
        scholarship.name,
        scholarship.amount,
        scholarship.eligibility,
        scholarship.category,
        scholarship.description,
      ],
      query,
    ) &&
    (category === "all" || scholarship.category === category) &&
    (!renewableOnly || scholarship.renewable)
  ));
}

export function formatResourceCategory(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
