# Change log and rollback guide — prod-readiness work (started 2026-10-18)

Every change made during this work is listed here with how to undo it. This file is updated as work lands and is committed to all three repos under `docs/prod-readiness-2026-10/`.

## 1. Git (repos in GitHub org `mavrinlabs-prog`)

| Repo | Default branch | Pre-change commit (tag `checkpoint-before-prod-readiness-2026-10-18`, pushed) | Work branch |
|---|---|---|---|
| worksheetgen | main | `95958ddaaa324ac09b1ac9a53883e5eb559a4d51` | `prod-readiness-2026-10-18` |
| admitpath | master | `381902e84e87c2e9138301754a76edee150069ae` | `prod-readiness-2026-10-18` |
| competeai | main | `3d32e3770e959405c7d00bfd6ecf4920a228e12b` | `prod-readiness-2026-10-18` |

How work lands: all commits are made on the work branch, then merged into the default branch with ONE merge commit (`git merge --no-ff`) per app. No force-pushes, no history rewrites; the work branch is pushed and kept.

### Undo options (pick one, per repo)
- **Undo everything, keep history (recommended):** revert the single merge commit.
  ```
  git checkout main          # master for admitpath
  git pull
  git revert -m 1 <merge-commit-sha>
  git push
  ```
- **Undo one specific change:** `git revert <commit-sha>` for that commit (commit list per app is in section 4).
- **Look at / restore the exact old state:** `git checkout checkpoint-before-prod-readiness-2026-10-18` (read-only view), or `git restore --source checkpoint-before-prod-readiness-2026-10-18 -- <path>` for one file.
- Database migrations added by this work are additive (new tables/columns only). Reverting code does not drop them; they are harmless if left. Exact SQL to drop them, if ever wanted, is listed per app in section 4.

## 2. Vercel (account `arunningidiot`, team `arunningidiots-projects`)
Nothing was changed on the existing `cognifys-projects` team or its live sites (worksheetgen-c / admith / competeai-c .vercel.app).

| Change (2026-10-18) | Undo |
|---|---|
| Created project `worksheetgen-mavrin` | `npx vercel project rm worksheetgen-mavrin --scope arunningidiots-projects` |
| Created project `admitpath-mavrin` | `npx vercel project rm admitpath-mavrin --scope arunningidiots-projects` |
| Created project `competeai-mavrin` | `npx vercel project rm competeai-mavrin --scope arunningidiots-projects` |
| Production env vars set: worksheetgen-mavrin → NEXT_PUBLIC_APP_URL, CRON_SECRET, IP_HASH_SECRET, SESSION_SECRET, SHARE_TOKEN_SECRET, UNSUBSCRIBE_SECRET (random values) | `npx vercel env rm <NAME> production` in a dir linked to the project, or delete the project |
| admitpath-mavrin → NEXT_PUBLIC_APP_URL, CRON_SECRET, HEALTHCHECK_SECRET, REFERRAL_SECRET, SESSION_SECRET, UNSUBSCRIBE_SECRET, ADMIN_TRAINING_EXPORT_TOKEN | same |
| competeai-mavrin → NEXT_PUBLIC_APP_URL, ADMIN_SYNC_SECRET, AUTH_SECRET, NEXTAUTH_SECRET, CRON_SECRET, REFERRAL_CODE_SECRET, SESSION_SECRET, UNSUBSCRIBE_SECRET, USAGE_HMAC_SECRET | same |
| Attempted `vercel git connect` to the mavrinlabs-prog repos — FAILED (Vercel GitHub app not installed on the org); nothing was changed | n/a |

## 3. Local machine
- Repos cloned into a temporary folder the app made for this session; deleting the session deletes the clones (everything is pushed to GitHub).
- Memory notes saved for future sessions (repo location, deploy path). No system settings, global git config, or other projects were changed.
- The pasted `vck_` Vercel key is stored only in this session's private scratch folder (permissions 600), never in a repo. Recommend revoking it in Vercel → Account Settings → Tokens after this work.

## 4. Per-app merges and commits (2026-10-19)

### worksheetgen — merge `cba1ff862abcce5e07a9783d512e893efc551d90` on `main`

Undo all: `git revert -m 1 cba1ff862abcce5e07a9783d512e893efc551d90`. Per-commit file lists and migration drop SQL: `docs/prod-readiness-2026-10/WORKSHEETGEN_REPORT.md`.

