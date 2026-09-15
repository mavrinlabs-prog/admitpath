# AdmitPath $100M Blueprint

**The AI college counselor that replaces $10K humans for $10/month.**

Version 1.0 | May 2026 | Confidential

---

## PART 1: MARKET ANALYSIS

### Total Addressable Market (TAM)

| Segment | Annual Volume | Avg Willingness to Pay | Market Size |
|---------|--------------|----------------------|-------------|
| US college applicants | 3.7M | $120/yr | $444M |
| International applicants to US schools | 1.1M | $200/yr | $220M |
| Graduate school (MBA/law/med/PhD) | 2.0M | $240/yr | $480M |
| Parents (co-purchasers) | 2.5M | $150/yr | $375M |
| **Total TAM** | | | **$1.5B** |

Sources: Common App 2025 End-of-Season Report (3.7M apps), IIE Open Doors (1.1M intl), GMAC/LSAC/AAMC combined (2M grad), parent willingness from Gallup 2024 education spending survey.

### Serviceable Addressable Market (SAM)

Consumer AI tools realistically reach digitally-native applicants: ~60% of undergrad, ~40% of international, ~30% of grad. **SAM: $560M.**

### Realistic Penetration (SOM)

| Timeframe | Users | Paying Users | ARR | Market Share |
|-----------|-------|-------------|-----|-------------|
| Year 1 | 50K | 5K | $600K | 0.04% |
| Year 2 | 500K | 50K | $6M | 0.4% |
| Year 3 | 2M | 150K | $20M | 1.3% |
| Year 5 | 5M | 500K | $100M | 6.7% |

Year 5 assumes: grad school expansion (Year 2), international localization (Year 3), B2B school district licensing (Year 3+), and annual price increase to $16.99 avg blended ARPU.

---

## PART 2: COMPETITIVE LANDSCAPE

| Competitor | ARR | Users | Strength | Fatal Weakness |
|-----------|-----|-------|----------|---------------|
| **CollegeVine** | ~$35M | 3M | Chancing engine, community, school partnerships | Generic AI, no CDS C7 calibration, pivoted B2B (consumer neglected) |
| **AdmitYogi** | ~$5M | 200K | Rubric-led essay scoring, affordable | No full-stack counseling, no college match, no financial tools |
| **Crimson Education** | $100M+ | 50K | Human counselors, outcomes data, brand | $5K-$30K packages exclude 95% of families |
| **Khanmigo (Khan Academy)** | N/A | 2M+ | Brand trust, school integration | General tutoring, not admissions-specific |
| **ChatGPT/Claude** | N/A | 200M+ | Free, general-purpose, smart | No profile persistence, no admissions data, no CDS calibration, hallucination risk |
| **Naviance** | ~$100M (Hobsons) | 10M+ students | School-integrated, scattergrams, counselor workflow | No AI, no personalized coaching, legacy UX |

### AdmitPath's Moat (what none of them do)

1. **CDS C7 weight calibration** -- per-school holistic-review weights mapped to the student's 7-dimension profile. No competitor grounds predictions in actual Common Data Set Section C7 data.
2. **Honest reach bands** -- probabilistic bands ("Long Shot / Possible / Likely") instead of fake-precise percentages. Integrity-positioned.
3. **AI Policy Badge** -- per-school AI usage policies surfaced inline in the essay editor. Nobody else has this.
4. **Financial layer integrated with admissions** -- net price, merit match, ROI, undermatch nudge, FAFSA sibling calculator in the same tool as essay coaching.
5. **$10/month price point** -- 500x cheaper than Crimson, 3x cheaper than CollegeVine premium, purpose-built (not generic AI).

---

## PART 3: PRODUCT STRATEGY

### What's Already Built (97 routes, 40+ API endpoints)

**Core AI Features:**
- 7-dimension profile scoring (academic rigor, leadership, awards, activity depth, spike, essay quality, recommendations) via `api/analyze`
- AI counselor chat with context-aware routing (`api/chat`)
- Essay feedback with 6-dimension rubric + live coaching (`api/essay`)
- "Why Us" specificity scorer (`api/essay/why-us`)
- Interview practice (`api/interview`)
- Supplemental essay guidance per-school (`api/essay/supplemental`)

