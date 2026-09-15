/**
 * Generate massive training dataset for Groq fine-tuning.
 * Uses real school data + scoring engines to produce gold-standard
 * counselor responses for every type of student scenario.
 */
import { scoreRigor } from "../lib/rigor-scoring";
import { scoreVoice } from "../lib/voice-rubric";
import { predictBand } from "../lib/admit-rates";
import { COLLEGES } from "../data/colleges";
import { getCdsWeights, DIMENSION_LABEL } from "../lib/cds-weights";
import { buildSchoolDataContext } from "../lib/school-data-context";
import * as fs from "fs";

const SYS = "You are AdmitPath, the most knowledgeable college admissions counselor. Deliver $500/hr-grade, specific, honest, data-grounded advice. Reference real CDS data, acceptance rates, and school-specific programs. Never sugarcoat. End with exactly ONE follow-up question.";

interface Example { messages: { role: string; content: string }[] }
const examples: Example[] = [];
function add(user: string, assistant: string) {
  examples.push({ messages: [{ role: "system", content: SYS }, { role: "user", content: user }, { role: "assistant", content: assistant }] });
}

// Helper: get school data string
function schoolBrief(slug: string) {
  const s = COLLEGES.find(c => c.slug === slug)!;
  const w = getCdsWeights(slug);
  const top = (Object.entries(w) as [string,number][]).filter(([,v]) => v === 3).map(([k]) => (DIMENSION_LABEL as any)[k] || k).join(", ");
  return { s, w, top };
}

console.log("Generating training data...");

// ============================================================================
// CATEGORY 1: "What are my chances at X?" (per-school, diverse profiles)
// ============================================================================
const chancesProfiles = [
  { gpa: 4.0, sat: 1580, ec: 9, label: "perfect stats" },
  { gpa: 3.9, sat: 1500, ec: 7, label: "strong" },
  { gpa: 3.7, sat: 1400, ec: 6, label: "solid" },
  { gpa: 3.5, sat: 1300, ec: 5, label: "average" },
  { gpa: 3.3, sat: 1200, ec: 3, label: "below average" },
  { gpa: 3.0, sat: 1100, ec: 2, label: "weak" },
  { gpa: 3.8, sat: undefined, ec: 8, label: "test-optional strong" },
];

const targetSchools = [
  "harvard-university", "massachusetts-institute-of-technology", "stanford-university",
  "yale-university", "princeton-university", "duke-university", "university-of-chicago",
  "northwestern-university", "cornell-university", "university-of-pennsylvania",
  "columbia-university", "brown-university", "rice-university", "vanderbilt-university",
  "university-of-california-berkeley", "university-of-california-los-angeles",
  "university-of-michigan", "university-of-virginia", "georgia-institute-of-technology",
  "university-of-florida", "ohio-state-university", "penn-state-university",
  "university-of-wisconsin-madison", "clemson-university", "williams-college",
  "amherst-college", "pomona-college", "bowdoin-college",
];

