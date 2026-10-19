# AdmitPath — production-readiness report (2026-10-18/19)

Branch `prod-readiness-2026-10-18` (from checkpoint `checkpoint-before-prod-readiness-2026-10-18`, base commit `381902e`). Nothing pushed or deployed. Production is https://admith.vercel.app.

## Repo constraints noted before editing
- **CLAUDE.md**: no OpenAI (kept: Cerebras → Groq, optional Anthropic); Free plan permanent; Pro $19.99/mo; Discovery Labs palette (slate blue, cool blue-grey, Inter/Lora; no orange/purple/cream); no hardcoded secrets; "one file per commit, always update CHANGELOG.md". **Conflict:** the orchestrator asked for logical commits, so I made 20 logical commits (not one per file) and added a CHANGELOG.md entry. CLAUDE.md mentions "$199/yr" but code, `.env.example`, and the UI are monthly-only — flagged, not changed.
- **HALTED.md** (2026-04-27): describes a half-finished Clerk→Google edit in `app/page.tsx`. The imported source is consistent: it uses `getGoogleUser()`, `clerkConfigured` is gone, and typecheck and build pass. Treated as stale.
- **SECURITY_INCIDENT.md**: leaked Groq/Cerebras/Stripe-live/Resend keys are still in the history of the old repo. No secrets are in this tree, and none were added. **Keys must be rotated before deploy (owner action).**

## Reproduced failures (before fixes, local production-like server with a real Postgres-wire DB)
I used a local PGlite server (`@electric-sql/pglite-socket`, installed in the scratchpad, not the repo), `prisma db push`, seeded users, and signed session cookies.
| Report | Reproduction | Root cause | Fix |
|---|---|---|---|
| `/api/analyze 400` on manual fill | 35 activity lines → 400 "Array must contain at most 30"; weighted GPA 5.6 → 400 "≤ 5.5" | Every textarea line became one activity; 6.0-scale weighted GPA; strict per-item lengths; UI showed only "Invalid input" | `lib/analyze-contract.ts` normalizes (caps lists, truncates, ignores out-of-range weighted GPA, all with warnings) and rejects only wrong values, with per-field messages shown inline (`FieldHint`). If any AI provider fails, a rubric-based report is returned (flagged `fallback`) instead of a 503. |
| `/api/essay 400` | PATCH autosave with >7,000 chars or a >500-char prompt → 400 every 3 s; non-UUID request key → 400 | Autosave used the strict scoring limits; Safari < 15.4 has no `crypto.randomUUID` | Lenient `essayDraftSchema` (truncates), prompt limit 3,000, essay 12,000, request-key fallback generator |
| `/chat` "Couldn't reach the counselor." | 41+ messages, any reply >4,000 chars, empty or stopped assistant bubble, system role → 400. The client showed every non-2xx as "couldn't reach" | Over-strict history schema | `lib/chat-contract.ts` normalizes history. The client sends only role and content, maps 400/403/429/5xx to specific messages, and offers Retry |
| chat API 500s | **Not reproducible locally.** Every 500-capable branch already returns JSON 503, and AI failures stream a rule-based reply | Unknown — needs Vercel function logs | Error handling hardened; check prod logs after deploy |

## What changed (files)
New: `lib/analyze-contract.ts`, `lib/chat-contract.ts`, `lib/resume-local-parser.ts`, `lib/entitlements.ts`, `lib/entitlements-server.ts`, `lib/checkout.ts`, `lib/abuse-signals.ts`, `lib/school-inquiry.ts`, `lib/school-inquiry-server.ts`, `lib/popup-policy.ts`, `lib/system-status.ts`, `app/checkout/pro/route.ts`, `app/for-counselors/page.tsx`, `app/status/page.tsx`, `app/api/status/route.ts`, `app/admin/inquiries/page.tsx`, Pro gate layouts (`app/{what-if,this-week,tracker,summer,competitions,rec-letters,parent}/layout.tsx`), `components/pro-feature-gate.tsx`, `components/school-inquiry-form.tsx`, `components/institution-page.tsx`, `components/landing/{ProfileReportPreview,CommandCenterPreview,sample-profile}`, `components/marketing/{AudienceMenu,NavAuthCta,StatusIndicator,nav-links}`, `tests/*` (8 files, 58 tests), migration `prisma/migrations/20261018120000_prod_readiness_inquiries_referrals_abuse/`.
Deleted: `app/worksheets/**`, `lib/worksheet-redirects.ts` (all /worksheets URLs 308 to /tools or the mapped tool).
Modified: analyze/essay/chat routes and pages, resume import, referral lib + APIs, Stripe create-checkout + webhook (referral completion), Google OAuth start/callback (ref param, checkout return, anti-abuse signals), dashboard, sidebar, landing page, hero, PressBar, marketing nav/footer, mobile nav, blog, resources, tools, pricing, legal pages, admin pages, paywall gate, `/api/me`, email (reward email), `.env.example`, `.gitignore`, `proxy.ts`, `CHANGELOG.md`. The full per-commit file list is below.

