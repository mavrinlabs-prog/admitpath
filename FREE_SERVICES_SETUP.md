# Free Services Setup Guide

Production infrastructure for **AdmitPath** and **WorksheetGen** using free tiers.
Last updated: 2026-05-15.

---

## 1. Neon PostgreSQL (Database)

**Free tier:** 0.5 GB storage, 190 compute hours/month, 1 project, branching.
**URL:** https://neon.tech

### Setup

1. Sign up at https://neon.tech (GitHub or email).
2. Click **New Project** -- name it `admitpath-prod` (repeat for `worksheetgen-prod`).
3. Select the closest region (e.g. `us-east-1`).
4. After creation, go to **Dashboard > Connection Details**.
5. Copy **two** connection strings:
   - **Pooled** (for the app at runtime): starts with `postgresql://...@ep-XXX.us-east-1.aws.neon.tech/neondb?sslmode=require`
     - Use the one labeled **Pooled connection** or append `?pgbouncer=true` to the host.
   - **Direct** (for Prisma migrations only): starts with `postgresql://...@ep-XXX.us-east-1.aws.neon.tech/neondb?sslmode=require`
     - Use the one labeled **Direct connection** (no pgbouncer).

### Environment variables

```
# App runtime (pooled)
DATABASE_URL="postgresql://USER:PASS@ep-XXX-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Migrations only (direct)
DIRECT_URL="postgresql://USER:PASS@ep-XXX.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Notes

- Free tier auto-suspends after 5 minutes of inactivity. First query after suspend takes ~1s (cold start). The Prisma client in both apps handles this gracefully via the error proxy.
- 0.5 GB is plenty for early-stage. Upgrade to Pro ($19/mo) when you approach 80%.

---

## 2. Upstash Redis (Rate Limiting)

**Free tier:** 10,000 commands/day, 256 MB, 1 database.
**URL:** https://console.upstash.com

### Setup

1. Sign up at https://console.upstash.com (GitHub, Google, or email).
2. Click **Create Database**.
3. Name it `admitpath-rl` (or `worksheetgen-rl`).
4. Select region closest to your Vercel deployment (e.g. `us-east-1`).
5. After creation, go to the database details page.
6. Scroll to **REST API** section.
7. Copy the **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**.

### Environment variables

```
UPSTASH_REDIS_REST_URL="https://XXX.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AX..."
```

### Notes

- Both apps gracefully degrade to in-memory rate limiting when Redis is unavailable. In-memory limits are per-instance (not distributed), so a single user could exceed limits across multiple serverless instances. Redis fixes this.
- 10K commands/day is sufficient for moderate traffic. Each rate-limit check uses 1-2 commands.

---

## 3. Resend (Transactional Email)

**Free tier:** 100 emails/day, 3,000 emails/month, 1 domain.
**URL:** https://resend.com

### Setup

1. Sign up at https://resend.com.
2. Go to **Domains** > **Add Domain**.
3. Add your domain (e.g. `admitpath.ai` or `worksheetgen.ai`).
4. Add the DNS records Resend provides (MX, TXT/SPF, DKIM).
5. Wait for verification (usually 5-30 minutes).
6. Go to **API Keys** > **Create API Key**.
7. Name it `admitpath-prod` and select the domain. Copy the key (`re_...`).

### Environment variables

```
RESEND_API_KEY="re_..."
EMAIL_FROM="AdmitPath <maestro.committee@gmail.com>"   # or WorksheetGen <maestro.committee@gmail.com>
ALERT_EMAIL="your-personal@email.com"         # for critical alerts
```

### Notes

- Both apps handle missing RESEND_API_KEY gracefully:
  - **WorksheetGen:** Every email function wraps in try/catch. Missing key = silently skipped.
  - **AdmitPath:** Email calls in webhooks/crons are wrapped in try/catch at the call site.
- Alert emails (DB down, LLM exhaustion) require BOTH `RESEND_API_KEY` and `ALERT_EMAIL` to be set.
- Use the unsubscribe-header system built into both apps for CAN-SPAM compliance.

---

## 4. Clerk (Authentication)

**Free tier:** 10,000 monthly active users, unlimited apps.
**URL:** https://clerk.com

### Setup

1. Sign up at https://clerk.com.
2. **Create SEPARATE apps** for each product:
   - App 1: `AdmitPath` (production domain: `admitpath.ai`)
   - App 2: `WorksheetGen` (production domain: `worksheetgen.ai`)
3. In each app:
   - Go to **User & Authentication > Social Connections** > enable **Google OAuth**.
   - Go to **User & Authentication > Email, Phone, Username** > enable **Email**.
4. Go to **API Keys**. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_` or `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_` or `sk_test_`)
5. Go to **Webhooks** > **Add Endpoint**:
   - **AdmitPath:** `https://admith.vercel.app/api/webhooks/clerk`
   - **WorksheetGen:** `https://worksheetgen.ai/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Copy the **Signing Secret** for `CLERK_WEBHOOK_SECRET`.

### Environment variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

### Notes

- Both apps have demo mode: when Clerk keys are missing/placeholder, the middleware lets public pages through and blocks protected routes with a clear 503 message.
- AdmitPath: `middleware.ts` detects invalid keys via `hasValidClerkKeys()`.
- WorksheetGen: `middleware.ts` detects via `isDemoMode` check.

---

## 5. Vercel (Hosting)

**Free tier:** Unlimited deploys, 100 GB bandwidth/month, serverless functions.
**URL:** https://vercel.com

### Setup

1. Sign up at https://vercel.com (GitHub recommended).
2. Click **Add New Project** > **Import Git Repository**.
3. Select your repo.
4. Configure:
   - **Framework:** Next.js (auto-detected)
   - **Root Directory:**
     - AdmitPath: `apps/web`
     - WorksheetGen: `.` (root)
   - **Build Command:** `next build` (default)
5. Go to **Settings > Environment Variables**. Add ALL variables from this document.
6. Go to **Settings > Crons** (or use `vercel.json`). Set up:
   - `/api/cron/audit/hourly` -- every hour
   - `/api/cron/daily-emails` -- daily at 09:00 UTC (AdmitPath)
   - `/api/cron/weekly-progress` -- weekly (both apps)
   - `/api/cron/health-check` -- daily (WorksheetGen)

### Environment variables (Vercel-specific)

```
CRON_SECRET="generate-a-random-32-char-string"
```

### Notes

- Vercel auto-sets `VERCEL_GIT_COMMIT_SHA` (used in health checks).
- Free tier limits: 10-second function timeout (upgrade to Pro for 60s if AI calls timeout).
- Both apps set `Cache-Control` headers for optimal CDN behavior.

---

## 6. Stripe (Payments)

**Free tier:** Test mode is free. Live mode charges 2.9% + 30 cents per transaction.
**URL:** https://stripe.com

### Setup

1. Create account at https://stripe.com.
2. Toggle to **Test mode** (top-right switch) for development.
3. Go to **Developers > API Keys**. Copy:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)
4. Create products:
   - **Plus:** $9.99/month (and $99/year annual variant)
   - **Pro:** $19.99/month (and $199/year annual variant)
   - **Season Pass:** $99 one-time (AdmitPath only, Dec-April Pro access)
5. Copy each product's **Price ID** (`price_...`).
6. Go to **Developers > Webhooks > Add Endpoint**:
   - **AdmitPath:** `https://admith.vercel.app/api/webhooks/stripe`
   - **WorksheetGen:** `https://worksheetgen.ai/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
   - Copy the **Signing Secret** (`whsec_...`).

### Environment variables

```
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AdmitPath price IDs
STRIPE_PRICE_PLUS="price_..."
STRIPE_PRICE_PLUS_ANNUAL="price_..."
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_PRO_ANNUAL="price_..."
STRIPE_PRICE_SEASON_PASS="price_..."

