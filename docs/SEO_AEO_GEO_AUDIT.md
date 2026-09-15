# AdmitPath SEO, AEO, GEO, and AI Discoverability Audit

Audit date: 2026-07-17  
Repository scope: `admith` (AdmitPath) only  
Deployment performed: No  
Playwright performed: No

## Executive summary

The implementation now uses a real XML sitemap index, separates public URLs into
four child sitemaps, removes private/noindex/redirect-only URLs from discovery
inventories, narrows robots rules around private application surfaces, and
replaces the unverified `llms.txt` marketing claims with a canonical, route-based
reference map.

The highest-confidence schema fixes remove site-wide page-specific entities and
an FAQ graph that had no visible FAQ section. The public guide index now links
the existing substantive content into seven topic clusters: profile development,
essay strategy, application planning, college research, scholarships and aid,
admissions timelines, and counselor collaboration.

## Fixed items

### Crawlability and indexability

- Replaced the root sitemap `urlset` with a `sitemapindex` at `/sitemap.xml`.
- Added child URL sets at `/sitemaps/core.xml`, `/sitemaps/content.xml`,
  `/sitemaps/colleges.xml`, and `/sitemaps/regional.xml`.
- Built dynamic sitemap entries from the existing article, guide, college,
  supplemental essay, comparison, scholarship, major, tool, Florida, and state
  data modules.
- Excluded authenticated, noindex, and redirect-only routes from sitemap output.
- Removed duplicate sitemap entries present in the previous static array.
- Simplified robots rules to allow public content while disallowing API, auth,
  account, billing, dashboard, essay workspace, chat, interview workspace, and
  transaction routes.
- Kept the robots sitemap declaration pointed at the sitemap index.
- Added explicit noindex metadata boundaries for profile, trial, order, and
  transaction-completion routes that previously inherited root indexability.
- Added a noindex boundary to the private `/colleges` list while dynamic public
  `/colleges/[slug]` pages continue to declare index/follow metadata.

### Canonicals and route metadata

- Removed the homepage canonical from root metadata so it cannot be inherited by
  unrelated routes.
- Added canonical, robots, Open Graph, and Twitter metadata for the Help Center.
- Preserved canonical metadata on public substantive pages and dynamic content.
- Corrected the public college directory schema and navigation to use
  `/colleges/[slug]`, while `/college` remains the directory hub and `/colleges`
  remains the private saved-college workspace.
- Replaced footer/navigation links that unnecessarily traversed permanent
  redirects (`/counselor`, `/why-admitpath`).

### Structured data and trust

- Replaced rendered root JSON-LD with site-wide entities only:
  `EducationalOrganization`, `WebSite`, and truthful `SoftwareApplication`
  offers.
- Removed rendered root `Person`, global breadcrumb, event, HowTo, SearchAction,
  and unsupported `sameAs` claims.
- Removed scholarship finder FAQ schema because the corresponding FAQ content was
  not visible on that route.
- Avoided adding Course, HowTo, or EducationalOccupationalProgram schema.
- Suppressed empty Bing verification markup when no verification value exists.
- Aligned visible data-scale references to the current 102-record college module
  and softened claims about coverage, currency, authorship, and outcome
  validation.

### `llms.txt`

- Rewrote the file with absolute canonical URLs.
- Removed annual pricing, the Free-chat contradiction, competitor pricing and
  quality claims, credentials, cross-product assertions, unsupported 500+ scale,
  and "Original AdmitPath research" labeling.
- Removed the duplicate personal-statement entry.
- Removed the broken `/acceptance-rate` URL.
- Separated public references from account-required product areas.
- Stated only current pricing facts shown on `/pricing`: 5 analyses, 5 essay
  feedback runs, 5 chat messages, 8 saved colleges, and Pro at $19.99/month.

### Internal links and hierarchy

- Added a seven-cluster "Explore by topic" hub to `/guides` using existing
  substantive pages only.
- Removed reader-facing keyword-volume badges from guide cards.
- Corrected college profile links and back-navigation between `/college` and
  `/colleges/[slug]`.
- Replaced redirecting counselor/company footer and navigation links with their
  canonical destinations.

### Headings

- Removed duplicate screen-reader-only H1 elements from `/aid-comparison` and
  `/appeal-letter`; each route now relies on its visible client-rendered H1.

## Exact source checks completed

- Route inventory: 160 `page.tsx` files found; 118 had direct page-level
  `metadata` or `generateMetadata` before accounting for layout metadata.
