/**
 * Thin SEMrush API client.
 *
 * Auth: SEMRUSH_API_KEY (Vercel env, prod only). Never inline the key.
 * Docs: https://developer.semrush.com/api/v3/
 *
 * Costs (each call burns API units):
 *   - domain_ranks:   ~10 units
 *   - domain_organic: ~10 units per row returned
 *   - phrase_this:    ~10 units
 *   - phrase_related: ~40 units per row
 * Always pass a tight `display_limit`. Cache aggressively (KV/Redis or
 * Next.js `revalidate`) — SEMrush data updates monthly, no need for fresh.
 */

const BASE = "https://api.semrush.com/";

function key(): string {
  const k = process.env.SEMRUSH_API_KEY;
  if (!k) throw new Error("SEMRUSH_API_KEY not set");
  return k;
}

async function call(params: Record<string, string>): Promise<string[][]> {
  const qs = new URLSearchParams({ ...params, key: key() });
  // Next.js extends fetch with `next: { revalidate }` — typed via next-env.d.ts in build.
  const res = await fetch(`${BASE}?${qs.toString()}`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  } as RequestInit);
  const text = await res.text();
  if (text.startsWith("ERROR")) {
    if (text.includes("NOTHING FOUND")) return [];
    throw new Error(`SEMrush: ${text.trim()}`);
  }
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  return lines.slice(1).map((line) => line.split(";"));
}

export type DomainRank = {
  database: string;
  domain: string;
  rank: number;
  organicKeywords: number;
  organicTraffic: number;
  organicCost: number;
  adwordsKeywords: number;
  adwordsTraffic: number;
  adwordsCost: number;
};

export async function domainRanks(domain: string, database = "us"): Promise<DomainRank | null> {
  const rows = await call({
    type: "domain_ranks",
    domain,
    database,
    export_columns: "Db,Dn,Rk,Or,Ot,Oc,Ad,At,Ac",
  });
  const r = rows[0];
  if (!r) return null;
  return {
    database: r[0],
    domain: r[1],
    rank: Number(r[2]),
    organicKeywords: Number(r[3]),
    organicTraffic: Number(r[4]),
    organicCost: Number(r[5]),
    adwordsKeywords: Number(r[6]),
    adwordsTraffic: Number(r[7]),
    adwordsCost: Number(r[8]),
  };
}

export type OrganicKeyword = {
  keyword: string;
  position: number;
  searchVolume: number;
  cpc: number;
  competition: number;
  trafficPercent: number;
  url: string;
};

export async function topOrganicKeywords(
  domain: string,
  limit = 50,
  database = "us",
): Promise<OrganicKeyword[]> {
  const rows = await call({
    type: "domain_organic",
    domain,
    database,
    display_limit: String(limit),
    export_columns: "Ph,Po,Nq,Cp,Co,Tr,Ur",
  });
  return rows.map((r) => ({
    keyword: r[0],
    position: Number(r[1]),
    searchVolume: Number(r[2]),
    cpc: Number(r[3]),
    competition: Number(r[4]),
    trafficPercent: Number(r[5]),
    url: r[6],
  }));
}

export type KeywordOverview = {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  numberOfResults: number;
};

export async function keywordOverview(phrase: string, database = "us"): Promise<KeywordOverview | null> {
  const rows = await call({
    type: "phrase_this",
    phrase,
    database,
    export_columns: "Ph,Nq,Cp,Co,Nr",
  });
  const r = rows[0];
  if (!r) return null;
  return {
    keyword: r[0],
    searchVolume: Number(r[1]),
    cpc: Number(r[2]),
    competition: Number(r[3]),
    numberOfResults: Number(r[4]),
  };
}

export async function relatedKeywords(
  phrase: string,
  limit = 20,
  database = "us",
): Promise<KeywordOverview[]> {
  const rows = await call({
    type: "phrase_related",
    phrase,
    database,
    display_limit: String(limit),
    export_columns: "Ph,Nq,Cp,Co,Nr",
  });
  return rows.map((r) => ({
    keyword: r[0],
    searchVolume: Number(r[1]),
    cpc: Number(r[2]),
    competition: Number(r[3]),
    numberOfResults: r[4] ? Number(r[4]) : 0,
  }));
}

export async function remainingApiUnits(): Promise<number> {
  const res = await fetch(`https://www.semrush.com/users/countapiunits.html?key=${key()}`);
  const text = await res.text();
  const n = Number(text.trim());
  if (!Number.isFinite(n)) throw new Error(`SEMrush units: unexpected response: ${text}`);
  return n;
}