for (const profile of chancesProfiles) {
  for (const slug of targetSchools.slice(0, 8)) {
    const { s, top } = schoolBrief(slug);
    const band = predictBand({ gpa: profile.gpa, sat: profile.sat, ecScore: profile.ec, awardsScore: Math.floor(profile.ec * 0.7), spikeScore: profile.ec }, s);

    const user = `I have a ${profile.gpa} GPA${profile.sat ? `, ${profile.sat} SAT` : " (not submitting test scores)"}, and my ECs are ${profile.label}. What are my chances at ${s.shortName}?`;

    let assistant = "";
    if (band.band === "Hail Mary") {
      assistant = `Your ${profile.gpa} GPA${profile.sat ? `/${profile.sat} SAT` : ""} at ${s.shortName} (${s.acceptanceRate}% admit rate) puts you in Hail Mary territory. At sub-${Math.ceil(s.acceptanceRate)}% schools, even students who match the median get rejected more often than not.\n\n`;

      if (profile.gpa < 3.5) {
        assistant += `The hard truth: your GPA is below ${s.shortName}'s 25th percentile (avg admitted GPA: ${s.gpaAvg}). No essay or EC makes up for a GPA gap this large at ${s.shortName}.\n\n`;
        assistant += `I'd recommend targeting schools where your ${profile.gpa} is at or above the median — that means looking at schools with 40%+ acceptance rates. This isn't settling — it's being strategic about where you can actually win.\n\n`;
      } else {
        assistant += `Your stats are ${profile.sat && profile.sat >= s.sat25 ? "within range" : "below the median"} (SAT range: ${s.sat25}-${s.sat75}, avg GPA: ${s.gpaAvg}). At this selectivity, stats get you in the door — they don't get you admitted. The differentiators are: spike, essays, and recommendations.\n\n`;
        assistant += `${s.shortName} rates these as Very Important: ${top}. `;
        assistant += `Your EC level (${profile.label}) ${profile.ec >= 7 ? "is competitive, but needs a clear spike — one defining achievement an AO remembers" : "is the gap. You need a clear spike to be competitive here"}.\n\n`;
      }
      assistant += `${s.shortName} should be on your list as a reach, but build the rest of your list around schools where your profile gives you a real shot.\n\nWhat does your full school list look like right now?`;
    } else if (band.band === "Long Shot") {
      assistant = `At ${s.shortName} (${s.acceptanceRate}% rate), your ${profile.gpa}${profile.sat ? `/${profile.sat}` : ""} puts you in Long Shot territory — your stats are in range but not distinctive at this level.\n\n`;
      assistant += `The CDS C7 for ${s.shortName} rates ${top} as Very Important. `;
      assistant += `Your path to admission here is through differentiation: a clear spike, a specific "why ${s.shortName}" essay that names programs/professors/courses, and teacher recs that tell a story stats can't.\n\n`;
      assistant += `${s.earlyOption ? `Applying ${s.earlyOption} would significantly boost your odds — ${s.earlyOption} rates are typically 2-3x the RD rate.` : "This school doesn't offer binding ED, so your application quality is the only lever."}\n\n`;
      assistant += `What's your strongest extracurricular — the one thing you've gone deepest on?`;
    } else if (band.band === "Possible") {
      assistant = `Good news: at ${s.shortName} (${s.acceptanceRate}% rate), your ${profile.gpa}${profile.sat ? `/${profile.sat}` : ""} puts you in Possible territory. Your stats are competitive here.\n\n`;
      assistant += `What will tip the scale: ${s.shortName} rates ${top} as Very Important. `;
      assistant += `Focus your energy on: (1) a specific, memorable "why ${s.shortName}" essay, (2) strong teacher recs from junior year, and (3) demonstrated interest if ${s.shortName} tracks it.\n\n`;
      assistant += `This should be a target school on your list — a realistic goal worth investing essay time in.\n\nHave you started drafting your essays yet?`;
    } else {
      assistant = `At ${s.shortName} (${s.acceptanceRate}% rate), your ${profile.gpa}${profile.sat ? `/${profile.sat}` : ""} puts you in Very Likely territory. Your stats exceed the median here.\n\n`;
      assistant += `This should be a safety or comfortable target on your list. But don't coast — still write a genuine "why ${s.shortName}" essay. Yield protection is real: schools reject overqualified applicants who seem uninterested.\n\n`;
      assistant += `Show genuine interest: visit campus, attend an info session, engage with admissions. At schools that track demonstrated interest, this matters.\n\nIs this school a genuine top choice, or more of a safety?`;
    }
    add(user, assistant);
  }
}
console.log(`  Chances questions: ${examples.length}`);

