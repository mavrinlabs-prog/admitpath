/**
 * Florida hyper-local pages data for /florida/[slug] SEO pages.
 * Targets Florida-specific admissions queries — the unfair-advantage moat.
 */

export type FloridaPage = {
  slug: string;
  city: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  keyword: string;
  volume: number;
  faq: { question: string; answer: string }[];
  internalLinks: string[];
  nearbySchools: string[]; // college slugs
};

export const FLORIDA_PAGES: FloridaPage[] = [
  {
    slug: "admissions-guide",
    city: "Florida",
    metaTitle: "College Admissions for Florida Students (2026) — Complete Guide",
    metaDescription: "College admissions guide for Florida high school students. Bright Futures requirements, in-state university strategies, dual enrollment advantages, and Florida-specific application tips.",
    h1: "College Admissions for Florida Students: The 2026 Guide",
    keyword: "college admissions for florida students",
    volume: 590,
    faq: [
      { question: "What are the best Florida public universities?", answer: "UF (ranked #1 public in multiple rankings), FSU, USF, UCF, FIU, and UNF are the top options. Each has different strengths — UF for engineering and business, FSU for film and music, USF for health sciences." },
      { question: "How does Bright Futures work?", answer: "Bright Futures is a merit-based scholarship for Florida residents. FAS tier covers 100% of tuition with a 3.5 weighted GPA and 1330 SAT/29 ACT. FMS tier covers 75% with a 3.0 GPA and 1210 SAT/25 ACT." },
      { question: "Is dual enrollment beneficial for Florida students?", answer: "Yes. Florida has one of the strongest dual enrollment programs in the country. Credits transfer to all Florida public universities and can save a year of college tuition." },
      { question: "How competitive is UF admissions?", answer: "UF admitted about 23% of applicants for the Class of 2028. The middle 50% SAT range is 1350-1500, and average weighted GPA is 4.4-4.6. It is the most competitive public university in Florida." },
      { question: "Can Florida students get in-state tuition at out-of-state schools?", answer: "Some reciprocity agreements exist (like SREB's Academic Common Market for specific majors). Otherwise, out-of-state tuition applies. Merit scholarships at out-of-state publics can sometimes offset the difference." },
    ],
    internalLinks: [
      "/colleges/university-of-florida",
      "/colleges/florida-state-university",
      "/colleges/university-of-south-florida",
      "/scholarships/bright-futures",
      "/guides/how-to-choose-college",
      "/guides/dual-enrollment",
      "/guides/application-checklist",
    ],
    nearbySchools: ["university-of-florida", "florida-state-university", "university-of-south-florida", "university-of-miami"],
  },
  {
    slug: "sarasota",
    city: "Sarasota",
    metaTitle: "College Admissions for Sarasota Students (2026)",
    metaDescription: "College admissions guide for Sarasota-area high school students. Pine View, Riverview, Booker, and Sarasota High pathways. Local dual enrollment at SCF and USF Sarasota-Manatee.",
    h1: "College Admissions for Sarasota High School Students",
    keyword: "college admissions sarasota florida",
    volume: 140,
    faq: [
      { question: "What are the top high schools in Sarasota for college admissions?", answer: "Pine View School (IB magnet, ranked among Florida's best), Riverview High (strong AP program), Sarasota High (diverse offerings), and Booker High (performing arts focus)." },
      { question: "Where can Sarasota students dual enroll?", answer: "State College of Florida (SCF) in Bradenton/Sarasota and USF Sarasota-Manatee. Both offer transferable college credits at no cost for eligible high school students." },
      { question: "How do Sarasota students compare for UF admission?", answer: "Pine View students consistently have strong UF placement. For other Sarasota schools, competitive applicants typically need a 4.0+ weighted GPA, strong test scores, and meaningful extracurriculars." },
    ],
    internalLinks: [
      "/florida/admissions-guide",
      "/colleges/university-of-florida",
      "/colleges/university-of-south-florida",
      "/scholarships/bright-futures",
      "/guides/dual-enrollment",
    ],
    nearbySchools: ["university-of-florida", "university-of-south-florida", "florida-state-university"],
  },
  {
    slug: "tampa",
    city: "Tampa",
    metaTitle: "College Admissions for Tampa Students (2026)",
    metaDescription: "College admissions guide for Tampa-area high school students. Plant, Robinson, Newsome, and Steinbrenner pathways. USF home advantage, HCC dual enrollment, and Bright Futures strategy.",
    h1: "College Admissions for Tampa High School Students",
    keyword: "college admissions tampa florida",
    volume: 210,
    faq: [
      { question: "What are the best high schools in Tampa for college admissions?", answer: "Plant High School, Robinson High (IB program), Newsome High, and Steinbrenner High consistently send students to top Florida publics and selective private schools." },
      { question: "Does USF give preference to Tampa-area students?", answer: "USF does not give explicit geographic preference, but local students benefit from familiarity with the campus, dual enrollment connections, and lower cost of attendance." },
    ],
    internalLinks: [
      "/florida/admissions-guide",
      "/colleges/university-of-south-florida",
      "/colleges/university-of-florida",
      "/scholarships/bright-futures",
    ],
    nearbySchools: ["university-of-south-florida", "university-of-florida", "florida-state-university"],
  },
  {
    slug: "miami",
    city: "Miami",
    metaTitle: "College Admissions for Miami Students (2026)",
    metaDescription: "College admissions guide for Miami-area high school students. MAST Academy, Coral Gables, and IB pathways. FIU, UM, and out-of-state strategies for Miami-Dade students.",
    h1: "College Admissions for Miami High School Students",
    keyword: "college admissions miami florida",
    volume: 320,
    faq: [
      { question: "What are the top high schools in Miami for college admissions?", answer: "MAST Academy, Coral Gables High (IB), Design and Architecture Senior High (DASH), and Miami Palmetto consistently produce strong college applicants." },
      { question: "Is University of Miami a good option for Miami students?", answer: "UM is a top-tier private university in Coral Gables. Miami-area students do not get in-state pricing (it is private), but local familiarity and alumni connections can be advantages." },
    ],
    internalLinks: [
      "/florida/admissions-guide",
      "/colleges/university-of-miami",
      "/colleges/university-of-florida",
      "/scholarships/bright-futures",
    ],
    nearbySchools: ["university-of-miami", "university-of-florida", "florida-state-university"],
  },
  {
    slug: "orlando",
    city: "Orlando",
    metaTitle: "College Admissions for Orlando Students (2026)",
    metaDescription: "College admissions guide for Orlando-area high school students. UCF pathways, Valencia dual enrollment, and strategies for Winter Park, Boone, and Timber Creek students.",
    h1: "College Admissions for Orlando High School Students",
    keyword: "college admissions orlando florida",
    volume: 170,
    faq: [
      { question: "Is UCF a good school?", answer: "UCF is one of the largest universities in the US with strong engineering, CS, hospitality, and health sciences programs. It is increasingly selective and offers excellent value for Florida residents." },
      { question: "Where can Orlando students dual enroll?", answer: "Valencia College is the primary dual enrollment partner for Orange County high schools. Credits transfer to all Florida public universities through the statewide articulation agreement." },
    ],
    internalLinks: [
      "/florida/admissions-guide",
      "/colleges/university-of-florida",
      "/scholarships/bright-futures",
      "/guides/dual-enrollment",
    ],
    nearbySchools: ["university-of-florida", "florida-state-university"],
  },
  {
    slug: "jacksonville",
    city: "Jacksonville",
    metaTitle: "College Admissions for Jacksonville Students (2026)",
    metaDescription: "College admissions guide for Jacksonville-area high school students. Stanton, Paxon, and Bolles pathways. UNF and FSCJ dual enrollment options.",
    h1: "College Admissions for Jacksonville High School Students",
    keyword: "college admissions jacksonville florida",
    volume: 140,
    faq: [
      { question: "What are the best high schools in Jacksonville?", answer: "Stanton College Prep (IB, ranked among Florida's top), Paxon School for Advanced Studies, and The Bolles School (private) are consistently top performers." },
    ],
    internalLinks: [
      "/florida/admissions-guide",
      "/colleges/university-of-florida",
      "/scholarships/bright-futures",
    ],
    nearbySchools: ["university-of-florida", "florida-state-university"],
  },
];

export const FLORIDA_SLUGS = FLORIDA_PAGES.map((f) => f.slug);

export function findFloridaPage(slug: string): FloridaPage | undefined {
  return FLORIDA_PAGES.find((f) => f.slug === slug);
}
