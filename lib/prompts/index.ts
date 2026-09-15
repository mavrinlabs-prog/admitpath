/**
 * Master prompts library. All AI persona/system prompts live here so they're
 * editable in one place rather than buried inline in route handlers.
 *
 * Each prompt embodies the AdmitPath evidence-first guidance voice.
 *
 * Voice: brilliant older student. Direct, honest, peer-expert.
 * Closing discipline: "You are not here to be impressive. You are here to be useful."
 */

export { COUNSELOR_CHAT_SYSTEM } from "./counselor-chat";
export {
  ESSAY_COACH_SYSTEM,
  ESSAY_COACH_SYSTEM_COMPACT,
  buildEssayCoachPrompt,
  buildCompactEssayCoachPrompt,
} from "./essay-coach";
export { COLLEGE_MATCHER_SYSTEM, buildCdsWeightBlock } from "./college-matcher";
export { RESUME_PARSER_SYSTEM, buildResumeParserPrompt } from "./resume-parser";
export { ESSAY_TOPICS_SYSTEM, buildEssayTopicsPrompt, COMMON_APP_PROMPTS } from "./essay-topics";
export type { EssayTopicProfile } from "./essay-topics";
export { INTERVIEW_COACH_SYSTEM, buildInterviewFeedbackPrompt } from "./interview-coach";
