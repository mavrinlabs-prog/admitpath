/**
 * 4-Axis Voice Rubric — College Essay Guy framework, heuristic, no LLM call.
 *
 * Based on Ethan Sawyer's (College Essay Guy) 4-quality voice rubric:
 *   PLACE — DETAIL — VULNERABILITY — SURPRISE
 *
 * The personal essay's job is to make the reader hear ONE specific
 * 17-year-old. These 4 axes quantify whether the writing achieves that:
 *
 *   1. Place (CEG: "Where are you?") — Does the essay ground the reader
 *      in a physical location? Concrete proper nouns, sensory details,
 *      named settings vs abstract generalities ("growth", "passion").
 *
 *   2. Detail (CEG: "What do you notice?") — Sentence-level craft:
 *      specific objects, textures, dialogue, numbers. Also measured via
 *      sentence-length variance — strong essays mix short punches with
 *      longer reflective sentences. Monotone cadence reads AI-generated.
 *
 *   3. Vulnerability (CEG: "What are you feeling?") — Does the writer
 *      show honest self-disclosure? Admission-of-doubt markers ("I was
 *      wrong", "I didn't realize"), first-person emotional language,
 *      willingness to sit in discomfort rather than resolve everything.
 *
 *   4. Surprise (CEG: "What unexpected connection can you make?") —
 *      Does the essay take a position, hold a tension, or surface a
 *      contradiction the reader didn't see coming? Or does it deliver
 *      platitudes and expected conclusions?
 *
 * Each axis returns 0-100. The composite (mean) lands on the same
 * scale. Feedback is ordered most-impactful first.
 *
 * Reference: Ethan Sawyer, "College Essay Essentials" (Sourcebooks, 2016).
 */

export type VoiceAxis = "place" | "detail" | "vulnerability" | "surprise";

export type SixDimension = "authenticity" | "insight" | "specificity" | "storytelling" | "impact" | "voice";

export type VoiceRubricResult = {
  scores: Record<VoiceAxis, number>;
  composite: number;
  /** 6-dimension essay scores mapped from the 4-axis heuristic + 2 new axes. */
  sixDimensionScores: Record<SixDimension, number>;
  sixDimensionComposite: number;
  feedback: string[];
  details: {
    properNounCount: number;
    abstractWordHits: string[];
    sensoryHits: string[];
    avgSentenceLen: number;
    sentenceLenStdev: number;
    firstPersonRatio: number;
    admissionMarkers: string[];
    contrastMarkers: string[];
    metricCount: number;
    sentenceVarietyBonus: boolean;
    vulnerabilityDepthScore: number;
    impactSignals: number;
    voiceSignals: { firstPersonUsage: number; sentenceVariety: number; uniqueWordRatio: number };
  };
};

const ABSTRACT_WORDS = [
  "passion", "passionate", "journey", "growth", "potential", "endeavor",
  "perseverance", "resilience", "drive", "determination", "ambitious",
  "limitless", "boundless", "unwavering", "wholeheartedly", "tirelessly",
  // Expanded: common filler abstractions seen in weak personal statements
  "meaningful", "impactful", "life-changing", "eye-opening", "incredible",
  "amazing", "profound", "invaluable", "remarkable", "truly",
  "deeply", "immensely", "tremendously", "greatly", "significantly",
  "strive", "aspire", "endeavored", "overcame", "thrived",
  "holistic", "well-rounded", "diverse perspectives", "global citizen",
  "make a difference", "change the world", "give back",
];

