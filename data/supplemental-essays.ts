/**
 * Supplemental essay prompts for the 2026–27 application cycle.
 *
 * Source: each school's official Common App / institutional application
 * page. Prompts change yearly — refresh in August before each cycle.
 *
 * Slugs match data/colleges.ts so the UI can deep-link from a school
 * detail page directly to its supplements.
 *
 * `guidance` and `pitfalls` are AdmitPath-authored coaching, not quoted
 * from the school. Keep them short — UI renders as bullets.
 */

export type SupplementalPrompt = {
  prompt: string;
  wordLimit: number;       // hard cap; 0 = no limit / open
  required: boolean;       // false = optional/short-answer
  guidance: string[];      // 2-4 "what they really want" bullets
  pitfalls: string[];      // 2-4 common mistakes to avoid
};

export type SchoolSupplements = {
  slug: string;
  name: string;
  cycle: string;           // "2026-27"
  promptsCommonNote?: string; // school-wide note shown above prompts
  prompts: SupplementalPrompt[];
};

export const SUPPLEMENTAL_ESSAYS: SchoolSupplements[] = [
  {
    slug: "harvard",
    name: "Harvard University",
    cycle: "2026-27",
    promptsCommonNote:
      "Harvard requires five short responses, each under 150 words. Brevity rewards you — say one sharp thing per answer.",
    prompts: [
      {
        prompt:
          "Harvard has long recognized the importance of student body diversity of all kinds. We welcome you to write about distinctive aspects of your background, personal development or the intellectual interests you might bring to your Harvard classmates.",
        wordLimit: 150,
        required: true,
        guidance: [
          "Pick ONE distinctive lens — not a list of identities.",
          "Show how it shapes how you think, not just who you are.",
          "End with what you would bring to a Harvard seminar specifically.",
        ],
        pitfalls: [
          "Generic 'I am a global citizen' framing.",
          "Restating the activity list — they have it already.",
          "Trauma-as-essay without showing growth or insight.",
        ],
      },
      {
        prompt:
          "Briefly describe an intellectual experience that was important to you.",
        wordLimit: 150,
        required: true,
        guidance: [
          "An 'experience,' not a topic — a moment where your thinking changed.",
          "Specifics: title of the book, the equation, the conversation partner.",
          "What did you do AFTER the experience? That's the proof.",
        ],
        pitfalls: [
          "Using class assignments unless they led somewhere outside the syllabus.",
          "Name-dropping a Big Author with no original take.",
        ],
      },
      {
        prompt:
          "Briefly describe any of your extracurricular activities, employment experience, travel, or family responsibilities that have shaped who you are.",
        wordLimit: 150,
        required: true,
        guidance: [
          "Pick the activity that doesn't fit the rest of your file — fill a gap.",
          "Caregiving, jobs, and family responsibilities count fully here.",
        ],
        pitfalls: [
          "Repeating your most prestigious EC.",
          "Listing instead of narrating one moment.",
        ],
      },
      {
        prompt:
          "How do you hope to use your Harvard education in the future?",
        wordLimit: 150,
        required: true,
        guidance: [
          "Concrete future > abstract calling. Field, problem, role.",
          "Tie one Harvard resource (a lab, a concentration, a House) to that future.",
        ],
        pitfalls: [
          "'I want to change the world' with no domain.",
          "Listing 5 Harvard resources without depth on any.",
        ],
      },
      {
        prompt:
          "Top 3 things your roommates might like to know about you.",
        wordLimit: 150,
        required: true,
        guidance: [
          "Lighter tone — this is the 'humanity check' essay.",
          "Specific quirks beat broad personality claims.",
        ],
        pitfalls: [
          "Listing achievements your roommate would not actually care about.",
          "Forced humor that reads as performative.",
        ],
      },
    ],
  },
  {
    slug: "stanford",
    name: "Stanford University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "The Stanford community is deeply curious and driven to learn in and out of the classroom. Reflect on an idea or experience that makes you genuinely excited about learning.",
        wordLimit: 250,
        required: true,
        guidance: [
          "Reads like a window into your brain at 11pm.",
          "An 'experience' or 'idea' — pick one and burrow.",
          "Show the chain: spark → questions → next step.",
        ],
        pitfalls: [
          "Performing intellectualism with jargon.",
          "Choosing a 'safe' canonical topic (relativity, consciousness) without a personal hook.",
        ],
      },
      {
        prompt:
          "Virtually all of Stanford's undergraduates live on campus. Write a note to your future roommate that reveals something about you or that will help your roommate — and us — get to know you better.",
        wordLimit: 250,
        required: true,
        guidance: [
          "Voice matters more here than substance — write how you actually talk.",
          "Specific quirks: what you cook at 2am, what playlists, what mess.",
        ],
        pitfalls: [
          "Treating it as another 'what makes me unique' essay.",
          "Lists with no narrative thread.",
        ],
      },
      {
        prompt:
          "Tell us about something that is meaningful to you and why.",
        wordLimit: 250,
        required: true,
        guidance: [
          "Specific object, ritual, place, person — not an abstract value.",
          "The 'why' is where 80% of the essay should live.",
        ],
        pitfalls: [
          "Writing about a parent's accomplishment instead of yours.",
          "Picking something everyone has (your phone, music) without a fresh angle.",
        ],
      },
    ],
  },
  {
    slug: "mit",
    name: "MIT",
    cycle: "2026-27",
    promptsCommonNote:
      "MIT's app is short-answer — five 200-word responses. They explicitly say 'we want to hear your voice, not a polished essay.' Take them at their word.",
    prompts: [
      {
        prompt:
          "We know you lead a busy life, full of activities, many of which are required of you. Tell us about something you do simply for the pleasure of it.",
        wordLimit: 200,
        required: true,
        guidance: [
          "It is OK if it is genuinely unimpressive. Sincerity > prestige.",
          "Show how you do it, not just that you do it.",
        ],
        pitfalls: [
          "Choosing your most prestigious EC and pretending it is for fun.",
          "Sanitizing weird hobbies into something resume-friendly.",
        ],
      },
      {
        prompt:
          "Describe the world you come from (for example, your family, school, community, city, or town). How has that world shaped your dreams and aspirations?",
        wordLimit: 200,
        required: true,
        guidance: [
          "Pick ONE world. Family AND school AND town is too much for 200 words.",
          "End on what you do with the shaping, not just what shaped you.",
        ],
        pitfalls: [
          "Generic 'my supportive family' framing.",
          "Treating socioeconomic disadvantage as the entire essay.",
        ],
      },
      {
        prompt:
          "MIT brings people with diverse backgrounds together to collaborate. Describe one way you have collaborated with people who are different from you.",
        wordLimit: 200,
        required: true,
        guidance: [
          "'Different' is broader than identity — different field, different role, different opinion.",
          "Show the friction, then the resolution.",
        ],
        pitfalls: [
          "Generic group-project examples without specific names or stakes.",
          "Implying you taught the 'different' people something instead of learning.",
        ],
      },
      {
        prompt:
          "Tell us about a significant challenge you've faced or something that didn't go according to plan that you feel comfortable sharing. How did you manage the situation?",
        wordLimit: 200,
        required: true,
        guidance: [
          "What you did beats how you felt — MIT wants engineering of self.",
          "Lower-stakes examples can be stronger than dramatic ones.",
        ],
        pitfalls: [
          "Trauma without resolution.",
          "Manufacturing a 'challenge' (a hard test) that wasn't actually one.",
        ],
      },
    ],
  },
  {
    slug: "yale",
    name: "Yale University",
    cycle: "2026-27",
    promptsCommonNote:
      "Yale wants three short answers (200 words each) plus one of three longer essays (400 words).",
    prompts: [
      {
        prompt:
          "Why do these areas of study appeal to you?",
        wordLimit: 200,
        required: true,
        guidance: [
          "Answer 'why this' AND 'why now' for each major listed.",
          "Cite one specific Yale course or professor per area.",
        ],
        pitfalls: [
          "Listing majors without explaining how they connect.",
          "Generic 'I love writing' without evidence of the actual writing.",
        ],
      },
      {
        prompt:
          "What is it about Yale that has led you to apply?",
        wordLimit: 125,
        required: true,
        guidance: [
          "Three or four specific resources, not a bulleted list of departments.",
          "Tie each to something you've already done that proves you'd use it.",
        ],
        pitfalls: [
          "Mentioning the residential college system without saying which one and why.",
          "'Yale's prestige and tradition' — do not.",
        ],
      },
      {
        prompt:
          "Reflect on a community to which you feel connected. Why is it meaningful to you?",
        wordLimit: 400,
        required: true,
        guidance: [
          "'Community' can be tiny — a 12-person club, a cousin group.",
          "Show what you give to the community, not just what you take.",
        ],
        pitfalls: [
          "Defining community as 'humanity' or 'America.'",
          "Vague 'we are a family' framing without specific shared rituals.",
        ],
      },
    ],
  },
  {
    slug: "princeton",
    name: "Princeton University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "As a research institution that also prides itself on its liberal arts curriculum, Princeton allows students to explore areas across the humanities and the arts, the natural sciences, and the social sciences. What academic areas most pique your curiosity, and how do the programs offered at Princeton suit your particular interests?",
        wordLimit: 250,
        required: true,
        guidance: [
          "Two distinct areas. Princeton is checking that you'd use the liberal arts breadth.",
          "Cite the unique academic structure: senior thesis, JP, certificates.",
        ],
        pitfalls: [
          "Naming one area only — fails the prompt.",
          "Vague 'I love many things' without specific Princeton programs.",
        ],
      },
      {
        prompt:
          "At Princeton, we value learning in and out of the classroom — including through personal interactions, civic engagement, and community service. Describe an aspect of your community that has had a profound effect on your ideals or beliefs.",
        wordLimit: 250,
        required: true,
        guidance: [
          "Princeton wants service-minded thinkers — show transferable thinking, not just hours.",
          "Be specific about which belief shifted and why.",
        ],
        pitfalls: [
          "Listing volunteer hours without a reflection arc.",
          "Conflating 'community' with 'people I helped from above.'",
        ],
      },
      {
        prompt:
          "Princeton has a longstanding commitment to service and civic engagement. Tell us how your story intersects with these ideals.",
        wordLimit: 250,
        required: true,
        guidance: [
          "'Story' implies one strand, not the whole résumé.",
          "Service ≠ formal volunteering. Quiet civic acts count.",
        ],
        pitfalls: [
          "Generic 'I want to give back' framing.",
          "Listing every service activity instead of going deep on one.",
        ],
      },
    ],
  },
  {
    slug: "columbia",
    name: "Columbia University",
    cycle: "2026-27",
    promptsCommonNote:
      "Columbia uses a list format for the first three: bullet items, no narrative. Then two short essays.",
    prompts: [
      {
        prompt:
          "List a selection of texts, resources and outlets that have contributed to your intellectual development outside of academic courses.",
        wordLimit: 100,
        required: true,
        guidance: [
          "Mix media: books, podcasts, Substacks, YouTube channels, magazines.",
          "10-15 items in a list — quality over quantity.",
        ],
        pitfalls: [
          "Filling with assigned school texts.",
          "Listing only the 'serious' canon — feels performative.",
        ],
      },
      {
        prompt:
          "Why are you interested in attending Columbia University? Please consider the aspects of Columbia that you find compelling.",
        wordLimit: 200,
        required: true,
        guidance: [
          "Core Curriculum is the right place to start — but say which course attracts you.",
          "Tie NYC location to a concrete plan, not vibes.",
        ],
        pitfalls: [
          "'Columbia is in New York City' as the entire pitch.",
          "Listing the Core without showing engagement with its ideas.",
        ],
      },
      {
        prompt:
          "What attracts you to your preferred areas of study at Columbia College or Columbia Engineering?",
        wordLimit: 200,
        required: true,
        guidance: [
          "Specific Columbia courses or labs, not just majors.",
          "If applying to SEAS, mention the specific engineering track.",
        ],
        pitfalls: [
          "Same answer that could apply to any Ivy.",
          "Listing 5 majors without explaining the through-line.",
        ],
      },
    ],
  },
  {
    slug: "upenn",
    name: "University of Pennsylvania",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Write a short thank-you note to someone you have not yet thanked and would like to acknowledge.",
        wordLimit: 200,
        required: true,
        guidance: [
          "Pick someone unexpected — a stranger, a younger sibling, a part-time job manager.",
          "Concrete moment, then what you learned from them.",
        ],
        pitfalls: [
          "Thanking a parent or teacher (everyone does this).",
          "Sentimental without specific detail.",
        ],
      },
      {
        prompt:
          "How will you explore community at Penn? Consider how Penn will help shape your perspective and identity, and how your identity and perspective will help shape Penn.",
        wordLimit: 200,
        required: true,
        guidance: [
          "Bidirectional — 50/50 on what Penn gives and what you bring.",
          "Pick one Penn community (House dean, cultural house, niche club) by name.",
        ],
        pitfalls: [
          "Listing every cultural identity without showing engagement.",
          "Vague 'I will be involved on campus' platitudes.",
        ],
      },
      {
        prompt:
          "Considering the specific undergraduate school you have selected, describe how you intend to explore your academic and intellectual interests at the University of Pennsylvania.",
        wordLimit: 400,
        required: true,
        guidance: [
          "School-specific: Wharton, CAS, SEAS, or Nursing — answer changes meaningfully.",
          "Mention 2-3 specific Penn courses, then a research or industry application.",
        ],
        pitfalls: [
          "Wharton: writing about 'making money' instead of a problem to solve.",
          "Listing courses without a coherent intellectual through-line.",
        ],
      },
    ],
  },
  {
    slug: "duke",
    name: "Duke University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "What is your sense of Duke as a university and a community, and why do you consider it a good match for you?",
        wordLimit: 250,
        required: true,
        guidance: [
          "Duke values both academic intensity and a particular Southern-Ivy social texture.",
          "Pick one academic + one community angle. Don't try to cover everything.",
        ],
        pitfalls: [
          "Generic 'top-10 school' framing.",
          "Mentioning basketball as the cultural hook (overdone).",
        ],
      },
      {
        prompt:
          "We believe a wide range of viewpoints, beliefs and lived experiences are essential to maintaining Duke as a vibrant and meaningful living and learning community. Share with us one community that you belong to and why it is meaningful to you.",
        wordLimit: 250,
        required: false,
        guidance: [
          "Optional but highly recommended — counted as part of holistic review.",
          "One community only. Show your specific role inside it.",
        ],
        pitfalls: [
          "Treating it as DEI box-check.",
          "Listing identity labels without lived detail.",
        ],
      },
    ],
  },
  {
    slug: "uchicago",
    name: "University of Chicago",
    cycle: "2026-27",
    promptsCommonNote:
      "UChicago is famous for its 'uncommon' prompts. They are looking for intellectual play and rigor in equal measure. The standard 'why us' is also required.",
    prompts: [
      {
        prompt:
          "How does the University of Chicago, as you know it now, satisfy your desire for a particular kind of learning, community, and future?",
        wordLimit: 650,
        required: true,
        guidance: [
          "Engage with the Core, the quarter system, and the 'life of the mind' culture by name.",
          "Show you can do critical thinking on the page, not just claim to value it.",
        ],
        pitfalls: [
          "Generic 'fit' essay that could go to any school.",
          "Listing programs without engaging with the intellectual culture.",
        ],
      },
      {
        prompt:
          "Choose one of the six 'extended essay' prompts (rotates yearly — examples include: 'In Homer's Iliad, the Greek hero Achilles dragged the body of Hector around the gates of Troy. Why do we drag things?' or 'Vestigial means having become functionless in the course of evolution. Tell us about something vestigial (real or imagined) and provide an explanation for its existence.').",
        wordLimit: 0,
        required: true,
        guidance: [
          "No word limit, but 500-1000 is the sweet spot.",
          "Be playful AND rigorous. Pure cleverness without depth fails.",
          "Show how YOU think, not just that you can write.",
        ],
        pitfalls: [
          "Treating it as a creative writing assignment with no argument.",
          "Going so abstract no one can tell what you're saying.",
          "Ignoring the prompt's actual question while showing off.",
        ],
      },
    ],
  },
  {
    slug: "northwestern",
    name: "Northwestern University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "We want to be sure we're considering your application in the context of your personal experiences: What aspects of your background, your identity, or your school, community, and/or family have most shaped how you see yourself engaging in Northwestern's community?",
        wordLimit: 300,
        required: true,
        guidance: [
          "'Most shaped' = pick ONE. Northwestern wants a specific shaping force.",
          "Tie to a concrete way you'd engage at NU — a dorm, a club, a specific class dynamic.",
        ],
        pitfalls: [
          "Listing every identity instead of going deep.",
          "Vague 'I want to be involved' without specific NU touchpoints.",
        ],
      },
      {
        prompt:
          "Painting 'The Rock' is a tradition at Northwestern that invites all students to access this 1,400-pound symbol of Northwestern by painting it to express ideas, causes, and interests. Describe a tradition, value, or practice that is important to your life. How would you bring that with you to Northwestern?",
        wordLimit: 200,
        required: true,
        guidance: [
          "Concrete tradition (Friday game night, weekly call with grandma) > abstract value.",
          "Show the practice in action, then translate to NU campus life.",
        ],
        pitfalls: [
          "Picking 'family dinner' without a specific scene.",
          "Listing values without practices.",
        ],
      },
    ],
  },
  {
    slug: "brown",
    name: "Brown University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Brown's Open Curriculum allows students to explore broadly while also diving deeply into their academic pursuits. Tell us about any academic interests that excite you, and how you might use the Open Curriculum to pursue them.",
        wordLimit: 200,
        required: true,
        guidance: [
          "The Open Curriculum is the heart of Brown — engage seriously.",
          "Show 2-3 areas + how they connect through your specific path.",
        ],
        pitfalls: [
          "Treating 'no requirements' as 'no plan.'",
          "Naming a single major without showing breadth.",
        ],
      },
      {
        prompt:
          "Students entering Brown often find that making their home on College Hill naturally invites reflection on where they came from. Share how an aspect of your growing up has inspired or challenged you.",
        wordLimit: 200,
        required: true,
        guidance: [
          "'Inspired OR challenged' — pick one mode and commit.",
          "Concrete scene > abstract reflection on your hometown.",
        ],
        pitfalls: [
          "Generic 'I'm from a small town' framing.",
          "Picking a challenge without an arc to growth.",
        ],
      },
      {
        prompt:
          "Brown students care deeply about their work and the world around them. Students find contentment, satisfaction, and meaning in daily interactions and major discoveries. Whether big or small, mundane or spectacular, tell us about something that brings you joy.",
        wordLimit: 200,
        required: true,
        guidance: [
          "MUNDANE is allowed and often stronger.",
          "Sensory specificity — what does the joy actually look/sound/feel like.",
        ],
        pitfalls: [
          "Performing joy at something prestigious.",
          "Listing five joys instead of one.",
        ],
      },
    ],
  },
  {
    slug: "cornell",
    name: "Cornell University",
    cycle: "2026-27",
    promptsCommonNote:
      "Cornell's supplements are college-specific — the prompt depends on which of the seven undergraduate schools you apply to.",
    prompts: [
      {
        prompt:
          "Students in Arts and Sciences embrace the opportunity to delve into multifaceted academic interests, embodying in 21st century terms Ezra Cornell's founding vision: '...any person... any study.' Tell us about the areas of study you are excited to explore, and specifically, why you wish to pursue them in our College.",
        wordLimit: 650,
        required: true,
        guidance: [
          "Cornell Arts & Sciences example — adapt to your specific college.",
          "Be aggressive about specificity: courses, profs, labs, programs.",
          "Connect 'any person any study' to your own intellectual story.",
        ],
        pitfalls: [
          "One-size-fits-all 'why I love your school' essay.",
          "Listing departments without showing how you'd combine them.",
        ],
      },
    ],
  },
  {
    slug: "dartmouth",
    name: "Dartmouth College",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Dartmouth celebrates the ways in which its profound sense of place informs its profound sense of purpose. As you seek admission to Dartmouth's Class of 2030, what aspects of the College's academic program, community, or campus environment attract your interest?",
        wordLimit: 100,
        required: true,
        guidance: [
          "Only 100 words — pick ONE specific Dartmouth thing and commit.",
          "Foreign Study Programs, the D-Plan, House Communities, Dartmouth Outing Club.",
        ],
        pitfalls: [
          "Trying to cover three reasons in 100 words.",
          "Generic Ivy-themed answer.",
        ],
      },
      {
        prompt:
          "Choose one of the following prompts (rotates yearly — themes include: a moment of failure, a question you can't stop thinking about, a community you belong to).",
        wordLimit: 250,
        required: true,
        guidance: [
          "Pick the prompt you have actual evidence for, not the most impressive-sounding.",
          "One scene, one insight. 250 words is tight.",
        ],
        pitfalls: [
          "Choosing a prompt to 'sound interesting' with no story.",
          "Trying to cover multiple stories.",
        ],
      },
    ],
  },
  {
    slug: "berkeley",
    name: "UC Berkeley",
    cycle: "2026-27",
    promptsCommonNote:
      "All UC schools share the Personal Insight Questions: 8 prompts, pick 4, 350 words each. Berkeley does not have additional supplements.",
    prompts: [
      {
        prompt:
          "Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes or contributed to group efforts over time.",
        wordLimit: 350,
        required: false,
        guidance: [
          "PIQ #1 — pick one of four. Leadership without title is fully valid.",
          "Show the influence concretely — a specific person, a specific change.",
        ],
        pitfalls: [
          "Listing positions without showing leadership behavior.",
          "Performative 'I learned to listen' arcs without action.",
        ],
      },
      {
        prompt:
          "Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and artistically, to name a few. Describe how you express your creative side.",
        wordLimit: 350,
        required: false,
        guidance: [
          "PIQ #2 — strong choice for STEM students who don't fit 'arts.'",
          "Originality of thought counts — debugging, math problems, inventing systems.",
        ],
        pitfalls: [
          "Defining creativity as 'I take art class.'",
          "Listing creative outputs without a process.",
        ],
      },
      {
        prompt:
          "What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time?",
        wordLimit: 350,
        required: false,
        guidance: [
          "PIQ #3 — needs a clear arc of practice + outcome.",
          "Skill, not credential. Coding > 'I have an A in CS.'",
        ],
        pitfalls: [
          "Naming a generic skill (hard work, perseverance).",
          "Showing the talent at one point in time only.",
        ],
      },
      {
        prompt:
          "Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced.",
        wordLimit: 350,
        required: false,
        guidance: [
          "PIQ #4 — both halves work; pick one.",
          "UC reads many of these — concrete actions beat hardship narratives.",
        ],
        pitfalls: [
          "Treating 'educational barrier' as just 'a hard class.'",
          "Listing every program without specifics.",
        ],
      },
    ],
  },
  {
    slug: "ucla",
    name: "UCLA",
    cycle: "2026-27",
    promptsCommonNote:
      "Same UC PIQs as Berkeley — pick any 4 of the 8. UCLA does not require additional supplements.",
    prompts: [
      {
        prompt:
          "(See the Berkeley supplemental page — UCLA shares the same 8 UC Personal Insight Questions. Choose any 4.)",
        wordLimit: 350,
        required: true,
        guidance: [
          "Strategy: spread topics across academics, character, leadership, creativity.",
          "Don't repeat themes from your Common App essay (UC has none).",
        ],
        pitfalls: [
          "Picking 4 prompts that all show the same trait.",
          "Treating the PIQs as essays — they're answers, not narratives.",
        ],
      },
    ],
  },
  {
    slug: "nyu",
    name: "NYU",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "We would like to know more about your interest in NYU. What motivated you to apply to NYU? Why have you applied or expressed interest in a particular campus, school, college, program, and area of study?",
        wordLimit: 400,
        required: true,
        guidance: [
          "If you picked a specific school (Stern, Tisch, Tandon), commit fully.",
          "Use 'New York City' as setting for a specific plan, not the whole answer.",
        ],
        pitfalls: [
          "'I want to live in New York' as the headline.",
          "Listing NYU's three campuses (NY/Abu Dhabi/Shanghai) without context.",
        ],
      },
    ],
  },
  {
    slug: "carnegie-mellon",
    name: "Carnegie Mellon University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Most students choose their intended major or area of study based on a passion or inspiration that's developed over time — what passion or inspiration led you to choose this area of study?",
        wordLimit: 300,
        required: true,
        guidance: [
          "CMU is school-specific (CIT, SCS, Dietrich, Tepper, CFA, MCS).",
          "Origin story → development → why CMU specifically.",
        ],
        pitfalls: [
          "Generic 'I love computers' for SCS.",
          "Skipping the 'why CMU' link.",
        ],
      },
      {
        prompt:
          "Many students pursue college for a specific degree, career opportunity or personal goal. Whichever it may be, learning will be critical to achieve your ultimate goal. As you think ahead to the process of learning during your college years, how will you define a successful college experience for yourself?",
        wordLimit: 300,
        required: true,
        guidance: [
          "Define success in YOUR terms before listing CMU resources.",
          "Tie back to one specific CMU program that supports your definition.",
        ],
        pitfalls: [
          "Defining success as 'a job at FAANG.'",
          "Listing CMU rankings instead of personal definition.",
        ],
      },
    ],
  },
  {
    slug: "michigan",
    name: "University of Michigan",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Everyone belongs to many different communities and/or groups defined by (among other things) shared geography, religion, ethnicity, income, cuisine, interest, race, ideology, or intellectual heritage. Choose one of the communities to which you belong, and describe that community and your place within it.",
        wordLimit: 300,
        required: true,
        guidance: [
          "Pick a specific, scoped community — not 'America' or 'humanity.'",
          "'Your place within it' is the second half — give it equal weight.",
        ],
        pitfalls: [
          "Generic identity-based community without lived detail.",
          "Treating community as a resume line.",
        ],
      },
      {
        prompt:
          "Describe the unique qualities that attract you to the specific undergraduate College or School (including preferred admission and dual degree programs) to which you are applying at the University of Michigan. How would that curriculum support your interests?",
        wordLimit: 550,
        required: true,
        guidance: [
          "School-specific (LSA, Engineering, Ross, Ross Direct Admit, Stamps, Music).",
          "Long form — go deep on 3-4 academic resources, not surface on 10.",
        ],
        pitfalls: [
          "Same 'why us' essay you sent to Wisconsin.",
          "Listing UM's size and Big Ten as core reasons.",
        ],
      },
    ],
  },
  {
    slug: "georgetown",
    name: "Georgetown University",
    cycle: "2026-27",
    promptsCommonNote:
      "Georgetown has its own application portal (not Common App). The four prompts include the famous 'Why Georgetown.'",
    prompts: [
      {
        prompt:
          "Briefly discuss the significance to you of the school or summer activity in which you have been most involved.",
        wordLimit: 250,
        required: true,
        guidance: [
          "ONE activity — most involved by hours/depth, not most prestigious.",
          "Show what you learned about yourself, not just what you did.",
        ],
        pitfalls: [
          "Repeating Common App activity descriptions.",
          "Choosing a prestigious activity you only briefly did.",
        ],
      },
      {
        prompt:
          "As Georgetown is a diverse community, the Admissions Committee would like to know more about you in your own words. Please submit a brief essay, either personal or creative, which you feel best describes you.",
        wordLimit: 650,
        required: true,
        guidance: [
          "Reads basically as a second Common App essay — make it different.",
          "Personal or creative is open — pick the format that shows your range.",
        ],
        pitfalls: [
          "Using your Common App essay verbatim.",
          "Choosing 'creative' to dodge having to be personal.",
        ],
      },
      {
        prompt:
          "(School-specific question — varies by Georgetown College, SFS, McDonough, NHS.)",
        wordLimit: 400,
        required: true,
        guidance: [
          "SFS: international affairs angle is non-negotiable. Cite a current event.",
          "McDonough: business + Jesuit values intersection.",
        ],
        pitfalls: [
          "SFS without showing prior intl-affairs engagement.",
          "Generic 'I want to study business' for McDonough.",
        ],
      },
    ],
  },
  {
    slug: "vanderbilt",
    name: "Vanderbilt University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Vanderbilt offers a community where students find balance between their academic and social experiences. Please briefly elaborate on how one of your extracurricular activities or work experiences has influenced you.",
        wordLimit: 250,
        required: true,
        guidance: [
          "ONE activity. Vanderbilt wants depth, not range.",
          "'Influenced you' = specific change in how you think or act.",
        ],
        pitfalls: [
          "Listing multiple activities to seem 'well-rounded.'",
          "Vague 'taught me leadership' platitudes.",
        ],
      },
    ],
  },
  {
    slug: "tufts",
    name: "Tufts University",
    cycle: "2026-27",
    promptsCommonNote:
      "Tufts is famous for prompts that reward intellectual playfulness and quirk. The 'why Tufts' answer is short — the longer essay is where you really get to show range.",
    prompts: [
      {
        prompt:
          "Which aspects of Tufts' curriculum or undergraduate experience prompt your application? In short, 'Why Tufts?'",
        wordLimit: 150,
        required: true,
        guidance: [
          "Pick 1-2 specific Tufts elements (Experimental College, civic-engagement requirement, Eliot-Pearson, Fletcher exposure for IR-leaning).",
          "Tie each to evidence from your own life that you'd actually use it.",
        ],
        pitfalls: [
          "Generic 'Tufts is a great school' framing.",
          "Listing departments without showing engagement with specifics.",
        ],
      },
      {
        prompt:
          "Choose one of the following longer prompts (rotates yearly — themes include: a strange topic that interests you, a community you've helped to shape, or a question you can't stop thinking about).",
        wordLimit: 250,
        required: true,
        guidance: [
          "Tufts rewards genuine weirdness — pick the prompt that lets you be most yourself.",
          "Specific, sensory writing wins. Tufts readers see thousands of generic essays.",
        ],
        pitfalls: [
          "Performing quirk instead of being quirky.",
          "Treating these as standard 'tell us about your community' prompts.",
        ],
      },
    ],
  },
  {
    slug: "usc",
    name: "USC",
    cycle: "2026-27",
    promptsCommonNote:
      "USC short-answers are 100 words each. Lighter touch than other supplements, but you have to be precise — 100 words moves fast.",
    prompts: [
      {
        prompt:
          "Describe yourself in three words.",
        wordLimit: 25,
        required: true,
        guidance: [
          "Three SPECIFIC words. 'Curious, kind, hardworking' is everyone's answer.",
          "Pick words that make admissions ask 'wait, what does that one mean?'",
        ],
        pitfalls: [
          "Generic adjectives.",
          "Words that sound impressive but you can't back up.",
        ],
      },
      {
        prompt:
          "What is your favorite snack?",
        wordLimit: 25,
        required: true,
        guidance: [
          "Just a snack. Resist the urge to make it metaphorical.",
          "Specific brand or preparation > generic ('pretzels' < 'Trader Joe's everything bagel mini-pretzels').",
        ],
        pitfalls: [
          "Trying to make 'apple slices' into a personality essay.",
        ],
      },
      {
        prompt:
          "Describe how you plan to pursue your academic interests and why you want to explore them at USC specifically. Feel free to address your first- and second-choice major selections.",
        wordLimit: 250,
        required: true,
        guidance: [
          "Pick first + second major and address both — they ask for it.",
          "USC has 100+ majors, dual-degrees, and Thematic Option — name the SPECIFIC ones you'd combine.",
        ],
        pitfalls: [
          "Generic 'why I love your school' framing.",
          "Naming a single major when prompted for two.",
        ],
      },
    ],
  },
  {
    slug: "notre-dame",
    name: "University of Notre Dame",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Each year more than 24,000 students apply to Notre Dame. Our students come from places big and small, from schools public and private, and from family backgrounds and experiences that span the spectrum. We seek to bring them together in formation of a community where students of different backgrounds and worldviews engage one another and grow together. What contributions would you make to our community and how have your background and experiences prepared you to make those contributions?",
        wordLimit: 200,
        required: true,
        guidance: [
          "Notre Dame's community ethos is real — engage with it specifically.",
          "Show what you'd give to ND, not just what ND would give you.",
        ],
        pitfalls: [
          "Listing identity labels without lived specificity.",
          "Generic 'I'd contribute diversity' framing.",
        ],
      },
      {
        prompt:
          "Choose one of the following: discuss a moment when you found a sense of purpose, your view of a 'force for good,' or a tradition that has shaped you.",
        wordLimit: 200,
        required: true,
        guidance: [
          "Notre Dame's Catholic identity makes faith/values topics welcome — but not required.",
          "Pick the prompt where your specific story is sharpest.",
        ],
        pitfalls: [
          "Generic 'religion is important to me' framing without a scene.",
          "Avoiding any value-laden topic to seem 'safe.'",
        ],
      },
    ],
  },
  {
    slug: "rice",
    name: "Rice University",
    cycle: "2026-27",
    promptsCommonNote:
      "Rice's residential-college system is its main differentiator — engage with it explicitly in at least one of these prompts.",
    prompts: [
      {
        prompt:
          "Please explain why you wish to study in the academic areas you selected.",
        wordLimit: 150,
        required: true,
        guidance: [
          "Why this major specifically, not why majors matter.",
          "Cite a Rice course or research lab if you can.",
        ],
        pitfalls: [
          "Generic origin story without showing current engagement.",
          "Overclaiming expertise.",
        ],
      },
      {
        prompt:
          "Based upon your exploration of Rice University, what elements of the Rice experience appeal to you?",
        wordLimit: 150,
        required: true,
        guidance: [
          "Residential college system, by name. Mention which one you'd want to be sorted into and why.",
          "Honor code, small student-body, Houston location — pick 2 specific elements.",
        ],
        pitfalls: [
          "Treating it as another 'why us' for a generic Top-25 school.",
          "Failing to mention residential colleges (Rice's signature).",
        ],
      },
      {
        prompt:
          "Rice is strengthened by its diverse community of learning and discovery. What perspectives shaped by your background, experiences, traditions or upbringing will you contribute to the Rice community?",
        wordLimit: 500,
        required: true,
        guidance: [
          "Long form — go deep. 500 words allows scenes plus reflection.",
          "Contribute is the operative word — show what you'd ADD.",
        ],
        pitfalls: [
          "DEI-box-check tone.",
          "Listing identity markers without showing how they'd shape your Rice experience.",
        ],
      },
    ],
  },
  {
    slug: "johns-hopkins",
    name: "Johns Hopkins University",
    cycle: "2026-27",
    prompts: [
      {
        prompt:
          "Tell us about an aspect of your identity (e.g. race, gender, sexuality, religion, community) or a life experience that has shaped you as an individual and how this influenced what you want to learn or do at Johns Hopkins.",
        wordLimit: 350,
        required: true,
        guidance: [
          "Hopkins wants the 'how this influenced what you want to do at Hopkins' second half — most students under-deliver here.",
          "Tie to specific Hopkins programs / labs / professors / courses.",
        ],
        pitfalls: [
          "Identity essay with no link back to Hopkins.",
          "Generic 'I want to study premed at JHU.'",
        ],
      },
    ],
  },
];

