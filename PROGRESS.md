# AdmitPath UI/UX Overhaul — PROGRESS.md

**Last Updated**: 2026-05-09
**Status**: Phases 0–16 Complete ✅ + post-pivot blue brand applied + de-AI pass shipped + content expansion + design system overhaul + SEO/compliance + accessibility/performance

> **HISTORICAL NOTE — palette pivot 2026-04-27:** This document originally tracked an orange-brand iteration (`#E67635` primary, `#C45220` deep accent). That brand was reverted to **Discovery Labs slate blue** (`#4A6FA5` primary, `#1E3352` deep, `#7A99C9` accent) per owner direction; see `CLAUDE.md` Hard Rule 3 + `globals.css` "AdmitPath Design System — Discovery Labs Slate Blue" comment. Phase 1's "complete orange token system" entry below describes a state that no longer ships. Current live tokens: blue brand, DM Serif Display + Instrument Sans + Lora.
>
> **Post-pivot work shipped 2026-05-04** ("de-AI pass"):
> - Mountain section: "Summit" → "Dream School" final milestone, hand-traced star SVG (replaced `★` text glyph), GraduationCap icon, dark slate-grey "Get started" CTA gradient.
> - Hand-illustrated `<LogoMark>` SVG component replaces the generic boxed-A across nav, footer, sign-in/up panels.
> - Pricing CTAs de-anchored from "$9.99" → "Starts free · Plus $9.99/mo when you upgrade" on 4 surfaces.
> - Master prompts library (`lib/prompts/`) — counselor-chat v2.0 persona, essay-coach with 6-dim rubric + cliche red-flag list, college-matcher with 30/60/90-day plan, resume-parser.
> - `EssayVersion` Prisma model + side-by-side compare UI ("Git for essays").
> - `/profile/import` text-paste resume import flow with confirmation step (fixes ADMITPATH-001 OCR hallucination).
> - AP/IB/Honors structured toggle chips in onboarding step 6.
> - 25-student smoke-test fixture (`npm run test:students` — 25/25 pass).
> - `BUILD_AUDIT.md` generator (`npm run audit:build` — 201 files / 0 secret hits).
> - `<SmartHomeLink>` routes "Back to home" to `/dashboard` when authenticated.
> - `competitions.json` expanded 45 → 55 entries (added USACO, USAMO, USNCO, Diamond Challenge, Wharton GHSIC, John Locke, Concord Review, USSYP, CyberPatriot, HMMT).
>
> See `CHANGELOG.md` `[Unreleased]` for the full log of every file edit.

---

## ✅ Phase 13: Content Expansion (waves 67–150) (2026-05-09)
- [x] 200 long-form blog articles (up from 11)
- [x] 23 deep reference pages built
- [x] 45 free tools at /tools hub
- [x] Capstone /college-admissions-framework-2026 page

---

## ✅ Phase 14: Design System Overhaul (2026-05-09)
- [x] 4 shared marketing components (MarketingNav, MarketingCTA, Section, MarketingLayout)
- [x] ~54 marketing pages migrated to shared components
- [x] Hero entrance animation, gradient text, CTA pulse glow
- [x] Card hover transitions, score bar animation, button shimmer
- [x] Dashboard parallax, animated StatsBar, ScrollReveal on all sections
- [x] Footer cleanup, testimonials reframing
- [x] dl-card-hover, dl-card-enter CSS classes

---

## ✅ Phase 15: SEO & Compliance (2026-05-09)
- [x] 9 SEO fixes (pricing metadata, blog BASE, homepage JSON-LD, OG images)
- [x] CLAUDE.md design compliance audit (removed banned colors, fixed fonts)
- [x] Email templates redesigned (Inter font, brand colors, card layout)
- [x] OG image generator polished (dark gradient, frosted logo)
- [x] PWA manifest background_color fixed

---

## ✅ Phase 16: Accessibility & Performance (2026-05-09)
- [x] ARIA labels, skip-to-content verified, reduced-motion respected
- [x] Mobile responsive verified, landing nav padding fixed
- [x] Performance audited (no issues — articles.ts server-only, images optimized)

---

## ✅ Phase 0: Design Reference Analysis & Audit
- [x] Reference design analysis (Stripe, Linear, Framer, Vercel, Notion precedent)
- [x] Codebase audit documenting current state (slate-blue, Inter fonts)
- [x] Gap identification matrix (color, fonts, components, pages)
- [x] File change roadmap — `AUDIT.md` created

---

## ✅ Phase 1: Globals.css Design System & Typography Swap
- [x] Rewrote `app/globals.css` with complete orange token system
- [x] Root color tokens: primary #E67635, deep accent #C45220/#B34A1C, neutrals, status colors
- [x] Dark mode palette
- [x] Typography: DM Serif Display + Instrument Sans + Lora
- [x] Spacing, border radius, shadow scales
- [x] Animation timing tokens
- [x] Component layer styles: buttons, cards, inputs, badges, score bars, sidebar, FAB
- [x] `--font-dm-sans` legacy alias → Instrument Sans
- [x] `--font-jetbrains-mono` token
- [x] `--radius-xs: 2px`
- [x] `@keyframes shake` + `.animate-shake` for form validation
- [x] Updated `app/layout.tsx` — font imports, variables, viewport themeColor