- Data-module count check: 102 colleges, 27 guides, 214 articles, 25 supplemental
  essay records, 50 states, and 4 state subpage types.
- Manual route/source confirmation:
  - `/acceptance-rate/[slug]`, `/college/[slug]`, `/how-to-get-into/[slug]`, and
    `/scattergram/[slug]` are redirect-only routes.
  - `/counselor`, `/schools`, `/vs/[slug]`, `/vs-college-counselor`,
    `/why-admitpath`, `/merit-match`, and `/roi` are redirect-only routes.
  - `/interview-practice` is noindex/account-gated and is listed as such in
    `llms.txt`.
  - `/competitions`, `/summer`, `/scholarships`, `/parent`, `/outcomes`,
    `/rec-letters`, and `/compare-scores` declare noindex and are excluded from
    sitemap output.
- Source H1 check identified two H1 elements on each affected route before the
  fix: one hidden in the server page and one visible in the client component.
- Focused regression coverage was added in
  `tests/seo-discoverability.test.ts` for sitemap shape/exclusions, `llms.txt`
  retired claims, H1 counts, and hidden FAQ schema.

## Verification status

- `npm run typecheck`: attempted; timed out after 304 seconds with no compiler
  output or diagnostic.
- `npx vitest run tests/seo-discoverability.test.ts --reporter=verbose
  --pool=forks --maxWorkers=1`: attempted; timed out after 314 seconds before the
  Vitest startup banner or assertion output.
- A targeted attempt to stop AdmitPath `tsc`/Vitest Node processes by command
  line also timed out after 23 seconds. The invoking shell was terminated by the
  command runner; no successful process-stop output was returned.
- Lint, full tests, and production build were not started after the user directed
  that long-running verification stop. The parent task will run final builds.
- Playwright was not run, as required.

## Residual risks and follow-up checks

1. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` from a
   fully hydrated local checkout rather than the current I/O-constrained OneDrive
   working tree.
2. Request `/sitemap.xml` and each child sitemap after build; confirm HTTP 200,
   `application/xml`, a `sitemapindex` root for the index, and `urlset` roots for
   all four children.
3. Run the added SEO regression test and confirm that every generated sitemap URL
   is unique and no excluded route appears.
4. Crawl rendered production HTML to verify one canonical per indexable route,
   no canonical on redirects, and no inherited noindex on `/colleges/[slug]`.
5. Validate representative JSON-LD with Schema.org and Google tooling. The clear
   hidden FAQ case was removed, but the repository contains many pre-existing
   route-level FAQ graphs that should be sampled against rendered visible text.
6. Perform a full rendered internal-link crawl. The known live `llms.txt` 404 was
   removed and key redirecting navigation links were fixed, but the environment
   prevented a complete automated link crawl in this pass.
7. Confirm the canonical production host. The repository source of truth remains
   `https://admith.vercel.app`; update `lib/site-url.ts`, metadata constants, and
   `llms.txt` together if a custom AdmitPath domain becomes canonical.
8. The root layout still forces dynamic rendering for every page. Reassess that
   architectural choice separately because it limits static generation and may
   increase response latency for otherwise static discovery pages.
9. A legacy, non-rendered JSON-LD object remains in `app/layout.tsx` to avoid a
   risky large-file rewrite during the I/O incident. Only the new `siteJsonLd`
   object is emitted, but removing the dead object later will reduce maintenance
   confusion and minor server-module work.

## Files changed

- `app/about/page.tsx`
- `app/aid-comparison/page.tsx`
- `app/appeal-letter/page.tsx`
- `app/college/page.tsx`
- `app/colleges/[slug]/page.tsx`
- `app/colleges/layout.tsx`
- `app/guides/page.tsx`
- `app/help/layout.tsx`
- `app/layout.tsx`
- `app/offers/orders/layout.tsx`
- `app/offers/success/layout.tsx`
- `app/profile/layout.tsx`
- `app/robots.ts`
- `app/scholarship-match/layout.tsx`
- `app/sitemap.xml/route.ts`
- `app/sitemaps/[section]/route.ts`
- `app/sitemap.ts` (removed)
- `app/start-trial/layout.tsx`
- `components/landing/FAQSection.tsx`
- `components/landing/StatsBar.tsx`
- `components/marketing/MarketingNav.tsx`
- `components/marketing/SiteFooter.tsx`
- `docs/SEO_AEO_GEO_AUDIT.md`
- `lib/seo-sitemaps.ts`
- `public/llms.txt`
- `tests/seo-discoverability.test.ts`
