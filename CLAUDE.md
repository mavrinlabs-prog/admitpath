# AdmitPath — Claude Code Instructions

## Hard Rules (non-negotiable)
1. **No OpenAI anywhere.** LLM routing: Cerebras llama3.1-8b → Groq llama-3.3-70b-versatile (no Ollama, no OpenAI).
2. **Free plan is permanent.** Free plan = `free_trial` in DB, exposed as "Free" to users. Paid plan: Pro ($19.99/mo or $199/yr). No Plus tier. Season Pass removed. `TRIAL_LIMITS` (5 analyses / 5 essays / 5 chat / 8 colleges) are the Free tier caps — no time limit. Legacy Plus price IDs in Stripe resolve to Pro via `resolvePlan()`. See `lib/trial.ts`.
3. **Design system — Discovery Labs (brand foundation, open to elevation).** The DL identity below is the brand baseline: keep its palette and type identity. It is **no longer frozen pixel-perfect** — spacing, hierarchy, motion, and accessibility may be elevated per the ui-ux-pro-max standards (landing + in-app UX redesign). Lock lifted 2026-07-08 (was "pixel-perfect rebrand 2026-05-05"). Primary: `#4A6FA5` (slate blue). Brand-dark `#2E4A6E`, brand-deep `#1E3352`. Background tokens (cool blue-grey, NOT warm cream): `--color-bg #D5DCE8` / `--color-surface #EFF2F8` / `--color-surface-sunken #E3E8F1` / `--color-surface-raised #FFFFFF`. Text: `#1B2030` primary / `#454B5E` secondary / `#8890A5` muted. Borders: `rgba(0,0,0,0.06)` (very subtle). Typography (DL canonical): **Inter** (primary sans — headings + UI + body) + **Lora** (italic/script accents only, applied via `<em>` and `.font-script`) + **JetBrains Mono** (code/brag-sheet blocks). Legacy CSS-var aliases `--font-dm-serif`, `--font-instrument-sans`, `--font-dm-sans` all resolve to Inter. **BANNED:** Any orange — `#E67635`, `#F5A468`, `#C45220`, `#B34A1C` are fully removed. No DM Serif Display, no Instrument Sans (replaced with Inter). No Roboto. No system-ui as primary stack. No purple. No warm cream backgrounds (`#FAFAF9`, `#F5F5F4`, `#E8E0D8` are removed — DL is cool blue-grey). Framer Motion for animations. (History: orange → blue 2026-04-27 owner-flip, then warm-cream → cool-blue-grey + DM Serif → Inter on 2026-05-05 to match canonical Discovery Labs design system from `frontend_template/src/index.css`.)
4. **One file per commit.** Always update CHANGELOG.md.
5. **No hardcoded secrets.** All keys via `process.env.*` only.
6. **No Mitran name in public-facing content.** Use "AdmitPath team".
7. See `SECURITY_INCIDENT.md` — 27 Groq keys were leaked. Keys must be rotated before deployment.

## Key Files
- `lib/groq.ts` — Cerebras + Groq routing (do not add OpenAI)
- `lib/stripe.ts` — PLANS object (Pro only; legacy Plus price IDs resolve to Pro)
- `prisma/schema.prisma` — DB schema
- `app/api/analyze/route.ts` — 7-dimension AI scoring
- `app/api/chat/route.ts` — AI counselor chat
- `app/api/essay/route.ts` — Essay feedback (6 dimensions)

## Pricing
- Free: $0 (permanent, usage-capped: 5 analyses / 5 essays / 5 chat / 8 colleges)
- Pro: $19.99/mo or $199/yr → `STRIPE_PRICE_PRO` / `STRIPE_PRICE_PRO_ANNUAL`
- No Plus tier. Legacy Plus Stripe price IDs resolve to Pro.

## 7 Scoring Dimensions
academicRigor, leadership, awards, activityDepth, spike, essayQuality, recommendations
(each 0–100, calibrated to real admissions standards — no grade inflation)

## Plan Gating
- `isPaidPlan(plan)` → true for "pro" (also accepts legacy "plus" DB values)
- `checkFeatureAccess(user, feature, collegeCount?)` → single gate for all paid/trial features in `lib/trial.ts`
- All AI routes use `checkFeatureAccess` + `accessDenialResponse`
- Unauthenticated → 401, trial expired/exhausted → 403/429 with `upgradeUrl`

## Model Preference
- Sonnet 4.6 for planning/architecture
- Opus 4.7 for critical decisions
- Cerebras llama3.1-8b for all user-facing AI features
- Groq llama-3.3-70b-versatile as fallback