/** Sensory / place-grounding words that signal concrete physical setting. */
const SENSORY_WORDS = [
  // Smell
  "smell", "smelled", "scent", "stench", "fragrance", "odor", "aroma",
  // Taste
  "taste", "tasted", "bitter", "sweet", "sour", "salty", "savory", "bland",
  // Touch/texture
  "felt", "touch", "touched", "rough", "smooth", "wet", "dry", "sticky",
  "sharp", "soft", "velvet", "gritty", "slippery", "prickly", "calloused",
  // Sound
  "heard", "sound", "noise", "loud", "quiet", "crunch", "whisper", "hum",
  "buzz", "clatter", "thud", "crack", "murmur", "rustle", "squeak",
  "splash", "sizzle", "creak", "rumble", "echo",
  // Sight/light
  "bright", "dark", "glow", "shadow", "glint", "shimmer", "flicker",
  "blur", "gleam", "dim", "haze", "silhouette", "translucent",
  // Temperature
  "warm", "cold", "freezing", "sweltering", "damp", "humid", "chill",
  // Physical spaces
  "floor", "ceiling", "wall", "door", "window", "kitchen", "bedroom",
  "hallway", "street", "corner", "bench", "table", "chair", "porch",
  "staircase", "sidewalk", "driveway", "garage", "attic", "basement",
  "parking lot", "cafeteria", "gymnasium", "locker room", "courtyard",
  // Colors — signal vivid visual detail (art, descriptive writing)
  "blue", "red", "yellow", "green", "white", "black", "gray", "grey",
  "golden", "silver", "crimson", "ivory", "copper", "bronze", "scarlet",
  // Materials/textures
  "canvas", "oil", "paint", "ink", "clay", "glass", "steel", "concrete",
  "leather", "linen", "cotton", "wood", "marble", "stone", "grass",
  "stained", "faded", "worn", "cracked", "peeling", "rusted",
];

const ADMISSION_OF_DOUBT = [
  "i was wrong", "i didn't realize", "i didn't know", "i still don't",
  "i had to admit", "i changed my mind", "i used to", "i was afraid",
  "i was embarrassed", "i was naive", "i didn't understand",
  // Expanded: deeper self-disclosure markers
  "i failed", "i couldn't", "i struggled", "i froze", "i panicked",
  "i regret", "i should have", "i wish i had", "i pretended",
  "i lied", "i hid", "i avoided", "i ran away", "i gave up",
  "i wasn't ready", "i wasn't good enough", "i felt like a fraud",
  "i didn't belong", "i faked", "i was selfish", "i was jealous",
  "i hurt", "i lost", "it was my fault", "i was the problem",
  // Honest self-assessment — not performing emotion, reporting it
  "i didn't feel", "i felt like", "i wasn't brave", "i wasn't sure",
  // Empathic / responsibility vulnerability — taking on burdens beyond one's years
  "i translated", "i had to translate", "i never wanted",
  "i decided", "i watched", "i stood", "i carried",
  "that's when i decided", "that's when i knew",
];

const CONTRAST_MARKERS = [
  "but ", "however", "yet ", "instead", "on the other hand",
  "until", "though ", "although", "actually", "in fact", "turns out",
  "i thought", "i assumed",
  // Expanded: more surprise/tension markers
  "what i didn't expect", "what surprised me", "the irony",
  "paradox", "contradiction", "i never imagined", "little did i know",
  "it wasn't until", "only later", "looking back", "in hindsight",
  "the truth was", "the real reason", "beneath the surface",
  "what no one saw", "what i hid", "the part i left out",
  // Refutation / negation contrast — natural speech patterns
  "not because", "not the end", "not just", "that's not",
  "he's wrong", "she's wrong", "they're wrong", "it's not",
  "isn't the", "wasn't the", "doesn't mean", "didn't mean",
  "it looks like", "what it actually",
];

/** Regex patterns that detect numeric/metric specificity in essays. */
const METRIC_PATTERNS = [
  /\d+%/,                            // "85%"
  /\breduced\s+by\s+\d+/i,           // "reduced by 30"
  /\bgrew\s+from\s+\d+\s+to\s+\d+/i, // "grew from 5 to 40"
  /\b\d+\s*(?:members|people|students|participants|attendees|volunteers|families|sensors?|units?)\b/i,
  /[\$₹£€]\d[\d,]*/,   // "$500", "₹2,400", "£100", "€200"
  /\b\d+(?:st|nd|rd|th)\s+(?:place|percentile|rank)/i, // "1st place"
  /\b\d+\s*(?:hours?|weeks?|months?|years?|minutes?|seconds?|days?)\b/i, // "200 hours", "47 minutes"
  /\braised\s+\$?\d/i,               // "raised $2000"
  /\b\d+\.\d+\s*GPA\b/i,            // "3.95 GPA"
];

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function countProperNouns(text: string): number {
  // Crude: capitalized word in middle of a sentence (not first word).
  const matches = text.match(/(?<=\s)[A-Z][a-z]+(?:\s[A-Z][a-z]+)?/g) ?? [];
  return matches.length;
}