## Key behaviours
- **Entitlements (single source of truth)** — `lib/entitlements.ts` sets the plan requirement for each feature. Plan resolution is `effectivePlan()`, which webhooks drive (`checkout.session.completed`, `customer.subscription.updated/deleted`). Pro pages use `ProFeatureGate`, Pro APIs use `requireFeature` (403 + `upgradeUrl:/checkout/pro`), and the dashboard, `/api/me`, `/tools` badges, and `/admin/users` all read the same registry. The tools hub and guides are Free by design; personalized tools are Pro.
- **Go Pro** — every Upgrade/Go Pro/Start Pro CTA links to `/checkout/pro`. Signed out, it goes to sign-up and then straight back to checkout; the OAuth callback skips the profile detour for `/checkout/*`. Signed in, it goes to Stripe Checkout. Already Pro goes to /billing. Missing Stripe config goes to /pricing with a clear toast.
- **Referrals** — `/r/CODE` → `/sign-up?ref=CODE&redirect_url=/checkout/pro` (cookie + query) → account → `/checkout/pro`. That route creates a Stripe coupon (50% off, `duration=once`, `max_redemptions=1`) and a promotion code limited to the referee's customer and first transaction, then applies it through Checkout `discounts`. On `checkout.session.completed` the referral is marked redeemed exactly once, and the referrer gets a single-use reward code (default 100% off one month; env `REFERRAL_REWARD_PERCENT_OFF`; capped at 12). The reward is emailed if `RESEND_API_KEY` is set, otherwise stored as `stored_manual_send` and shown in /admin/referrals. Self-referrals, same normalized email, same device token, and same Stripe customer are stored as `blocked` with a reason. The referee never gets free access. The old "both get a free month" balance credit was removed.
- **Anti-abuse** — sign-up stores the normalized email (Gmail dots and +aliases), a SHA-256 of an httpOnly random `ap_device` token, and a salted IP hash, then flags matches for admin review (never auto-deletes). No MAC addresses and no fingerprinting.
- **School inquiries** — the inquiry is saved to `SchoolInquiry` first (with createdAt and sourcePage), then the team is notified. Without `RESEND_API_KEY` the notification is logged as a dry run. Visible at /admin/inquiries. There is a no-JS form fallback and a honeypot.
- **Popups** — the exit-intent modal needs ≥25 s on page AND ≥50% scroll, or desktop exit intent. Limits: once per session, once per 7 days, and 30 days after a dismissal. It never shows to signed-in users or on auth, checkout, app, or legal pages. Toasts are capped at 2 per session.

## How the migration deploys
`vercel.json` runs only `npm run build`; **migrations are not applied automatically.** Before deploying the code, run `npx prisma migrate deploy` against production. It applies `20261018120000_prod_readiness_inquiries_referrals_abuse`, which is additive and idempotent (`IF NOT EXISTS`). Alternatively, run that SQL file directly. The code tolerates a missing table only on `/admin` counts; inquiry submit would return 503 until the migration runs.

