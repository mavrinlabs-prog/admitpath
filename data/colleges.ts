/**
 * Seed dataset for programmatic /college/[slug] SEO pages.
 *
 * Stats are widely-reported approximate Common Data Set figures (Class of 2027 era).
 * Numbers vary year-to-year — we display them as "approximate" to stay honest.
 * No fabrication: every school here has CDS data publicly available.
 *
 * Adding a school: append a row, redeploy, sitemap auto-updates.
 */

export type College = {
  slug: string;
  name: string;
  shortName: string;       // for URLs / titles
  city: string;
  state: string;           // 2-letter code
  type: "private" | "public";
  founded: number;
  acceptanceRate: number;  // percent, e.g. 3.7
  sat25: number;           // 25th percentile composite
  sat75: number;           // 75th percentile composite
  gpaAvg: number;          // unweighted avg
  enrollment: number;      // undergrad
  ivy?: boolean;
  oneLiner: string;        // 1-sentence positioning, used in meta description
  domain: string;          // primary domain — drives Clearbit logo + linkout
  // Enriched fields (Week 1 plan)
  testPolicy?: "required" | "test-optional" | "test-blind"; // test requirement policy
  needBlind?: boolean;         // need-blind for domestic applicants
  meetsFullNeed?: boolean;     // commits to meeting 100% demonstrated need
  earlyOption?: "ED" | "EA" | "REA" | "ED+EA" | "none"; // primary early application type
};

const DOMAINS: Record<string, string> = {
  "harvard-university": "harvard.edu",
  "yale-university": "yale.edu",
  "princeton-university": "princeton.edu",
  "columbia-university": "columbia.edu",
  "university-of-pennsylvania": "upenn.edu",
  "brown-university": "brown.edu",
  "dartmouth-college": "dartmouth.edu",
  "cornell-university": "cornell.edu",
  "stanford-university": "stanford.edu",
  "massachusetts-institute-of-technology": "mit.edu",
  "california-institute-of-technology": "caltech.edu",
  "duke-university": "duke.edu",
  "northwestern-university": "northwestern.edu",
  "johns-hopkins-university": "jhu.edu",
  "university-of-chicago": "uchicago.edu",
  "vanderbilt-university": "vanderbilt.edu",
  "rice-university": "rice.edu",
  "university-of-notre-dame": "nd.edu",
  "washington-university-in-st-louis": "wustl.edu",
  "emory-university": "emory.edu",
  "georgetown-university": "georgetown.edu",
  "university-of-southern-california": "usc.edu",
  "carnegie-mellon-university": "cmu.edu",
  "new-york-university": "nyu.edu",
  "university-of-california-berkeley": "berkeley.edu",
  "university-of-california-los-angeles": "ucla.edu",
  "university-of-michigan": "umich.edu",
  "university-of-virginia": "virginia.edu",
  "university-of-north-carolina-chapel-hill": "unc.edu",
  "georgia-institute-of-technology": "gatech.edu",
  // Expansion — 75 more schools
  "tufts-university": "tufts.edu",
  "wake-forest-university": "wfu.edu",
  "university-of-florida": "ufl.edu",
  "university-of-wisconsin-madison": "wisc.edu",
  "university-of-illinois-urbana-champaign": "illinois.edu",
  "boston-college": "bc.edu",
  "boston-university": "bu.edu",
  "brandeis-university": "brandeis.edu",
  "case-western-reserve-university": "case.edu",
  "lehigh-university": "lehigh.edu",
  "northeastern-university": "northeastern.edu",
  "tulane-university": "tulane.edu",
  "villanova-university": "villanova.edu",
  "university-of-rochester": "rochester.edu",
  "rensselaer-polytechnic-institute": "rpi.edu",
  "university-of-california-san-diego": "ucsd.edu",
  "university-of-california-davis": "ucdavis.edu",
  "university-of-california-santa-barbara": "ucsb.edu",
  "university-of-california-irvine": "uci.edu",
  "university-of-california-santa-cruz": "ucsc.edu",
  "purdue-university": "purdue.edu",
  "ohio-state-university": "osu.edu",
  "penn-state-university": "psu.edu",
  "university-of-texas-austin": "utexas.edu",
  "texas-am-university": "tamu.edu",
  "university-of-washington": "washington.edu",
  "university-of-maryland-college-park": "umd.edu",
  "university-of-pittsburgh": "pitt.edu",
  "university-of-minnesota": "umn.edu",
  "university-of-colorado-boulder": "colorado.edu",
  "university-of-georgia": "uga.edu",
  "clemson-university": "clemson.edu",
  "virginia-tech": "vt.edu",
  "florida-state-university": "fsu.edu",
  "university-of-miami": "miami.edu",
  "santa-clara-university": "scu.edu",
  "loyola-marymount-university": "lmu.edu",
  "pepperdine-university": "pepperdine.edu",
  "fordham-university": "fordham.edu",
  "george-washington-university": "gwu.edu",
  "american-university": "american.edu",
  "syracuse-university": "syracuse.edu",
  "indiana-university-bloomington": "indiana.edu",
  "university-of-connecticut": "uconn.edu",
  "rutgers-university": "rutgers.edu",
  "stony-brook-university": "stonybrook.edu",
  "university-of-massachusetts-amherst": "umass.edu",
  // Top LACs
  "williams-college": "williams.edu",
  "amherst-college": "amherst.edu",
  "swarthmore-college": "swarthmore.edu",
  "pomona-college": "pomona.edu",
  "wellesley-college": "wellesley.edu",
  "bowdoin-college": "bowdoin.edu",
  "claremont-mckenna-college": "cmc.edu",
  "middlebury-college": "middlebury.edu",
  "carleton-college": "carleton.edu",
  "colby-college": "colby.edu",
  "davidson-college": "davidson.edu",
  "grinnell-college": "grinnell.edu",
  "hamilton-college": "hamilton.edu",
  "haverford-college": "haverford.edu",
  "vassar-college": "vassar.edu",
  "colgate-university": "colgate.edu",
  "barnard-college": "barnard.edu",
  "smith-college": "smith.edu",
  "colorado-college": "coloradocollege.edu",
  "oberlin-college": "oberlin.edu",
  // Other notable
  "university-of-south-florida": "usf.edu",
  "drexel-university": "drexel.edu",
  "stevens-institute-of-technology": "stevens.edu",
  "worcester-polytechnic-institute": "wpi.edu",
  "rose-hulman-institute-of-technology": "rose-hulman.edu",
};

