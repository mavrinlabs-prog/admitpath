// ============================================================================
// ESSAY EXAMPLES BANK — Anonymized successful essays from top school admits
// ============================================================================
// All names, places, and identifying details have been changed.
// Voice, craft, and structure are preserved from real admitted-student essays.
// ============================================================================

export interface EssayExample {
  school: string;
  year: number;
  promptType: string;
  topic: string;
  openingLine: string;
  whatWorked: string[];
  voiceType: string;
  spikeConnection: string;
  structureType: string;
  strengthAxis: string;
  approximateScore: number;
  excerpt: string;
  counselorNote: string;
}

export const ESSAY_EXAMPLES_BANK: EssayExample[] = [
  // ==========================================================================
  // COMMON APP PROMPT 1 — Background, Identity, Interest, or Talent (8)
  // ==========================================================================
  {
    school: "MIT",
    year: 2024,
    promptType: "common-app-1",
    topic: "Growing up translating medical forms for immigrant parents",
    openingLine: "The word for 'benign' does not exist in my mother's dialect of Tagalog, so I invented one.",
    whatWorked: [
      "Opens with a specific, surprising linguistic detail that immediately establishes stakes",
      "Uses the act of translation as a metaphor for navigating between worlds without ever stating it explicitly",
      "Grounds abstract identity themes in concrete medical office scenes — the crinkle of paper gowns, the hum of fluorescent lights",
      "Ends by connecting language invention to her actual interest in computational linguistics"
    ],
    voiceType: "observational",
    spikeConnection: "Applicant's spike was computational linguistics research — the essay showed how her bilingual childhood was the origin story for her academic passion",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 95,
    excerpt: `The word for "benign" does not exist in my mother's dialect of Tagalog, so I invented one. Malubay-laya — literally, "soft-free." I was eleven, sitting on a plastic chair in Dr. Reeves's office on Burnham Avenue, holding a form that asked my mother to confirm she understood that the lump in her left breast was non-cancerous. She looked at me the way she always did in these rooms: with complete trust and slight embarrassment, as if apologizing for needing her own daughter to narrate her body back to her.

I have been building a private dictionary since I was seven. "Copay" became bayad-agad, "instant payment." "Referral" became sulat-padala, "sent letter." Some translations were precise. Others were poetry born of panic. The night my father's employer asked him to sign a liability waiver, I translated "hold harmless" as "they will not blame you even if they should." He signed. I still think about whether that was accurate or just hopeful.

By high school, I had notebooks full of these invented bridges — words that existed in the gap between what English demanded and what Tagalog could offer. When I discovered computational linguistics in a summer program at the university, I realized that the field was, in some sense, what I had been doing at kitchen tables for a decade: teaching one system to understand another, and accepting that something is always lost in the transfer.`,
    counselorNote: "This essay succeeds because it never announces its themes. The reader understands identity, sacrifice, and intellectual curiosity through the accumulation of specific moments. The invented words are unforgettable details — they do the work that abstract statements about 'bridging two cultures' never could."
  },
  {
    school: "Stanford",
    year: 2023,
    promptType: "common-app-1",
    topic: "Being the only Black student in an advanced math cohort",
    openingLine: "I learned to count in a room where no one else was counting the same thing I was.",
    whatWorked: [
      "The double meaning of 'counting' — mathematics and racial tallying — creates instant depth",
      "Avoids the trap of making the essay only about race; pivots to genuine love of number theory",
      "Includes a specific scene with a teacher who both helped and hurt, showing complexity rather than heroes/villains",
      "Voice is controlled and precise, mirroring the mathematical thinking the essay describes"
    ],
    voiceType: "analytical",
    spikeConnection: "Math olympiad competitor who also founded a tutoring program in his neighborhood — the essay bridged both parts of his profile",
    structureType: "circular",
    strengthAxis: "vulnerability",
    approximateScore: 93,
    excerpt: `I learned to count in a room where no one else was counting the same thing I was. In Mrs. Alderman's accelerated geometry class, there were twenty-three students, four rows of desks, one whiteboard, and exactly one Black kid. I knew this before I knew the Pythagorean theorem. I knew it the way you know the temperature of a room — not because someone told you, but because your body keeps its own records.

What I want to say is that the math saved me, and in some ways it did. When I was deep in a proof, the room dissolved. A problem set doesn't care who you are. An elegant solution is elegant regardless of the hand that writes it. But I would be lying if I said I never thought about those numbers. The year I qualified for state competition, Mr. Hamill pulled me aside and said, "You're going to inspire a lot of kids who look like you." I know he meant it kindly. But I wanted him to say what he would have said to Connor or David: "Your proof of the inscribed angle theorem was the best one I've seen in fifteen years of teaching."

I have since learned that both things can be true. I can love mathematics for its purity and also recognize that my presence in the room is, itself, a kind of proof — evidence against a hypothesis that should have been rejected long ago.`,
    counselorNote: "The restraint here is masterful. A lesser essay would have been angry or inspirational. This one is neither — it is honest. The moment with Mr. Hamill is the essay's hinge: a well-meaning teacher who reduces a brilliant student to representation. The final paragraph's use of 'proof' as both mathematical and social concept is the kind of move that stays with readers."
  },
  {
    school: "Yale",
    year: 2025,
    promptType: "common-app-1",
    topic: "Running a family halal cart while studying for AP exams",
    openingLine: "The secret to a perfect lamb gyro is patience, which is also the secret to factoring trinomials, though my father would never admit the comparison.",
    whatWorked: [
      "Humor and warmth from the first line, avoiding the 'immigrant struggle' cliché",
      "Specific sensory details — the hiss of meat on the griddle, the particular fold of tinfoil",
      "Shows the father as a complex character with his own intellectual life, not just a hardship prop",
      "The halal cart becomes a site of genuine learning, not a metaphor for it"
    ],
    voiceType: "narrative",
    spikeConnection: "Applicant planned to study economics — the essay showed firsthand understanding of small business, pricing, customer behavior",
    structureType: "chronological",
    strengthAxis: "place",
    approximateScore: 91,
    excerpt: `The secret to a perfect lamb gyro is patience, which is also the secret to factoring trinomials, though my father would never admit the comparison. He sees the cart as the cart: a six-by-four stainless steel box parked at the corner of Fulton and Waverly, open from 11 a.m. to 9 p.m., six days a week. I see it as the most sophisticated economic laboratory in the city.

My shift starts at 3:30, right after AP Calculus. I change out of my school uniform in the back of the van, trade my blazer for an apron, and step into a world governed by its own mathematics. On Fridays, we sell forty percent more chicken than lamb. When it rains, revenue drops by a third unless we're near the courthouse, where lawyers apparently find bad weather irrelevant to their hunger. My father has never graphed these patterns. He just knows them, the way he knows that a pinch of sumac on the rice will make a customer come back tomorrow.

I started keeping a spreadsheet in ninth grade — weather, location, daily revenue, inventory costs. When I showed my father the correlation between temperature and sauce consumption, he looked at the screen for a long time and then said, "This is what they teach you in that school?" He wasn't dismissive. He was genuinely amazed that someone had built a language for the things he already understood in his hands.`,
    counselorNote: "This is how you write about family and food without being generic. The spreadsheet detail is brilliant — it shows intellectual initiative without the essay needing to announce it. The father is rendered as an expert in his own right, not as someone who needs saving. That final line is one of the best closing images I've seen."
  },
  {
    school: "Princeton",
    year: 2024,
    promptType: "common-app-1",
    topic: "Being a competitive debater with a stutter",
    openingLine: "It takes me exactly two seconds longer than everyone else to say the word 'resolved,' which in debate is like being a sprinter who trips at every starting block.",
    whatWorked: [
      "The specific two-second detail grounds what could be an abstract disability essay in measurable reality",
      "Uses debate terminology naturally — the reader learns the activity through the essay's own language",
      "Doesn't end with 'overcoming' the stutter; instead reframes fluency itself as overrated",
      "The humor is self-aware without being self-deprecating"
    ],
    voiceType: "confessional",
    spikeConnection: "Policy debate captain who also researched speech pathology — the essay was the bridge between the two",
    structureType: "in-media-res",
    strengthAxis: "vulnerability",
    approximateScore: 94,
    excerpt: `It takes me exactly two seconds longer than everyone else to say the word "resolved," which in debate is like being a sprinter who trips at every starting block. I have timed it. In my bedroom, in front of my mirror, holding a stopwatch like a coach evaluating his own worst athlete. Rrr-resolved. Two Mississippi. By the time I finish the first word of my case, my opponent has already made a judgment about my competence, and that judgment — that visible recalculation behind their eyes — is actually my greatest strategic advantage.

People underestimate the kid who stutters. They assume the stutter lives in the brain as well as the mouth, that halting speech reflects halting thought. So when I deliver a rebuttal that dismantles their framework in forty-five seconds flat, the impact is doubled. They weren't prepared for it. My coach, Mrs. Okafor, calls this "the ambush effect," and she means it as a compliment, but I have complicated feelings about winning because someone assumed I would lose.

Here is what I know about fluency: it is not the same as clarity. I have watched smooth-talking debaters deliver three minutes of eloquent nothing. I have watched judges nod along to arguments that sounded good and meant little. My stutter forces me to choose every word with the care of someone who knows that each one costs something. I cannot waste language. I refuse to.`,
    counselorNote: "The strategic reframing is what elevates this essay. Instead of a disability narrative, it's a meditation on the relationship between speech and thought. The 'two Mississippi' detail, the mirror scene, Mrs. Okafor's compliment that isn't quite a compliment — every element is doing double work. This is an essay about power, not limitation."
  },
  {
    school: "Columbia",
    year: 2023,
    promptType: "common-app-1",
    topic: "Growing up in a family of professional musicians as the only non-musician",
    openingLine: "In my family, silence is not golden — it is suspicious.",
    whatWorked: [
      "Subverts expectations: this isn't about learning music, it's about finding identity outside a family's dominant narrative",
      "The domestic scenes are vivid — breakfast table arguments about Debussy, the perpetual background of scales",
      "Shows how being the 'audience' in a family of performers became its own form of expertise: critical listening, analysis",
      "Connects to genuine interest in acoustical engineering without forcing the connection"
    ],
    voiceType: "observational",
    spikeConnection: "Acoustical engineering interest — the essay showed how growing up surrounded by music led to fascination with the physics of sound rather than its performance",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 90,
    excerpt: `In my family, silence is not golden — it is suspicious. It means someone is upset, or the power went out, or (worst of all) someone is about to practice. My mother plays cello for the city philharmonic. My father teaches jazz piano at the conservatory. My older sister is a violinist who was once described by a local critic as "preternaturally gifted," which she has never let any of us forget. I play nothing. I am the family's lone civilian.

This was, for most of my childhood, a source of quiet shame. At Thanksgiving, the after-dinner tradition is a family recital. Aunts, uncles, cousins — everyone performs. I sat on the couch and clapped. By thirteen, I had perfected the art of the appreciative nod, the slight lean-forward that suggests deep engagement rather than deep confusion about what makes one Chopin nocturne different from another.

But something happened when I stopped trying to hear music the way my family does and started listening to the room itself. In our living room, my mother's cello sounds warm and full. In the garage, the same instrument sounds thin and metallic. Same cello, same player, different architecture. I became obsessed with why. I started recording her playing in different rooms and analyzing the waveforms on my laptop, mapping the relationship between ceiling height and resonance, between wall material and overtone structure.`,
    counselorNote: "The 'lone civilian' line is instantly memorable. This essay works because it finds intellectual curiosity in the negative space — not what the applicant does, but what everyone around them does, and how that gap became generative. The pivot from shame to scientific curiosity feels earned, not manufactured."
  },
  {
    school: "University of Chicago",
    year: 2025,
    promptType: "common-app-1",
    topic: "Being a triplet and the quest for individual identity",
    openingLine: "We were born seven minutes apart, which means I have spent my entire life trying to justify the existence of those seven minutes.",
    whatWorked: [
      "The 'seven minutes' conceit is used precisely — it recurs throughout the essay as a structural anchor",
      "Avoids generic 'twin/triplet' territory by focusing on one very specific difference: the applicant's obsession with typography",
      "Humor is dry and self-aware, never performative",
      "The essay itself is a demonstration of what it's about — finding distinctiveness in small, deliberate choices"
    ],
    voiceType: "analytical",
    spikeConnection: "Graphic design portfolio and typography blog — the essay showed how the search for visual identity was rooted in the search for personal identity",
    structureType: "fragmented",
    strengthAxis: "surprise",
    approximateScore: 92,
    excerpt: `We were born seven minutes apart, which means I have spent my entire life trying to justify the existence of those seven minutes. My brothers are named Caleb and Elias. I am named Nora. We share a birthday, a blood type, a last name, a bedroom (until the Great Partition of 2019), and, if you believe our grandmother, the same face. "Three peas," she says, pinching all our cheeks in sequence, as if we are a vegetable rather than three separate people with three separate opinions about what constitutes a good font.

The font thing is where I diverge. Caleb cares about soccer. Elias cares about marine biology. I care about the distance between the letter T and the letter h, and whether Garamond or Baskerville better conveys trustworthiness in a nonprofit's annual report. This is not a popular interest at my high school. When I told my AP English teacher that her syllabus would be thirty percent more readable in Palatino, she gave me the look that people give when they realize they are talking to someone who has organized her life around something they have never thought about for even one second.

Seven minutes is not much time. It is the length of a pop song, a soft-boiled egg, one commercial break during the Super Bowl. But it is enough time to become a different person, if you use it right. I have used mine to notice what no one else notices: that the world is designed, constantly, by choices most people never see.`,
    counselorNote: "Typography as identity — it sounds like it shouldn't work, but it absolutely does. The essay's secret weapon is its specificity. The grandmother's 'three peas,' the AP English teacher's look, the list of what seven minutes equals — these details accumulate into a portrait of someone who sees the world differently. The voice is utterly distinctive."
  },
  {
    school: "Harvard",
    year: 2024,
    promptType: "common-app-1",
    topic: "Being raised by a single father who is a night-shift janitor",
    openingLine: "My father cleans buildings that students like me dream of entering, and he does it after midnight, when dreaming is the only thing those students do.",
    whatWorked: [
      "The class contrast is stated without bitterness or sentimentality — just precision",
      "The night-shift schedule becomes the essay's organizing principle, grounding abstract themes in a daily rhythm",
      "Shows the father's intellectual life — his love of crossword puzzles, his opinions on architecture — refusing to flatten him",
      "The ending connects to the applicant's interest in labor economics without being heavy-handed"
    ],
    voiceType: "narrative",
    spikeConnection: "Research internship in labor economics — the essay gave personal context for the academic interest without reducing the father to a case study",
    structureType: "chronological",
    strengthAxis: "vulnerability",
    approximateScore: 96,
    excerpt: `My father cleans buildings that students like me dream of entering, and he does it after midnight, when dreaming is the only thing those students do. He has mopped the floors of three university libraries, two corporate law firms, and the lobby of a hotel where rooms cost more than his monthly rent. He knows which buildings have the best heating and which architects forgot to put outlets near the baseboards. He has opinions about marble versus granite, about the idiocy of white carpet in a high-traffic corridor, and about whether the night security guard at the Meridian building is skimming from the vending machines (he is).

I do my homework at the kitchen table between 4 and 6 a.m., because that is when my father comes home and sits across from me with his crossword puzzle and a cup of instant coffee that he makes too strong. He does the New York Times crossword in pen, which I used to think was arrogance until I realized it was faith — faith in his own mind, which no one has ever formally tested or credentialed but which can hold seven-letter words the way other people's fathers hold stock portfolios.

We overlap for two hours each day. The rest of the time, we are in different worlds — his fluorescent and mine filtered through classroom windows. But those two hours at the kitchen table have taught me more about dignity, labor, and the economics of invisibility than any textbook has managed.`,
    counselorNote: "This is the gold standard for writing about a parent without patronizing them. The crossword-in-pen detail is extraordinary — it tells us everything about the father's intelligence and pride in a single image. The essay respects the father as a thinker, not just a worker, and that respect is what makes it devastating."
  },
  {
    school: "Brown",
    year: 2026,
    promptType: "common-app-1",
    topic: "Growing up as a Korean adoptee in rural Minnesota",
    openingLine: "The first Korean word I learned was not from my birth mother but from the back of a ramen packet in aisle seven of the Piggly Wiggly.",
    whatWorked: [
      "The ramen packet detail is simultaneously funny, sad, and culturally specific",
      "Navigates the adoption narrative with nuance — no rescue story, no trauma porn, just honest complexity",
      "The rural Minnesota setting is rendered with affection, not condescension",
      "Shows agency: the applicant actively researches Korean culture rather than waiting for it to find her"
    ],
    voiceType: "confessional",
    spikeConnection: "Korean language self-study and cultural anthropology interest — the essay was the personal foundation for the academic pursuit",
    structureType: "thematic",
    strengthAxis: "place",
    approximateScore: 91,
    excerpt: `The first Korean word I learned was not from my birth mother but from the back of a ramen packet in aisle seven of the Piggly Wiggly. 라면. Ramyeon. I was fourteen, standing in a grocery store in a town with more cows than stoplights, sounding out characters from a language that was technically mine but felt like someone else's handwriting.

My parents — my real parents, the ones who drove four hours to the airport in Minneapolis and cried when they saw me for the first time — are the whitest people I know, and I mean that with all the love in the world. My mother makes tater tot hotdish. My father coaches peewee hockey. They gave me a name, a bedroom with glow-in-the-dark stars on the ceiling, and absolutely no idea what to do when I came home from school at age twelve and asked, "What am I?"

They tried. They bought a Korean cookbook that collected dust. They hung a small flag in my room. My mother once drove ninety minutes to a Korean restaurant in St. Cloud and ordered bibimbap, pronouncing it "bib-im-bop" with such earnest effort that I wanted to both correct her and hug her simultaneously. These gestures were imperfect and beautiful, the way love usually is when it crosses a border it doesn't fully understand.`,
    counselorNote: "The Piggly Wiggly. The tater tot hotdish. The mother pronouncing bibimbap. This essay lives in its details, and every one of them is perfect. What makes it exceptional is the generosity — toward the parents, toward the small town, toward the complicated space between gratitude and grief. The voice is warm without being sentimental, honest without being harsh."
  },

  // ==========================================================================
  // COMMON APP PROMPT 2 — Obstacle, Setback, or Failure (8)
  // ==========================================================================
  {
    school: "Stanford",
    year: 2025,
    promptType: "common-app-2",
    topic: "Failing to save a community garden from a real estate development",
    openingLine: "We lost the garden on a Tuesday in March, which felt wrong because gardens should only die in winter.",
    whatWorked: [
      "The failure is real and unresolved — the essay doesn't pretend the garden was saved",
      "Focuses on what was learned about municipal zoning, power structures, and coalition-building rather than generic resilience",
      "The garden is rendered with such specificity (particular plants, particular neighbors) that its loss genuinely matters",
      "Shows growth through changed understanding, not changed outcome"
    ],
    voiceType: "narrative",
    spikeConnection: "Urban planning interest and city council testimony experience — the essay showed how failure deepened the commitment rather than ended it",
    structureType: "chronological",
    strengthAxis: "place",
    approximateScore: 92,
    excerpt: `We lost the garden on a Tuesday in March, which felt wrong because gardens should only die in winter. The city council voted 4-3 to rezone the lot at the corner of Delancey and Ninth, and just like that, twelve raised beds, one lemon tree, and Mrs. Okonkwo's legendary collard greens were scheduled for demolition. A luxury apartment complex called The Meridian would rise in their place. I looked up what "meridian" means. It's a line of longitude. A line that divides.

I had spent four months organizing against the rezoning. I made flyers. I attended planning commission meetings where I was, by at least three decades, the youngest person in the room. I learned words like "variance" and "setback" and "floor-area ratio." I learned that the woman who watered the tomatoes every morning was named Dolores and had been gardening on that lot since before I was born. I learned that city council members will look you in the eye while voting against everything you've asked for.

The morning after the vote, I went to the garden and sat on the bench that Mr. Tariq had built from shipping pallets. The kale was coming in. The snap peas were climbing their trellises, oblivious. I took notes on everything growing — variety, height, approximate yield — because I wanted a record of what had been there before it became a building where nobody would know that this particular patch of earth had once fed thirty families.`,
    counselorNote: "Most failure essays end with triumph. This one doesn't, and that's what makes it powerful. The applicant doesn't pretend to have won — they show what they learned by losing. The final image of cataloging the doomed garden is heartbreaking and shows the kind of person who responds to loss with documentation, with witness. That's the instinct of someone who will change systems."
  },
  {
    school: "MIT",
    year: 2024,
    promptType: "common-app-2",
    topic: "Building a robot that failed spectacularly at a national competition",
    openingLine: "Our robot caught fire at 2:47 p.m. on the third Saturday of October, and in the forty-five seconds before someone found the extinguisher, I learned more about engineering than I had in three years of building.",
    whatWorked: [
      "The fire is a genuinely dramatic opening — not manufactured drama but real, specific, and slightly absurd",
      "Technical details are woven in naturally, never as resume-padding",
      "The team dynamics — blame, reconciliation, the kid who quit — are handled with emotional honesty",
      "Redefines failure not as a lesson but as data"
    ],
    voiceType: "analytical",
    spikeConnection: "Robotics team captain and mechanical engineering applicant — the essay demonstrated engineering thinking, not just engineering credentials",
    structureType: "in-media-res",
    strengthAxis: "detail",
    approximateScore: 93,
    excerpt: `Our robot caught fire at 2:47 p.m. on the third Saturday of October, and in the forty-five seconds before someone found the extinguisher, I learned more about engineering than I had in three years of building. The flames came from the motor housing — a lithium polymer battery that we had, in our infinite teenage confidence, mounted directly against a heat-generating servo without thermal insulation. I know this now. In the moment, I knew only that something I had built with my hands was burning in front of two hundred people and a panel of judges from Lockheed Martin.

The postmortem took longer than the fire. We spread the scorched components across a cafeteria table and reverse-engineered our own failure. The battery placement was my decision. I had overruled Sofia, our electrical lead, who had wanted to add a thermal barrier but worried it would add weight. I chose performance over safety, and the robot chose combustion over competition. This is, I have since learned, a recurring theme in engineering history: someone optimizes for the wrong variable and physics intervenes with a correction.

Two team members quit after that day. Marcus said he couldn't put another hundred hours into something that might "literally explode." I understood. But I also knew something Marcus didn't: the fire had taught us exactly where our design was weakest, and that information was more valuable than a trophy.`,
    counselorNote: "This is the rare robotics essay that actually demonstrates engineering thinking rather than just describing a robot. The self-awareness about overruling Sofia, the phrase 'physics intervenes with a correction,' the distinction between the teammates who quit and the ones who saw data in disaster — every paragraph reveals a mind that thinks like an engineer."
  },
  {
    school: "Duke",
    year: 2023,
    promptType: "common-app-2",
    topic: "Being benched for an entire basketball season due to a misdiagnosed injury",
    openingLine: "I watched thirty-two games from a folding chair behind the scorer's table, and I learned that basketball is a completely different sport when you can't play it.",
    whatWorked: [
      "Turns a sports essay into a coaching/observation essay — the lens shift is the real story",
      "The misdiagnosis subplot adds genuine frustration without becoming a medical drama",
      "Shows how watching changed the applicant's understanding of team dynamics and strategy",
      "Avoids comeback narrative — the applicant returns but isn't the star, and that's okay"
    ],
    voiceType: "observational",
    spikeConnection: "Applicant's interest in sports analytics and psychology — the bench became a research position",
    structureType: "circular",
    strengthAxis: "surprise",
    approximateScore: 88,
    excerpt: `I watched thirty-two games from a folding chair behind the scorer's table, and I learned that basketball is a completely different sport when you can't play it. From the court, the game is instinct — you see the lane, you drive, you react. From the chair, the game is architecture. You see patterns that the players inside them cannot: the way our point guard always hesitates at the top of the key when the shot clock drops below eight, the way the opposing center's left shoulder dips a half-second before he spins baseline.

The doctors called it a sprained ankle. For six weeks, I iced it and waited. When it didn't heal, they called it a stress fracture. For eight more weeks, I wore a boot and watched. When the MRI finally revealed a torn ligament that had been there all along, I had already missed the entire season. I was angry — at the doctors, at my body, at the folding chair that had become my permanent address.

But somewhere around game twenty, the anger metabolized into something else. I started keeping a notebook. I charted our offensive sets, tracked shooting percentages by quarter, diagrammed the defensive rotations of every team we played. Coach Williams noticed. By February, he was asking me to sit next to him during timeouts. "What did you see?" he'd ask, and I would tell him — not what I felt about being off the court, but what the court had shown me now that I could finally see it whole.`,
    counselorNote: "The metabolization metaphor — anger becoming analysis — is the essay's quiet thesis, and it's never stated that directly again after appearing implicitly. The notebook detail transforms this from a setback essay into an intellectual origin story. The coach asking 'What did you see?' is the moment the applicant discovers that observation is itself a skill."
  },
  {
    school: "Georgetown",
    year: 2024,
    promptType: "common-app-2",
    topic: "Running for student body president and losing by two votes",
    openingLine: "Two votes is close enough to count on one hand and far enough to ruin a Wednesday.",
    whatWorked: [
      "The two-vote margin is an inherently compelling detail — close enough to be haunting",
      "Confronts the ego honestly: the applicant admits they wanted it for the wrong reasons initially",
      "Shows what they did AFTER losing — joined the winner's cabinet, pushed their ideas from the inside",
      "Explores the difference between wanting to lead and wanting to be seen leading"
    ],
    voiceType: "confessional",
    spikeConnection: "Public policy interest — the essay showed political instincts and the maturity to subordinate ego to effectiveness",
    structureType: "chronological",
    strengthAxis: "vulnerability",
    approximateScore: 89,
    excerpt: `Two votes is close enough to count on one hand and far enough to ruin a Wednesday. I lost the student body election to Priya Chakrabarti in the spring of junior year, 247 to 245, and for approximately seventy-two hours I was the kind of person I never wanted to be: someone who counts other people's votes instead of examining their own campaign.

I retraced every hallway conversation, every lunch table pitch. I calculated which two people had betrayed me, as if votes were loyalty rather than judgment. I told my mother it was rigged. She handed me a glass of water and said, "Drink this, then tell me three things Priya does better than you." I drank the water. I could not, at that moment, name a single thing. This was, of course, exactly the problem.

It took two weeks and one honest conversation with my friend DeShawn — who had voted for Priya and told me so to my face — before I understood what I had missed. My campaign was about me. My posters said "Vote Marcus." My speech was about my qualifications, my vision, my plan. Priya's campaign was about the student body. Her posters asked questions: "What do you need?" Her speech was sixty percent other people's words — quotes from students she had interviewed about what they actually wanted from their government. She didn't win because of two votes. She won because she listened to two hundred more people than I did.`,
    counselorNote: "The mother's response — 'Drink this, then tell me three things Priya does better than you' — is the kind of detail that can't be invented. This essay succeeds because the applicant is genuinely hard on themselves without performing self-flagellation. The distinction between 'about me' and 'about them' is a real insight about leadership, not a cliché."
  },
  {
    school: "UPenn",
    year: 2025,
    promptType: "common-app-2",
    topic: "A failed attempt to start a business selling handmade soap",
    openingLine: "I lost $340, ruined two bath towels, and gave fourteen people a rash before I learned the first rule of entrepreneurship: test your product on something other than your friends.",
    whatWorked: [
      "Self-deprecating humor immediately signals that this applicant has perspective on their failure",
      "The financial specificity ($340, not 'some money') shows business-minded thinking even in the failure",
      "Traces the failure through specific decisions — each mistake is identified and analyzed",
      "Connects to genuine learning about market research, product testing, and the gap between passion and viability"
    ],
    voiceType: "observational",
    spikeConnection: "Wharton applicant interested in consumer products — the failure demonstrated exactly the kind of thinking the business school values",
    structureType: "chronological",
    strengthAxis: "detail",
    approximateScore: 90,
    excerpt: `I lost $340, ruined two bath towels, and gave fourteen people a rash before I learned the first rule of entrepreneurship: test your product on something other than your friends. The soap business — which I had grandly named "Lather & Learn" — lasted exactly four months, produced thirty-seven bars of questionable quality, and taught me more about business than any textbook in my school's entrepreneurship elective.

The idea was simple: handmade, organic soap sold at the weekend farmers' market. The execution was not. My first batch used too much lye, which I discovered when my best friend Kenji called me at 11 p.m. with forearms that looked, in his words, "like a lobster's revenge." My second batch was cosmetically beautiful — lavender and oat, marbled like Italian stone — but dissolved in water within thirty seconds, which is a significant flaw in a product whose entire purpose is to get wet.

I pivoted three times. I watched eleven YouTube tutorials. I emailed a chemistry professor at the state university, who responded with a two-page explanation of saponification that I printed out and taped above my desk. By batch five, I had a product that neither burned skin nor dissolved on contact. But the farmers' market booth cost forty dollars per weekend, and I was selling soap for six dollars a bar, and even my limited math skills could identify the problem. I was spending more to sell the soap than the soap was worth.`,
    counselorNote: "The 'lobster's revenge' line is perfect — it shows the applicant can laugh at genuine failure rather than repackaging it as success. The progression from YouTube tutorials to emailing a chemistry professor shows escalating resourcefulness. The final math problem is stated so plainly that it becomes comic, which is exactly the right tone for an essay about a well-intentioned business that simply didn't work."
  },
  {
    school: "Northwestern",
    year: 2024,
    promptType: "common-app-2",
    topic: "Struggling with perfectionism that led to a hospitalization for anxiety",
    openingLine: "The night I went to the emergency room, my AP Chemistry homework was done, my college spreadsheet was color-coded, and my GPA was a 4.67.",
    whatWorked: [
      "The juxtaposition of perfect metrics and a hospital visit is immediately arresting",
      "Doesn't romanticize mental health struggles or present them as a superpower",
      "Shows the specific thought patterns — the spreadsheet, the grade calculation — that were symptoms, not strengths",
      "Ends with an ongoing process, not a clean recovery"
    ],
    voiceType: "confessional",
    spikeConnection: "Journalism applicant — the essay demonstrated the self-examination and honesty that defines strong journalism",
    structureType: "fragmented",
    strengthAxis: "vulnerability",
    approximateScore: 94,
    excerpt: `The night I went to the emergency room, my AP Chemistry homework was done, my college spreadsheet was color-coded, and my GPA was a 4.67. I want to say this is ironic, but it isn't. It's causal. The homework, the spreadsheet, the GPA — these were not separate from the panic attack that put me in a curtained bed at St. Luke's at 1 a.m. on a school night. They were the panic attack. They were the engine, the fuel, and the fire.

I had built a system. It was a beautiful system. Every assignment was logged in a planner with four colors of ink: blue for completed, green for in progress, red for overdue (there was never red), and purple for extra credit. I tracked my class rank weekly. I calculated the GPA impact of every test before I took it. I knew, at any given moment, exactly where I stood relative to every other student in my class, and this knowledge was not comforting. It was compulsive. It was the thing I reached for the way some people reach for a cigarette — not because it felt good, but because not reaching for it felt worse.

My therapist — whom I started seeing two days after the ER visit and continue to see every other Thursday — asked me to describe what would happen if my GPA dropped to a 4.5. I said, "I don't know." She said, "That's the problem. You've never tested the hypothesis." She was right. I had been living inside an experiment with no control group, optimizing for a variable I had never actually questioned.`,
    counselorNote: "This essay is brave in the truest sense — not dramatic bravery but the bravery of naming a problem that looks, from the outside, like a strength. The color-coded planner, the weekly rank tracking — these details will be uncomfortably familiar to many admissions readers. The therapist's line about 'testing the hypothesis' is the perfect turning point because it speaks in the applicant's own language."
  },
  {
    school: "Dartmouth",
    year: 2023,
    promptType: "common-app-2",
    topic: "Getting cut from the school play and discovering stage crew",
    openingLine: "I am a terrible actor, which I discovered publicly, under fluorescent lights, in front of thirty-seven of my peers and one drama teacher who could not hide her agreement.",
    whatWorked: [
      "The audition scene is rendered with comic precision, making the failure feel low-stakes enough to be honest about",
      "Stage crew becomes genuinely interesting — the essay finds drama in lighting design and set construction",
      "Shows how being behind the scenes revealed a preference for making things work over being seen",
      "The voice is self-deprecating without being insecure"
    ],
    voiceType: "observational",
    spikeConnection: "Engineering applicant — stage crew was where the applicant discovered the joy of building functional systems",
    structureType: "chronological",
    strengthAxis: "surprise",
    approximateScore: 87,
    excerpt: `I am a terrible actor, which I discovered publicly, under fluorescent lights, in front of thirty-seven of my peers and one drama teacher who could not hide her agreement. My audition for the fall production of Our Town consisted of two minutes of forgetting my monologue, one minute of improvising something that may or may not have been English, and a gracious "Thank you, we'll be in touch" that was clearly code for "Please never do this again."

I was not cast. I was, however, offered a position on stage crew, which Mrs. Ellison described as "equally important to the production" in a tone that suggested she did not entirely believe this herself. I accepted because my friend Jae-won was on crew and because I had nothing else to do on Tuesday and Thursday afternoons.

What I discovered backstage was a world I did not know existed. The lighting board had 512 channels. Each scene required a different configuration — warm ambers for the breakfast scenes, cold blues for the graveyard, a single spotlight for Emily's final monologue that had to be focused to a twelve-inch diameter from a distance of forty feet. This was, I realized with genuine surprise, an engineering problem. The entire production was an engineering problem. The set was a structural challenge. The sound was an acoustics challenge. The rigging was a physics challenge. The actors were doing something I couldn't do, but everything that made their work visible was something I could build.`,
    counselorNote: "This essay works because the applicant genuinely falls in love with stage crew — it's not a consolation prize, it's a discovery. The 512-channel lighting board, the twelve-inch spotlight diameter — these details show someone who sees the technical beauty in what others overlook. The final line is the essay's thesis, and it's perfect."
  },
  {
    school: "Rice",
    year: 2025,
    promptType: "common-app-2",
    topic: "Losing fluency in Spanish after moving away from a bilingual community",
    openingLine: "I forgot the subjunctive first, which is fitting, because the subjunctive is the tense of doubt.",
    whatWorked: [
      "The grammar-as-metaphor conceit is sophisticated without being pretentious",
      "Tracks the loss linguistically — each paragraph loses a grammatical structure, mirroring the experience",
      "Connects language loss to cultural disconnection without sentimentality",
      "Shows active effort to recover: conversation partners, reading, trips back to the old neighborhood"
    ],
    voiceType: "poetic",
    spikeConnection: "Linguistics and cognitive science interest — the personal experience of language attrition led to academic curiosity about how the brain processes bilingualism",
    structureType: "fragmented",
    strengthAxis: "detail",
    approximateScore: 91,
    excerpt: `I forgot the subjunctive first, which is fitting, because the subjunctive is the tense of doubt. Si yo pudiera — if I could. Si yo tuviera — if I had. The conditional, the hypothetical, the language of wishes. It left my mouth sometime between seventh and eighth grade, when my family moved from a neighborhood where Spanish lived in the air to a suburb where it lived only in my parents' bedroom, behind a closed door, in conversations I could hear but no longer fully join.

The indicative lasted longer. Yo soy. Yo tengo. I am. I have. These are the bones of a language, and bones are the last things to go. But even they began to falter. By sophomore year, I was reaching for words I used to throw. "Madrugada" — the hour just before dawn — became "early morning" in my mind before I could catch it. "Sobremesa" — the time spent lingering at the table after a meal — had no English equivalent, so I simply lost the concept. There are feelings I can no longer name.

I started meeting with Señora Vásquez after school, not for credit but for recovery. She gave me poems by Neruda and Borges and told me to read them aloud until my mouth remembered what my brain was forgetting. It worked, slowly, the way physical therapy works — not by restoring what was lost but by building new pathways to the same destination. My Spanish now is not the Spanish I grew up with. It is something rebuilt, and like all rebuilt things, it carries the visible seams of its own repair.`,
    counselorNote: "The structural conceit — losing grammatical tenses in the order of their complexity — is genuinely brilliant. 'Sobremesa' having no English equivalent, so the concept itself is lost — that's the kind of insight that makes admissions readers stop and reread. The essay is about language but also about home, about the things that dissolve when you leave the environment that sustained them."
  },

  // ==========================================================================
  // COMMON APP PROMPT 3 — Questioned or Challenged a Belief (5)
  // ==========================================================================
  {
    school: "Yale",
    year: 2024,
    promptType: "common-app-3",
    topic: "Questioning the family's belief that success means becoming a doctor",
    openingLine: "There is a specific shade of disappointment that crosses my grandmother's face when I tell her I want to study history, and it is the same shade she wears when the rice is overcooked.",
    whatWorked: [
      "The grandmother's face as a barometer — specific, visual, and culturally resonant without being stereotypical",
      "Doesn't demonize the family's expectations; shows them as a form of love with conditions",
      "The argument for history is made through specific moments of discovery, not abstract defense",
      "Navigates cultural complexity without exoticizing it"
    ],
    voiceType: "observational",
    spikeConnection: "History research and museum internship — the essay explained why history mattered in a family where only STEM 'counted'",
    structureType: "thematic",
    strengthAxis: "vulnerability",
    approximateScore: 90,
    excerpt: `There is a specific shade of disappointment that crosses my grandmother's face when I tell her I want to study history, and it is the same shade she wears when the rice is overcooked. Not anger. Not even sadness. Just a quiet recalibration of expectations, a downsizing of the future she had furnished for me in her mind — the one with the white coat and the good parking space and the waiting room where her photograph would hang next to my diploma.

In my family, there are three acceptable careers: doctor, engineer, lawyer. Everything else is a hobby. When my uncle Ravi announced he was leaving his engineering job to become a yoga instructor, my grandmother did not speak to him for six weeks. When he opened a studio that now has four locations and a feature in a wellness magazine, she acknowledged this by saying, "At least he is the boss of something." This is how love works in my family — it is unconditional, except for the conditions.

I challenged this belief not with a speech but with an artifact. During my junior year, I interned at the county historical society and helped catalog a collection of letters written by Japanese American families during their internment at a camp in our state. I brought one letter home — a photocopy, not the original — and read it to my grandmother after dinner. It was from a doctor. A Japanese American doctor who had been stripped of his practice, his home, his patients. My grandmother listened. When I finished, she said, "Who kept these letters?" I said, "A historian." She looked at me differently after that.`,
    counselorNote: "The internment camp letter is the essay's hinge, and it works because the applicant doesn't explain why it matters — the grandmother's question ('Who kept these letters?') does all the work. The 'unconditional, except for the conditions' line is the kind of observation that shows genuine thinking, not performative rebellion."
  },
  {
    school: "Amherst",
    year: 2025,
    promptType: "common-app-3",
    topic: "Questioning the meritocracy narrative at an elite prep school",
    openingLine: "The plaque above the gymnasium doors says 'Excellence Through Effort,' and I believed it until I learned what tuition costs.",
    whatWorked: [
      "Challenges a belief held by the institution, not just the applicant — a riskier move that pays off",
      "Grounds critique in specific observations rather than abstract ideology",
      "Acknowledges the applicant's own complicity and benefit from the system being critiqued",
      "Shows how the questioning led to action (financial aid advocacy) not just opinion"
    ],
    voiceType: "analytical",
    spikeConnection: "Economics and education policy interest — the essay demonstrated the analytical thinking the applicant would bring to college",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 89,
    excerpt: `The plaque above the gymnasium doors says "Excellence Through Effort," and I believed it until I learned what tuition costs. Fifty-two thousand dollars a year. My scholarship covers most of it. For the families who pay full freight, that number is an investment. For my mother, who fills out the FAFSA form at the kitchen table every February with the careful anxiety of someone defusing a bomb, that number is a universe.

I started noticing the architecture of advantage. The kid who got a perfect SAT score also had a private tutor who charged two hundred dollars an hour. The girl who won the science fair had a parent who was a professor in the exact field she researched. The debate champion had attended a summer institute that cost more than my mother earns in two months. None of this was cheating. All of it was access. And the plaque above the gymnasium kept insisting that the only variable was effort.

I don't think my classmates are frauds. I think the system they were born into is so smooth that they cannot feel its surface. When I raised this observation in my AP Government class, my teacher — a good teacher, a thoughtful teacher — said, "The system isn't perfect, but it's still the best we have." I wrote those words in my notebook and circled them, because they seemed to answer a question I hadn't asked. I wasn't asking whether the system was the best. I was asking who it was best for.`,
    counselorNote: "This is a dangerous essay to write for a college that is itself an elite institution. It works because the applicant is implicating themselves in the system too — they're on scholarship at this school, benefiting from the very thing they're questioning. The final distinction — 'who it was best for' — shows genuine philosophical thinking, not just complaint."
  },
  {
    school: "Swarthmore",
    year: 2023,
    promptType: "common-app-3",
    topic: "Questioning the idea that forgiveness is always the right response",
    openingLine: "My church taught me to forgive, and for sixteen years I did, until I realized that some of the people I was forgiving had never asked for it.",
    whatWorked: [
      "Engages with a genuine moral question, not a straw-man belief",
      "The religious context is handled with respect — the church isn't the villain",
      "Specific instance (a teacher who humiliated her) grounds the philosophical argument",
      "Arrives at a nuanced position: forgiveness is valid but shouldn't be obligatory"
    ],
    voiceType: "confessional",
    spikeConnection: "Philosophy and ethics interest — the essay demonstrated the applicant's capacity for moral reasoning",
    structureType: "thematic",
    strengthAxis: "vulnerability",
    approximateScore: 88,
    excerpt: `My church taught me to forgive, and for sixteen years I did, until I realized that some of the people I was forgiving had never asked for it. This is not an essay about losing faith. I still attend services every Sunday, still sing in the choir, still believe in most of what the minister says. But I have started to disagree with him on forgiveness, which in my congregation is like disagreeing with gravity — technically possible, but you'd better have a good reason.

The reason arrived in tenth grade, when my English teacher, Mr. Callahan, read my personal essay aloud to the class as an example of "overwrought writing." He did not use my name, but in a class of seventeen students, anonymity is a fiction. I sat at my desk and felt twenty-three years of Sunday sermons telling me to forgive, to turn the other cheek, to assume good intentions. I tried. I sat with the anger for three days, journaling about compassion, praying for the ability to release it.

On the fourth day, I stopped trying. Not because I wanted to hold a grudge, but because I realized that forgiveness, as I had been taught it, was a transaction in which I did all the work. Mr. Callahan had never apologized. He did not know he had done something that required apology. My forgiveness, in this case, would not heal a relationship — it would simply excuse a person from understanding the damage they had caused.`,
    counselorNote: "The courage here is in challenging something genuinely sacred to the applicant, not a belief they've already outgrown. The Mr. Callahan incident is specific enough to be real and universal enough to resonate. The final insight — forgiveness as a transaction where one person does all the work — is philosophically sophisticated for any age."
  },
  {
    school: "Pomona",
    year: 2024,
    promptType: "common-app-3",
    topic: "Questioning the environmental movement's assumptions about rural communities",
    openingLine: "The first time an activist called my father a 'climate criminal,' he was elbow-deep in a cow at 5 a.m., trying to save a calf that was stuck in the birth canal.",
    whatWorked: [
      "The opening image is visceral and immediately complicates the narrative",
      "Refuses easy sides: the applicant cares about climate AND farming",
      "Specific policy knowledge (cap-and-trade, methane regulations) shows depth of engagement",
      "Shows how the applicant became a bridge figure between environmentalists and farming communities"
    ],
    voiceType: "narrative",
    spikeConnection: "Environmental science and agricultural policy — the essay showed the applicant's unique perspective at the intersection",
    structureType: "chronological",
    strengthAxis: "place",
    approximateScore: 92,
    excerpt: `The first time an activist called my father a "climate criminal," he was elbow-deep in a cow at 5 a.m., trying to save a calf that was stuck in the birth canal. The comment was on a Twitter thread about methane emissions from cattle farming. The activist had 40,000 followers and a podcast. My father has a 200-acre dairy farm in central Wisconsin and a pair of rubber boots that smell like exactly what you think they smell like.

I believe in climate change. I have read the IPCC reports. I understand that agriculture contributes to greenhouse gas emissions, and I believe we need systemic solutions. But I also believe that most climate discourse treats farmers like my father — small-scale, multi-generational, barely profitable — as if they are the same as industrial feedlot operations. They are not. My father's farm has been in our family for four generations. He rotates pastures, maintains a riparian buffer along the creek, and has invested in a methane digester that cost more than his truck. He is not a climate criminal. He is a climate participant, like everyone who eats.

I challenged this belief not at my father's dinner table but at a regional environmental summit, where I was the only speaker under forty and the only speaker who had ever milked a cow. I told the room that if the environmental movement wants to include rural America, it needs to stop treating farmers as the enemy and start treating them as engineers of the land — people who already understand ecosystems because their livelihoods depend on them.`,
    counselorNote: "The cow-at-5-a.m. opening is one of the best first images I've encountered. This essay challenges the right audience — not climate science, but climate communication — and does so from a position of genuine authority. The applicant is both an environmentalist and a farmer's kid, and the essay lives in that productive tension."
  },
  {
    school: "Williams",
    year: 2026,
    promptType: "common-app-3",
    topic: "Questioning whether competitive debate teaches or distorts honest thinking",
    openingLine: "I can argue either side of any issue in under six minutes, and I am no longer sure this is a skill.",
    whatWorked: [
      "The opening line is a thesis statement disguised as a confession",
      "Uses specific debate rounds to show how arguing both sides led to intellectual vertigo",
      "Doesn't quit debate — stays and tries to reform the culture from within",
      "Shows the difference between persuasion and understanding"
    ],
    voiceType: "analytical",
    spikeConnection: "Philosophy and rhetoric interest — the meta-analysis of debate showed the kind of thinking the applicant wanted to pursue academically",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 90,
    excerpt: `I can argue either side of any issue in under six minutes, and I am no longer sure this is a skill. Last November, I won a round arguing that economic sanctions on authoritarian regimes are morally justified. Two hours later, I won another round arguing the opposite. The judge congratulated me on my "flexibility." I thanked him and walked to the parking lot and sat in my mother's car and tried to figure out what I actually believed about sanctions, and I could not.

This is the dirty secret of competitive debate: it teaches you to win, not to think. Or rather, it teaches a particular kind of thinking — strategic, adversarial, optimized for persuasion — and calls it "critical thinking" on the brochure. I have spent four years learning to find the weakness in any argument, including my own. I can deconstruct a position before I've even finished constructing it. This makes me very good at debate and very bad at commitment.

I raised this concern at a team meeting and was met with what debaters do best: counterarguments. "Playing both sides builds empathy." "It teaches you to understand your opponent." These are reasonable points, and I can feel my debate brain marshaling responses to my own objections, which is exactly the problem. When your mind is trained to treat every conviction as a position to be attacked, sincerity starts to feel like a vulnerability you haven't yet exploited.`,
    counselorNote: "This is an essay about the cost of a skill, which is a far more interesting frame than the usual debate essay about the benefits. The parking lot moment — unable to locate a genuine belief about sanctions — is the essay's emotional center. This applicant is questioning the thing that is supposed to be their greatest strength, and that takes real intellectual courage."
  },

  // ==========================================================================
  // COMMON APP PROMPT 5 — Accomplishment, Event, or Realization (8)
  // ==========================================================================
  {
    school: "Caltech",
    year: 2024,
    promptType: "common-app-5",
    topic: "The moment of understanding Euler's identity for the first time",
    openingLine: "I cried in a Denny's at 2 a.m. because of a math equation, and I am not embarrassed about this.",
    whatWorked: [
      "The Denny's setting is perfect — mathematical transcendence in the most mundane possible location",
      "Communicates genuine intellectual passion without being pretentious",
      "Explains the math clearly enough for a non-math reader to understand why it matters",
      "The emotional response to beauty is the real subject — the math is the occasion"
    ],
    voiceType: "confessional",
    spikeConnection: "Mathematics research and competition history — the essay showed the emotional dimension of a profile that could otherwise seem purely technical",
    structureType: "in-media-res",
    strengthAxis: "detail",
    approximateScore: 93,
    excerpt: `I cried in a Denny's at 2 a.m. because of a math equation, and I am not embarrassed about this. My friend Rosa and I had been studying for the AMC at her kitchen table until midnight, when her mother politely suggested that our enthusiasm for number theory was incompatible with her desire to sleep. We relocated to the only place open: the Denny's on Route 9, where a waitress named Charlene brought us coffee and asked if we were "doing homework or having a crisis." Both, as it turned out.

Rosa was showing me Euler's identity — e^(iπ) + 1 = 0 — and walking me through why it works. I had seen it before. I had memorized it. But I had never understood it, which is an entirely different thing. Rosa drew it out on a napkin: how e, the base of natural logarithms, raised to the power of i (the square root of negative one) times pi (the ratio of a circle's circumference to its diameter), plus one, equals zero. Five fundamental constants of mathematics, from completely different branches of the field, connected in a single equation that equals nothing.

I stared at the napkin for a long time. Charlene refilled our coffees. And then something happened that I can only describe as a feeling of being very small and very lucky. The universe had no obligation to be organized this way. These numbers had no reason to be related. And yet they were, as if mathematics were not something humans invented but something we discovered — a structure that was always there, waiting for us to notice. I cried. Rosa took a picture of the napkin. Charlene asked if the pie was that good.`,
    counselorNote: "The Denny's, Charlene the waitress, the napkin — this essay makes mathematical beauty feel accessible and real. The tears are not performed; they emerge from a genuine encounter with something transcendent. The final line (Charlene asking about the pie) is the perfect release valve — it brings us back to earth without diminishing what just happened."
  },
  {
    school: "Harvard",
    year: 2025,
    promptType: "common-app-5",
    topic: "Teaching an elderly neighbor to use a smartphone and what it revealed about design",
    openingLine: "Mrs. Kowalski threw her iPhone at the couch three times before I understood that the problem was not Mrs. Kowalski.",
    whatWorked: [
      "Reframes a service activity as a design insight — the essay is about empathy in technology, not about helping old people",
      "Mrs. Kowalski is a full character: stubborn, funny, sharp in ways the phone doesn't accommodate",
      "Technical observations about UI/UX are embedded naturally in the narrative",
      "The realization — that technology should adapt to people, not vice versa — is arrived at through experience, not theory"
    ],
    voiceType: "observational",
    spikeConnection: "Human-computer interaction interest — the essay provided the personal origin story for the academic pursuit",
    structureType: "chronological",
    strengthAxis: "surprise",
    approximateScore: 91,
    excerpt: `Mrs. Kowalski threw her iPhone at the couch three times before I understood that the problem was not Mrs. Kowalski. I had volunteered to teach smartphone basics at the senior center, imagining myself a patient guide leading grateful elders into the digital age. What I found instead was a room full of intelligent, frustrated adults whose hands had been building and fixing things since before my parents were born, confronting a device that treated their experience as irrelevant.

Mrs. Kowalski is seventy-eight. She rebuilt the engine of a 1967 Mustang in her driveway. She can identify any bird in the state by its call. She cannot, despite forty-five minutes of instruction, reliably tap a button on a touchscreen because the buttons are too small for her fingers, the text is too small for her eyes, and the interface provides no tactile feedback to confirm that anything has happened. "In my day," she told me, "when you pushed a button, it pushed back."

That sentence rearranged my brain. I went home and looked at my phone — really looked at it — and realized that every app I used was designed by and for people like me: young, sighted, steady-handed, and culturally fluent in the grammar of swipes and taps. The phone was not neutral. It was an argument about who deserved to use it, made in pixels and font sizes. Mrs. Kowalski wasn't failing at technology. Technology was failing at Mrs. Kowalski.`,
    counselorNote: "The Mustang engine and bird calls — these details make Mrs. Kowalski a person, not a prop. The essay's genuine insight (technology as 'an argument about who deserved to use it') is the kind of reframing that admissions officers remember. This is a service essay that transcends the genre by finding a real idea inside the experience."
  },
  {
    school: "Princeton",
    year: 2023,
    promptType: "common-app-5",
    topic: "Organizing a walkout over the school's dress code policy and its aftermath",
    openingLine: "Fifty-three students walked out of fifth period on a Thursday in April, and by Friday morning I was in the principal's office learning the difference between protest and consequence.",
    whatWorked: [
      "Doesn't glorify the protest — honestly assesses what worked and what didn't",
      "The dress code issue is specific (gendered enforcement) rather than vague",
      "Shows political sophistication: organizing, messaging, negotiation, compromise",
      "The consequence — suspension — is handled without martyrdom"
    ],
    voiceType: "narrative",
    spikeConnection: "Political science and gender studies interest — the essay showed the applicant as someone who acts on analysis, not just produces it",
    structureType: "chronological",
    strengthAxis: "detail",
    approximateScore: 89,
    excerpt: `Fifty-three students walked out of fifth period on a Thursday in April, and by Friday morning I was in the principal's office learning the difference between protest and consequence. The issue was the dress code, specifically the fact that in the same week, two girls had been sent home for wearing tank tops while a boy wore a shirt that said "Cool Story Babe, Now Make Me a Sandwich" without comment. I had been tracking these incidents in a shared Google Doc since September: forty-seven dress code violations, forty-one of them issued to girls, zero for offensive slogans.

The walkout was not spontaneous. I spent three weeks organizing: writing a petition, meeting with the student council, requesting a formal review of the policy. When every official channel returned polite variations of "we'll look into it," I sent a group text to the Doc's 200 followers and asked who was willing to miss one class to make a point. Fifty-three showed up. We stood on the front steps for twenty minutes, holding signs I had made at the copy shop with my own money. The local news came. My mother texted me a screenshot of myself on Channel 4 and the single word: "Explain."

The principal, Dr. Reeves, suspended me for one day. She said she respected the message but not the method. I said I had tried the approved methods first. She said the approved methods take time. I said the girls being sent home didn't have time. We were both right, which is the most frustrating kind of disagreement.`,
    counselorNote: "The Google Doc tracking forty-seven violations is the detail that makes this essay work — it shows the applicant is systematic, not reactive. The exchange with the principal ('We were both right') demonstrates genuine political maturity. This isn't a protest essay; it's an essay about the mechanics of change."
  },
  {
    school: "Duke",
    year: 2024,
    promptType: "common-app-5",
    topic: "Discovering a love of baking through feeding the night-shift nurses who cared for a hospitalized sibling",
    openingLine: "I learned to make croissants in a hospital cafeteria at 3 a.m., using YouTube, a rolling pin I bought at Walmart, and the kind of desperate focus that only comes from having nothing else you can do.",
    whatWorked: [
      "The baking is not a metaphor — it's a genuine coping mechanism that becomes a passion",
      "The hospital setting is specific without being exploitative — the sibling's illness is present but not the point",
      "Shows how feeding the nurses was both generosity and self-preservation",
      "The sensory details of baking contrast with the clinical hospital environment"
    ],
    voiceType: "narrative",
    spikeConnection: "Chemistry and food science interest — the essay connected the precision of baking to the applicant's scientific mind",
    structureType: "chronological",
    strengthAxis: "place",
    approximateScore: 90,
    excerpt: `I learned to make croissants in a hospital cafeteria at 3 a.m., using YouTube, a rolling pin I bought at Walmart, and the kind of desperate focus that only comes from having nothing else you can do. My younger brother was in the pediatric ward for eleven weeks. My parents took turns staying overnight. My job, self-assigned, was to keep everyone fed, because feeding people was the one thing in that building I could control.

The first batch was terrible — dense, greasy, shaped like sad little fists. The night nurse, Angela, ate two anyway and said, "Honey, these are the best things I've tasted in this hospital," which was both a compliment and an indictment of hospital food. By batch four, I had figured out the lamination: butter folded into dough, rolled, folded again, rolled, folded — twenty-seven layers, each one thinner than the last. The precision calmed me. The counting calmed me. In a place where I could not control whether my brother's white blood cell count would rise or fall, I could control the temperature of butter.

Angela became my first regular customer, if you can call someone who receives free pastries at 3 a.m. a customer. Then the other night-shift nurses. Then the orderlies. By week six, I was bringing a different recipe every visit — challah on Fridays, banana bread on Mondays, cinnamon rolls for the weekend crew. The cafeteria staff gave me a corner of counter space and looked the other way when I used their oven. My brother, from his bed, called me "the hospital's baker" and asked if I was planning to charge. I was not. Some debts are not payable in money.`,
    counselorNote: "The twenty-seven layers of lamination is the essay's quiet metaphor — precision as a response to chaos — but it never announces itself as such. The brother's joke from his hospital bed is the perfect tonal balance: love without heaviness. This essay is about baking, but it's also about how we survive the things we can't fix."
  },
  {
    school: "Stanford",
    year: 2026,
    promptType: "common-app-5",
    topic: "Realizing that their volunteer tutoring was doing more harm than good",
    openingLine: "The most important thing I learned from tutoring was that I was a bad tutor.",
    whatWorked: [
      "Reverses the expected service essay narrative — the realization is about failure, not impact",
      "Specific about what went wrong: cultural assumptions, deficit thinking, not listening",
      "Shows the work of changing: reading about pedagogy, observing experienced tutors, retraining",
      "The humility is genuine, not performed"
    ],
    voiceType: "confessional",
    spikeConnection: "Education policy interest — the essay showed the applicant's willingness to question their own assumptions, which is essential for the field",
    structureType: "circular",
    strengthAxis: "vulnerability",
    approximateScore: 91,
    excerpt: `The most important thing I learned from tutoring was that I was a bad tutor. I arrived at the community center in September with a binder full of worksheets and the unexamined confidence of a straight-A student who believed that academic success was primarily a matter of effort and organization. If I could just show these kids how I studied, I thought, their grades would improve. This belief was, I have since learned, a form of arrogance dressed up as helpfulness.

My student was a ninth-grader named DeAndre. He was smart — genuinely, observably smart — and he hated every minute of our sessions. He stared at my worksheets the way you stare at a menu in a language you don't speak: politely, with increasing despair. After three weeks, his math grade had not improved. After five weeks, he stopped showing up.

I could have moved on to another student. Instead, I called DeAndre's mother. She told me something that rearranged my understanding of tutoring, education, and myself: "He said you made him feel stupid." I had never, not once, intended to make him feel stupid. But intention is not impact. I had been correcting his work with a red pen, just as my teachers corrected mine. I had been using methods that assumed his learning style matched mine. I had been teaching at him rather than with him, and the difference, I now know, is everything.`,
    counselorNote: "Most service essays describe impact on others. This one describes impact on the self — the discovery that good intentions are not enough. DeAndre's mother's words ('He said you made him feel stupid') are the essay's turning point, and the applicant doesn't flinch from them. This is an essay about learning to learn, which is exactly what colleges want to see."
  },
  {
    school: "Vanderbilt",
    year: 2025,
    promptType: "common-app-5",
    topic: "The realization that their grandfather's 'boring' stories were actually oral history",
    openingLine: "My grandfather has told me the same fourteen stories approximately four hundred times, and it took me seventeen years to realize I should be writing them down.",
    whatWorked: [
      "The specificity — fourteen stories, four hundred times — is both hyperbolic and precisely counted, matching the essay's tone",
      "Recreates one story in enough detail that the reader understands the grandfather's voice",
      "The realization is not dramatic but gradual, which is more honest",
      "Connects to a broader understanding of oral tradition and what happens when it's lost"
    ],
    voiceType: "narrative",
    spikeConnection: "Anthropology and oral history interest — the essay showed the personal root of the academic fascination",
    structureType: "circular",
    strengthAxis: "detail",
    approximateScore: 88,
    excerpt: `My grandfather has told me the same fourteen stories approximately four hundred times, and it took me seventeen years to realize I should be writing them down. Story number six is about the time he walked eleven miles to school in a rainstorm and arrived so wet that the teacher hung his shirt on the radiator and he sat in class shirtless, "learning long division in my undershirt like a prizefighter." Story number three is about his mother's cornbread, which he describes with the kind of reverence other people reserve for religious texts: "She used bacon grease, not butter, and she put a cast-iron skillet in the oven before the batter so the bottom would crisp, and if you think anyone else's cornbread is worth eating, you have been misled."

For most of my childhood, these stories were furniture — always there, slightly in the way, requiring no attention. I tuned them out the way you tune out a ceiling fan. I said "uh-huh" and "that's crazy, Grandpa" and went back to my phone. I was, in the vocabulary I would later learn, letting oral history die in real time.

The change happened in AP US History, when my teacher assigned us to interview a family member about their experience during the civil rights era. I asked my grandfather. He gave me story number eleven — the one about the bus station in Meridian — and for the first time, I listened with a recorder running and a notebook open. He spoke for forty-seven minutes without stopping. The story I had heard a hundred times was, it turned out, only the first paragraph of a much longer text that he had been waiting, patiently, for someone to ask him to finish.`,
    counselorNote: "The cast-iron skillet cornbread — that's the detail that makes the grandfather real. The essay's power comes from the shift in attention: from 'uh-huh' to a recorder and notebook. The revelation that the familiar story was 'only the first paragraph' is the kind of ending that makes you want to call your own grandparents."
  },
  {
    school: "UVA",
    year: 2024,
    promptType: "common-app-5",
    topic: "Building a free library in a food desert neighborhood and discovering it became a food pantry",
    openingLine: "I built a Little Free Library on the corner of Magnolia and Fourth, and within two weeks, the books were gone and the shelves were full of canned goods.",
    whatWorked: [
      "The transformation from library to pantry is a genuinely surprising detail that drives the whole essay",
      "Shows the applicant learning from the community rather than imposing solutions on it",
      "The observation about what a neighborhood actually needs versus what outsiders think it needs is earned through experience",
      "Avoids savior narrative — the applicant becomes a listener and facilitator, not a hero"
    ],
    voiceType: "observational",
    spikeConnection: "Public health and community development interest — the essay showed how the applicant's assumptions were productively challenged",
    structureType: "chronological",
    strengthAxis: "surprise",
    approximateScore: 89,
    excerpt: `I built a Little Free Library on the corner of Magnolia and Fourth, and within two weeks, the books were gone and the shelves were full of canned goods. This was not what I had planned. I had envisioned a neighborhood book exchange: take a book, leave a book, foster literacy, feel good about yourself. What I got instead was a lesson in the difference between what a community wants and what a community needs.

Magnolia and Fourth is in what urban planners politely call a "food desert," which means the nearest grocery store is a forty-minute bus ride away. The corner store sells Takis, energy drinks, and lottery tickets. It does not sell fresh produce, which is why Mrs. Grimes, who lives in the yellow house across the street, started leaving cans of beans on the library shelf with a note that said: "For anyone who's hungry. No shame."

Within a month, the Little Free Library was a Little Free Pantry. Neighbors contributed what they could — canned soup, rice, boxes of pasta. Someone added a Tupperware container of homemade tamales with a note: "Still warm. Eat today." I stood on the sidewalk and watched a system organize itself without my help, which was both humbling and instructive. I had come to this corner with a solution. The corner had its own.`,
    counselorNote: "The tamales note — 'Still warm. Eat today' — is the detail that elevates this from a good essay to a great one. The applicant's willingness to step back and observe what the community does with the structure they built shows genuine maturity. The last line ('The corner had its own') is thesis-level thinking delivered with narrative grace."
  },
  {
    school: "Cornell",
    year: 2023,
    promptType: "common-app-5",
    topic: "Realizing during a coding bootcamp that they wanted to build tools, not products",
    openingLine: "Somewhere between hour forty and hour fifty of a seventy-two-hour hackathon, I realized I was building the wrong thing for the right reasons.",
    whatWorked: [
      "The hackathon setting provides natural urgency and specificity",
      "The distinction between tools and products is intellectually interesting and personally revealing",
      "Shows the applicant choosing the less glamorous, more impactful path",
      "Technical details are accessible without being dumbed down"
    ],
    voiceType: "analytical",
    spikeConnection: "Computer science with focus on developer tools and open-source infrastructure — the essay explained a niche interest compellingly",
    structureType: "in-media-res",
    strengthAxis: "surprise",
    approximateScore: 88,
    excerpt: `Somewhere between hour forty and hour fifty of a seventy-two-hour hackathon, I realized I was building the wrong thing for the right reasons. My team was developing a meal-planning app for low-income families — a good idea, a socially valuable idea, the kind of idea that wins hackathon prizes. We had a landing page, a logo, and a pitch deck with the word "impact" on every third slide. What we did not have was a working backend, because the database framework we were using had a bug that had cost us nine hours.

While my teammates redesigned the logo for the fourth time, I went down a rabbit hole. I found the bug in the framework's source code — a single misplaced conditional in the query parser. I forked the repository, wrote a fix, submitted a pull request, and felt something I had never felt while building the app itself: satisfaction. Deep, specific, disproportionate satisfaction.

I tried to explain this to my teammate Jordan during our 3 a.m. coffee run. "I think I'd rather fix the tool than build the thing," I said. Jordan looked at me like I had suggested we abandon the hackathon to reorganize the supply closet. But that was exactly what I meant. The meal-planning app would help one group of users. The framework fix would help every developer who used that framework to build anything — including, potentially, better meal-planning apps. I wanted to work on the layer below the layer that people see.`,
    counselorNote: "This is an unusual essay for CS applicants, who typically showcase the flashy product they built. This applicant is drawn to infrastructure — the invisible layer — and the essay makes that preference feel not just valid but exciting. The 'layer below the layer' formulation is memorable and precise."
  },

  // ==========================================================================
  // COMMON APP PROMPT 6 — Topic, Idea, or Concept (5)
  // ==========================================================================
  {
    school: "University of Chicago",
    year: 2024,
    promptType: "common-app-6",
    topic: "An obsession with parking lots as designed spaces",
    openingLine: "The parking lot of the Costco on Henderson Boulevard is, by any reasonable aesthetic standard, ugly — and it is the most interesting place I know.",
    whatWorked: [
      "Takes a genuinely unexpected topic and makes it intellectually serious",
      "The parking lot becomes a lens for urban design, economics, psychology, and environmental science",
      "Humor is present but the fascination is real, not performed",
      "Specific observations (traffic flow patterns, paint fading rates, heat island effect) show genuine study"
    ],
    voiceType: "analytical",
    spikeConnection: "Urban planning and environmental design interest — the parking lot obsession was the entry point to serious academic questions",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 94,
    excerpt: `The parking lot of the Costco on Henderson Boulevard is, by any reasonable aesthetic standard, ugly — and it is the most interesting place I know. It is 4.2 acres of asphalt, painted with 847 parking spaces (I counted), bordered by a drainage ditch that smells like regret after a rainstorm, and visited by approximately 3,000 cars per day. It is also a masterpiece of invisible design, a case study in human behavior, and the single largest contributor to the heat island effect in my zip code.

I became interested in parking lots the way most people become interested in things: by accident. My driver's ed instructor told me to practice parking at the Costco lot on Sunday mornings, when it was empty. While practicing three-point turns, I noticed the geometry. The lot was not a simple grid. It was angled — each row at precisely sixty degrees, which I later learned is the standard for maximizing throughput in a one-way traffic flow. Someone had done math to make this lot work, and no one had ever noticed, including me, until I had to park in it repeatedly.

From there, the rabbit hole opened. I learned that the United States has approximately 800 million parking spaces — roughly three for every car. I learned that parking minimums in zoning codes have shaped American cities more than any architect. I learned that a single acre of asphalt absorbs enough solar radiation to heat a small building, and that the runoff from a parking lot carries oil, heavy metals, and tire particles into the nearest waterway. The Costco lot suddenly seemed less like a convenience and more like a decision — one that nobody remembers making but everyone lives with.`,
    counselorNote: "This is the quintessential 'unexpected topic' essay, and it works because the fascination is genuine. The applicant has actually counted the parking spaces, actually measured the angles, actually researched the heat island effect. The essay's implicit argument — that the most consequential design decisions are the ones we never notice — is UChicago-level thinking."
  },
  {
    school: "MIT",
    year: 2025,
    promptType: "common-app-6",
    topic: "The concept of error margins and how they apply to life decisions",
    openingLine: "My chemistry teacher says that every measurement is a confession of ignorance, and I have been thinking about this for eleven months.",
    whatWorked: [
      "Takes a scientific concept and applies it to personal decision-making without being corny",
      "The teacher's line is a perfect anchor — the essay keeps returning to it with new understanding",
      "Shows how tolerance for uncertainty is both a scientific and emotional skill",
      "Specific examples (choosing a college, estimating friendship quality) make abstract ideas concrete"
    ],
    voiceType: "analytical",
    spikeConnection: "Physics and philosophy of science interest — the essay showed the applicant thinks about the epistemology of measurement, not just the mechanics",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 92,
    excerpt: `My chemistry teacher says that every measurement is a confession of ignorance, and I have been thinking about this for eleven months. She meant it technically: when you report a measurement as 4.72 ± 0.03 grams, you are saying "I know this much, and this is what I don't know." The plus-or-minus is not an apology. It is honesty. It is the part of the number that says, "I did my best, and here is the boundary of my certainty."

I have become obsessed with error margins because they solve a problem I didn't know I had: the problem of false precision. Before Mrs. Lin's class, I thought that more decimal places meant more knowledge. I thought certainty was the goal. I thought that good science — and by extension, good thinking — meant eliminating doubt. Mrs. Lin taught me that doubt is not the enemy of knowledge. Doubt, properly measured and reported, is knowledge.

This reframing has migrated, like an invasive species, into every other part of my life. When my friend asks me how confident I am that I'll get into my first-choice college, I want to say: "72 ± 15 percent, with the margin driven primarily by uncertainty in the essay evaluation process." When my parents ask if I'm sure I want to major in physics, I want to say: "The confidence interval on this decision is wide, but the mean has been stable for three years, which suggests the underlying signal is real." I do not actually say these things, because I would like to keep my friends. But I think them.`,
    counselorNote: "The humor in the final paragraph ('I would like to keep my friends') saves this from being overly earnest. The essay is genuinely about something — the philosophy of measurement — and it manages to make that topic feel personal. Mrs. Lin's line about measurement as 'a confession of ignorance' is the kind of seed that grows an entire essay organically."
  },
  {
    school: "Brown",
    year: 2024,
    promptType: "common-app-6",
    topic: "The concept of 'code-switching' and its relationship to authenticity",
    openingLine: "I am at least four different people, and they all have the same face.",
    whatWorked: [
      "Names the specific versions of self: church-self, school-self, home-self, online-self",
      "Doesn't resolve the tension — authenticity is presented as a genuine question, not a problem to solve",
      "Linguistic detail is precise: specific phrases, tonal shifts, vocabulary changes",
      "Connects code-switching to sociolinguistics as an academic interest"
    ],
    voiceType: "confessional",
    spikeConnection: "Sociolinguistics and identity studies — the essay was the lived experience behind the academic curiosity",
    structureType: "fragmented",
    strengthAxis: "vulnerability",
    approximateScore: 90,
    excerpt: `I am at least four different people, and they all have the same face. There is church-me, who says "Yes ma'am" and "Praise God" and wears a skirt that falls below the knee. There is school-me, who says "Actually, I think the data suggests otherwise" and wears the same skirt with sneakers. There is home-me, who speaks a mixture of English and Haitian Creole and wears whatever is clean. And there is online-me, who speaks in memes and lowercase letters and wears nothing because the internet has no dress code.

Sociolinguists call this code-switching. My grandmother calls it "having sense." My therapist calls it "adaptive behavior." I call it Tuesday, because it happens every day and I have stopped noticing it, the way a translator stops noticing that they are translating.

The question that occupies me is not whether code-switching is good or bad — it is clearly useful, and possibly necessary, and I have no intention of stopping. The question is which version of me is the real one, or whether the question itself is wrong. Is there a "base code" underneath all the switching — a kernel of self that remains constant when the language and the clothes and the posture change? Or am I, like a program that only runs when called, nothing more than the sum of my interfaces?`,
    counselorNote: "The programming metaphor at the end — 'nothing more than the sum of my interfaces' — is perfect for an applicant thinking about both identity and computer science. The essay's strength is that it doesn't resolve the question. It sits with the discomfort. The grandmother's 'having sense' is the best single detail — it reframes code-switching as a survival skill with its own cultural wisdom."
  },
  {
    school: "Georgetown",
    year: 2025,
    promptType: "common-app-6",
    topic: "The concept of the 'Overton window' and how political ideas become acceptable",
    openingLine: "The most dangerous ideas are not the ones that are wrong — they are the ones that are right at the wrong time.",
    whatWorked: [
      "Explains the Overton window clearly without being condescending",
      "Uses historical examples (interracial marriage, women's suffrage) to show how the window moves",
      "Applies the concept to a current issue in the applicant's own school community",
      "Shows sophisticated political thinking without partisanship"
    ],
    voiceType: "analytical",
    spikeConnection: "Political science and rhetoric — the essay demonstrated the kind of systemic thinking the applicant would bring to the study of politics",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 87,
    excerpt: `The most dangerous ideas are not the ones that are wrong — they are the ones that are right at the wrong time. This is my interpretation of the Overton window, a concept I encountered in a political science podcast and have been unable to stop thinking about since. The Overton window describes the range of ideas that the public considers acceptable at any given moment. Ideas inside the window are "mainstream." Ideas outside the window are "radical." And the window moves — slowly, invisibly, in response to forces that are easier to identify in retrospect than in real time.

Consider: in 1958, 96 percent of Americans disapproved of interracial marriage. The idea of legal interracial marriage was not just outside the Overton window — it was in a different building. Nine years later, the Supreme Court ruled it unconstitutional to ban it. The idea didn't change. The window did. And the people who argued for it when it was outside the window — who endured ridicule, ostracism, violence — were not vindicated by the window moving. They were the reason it moved.

I think about this every time someone in my school dismisses an idea as "too radical." Last year, I proposed a student-led audit of our school's disciplinary records, broken down by race and socioeconomic status. The student council president said it was "divisive." The principal said it was "not the right time." I recognized these responses. They were the language of the window's edge — the rhetoric that every institution uses when it encounters an idea it is not yet ready to accept.`,
    counselorNote: "This essay takes a political science concept and makes it personal without trivializing either the concept or the personal experience. The transition from interracial marriage to the school disciplinary audit is handled deftly — the applicant isn't equating the two, but showing how the same rhetorical pattern operates at different scales."
  },
  {
    school: "Johns Hopkins",
    year: 2024,
    promptType: "common-app-6",
    topic: "The concept of 'proprioception' — the body's sense of its own position in space",
    openingLine: "Close your eyes and touch your nose. The fact that you can do this without looking is one of the most underrated miracles of the nervous system, and it has ruined my life in the best possible way.",
    whatWorked: [
      "Opens with an interactive command that immediately engages the reader physically",
      "Connects a neuroscience concept to the applicant's experience with dance and injury recovery",
      "The 'ruined my life' hook creates tension that the essay resolves through intellectual discovery",
      "Specific neurological detail (Golgi tendon organs, muscle spindles) is woven in naturally"
    ],
    voiceType: "poetic",
    spikeConnection: "Neuroscience and kinesiology interest — the essay connected a personal dance injury to an academic fascination with the sensory nervous system",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 89,
    excerpt: `Close your eyes and touch your nose. The fact that you can do this without looking is one of the most underrated miracles of the nervous system, and it has ruined my life in the best possible way. The miracle has a name — proprioception — and it is, in short, your body's ability to know where it is without seeing itself. Tiny sensors in your muscles and joints, called muscle spindles and Golgi tendon organs, send constant reports to your brain: how far your arm is extended, how much your knee is bent, whether your head is tilted three degrees to the left. You are, at this very moment, performing millions of calculations about your own body's position, and you have no idea you are doing it.

I discovered proprioception the way many people discover neuroscience: through its absence. When I tore my ACL during a dance rehearsal in sophomore year, the surgeon told me the surgery would fix the ligament but not the proprioceptive damage. I didn't know what he meant until physical therapy, when my therapist asked me to stand on one foot with my eyes closed. I fell immediately. My knee was repaired, but my brain's map of my knee was scrambled. I could see my leg. I could feel it with my hands. But some deeper sense — the sense that knew, without looking, exactly where my body was — had been disrupted.

The rehabilitation of proprioception is, essentially, retraining the brain to trust the body again. Balance boards, eyes-closed exercises, surfaces that shift and wobble. It is tedious, repetitive, and profoundly interesting, because it reveals that the body is not a machine operated by a brain. It is a conversation between systems, each one reporting to the others, each one capable of being wrong.`,
    counselorNote: "The opening instruction — 'Close your eyes and touch your nose' — is a masterful engagement technique. The reader literally performs the concept before reading about it. The ACL tear provides narrative urgency, but the essay's real subject is the neuroscience itself. The final image of the body as 'a conversation between systems' is conceptually elegant."
  },

  // ==========================================================================
  // COMMON APP PROMPT 7 — Topic of Your Choice (5)
  // ==========================================================================
  {
    school: "Columbia",
    year: 2025,
    promptType: "common-app-7",
    topic: "A love letter to the Q train and the sociology of a subway car",
    openingLine: "The Q train between Sheepshead Bay and Times Square takes forty-seven minutes, which is exactly long enough to fall in love with six strangers and learn nothing about any of them.",
    whatWorked: [
      "New York specificity — stops, times, the particular culture of each subway line — is deeply researched",
      "Each paragraph profiles a different daily commuter, building a portrait of the city through its riders",
      "The writing itself performs the observation it describes — the applicant watches the way a writer watches",
      "Connects to sociology and urban studies without ever naming those fields"
    ],
    voiceType: "observational",
    spikeConnection: "Urban sociology and creative writing — the essay demonstrated both the observational skill and the writing ability that defined the applicant's profile",
    structureType: "fragmented",
    strengthAxis: "place",
    approximateScore: 95,
    excerpt: `The Q train between Sheepshead Bay and Times Square takes forty-seven minutes, which is exactly long enough to fall in love with six strangers and learn nothing about any of them. I have been making this commute since freshman year, when my family moved from Midtown to Brighton Beach and I chose to keep attending my school in Manhattan rather than transfer. This was, in retrospect, a decision that cost me two hours a day and gave me an education that no classroom has matched.

The 7:14 a.m. Q has regulars. There is the woman in the green coat who reads romance novels and marks her place with a MetroCard. There is the man with the saxophone case who gets on at Prospect Park and always sits in the same seat — third car, left side, facing forward — as if the subway owes him a reservation. There is the teenager who does her calculus homework on her lap, using a textbook as a desk, erasing with such ferocity that a small cloud of pink dust follows her off the train at DeKalb.

I know none of their names. I know the rhythm of their mornings. This distinction — between knowing someone and knowing about someone — is, I think, the fundamental condition of city life. We are surrounded by stories we will never hear, narrated by people who will never know we are listening. The Q train is a novel with seven million characters and no plot, and I have read it every morning for four years.`,
    counselorNote: "The romance novel woman, the saxophone man, the calculus teenager — each one is rendered in a single, perfect image. This essay is about attention itself. The applicant sees what most people scroll past, and the writing matches the seeing. The final metaphor (a novel with seven million characters and no plot) is publishable prose."
  },
  {
    school: "Harvard",
    year: 2023,
    promptType: "common-app-7",
    topic: "An ode to the family spreadsheet that tracks everything from groceries to emotions",
    openingLine: "My family runs on a Google spreadsheet with fourteen tabs, and the tab labeled 'Feelings' is by far the most useful.",
    whatWorked: [
      "The spreadsheet is simultaneously absurd and deeply functional — the essay lives in that tension",
      "Each tab reveals something about the family: their practicality, their immigrant pragmatism, their love expressed through organization",
      "The 'Feelings' tab — where family members log emotional states with numerical scores — is genuinely moving",
      "Shows the applicant's analytical mind applied to the most intimate domain: family"
    ],
    voiceType: "observational",
    spikeConnection: "Data science and behavioral psychology — the spreadsheet was literally a family data project",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 93,
    excerpt: `My family runs on a Google spreadsheet with fourteen tabs, and the tab labeled "Feelings" is by far the most useful. My mother, who emigrated from Vietnam in 1998 and has approached American life with the organizational intensity of a military logistics officer, created the spreadsheet when I was in sixth grade. The original tabs were practical: Groceries, Bills, Appointments, Chores. Then my father added Weather Forecasts, because he is a man who likes to be prepared for conditions he cannot control. Then my sister added Homework Deadlines. Then I added a tab called What We're Reading, which nobody used except me.

The Feelings tab was my mother's idea, and it arrived without fanfare in the spring of eighth grade, after what she calls "the quiet year" — the year my father lost his job, my sister stopped eating lunch, and I started sleeping through first period. We were not a family that talked about emotions. We were a family that tracked inventory levels of dish soap. The Feelings tab was my mother's way of bridging the gap: each family member logs a 1-to-10 rating of their day, with an optional comment field.

This sounds clinical. It is clinical. It is also the most intimate document in my family's life. When my sister typed "3 — bad day, don't want to talk about it," my mother did not knock on her door. She typed back: "3 — worried about you, here when you're ready." The spreadsheet became a buffer zone — a place where feelings could exist as data before they had to exist as conversation. My father, who has never once told me he is proud of me out loud, has typed it fourteen times in the comment field, and I have read every one.`,
    counselorNote: "The Feelings tab is one of the most original conceits I've seen in an essay. It captures a family's emotional culture — the inability to talk directly, the immigrant pragmatism, the love expressed through systems — in a way that is both funny and heartbreaking. The father typing 'proud' fourteen times is the essay's emotional climax, and it works because the whole essay has been building toward it."
  },
  {
    school: "Dartmouth",
    year: 2024,
    promptType: "common-app-7",
    topic: "What the applicant's dentist has taught them about trust",
    openingLine: "Dr. Nguyen has been inside my mouth more often than any other human being, and she knows me better than most of my friends.",
    whatWorked: [
      "The intimacy of dentistry — trusting someone with sharp tools inside your body — is explored as a genuine philosophical topic",
      "Dr. Nguyen is a character: her running commentary, her opinions, her relationship to the applicant over years",
      "The essay uses the dental chair as a site of unexpected reflection and vulnerability",
      "Connects to broader themes of trust, physical vulnerability, and the relationships we overlook"
    ],
    voiceType: "observational",
    spikeConnection: "Pre-med with interest in patient-provider relationships — the essay showed the applicant thinking about medicine as a human interaction, not just a science",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 88,
    excerpt: `Dr. Nguyen has been inside my mouth more often than any other human being, and she knows me better than most of my friends. She has seen me cry (wisdom teeth, age sixteen), bleed (braces adjustment, age twelve), and lie ("Yes, I floss every day," age every). She has held my jaw open with one hand while narrating the landscape of my molars with the other, and I have stared at the ceiling and thought about what it means to trust a person this much while knowing almost nothing about them.

I have been seeing Dr. Nguyen since I was eight. In that time, she has performed two fillings, one extraction, three years of orthodontia, and approximately forty cleanings. She knows the geography of my mouth the way a cartographer knows a coastline — every ridge, every gap, every place where the terrain has shifted since the last survey. She remembers that my left canine came in late. She remembers that I bit through my retainer during a particularly stressful finals week. She remembers things about my body that I have forgotten.

What strikes me most about this relationship is its asymmetry. I trust Dr. Nguyen with sharp instruments and my nervous system, but I could not tell you where she went to dental school, whether she has children, or what she does on weekends. She is, in my life, a function rather than a person — someone who performs a service and disappears. I have started to wonder how many relationships like this I maintain: deep in intimacy, shallow in knowledge. The barber, the doctor, the bus driver who has driven me to school every day for four years. We trust them with our bodies and never learn their last names.`,
    counselorNote: "The dentist's chair as a site of philosophical inquiry — this shouldn't work, and it does. The essay is really about the invisible trust relationships that structure daily life, and the dentist is just the most vivid example. The line about the retainer during finals week is the kind of small, true detail that makes the whole essay feel real."
  },
  {
    school: "Stanford",
    year: 2024,
    promptType: "common-app-7",
    topic: "An essay about silence — specifically the different types of silence in the applicant's life",
    openingLine: "There are at least eleven kinds of silence, and I have cataloged them the way a sommelier catalogs wine — by texture, by duration, by what they leave behind.",
    whatWorked: [
      "The cataloging conceit is original and gives the essay clear structure",
      "Each type of silence is tied to a specific memory or relationship, grounding abstraction in experience",
      "The writing itself is quiet — short sentences, white space, a rhythm that enacts its subject",
      "Shows the applicant as someone who pays attention to absence, not just presence"
    ],
    voiceType: "poetic",
    spikeConnection: "Music composition and sound design — the essay connected the applicant's artistic practice to their way of being in the world",
    structureType: "fragmented",
    strengthAxis: "detail",
    approximateScore: 96,
    excerpt: `There are at least eleven kinds of silence, and I have cataloged them the way a sommelier catalogs wine — by texture, by duration, by what they leave behind. The silence after a thunderclap is not the same as the silence after a confession. The silence of an empty house is not the same as the silence of a house where someone is sleeping. I have been collecting silences since I was small, pressing them between the pages of my memory like dried flowers, because no one else seemed to notice they were there.

Type one: the silence of my mother driving. She does not play music. She does not call people. She drives in a silence so complete that you can hear the car thinking. I have asked her what she thinks about during these drives, and she said, "Nothing," which I do not believe, because her silences have a quality of weight — they press against the windows like something alive.

Type four: the silence of the orchestra pit, the half-second between the conductor's raised baton and the first note. I play oboe, and in that half-second, I am more alert than at any other moment in my life. Every muscle is ready. Every breath is measured. It is the silence of potential energy — the instant before the conversion. I live for this silence. It is the closest thing I know to prayer.

Type seven: the silence after my grandfather stopped recognizing my name. Not a forgetting silence — a replacing silence. Something where my name used to be, now filled with a kind of gentle static.`,
    counselorNote: "This is one of the finest essays I have ever read. The cataloging structure could feel gimmicky, but the silences are so precisely described that each one becomes its own tiny essay. The mother driving, the orchestra pit, the grandfather — each silence is a relationship rendered in negative space. The writing is genuinely beautiful. This is what a 96 looks like."
  },
  {
    school: "UPenn",
    year: 2026,
    promptType: "common-app-7",
    topic: "Why the applicant has worn the same pair of shoes for three years",
    openingLine: "These are Nike Air Monarch IVs, size 10.5, purchased for $64.99 from the outlet mall on Route 30, and they are the most honest thing I own.",
    whatWorked: [
      "A consumer object becomes a lens for thinking about authenticity, class, and fashion as performance",
      "The specificity (model, size, price, location) establishes the applicant's respect for material reality",
      "Uses the shoes to navigate class dynamics at a school where sneaker culture is currency",
      "Shows independence of thought without performing nonconformity"
    ],
    voiceType: "analytical",
    spikeConnection: "Marketing and consumer behavior interest — the essay showed how the applicant's personal habits reflect deeper thinking about why people buy things",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 87,
    excerpt: `These are Nike Air Monarch IVs, size 10.5, purchased for $64.99 from the outlet mall on Route 30, and they are the most honest thing I own. They are the shoe that your dad wears to mow the lawn. They are white, thick-soled, aggressively uncool, and built like a small tank. In the ecosystem of my high school, where a pair of limited-edition Jordans can determine your social altitude for an entire semester, my Monarchs are a declaration of either poverty or insanity. I prefer to think of them as a research project.

I started wearing them as an experiment in sophomore year, after reading an article about Thorstein Veblen's theory of conspicuous consumption. Veblen argued, in 1899, that people buy expensive things not for their function but for their ability to signal status. I looked at the sneaker wall in the mall, where shoes ranged from sixty-five dollars to four hundred, and I wondered: what happens if you opt out? What happens if you wear the shoe that signals nothing — or rather, signals a deliberate refusal to signal?

The answer is: people notice. They notice more than they would notice a pair of Jordans, because Jordans are expected. The Monarchs provoke confusion. "Are those ironic?" asks Marcus. "Are those your dad's?" asks Julia. "Are those comfortable?" asks exactly one person, my friend Dev, who is the only person asking the right question. They are, in fact, extraordinarily comfortable. This is the Monarch's secret advantage: freed from the obligation to look good, it is free to work well.`,
    counselorNote: "Veblen theory applied to high school sneaker culture — this is the kind of interdisciplinary thinking that admissions officers talk about at lunch. The essay's voice is wry and precise, and the Dev moment ('the only person asking the right question') is a perfect structural beat. The final observation — freed from looking good, free to work well — is a thesis for a life philosophy."
  },

  // ==========================================================================
  // SUPPLEMENT — "Why Us" Essays (8 different schools)
  // ==========================================================================
  {
    school: "MIT",
    year: 2025,
    promptType: "supplement-why-us",
    topic: "Why MIT — focused on the culture of building things and the interplay between engineering and art",
    openingLine: "I want to go to a school where someone has built a working pipe organ out of spare electronics parts, and that school is MIT.",
    whatWorked: [
      "Opens with a specific MIT hack/project that demonstrates genuine knowledge of the culture",
      "Connects the applicant's own maker projects to specific MIT labs and courses",
      "Shows understanding of MIT's collaborative culture, not just its prestige",
      "Names specific professors and their work without sounding like a brochure"
    ],
    voiceType: "narrative",
    spikeConnection: "Maker/engineer with an arts side — the essay showed why MIT's specific blend of technical rigor and creative culture was the right fit",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 91,
    excerpt: `I want to go to a school where someone has built a working pipe organ out of spare electronics parts, and that school is MIT. I first read about the Media Lab's Opera of the Future group three years ago, when I was trying to figure out why my homemade synthesizer kept producing a frequency that sounded like an angry cat. The answer involved impedance matching, which led me to a paper by Professor Tod Machover, which led me to Hyperinstruments, which led me to the realization that the thing I had been building alone in my garage — instruments that respond to gesture, touch, and proximity — already had a name and a research community.

What I want from MIT is not permission to build. I already build. What I want is collision — the productive kind that happens when an electrical engineer sits next to a musician sits next to a biologist and they realize that the problem they're each trying to solve is the same problem wearing different clothes. I have read about this in MIT's own materials, but I also heard it from my cousin Priya, who graduated from Course 6 in 2023 and told me that her best project — a sensor array for monitoring coral reef health — started as a late-night argument in a dorm kitchen about whether sonar or spectroscopy was a better proxy for ocean temperature.

I want to be in that kitchen. I want to bring my synthesizer and my questions about why certain frequencies make people feel calm and others make them feel anxious, and I want someone from the Brain and Cognitive Sciences department to tell me I'm approaching it wrong.`,
    counselorNote: "This is a why-us essay that actually demonstrates fit rather than declaring it. The homemade synthesizer, the impedance matching problem, the cousin's coral reef project — these details show the applicant has done real research and has real reasons to want MIT specifically. The 'tell me I'm approaching it wrong' ending shows intellectual humility."
  },
  {
    school: "Stanford",
    year: 2024,
    promptType: "supplement-why-us",
    topic: "Why Stanford — focused on the d.school and the applicant's obsession with redesigning everyday objects",
    openingLine: "The water fountain on the second floor of my high school is badly designed, and I have spent two years trying to convince someone in authority to let me fix it.",
    whatWorked: [
      "Grounds the essay in a concrete, relatable problem before connecting to Stanford",
      "Names specific d.school courses and design thinking methodology",
      "Shows understanding of Stanford's interdisciplinary ethos through the applicant's own cross-disciplinary interests",
      "The water fountain becomes a throughline — the essay returns to it at the end"
    ],
    voiceType: "analytical",
    spikeConnection: "Design thinking and product engineering — the essay connected personal frustrations with bad design to Stanford's specific programs",
    structureType: "circular",
    strengthAxis: "detail",
    approximateScore: 90,
    excerpt: `The water fountain on the second floor of my high school is badly designed, and I have spent two years trying to convince someone in authority to let me fix it. The button is too stiff for younger students. The arc is too low, so your mouth touches the spigot. The drain is too shallow, which means water pools on the floor. These are solvable problems, and the fact that they have persisted for what I estimate to be fifteen years fills me with a kind of productive rage.

Stanford's d.school calls this "design empathy" — the ability to see a broken system from the user's perspective and feel compelled to intervene. I have been practicing design empathy since before I knew it had a name. In my house, I have redesigned the spice rack (alphabetized with frequency-of-use weighting), the recycling system (color-coded bins with visual sorting guides), and the dog's water bowl (elevated platform to reduce back strain, because even dogs deserve ergonomics).

What draws me to Stanford is the belief that these instincts — to notice, to empathize, to prototype — deserve the same intellectual rigor as any traditional discipline. I want to take ME 216: Product Realization, where students build functional prototypes from raw materials. I want to work with Professor Larry Leifer's design research lab, which studies how teams collaborate during the design process. And I want to return, eventually, to the second floor of my high school with a water fountain that actually works.`,
    counselorNote: "The water fountain is a perfect 'why us' device — it establishes the applicant's design instincts before the essay ever mentions Stanford. The spice rack, recycling system, and dog bowl show that this is a genuine pattern of behavior, not a posed interest. Returning to the fountain at the end closes the loop beautifully."
  },
  {
    school: "Yale",
    year: 2025,
    promptType: "supplement-why-us",
    topic: "Why Yale — focused on the residential college system and the applicant's belief in learning across disciplines",
    openingLine: "I want to eat dinner with a philosophy major who disagrees with me about free will, and then walk across the courtyard and disagree with a physicist about the same thing.",
    whatWorked: [
      "The opening captures Yale's residential intellectual culture in a single image",
      "Connects the applicant's own cross-disciplinary interests (philosophy + neuroscience) to Yale's specific structure",
      "References specific Yale courses, professors, and programs without sounding like a catalog",
      "Shows why Yale and not any other school with similar programs"
    ],
    voiceType: "analytical",
    spikeConnection: "Philosophy and neuroscience double interest — Yale's Directed Studies and interdisciplinary programs were the perfect fit",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 89,
    excerpt: `I want to eat dinner with a philosophy major who disagrees with me about free will, and then walk across the courtyard and disagree with a physicist about the same thing. This is, as far as I can tell, a normal Tuesday at Yale, and it is exactly the kind of Tuesday I have been looking for.

My intellectual life has a problem that most high schools are not equipped to solve: I am interested in the intersection of two fields that rarely speak to each other. I want to understand consciousness — not as a philosophical abstraction and not as a neuroscientific mechanism, but as both, simultaneously, in the same room. At my high school, philosophy lives in the English hallway and neuroscience lives in the science wing, and they share a building but not a conversation.

Yale's Directed Studies program is where I want to start — not because I am certain about the Western canon, but because I want to argue with it properly, with primary sources and three semesters of structured disagreement. From there, I want to take Professor Laurie Santos's Psychology and the Good Life, not for the famous lectures but for the empirical framework she brings to questions that philosophy handles with thought experiments. And I want to take advantage of the residential college system because I believe the most important intellectual work happens not in classrooms but in dining halls, common rooms, and the accidental conversations that arise when you live among people who are studying things you would never have encountered on your own.`,
    counselorNote: "The opening line does everything a why-us essay needs to do: it names the specific culture the applicant wants, it shows intellectual personality, and it implicitly argues for fit. The 'accidental conversations' observation shows the applicant understands what makes Yale's residential system different from a university that simply has dorms."
  },
  {
    school: "Princeton",
    year: 2024,
    promptType: "supplement-why-us",
    topic: "Why Princeton — focused on the senior thesis tradition and the applicant's desire to produce original research",
    openingLine: "I want to spend a year answering a question that doesn't have an answer yet, and Princeton is the only school that requires every student to try.",
    whatWorked: [
      "The senior thesis requirement is used as a genuine differentiator, not a throwaway detail",
      "Shows the applicant already thinking about potential thesis topics — demonstrating commitment and preparation",
      "Connects to a specific professor whose work aligns with the applicant's interests",
      "Explains what 'original research' means to the applicant personally, not just academically"
    ],
    voiceType: "analytical",
    spikeConnection: "History research experience — the applicant had already done archival work and understood what sustained research requires",
    structureType: "chronological",
    strengthAxis: "detail",
    approximateScore: 90,
    excerpt: `I want to spend a year answering a question that doesn't have an answer yet, and Princeton is the only school that requires every student to try. The senior thesis is not why I'm applying — I would be dishonest to claim that a single requirement determines a four-year decision — but it is the clearest expression of something I have been looking for: a school that trusts its students to produce knowledge, not just consume it.

I have a question. It's not fully formed yet, which I think is the appropriate state for a question worth spending a year on. It lives at the intersection of environmental history and Indigenous land management: specifically, whether controlled burning practices used by Native communities in the Great Plains for thousands of years can inform modern wildfire prevention strategies. I have read Professor Alison Isenberg's work on American land use, and I have read enough fire ecology papers to know that the question is both scientifically and historically complex. I want to learn enough to ask it properly.

What draws me to Princeton is the infrastructure for this kind of work: Mudd Manuscript Library, the Program in American Studies, the Environmental Institute's funding for undergraduate research. But more than infrastructure, what draws me is the expectation. Every Princeton student writes a thesis. This means the culture is built around it — around the idea that eighteen-year-olds are capable of original thought, if you give them the right tools and the right time.`,
    counselorNote: "This is a why-us essay that does exactly what the best ones do: it shows the applicant has a specific intellectual project that requires this specific institution. The controlled burning question is concrete enough to be credible and open enough to develop. The distinction between infrastructure and expectation in the final paragraph shows real understanding of what makes Princeton different."
  },
  {
    school: "University of Chicago",
    year: 2023,
    promptType: "supplement-why-us",
    topic: "Why UChicago — focused on the Core Curriculum and the applicant's contrarian belief that required courses are liberating",
    openingLine: "Everyone I know wants to escape requirements, and I want to surrender to them — which is either deeply wise or deeply troubled, and I suspect UChicago can help me figure out which.",
    whatWorked: [
      "The contrarian position (requirements as liberation) perfectly matches UChicago's intellectual identity",
      "Shows understanding of the Core's philosophy, not just its course list",
      "The voice is witty and self-aware — matching the tone of UChicago's own admissions materials",
      "Specific Hum and Sosc sequences are named with genuine enthusiasm"
    ],
    voiceType: "analytical",
    spikeConnection: "Interdisciplinary thinker who resisted early specialization — UChicago's Core was genuinely the best fit for this intellectual profile",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 92,
    excerpt: `Everyone I know wants to escape requirements, and I want to surrender to them — which is either deeply wise or deeply troubled, and I suspect UChicago can help me figure out which. The Core Curriculum is the reason I am applying. Not one reason among many. The reason. I want to read Aristotle because someone told me I have to, and I want that someone to be a professor who has spent thirty years thinking about why Aristotle still matters, not a guidance counselor who says "it looks good on your transcript."

I have a theory about requirements: they force you to encounter things you would never choose, and the things you would never choose are the things most likely to change you. Left to my own devices, I would read only history and political theory. I would never take a physics course. I would never read Toni Morrison. I would construct, semester by semester, a perfectly comfortable echo chamber of my existing interests. The Core prevents this, and I am grateful in advance for the prevention.

Specifically, I am drawn to the Social Sciences Core — particularly Self, Culture, and Society — because it promises the kind of intellectual discomfort that I actively seek: the experience of reading Durkheim and Foucault and Weber in the same quarter and being forced to figure out why they disagree and which disagreement matters most. I do not want a curriculum that confirms what I already think. I want one that dismantles it and makes me rebuild.`,
    counselorNote: "This is the rare why-us essay that articulates a genuine educational philosophy, not just a list of appealing features. The 'echo chamber' argument for the Core is intellectually honest and shows the applicant understands what they don't know — which is exactly the disposition UChicago's admissions committee looks for."
  },
  {
    school: "Rice",
    year: 2025,
    promptType: "supplement-why-us",
    topic: "Why Rice — focused on the residential college system, Houston's diversity, and engineering with a humanities heart",
    openingLine: "I want to live in a place where my mechanical engineering problem set and my poetry workshop happen in the same building, ideally within walking distance of the best pho in Texas.",
    whatWorked: [
      "The pho reference is specific to Houston and shows genuine interest in the city, not just the campus",
      "Residential college system is discussed with understanding of how it shapes daily life",
      "Connects engineering and humanities interests to specific Rice programs (HUMA, ENGI courses)",
      "The tone matches Rice's culture: warm, collaborative, slightly irreverent"
    ],
    voiceType: "narrative",
    spikeConnection: "Engineering student with serious humanities interests — Rice's flexible curriculum and intimate residential system were uniquely suited",
    structureType: "thematic",
    strengthAxis: "place",
    approximateScore: 88,
    excerpt: `I want to live in a place where my mechanical engineering problem set and my poetry workshop happen in the same building, ideally within walking distance of the best pho in Texas. Rice is the only school I've found where this sentence is not a contradiction but a course schedule.

I have visited campus twice. The first time, I sat in on a MECH 210 lecture and then walked to Fondren Library, where a student was reading Rilke at a table covered in circuit diagrams. I asked her what she was studying. "Both," she said, as if the question were strange. At most schools, it would be. At Rice, it seemed like the only sane answer.

Houston matters to me as much as Rice does. I grew up in a small town where "diversity" meant the new family from two counties over. Houston is the most ethnically diverse city in America, and it is also the energy capital, the medical capital, and (according to my research) the city with the highest density of excellent, inexpensive restaurants per square mile. I want to study engineering in a city that is itself an engineering project — a sprawling, improbable, air-conditioned experiment in what happens when you build a metropolis on a swamp and fill it with people from everywhere.

Rice's residential college system is the final piece. I have read that O-Week assigns you to a college where you live for four years, eat most of your meals, and build the kind of relationships that survive graduation. I want that continuity. I want the student who reads Rilke with circuit diagrams to be someone I see at breakfast for four years, not someone I pass once in a lecture hall.`,
    counselorNote: "The Rilke-and-circuit-diagrams student is the essay's defining image, and it does more for the 'why Rice' argument than any statistic could. The Houston section shows the applicant has thought about the city, not just the campus. The O-Week detail at the end signals that the applicant has done genuine research into Rice's social infrastructure."
  },
  {
    school: "Northwestern",
    year: 2024,
    promptType: "supplement-why-us",
    topic: "Why Northwestern — focused on the Medill School of Journalism and the intersection of data and storytelling",
    openingLine: "I want to learn how to make a spreadsheet cry, which is my way of saying I want to combine data journalism with narrative craft, and Northwestern is where these things already coexist.",
    whatWorked: [
      "The 'spreadsheet cry' image is memorable and perfectly captures the data-narrative intersection",
      "Names specific Medill courses and the Knight Lab with genuine understanding of what they do",
      "Connects the applicant's own journalism experience (school paper, data projects) to Northwestern's resources",
      "Shows awareness of journalism's evolution without being cynical about the profession"
    ],
    voiceType: "observational",
    spikeConnection: "Data journalism experience with school paper and independent projects — Northwestern's Medill was the obvious and genuine fit",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 89,
    excerpt: `I want to learn how to make a spreadsheet cry, which is my way of saying I want to combine data journalism with narrative craft, and Northwestern is where these things already coexist. At my school paper, I am the person who builds the databases and the person who writes the stories, and I have learned that these two skills — analysis and empathy — are not opposites. They are collaborators. A dataset about school suspension rates becomes a different kind of story when you can also write the paragraph about the kid who was suspended three times in one semester and what that did to his relationship with his mother.

Medill's data journalism sequence is where I want to develop this instinct into a method. I have read Professor Bui's work on visual data storytelling, and I have spent embarrassing amounts of time on the Knight Lab's open-source tools — TimelineJS in particular, which I used to build an interactive history of gerrymandering in my state for a class project that my teacher described as "ambitious and slightly obsessive," which I took as a compliment.

What I cannot get anywhere else is Medill's specific combination of technical training and ethical seriousness. I want to learn scraping and statistical analysis, but I also want to sit in a classroom where someone makes me think about what data I'm choosing not to collect, whose story the dataset excludes, and whether the visualization I've built is revealing truth or manufacturing it.`,
    counselorNote: "The opening line is one of the best I've seen for a why-us essay — it's memorable, specific, and conceptually precise. The suspension-rate example perfectly demonstrates what the applicant means by combining data and narrative. The ethical dimension in the final paragraph shows sophistication beyond 'I want to be a journalist.'"
  },
  {
    school: "Tufts",
    year: 2026,
    promptType: "supplement-why-us",
    topic: "Why Tufts — focused on civic engagement, international relations, and the Experimental College",
    openingLine: "I want to take a class taught by a student, which sounds like a paradox until you learn about Tufts' Experimental College, where it is Tuesday.",
    whatWorked: [
      "The ExCollege reference shows genuine, deep research into Tufts' unique offerings",
      "Connects civic engagement work (local organizing) to Tufts' institutional commitment to active citizenship",
      "The Fletcher School and IR program are mentioned with specificity about research interests",
      "Captures Tufts' identity as a school that values doing, not just studying"
    ],
    voiceType: "narrative",
    spikeConnection: "Model UN, local government internship, and international affairs interest — Tufts' specific programs and culture aligned perfectly",
    structureType: "thematic",
    strengthAxis: "detail",
    approximateScore: 87,
    excerpt: `I want to take a class taught by a student, which sounds like a paradox until you learn about Tufts' Experimental College, where it is Tuesday. The ExCollege lets undergraduates design and teach their own courses, and this single policy tells me more about Tufts' educational philosophy than any mission statement. It says: we believe students have expertise worth sharing, not just assignments worth grading. That belief is rare, and I want to be in a place that takes it seriously.

My interest in Tufts is rooted in a question I've been carrying since I interned at my city council's office last summer: how do local decisions connect to global systems? When our council debated a zoning variance for a refugee resettlement organization, I watched municipal politics and international displacement intersect in a room with fluorescent lighting and bad coffee. The decision affected twelve families from three countries. The council members who voted had never left the state.

Tufts is the school where I can study this intersection formally. The International Relations program, with its proximity to the Fletcher School, offers the kind of rigorous training in diplomatic theory that I want — but the Tisch College of Civic Life is what makes Tufts different. I don't want to study citizenship from a textbook. I want to practice it while I'm studying it. The Tisch Scholars program, which embeds civic engagement into the curriculum, is exactly this: theory and practice in the same semester, in the same student.`,
    counselorNote: "The ExCollege opening is smart because it immediately signals deep research. The city council scene — municipal politics and refugee resettlement colliding — is the essay's strongest moment because it shows the applicant has already experienced the kind of intersection they want to study. This is a why-us essay that is also a statement of intellectual purpose."
  },

  // ==========================================================================
  // SUPPLEMENT — "Community" Essays (3)
  // ==========================================================================
  {
    school: "MIT",
    year: 2024,
    promptType: "supplement-community",
    topic: "The community of late-night contributors to a niche open-source software project",
    openingLine: "My community meets at midnight, speaks in pull requests, and has never seen each other's faces.",
    whatWorked: [
      "Redefines 'community' beyond physical proximity — this is a community of practice and shared purpose",
      "Specific details about the project (accessibility tools) and the contributors (time zones, backgrounds) make it real",
      "Shows how the applicant contributes: code reviews, documentation, mentoring new contributors",
      "Addresses the emotional reality of online community — the trust, the conflicts, the inside jokes"
    ],
    voiceType: "narrative",
    spikeConnection: "Open-source software development and accessibility technology — the community essay was also a demonstration of technical and interpersonal skills",
    structureType: "thematic",
    strengthAxis: "surprise",
    approximateScore: 90,
    excerpt: `My community meets at midnight, speaks in pull requests, and has never seen each other's faces. We are the maintainers of AccessKit, an open-source library that helps developers build screen-reader-compatible interfaces. There are fourteen of us, spread across eight time zones, ranging in age from sixteen (me) to forty-seven (Björn, a software architect in Gothenburg who types in all lowercase and once merged a pull request with the comment "this is adequate," which from Björn is a standing ovation).

I found AccessKit the way you find most open-source projects: by needing something that didn't exist yet. I was building a study app for my visually impaired neighbor, Mrs. Chen, and the existing tools for making interfaces accessible were either too complicated or too limited. AccessKit was somewhere in between — imperfect but improvable — and the README said "contributions welcome," which I have learned is open-source code for "we are drowning and we need help."

I submitted my first pull request at 1 a.m. on a school night. Björn reviewed it within an hour. He suggested three changes, explained why, and ended with "good first contribution." That was it. No interview, no application, no credential check. Just code and feedback and the implicit agreement that we were all here because we believed that software should be usable by everyone, not just everyone who can see.`,
    counselorNote: "The Björn detail ('this is adequate' as a standing ovation) is the essay's signature — it shows the applicant understands the culture of the community, not just its function. Redefining community through open-source contribution is a strong move for MIT, where collaborative building is central to the culture."
  },
  {
    school: "Stanford",
    year: 2025,
    promptType: "supplement-community",
    topic: "The community of regulars at a 24-hour laundromat",
    openingLine: "The Clean Machine on Birch Street is the most honest room in town, because no one goes to a laundromat to impress anyone.",
    whatWorked: [
      "The laundromat is vividly rendered — the machines, the vending machine, the plastic chairs",
      "Profiles three regulars with specificity and affection, creating a cast of characters in miniature",
      "The 'no one goes to impress anyone' thesis is carried through the whole essay",
      "Shows the applicant as part of the community, not an observer of it"
    ],
    voiceType: "observational",
    spikeConnection: "Sociology and community studies — the essay demonstrated the applicant's eye for social dynamics in unlikely places",
    structureType: "fragmented",
    strengthAxis: "place",
    approximateScore: 89,
    excerpt: `The Clean Machine on Birch Street is the most honest room in town, because no one goes to a laundromat to impress anyone. You go because your clothes are dirty and your apartment doesn't have a washer, and you sit in a plastic chair under fluorescent lights and watch your socks tumble in a circle and wait. In this waiting, something happens that does not happen at school or work or church: people talk to each other without agenda.

Mr. Delgado comes every Sunday at 7 a.m. with three garbage bags of laundry and a portable radio tuned to a station that plays only mariachi. He knows the spin cycle of every machine by heart and will warn you, unprompted, that machine twelve runs hot and machine six eats quarters. He has been coming to the Clean Machine for twenty-two years — longer than I have been alive — and he refers to the owner, who he has never met, as "my landlord," because "she has a key to my clothes."

Then there is the woman I call the Professor, because she reads academic journals while her whites are bleaching. She is actually a postal worker, but she reads sociology papers the way other people read magazines — casually, with a highlighter, one eye on the dryer timer. I asked her once what she was reading. "Erving Goffman," she said. "He wrote about how people perform for each other in public spaces." She looked around the laundromat. "This would have driven him crazy. Nobody's performing in here."`,
    counselorNote: "Mr. Delgado's 'she has a key to my clothes' is the kind of line that makes admissions readers laugh out loud. The postal-worker-reading-Goffman is structurally brilliant — the essay becomes self-referential (observing a community while reading about how communities are observed) without being pretentious. This is a community essay that actually describes a community, which is rarer than it should be."
  },
  {
    school: "Brown",
    year: 2024,
    promptType: "supplement-community",
    topic: "Being part of a grief support group for teenagers who lost siblings",
    openingLine: "We meet on the third Wednesday of every month in the basement of a church I don't attend, and we are the saddest, funniest group of people I know.",
    whatWorked: [
      "The 'saddest, funniest' juxtaposition establishes the emotional complexity immediately",
      "Shows the group's humor as a real, important part of grieving — not gallows humor but survival humor",
      "Individual members are described with warmth and specificity without exploiting their grief",
      "The applicant reflects on what they've received from the group, not just what they've contributed"
    ],
    voiceType: "confessional",
    spikeConnection: "Psychology and counseling interest — the group was the personal foundation for the academic direction",
    structureType: "circular",
    strengthAxis: "vulnerability",
    approximateScore: 93,
    excerpt: `We meet on the third Wednesday of every month in the basement of a church I don't attend, and we are the saddest, funniest group of people I know. There are seven of us, ages fifteen to eighteen, and we have all lost a sibling. This is the only thing we have in common, and it is everything. The group has a formal name — Youth Bereavement Circle — but we call ourselves "The Club," because dark humor is the first language of grief and because calling it a club makes it sound like something we chose, which is better than what it is: something that chose us.

Here is what I have learned from The Club: grief is not linear, it is not poetic, and it does not make you a better person. Grief is random. It arrives in the cereal aisle when you see your brother's favorite brand. It arrives during a calculus test when you realize he would have been a senior this year. It arrives and it leaves and it arrives again, and the only people who understand this rhythm are the people sitting in the folding chairs next to you.

Tomás lost his sister to leukemia. He deals with this by making the worst jokes I have ever heard, and we love him for it, because the alternative is a room where everyone is gentle and no one is real. Anya lost her brother in a car accident. She brings cookies every meeting — always the same kind, always burnt on the bottom — and once said, "I bake when I'm sad, which means I bake a lot, which means you'd think I'd be better at it." We laughed for three straight minutes. The facilitator, Ms. Ramos, let us.`,
    counselorNote: "The burnt cookies, Tomás's jokes, the cereal aisle — this essay renders grief with specificity and honesty that most adults cannot achieve. It refuses to sanitize the experience, and that refusal is exactly what makes it trustworthy. The applicant shows the group as a real community — messy, funny, necessary — rather than a service they provide. This is empathy in practice."
  },
  // ==========================================================================
  // EXPANDED SCHOOL COVERAGE (80+ schools)
  // ==========================================================================
  { school: "Penn", year: 2024, promptType: "supplement-why-us", topic: "Why Penn — connecting Wharton's social impact initiative to personal microfinance experience", openingLine: "I have lent $47 to fourteen people, and twelve of them paid me back.", whatWorked: ["Opens with a specific, unexpected financial detail", "Names Wharton Social Impact Initiative and BEAKER program specifically", "Connects personal lending to microfinance theory"], voiceType: "analytical", spikeConnection: "Microfinance club founder — essay connects personal lending to Wharton's approach", structureType: "thematic", strengthAxis: "detail", approximateScore: 88, excerpt: `I have lent $47 to fourteen people, and twelve of them paid me back. Not because I run a bank — I run a lunch table. Junior year, when the cafeteria switched to a cashless system, three of my friends couldn't eat for a week because their families hadn't set up the app. So I started keeping $20 in my backpack. Then $40. Then I started tracking repayments in a spreadsheet because my math teacher said that's what banks do.\n\nPenn's Wharton Social Impact Initiative isn't what drew me — it's what named the thing I'd been doing. Professor Bettinger's research on financial inclusion describes exactly what happened at my lunch table: the gap between having money and having access. The BEAKER lab lets undergrads test interventions in real communities. I want to test whether micro-lending works differently when the lender and borrower share a hallway.`, counselorNote: "This essay succeeds because it starts small ($47) and builds to an academic framework without ever feeling forced. The lunch table lending is memorable and specific. The Penn supplements are most lethal when they name professors, programs, and courses — this names three." },
  { school: "UChicago", year: 2024, promptType: "uchicago-extended", topic: "UChicago's famous 'uncommon' essay — on the word 'almost'", openingLine: "Almost is the most violent word in English.", whatWorked: ["Takes a common word and reveals its hidden weight", "Uses 'almost' across scales — personal, historical, mathematical", "Shows intellectual playfulness UChicago is famous for"], voiceType: "analytical", spikeConnection: "Philosophy + math double major — essay demonstrates interdisciplinary thinking", structureType: "thematic", strengthAxis: "surprise", approximateScore: 92, excerpt: `Almost is the most violent word in English. My grandmother almost made it out of Saigon before the fall. The Titanic almost turned in time. I almost told my best friend I was in love with her before she moved to Portland.\n\n"Almost" contains an entire alternate universe compressed into six letters. Mathematically, it is the concept of a limit — approaching but never arriving. The function f(x) = 1/x almost reaches zero but never does, and that "never" is where calculus lives. In history, "almost" is where the interesting questions live too. The assassination that almost didn't happen. The vote that almost went the other way.\n\nI collect almosts the way other people collect stamps. My notebook has 340 entries. Entry #7: I almost chose violin over piano at age six. Entry #203: The Cuban Missile Crisis almost ended everything. Entry #340: I almost didn't apply to UChicago because the essays scared me.`, counselorNote: "This is what UChicago wants — a student who takes an intellectual risk and sustains it. The 340-entry notebook is either real or brilliantly invented. The grandmother/Titanic/best-friend triptych in the opening covers personal, historical, and emotional range in three sentences. The calculus connection is earned, not forced." },
  { school: "Notre Dame", year: 2024, promptType: "supplement-community", topic: "How family Sunday dinners built a community philosophy", openingLine: "Seventeen chairs around a table built for twelve.", whatWorked: ["Immediate visual of a crowded, warm scene", "Uses the dinner table as a metaphor for community without stating it", "Connects to Notre Dame's community values organically"], voiceType: "narrative", spikeConnection: "Community organizing — essay shows that community starts at the smallest scale", structureType: "chronological", strengthAxis: "place", approximateScore: 85, excerpt: `Seventeen chairs around a table built for twelve. Every Sunday at my grandmother's house in South Bend, the math doesn't work and nobody cares. My aunt brings a chair from the porch. My cousin sits on a cooler. The youngest kids eat on the floor and think it's a privilege.\n\nThe food is never enough and always enough — a contradiction that only makes sense if you've watched my grandmother stretch a pot of arroz con pollo to feed whoever shows up. She doesn't ask how many are coming. She just cooks. "If they're here, they eat," she says, as if hospitality were a law of physics rather than a choice.`, counselorNote: "Notre Dame's community question gets thousands of 'I volunteered at X' responses. This essay stands out because it locates community in a kitchen, not an organization. The 'seventeen chairs for twelve' opening is visually immediate. The grandmother's philosophy — 'if they're here, they eat' — is the essay's thesis, delivered as dialogue rather than argument." },
  { school: "WashU", year: 2024, promptType: "supplement-why-us", topic: "Why WashU — connecting public health research to the Gephardt Institute", openingLine: "The zip code you're born in predicts your life expectancy better than your genes do.", whatWorked: ["Opens with a provocative, data-backed claim", "Names the Gephardt Institute and specific faculty research", "Shows how personal experience in St. Louis connects to academic interest"], voiceType: "analytical", spikeConnection: "Public health research — essay bridges data science to community health", structureType: "thematic", strengthAxis: "detail", approximateScore: 86, excerpt: `The zip code you're born in predicts your life expectancy better than your genes do. I learned this in a WashU public health webinar, and it confirmed something I'd suspected since I mapped asthma rates across St. Louis County for a school project: the line between the north side and the south side isn't just cultural — it's biological.\n\nThe Gephardt Institute's community-engaged research model is why WashU is my first choice. Professor Purnell's work on health equity in North St. Louis does exactly what I want to do: take academic research out of the journal and into the neighborhood. I don't want to study health disparities from a lecture hall. I want to knock on doors.`, counselorNote: "This supplement names the Gephardt Institute, a specific professor, and a specific research area. The zip-code opening is provocative and data-driven. The personal mapping project bridges school experience to WashU's resources. 'Knock on doors' ending is active and specific." },
  { school: "Emory", year: 2024, promptType: "supplement-why-us", topic: "Why Emory — connecting CDC proximity to epidemiology interest", openingLine: "The CDC is four miles from Emory's campus, and I've been counting the distance since I was fourteen.", whatWorked: ["Opens with a geographic fact that doubles as emotional yearning", "Names specific Emory programs (Global Health Institute, Rollins School)", "Connects COVID contact tracing experience to academic ambition"], voiceType: "narrative", spikeConnection: "Public health advocacy — essay shows how proximity to CDC drives academic passion", structureType: "chronological", strengthAxis: "place", approximateScore: 84, excerpt: `The CDC is four miles from Emory's campus, and I've been counting the distance since I was fourteen. That was the year I spent my summer tracing COVID contacts for the county health department, calling strangers to tell them they'd been exposed, and learning that public health is less about data and more about trust.\n\nEmory's Global Health Institute doesn't just study epidemics — it deploys to them. The Rollins School's field practicum sends students to the exact communities where diseases spread. I want to be in those communities, not reading about them. Four miles from the CDC isn't a commute. It's a calling.`, counselorNote: "Emory supplements work best when they connect the CDC proximity to personal experience. This applicant earned the CDC reference through real contact tracing work. 'Four miles isn't a commute, it's a calling' is a strong closing that shows genuine motivation." },
  { school: "USC", year: 2024, promptType: "supplement-why-us", topic: "Why USC Marshall — connecting social media agency to entrepreneurship curriculum", openingLine: "I made my first $1,000 from a TikTok about sourdough bread.", whatWorked: ["Opens with an unexpected, memorable detail", "Names Marshall's Lloyd Greif Center for Entrepreneurial Studies", "Connects real revenue to academic framework"], voiceType: "narrative", spikeConnection: "Social media marketing agency founder — essay bridges business success to Marshall's entrepreneurship focus", structureType: "chronological", strengthAxis: "detail", approximateScore: 83, excerpt: `I made my first $1,000 from a TikTok about sourdough bread. Not because I'm a baker — because I filmed a bakery owner in my neighborhood who'd been making sourdough for 30 years and nobody knew about it. The video got 200K views. She sold out for two weeks. I charged her nothing. Then I charged the next client $500.\n\nMarshall's Lloyd Greif Center doesn't teach entrepreneurship as theory — it runs a venture fund. I want to bring my agency into that ecosystem, pressure-test my pricing model against Greif's mentors, and learn whether what works on TikTok scales to a business that outlasts an algorithm.`, counselorNote: "USC Marshall values real business experience. This essay delivers: actual revenue, a real client, and a scaling question. The sourdough story is charming and specific. Naming the Greif Center shows genuine research." },
  { school: "CMU", year: 2024, promptType: "supplement-why-us", topic: "Why CMU — connecting accessible design work to Human-Computer Interaction Institute", openingLine: "The best interface I ever designed was invisible.", whatWorked: ["Paradox opening grabs attention", "Names CMU's HCI Institute and specific research areas", "Connects personal accessible design work to academic goals"], voiceType: "analytical", spikeConnection: "Accessibility design — essay connects design philosophy to CMU's HCI program", structureType: "thematic", strengthAxis: "surprise", approximateScore: 87, excerpt: `The best interface I ever designed was invisible. It was a screen reader navigation system for a blind nonprofit director who told me, "I don't want to know your design exists. I just want to do my job." That sentence rewired how I think about technology.\n\nCMU's Human-Computer Interaction Institute studies exactly this: the space between humans and machines, and how to make that space disappear. Professor Bigham's work on accessibility at scale — making AI systems that adapt to individual disabilities — is the research I want to contribute to. Not designing beautiful things. Designing things that work so well they become invisible.`, counselorNote: "CMU HCI is one of the most competitive programs. This essay works because it starts with a design philosophy (invisible = best) and connects it to a specific professor's research. The blind nonprofit director's quote is the essay's thesis, delivered by someone other than the writer." },
  { school: "NYU", year: 2024, promptType: "supplement-why-us", topic: "Why NYU Stern — connecting Queens street vendor documentary to business ethics", openingLine: "Every churro cart in Jackson Heights is a business school.", whatWorked: ["Provocative reframing of where business knowledge lives", "Names Stern's Social Impact Core and specific courses", "Shows NYC as integral to the education, not just the location"], voiceType: "observational", spikeConnection: "Documentary filmmaker — essay bridges artistic observation to business analysis", structureType: "thematic", strengthAxis: "place", approximateScore: 85, excerpt: `Every churro cart in Jackson Heights is a business school. Pricing strategy: $2 because the cart across the street charges $2.50 and the margin on masa is 80%. Location: outside the 7 train because foot traffic peaks at 5:47 PM. Marketing: the smell. No MBA required.\n\nStern's Social Impact Core asks students to study businesses that serve communities others ignore. I've been studying those businesses with a camera for three years. My documentary on immigrant street vendors didn't just tell their stories — it mapped their economics. Stern would give me the vocabulary for what I've been observing.`, counselorNote: "NYU Stern supplements need NYC specificity. This essay delivers: Jackson Heights, the 7 train, churro carts. Naming the Social Impact Core shows research. The pricing breakdown proves the applicant thinks like a business student already." },
  { school: "UC Berkeley", year: 2024, promptType: "uc-personal-insight", topic: "UC PIQ — describing a creative side (prompt 2)", openingLine: "I debug code the way my grandmother trims bonsai: one cut at a time, weeks apart.", whatWorked: ["Unexpected grandmother/coding parallel", "Specific bonsai details show real knowledge", "Connects patience in art to patience in engineering"], voiceType: "observational", spikeConnection: "CS applicant whose grandmother's bonsai garden taught patience in debugging", structureType: "thematic", strengthAxis: "surprise", approximateScore: 82, excerpt: `I debug code the way my grandmother trims bonsai: one cut at a time, weeks apart. She taught me that the worst mistake in bonsai is rushing — you can always cut more, but you can never put a branch back. The same is true of refactoring.\n\nHer garden in San Jose has 47 trees, each one shaped over decades. My GitHub has 23 repositories, each one shaped over semesters. She thinks my work is invisible. I think hers is the most elegant algorithm I've ever seen: input patience, output beauty, runtime fifty years.`, counselorNote: "UC PIQs need to show something personal that transcends the activity. The bonsai/debugging parallel is genuinely unexpected and sustained. 'Input patience, output beauty, runtime fifty years' is the kind of line that makes a reader pause." },
  { school: "UCLA", year: 2024, promptType: "uc-personal-insight", topic: "UC PIQ — significant challenge (prompt 5)", openingLine: "The first time I failed a test, I was eight, and it was a hearing test.", whatWorked: ["Reframes 'challenge' through an unexpected lens — hearing loss", "Specific audiologist office details", "Shows how accommodation became strength"], voiceType: "confessional", spikeConnection: "Hard-of-hearing student who developed lip-reading into a communication strength", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 84, excerpt: `The first time I failed a test, I was eight, and it was a hearing test. Dr. Okonkwo's office smelled like rubbing alcohol and had a poster of an ear the size of a door. She told my mother I had moderate sensorineural hearing loss in both ears. My mother cried. I asked if I could keep the headphones.\n\nBy high school, I'd developed what my speech therapist calls "compensatory genius" — I lip-read, I sit in the front row, I record every lecture. I notice things hearing people miss: the way someone's jaw tightens before they lie, the way a teacher's mouth moves differently when they're unsure of their own answer.`, counselorNote: "This PIQ takes a medical challenge and reframes it as a perceptual advantage. The specific details (Dr. Okonkwo, ear poster, headphones request) are memorable. The 'jaw tightens before they lie' observation shows that the hearing loss created a genuine perceptual skill, not just a hardship to overcome." },
  { school: "Michigan", year: 2024, promptType: "supplement-community", topic: "Michigan 'community' essay — high school robotics team as chosen family", openingLine: "Room 114 smells like solder and Red Bull and someone's forgotten lunch from Tuesday.", whatWorked: ["Immediate sensory immersion in a specific space", "Uses smell as the organizing sense (unusual)", "Shows community through shared discomfort, not shared triumph"], voiceType: "observational", spikeConnection: "Robotics team lead — essay shows community through the unglamorous hours, not the competitions", structureType: "in-media-res", strengthAxis: "place", approximateScore: 83, excerpt: `Room 114 smells like solder and Red Bull and someone's forgotten lunch from Tuesday. This is where my community lives — not at pep rallies, not at homecoming, but in a windowless room where seventeen people argue about gear ratios at 9 PM on a school night.\n\nI didn't choose robotics for the community. I chose it for the robots. But somewhere between the first prototype that caught fire (literally) and the third competition where we placed last, the people in Room 114 became the people I trust most. Community isn't built by winning together. It's built by losing together and showing up the next day anyway.`, counselorNote: "Michigan's community essay gets thousands of 'my diverse friend group' responses. This one stands out because it's honest about an unglamorous community. The solder/Red Bull/forgotten lunch opening is viscerally specific. 'Losing together and showing up the next day' is a better definition of community than most adults could write." },
  { school: "UNC Chapel Hill", year: 2024, promptType: "supplement-why-us", topic: "Why UNC — connecting environmental justice research to the Institute for the Environment", openingLine: "The hog farm is two miles from the elementary school, and nobody in Raleigh seems to notice.", whatWorked: ["Opens with a jarring geographic injustice", "Names UNC's Institute for the Environment and specific faculty", "Shows NC-specific knowledge that proves genuine interest"], voiceType: "analytical", spikeConnection: "Environmental justice advocacy — essay connects local NC issue to UNC's research mission", structureType: "thematic", strengthAxis: "detail", approximateScore: 82, excerpt: `The hog farm is two miles from the elementary school, and nobody in Raleigh seems to notice. I noticed because I mapped every concentrated animal feeding operation in Duplin County for a school project and realized that 78% of them are within three miles of a majority-Black or majority-Latino neighborhood. That is not a coincidence.\n\nUNC's Institute for the Environment studies exactly this intersection — where environmental science meets environmental justice. Professor Heaney's research on water contamination in hog-farming communities is the work I want to contribute to. Not from a textbook. From the county I grew up in.`, counselorNote: "UNC supplements need NC specificity. This essay delivers: Duplin County, hog farms, the 78% statistic. Naming Professor Heaney and the Institute for the Environment shows genuine research. The 'nobody in Raleigh seems to notice' opening establishes both the problem and the applicant's perspective." },
  { school: "Georgia Tech", year: 2024, promptType: "supplement-why-us", topic: "Why Georgia Tech — connecting EV conversion project to the EVERI Center", openingLine: "My pickup truck runs on electricity and spite.", whatWorked: ["Memorable, funny opening line", "Names GT's specific research center (EVERI)", "Connects hands-on project to academic research goals"], voiceType: "narrative", spikeConnection: "EV conversion builder — essay connects DIY engineering to GT's sustainable energy research", structureType: "chronological", strengthAxis: "surprise", approximateScore: 81, excerpt: `My pickup truck runs on electricity and spite. Spite because everyone said a 1994 Chevy couldn't be converted. Electricity because I proved them wrong over three months of welding, wiring, and watching YouTube videos at 2 AM.\n\nGeorgia Tech's EVERI Center researches electric vehicle systems at the scale I want to reach — not one truck in a garage, but fleets that change how a city moves. Professor Dougal's work on battery management systems is the missing piece in my truck's conversion: I got it to move, but I can't get it to move efficiently. GT would teach me the difference between working and working well.`, counselorNote: "GT supplements work when they connect personal engineering to GT's specific research. 'Electricity and spite' is one of the most memorable opening lines I've read. Naming EVERI and Professor Dougal shows research. The working/working well distinction shows engineering maturity." },
  { school: "Wake Forest", year: 2024, promptType: "supplement-why-us", topic: "Why Wake Forest — connecting voter registration to Pro Humanitate", openingLine: "I knocked on 300 doors and learned that democracy has a screen-door problem.", whatWorked: ["Unexpected 'screen-door problem' metaphor", "Connects to Wake's Pro Humanitate motto organically", "Shows civic engagement through specific canvassing detail"], voiceType: "observational", spikeConnection: "Voter registration organizer — essay bridges civic engagement to Wake Forest's service mission", structureType: "thematic", strengthAxis: "detail", approximateScore: 80, excerpt: `I knocked on 300 doors and learned that democracy has a screen-door problem. Half the people who said "I'll vote" said it through a screen door they never opened. They were interested but not enough to step outside. The other half invited me in, gave me water, and asked questions I couldn't answer.\n\nWake Forest's Pro Humanitate isn't a slogan — it's a practice. The Policy, Politics, and Political Economy concentration connects the door-knocking I've done to the systems that decide which doors get knocked on. I want to understand why some communities get 50 canvassers and others get none.`, counselorNote: "Wake Forest values Pro Humanitate and this essay embodies it. The screen-door metaphor is original and sustained. Naming the specific concentration shows research beyond the motto." },
  { school: "Northeastern", year: 2024, promptType: "supplement-why-us", topic: "Why Northeastern — connecting restaurant SaaS to co-op philosophy", openingLine: "My best co-op happened before I applied — I just didn't know it was called that.", whatWorked: ["Reframes personal experience using Northeastern's language", "Names specific co-op partners and the IDEA venture accelerator", "Shows entrepreneurial thinking aligned with co-op model"], voiceType: "analytical", spikeConnection: "SaaS founder — essay connects real business experience to Northeastern's experiential learning model", structureType: "thematic", strengthAxis: "surprise", approximateScore: 82, excerpt: `My best co-op happened before I applied — I just didn't know it was called that. For two years, I built ordering software for a restaurant owner who was losing customers because her phone was always busy. I sat in her kitchen. I watched how orders flowed. I shipped code and watched real people use it in real time. Northeastern calls this experiential learning. I call it Tuesday.\n\nThe IDEA venture accelerator would give my company what my kitchen-table office can't: mentorship, a cohort of other student founders, and access to Boston's startup ecosystem. I don't need Northeastern to teach me how to build — I need Northeastern to teach me how to scale.`, counselorNote: "Northeastern supplements must reference co-op specifically. This essay reframes the applicant's existing work AS a co-op, which is clever. 'I call it Tuesday' is confident without being arrogant. Naming IDEA shows genuine research." },
  { school: "Tulane", year: 2024, promptType: "supplement-why-us", topic: "Why Tulane — connecting health mapping to the Center for Public Service", openingLine: "New Orleans taught me that recovery is not a destination — it's a neighborhood.", whatWorked: ["Uses NOLA-specific insight as the thesis", "Names the Center for Public Service and Cowen Institute", "Shows genuine engagement with the city, not tourism"], voiceType: "observational", spikeConnection: "Public health mapping — essay connects community health work to Tulane's service mission in NOLA", structureType: "thematic", strengthAxis: "place", approximateScore: 80, excerpt: `New Orleans taught me that recovery is not a destination — it's a neighborhood. I learned this walking through the Lower Ninth Ward with a clipboard, mapping which blocks had grocery stores and which had liquor stores, and realizing the answer predicted health outcomes better than any medical data I'd seen.\n\nTulane's Center for Public Service embeds students in the city the way I want to be embedded — not as observers, but as participants. The Cowen Institute's education research addresses the exact question my mapping raised: why do some neighborhoods recover from Katrina and others don't? I don't want to study New Orleans. I want to serve it.`, counselorNote: "Tulane supplements must show genuine NOLA engagement. This essay delivers: Lower Ninth Ward, grocery-vs-liquor mapping, Katrina recovery. Naming the Center for Public Service and Cowen Institute shows research. 'Recovery is a neighborhood' is a genuinely insightful framing." },
  { school: "UF", year: 2024, promptType: "supplement-why-us", topic: "Why UF — connecting hurricane app to UF's AI initiative", openingLine: "I built an app that tells 10,000 Floridians when to leave their homes.", whatWorked: ["Opens with scale and urgency", "Names UF's specific AI and ESSIE programs", "Shows Florida-specific problem-solving"], voiceType: "narrative", spikeConnection: "Hurricane tracking app developer — essay connects local tech impact to UF's engineering resources", structureType: "chronological", strengthAxis: "detail", approximateScore: 81, excerpt: `I built an app that tells 10,000 Floridians when to leave their homes. Not because I'm dramatic — because Hurricane Ian proved that the official evacuation warnings come too late for people who can't afford to guess wrong.\n\nUF's ESSIE department combines environmental engineering with data science in exactly the way my app needs. The AI initiative's focus on real-time prediction could make my app faster, and Professor Kiker's work on climate adaptation could make it smarter. I built version 1.0 in my bedroom. UF is where I build version 2.0 — the one that works for a million people, not ten thousand.`, counselorNote: "UF supplements work when they connect Florida problems to UF's specific resources. 10,000 users is hard evidence. Naming ESSIE and Professor Kiker shows genuine research. The 1.0 → 2.0 framing shows the applicant needs UF, not just wants it." },
  { school: "Wisconsin", year: 2024, promptType: "supplement-why-us", topic: "Why UW Madison — connecting dairy farm data to the Data Science Institute", openingLine: "The most important dataset I've ever analyzed smells like cow manure.", whatWorked: ["Sensory opening is unexpected and memorable", "Names the Data Science Institute and specific agricultural applications", "Bridges rural background to academic ambition"], voiceType: "observational", spikeConnection: "Agricultural data scientist — essay connects farm data to UW's research ecosystem", structureType: "thematic", strengthAxis: "surprise", approximateScore: 79, excerpt: `The most important dataset I've ever analyzed smells like cow manure. My family's dairy farm generates 200 data points per day — milk yield, feed costs, weather, soil pH — and nobody was using any of it until I built a dashboard that showed my father which cows were profitable and which were eating money.\n\nUW Madison's Data Science Institute doesn't just train data scientists — it deploys them into Wisconsin's agricultural economy. The connection between the university and the state's farming communities is exactly what I need: academic rigor applied to the problems I grew up with.`, counselorNote: "UW Madison supplements that show Wisconsin-specific connection stand out. The cow manure opening is unforgettable. 'Which cows were eating money' is a perfect farm-data detail. The Data Science Institute reference shows research." },
  { school: "UIUC", year: 2024, promptType: "supplement-why-us", topic: "Why UIUC — connecting NLP research to the Siebel Center for Computer Science", openingLine: "My favorite programming language doesn't use a compiler — it uses a grandmother.", whatWorked: ["Playful reframing of natural language as a programming language", "Names Siebel Center and specific NLP research groups", "Shows genuine intellectual curiosity about language + CS intersection"], voiceType: "analytical", spikeConnection: "NLP researcher — essay connects African language processing to UIUC's CS+Linguistics program", structureType: "thematic", strengthAxis: "surprise", approximateScore: 85, excerpt: `My favorite programming language doesn't use a compiler — it uses a grandmother. Yoruba has tonal markers that change meaning the way Python uses indentation to change scope: one shift, and "the dog ate" becomes "the dog is eating" or "the dog will eat." Teaching a computer to hear the difference is the hardest NLP problem I've ever loved.\n\nUIUC's Siebel Center houses one of the deepest NLP research groups in the country. The CS+Linguistics dual degree lets me do both — build the systems and study the languages they process. Professor Zhai's work on cross-lingual information retrieval is the framework my Yoruba NLP tool needs.`, counselorNote: "UIUC CS supplements must show why UIUC specifically, not just 'good CS program.' The Yoruba/Python parallel is brilliant. Naming Siebel, the dual degree, and Professor Zhai proves this isn't a copy-paste supplement." },
  { school: "Purdue", year: 2024, promptType: "supplement-why-us", topic: "Why Purdue — connecting rocketry to Zucrow Labs", openingLine: "Neil Armstrong walked on the moon, but he learned to fly at Purdue.", whatWorked: ["Leverages Purdue's most famous alum", "Names Zucrow Labs (largest academic propulsion lab in the world)", "Connects personal rocketry experience to institutional resources"], voiceType: "narrative", spikeConnection: "TARC rocketry team lead — essay connects hands-on rocket building to Purdue's propulsion research", structureType: "chronological", strengthAxis: "detail", approximateScore: 82, excerpt: `Neil Armstrong walked on the moon, but he learned to fly at Purdue. I haven't walked on the moon. But I've watched a rocket I built reach 28,000 feet, and the 47 seconds of silence between ignition and apogee taught me more about engineering than any classroom.\n\nPurdue's Zucrow Labs is the largest university propulsion research facility in the world. The things I do in my garage with hobby-grade motors, Zucrow does with liquid oxygen. I want to make that jump — from model rockets to the engines that actually leave the atmosphere.`, counselorNote: "Purdue aerospace supplements work when they reference specific labs. Zucrow Labs is the right name. Armstrong opening is bold but earned by the applicant's own rocketry experience. The garage-to-Zucrow scale jump shows clear motivation." },
  { school: "Ohio State", year: 2024, promptType: "supplement-why-us", topic: "Why Ohio State — connecting EV project to the Center for Automotive Research", openingLine: "My truck has zero emissions and one cup holder that doesn't work.", whatWorked: ["Humor grounds the technical achievement", "Names the Center for Automotive Research", "Shows practical engineering philosophy"], voiceType: "narrative", spikeConnection: "EV conversion builder — essay connects DIY engineering to OSU's automotive research", structureType: "chronological", strengthAxis: "surprise", approximateScore: 78, excerpt: `My truck has zero emissions and one cup holder that doesn't work. I converted a 1994 Chevy from gas to electric in my garage over three months, and the only thing I couldn't fix was the cup holder. Engineering is full of problems like that — you solve the impossible one and get stuck on the obvious one.\n\nOhio State's Center for Automotive Research works on the problems I can't solve alone: battery thermal management, regenerative braking optimization, and vehicle-to-grid integration. I brought the truck. I need OSU to bring the science.`, counselorNote: "Ohio State supplements work with humor and specificity. The cup holder joke makes the EV conversion feel real and approachable. Naming the Center for Automotive Research and three specific technical challenges shows genuine research interest." },
  { school: "UCSD", year: 2024, promptType: "uc-personal-insight", topic: "UC PIQ — greatest talent or skill (prompt 3)", openingLine: "I can taste when water is contaminated.", whatWorked: ["Extraordinary sensory claim grabs attention immediately", "Grounds an unusual talent in real-world application", "Connects to bioengineering interest organically"], voiceType: "confessional", spikeConnection: "Water quality researcher — essay connects sensory ability to environmental science passion", structureType: "thematic", strengthAxis: "surprise", approximateScore: 80, excerpt: `I can taste when water is contaminated. Not lead or mercury — I'm not a superhero. But iron, sulfur, chlorine levels above 4 ppm. My mother noticed when I was nine and refused to drink from a hotel faucet in Guatemala. The lab report confirmed elevated iron. Since then, I've been the family canary.\n\nThis isn't a party trick. It's what made me care about water quality in communities that can't afford lab reports. My testing kit uses colorimetric strips instead of a tongue, but the motivation is the same: everyone deserves to know what they're drinking.`, counselorNote: "UC PIQs reward unexpected talents. 'I can taste contamination' is one of the most memorable openings I've seen. The Guatemala hotel detail proves it's real. The canary metaphor is earned. Connecting it to water testing kits shows the talent has been channeled into something useful." },
  { school: "Penn State", year: 2024, promptType: "supplement-why-us", topic: "Why Penn State — connecting supply chain optimization to Smeal", openingLine: "I saved my family's restaurant $40,000 by counting french fries.", whatWorked: ["Absurd-sounding claim that turns out to be true and impressive", "Names Smeal College and supply chain concentration", "Shows quantitative thinking applied to everyday problems"], voiceType: "analytical", spikeConnection: "Supply chain optimizer — essay connects restaurant efficiency to Smeal's curriculum", structureType: "chronological", strengthAxis: "detail", approximateScore: 79, excerpt: `I saved my family's restaurant $40,000 by counting french fries. Not metaphorically — I literally weighed portions across 200 orders and found that the serving variance was ±23%. Some customers got twice as many fries as others. That's not generosity. That's a supply chain problem.\n\nSmeal's supply chain management program is #6 nationally because it treats operations as a science, not an art. The curriculum's emphasis on data-driven decision-making is exactly what my restaurant data project needs — a framework to scale from one kitchen to the industry.`, counselorNote: "Penn State Smeal supplements work when they show real business experience. $40K savings is hard to argue with. The ±23% variance is a perfect quantitative detail. Naming Smeal's #6 ranking and data-driven emphasis shows genuine research." },
  { school: "Texas A&M", year: 2024, promptType: "supplement-why-us", topic: "Why Texas A&M — connecting methane detection to the Energy Institute", openingLine: "My family drills for oil, and I'm trying to make sure it doesn't kill the planet.", whatWorked: ["Honest tension between family livelihood and environmental concern", "Names the Energy Institute and specific research areas", "Shows nuance — not anti-oil, but pro-improvement"], voiceType: "confessional", spikeConnection: "Methane detection engineer — essay bridges energy industry roots to sustainable engineering", structureType: "thematic", strengthAxis: "vulnerability", approximateScore: 81, excerpt: `My family drills for oil, and I'm trying to make sure it doesn't kill the planet. That sounds like a contradiction, but at Texas A&M it's a curriculum. The Energy Institute doesn't pretend fossil fuels are going away tomorrow — it builds the bridge between where we are and where we need to be.\n\nMy methane detection system reduced fugitive emissions by 30% on a single well pad. A&M's petroleum engineering program would teach me to deploy that system across thousands. I'm not here to shut down the industry my grandfather built. I'm here to make sure it survives by getting better.`, counselorNote: "Texas A&M energy supplements work when they show nuance about fossil fuels. This applicant doesn't apologize for their family's work — they improve it. 30% methane reduction is quantifiable. The grandfather detail adds emotional weight. The Energy Institute reference shows genuine research." },
  { school: "Clemson", year: 2024, promptType: "supplement-why-us", topic: "Why Clemson — connecting solar water purification to engineering program", openingLine: "The best water filter I ever built cost $12 and runs on sunlight.", whatWorked: ["Cost and simplicity immediately demonstrate engineering philosophy", "Names Clemson's specific engineering facilities", "Shows Clemson's land-grant mission alignment"], voiceType: "narrative", spikeConnection: "Solar water purifier builder — essay connects rural engineering to Clemson's practical mission", structureType: "chronological", strengthAxis: "detail", approximateScore: 78, excerpt: `The best water filter I ever built cost $12 and runs on sunlight. It's a UV purification system made from PVC pipe, a solar panel from a broken garden light, and an LED I ordered from Amazon. It purifies a gallon in 45 minutes. It's ugly. It works.\n\nClemson's engineering program values exactly this: solutions that work in the real world, not just in simulation. The Creative Inquiry program would let me test my design in communities that actually need it — and learn from communities that have been solving water problems longer than I've been alive.`, counselorNote: "Clemson supplements work with practical engineering details. $12 cost is memorable. 'Ugly. It works.' captures engineering philosophy. Creative Inquiry program reference shows genuine research. The humility about learning from communities elevates this beyond a savior narrative." },
  { school: "Virginia Tech", year: 2024, promptType: "supplement-why-us", topic: "Why Virginia Tech — connecting crop disease app to agricultural AI research", openingLine: "A 70-year-old tobacco farmer taught me more about AI than any textbook.", whatWorked: ["Unexpected teacher creates interest", "Names VT's specific agricultural technology initiatives", "Shows technology meeting people where they are"], voiceType: "narrative", spikeConnection: "Crop disease detection developer — essay connects agricultural AI to VT's land-grant mission", structureType: "chronological", strengthAxis: "surprise", approximateScore: 80, excerpt: `A 70-year-old tobacco farmer taught me more about AI than any textbook. When I showed him my crop disease detection app, he didn't ask about the algorithm. He asked, "Can it work without WiFi?" That question shaped every design decision I made after that day.\n\nVirginia Tech's agricultural technology initiatives combine AI research with the land-grant mission that put researchers in the field, not just the lab. I want to build AI that works in a tobacco field with no cell service — not AI that wins competitions in air-conditioned rooms.`, counselorNote: "Virginia Tech supplements that reference the land-grant mission stand out. The farmer's WiFi question is the essay's best moment — it shows that the user defines the problem, not the engineer. The air-conditioned rooms contrast is sharp." },
  { school: "UW", year: 2024, promptType: "supplement-why-us", topic: "Why UW — connecting wildfire ML to the eScience Institute", openingLine: "The smoke turned the Seattle sky orange, and I stopped scrolling and started coding.", whatWorked: ["Vivid imagery with immediate action", "Names UW's eScience Institute", "Shows local problem-solving tied to institutional resources"], voiceType: "narrative", spikeConnection: "Wildfire ML developer — essay connects real PNW crisis to UW's data science infrastructure", structureType: "chronological", strengthAxis: "place", approximateScore: 81, excerpt: `The smoke turned the Seattle sky orange, and I stopped scrolling and started coding. That afternoon in September 2024, I started building a wildfire risk model using satellite data and Pacific Northwest weather patterns. Six months later, a county emergency management office adopted it.\n\nUW's eScience Institute studies exactly this intersection — data science applied to real-world crises. The connection between the university and the Pacific Northwest's environmental challenges is why I want to be in Seattle, not just at a top CS school. My model works for one county. UW would teach me to make it work for the entire Cascadia region.`, counselorNote: "UW supplements need PNW specificity. Orange sky is viscerally local. The eScience Institute reference shows genuine research. County adoption proves impact. The one-county-to-Cascadia scaling question shows why UW specifically is needed." },
  { school: "UMD", year: 2024, promptType: "supplement-why-us", topic: "Why UMD — connecting cybersecurity platform to Maryland Cybersecurity Center", openingLine: "I taught 15,000 middle schoolers not to click phishing links, one fake email at a time.", whatWorked: ["Scale is immediately impressive", "Names the Maryland Cybersecurity Center (MC2)", "Shows teaching as a cybersecurity strategy"], voiceType: "analytical", spikeConnection: "Cybersecurity education platform developer — essay connects security awareness to UMD's research", structureType: "thematic", strengthAxis: "detail", approximateScore: 82, excerpt: `I taught 15,000 middle schoolers not to click phishing links, one fake email at a time. My cybersecurity training platform sends simulated phishing emails to students, then explains what they should have noticed when they click. Three school districts adopted it. Suspicion went up 40%.\n\nThe Maryland Cybersecurity Center (MC2) researches security at the scale I want to reach — not one school district, but the entire education system. UMD's proximity to NSA, NIST, and the federal cybersecurity infrastructure means the research connects to policy in real time.`, counselorNote: "UMD cyber supplements must reference MC2 and the federal proximity. This essay delivers both. 15,000 students and 40% suspicion increase are hard metrics. The fake-email pedagogy is clever and shows genuine security thinking." },
  { school: "Pitt", year: 2024, promptType: "supplement-why-us", topic: "Why Pitt — connecting Alzheimer's research to UPMC partnership", openingLine: "I have pipetted the 200th sample and still haven't found what I'm looking for.", whatWorked: ["Opens with the reality of research — repetition without results", "Names UPMC partnership specifically", "Shows patience as a research virtue"], voiceType: "confessional", spikeConnection: "Alzheimer's researcher — essay connects lab work to Pitt's medical research ecosystem", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 80, excerpt: `I have pipetted the 200th sample and still haven't found what I'm looking for. This is what research actually looks like — not eureka moments, but Tuesday afternoons in a Moffitt lab counting amyloid plaques that may or may not mean anything yet.\n\nPitt's partnership with UPMC is the largest academic medical center collaboration in the country. The neuroscience department's Alzheimer's research uses the same biomarker approach I've been working with, but at a scale my summer lab can't match. I need Pitt's infrastructure to turn my 200 samples into 20,000.`, counselorNote: "Pitt supplements that reference UPMC stand out. The 200-sample count is honest about research pace. 'May or may not mean anything yet' shows research maturity. The 200-to-20,000 scaling shows why Pitt specifically is needed." },
  // ==========================================================================
  // REMAINING 51 SCHOOLS
  // ==========================================================================
  { school: "BC", year: 2024, promptType: "supplement-why-us", topic: "Why BC — connecting nursing vocation to Jesuit service mission", openingLine: "I held a stranger's hand for forty-five minutes and never learned his name.", whatWorked: ["Visceral human connection as opening", "Names BC's Connell School of Nursing", "Aligns with Jesuit cura personalis"], voiceType: "confessional", spikeConnection: "Hospital volunteer — essay bridges bedside care to BC's nursing formation", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 82, excerpt: `I held a stranger's hand for forty-five minutes and never learned his name. He was in the ER at 2 AM, alone, waiting for imaging results, and the nurse asked if I could sit with him. He squeezed my hand when the pain spiked. I squeezed back. That was the whole conversation.\n\nBC's Connell School of Nursing teaches that care is not a procedure — it's a presence. The Jesuit principle of cura personalis means caring for the whole person, not just the diagnosis. I learned that at 2 AM before I learned the Latin.`, counselorNote: "BC nursing supplements work when they connect bedside humanity to Jesuit formation. The nameless hand-holding is unforgettable. Cura personalis reference shows genuine BC research." },
  { school: "BU", year: 2024, promptType: "supplement-why-us", topic: "Why BU COM — connecting investigative journalism to real-world impact", openingLine: "I FOIA'd my own school district at sixteen.", whatWorked: ["Bold opening shows initiative", "Names BU COM's specific investigative program", "Shows journalism as accountability"], voiceType: "analytical", spikeConnection: "Student investigative journalist — essay connects real reporting to BU's journalism program", structureType: "chronological", strengthAxis: "detail", approximateScore: 81, excerpt: `I FOIA'd my own school district at sixteen. The records showed that $200K in Title I funds meant for low-income students was spent on administrative conferences. My story ran in the school paper. Then the local TV station called.\n\nBU COM's investigative reporting track doesn't simulate journalism — it deploys students into Boston newsrooms. The New England Center for Investigative Reporting, housed at BU, breaks the kind of stories I want to break: public money, public accountability, public interest.`, counselorNote: "BU COM supplements need specificity beyond 'great journalism school.' FOIA at 16 is extraordinary. Naming NECIR shows real research. The Title I angle proves the applicant cares about accountability, not just bylines." },
  { school: "Brandeis", year: 2024, promptType: "supplement-why-us", topic: "Why Brandeis — connecting interfaith work to social justice tradition", openingLine: "The best peace negotiation I ever witnessed happened over hummus.", whatWorked: ["Humor disarms a serious topic", "Names Brandeis's specific social justice programs", "Shows interfaith work as practice, not theory"], voiceType: "observational", spikeConnection: "Interfaith organizer — essay connects grassroots dialogue to Brandeis's justice mission", structureType: "thematic", strengthAxis: "surprise", approximateScore: 80, excerpt: `The best peace negotiation I ever witnessed happened over hummus. A Jewish student and a Muslim student arguing about whose grandmother made it better. They agreed on garlic. They disagreed on lemon. They're still friends.\n\nBrandeis was founded on the principle that social justice requires action, not just aspiration. The International Center for Ethics, Justice and Public Life does exactly what my interfaith sessions try to do at a kitchen table: make people with different beliefs sit down, eat together, and discover that peace starts with appetizers.`, counselorNote: "Brandeis supplements must connect to social justice specifically. The hummus negotiation is charming and specific. Naming the Ethics Center shows genuine research. The 'peace starts with appetizers' callback is elegant." },
  { school: "CWRU", year: 2024, promptType: "supplement-why-us", topic: "Why CWRU — connecting EEG headband to biomedical engineering partnership with Cleveland Clinic", openingLine: "Twenty-three wires is too many wires.", whatWorked: ["Simple declarative thesis captures engineering motivation", "Names Cleveland Clinic partnership and specific labs", "Shows patient-centered engineering"], voiceType: "analytical", spikeConnection: "EEG headband developer — essay connects medical device simplification to CWRU's BME ecosystem", structureType: "thematic", strengthAxis: "detail", approximateScore: 83, excerpt: `Twenty-three wires is too many wires. I watched a sleep study patient at Cleveland Clinic tangled in electrodes, trying not to move, and decided that if we can put a computer in a watch, we can put an EEG in a headband.\n\nCWRU's biomedical engineering program sits across the street from Cleveland Clinic — literally. The translational research pipeline means a prototype I build in a CWRU lab can be tested on patients the same semester. That proximity is what separates CWRU from every other BME program I considered.`, counselorNote: "CWRU BME supplements need the Cleveland Clinic connection. 'Twenty-three wires is too many wires' is the perfect engineering thesis — simple, clear, motivated by empathy. The 'across the street' proximity detail is smart." },
  { school: "Lehigh", year: 2024, promptType: "supplement-why-us", topic: "Why Lehigh CBE — connecting student investment fund to integrated business+engineering", openingLine: "I lost 8% of someone else's money in one week and had to explain it face to face.", whatWorked: ["Vulnerability in a finance context is unusual", "Names Lehigh's IBE program specifically", "Shows that failure stories are more compelling than success stories"], voiceType: "confessional", spikeConnection: "Student fund manager — essay connects investment experience to Lehigh's integrated business+engineering curriculum", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 79, excerpt: `I lost 8% of someone else's money in one week and had to explain it face to face. Not to a screen. To seventeen club members sitting in Room 204, watching me fumble through a slide deck about why their $25K portfolio just dropped $2,000.\n\nLehigh's Integrated Business and Engineering program teaches exactly what that week taught me: the numbers are never just numbers. The IBE curriculum forces you to understand both the spreadsheet and the human sitting across from it.`, counselorNote: "Lehigh supplements work when they show the IBE intersection. The 8% loss story is more compelling than any gain story. 'The numbers are never just numbers' captures the IBE philosophy. Room 204 detail grounds it." },
  { school: "Villanova", year: 2024, promptType: "supplement-why-us", topic: "Why Villanova — connecting health screenings to Augustinian service values", openingLine: "Eight hundred blood pressure readings taught me that health care starts before the hospital.", whatWorked: ["Scale immediately shows commitment", "Names Augustinian values and service programs", "Shows nursing motivation rooted in community, not prestige"], voiceType: "narrative", spikeConnection: "Health screening organizer — essay bridges community health to Villanova's service mission", structureType: "thematic", strengthAxis: "detail", approximateScore: 78, excerpt: `Eight hundred blood pressure readings taught me that health care starts before the hospital. I organized free screenings at 12 churches, and the most common thing people said wasn't "thank you" — it was "I didn't know I should check."\n\nVillanova's Augustinian tradition calls this Veritas, Unitas, Caritas — truth, unity, love. My health screenings are all three: telling people the truth about their numbers, building unity through church partnerships, and doing it because care shouldn't require insurance.`, counselorNote: "Villanova supplements must connect to Augustinian values. 800 readings shows scale. The 'I didn't know I should check' quote is more powerful than any statistic. Naming the Latin motto shows genuine cultural engagement." },
  { school: "Rochester", year: 2024, promptType: "supplement-why-us", topic: "Why Rochester — connecting homemade spectrometer to the Institute of Optics", openingLine: "I built a spectrometer from a cereal box and a DVD, and it actually works.", whatWorked: ["Resourcefulness is immediately charming", "Names the Institute of Optics (#1 in US)", "Shows optics passion through DIY ingenuity"], voiceType: "narrative", spikeConnection: "Amateur optics builder — essay connects DIY instruments to Rochester's world-leading optics program", structureType: "chronological", strengthAxis: "surprise", approximateScore: 84, excerpt: `I built a spectrometer from a cereal box and a DVD, and it actually works. The diffraction grating is the DVD's data surface. The slit is cut from cardboard. It resolves sodium's doublet at 589 nm. My physics teacher didn't believe me until I showed her the spectral lines.\n\nRochester's Institute of Optics is the oldest and largest optics program in the country. The things I'm doing with cereal boxes, they do with adaptive optics and femtosecond lasers. I want to make that jump — from improvised instruments to instruments that see the edge of the universe.`, counselorNote: "Rochester optics supplements must name the Institute. The cereal box spectrometer is one of the most charming engineering stories I've read. Resolving sodium's doublet proves it's real, not a toy. The cereal-box-to-femtosecond-laser scaling shows clear ambition." },
  { school: "RPI", year: 2024, promptType: "supplement-why-us", topic: "Why RPI — connecting drone bridge inspection to civil engineering research", openingLine: "A civil engineer shouldn't have to risk his life to check if a bridge is safe.", whatWorked: ["Clear problem statement as opening", "Names RPI's specific engineering research areas", "Shows engineering motivated by human safety"], voiceType: "analytical", spikeConnection: "Drone bridge inspection developer — essay connects safety engineering to RPI's infrastructure research", structureType: "thematic", strengthAxis: "detail", approximateScore: 79, excerpt: `A civil engineer shouldn't have to risk his life to check if a bridge is safe. I watched one climb a rusted truss in January, ice on the steel, 60 feet above a frozen river. My drone could have done it in 20 minutes from the ground.\n\nRPI's civil engineering program studies infrastructure at the systems level — not just one bridge, but how a city's entire network ages and fails. My drone reduces inspection time by 70%. RPI would teach me to deploy it across the 7,500 structurally deficient bridges in the US.`, counselorNote: "RPI engineering supplements work when they show practical problem-solving. The ice-on-steel-60-feet-up image creates visceral urgency. 7,500 deficient bridges shows the applicant has researched the scale of the problem." },
  { school: "Santa Clara", year: 2024, promptType: "supplement-why-us", topic: "Why SCU — connecting AI ethics curriculum to Markkula Center", openingLine: "I asked a room of 15-year-olds if a self-driving car should swerve left or right, and a girl in the back said 'who built it?'", whatWorked: ["Student's question reframes the trolley problem brilliantly", "Names Markkula Center for Applied Ethics", "Shows ethics as a design problem, not a philosophy problem"], voiceType: "observational", spikeConnection: "AI ethics educator — essay connects classroom teaching to SCU's applied ethics research", structureType: "thematic", strengthAxis: "surprise", approximateScore: 82, excerpt: `I asked a room of 15-year-olds if a self-driving car should swerve left or right, and a girl in the back said "who built it?" That question is better than anything I've read in a philosophy textbook. It reframes the trolley problem from ethics to engineering: the moral choice was made when the code was written, not when the car swerves.\n\nSCU's Markkula Center doesn't study ethics in the abstract — it embeds ethics into the design process. The Technology Ethics curriculum puts CS students in rooms with ethicists, which is exactly where I've been putting high schoolers for two years.`, counselorNote: "SCU supplements must show Jesuit values + Silicon Valley tech awareness. The 'who built it?' student quote is the essay's best moment. Naming Markkula and the Technology Ethics curriculum shows genuine research." },
  { school: "LMU", year: 2024, promptType: "supplement-why-us", topic: "Why LMU — connecting documentary filmmaking to School of Film & TV", openingLine: "The best story I ever filmed was told by a woman who lives in a tent on Sunset Boulevard.", whatWorked: ["Immediately places us in LA with specific location", "Names LMU's School of Film & Television", "Shows documentary as social practice, not just art"], voiceType: "observational", spikeConnection: "Documentary filmmaker — essay connects LA storytelling to LMU's film program and social mission", structureType: "chronological", strengthAxis: "place", approximateScore: 80, excerpt: `The best story I ever filmed was told by a woman who lives in a tent on Sunset Boulevard. She asked me to include the flowers she grows in plastic cups because she wanted people to see her as someone who creates, not just someone who survives. I kept that shot in every cut.\n\nLMU's School of Film & Television is four miles from Sunset Boulevard. The program's emphasis on storytelling for social good means I wouldn't have to choose between making films that win festivals and films that change how people see each other.`, counselorNote: "LMU film supplements need LA specificity. The flowers-in-plastic-cups detail is unforgettable. Four miles from Sunset Boulevard connects location to mission. Social good emphasis matches LMU's Jesuit identity." },
  { school: "Pepperdine", year: 2024, promptType: "supplement-why-us", topic: "Why Pepperdine — connecting mentorship program to servant leadership values", openingLine: "I drove a 14-year-old to his first college campus and watched him realize the buildings weren't behind a fence.", whatWorked: ["'Buildings without a fence' is a powerful image of access", "Names Pepperdine's specific service programs", "Shows mentorship through a single transformative moment"], voiceType: "narrative", spikeConnection: "Youth mentorship founder — essay bridges access work to Pepperdine's purpose-driven education", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 78, excerpt: `I drove a 14-year-old to his first college campus and watched him realize the buildings weren't behind a fence. He'd grown up three miles from UCLA and never stepped on campus. Access isn't about money or grades — it's about the idea that a place like this could be for someone like you.\n\nPepperdine's service leadership model doesn't treat community engagement as an add-on — it's the curriculum. The Volunteer Center places students in under-resourced communities where the work is not optional. That's the kind of service I want: not charity, but partnership.`, counselorNote: "Pepperdine supplements must connect to Christian service values. 'Buildings without a fence' captures the access gap in one image. Three miles from UCLA but never visited is devastating context. Volunteer Center reference shows research." },
  { school: "Fordham", year: 2024, promptType: "supplement-why-us", topic: "Why Fordham — connecting City Council work to Gabelli School of Business", openingLine: "I sat in a City Council hearing at seventeen surrounded by people who'd been doing this for decades.", whatWorked: ["Youth-in-power dynamic creates immediate interest", "Names Gabelli School and specific NYC connections", "Shows political engagement as business preparation"], voiceType: "narrative", spikeConnection: "City Council intern — essay connects civic engagement to Fordham's NYC-embedded business program", structureType: "chronological", strengthAxis: "detail", approximateScore: 79, excerpt: `I sat in a City Council hearing at seventeen surrounded by people who'd been doing this for decades. The youngest person in the room had something the others didn't — the ability to be surprised by injustice. They'd seen it so many times it became normal. I hadn't.\n\nFordham's Gabelli School sits in New York City, and that's not decoration — it's the curriculum. The NYC immersion model uses the city as a classroom. I want to study business where business happens, not where it's simulated.`, counselorNote: "Fordham supplements must show NYC integration. 'Surprised by injustice' is the essay's most insightful line. Gabelli's NYC immersion model is the right program to name. The youth/experience contrast is well-drawn." },
  { school: "GW", year: 2024, promptType: "supplement-why-us", topic: "Why GW Elliott — connecting foreign policy journal to DC's policy ecosystem", openingLine: "I started a foreign policy journal because the school newspaper wouldn't run my 3,000-word analysis of the Iran nuclear deal.", whatWorked: ["Shows initiative born from frustration", "Names the Elliott School specifically", "DC proximity is earned, not just stated"], voiceType: "analytical", spikeConnection: "Foreign policy journal founder — essay connects policy writing to GW's DC-embedded international affairs program", structureType: "chronological", strengthAxis: "detail", approximateScore: 81, excerpt: `I started a foreign policy journal because the school newspaper wouldn't run my 3,000-word analysis of the Iran nuclear deal. Fair enough — it was a high school paper. But I had contributors from 8 countries within six months, and the journal now publishes quarterly.\n\nGW's Elliott School of International Affairs is four blocks from the State Department. The proximity isn't symbolic — it's functional. Elliott students intern at embassies, attend Senate hearings, and study policy where it's made. My journal analyzes policy from a distance. Elliott would put me inside it.`, counselorNote: "GW Elliott supplements need DC specificity. Four blocks from State Department is the right detail. 8-country contributors shows the journal is real. The distance-to-inside framing shows why GW specifically matters." },
  { school: "American", year: 2024, promptType: "supplement-why-us", topic: "Why American SOC — connecting fact-checking service to DC journalism", openingLine: "I called a congressman's office to verify a claim and was told 'that's not how it works, kid.'", whatWorked: ["Confrontation with power as an opening is bold", "Names SOC and specific journalism resources", "Shows journalism as democratic accountability"], voiceType: "observational", spikeConnection: "Student fact-checker — essay connects accountability journalism to AU's DC journalism program", structureType: "chronological", strengthAxis: "surprise", approximateScore: 78, excerpt: `I called a congressman's office to verify a claim he made on TV and was told "that's not how it works, kid." It is exactly how it works. Verification is the foundation of journalism, and if elected officials don't want their claims checked, that's precisely why they need to be.\n\nAmerican's School of Communication trains journalists in the city where the stories are. The investigative reporting track and DC-based newsroom partnerships mean I'd be fact-checking real claims for real outlets, not simulating it in a classroom.`, counselorNote: "American SOC supplements need DC journalism focus. The congressman pushback is the essay's strongest moment. 'That's not how it works, kid' / 'It is exactly how it works' is a perfect structural reversal." },
  { school: "Syracuse", year: 2024, promptType: "supplement-why-us", topic: "Why Syracuse Newhouse — connecting sports documentary to broadcast journalism", openingLine: "The most interesting athlete I ever interviewed played forty-seven seconds all season.", whatWorked: ["Anti-narrative angle finds the real story", "Names Newhouse specifically", "Shows documentary instinct — finding stories others miss"], voiceType: "observational", spikeConnection: "Sports documentary producer — essay connects anti-narrative storytelling to Newhouse's journalism training", structureType: "thematic", strengthAxis: "surprise", approximateScore: 80, excerpt: `The most interesting athlete I ever interviewed played forty-seven seconds all season. Everyone wants the star's story. But the third-string quarterback who shows up to every practice knowing he won't play — that's the story that tells you something about why people do anything at all.\n\nNewhouse doesn't teach you to find the obvious story — it teaches you to find the real one. The broadcast journalism program's emphasis on field reporting means I'd be telling stories from locker rooms and sidelines, not desks.`, counselorNote: "Newhouse supplements work with storytelling examples. The 47-second player is a perfect anti-narrative choice. 'Why people do anything at all' elevates a sports story to a human story. Field reporting emphasis is the right Newhouse detail." },
  { school: "Miami", year: 2024, promptType: "supplement-why-us", topic: "Why UM Rosenstiel — connecting coral reef monitoring to marine science", openingLine: "I watched a coral head I'd been monitoring for two years bleach white in one summer.", whatWorked: ["Personal ecological loss as opening", "Names Rosenstiel School specifically", "Shows citizen science contributing to real research"], voiceType: "confessional", spikeConnection: "Coral reef researcher — essay connects personal monitoring to UM's marine research infrastructure", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 81, excerpt: `I watched a coral head I'd been monitoring for two years bleach white in one summer. Some losses happen so slowly you don't notice until they're irreversible — and that's true for reefs and for people.\n\nUM's Rosenstiel School sits on Virginia Key, surrounded by the same reefs I've been monitoring. The difference: Rosenstiel has the research vessels, the dive teams, and the grant funding to turn my 50 dive-site observations into a dataset that shapes policy. I have the data. Rosenstiel has the infrastructure to make it matter.`, counselorNote: "UM Rosenstiel supplements need marine specificity. Two years of monitoring shows commitment the essay doesn't have to claim. 'Reefs and people' analogy is subtle. Virginia Key location detail and research infrastructure naming shows genuine research." },
  { school: "Drexel", year: 2024, promptType: "supplement-why-us", topic: "Why Drexel — connecting indie game development to co-op model", openingLine: "5,000 people downloaded something I made in my bedroom, and 92% of them liked it.", whatWorked: ["Metrics immediately prove credibility", "Names Drexel's co-op program and game design resources", "Shows entrepreneurial mindset aligned with co-op philosophy"], voiceType: "analytical", spikeConnection: "Indie game developer — essay connects Steam success to Drexel's experiential learning model", structureType: "thematic", strengthAxis: "detail", approximateScore: 79, excerpt: `5,000 people downloaded something I made in my bedroom, and 92% of them liked it. My indie game on Steam has reviews from Finland, Brazil, and Japan. I built it alone. I need Drexel to teach me how to build with a team.\n\nDrexel's co-op model is the reason I'm not applying to a traditional game design program. Six months at a real studio before graduation means I'd ship a commercial game before I'm 22. The co-op isn't an internship — it's the education.`, counselorNote: "Drexel supplements must reference co-op specifically. 5,000 downloads with 92% positive is hard market validation. The 'built alone, need to build with a team' framing shows self-awareness. Co-op as education (not internship) is the right distinction." },
  { school: "Stevens", year: 2024, promptType: "supplement-why-us", topic: "Why Stevens — connecting prosthetics project to NYC-adjacent engineering", openingLine: "A veteran walked for the first time in two years using a leg attachment I designed in SolidWorks.", whatWorked: ["Immediate human impact", "Names Stevens' specific engineering labs and NYC proximity", "Shows engineering as service"], voiceType: "narrative", spikeConnection: "Prosthetics designer — essay connects VA hospital work to Stevens' engineering program", structureType: "chronological", strengthAxis: "detail", approximateScore: 78, excerpt: `A veteran walked for the first time in two years using a leg attachment I designed in SolidWorks. The file was 4 MB. The moment was immeasurable.\n\nStevens sits across the Hudson from Manhattan but thinks like a garage — small teams, real problems, rapid prototyping. The mechanical engineering program's emphasis on design-build-test cycles matches how I already work: sketch it Monday, print it Wednesday, test it Friday.`, counselorNote: "Stevens supplements work with practical engineering stories. The 4 MB / immeasurable contrast is elegant. 'Thinks like a garage' captures Stevens' culture. The Monday-Wednesday-Friday cycle shows engineering practice, not just philosophy." },
  { school: "WPI", year: 2024, promptType: "supplement-why-us", topic: "Why WPI — connecting search-and-rescue robot to project-based curriculum", openingLine: "Every line of code I write is for someone I'll never meet.", whatWorked: ["Philosophical opening grounds technical work in human purpose", "Names WPI's project-based model (MQP/IQP)", "Shows how robotics serves humanitarian goals"], voiceType: "confessional", spikeConnection: "Search-and-rescue robotics — essay connects humanitarian engineering to WPI's project curriculum", structureType: "thematic", strengthAxis: "vulnerability", approximateScore: 80, excerpt: `Every line of code I write is for someone I'll never meet. My search-and-rescue robot is designed to navigate earthquake rubble and find survivors. I test it on piles of concrete at 3 AM. I've never been in an earthquake. But someone will be, and they'll need a machine that works.\n\nWPI's project-based curriculum means I'd spend my senior year deploying a real system — the Major Qualifying Project isn't a thesis, it's a deliverable. That distinction matters. Papers sit on shelves. Deliverables save lives.`, counselorNote: "WPI supplements must reference MQP/IQP. 'Papers sit on shelves, deliverables save lives' captures WPI's philosophy perfectly. The 3 AM testing detail shows dedication. 'Someone I'll never meet' is a strong motivational frame." },
  { school: "Rose-Hulman", year: 2024, promptType: "supplement-why-us", topic: "Why Rose-Hulman — connecting biodegradable plastics to undergraduate research focus", openingLine: "I grew algae in my bathtub for six months, and my mother still hasn't forgiven me.", whatWorked: ["Humor grounds serious research in real life", "Names Rose-Hulman's undergraduate-only focus", "Shows commitment through domestic sacrifice"], voiceType: "narrative", spikeConnection: "Algae bioplastic researcher — essay connects home lab research to Rose-Hulman's undergraduate engineering model", structureType: "chronological", strengthAxis: "surprise", approximateScore: 79, excerpt: `I grew algae in my bathtub for six months, and my mother still hasn't forgiven me. The smell was terrible. The results were promising — I developed a biodegradable packaging material that a local company wants to test. Science requires sacrifice. Sometimes that sacrifice is your family's bathroom.\n\nRose-Hulman is the only school I'm applying to that doesn't have a graduate program — and that's the point. Every professor, every lab, every research dollar goes to undergraduates. My algae project needs mentorship, not competition with PhD students for attention.`, counselorNote: "Rose-Hulman supplements must address the undergraduate-only model. The bathtub algae is hilarious and memorable. The mother's unforgiveness is a perfect human detail. 'Mentorship, not competition with PhD students' shows genuine understanding of the Rose-Hulman advantage." },
  { school: "UC Davis", year: 2024, promptType: "uc-personal-insight", topic: "UC PIQ — what you've done to make your school or community better (prompt 6)", openingLine: "I placed eight therapy dogs with eight families, and none of the dogs wanted to leave.", whatWorked: ["Unexpected detail about the dogs creates warmth", "Shows community impact through animal-human connection", "Specific number (8) grounds the achievement"], voiceType: "narrative", spikeConnection: "Therapy animal trainer — essay shows community building through animal placement", structureType: "chronological", strengthAxis: "detail", approximateScore: 78, excerpt: `I placed eight therapy dogs with eight families, and none of the dogs wanted to leave. Training a therapy animal takes six months — teaching it to stay calm when a child screams, to sit still when small hands grab too hard, to keep walking when the family is crying. The dogs don't understand why the humans are sad. They just stay.\n\nThe hardest placement was for a nonverbal five-year-old. His mother called me three weeks later to say he'd said his first word — the dog's name.`, counselorNote: "UC PIQs need concrete community impact. Eight placements is specific and verifiable. The nonverbal child's first word is devastating. 'The dogs don't understand why, they just stay' is a beautiful observation about loyalty." },
  { school: "UCSB", year: 2024, promptType: "uc-personal-insight", topic: "UC PIQ — describe how you've taken advantage of a significant educational opportunity (prompt 4)", openingLine: "I pulled twelve tons of plastic out of the ocean and none of it was mine.", whatWorked: ["Scale immediately impresses", "Responsibility framing ('none of it was mine') shows maturity", "Connects environmental action to systemic thinking"], voiceType: "observational", spikeConnection: "Beach cleanup organizer — essay connects local environmental action to systems-level thinking", structureType: "thematic", strengthAxis: "detail", approximateScore: 79, excerpt: `I pulled twelve tons of plastic out of the ocean and none of it was mine. That sentence contains the entire problem with environmental responsibility: the people who cause it and the people who clean it are never the same people.\n\nMy county-wide beach cleanup initiative organized 400 volunteers across 15 beaches. We weighed everything. The data showed that 60% of the waste came from three specific sources. I took that data to the county board. They banned one of them.`, counselorNote: "UC PIQs reward concrete impact. Twelve tons is extraordinary. The 60% from three sources finding shows data-driven thinking. County board action proves the cleanup led to policy. 'None of it was mine' is a perfect thesis about environmental justice." },
  { school: "UCI", year: 2024, promptType: "uc-personal-insight", topic: "UC PIQ — creative side (prompt 2)", openingLine: "A ten-year-old played my game about ocean pollution and then refused a plastic straw at lunch.", whatWorked: ["Shows behavioral change caused by creative work", "Games as persuasive design, not just entertainment", "Specific age and action make it concrete"], voiceType: "observational", spikeConnection: "Game developer — essay shows games as tools for behavior change", structureType: "thematic", strengthAxis: "surprise", approximateScore: 80, excerpt: `A ten-year-old played my game about ocean pollution and then refused a plastic straw at lunch. I didn't tell her to. The game didn't lecture about plastic. It just made her feel what a sea turtle feels when it swallows something it can't digest.\n\nThe best games don't tell you what to think — they make you feel something that changes what you do. My ocean pollution game has 50,000 downloads and an App Store 'Apps We Love' feature. But that one straw refusal is the metric I care about.`, counselorNote: "UC PIQs about creative work need to show impact beyond personal growth. The straw refusal is a perfect micro-proof of behavioral impact. 50K downloads and App Store feature validate at scale. 'Feel what a sea turtle feels' shows game design philosophy." },
  { school: "UCSC", year: 2024, promptType: "uc-personal-insight", topic: "UC PIQ — most significant challenge (prompt 5)", openingLine: "I found a species that wasn't in the field guide, and I spent three hours photographing it instead of panicking.", whatWorked: ["Unusual response to the unexpected shows scientific temperament", "Specificity of 'three hours' and 'field guide' grounds it", "Curiosity as a response to confusion"], voiceType: "observational", spikeConnection: "Marine biology field researcher — essay shows scientific curiosity in action", structureType: "chronological", strengthAxis: "surprise", approximateScore: 77, excerpt: `I found a species that wasn't in the field guide, and I spent three hours photographing it instead of panicking. Most people would have moved on. But the best scientists are the ones who don't walk past things they don't recognize.\n\nThe tide pool was in Monterey Bay at 6 AM. The organism turned out to be a known species in an unusual coloration morph. Not a discovery — but the process of treating it as one taught me more about scientific observation than any lab exercise.`, counselorNote: "UC PIQs about challenges work when the challenge is intellectual, not tragic. 'Don't walk past things you don't recognize' is a scientist's creed. The anti-climax (not actually a new species) is honest and shows scientific maturity." },
  { school: "UT Austin", year: 2024, promptType: "supplement-why-us", topic: "Why UT Austin — connecting community music program to Butler School of Music", openingLine: "I taught a nine-year-old to play guitar with three strings because that's all we had.", whatWorked: ["Resource constraint as creative catalyst", "Names Butler School and specific community programs", "Shows music as access, not just art"], voiceType: "narrative", spikeConnection: "Community music teacher — essay connects resourceful teaching to UT's music education program", structureType: "chronological", strengthAxis: "detail", approximateScore: 79, excerpt: `I taught a nine-year-old to play guitar with three strings because that's all we had. Her name was Sofia. She learned three chords in one afternoon and played them for her mother that night. Her mother cried. Three strings, three chords, one afternoon — that's enough to change someone's relationship with music forever.\n\nUT Austin's Butler School of Music doesn't just train performers — it trains people who believe music belongs to everyone. The String Project has been placing university students in under-resourced schools since 1948. I want to be in that lineage.`, counselorNote: "UT Austin supplements work with Texas specificity. Three strings/three chords/one afternoon is beautiful parallel structure. Naming the String Project (since 1948) shows deep research. Sofia's mother crying is earned emotion." },
  { school: "Minnesota", year: 2024, promptType: "supplement-why-us", topic: "Why UMN — connecting farm data to Data Science Institute", openingLine: "The most important dataset I've analyzed smells like cow manure.", whatWorked: ["Sensory opening is unexpected for a data science essay", "Names UMN's Data Science Institute and agricultural connections", "Bridges rural roots to STEM ambition"], voiceType: "observational", spikeConnection: "Agricultural data scientist — essay connects family farm to UMN's data + agriculture intersection", structureType: "thematic", strengthAxis: "surprise", approximateScore: 78, excerpt: `The most important dataset I've analyzed smells like cow manure. My family's dairy farm generates 200 data points per day — milk yield by cow, feed cost per pound, weather correlations, soil pH over time. Nobody was using any of it until I built a dashboard that showed my father which cows were profitable and which were eating money.\n\nUMN's Data Science Institute deploys data science into Minnesota's agricultural economy — the exact intersection I live in. The connection between the university and the state's farming communities is why UMN is my first choice.`, counselorNote: "UMN supplements that show Minnesota-specific connection stand out. 'Smells like cow manure' is an opening no one else is writing. 'Which cows were eating money' is a perfect farm-data detail. Data Science Institute reference shows genuine research." },
  { school: "CU Boulder", year: 2024, promptType: "supplement-why-us", topic: "Why CU Boulder — connecting CubeSat to aerospace engineering and LASP", openingLine: "I held a circuit board that will orbit Earth in six months, and it was smaller than my phone.", whatWorked: ["Scale contrast (palm-sized → orbit) creates wonder", "Names LASP (Laboratory for Atmospheric and Space Physics)", "Shows personal connection to space engineering"], voiceType: "narrative", spikeConnection: "CubeSat developer — essay connects hands-on satellite work to CU's aerospace ecosystem", structureType: "chronological", strengthAxis: "detail", approximateScore: 81, excerpt: `I held a circuit board that will orbit Earth in six months, and it was smaller than my phone. The most important things I build fit in the palm of my hand. The most important places they go are 400 kilometers above my head.\n\nCU Boulder's LASP has built instruments for over 60 NASA missions. The undergraduate research pipeline means I could work on a real space mission as a sophomore, not a senior. That timeline matters when you've been building for space since you were fifteen.`, counselorNote: "CU Boulder aerospace supplements need LASP. 60 NASA missions shows institutional credibility. The palm/400km contrast is elegant. 'Since fifteen' shows the applicant isn't just interested — they've been working." },
  { school: "UGA", year: 2024, promptType: "supplement-why-us", topic: "Why UGA — connecting smart irrigation to agricultural engineering", openingLine: "I saved 40% of the water on a 200-acre farm by listening to the soil instead of the sky.", whatWorked: ["Poetic reframing of sensor technology", "Names UGA's agricultural engineering and extension programs", "Shows generational connection to farming"], voiceType: "observational", spikeConnection: "Smart irrigation engineer — essay connects farm innovation to UGA's agricultural research mission", structureType: "thematic", strengthAxis: "surprise", approximateScore: 78, excerpt: `I saved 40% of the water on a 200-acre farm by listening to the soil instead of the sky. My father checks the weather every morning to decide when to irrigate. My soil moisture sensors check every fifteen minutes. His method is tradition. Mine is data. Together, they saved 40% of our water bill.\n\nUGA's agricultural engineering program sits in the state with the largest farming economy in the Southeast. The Cooperative Extension Service deploys university research directly to farms. I want to scale my irrigation system from one farm to every farm in the state.`, counselorNote: "UGA supplements that show Georgia agricultural connection stand out. Father/data contrast shows respect for tradition alongside innovation. 40% water savings is quantifiable. Extension Service reference shows genuine knowledge of UGA's land-grant mission." },
  { school: "FSU", year: 2024, promptType: "supplement-why-us", topic: "Why FSU — connecting restorative justice program to criminology (#1 ranked)", openingLine: "I reduced suspensions at my high school by 25% without suspending anyone.", whatWorked: ["Paradox opening creates curiosity", "Names FSU's #1 criminology program", "Shows criminal justice reform through practice, not theory"], voiceType: "analytical", spikeConnection: "Restorative justice creator — essay connects school-level reform to FSU's criminology research", structureType: "thematic", strengthAxis: "detail", approximateScore: 79, excerpt: `I reduced suspensions at my high school by 25% without suspending anyone. My restorative justice program replaces punishment with conversation — putting the student who broke the rule and the person affected in the same room to talk about what happened and what should happen next.\n\nFSU's criminology program is ranked #1 in the country because it studies what actually reduces crime, not just what punishes it. My program proves that alternatives work at the school level. FSU would teach me to prove it at the system level.`, counselorNote: "FSU criminology supplements must acknowledge the #1 ranking and show genuine interest in the field. 25% reduction without suspension is a compelling paradox. The school-to-system scaling shows clear academic ambition." },
  { school: "IU", year: 2024, promptType: "supplement-why-us", topic: "Why IU Jacobs — connecting performance experience to conservatory training", openingLine: "The Dvořák Cello Concerto lives in my sternum.", whatWorked: ["Music as physical experience, not just auditory", "Names Jacobs School specifically", "Shows embodied relationship with instrument"], voiceType: "poetic", spikeConnection: "Cellist — essay connects physical experience of music to conservatory-level training", structureType: "thematic", strengthAxis: "place", approximateScore: 82, excerpt: `The Dvořák Cello Concerto lives in my sternum. Not metaphorically — the low C vibrates through the instrument, through my chest, into my bones. When the orchestra joins in the first movement, I don't hear it. I feel it. Music is not something you listen to. It's something that happens to your skeleton.\n\nJacobs isn't just a conservatory — it's the school where performance and scholarship live in the same building. The pedagogy faculty studies how musicians learn, which means the teaching itself is being studied. I want to perform at the highest level AND understand why practice works.`, counselorNote: "IU Jacobs supplements must show both performance level and intellectual curiosity about music. 'Lives in my sternum' is viscerally physical. The performance + scholarship distinction shows the applicant understands what makes Jacobs unique." },
  { school: "UConn", year: 2024, promptType: "supplement-why-us", topic: "Why UConn — connecting medication adherence app to pharmacy program", openingLine: "The hardest part of medicine isn't the science — it's the Tuesday.", whatWorked: ["Abstract concept grounded in a day of the week", "Names UConn's 6-year PharmD program", "Shows pharmacy as a behavioral challenge, not just a chemical one"], voiceType: "analytical", spikeConnection: "Medication adherence app developer — essay connects patient behavior to pharmacy science", structureType: "thematic", strengthAxis: "surprise", approximateScore: 79, excerpt: `The hardest part of medicine isn't the science — it's the Tuesday. The patient who remembers her pills on Monday and forgets on Tuesday. The prescription that works perfectly in the lab but sits unopened on a kitchen counter. My medication adherence app doesn't cure diseases. It cures forgetting.\n\nUConn's 6-year PharmD program starts pharmacy training from day one, not after two years of prerequisites. That head start means I'd be in clinical rotations by junior year — talking to real patients about why Tuesday is harder than Monday.`, counselorNote: "UConn PharmD supplements need the 6-year accelerated timeline reference. 'Cures forgetting' is a clever reframe. The Tuesday metaphor runs through the whole essay. Clinical rotation reference shows genuine understanding of the program structure." },
  { school: "Rutgers", year: 2024, promptType: "supplement-why-us", topic: "Why Rutgers — connecting COVID contact tracing to public health program", openingLine: "I called 2,000 strangers to tell them they might be sick.", whatWorked: ["Scale and vulnerability in one sentence", "Names Rutgers' specific public health programs", "Shows public health as human connection, not just data"], voiceType: "confessional", spikeConnection: "COVID contact tracer — essay connects pandemic response to public health career", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 78, excerpt: `I called 2,000 strangers to tell them they might be sick. Most were scared. Some were angry. One cried and thanked me because I was the only person who'd called her in three days of quarantine. Contact tracing isn't epidemiology — it's empathy delivered by telephone.\n\nRutgers' School of Public Health sits in New Jersey, the state where I traced 2,000 cases. The proximity means I'd study the communities I already served. That's not a supplement line — it's the reason Rutgers is my first choice.`, counselorNote: "Rutgers supplements work when they show NJ-specific connection. 2,000 traces is extraordinary for a high schooler. The crying quarantined woman is the essay's emotional center. 'Empathy delivered by telephone' redefines contact tracing." },
  { school: "Stony Brook", year: 2024, promptType: "supplement-why-us", topic: "Why Stony Brook — connecting math modeling to applied math department", openingLine: "My math model predicted a hospital overflow three weeks before it happened.", whatWorked: ["Concrete, consequential prediction as opening", "Names Stony Brook's applied math research", "Shows math as life-saving, not abstract"], voiceType: "analytical", spikeConnection: "Math modeler — essay connects pandemic prediction to Stony Brook's applied math research", structureType: "chronological", strengthAxis: "detail", approximateScore: 81, excerpt: `My math model predicted a hospital overflow three weeks before it happened. The county emergency manager didn't believe me — I was seventeen. Three weeks later, he called to ask how I did it.\n\nStony Brook's applied math department doesn't treat math as a spectator sport — it deploys models into the world. The connection to Brookhaven National Lab means the computational resources are unlimited. My model works for one county. Stony Brook would give me the tools to make it work for the state.`, counselorNote: "Stony Brook supplements need research specificity. The county manager disbelief → callback is a perfect narrative arc. Brookhaven Lab reference shows genuine research awareness. County-to-state scaling shows clear academic trajectory." },
  { school: "UMass", year: 2024, promptType: "supplement-why-us", topic: "Why UMass — connecting open-source accessibility tool to CS program", openingLine: "500 strangers on GitHub think my code is worth starring.", whatWorked: ["Community validation as opening metric", "Names UMass CS and specific research areas", "Shows open-source contribution as a value, not just a skill"], voiceType: "analytical", spikeConnection: "Open-source developer — essay connects community software to UMass's CS research", structureType: "thematic", strengthAxis: "detail", approximateScore: 79, excerpt: `500 strangers on GitHub think my code is worth starring. My accessibility testing tool helps developers find and fix issues that prevent disabled users from navigating websites. I built it alone. A developer in Brazil submitted the first pull request. Now there are 23 contributors from 9 countries.\n\nUMass CS is a top-20 program that still feels like a community, not a factory. The emphasis on collaborative research matches how I already work — my best code was written by someone I've never met, fixing a bug I didn't know existed.`, counselorNote: "UMass CS supplements need specificity beyond rankings. 500 GitHub stars and 23 contributors from 9 countries prove community impact. 'Best code written by someone I've never met' captures open-source philosophy. Collaborative research emphasis shows fit." },
  { school: "USF", year: 2024, promptType: "supplement-why-us", topic: "Why USF — connecting Moffitt Cancer Center research to biomedical sciences", openingLine: "I pipetted the 200th sample and remembered that each tube was someone's grandmother.", whatWorked: ["Humanizes lab work immediately", "Names Moffitt Cancer Center partnership", "Shows research as service, not resume-building"], voiceType: "confessional", spikeConnection: "Cancer researcher — essay connects lab work to USF's Moffitt partnership", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 77, excerpt: `I pipetted the 200th sample and remembered that each tube was someone's grandmother. Cancer research doesn't feel heroic in the moment — it feels like Tuesday at 3 PM, counting amyloid plaques under fluorescent lights, hoping that sample #201 shows something #200 didn't.\n\nUSF's partnership with Moffitt Cancer Center means undergraduate researchers work in the same building where patients receive treatment. The proximity is the point — it's impossible to forget why the pipetting matters when the answer is one floor above you.`, counselorNote: "USF supplements need the Moffitt partnership. '200th sample, someone's grandmother' is the emotional center. 'One floor above you' connects lab to patient care. The Tuesday-at-3-PM detail captures research reality." },
  { school: "Wellesley", year: 2024, promptType: "supplement-why-us", topic: "Why Wellesley — connecting financial literacy to women's empowerment mission", openingLine: "I taught 500 girls what a Roth IRA is, and most of them had never heard the words.", whatWorked: ["Gender wealth gap made concrete through a number", "Names Wellesley's specific programs and mission", "Shows financial literacy as feminist act"], voiceType: "analytical", spikeConnection: "Girls' financial literacy founder — essay connects economic empowerment to Wellesley's women's mission", structureType: "thematic", strengthAxis: "detail", approximateScore: 82, excerpt: `I taught 500 girls what a Roth IRA is, and most of them had never heard the words. The gender wealth gap doesn't start with unequal pay — it starts with unequal knowledge. Nobody teaches girls about compound interest. Somebody should.\n\nWellesley doesn't just educate women — it produces women who change the systems that excluded them. The economics department's emphasis on inequality research matches what I've been doing at kitchen tables for two years: making financial power accessible to people who were never invited to the conversation.`, counselorNote: "Wellesley supplements must connect to women's empowerment. 500 girls is scale. 'Unequal knowledge before unequal pay' is a genuine insight about the wealth gap. 'Kitchen tables' grounds the academic in the personal." },
  { school: "Bowdoin", year: 2024, promptType: "supplement-why-us", topic: "Why Bowdoin — connecting environmental conservation to coastal Maine identity", openingLine: "I stood in a salt marsh at low tide and felt the mud try to keep my boots.", whatWorked: ["Visceral sensory opening grounds reader in place", "Names Bowdoin's environmental studies and coastal programs", "Shows conservation through embodied experience"], voiceType: "poetic", spikeConnection: "Salt marsh conservationist — essay connects land protection to Bowdoin's coastal Maine identity", structureType: "thematic", strengthAxis: "place", approximateScore: 81, excerpt: `I stood in a salt marsh at low tide and felt the mud try to keep my boots. That's what marshes do — they hold on. They hold water, they hold sediment, they hold carbon, they hold coastlines together. My campaign to protect the Scarborough Marsh resulted in a municipal conservation designation because I convinced the town board that holding on is the most radical act of resistance.\n\nBowdoin sits on the Maine coast, surrounded by the ecosystems I've been protecting. The environmental studies program's emphasis on field research means I'd study salt marshes from inside them, not from a textbook.`, counselorNote: "Bowdoin supplements need coastal Maine specificity. The mud-trying-to-keep-boots opening is viscerally physical. 'Holding on as resistance' is a sophisticated environmental philosophy. Municipal conservation designation proves real impact." },
  { school: "CMC", year: 2024, promptType: "supplement-why-us", topic: "Why CMC — connecting policy institute to government focus", openingLine: "I wrote 15 policy briefs and two state legislators quoted them.", whatWorked: ["Immediate proof of real-world impact", "Names CMC's specific government programs and research institutes", "Shows policy writing as action, not theory"], voiceType: "analytical", spikeConnection: "Student policy institute founder — essay connects real policy impact to CMC's government focus", structureType: "thematic", strengthAxis: "detail", approximateScore: 83, excerpt: `I wrote 15 policy briefs and two state legislators quoted them. Not because I'm a good writer — because I wrote about water rights in a drought state, and nobody else was doing the research at a level elected officials could cite.\n\nCMC exists for students who want to be in the room where decisions are made. The Rose Institute of State and Local Government produces the kind of nonpartisan analysis that I've been producing from my dining room table. The difference: Rose has the data, the faculty, and the credibility to make the analysis stick.`, counselorNote: "CMC supplements must show government engagement. Two legislators quoting student work is extraordinary. Rose Institute is the right name to drop. 'In the room where decisions are made' captures CMC's identity." },
  { school: "Middlebury", year: 2024, promptType: "supplement-why-us", topic: "Why Middlebury — connecting Arabic language to language immersion identity", openingLine: "The Arabic word for 'thirst' has three forms, and English is missing two-thirds of the conversation.", whatWorked: ["Linguistic insight as cultural revelation", "Names Middlebury Language Schools and specific programs", "Shows language as a way of thinking, not just speaking"], voiceType: "analytical", spikeConnection: "Arabic linguist + documentarian — essay connects language study to Middlebury's immersion model", structureType: "thematic", strengthAxis: "surprise", approximateScore: 83, excerpt: `The Arabic word for "thirst" has three forms — physical, spiritual, and political. English has one. That means English speakers are having one-third of the conversation about water, and in a world where water wars are real, the missing two-thirds matters.\n\nMiddlebury's Language Schools are famous for total immersion — no English for seven weeks. My four years of Arabic prepared me for the language. My summer in Morocco prepared me for the silence between the words. Middlebury would teach me the rest.`, counselorNote: "Middlebury supplements must reference language immersion. The triple-thirst concept is genuinely brilliant — it shows that language shapes thought, which is Middlebury's foundational belief. Morocco reference grounds it in real experience." },
  { school: "Carleton", year: 2024, promptType: "supplement-why-us", topic: "Why Carleton — connecting original proofs to math department's undergraduate focus", openingLine: "I spent three weeks on a proof that turned out to be wrong, and it was the best three weeks of my life.", whatWorked: ["Celebrates failure as intellectual joy", "Names Carleton's math department and specific culture", "Shows mathematical temperament, not just mathematical skill"], voiceType: "confessional", spikeConnection: "Math researcher — essay connects the joy of mathematical struggle to Carleton's intellectual culture", structureType: "thematic", strengthAxis: "vulnerability", approximateScore: 82, excerpt: `I spent three weeks on a proof that turned out to be wrong, and it was the best three weeks of my life. The problem was in combinatorics — counting the ways to tile a hexagonal grid. My approach was original. It was also flawed. But the flaw was more interesting than the solution would have been.\n\nCarleton's math department has more undergraduate math majors per capita than almost any school in the country. The culture isn't competitive — it's curious. Comps (the senior capstone) requires original work, not just synthesis. That's where I want to be: doing math that hasn't been done, even if it turns out to be wrong.`, counselorNote: "Carleton supplements must show intellectual curiosity above achievement. 'Wrong proof as best three weeks' is exactly the temperament Carleton selects for. Naming Comps shows genuine research. 'Curious, not competitive' captures the culture." },
  { school: "Colby", year: 2024, promptType: "supplement-why-us", topic: "Why Colby — connecting invasive species mapping to environmental focus", openingLine: "I mapped invasive species across 30 Maine lakes, and the pattern told a story nobody wanted to hear.", whatWorked: ["Scale + unwelcome truth creates tension", "Names Colby's environmental programs and DavisConnects", "Shows environmental science as politically charged"], voiceType: "observational", spikeConnection: "Invasive species researcher — essay connects field ecology to Colby's environmental studies", structureType: "thematic", strengthAxis: "detail", approximateScore: 80, excerpt: `I mapped invasive species across 30 Maine lakes, and the pattern told a story nobody wanted to hear. The lakes closest to boat launches had the most milfoil. The solution is obvious — inspection stations — but the tourism industry doesn't want to slow down launches. Science tells you what's true. Politics decides what to do about it.\n\nColby sits on a lake in Maine. The environmental studies program doesn't study the environment in the abstract — it studies the environment outside the window. DavisConnects would let me take my mapping project global, comparing Maine's invasive patterns to freshwater ecosystems worldwide.`, counselorNote: "Colby supplements need Maine environmental specificity. 30 lakes is massive geographic scope. The science-vs-politics tension shows maturity. DavisConnects reference shows research beyond the department." },
  { school: "Davidson", year: 2024, promptType: "supplement-why-us", topic: "Why Davidson — connecting voter turnout to honor code culture", openingLine: "I registered 1,200 first-time voters and learned that democracy is a habit, not a right.", whatWorked: ["Scale + philosophical insight in one line", "Names Davidson's honor code and civic engagement programs", "Shows political engagement as character, not partisanship"], voiceType: "analytical", spikeConnection: "Voter registration organizer — essay connects civic engagement to Davidson's honor culture", structureType: "thematic", strengthAxis: "detail", approximateScore: 80, excerpt: `I registered 1,200 first-time voters and learned that democracy is a habit, not a right. A right is something you have. A habit is something you practice. The 82-year-old woman who told me she'd never voted because nobody ever asked — she had the right for 64 years. She needed the habit.\n\nDavidson's honor code isn't about rules — it's about trust. Students take unproctored exams because the community trusts them. That's the same principle behind my voter registration work: democracy functions on trust, and trust is built one conversation at a time.`, counselorNote: "Davidson supplements must connect to the honor code. 1,200 voters is extraordinary scale. The 82-year-old's 64-year gap is devastating context. Connecting honor code to democratic trust shows genuine philosophical thinking." },
  { school: "Grinnell", year: 2024, promptType: "supplement-why-us", topic: "Why Grinnell — connecting rural food insecurity research to social justice mission", openingLine: "I drew a map of food deserts in Iowa and discovered my own town was one.", whatWorked: ["Self-discovery through data is honest", "Names Grinnell's specific social justice programs", "Shows rural perspective rarely seen in college essays"], voiceType: "confessional", spikeConnection: "Rural food researcher — essay connects personal discovery to Grinnell's justice-oriented curriculum", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 80, excerpt: `I drew a map of food deserts in Iowa and discovered my own town was one. The nearest grocery store is 23 miles away. We have two gas stations and a Dollar General. I'd lived there my whole life and never called it a food desert because when you grow up in one, it's just called home.\n\nGrinnell's self-governance model and social justice focus match what I've been doing with census data and a laptop: asking uncomfortable questions about the places we live. The sociology department's emphasis on community-based research means I'd study food insecurity where it lives, not where it's convenient.`, counselorNote: "Grinnell supplements must show social justice engagement. 'Grew up in a food desert and called it home' is one of the most honest lines I've read. 23 miles to a grocery store is specific. Self-governance reference shows genuine Grinnell knowledge." },
  { school: "Hamilton", year: 2024, promptType: "supplement-why-us", topic: "Why Hamilton — connecting Scholastic Gold Medal writing to open curriculum", openingLine: "I wrote a story about a gas station attendant and my teacher said 'you made me care about someone I drive past every day.'", whatWorked: ["Teacher's quote captures writing's purpose perfectly", "Names Hamilton's open curriculum and writing concentration", "Shows literary sensibility, not just technical skill"], voiceType: "narrative", spikeConnection: "Fiction writer — essay connects literary recognition to Hamilton's open curriculum and writing tradition", structureType: "thematic", strengthAxis: "detail", approximateScore: 83, excerpt: `I wrote a story about a gas station attendant and my teacher said "you made me care about someone I drive past every day." That sentence is why I write. Not to express myself — to expand someone else's world by one person they'd never otherwise notice.\n\nHamilton's open curriculum means I wouldn't have to choose between writing and everything else I care about — philosophy, economics, Japanese. The writing concentration provides structure within freedom. That's what a good sentence does too: structure within freedom.`, counselorNote: "Hamilton supplements must reference the open curriculum. The teacher's quote is the essay's thesis delivered by someone else — more powerful than self-declaration. 'Structure within freedom' applies to both curriculum and prose. Writing concentration reference shows genuine research." },
  { school: "Haverford", year: 2024, promptType: "supplement-why-us", topic: "Why Haverford — connecting peer mediation to honor code culture", openingLine: "I sat between two people who hated each other and asked them to listen before responding.", whatWorked: ["Mediation as practice, shown through action", "Names Haverford's honor code and Quaker values", "Shows that peace requires patience, not just principles"], voiceType: "observational", spikeConnection: "Peer mediator — essay connects conflict resolution practice to Haverford's consensus-based culture", structureType: "thematic", strengthAxis: "vulnerability", approximateScore: 81, excerpt: `I sat between two people who hated each other and asked them to listen before responding. That's it. That's the whole technique. Forty conflicts resolved, and the secret is always the same: people fight because they feel unheard, and the cure for feeling unheard is someone who sits still long enough to prove they're listening.\n\nHaverford's honor code runs on consensus, not majority rule. Students resolve conflicts through dialogue, not discipline. My mediation program does the same thing at a smaller scale. Haverford would teach me to do it at the scale of a community.`, counselorNote: "Haverford supplements must connect to the honor code and Quaker values. 40 conflicts resolved is significant. 'Sits still long enough' captures mediation philosophy. Consensus-not-majority distinction shows genuine understanding of Haverford's governance." },
  { school: "Vassar", year: 2024, promptType: "supplement-why-us", topic: "Why Vassar — connecting original play to progressive artistic culture", openingLine: "I directed a scene where an actor had to come out on stage, and the audience went completely still.", whatWorked: ["Silence as the measure of impact", "Names Vassar's theater program and progressive values", "Shows theater as social practice"], voiceType: "observational", spikeConnection: "Playwright/director — essay connects theatrical risk-taking to Vassar's progressive artistic tradition", structureType: "thematic", strengthAxis: "place", approximateScore: 81, excerpt: `I directed a scene where an actor had to come out on stage, and the audience went completely still. Theater is the only place where silence is louder than applause. The play I wrote about transgender experiences was performed at a regional festival, and the silence during that scene told me everything about what art can do that arguments can't.\n\nVassar's theater program exists within a college that has always been ahead of its time — the first of the Seven Sisters to go co-ed, one of the first to offer gender studies. My work fits here because Vassar has always believed that art and progress are the same conversation.`, counselorNote: "Vassar supplements must show progressive values and artistic risk. 'Silence louder than applause' is a beautiful definition of impactful theater. Seven Sisters history reference shows institutional knowledge. 'Art and progress are the same conversation' is a strong thesis." },
  { school: "Colgate", year: 2024, promptType: "supplement-why-us", topic: "Why Colgate — connecting philosophy podcast to intellectual culture", openingLine: "I asked 15 philosophy professors 'what is the meaning of life?' and the best answer was 'that's not even a well-formed question.'", whatWorked: ["Meta-philosophical humor as opening", "Names Colgate's specific intellectual programs", "Shows intellectual curiosity as a lifestyle, not a major"], voiceType: "analytical", spikeConnection: "Philosophy podcaster — essay connects public intellectual engagement to Colgate's liberal arts culture", structureType: "thematic", strengthAxis: "surprise", approximateScore: 80, excerpt: `I asked 15 philosophy professors "what is the meaning of life?" and the best answer was "that's not even a well-formed question." Professor Ramirez at Georgetown said that. It changed how I think about everything — the best answers start by questioning the question.\n\nColgate's liberal arts core doesn't let you hide in one department. The mandatory distribution requirements mean every student becomes a generalist before they become a specialist. My podcast interviews professors across 15 disciplines because I believe the most interesting ideas live at the intersections. Colgate is built on the same belief.`, counselorNote: "Colgate supplements must show intellectual breadth. 'Not a well-formed question' is the perfect philosophy anecdote. Naming a real professor adds credibility. 'Ideas live at intersections' captures liberal arts philosophy. Mandatory distribution reference shows genuine research." },
  { school: "Barnard", year: 2024, promptType: "supplement-why-us", topic: "Why Barnard — connecting menstrual equity advocacy to feminist mission", openingLine: "I stood in front of a school board with a box of tampons and asked why they provide toilet paper for free but not this.", whatWorked: ["Bold, specific opening with visual image", "Names Barnard's feminist tradition and Columbia cross-registration", "Shows advocacy through direct action"], voiceType: "confessional", spikeConnection: "Menstrual equity advocate — essay connects policy change to Barnard's activist tradition", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 82, excerpt: `I stood in front of a school board with a box of tampons and asked why they provide toilet paper for free but not this. Three districts later adopted menstrual product policies. Equity is about the things nobody wants to talk about — and the courage to put them on the table. Literally.\n\nBarnard's feminist tradition isn't historical — it's active. The Athena Center for Leadership does exactly what my advocacy does: takes women's issues that are treated as marginal and proves they're central. Three policy changes in three districts isn't activism. It's evidence.`, counselorNote: "Barnard supplements must connect to feminist activism. The tampon-at-school-board image is unforgettable. Three district policy changes proves real impact. 'Literally on the table' is perfect deadpan. Athena Center reference shows genuine research." },
  { school: "Smith", year: 2024, promptType: "supplement-why-us", topic: "Why Smith — connecting solar water heater engineering to Picker program", openingLine: "I gave a grandmother in Honduras her first warm shower in her own home.", whatWorked: ["Human impact as opening, not technical achievement", "Names Smith's Picker Engineering Program (only women's college with ABET)", "Shows engineering as dignity, not innovation"], voiceType: "narrative", spikeConnection: "Engineers Without Borders project lead — essay connects global engineering to Smith's unique program", structureType: "chronological", strengthAxis: "vulnerability", approximateScore: 81, excerpt: `I gave a grandmother in Honduras her first warm shower in her own home. She'd been walking two miles to a neighbor's house for hot water. My solar water heater cost $200 and runs on sunlight. It gave her back two hours every day. Engineering didn't change her life — it gave her back the time that was always hers.\n\nSmith's Picker Engineering Program is the only ABET-accredited engineering program at a women's college. That matters because engineering needs women who design for women — and the grandmother in Honduras had been walking those two miles because no engineer had ever asked her what she needed.`, counselorNote: "Smith supplements must reference Picker and the women's college distinction. The grandmother's two-hour daily recovery is quantifiable and emotional. $200 cost shows appropriate technology. 'No engineer asked what she needed' is the essay's thesis." },
  { school: "CC", year: 2024, promptType: "supplement-why-us", topic: "Why Colorado College — connecting microplastics research to block plan", openingLine: "I found 47 microplastic particles in a liter of snowmelt from what I thought was pristine water.", whatWorked: ["'Pristine' water contamination creates shock", "Names CC's block plan specifically", "Shows environmental research at altitude — literally"], voiceType: "observational", spikeConnection: "Microplastics researcher — essay connects high-altitude field research to CC's block plan and outdoor culture", structureType: "thematic", strengthAxis: "detail", approximateScore: 80, excerpt: `I found 47 microplastic particles in a liter of snowmelt from what I thought was pristine water. There is no "away" when you throw things away — even at 12,000 feet.\n\nCC's block plan means studying one subject at a time, for three and a half weeks, with total immersion. Environmental research needs immersion — you can't understand a mountain stream by visiting it for an hour between other classes. The block plan would let me spend a full block in the field, collecting the data that proves pristine doesn't mean clean.`, counselorNote: "CC supplements MUST reference the block plan — it's the most distinctive feature. 47 particles in 'pristine' water is the essay's hook. 'No away at 12,000 feet' is concise and devastating. Block plan as fieldwork enabler is the right connection." },
  { school: "Oberlin", year: 2024, promptType: "supplement-why-us", topic: "Why Oberlin — connecting climate-change symphony to Conservatory + College dual degree", openingLine: "I composed a symphony movement that sounds like a glacier melting.", whatWorked: ["Synesthesia between music and climate creates intrigue", "Names Oberlin's double-degree program", "Shows arts as activism"], voiceType: "poetic", spikeConnection: "Composer/activist — essay connects musical composition to environmental advocacy through Oberlin's dual program", structureType: "thematic", strengthAxis: "surprise", approximateScore: 82, excerpt: `I composed a symphony movement that sounds like a glacier melting. Cellos descending in quarter tones. Percussion like cracking ice. A silence in the middle that lasts exactly eight seconds — the time it takes for a calved iceberg to hit the water. Music makes people feel what data can't.\n\nOberlin is the only school where I can earn degrees in both composition and environmental studies without either being an afterthought. The Conservatory and the College share a campus and a commitment to social justice. My glacier symphony isn't just music. It's a policy argument performed in C minor.`, counselorNote: "Oberlin double-degree supplements must show why both degrees matter. 'Eight seconds of silence' is exquisite compositional detail. 'Policy argument in C minor' is the essay's best line. Conservatory + College + social justice connection shows genuine Oberlin understanding." },
];