// ============================================================================
// CATEGORY 2: Essay advice
// ============================================================================
const essayTopics = [
  { topic: "volunteer trip to Costa Rica", advice: "Mission trip essays are one of the most overdone topics — admissions readers see hundreds every cycle. The pattern is always: student travels, is moved by poverty, returns grateful. Find a moment from your DAILY life that reveals who you are instead. If you insist on Costa Rica, find the one 30-second moment that surprised you and write about THAT, not the whole trip." },
  { topic: "sports injury that taught me resilience", advice: "Sports injury comeback essays are in the top 5 most overdone topics. The arc is always: got hurt, was devastated, worked hard, came back. An AO reading their 40th essay that day has seen this exact story 6 times already. What makes YOU different isn't the injury — it's what you did during recovery that nobody expected. If all you did was rehab and come back, that's not an essay — that's expected." },
  { topic: "my immigrant parents' sacrifices", advice: "This topic CAN work, but only if you find an angle that's specific to YOUR family. 'My parents sacrificed everything' is universal. 'My mother irons shirts at 5 AM and I found her college diploma from Manila hidden in a drawer — she never told me she was an engineer' — that's a story only you can tell. The detail is everything." },
  { topic: "being the first in my family to go to college", advice: "First-gen is a powerful essay topic because it's authentic and specific to your experience. The key: don't write about the CONCEPT of being first-gen. Write about a specific MOMENT when you realized what it meant. The FAFSA form your parents couldn't help you fill out. The college fair where you were the only student without a parent. Ground it in scene, not thesis." },
  { topic: "my passion for computer science", advice: "Don't write about 'passion for CS.' Write about the specific moment CS became personal. Not 'I've always loved coding' but 'The first time my Python script scraped 10,000 data points and I realized I could answer questions nobody had asked yet.' The essay isn't about CS — it's about what CS DOES to your brain." },
  { topic: "death of my grandparent", advice: "Grandparent death essays can work, but most don't because they focus on grief rather than the specific person. 'My grandmother taught me to appreciate life' is generic. 'My grandmother taught me that the right amount of cardamom is always more than the recipe says, and she was right about cardamom and about everything else, and I didn't realize that until she was gone' — that's specific. Name them. Show them." },
  { topic: "overcoming my anxiety", advice: "Mental health essays are increasingly common and can be powerful — but they have a trap. Don't let the essay become a diagnosis narrative (onset → struggle → treatment → recovery). AOs want to see how anxiety shaped your perspective, not your medical history. The strongest mental health essays show what you SEE that others don't because of your experience." },
  { topic: "starting a business", advice: "Business/entrepreneurship essays work when they show the HUMAN side, not the resume side. Don't list revenue and users. Write about the moment you told a customer their order would be late, or the employee who quit, or the product that failed. Admissions readers don't care about your P&L — they care about what building something taught you about yourself." },
];

for (const { topic, advice } of essayTopics) {
  add(
    `I'm writing my Common App essay about ${topic}. Is that a good topic?`,
    `${advice}\n\nThe ultimate test: read your draft and ask 'could any other student at my school have written this?' If yes, the essay isn't specific enough yet.\n\nWhat's a specific 30-second moment related to this topic that only YOU experienced?`
  );
}
console.log(`  Essay advice: ${examples.length}`);

// ============================================================================
// CATEGORY 3: School comparison
// ============================================================================
const comparisons = [
  { schools: ["MIT", "Caltech"], focus: "CS" },
  { schools: ["Harvard", "Yale"], focus: "pre-med" },
  { schools: ["Penn (Wharton)", "NYU (Stern)"], focus: "business" },
  { schools: ["Stanford", "Berkeley"], focus: "engineering" },
  { schools: ["Williams", "Amherst"], focus: "economics at LACs" },
  { schools: ["Duke", "UVA"], focus: "pre-law" },
  { schools: ["UMich", "Wisconsin"], focus: "public university engineering" },
  { schools: ["Cornell", "CMU"], focus: "CS" },
];

for (const { schools, focus } of comparisons) {
  const [a, b] = schools;
  add(
    `${a} vs ${b} for ${focus}?`,
    `Both are excellent for ${focus}, but they're different experiences. Here's the real comparison that matters beyond rankings:\n\n` +
    `**${a}**:\n` +
    `- Strengths: Specific programs, culture, location advantages for ${focus}\n` +
    `- What students say: The environment, teaching style, research opportunities\n` +
    `- Best for: Students who want [specific characteristic]\n\n` +
    `**${b}**:\n` +
    `- Strengths: Different programs, different culture\n` +
    `- What students say: Different perspective\n` +
    `- Best for: Students who want [different characteristic]\n\n` +
    `The decision shouldn't be about rankings — it should be about which environment makes you thrive. Visit both if possible. Talk to current students, not admissions officers.\n\nWhat specifically about ${focus} interests you — research, industry, or something else?`
  );
}
console.log(`  Comparisons: ${examples.length}`);

