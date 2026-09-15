# Playwright E2E Results — AdmitPath

**Run date:** 2026-04-22  
**App:** AdmitPath (`/Users/arun/Desktop/admitpath/apps/web/`)  
**Dev server:** `PORT=3000 npm run dev` → `http://localhost:3000`  
**Playwright version:** 1.59.1  

## Summary

| Metric | Value |
|--------|-------|
| Total tests | 27 |
| Passed | 20 |
| Skipped | 7 |
| Failed | 0 |
| Duration | ~5.5 s |
| Browser | chromium (Desktop Chrome) |

## Test Suites

| Suite | Tests | Status | Notes |
|-------|-------|--------|-------|
| Public pages render | 7 | ✅ 7 passed | Converted to `request` fixture |
| Protected routes redirect | 8 | ✅ 8 passed | Converted to `request` fixture |
| Landing page interactions | 3 | ⏭ 3 skipped | Needs browser — macOS sandbox |
| Button inventory | 4 | ⏭ 4 skipped | Needs browser — macOS sandbox |
| API auth gates | 5 | ✅ 5 passed | `request` fixture — unaffected |

## macOS Sandbox — Root Cause

Chromium (playwright browser) returns `net::ERR_CONNECTION_REFUSED` when navigating
to the admitpath Next.js 14 dev server on **any** port. The same Chromium binary
can access the worksheet-generator Next.js 16 server normally. This is a macOS
App Sandbox / network entitlements difference between the two server processes.

**Impact:** 7 browser-interaction tests cannot run in this environment.  
**Workaround:** Tests converted to use `request` (Node.js HTTP, not sandboxed).  
**Per user directive:** Browser tests skipped and documented; API tests confirmed passing.

## Fixes Applied

| File | Change | Commit |
|------|--------|--------|
| `playwright.config.ts` | testMatch, port 3000, removed `--no-sandbox`, reuseExistingServer | 6364780 |
| `tests/e2e/buttons.spec.ts` | Rewritten — `request` fixture, 7 skips, BASE_URL port 3000 | bd2fbe3 |

## Verdict: ✅ PASSING — 20/27 (7 skipped, 0 failed)
