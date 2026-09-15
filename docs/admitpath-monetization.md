# AdmitPath Monetization Plan

Status: implementation decision record, not a revenue forecast. No deployment is included in this change.

## Existing Product Audit

AdmitPath already has a canonical one-time catalog and Stripe Checkout flow. New work must extend this system instead of creating parallel product definitions.

| Existing offer | Current price | Checkout mode | Purchase record | Fulfillment entry point |
| --- | ---: | --- | --- | --- |
| Essay Deep Review | $49 | Stripe Checkout `payment` | `OneTimePurchase` | `/essays` |
| Complete Application Review | $149 | Stripe Checkout `payment` | `OneTimePurchase` | `/profile/create` |
| Test Prep Strategy Session | $59 | Stripe Checkout `payment` | `OneTimePurchase` | `/test-prep-guide` |

The current contract validates the configured Stripe Price, amount, currency, user ownership, paid status, payment intent, and Checkout Session before recording a purchase. `checkout.session.completed` remains the canonical fulfillment trigger. Stripe notes that fulfillment may run repeatedly or concurrently, so the unique Checkout Session record and idempotent upsert must remain in place ([Stripe fulfillment guidance](https://docs.stripe.com/checkout/fulfillment)).

## Estimate Assumptions

All prices, conversion rates, margins, and revenue figures below are planning estimates. They are not market facts or promises.

- Currency: USD.
- Existing catalog weighted average order value example: 70% essay review, 20% test-prep strategy, 10% application review, or approximately $61.
- Scenario unit: 1,000 qualified `/offers` sessions, not total site visitors.
- Illustrative checkout conversion range: 2% to 5%.
- Illustrative gross merchandise value: 20 to 50 orders multiplied by $61, or $1,220 to $3,050 per 1,000 qualified offer-page sessions.
- Gross margin excludes Stripe fees, refunds, support, contractor/editor/tutor cost, tax, and chargebacks. Human-delivered services should not be described as high margin until fulfillment time and cost are measured.
- B2B example only: 10 school customers at an estimated $4,000 annual contract value would equal $40,000 annual recurring revenue before implementation and support costs.

## Comparison Matrix

| Option | Buyer and value | Estimated price | Delivery cost / margin | Build effort | Privacy / ethics risk | Priority |
| --- | --- | ---: | --- | --- | --- | --- |
| Existing one-time reviews | Student or parent gets scoped human guidance without a subscription | $49 to $149, already configured | Medium human cost; measure hours per order | Low, already built | Medium because reviewers see private content; strict access and retention required | **P0** |
| One-time profile analysis pack | Student receives additional structured analyses | $19 to $39 | Low to medium AI cost | Medium | Medium; never train or market from profile content without separate consent | P1 |
| Essay review credit pack | Student prepays for a fixed number of reviews | $69 to $199 | Medium AI or human cost | Medium | High private-content sensitivity; credits and refund rules required | P1 |
| Premium PDF report | Parent/student gets an exportable, timestamped action plan | $9 to $29 | Low generation cost | Low to medium | Medium; secure links, expiry, and deletion controls required | **P1 MVP candidate** |
| Application-season pass | Fixed-season bundle of credits, exports, and collaboration | $99 to $249 per season | Medium; usage caps needed | Medium to high | Medium; plain expiry and renewal disclosures required | P2 |
| Parent/counselor collaboration add-on | Shared checklist, comments, and approvals | $4 to $12 monthly or $39 to $99 per season | Low software cost, higher support | High | High; explicit student sharing controls and revocation required | P2 |
| School/counselor licensing | Seats, cohorts, reporting, SSO, and admin controls | $2,000 to $15,000 annually | High onboarding/support, scalable later | High | High; contracts, data processing terms, FERPA review, tenant isolation | **P1 discovery** |
| White-label counselor dashboard | Branded counselor workspace and custom workflows | $10,000 to $50,000 annual/setup estimate | High implementation and support | Very high | High; tenant isolation and clear controller/processor roles | P3 |
| Scholarship/application premium data | Curated deadlines, eligibility, and workflow tools | $49 to $199 per season or B2B license | Medium editorial/data licensing cost | High | High if ranking uses sensitive traits; provenance and correction workflow required | P2 |
| Disclosed affiliate links | Public resource referral to relevant books, courses, or prep | 5% to 20% commission estimate | Low | Low | Medium; conflicts and compensation must be clear | P2 after policy review |
| Contextual sponsor cards | Public resource pages show a page-topic sponsor | $500 to $3,000 per campaign/month estimate | Low to medium sales and review cost | Medium | High for minors if third-party tracking is used; prohibit behavioral targeting | P3, traffic-gated |
| Referral partnerships | Fixed bounty for an eligible referred customer | Contract-specific | Low to medium | Medium | Medium; disclose compensation and prevent self-referral/fraud | P2 |
| API or B2B access | Approved organizations consume bounded analysis/report APIs | Usage-based plus annual minimum | Low marginal AI cost, high support/security | High | High; purpose limits, abuse controls, no resale of student data | P2 discovery |

## MVP Recommendation

1. Operate and measure the three existing one-time services before adding another human-service SKU. Add fulfillment owner, promised turnaround, cancellation/refund rules, and measured minutes per order.
2. Use the newly wired funnel events to establish qualified views, Checkout creation, verified payment, refund, and fulfillment rates. Count verified purchases from the server event, never from a browser success-page event.
3. Pilot a premium PDF report as the next product only after the report can be regenerated, revoked, securely downloaded, and deleted. Start with a small cohort and a fixed one-time price.
4. Run customer discovery for school licensing in parallel. Do not promise FERPA readiness, SSO, rostering, or white labeling before tenant isolation, contracts, retention controls, and admin audit logs exist.
5. Keep sponsor cards out of the MVP. Reconsider only when public-resource traffic is material enough to justify legal review, direct sponsor sales, and a first-party rendering system without ad-network scripts.

## Entitlement And Data Model

`OneTimePurchase` is sufficient for the three current paid services but is not a general entitlement or credit ledger. A later migration should add the following concepts without overloading `User.plan`:

| Model | Minimum fields | Purpose |
| --- | --- | --- |
| `Product` | `id`, `slug`, `kind`, `active`, `termsVersion` | Canonical commercial product independent of Stripe Price IDs |
| `PriceMapping` | `productId`, `stripePriceId`, `currency`, `amount`, `active` | Auditable Stripe mapping and price history |
| `Entitlement` | `userId` or `organizationId`, `productId`, `source`, `status`, `startsAt`, `endsAt`, `purchaseId` | Time-bound or permanent access with explicit provenance |
| `CreditLedger` | `entitlementId`, `delta`, `reason`, `generationId`, `idempotencyKey`, `createdAt` | Append-only credit issuance and redemption |
| `ServiceOrder` | `purchaseId`, `status`, `assignedTo`, `dueAt`, `fulfilledAt`, `refundState` | Human-service fulfillment and SLA tracking |
| `Organization` / `Membership` | tenant, role, seat, invitation, status | School and counselor licensing with tenant boundaries |
| `ReportArtifact` | `ownerId`, `purchaseId`, `storageKey`, `expiresAt`, `deletedAt` | Secure premium report lifecycle without public URLs |
| `SponsorCampaign` | sponsor, public topic allowlist, start/end, creative approval, paid-user suppression | Direct contextual sponsorship only |

Required invariants:

- Stripe webhook events and Checkout Session IDs are idempotency boundaries.
- A purchase records money movement; an entitlement records access; a service order records fulfillment. Do not merge those responsibilities.
- Credits use an append-only ledger, never a mutable balance without ledger reconciliation.
- Manual, promotional, paid, refunded, disputed, and expired access remain distinguishable.
- No entitlement is inferred from a client event or query string.

## Analytics Plan

The event contract permits only offer identifiers, coarse UI surface, amount, currency, authority, and non-personal operational fields. It rejects private essay/profile content by construction. Browser events continue to require analytics consent.

| Event | Authority | When emitted | Allowed fields | Conversion use |
| --- | --- | --- | --- | --- |
| `one_time_offer_checkout_clicked` | Client intent | User requests Checkout | `offerSlug`, `surface`, `authority` | CTA effectiveness only |
| `one_time_checkout_created` | Server | Stripe returns a Checkout URL | `offerSlug`, `surface`, `amount`, `currency`, `authority` | Checkout creation rate |
| `one_time_purchase_completed` | Server | Paid session passes ownership and price validation, then persists | prior fields plus stable internal event ID | Canonical purchase conversion |
| `one_time_purchase_refunded` | Future server | Verified refund event updates purchase | purchase event ID, offer, amount, currency | Net revenue |
| `service_order_fulfilled` | Future server | Fulfillment status commits | purchase event ID, offer, turnaround band | Fulfillment quality |
| `credit_issued` / `credit_redeemed` | Future server | Ledger transaction commits | product, quantity, reason code | Unit economics |
| `sponsor_impression` / `sponsor_click` | Future first-party | Approved public placement renders/clicks | campaign, placement, public topic, paid suppression | Sponsor reporting only |

Reporting rules:

- Count purchase conversions from server-authoritative events and reconcile them to `OneTimePurchase`, refunds, disputes, and Stripe payouts.
- Count distinct stable event IDs because Stripe fulfillment may be invoked more than once.
- Never send email, name, school, GPA, essay text, profile text, counselor messages, IP address, or a cross-site advertising identifier as event properties.
- Keep product analytics separate from sponsor reporting. Sponsors receive aggregate campaign counts only, never row-level user data.
- Define retention and deletion windows before adding a durable warehouse or Log Drain.

## Privacy And Ethics Assessment

This is a product policy, not legal advice. Counsel should review the actual audience, data flows, contracts, and jurisdictions before launch.

- **Children and teens:** The FTC states that COPPA can apply to child-directed services and general-audience services with actual knowledge they collect personal information from children under 13. The FTC also emphasizes data minimization and parental consent where required ([FTC COPPA guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)). AdmitPath should document its age policy and complete a COPPA applicability review before any sponsor or affiliate launch.
- **School customers:** School licensing may involve education records and school control obligations. The US Department of Education says third-party providers operating under FERPA's school-official exception must be under the school's direct control for use and maintenance of data and may not re-disclose it for unauthorized purposes ([Department of Education guidance](https://studentprivacy.ed.gov/faq/i-want-use-online-tool-or-application-part-my-course-however-i-am-worried-it-violation-ferpa)).
- **Sponsored content:** FTC guidance says native-ad disclosures must be clear, prominent, near the ad, and understandable across devices. Use the literal label `Sponsored`, visible before interaction ([FTC native advertising guidance](https://www.ftc.gov/business-guidance/resources/native-advertising-guide-businesses)).
- **Private content:** Essays, profiles, counselor conversations, test results, and inferred admissions traits are never ad inputs, sponsor exports, or affiliate-routing inputs.
- **Claims:** Do not guarantee admission, score increases, scholarship awards, ranking outcomes, or counselor equivalence. Human-service scope and credentials must be accurate.
- **Pressure:** No false scarcity, countdown timers, preselected add-ons, disguised recurring charges, shame-based copy, or obstruction of cancellation/refunds.
- **Conflicts:** Affiliate or sponsor compensation must not alter admissions, college, scholarship, or test-prep recommendations without a visible disclosure and an independent ranking methodology.

## Contextual-Only Micro-Ad Rules

No micro-ad placement is approved for production by this document. A future implementation must satisfy every rule below and pass legal/privacy review first.

1. Render only on public resource, blog, or non-personalized directory pages.
2. Never render in dashboards, essays, profiles, reports, analysis results, college lists, counselor conversations, authentication, billing, or onboarding.
3. Select campaigns from a fixed public page-topic taxonomy. Do not use identity, age, school, GPA, test score, location, browsing history, profile, essay, counselor message, or inferred need.
4. Use first-party rendering with approved static assets. No third-party ad-network scripts, pixels, cookies, fingerprinting, or cross-site identifiers.
5. Show `Sponsored` next to the sponsor name before the headline or image. The card must remain visibly distinct from editorial resources.
6. Reserve fixed dimensions to prevent layout shift. At most one sponsored card per public page and one per ephemeral browser session.
7. Suppress all sponsor cards for paid users. Provide a global kill switch and per-campaign start/end dates.
8. Send sponsors aggregate impressions and clicks only. Apply minimum aggregation thresholds and never expose user-level logs.
9. Require creative, destination, safety, accessibility, claims, and conflict review. Block lead-generation forms that request student data on AdmitPath pages.
10. Keep editorial ordering independent. Sponsored placement cannot buy a school ranking, scholarship match, admissions score, or counselor recommendation.

## Release Gates

- Stripe sandbox verifies each current Price ID, amount, currency, mode, success path, cancellation path, refund, and dispute flow.
- Webhook signature verification and idempotent fulfillment pass tests. Stripe requires the raw body for signature verification ([Stripe webhook guidance](https://docs.stripe.com/webhooks)).
- Server purchase events reconcile to unique paid `OneTimePurchase` rows; client events are never counted as revenue.
- Fulfillment owners, turnaround expectations, support path, refund policy, and privacy retention are published before accepting live service orders.
- No sponsor/affiliate code ships until privacy, legal, conflict, accessibility, and paid-user suppression reviews pass.
- Revenue reporting shows gross payment volume, refunds, disputes, Stripe fees, fulfillment cost, and contribution margin separately.