**College Intelligence:**
- College search with enriched data (`api/colleges/search`)
- Per-school deep pages with scattergrams (`scattergram/[slug]`)
- "How to Get Into [School]" pages (`how-to-get-into/[slug]`)
- Acceptance rate pages (`acceptance-rate/[slug]`)
- College comparison tool (`compare`, `compare-scores`)
- College list builder (`college-list-builder`)
- Decision matrix (`decision-matrix`)

**Financial Tools:**
- Net price calculator (`net-price`)
- Merit match (`merit-match`)
- Undermatching nudge (`undermatch`)
- ROI calculator (`roi`)
- Financial aid comparison (`aid-comparison`)
- Scholarship match + application guide (`scholarship-match`)
- FAFSA checklist (`fafsa-checklist`)
- Financial aid appeal letter generator (`appeal-letter`)

**Growth Infrastructure:**
- Referral program (`refer`)
- Viral share cards + social proof toasts
- Exit-intent popup, sticky mobile CTA
- Lead capture hero, newsletter signup
- Blog with RSS feed (SEO engine)
- Creator program page (`creators`)
- Parent-specific landing page (`parent`)
- 90+ SEO content pages (admissions guides, checklists, strategies)
- Application tracker with celebration modals (`tracker`)
- Outcome survey system (`tracker/survey`)

**Operations:**
- Stripe billing (Plus $9.99/mo, Pro $19.99/mo, Season Pass $99)
- Clerk auth with webhook sync
- Prisma ORM with PostgreSQL
- Free tier with usage caps (20 analyses, 20 essays, 50 chats, 15 colleges)
- Cron jobs (daily emails, weekly progress, hourly audit)
- Data export + account deletion (GDPR/CCPA ready)

### Critical Gaps to Fix

1. **Groq key rotation** -- 27 keys leaked (SECURITY_INCIDENT.md). Must rotate before any public deployment.
2. **CDS C7 data ingestion** -- the moat feature is designed but not yet populated with real data.
3. **Voice rubric upgrade** -- essay scoring should use 4-axis College Essay Guy framework (place, detail, vulnerability, surprise).
4. **Outcome tracking** -- need to collect and display real admission outcomes to build data moat.
5. **Mobile optimization** -- verify all 97 routes render correctly on mobile.
6. **Analytics integration** -- no PostHog/Mixpanel yet; flying blind on user behavior.
7. **Email sequences** -- daily/weekly crons exist but need content and Resend production setup.
8. **Counselor free-seat program** -- B2B entry point designed in PLAN.md, not yet built.

### The ONE Moat Feature

**Per-school CDS C7 weight calibration.** When a student sees "Stanford weights your leadership (85/100) as 'Very Important' but your academic rigor (72/100) as 'Important' -- here's your match score vs. the average admit," that's data no other consumer tool has assembled. It makes the AI predictions school-specific rather than generic. Every user who enters their profile makes the dataset better. Network effects compound.

---

## PART 4: PRICING & REVENUE MODEL

### Current Pricing Matrix

| Plan | Monthly | Annual | One-Time | Target Segment |
|------|---------|--------|----------|---------------|
| Free | $0 | -- | -- | Top-of-funnel, viral growth |
| Plus | $9.99 | $99 | -- | Self-directed students |
| Pro | $19.99 | $199 | -- | Serious applicants |
| Season Pass | -- | -- | $99 | Peak-season users (Dec-Apr) |
| B2B School | -- | -- | Contact | Districts, counseling orgs |

### Why $9.99 Is Right

- **Impulse threshold**: under $10 = no parental approval needed for many teens
- **10x value gap**: Crimson charges $5,000-$30,000. At $9.99, the value narrative is undeniable
- **Gross margin**: AI COGS ~$0.10-$0.30/user/month (Cerebras/Groq routing). Gross margin >97%
- **Annual upsell**: $99/yr = 17% discount, locks in 12 months of revenue

### Revenue Projections

