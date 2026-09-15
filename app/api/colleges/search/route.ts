/**
 * Typed college search API.
 *
 * GET /api/colleges/search?q=harvard&state=MA&maxAcceptRate=10&testPolicy=test-optional
 *
 * Read-only, edge-safe (no DB), public, indexable. Returns the
 * matching subset of `data/colleges.ts` with the same shape consumers
 * already expect from `COLLEGES`. Filtering is composable — every
 * filter is optional and AND-combined.
 *
 * Honest defaults:
 *   - limit defaults to 20 (max 100) to keep payloads small
 *   - results sorted by acceptance rate ascending (most selective first)
 *   - 4xx for malformed query, 200 + empty array for "no matches"
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { COLLEGES, findCollegeByName, type College } from "@/data/colleges";

export const runtime = "nodejs";
export const revalidate = 3600;

const QuerySchema = z.object({
  q: z.string().trim().min(1).max(80).optional(),
  state: z.string().trim().length(2).toUpperCase().optional(),
  type: z.enum(["private", "public"]).optional(),
  minSat: z.coerce.number().int().min(400).max(1600).optional(),
  maxSat: z.coerce.number().int().min(400).max(1600).optional(),
  maxAcceptRate: z.coerce.number().min(0).max(100).optional(),
  minGpa: z.coerce.number().min(0).max(5).optional(),
  testPolicy: z.enum(["required", "test-optional", "test-blind"]).optional(),
  needBlind: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  meetsFullNeed: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  earlyOption: z.enum(["ED", "EA", "REA", "ED+EA", "none"]).optional(),
  ivy: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(["acceptanceRate", "sat75", "name", "enrollment"]).default("acceptanceRate"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

type Query = z.infer<typeof QuerySchema>;

function applyFilters(colleges: readonly College[], q: Query): College[] {
  let pool = [...colleges];

  if (q.q) {
    // Substring match against name + shortName + city. Also let
    // findCollegeByName provide an exact-match shortcut.
    const exact = findCollegeByName(q.q);
    if (exact) pool = [exact, ...pool.filter((c) => c.slug !== exact.slug)];
    const lower = q.q.toLowerCase();
    pool = pool.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.shortName.toLowerCase().includes(lower) ||
        c.city.toLowerCase().includes(lower) ||
        c.slug.includes(lower)
    );
  }
  if (q.state) pool = pool.filter((c) => c.state === q.state);
  if (q.type) pool = pool.filter((c) => c.type === q.type);
  if (q.minSat !== undefined) pool = pool.filter((c) => c.sat75 >= q.minSat!);
  if (q.maxSat !== undefined) pool = pool.filter((c) => c.sat25 <= q.maxSat!);
  if (q.maxAcceptRate !== undefined) pool = pool.filter((c) => c.acceptanceRate <= q.maxAcceptRate!);
  if (q.minGpa !== undefined) pool = pool.filter((c) => c.gpaAvg >= q.minGpa!);
  if (q.testPolicy) pool = pool.filter((c) => c.testPolicy === q.testPolicy);
  if (q.needBlind !== undefined) pool = pool.filter((c) => c.needBlind === q.needBlind);
  if (q.meetsFullNeed !== undefined) pool = pool.filter((c) => c.meetsFullNeed === q.meetsFullNeed);
  if (q.earlyOption) pool = pool.filter((c) => c.earlyOption === q.earlyOption);
  if (q.ivy !== undefined) pool = pool.filter((c) => Boolean(c.ivy) === q.ivy);

  return pool;
}

function sortResults(pool: College[], q: Query): College[] {
  const dir = q.order === "asc" ? 1 : -1;
  return pool.sort((a, b) => {
    let av: number | string;
    let bv: number | string;
    switch (q.sort) {
      case "name": av = a.name; bv = b.name; break;
      case "sat75": av = a.sat75; bv = b.sat75; break;
      case "enrollment": av = a.enrollment; bv = b.enrollment; break;
      case "acceptanceRate":
      default: av = a.acceptanceRate; bv = b.acceptanceRate; break;
    }
    if (typeof av === "string") return dir * av.localeCompare(bv as string);
    return dir * ((av as number) - (bv as number));
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw: Record<string, string> = {};
  for (const [k, v] of Array.from(searchParams.entries())) raw[k] = v;

  const parsed = QuerySchema.safeParse(raw);
  if (!parsed.success) {
    // Map zod issues to user-friendly messages
    const fieldErrors = parsed.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return NextResponse.json(
      { error: "Invalid query parameters", details: fieldErrors },
      { status: 400 }
    );
  }
  const query = parsed.data;

  const filtered = applyFilters(COLLEGES, query);
  const sorted = sortResults(filtered, query);
  const sliced = sorted.slice(query.offset, query.offset + query.limit);

  return NextResponse.json(
    {
      results: sliced,
      total: filtered.length,
      query,
      pagination: {
        offset: query.offset,
        limit: query.limit,
        hasMore: query.offset + query.limit < filtered.length,
      },
      _meta: {
        dataSource: "AdmitPath college database",
        totalInDatabase: COLLEGES.length,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