// ============================================================================
// Lookup Functions
// ============================================================================

/**
 * Find essay examples by prompt type.
 * @param promptType - e.g., "common-app-1", "supplement-why-us", "supplement-community"
 */
export function findByPrompt(promptType: string): EssayExample[] {
  return ESSAY_EXAMPLES_BANK.filter(
    (e) => e.promptType.toLowerCase() === promptType.toLowerCase()
  );
}

/**
 * Find essay examples by school name (case-insensitive, partial match).
 * @param school - e.g., "MIT", "Stanford", "Yale"
 */
export function findBySchool(school: string): EssayExample[] {
  const query = school.toLowerCase();
  return ESSAY_EXAMPLES_BANK.filter((e) =>
    e.school.toLowerCase().includes(query)
  );
}

/**
 * Find essay examples by voice type.
 * @param voiceType - "observational" | "confessional" | "analytical" | "narrative" | "poetic"
 */
export function findByVoice(voiceType: string): EssayExample[] {
  return ESSAY_EXAMPLES_BANK.filter(
    (e) => e.voiceType.toLowerCase() === voiceType.toLowerCase()
  );
}

/**
 * Find essay examples by topic keyword (searches topic, excerpt, and counselorNote).
 * @param keyword - search term, e.g., "food", "music", "immigration"
 */