```
a077380 Nav, CTA and route cleanup: tools/templates, Go Pro direct checkout, referral links
ba0c26f Schema: access codes, anti-abuse signals, taxonomy, worksheet review, contact messages, referral discounts
ae130f1 Entitlements: single source of truth for plan gating + access code activation API
71f0e4c Access codes in settings and admin; admin users show effective plan/features
e4430cc Anti-abuse: privacy-respecting multi-account heuristics
95f96af Referrals: one-time 50%-off code for referee, reward code for referrer
4c84326 Two contact flows: support form and school/district custom-pricing inquiry
d3b8b56 Taxonomy in tools UI, content-terms gate, quality review on every saved worksheet
6bb0871 Admin worksheet review: approve / reject / revision / TPT review with quality score
06c0357 Teacher-facing grading: reteach targets, misconceptions, small groups, next steps
e548efe Worksheet preview follows WORKSHEET_VISUAL_FRAMEWORK
4c852be Smart popup: engagement-triggered, frequency-capped, suppressed for signed-in users and sensitive pages
0ceff42 Legal pages: fair use and rate limits, multi-account restrictions, content terms, admin review, school codes, student data, referrals, cookie inventory
c71c1eb Docs and copy: free cap is 3 everywhere (CLAUDE.md, email comment); document new modules
5d77dd8 Tests: entitlements (free/pro/code transitions), access codes, anti-abuse, forms, grading, popup policy, taxonomy/templates, worksheet review, webhook signature, OAuth state, referral links, protected-route redirects
a838655 Fix admin access-codes page build (destructuring into member expressions)
cc0b8de Forms: clear field messages when required fields are missing
d741d94 Lint: hoist contact field error component
0bb598c Docs: WorksheetGen prod-readiness backlog, traceability, route inventory, test matrix, crawls, report
```

### admitpath — merge `de35e14c2a94253e6fd711d3d81d13337c5d07b7` on `master`

Undo all: `git revert -m 1 de35e14c2a94253e6fd711d3d81d13337c5d07b7`. Per-commit file lists and migration drop SQL: `docs/prod-readiness-2026-10/ADMITPATH_REPORT.md`.

```
23da845 fix(analyze): normalize manual-fill input, field-level 400s, heuristic fallback
3d4632d feat(landing): rebuild Maya R. report card, school marquee, command center preview
8f4b457 feat(db): SchoolInquiry table, referral promo/reward columns, abuse signals
2d8d40d feat(schools): paid custom-pricing inquiry form saved to DB for schools and counselors
7bcdc54 feat(admin): school inquiry list and dashboard count
b867d18 fix(essay): stop /api/essay 400s from autosave and long prompts
4cc53cb fix(chat): end 'Couldn't reach the counselor' on long conversations
7873aa8 fix(resume): section-aware local parser and visible extraction progress
c126989 feat(gating): single entitlements registry enforced on pages, APIs, admin
ee9aff8 feat(referrals,checkout): direct Pro checkout, one-time 50% referral code, reward codes, abuse checks
9d78470 feat(upgrade): every Go Pro/Upgrade CTA goes straight to Stripe checkout
c457508 feat(landing): single auth CTA, schools/counselors + audience menu, status footer, smart popups
c947949 feat(tools): /tools in sidebar, /worksheets fully migrated, Pro badges from registry
9996040 fix(ui): /resources grouped by goal; blog components on design tokens with shared footer
30248f4 feat(dashboard): Pro features moved below core work; locks from entitlements registry
356a0db docs(legal): terms, privacy, cookies, security, accessibility updated
3a21c75 fix: replace non-production domains, footer logo, document new env vars
142de71 test: unit tests for contracts, entitlements, referrals, abuse, webhook, OAuth state, forms, popups
69849fe chore: inquiry studentCount message; changelog entry for prod-readiness pass
1c7df94 docs(prod-readiness): AdmitPath backlog, traceability, route inventory, test matrix, report
602b6ef test: fix typecheck of essay contract test
```

### competeai — merge `5bbd1ecd15e3f4ee57650ca739b8a3a685026ab4` on `main`

Undo all: `git revert -m 1 5bbd1ecd15e3f4ee57650ca739b8a3a685026ab4`. Per-commit file lists and migration drop SQL: `docs/prod-readiness-2026-10/COMPETEAI_REPORT.md`.

```
be86522 test: restore vitest config, trust canonical origin, fix unresolved schema placeholders
8c7b383 feat(deca): official 2026-27 event list, PI sets, and role-plays for all 28 events
b831483 feat(billing): single entitlements source, anti-abuse signals, 50%-off one-time referral codes
5073492 feat(forms,admin): school inquiry form, /schools page with Contact us, admin records
5b3a64e feat(ui): landing nav/anchors, official event grid, smart popup, subscribe-to-continue redesign
ea2a823 feat(roleplay): voice judge throughout prep and presentation, official-PI badges, event deep links
232e50a feat: written/presentation workspace, per-PI grading scores, coach context, dashboard routing
3963eda fix(blog,legal): readable article styles, shared nav/logo on blog, DECA-only terms and privacy
1642144 chore: add .env.example with every env var name (no values)
5209cf9 fix(routing): real 308s for retired pages and auth-gated routes via proxy
d57e76a fix(lint): use Link for sign-in in referral card
c615d0d fix(routing): drop root and blog loading boundaries so redirects/404s return real status codes
90b6e9f docs(prod-readiness): CompeteAI report, backlog, traceability, route/URL inventories, test matrix, DECA coverage and PI mapping
```

