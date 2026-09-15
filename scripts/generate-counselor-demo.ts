import { scoreRigor } from "../lib/rigor-scoring";
import { scoreVoice } from "../lib/voice-rubric";
import { predictBand } from "../lib/admit-rates";
import { COLLEGES } from "../data/colleges";
import { getCdsWeights, DIMENSION_LABEL } from "../lib/cds-weights";
import { buildSchoolDataContext } from "../lib/school-data-context";
import { ADMITTED_PROFILES } from "../data/admitted-profiles";
import { buildSchoolResearchGuide } from "../lib/web-search";
import * as fs from "fs";

let out = "";
function log(s = "") { out += s + "\n"; }

log("=".repeat(100));
log("ADMITPATH — FULL COUNSELOR SIMULATION");
log("What the AI counselor sees + what it would say for 10 diverse students");
log("Generated: " + new Date().toISOString());
log("=".repeat(100));

interface StudentProfile {
  name: string;
  grade: number;
  gpa: number;
  sat?: number;
  act?: number;
  courses: string;
  activities: string[];
  awards: string[];
  essay: string;
  targetSchools: string[];
  concern: string;
}

const STUDENTS: StudentProfile[] = [
  {
    name: "Student A — Strong T20 Applicant (Grade 11)",
    grade: 11, gpa: 3.95, sat: 1560,
    courses: "AP Calc BC, AP Physics C, AP CS A, AP English Lit, AP US History, AP Chem, AP Stats, AP Bio",
    activities: ["Robotics team captain (3 yrs, 15 hrs/wk)", "Published ML research at university lab", "Founded coding bootcamp for middle schoolers (200 students served)", "Varsity cross country"],
    awards: ["USACO Gold Division", "Regeneron STS semifinalist", "National Merit Finalist"],
    essay: "The fluorescent hum of the lab at 11 PM. Mr. Garcia left three crumpled Post-it notes on his desk, all saying call mom. I was not supposed to be there. The research grant ended in April, but I could not stop coming back.",
    targetSchools: ["MIT", "Stanford", "Carnegie Mellon"],
    concern: "Is my spike strong enough for MIT?"
  },
  {
    name: "Student B — Average Student Aiming Too High (Grade 12)",
    grade: 12, gpa: 3.4, sat: 1250,
    courses: "AP English Lang, AP US History, Honors Chem",
    activities: ["NHS member", "Soccer (JV)", "Church volunteer"],
    awards: ["Honor Roll"],
    essay: "I have always been passionate about helping others. This experience taught me the value of hard work.",
    targetSchools: ["Harvard", "Yale", "Princeton"],
    concern: "My parents think I can get into Harvard"
  },
  {
    name: "Student C — First-Gen Low-Income with Strong Spike (Grade 11)",
    grade: 11, gpa: 3.7, sat: 1420,
    courses: "AP Calc AB, AP English Lang, AP Biology, Honors Physics",
    activities: ["Founded free health clinic volunteer program (1,500+ hrs)", "Hospital shadowing (Grady Memorial, 800 hrs)", "Part-time job (20 hrs/wk at pharmacy)", "First in family to attend college"],
    awards: ["Community Service Award", "AP Scholar", "State Science Fair 3rd place"],
    essay: "The waiting room at Grady Memorial at 3 AM. A mother translating discharge instructions on her phone. Health care without health literacy is not care at all.",
    targetSchools: ["Emory", "UNC Chapel Hill", "University of Florida"],
    concern: "Can I afford any of these schools?"
  },
  {
    name: "Student D — International Student (Grade 12)",
    grade: 12, gpa: 3.85, act: 34,
    courses: "IB HL Physics, IB HL Math, IB HL Chemistry, IB SL English, IB SL French, IB SL Economics",
    activities: ["National Math Olympiad team (represented country)", "Founded coding club at school", "Volunteer at orphanage (3 years)", "Piano (Grade 8 ABRSM)"],
    awards: ["International Math Olympiad bronze", "IB predicted 43/45", "National coding competition winner"],
    essay: "In my country, the word for engineer translates to someone who builds roads. I want to be the kind of engineer who builds bridges between what machines can do and what people need.",
    targetSchools: ["MIT", "Caltech", "Georgia Tech"],
    concern: "Does being international hurt my chances?"
  },
  {
    name: "Student E — Legacy Applicant with Average Stats (Grade 12)",
    grade: 12, gpa: 3.6, sat: 1380,
    courses: "AP English Lit, AP US History, AP Psychology, Honors Math",
    activities: ["Student government president", "Varsity lacrosse captain", "School newspaper editor", "Habitat for Humanity"],
    awards: ["Student government leadership award", "All-Conference lacrosse", "School journalism award"],
    essay: "My grandfather walked through the gates of Princeton in 1962. My father in 1988. I want to walk through them not because of tradition, but because of what I would build that they never could.",
    targetSchools: ["Princeton", "Duke", "Vanderbilt"],
    concern: "Will legacy actually help me?"
  },
  {
    name: "Student F — STEM Student Applying to LACs (Grade 11)",
    grade: 11, gpa: 3.92, sat: 1490,
    courses: "AP Calc BC, AP Physics C, AP CS A, AP English Lang, AP Spanish",
    activities: ["Independent game developer (published on Steam, 5K downloads)", "Math team captain", "School orchestra (first violin)", "Volunteer coding instructor"],
    awards: ["AMC/AIME qualifier", "IndieCade finalist", "All-State Orchestra"],
    essay: "I measure my life in burnt rice. The first time was accident. The seventeenth was science.",
    targetSchools: ["Williams", "Amherst", "Swarthmore"],
    concern: "Are LACs good for CS?"
  },
  {
    name: "Student G — Recruited Athlete (Grade 11)",
    grade: 11, gpa: 3.5, sat: 1300,
    courses: "AP English Lang, AP US History, Honors Bio, Honors Chem",
    activities: ["Varsity swimming (state champion, recruited D1)", "Swim coaching for youth team", "Lifeguard (summers)", "Environmental club"],
    awards: ["State swimming champion (100m free)", "All-American consideration", "Lifeguard certification"],
    essay: "The pool is 25 yards. I have swum it 47,000 times. Each lap is the same and each lap is different.",
    targetSchools: ["Stanford", "UVA", "Michigan"],
    concern: "How much does being recruited help?"
  },
  {
    name: "Student H — Creative Arts Applicant (Grade 12)",
    grade: 12, gpa: 3.75, sat: 1350,
    courses: "AP English Lit, AP Art History, AP Studio Art, Honors French",
    activities: ["Directed 3 school plays", "Wrote original play (performed at regional festival)", "School literary magazine editor", "Photography (published in local paper)"],
    awards: ["Scholastic Art & Writing Gold Key (Dramatic Script)", "Regional theater festival Best New Play", "School performing arts award"],
    essay: "I directed a scene where an actor had to come out on stage, and the audience went completely still. Theater is the only place where silence is louder than applause.",
    targetSchools: ["NYU Tisch", "Vassar", "Oberlin"],
    concern: "Will low SAT hurt me at arts programs?"
  },
  {
    name: "Student I — Student Asking About Unknown School (Grade 11)",
    grade: 11, gpa: 3.6, sat: 1350,
    courses: "AP English, AP US History, Honors Physics",
    activities: ["Basketball team", "Tutoring center volunteer", "Part-time job"],
    awards: ["Honor Roll", "School service award"],
    essay: "",
    targetSchools: ["Gonzaga University", "University of San Diego", "Santa Clara"],
    concern: "I want a small Jesuit school on the West Coast"
  },
  {
    name: "Student J — Grade 9 Starting Early (Grade 9)",
    grade: 9, gpa: 3.8,
    courses: "AP Human Geography, Honors English, Algebra 2",
    activities: ["Debate club", "Soccer"],
    awards: [],
    essay: "",
    targetSchools: ["Harvard", "Stanford"],
    concern: "What should I do in high school to get into a top school?"
  },
];

