# Admin / database verification report — 2026-10-19

**Status: code complete, database verification blocked.** None of the new Vercel projects has a `DATABASE_URL`, and no database credentials exist on this machine. Saves were verified locally against the Prisma models and with unit tests; nothing has been written to or read from a real database.

## New schema (all additive; drop SQL is in each app's report and CHANGE_LOG_AND_ROLLBACK.md)
| App | Migration | Adds | How it is applied |
|---|---|---|---|
| WorksheetGen | `prisma/migrations/20261018_prod_readiness` | access codes + activations, anti-abuse signals, subject/topic taxonomy fields, worksheet review (score, recommendations, TPT flag, status), contact messages, school/district inquiries, referral discounts, terms acceptance | Automatically in `vercel-build` (`scripts/auto-migrate.mjs --release`); the build refuses to run without a database |
| AdmitPath | `prisma/migrations/20261018120000_prod_readiness_inquiries_referrals_abuse` | school/counselor inquiries, referral codes/redemptions/rewards, abuse signals | **Manual**: `npx prisma migrate deploy` before deploying |
| CompeteAI | `prisma/migrations/20261018120000_prod_readiness_signup_referral_contact` (+ `down.sql`) | signup metadata, referral redemptions/rewards, contact/school inquiries | **Manual**: `npx prisma migrate deploy` before deploying |

## Admin views
| App | Page | Shows |
|---|---|---|
| WorksheetGen | `/admin/messages` | support contact submissions (name, email, message, source page, timestamp) |
| | `/admin/schools` | school/district inquiries (all 9 fields + source page + timestamp) |
| | `/admin/coupons` | create/deactivate school/district/group codes, activations per user |
| | `/admin/worksheets` | generated worksheets, quality score, recommendations, TPT candidate; approve / reject / revise / TPT review |
| AdmitPath | `/admin/inquiries` | school/counselor inquiries |
| | admin user view | plan + feature state from `lib/entitlements.ts`, referral status, abuse flags |
| CompeteAI | admin | signups (name, email, timestamp, metadata), contact + school/chapter inquiries, referrals |

Admin pages require the signed-in email to be in `ADMIN_EMAILS` (not yet set on the new projects).

## Owner actions
1. Provide a Postgres URL per app (or approve creating new Neon databases through Vercel).
2. I then run the migrations, set `ADMIN_EMAILS`, and verify one test submission per form end-to-end in admin.
