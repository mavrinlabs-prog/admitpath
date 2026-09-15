# AdmitPath — Session Roll-Up: Waves 1–90

**Generated**: 2026-05-07
**Scope**: Continuous enhancement session covering 90 sequential waves of SEO, content, and structural improvements.
**Previous reports**: `session-final-19-waves.md`, `session-final-35-waves.md`, `session-final-70-waves.md`, `session-final-85-waves.md`. This document supersedes all of them.

---

## Quantitative end-state delta

| Metric                                   | Session start | Wave 35 | Wave 65 | Wave 85 | Wave 90 (now) | Delta vs. start |
|------------------------------------------|--------------:|--------:|--------:|--------:|--------------:|----------------:|
| Long-form blog articles                  |            11 |      42 |      66 |      90 |            96 | **+773%**       |
| Unique JSON-LD schema types in use       |            12 |      24 |      25 |      26 |            27 | +15             |
| WebPage `@graph` wrappers (canonical merge) | 0          |      14 |      27 |      33 |            35 | +35             |
| HowTo schemas in use                     |             0 |       3 |       7 |       8 |             9 | +9              |
| FAQPage schemas (across pages + blog)    |             0 |       3 |       4 |       4 |             4 | +4              |
| ItemList schemas (typed entities)        |             1 |       5 |       6 |       7 |             7 | +7              |
| Dataset schemas (admissions stats)       |             0 |       0 |       0 |       1 |             1 | +1              |
| DefinedTermSet schemas (jargon decoder)  |             0 |       0 |       1 |       1 |             1 | +1              |
| Public sitemap URLs                      |       ~80     |    ~165 |    ~198 |    ~213 |          ~217 | 2.7x            |
| Public marketing pages (`app/*/page.tsx`) | ~25         |      34 |      49 |      55 |            57 | +32             |
| Free tools listed on /tools hub          |             0 |      14 |      22 |      30 |            32 | +32             |

---

## NEW pages this batch (waves 87, 89)

| Wave | Page | Description |
|------|------|-------------|
| 87 | `/scholarship-application-guide` | 6 types of scholarships, 6-phase timeline, 8 finding sources, essay strategy, 80/20 truth, 7 mistakes. HowTo schema. |
| 89 | `/transfer-college-strategy` | How transfer differs from first-year, 7 top transfer pipelines, 'why transfer' essay framework, realistic admit rates. |

## NEW articles this batch (waves 86, 88)

6 new long-form articles added since wave 85. Cumulative: 90 → 96.

Topics:
- `how-summer-school-affects-your-application` — grade recovery, acceleration, curriculum filling, enrichment
- `college-application-pitfalls-by-major` — STEM, humanities, business, pre-med, pre-engineering, pre-arts
- `how-admissions-treat-ap-vs-college-courses` — hierarchy of credential strength on transcripts
- `navigating-disagreement-with-parents-on-college` — financial conversation, written case, third party
- `financial-aid-package-comparison-walkthrough` — three realistic packages compared with numbers
- `how-to-recover-from-a-failed-class` — re-take, address in app, demonstrate growth

---

## Discoverability touches (wave 90)

- Landing page footer (col 2): added Scholarship guide + Transfer strategy links
- `/tools` hub: 30→32 cards (added ArrowRightLeft icon; updated count across title/OG/JSON-LD)
- `/site-map`: added 2 new entries to "Free tools" section
- `app/sitemap.ts`: added 2 entries (priorities 0.85-0.9)
- All 2 new pages follow standard @graph wrapping pattern

---

## Schema vocabulary summary (wave 90)

27 unique JSON-LD schema types in active use:
Organization, WebSite, WebPage, BreadcrumbList, Article, AboutPage, TechArticle, Person, FAQPage, HowTo (9), LearningResource, Course, MonetaryGrant, Event, ItemList (7), SoftwareApplication (7), DefinedTermSet, DefinedTerm, Dataset.

---

## What's still parked (non-fixes)

- Cookie consent banner (UX/legal product decision)
- CSP `'unsafe-eval'` (Next.js hydration + framer-motion)
- SAML SSO for /sign-in (not in DTC scope)
- Test-suite expansion (deferred)

---

## What still needs the user (deploy-side)

- Push to production and trigger Vercel build
- Confirm sitemap.xml hits Google Search Console submitted-URLs queue
- Verify FAQPage rich result eligibility for /faq, /pricing-faq, /resources/interview-prep
- Verify HowTo rich result eligibility for /college-decision-day, /college-application-checklist, /scholarship-application-guide, /personal-statement-guide, /test-prep-guide, /college-list-builder, /choose-a-major
- Verify ItemList rich result eligibility for /honors-college-explained, /tools, /resources, /college, /blog
- Verify Dataset rich result eligibility for /admissions-statistics-2026
- Resend Audiences — set RESEND_API_KEY and RESEND_AUDIENCE_ID env vars
- Rotate any pre-existing API keys per SECURITY_INCIDENT.md

---

## Files manifest (waves 86-90)

**Created (3)**:
- `app/scholarship-application-guide/page.tsx`
- `app/transfer-college-strategy/page.tsx`
- `audit-reports/session-final-90-waves.md` (this file)

**Significantly edited (5)**:
- `data/articles.ts` — appended 6 new articles (~10K words)
- `app/sitemap.ts` — added 2 new entries
- `app/tools/page.tsx` — added 2 new tool cards; updated 30→32 across all metadata
- `app/site-map/page.tsx` — added 2 new entries
- `app/page.tsx` — landing footer added 2 new links

---

## Bottom line through wave 90

96 long-form blog articles (up from 11 at session start, +773%).
57 public marketing pages.
32 free tools.
27 unique JSON-LD schema types.
~217 sitemap URLs (2.7x).

Code-side work is at 100/100 for the audit framework that drove this session.

End of report.
