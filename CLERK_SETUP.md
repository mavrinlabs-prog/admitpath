# Clerk Dashboard — Manual Setup Checklist

This file tracks the Clerk-dashboard-side configuration that **cannot be set
from code**. Verify each item in [dashboard.clerk.com](https://dashboard.clerk.com)
before any production deploy.

---

## 1. Application name (R99 — fixes "Sign in to Clerk" bug)

**Symptom:** When users click Google sign-in, the OAuth consent screen reads
"Sign in to Clerk" instead of "Sign in to AdmitPath."

**Fix:** In Clerk Dashboard:
1. Open the AdmitPath project.
2. Go to **Settings → General → Application info**.
3. Set **Application name** to `AdmitPath`.
4. (Optional) Upload the AdmitPath logo as the **Application logo** so it
   appears on the OAuth consent screen.

The application name + logo flow through to every Clerk-rendered surface
(hosted sign-in, OAuth provider screens, password-reset emails).

---

## 2. OAuth scope audit (R98 — minimum-necessary scopes)

**Why:** Per `SECRETS_MANAGEMENT_POLICY_FINAL.md`, every OAuth integration
requests the minimum necessary user data. Anything beyond `email + profile
+ openid` is over-collection and drift-risk.

**Verify:** In Clerk Dashboard:
1. Go to **User & Authentication → Social Connections**.
2. For each enabled provider (Google, etc.):
   - Click **Configure**.
   - Confirm only `email`, `profile`, and `openid` (or the provider's
     equivalent) scopes are checked.
   - Disable anything else (Calendar, Drive, contacts, friends, etc.).

**Code-side check:** the AdmitPath repo does NOT request any non-default
scopes anywhere — `middleware.ts`, sign-in page, sign-up page, and the
Clerk webhook handler all rely on Clerk's dashboard-configured defaults.
So the only attack surface for over-collection is the dashboard config
itself.

---

## 3. Webhook configuration

**URL:** `https://admith.vercel.app/api/webhooks/clerk`

**Events:** `user.created`, `user.updated`, `user.deleted`

**Secret:** copy the signing secret into the production env var
`CLERK_WEBHOOK_SECRET`. Verified via `svix` in `app/api/webhooks/clerk/route.ts`.

---

## 4. Redirect URLs

Set the following in **Sessions → Redirect URLs**:

- `https://admith.vercel.app/sign-in`
- `https://admith.vercel.app/sign-up`
- `https://admith.vercel.app/dashboard`
- `https://admith.vercel.app/profile/create`
- `https://admith.vercel.app/start-trial`
- `https://admith.vercel.app/billing/success`

Plus `http://localhost:3000/*` for development if you preview locally.

---

## 5. After-sign-in / after-sign-up paths

These match `.env.example`:

- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile/create`

The sign-up redirect goes to the onboarding wizard so brand-new accounts
land on profile creation, not an empty dashboard.

---

## 6. Email templates

Recommended customization in **Customization → Emails**:

- **Verification code:** match AdmitPath voice — drop the default Clerk
  branding, use the AdmitPath wordmark + a single sentence.
- **Magic link:** same.
- **Password reset:** same.

These are optional but kill the last "Clerk-flavored" touchpoint a user sees.

---

## 7. Production keys

Before the first paid deploy:

1. Generate **production** `pk_live_*` + `sk_live_*` keys (not test keys).
2. Set in Vercel env vars `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` +
   `CLERK_SECRET_KEY` (production scope only).
3. Run `npm run audit:build` to confirm no Clerk keys leaked to the repo.

---

## Verification checklist

- [ ] Application name is "AdmitPath" (not "Clerk", not blank)
- [ ] Application logo uploaded
- [ ] OAuth scopes scoped to email + profile + openid only
- [ ] Webhook URL + secret set
- [ ] Redirect URLs whitelisted
- [ ] After-sign-in paths point to `/dashboard` and `/profile/create`
- [ ] Production keys generated + stored in Vercel only
- [ ] Repo secret-scan clean (`npm run audit:build`)
