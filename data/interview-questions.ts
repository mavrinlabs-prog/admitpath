/**
 * Interview question database for adaptive practice.
 *
 * Sources: real alumni interview reports from Harvard, Yale, MIT, Stanford,
 * Georgetown, Princeton, Columbia, Penn, Brown, Dartmouth, Duke, Northwestern.
 *
 * Georgetown conducts evaluative interviews (admissions officers, not alumni).
 * MIT interviews are casual/conversational ("fun chat" vibe).
 * Harvard/Yale/Princeton use alumni-conducted informational interviews.
 * Stanford no longer offers interviews (replaced with short-answer questions).
 */

export type InterviewQuestion = {
  id: string;
  question: string;
  category: "personal" | "academic" | "why-school" | "extracurricular" | "challenge" | "future";
  difficulty: "easy" | "medium" | "hard";
  tips: string[];
  commonMistakes: string[];
  exampleAnswer: string;
  followUps: string[];
  /** Schools known to ask this or a close variant. */
  schools?: string[];
};

export const INTERVIEW_CATEGORIES = {
  personal: {
    label: "Personal / Tell Me About Yourself",
    description: "Who you are beyond the transcript. Interviewers want to hear your voice, not a resume recitation.",
    color: "#4A6FA5",
  },
  academic: {
    label: "Academic Interests",
    description: "What you study, why it matters to you, and how you think about learning.",
    color: "#2E8B57",
  },
  "why-school": {
    label: "Why This School",
    description: "Demonstrate genuine research. Generic answers are the fastest way to lose points.",
    color: "#2E4A6E",
  },
  extracurricular: {
    label: "Extracurriculars & Leadership",
    description: "Depth over breadth. One meaningful commitment beats ten surface-level clubs.",
    color: "#3A7C6A",
  },
  challenge: {
    label: "Challenges & Growth",
    description: "How you handle adversity. Interviewers want honesty, not a packaged hero narrative.",
    color: "#5A7EA8",
  },
  future: {
    label: "Future Goals & Impact",
    description: "Where you are headed and why. Specificity beats grand ambition.",
    color: "#3A7CA5",
  },
} as const;

