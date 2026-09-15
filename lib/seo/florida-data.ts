/**
 * Florida hyper-local SEO page data for AdmitPath.
 * Florida is the #1 geographic wedge per Doc 07 Semrush data:
 * - Niche's college pages are weaker than their city pages (their moat is zip codes)
 * - Founder is a current FL HS student (Pine View/Osprey) = authentic local E-E-A-T
 * - UF/FSU/UCF/USF queries have medium difficulty with strong volume
 *
 * Each entry drives a /florida/[slug] page with unique local data.
 */

export interface FloridaPageData {
  slug: string;
  title: string;
  region: string;
  type: "college" | "county" | "scholarship" | "guide";
  description: string;
  keyStats: Array<{ label: string; value: string }>;
  topSchools?: string[];
  pipeline?: string;
  sections: string[];
  faqs: Array<{ q: string; a: string }>;
  keywords: string[];
  metaTitle: string;
  metaDesc: string;
}

export const FLORIDA_PAGES: FloridaPageData[] = [
  {
    slug: "admissions-guide",
    title: "College Admissions for Florida Students: Complete 2026 Guide",
    region: "Statewide",
    type: "guide",
    description: "The definitive guide to college admissions for Florida high school students. Covers Bright Futures, Florida Prepaid, in-state admissions advantages, UF/FSU/UCF strategies, and the Florida high school to top college pipeline.",
    keyStats: [
      { label: "Florida HS graduates per year", value: "~220,000" },
      { label: "Public universities", value: "12 (State University System)" },
      { label: "Bright Futures recipients annually", value: "~110,000" },
      { label: "Average UF in-state tuition", value: "~$6,380/year" },
    ],
    topSchools: ["University of Florida", "Florida State University", "University of Central Florida", "University of South Florida", "Florida International University", "University of Miami"],
    pipeline: "Florida's State University System offers some of the best value in American higher education. UF ranks #1 public university at under $7K in-state tuition. Bright Futures covers 75-100% of tuition for qualifying students.",
    sections: [
      "Florida's State University System Overview",
      "Bright Futures Scholarship: How to Qualify",
      "Florida Prepaid: Is It Worth It in 2026?",
      "UF vs FSU vs UCF: Which Is Right for You?",
      "Dual Enrollment in Florida: Strategic Guide",
      "AP vs IB vs AICE: Which Florida Pathway?",
      "Florida Residency Requirements for In-State Tuition",
      "Top Florida Private Universities",
      "Out-of-State from Florida: When It Makes Sense",
      "FAQ: Florida College Admissions",
    ],
    faqs: [
      { q: "What GPA and SAT do I need for UF?", a: "UF's middle 50% admitted GPA is 4.4-4.6 weighted. Middle 50% SAT is 1350-1490. UF is holistic: strong essays, extracurriculars, and Florida residency are significant factors. Acceptance rate is approximately 23%." },
      { q: "How does Bright Futures work?", a: "Bright Futures has two tiers: Florida Academic Scholars (FAS) covers 100% of tuition + fees + $300/semester books. Florida Medallion Scholars (FMS) covers 75% of tuition. FAS requires a 3.5 weighted GPA + 1330 SAT or 29 ACT + 100 community service hours + 16 required credit hours." },
      { q: "Is Florida Prepaid worth it in 2026?", a: "Florida Prepaid locks in today's tuition rates for future use. If your child will attend a Florida public university, it is almost always worth it. The 4-year university plan costs approximately $25,000-$35,000 depending on when purchased, vs current 4-year tuition of ~$25,000+." },
      { q: "What is dual enrollment in Florida?", a: "Dual enrollment allows Florida HS students to take college courses at state colleges for free while earning both HS and college credit. It is one of the most underused advantages in Florida education. Students can graduate with an AA degree alongside their HS diploma." },
      { q: "Should I do AP or IB in Florida?", a: "AP offers more flexibility (pick individual courses). IB Diploma offers a cohesive program that impresses admissions officers. AICE (Cambridge) is strong at Florida schools that offer it. For UF specifically, the IB Diploma receives 30 college credits -- more than AP typically yields." },
      { q: "Can I get into UF with a 3.8 GPA?", a: "A 3.8 unweighted is competitive but below the median. Strengthen your application with strong essays, meaningful extracurriculars, and a solid SAT/ACT score. Consider early admission programs and supplemental essay quality." },
    ],
    keywords: ["college admissions florida", "florida college admissions guide", "UF admissions requirements", "bright futures scholarship", "florida college planning"],
    metaTitle: "College Admissions for Florida Students 2026 | AdmitPath",
    metaDesc: "Complete Florida college admissions guide. Bright Futures, UF/FSU/UCF strategies, dual enrollment, and AP/IB pathways. Built by a Florida HS student.",
  },
  {
    slug: "uf-admissions",
    title: "How to Get Into UF (University of Florida) in 2026",
    region: "Gainesville",
    type: "college",
    description: "The most comprehensive UF admissions guide on the internet. Real CDS data, acceptance rate trends, essay strategy, and what actually gets students admitted to UF.",
    keyStats: [
      { label: "Acceptance rate", value: "~23%" },
      { label: "Middle 50% GPA (weighted)", value: "4.4-4.6" },
      { label: "Middle 50% SAT", value: "1350-1490" },
      { label: "Middle 50% ACT", value: "31-34" },
      { label: "In-state tuition", value: "~$6,380/year" },
      { label: "US News ranking", value: "#1 Public University" },
    ],
    topSchools: ["Pine View School", "Buchholz High School", "Stanton College Prep", "International Baccalaureate Magnet at Palm Harbor", "NSU University School"],
    pipeline: "UF receives ~60,000 applications annually and admits ~14,000. Florida residents have a significant advantage. Innovation Academy and PaCE (online start) pathways increase total admits. Top feeder high schools send 50-100+ students to UF annually.",
    sections: [
      "UF Admissions Snapshot 2026",
      "What UF Actually Looks For",
      "UF Supplemental Essay Strategy",
      "UF Innovation Academy: The Hidden Pathway",
      "UF PaCE Program: When It Makes Sense",
      "Top Feeder High Schools to UF",
      "UF by Major: Competitive Programs",
      "Financial Aid at UF: Net Price Reality",
      "UF vs FSU: The Real Comparison",
      "FAQ: Getting Into UF",
    ],
    faqs: [
      { q: "What is UF's acceptance rate?", a: "UF's acceptance rate is approximately 23% for the most recent admitted class. This includes Innovation Academy and PaCE admits. The main campus traditional admit rate is closer to 18-20%." },
      { q: "Does UF have supplemental essays?", a: "Yes. UF requires two short-answer questions on the Coalition or Common App. Topics change annually but typically ask about your academic interests and how you will contribute to the UF community." },
      { q: "What is UF Innovation Academy?", a: "Innovation Academy is UF's spring/summer enrollment program. Students take classes in spring and summer, leaving fall free for internships. It is slightly less competitive than traditional fall admission and offers the same UF degree." },
      { q: "Is UF test-optional?", a: "Check UF's current policy for the application year. UF has shifted between test-required and test-optional in recent years. Submitting strong SAT/ACT scores (1400+ SAT, 32+ ACT) is generally advantageous." },
      { q: "What GPA do I need for UF?", a: "UF's middle 50% weighted GPA is 4.4-4.6. A 4.0 weighted is below median but not impossible. Strength of curriculum (AP/IB/DE load), essay quality, and extracurriculars all factor in." },
    ],
    keywords: ["how to get into UF", "UF acceptance rate", "UF admissions 2026", "university of florida admissions", "UF essay prompts"],
    metaTitle: "How to Get Into UF (University of Florida) 2026 | AdmitPath",
    metaDesc: "UF acceptance rate is 23%. Middle 50% SAT: 1350-1490. Complete admissions guide with essay strategy, Innovation Academy tips, and top feeder schools. Built by a FL student.",
  },
  {
    slug: "fsu-admissions",
    title: "How to Get Into FSU (Florida State University) in 2026",
    region: "Tallahassee",
    type: "college",
    description: "Complete FSU admissions guide with real CDS data, essay tips, and honest admissions strategy for Florida students.",
    keyStats: [
      { label: "Acceptance rate", value: "~25%" },
      { label: "Middle 50% GPA (weighted)", value: "4.1-4.5" },
      { label: "Middle 50% SAT", value: "1290-1430" },
      { label: "In-state tuition", value: "~$6,500/year" },
      { label: "US News ranking", value: "Top 25 Public" },
    ],
    sections: [
      "FSU Admissions Snapshot 2026",
      "What FSU Values in Applicants",
      "FSU vs UF: Honest Comparison",
      "FSU Honors Program: How to Get In",
      "Top Majors at FSU",
      "FAQ: Getting Into FSU",
    ],
    faqs: [
      { q: "What is FSU's acceptance rate?", a: "FSU's acceptance rate is approximately 25%. It has become significantly more selective over the past 5 years as applications have surged." },
      { q: "Is FSU harder to get into than UCF?", a: "Yes. FSU is more selective than UCF. FSU's middle 50% SAT is 1290-1430 vs UCF's 1210-1380. FSU's acceptance rate (~25%) is lower than UCF's (~30-35%)." },
      { q: "Does FSU require supplemental essays?", a: "FSU uses the Common App and requires a short-answer response about why you want to attend FSU. This is your opportunity to show specific knowledge of FSU programs." },
    ],
    keywords: ["how to get into FSU", "FSU acceptance rate", "FSU admissions 2026", "florida state university admissions"],
    metaTitle: "How to Get Into FSU (Florida State) 2026 | AdmitPath",
    metaDesc: "FSU acceptance rate is 25%. Middle 50% SAT: 1290-1430. Complete admissions guide with essay tips and honest strategy. Built by a Florida student.",
  },
  {
    slug: "ucf-admissions",
    title: "How to Get Into UCF (University of Central Florida) in 2026",
    region: "Orlando",
    type: "college",
    description: "Complete UCF admissions guide. UCF is the largest university in America by enrollment. Strong engineering, CS, and business programs.",
    keyStats: [
      { label: "Acceptance rate", value: "~30-35%" },
      { label: "Middle 50% GPA (weighted)", value: "3.9-4.4" },
      { label: "Middle 50% SAT", value: "1210-1380" },
      { label: "In-state tuition", value: "~$6,400/year" },
      { label: "Enrollment", value: "~72,000 (largest in US)" },
    ],
    sections: [
      "UCF Admissions Snapshot 2026",
      "UCF's Strongest Programs",
      "UCF Burnett Honors College",
      "UCF DirectConnect: Guaranteed Transfer Path",
      "UCF vs UF vs FSU",
      "FAQ: Getting Into UCF",
    ],
    faqs: [
      { q: "What is UCF's acceptance rate?", a: "UCF's acceptance rate is approximately 30-35%. Despite being less selective than UF or FSU, UCF's competitive programs (Computer Science, Engineering, Nursing) have significantly lower program-specific admit rates." },
      { q: "What is UCF DirectConnect?", a: "DirectConnect guarantees UCF admission to students who complete an AA degree at a Florida state college partner. It is the most reliable path for students who want UCF but may not get in as freshmen." },
    ],
    keywords: ["how to get into UCF", "UCF acceptance rate", "UCF admissions 2026", "university of central florida admissions"],
    metaTitle: "How to Get Into UCF (University of Central Florida) 2026 | AdmitPath",
    metaDesc: "UCF acceptance rate is 30-35%. Largest US university. Strong in CS, engineering, and business. Complete admissions guide. Built by a FL student.",
  },
  {
    slug: "usf-admissions",
    title: "How to Get Into USF (University of South Florida) in 2026",
    region: "Tampa",
    type: "college",
    description: "Complete USF admissions guide. USF is a rising research university with strong STEM programs and rapid selectivity increases.",
    keyStats: [
      { label: "Acceptance rate", value: "~28-33%" },
      { label: "Middle 50% GPA (weighted)", value: "4.0-4.4" },
      { label: "Middle 50% SAT", value: "1230-1390" },
      { label: "In-state tuition", value: "~$6,400/year" },
      { label: "Research classification", value: "R1 (Very High Research)" },
    ],
    sections: [
      "USF Admissions Snapshot 2026",
      "USF's Rise: From Commuter School to R1",
      "USF Honors College",
      "USF Morsani College of Medicine Pathway",
      "USF vs UF vs UCF",
      "FAQ: Getting Into USF",
    ],
    faqs: [
      { q: "Is USF getting harder to get into?", a: "Yes. USF's acceptance rate has dropped significantly in the past decade as the university has risen in rankings and achieved R1 research status. It is now among the more selective Florida public universities." },
      { q: "What is USF known for academically?", a: "USF is strong in STEM fields, particularly health sciences, engineering, and marine biology. The Morsani College of Medicine is nationally ranked. Business and education programs are also competitive." },
    ],
    keywords: ["how to get into USF", "USF acceptance rate", "USF admissions 2026", "university of south florida admissions"],
    metaTitle: "How to Get Into USF (University of South Florida) 2026 | AdmitPath",
    metaDesc: "USF acceptance rate is 28-33%. Rising R1 research university. Strong STEM and health sciences. Complete admissions guide. Built by a FL student.",
  },
  {
    slug: "fiu-admissions",
    title: "How to Get Into FIU (Florida International University) in 2026",
    region: "Miami",
    type: "college",
    description: "Complete FIU admissions guide. FIU is a top-ranked university for Hispanic students with strong business, hospitality, and international relations programs.",
    keyStats: [
      { label: "Acceptance rate", value: "~55-60%" },
      { label: "Middle 50% GPA (weighted)", value: "3.7-4.2" },
      { label: "Middle 50% SAT", value: "1120-1290" },
      { label: "In-state tuition", value: "~$6,500/year" },
      { label: "Enrollment", value: "~58,000" },
    ],
    sections: [
      "FIU Admissions Snapshot 2026",
      "FIU's Strongest Programs",
      "FIU Honors College",
      "FIU vs UM: Miami University Comparison",
      "FAQ: Getting Into FIU",
    ],
    faqs: [
      { q: "Is FIU a good school?", a: "FIU is a top-ranked public university, particularly for hospitality management (#1 nationally), international business, and STEM programs. It is the 4th largest university in the US by enrollment." },
      { q: "What is FIU's acceptance rate?", a: "FIU's acceptance rate is approximately 55-60%. While less selective than UF or FSU overall, competitive programs like Honors, Nursing, and Engineering have lower admit rates." },
    ],
    keywords: ["how to get into FIU", "FIU acceptance rate", "FIU admissions 2026", "florida international university admissions"],
    metaTitle: "How to Get Into FIU (Florida International University) 2026 | AdmitPath",
    metaDesc: "FIU acceptance rate is 55-60%. #1 hospitality program nationally. Strong international business. Complete admissions guide. Built by a FL student.",
  },
  {
    slug: "um-admissions",
    title: "How to Get Into UM (University of Miami) in 2026",
    region: "Coral Gables",
    type: "college",
    description: "Complete University of Miami admissions guide. UM is Florida's top private research university with selective admissions, strong scholarships, and D1 athletics.",
    keyStats: [
      { label: "Acceptance rate", value: "~19%" },
      { label: "Middle 50% GPA (weighted)", value: "4.3-4.7" },
      { label: "Middle 50% SAT", value: "1360-1500" },
      { label: "Tuition", value: "~$57,000/year" },
      { label: "Need-met", value: "~95% of demonstrated need" },
    ],
    sections: [
      "UM Admissions Snapshot 2026",
      "UM Scholarships: How to Get the Stamps Scholarship",
      "UM Early Decision vs Regular Decision",
      "UM vs UF: Private vs Public Trade-Off",
      "UM Medical School and Pre-Med Pipeline",
      "FAQ: Getting Into University of Miami",
    ],
    faqs: [
      { q: "What is UM's acceptance rate?", a: "The University of Miami's acceptance rate is approximately 19%, making it the most selective university in Florida. Early Decision applicants have a higher admit rate (~30-35%)." },
      { q: "Is UM worth the cost vs UF?", a: "UM costs ~$57K/year vs UF's ~$6.4K in-state. However, UM meets ~95% of demonstrated financial need and offers merit scholarships including the full-ride Stamps Scholarship. For students receiving strong aid, the gap narrows significantly." },
      { q: "What is the Stamps Scholarship at UM?", a: "The Stamps Scholarship is a full-ride merit award covering tuition, room, board, and a $12,000 enrichment fund. It is the most prestigious merit award at UM, awarded to approximately 5-8 students per year." },
    ],
    keywords: ["how to get into university of miami", "UM acceptance rate", "university of miami admissions 2026", "UM vs UF"],
    metaTitle: "How to Get Into University of Miami 2026 | AdmitPath",
    metaDesc: "UM acceptance rate is 19%. Florida's most selective university. Stamps Scholarship, ED strategy, and comparison to UF. Built by a FL student.",
  },
  {
    slug: "bright-futures",
    title: "Florida Bright Futures Scholarship 2026: Complete Guide",
    region: "Statewide",
    type: "scholarship",
    description: "Everything Florida students need to know about Bright Futures. Requirements, deadlines, calculation, and strategy for Florida Academic Scholars and Florida Medallion Scholars tiers.",
    keyStats: [
      { label: "FAS coverage", value: "100% tuition + fees + $300/semester books" },
      { label: "FMS coverage", value: "75% tuition + fees" },
      { label: "FAS GPA requirement", value: "3.5 weighted" },
      { label: "FAS SAT requirement", value: "1330 (or 29 ACT)" },
      { label: "Community service hours", value: "100 hours required" },
      { label: "Annual recipients", value: "~110,000 students" },
    ],
    sections: [
      "Bright Futures 2026 Requirements",
      "FAS vs FMS: Which Tier Are You Targeting?",
      "The SAT/ACT Score Strategy for Bright Futures",
      "Community Service Hour Requirements and Strategy",
      "Bright Futures + Florida Prepaid: Stacking Benefits",
      "What Happens If You Lose Bright Futures in College",
      "Bright Futures for Dual Enrollment Students",
      "FAQ: Bright Futures 2026",
    ],
    faqs: [
      { q: "What SAT score do I need for Bright Futures FAS?", a: "Florida Academic Scholars (FAS) requires a 1330 SAT or 29 ACT. This is based on your best composite score from a single sitting. Superscoring is NOT used for Bright Futures." },
      { q: "Can I get Bright Futures with a 3.4 GPA?", a: "A 3.4 weighted GPA qualifies for Florida Medallion Scholars (FMS, 75% tuition) but NOT Florida Academic Scholars (FAS, 100% tuition). FAS requires 3.5 weighted GPA." },
      { q: "Do community service hours expire?", a: "Community service hours must be completed during high school (grades 9-12). They do not expire within that period. You need 100 total hours, documented and signed by a supervisor." },
      { q: "Can I use Bright Futures at a private university?", a: "Bright Futures can be used at eligible Florida private colleges, but the award amount is limited. It covers significantly more at public universities. Check the Florida Office of Student Financial Assistance for current eligible institutions." },
      { q: "What happens if my GPA drops in college?", a: "Bright Futures requires maintaining a minimum college GPA (varies by tier, typically 2.75 for FMS, 3.0 for FAS) and completing a minimum number of credit hours per academic year. If you fall below, you get a probationary period to recover." },
    ],
    keywords: ["bright futures scholarship", "florida bright futures 2026", "bright futures requirements", "FAS scholarship", "bright futures SAT score"],
    metaTitle: "Bright Futures Scholarship 2026: Complete Guide | AdmitPath",
    metaDesc: "Florida Bright Futures FAS covers 100% tuition with 3.5 GPA + 1330 SAT. Complete guide to requirements, deadlines, and strategies. Built by a FL student.",
  },
  {
    slug: "dual-enrollment-guide",
    title: "Dual Enrollment in Florida: The Ultimate Strategic Guide 2026",
    region: "Statewide",
    type: "guide",
    description: "How to strategically use Florida's dual enrollment program to earn college credit for free, build a competitive transcript, and potentially graduate with an AA degree alongside your HS diploma.",
    keyStats: [
      { label: "Cost to student", value: "$0 (state-funded)" },
      { label: "Credits transferable", value: "All 60 AA credits transfer to FL public universities" },
      { label: "Students enrolled", value: "~170,000 FL HS students" },
      { label: "Savings vs college tuition", value: "~$12,000-$15,000 (2 years of college)" },
    ],
    sections: [
      "What Is Dual Enrollment in Florida?",
      "Dual Enrollment vs AP vs IB: Strategic Comparison",
      "How to Start Dual Enrollment",
      "Best Courses to Take via Dual Enrollment",
      "How UF/FSU/UCF View Dual Enrollment",
      "Can You Graduate with an AA in High School?",
      "Dual Enrollment and Bright Futures Together",
      "FAQ: Florida Dual Enrollment",
    ],
    faqs: [
      { q: "Is dual enrollment free in Florida?", a: "Yes. Tuition, fees, and textbooks are covered by the state for eligible Florida high school students. There is no cost to the student or family." },
      { q: "Does dual enrollment count for Bright Futures?", a: "Dual enrollment courses count toward your high school GPA (which Bright Futures uses). However, dual enrollment grades on your college transcript can affect your college GPA, which matters for Bright Futures renewal." },
      { q: "How do UF and FSU view dual enrollment?", a: "UF and FSU view dual enrollment favorably as evidence of academic rigor. However, AP/IB courses are sometimes weighted slightly more in admissions because of standardized testing (AP exams, IB assessments). A mix of both is ideal." },
      { q: "Can I get my AA degree while in high school?", a: "Yes. Florida allows students to complete their AA degree through dual enrollment while still in high school. This requires careful planning starting in 10th or 11th grade and typically involves summer courses." },
    ],
    keywords: ["dual enrollment florida", "florida dual enrollment guide", "free college credits florida", "dual enrollment vs AP florida"],
    metaTitle: "Dual Enrollment in Florida 2026: Strategic Guide | AdmitPath",
    metaDesc: "Florida dual enrollment is free. Earn 60 college credits while in HS. Strategic guide on course selection, college admissions impact, and AA degree path.",
  },
  {
    slug: "sarasota-county-pipeline",
    title: "Sarasota County High Schools to Top Colleges: 2026 Pipeline Guide",
    region: "Sarasota",
    type: "county",
    description: "Where Sarasota County high school students go to college. Data on Pine View, Riverview, Sarasota High, Venice High, and North Port feeder patterns to UF, FSU, UCF, and top private universities.",
    keyStats: [
      { label: "HS students in Sarasota County", value: "~18,000" },
      { label: "High schools", value: "10 public + private" },
      { label: "Pine View IB students", value: "~200/year" },
      { label: "UF admits from Sarasota County", value: "~300-400/year" },
    ],
    topSchools: ["Pine View School", "Riverview High School", "Sarasota High School", "Venice High School", "North Port High School", "Booker High School (VPA)", "Cardinal Mooney Catholic"],
    sections: [
      "Sarasota County College Pipeline Overview",
      "Pine View School: The #1 Public School Pipeline",
      "Riverview High School College Outcomes",
      "Sarasota High School Programs and Outcomes",
      "Venice and North Port: South County Pathways",
      "Booker VPA: Arts + College Admissions",
      "SCF Dual Enrollment Opportunities",
      "FAQ: Sarasota County College Planning",
    ],
    faqs: [
      { q: "What is the best high school in Sarasota County for college admissions?", a: "Pine View School is Sarasota County's top feeder to selective colleges, with students regularly admitted to Ivy League, UF Honors, and top private universities. However, Riverview and Sarasota High also send strong students to UF/FSU." },
      { q: "How many Sarasota County students go to UF?", a: "Approximately 300-400 Sarasota County students enroll at UF each year across all pathways (traditional admission, Innovation Academy, PaCE, and transfer)." },
    ],
    keywords: ["sarasota county colleges", "pine view school college", "sarasota high school college outcomes", "sarasota county to UF"],
    metaTitle: "Sarasota County HS to College Pipeline 2026 | AdmitPath",
    metaDesc: "Where Sarasota County students go to college. Pine View, Riverview, Sarasota High feeder data to UF, FSU, and top universities. Built locally.",
  },
];

/** Total Florida pages in this dataset */
export const FLORIDA_PAGE_COUNT = FLORIDA_PAGES.length;

/** All Florida page slugs for generateStaticParams */
export const FLORIDA_SLUGS = FLORIDA_PAGES.map((p) => p.slug);

/** Lookup Florida page by slug */
export function getFloridaPage(slug: string): FloridaPageData | undefined {
  return FLORIDA_PAGES.find((p) => p.slug === slug);
}