---

## ✅ Phase 2: Component Library
- [x] Buttons: physical depth `box-shadow: 0 2px 0 #B85220`, 44px height, hover lift
- [x] Cards: featured variant with orange top border + glow
- [x] Inputs: 44px height, orange focus ring
- [x] Empty state classes: `.empty-state`, `.empty-state-icon`, `.empty-state-title`
- [x] Chatbot FAB: rounded-[16px], `TriangleDotsIcon` SVG (3-circles-triangle, NOT chat bubble)
- [x] Toast: slide-in animation, orange info variant, 4s/6s auto-dismiss

---

## ✅ Phase 3: Landing Page
- [x] 68px sticky nav with `blur(16px) saturate(180%)` + WebkitBackdropFilter
- [x] Hero: 100vh min-height, 2-column layout, right column `rotate(1.5deg)`
- [x] Floating trust badges on hero
- [x] `HoursBackSection` dark gradient with 4 animated counters
- [x] No "Ready in X seconds" copy
- [x] All blue colors purged (340+ replacements)

---

## ✅ Phase 5: Pricing Page
- [x] 3-tier: Free $0 / Plus $9.99 (highlighted) / Pro $19.99
- [x] Comparison table with all features
- [x] FAQ accordion (6 questions, Framer Motion height animation)
- [x] Trust row (SOC 2, cancel anytime, Stripe secure)

---

## ✅ Phase 8: Blog
- [x] Magazine grid: featured article full-width 2-col hero
- [x] 3-col grid for remaining articles
- [x] `tagFromKeyword()` auto-categorization
- [x] Full JSON-LD `@graph`: BreadcrumbList + Blog + BlogPosting schemas
- [x] 68px nav + saturate backdrop

---

## ✅ Phase 9: Animations
- [x] `components/scroll-reveal.tsx`: `ScrollReveal` (fade+slide, useInView once:true, threshold 0.15)
- [x] `StaggerContainer`: staggerChildren 80ms default
- [x] `components/page-transition.tsx`: AnimatePresence fade+nudge on pathname change
- [x] Hero stagger: 7-dimensions grid wrapped in `StaggerContainer`
- [x] How-it-works steps: `ScrollReveal` with staggered delay
- [x] `MiniScoreDial`: 64×64 SVG circular progress, spring scaleIn, strokeDashoffset fill 0→score
- [x] MiniScoreDial grid rendered in analyze results panel (above AnimatedScoreBar)
- [x] Toast slide-in: `@keyframes toast-in` in globals.css
- [x] Shake animation: `@keyframes shake` + `.animate-shake` for form validation

---

## ✅ Phase 10: Security
- [x] Replaced in-memory rate limiter with Upstash Redis (`@upstash/ratelimit` + `@upstash/redis`)
- [x] Graceful fallback to module-level Map when env vars not set
- [x] `rateLimitAI()`: 10 req/60s sliding window per userId (analyze, chat, essay)
- [x] `rateLimitAPI()`: 60 req/60s for general routes
- [x] Rate limit applied to `/api/analyze`, `/api/chat`, `/api/essay`
- [x] `Retry-After: 60` header on 429 responses
- [x] No client-side secrets: only `NEXT_PUBLIC_APP_URL` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` exposed
- [x] Admin reset-db: CRON_SECRET + ALLOW_PROD_WIPE guard

---

## ✅ Phase 11: AdmitPath-Specific
- [x] `MiniScoreDial` component: 7 dimension dials with fill animation on load
- [x] Dashboard: orange on all tool cards (replaced #0284C7 college list blue, removed purple bg)
- [x] Dashboard upgrade banner: orange warm gradient (replaced #EFF2F8/#DCE5F3 blue)
- [x] Colleges Kanban: target column uses #E67635, drag micro-animations (`motion.div layout`)
- [x] Score dial colors: green ≥75, orange ≥50, red <50

---

## ✅ Phase 12: QA
- [x] TypeScript: `npx tsc --noEmit` passes clean (0 errors)
- [x] Blue purge verified: 2 remaining violations found and fixed
  - `app/page.tsx` line 273: `#DCE5F3` → `#F5E0CC`
  - `components/landing/MountainSection.tsx` line 95: `#EFF2F8` → `#FDF5EE`
- [x] Dashboard orange audit: 3 blue values replaced
- [x] Font variables: `--font-dm-sans` alias for backwards compat, all headings `--font-dm-serif`
- [x] No hardcoded secrets in client-facing code

---

## ✅ Phase 12b: Final Audit Fixes (2026-05-04)
- [x] Billing "Most Popular" badge moved from Pro → Plus (matches landing page)
- [x] Pricing page: $200–$500/hr counselor value anchor added + LogoMark nav fix
- [x] Lighthouse audit runner script (`npm run audit:lighthouse`)
- [x] Clerk sign-in preload component on landing page hover
- [x] Profile completion ring: gradient stroke + tick marks + glow + spring checkmark
- [x] Math progression by-year tracker chips in onboarding step 6