export type InterviewCategory = keyof typeof INTERVIEW_CATEGORIES;

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ─── PERSONAL (10) ────────────────────────────────────────────────────
  {
    id: "p1",
    question: "Tell me about yourself.",
    category: "personal",
    difficulty: "easy",
    tips: [
      "Lead with something unexpected — not your GPA or SAT score.",
      "Share a specific story or moment that reveals who you are.",
      "Keep it under 2 minutes. The interviewer wants a conversation, not a monologue.",
    ],
    commonMistakes: [
      "Reciting your resume or activities list.",
      "Starting with 'Well, I'm a student at...' — too generic.",
      "Being so broad that nothing sticks. One vivid detail beats five vague ones.",
    ],
    exampleAnswer: "Most people know me as the kid who runs the robotics team, but honestly, the thing that takes up the most space in my brain is bread. I started baking sourdough during quarantine — I know, very 2020 — but it turned into this obsession with fermentation science. I now maintain three starter cultures and I've been documenting the relationship between hydration ratios and crumb structure. My physics teacher says I'm the only student who's ever brought a loaf of bread as a lab report. That intersection of science and craft is what I keep coming back to — whether it's robotics or bread, I love understanding systems from the inside out.",
    followUps: [
      "What's the most interesting thing you've learned about fermentation?",
      "How does your robotics work connect to your interest in systems?",
    ],
    schools: ["Harvard", "Yale", "Princeton", "MIT", "Georgetown"],
  },
  {
    id: "p2",
    question: "What do you do for fun?",
    category: "personal",
    difficulty: "easy",
    tips: [
      "Be genuine. This is a vibe check, not an achievement test.",
      "Show personality — hobbies that aren't on your resume are great.",
      "Connect it lightly to who you are, but don't force a lesson.",
    ],
    commonMistakes: [
      "Listing only 'productive' hobbies to seem impressive.",
      "Saying 'I don't really have time for fun' — sounds robotic.",
      "Over-explaining why your hobby matters for college admissions.",
    ],
    exampleAnswer: "I'm really into film photography — I shoot on this old Pentax K1000 my dad found at a garage sale. There's something about having 36 shots on a roll that forces you to be intentional. I also play pickup basketball most weekends, and I've been slowly working through every Anthony Bourdain episode. He had this way of making food about people and places, not just ingredients.",
    followUps: [
      "What's your favorite photo you've taken?",
      "What draws you to film over digital?",
    ],
    schools: ["MIT", "Brown", "Dartmouth"],
  },
  {
    id: "p3",
    question: "What's a book, article, or podcast that changed how you think?",
    category: "personal",
    difficulty: "medium",
    tips: [
      "Pick something you actually engaged with deeply, not what sounds impressive.",
      "Explain what specifically shifted in your thinking — not just 'it was interesting.'",
      "It's fine if it's not a classic. A Reddit thread that rewired your perspective counts.",
    ],
    commonMistakes: [
      "Name-dropping a book you haven't actually read.",
      "Picking something just because it sounds intellectual.",
      "Summarizing the book instead of explaining its impact on you.",
    ],
    exampleAnswer: "I read 'Evicted' by Matthew Desmond for AP Gov, and it fundamentally changed how I understand poverty. Before, I had this vague idea that people are poor because of bad decisions. Desmond shows how eviction isn't just a consequence of poverty — it's a cause. One family loses their housing, the kids change schools, the parent loses their job because they can't get to work, and the cycle accelerates. It made me rethink every time I'd driven past a motel and not thought about who lives there.",
    followUps: [
      "Has that changed anything about how you spend your time or what you want to study?",
      "What would you want to understand better about housing policy?",
    ],
    schools: ["Harvard", "Yale", "Princeton", "Georgetown", "Columbia"],
  },
  {
    id: "p4",
    question: "If you could have dinner with anyone, living or dead, who would it be and why?",
    category: "personal",
    difficulty: "medium",
    tips: [
      "The 'why' matters far more than the 'who.' Your reasoning reveals your values.",
      "Pick someone you'd genuinely want to talk to, not just impress an interviewer with.",
      "Have 2-3 specific questions you'd ask them ready.",
    ],
    commonMistakes: [
      "Picking someone famous without a specific reason — 'Einstein because he was smart.'",
      "Choosing a safe answer like a grandparent without making it specific.",
      "Not having follow-up thoughts about what you'd discuss.",
    ],
    exampleAnswer: "I'd pick Rosalind Franklin. Not just because of the DNA work — everyone knows that story — but because I want to understand what it felt like to do paradigm-shifting science and not get credit for it in your lifetime. I'd ask her whether she knew, in the moment, how important Photo 51 was. And honestly, I'd ask her about the politics of her lab — because I'm starting to realize that science isn't just about being right, it's about navigating institutions, and she's the clearest case study I know.",
    followUps: [
      "What do you think she would say about the state of women in science today?",
      "How has learning about her shaped your view of scientific collaboration?",
    ],
    schools: ["Princeton", "Yale", "Georgetown"],
  },
  {
    id: "p5",
    question: "What are you most proud of?",
    category: "personal",
    difficulty: "medium",
    tips: [
      "Choose something that reveals character, not just achievement.",
      "The best answers involve doing something hard when nobody was watching.",
      "Show what you learned about yourself through the process.",
    ],
    commonMistakes: [
      "Listing an award or score — pride in character beats pride in credentials.",
      "Being falsely humble — own the thing you're proud of.",
      "Picking something so small it seems like you're avoiding the question.",
    ],
    exampleAnswer: "I'm most proud of the tutoring program I built at my school. Not the program itself — that was just logistics — but the moment six months in when I realized I'd been tutoring wrong. I was explaining concepts the way I understood them, which wasn't helping. I had to learn to shut up and listen to where each student was actually stuck. The program went from 8 to 40 students after I trained the other tutors to do the same thing. I'm proud that I was willing to admit the thing I built wasn't working and rebuild it.",
    followUps: [
      "What specifically did you change about your tutoring approach?",
      "How did you train the other tutors?",
    ],
    schools: ["Harvard", "Penn", "Duke"],
  },
  {
    id: "p6",
    question: "How would your best friend describe you?",
    category: "personal",
    difficulty: "easy",
    tips: [
      "Be honest and a little self-aware. Humor works well here.",
      "Include a flaw or quirk — perfect answers feel rehearsed.",
      "Ground it in a real anecdote your friend would actually tell.",
    ],
    commonMistakes: [
      "Listing only positive adjectives like 'hardworking, dedicated, kind.'",
      "Being too self-deprecating — the interviewer wants to like you.",
      "Describing yourself the way a recommendation letter would, not a friend.",
    ],
    exampleAnswer: "She'd probably say I'm the person who over-researches everything. Like, if we're picking a restaurant, I've already read 30 Yelp reviews and mapped out the menu. She'd also say I'm stubborn in a good way — I don't let things go until I understand them. And she'd definitely mention that I'm the worst texter in our friend group. I'll leave someone on read for two days and then show up with a three-paragraph response about something they said on Tuesday.",
    followUps: [
      "Is there something your friend would say that might surprise me?",
      "Do you think your stubbornness is always a strength?",
    ],
    schools: ["Yale", "Brown", "Dartmouth"],
  },
  {
    id: "p7",
    question: "What's something you believe that most people disagree with?",
    category: "personal",
    difficulty: "hard",
    tips: [
      "Pick a genuine belief, not a contrarian one for shock value.",
      "Show that you've thought about the counterarguments.",
      "It doesn't have to be political — it can be about education, culture, or daily life.",
    ],
    commonMistakes: [
      "Being deliberately controversial without substance.",
      "Picking something nobody actually disagrees with ('I believe in kindness').",
      "Getting defensive instead of showing intellectual openness.",
    ],
    exampleAnswer: "I think homework in its current form does more harm than good for most high schoolers. Not because learning outside of class is bad — I do that constantly — but because the busywork-to-learning ratio is terrible. When I track my own homework, maybe 20% of it actually deepens understanding. The rest is compliance. I know teachers disagree, and I respect that they're working within a system. But I think if we replaced homework with student-directed projects, the top students would go deeper and the struggling students would stop falling behind from work they never understood in the first place.",
    followUps: [
      "How would you design an alternative to traditional homework?",
      "Have you talked to any teachers about this?",
    ],
    schools: ["MIT", "Stanford", "Brown"],
  },
  {
    id: "p8",
    question: "What would you want me to know about you that isn't in your application?",
    category: "personal",
    difficulty: "hard",
    tips: [
      "This is your chance to add dimension. Share something genuinely new.",
      "It could be a hobby, a family dynamic, a side of your personality.",
      "The best answers make the interviewer see you differently.",
    ],
    commonMistakes: [
      "Repeating something from your application in different words.",
      "Saying 'I think my application covers it' — missed opportunity.",
      "Oversharing personal details that make the interviewer uncomfortable.",
    ],
    exampleAnswer: "My application talks about my research, but it doesn't capture the fact that I'm basically my family's IT department. My parents are immigrants and neither of them is comfortable with technology, so I've been handling everything from filing their taxes online to setting up my grandmother's telemedicine appointments. It's taught me a lot about how technology fails people who didn't grow up with it. That's actually what got me interested in accessible design — not a class, but watching my mom struggle with a health insurance portal that assumed everyone reads English fluently.",
    followUps: [
      "How has that experience shaped what you want to build?",
      "What's the most frustrating design you've helped your family navigate?",
    ],
    schools: ["Harvard", "Yale", "Princeton", "Columbia"],
  },
  {
    id: "p9",
    question: "What does your typical day look like?",
    category: "personal",
    difficulty: "easy",
    tips: [
      "Be real — include the mundane alongside the impressive.",
      "Use it to show how you manage your time and energy.",
      "Mention something unexpected that reveals personality.",
    ],
    commonMistakes: [
      "Making every hour sound productive — it feels fake.",
      "Listing activities without giving any texture or feeling.",
      "Forgetting to mention anything that isn't school-related.",
    ],
    exampleAnswer: "I wake up at 6:15, argue with my alarm for ten minutes, then make pour-over coffee — that's non-negotiable. School from 7:30 to 2:45. After school, I either have debate practice or I go to the library to work on my independent research project. I usually get home around 5:30, cook dinner with my mom — we've been working through a Marcella Hazan cookbook — and then homework until about 10. Before bed, I read for 20-30 minutes. Right now it's a history of the Federal Reserve, which sounds dry but is genuinely wild.",
    followUps: [
      "What's your favorite thing you've cooked recently?",
      "How do you decide what to read?",
    ],
    schools: ["MIT", "Dartmouth", "Brown"],
  },
  {
    id: "p10",
    question: "What's the most interesting conversation you've had recently?",
    category: "personal",
    difficulty: "medium",
    tips: [
      "Show intellectual curiosity and the ability to engage with others' ideas.",
      "It can be with a friend, teacher, family member, or stranger.",
      "Focus on what made it interesting — the tension, the surprise, the new perspective.",
    ],
    commonMistakes: [
      "Picking a conversation that just makes you look smart.",
      "Not explaining what made it interesting — just summarizing what was said.",
      "Choosing something too abstract to be engaging.",
    ],
    exampleAnswer: "My AP History teacher and I got into it about whether the New Deal actually ended the Depression or whether it was really WWII spending. He's a New Deal defender, and I came in thinking it was clearly the war. But he pushed me on the timeline — the economy was already recovering by 1936-37, before Pearl Harbor. I ended up somewhere in the middle, which is uncomfortable because I wanted a clean answer. That conversation taught me that the most honest historical position is often 'it's complicated,' which is unsatisfying but true.",
    followUps: [
      "What sources did you look at after that conversation?",
      "How do you handle not having a clean answer?",
    ],
    schools: ["Harvard", "Yale", "Georgetown", "Princeton"],
  },

  // ─── ACADEMIC (9) ─────────────────────────────────────────────────────
  {
    id: "a1",
    question: "What's your favorite subject and why?",
    category: "academic",
    difficulty: "easy",
    tips: [
      "Go beyond 'I like it' — explain what specifically about the subject excites you.",
      "Share a specific moment or concept that hooked you.",
      "Connect it to how you think, not just what you study.",
    ],
    commonMistakes: [
      "Saying you like everything equally — it sounds non-committal.",
      "Picking the subject you get the best grades in without genuine enthusiasm.",
      "Being too abstract — 'I love learning' means nothing.",
    ],
    exampleAnswer: "Chemistry, and specifically the moment in AP Chem when we got to thermodynamics. There's this concept — Gibbs free energy — that tells you whether a reaction will happen spontaneously. It blew my mind that you could predict the future of a chemical system with one equation. I started seeing it everywhere: in biology, in economics, in why my sourdough starter works. The idea that systems move toward their lowest energy state is, to me, one of the most elegant ideas in science.",
    followUps: [
      "How does thermodynamics show up in your sourdough baking?",
      "What area of chemistry do you want to explore in college?",
    ],
    schools: ["MIT", "Caltech", "Harvard", "Princeton"],
  },
  {
    id: "a2",
    question: "Tell me about a class that challenged you.",
    category: "academic",
    difficulty: "medium",
    tips: [
      "Be honest about the struggle — don't spin it into an easy win.",
      "Show what you did differently to improve, not just that you eventually got an A.",
      "Reflect on what the challenge taught you about how you learn.",
    ],
    commonMistakes: [
      "Picking a class that was hard but then saying you aced it — feels performative.",
      "Blaming the teacher instead of owning the difficulty.",
      "Not explaining what specifically was challenging about it.",
    ],
    exampleAnswer: "AP Physics C was genuinely brutal for me. I'd done well in Physics 1, so I assumed I'd be fine, but the jump to calculus-based mechanics exposed that I'd been relying on memorizing formulas instead of understanding the physics. I failed the first test — a 58. Instead of just studying harder in the same way, I started going to office hours and working problems on the whiteboard, talking through my reasoning out loud. My teacher pointed out that I kept skipping the step where I draw the free body diagram, which meant I was solving the wrong problem half the time. I ended the year with a B+, which I'm honestly more proud of than any A.",
    followUps: [
      "What did that experience change about how you approach hard material?",
      "Would you take that class again knowing how hard it would be?",
    ],
    schools: ["MIT", "Caltech", "Princeton", "Columbia"],
  },
  {
    id: "a3",
    question: "What do you want to study in college and why?",
    category: "academic",
    difficulty: "medium",
    tips: [
      "Be specific but honest about uncertainty — 'I'm drawn to X because of Y' is better than faking certainty.",
      "Connect your intended major to a specific experience or question, not just career goals.",
      "Show awareness of what the field actually involves, not just a surface-level interest.",
    ],
    commonMistakes: [
      "Saying you want to study something 'to make a lot of money.'",
      "Being too vague — 'I want to study science because I like science.'",
      "Naming a major you know nothing about to seem unique.",
    ],
    exampleAnswer: "I want to study computational biology. I got into it through a weird path — I was writing a Python script to track my sourdough fermentation temperatures, and I realized the same statistical tools could analyze gene expression data. I took an online course in bioinformatics last summer and spent three weeks trying to understand a single paper on CRISPR off-target prediction. Most of it went over my head, but the core question — can we use machine learning to predict where gene editing will go wrong — felt like the most important applied math problem I'd encountered. I don't know if I'll stick with comp bio specifically, but the intersection of computation and biology is where I want to be.",
    followUps: [
      "What did you learn from that bioinformatics course that surprised you?",
      "How do you see AI changing biology research?",
    ],
    schools: ["MIT", "Stanford", "Harvard", "Princeton", "Penn"],
  },
  {
    id: "a4",
    question: "Tell me about a research project or independent study you've done.",
    category: "academic",
    difficulty: "hard",
    tips: [
      "Explain the question you were trying to answer, not just the method.",
      "Be honest about limitations and what you'd do differently.",
      "Show genuine intellectual curiosity, not just credential-building.",
    ],
    commonMistakes: [
      "Drowning in technical jargon — the interviewer may not be in your field.",
      "Overemphasizing the prestige of the program rather than the work itself.",
      "Not being able to explain why the research question matters.",
    ],
    exampleAnswer: "I worked with a professor at the local university studying microplastic concentrations in our county's watershed. My job was collecting water samples from 12 sites over four months and running FTIR spectroscopy to identify the polymer types. The boring version is: I found polyethylene and polypropylene everywhere. The interesting version is: concentrations spiked after rainfall events, which suggests stormwater runoff is a bigger vector than we assumed. My sample size was too small to publish, and my spectroscopy technique had a high false-positive rate for particles under 50 microns. But the pattern was consistent enough that my advisor is expanding the study. I learned that real research is mostly waiting, repeating, and being honest about your error bars.",
    followUps: [
      "What would you need to make the results publishable?",
      "How did this experience change what you want to study in college?",
    ],
    schools: ["MIT", "Caltech", "Stanford", "Harvard"],
  },
  {
    id: "a5",
    question: "What's a topic you've taught yourself outside of school?",
    category: "academic",
    difficulty: "medium",
    tips: [
      "Show autodidactic drive — the ability to learn without being assigned to.",
      "Explain your process, not just the topic.",
      "Be specific about what you learned and where you hit walls.",
    ],
    commonMistakes: [
      "Picking something so niche the interviewer can't engage with it.",
      "Not explaining why you started learning it in the first place.",
      "Claiming mastery over something you've only superficially explored.",
    ],
    exampleAnswer: "I taught myself basic Mandarin over the past two years using a combination of HelloChinese, Anki flashcards, and a language exchange partner I found on Tandem. I can hold a conversation at about HSK 3 level — ordering food, talking about my family, discussing simple topics. The hardest part wasn't the tones, which is what everyone warns you about. It was the logic of measure words — Chinese uses different counters for flat things versus long things versus animals. It completely changed how I think about categorization. I'm nowhere near fluent, but I can read a menu and I can tell when Google Translate is wrong, which feels like real progress.",
    followUps: [
      "What motivated you to learn Mandarin specifically?",
      "How has learning a tonal language changed how you think about language?",
    ],
    schools: ["Harvard", "Princeton", "Yale", "Georgetown"],
  },
  {
    id: "a6",
    question: "What intellectual question keeps you up at night?",
    category: "academic",
    difficulty: "hard",
    tips: [
      "Pick a genuine question you've spent real time thinking about.",
      "Show the complexity of the question — why it doesn't have a simple answer.",
      "Demonstrate that you've researched it, not just wondered about it in passing.",
    ],
    commonMistakes: [
      "Picking a question that's too broad — 'What is the meaning of life?'",
      "Choosing something you can't actually discuss in depth.",
      "Being performatively intellectual instead of genuinely curious.",
    ],
    exampleAnswer: "I keep thinking about the alignment problem in AI — not the sci-fi version, but the real, current version. If we train language models on human text, and human text contains contradictions, biases, and values that shift over time, then what does it even mean to 'align' an AI with human values? Whose values? The dataset's? The company's? I read Stuart Russell's 'Human Compatible' and it clarified some things but opened up more questions. The one that really bugs me is: if we can't agree on human values among ourselves, how do we encode them into a system that needs a single objective function?",
    followUps: [
      "Have you explored any proposed solutions to the alignment problem?",
      "How would you approach this question if you were a researcher?",
    ],
    schools: ["MIT", "Stanford", "Princeton", "CMU"],
  },
  {
    id: "a7",
    question: "Who is a teacher or mentor who has influenced you?",
    category: "academic",
    difficulty: "easy",
    tips: [
      "Be specific about what they did, not just that they were 'inspiring.'",
      "Show how they changed your thinking or approach, not just your grades.",
      "A good answer reveals something about you, not just the teacher.",
    ],
    commonMistakes: [
      "Being generic — 'She was a great teacher who really cared.'",
      "Focusing entirely on the teacher without connecting it to your own growth.",
      "Choosing someone you can't say anything specific about.",
    ],
    exampleAnswer: "My AP English teacher, Ms. Reyes, changed how I write. She was the first person who told me my writing was 'safe' — technically correct but emotionally empty. She'd cross out my thesis statements and write 'So what?' in the margins. It was brutal at first, but she was right. I was writing to get an A, not to say anything. She introduced me to Joan Didion and James Baldwin, writers who use specificity to reach universality. The biggest shift was when she told me to stop writing what I thought colleges wanted to hear and start writing what I actually thought. That advice extended way beyond English class.",
    followUps: [
      "Can you give an example of how your writing changed?",
      "What's the most useful piece of feedback she gave you?",
    ],
    schools: ["Harvard", "Yale", "Georgetown", "Duke"],
  },
  {
    id: "a8",
    question: "If you could design your own course, what would it be?",
    category: "academic",
    difficulty: "medium",
    tips: [
      "Show interdisciplinary thinking — the best courses bridge fields.",
      "Be specific about what you'd cover and why it matters.",
      "This reveals what you'd actually want to learn, not what you think you should.",
    ],
    commonMistakes: [
      "Designing a course that already exists — shows lack of creativity.",
      "Being too broad — 'A course on everything' isn't a course.",
      "Not explaining why this course doesn't already exist or why it should.",
    ],
    exampleAnswer: "I'd design a course called 'The Science of Decision-Making Under Uncertainty.' It would combine behavioral economics, Bayesian statistics, and cognitive psychology. Week 1 might be Kahneman's prospect theory. Week 5 might be how hospitals use decision trees in triage. Week 10 might be how climate scientists communicate probabilistic forecasts to policymakers. The final project would be to take a real-world decision — college admissions, parole boards, medical diagnoses — and map where human judgment fails and where statistical models fail. I think the most important skill for the 21st century is knowing when to trust your gut and when to trust the data, and we never teach that explicitly.",
    followUps: [
      "Where do you think human judgment is better than statistical models?",
      "What reading would you assign for the first week?",
    ],
    schools: ["Princeton", "Yale", "MIT", "UChicago"],
  },
  {
    id: "a9",
    question: "What's a mistake you made in your academic life and what did you learn?",
    category: "academic",
    difficulty: "hard",
    tips: [
      "Pick a real mistake, not a humble-brag disguised as a failure.",
      "Show what you actually changed, not just that you 'learned from it.'",
      "Demonstrate self-awareness about why you made the mistake in the first place.",
    ],
    commonMistakes: [
      "Picking a mistake that's really a strength — 'I'm too much of a perfectionist.'",
      "Not owning the mistake — blaming circumstances instead.",
      "Not showing concrete change afterward.",
    ],
    exampleAnswer: "Sophomore year, I cheated on a Spanish quiz. Not dramatically — I wrote a few verb conjugations on my hand. I got caught, got a zero, and had to have a meeting with the dean. The easy story is 'I learned cheating is wrong,' but I already knew that. The real lesson was about why I did it: I was so overloaded with activities that I'd stopped actually learning in half my classes. I was performing 'good student' without doing the work. After that, I dropped two activities and started actually engaging with the material. My GPA didn't change much, but the quality of my learning did. I'm not proud of the cheating, but I'm glad it forced me to be honest about how I was spending my time.",
    followUps: [
      "How do you decide what to commit to now?",
      "What would you tell a younger student in the same situation?",
    ],
    schools: ["Georgetown", "Duke", "Penn"],
  },

  // ─── WHY-SCHOOL (8) ──────────────────────────────────────────────────
  {
    id: "w1",
    question: "Why are you interested in our school?",
    category: "why-school",
    difficulty: "medium",
    tips: [
      "Name specific programs, courses, professors, or traditions unique to that school.",
      "Connect what the school offers to something specific about you.",
      "Research beyond the website — talk to current students, read the school newspaper.",
    ],
    commonMistakes: [
      "Mentioning only the school's ranking or prestige.",
      "Using generic phrases like 'world-class faculty' or 'diverse community.'",
      "Not being able to name a single specific thing about the school.",
    ],
    exampleAnswer: "I'm drawn to MIT because of the UROP program — the idea that freshmen can do real research from day one, not just clean beakers. Specifically, I've been reading about Professor Regina Barzilay's work using machine learning for early cancer detection, and the computational biology track in Course 6-7 is exactly the intersection I want to work in. But honestly, what sealed it was talking to a current student who told me about the culture of building things — she described spending a weekend at the Media Lab building a prototype for a class project, and that energy of 'just make the thing' is exactly how I learn best.",
    followUps: [
      "What other schools are you considering, and how does MIT compare?",
      "What would you want to build in your first semester?",
    ],
    schools: ["MIT", "Harvard", "Yale", "Princeton", "Stanford", "Georgetown"],
  },
  {
    id: "w2",
    question: "What will you contribute to our campus community?",
    category: "why-school",
    difficulty: "medium",
    tips: [
      "Be specific — which clubs, organizations, or communities would you join?",
      "Think about what you bring that's different from the typical applicant.",
      "Include both what you'd contribute and what you'd want to learn from others.",
    ],
    commonMistakes: [
      "Listing activities you'd join without saying why or what you'd bring.",
      "Being generic — 'I'd bring diversity of thought' says nothing.",
      "Focusing only on what you'd get from the school, not what you'd give.",
    ],
    exampleAnswer: "I'd bring my tutoring program model. At my school, I built a peer tutoring system where we match tutors and students by learning style, not just subject. It doubled our retention rate. I'd want to adapt that for whatever tutoring center exists on campus. I'd also bring my weird combination of interests — I'm a competitive debater who also does ceramics, and I find that people who straddle the analytical and the creative tend to bridge social groups in useful ways. I'd probably end up being the person who convinces the debate team to do a joint event with the art students.",
    followUps: [
      "How would you adapt your tutoring model for a college setting?",
      "What's the connection between debate and ceramics for you?",
    ],
    schools: ["Harvard", "Yale", "Princeton", "Penn", "Duke"],
  },
  {
    id: "w3",
    question: "Have you visited campus? What did you think?",
    category: "why-school",
    difficulty: "easy",
    tips: [
      "If you visited, share a specific observation — not just 'it was beautiful.'",
      "If you haven't visited, be honest and mention what you've done instead (virtual tour, current student conversations).",
      "Show that you engaged with the place, not just drove through.",
    ],
    commonMistakes: [
      "Lying about visiting when you didn't.",
      "Only commenting on the physical campus — buildings, weather, food.",
      "Not connecting your observations to why you'd thrive there.",
    ],
    exampleAnswer: "I visited last spring and sat in on a political philosophy seminar. What struck me was that the professor asked a question, and then waited. Not five seconds — like 30 seconds of silence. And then a student gave an answer that was clearly wrong, and the professor said 'Say more about that' instead of correcting them. That patience with thinking is what I want. At my school, the pace is so fast that being wrong feels dangerous. In that classroom, being wrong was the starting point, not the end.",
    followUps: [
      "What else did you notice on your visit?",
      "How does that compare to your current classroom experience?",
    ],
    schools: ["Georgetown", "Yale", "Princeton", "Columbia"],
  },
  {
    id: "w4",
    question: "Which of our school's values resonates most with you?",
    category: "why-school",
    difficulty: "hard",
    tips: [
      "Research the school's actual stated values or mission — don't guess.",
      "Connect a specific value to a real experience in your life.",
      "Show that you understand what the value means in practice, not just in theory.",
    ],
    commonMistakes: [
      "Making up a value that isn't actually part of the school's identity.",
      "Being too abstract — 'I value excellence' applies to every school.",
      "Not backing up your answer with a specific story.",
    ],
    exampleAnswer: "Georgetown's commitment to 'cura personalis' — care for the whole person — resonates deeply with me. At my school, students are treated as GPA-producing machines. When I was going through a tough time at home, my counselor told me to 'keep my grades up.' At Georgetown, from what I've read and heard from students, there's an institutional commitment to seeing students as full human beings. That matters to me because I've seen what happens when schools don't do that — students burn out, disengage, or perform without learning. I want to be at a school where struggling is met with support, not just a referral to the tutoring center.",
    followUps: [
      "How would you contribute to that culture of care?",
      "What does 'cura personalis' look like in daily college life for you?",
    ],
    schools: ["Georgetown", "Notre Dame", "Boston College"],
  },
  {
    id: "w5",
    question: "If you were admitted to multiple schools, how would you decide?",
    category: "why-school",
    difficulty: "hard",
    tips: [
      "Be honest about your decision-making criteria — academic fit, financial aid, culture.",
      "Don't say 'I'd just come here' unless you can explain why convincingly.",
      "Show mature reasoning about how you evaluate options.",
    ],
    commonMistakes: [
      "Saying this is your only choice when it clearly isn't.",
      "Ranking schools by prestige in front of the interviewer.",
      "Not having thought about this question at all.",
    ],
    exampleAnswer: "I'd visit both schools and sit in on classes in my intended major. Rankings and reputation matter less to me than three things: the quality of undergraduate teaching, the strength of the research opportunities for undergrads, and whether the students seem genuinely engaged or just going through the motions. I'd also look carefully at financial aid — I'm fortunate to have options, but I take the investment seriously. Ultimately, I'd go where I feel like the students and faculty are doing work that excites me, because that's where I'll be most motivated to push myself.",
    followUps: [
      "What would make you choose a lower-ranked school over a higher-ranked one?",
      "How important is financial aid in your decision?",
    ],
    schools: ["Harvard", "Princeton", "Yale", "Georgetown"],
  },
  {
    id: "w6",
    question: "What specific academic program or department interests you here?",
    category: "why-school",
    difficulty: "medium",
    tips: [
      "Name the program, key faculty, and specific courses you've looked into.",
      "Explain how this program fits your academic trajectory.",
      "Show that you've done research beyond the school's admissions brochure.",
    ],
    commonMistakes: [
      "Being vague — 'Your engineering program is great' could apply anywhere.",
      "Naming a program that doesn't exist at that school.",
      "Not explaining why this specific program over similar ones elsewhere.",
    ],
    exampleAnswer: "Yale's Ethics, Politics, and Economics major is exactly the kind of interdisciplinary program I've been looking for. Most schools separate these into three departments that barely talk to each other. EP&E at Yale brings them into conversation, and the senior essay requirement means you can't just take courses in parallel — you have to synthesize. I've read Professor Shapiro's work on democratic theory, and his argument about the difference between epistemic and procedural democracy is something I want to explore further. I also like that EP&E students often end up in policy roles, not just academia — that applied orientation matches where I want to go.",
    followUps: [
      "What would your EP&E senior essay be about?",
      "How do you see ethics informing economic policy?",
    ],
    schools: ["Yale", "Princeton", "Harvard", "Georgetown"],
  },
  {
    id: "w7",
    question: "How would you take advantage of our school's location?",
    category: "why-school",
    difficulty: "medium",
    tips: [
      "Show awareness of the city/area and specific opportunities it offers.",
      "Connect location to your academic or personal interests.",
      "Go beyond obvious answers — 'DC has politics' or 'NYC has culture.'",
    ],
    commonMistakes: [
      "Only talking about restaurants and nightlife.",
      "Not knowing basic geography — where the school actually is.",
      "Treating location as irrelevant to your education.",
    ],
    exampleAnswer: "Georgetown's location in DC is a huge draw because my interest in policy isn't theoretical — I want to be where policy is made. Specifically, I'd want to intern at the Congressional Budget Office or Brookings, because the quantitative side of policy analysis is where I want to build skills. But beyond internships, I think living in a city where you can walk to the Supreme Court or sit in on a congressional hearing makes politics feel real in a way that studying it from a campus in the middle of nowhere can't. I also know DC has one of the best Ethiopian food scenes in the country, which matters more to me than I'd usually admit in an interview.",
    followUps: [
      "What policy area would you focus on at Brookings?",
      "Have you spent time in DC before?",
    ],
    schools: ["Georgetown", "GW", "Columbia", "NYU", "Penn"],
  },
  {
    id: "w8",
    question: "What do you think is the biggest challenge facing our school?",
    category: "why-school",
    difficulty: "hard",
    tips: [
      "This requires real research — read the school newspaper and student forums.",
      "Frame it constructively, not as a criticism.",
      "Show that you want to be part of the solution, not just identify the problem.",
    ],
    commonMistakes: [
      "Being too critical — insulting the school in their own interview.",
      "Picking something trivial like dining hall food.",
      "Not having any awareness of the school's current issues.",
    ],
    exampleAnswer: "From what I've read in The Crimson, Harvard is grappling with how to make its residential house system more equitable — there's a real perception that some houses have more resources and social capital than others. I think this matters because the house system is supposed to be the great equalizer, and if it's not working that way, it undermines the whole model. As someone who built a peer tutoring system designed around equity, I'd be interested in understanding how resource allocation works across houses and whether student-led initiatives could help bridge the gaps.",
    followUps: [
      "What would you propose to address that inequity?",
      "How do you think peer-led solutions compare to institutional ones?",
    ],
    schools: ["Harvard", "Yale", "Princeton"],
  },

  // ─── EXTRACURRICULAR (8) ──────────────────────────────────────────────
  {
    id: "e1",
    question: "Tell me about your most meaningful extracurricular activity.",
    category: "extracurricular",
    difficulty: "easy",
    tips: [
      "Depth beats breadth — pick one activity and go deep.",
      "Explain why it matters to you, not just what you do.",
      "Include a specific moment or turning point, not just a summary.",
    ],
    commonMistakes: [
      "Listing five activities instead of going deep on one.",
      "Describing what the club does without saying what you do.",
      "Not explaining what 'meaningful' means to you specifically.",
    ],
    exampleAnswer: "I've been on my school's debate team since freshman year, but it became meaningful in a specific way when I started coaching the novice squad junior year. Debating for myself was about winning. Coaching forced me to break down why arguments work, and I realized I'd been winning on speed and aggression, not on actual logic. Teaching freshmen to construct arguments from scratch made me a better debater because I had to understand structure, not just perform it. The moment I'm proudest of is when a sophomore I coached won her first round at states — not because she won, but because she used an argument structure we'd developed together over six weeks of practice.",
    followUps: [
      "How did coaching change your own debate style?",
      "What's the hardest thing to teach a novice debater?",
    ],
    schools: ["Harvard", "Yale", "Georgetown", "Princeton"],
  },
  {
    id: "e2",
    question: "Have you held any leadership positions? What did you learn?",
    category: "extracurricular",
    difficulty: "medium",
    tips: [
      "Focus on what you actually did as a leader, not just the title.",
      "Include a specific challenge you faced and how you handled it.",
      "Show that leadership taught you something unexpected.",
    ],
    commonMistakes: [
      "Leading with the title — 'I'm president of...' — without substance.",
      "Describing leadership as easy — real leadership involves conflict.",
      "Not acknowledging other people's contributions to the team's success.",
    ],
    exampleAnswer: "I'm captain of the varsity cross-country team, but the real leadership lesson came when I had to have a hard conversation with our best runner. He was talented but toxic — making fun of slower runners during practice. I talked to the coach first, but she said it was my job as captain. So I pulled him aside and told him that his speed didn't give him the right to diminish other people's effort. He was angry for a week. But the team dynamic shifted — the younger runners started showing up to optional practices, and our team average actually dropped because more people were engaged. I learned that leadership sometimes means making a decision that costs you a relationship in the short term.",
    followUps: [
      "How did things resolve with that runner?",
      "What's your philosophy on team culture?",
    ],
    schools: ["Duke", "Penn", "Northwestern", "Dartmouth"],
  },
  {
    id: "e3",
    question: "How do you manage your time with so many commitments?",
    category: "extracurricular",
    difficulty: "easy",
    tips: [
      "Be honest about tradeoffs — nobody does everything perfectly.",
      "Share a specific system or strategy you use.",
      "Acknowledge that you've had to say no to things.",
    ],
    commonMistakes: [
      "Claiming you do everything effortlessly — it's not believable.",
      "Not mentioning any specific time management strategy.",
      "Describing a schedule that sounds unsustainable.",
    ],
    exampleAnswer: "Honestly, I'm still figuring it out. I use a paper planner — I've tried apps but I retain better when I write things down — and I time-block my afternoons. The most important thing I've learned is to protect my sleep. Junior year, I was averaging five hours a night and my work quality dropped across the board. I started treating 10:30 PM as a hard stop, which meant I had to get more efficient and say no to some things. I dropped Model UN, which I liked but wasn't passionate about, and that freed up eight hours a week. Saying no to something good to say yes to something better was the hardest time management lesson.",
    followUps: [
      "What would you add to your schedule if you had more time?",
      "How do you decide what to cut?",
    ],
    schools: ["MIT", "Harvard", "Penn"],
  },
  {
    id: "e4",
    question: "Tell me about a community service experience that impacted you.",
    category: "extracurricular",
    difficulty: "medium",
    tips: [
      "Focus on the impact on you, not just what you did.",
      "Be specific about the community and the people you worked with.",
      "Avoid the 'white savior' framing — show genuine partnership, not rescue.",
    ],
    commonMistakes: [
      "Describing a one-time volunteer event as life-changing.",
      "Focusing on how grateful the people were — centers you, not them.",
      "Not showing ongoing commitment or systemic thinking.",
    ],
    exampleAnswer: "I've been volunteering at a legal aid clinic for immigrant families since sophomore year. My job is mostly translation — my Spanish is conversational — and helping families fill out paperwork. The moment that impacted me most was when a mother asked me to explain to her kids why they might have to move again. I was 16. I had no training for that conversation. But that experience made me realize that the gap between people who need legal help and people who have it isn't about intelligence or effort — it's about access. I started a know-your-rights workshop at our school that's now been adopted by three other schools in the district.",
    followUps: [
      "How did that experience shape your interest in law or policy?",
      "What did you learn about the limitations of volunteer work?",
    ],
    schools: ["Georgetown", "Harvard", "Yale", "Columbia"],
  },
  {
    id: "e5",
    question: "What would you do if you had an extra hour every day?",
    category: "extracurricular",
    difficulty: "easy",
    tips: [
      "Be genuine — this is a values question, not an achievement test.",
      "It's okay to say something unproductive. Rest and play matter.",
      "Show self-awareness about what you need more of in your life.",
    ],
    commonMistakes: [
      "Saying you'd study more — sounds like a robot.",
      "Listing something impressive but implausible.",
      "Not being honest about what you actually need.",
    ],
    exampleAnswer: "I'd spend it outside. I'm serious. I live in a place with incredible hiking trails, and I barely use them during the school year. When I'm in nature, my brain works differently — I have my best ideas on trails, not at my desk. Last summer, I hiked three times a week and I wrote my best essay during that period. So if I had an extra hour, I'd walk. No headphones, no podcasts, just walking and thinking.",
    followUps: [
      "What's the connection between walking and your creativity?",
      "What's your favorite trail?",
    ],
    schools: ["Brown", "Dartmouth", "MIT"],
  },
  {
    id: "e6",
    question: "Have you ever started something from scratch? Tell me about it.",
    category: "extracurricular",
    difficulty: "medium",
    tips: [
      "Walk through the process — the idea, the early struggles, the iteration.",
      "Be honest about what worked and what didn't.",
      "Show initiative and problem-solving, not just the final result.",
    ],
    commonMistakes: [
      "Describing something you joined, not something you created.",
      "Glossing over the hard parts to make it sound easy.",
      "Not explaining why you started it in the first place.",
    ],
    exampleAnswer: "I started a podcast about local history because I realized nobody in my town knew why our streets were named what they were. I bought a $50 USB microphone, learned Audacity from YouTube tutorials, and cold-emailed the town historian for my first interview. The first three episodes were terrible — bad audio, bad editing, rambling questions. But I kept iterating. By episode 10, I had a consistent format: one story per episode, three interviews, 20 minutes. I now have about 600 monthly listeners, which is small but they're mostly people in my town who care about these stories. The local library started linking to it from their website, which felt more meaningful than any download number.",
    followUps: [
      "What's the most interesting story you've uncovered?",
      "What did you learn about interviewing people?",
    ],
    schools: ["Harvard", "Yale", "Duke", "Northwestern"],
  },
  {
    id: "e7",
    question: "How has a team experience shaped you?",
    category: "extracurricular",
    difficulty: "medium",
    tips: [
      "Focus on what you learned from the team dynamic, not just the outcome.",
      "Include a moment of conflict or disagreement — real teams aren't harmonious.",
      "Show that you understand your role within a group.",
    ],
    commonMistakes: [
      "Only talking about winning or achievements.",
      "Not acknowledging other team members' contributions.",
      "Describing yourself as the hero of every team story.",
    ],
    exampleAnswer: "Our science olympiad team lost at regionals my junior year because I insisted on an approach that didn't work. I was the most experienced member, so everyone deferred to me, and I was wrong. We spent six weeks preparing for the wrong type of analysis because I was too confident in my method. After we lost, I suggested we debrief — not to assign blame, but to figure out what went wrong in our decision-making process. We realized we had a 'loudest voice' problem. The next year, we adopted a system where every team member had to write their approach independently before we discussed. We won regionals. The win mattered less to me than knowing the team's success didn't depend on me being right.",
    followUps: [
      "How do you handle being wrong in a group setting?",
      "What makes a team decision-making process work?",
    ],
    schools: ["MIT", "Caltech", "Harvard", "Princeton"],
  },
  {
    id: "e8",
    question: "Is there an activity you wish you'd started earlier?",
    category: "extracurricular",
    difficulty: "easy",
    tips: [
      "Show self-reflection and awareness of your own growth.",
      "Explain what you would have gained from starting earlier.",
      "It's okay to express regret — it shows maturity.",
    ],
    commonMistakes: [
      "Saying 'no, I wouldn't change anything' — too polished.",
      "Picking something you couldn't realistically have started earlier.",
      "Not explaining why you didn't start it earlier — context matters.",
    ],
    exampleAnswer: "Writing. I didn't start writing seriously until junior year, and I wish I'd started in ninth grade. I was afraid of being bad at it, so I avoided it. When I finally started submitting to our school literary magazine, the editor told me my writing was 'competent but safe' — which is the nicest way to say boring. It took a full year of writing regularly before I started finding my voice. If I'd started at 14 instead of 16, I'd have two more years of bad writing behind me, and I think I'd be further along. The lesson is that being bad at something early is the only way to be good at it later.",
    followUps: [
      "What changed in your writing over that year?",
      "What writers influence your voice?",
    ],
    schools: ["Yale", "Princeton", "Brown"],
  },

  // ─── CHALLENGE (8) ────────────────────────────────────────────────────
  {
    id: "c1",
    question: "Tell me about a time you failed.",
    category: "challenge",
    difficulty: "medium",
    tips: [
      "Pick a real failure, not a disguised success.",
      "Own it fully — no blame-shifting.",
      "Focus on what you learned and what you changed, not just that you recovered.",
    ],
    commonMistakes: [
      "Choosing a 'failure' that's really a success story — 'I failed a test but then got an A.'",
      "Being too vague — 'I failed at time management' without specifics.",
      "Not showing concrete change afterward.",
    ],
    exampleAnswer: "I applied to a competitive summer research program and got rejected. That's not the failure — the failure is what happened next. Instead of asking for feedback, I assumed the program was unfair and didn't apply to anything else that summer. I wasted June and July being bitter. By August, I realized I'd chosen comfort over growth. The next year, I applied to five programs, got into two, and more importantly, I emailed the first program's director asking what would have made my application stronger. She said my research proposal was too vague — she was right. The real failure wasn't the rejection; it was the three months I spent not learning from it.",
    followUps: [
      "How do you handle rejection now?",
      "What did you do in the program you eventually attended?",
    ],
    schools: ["Harvard", "MIT", "Princeton", "Georgetown"],
  },
  {
    id: "c2",
    question: "Describe a conflict you had and how you resolved it.",
    category: "challenge",
    difficulty: "hard",
    tips: [
      "Show emotional intelligence — how you managed both sides of the conflict.",
      "Include what you learned about yourself, not just the resolution.",
      "Avoid making the other person the villain.",
    ],
    commonMistakes: [
      "Making yourself look perfect and the other person wrong.",
      "Choosing a conflict that's too minor to be meaningful.",
      "Not showing genuine resolution — just avoidance.",
    ],
    exampleAnswer: "My co-editor on the school newspaper and I had a serious disagreement about whether to publish a story about a teacher who'd been put on administrative leave. She wanted to run it immediately — she saw it as our journalistic duty. I thought we needed more sourcing before going public with something that could affect someone's career. We argued about it for three days. Eventually, we compromised: we delayed publication by a week, did two more rounds of fact-checking, and ran the story with clearer attribution. She taught me that my caution could become cowardice, and I think I helped her see that speed without accuracy isn't real journalism. We're still friends, and the story was stronger for the delay.",
    followUps: [
      "How did the school community react to the story?",
      "What would you have done if you couldn't reach a compromise?",
    ],
    schools: ["Georgetown", "Columbia", "Northwestern", "Yale"],
  },
  {
    id: "c3",
    question: "What's the hardest thing you've ever had to do?",
    category: "challenge",
    difficulty: "hard",
    tips: [
      "Be genuine — this doesn't have to be dramatic.",
      "Show emotional depth without oversharing.",
      "Focus on what the experience revealed about your character.",
    ],
    commonMistakes: [
      "Trauma-dumping without reflection.",
      "Choosing something that doesn't reveal anything about you.",
      "Packaging the hard thing into a neat inspirational story.",
    ],
    exampleAnswer: "Watching my mom go through cancer treatment while keeping up with school. I don't want to make this a sympathy play — she's in remission and doing well. But the hardest part wasn't the fear or the hospital visits. It was learning to ask for help. I'd always been the person who handled things independently, and suddenly I needed extensions on assignments, I needed my friend to drive me to school, I needed my coach to let me miss practice. That experience taught me that self-sufficiency is sometimes a form of pride, and that accepting help isn't weakness — it's trust.",
    followUps: [
      "How has that experience changed your relationship with your mom?",
      "What did you learn about the support systems around you?",
    ],
    schools: ["Harvard", "Yale", "Princeton", "Duke"],
  },
  {
    id: "c4",
    question: "Tell me about a time you had to adapt to a new situation.",
    category: "challenge",
    difficulty: "medium",
    tips: [
      "Show flexibility and openness to change.",
      "Include specific details about what was new and uncomfortable.",
      "Demonstrate that you can thrive outside your comfort zone.",
    ],
    commonMistakes: [
      "Choosing something too simple — 'I moved to a new school.'",
      "Not showing any actual discomfort — adaptation should involve friction.",
      "Focusing only on the outcome, not the process of adjusting.",
    ],
    exampleAnswer: "I spent a semester at a public school in a different state when my dad was on a work assignment. I'd been at a small private school where everyone knew each other, and suddenly I was in a school with 3,000 students where nobody knew my name. The lunch table politics alone took me three weeks to decode. I joined the track team as a way in, because running is universal. What surprised me was how much I'd taken for granted — at my old school, teachers would seek me out if I was struggling. Here, I had to advocate for myself. I had to walk up to teachers' desks and say 'I don't understand this.' That six months made me more adaptable than any class I've ever taken.",
    followUps: [
      "What did you miss most about your old school?",
      "What did the new environment teach you that you couldn't have learned otherwise?",
    ],
    schools: ["Brown", "Dartmouth", "Penn"],
  },
  {
    id: "c5",
    question: "How do you handle stress?",
    category: "challenge",
    difficulty: "easy",
    tips: [
      "Be honest — everyone has stress, and interviewers respect self-awareness.",
      "Share specific strategies, not just 'I manage it well.'",
      "Acknowledge that you don't always handle it perfectly.",
    ],
    commonMistakes: [
      "Claiming you never get stressed — sounds delusional or dishonest.",
      "Listing generic strategies — 'I exercise and meditate.'",
      "Not being specific about what actually works for you.",
    ],
    exampleAnswer: "I run. Not metaphorically — literally. When I'm stressed about a test or a deadline, I put on shoes and run two miles. It's not about fitness; it's about the fact that my brain can't simultaneously panic about AP History and maintain a 7:30 pace. The physical demand forces my brain to reset. I also write in a journal, but only when the stress is emotional rather than logistical. If I'm stressed about a relationship or a decision, running doesn't help — I need to think through it on paper. The meta-strategy is knowing which tool to use for which kind of stress.",
    followUps: [
      "When has your stress management failed?",
      "How do you tell the difference between productive and destructive stress?",
    ],
    schools: ["MIT", "Harvard", "Georgetown", "Dartmouth"],
  },
  {
    id: "c6",
    question: "Describe a time you received criticism. How did you respond?",
    category: "challenge",
    difficulty: "medium",
    tips: [
      "Show that you can take feedback without being defensive.",
      "Be specific about the criticism and what you did with it.",
      "The best answers show that the criticism was initially painful but ultimately useful.",
    ],
    commonMistakes: [
      "Describing criticism you easily agreed with — that's not a challenge.",
      "Being defensive in your retelling — if you're still defensive about it, pick a different example.",
      "Not showing concrete change based on the feedback.",
    ],
    exampleAnswer: "My debate coach told me after a tournament that I was 'all show, no substance.' She said I had great delivery but my arguments were shallow — I was winning on style and losing on content without realizing it. My first reaction was to be hurt. I'd won rounds. How could my arguments be shallow? But when I went back and watched my recordings, she was right. I was using rhetorical tricks to avoid engaging with the strongest counterarguments. I spent the next two months rebuilding my preparation process — instead of starting with my argument, I started by steelmanning the other side. My win rate dropped initially, but the quality of my arguments improved, and by the end of the season I was winning on substance.",
    followUps: [
      "How do you give criticism to others now?",
      "What's the difference between helpful and unhelpful feedback?",
    ],
    schools: ["Georgetown", "Harvard", "Princeton", "Yale"],
  },
  {
    id: "c7",
    question: "What's a belief you've changed your mind about?",
    category: "challenge",
    difficulty: "hard",
    tips: [
      "Show intellectual humility — the ability to update your views with evidence.",
      "Explain what specifically changed your mind, not just that you changed it.",
      "Pick something substantive, not trivial.",
    ],
    commonMistakes: [
      "Choosing something too trivial — 'I used to hate broccoli.'",
      "Not explaining the reasoning process behind the change.",
      "Framing the old belief as stupid — it should have been reasonable at the time.",
    ],
    exampleAnswer: "I used to believe that standardized testing was fundamentally fair — that if you study hard enough, you'll do well, regardless of background. I changed my mind after tutoring for the SAT at a community center. I worked with students who were just as smart as me but had never seen the test format before, didn't have quiet study spaces, and couldn't afford prep books. The playing field wasn't level, and the test was measuring preparation access as much as ability. I still think testing has a place in admissions, but I no longer believe it's a pure meritocratic measure. That shift was uncomfortable because I'd benefited from the system I was now questioning.",
    followUps: [
      "What role do you think testing should play in admissions?",
      "How did this experience affect your views on meritocracy more broadly?",
    ],
    schools: ["Harvard", "Yale", "Georgetown", "Brown"],
  },
  {
    id: "c8",
    question: "Tell me about a time you stood up for something you believed in.",
    category: "challenge",
    difficulty: "hard",
    tips: [
      "Show courage without self-righteousness.",
      "Include the cost — standing up for something should involve risk.",
      "Show nuance — acknowledge the complexity of the situation.",
    ],
    commonMistakes: [
      "Making yourself a hero in a simple good-vs-evil story.",
      "Choosing something without real stakes or risk.",
      "Not acknowledging the other side's perspective.",
    ],
    exampleAnswer: "Our school was about to cut the art department's budget by 40% to fund a new STEM lab. I'm a STEM student — the lab would have benefited me directly. But I organized a student petition against the cut because I believed both programs deserved funding. I presented to the school board with enrollment data showing that art classes had higher retention rates for at-risk students than any other department. Some of my friends in the robotics club thought I was being disloyal. The board compromised — a 15% cut instead of 40%, with the STEM lab funded through a grant I helped write. I learned that advocacy is more effective when you come with data instead of just passion, and that doing the right thing sometimes means working against your own immediate interests.",
    followUps: [
      "How did your robotics friends react?",
      "What would you have done if the board hadn't compromised?",
    ],
    schools: ["Georgetown", "Princeton", "Columbia", "Penn"],
  },

  // ─── FUTURE (8) ───────────────────────────────────────────────────────
  {
    id: "f1",
    question: "Where do you see yourself in 10 years?",
    category: "future",
    difficulty: "medium",
    tips: [
      "Be specific enough to show direction, but honest about uncertainty.",
      "Connect your future to your current interests and experiences.",
      "It's fine to have multiple possible paths — show how you think about them.",
    ],
    commonMistakes: [
      "Having a rigid 10-year plan — it sounds naive.",
      "Being so vague it could apply to anyone — 'I want to make a difference.'",
      "Describing a career without connecting it to values or purpose.",
    ],
    exampleAnswer: "I honestly don't know exactly, and I'm skeptical of anyone our age who does. But I know the direction: I want to be working at the intersection of technology and public health. That could look like building data systems for disease surveillance, or working at a health tech startup, or doing policy work on how AI gets deployed in clinical settings. What I'm confident about is that I'll be somewhere that combines technical work with real-world health impact. If I have to pick a single image: I'd like to be in a room where half the people are engineers and half are clinicians, translating between the two groups.",
    followUps: [
      "What would need to happen in the next four years to get you there?",
      "How would you handle it if your interests change significantly?",
    ],
    schools: ["Harvard", "MIT", "Stanford", "Penn"],
  },
  {
    id: "f2",
    question: "What do you want to accomplish in college beyond academics?",
    category: "future",
    difficulty: "easy",
    tips: [
      "Show that you see college as more than a credential.",
      "Be specific about experiences you want to have.",
      "Include personal growth goals, not just resume-building plans.",
    ],
    commonMistakes: [
      "Listing clubs you'd join — that's activities, not accomplishments.",
      "Being too focused on career preparation.",
      "Not showing genuine excitement about the college experience.",
    ],
    exampleAnswer: "I want to become comfortable with ambiguity. Right now, I like having the right answer. I gravitate toward math and science because there's usually a solution. In college, I want to take humanities courses that sit in discomfort — a philosophy seminar where I can't solve the problem, a literature class where the meaning isn't fixed. I also want to learn to cook real meals, not just dorm-room ramen. And honestly, I want to have friends who think completely differently from me. At my high school, most people come from similar backgrounds. I want to be in conversations where my assumptions get challenged daily.",
    followUps: [
      "What assumption of yours do you most want challenged?",
      "What would it mean for you to be comfortable with ambiguity?",
    ],
    schools: ["Yale", "Brown", "Princeton", "Dartmouth"],
  },
  {
    id: "f3",
    question: "How do you want to make an impact on the world?",
    category: "future",
    difficulty: "medium",
    tips: [
      "Be specific about the problem you care about and why.",
      "Scale doesn't matter — local impact can be as meaningful as global.",
      "Connect it to something you've already done, not just aspire to.",
    ],
    commonMistakes: [
      "Grand, vague statements — 'I want to change the world.'",
      "Describing impact you have no connection to — sounds performative.",
      "Not acknowledging the complexity of the problem you want to solve.",
    ],
    exampleAnswer: "I want to make health information accessible to people who don't speak English well. My mom has diabetes, and when she was diagnosed, all the educational materials were in English at a reading level she couldn't access. I translated them for her, but most people don't have a bilingual kid at home. I've started creating Spanish-language diabetes education videos with a local clinic, and they've been viewed 12,000 times. The impact I want to have isn't glamorous — it's making sure that someone's health outcome isn't determined by whether they happened to learn English. Whether that's through medicine, public health, or technology, the core problem is the same: information access is a health determinant.",
    followUps: [
      "How would you scale that work beyond your local clinic?",
      "What's the biggest barrier to health information access?",
    ],
    schools: ["Harvard", "Georgetown", "Stanford", "Columbia"],
  },
  {
    id: "f4",
    question: "What career interests you and why?",
    category: "future",
    difficulty: "easy",
    tips: [
      "Be genuine about your interest, even if the career isn't flashy.",
      "Explain why this career, not just what it is.",
      "Show awareness of what the career actually involves day-to-day.",
    ],
    commonMistakes: [
      "Naming a prestigious career without genuine interest — 'I want to be a doctor' with no connection to medicine.",
      "Not knowing what the career actually entails.",
      "Choosing a career just because it pays well.",
    ],
    exampleAnswer: "I'm interested in urban planning. It sounds niche, but I've been fascinated by it since I noticed that my town has no sidewalks connecting the low-income housing to the grocery store. That's not an accident — it's a design decision that affects real people's daily lives. I've been reading about transit-oriented development and attending our town's planning commission meetings. What draws me is that urban planning is this intersection of engineering, policy, and community engagement where your decisions shape how millions of people live. I like that it's concrete — you can walk through your impact.",
    followUps: [
      "What would you change about your town's design?",
      "How do you think about the tradeoffs between development and community?",
    ],
    schools: ["MIT", "Penn", "UC Berkeley", "Columbia"],
  },
  {
    id: "f5",
    question: "What problem in the world would you most want to solve?",
    category: "future",
    difficulty: "medium",
    tips: [
      "Pick a problem you've actually thought about, not the biggest one you can name.",
      "Show understanding of why it's hard to solve.",
      "Connect it to your own experience or interests.",
    ],
    commonMistakes: [
      "Picking climate change or poverty without any specific angle — too broad.",
      "Not acknowledging that the problem is complex.",
      "Sounding like a beauty pageant answer — 'I want world peace.'",
    ],
    exampleAnswer: "Food waste. Not because it's the sexiest problem, but because it's solvable and we're not solving it. The US throws away 30-40% of its food supply. Meanwhile, 34 million Americans are food insecure. The logistics exist to connect surplus to need — we just haven't built the systems at scale. I've been volunteering with a food rescue organization that picks up from restaurants and delivers to shelters, and the operational challenge is mostly coordination, not capability. I want to work on the supply chain technology that makes food rescue as efficient as food delivery. If DoorDash can get a burrito to your door in 20 minutes, we should be able to get restaurant surplus to a shelter before it spoils.",
    followUps: [
      "What's the biggest bottleneck in food rescue logistics?",
      "How would you approach building that technology?",
    ],
    schools: ["MIT", "Stanford", "Harvard", "Princeton"],
  },
  {
    id: "f6",
    question: "What kind of person do you want to be at age 30?",
    category: "future",
    difficulty: "medium",
    tips: [
      "Focus on character and values, not just career or achievements.",
      "Be specific enough that it reveals who you are now.",
      "It's okay to include personal goals alongside professional ones.",
    ],
    commonMistakes: [
      "Describing only professional success — 'I want to be a VP at a tech company.'",
      "Being too abstract — 'I want to be kind and successful.'",
      "Not showing any connection between who you are now and who you want to be.",
    ],
    exampleAnswer: "I want to be someone who's still curious. I watch a lot of adults lose that — they get good at their jobs and stop learning outside their lane. At 30, I want to still be the person who reads about random topics, who asks 'why?' about things everyone else takes for granted. Professionally, I want to be good enough at what I do that I can afford to take risks — to choose projects based on impact rather than safety. And personally, I want to be someone my younger self would respect. Not impress — respect. That means being honest, being kind to people who can't do anything for me, and not becoming so busy that I forget to call my mom.",
    followUps: [
      "What's the biggest risk you think you'll need to take?",
      "What adult in your life models the kind of person you want to become?",
    ],
    schools: ["Harvard", "Yale", "Georgetown", "Princeton"],
  },
  {
    id: "f7",
    question: "How would you use your education to help others?",
    category: "future",
    difficulty: "medium",
    tips: [
      "Be concrete about how education translates to service.",
      "Avoid savior language — focus on partnership and empowerment.",
      "Connect it to work you're already doing.",
    ],
    commonMistakes: [
      "Being vague — 'I'd give back to my community.'",
      "Describing help in a way that centers you, not the people you'd help.",
      "Not showing any current evidence of this commitment.",
    ],
    exampleAnswer: "Right now, I tutor at a community center three times a week. In college, I want to continue that — but I also want to gain skills that make my help more structural, not just individual. I want to learn data science so I can help nonprofits measure their impact instead of just guessing. The tutoring center I work at has no idea which of their programs actually improves outcomes because they don't have anyone who can analyze their data. I want to be that person — not the executive director making speeches, but the person in the back room making the organization more effective. Education for me isn't about credentials; it's about being useful in ways I can't be yet.",
    followUps: [
      "What kind of data would you want to collect for your tutoring center?",
      "How do you think about the difference between direct service and systems change?",
    ],
    schools: ["Georgetown", "Penn", "Duke", "Harvard"],
  },
  {
    id: "f8",
    question: "Do you have any questions for me?",
    category: "future",
    difficulty: "easy",
    tips: [
      "Always have 2-3 genuine questions prepared.",
      "Ask about the interviewer's own experience — they want to share.",
      "Avoid questions easily answered by the website.",
    ],
    commonMistakes: [
      "Saying 'No, I think you covered everything' — huge missed opportunity.",
      "Asking about acceptance rates or financial aid — wrong venue.",
      "Asking questions that are clearly rehearsed and impersonal.",
    ],
    exampleAnswer: "I actually have two questions. First, what surprised you most about the school when you were a student there — something you didn't expect? And second, if you could take one class over again, which would it be and why? I'm trying to understand what the experience is actually like from someone who's lived it, not just what the website says.",
    followUps: [],
    schools: ["Harvard", "Yale", "Princeton", "MIT", "Georgetown", "Columbia", "Penn", "Brown", "Dartmouth", "Duke", "Northwestern"],
  },
];

/** Get questions filtered by category. */
export function getQuestionsByCategory(category: InterviewCategory): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.category === category);
}

/** Get questions filtered by difficulty. */
export function getQuestionsByDifficulty(difficulty: InterviewQuestion["difficulty"]): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

/** Get questions associated with a specific school. */
export function getQuestionsForSchool(school: string): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.schools?.some((s) => s.toLowerCase() === school.toLowerCase()));
}

/** Get a random question, optionally filtered by category. */
export function getRandomQuestion(category?: InterviewCategory): InterviewQuestion {
  const pool = category ? getQuestionsByCategory(category) : INTERVIEW_QUESTIONS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
