# What I need from you

Only genuine manual actions are listed. Send the values in chat (or a file); I set them on the Vercel projects and never commit them.

1. **Databases** — a Postgres `DATABASE_URL` (and `DIRECT_URL` if pooled) for each app, or say "create new Neon databases" and approve the Vercel integration. WorksheetGen cannot deploy at all until this exists (its build migrates the database first, by design).
2. **Google sign-in** — a Google OAuth client ID/secret with these redirect URIs added in Google Cloud Console:
   - `https://worksheetgen-mavrin.vercel.app/api/auth/google/callback`
   - `https://admitpath-mavrin.vercel.app/api/auth/google/callback`
   - `https://competeai-mavrin.vercel.app/api/auth/google/callback`
3. **Stripe (test mode)** — `sk_test_…` secret key and the Pro price ID(s) per app. I'll create the 50%-off referral coupon and one webhook endpoint per domain myself. (The `whsec_` you sent belongs to a different app's endpoint on base44.app.)
4. **AI keys** — Groq and/or Cerebras for all three; Anthropic for AdmitPath. Without them AdmitPath/CompeteAI use rule-based fallbacks and WorksheetGen cannot generate.
5. **Admin emails** — which email(s) should see the admin pages (`ADMIN_EMAILS`).
6. **Optional** — Resend API key + sending domain (emails), Upstash Redis (shared rate limiting).
7. **Sign in yourself** in the browser pane when I run the signed-in Free/Pro test pass.
8. **GitHub → Vercel auto-deploy (optional)** — an owner of the `mavrinlabs-prog` org installs the Vercel GitHub app on the 3 repos; then pushes deploy automatically. Until then I deploy with the CLI.
9. **Legal review** of the sections marked `LEGAL REVIEW NEEDED`: WorksheetGen generated-content/resale (TPT) clause, refund wording, FERPA/COPPA disclaimers, anti-abuse signal disclosure; CompeteAI copied DECA PI wording and DECA non-affiliation; AdmitPath all five legal pages.
10. **Decisions** — AdmitPath referrer reward size (currently one free month); AdmitPath CLAUDE.md mentions a $199/yr plan but code is monthly-only.
11. **Security housekeeping** — rotate the keys listed in AdmitPath `SECURITY_INCIDENT.md`; the 1,000 WorksheetGen access codes in `codes/worksheetgen_codes.txt` are committed to the repo (they were before this work) — consider rotating; revoke the `vck_` Vercel key you pasted in chat.