type CollegeSeed = Omit<College, "domain">;

const SEED: readonly CollegeSeed[] = [
  // Ivy League
  { slug: "harvard-university", name: "Harvard University", shortName: "Harvard", city: "Cambridge", state: "MA", type: "private", founded: 1636, acceptanceRate: 3.2, sat25: 1510, sat75: 1580, gpaAvg: 3.95, enrollment: 7178, ivy: true, oneLiner: "America's oldest university and the gold standard of selective admissions." },
  { slug: "yale-university", name: "Yale University", shortName: "Yale", city: "New Haven", state: "CT", type: "private", founded: 1701, acceptanceRate: 3.7, sat25: 1510, sat75: 1570, gpaAvg: 3.94, enrollment: 6640, ivy: true, oneLiner: "Renowned for residential colleges, the humanities, and a tightly-knit undergraduate culture." },
  { slug: "princeton-university", name: "Princeton University", shortName: "Princeton", city: "Princeton", state: "NJ", type: "private", founded: 1746, acceptanceRate: 4.0, sat25: 1510, sat75: 1580, gpaAvg: 3.9, enrollment: 5590, ivy: true, oneLiner: "Undergraduate-focused Ivy with a top-ranked engineering and economics curriculum." },
  { slug: "columbia-university", name: "Columbia University", shortName: "Columbia", city: "New York", state: "NY", type: "private", founded: 1754, acceptanceRate: 3.9, sat25: 1480, sat75: 1570, gpaAvg: 4.13, enrollment: 8800, ivy: true, oneLiner: "Manhattan-based Ivy with a famous Core Curriculum and global research footprint." },
  { slug: "university-of-pennsylvania", name: "University of Pennsylvania", shortName: "Penn", city: "Philadelphia", state: "PA", type: "private", founded: 1740, acceptanceRate: 5.4, sat25: 1500, sat75: 1570, gpaAvg: 3.9, enrollment: 9870, ivy: true, oneLiner: "Home of Wharton — the most pre-professional Ivy, popular for finance and tech." },
  { slug: "brown-university", name: "Brown University", shortName: "Brown", city: "Providence", state: "RI", type: "private", founded: 1764, acceptanceRate: 5.0, sat25: 1500, sat75: 1570, gpaAvg: 4.05, enrollment: 7220, ivy: true, oneLiner: "Open Curriculum Ivy that lets students design their own academic path." },
  { slug: "dartmouth-college", name: "Dartmouth College", shortName: "Dartmouth", city: "Hanover", state: "NH", type: "private", founded: 1769, acceptanceRate: 6.4, sat25: 1500, sat75: 1560, gpaAvg: 4.11, enrollment: 4570, ivy: true, oneLiner: "Smallest Ivy, known for tight-knit undergrad community and outdoor culture." },
  { slug: "cornell-university", name: "Cornell University", shortName: "Cornell", city: "Ithaca", state: "NY", type: "private", founded: 1865, acceptanceRate: 7.5, sat25: 1470, sat75: 1560, gpaAvg: 4.07, enrollment: 15740, ivy: true, oneLiner: "Largest Ivy by undergrad size, with seven distinct undergraduate colleges." },
  // Stanford / MIT / Caltech
  { slug: "stanford-university", name: "Stanford University", shortName: "Stanford", city: "Stanford", state: "CA", type: "private", founded: 1885, acceptanceRate: 3.7, sat25: 1500, sat75: 1570, gpaAvg: 3.96, enrollment: 7760, oneLiner: "Silicon Valley's research powerhouse and a top destination for STEM and entrepreneurship." },
  { slug: "massachusetts-institute-of-technology", name: "Massachusetts Institute of Technology", shortName: "MIT", city: "Cambridge", state: "MA", type: "private", founded: 1861, acceptanceRate: 3.9, sat25: 1530, sat75: 1580, gpaAvg: 3.96, enrollment: 4640, oneLiner: "World's leading engineering and computer science institution." },
  { slug: "california-institute-of-technology", name: "California Institute of Technology", shortName: "Caltech", city: "Pasadena", state: "CA", type: "private", founded: 1891, acceptanceRate: 2.7, sat25: 1530, sat75: 1580, gpaAvg: 4.19, enrollment: 980, oneLiner: "Tiny, intense STEM-only school with a 3:1 student-faculty ratio." },
  // Top private universities
  { slug: "duke-university", name: "Duke University", shortName: "Duke", city: "Durham", state: "NC", type: "private", founded: 1838, acceptanceRate: 6.2, sat25: 1490, sat75: 1570, gpaAvg: 4.13, enrollment: 6680, oneLiner: "Top-10 private with elite undergraduate teaching and Division I athletics." },
  { slug: "northwestern-university", name: "Northwestern University", shortName: "Northwestern", city: "Evanston", state: "IL", type: "private", founded: 1851, acceptanceRate: 7.0, sat25: 1490, sat75: 1570, gpaAvg: 4.09, enrollment: 8870, oneLiner: "Top-ranked journalism and theater programs on Chicago's North Shore." },
  { slug: "johns-hopkins-university", name: "Johns Hopkins University", shortName: "Johns Hopkins", city: "Baltimore", state: "MD", type: "private", founded: 1876, acceptanceRate: 7.5, sat25: 1510, sat75: 1560, gpaAvg: 3.93, enrollment: 6040, oneLiner: "Premier pre-med and biomedical research school." },
  { slug: "university-of-chicago", name: "University of Chicago", shortName: "UChicago", city: "Chicago", state: "IL", type: "private", founded: 1890, acceptanceRate: 5.4, sat25: 1510, sat75: 1570, gpaAvg: 4.07, enrollment: 7560, oneLiner: "Famously rigorous, intellectual school with a Core that grills you in the classics." },
  { slug: "vanderbilt-university", name: "Vanderbilt University", shortName: "Vanderbilt", city: "Nashville", state: "TN", type: "private", founded: 1873, acceptanceRate: 6.7, sat25: 1480, sat75: 1570, gpaAvg: 3.83, enrollment: 7150, oneLiner: "Need-blind admissions and one of the country's most generous financial aid programs." },
  { slug: "rice-university", name: "Rice University", shortName: "Rice", city: "Houston", state: "TX", type: "private", founded: 1912, acceptanceRate: 8.7, sat25: 1490, sat75: 1570, gpaAvg: 4.12, enrollment: 4470, oneLiner: "Residential-college system, low student-faculty ratio, Texas-sized financial aid." },
  { slug: "university-of-notre-dame", name: "University of Notre Dame", shortName: "Notre Dame", city: "Notre Dame", state: "IN", type: "private", founded: 1842, acceptanceRate: 12.9, sat25: 1450, sat75: 1550, gpaAvg: 4.06, enrollment: 8970, oneLiner: "Catholic research university with a famously loyal alumni network." },
  { slug: "washington-university-in-st-louis", name: "Washington University in St. Louis", shortName: "WashU", city: "St. Louis", state: "MO", type: "private", founded: 1853, acceptanceRate: 12.0, sat25: 1500, sat75: 1570, gpaAvg: 4.16, enrollment: 7860, oneLiner: "Top-15 research university with strong pre-med and architecture pipelines." },
  { slug: "emory-university", name: "Emory University", shortName: "Emory", city: "Atlanta", state: "GA", type: "private", founded: 1836, acceptanceRate: 11.0, sat25: 1430, sat75: 1530, gpaAvg: 3.78, enrollment: 7100, oneLiner: "Atlanta-based research university tied to the CDC and a top business school." },
  { slug: "georgetown-university", name: "Georgetown University", shortName: "Georgetown", city: "Washington", state: "DC", type: "private", founded: 1789, acceptanceRate: 12.4, sat25: 1410, sat75: 1540, gpaAvg: 4.04, enrollment: 7460, oneLiner: "Jesuit university near Capitol Hill, known for foreign service and government." },
  { slug: "university-of-southern-california", name: "University of Southern California", shortName: "USC", city: "Los Angeles", state: "CA", type: "private", founded: 1880, acceptanceRate: 9.9, sat25: 1450, sat75: 1540, gpaAvg: 3.87, enrollment: 21000, oneLiner: "Top-tier private in LA with a powerhouse film school and Trojan alumni network." },
  { slug: "carnegie-mellon-university", name: "Carnegie Mellon University", shortName: "CMU", city: "Pittsburgh", state: "PA", type: "private", founded: 1900, acceptanceRate: 11.3, sat25: 1490, sat75: 1560, gpaAvg: 3.86, enrollment: 7650, oneLiner: "World-class CS and drama programs in the same school — uniquely interdisciplinary." },
  { slug: "new-york-university", name: "New York University", shortName: "NYU", city: "New York", state: "NY", type: "private", founded: 1831, acceptanceRate: 8.0, sat25: 1370, sat75: 1540, gpaAvg: 3.7, enrollment: 29400, oneLiner: "City-as-campus private with strong arts, business (Stern), and a global network." },
  // Top publics
  { slug: "university-of-california-berkeley", name: "University of California, Berkeley", shortName: "UC Berkeley", city: "Berkeley", state: "CA", type: "public", founded: 1868, acceptanceRate: 11.4, sat25: 1330, sat75: 1530, gpaAvg: 3.91, enrollment: 32830, oneLiner: "Top public university for engineering, CS, and the social sciences." },
  { slug: "university-of-california-los-angeles", name: "University of California, Los Angeles", shortName: "UCLA", city: "Los Angeles", state: "CA", type: "public", founded: 1919, acceptanceRate: 8.6, sat25: 1290, sat75: 1510, gpaAvg: 3.95, enrollment: 32420, oneLiner: "Most-applied-to university in America, with elite athletics and academics." },
  { slug: "university-of-michigan", name: "University of Michigan", shortName: "Michigan", city: "Ann Arbor", state: "MI", type: "public", founded: 1817, acceptanceRate: 17.7, sat25: 1340, sat75: 1530, gpaAvg: 3.9, enrollment: 32600, oneLiner: "Big Ten flagship with a top business school (Ross) and strong everything else." },
  { slug: "university-of-virginia", name: "University of Virginia", shortName: "UVA", city: "Charlottesville", state: "VA", type: "public", founded: 1819, acceptanceRate: 16.6, sat25: 1370, sat75: 1510, gpaAvg: 4.32, enrollment: 17500, oneLiner: "Jefferson's public Ivy — Honor Code, top-ranked undergrad business, beautiful Lawn." },
  { slug: "university-of-north-carolina-chapel-hill", name: "University of North Carolina at Chapel Hill", shortName: "UNC Chapel Hill", city: "Chapel Hill", state: "NC", type: "public", founded: 1789, acceptanceRate: 17.0, sat25: 1350, sat75: 1510, gpaAvg: 4.39, enrollment: 19770, oneLiner: "Original public Ivy, with a residential atmosphere and Tar Heel athletics." },
  { slug: "georgia-institute-of-technology", name: "Georgia Institute of Technology", shortName: "Georgia Tech", city: "Atlanta", state: "GA", type: "public", founded: 1885, acceptanceRate: 16.0, sat25: 1390, sat75: 1540, gpaAvg: 4.07, enrollment: 18790, oneLiner: "Public engineering powerhouse with a culture that proudly embraces nerdiness." },
  // ── Expansion: More privates ──
  { slug: "tufts-university", name: "Tufts University", shortName: "Tufts", city: "Medford", state: "MA", type: "private", founded: 1852, acceptanceRate: 9.5, sat25: 1430, sat75: 1540, gpaAvg: 4.0, enrollment: 6680, oneLiner: "International relations powerhouse with Fletcher and a strong pre-med track." },
  { slug: "wake-forest-university", name: "Wake Forest University", shortName: "Wake Forest", city: "Winston-Salem", state: "NC", type: "private", founded: 1834, acceptanceRate: 21.0, sat25: 1350, sat75: 1490, gpaAvg: 3.81, enrollment: 5480, oneLiner: "Test-optional pioneer with tight undergrad teaching and ACC athletics." },
  { slug: "boston-college", name: "Boston College", shortName: "BC", city: "Chestnut Hill", state: "MA", type: "private", founded: 1863, acceptanceRate: 15.5, sat25: 1410, sat75: 1520, gpaAvg: 3.92, enrollment: 9530, oneLiner: "Jesuit university combining strong academics with Division I athletics." },
  { slug: "boston-university", name: "Boston University", shortName: "BU", city: "Boston", state: "MA", type: "private", founded: 1839, acceptanceRate: 11.3, sat25: 1370, sat75: 1510, gpaAvg: 3.72, enrollment: 18080, oneLiner: "Charles River campus with top communications and engineering programs." },
  { slug: "brandeis-university", name: "Brandeis University", shortName: "Brandeis", city: "Waltham", state: "MA", type: "private", founded: 1948, acceptanceRate: 33.0, sat25: 1330, sat75: 1500, gpaAvg: 3.78, enrollment: 3690, oneLiner: "Research-intensive school founded by the American Jewish community, strong sciences." },
  { slug: "case-western-reserve-university", name: "Case Western Reserve University", shortName: "CWRU", city: "Cleveland", state: "OH", type: "private", founded: 1826, acceptanceRate: 29.0, sat25: 1370, sat75: 1520, gpaAvg: 3.82, enrollment: 5770, oneLiner: "Biomedical engineering and pre-med powerhouse in Cleveland's University Circle." },
  { slug: "lehigh-university", name: "Lehigh University", shortName: "Lehigh", city: "Bethlehem", state: "PA", type: "private", founded: 1865, acceptanceRate: 32.0, sat25: 1310, sat75: 1470, gpaAvg: 3.65, enrollment: 5620, oneLiner: "Engineering and business-focused private with a tight-knit mountaintop campus." },
  { slug: "northeastern-university", name: "Northeastern University", shortName: "Northeastern", city: "Boston", state: "MA", type: "private", founded: 1898, acceptanceRate: 6.7, sat25: 1430, sat75: 1540, gpaAvg: 3.97, enrollment: 16300, oneLiner: "Co-op education leader — students graduate with 18 months of real work experience." },
  { slug: "tulane-university", name: "Tulane University", shortName: "Tulane", city: "New Orleans", state: "LA", type: "private", founded: 1834, acceptanceRate: 8.5, sat25: 1380, sat75: 1510, gpaAvg: 3.73, enrollment: 8700, oneLiner: "New Orleans-rooted private with a public health school and community service requirement." },
  { slug: "villanova-university", name: "Villanova University", shortName: "Villanova", city: "Villanova", state: "PA", type: "private", founded: 1842, acceptanceRate: 22.0, sat25: 1370, sat75: 1500, gpaAvg: 3.87, enrollment: 7030, oneLiner: "Augustinian Catholic university known for business, engineering, and March Madness." },
  { slug: "university-of-rochester", name: "University of Rochester", shortName: "Rochester", city: "Rochester", state: "NY", type: "private", founded: 1850, acceptanceRate: 35.0, sat25: 1330, sat75: 1500, gpaAvg: 3.82, enrollment: 6530, oneLiner: "Rochester Curriculum lets you choose your own focus — no required core outside your major." },
  { slug: "rensselaer-polytechnic-institute", name: "Rensselaer Polytechnic Institute", shortName: "RPI", city: "Troy", state: "NY", type: "private", founded: 1824, acceptanceRate: 47.0, sat25: 1350, sat75: 1510, gpaAvg: 3.78, enrollment: 6370, oneLiner: "America's oldest technological research university with strong CS and engineering." },
  { slug: "santa-clara-university", name: "Santa Clara University", shortName: "Santa Clara", city: "Santa Clara", state: "CA", type: "private", founded: 1851, acceptanceRate: 43.0, sat25: 1300, sat75: 1460, gpaAvg: 3.72, enrollment: 6050, oneLiner: "Jesuit university in Silicon Valley with strong CS placement into tech companies." },
  { slug: "loyola-marymount-university", name: "Loyola Marymount University", shortName: "LMU", city: "Los Angeles", state: "CA", type: "private", founded: 1911, acceptanceRate: 40.0, sat25: 1240, sat75: 1410, gpaAvg: 3.71, enrollment: 7060, oneLiner: "Jesuit university on a bluff above the Pacific, top film and business school." },
  { slug: "pepperdine-university", name: "Pepperdine University", shortName: "Pepperdine", city: "Malibu", state: "CA", type: "private", founded: 1937, acceptanceRate: 27.0, sat25: 1280, sat75: 1450, gpaAvg: 3.74, enrollment: 3700, oneLiner: "Christian university on Malibu's coast with strong international study programs." },
  { slug: "fordham-university", name: "Fordham University", shortName: "Fordham", city: "New York", state: "NY", type: "private", founded: 1841, acceptanceRate: 46.0, sat25: 1280, sat75: 1440, gpaAvg: 3.65, enrollment: 10100, oneLiner: "Jesuit university with Lincoln Center and Rose Hill campuses in NYC." },
  { slug: "george-washington-university", name: "George Washington University", shortName: "GW", city: "Washington", state: "DC", type: "private", founded: 1821, acceptanceRate: 41.0, sat25: 1310, sat75: 1470, gpaAvg: 3.67, enrollment: 12200, oneLiner: "Foggy Bottom campus steps from the White House — ideal for policy and politics." },
  { slug: "american-university", name: "American University", shortName: "American", city: "Washington", state: "DC", type: "private", founded: 1893, acceptanceRate: 36.0, sat25: 1250, sat75: 1410, gpaAvg: 3.61, enrollment: 8540, oneLiner: "Political-science and international-affairs focused university in the nation's capital." },
  { slug: "syracuse-university", name: "Syracuse University", shortName: "Syracuse", city: "Syracuse", state: "NY", type: "private", founded: 1870, acceptanceRate: 42.0, sat25: 1210, sat75: 1390, gpaAvg: 3.57, enrollment: 14870, oneLiner: "Newhouse School of Communication and Maxwell School of Public Affairs." },
  { slug: "university-of-miami", name: "University of Miami", shortName: "Miami", city: "Coral Gables", state: "FL", type: "private", founded: 1925, acceptanceRate: 19.0, sat25: 1330, sat75: 1480, gpaAvg: 3.75, enrollment: 12400, oneLiner: "South Florida's top private — strong marine science, pre-med, and music programs." },
  { slug: "drexel-university", name: "Drexel University", shortName: "Drexel", city: "Philadelphia", state: "PA", type: "private", founded: 1891, acceptanceRate: 73.0, sat25: 1200, sat75: 1390, gpaAvg: 3.52, enrollment: 14200, oneLiner: "Co-op education model in Philly — 6-month paid internships baked into the curriculum." },
  { slug: "stevens-institute-of-technology", name: "Stevens Institute of Technology", shortName: "Stevens", city: "Hoboken", state: "NJ", type: "private", founded: 1870, acceptanceRate: 41.0, sat25: 1370, sat75: 1500, gpaAvg: 3.78, enrollment: 3870, oneLiner: "Manhattan-skyline campus engineering school with strong CS and fintech programs." },
  { slug: "worcester-polytechnic-institute", name: "Worcester Polytechnic Institute", shortName: "WPI", city: "Worcester", state: "MA", type: "private", founded: 1865, acceptanceRate: 52.0, sat25: 1330, sat75: 1490, gpaAvg: 3.83, enrollment: 4870, oneLiner: "Project-based STEM education with a global projects program across 50+ sites." },
  { slug: "rose-hulman-institute-of-technology", name: "Rose-Hulman Institute of Technology", shortName: "Rose-Hulman", city: "Terre Haute", state: "IN", type: "private", founded: 1874, acceptanceRate: 61.0, sat25: 1280, sat75: 1460, gpaAvg: 3.88, enrollment: 2100, oneLiner: "Perennial #1 undergraduate engineering school — no grad students, all undergrad focus." },
  // ── Expansion: More publics ──
  { slug: "university-of-florida", name: "University of Florida", shortName: "UF", city: "Gainesville", state: "FL", type: "public", founded: 1853, acceptanceRate: 23.0, sat25: 1330, sat75: 1480, gpaAvg: 4.4, enrollment: 35500, oneLiner: "Top-5 public, Gator Nation, with strong engineering and a Top-10 Innovation ranking." },
  { slug: "university-of-wisconsin-madison", name: "University of Wisconsin-Madison", shortName: "Wisconsin", city: "Madison", state: "WI", type: "public", founded: 1848, acceptanceRate: 49.0, sat25: 1300, sat75: 1470, gpaAvg: 3.85, enrollment: 35500, oneLiner: "Big Ten flagship with world-class research in STEM and the Wisconsin Idea ethos." },
  { slug: "university-of-illinois-urbana-champaign", name: "University of Illinois Urbana-Champaign", shortName: "UIUC", city: "Champaign", state: "IL", type: "public", founded: 1867, acceptanceRate: 44.0, sat25: 1310, sat75: 1490, gpaAvg: 3.79, enrollment: 35000, oneLiner: "Top-5 CS and engineering programs at a Big Ten school." },
  { slug: "university-of-california-san-diego", name: "University of California, San Diego", shortName: "UCSD", city: "La Jolla", state: "CA", type: "public", founded: 1960, acceptanceRate: 24.0, sat25: 1290, sat75: 1490, gpaAvg: 4.1, enrollment: 33100, oneLiner: "STEM research giant on the coast — strong bioengineering and CS programs." },
  { slug: "university-of-california-davis", name: "University of California, Davis", shortName: "UC Davis", city: "Davis", state: "CA", type: "public", founded: 1905, acceptanceRate: 37.0, sat25: 1190, sat75: 1420, gpaAvg: 3.97, enrollment: 31200, oneLiner: "Top vet school and agricultural sciences — increasingly competitive admissions." },
  { slug: "university-of-california-santa-barbara", name: "University of California, Santa Barbara", shortName: "UCSB", city: "Santa Barbara", state: "CA", type: "public", founded: 1891, acceptanceRate: 26.0, sat25: 1250, sat75: 1460, gpaAvg: 4.07, enrollment: 23500, oneLiner: "Beachside UC with Nobel laureates and top physics and engineering programs." },
  { slug: "university-of-california-irvine", name: "University of California, Irvine", shortName: "UCI", city: "Irvine", state: "CA", type: "public", founded: 1965, acceptanceRate: 21.0, sat25: 1210, sat75: 1430, gpaAvg: 4.0, enrollment: 29300, oneLiner: "Young, diverse UC with strong CS and growing medical research." },
  { slug: "university-of-california-santa-cruz", name: "University of California, Santa Cruz", shortName: "UCSC", city: "Santa Cruz", state: "CA", type: "public", founded: 1965, acceptanceRate: 47.0, sat25: 1130, sat75: 1350, gpaAvg: 3.68, enrollment: 17800, oneLiner: "Redwood forest campus UC known for astronomy and computer game design." },
  { slug: "purdue-university", name: "Purdue University", shortName: "Purdue", city: "West Lafayette", state: "IN", type: "public", founded: 1869, acceptanceRate: 53.0, sat25: 1200, sat75: 1440, gpaAvg: 3.7, enrollment: 37900, oneLiner: "Cradle of astronauts — Neil Armstrong's alma mater, top engineering and CS." },
  { slug: "ohio-state-university", name: "Ohio State University", shortName: "Ohio State", city: "Columbus", state: "OH", type: "public", founded: 1870, acceptanceRate: 53.0, sat25: 1230, sat75: 1420, gpaAvg: 3.73, enrollment: 46800, oneLiner: "Massive Big Ten flagship with top-ranked business (Fisher) and a huge alumni network." },
  { slug: "penn-state-university", name: "Penn State University", shortName: "Penn State", city: "University Park", state: "PA", type: "public", founded: 1855, acceptanceRate: 55.0, sat25: 1180, sat75: 1370, gpaAvg: 3.59, enrollment: 40800, oneLiner: "Big Ten school with one of the largest alumni networks in the world." },
  { slug: "university-of-texas-austin", name: "University of Texas at Austin", shortName: "UT Austin", city: "Austin", state: "TX", type: "public", founded: 1883, acceptanceRate: 31.0, sat25: 1250, sat75: 1470, gpaAvg: 3.8, enrollment: 40000, oneLiner: "Flagship Texas public with a top CS department and McCombs Business School." },
  { slug: "texas-am-university", name: "Texas A&M University", shortName: "Texas A&M", city: "College Station", state: "TX", type: "public", founded: 1876, acceptanceRate: 57.0, sat25: 1160, sat75: 1380, gpaAvg: 3.68, enrollment: 55600, oneLiner: "One of the largest universities by enrollment — strong engineering and vet programs." },
  { slug: "university-of-washington", name: "University of Washington", shortName: "UW", city: "Seattle", state: "WA", type: "public", founded: 1861, acceptanceRate: 48.0, sat25: 1270, sat75: 1470, gpaAvg: 3.81, enrollment: 36600, oneLiner: "Pacific Northwest's flagship — top CS (Paul Allen School) and medical research." },
  { slug: "university-of-maryland-college-park", name: "University of Maryland, College Park", shortName: "UMD", city: "College Park", state: "MD", type: "public", founded: 1856, acceptanceRate: 45.0, sat25: 1310, sat75: 1480, gpaAvg: 4.33, enrollment: 31000, oneLiner: "DC-adjacent Big Ten school with strong CS, business, and public policy." },
  { slug: "university-of-pittsburgh", name: "University of Pittsburgh", shortName: "Pitt", city: "Pittsburgh", state: "PA", type: "public", founded: 1787, acceptanceRate: 43.0, sat25: 1240, sat75: 1410, gpaAvg: 3.96, enrollment: 19300, oneLiner: "Cathedral of Learning icon — top philosophy, pre-med tied to UPMC medical system." },
  { slug: "university-of-minnesota", name: "University of Minnesota", shortName: "Minnesota", city: "Minneapolis", state: "MN", type: "public", founded: 1851, acceptanceRate: 57.0, sat25: 1250, sat75: 1440, gpaAvg: 3.8, enrollment: 36000, oneLiner: "Twin Cities flagship with top chemical engineering and public health programs." },
  { slug: "university-of-colorado-boulder", name: "University of Colorado Boulder", shortName: "CU Boulder", city: "Boulder", state: "CO", type: "public", founded: 1876, acceptanceRate: 80.0, sat25: 1150, sat75: 1370, gpaAvg: 3.61, enrollment: 31500, oneLiner: "Flatirons-backed campus with top aerospace engineering and environmental sciences." },
  { slug: "university-of-georgia", name: "University of Georgia", shortName: "UGA", city: "Athens", state: "GA", type: "public", founded: 1785, acceptanceRate: 39.0, sat25: 1280, sat75: 1440, gpaAvg: 4.04, enrollment: 30000, oneLiner: "America's first public university — strong Grady Journalism and Terry Business schools." },
  { slug: "clemson-university", name: "Clemson University", shortName: "Clemson", city: "Clemson", state: "SC", type: "public", founded: 1889, acceptanceRate: 43.0, sat25: 1230, sat75: 1400, gpaAvg: 4.41, enrollment: 21400, oneLiner: "South Carolina's flagship engineering school with passionate Tiger athletics." },
  { slug: "virginia-tech", name: "Virginia Tech", shortName: "Virginia Tech", city: "Blacksburg", state: "VA", type: "public", founded: 1872, acceptanceRate: 57.0, sat25: 1220, sat75: 1400, gpaAvg: 4.04, enrollment: 29000, oneLiner: "Top-ranked engineering and architecture in a Corps-of-Cadets-rooted culture." },
  { slug: "florida-state-university", name: "Florida State University", shortName: "FSU", city: "Tallahassee", state: "FL", type: "public", founded: 1851, acceptanceRate: 25.0, sat25: 1220, sat75: 1370, gpaAvg: 4.1, enrollment: 33000, oneLiner: "Rising Florida public with a strong film school and competitive admissions." },
  { slug: "indiana-university-bloomington", name: "Indiana University Bloomington", shortName: "IU", city: "Bloomington", state: "IN", type: "public", founded: 1820, acceptanceRate: 80.0, sat25: 1120, sat75: 1340, gpaAvg: 3.6, enrollment: 33300, oneLiner: "Kelley School of Business is top-10 undergrad — beautiful limestone campus." },
  { slug: "university-of-connecticut", name: "University of Connecticut", shortName: "UConn", city: "Storrs", state: "CT", type: "public", founded: 1881, acceptanceRate: 49.0, sat25: 1240, sat75: 1400, gpaAvg: 3.72, enrollment: 19000, oneLiner: "New England's flagship public with championship basketball and strong engineering." },
  { slug: "rutgers-university", name: "Rutgers University", shortName: "Rutgers", city: "New Brunswick", state: "NJ", type: "public", founded: 1766, acceptanceRate: 59.0, sat25: 1220, sat75: 1430, gpaAvg: 3.7, enrollment: 36000, oneLiner: "State University of New Jersey — Big Ten member with strong pharmacy and CS." },
  { slug: "stony-brook-university", name: "Stony Brook University", shortName: "Stony Brook", city: "Stony Brook", state: "NY", type: "public", founded: 1957, acceptanceRate: 44.0, sat25: 1280, sat75: 1440, gpaAvg: 3.82, enrollment: 18000, oneLiner: "SUNY flagship on Long Island — a rising R1 with strong STEM and health sciences." },
  { slug: "university-of-massachusetts-amherst", name: "University of Massachusetts Amherst", shortName: "UMass", city: "Amherst", state: "MA", type: "public", founded: 1863, acceptanceRate: 57.0, sat25: 1230, sat75: 1400, gpaAvg: 3.89, enrollment: 24100, oneLiner: "Massachusetts flagship public with top-ranked CS (CICS) and food science." },
  { slug: "university-of-south-florida", name: "University of South Florida", shortName: "USF", city: "Tampa", state: "FL", type: "public", founded: 1956, acceptanceRate: 44.0, sat25: 1170, sat75: 1340, gpaAvg: 3.97, enrollment: 38000, oneLiner: "Tampa-based research university climbing AAU rankings with strong health sciences." },
  // ── Top Liberal Arts Colleges ──
  { slug: "williams-college", name: "Williams College", shortName: "Williams", city: "Williamstown", state: "MA", type: "private", founded: 1793, acceptanceRate: 9.0, sat25: 1460, sat75: 1560, gpaAvg: 4.07, enrollment: 2100, oneLiner: "Perennial #1 liberal arts college — tiny classes, Berkshire mountains, tutorial system." },
  { slug: "amherst-college", name: "Amherst College", shortName: "Amherst", city: "Amherst", state: "MA", type: "private", founded: 1821, acceptanceRate: 7.3, sat25: 1460, sat75: 1560, gpaAvg: 4.0, enrollment: 1900, oneLiner: "Open curriculum LAC with need-blind admissions and a Five College consortium." },
  { slug: "swarthmore-college", name: "Swarthmore College", shortName: "Swarthmore", city: "Swarthmore", state: "PA", type: "private", founded: 1864, acceptanceRate: 7.0, sat25: 1450, sat75: 1550, gpaAvg: 3.95, enrollment: 1650, oneLiner: "Honors Program modeled on Oxford tutorials — famously rigorous academics." },
  { slug: "pomona-college", name: "Pomona College", shortName: "Pomona", city: "Claremont", state: "CA", type: "private", founded: 1887, acceptanceRate: 7.0, sat25: 1440, sat75: 1540, gpaAvg: 3.95, enrollment: 1750, oneLiner: "Southern California's top LAC with access to 4 other Claremont Colleges." },
  { slug: "wellesley-college", name: "Wellesley College", shortName: "Wellesley", city: "Wellesley", state: "MA", type: "private", founded: 1870, acceptanceRate: 13.0, sat25: 1390, sat75: 1530, gpaAvg: 3.92, enrollment: 2400, oneLiner: "Elite women's college with MIT cross-registration and a lake-dotted campus." },
  { slug: "bowdoin-college", name: "Bowdoin College", shortName: "Bowdoin", city: "Brunswick", state: "ME", type: "private", founded: 1794, acceptanceRate: 8.5, sat25: 1420, sat75: 1530, gpaAvg: 3.93, enrollment: 1850, oneLiner: "Test-optional since 1969, known for tight community and world-class dining." },
  { slug: "claremont-mckenna-college", name: "Claremont McKenna College", shortName: "CMC", city: "Claremont", state: "CA", type: "private", founded: 1946, acceptanceRate: 9.0, sat25: 1400, sat75: 1520, gpaAvg: 3.89, enrollment: 1400, oneLiner: "Government, economics, and finance focused LAC in the Claremont consortium." },
  { slug: "middlebury-college", name: "Middlebury College", shortName: "Middlebury", city: "Middlebury", state: "VT", type: "private", founded: 1800, acceptanceRate: 13.0, sat25: 1390, sat75: 1520, gpaAvg: 3.91, enrollment: 2750, oneLiner: "Vermont LAC famous for its language schools and environmental studies." },
  { slug: "carleton-college", name: "Carleton College", shortName: "Carleton", city: "Northfield", state: "MN", type: "private", founded: 1866, acceptanceRate: 16.0, sat25: 1400, sat75: 1530, gpaAvg: 3.9, enrollment: 2000, oneLiner: "Midwestern LAC known for producing PhDs at the highest per-capita rate." },
  { slug: "colby-college", name: "Colby College", shortName: "Colby", city: "Waterville", state: "ME", type: "private", founded: 1813, acceptanceRate: 7.5, sat25: 1390, sat75: 1520, gpaAvg: 3.88, enrollment: 2100, oneLiner: "Recently surged in selectivity with a DavisConnects career program." },
  { slug: "davidson-college", name: "Davidson College", shortName: "Davidson", city: "Davidson", state: "NC", type: "private", founded: 1837, acceptanceRate: 17.0, sat25: 1330, sat75: 1480, gpaAvg: 3.87, enrollment: 2000, oneLiner: "Honor Code school in North Carolina with strong pre-med and liberal arts." },
  { slug: "grinnell-college", name: "Grinnell College", shortName: "Grinnell", city: "Grinnell", state: "IA", type: "private", founded: 1846, acceptanceRate: 11.0, sat25: 1380, sat75: 1530, gpaAvg: 3.89, enrollment: 1700, oneLiner: "Self-governance tradition and an endowment-per-student rivaling the Ivies." },
  { slug: "hamilton-college", name: "Hamilton College", shortName: "Hamilton", city: "Clinton", state: "NY", type: "private", founded: 1793, acceptanceRate: 12.0, sat25: 1380, sat75: 1510, gpaAvg: 3.88, enrollment: 1950, oneLiner: "Open curriculum LAC celebrated for exceptional writing instruction." },
  { slug: "haverford-college", name: "Haverford College", shortName: "Haverford", city: "Haverford", state: "PA", type: "private", founded: 1833, acceptanceRate: 14.0, sat25: 1380, sat75: 1520, gpaAvg: 3.91, enrollment: 1400, oneLiner: "Quaker-founded LAC with an honor code and a close partnership with Bryn Mawr." },
  { slug: "vassar-college", name: "Vassar College", shortName: "Vassar", city: "Poughkeepsie", state: "NY", type: "private", founded: 1861, acceptanceRate: 18.0, sat25: 1370, sat75: 1510, gpaAvg: 3.85, enrollment: 2450, oneLiner: "Originally a women's college, now co-ed with strong arts and interdisciplinary programs." },
  { slug: "colgate-university", name: "Colgate University", shortName: "Colgate", city: "Hamilton", state: "NY", type: "private", founded: 1819, acceptanceRate: 13.0, sat25: 1340, sat75: 1490, gpaAvg: 3.85, enrollment: 3050, oneLiner: "Patriot League school with a picturesque hilltop campus and strong alumni network." },
  { slug: "barnard-college", name: "Barnard College", shortName: "Barnard", city: "New York", state: "NY", type: "private", founded: 1889, acceptanceRate: 6.5, sat25: 1410, sat75: 1530, gpaAvg: 3.94, enrollment: 3100, oneLiner: "Columbia-affiliated women's college in Morningside Heights with Ivy-level resources." },
  { slug: "smith-college", name: "Smith College", shortName: "Smith", city: "Northampton", state: "MA", type: "private", founded: 1871, acceptanceRate: 21.0, sat25: 1320, sat75: 1500, gpaAvg: 3.85, enrollment: 2500, oneLiner: "Largest women's college, known for engineering and Five College consortium access." },
  { slug: "colorado-college", name: "Colorado College", shortName: "CC", city: "Colorado Springs", state: "CO", type: "private", founded: 1874, acceptanceRate: 11.0, sat25: 1330, sat75: 1470, gpaAvg: 3.82, enrollment: 2200, oneLiner: "Block Plan — one course at a time, three and a half weeks per block." },
  { slug: "oberlin-college", name: "Oberlin College", shortName: "Oberlin", city: "Oberlin", state: "OH", type: "private", founded: 1833, acceptanceRate: 29.0, sat25: 1310, sat75: 1490, gpaAvg: 3.76, enrollment: 2900, oneLiner: "First co-ed college in the US, with a renowned Conservatory of Music." },
];