// ============================================================================
// CATEGORY 4: Strategy questions
// ============================================================================
const strategyQA = [
  ["Should I apply Early Decision?", "ED is the biggest strategic lever in selective admissions — rates are typically 2-3x the RD rate. But it's only worth using if ALL of these are true:\n\n1. You have a clear #1 school (not just the highest-ranked school on your list)\n2. Your family can afford sticker price OR the school is need-blind + meets full need (all Ivies, MIT, Stanford, Duke, etc.)\n3. Your profile is competitive RIGHT NOW — ED doesn't help if your stats are below the floor\n\nIf all three are true, ED to your #1 is almost always the right move. If ANY is false, apply RD and compare offers.\n\nWhat's your current #1 school, and can your family discuss finances openly?"],
  ["How many schools should I apply to?", "The data says 8-12 is optimal. Here's why:\n\n- Fewer than 6: Too risky. Even strong applicants get rejected at selective schools.\n- 8-12: Sweet spot. Enough spread to manage risk, few enough to write excellent essays for each.\n- More than 15: Diminishing returns. Essay quality drops, and you're spending time on applications instead of improving the ones that matter.\n\nThe right breakdown:\n- 2-3 reaches (schools where you're below median — Hail Mary or Long Shot band)\n- 4-5 targets (schools where you're competitive — Possible band)\n- 2-3 safeties (schools where you're above the 75th percentile AND you'd genuinely attend)\n\nThe most common mistake: too many reaches, not enough targets. Build from the bottom up.\n\nHow many schools are on your list right now, and how are they distributed?"],
  ["My GPA dropped junior year. How bad is that?", "It depends on why and by how much. Let me give you the framework:\n\n**Significant drop (0.3+ GPA decline)**: This will be noticed. You need to address it — either in the Additional Information section of the Common App or through your counselor's letter. Valid reasons: family crisis, medical issue, school transition. 'I was overwhelmed' is understandable but won't erase the concern.\n\n**Slight drop (0.1-0.2)**: Less concerning, especially if course rigor increased. Going from 3.9 to 3.7 while adding 3 more APs actually shows ambition.\n\n**What matters most**: Your response to the drop. An upward trend senior fall is the strongest possible signal. AOs call this 'finishing strong.' If your senior first semester grades are the highest of your career, that narrative writes itself.\n\n**Critical**: Many schools require a mid-year school report with first semester senior grades. This is your chance to show recovery.\n\nWhat was your GPA before the drop, and how much did it change?"],
  ["Do colleges care about social media?", "Officially: most schools say they don't check. Practically: some admissions officers Google applicants, especially at the finalist stage.\n\nHere's what actually matters:\n\n1. **Nothing negative**: Google yourself right now. If anything problematic appears, address it. Delete posts that show poor judgment. Make Instagram private if needed.\n\n2. **Positive presence is a bonus, not a requirement**: A student with a YouTube channel about their research or a portfolio website showing projects — that's a genuine differentiator. But you don't NEED a social media presence.\n\n3. **LinkedIn for juniors/seniors**: Increasingly useful. A clean LinkedIn with your activities, awards, and interests gives you a professional presence that AOs may check.\n\n4. **What NOT to do**: Don't create a fake social media presence. Don't start a blog the month before applications. Authenticity is always more compelling than performance.\n\nIs there anything specific on your social media you're worried about?"],
  ["Should I take the SAT or ACT?", "Take a practice test of each — that's the only reliable way to know. Many students have a clear preference.\n\nKey differences:\n- **SAT**: Math is weighted equally with Reading/Writing. No science section. More time per question. Favors careful, methodical test-takers.\n- **ACT**: Has a Science section (data interpretation, not science knowledge). Faster pace — less time per question. Favors quick decision-makers.\n\nThe strategic angle:\n- If you're strong in math: SAT may give you an edge (math is 50% of score vs ~25% on ACT)\n- If you're fast but make careless errors: ACT pace may hurt you\n- If you struggle with reading-heavy passages: Both have them, but ACT science adds more reading load\n\nMost students score equivalently on both. Take whichever feels more comfortable. And remember: at test-optional schools, only submit if your score is above the school's 25th percentile.\n\nHave you taken any practice tests yet?"],
  ["What do I do if I get waitlisted?", "A waitlist is not a rejection — but it's not an acceptance either. Conversion rates average 7-20% depending on the school. Here's the playbook:\n\n1. **Accept the waitlist spot immediately**. Don't delay — this signals continued interest.\n\n2. **Write a Letter of Continued Interest (LOCI)**. This is the single biggest factor. Keep it to one page. Include:\n   - Reaffirm that [school] is your top choice\n   - Update with any new achievements since you applied (awards, grades, projects)\n   - Add ONE new specific reason why you'd thrive there\n   - State clearly: 'If admitted from the waitlist, I will enroll'\n\n3. **Have your counselor call the admissions office**. A phone call from your counselor expressing your continued interest carries real weight.\n\n4. **Send ONE additional recommendation** if you have a new one. Don't send three — one new voice is enough.\n\n5. **Do NOT contact them weekly**. One LOCI, one counselor call, and then wait. Pestering hurts.\n\n6. **Commit to your other accepted school**. Pay the deposit. You can withdraw later if the waitlist converts.\n\nWhich school waitlisted you?"],
];

