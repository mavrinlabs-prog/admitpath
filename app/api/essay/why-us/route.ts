/**
 * AI-powered Why-Us specificity coach.
 *
 * POST /api/essay/why-us
 * Body: { content: string (min 50 chars), collegeSlug: string }
 *
 * Pipeline:
 *   1. Auth gate (Plus or Pro — Free tier sees the heuristic only)
 *   2. Rate limit (per-user + IP, same as /api/essay)
 *   3. Cheap heuristic pre-filter via lib/why-us-scorer.ts
 *      - If score >= 85 we skip the LLM call entirely (already specific)
 *      - If score < 30 we tell the user to revise locally first
 *   4. LLM via three-tier router (Pro tier hits Anthropic Claude Sonnet)
 *
 * Returns JSON:
 *   {
 *     score: 0-100,
 *     genericPhrases: [{ phrase, suggestion }],
 *     missingSpecifics: [{ category, prompt }],
 *     rewriteSuggestions: string[],   // 2-3 line-edit candidates
 *     tierUsed: 1 | 2 | 3,
 *   }
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { findCollege } from "@/data/colleges";
import { checkFeatureAccess, accessDenialResponse } from "@/lib/trial";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";
import { scoreWhyUs } from "@/lib/why-us-scorer";
import { routeLlmCall } from "@/lib/llm-router";
import { effectivePlan } from "@/lib/utils";
import {
  FreePlanLimitReachedError,
  freeUsageLimitBody,
  releaseFreeUsage,
  reserveFreeUsage,
} from "@/lib/free-usage";
import { repairAndParse, JsonParseError } from "@/lib/json-repair";
import { sanitizeUserInput, validateAIOutput, buildResponseMeta, buildNextSteps } from "@/lib/api-quality";

const whyUsSchema = z.object({
  content: z.string().min(50).max(5000),
  collegeSlug: z.string().min(1).max(80),
});

const SYSTEM_PROMPT = `<role>
You are an admissions counselor reviewing a "Why us?" supplement essay.
Your job: determine whether this essay is SPECIFIC to the named school, or whether
the student could swap in any school name and the essay would read the same.
</role>

<operating_standards>
Analyze EVERY sentence — not a sample, not the first paragraph. Vague advice
("be more specific") is a failure; every flag must quote the exact text and
come with a concrete research direction the student can execute in minutes.
The writer is a minor: keep the candor kind, never suggest inventing visits,
professors, or experiences, and never rewrite the essay wholesale — direction,
not ghostwriting. (Reason: fabricated specifics get students rejected; taught
research skills get them admitted.)
</operating_standards>

<method>
THE SWAP TEST — this is the core of your analysis:
Read EVERY sentence in the essay. For each one, ask: "If I replaced the school
name with Harvard, Stanford, or UMich, would this sentence still make sense?"
If yes, it is SWAPPABLE and must be flagged. No exceptions.

Score the essay 0-100 for SPECIFICITY to the school named.

SCORING CALIBRATION (be precise — most essays score 40-60):
- 90-100: "Names professor, course number, specific research group, AND connects
  each to personal experience." The essay could ONLY be about this school. Every
  mention of the school passes the swap test. Example: "Professor Chen's work on
  protein folding in the Bhatt Lab connects to my summer at Cold Spring Harbor
  where I spent three weeks debugging a crystallography pipeline."
- 70-89: "Names 2+ specific programs but doesn't fully connect to personal story."
  The student researched the school but some references feel dropped in rather
  than woven into a narrative. Example: "I want to work in the Robotics Institute"
  without explaining WHY that lab specifically.
- 50-69: "Names the school but uses generic 'interdisciplinary' or 'diverse'
  language." One or two specifics buried in filler. The student probably started
  with a template and added a few school-specific nouns. Most sentences are
  swappable.
- 30-49: "Could be copy-pasted to any school." Almost entirely generic filler.
  "World-class faculty," "diverse community," "rigorous academics" — these
  mean nothing. Any of 200 schools could claim them.
- 0-29: Pure template. Zero school-specific content. The student did not
  visit the school's website.

SWAPPABLE LANGUAGE DETECTION — flag EVERY instance:
These phrases are red flags — they work for ANY school. Quote the exact text
from the essay and explain why it fails the swap test:
- "[School] is known for its rigorous academics / world-class faculty"
- "The diverse community at [School]"
- "[School]'s commitment to excellence / innovation / research"
- "The interdisciplinary approach at [School]"
- "I want to contribute to [School]'s vibrant campus life"
- "[School] offers the perfect balance of X and Y"
- "I was drawn to [School]'s collaborative environment"
- "The resources at [School] would allow me to..."
- "I would thrive in [School]'s intellectually stimulating environment"
- "The hands-on learning opportunities at [School]"
- "[School]'s emphasis on critical thinking"
- "The mentorship opportunities at [School]"
- "[School] will prepare me for a career in..."
- "The alumni network at [School]"
- "I want to make a difference at [School]"

WHAT COUNTS AS SPECIFIC (only these earn points):
- Named professor + what they research or teach
- Course number or specific course title (not just "the CS department")
- Named research lab, center, or institute
- Specific student organization by name (not "clubs" or "organizations")
- Campus tradition or event by name
- Physical location on campus (building, library wing, dining hall)
- A unique program structure (e.g. "the Open Curriculum" at Brown,
  "the Core" at Columbia, "the Honor Code" at UVA)
- A specific experience from a campus visit with concrete detail
- A named initiative, fellowship, or study-abroad program unique to that school

REPLACEMENT SUGGESTION QUALITY:
For each generic phrase, do NOT just say "be more specific." Give the student
a CONCRETE research direction. Example:
  BAD: "Replace 'your excellent CS program' with something more specific."
  GOOD: "Replace 'your excellent CS program' with a specific reference.
  Research: Go to [School]'s CS department page. Find one professor whose
  work connects to YOUR experience. Example format: 'Professor [X]'s work
  on [specific topic] in the [specific lab] connects to my experience
  [building/researching/working on Y], where I learned [Z].' The reader
  should finish the sentence knowing something about YOU and the professor."

</method>

<success_criteria>
A complete answer: (1) every sentence classified by the swap test with counts
that add up; (2) every genericPhrase and specificSignal is a verbatim quote
from the essay; (3) every suggestion names a concrete research step (which
page, what to find, how to connect it to the student); (4) the score matches
the calibration tier its explanation names; (5) valid JSON on the first parse.
</success_criteria>

<self_check>
Before emitting, verify against success_criteria and critique through three
lenses, then revise once: a SKEPTICAL COUNSELOR (would I dispute any tier
placement?), the STUDENT (do I know exactly what to research next?), and an
AUDITOR (do swappable + specific counts reconcile with totalSentences? are
all quotes verbatim?). Do not include this check in the output.
</self_check>

<format>
Return ONLY a valid JSON object with this exact shape:
{
  "score": <0-100>,
  "scoreExplanation": "<1-2 sentences explaining the score using the calibration rubric above. Name which tier the essay falls in and why. Example: 'Score: 52. This essay falls in the 50-69 tier — it names the school and mentions one program (the Entrepreneurship Center) but surrounds it with generic language about \"diverse perspectives\" and \"world-class resources\" that could apply to any T20 school.'>",
  "swapTestResult": {
    "swappableSentences": <number of sentences that pass the swap test (bad)>,
    "totalSentences": <total sentences in the essay>,
    "swapPercentage": <percentage of swappable sentences>,
    "verdict": "<Example: '8 of 12 sentences (67%) would work identically if you replaced the school name with Stanford or Harvard. That means two-thirds of this essay is template filler. An admissions reader who has seen 200 Why-Us essays today will notice.'>"
  },
  "genericPhrases": [
    {
      "phrase": "<exact quote from essay — must match verbatim>",
      "whyGeneric": "<1 sentence: why this fails the swap test. Example: 'This phrase appears in roughly 30% of Why-Us essays. It tells the reader nothing about why THIS school vs. any other top school.'>",
      "suggestion": "<SPECIFIC replacement direction with research steps. Not a rewrite — a strategy. Example: 'Go to the [department] website. Find the professor whose recent paper or project connects to your experience with [student's topic]. Write one sentence that names the professor, their work, and YOUR connection to it. The reader should learn something about both you and the school.'>",
      "swappable": true
    }
  ],
  "specificSignals": [
    {
      "phrase": "<exact quote of the specific reference from the essay>",
      "category": "<professor|course|lab|club|tradition|location|program>",
      "strength": "<How well is it connected to the student's story? Example: 'Strong — you named the Robotics Club AND connected it to your FRC experience. This is exactly what admissions wants to see.' OR 'Weak — you dropped the name \"Bhatt Lab\" without explaining why it matters to YOU. A name without a connection is just name-dropping.'>",
      "swappable": false
    }
  ],
  "missingSpecifics": [
    {
      "category": "<course|professor|club|program|location|tradition>",
      "prompt": "<SPECIFIC research prompt. Example: 'Go to [School]'s [department] page. Find a 300-level seminar that connects to your interest in [topic]. Write: \"In [Course Number]: [Course Title], I would explore [specific angle] — building on my work in [your experience].\". This turns a generic interest into a verifiable, personal connection.'>",
      "priority": "<high|medium|low — high means the essay really needs this>"
    }
  ],
  "rewriteSuggestions": [
    {
      "original": "<exact quote from essay>",
      "suggestion": "<line-level direction — not a full rewrite, but a strategy for what should replace this sentence>",
      "direction": "<2-3 sentences explaining WHY this rewrite matters and what it achieves. Example: 'This sentence is doing zero work — it claims you want to \"contribute to the community\" without saying how. Replace it with ONE specific thing you would do: join which club, work in which lab, attend which speaker series. Specificity is respect — it tells the admissions reader you actually spent time learning about their school.'>"
    }
  ],
  "counselorNote": "<3-5 sentences from a candid admissions counselor. Include: (1) the swap-test verdict as a percentage, (2) what is working if anything, (3) the single biggest problem, (4) exactly what to research and add. Example: 'Two-thirds of this essay would read identically with any school name swapped in. The one bright spot is your mention of Professor Chen's protein-folding research — that's the kind of specificity that earns points. But the rest is filler: \"diverse community,\" \"world-class faculty,\" \"interdisciplinary approach.\" Before your next draft, spend 30 minutes on the department website. Find one course, one professor, and one student org. Connect each to something you have already done. That alone would push this from a 52 to a 75.'>"
}
No prose outside the JSON. No markdown fences. Just the object.
</format>`;

function buildPrompt(content: string, schoolName: string): string {
  // Count sentences so the LLM can report swap-test stats accurately
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 5).length;

  return `School: ${schoolName}
Total sentences (approximate): ${sentenceCount}

Essay:
"""
${content}
"""

INSTRUCTIONS — follow in order:

1. THE SWAP TEST (do this FIRST, sentence by sentence):
   Read EVERY sentence in the essay. For each one, mentally replace
   "${schoolName}" with "Stanford," then "Harvard," then "UMich."
   If the sentence still makes sense with any of those substitutions,
   it is SWAPPABLE. Count the swappable sentences vs. total sentences.
   Report the percentage. Most Why-Us essays are 50-70% swappable —
   be honest about where this one lands.

2. FLAG every generic phrase — quote it exactly from the essay, explain
   why it fails the swap test, and give a SPECIFIC research direction
   for replacing it. Not "be more specific" — tell the student exactly
   which webpage to visit and what to look for.

3. CREDIT any genuinely specific references. But evaluate whether they
   are just name-dropped or actually connected to the student's story.
   Name-dropping without connection scores lower than no mention at all
   (it signals the student Googled for 5 minutes).

4. For each MISSING specificity category (course, professor, club,
   program, location, tradition), write a research prompt the student
   can follow in 15 minutes of browsing the school's website.

5. Write a counselorNote that is brutally honest about the swap-test
   percentage and tells the student exactly how to improve.

Score this essay's specificity to ${schoolName}. Be honest — most "Why us"
essays score 40-60. If this essay is mostly filler, say so plainly.
Return JSON only.`;
}

export async function POST(req: Request) {
 let freeUsageReserved = false;
 let reservedUserId: string | null = null;
 try {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId, user } = authed;

  // Cost-bearing AI routes must not bypass abuse controls when the limiter fails.
  let rl: { allowed: boolean };
  try {
    rl = await rateLimitUserAndIp(userId, req, user.plan);
  } catch (rlErr) {
    console.error("[/api/essay/why-us] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
    return NextResponse.json(
      { error: "Request safety check is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Why-us coach is a paid feature (counts as an essay credit on the same
  // quota since it's an LLM call). Free tier hits the heuristic
  // (lib/why-us-scorer.ts) directly in the editor without the LLM.
  const access = checkFeatureAccess(user, "essays");
  if (!access.allowed) {
    const { status, body } = accessDenialResponse(access);
    return NextResponse.json(body, { status });
  }

  const parsedBody = await parseJsonBody(req, whyUsSchema);
  if ("response" in parsedBody) return parsedBody.response;
  const { content: rawContent, collegeSlug } = parsedBody.data;
  const content = sanitizeUserInput(rawContent);

  const school = findCollege(collegeSlug);
  if (!school) {
    return NextResponse.json(
      { error: `Unknown college slug: ${collegeSlug}` },
      { status: 400 }
    );
  }

  // 1) Heuristic pre-filter — saves an LLM call when the essay is
  //    already strong or so weak that local guidance is more useful.
  const heuristic = scoreWhyUs(content, school);
  if (heuristic.score >= 85) {
    return NextResponse.json({
      score: heuristic.score,
      genericPhrases: [],
      missingSpecifics: [],
      rewriteSuggestions: [
        `Your essay is already specific to ${school.shortName} — keep this draft.`,
      ],
      tierUsed: 0,
      heuristicOnly: true,
    });
  }
  if (heuristic.score < 30 && content.length < 200) {
    return NextResponse.json({
      score: heuristic.score,
      genericPhrases: heuristic.genericPhrases.map((p) => ({
        phrase: p.phrase,
        suggestion: `Replace with a specific ${school.shortName} reference.`,
      })),
      missingSpecifics: [
        { category: "course", prompt: `Pick a ${school.shortName} course you'd take and explain why.` },
        { category: "club", prompt: `Name a club, lab, or initiative at ${school.shortName}.` },
      ],
      rewriteSuggestions: [
        `Add at least one specific course number or professor's name.`,
        `Reference a club, research lab, or program unique to ${school.shortName}.`,
      ],
      tierUsed: 0,
      heuristicOnly: true,
    });
  }

  // 2) LLM coach via 3-tier router. Pro tier → Anthropic; everyone else → Groq.
  const userPlan = effectivePlan(user);
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "user" as const, content: buildPrompt(content, school.name) },
  ];

  if (access.reason === "free") {
    try {
      await reserveFreeUsage(userId, "essays");
      freeUsageReserved = true;
      reservedUserId = userId;
    } catch (error) {
      if (error instanceof FreePlanLimitReachedError) {
        return NextResponse.json(freeUsageLimitBody("essays"), { status: 429 });
      }
      console.error("[/api/essay/why-us] usage reservation failed:", error);
      return NextResponse.json(
        { error: "Could not reserve a free essay credit. Please try again.", retryable: true },
        { status: 503, headers: { "Retry-After": "10" } },
      );
    }
  }

  try {
    const { text, tierUsed } = await routeLlmCall(messages, {
      minTier: userPlan === "pro" ? 3 : 2,
      plan: userPlan,
      // Low temp for specificity scoring stability; 4096-token headroom.
      temperature: 0.2,
      maxTokens: 4096,
      callerLabel: "why-us",
      userId,
    });
    let parsed: Record<string, unknown>;
    try {
      parsed = repairAndParse<Record<string, unknown>>(text);
    } catch (parseErr) {
      throw new JsonParseError(
        parseErr instanceof Error ? parseErr.message : "Failed to parse why-us LLM JSON",
        text,
      );
    }
    // Validate AI output quality
    const quality = validateAIOutput(parsed, {
      requiredFields: ["score", "scoreExplanation", "counselorNote"],
      requiredArrays: ["genericPhrases", "missingSpecifics", "rewriteSuggestions"],
    });
    const nextSteps = buildNextSteps("essay-why-us", parsed);
    const meta = buildResponseMeta({
      tierUsed,
      dataSources: ["why-us-scorer heuristic", "school database"],
      confidenceLevel: "high",
      qualityScore: quality.score,
    });
    return NextResponse.json({
      ...parsed,
      tierUsed,
      nextSteps,
      _meta: meta,
      _quality: quality.passed ? undefined : { issues: quality.issues },
    });
  } catch (err) {
    if (freeUsageReserved && reservedUserId) {
      freeUsageReserved = false;
      try {
        await releaseFreeUsage(reservedUserId, "essays");
      } catch (releaseError) {
        console.error("[/api/essay/why-us] usage release failed:", releaseError);
      }
    }
    console.error("[/api/essay/why-us]", {
      event: "ai_failed",
      fatal: false,
      error: String(err),
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
    });
    if (err instanceof JsonParseError) {
      return NextResponse.json(
        { error: "AI returned an unparseable response. Please retry." },
        { status: 502 }
      );
    }
    // Graceful degradation — fall back to heuristic results so the user
    // doesn't get nothing after spending an essay credit.
    return NextResponse.json({
      score: heuristic.score,
      genericPhrases: heuristic.genericPhrases.map((p) => ({
        phrase: p.phrase,
        suggestion: `Replace with a ${school.shortName}-specific reference.`,
      })),
      missingSpecifics: [],
      rewriteSuggestions: heuristic.feedback,
      tierUsed: 0,
      heuristicOnly: true,
      degraded: true,
    });
  }
 } catch (outerErr) {
    if (freeUsageReserved && reservedUserId) {
      freeUsageReserved = false;
      try {
        await releaseFreeUsage(reservedUserId, "essays");
      } catch (releaseError) {
        console.error("[/api/essay/why-us] usage release failed after unhandled error:", releaseError);
      }
    }
    // Top-level guard: any unhandled throw surfaces as structured JSON 503.
    console.error("[/api/essay/why-us] POST unhandled error:", {
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      stack: outerErr instanceof Error ? outerErr.stack : undefined,
      hasGroqKey1: !!process.env.GROQ_API_KEY_1,
      hasCerebrasKey: !!process.env.CEREBRAS_API_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Why-Us coach temporarily unavailable. Please try again in 30s.", retryable: true },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }
}
