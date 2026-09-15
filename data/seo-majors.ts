/**
 * Major data for programmatic /majors/[major]/colleges pages.
 * Per the SEO playbook: 50 major × college fit pages.
 */

export type Major = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  relatedColleges: string[]; // college slugs from data/colleges.ts
  careerPaths: string[];
  faq: { question: string; answer: string }[];
};

export const MAJORS: Major[] = [
  {
    slug: "computer-science",
    name: "Computer Science",
    metaTitle: "Best Colleges for Computer Science (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for computer science majors ranked by program strength, career outcomes, and fit. MIT, Stanford, CMU, UC Berkeley, and 20+ more analyzed with IPEDS data.",
    keyword: "best colleges for computer science",
    relatedColleges: ["massachusetts-institute-of-technology", "stanford-university", "carnegie-mellon-university", "university-of-california-berkeley", "georgia-institute-of-technology", "university-of-illinois-urbana-champaign", "cornell-university", "university-of-michigan", "university-of-washington", "california-institute-of-technology"],
    careerPaths: ["Software Engineer", "Data Scientist", "Machine Learning Engineer", "Product Manager", "Systems Architect"],
    faq: [
      { question: "What is the best college for computer science?", answer: "MIT, Stanford, CMU, and UC Berkeley consistently rank at the top for CS. The 'best' depends on your priorities: MIT for research depth, Stanford for entrepreneurship, CMU for specialization breadth, Berkeley for value." },
      { question: "Do I need a CS degree to work in tech?", answer: "No, but a CS degree from a strong program provides foundational knowledge, recruiting access, and alumni networks that are hard to replicate. Bootcamps and self-study can work for some roles." },
      { question: "What SAT score do I need for top CS programs?", answer: "Top CS programs at MIT, Stanford, and CMU typically see admitted students with SATs above 1500. But holistic admissions means your projects, competitions, and essays matter as much as scores." },
    ],
  },
  {
    slug: "business",
    name: "Business / Finance",
    metaTitle: "Best Colleges for Business (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for business and finance majors. Wharton, Stern, Ross, and 20+ top undergraduate business programs compared by program strength and career placement.",
    keyword: "best colleges for business",
    relatedColleges: ["university-of-pennsylvania", "new-york-university", "university-of-michigan", "university-of-virginia", "university-of-southern-california", "georgetown-university", "emory-university", "washington-university-in-st-louis", "indiana-university-bloomington", "university-of-texas-austin"],
    careerPaths: ["Investment Banking Analyst", "Management Consultant", "Financial Analyst", "Product Marketing Manager", "Entrepreneur"],
    faq: [
      { question: "Is Wharton the best business school for undergrad?", answer: "Wharton (UPenn) is widely considered the top undergraduate business program. But Stern (NYU), Ross (Michigan), and McIntire (UVA) place extremely well in finance and consulting." },
      { question: "Should I major in business or economics?", answer: "Economics is more analytical and flexible; business is more applied and vocational. For finance careers, either works. For consulting, economics degrees from top schools can be equally effective." },
    ],
  },
  {
    slug: "engineering",
    name: "Engineering",
    metaTitle: "Best Colleges for Engineering (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for engineering majors. MIT, Stanford, Georgia Tech, Caltech, and 20+ top engineering programs ranked by specialization, research, and career outcomes.",
    keyword: "best colleges for engineering",
    relatedColleges: ["massachusetts-institute-of-technology", "stanford-university", "georgia-institute-of-technology", "california-institute-of-technology", "university-of-michigan", "cornell-university", "purdue-university", "university-of-illinois-urbana-champaign", "carnegie-mellon-university", "university-of-california-berkeley"],
    careerPaths: ["Mechanical Engineer", "Civil Engineer", "Biomedical Engineer", "Electrical Engineer", "Aerospace Engineer"],
    faq: [
      { question: "What is the best engineering school in the US?", answer: "MIT is generally ranked #1 for engineering overall. Stanford, Georgia Tech, Caltech, and UC Berkeley round out the top 5. Rankings vary by engineering discipline." },
      { question: "Can I switch engineering specializations in college?", answer: "At most schools, yes — especially in the first two years when coursework overlaps. Some competitive specializations (like CS at certain schools) may have internal transfer requirements." },
    ],
  },
  {
    slug: "pre-med",
    name: "Pre-Med / Biology",
    metaTitle: "Best Colleges for Pre-Med (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for pre-med students. Medical school acceptance rates, research opportunities, and advising quality at Johns Hopkins, WashU, Emory, and 20+ top pre-med schools.",
    keyword: "best colleges for pre-med",
    relatedColleges: ["johns-hopkins-university", "washington-university-in-st-louis", "emory-university", "duke-university", "university-of-michigan", "case-western-reserve-university", "vanderbilt-university", "rice-university", "northwestern-university", "university-of-pittsburgh"],
    careerPaths: ["Physician (MD)", "Surgeon", "Researcher (MD/PhD)", "Public Health Officer", "Dentist"],
    faq: [
      { question: "What college has the highest medical school acceptance rate?", answer: "Schools like WashU, JHU, and Duke report high med school placement rates, but these are partly due to grade deflation or selective advising. What matters most is GPA, MCAT, and clinical experience — which you can build at any strong school." },
      { question: "Should I major in biology for pre-med?", answer: "You do not have to major in biology. Any major works as long as you complete pre-med prerequisite courses. Non-traditional majors (humanities, engineering) can actually stand out in med school applications." },
    ],
  },
  {
    slug: "economics",
    name: "Economics",
    metaTitle: "Best Colleges for Economics (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for economics majors. Harvard, MIT, UChicago, Princeton, and Stanford economics programs compared by research strength, career placement, and teaching quality.",
    keyword: "best colleges for economics",
    relatedColleges: ["harvard-university", "massachusetts-institute-of-technology", "university-of-chicago", "princeton-university", "stanford-university", "yale-university", "columbia-university", "university-of-california-berkeley", "northwestern-university", "duke-university"],
    careerPaths: ["Economist", "Investment Banker", "Policy Analyst", "Management Consultant", "Data Scientist"],
    faq: [
      { question: "Is economics a good major for consulting?", answer: "Yes. Economics is one of the most-recruited majors for management consulting firms (McKinsey, Bain, BCG). The analytical skills and quantitative reasoning translate directly." },
      { question: "Should I do economics or finance?", answer: "Economics is more theoretical and analytical; finance is more applied and vocational. For academic or policy careers, economics. For Wall Street, either works — economics with finance coursework is ideal." },
    ],
  },
  {
    slug: "political-science",
    name: "Political Science",
    metaTitle: "Best Colleges for Political Science (2026) — Rankings & Fit",
    metaDescription: "Best colleges for political science and government. Georgetown, Harvard, Yale, and 15+ top programs compared by faculty, DC access, and career outcomes in policy and law.",
    keyword: "best colleges for political science",
    relatedColleges: ["georgetown-university", "harvard-university", "yale-university", "princeton-university", "stanford-university", "george-washington-university", "american-university", "columbia-university", "university-of-chicago", "duke-university"],
    careerPaths: ["Policy Analyst", "Legislative Aide", "Lawyer (JD)", "Political Campaign Manager", "Diplomat"],
    faq: [
      { question: "Is Georgetown good for political science?", answer: "Georgetown is arguably the best school for political science and international affairs due to its location in DC, the School of Foreign Service, and direct access to government institutions." },
    ],
  },
  {
    slug: "psychology",
    name: "Psychology",
    metaTitle: "Best Colleges for Psychology (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for psychology majors. Stanford, Yale, UMich, and 15+ top programs compared by research opportunities, clinical training, and grad school placement.",
    keyword: "best colleges for psychology",
    relatedColleges: ["stanford-university", "yale-university", "university-of-michigan", "university-of-california-berkeley", "university-of-california-los-angeles", "university-of-virginia", "university-of-north-carolina-chapel-hill", "duke-university", "northwestern-university", "university-of-wisconsin-madison"],
    careerPaths: ["Clinical Psychologist (PhD/PsyD)", "Research Psychologist", "UX Researcher", "School Counselor", "HR Specialist"],
    faq: [
      { question: "Do I need a PhD to work in psychology?", answer: "For clinical practice, yes — you need a doctoral degree (PhD or PsyD). For research, UX, HR, and related fields, a master's or bachelor's can suffice with the right experience." },
    ],
  },
  {
    slug: "nursing",
    name: "Nursing",
    metaTitle: "Best Colleges for Nursing (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for nursing (BSN). Penn, Johns Hopkins, Duke, and 15+ top nursing programs compared by NCLEX pass rates, clinical placements, and specialization options.",
    keyword: "best colleges for nursing",
    relatedColleges: ["university-of-pennsylvania", "johns-hopkins-university", "duke-university", "university-of-michigan", "emory-university", "university-of-pittsburgh", "ohio-state-university", "university-of-north-carolina-chapel-hill", "university-of-virginia", "university-of-florida"],
    careerPaths: ["Registered Nurse (RN)", "Nurse Practitioner (NP)", "Nurse Anesthetist (CRNA)", "Clinical Nurse Specialist", "Nursing Educator"],
    faq: [
      { question: "What is the best nursing school in the US?", answer: "Penn's School of Nursing and Johns Hopkins are consistently ranked #1 and #2. Duke, Michigan, and Emory round out the top 5." },
    ],
  },
  // ── Expanded to 20+ majors ──
  {
    slug: "communications",
    name: "Communications / Media",
    metaTitle: "Best Colleges for Communications (2026) — Rankings & Fit",
    metaDescription: "Best colleges for communications and media studies. Northwestern, USC, NYU, and 15+ top programs compared by faculty, industry placement, and specializations.",
    keyword: "best colleges for communications",
    relatedColleges: ["northwestern-university", "university-of-southern-california", "new-york-university", "boston-university", "university-of-north-carolina-chapel-hill", "syracuse-university", "university-of-texas-austin", "university-of-michigan", "emory-university", "george-washington-university"],
    careerPaths: ["Journalist", "Public Relations Manager", "Social Media Director", "Content Strategist", "Broadcast Producer"],
    faq: [
      { question: "Is a communications degree worth it?", answer: "Yes, if you attend a program with strong industry connections. Northwestern Medill, USC Annenberg, and NYU's journalism programs place graduates at top media companies and agencies." },
    ],
  },
  {
    slug: "data-science",
    name: "Data Science / Analytics",
    metaTitle: "Best Colleges for Data Science (2026) — Rankings & Fit",
    metaDescription: "Best colleges for data science majors. MIT, Stanford, UC Berkeley, and 15+ programs compared by curriculum, research, and tech placement rates.",
    keyword: "best colleges for data science",
    relatedColleges: ["massachusetts-institute-of-technology", "stanford-university", "university-of-california-berkeley", "carnegie-mellon-university", "university-of-michigan", "georgia-institute-of-technology", "university-of-illinois-urbana-champaign", "columbia-university", "harvard-university", "cornell-university"],
    careerPaths: ["Data Scientist", "Machine Learning Engineer", "Analytics Manager", "Business Intelligence Analyst", "Quantitative Researcher"],
    faq: [
      { question: "Should I major in data science or computer science?", answer: "CS gives broader fundamentals; data science is more specialized. If you know you want analytics or ML, data science is direct. If unsure, CS keeps more doors open." },
    ],
  },
  {
    slug: "architecture",
    name: "Architecture",
    metaTitle: "Best Colleges for Architecture (2026) — Rankings & Fit",
    metaDescription: "Best colleges for architecture. Cornell, Rice, Cooper Union, and 15+ accredited programs compared by studio culture, licensure path, and alumni network.",
    keyword: "best colleges for architecture",
    relatedColleges: ["cornell-university", "rice-university", "university-of-southern-california", "university-of-virginia", "university-of-michigan", "carnegie-mellon-university", "washington-university-in-st-louis", "georgia-institute-of-technology", "university-of-texas-austin", "virginia-tech"],
    careerPaths: ["Licensed Architect", "Urban Planner", "Interior Designer", "Landscape Architect", "Construction Manager"],
    faq: [
      { question: "Does architecture require a 5-year degree?", answer: "A B.Arch is typically a 5-year accredited program. Some schools offer a 4-year pre-professional degree (BA/BS in Architecture) followed by a 2-3 year M.Arch. Both paths lead to licensure." },
    ],
  },
  {
    slug: "environmental-science",
    name: "Environmental Science",
    metaTitle: "Best Colleges for Environmental Science (2026) — Rankings",
    metaDescription: "Best colleges for environmental science. UC Berkeley, Stanford, Yale, and 15+ programs compared by research, field stations, and sustainability careers.",
    keyword: "best colleges for environmental science",
    relatedColleges: ["stanford-university", "university-of-california-berkeley", "yale-university", "duke-university", "university-of-michigan", "university-of-colorado-boulder", "university-of-washington", "cornell-university", "university-of-virginia", "middlebury-college"],
    careerPaths: ["Environmental Scientist", "Sustainability Consultant", "Conservation Biologist", "Environmental Policy Analyst", "Climate Researcher"],
    faq: [
      { question: "Is environmental science a good major?", answer: "Demand for environmental professionals is growing rapidly due to climate policy, corporate sustainability mandates, and government regulation. Strong programs include field research opportunities." },
    ],
  },
  {
    slug: "international-relations",
    name: "International Relations",
    metaTitle: "Best Colleges for International Relations (2026) — Rankings",
    metaDescription: "Best colleges for international relations. Georgetown, Tufts, Princeton, and 15+ IR programs compared by faculty, DC access, and foreign service placement.",
    keyword: "best colleges for international relations",
    relatedColleges: ["georgetown-university", "tufts-university", "princeton-university", "harvard-university", "stanford-university", "columbia-university", "yale-university", "george-washington-university", "american-university", "johns-hopkins-university"],
    careerPaths: ["Diplomat / Foreign Service Officer", "Intelligence Analyst", "International Development Specialist", "NGO Program Manager", "Trade Policy Advisor"],
    faq: [
      { question: "Is Georgetown the best for international relations?", answer: "Georgetown's School of Foreign Service (SFS) is widely considered #1 for IR due to DC proximity, alumni network, and direct government connections. Tufts Fletcher School and Princeton's Woodrow Wilson School are also top-tier." },
    ],
  },
  {
    slug: "education",
    name: "Education",
    metaTitle: "Best Colleges for Education (2026) — Rankings & Fit",
    metaDescription: "Best colleges for education majors. Vanderbilt, Michigan, UVA, and 15+ education programs compared by teacher placement, classroom hours, and specializations.",
    keyword: "best colleges for education",
    relatedColleges: ["vanderbilt-university", "university-of-michigan", "university-of-virginia", "university-of-wisconsin-madison", "stanford-university", "university-of-north-carolina-chapel-hill", "university-of-florida", "boston-college", "ohio-state-university", "university-of-texas-austin"],
    careerPaths: ["Teacher (K-12)", "School Administrator", "Curriculum Designer", "Education Policy Analyst", "School Counselor"],
    faq: [
      { question: "Which college has the best education program?", answer: "Vanderbilt's Peabody College is consistently ranked #1. Stanford, Michigan, and UVA also have top education programs with strong research and placement records." },
    ],
  },
  {
    slug: "film",
    name: "Film / Cinema Studies",
    metaTitle: "Best Colleges for Film (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for film majors. USC, NYU, UCLA, and 15+ film programs compared by alumni success, equipment, and industry connections in Hollywood.",
    keyword: "best colleges for film",
    relatedColleges: ["university-of-southern-california", "new-york-university", "university-of-california-los-angeles", "columbia-university", "emory-university", "northwestern-university", "boston-university", "university-of-texas-austin", "carnegie-mellon-university", "florida-state-university"],
    careerPaths: ["Director", "Screenwriter", "Producer", "Cinematographer", "Film Editor"],
    faq: [
      { question: "Is USC or NYU better for film?", answer: "USC SCA has stronger Hollywood industry connections and alumni network. NYU Tisch is better for independent film and has NYC's production ecosystem. Both are elite — choose based on the type of filmmaking you want to pursue." },
    ],
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    metaTitle: "Best Colleges for Mathematics (2026) — Rankings & Fit",
    metaDescription: "Best colleges for math majors. MIT, Princeton, Harvard, and 15+ math departments compared by research output, faculty mentorship, and career flexibility.",
    keyword: "best colleges for math",
    relatedColleges: ["massachusetts-institute-of-technology", "princeton-university", "harvard-university", "stanford-university", "university-of-chicago", "california-institute-of-technology", "university-of-california-berkeley", "columbia-university", "yale-university", "university-of-michigan"],
    careerPaths: ["Mathematician", "Actuary", "Quantitative Analyst", "Data Scientist", "Cryptographer"],
    faq: [
      { question: "Is math a good pre-quant major?", answer: "Yes. Pure math with a focus on probability, statistics, and stochastic processes is the ideal background for quantitative finance. MIT, Princeton, and UChicago are top feeders into quant roles." },
    ],
  },
  {
    slug: "public-health",
    name: "Public Health",
    metaTitle: "Best Colleges for Public Health (2026) — Rankings & Fit",
    metaDescription: "Best colleges for public health. Johns Hopkins, UNC, Emory, and 15+ public health programs compared by research, fieldwork, and career outcomes.",
    keyword: "best colleges for public health",
    relatedColleges: ["johns-hopkins-university", "university-of-north-carolina-chapel-hill", "emory-university", "university-of-michigan", "columbia-university", "university-of-california-berkeley", "university-of-washington", "boston-university", "george-washington-university", "tulane-university"],
    careerPaths: ["Epidemiologist", "Health Policy Analyst", "Global Health Program Manager", "Biostatistician", "Public Health Director"],
    faq: [
      { question: "Is public health a good major for med school?", answer: "Public health is an excellent complement to pre-med coursework. It provides population-level context that medical schools value, and schools like JHU and Emory have strong dual-track programs." },
    ],
  },
  {
    slug: "philosophy",
    name: "Philosophy",
    metaTitle: "Best Colleges for Philosophy (2026) — Rankings & Fit",
    metaDescription: "Best colleges for philosophy majors. Princeton, NYU, Rutgers, and 15+ programs compared by faculty, placement into law school and PhD programs.",
    keyword: "best colleges for philosophy",
    relatedColleges: ["princeton-university", "new-york-university", "rutgers-university", "university-of-michigan", "university-of-pittsburgh", "yale-university", "harvard-university", "stanford-university", "university-of-chicago", "columbia-university"],
    careerPaths: ["Lawyer (JD)", "Ethics Consultant", "Professor", "Policy Analyst", "Product Manager"],
    faq: [
      { question: "Is philosophy useful for law school?", answer: "Philosophy majors consistently score among the highest on the LSAT. The major's focus on logic, argumentation, and close reading translates directly to legal reasoning. It is one of the best pre-law majors." },
    ],
  },
  {
    slug: "biology",
    name: "Biology",
    metaTitle: "Best Colleges for Biology (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for biology majors. MIT, Stanford, Johns Hopkins, and 15+ programs compared by research labs, grad school placement, and specialization options.",
    keyword: "best colleges for biology",
    relatedColleges: ["massachusetts-institute-of-technology", "stanford-university", "johns-hopkins-university", "harvard-university", "yale-university", "duke-university", "university-of-california-berkeley", "university-of-chicago", "caltech", "university-of-michigan"],
    careerPaths: ["Research Scientist", "Physician (MD)", "Biotech Researcher", "Genetic Counselor", "Marine Biologist"],
    faq: [
      { question: "What is the best biology program in the US?", answer: "MIT, Stanford, and JHU are consistently ranked at the top for biology. For research-focused students, these programs offer unmatched lab access and faculty mentorship." },
    ],
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    metaTitle: "Best Colleges for Chemistry (2026) — Rankings & Fit Guide",
    metaDescription: "Best colleges for chemistry. Caltech, MIT, Harvard, and 15+ programs compared by research output, ACS accreditation, and career outcomes in pharma and academia.",
    keyword: "best colleges for chemistry",
    relatedColleges: ["california-institute-of-technology", "massachusetts-institute-of-technology", "harvard-university", "stanford-university", "university-of-california-berkeley", "university-of-chicago", "northwestern-university", "cornell-university", "columbia-university", "university-of-illinois-urbana-champaign"],
    careerPaths: ["Chemical Engineer", "Pharmaceutical Researcher", "Materials Scientist", "Forensic Chemist", "Chemistry Professor"],
    faq: [
      { question: "Is chemistry a good pre-med major?", answer: "Chemistry is one of the most common pre-med majors. It covers most med school prerequisites directly, and the analytical rigor transfers well to the MCAT and medical training." },
    ],
  },
];

export const MAJOR_SLUGS = MAJORS.map((m) => m.slug);

export function findMajor(slug: string): Major | undefined {
  return MAJORS.find((m) => m.slug === slug);
}