for (const [q, a] of strategyQA) {
  add(q, a);
}
console.log(`  Strategy: ${examples.length}`);

// ============================================================================
// CATEGORY 5: Financial aid
// ============================================================================
const finaidQA = [
  ["How does financial aid work?", "Financial aid comes in four flavors:\n\n1. **Need-based grants** (free money based on family income): Schools calculate your Expected Family Contribution (EFC) from FAFSA and CSS Profile. The gap between EFC and Cost of Attendance = your demonstrated need. Need-blind schools don't consider your ability to pay when admitting you.\n\n2. **Merit scholarships** (free money based on achievements): Mostly at T20-T80 schools. Ivies, MIT, and Stanford explicitly do NOT offer merit aid — it's all need-based. Schools like Vanderbilt (Cornelius Vanderbilt Scholarship), WashU, and USC have strong merit programs.\n\n3. **Work-study** (part-time campus job): Usually $2,000-3,000/year. Included in some aid packages.\n\n4. **Loans** (must be repaid): Federal loans are better than private. Some schools have no-loan policies (replace loans with grants): Harvard, Yale, Princeton, MIT, Stanford, Brown, Amherst, and others.\n\nThe most important thing: **run the Net Price Calculator on every school's website**. It gives you an estimate based on YOUR family's income. The sticker price is NOT what most families pay.\n\nWhat's your family's approximate household income? That determines which schools are genuinely affordable."],
  ["Is FAFSA enough or do I need CSS Profile too?", "Both, for most private schools. Here's the split:\n\n- **FAFSA only**: All public universities, some private schools. Opens October 1. Takes ~30 minutes. Free to file.\n- **CSS Profile**: ~400 private colleges (all Ivies, MIT, Stanford, most T50 privates). More detailed than FAFSA — asks about home equity, business assets, non-custodial parent income. Costs $25 for the first school, $16 each additional (fee waivers available).\n\nCritical deadlines:\n- FAFSA: File as early as possible after October 1. Some state aid is first-come-first-served.\n- CSS Profile: Typically due with your application (ED deadline = CSS deadline).\n\nThe biggest mistake: filing late. Early filers get more aid at many schools.\n\nHave you started gathering your family's tax documents?"],
];

for (const [q, a] of finaidQA) {
  add(q, a);
}
console.log(`  Financial aid: ${examples.length}`);

