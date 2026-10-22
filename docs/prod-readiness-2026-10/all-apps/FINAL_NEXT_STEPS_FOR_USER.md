# What still needs you (updated 2026-10-22)

Done since last time: databases created and connected (Neon, free tier), schemas applied, ADMIN_EMAILS set to your email, WorksheetGen is live, 7-day trial added to all three apps, all three school/contact forms verified saving to the database in production.

1. **Stripe** — open https://vercel.com/arunningidiots-projects/~/integrations/accept-terms/stripe while signed in to Vercel and accept Stripe's terms (a legal agreement only you can accept). Then I create a Stripe sandbox per app (test keys, $19.99/month Pro price with the 7-day trial, 50%-off referral coupon, webhooks) with no further keys needed from you. Alternative: paste an `sk_test_…` key.
2. **AI** — paste your Groq API key in chat (I was blocked from copying it out of your other project's .env, correctly). Or add a credit card in Vercel → AI Gateway to unlock the `vck_` gateway key you sent.
3. **Google sign-in** — sign in to Google Cloud in the browser pane (or create it yourself): an OAuth client of type "Web application" with redirect URIs
   - https://worksheetgen-mavrin.vercel.app/api/auth/google/callback
   - https://admitpath-mavrin.vercel.app/api/auth/google/callback
   - https://competeai-mavrin.vercel.app/api/auth/google/callback
   Then I set GOOGLE_CLIENT_ID/SECRET and redeploy.
4. **Sign in yourself** for the signed-in Free/Pro test pass once 1–3 are done.
5. **Legal review** of everything marked `LEGAL REVIEW NEEDED` (now including the free-trial auto-renewal disclosure).
6. **Optional** — Resend key (emails), Upstash (shared rate limiting), and an org owner installing the Vercel GitHub app on mavrinlabs-prog for push-to-deploy.

Not needed any more: you said you won't rotate old keys, so the new deployments use freshly generated secrets and new databases instead; nothing from the old cognifys deployments is reused.