# WorksheetGen price IDs
STRIPE_PRICE_PLUS="price_..."
STRIPE_PRICE_PLUS_ANNUAL="price_..."
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_PRO_ANNUAL="price_..."
```

### Notes

- Both apps verify webhook signatures and return 400 on failure.
- Both apps use idempotent webhook processing via `WebhookEvent` table deduplication.
- Stripe webhook will fire a critical alert if signature verification fails.

---

## 7. Groq (LLM Fallback)

**Free tier:** 14,400 tokens/minute, 30 requests/minute.
**URL:** https://console.groq.com

### Setup

1. Create accounts at https://console.groq.com (use different emails for multiple keys).
2. In each account, go to **API Keys** > **Create API Key**.
3. Name each key distinctively (e.g. `worksheetgen-key-1`).
4. Copy the key (`gsk_...`).
5. Create 5-10 keys across different accounts for rotation.

### Environment variables

```
GROQ_API_KEY_1="gsk_..."
GROQ_API_KEY_2="gsk_..."
GROQ_API_KEY_3="gsk_..."
GROQ_API_KEY_4="gsk_..."
GROQ_API_KEY_5="gsk_..."
# ... up to GROQ_API_KEY_40
```

### Notes

- Both apps use health-aware key rotation: when a key returns 429, it's sidelined until its `retry-after` window passes.
- Groq is the FALLBACK. Primary LLM is Cerebras (see below).
- AdmitPath supports up to 40 keys. WorksheetGen supports up to 28 keys.
- Both apps alert when all keys are exhausted.
- IMPORTANT: Never commit Groq keys to git. See `SECURITY_INCIDENT.md` in AdmitPath.

---

## 8. Cerebras (Primary LLM)

**Free tier:** Rate limits vary; generous for llama3.1-8b.
**URL:** https://cloud.cerebras.ai

### Setup

1. Sign up at https://cloud.cerebras.ai.
2. Go to **API Keys** > create a key.
3. Copy the key.

### Environment variables

```
CEREBRAS_API_KEY="csk-..."
CEREBRAS_MODEL="llama3.1-8b"   # optional, defaults to llama3.1-8b
```

### Notes

- Cerebras is the PRIMARY LLM for both apps. It's extremely fast (inference on dedicated hardware).
- When CEREBRAS_API_KEY is not set, both apps fall through to Groq automatically.
- AdmitPath: retries up to 2x on 5xx/network errors with exponential backoff (250ms, 750ms).
- WorksheetGen: uses `maybeCerebrasClient()` which returns null when key is missing, falling through to Groq.

---

## 9. Sentry (Error Monitoring) -- Optional

**Free tier:** 5,000 errors/month, 1 GB event data.
**URL:** https://sentry.io

### Setup

1. Sign up at https://sentry.io.
2. Create a project for each app (select Next.js as platform).
3. Copy the DSN from **Settings > Client Keys (DSN)**.

### Environment variables

```
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_AUTH_TOKEN="sntrys_..."   # for source maps upload
```

### Notes

- Both apps already have structured error logging via `lib/log-error.ts` that writes JSON to stdout (visible in Vercel Function Logs). Sentry adds alerting, grouping, and issue tracking on top.
- Both apps pipe client-side errors to `/api/log-client-error` which is already rate-limited.

---

## 10. Better Uptime (Uptime Monitoring) -- Optional

**Free tier:** 10 monitors, 3-minute check intervals.
**URL:** https://betteruptime.com

### Setup

1. Sign up at https://betteruptime.com.
2. Create monitors for:
   - `https://admith.vercel.app/api/health` -- expects 200 with `status: "ok"`
   - `https://worksheetgen.ai/api/health` -- expects 200 with `status: "healthy"`