### Exact SQL to reverse the schema change (owner requirement)
```sql
DROP TABLE IF EXISTS "SchoolInquiry";
DROP INDEX IF EXISTS "Referral_refereePromoCodeId_idx";
DROP INDEX IF EXISTS "Referral_rewardStatus_idx";
ALTER TABLE "Referral"
  DROP COLUMN IF EXISTS "refereeCouponId",
  DROP COLUMN IF EXISTS "refereePromoCodeId",
  DROP COLUMN IF EXISTS "refereePromoCode",
  DROP COLUMN IF EXISTS "refereeDiscountPct",
  DROP COLUMN IF EXISTS "checkoutSessionId",
  DROP COLUMN IF EXISTS "checkoutStartedAt",
  DROP COLUMN IF EXISTS "redeemedAt",
  DROP COLUMN IF EXISTS "rewardCouponId",
  DROP COLUMN IF EXISTS "rewardPromoCodeId",
  DROP COLUMN IF EXISTS "rewardCode",
  DROP COLUMN IF EXISTS "rewardStatus",
  DROP COLUMN IF EXISTS "rewardGeneratedAt",
  DROP COLUMN IF EXISTS "rewardEmailedAt",
  DROP COLUMN IF EXISTS "blockedReason";
DROP INDEX IF EXISTS "User_normalizedEmail_idx";
DROP INDEX IF EXISTS "User_deviceId_idx";
DROP INDEX IF EXISTS "User_signupIpHash_idx";
ALTER TABLE "User"
  DROP COLUMN IF EXISTS "normalizedEmail",
  DROP COLUMN IF EXISTS "signupIpHash",
  DROP COLUMN IF EXISTS "abuseSignals",
  DROP COLUMN IF EXISTS "abuseReviewStatus";
DELETE FROM "_prisma_migrations" WHERE migration_name = '20261018120000_prod_readiness_inquiries_referrals_abuse';
```
(`User.deviceId` existed before this pass; it is now populated with the device-token hash and is not dropped.) Revert the code with `git revert` of the commits below, or reset to tag `checkpoint-before-prod-readiness-2026-10-18`.

## Verification
- `npx tsc --noEmit`: clean. `npx eslint .`: 0 problems.
- `npm test` (vitest): **8 files, 58 tests passing**. They cover the analyze/essay/chat failure contracts, resume parsing, entitlements (free→pro→free, manual/code activation, expired trial), the free usage limit, referrals (one-time, no self-referral, duplicate-account block, tamper), abuse heuristics, webhook signature rejection (400 before any DB access), OAuth state mismatch, safe redirects, inquiry form validation, the popup policy, and content guards (no pilot language, no $1,599/$1,999, no cross-promo, no dead domains).
- `npm run build`: succeeds. Env used for build/run: local placeholders only (`DATABASE_URL`/`DIRECT_URL` pointing at a local PGlite on 127.0.0.1:54329, dummy `SESSION_SECRET`, `ADMIN_EMAILS=admin@example.test`). No Stripe, AI, Google, or Resend keys.
- Local `next start` crawl: all 836 sitemap + touched routes → 831×200, 3×308, 1×307, 1×303, **0 errors**. Signed-in flows: see ADMITPATH_TEST_MATRIX.csv.
- Production baseline (read-only GET, 94 paths): 89×200. 404 only for the new routes (`/checkout/pro`, `/for-counselors`, `/status`), as expected before deploy.

## Research sources (patterns only)
- Stripe Checkout `discounts` vs `allow_promotion_codes` exclusivity; Promotion Codes API with `promotion.coupon`, `customer`, `max_redemptions`, `restrictions.first_time_transaction` — from the stripe-node v22 type definitions in `node_modules/stripe` (API 2026-06-24.dahlia).
- Seamless CSS marquee (duplicated track + translateX(-50%), `prefers-reduced-motion`) — standard pattern; no external code copied.

## LEGAL REVIEW NEEDED
1. Terms §5–9 (billing, refunds, referral/promo-code rules, school agreements, liability) — `app/terms/page.tsx`.
2. Privacy (FERPA/COPPA/state student privacy, retention, processors, anti-abuse signals) — `app/privacy/page.tsx`.
3. Cookie inventory/consent model — `app/cookie-policy/page.tsx`.
4. Security page FERPA statement — `app/security/page.tsx`.
5. Accessibility: "aim to conform" wording, no conformance claim — `app/accessibility/page.tsx`.
6. University names and monograms in the school strip; licensed logo files would need trademark permission — `components/landing/PressBar.tsx`.
7. Referral reward size (default one free month) — confirm before launch.