| Metric | Year 1 | Year 2 | Year 3 | Year 5 |
|--------|--------|--------|--------|--------|
| Total users | 50K | 500K | 2M | 5M |
| Paying users | 5K | 50K | 150K | 500K |
| Conversion rate | 10% | 10% | 7.5% | 10% |
| Blended ARPU | $10/mo | $10/mo | $11/mo | $16.99/mo |
| MRR (end of year) | $50K | $500K | $1.65M | $8.5M |
| ARR (end of year) | $600K | $6M | $20M | $100M |

Year 5 ARPU increase driven by: grad school tier ($29.99), B2B per-seat licensing ($50-100/seat), and annual price increase.

### LTV by Segment

| Segment | Avg Subscription | Monthly Churn | LTV |
|---------|-----------------|---------------|-----|
| Plus monthly | $9.99 | 8% | $125 |
| Plus annual | $99 | 3%/mo equiv | $200 |
| Pro monthly | $19.99 | 6% | $333 |
| Pro annual | $199 | 2%/mo equiv | $450 |
| Season Pass | $99 | N/A (one-time) | $99 |
| B2B school seat | $8/mo | 2% | $400 |

---

## PART 5: GROWTH STRATEGY

### Month 1-3: Foundation (Target: 500 users, 50 paying, $500 MRR)

- Deploy to Vercel with production keys (Clerk, Stripe, Resend, Upstash)
- Recruit 50 beta users from r/ApplyingToCollege, A2C Discord, College Confidential
- Collect usage data and NPS scores weekly
- Build 10 "I used AdmitPath for my application" case studies from beta cohort
- Launch on Product Hunt (Education category)
- Submit to Y Combinator W27 (deadline ~Oct 2026)

### Month 4-6: Traction (Target: 5,000 users, 500 paying, $5K MRR)

- **Creator program**: recruit 10 TikTok/YouTube creators ($50-500/video, performance bonuses)
- **SEO activation**: 90+ content pages already built -- add internal linking, schema markup, sitemap optimization
- **Reddit presence**: weekly value posts on r/ApplyingToCollege (4.2M members), r/CollegeAdmissions
- **School counselor outreach**: 10 pilot schools with free counselor seats
- **Referral program activation**: give referrers 1 free month of Plus per converted referral

### Month 7-12: Growth (Target: 50,000 users, 5,000 paying, $50K MRR)

- **Paid acquisition**: Meta + Google ads targeting "college admissions help" ($50 CAC target, LTV:CAC > 3:1)
- **B2B sales**: 5 school districts, white-label option for counseling companies
- **Outcome data collection**: first full admissions cycle completes -- publish anonymized results
- **Press**: education press outreach (EdSurge, Inside Higher Ed, The Hechinger Report)

### Year 2: Scale (Target: 500K users, $500K MRR)

- International student expansion (localized for India, China, South Korea -- top 3 source countries)
- Graduate school module (MBA, law, med, PhD -- reuse 7-dimension framework with grad-specific calibration)
- Counselor platform (API + dashboard for IECA members, $50/seat/mo)
- Data network effects kick in: more outcomes = better predictions = more users

### Year 3-5: Dominance (Target: $5M-$8.5M MRR)

- B2B school district contracts at scale (Naviance replacement positioning)
- Platform API for third-party counseling tools
- Proprietary fine-tuned model on 10K+ tutor-graded essays
- International expansion: UK (UCAS), Canada, Australia
- Potential acqui-hire targets: AdmitYogi (essay tech), GradPilot (AI policy data)

---

## PART 6: MARKETING CHANNELS (Ranked by ROI)