export function findByTopic(keyword: string): EssayExample[] {
  const query = keyword.toLowerCase();
  return ESSAY_EXAMPLES_BANK.filter(
    (e) =>
      e.topic.toLowerCase().includes(query) ||
      e.excerpt.toLowerCase().includes(query) ||
      e.counselorNote.toLowerCase().includes(query) ||
      e.openingLine.toLowerCase().includes(query)
  );
}

/**
 * Find essay examples at or above a minimum score.
 * @param minScore - minimum approximateScore (0-100)
 */
export function findByScore(minScore: number): EssayExample[] {
  return ESSAY_EXAMPLES_BANK.filter((e) => e.approximateScore >= minScore);
}

/**
 * Find essay examples by structure type.
 * @param structureType - "chronological" | "thematic" | "circular" | "fragmented" | "in-media-res"
 */
export function findByStructure(structureType: string): EssayExample[] {
  return ESSAY_EXAMPLES_BANK.filter(
    (e) => e.structureType.toLowerCase() === structureType.toLowerCase()
  );
}

/**
 * Find essay examples by strength axis.
 * @param axis - "place" | "detail" | "vulnerability" | "surprise"
 */
export function findByStrengthAxis(axis: string): EssayExample[] {
  return ESSAY_EXAMPLES_BANK.filter(
    (e) => e.strengthAxis.toLowerCase() === axis.toLowerCase()
  );
}

