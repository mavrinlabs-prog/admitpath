# Auth / OAuth test report — 2026-10-19

All three apps use first-party Google OAuth (`app/api/auth/google/route.ts` → Google → `app/api/auth/google/callback/route.ts`) with a signed session cookie (`lib/auth.ts` / `lib/google-auth.ts`). Clerk is no longer the live auth path.

| Check | WorksheetGen | AdmitPath | CompeteAI |
|---|---|---|---|
| State token generated + stored in httpOnly cookie, compared on callback; mismatch rejected | Unit-tested (OAuth state validation tests, 331-test suite) | Unit-tested (`webhook-oauth.test.ts`) | Unit-tested (`lib/oauth-state.test.ts`) |
| Return-URL / redirect is same-origin only (no open redirect) | Unit-tested | Unit-tested | Unit-tested |
| Protected routes send signed-out users to sign-in with return URL | Local crawl: dashboard routes → sign-in | **Prod verified**: `/dashboard` → `/sign-in` (client redirect, browser check) | **Prod verified**: `/dashboard` → 307 `/sign-in?redirect_url=%2Fdashboard` (proxy.ts) |
| Go Pro when signed out → sign-up → straight to Stripe checkout | Local verified | **Prod verified**: `/checkout/pro` → 303 `/sign-up?redirect_url=%2Fcheckout%2Fpro` | **Prod verified**: `/r/11225607` → 307 `/sign-up?ref=11225607&plan=pro` |
| Google sign-in launch on prod | Not deployed (DB blocker) | `/api/auth/google` → 503: `GOOGLE_CLIENT_ID` not set on new project (fails closed, no crash) | Same as AdmitPath |
| Full sign-in → callback → session → logout with a real Google account | **Blocked** | **Blocked** | **Blocked** |

## Blockers (owner action)
1. Create a Google OAuth client (or reuse yours) and add these authorized redirect URIs:
   - `https://worksheetgen-mavrin.vercel.app/api/auth/google/callback`
   - `https://admitpath-mavrin.vercel.app/api/auth/google/callback`
   - `https://competeai-mavrin.vercel.app/api/auth/google/callback`
2. Send `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`; I set them on the three Vercel projects.
3. Sign in yourself in the browser pane for the signed-in test pass (I never type your credentials).