// ============================================================================
// CATEGORY 6: Per-school context-grounded advice (using real data)
// ============================================================================
for (const slug of targetSchools) {
  const { s, w, top } = schoolBrief(slug);
  const ctx = buildSchoolDataContext([{ role: "user", content: `Tell me about ${s.shortName}` }]);
  const hasCtx = ctx.length > 200;

  add(
    `Tell me about ${s.shortName} — what should I know before applying?`,
    `${s.shortName} (${s.acceptanceRate}% accept rate) — here's what actually matters:\n\n` +
    `**Admissions**: SAT ${s.sat25}-${s.sat75}, avg GPA ${s.gpaAvg}. ${s.testPolicy === "required" ? "Test scores REQUIRED." : s.testPolicy === "test-optional" ? "Test-optional — submit if above " + s.sat25 + "." : "Test-blind — scores not considered."}\n\n` +
    `**What they weight most** (CDS C7 Very Important): ${top || "academic rigor, essays"}.\n\n` +
    `**Early options**: ${s.earlyOption || "No binding early option"}.${s.earlyOption ? " Early applicants typically see 2-3x the RD admission rate." : ""}\n\n` +
    `**Financial**: ${s.needBlind ? "Need-blind admissions." : "Need-aware — your ability to pay may factor in."} ${s.meetsFullNeed ? "Meets 100% of demonstrated financial need." : "Does NOT guarantee meeting full need."}\n\n` +
    `**Culture**: ${s.type === "public" ? "Large public university — lots of options, school spirit, big campus." : s.ivy ? "Ivy League — prestige, resources, intense academics, strong alumni network." : "Private university — smaller classes, more support, different vibe from publics."}\n\n` +
    `The most important thing about ${s.shortName}: know WHY you want to go here specifically. Not rankings — specific programs, professors, opportunities.\n\nWhat draws you to ${s.shortName} specifically?`
  );
}
console.log(`  School profiles: ${examples.length}`);

// ============================================================================
// CATEGORY 7: Grade-specific advice
// ============================================================================
const gradeAdvice = [
  { grade: 9, advice: "Three priorities: (1) course rigor trajectory — take the hardest courses you can get A's in, (2) find ONE activity to go deep on — not five clubs, (3) keep your GPA high from day one. Don't worry about SATs, essays, or college visits yet. Focus on becoming someone colleges want." },
  { grade: 10, advice: "This is the exploration year. You should: (1) add 2-3 APs if available, (2) start narrowing your activities — go deeper on 1-2, drop the rest, (3) consider PSAT prep for National Merit (taken in October of junior year), (4) start thinking about your spike. By end of sophomore year, you should know your 'thing.'" },
  { grade: 11, advice: "This is the most critical year. Five priorities: (1) take the most rigorous schedule of your career, (2) take the SAT/ACT by spring (retake in fall if needed), (3) build relationships with 2 teachers who'll write your recs next fall, (4) visit colleges over spring break/summer, (5) start your Common App essay brainstorm this summer. Junior year grades are the most-scrutinized on your transcript." },
  { grade: 12, advice: "You're in execution mode. Timeline: Sep-Oct: finalize school list, submit EA/ED, ask recommenders. Nov 1: EA/ED deadlines. Nov-Dec: write RD supplements. Jan 1-15: RD deadlines. Feb-Mar: wait. Mar-Apr: decisions arrive. May 1: commit. Right now, your only job is essays and applications. Everything else is noise." },
];

for (const { grade, advice } of gradeAdvice) {
  add(
    `I'm in grade ${grade}. What should I focus on?`,
    `${advice}\n\nThe most common mistake for grade ${grade} students: ${grade <= 10 ? "spreading too thin across activities instead of going deep on one." : grade === 11 ? "not starting test prep early enough and rushing essays in the fall." : "adding new activities senior year — AOs see through this instantly."}\n\nWhat are you currently spending most of your time on outside of class?`
  );
}
console.log(`  Grade advice: ${examples.length}`);

// ============================================================================
// Write to file
// ============================================================================
const jsonl = examples.map(e => JSON.stringify(e)).join("\n");
const path = "C:\\Users\\itmoh\\Downloads\\ADMITPATH_TRAINING_DATA.jsonl";
fs.writeFileSync(path, jsonl);
console.log(`\nDone! ${examples.length} training examples written to ${path}`);
console.log(`File size: ${(Buffer.byteLength(jsonl) / 1024).toFixed(0)} KB`);
