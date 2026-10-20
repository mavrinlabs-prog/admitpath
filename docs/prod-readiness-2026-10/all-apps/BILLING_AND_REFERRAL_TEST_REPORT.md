# Billing and referral test report — 2026-10-19

Stripe test keys were not available, so nothing in this report touched Stripe. The file sent on 2026-10-19 (`stripe.env`) contained only a webhook secret for an endpoint at `connect-able-db12deb9.base44.app` — a different app — so it was not used (a webhook secret only validates events sent to its own endpoint).

## What was built (all three apps)
| Behaviour | WorksheetGen | AdmitPath | CompeteAI |
|---|---|---|---|
| Go Pro / Start Pro skips /pricing; signed-out → sign-up → checkout | `/upgrade` (fixed a 400: request body the checkout API rejected) | `/checkout/pro` | sign-up `?plan=pro` → checkout |
| Single entitlements function drives UI + API gates; upgrade unlocks, downgrade (webhook `customer.subscription.deleted/updated`) relocks | `lib` entitlements; also school/district/group codes with expiry | `lib/entitlements.ts`; Pro APIs return 403 + upgrade link | `lib/entitlements.ts` |
| Free limit | 3 worksheets everywhere | n/a (feature gates) | 3 tests (bug fixed: new users were shown "0 tests left") |
| Webhook signature checked; invalid → 400 | Unit-tested | Unit-tested | Unit-tested (`stripe-webhook-signature.test.ts`) |
| Stripe customer + subscription IDs saved | Yes (code) | Yes (code) | Yes (code) |
| Referral → sign-up → checkout with single-use 50%-off code auto-applied | Yes | Yes (old "both get a free month" credit removed) | Yes (50% off first month) |
| Referrer reward code generated after referee pays; emailed if Resend set, else stored for admin | Yes | Yes (reward size currently one free month — confirm) | Yes |
| Self-referral, duplicate, reuse, alias (gmail +/.) blocked; stored with reason | Yes | Yes | Yes |
| Referral records visible in admin | Yes | Yes | Yes |

## Verified on production (new domains, read-only)
- CompeteAI `/r/11225607` → 307 to `/sign-up?ref=11225607&plan=pro` (no server-render error).
- AdmitPath `/r/INVALID123` → 307 to `/` (invalid codes handled gracefully).
- AdmitPath `/checkout/pro` signed-out → 303 to sign-up with return to checkout.
- Webhook with a bad signature: AdmitPath → 500 `Webhook misconfigured`, CompeteAI → 500 — because `STRIPE_WEBHOOK_SECRET` is not set yet. With the secret set, the code path returns 400 (unit-tested). **Re-test after keys.**

## Not verified (needs keys)
Checkout session creation, auto-applied 50% code, upgrade/downgrade via real webhooks, reward-code creation, invoices.

## Needed from you
- `STRIPE_SECRET_KEY` (sk_test_…) for the Stripe account these apps should use.
- Pro price IDs: WorksheetGen `STRIPE_PRO_PRICE_ID` (and `STRIPE_PLUS_PRICE_ID` if used), AdmitPath `STRIPE_PRO_PRICE_ID`/`STRIPE_PRICE_PRO`, CompeteAI `STRIPE_PRICE_PRO`.
- WorksheetGen also reads `STRIPE_REFERRAL_COUPON_ID` (a 50%-off, duration=once coupon) — I can create it in test mode once I have the key.
- I will create one webhook endpoint per new domain in test mode, which generates the correct `whsec_` secret for each.