function stdev(nums: number[]): number {
  if (nums.length === 0) return 0;
  const m = nums.reduce((s, n) => s + n, 0) / nums.length;
  const variance = nums.reduce((s, n) => s + (n - m) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

export function scoreVoice(text: string): VoiceRubricResult {
  const lower = text.toLowerCase();
  const sentences = splitSentences(text);
  const wordCount = (text.trim().match(/\S+/g) ?? []).length;

  // --- 1. PLACE (CEG axis 1: "Where are you?") ---
  // Does the essay ground the reader in a physical setting? Proper nouns,
  // sensory words, and concrete locations signal a real place vs abstraction.
  const properNounCount = countProperNouns(text);
  const sensoryHits = SENSORY_WORDS.filter((w) => lower.includes(w));
  // Match numbers: standard \b\d+\b plus currency-prefixed numbers (₹2,400, $500)
  const numberCount = (text.match(/(?:\b|(?<=[\$₹£€]))\d[\d,]*/g) ?? []).length;

  // Metric specificity — numbers with context (percentages, growth, counts)
  const metricCount = METRIC_PATTERNS.reduce(
    (acc, re) => acc + (text.match(new RegExp(re.source, re.flags + "g")) ?? []).length,
    0
  );

  // Abstract-word context check: only penalize standalone abstractions.
  // If the abstract word appears in a sentence with a specific example
  // (proper noun, number, or sensory word nearby), it's grounded — skip penalty.
  const abstractWordHits: string[] = [];
  for (const word of ABSTRACT_WORDS) {
    if (!lower.includes(word)) continue;
    // Find the sentence containing this abstract word
    const containingSentence = sentences.find((s) => s.toLowerCase().includes(word));
    if (!containingSentence) { abstractWordHits.push(word); continue; }
    const sentLower = containingSentence.toLowerCase();
    // Check if the sentence also has a concrete anchor (proper noun, number, sensory)
    const hasProperNoun = /(?<=\s)[A-Z][a-z]+/.test(containingSentence);
    const hasNumber = /\b\d+\b/.test(containingSentence);
    const hasSensory = SENSORY_WORDS.some((sw) => sentLower.includes(sw));
    const hasComparison = /compared to|unlike|more than|less than|rather than/i.test(containingSentence);
    if (!hasProperNoun && !hasNumber && !hasSensory && !hasComparison) {
      abstractWordHits.push(word); // standalone abstract — penalize
    }
    // else: grounded by context — no penalty
  }

  // Anti-inflation: start at 30 (not 40). A 90+ should require exceptional
  // grounding — multiple proper nouns, rich sensory language, zero abstractions.
  // T20-admitted essays typically score 85+ only when the reader can SEE the scene.
  let place = 30 + Math.min(22, properNounCount * 3) + Math.min(14, numberCount * 3);
  place += Math.min(20, sensoryHits.length * 3); // Sensory = you're grounding us in a place
  place -= Math.min(40, abstractWordHits.length * 7); // Abstract = nowhere (harsher penalty)
  // Metric specificity bonus — precise numbers show you measured your impact
  place += Math.min(16, metricCount * 5);
  // Combined grounding bonus: proper nouns + sensory words = reader can see AND name the place
  if (properNounCount >= 3 && sensoryHits.length >= 3) place += 6;
  // Boilerplate detector: if essay is mostly abstract with few concrete anchors, punish harder
  if (abstractWordHits.length >= 3 && sensoryHits.length === 0 && properNounCount < 2) {
    place -= 15; // unmistakably generic
  }

  // --- 2. DETAIL (CEG axis 2: "What do you notice?") ---
  // Sentence-level craft: texture, specific objects, dialogue. Also cadence —
  // strong writers vary sentence length; workshop-flat monotone reads generic.
  const sentenceLens = sentences.map((s) => (s.match(/\S+/g) ?? []).length);
  const avgSentenceLen = sentenceLens.length === 0 ? 0 : sentenceLens.reduce((s, n) => s + n, 0) / sentenceLens.length;
  const sd = stdev(sentenceLens);
  // Dialogue markers ("said", quotes) signal concrete detail
  const dialogueCount = (text.match(/[""][^""]+[""]|"\s*[A-Z]/g) ?? []).length;
  // Anti-inflation: base at 32 (not 40). 90+ requires masterful sentence craft.
  let detail = 32;
  // Cadence variance
  if (sd >= 8) detail += 22; else if (sd >= 5) detail += 10;
  if (sd < 3 && sentenceLens.length > 4) detail -= 22; // monotone = AI-generated feel
  if (avgSentenceLen > 28) detail -= 10; // bloated sentences
  if (avgSentenceLen > 35) detail -= 8; // severely overwritten
  if (sentenceLens.some((l) => l <= 6)) detail += 8; // punchy short sentences
  if (sentenceLens.some((l) => l <= 4)) detail += 5; // extra-short = intentional
  // Concrete detail signals
  detail += Math.min(15, dialogueCount * 5);
  detail += Math.min(10, sensoryHits.length * 2);
  // Numeric specificity — numbers with context (measurements, counts, times)
  // signal concrete detail, especially in STEM and international essays.
  detail += Math.min(16, metricCount * 5);
  detail += Math.min(12, numberCount * 2);
  // Technical measurement bonus — precise measurements (mph, seconds, meters)
  // signal empirical observation, a hallmark of concrete writing.
  const technicalMeasurements = (text.match(/\b\d+[\d.]*\s*(?:mph|km\/h|m\/s|seconds?|milliseconds?|lbs?|kg|cm|mm|inches?|feet|meters?|miles?)\b/gi) ?? []).length;
  detail += Math.min(8, technicalMeasurements * 4);
  // Literary device detection — shows craft beyond listing
  const hasMetaphor = /\blike a\b|\bas if\b|\bas though\b/i.test(text);
  const hasAnaphora = sentences.length >= 3 && sentences.slice(0, -1).some((s, i) => {
    const nextS = sentences[i + 1];
    if (!nextS) return false;
    const firstWord = s.split(/\s+/)[0]?.toLowerCase();
    const nextFirstWord = nextS.split(/\s+/)[0]?.toLowerCase();
    return firstWord && firstWord === nextFirstWord && firstWord.length > 2;
  });
  const hasParenthetical = /\(.*?\)/.test(text) || /—.*?—/.test(text);
  const hasFragmentSentence = sentenceLens.some((l) => l <= 3 && l >= 1);
  if (hasMetaphor) detail += 6;
  if (hasAnaphora) detail += 6;
  if (hasParenthetical) detail += 4;
  if (hasFragmentSentence) detail += 5;
  // Combined scene-building bonus: dialogue + proper nouns = a real scene being narrated
  if (dialogueCount >= 1 && properNounCount >= 3) detail += 6;

  // Sentence variety bonus — deliberate alternation between short (< 8 words)
  // and long (> 20 words) sentences signals intentional cadence, not accident.
  let sentenceVarietyBonus = false;
  if (sentenceLens.length >= 5) {
    let alternations = 0;
    for (let i = 1; i < sentenceLens.length; i++) {
      const prev = sentenceLens[i - 1];
      const curr = sentenceLens[i];
      const prevShort = prev < 8;
      const prevLong = prev > 20;
      const currShort = curr < 8;
      const currLong = curr > 20;
      if ((prevShort && currLong) || (prevLong && currShort)) {
        alternations++;
      }
    }
    // At least 2 deliberate short<->long alternations in the essay
    if (alternations >= 2) {
      sentenceVarietyBonus = true;
      detail += 10;
    }
  }

  // --- 3. VULNERABILITY (CEG axis 3: "What are you feeling?") ---
  // Honest self-disclosure: admission of doubt, emotional language, first-person
  // confessions. The willingness to sit in discomfort, not just resolve everything.
  const firstPersonCount = (lower.match(/\b(i|i'm|i've|i'd|i'll|my|me)\b/g) ?? []).length;
  const firstPersonRatio = wordCount === 0 ? 0 : firstPersonCount / wordCount;
  const admissionHits = ADMISSION_OF_DOUBT.filter((m) => lower.includes(m));
  // Anti-inflation: base at 22 (not 30). Real vulnerability is rare; most
  // essays fake it with performative disclosure. 90+ should mean the reader
  // felt genuine discomfort — the kind that makes you pause mid-read.
  let vulnerability = 22;
  if (firstPersonRatio >= 0.04 && firstPersonRatio <= 0.10) vulnerability += 22;
  else if (firstPersonRatio > 0.10) vulnerability += 12;

  // Self-disclosure depth — weight by vulnerability level.
  // Level 3 (highest): wrong + hurt someone — full accountability
  // Level 2: wrong about something important — personal stakes
  // Level 1: basic admission of being wrong — still brave
  let vulnerabilityDepthScore = 0;
  const DEPTH_LEVEL_3 = [
    /i was wrong.{0,30}(?:hurt|harmed|damaged|let .{1,15} down|disappointed)/i,
    /my (?:mistake|failure|fault).{0,30}(?:hurt|affected|cost)/i,
    /i (?:caused|created).{0,20}(?:pain|harm|damage)/i,
  ];
  const DEPTH_LEVEL_2 = [
    /i was wrong about.{1,40}(?:important|mattered|cared|believed|loved)/i,
    /i was wrong.{0,20}(?:about (?:my|the thing|what))/i,
    /i (?:had to|finally) admi(?:t|tted).{0,30}(?:wrong|mistaken|failed)/i,
  ];
  const DEPTH_LEVEL_1 = [
    /i was wrong/i,
    /i made a mistake/i,
    /i (?:was|had been) (?:naive|foolish|blind)/i,
  ];
  if (DEPTH_LEVEL_3.some((re) => re.test(text))) {
    vulnerabilityDepthScore = 25;
  } else if (DEPTH_LEVEL_2.some((re) => re.test(text))) {
    vulnerabilityDepthScore = 15;
  } else if (DEPTH_LEVEL_1.some((re) => re.test(text))) {
    vulnerabilityDepthScore = 10;
  }
  vulnerability += vulnerabilityDepthScore;

  if (admissionHits.length > 0) vulnerability += 20; // reduced from 30 to avoid double-counting with depth
  if (admissionHits.length >= 2) vulnerability += 10;
  if (admissionHits.length === 0 && vulnerabilityDepthScore === 0 && wordCount > 250) vulnerability -= 10;
  // Emotional words (beyond the doubt markers)
  const emotionWords = ["afraid", "scared", "angry", "ashamed", "proud", "guilty",
    "relieved", "anxious", "lonely", "jealous", "confused", "overwhelmed", "grateful",
    // Expanded: nuanced emotional vocabulary signals deeper introspection
    "numb", "hollow", "suffocating", "aching", "torn", "helpless", "paralyzed",
    "mortified", "devastated", "elated", "bittersweet", "restless", "defeated",
    "furious", "humiliated", "tender", "raw", "fragile", "exposed"];
  const emotionHits = emotionWords.filter((w) => lower.includes(w));
  vulnerability += Math.min(15, emotionHits.length * 4);
  // Performative vulnerability penalty: using emotional words without
  // first-person grounding ("I felt ashamed") reads as literary affect,
  // not genuine disclosure. Require 1P anchoring for full credit.
  if (emotionHits.length >= 2 && firstPersonRatio < 0.03) {
    vulnerability -= 8; // emotions without personal grounding = performative
  }

  // --- 4. SURPRISE (CEG axis 4: "What unexpected connection can you make?") ---
  // Tension, contrast, an angle the reader didn't see coming. NOT platitudes.
  const contrastHits = CONTRAST_MARKERS.filter((m) => lower.includes(m));
  // Anti-inflation: base at 28 (not 35). Genuine surprise is the hardest axis.
  // Most essays are predictable. 90+ should mean the reader's mental model broke.
  let surprise = 28 + Math.min(30, contrastHits.length * 6);
  if (contrastHits.length === 0 && wordCount > 200) surprise -= 18;
  if (contrastHits.length === 0 && wordCount <= 10) surprise -= 15; // near-empty: no surprise possible
  if (contrastHits.length >= 3) surprise += 10;
  if (contrastHits.length >= 5) surprise += 8; // exceptional tension-building
  // Penalize essays that end on cliche conclusions
  const lastSentence = sentences.length > 0 ? sentences[sentences.length - 1].toLowerCase() : "";
  const clicheEndings = ["and that's why", "this is why", "that's when i realized",
    "this experience taught me", "i learned that", "in the end",
    "ultimately", "from that day on", "since then", "now i know",
    "this made me who i am", "i will never forget", "it all paid off",
    "looking back, i'm grateful", "i wouldn't change a thing",
    "everything happens for a reason"];
  if (clicheEndings.some((c) => lastSentence.includes(c))) surprise -= 15;
  // Penalize predictable openings too — cliche hooks
  const firstSentenceLower = sentences.length > 0 ? sentences[0].toLowerCase() : "";
  const clicheOpenings = [
    "ever since i was", "from a young age", "growing up",
    "when i was little", "as a child", "for as long as i can remember",
    "i have always been", "i've always been", "i have always wanted",
    "webster's dictionary defines", "the dictionary defines",
    "in today's society", "in this day and age",
  ];
  if (clicheOpenings.some((c) => firstSentenceLower.includes(c))) surprise -= 10;

  // --- GLOBAL PENALTIES (apply across all axes) ---

  // Word count sanity: Common App is 250-650. Under 200 = insufficient material.
  // Over 700 = probably pasting an unedited draft.
  if (wordCount < 150) {
    place -= 15; detail -= 15; vulnerability -= 10; surprise -= 10;
  } else if (wordCount < 250) {
    place -= 8; detail -= 8; vulnerability -= 5; surprise -= 5;
  }

  // AI/ChatGPT detection heuristic: extremely uniform sentence lengths +
  // high unique-word ratio + zero vulnerability markers = likely generated.
  // Real 17-year-olds have messier cadence and more raw emotion.
  const words = (text.toLowerCase().match(/\b[a-z]+\b/g) ?? []);
  const uniqueWords = new Set(words);
  const uniqueWordRatio = words.length > 0 ? uniqueWords.size / words.length : 0;
  const aiLikely =
    sd < 3 && sd > 0 &&
    sentenceLens.length > 6 &&
    admissionHits.length === 0 &&
    emotionHits.length === 0 &&
    uniqueWordRatio > 0.58 &&
    abstractWordHits.length >= 2;
  if (aiLikely) {
    place -= 12; detail -= 15; vulnerability -= 12; surprise -= 10;
  }

  // Clamp all
  const scores = {
    place: Math.max(0, Math.min(100, Math.round(place))),
    detail: Math.max(0, Math.min(100, Math.round(detail))),
    vulnerability: Math.max(0, Math.min(100, Math.round(vulnerability))),
    surprise: Math.max(0, Math.min(100, Math.round(surprise))),
  };
  const composite = Math.round(
    (scores.place + scores.detail + scores.vulnerability + scores.surprise) / 4
  );

  // --- Feedback (ordered by impact — worst axis first) ---
  const feedback: string[] = [];

  // Place feedback
  if (sensoryHits.length === 0 && properNounCount < 2 && wordCount > 150) {
    feedback.push(
      `No sense of place. The reader can't see where you are. Ground us: name the room, the street, the smell. College Essay Guy calls this "Place" — it's what makes YOUR essay impossible to confuse with anyone else's.`
    );
  } else if (abstractWordHits.length >= 2) {
    feedback.push(
      `Abstract words found ("${abstractWordHits[0]}", "${abstractWordHits[1] ?? ""}"). Replace each with a concrete image — a specific object, texture, or location.`
    );
  }

  // Detail feedback
  if (sd < 3 && sentenceLens.length > 4) {
    feedback.push(
      `Sentence lengths are too uniform — this reads workshop-flattened. Mix in a 4-word punch ("I didn't.") or a long, winding reflective sentence. Varied cadence IS your voice.`
    );
  }
  if (dialogueCount === 0 && wordCount > 250) {
    feedback.push(
      `No dialogue. Even one line of speech — what someone actually said — adds texture no summary can match.`
    );
  }

  // Vulnerability feedback
  if (admissionHits.length === 0 && wordCount > 250) {
    feedback.push(
      `No admission of doubt, fear, or being wrong. Readers trust writers who say "I was naive" or "I didn't understand." Find that moment — it's where the real essay lives.`
    );
  }
  if (firstPersonRatio < 0.03 && wordCount > 100) {
    feedback.push(
      `First-person language is too sparse. This is a personal essay — use "I" and "my" more. The reader needs to feel a single person behind the words.`
    );
  }

  // Surprise feedback
  if (contrastHits.length === 0 && wordCount > 200) {
    feedback.push(
      `No turn or surprise. Strong essays say "I thought X, but actually Y." The reader needs a moment where your understanding flipped — that's what makes them remember your essay at 11pm after 60 others.`
    );
  }
  if (clicheEndings.some((c) => lastSentence.includes(c))) {
    feedback.push(
      `Your ending is predictable ("${lastSentence.slice(0, 40)}..."). Cut the moral-of-the-story conclusion. End on a specific image or an unresolved tension — trust the reader to get the point.`
    );
  }

  if (properNounCount < 3 && wordCount > 200) {
    feedback.push(
      `Only ${properNounCount} proper nouns. Name people, places, books, songs. Specifics make a generic moment unmistakably yours.`
    );
  }

  // AI-detection warning
  if (aiLikely) {
    feedback.push(
      `This essay reads machine-generated: uniform sentence lengths, no vulnerability markers, high abstract-word density. Admissions officers flag these patterns. Rewrite in YOUR voice — messy, specific, human.`
    );
  }

  // Cliche opening feedback
  if (clicheOpenings.some((c) => firstSentenceLower.includes(c))) {
    feedback.push(
      `Cliche opening ("${firstSentenceLower.slice(0, 35)}..."). Admissions officers read thousands of essays that start this way. Open with action, a specific moment, or dialogue.`
    );
  }

  // Word count feedback
  if (wordCount < 250 && wordCount > 0) {
    feedback.push(
      `Only ${wordCount} words. The Common App essay should be 500-650 words. This length can't demonstrate the depth admissions readers expect.`
    );
  }

  // --- 6-DIMENSION SCORES (mapped from 4-axis + 2 new heuristics) ---
  // Mapping: place → specificity, detail → storytelling,
  //          vulnerability → authenticity, surprise → insight
  // New:     impact (word count, emotional markers, call-to-action presence)
  //          voice (first-person usage, sentence variety, unique word ratio)

  // IMPACT heuristic — does the essay leave a mark?
  // Anti-inflation: base at 22 (not 30). Impact requires earned moments.
  let impactScore = 22;
  // Word count — too short lacks depth, too long loses focus
  if (wordCount >= 500 && wordCount <= 650) impactScore += 15;
  else if (wordCount >= 400) impactScore += 8;
  // Emotional markers signal memorable moments
  const impactEmotionWords = ["remember", "never forget", "changed", "transformed",
    "shifted", "struck", "haunted", "stayed with me", "still think about"];
  const impactEmotionHits = impactEmotionWords.filter((w) => lower.includes(w));
  impactScore += Math.min(25, impactEmotionHits.length * 8);
  // Contrast markers add memorability (reuse from surprise)
  impactScore += Math.min(15, contrastHits.length * 5);
  // Cliche endings reduce impact
  if (clicheEndings.some((c) => lastSentence.includes(c))) impactScore -= 10;
  // Strong opening — first sentence hooks
  const firstSentence = sentences.length > 0 ? sentences[0] : "";
  const firstWords = (firstSentence.match(/\S+/g) ?? []).length;
  if (firstWords > 0 && firstWords <= 12) impactScore += 10; // punchy opening
  const impactSignals = impactEmotionHits.length;

  // VOICE heuristic — does it sound like one specific person?
  // Anti-inflation: base at 22 (not 30). Distinctive voice is earned.
  let voiceScore = 22;
  // First-person usage — natural range for personal essay
  const fpUsage = firstPersonRatio;
  if (fpUsage >= 0.04 && fpUsage <= 0.10) voiceScore += 20;
  else if (fpUsage > 0.10) voiceScore += 10;
  else if (fpUsage < 0.02 && wordCount > 100) voiceScore -= 10;
  // Sentence variety — strong writers vary length deliberately
  if (sentenceVarietyBonus) voiceScore += 15;
  if (sd >= 8) voiceScore += 10; else if (sd >= 5) voiceScore += 5;
  if (sd < 3 && sentenceLens.length > 4) voiceScore -= 15;
  // Unique word ratio — distinctive vocabulary (reuse values from global penalties above)
  if (uniqueWordRatio >= 0.55) voiceScore += 15;
  else if (uniqueWordRatio >= 0.45) voiceScore += 8;
  else if (uniqueWordRatio < 0.35) voiceScore -= 10;
  // Dialogue and sensory add voice texture
  voiceScore += Math.min(10, dialogueCount * 3);

  const sixDimensionScores: Record<SixDimension, number> = {
    specificity: scores.place,
    storytelling: scores.detail,
    authenticity: scores.vulnerability,
    insight: scores.surprise,
    impact: Math.max(0, Math.min(100, Math.round(impactScore))),
    voice: Math.max(0, Math.min(100, Math.round(voiceScore))),
  };
  const sixDimensionComposite = Math.round(
    sixDimensionScores.authenticity * 0.20 +
    sixDimensionScores.insight * 0.15 +
    sixDimensionScores.specificity * 0.20 +
    sixDimensionScores.storytelling * 0.15 +
    sixDimensionScores.impact * 0.15 +
    sixDimensionScores.voice * 0.15
  );

  return {
    scores,
    composite,
    sixDimensionScores,
    sixDimensionComposite,
    feedback,
    details: {
      properNounCount,
      abstractWordHits,
      sensoryHits,
      avgSentenceLen: Math.round(avgSentenceLen * 10) / 10,
      sentenceLenStdev: Math.round(sd * 10) / 10,
      firstPersonRatio: Math.round(firstPersonRatio * 1000) / 1000,
      admissionMarkers: admissionHits,
      contrastMarkers: contrastHits,
      metricCount,
      sentenceVarietyBonus,
      vulnerabilityDepthScore,
      impactSignals,
      voiceSignals: {
        firstPersonUsage: Math.round(fpUsage * 1000) / 1000,
        sentenceVariety: Math.round(sd * 10) / 10,
        uniqueWordRatio: Math.round(uniqueWordRatio * 1000) / 1000,
      },
    },
  };
}

export const VOICE_AXIS_LABEL: Record<VoiceAxis, string> = {
  place: "Place",
  detail: "Detail",
  vulnerability: "Vulnerability",
  surprise: "Surprise",
};

export const SIX_DIMENSION_LABEL: Record<SixDimension, string> = {
  authenticity: "Authenticity",
  insight: "Insight",
  specificity: "Specificity",
  storytelling: "Storytelling",
  impact: "Impact",
  voice: "Voice",
};