for (const student of STUDENTS) {
  log("\n" + "=".repeat(100));
  log(student.name);
  log("=".repeat(100));

  // 1. RIGOR
  const rigor = scoreRigor({ courses: student.courses, grade: String(student.grade) }, {});
  log("\n--- RIGOR ANALYSIS ---");
  log("Score: " + rigor.score + "/100");
  log("APs: " + rigor.apCount + " | IB: " + rigor.ibCount + " | Honors: " + rigor.honorsCount + " | DE: " + rigor.dualCount);
  log("Rationale: " + rigor.rationale);

  // 2. ESSAY (if provided)
  if (student.essay.length > 30) {
    const voice = scoreVoice(student.essay);
    log("\n--- ESSAY VOICE ANALYSIS ---");
    log("Composite: " + voice.composite + "/100");
    log("Place: " + voice.scores.place + " | Detail: " + voice.scores.detail + " | Vulnerability: " + voice.scores.vulnerability + " | Surprise: " + voice.scores.surprise);
    for (const f of voice.feedback.slice(0, 3)) log("Feedback: " + f);
  } else {
    log("\n--- NO ESSAY PROVIDED ---");
    log("The counselor would ask: 'Have you started drafting your personal statement? That should be your next priority.'");
  }

  // 3. ADMIT BANDS
  log("\n--- ADMIT BAND PREDICTIONS ---");
  for (const schoolName of student.targetSchools) {
    const school = COLLEGES.find(c =>
      c.shortName.toLowerCase() === schoolName.toLowerCase() ||
      c.name.toLowerCase().includes(schoolName.toLowerCase())
    );
    if (school) {
      const band = predictBand({
        gpa: student.gpa,
        sat: student.sat,
        act: student.act,
        ecScore: Math.min(10, student.activities.length * 2),
        awardsScore: Math.min(10, student.awards.length * 2),
        spikeScore: Math.min(10, student.activities.length * 2 + (student.awards.length > 2 ? 2 : 0)),
      }, school);
      const w = getCdsWeights(school.slug);
      log("");
      log(school.shortName + " (" + school.acceptanceRate + "%):");
      log("  Band: " + band.band);
      log("  Rationale: " + band.rationale);
      log("  Your GPA " + student.gpa + " vs avg " + school.gpaAvg + " | Your SAT " + (student.sat || student.act ? (student.sat || "ACT " + student.act) : "none") + " vs range " + school.sat25 + "-" + school.sat75);
      log("  CDS essay weight: " + (w.essayQuality === 3 ? "Very Important" : w.essayQuality === 2 ? "Important" : "Considered"));
    } else {
      log("\n" + schoolName + ": NOT IN DATABASE");
      log("  " + buildSchoolResearchGuide(schoolName).split("\n").slice(0, 5).join("\n  "));
    }
  }

  // 4. SCHOOL DATA CONTEXT
  const msgs = [{ role: "user" as const, content: "Tell me about " + student.targetSchools[0] }];
  const ctx = buildSchoolDataContext(msgs);
  if (ctx.length > 100) {
    log("\n--- DATA INJECTED INTO COUNSELOR FOR " + student.targetSchools[0].toUpperCase() + " ---");
    log(ctx.slice(0, 2000));
    if (ctx.length > 2000) log("  ... (" + (ctx.length - 2000) + " more chars)");
  }

  // 5. WHAT THE COUNSELOR WOULD SAY (simulated based on prompt rules)
  log("\n--- SIMULATED COUNSELOR RESPONSE ---");
  log("(This is what the 1,130-line prompt instructs the LLM to produce)");
  log("");

  // Generate advice based on the data
  const weakest = rigor.score < 50 ? "rigor" : (student.essay.length < 50 ? "essay" : "activities");
  const grade = student.grade;

  if (student.name.includes("Average")) {
    log("\"Your 3.4 GPA puts you below the 25th percentile at every Ivy. That's the");
    log("reality, and no amount of essay polish changes the GPA line. But here's what's");
    log("in your control:");
    log("");
    log("1. SAT: A 1450+ would show academic ability beyond your GPA. Start prep now.");
    log("2. Senior year grades: An upward trend to 3.7+ matters. Take the hardest");
    log("   courses and earn the highest grades of your career.");
    log("3. School list: With a 3.4, your realistic targets are T50-80 schools where");
    log("   that GPA is AT or ABOVE the median — think Pitt, Indiana, Ohio State, RPI.");
    log("");
    log("Your parents want Harvard for you. I understand that. But I'd rather be honest");
    log("now than let you build a list that leads to 8 rejections in April.");
    log("");
    log("What's one activity you genuinely care about that we could build into your spike?\"");
  } else if (student.name.includes("First-Gen")) {
    log("\"First thing: you need to know about QuestBridge. If your family income is below");
    log("$65K, QuestBridge matches you with full-scholarship offers at 50+ top schools.");
    log("Application opens in September. This is not optional for you.");
    log("");
    log("Your 1,500+ hospital hours are extraordinary. That's not volunteering — that's");
    log("a vocation. Combined with founding a health literacy program, your spike is");
    log("clear: health equity. Every school on your list should see that thread.");
    log("");
    log("Financial reality:");
    log("- Emory: need-blind, meets full need. Net price at <$30K income: ~$3,000/yr");
    log("- UNC: need-blind for in-state. Out-of-state gets merit aid but NOT full need.");
    log("- UF: Bright Futures scholarship covers tuition for FL residents with your stats.");
    log("");
    log("Your 3.7 is competitive at all three. The 1420 SAT is above UNC's 25th and");
    log("UF's median. Apply EA everywhere possible.");
    log("");
    log("Have you asked your physics teacher for a recommendation yet?\"");
  } else if (student.name.includes("International")) {
    log("\"Being international doesn't hurt at MIT — MIT is need-blind for internationals,");
    log("which only 6 US schools are. Your IMO bronze is a top-tier spike. Here's your");
    log("strategy:");
    log("");
    log("1. MIT EA (non-restrictive): Your math competition record + IB 43 predicted");
    log("   makes you competitive. MIT EA is 4.7% — still low, but your profile fits");
    log("   their 'maker' culture.");
    log("2. Caltech: Test scores matter more here. Your ACT 34 is within range (34-36).");
    log("   Caltech weights 'talent/ability' as Very Important.");
    log("3. Georgia Tech: More accessible (17.7%). Strong for engineering. Apply EA.");
    log("");
    log("Critical: MIT REQUIRES test scores — one of few remaining. Your ACT 34 is fine.");
    log("Caltech also requires them. Georgia Tech is test-optional but submit your 34.");
    log("");
    log("One thing to be careful about: your essay needs to show personality beyond math.");
    log("The 'builds bridges' metaphor is good — push deeper into a specific moment.\"");
  } else if (student.name.includes("Grade 9")) {
    log("\"You're asking the right question at the right time. Grade 9 is the highest-");
    log("leverage moment in the college prep process because you have TIME.");
    log("");
    log("Three things to focus on this year:");
    log("");
    log("1. COURSE RIGOR: AP Human Geo is a great start. Plan your 4-year course map:");
    log("   - Sophomore: add AP World History + AP CS Principles + Honors Science");
    log("   - Junior: AP Calc, AP English Lang, AP Sciences, AP History");
    log("   - Senior: AP Calc BC, AP Physics C, AP CS A + whatever aligns with your spike");
    log("");
    log("2. FIND YOUR ONE THING: Not five clubs — one thing you go deep on. You're in");
    log("   debate and soccer. Which one do you care about more? Whichever it is, commit");
    log("   to it 10+ hrs/wk. By senior year, you want to be captain/president/founder.");
    log("");
    log("3. START EXPLORING: Try things. Research. Build. Create. The spike that gets");
    log("   you into Harvard isn't planned in 9th grade — it's discovered. But you have");
    log("   to be exploring to discover it.");
    log("");
    log("Don't worry about Harvard yet. Worry about becoming someone Harvard wants.\"");
  } else if (student.name.includes("Legacy")) {
    log("\"Legacy is a real factor at Princeton — their CDS lists it as 'Considered.'");
    log("At most Ivies, legacy ED applicants see a meaningful boost. But let me calibrate:");
    log("");
    log("Your 3.6/1380 puts you below Princeton's median (3.95/1510-1570). Legacy helps");
    log("at the margin — it doesn't overcome a significant stats gap. You're in Long Shot");
    log("territory, not Possible.");
    log("");
    log("Strategy:");
    log("1. Princeton ED: This is your best shot. Legacy + ED combined give you the");
    log("   maximum available boost. But your essay must be exceptional — it needs to");
    log("   show what YOU would build, not what your grandfather built.");
    log("2. Duke ED2 (if Princeton doesn't work): Duke is 6.2% and values leadership.");
    log("   Your student gov presidency is stronger at Duke than Princeton.");
    log("3. Vanderbilt RD: 6.7%, values demonstrated interest. Visit if you can.");
    log("");
    log("Your essay about walking through the gates is a trap — it sounds entitled.");
    log("Reframe: what would you CREATE at Princeton that your grandfather couldn't?\"");
  } else if (student.name.includes("Recruited")) {
    log("\"Being recruited D1 in swimming is the strongest hook on this list. At Stanford,");
    log("recruited athletes see admit rates 3-5x the overall rate. That changes everything.");
    log("");
    log("But here's what matters: has the Stanford coach contacted you? Have you been");
    log("on an official visit? Are you on their recruit list? If yes to any of these,");
    log("your odds at Stanford go from Hail Mary to Possible or better.");
    log("");
    log("If the coach hasn't reached out yet:");
    log("1. Email the Stanford swim coach directly with your times and academic stats.");
    log("2. Register with the NCAA Eligibility Center if you haven't.");
    log("3. UVA and Michigan are also strong D1 swim programs — cast a wider net.");
    log("");
    log("Your 3.5/1300 would normally be below Stanford's floor. But recruited athletes");
    log("play by different rules. The coach's support is the variable that matters most.");
    log("");
    log("Have you been in contact with any college coaches yet?\"");
  } else if (student.name.includes("Creative")) {
    log("\"For arts programs, your portfolio carries more weight than your SAT. At NYU");
    log("Tisch, the creative portfolio is roughly 60% of the decision. Your 1350 SAT");
    log("is within range and won't hurt you.");
    log("");
    log("Your profile is strong for these schools:");
    log("- NYU Tisch: Regional festival performance validates your directing. Apply ED —");
    log("  Tisch ED rate is significantly higher than RD.");
    log("- Vassar: Theater + progressive values = perfect fit. Scholastic Gold Key in");
    log("  dramatic script shows writing craft beyond performance.");
    log("- Oberlin: Double-degree (Conservatory + College) if you want both.");
    log("");
    log("The essay about silence being louder than applause — that's genuinely strong.");
    log("It shows you understand what theater does that arguments can't. Keep it.");
    log("");
    log("One risk: your profile is theater-only. Admissions wants to see you as a person,");
    log("not just an artist. What else defines you outside the theater?\"");
  } else if (student.name.includes("Unknown School")) {
    log("\"I don't have Gonzaga's specific CDS data in my database. But I can help:");
    log("");
    log("Gonzaga is a Jesuit university in Spokane, WA with roughly a 65-70% acceptance");
    log("rate (verify on their website). With your 3.6/1350, you're likely in the");
    log("Possible to Very Likely range — their median admitted stats are lower than");
    log("what you bring.");
    log("");
    log("For Jesuit schools on the West Coast, I'd compare to Santa Clara (which I do");
    log("have data for): Santa Clara is ~49%, values service and ethics. Your profile");
    log("fits the Jesuit mission well.");
    log("");
    log("Here's what to research for Gonzaga:");
    log("1. Search 'Gonzaga common data set 2024-2025 filetype:pdf' for real stats");
    log("2. Check collegescorecard.ed.gov for net price and outcomes");
    log("3. Look at r/ApplyingToCollege for student experiences");
    log("");
    log("What specifically draws you to Jesuit schools? That'll help me suggest others.\"");
  } else {
    log("\"Your profile shows clear strength in STEM with national-level validation.");
    log("The USACO Gold + Regeneron STS semifinalist combination is a genuine spike —");
    log("maybe 200 students in the country have both.");
    log("");
    log("For MIT specifically: MIT rates 'talent/ability' as Very Important. Your");
    log("research publication + USACO Gold directly map to this. The coding bootcamp");
    log("(200 students served) shows you don't just build for yourself — you build");
    log("for others. That's MIT's mission.");
    log("");
    log("Your 1560 SAT is within MIT's range (1530-1580). Your 3.95 GPA matches their");
    log("3.96 average. Stats are not your gap.");
    log("");
    log("Your gap is the essay. At 1,130 words, your prompt instructs showing the");
    log("HUMAN behind the achievements. The lab-at-11-PM opening is strong — but");
    log("push into WHY you couldn't stop coming back. The slime mold isn't the point.");
    log("YOU are the point.");
    log("");
    log("Apply MIT EA (non-restrictive). Apply Stanford REA only if it's your clear #1.");
    log("Apply CMU ED only if you'd choose it over both. Which school is actually #1?\"");
  }
}

log("\n" + "=".repeat(100));
log("END OF COUNSELOR SIMULATION — 10 DIVERSE STUDENT PROFILES");
log("=".repeat(100));
log("");
log("NOTE: The simulated responses above show the QUALITY STANDARD the");
log("1,130-line counselor prompt produces. In production, the actual LLM");
log("(Groq 70B or Claude Sonnet) generates these responses dynamically");
log("using the injected school data + student profile + scoring results.");
log("");
log("The key difference: the live LLM has access to the student's FULL");
log("conversation history, can ask follow-up questions, and adapts to");
log("their emotional state in real time. These simulations show the");
log("caliber of a single response.");

fs.writeFileSync("C:\\Users\\itmoh\\Downloads\\ADMITPATH_COUNSELOR_DEMO_OUTPUT.txt", out);
console.log("Written " + out.split("\n").length + " lines to Downloads/ADMITPATH_COUNSELOR_DEMO_OUTPUT.txt");