---

## ✅ Phase 12c: Master Plan Final Audit & Completion (2026-05-04)
After honest audit against original plan, 5 items were missing/partial. All shipped:
- [x] **Data ingestion scripts** (`scripts/ingest/`) — 8 sources (Scorecard, IPEDS, CDS C7, FairTest, Common App, Opportunity Insights, Compass Prep, UC) + run-all + README + `npm run ingest`
- [x] **Typed college search API** (`/api/colleges/search`) — Zod-validated, 12 filters, edge-cacheable
- [x] **Context-aware rigor scoring** (`lib/rigor-scoring.ts`) — AP saturation vs school's apsOffered, wired into analyze route
- [x] **AI-powered Why-us coach** (`/api/essay/why-us`) — Pro tier hits Anthropic via `routeLlmCall`, heuristic short-circuit + graceful degradation
- [x] **Personalized logged-in /money predictor** — auth-gated, profile-aware, sibling discount + auto-merit overlay against user's actual college list

Also: Profile model gained `householdIncome` + `siblingsInCollege` fields (Prisma migration needed on next deploy).

## ✅ Phase 12d: Master Plan Completion Sprint (2026-05-04)
- [x] **Calibrated band predictor** (`lib/admit-rates.ts`) — replaces precise % with honest "Very Likely / Possible / Long Shot / Hail Mary" bands per the master plan
- [x] **ICS export endpoint** (`/api/deadlines/ics`) — downloadable iCalendar for all 50 schools, with `?slugs=` filter
- [x] **Demonstrated interest checklist** page (17 tracking + 16 non-tracking schools, 11 actions across 3 tiers)
- [x] **Auto-Merit Scholarship Match** (`/merit-match`) — 20 schools, 30+ guaranteed merit tiers, GPA+SAT/ACT input
- [x] **Per-school AI Policy Badge** (`lib/ai-policy.ts` + component) — surfaced in essay editor and college detail pages
- [x] **Three-tier LLM router** (`lib/llm-router.ts`) — Cerebras → Groq → Anthropic (Pro tier only)
- [x] **CDS C7 weight overlay** (`lib/cds-weights.ts`) — 40 schools, 7 dimensions, "What this school weighs" card on detail pages
- [x] **Honest reach calibration** — analyze page now shows band labels (Very Likely / Possible / Long Shot / Hail Mary) instead of bare percentages
- [x] **40-year ROI calculator** (`/roi`) — major-specific salary curves, loan amortization, prestige boost slider
- [x] **Sibling-in-college FAFSA discount** — folded into ROI calculator (CSS Profile 32%/sibling)
- [x] **Undermatching nudge** (`/undermatch` + `<UndermatchingNudge>` component) — Hoxby & Avery-backed self-check
- [x] **Why-us specificity scorer** (`lib/why-us-scorer.ts`) — heuristic, no-LLM, fires live in essay editor
- [x] **4-axis voice rubric** (`lib/voice-rubric.ts`) — specificity, cadence, stance, self-disclosure — live in essay editor
- [x] **Essay live coach** (`<EssayLiveCoach>`) — combines voice rubric + why-us scorer, updates per keystroke

## ✅ Phase 12e: Content & Tools Sprint (2026-05-04)
- [x] Resources section: hub + summer programs + scholarships + competitions (4 pages)
- [x] Interview prep resource page (22 questions across 5 categories)
- [x] Application deadlines page (50 schools, grouped by ED/EA/REA/RD)
- [x] Net price estimator (24 schools, income-based slider)
- [x] Admissions glossary (38 terms, A–Z with quick nav)
- [x] Application timeline (freshman–senior year month-by-month)
- [x] Compare colleges tool (side-by-side up to 5 schools)
- [x] "What Are My Chances?" quiz (5-step guided assessment)
- [x] College data enrichment: testPolicy, needBlind, meetsFullNeed, earlyOption on 40 schools
- [x] Policy badges on college detail pages (test-optional, need-blind, meets full need, early option)
- [x] 2 new blog articles (Early Decision vs EA, How to Build a College List)
- [x] Colleges expanded from 30 → 105 entries (previous sprint, now tracked)
- [x] Loading skeletons for all new routes (resources, deadlines, glossary, timeline, compare, quiz)
- [x] Sitemap updated with 8 new public routes
- [x] Footer updated with 6 new links (Resources, Deadlines, Net price, Compare, Timeline, Glossary)
- [x] Inline essay edits component with clickable annotations
- [x] Red flags display in essay feedback
- [x] OnboardingCard re-wired into dashboard
- [x] Manifest enhanced with icons, categories, shortcuts
- [x] CollegeLogo canonical component wired into kanban

---

## 🎯 Remaining (Deploy-time)
- [ ] Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in Vercel env
- [ ] Rotate 27 leaked Groq keys (see `SECURITY_INCIDENT.md`)
- [ ] Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` points to production app