## Blockers / owner actions
1. **Rotate all leaked keys** (SECURITY_INCIDENT.md) and set fresh ones in Vercel.
2. Run `npx prisma migrate deploy` on the production DB (needs `DATABASE_URL`/`DIRECT_URL`).
3. Stripe (test mode first): `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_WEBHOOK_SECRET`. Then verify hosted checkout, the 50% referral code auto-applied, the webhook upgrade/downgrade, and reward code creation.
4. `REFERRAL_SECRET` (or `SESSION_SECRET`) of 32+ chars in production. Without it, referral links show "temporarily unavailable" instead of crashing.
5. Google OAuth client for an end-to-end sign-up → checkout test.
6. `RESEND_API_KEY` (+ `SCHOOL_INQUIRY_EMAIL`) if emails should be sent. Until then, inquiries and rewards are stored for manual follow-up.
7. AI keys (Cerebras/Groq). Without them, analysis, essay, and chat return the rule-based fallbacks.
8. Deploy access to Vercel team `cognifys-projects` (this machine cannot deploy). Then re-run the prod crawl and the chat flows, and check logs for the historical chat 500s.
9. Visual check at 375 px and desktop. No screenshot pass was done in this session.
10. Optional: `ABUSE_HASH_SALT`, `REFERRAL_REWARD_PERCENT_OFF` (documented in `.env.example`).

## Status counts (ADMITPATH_BACKLOG.csv, 42 rows)
Done: 29 · Done-needs-prod-verify: 13 · Blocked: 0 · Not-applicable: 0.

## Commits (base 381902e → HEAD)
### 69849fe — chore: inquiry studentCount message; changelog entry for prod-readiness pass
- M	CHANGELOG.md
- M	lib/school-inquiry.ts

### 142de71 — test: unit tests for contracts, entitlements, referrals, abuse, webhook, OAuth state, forms, popups
- M	.gitignore
- M	components/institution-page.tsx
- A	tests/analyze-contract.test.ts
- A	tests/content-guards.test.ts
- A	tests/entitlements.test.ts
- A	tests/essay-chat-contract.test.ts
- A	tests/forms-popup-redirect.test.ts
- A	tests/referral-abuse.test.ts
- A	tests/resume-parser.test.ts
- A	tests/setup.ts
- A	tests/webhook-oauth.test.ts

### 3a21c75 — fix: replace non-production domains, footer logo, document new env vars
- M	.env.example
- M	app/api/deadlines/ics/route.ts
- M	app/help/page.tsx
- M	components/marketing/SiteFooter.tsx

### 356a0db — docs(legal): terms, privacy, cookies, security, accessibility updated
- M	app/accessibility/page.tsx
- M	app/cookie-policy/page.tsx
- M	app/privacy/page.tsx
- M	app/security/page.tsx
- M	app/terms/page.tsx

### 30248f4 — feat(dashboard): Pro features moved below core work; locks from entitlements registry
- M	app/dashboard/page.tsx

### 9996040 — fix(ui): /resources grouped by goal; blog components on design tokens with shared footer
- M	app/blog/[slug]/page.tsx
- M	app/blog/page.tsx
- M	app/resources/page.tsx

### c947949 — feat(tools): /tools in sidebar, /worksheets fully migrated, Pro badges from registry
- M	app/layout.tsx
- M	app/page.tsx
- M	app/tools/page.tsx
- D	app/worksheets/[slug]/example/page.tsx
- D	app/worksheets/[slug]/page.tsx
- D	app/worksheets/page.tsx
- M	components/app-nav.tsx
- D	lib/worksheet-redirects.ts
- M	proxy.ts

### c457508 — feat(landing): single auth CTA, schools/counselors + audience menu, status footer, smart popups
- A	app/api/status/route.ts
- M	app/layout.tsx
- M	app/page.tsx
- A	app/status/page.tsx
- M	components/ExitIntentPopup.tsx
- M	components/SocialProofToast.tsx
- A	components/marketing/AudienceMenu.tsx
- M	components/marketing/MarketingNav.tsx
- A	components/marketing/NavAuthCta.tsx
- M	components/marketing/SiteFooter.tsx
- A	components/marketing/StatusIndicator.tsx
- A	components/marketing/nav-links.ts
- M	components/mobile-nav.tsx
- A	lib/popup-policy.ts
- A	lib/system-status.ts

### 9d78470 — feat(upgrade): every Go Pro/Upgrade CTA goes straight to Stripe checkout
- M	app/chat/page.tsx
- M	app/dashboard/page.tsx
- M	app/essays/page.tsx
- M	app/pricing/page.tsx
- M	components/TrialUsageBar.tsx
- M	components/counselor-widget.tsx
- M	components/trial-banner.tsx
- M	lib/api-client.ts
- M	lib/free-usage.ts
- M	lib/trial.ts

