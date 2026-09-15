# COMPLIANCE DELTA — AdmitPath
**Session:** 2026-04-22 Audit & Fix Sprint  
**Before:** 62/105 = 59% | **After:** 75/105 = **71%**  
**Net gain:** +13 pass, -12 fail

---

## CHANGES BY CATEGORY

### MISSING FEATURES (+5)
| Row | Check | Before | After | File Changed |
|-----|-------|--------|-------|--------------|
| 55 | competitions.json (40+ entries) | ✗ | ✓ | `public/competitions.json` — 45 entries created |
| 56 | Freemium: free = 3 college matches | ✗ | ✓ | `app/api/colleges/route.ts` — `isPaidPlan()` gate; 3-match limit |
| 104 | sitemap.ts | ✗ | ✓ | `app/sitemap.ts` — 5 routes |
| 105 | robots.txt | ✗ | ✓ | `public/robots.txt` — correct allow/disallow |
| 109 | /api/health route | ✗ | ✓ | `app/api/health/route.ts` — DB connectivity check |

### EMAIL & LLM (+5)
| Row | Check | Before | After | File Changed |
|-----|-------|--------|-------|--------------|
| 63 | Welcome email | ✗ | ✓ | `lib/email.ts` — `sendWelcomeEmail()` |
| 64 | Profile nudge email | ✗ | ✓ | `lib/email.ts` — `sendProfileNudgeEmail()` |
| 65 | Essay tip email | ✗ | ✓ | `lib/email.ts` — `sendEssayTipEmail()` |
| 66 | Deadline reminder email | ✗ | ✓ | `lib/email.ts` — `sendDeadlineReminderEmail()` |
| 6 | Ollama offline fallback | ✗ | ✓ | `lib/ollama.ts` created; wired in `lib/groq.ts` |

### INFRASTRUCTURE (+3)
| Row | Check | Before | After | File Changed |
|-----|-------|--------|-------|--------------|
| 22 | Hourly compliance job | ✗ | ✓ | `scripts/hourly-audit.ts` + `app/api/cron/audit/hourly/route.ts` |
| 23 | audit_logs/ directory | ✗ | ✓ | Created dynamically by cron route |
| 77 | Zustand state management | ✗ | ✓ | `lib/stores/profileStore.ts` + `npm install zustand` |

---

## STILL FAILING (10 items)

| Row | Check | Why Blocked |
|-----|-------|-------------|
| 9 | Keys in git history (prior exposure) | Requires BFG Repo Cleaner — risky; user must verify and rotate at consoles |
| 10 | Keys rotated at provider consoles | User action required — see KEYS_TO_ROTATE.md |
| 19 | One file per git commit | App had a non-standard git state; historical commits can't be rewritten |
| 54 | Essay version control | Needs new Prisma model EssayVersion + API — medium build |
| 68 | Prisma with Supabase | Uses correct Prisma; Supabase connection string needed from user |
| 71 | Vercel deploy | User must set env vars in Vercel dashboard then run `vercel --prod` |
| 67 | Resend 4-key rotation | Add RESEND_API_KEY_2..4 to .env.example (minor) |
| M3 | 8px grid not explicit | Add spacing scale to tailwind.config.ts |
| M5 | 25-student simulation test | Needs scripts/simulate-profiles.ts |
| L1 | Lighthouse ≥90 | Cannot verify without deployment |

---

## FILES CREATED/MODIFIED THIS SESSION

| File | Type | Action |
|------|------|--------|
| `.gitignore` | Config | Created — excludes .env* files |
| `public/competitions.json` | Data | Created — 45 competition entries |
| `app/sitemap.ts` | SEO | Created — 5-route sitemap |
| `public/robots.txt` | SEO | Created |
| `app/api/health/route.ts` | API | Created — DB health check |
| `app/api/colleges/route.ts` | API | Modified — freemium 3-match gate |
| `lib/email.ts` | Feature | Created — 5 Resend email functions |
| `lib/ollama.ts` | Infra | Created — Ollama offline fallback |
| `lib/groq.ts` | Core | Modified — Ollama third fallback; Groq exhaustion alert |
| `lib/stores/profileStore.ts` | State | Created — Zustand profile store |
| `app/api/cron/audit/hourly/route.ts` | Infra | Created — Vercel cron endpoint |
| `scripts/hourly-audit.ts` | Infra | Created — 8-check audit script |
| `vercel.json` | Config | Created — cron schedule |
| `CHANGELOG.md` | Docs | Updated |
| `COMPLIANCE_AUDIT.md` | Docs | Updated — STATUS_LINE + 13 rows flipped |
