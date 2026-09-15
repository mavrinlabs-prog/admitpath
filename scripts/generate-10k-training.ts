import { predictBand } from "../lib/admit-rates";
import { scoreRigor } from "../lib/rigor-scoring";
import { COLLEGES } from "../data/colleges";
import { getCdsWeights, DIMENSION_LABEL } from "../lib/cds-weights";
import * as fs from "fs";

const SYS = "You are AdmitPath, the most knowledgeable college admissions counselor. Deliver $500/hr-grade, specific, honest, data-grounded advice. Reference real acceptance rates, SAT ranges, and CDS data. Never sugarcoat. End with exactly ONE follow-up question.";

let out = "";
let count = 0;

function emit(user: string, assistant: string) {
  out += JSON.stringify({ messages: [{ role: "system", content: SYS }, { role: "user", content: user }, { role: "assistant", content: assistant }] }) + "\n";
  count++;
}

const NAMES = ["Alex","Jordan","Taylor","Morgan","Casey","Riley","Avery","Quinn","Sam","Jamie","Drew","Reese","Dakota","Skyler","Cameron","Peyton","Harper","Rowan","Emery","Sage"];
const MAJORS = ["Computer Science","Biology","Economics","Political Science","Engineering","Psychology","English","Chemistry","Mathematics","Neuroscience","Business","History","Physics","Architecture","Nursing","Film","Music","Philosophy","Environmental Science","Data Science"];
const ACTIVITIES = [
  ["Robotics team captain (3 yrs)", "Published ML research", "Coding bootcamp founder"],
  ["Varsity soccer captain", "Hospital volunteer (500 hrs)", "Student government"],
  ["Debate team (national qualifier)", "School newspaper editor", "Mock Trial captain"],
  ["Orchestra concertmaster", "Math Olympiad team", "Tutoring program founder"],
  ["Research at university lab (2 yrs)", "Science Olympiad captain", "Environmental club president"],
  ["Founded nonprofit serving 200 students", "DECA International qualifier", "Part-time job (20 hrs/wk)"],
  ["Varsity swimming (state champion)", "Lifeguard", "Swim coaching youth team"],
  ["Theater director (3 productions)", "Scholastic Writing Gold Key", "Literary magazine editor"],
  ["App developer (50K downloads)", "Hackathon winner", "CS club president"],
  ["4-H president", "FFA state officer", "Farm work (family business)"],
];
const AWARDS_SETS = [
  ["USACO Gold", "Regeneron STS semifinalist", "National Merit Finalist"],
  ["State science fair 1st place", "AP Scholar with Distinction", "School valedictorian"],
  ["National Speech & Debate qualifier", "Model UN Best Delegate", "School leadership award"],
  ["All-State Orchestra", "AIME qualifier", "School STEM award"],
  ["Community Service Gold Medal", "AP Scholar", "Honor Roll"],
  ["DECA International top 10", "State debate champion", "National Honor Society"],
  ["Congressional App Challenge winner", "Hackathon 1st place", "School CS award"],
  ["Scholastic Art Gold Key", "Regional theater award", "School arts award"],
  ["Eagle Scout", "FIRST Robotics award", "State engineering fair winner"],
  ["No major awards", "School department award"],
];
const CONCERNS = [
  "Is my spike strong enough?", "Will my GPA hold me back?", "Should I go test-optional?",
  "Can my family afford this school?", "Is it too late to improve my profile?",
  "Which school should I ED to?", "Am I aiming too high?", "How important is demonstrated interest?",
  "Will being first-gen help?", "Should I retake the SAT?",
];
const GPAS = [2.5, 2.8, 3.0, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.75, 3.8, 3.85, 3.9, 3.95, 4.0];
const SATS: (number|undefined)[] = [undefined, 1000, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1480, 1500, 1520, 1550, 1580, 1600];
const GRADES = [9, 10, 11, 12];

console.log("Generating 10K+ training examples...");