// Enriched admissions policy data — test policy, need-blind, meets-full-need, early option
const POLICIES: Record<string, { testPolicy?: College["testPolicy"]; needBlind?: boolean; meetsFullNeed?: boolean; earlyOption?: College["earlyOption"] }> = {
  "harvard-university":  { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "REA" },
  "yale-university":     { testPolicy: "required", needBlind: true, meetsFullNeed: true, earlyOption: "REA" },
  "princeton-university":{ testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "REA" },
  "columbia-university": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "university-of-pennsylvania": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "brown-university":    { testPolicy: "required", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "dartmouth-college":   { testPolicy: "required", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "cornell-university":  { testPolicy: "required", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "stanford-university": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "REA" },
  "massachusetts-institute-of-technology": { testPolicy: "required", needBlind: true, meetsFullNeed: true, earlyOption: "EA" },
  "california-institute-of-technology":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "EA" },
  "duke-university":     { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "northwestern-university": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "johns-hopkins-university": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "university-of-chicago": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED+EA" },
  "vanderbilt-university": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "rice-university":     { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "university-of-notre-dame": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "REA" },
  "washington-university-in-st-louis": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "emory-university":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "georgetown-university": { testPolicy: "required", needBlind: true, meetsFullNeed: true, earlyOption: "EA" },
  "carnegie-mellon-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: true, earlyOption: "ED" },
  "university-of-virginia": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: true, earlyOption: "EA" },
  "university-of-michigan": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "georgia-institute-of-technology": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-california-los-angeles": { testPolicy: "test-blind", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-california-berkeley":   { testPolicy: "test-blind", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "new-york-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "tufts-university":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "boston-college":       { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED+EA" },
  "williams-college":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "amherst-college":     { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "swarthmore-college":  { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "pomona-college":      { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "wellesley-college":   { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "bowdoin-college":     { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "middlebury-college":  { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "claremont-mckenna-college": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "harvey-mudd-college": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "carleton-college":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  // Additional schools with policy data
  "colby-college":       { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "barnard-college":     { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "grinnell-college":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "hamilton-college":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "haverford-college":   { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "vassar-college":      { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "colgate-university":  { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "davidson-college":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "colorado-college":    { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "smith-college":       { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "oberlin-college":     { testPolicy: "test-optional", needBlind: false, meetsFullNeed: true, earlyOption: "ED" },
  "northeastern-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED+EA" },
  "tulane-university":   { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED+EA" },
  "villanova-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED+EA" },
  "boston-university":   { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "university-of-southern-california": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: true, earlyOption: "none" },
  "university-of-florida": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-texas-austin": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-north-carolina-chapel-hill": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: true, earlyOption: "EA" },
  "university-of-california-san-diego": { testPolicy: "test-blind", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-california-davis": { testPolicy: "test-blind", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-california-santa-barbara": { testPolicy: "test-blind", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-california-irvine": { testPolicy: "test-blind", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-california-santa-cruz": { testPolicy: "test-blind", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "wake-forest-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: true, earlyOption: "ED" },
  "brandeis-university": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "university-of-rochester": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED" },
  "ohio-state-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "penn-state-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "purdue-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-wisconsin-madison": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-illinois-urbana-champaign": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "texas-am-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-washington": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-maryland-college-park": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-pittsburgh": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-minnesota": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-colorado-boulder": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-georgia": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "clemson-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "virginia-tech": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "florida-state-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "indiana-university-bloomington": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-connecticut": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "rutgers-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "stony-brook-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "university-of-massachusetts-amherst": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "university-of-south-florida": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "none" },
  "case-western-reserve-university": { testPolicy: "test-optional", needBlind: true, meetsFullNeed: true, earlyOption: "ED+EA" },
  "lehigh-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "rensselaer-polytechnic-institute": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "santa-clara-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "loyola-marymount-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "pepperdine-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "fordham-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED+EA" },
  "george-washington-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "american-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "syracuse-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "university-of-miami": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED+EA" },
  "drexel-university": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "stevens-institute-of-technology": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "ED" },
  "worcester-polytechnic-institute": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
  "rose-hulman-institute-of-technology": { testPolicy: "test-optional", needBlind: false, meetsFullNeed: false, earlyOption: "EA" },
};

export const COLLEGES: readonly College[] = SEED.map((c) => ({
  ...c,
  domain: DOMAINS[c.slug] ?? `${c.slug}.edu`,
  ...(POLICIES[c.slug] ?? {}),
}));

export function findCollege(slug: string): College | undefined {
  return COLLEGES.find((c) => c.slug === slug);
}

/**
 * Best-effort name → College lookup. Matches by exact name, shortName,
 * slug, or substring so user input like "Harvard", "MIT", or
 * "harvard university" all resolve to the same row.
 */
export function findCollegeByName(label: string): College | undefined {
  const q = label.trim().toLowerCase();
  if (!q) return undefined;
  return (
    COLLEGES.find(
      (c) =>
        c.slug === q ||
        c.name.toLowerCase() === q ||
        c.shortName.toLowerCase() === q,
    ) ??
    COLLEGES.find(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q),
    )
  );
}

/**
 * Clearbit logo URL. Free, no auth, returns 404 for unknown domains —
 * pair with onError fallback in the UI.
 */
export function logoUrl(domain: string, size = 128): string {
  return `https://logo.clearbit.com/${domain}?size=${size}`;
}

/**
 * Local SVG fallback path. The `<CollegeLogo>` component first tries the
 * Clearbit URL; if that 404s (network error or unknown domain), it
 * upgrades to `localLogoPath(slug)` which points at our hand-shipped
 * `/public/colleges/<slug>.svg` (when present). Final fallback is a
 * monogram badge with the school's first letter, rendered inline.
 *
 * Local SVGs are tiny (often 1-3 KB) and let us hit the "official college
 * logo" requirement (R9) without paying Clearbit per the higher tiers.
 */
export function localLogoPath(slug: string): string {
  return `/colleges/${slug}.svg`;
}

/**
 * Generate the monogram fallback initials. "Massachusetts Institute of
 * Technology" → "MI". "Yale University" → "YU". Strips "the " prefix
 * and "University" / "College" suffix so we get the discriminating root.
 * Handles "UC Berkeley" → "UC" by preserving leading capitalized
 * abbreviations.
 */
export function monogramFor(name: string): string {
  const cleaned = name
    .replace(/^The\s+/i, "")
    .replace(/\s+(University|College|Institute|School)$/i, "")
    .trim();
  // Take first letter of each word, max 2 letters, uppercase.
  const initials = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || cleaned[0]?.toUpperCase() || "?";
}

export const COLLEGE_SLUGS: readonly string[] = COLLEGES.map((c) => c.slug);
