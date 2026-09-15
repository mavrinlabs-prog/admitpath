# AdmitPath — One-Month World-Class Plan

Synthesized from four parallel research agents. Every claim cited.
Date: 2026-04-30

## Executive summary

Three findings reshape the roadmap:
1. **Existing competitors leave a real wedge**: AdmitYogi owns "rubric-led affordable" essay scoring; CollegeVine pivoted B2B; Crimson/Empowerly are $5K–$30K; raw ChatGPT has no profile/calibration. AdmitPath at $9.99/$19.99 fits the consumer band but needs differentiation beyond ChatGPT-with-a-prompt.
2. **The data exists; nobody has assembled it**: College Scorecard API + IPEDS + Common Data Set Section C7 (per-school holistic-review weights) + FairTest test policy + Common App end-of-season volume reports. None of the consumer apps ground their predictions in this. **This is the moat.**
3. **The FAFSA Simplification (sibling-in-college discount eliminated) is the single biggest middle-class hit of the decade** and no consumer app surfaces it.

## Week 1 — Data foundation

**Ingest the 8 datasets that ground every prediction:**

| # | Dataset | Source | Effort |
|---|---|---|---|
| 1 | College Scorecard API | collegescorecard.ed.gov/data/api/ | E |
| 2 | IPEDS bulk download | nces.ed.gov/ipeds | M |
| 3 | CDS Section C7 (top 200 schools) | per-school /oir paths | H |
| 4 | FairTest test-policy list | fairtest.org/test-optional-list | E |
| 5 | Common App end-of-season reports | commonapp.org/about/reports | E |
| 6 | Opportunity Insights Mobility Cards | opportunityinsights.org/data | E |
| 7 | Compass Prep T200 SAT/ACT M50 | compassprep.com/college-profiles | M |
| 8 | UC source-school admit data | universityofcalifornia.edu | E |

**Deliverables:**
- `data/colleges.ts` enriched with: admit rate, SAT/ACT M50, test policy, demonstrated-interest weight, need-blind flag, meets-full-need flag, in-state vs OOS net price by income band, 40-year ROI (Georgetown CEW)
- `lib/admit-rates.ts` — calibrated band predictor (Very Likely / Possible / Long Shot — never a precise %)
- `app/api/colleges-search/route.ts` — typed search across the new schema

## Week 2 — 7-dimension scoring v2 (calibrated)

**The current 7 dimensions stay, but each gets a real grounding:**

