/**
 * Web search integration for the AI counselor.
 *
 * When the counselor encounters a school NOT in our 102-school database,
 * or needs current-year data that may have changed, it can call this
 * module to search the web for real-time information.
 *
 * Uses SerpAPI (Google Search API) or falls back to a structured prompt
 * that tells the counselor to recommend specific URLs to the student.
 *
 * Requires: SERP_API_KEY env var for live search.
 * Without it: returns a structured "how to research this school" guide.
 */

export interface WebSearchResult {
  query: string;
  results: Array<{
    title: string;
    snippet: string;
    url: string;
  }>;
  source: "live" | "fallback";
}

const SERP_API_KEY = process.env.SERP_API_KEY;

/**
 * Search the web for school-specific information.
 * Falls back to a research guide if no API key is configured.
 */
/**
 * Run a single SerpAPI search. Returns parsed results or empty array on failure.
 */
async function serpSearch(query: string, num = 5): Promise<Array<{ title: string; snippet: string; url: string }>> {
  if (!SERP_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      api_key: SERP_API_KEY,
      engine: "google",
      num: String(num),
    });
    const res = await fetch(`https://serpapi.com/search?${params}`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.organic_results || []).slice(0, num).map((r: { title: string; snippet: string; link: string }) => ({
      title: r.title || "",
      snippet: r.snippet || "",
      url: r.link || "",
    }));
  } catch {
    return [];
  }
}

/**
 * Comprehensive school research — runs multiple targeted searches in parallel
 * to pull admissions data, student reviews, social media, and blog posts.
 */
export async function searchSchoolInfo(schoolName: string): Promise<WebSearchResult> {
  if (!SERP_API_KEY) {
    return buildResearchFallback(schoolName);
  }

  const queries = [
    `${schoolName} acceptance rate class of 2029 2030 admissions statistics`,
    `${schoolName} admissions what we look for application requirements 2026`,
    `site:reddit.com ${schoolName} accepted admitted profile 2025 2026`,
    `${schoolName} student reviews campus life experience niche`,
    `${schoolName} financial aid net price cost of attendance 2025`,
  ];

  const searchResults = await Promise.all(queries.map(q => serpSearch(q, 3)));
  const allResults = searchResults.flat();

  if (allResults.length === 0) {
    return buildResearchFallback(schoolName);
  }

  return {
    query: `${schoolName} comprehensive admissions research`,
    results: allResults.slice(0, 12),
    source: "live",
  };
}

/**
 * Build a structured research guide when live search isn't available.
 * This gives the counselor specific URLs and search queries to recommend.
 */
function buildResearchFallback(schoolName: string): WebSearchResult {
  const slug = schoolName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return {
    query: `${schoolName} admissions data`,
    source: "fallback",
    results: [
      {
        title: `${schoolName} Common Data Set`,
        snippet: `Search "${schoolName} common data set 2024-2025 filetype:pdf" to find the official CDS report with acceptance rates, test score ranges, and admissions factor weights.`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${schoolName} common data set 2024-2025 filetype:pdf`)}`,
      },
      {
        title: `${schoolName} Admissions Page`,
        snippet: `The official admissions page lists deadlines, requirements, test policies, and "what we look for" criteria. Search "${schoolName} admissions requirements" or check their website directly.`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${schoolName} admissions requirements 2026`)}`,
      },
      {
        title: `${schoolName} on College Scorecard`,
        snippet: `The US Department of Education's College Scorecard shows net price by income, graduation rates, and post-graduation earnings. This is official federal data.`,
        url: `https://collegescorecard.ed.gov/search/?name=${encodeURIComponent(schoolName)}`,
      },
      {
        title: `${schoolName} Net Price Calculator`,
        snippet: `Every school is required to have a net price calculator on their website. Search "${schoolName} net price calculator" to estimate your actual cost after financial aid.`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${schoolName} net price calculator`)}`,
      },
      {
        title: `r/ApplyingToCollege: ${schoolName}`,
        snippet: `Reddit's r/ApplyingToCollege and r/collegeresults have student-reported outcomes. Search "site:reddit.com ${schoolName} accepted" for real student experiences.`,
        url: `https://www.reddit.com/r/ApplyingToCollege/search/?q=${encodeURIComponent(schoolName)}&restrict_sr=1&sort=new`,
      },
    ],
  };
}

/**
 * Format search results as a context block for the AI counselor.
 */
export function formatSearchContext(result: WebSearchResult): string {
  if (result.results.length === 0) return "";

  const lines = [
    `\nWEB RESEARCH FOR: ${result.query}`,
    result.source === "live"
      ? "(Live search results — use these as current data)"
      : "(Recommended research links — suggest these to the student)",
    "",
  ];

  for (const r of result.results) {
    lines.push(`• ${r.title}`);
    lines.push(`  ${r.snippet}`);
    lines.push(`  URL: ${r.url}`);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Build a comprehensive "how to research any school" guide
 * that the counselor can share with students.
 */
export function buildSchoolResearchGuide(schoolName: string): string {
  return `
HOW TO RESEARCH ${schoolName.toUpperCase()}:

1. COMMON DATA SET (most important document)
   Search: "${schoolName} common data set 2024-2025 filetype:pdf"
   This PDF contains: acceptance rate, SAT/ACT ranges, GPA distribution,
   what factors the school considers "Very Important" vs "Not Considered"
   in admissions (Section C7 — this is the most valuable page).

2. OFFICIAL ADMISSIONS PAGE
   Go to ${schoolName.toLowerCase().replace(/\s+/g, "")}.edu/admissions
   Look for: deadlines, test policy (required/optional/blind),
   ED/EA/RD options, interview availability, "what we look for" page.

3. NET PRICE CALCULATOR
   Every US college must have one. Google "${schoolName} net price calculator"
   Enter your family income to get an estimate of actual cost after aid.

4. COLLEGE SCORECARD (federal data)
   https://collegescorecard.ed.gov — search for ${schoolName}
   Shows: graduation rates, post-graduation earnings, loan repayment rates.

5. STUDENT EXPERIENCES
   Reddit: r/ApplyingToCollege, r/collegeresults, r/${schoolName.toLowerCase().replace(/\s+/g, "")}
   Search: "site:reddit.com ${schoolName} accepted 2025"
   Look for: admitted student profiles, what they submitted, what they think worked.

6. SCHOOL SOCIAL MEDIA
   Follow their admissions office on Instagram/TikTok/YouTube.
   Many schools post "day in the life" videos and admissions tips.
   Search: "${schoolName} admissions" on YouTube for virtual tours and info sessions.

7. NICHE.COM
   https://www.niche.com — student reviews, grades for academics/campus life/value.
   Take individual reviews with a grain of salt, but aggregate trends are useful.
`.trim();
}
