# AdmitPath — Ship Checklist
**For:** User / Mitran  
**Created:** 2026-04-22

Everything in this file requires human action (browser logins, credentials, external services). Claude Code cannot perform these for you.

---

## 🔴 CRITICAL — Do FIRST (Security)

- [ ] **Rotate Stripe live key** → dashboard.stripe.com → API keys → Roll key
- [ ] **Rotate ALL 42 Groq keys** → console.groq.com → API keys → Delete all → Create 15 new for AdmitPath
- [ ] **Rotate Cerebras key** → cloud.cerebras.ai → API keys → Revoke + regenerate
- [ ] **Rotate 4 Resend keys** → resend.com/api-keys → delete re_FAmFiMmq, re_T7PEAUG8, re_jpHcJDKy, re_asEHadj7 → create new
- [ ] **Verify git history clean**: run `git log -p --all | grep -iE "sk_live_|gsk_[A-Z0-9]{20,}|csk-"` in any affected repo → should return empty
- [ ] **Check Stripe for unauthorized charges** → dashboard.stripe.com → Payments → Events (past 30 days)
- [ ] See `SECURITY_INCIDENT.md` for full details

---

## 🟡 Infrastructure Setup

- [ ] **Create Supabase or Neon PostgreSQL database**
  - Get `DATABASE_URL` and `DIRECT_URL` (Supabase: use pooler for DATABASE_URL, direct connection for DIRECT_URL)
- [ ] **Create Clerk application** → clerk.com → add Web App → copy publishable + secret keys
  - Set Clerk redirect URLs: Sign-in `/sign-in`, Sign-up `/sign-up`, after sign-in `/dashboard`, after sign-up `/profile/create`
  - Add Clerk webhook → endpoint: `https://admith.vercel.app/api/webhooks/clerk` → events: user.created, user.updated, user.deleted → copy `CLERK_WEBHOOK_SECRET`
- [ ] **Create Stripe products** → dashboard.stripe.com → Products
  - Create "AdmitPath Plus" → $9.99/mo recurring → copy price ID → `STRIPE_PRICE_PLUS`
  - Create "AdmitPath Pro" → $19.99/mo recurring → copy price ID → `STRIPE_PRICE_PRO`
  - Add Stripe webhook → endpoint: `https://admith.vercel.app/api/webhooks/stripe` → events: checkout.session.completed, customer.subscription.* → copy `STRIPE_WEBHOOK_SECRET`
- [ ] **Get fresh Groq keys** (15 for this app after rotating)

---

## 🟡 Vercel Deployment

- [ ] **Import repo to Vercel** → vercel.com → New Project → select admitpath repo
- [ ] **Set all environment variables** in Vercel dashboard (use `.env.example` as reference):
  - DATABASE_URL, DIRECT_URL
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET
  - All NEXT_PUBLIC_CLERK_* redirect URLs
  - STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
  - STRIPE_PRICE_PLUS, STRIPE_PRICE_PRO
  - CEREBRAS_API_KEY
  - GROQ_API_KEY_1 through GROQ_API_KEY_15
  - RESEND_API_KEY, EMAIL_FROM
  - NEXT_PUBLIC_APP_URL
- [ ] **Run Prisma migrations** (after deploy): in Vercel terminal or local: `npx prisma db push`
- [ ] **Deploy** → trigger first deployment
- [ ] **Verify deployment** → visit https://admitpath.vercel.app → landing page loads

---

## 🟢 Post-Deployment Verification

- [ ] Landing page loads, Discovery Labs blue `#4A6FA5` visible (NOT orange — palette flipped 2026-04-27 per CLAUDE.md), Mountain section present with "Dream School" final milestone, hand-illustrated A logo in nav
- [ ] Sign up as test user → verify Clerk webhook creates User in DB
- [ ] Subscribe with Stripe test card (4242 4242 4242 4242) → verify plan updates in DB
- [ ] Run AI analysis → verify Cerebras or Groq responds in <10s
- [ ] Try essay feedback → verify 6-dimension scores returned
- [ ] Try chat → verify counselor responds
- [ ] Check Lighthouse score → https://pagespeed.web.dev → target ≥90

---

## 🟢 Content

- [x] ~~Remount SMB volume~~ — no longer needed; 200 articles now live in `data/articles.ts` (not SMB)
- [x] Content audit: articles are in code (`data/articles.ts`), verified no Mitran/OpenAI/wrong-pricing references
- [x] All 200 blog articles confirmed in `data/articles.ts`

---

## 🟢 Add Missing Files

- [x] ~~`public/robots.txt`~~ — `app/robots.ts` (dynamic) handles this via Next.js metadata API
- [x] `app/sitemap.ts` — exists with 80+ entries covering all public routes + blog posts
- [x] ~~`public/og-image.png`~~ — dynamic OG via `app/api/og/route.tsx`; no static fallback needed

---

## Done When

- [ ] All critical security items checked
- [ ] App deployed and accessible at custom domain
- [ ] Stripe payments working end-to-end (test card)
- [ ] AI analysis + chat + essay feedback all respond correctly
- [ ] Lighthouse ≥90
- [ ] FLAWLESS_REPORT.md shows 40/40 ✅
