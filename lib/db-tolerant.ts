/**
 * Helpers for tolerating missing tables/columns on a freshly-deployed DB
 * where Prisma migrations haven't yet caught up to the codebase.
 *
 * Cross-pollinated from WorksheetGen. Applies ONIX State Manager pattern
 * (Agent 11): graceful degradation when system state is inconsistent.
 *
 * Prisma surfaces schema-drift as:
 *   - P2022 "column ... does not exist" (column missing)
 *   - P2021 "table ... does not exist" (relation missing)
 *
 * Multiple call sites had identical inline checks; consolidating here keeps
 * tolerance behavior uniform and avoids subtle drift.
 */

export function isMissingColumnError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: string }).code;
  return (
    code === "P2022" ||
    code === "P2021" ||
    msg.includes("does not exist") ||
    msg.includes("P2022") ||
    msg.includes("P2021")
  );
}

/**
 * Run an async DB operation; if it fails because a column/table is missing
 * (pending migration), return `fallback` instead of throwing. Any other
 * error is re-thrown so genuine bugs aren't masked.
 */
export async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (isMissingColumnError(err)) return fallback;
    throw err;
  }
}