### ee9aff8 — feat(referrals,checkout): direct Pro checkout, one-time 50% referral code, reward codes, abuse checks
- M	.gitignore
- M	app/admin/referrals/page.tsx
- M	app/api/auth/google/callback/route.ts
- M	app/api/auth/google/route.ts
- M	app/api/referrals/route.ts
- M	app/api/stripe/create-checkout/route.ts
- M	app/api/webhooks/stripe/route.ts
- A	app/checkout/pro/route.ts
- M	app/dashboard/page.tsx
- M	app/r/[code]/route.ts
- M	app/refer/layout.tsx
- M	app/refer/page.tsx
- M	app/sign-up/[[...sign-up]]/page.tsx
- M	components/google-oauth-button.tsx
- A	lib/checkout.ts
- M	lib/email.ts
- M	lib/oauth-referral.ts
- M	lib/referral.ts
- M	lib/site-url.ts

### c126989 — feat(gating): single entitlements registry enforced on pages, APIs, admin
- M	app/admin/users/page.tsx
- M	app/api/competitions/recommend/route.ts
- M	app/api/interview/route.ts
- M	app/api/me/route.ts
- M	app/api/rec-letter/brag-sheet/route.ts
- M	app/api/rec-letter/recommenders/route.ts
- M	app/api/scholarships/recommend/route.ts
- M	app/api/summer-programs/recommend/route.ts
- M	app/api/tracker/[id]/route.ts
- M	app/api/tracker/route.ts
- M	app/api/tracker/survey/route.ts
- A	app/competitions/layout.tsx
- M	app/interview-practice/layout.tsx
- M	app/outcomes/layout.tsx
- A	app/parent/layout.tsx
- A	app/rec-letters/layout.tsx
- M	app/scholarships/page.tsx
- A	app/summer/layout.tsx
- A	app/this-week/layout.tsx
- M	app/this-week/page.tsx
- A	app/tracker/layout.tsx
- A	app/what-if/layout.tsx
- M	app/what-if/page.tsx
- M	components/paywall-gate.tsx
- A	components/pro-feature-gate.tsx
- A	lib/entitlements-server.ts
- A	lib/entitlements.ts
- M	lib/seo-sitemaps.ts

### 7873aa8 — fix(resume): section-aware local parser and visible extraction progress
- M	components/resume-quick-import.tsx
- M	lib/profile-contract.ts
- A	lib/resume-local-parser.ts

### 4cc53cb — fix(chat): end 'Couldn't reach the counselor' on long conversations
- M	app/api/chat/route.ts
- M	app/chat/page.tsx
- A	lib/chat-contract.ts
- M	lib/counselor-context.ts

### b867d18 — fix(essay): stop /api/essay 400s from autosave and long prompts
- M	app/api/essay/route.ts
- M	app/essays/page.tsx
- M	lib/essay-contract.ts

### 7bcdc54 — feat(admin): school inquiry list and dashboard count
- A	app/admin/inquiries/page.tsx
- M	app/admin/layout.tsx
- M	app/admin/page.tsx

### 2d8d40d — feat(schools): paid custom-pricing inquiry form saved to DB for schools and counselors
- M	app/api/school-inquiry-form/route.ts
- M	app/api/school-inquiry/route.ts
- M	app/counselor/page.tsx
- A	app/for-counselors/page.tsx
- M	app/for-schools/layout.tsx
- M	app/for-schools/page.tsx
- M	app/for/[audience]/page.tsx
- A	components/institution-page.tsx
- A	components/school-inquiry-form.tsx
- A	lib/school-inquiry-server.ts
- A	lib/school-inquiry.ts

### 8f4b457 — feat(db): SchoolInquiry table, referral promo/reward columns, abuse signals
- A	lib/abuse-signals.ts
- A	prisma/migrations/20261018120000_prod_readiness_inquiries_referrals_abuse/migration.sql
- M	prisma/schema.prisma

### 3d4632d — feat(landing): rebuild Maya R. report card, school marquee, command center preview
- M	app/globals.css
- A	components/landing/CommandCenterPreview.tsx
- M	components/landing/HeroSection.tsx
- M	components/landing/PressBar.tsx
- A	components/landing/ProfileReportPreview.tsx
- A	components/landing/sample-profile.ts

### 23da845 — fix(analyze): normalize manual-fill input, field-level 400s, heuristic fallback
- M	app/analyze/page.tsx
- M	app/api/analyze/route.ts
- A	lib/analyze-contract.ts


### (final) docs(prod-readiness): AdmitPath backlog, traceability, route inventory, test matrix, report
- A docs/prod-readiness-2026-10/ADMITPATH_*.csv, ADMITPATH_REPORT.md
