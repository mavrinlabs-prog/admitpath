import { NextResponse } from "next/server";
import {
  SUPPLEMENTAL_ESSAYS,
  getSupplementsForSchool,
} from "@/data/supplemental-essays";

/**
 * Public-readable supplemental-essay reference.
 *
 * GET /api/essay/supplemental           → list of all schools (slug + name)
 * GET /api/essay/supplemental?slug=mit  → full prompts + guidance for one school
 *
 * No auth — this is reference data. Cached at the edge for 24h since the
 * list is static within an application cycle.
 */

const CACHE = "public, max-age=86400, stale-while-revalidate=604800";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    const summary = SUPPLEMENTAL_ESSAYS.map((s) => ({
      slug: s.slug,
      name: s.name,
      cycle: s.cycle,
      promptCount: s.prompts.length,
    }));
    return NextResponse.json(
      {
        schools: summary,
        total: summary.length,
        _meta: { dataSource: "AdmitPath supplemental essays database" },
      },
      { headers: { "Cache-Control": CACHE } },
    );
  }

  // Sanitize slug to prevent traversal
  const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (cleanSlug !== slug.trim().toLowerCase()) {
    return NextResponse.json(
      { error: "Invalid school slug. Use lowercase letters, numbers, and hyphens only." },
      { status: 400 },
    );
  }

  const school = getSupplementsForSchool(cleanSlug);
  if (!school) {
    return NextResponse.json(
      { error: `No supplemental essay data found for "${cleanSlug}". Check available schools at /api/essay/supplemental.` },
      { status: 404 },
    );
  }
  return NextResponse.json(
    {
      ...school,
      _meta: { dataSource: "AdmitPath supplemental essays database" },
    },
    { headers: { "Cache-Control": CACHE } },
  );
}