1. **Academic Rigor** — context-adjusted (rigor relative to school's offerings, per Common App counselor report)
2. **Leadership** — leadership role × scope (school→nat'l→int'l)
3. **Awards** — award tier (Tier 1 national / Tier 2 state / Tier 3 school)
4. **Activity Depth** — hours × years × measurable impact
5. **Spike** — thematic vector across top 1–3 activities; coherence with intended major
6. **Essay Quality** — College Essay Guy's 4-axis voice rubric (place / detail / vulnerability / surprise) + opening-line craft
7. **Recommendations** — proxy via teacher-relevance match + counselor-letter signal phrases

**Three new sub-features per school:**
- Per-school CDS C7 weight overlay — applicant's strongest dimensions vs what THIS school cares about
- Honest reach calibration — at <15% admit rate, never quote a precise %; show a band + "lottery dynamics" disclaimer
- "Why us" specificity scorer — counts named professors, courses, traditions

**Deliverables:**
- `lib/scoring-v2.ts` — context-aware rigor, voice rubric, per-school weight overlay
- `app/analyze/page.tsx` — show per-school weight match
- `app/essays/page.tsx` — 4-axis voice rubric replacing/extending current 6-axis

## Week 3 — Application-stage features

**Build the daily-driver layer that converts free → paid:**

1. **Per-school AI Policy Badge** in essay editor (Caltech ✓ / Brown ✗ / Vanderbilt ⚠) — pulled from gradpilot.com/ai-policies. Nobody else has this; integrity-positioned moat.
2. **Common App deadline + supplement tracker** with ICS feed export
3. **Demonstrated-interest checklist** (per school: visit logged / info session / supplement complete / interview)
4. **"Why us" specificity coach** — flags swappable language ("you could swap Yale for Harvard here and the essay reads identical")
5. **Voice rubric on every draft save** — auto-score against the 4 axes

**Deliverables:**
- `components/ai-policy-badge.tsx`
- `app/deadlines/page.tsx` (new route)
- `app/colleges/[id]/page.tsx` — per-school deep page with DI checklist
- `lib/voice-rubric.ts`

## Week 4 — Money + outcomes

**The honest "should you go" layer:**

1. **Personalized Net Price Predictor** — Scorecard NPT4 fields, family income band, state, asset flags. Per school: estimated net cost for YOUR family.
2. **Auto-Merit Stats Match** — given GPA + SAT/ACT, surface schools (Alabama, ASU, Pitt, Mississippi State, USC-SC, Ole Miss, Kentucky) where the applicant automatically qualifies for merit, with dollar amounts.
3. **Sibling-in-College Calculator** — model the eliminated FAFSA sibling discount (single biggest middle-class hit), flag schools that restored institutional sibling adjustment (Princeton, Yale, MIT).
4. **40-year ROI Quadrant View** — plot user's school list on net cost × Georgetown CEW NPV axes.
5. **Undermatching Nudge** — for high-stat low-income users (1500+ SAT, Pell-eligible income), surface need-blind-meets-full-need schools cheaper than their flagship. Hoxby–Avery's intervention productized.

**Deliverables:**
- `app/money/page.tsx` — affordability dashboard
- `lib/net-price.ts` + `lib/merit-grid.ts`
- `lib/undermatch.ts`

## Model upgrade (parallel — week 1)

Three-tier routing:

| Flow | Current | New | Cost/call |
|---|---|---|---|
| Jargon Q&A, deadline parsing, profile summary | Cerebras Llama 3.1 8B | **Stay** | ~$0.0001 |
| Essay rubric, college match reasoning | Cerebras 8B | **Upgrade → Groq Llama 3.3 70B** | ~$0.002 |
| Pro-tier deep essay review, SFFA refusals | Llama 70B | **Upgrade → Claude Sonnet 4.6 (Pro only)** | ~$0.02 |

Cap free tier at Llama 70B. Pro adds Sonnet.

Estimated COGS: $0.10–$0.30 per Pro user/month. Gross margin stays >97%.

## Five moat moves (in parallel across the month)

1. **Per-school AI Policy Badge** — 1 week
2. **Honest Reach calibration** (bands, not points) — 1 week
3. **Voice Rubric** (4-axis, College Essay Guy framework) — 2 weeks
4. **Counselor Free Seat program** (NACAC/IECA distribution moat) — 2 weeks
5. **Tutor-graded essay corpus** — pay 5 IECA counselors $50/essay × 200 essays = $10K to bootstrap proprietary fine-tune dataset — 4 weeks (background)

## Sources

Full citations live in the four research-agent outputs from this session. Top sources by domain:

**Quantitative**: collegescorecard.ed.gov/data/api/, nces.ed.gov/ipeds, commondataset.org, fairtest.org, opportunityinsights.org, compassprep.com/college-profiles, ucop.edu admissions data, harvard.edu/admissionscase (SFFA exhibits), commonapp.org/about/reports

**Qualitative**: collegeessayguy.com, ivywise.com, mitadmissions.org, admission.stanford.edu, admissions.berkeley.edu/holistic-review, harvard.edu/admissionscase, paw.princeton.edu, ivyscholars.com (EC tier system), commonapp.org/blog/2025-2026-prompts

**Competitive**: admityogi.com, collegevine.com, gradpilot.com/ai-policies, anthropic.com/news/anthropic-education-report-how-university-students-use-claude, claude.com/customers, blog.khanacademy.org/efficacy

**Outcomes**: collegescorecard.ed.gov, opportunityinsights.org/paper/collegeadmissions (Chetty 2023), Georgetown CEW "Ranking 4,500 Colleges by ROI", studentaid.gov (FAFSA Simplification), TICAS NPC reports