3. Set up alert contacts (email, Slack, SMS).
4. Optionally create a status page at `status.admitpath.ai` / `status.worksheetgen.ai`.

### Notes

- Both apps return 503 when critical dependencies are down.
- Health endpoints include version, uptime, and per-dependency status.

---

## Complete .env.local Template

Copy this template and fill in the values:

```bash
# ---- Database (Neon) ----
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# ---- Auth (Clerk) ----
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# ---- Payments (Stripe) ----
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_PLUS="price_..."
STRIPE_PRICE_PLUS_ANNUAL="price_..."
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_PRO_ANNUAL="price_..."

# ---- LLM: Primary (Cerebras) ----
CEREBRAS_API_KEY="csk-..."

# ---- LLM: Fallback (Groq) ----
GROQ_API_KEY_1="gsk_..."
GROQ_API_KEY_2="gsk_..."
GROQ_API_KEY_3="gsk_..."
GROQ_API_KEY_4="gsk_..."
GROQ_API_KEY_5="gsk_..."

# ---- Email (Resend) ----
RESEND_API_KEY="re_..."
ALERT_EMAIL="your@email.com"

# ---- Rate Limiting (Upstash Redis) ----
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="AX..."

# ---- Cron Security ----
CRON_SECRET="generate-a-random-32-char-string"

# ---- App URL ----
NEXT_PUBLIC_APP_URL="https://admith.vercel.app"
# or for WorksheetGen: NEXT_PUBLIC_APP_URL="https://worksheetgen.ai"

# ---- Optional: Sentry ----
# NEXT_PUBLIC_SENTRY_DSN="https://..."
# SENTRY_AUTH_TOKEN="sntrys_..."
```

---

## Resilience Summary

Both apps are built with the following defensive patterns:

| Layer | Behavior when missing/broken |
|-------|------------------------------|
| Database | Prisma error proxy returns clear errors without crashing the module |
| LLM (Cerebras) | Falls through to Groq automatically |
| LLM (Groq) | Health-aware key rotation; alerts when all keys exhausted |
| LLM (both down) | Returns 502/503 with helpful user message, never raw stack trace |
| Redis | Falls back to in-memory rate limiting (per-instance) |
| Email (Resend) | All sends wrapped in try/catch; silently skipped when key missing |
| Stripe | Webhook sig failures alert immediately; idempotent processing |
| Clerk | Demo mode allows public pages; protected routes return 503 |
| Landing page | Works with zero env vars (pure static) |
| Pricing page | Works without Stripe keys (static content, checkout fails gracefully) |
| Error boundaries | Root + per-route + per-component boundaries with retry buttons |
| Health checks | Check all dependencies; return 503 for degraded state |
| Cron jobs | Per-user try/catch; fail-closed auth; never crash the batch |
