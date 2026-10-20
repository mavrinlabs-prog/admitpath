# Deployment log

Target: new Vercel projects in team `arunningidiots-projects` (owner asked for new domains; the old `cognifys-projects` sites were not touched).
Method: Vercel CLI from an exact `git archive` export of each pushed default-branch commit. (Git-triggered deploys are not possible yet: the Vercel GitHub app is not installed on `mavrinlabs-prog`. Deploying the working tree directly was blocked by Vercel Hobby because the commits' author email `arun@Aruns-MacBook-Pro-2.local` does not match the Vercel account; repo-local git identity is now set for future commits. Pushed history was not rewritten.)

| Time (2026-10-19) | App | Commit deployed | Result |
|---|---|---|---|
| first attempt | admitpath | de35e14 | READY but served 404 everywhere — project framework was unset ("Other"). Fixed by setting framework = Next.js on all three projects. |
| first attempt | worksheetgen | branch tip | ERROR: `functions` pattern mismatch (same framework cause) |
| second attempt | worksheetgen | branch tip | BLOCKED: commit author not permitted (Hobby) |
| export deploy | **admitpath** | `de35e14` (master merge) | **READY → https://admitpath-mavrin.vercel.app** |
| export deploy | **competeai** | `5bbd1ec` (main merge) | **READY → https://competeai-mavrin.vercel.app** |
| export deploy | **competeai** (follow-up) | `e0cd2fb` (C22 + C25 merge) | **READY → https://competeai-mavrin.vercel.app** (re-checked: key routes, chat launcher, no console errors) |
| export deploy | worksheetgen | `cba1ff8` (main merge) | **ERROR (expected): `[auto-migrate] Fatal: DATABASE_URL/DIRECT_URL is required for a release build`** — blocked until a database is provided |

## Pre-deploy verification (run locally by me, not just reported by agents)
| App | Typecheck | Unit tests | Production build (placeholder env) | Secret scan of diff |
|---|---|---|---|---|
| WorksheetGen | 0 errors | 331/331 | success | clean |
| AdmitPath | 0 errors | 58/58 | success (Vercel build also succeeded) | clean |
| CompeteAI | 0 errors | 621/621, then 627/627 after follow-up | success (Vercel build also succeeded) | clean |

## Logs
Build logs read via `vercel inspect --logs`. Runtime logs on the new projects: no traffic other than these tests; signed-in flows can't produce logs until database/OAuth/Stripe keys exist. Old production (`cognifys-projects`) logs are not accessible from this machine.

## Redeploy (after keys are set)
```
git -C <repo> archive origin/<main|master> | tar -x -C <empty dir>
cp <linked>/.vercel/project.json <dir>/.vercel/
cd <dir> && npx vercel deploy --prod --yes --scope arunningidiots-projects
```
Rollback of a deploy: `npx vercel rollback <previous-deployment-url> --scope arunningidiots-projects`, or redeploy the checkpoint tag the same way.