1. **SEO** -- 90+ content pages already built. Estimated 50K-200K organic visits/mo at maturity. CAC: ~$0. Action: add schema markup, fix internal linking, submit sitemap.
2. **Reddit/Discord** -- r/ApplyingToCollege (4.2M members) is the #1 organic channel. Authentic value posts, not ads. CAC: $0 (time only).
3. **TikTok/YouTube** -- "I got into [dream school]" content is viral. Creator program with 10 micro-influencers ($50-500/video). Estimated CAC: $5-15.
4. **Referral program** -- built and ready. "Give a friend 1 week of Plus, get 1 month free." Viral coefficient target: 1.3x. CAC: $10 (cost of free months).
5. **School partnerships (B2B)** -- highest LTV ($400/seat). Longer sales cycle. Start with 10 pilot schools offering free counselor seats.
6. **Paid ads (Meta/Google)** -- only after PMF confirmed (NPS > 50, retention > 60% M2). Target CAC: $50. Keywords: "college admissions AI," "essay review tool," "college chances calculator."
7. **Press/media** -- Product Hunt launch, TechCrunch pitch (angle: "democratizing admissions counseling"), education press (EdSurge, The 74, Hechinger Report).
8. **Influencer partnerships** -- college admissions YouTubers (SupertutorTV, PrepScholar). Co-branded content. $1K-5K/partnership.

---

## PART 7: OPERATIONS CHECKLIST (This Week)

| # | Task | Owner | Time |
|---|------|-------|------|
| 1 | Rotate all 27 leaked Groq API keys | Dev | 2 hours |
| 2 | Set up Clerk production instance + keys | Dev | 1 hour |
| 3 | Create Stripe production products (Plus, Pro, Season Pass, annual variants) | Dev | 2 hours |
| 4 | Set up Resend domain + transactional email templates | Dev | 2 hours |
| 5 | Set up Upstash Redis for rate limiting | Dev | 1 hour |
| 6 | Deploy to Vercel (connect GitHub repo, set env vars) | Dev | 1 hour |
| 7 | Run `npx prisma migrate deploy` on production DB | Dev | 30 min |
| 8 | Set up PostHog (free tier) for analytics | Dev | 1 hour |
| 9 | Recruit 10 beta users from r/ApplyingToCollege | Founder | 3 hours |
| 10 | Create TikTok business account + first 3 videos | Founder | 4 hours |
| 11 | Write Product Hunt launch copy + schedule launch | Founder | 2 hours |
| 12 | Set up Sentry for error monitoring | Dev | 1 hour |

---

## PART 8: FINANCIAL PROJECTIONS

### Monthly Burn Rate

| Category | Month 1-6 | Month 7-12 | Year 2 |
|----------|-----------|-----------|--------|
| AI inference (Cerebras/Groq) | $50 | $500 | $5K |
| Hosting (Vercel Pro) | $20 | $20 | $150 |
| Database (Neon/Supabase) | $0 | $25 | $100 |
| Email (Resend) | $0 | $20 | $100 |
| Auth (Clerk) | $0 | $25 | $250 |
| Domain + misc SaaS | $20 | $50 | $100 |
| Content creators | $0 | $2K | $10K |
| Paid ads | $0 | $5K | $25K |
| **Total burn** | **$90** | **$7.6K** | **$40.7K** |

### Revenue vs. Burn

| Period | MRR (end) | Monthly Burn | Net | Cumulative |
|--------|-----------|-------------|-----|-----------|
| Month 3 | $500 | $90 | +$410 | +$1.2K |
| Month 6 | $5K | $3K | +$2K | +$8K |
| Month 12 | $50K | $7.6K | +$42.4K | +$200K |
| Year 2 end | $500K | $40.7K | +$459K | +$3M+ |

### Funding Strategy