/**
 * Get a random selection of essay examples.
 * @param count - number of examples to return (default 5)
 */
export function getRandomExamples(count: number = 5): EssayExample[] {
  const shuffled = [...ESSAY_EXAMPLES_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get all unique schools represented in the bank.
 */
export function getSchoolsList(): string[] {
  return Array.from(new Set(ESSAY_EXAMPLES_BANK.map((e) => e.school))).sort();
}

/**
 * Get summary statistics about the essay bank.
 */
export function getBankStats(): {
  totalEssays: number;
  byPromptType: Record<string, number>;
  byVoice: Record<string, number>;
  bySchool: Record<string, number>;
  byStructure: Record<string, number>;
  byStrengthAxis: Record<string, number>;
  averageScore: number;
  scoreRange: { min: number; max: number };
} {
  const byPromptType: Record<string, number> = {};
  const byVoice: Record<string, number> = {};
  const bySchool: Record<string, number> = {};
  const byStructure: Record<string, number> = {};
  const byStrengthAxis: Record<string, number> = {};
  let totalScore = 0;
  let minScore = 100;
  let maxScore = 0;

  for (const e of ESSAY_EXAMPLES_BANK) {
    byPromptType[e.promptType] = (byPromptType[e.promptType] || 0) + 1;
    byVoice[e.voiceType] = (byVoice[e.voiceType] || 0) + 1;
    bySchool[e.school] = (bySchool[e.school] || 0) + 1;
    byStructure[e.structureType] = (byStructure[e.structureType] || 0) + 1;
    byStrengthAxis[e.strengthAxis] = (byStrengthAxis[e.strengthAxis] || 0) + 1;
    totalScore += e.approximateScore;
    if (e.approximateScore < minScore) minScore = e.approximateScore;
    if (e.approximateScore > maxScore) maxScore = e.approximateScore;
  }

  return {
    totalEssays: ESSAY_EXAMPLES_BANK.length,
    byPromptType,
    byVoice,
    bySchool,
    byStructure,
    byStrengthAxis,
    averageScore: Math.round(totalScore / ESSAY_EXAMPLES_BANK.length),
    scoreRange: { min: minScore, max: maxScore },
  };
}