## 5. Vercel changes made on 2026-10-19
| Change | Undo |
|---|---|
| Set framework = Next.js on worksheetgen-mavrin, admitpath-mavrin, competeai-mavrin | PATCH back or delete projects |
| Production deployments: admitpath-mavrin (READY), competeai-mavrin (READY), worksheetgen-mavrin (failed builds only) | `npx vercel rollback` / `npx vercel rm <deployment>` / delete project |
| Repo-local git identity set in the three local clones (`user.email` = owner's email) so future commits pass Vercel's author check | `git config --unset user.email` in each clone (local only) |

### competeai follow-up — merge `e0cd2fb17e834d5d02529dd08a59991397b64e3d` on `main` (C22 chat widget, C25 results page)

Undo: `git revert -m 1 e0cd2fb17e834d5d02529dd08a59991397b64e3d` (revert this before the first competeai merge if undoing both).

```
27e6da2 feat(coach): rebuild AI coach as an embedded chat widget on dashboard and public pages (C22)
95b2515 feat(results): redesign practice test results page (C25)
d5a6d90 docs(prod-readiness): mark C22 chat widget and C25 results page done-needs-prod-verify
```

## 6. Changes on 2026-10-22

### Git (each is one merge commit; undo with `git revert -m 1 <sha>`)
| Repo | Merge | What |
|---|---|---|
| worksheetgen | `f086600` | 7-day free trial on a customer's first Pro subscription (trialing grants Pro; referred users get 50% off instead; pricing/Terms copy) |
| admitpath | `cefe5cd` | Same 7-day trial (webhook, billing sync, success page, checkout, pricing/Terms) |
| admitpath | `55a9534` | Copy fix: missing space in the school/counselor inquiry intro |
| competeai | `5d64447` | Same 7-day trial (subscription state, checkout policy incl. no_payment_required trial checkouts, pricing/Terms) |

### Vercel / databases (not in git)
| Change | Undo |
|---|---|
| Accepted Neon marketplace terms on team arunningidiots-projects (owner authorized "create databases") | Uninstall Neon integration in Vercel dashboard |
| Created free Neon Postgres: worksheetgen-mavrin-db, admitpath-mavrin-db, competeai-mavrin-db (iad1), connected to each project (sets DATABASE_URL, DATABASE_URL_UNPOOLED, POSTGRES_*) | `npx vercel integration resource delete <name>` |
| Env vars DIRECT_URL (= unpooled URL) and ADMIN_EMAILS (owner's email) on production + preview for all three | `npx vercel env rm <NAME> <env>` |
| Created each app's full schema from schema.prisma (prisma migrate diff → applied over Neon HTTPS; port 5432 is filtered on this network) and recorded existing migrations as applied in _prisma_migrations | Delete the Neon database |
| Production deploys of the commits above: worksheetgen (first successful deploy), admitpath, competeai | `npx vercel rollback` |
| Test data: one "QA TEST … (delete me)" school inquiry in each database | Delete those rows from admin / SQL |
| Attempted Stripe sandbox creation — blocked until a human accepts Stripe's terms in the Vercel dashboard; nothing created | n/a |

## 7. Google sign-in setup (2026-10-24/25)
| Change | Undo |
|---|---|
| Google Cloud project **Mavrin Labs Apps** (id `virtual-primer-512512-q4`) under the owner's Google account | Delete the project in Google Cloud console |
| OAuth consent screen: app name "Mavrin Labs", External, **Testing** mode; owner accepted Google's API User Data Policy | Edit in Google Auth Platform → Branding/Audience |
| OAuth web client "Mavrin Labs web (WorksheetGen, AdmitPath, CompeteAI)" with redirect URIs https://{worksheetgen,admitpath,competeai}-mavrin.vercel.app/api/auth/google/callback | Delete the client under Clients |
| Test user: owner's email (only test users can sign in while in Testing mode; cap 100) | Remove under Audience → Test users |
| Env vars GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET on production + preview of all three Vercel projects (secret is not stored anywhere in git) | `npx vercel env rm GOOGLE_CLIENT_SECRET production` etc. |
| Git: worksheetgen merge `cc74eed`, admitpath merge `c1df569` — unconfigured Google sign-in now shows the sign-in page message instead of raw JSON mentioning .env.local | `git revert -m 1 <sha>` |
| Verified: /api/auth/google on all three redirects to accounts.google.com with the new client, the correct callback URL and a state token | — |