**Bootstrap-first.** At ~$90/month burn (months 1-6) and >97% gross margins, this business is profitable from month 1 with even 10 paying users. Raise only if:
- Need to hire (engineer #2 at $150K = need $15K MRR to cover)
- Need to accelerate paid acquisition beyond organic growth
- B2B school sales require dedicated sales rep

**If raising:** Seed round at $5M valuation when hitting $50K MRR (10x ARR multiple for edtech). Use funds for: engineering hire, B2B sales hire, paid acquisition budget.

---

## PART 9: RISK ANALYSIS

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|-----------|
| **ChatGPT adds admissions features** | High | Medium | Moat is data (CDS C7, outcomes), not AI capability. ChatGPT won't ingest per-school datasets or build profile persistence. Deepen data advantage faster. |
| **CollegeVine copies our features** | Medium | Medium | They pivoted B2B and have 3M users of technical debt. Speed advantage: we ship in days, they ship in quarters. |
| **Seasonality** (revenue crashes Feb-Jul) | High | Certain | Season Pass ($99 one-time) front-loads revenue. Add grad school (year-round cycle). Add junior/sophomore year planning (extends engagement to 2-3 years per user). |
| **Regulatory** (COPPA for <13, FERPA for school data) | Medium | Low | Most users are 16-18 (above COPPA). FERPA applies to school records, not student-entered data. Add age gate and parental consent flow for <16 as precaution. |
| **AI hallucination** (wrong admission advice) | High | Medium | All predictions use bands, not precise numbers. Disclaim "not a guarantee." Ground responses in CDS data, not LLM guessing. Human review of edge cases. |
| **Key person risk** (solo founder) | High | High | Document everything. Codebase is well-structured (97 routes, clear separation). Hire engineer #2 at $15K MRR. |
| **Data accuracy** (stale CDS/IPEDS data) | Medium | Medium | Automate annual data refresh. Community-sourced corrections. Partner with schools for direct data feeds. |

### What Kills This Company

1. **Not shipping fast enough.** The window between "AI can do admissions counseling" and "big incumbents add it" is 12-18 months. Must reach 50K users and outcome data before Naviance or CollegeVine wake up.
2. **Building features nobody uses.** 97 routes is impressive but dangerous if 90 of them have zero traffic. Instrument analytics immediately. Kill features with <1% usage.
3. **Ignoring seasonality.** If 80% of signups happen Aug-Jan, the business looks dead Feb-Jul. Plan for it: grad school, underclass planning, international cycles.

---

## PART 10: SUCCESS METRICS

### North Star Metric

**Paying users who complete at least one full application cycle** (profile + essay + college list + submission). This measures real value delivery, not vanity signups.

### Milestone Targets

| Milestone | Metric | Target | Deadline |
|-----------|--------|--------|----------|
| Week 1 | Production deploy | Live on custom domain | May 20, 2026 |
| Week 2 | Beta users | 10 active users | May 27, 2026 |
| Month 1 | Paying users | 10 paying, NPS > 50 | Jun 13, 2026 |
| Month 3 | MRR | $1K MRR, 100 paying | Aug 2026 |
| Month 6 | Traction | $5K MRR, 500 paying | Nov 2026 |
| Month 9 | PMF signal | 40%+ "very disappointed" on Sean Ellis test | Feb 2027 |
| Year 1 | Scale | $50K MRR, 5K paying | May 2027 |
| Year 2 | Growth | $500K MRR, 50K paying | May 2028 |
| Year 3 | Market leader | $1.65M MRR, #1 consumer AI admissions tool | May 2029 |
| Year 5 | $100M ARR | $8.5M MRR, 500K paying users | May 2031 |

### Weekly Dashboard (track from day 1)

- Signups (total + by source)
- Free-to-paid conversion rate (target: 10%)
- Feature usage (analyses, essays, chats per user)
- Trial limit hit rate (% of free users hitting caps -- should be 30-50%)
- MRR + churn rate
- NPS (monthly survey)
- CAC by channel
- SEO: organic traffic + keyword rankings

---

## APPENDIX: THE MATH TO $100M ARR

```
500,000 paying users x $16.99 avg monthly ARPU x 12 months = $101.9M ARR

How to get 500K paying users:
- 5M total users (10% conversion)
- 5M users from: 2M organic/SEO + 1.5M referral + 1M paid + 500K B2B

How to get $16.99 ARPU:
- 60% on Plus ($12.99 by Year 5) = $7.79 contribution
- 25% on Pro ($24.99 by Year 5) = $6.25 contribution
- 10% on B2B seats ($30/seat) = $3.00 contribution
- 5% Season Pass equiv = $0.41 contribution
- Blended: $17.45

This requires:
- Grad school expansion (doubles addressable market)
- International expansion (3x addressable market)
- B2B school licensing (highest ARPU segment)
- One modest price increase (~$3) over 5 years
- Maintaining >97% gross margin through efficient AI routing
```

---

*This document is a living plan. Update quarterly with actuals vs. projections. The code is built. The market is waiting. Ship it.*
