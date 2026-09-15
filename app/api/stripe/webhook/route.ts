/**
 * DEPRECATED: This webhook path (/api/stripe/webhook) is superseded by
 * /api/webhooks/stripe which handles more event types, has better
 * idempotency logic, and includes referral crediting + email flows.
 *
 * This file re-exports the canonical handler so that if Stripe is still
 * configured to hit this URL, events are not silently dropped.
 */
export { POST } from "@/app/api/webhooks/stripe/route";