for (let i = 0; i < 10000; i++) {
  const grade = GRADES[i % GRADES.length];
  const gpa = GPAS[i % GPAS.length];
  const sat = SATS[i % SATS.length];
  const ec = Math.min(10, (i % 11));
  const spike = Math.min(10, ec + (i % 3));
  const awards = Math.min(10, Math.floor(ec * 0.8));
  const school = COLLEGES[i % COLLEGES.length];
  const major = MAJORS[i % MAJORS.length];
  const name = NAMES[i % NAMES.length];
  const acts = ACTIVITIES[i % ACTIVITIES.length];
  const awds = AWARDS_SETS[i % AWARDS_SETS.length];
  const concern = CONCERNS[i % CONCERNS.length];

  const band = predictBand({ gpa, sat, ecScore: ec, awardsScore: awards, spikeScore: spike }, school);
  const rigor = scoreRigor({ courses: `${Math.max(0, Math.floor(ec * 0.8))} APs, ${Math.max(0, Math.floor(ec * 0.3))} Honors`, grade: String(grade) }, {});
  const w = getCdsWeights(school.slug);
  const topFactors = (Object.entries(w) as [string,number][]).filter(([,v]) => v === 3).map(([k]) => (DIMENSION_LABEL as any)[k] || k).join(", ");

  const user = `I'm ${name}, a grade ${grade} student with a ${gpa} GPA${sat ? `, ${sat} SAT` : " (not submitting test scores)"}. I'm interested in ${major} at ${school.shortName}. My activities: ${acts.join(", ")}. Awards: ${awds.join(", ")}. ${concern}`;

  let assistant = "";

  // Band-specific response
  if (band.band === "Hail Mary") {
    if (gpa < 3.3) {
      assistant = `${name}, I need to be honest: your ${gpa} GPA is below ${school.shortName}'s admitted student average of ${school.gpaAvg}. At ${school.acceptanceRate}% acceptance, even students WITH the right stats face lottery odds. Your GPA gap makes ${school.shortName} a Hail Mary.\n\nThat doesn't mean give up on great schools — it means calibrate your list. With a ${gpa}, you're competitive at schools in the 40-60% acceptance range where your ${major} interest and activities can shine. Think ${COLLEGES.filter(c => c.acceptanceRate > 40 && c.acceptanceRate < 65).slice(0, 3).map(c => c.shortName).join(", ")}.\n\n`;
    } else if (sat && sat < school.sat25) {
      assistant = `${name}, your ${gpa} GPA is ${gpa >= school.gpaAvg ? "competitive" : "slightly below average"} for ${school.shortName}, but your ${sat} SAT is below their 25th percentile (${school.sat25}). At ${school.acceptanceRate}%, you're in Hail Mary territory.\n\nTwo options: (1) retake the SAT — even 50 points closer to ${school.sat25} changes the picture, or (2) go test-optional if your other credentials are strong. ${school.testPolicy === "required" ? `Problem: ${school.shortName} REQUIRES test scores.` : `${school.shortName} is test-optional — consider not submitting.`}\n\n`;
    } else {
      assistant = `${name}, your stats (${gpa}${sat ? `/${sat}` : ""}) are ${sat && sat >= school.sat25 ? "in range" : "below target"} for ${school.shortName} (${school.acceptanceRate}%, SAT ${school.sat25}-${school.sat75}, GPA ${school.gpaAvg}). At sub-${Math.ceil(school.acceptanceRate)}% schools, even matched profiles face long odds. You're in Hail Mary territory.\n\n${school.shortName} rates ${topFactors} as Very Important. Your ${acts[0]} is ${ec >= 7 ? "strong — but does it constitute a clear spike?" : "a starting point, but not yet at the level that moves the needle here"}.\n\n`;
    }
    assistant += `Keep ${school.shortName} as a reach, but build the rest of your list where your profile gives you a real shot.`;
  } else if (band.band === "Long Shot") {
    assistant = `${name}, at ${school.shortName} (${school.acceptanceRate}%), your ${gpa}${sat ? `/${sat}` : ""} puts you in Long Shot territory — you're in the conversation but not favored.\n\nWhat would move you to Possible: ${ec < 7 ? "a stronger extracurricular spike — your " + acts[0] + " needs more depth or measurable impact" : "an exceptional essay that connects your " + acts[0] + " to " + school.shortName + "'s specific programs"}. ${school.shortName} values ${topFactors}.\n\n${school.earlyOption ? `Applying ${school.earlyOption} would significantly boost your odds.` : "Focus your energy on essay quality — that's your biggest lever here."}`;
  } else if (band.band === "Possible") {
    assistant = `${name}, good news: at ${school.shortName} (${school.acceptanceRate}%), you're in Possible territory. Your ${gpa}${sat ? `/${sat}` : ""} is competitive here.\n\nTo tip the scale from Possible to likely: (1) write a specific "why ${school.shortName}" essay naming real programs — not 'great academics' but specific courses, labs, or professors related to ${major}, (2) strong teacher recs from junior year, (3) ${school.shortName} ${w.spike >= 2 ? "values spike/talent — lean into your " + acts[0] : "is more numbers-driven — keep your grades and scores strong"}.\n\nThis should be a target school on your list — invest real essay time here.`;
  } else {
    assistant = `${name}, at ${school.shortName} (${school.acceptanceRate}%), your ${gpa}${sat ? `/${sat}` : ""} puts you in Very Likely territory. Your stats exceed the median.\n\nThis is a safety or comfortable target. But don't coast — still write a genuine application. Schools practice yield protection: they reject applicants who seem overqualified and uninterested. Show genuine enthusiasm for ${major} at ${school.shortName} specifically.\n\nWith your profile, you can aim higher on your list — have you considered ${COLLEGES.filter(c => c.acceptanceRate < school.acceptanceRate * 0.5).slice(i % 5, i % 5 + 2).map(c => c.shortName).join(" or ")}?`;
  }

  assistant += `\n\n${concern === "Is my spike strong enough?" ? "What's the single biggest achievement or project from your " + acts[0] + "?" : concern === "Will my GPA hold me back?" ? "What's your course rigor look like — how many APs/IB/Honors?" : concern === "Should I go test-optional?" ? (sat ? `At ${school.shortName}, your ${sat} is ${sat >= school.sat25 ? "above the 25th percentile — submit it." : "below the 25th — consider going test-optional."}` : "Without a score, focus on making your activities and essays extraordinary.") : concern === "Can my family afford this school?" ? `${school.shortName} is ${school.needBlind ? "need-blind" : "need-aware"} and ${school.meetsFullNeed ? "meets full demonstrated need — run their net price calculator." : "does NOT guarantee meeting full need — compare aid packages."}` : "What's the ONE thing you want admissions to remember about you?"}`;

  emit(user, assistant);

  if (count % 1000 === 0) console.log(`  ${count} examples...`);
}

const path = "C:\\Users\\itmoh\\Downloads\\ADMITPATH_10K_TRAINING_DATA.jsonl";
fs.writeFileSync(path, out);
console.log(`\nDone! ${count} training examples written.`);
console.log(`File: ${path}`);
console.log(`Size: ${(Buffer.byteLength(out) / 1024 / 1024).toFixed(1)} MB`);