/**
 * Look up by slug, case-insensitive. Returns null if not in DB.
 */
export function getSupplementsForSchool(slug: string): SchoolSupplements | null {
  const normalized = slug.trim().toLowerCase();
  // Direct match on the short-form supplemental slug.
  const direct = SUPPLEMENTAL_ESSAYS.find((s) => s.slug.toLowerCase() === normalized);
  if (direct) return direct;

  // Map from colleges.ts long-form slugs (e.g. "harvard-university",
  // "massachusetts-institute-of-technology") to the short-form slugs we
  // use for /supplemental/[slug]. Lets the deep-link card on
  // /college/[slug] resolve without forcing the two data files to share
  // a slug scheme.
  const mapped = COLLEGE_SLUG_TO_SUPPLEMENT[normalized];
  if (mapped) {
    return SUPPLEMENTAL_ESSAYS.find((s) => s.slug.toLowerCase() === mapped) ?? null;
  }
  return null;
}

export function listSupplementSlugs(): string[] {
  return SUPPLEMENTAL_ESSAYS.map((s) => s.slug);
}

/**
 * Map data/colleges.ts slug → data/supplemental-essays.ts slug.
 *
 * Colleges uses verbose canonical slugs ("harvard-university",
 * "massachusetts-institute-of-technology") while supplemental uses short
 * URL-friendly slugs ("harvard", "mit"). This mapping lets the
 * `/college/[slug]` deep-link card resolve to the supplemental page.
 *
 * Add a row when you add a school to either file. Missing rows just
 * mean the deep-link card won't render — no runtime breakage.
 */
const COLLEGE_SLUG_TO_SUPPLEMENT: Record<string, string> = {
  "harvard-university": "harvard",
  "yale-university": "yale",
  "princeton-university": "princeton",
  "columbia-university": "columbia",
  "university-of-pennsylvania": "upenn",
  "brown-university": "brown",
  "dartmouth-college": "dartmouth",
  "cornell-university": "cornell",
  "stanford-university": "stanford",
  "massachusetts-institute-of-technology": "mit",
  "duke-university": "duke",
  "northwestern-university": "northwestern",
  "johns-hopkins-university": "johns-hopkins",
  "university-of-chicago": "uchicago",
  "vanderbilt-university": "vanderbilt",
  "rice-university": "rice",
  "university-of-notre-dame": "notre-dame",
  "tufts-university": "tufts",
  "university-of-southern-california": "usc",
  "carnegie-mellon-university": "carnegie-mellon",
  "georgetown-university": "georgetown",
  "university-of-michigan": "michigan",
  "new-york-university": "nyu",
  "university-of-california-berkeley": "berkeley",
  "university-of-california-los-angeles": "ucla",
};
