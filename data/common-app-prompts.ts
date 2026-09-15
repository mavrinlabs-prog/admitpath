/**
 * Common App personal statement prompts for the 2026–27 cycle.
 *
 * The 7 official prompts have been stable since 2017. Coaching is
 * AdmitPath-authored.
 *
 * Used by `app/resources/common-app-essay/page.tsx` (the public guide)
 * and referenced from `lib/prompts/essay-topics.ts` (the AI topic
 * generator). Keep the prompt text in lockstep with the official Common
 * App site — verify in August before each cycle.
 */

export type CommonAppPrompt = {
  number: number;
  title: string;
  prompt: string;
  guidance: string[];
  pitfalls: string[];
  bestFor: string;          // who this prompt rewards
};

export const COMMON_APP_WORD_LIMIT = 650;
export const COMMON_APP_MIN_WORDS = 250;
export const COMMON_APP_CYCLE = "2026–27";

export const COMMON_APP_PROMPTS_DETAILED: CommonAppPrompt[] = [
  {
    number: 1,
    title: "Background, identity, interest, talent",
    prompt:
      "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
    bestFor:
      "Students with a single load-bearing identity / passion / context that is genuinely the lens through which they see everything.",
    guidance: [
      "'Incomplete without it' is the high bar — be ruthless about whether this prompt is really for you.",
      "Show how the background shapes a specific way you think or act, not just that you have it.",
      "End on what you do with it now, not what happened to you in 7th grade.",
    ],
    pitfalls: [
      "Treating identity as a label without showing lived specificity.",
      "Trauma-as-essay without growth or transferable insight.",
      "Listing every identity instead of going deep on one.",
    ],
  },
  {
    number: 2,
    title: "Lessons from obstacles",
    prompt:
      "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
    bestFor:
      "Students whose strongest moments came after something genuinely went wrong — not students hunting for a 'failure' to perform humility.",
    guidance: [
      "Specific scene > abstract challenge. Open with the moment of failure.",
      "Lessons section is where most essays die — make sure your lesson is non-obvious.",
      "Your changed behavior since then is the real proof of growth.",
    ],
    pitfalls: [
      "Manufactured failures (got a B+) that read as humblebrags.",
      "Spending 600 words on the failure and 50 on the lesson.",
      "Sports-injury narrative without an actual insight.",
    ],
  },
  {
    number: 3,
    title: "Questioned a belief",
    prompt:
      "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
    bestFor:
      "Students with intellectual courage — willing to disagree with authority, change their mind publicly, or take an unpopular stance.",
    guidance: [
      "Show genuine epistemic humility — willingness to BE WRONG, not just question others.",
      "The strongest version: a belief YOU once held that you came to challenge.",
      "Be honest about what the outcome cost you (friendships, status, certainty).",
    ],
    pitfalls: [
      "Easy targets (challenging a belief no one your age actually holds).",
      "'I challenged my parents' worldview' without specifics.",
      "Performing iconoclasm without showing the actual argument.",
    ],
  },
  {
    number: 4,
    title: "Surprising gratitude",
    prompt:
      "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
    bestFor:
      "Students with an underrepresented strength: emotional perception, deep relationships, attention to small moments.",
    guidance: [
      "'Surprising' is the key word — pick a moment that wouldn't show up in a yearbook caption.",
      "Concrete sensory detail beats abstract reflection on kindness.",
      "Your motivation arc afterwards is what closes the prompt.",
    ],
    pitfalls: [
      "Choosing a parent or grandparent (everyone does this).",
      "Sentimental without specific detail.",
      "Failing to connect the gratitude to action you took afterwards.",
    ],
  },
  {
    number: 5,
    title: "Personal growth realization",
    prompt:
      "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
    bestFor:
      "Students whose strongest narrative is internal change — a moment that shifted how they understand themselves.",
    guidance: [
      "Realizations are stronger than accomplishments here. Accomplishments lean braggy; realizations show maturity.",
      "Specify the exact understanding that emerged — vague 'I grew as a person' kills this prompt.",
      "Show the 'before' and 'after' you, briefly.",
    ],
    pitfalls: [
      "Conflating 'growth' with 'getting better at the thing.'",
      "Overclaiming: 'this changed everything about me.'",
      "Picking a too-recent realization — usually reads thin.",
    ],
  },
  {
    number: 6,
    title: "Lose track of time",
    prompt:
      "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
    bestFor:
      "Intellectually-spiked students whose passion shows up offline — in libraries, garages, repos, lab notebooks.",
    guidance: [
      "'Lose track of time' is a behavior signal — show evidence of the behavior.",
      "Cite the specific people, books, threads, repositories you turn to.",
      "Don't be afraid to be esoteric — admissions readers reward genuine depth over palatability.",
    ],
    pitfalls: [
      "Picking something you SHOULD love (because it matches your major) instead of what you actually do.",
      "Performing intellectualism without specifics.",
      "Failing to answer the second half (who/what you turn to).",
    ],
  },
  {
    number: 7,
    title: "Topic of your choice",
    prompt:
      "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
    bestFor:
      "Students whose strongest story doesn't fit any of the other six prompts cleanly. Or students reusing a strong essay from another application.",
    guidance: [
      "Pick this when your story genuinely needs a custom frame, not because the others 'feel limiting.'",
      "Don't waste opening words explaining why you chose Prompt 7. Just tell the story.",
      "If you've written this for another application, edit aggressively for Common App's word limit and audience.",
    ],
    pitfalls: [
      "Using Prompt 7 as a license to ignore structure.",
      "Pasting a graded English class essay without rewriting for voice.",
      "Picking topics that should obviously have been Prompts 1-6.",
    ],
  },
];

export function getCommonAppPrompt(number: number): CommonAppPrompt | null {
  return COMMON_APP_PROMPTS_DETAILED.find((p) => p.number === number) ?? null;
}
