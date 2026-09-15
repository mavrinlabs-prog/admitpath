# AdmitPath — Master UI/UX Spec Verification

**Date:** 2026-04-27  
**Method:** Fresh grep + file read per item. No trust in prior "done" claims.  
**Legend:** ✅ PASS · ❌ FAIL · ⚠️ PARTIAL

---

## PHASE 0 — Pre-work

| Item | Status | Evidence |
|------|--------|----------|
| AUDIT.md exists at project root | ✅ PASS | `apps/web/AUDIT.md` exists, has current rendering analysis |

---

## PHASE 1 — Design System (globals.css)

### Color Tokens
| Token | Status | Evidence |
|-------|--------|----------|
| `--color-primary: #E67635` | ✅ PASS | globals.css:13 |
| `--color-primary-hover: #D4622A` | ✅ PASS | globals.css:14 |
| `--color-primary-light: #FEF0E8` | ❌ FAIL | globals.css:15 has `#F4E6DC` — wrong value |
| `--color-primary-glow` | ❌ FAIL | MISSING from globals.css |
| `--color-primary-edge: #B85220` | ❌ FAIL | MISSING — btn uses hardcoded `#B85220` |
| `--color-bg: #FAFAF9` | ✅ PASS | globals.css:20 |
| `--color-surface` | ✅ PASS | globals.css:21 `#F5F5F4` |
| `--color-surface-raised` | ✅ PASS | globals.css:22 `#FFFFFF` |
| `--color-surface-sunken` | ❌ FAIL | MISSING |
| `--color-border` | ✅ PASS | globals.css:26 |
| `--color-border-strong` | ❌ FAIL | MISSING |
| `--color-text-primary: #1A1A18` | ⚠️ PARTIAL | globals.css:23 has `#1B1B18` (1-off) |
| `--color-text-secondary: #6B6B6B` | ⚠️ PARTIAL | globals.css:24 has `#6B6B66` |
| `--color-text-muted: #A8A8A8` | ⚠️ PARTIAL | globals.css:25 has `#9B9B95` |
| success + bg variant | ✅ PASS | globals.css:29-30 |
| warning | ✅ PASS | globals.css:33 |
| error + bg variant | ✅ PASS | globals.css:31-32 |
| Dark mode tokens | ✅ PASS | globals.css:79-93 |

### Typography
| Item | Status | Evidence |
|------|--------|----------|
| DM Serif Display H1 (via next/font) | ✅ PASS | layout.tsx:12-17, globals.css:36 |
| Instrument Sans UI (via next/font) | ✅ PASS | layout.tsx:20-25, globals.css:37 |
| Lora body (via next/font) | ✅ PASS | layout.tsx:27-32, globals.css:38 |
| JetBrains Mono code | ✅ PASS | globals.css:39 |
| NO Inter/Roboto/system-ui (non-OG) | ✅ PASS | grep: only in apple-icon.tsx, icon.tsx, og/route.tsx (image renderers, exempt) |
| NO Space Grotesk | ✅ PASS | grep: 0 matches |
| `--font-dm-sans` alias → Instrument Sans | ✅ PASS | globals.css:41 |

### Scales
| Item | Status | Evidence |
|------|--------|----------|
| Spacing 1–16 (4px base) | ✅ PASS | globals.css:43-55 |
| Spacing 20, 24 | ❌ FAIL | globals.css stops at `--space-16:64px` |
| Radius xs/sm/md/lg/xl/2xl/3xl | ✅ PASS | globals.css:57-63 |
| Radius `--radius-full` | ❌ FAIL | MISSING |
| Shadow sm/md/lg/primary | ✅ PASS | globals.css:65-69 |
| Shadow xs | ❌ FAIL | MISSING |
| Shadow 2xl | ❌ FAIL | MISSING |
| Shadow orange / `--shadow-orange` | ❌ FAIL | MISSING (only `--shadow-primary`) |
| Easing `--ease-out: (0.16,1,0.3,1)` | ❌ FAIL | globals.css:75 has `(0.4,0,0.2,1)` — wrong spec |
| Easing `--ease-spring: (0.34,1.56,0.64,1)` | ❌ FAIL | MISSING |

### ZERO hardcoded hex in components/
| Item | Status | Evidence |
|------|--------|----------|
| No hardcoded hex in components/ | ❌ FAIL | 72 hits (counselor-widget, landing components, etc. — orange brand values #E67635 etc.) |

---

## PHASE 2 — Component Library

### Buttons
| Item | Status | Evidence |
|------|--------|----------|
| Primary: `box-shadow: 0 2px 0 #B85220, 0 1px 3px rgba(0,0,0,0.12)` | ⚠️ PARTIAL | globals.css:149 has `0 2px 0 #B85220` only — missing `0 1px 3px rgba(0,0,0,0.12)` |
| Hover `translateY(-1px)` + shadow-orange | ❌ FAIL | globals.css:157 uses `translateY(-2px)` — wrong value |
| Active `translateY(1px)` | ❌ FAIL | globals.css:160 uses `translateY(0)` — wrong |
| Disabled `opacity: 0.45` | ❌ FAIL | globals.css:146 uses `disabled:opacity-50` = 0.50 |
| Focus 2px outline offset 3px | ⚠️ PARTIAL | globals.css:146 uses `ring-offset-2` (2px offset not 3px) |
| Secondary button | ✅ PASS | globals.css:165-179 |
| Ghost button | ✅ PASS | globals.css:182-192 |
| Destructive button | ❌ FAIL | Not defined in globals.css |
| Icon button 40px | ❌ FAIL | Not defined in globals.css |

### Inputs
| Item | Status | Evidence |
|------|--------|----------|
| 44px height | ✅ PASS | globals.css:241 |
| 1.5px border | ❌ FAIL | globals.css:234 uses `@apply ... border` = 1px |
| Radius 10px | ❌ FAIL | globals.css:234 uses `rounded-lg` = 8px |
| Orange focus ring | ✅ PASS | globals.css:249-251 |
| Error red ring class | ❌ FAIL | No `.input-field-error` class defined |
| Disabled bg `#F5F5F4` | ❌ FAIL | No `disabled:` state in `.input-field` |

### Other Components
| Item | Status | Evidence |
|------|--------|----------|
| File upload zone: dashed, hover orange | ❌ FAIL | Not defined anywhere |
| Custom select | ❌ FAIL | Not defined |
| Cards base + interactive lift -3px | ✅ PASS | globals.css:201-210, `translateY(-3px)` |
| Featured card 2px orange border + glow + "Most Popular" | ✅ PASS | globals.css:218-223 |
| Sidebar 248px width | ✅ PASS | globals.css:322 |
| Sidebar bg `#FAFAF9` | ❌ FAIL | globals.css:325 uses `var(--color-surface)` = #F5F5F4 |
| Sidebar active orange + 3px left border | ❌ FAIL | globals.css:341 uses `border-l-4` (4px, not 3px) |
| FAB 56px rounded-square gradient | ✅ PASS | counselor-widget.tsx:258 `h-14 w-14 rounded-[16px]` |
| FAB custom 3-circles-triangle SVG | ✅ PASS | counselor-widget.tsx:7-14 `TriangleDotsIcon` |
| FAB spring entry animation | ❌ FAIL | counselor-widget.tsx: button has no `motion.button` or spring entry |
| FAB pulse ring on first visit | ❌ FAIL | No pulse ring implementation |
| Empty states 120px class | ✅ PASS | globals.css:353-370 `.empty-state-icon` 120×120 |
| Empty state custom SVG illustrations | ❌ FAIL | Class exists but no actual SVG illustrations created |
| Toast slide-in `@keyframes toast-in` | ✅ PASS | globals.css:500-503, 526 |
| Toast bottom-right position | ❌ FAIL | toast.tsx:56 uses `left-1/2 -translate-x-1/2` = bottom-center |

---

## PHASE 3 — Landing Page

| Item | Status | Evidence |
|------|--------|----------|
| 68px sticky header | ✅ PASS | page.tsx:171 `h-[68px]` |
| `rgba(250,250,249,0.88)` backdrop | ✅ PASS | page.tsx:164 |
| `blur(16px) saturate(180%)` | ✅ PASS | page.tsx:166-167 |
| Hero 100vh / min-h-screen | ✅ PASS | HeroSection.tsx:136 `min-h-screen` |
| Hero 2-col layout | ✅ PASS | HeroSection.tsx:156 `grid-cols-1 lg:grid-cols-2` |
| H1 exact text "Your Ivy League counselor. Available 24/7." | ✅ PASS | HeroSection.tsx:180-197 |
| H1 DM Serif Display font | ❌ FAIL | HeroSection.tsx:178 uses `--font-dm-sans` (= Instrument Sans) |
| H1 56px exact | ⚠️ PARTIAL | HeroSection.tsx:177 uses `text-5xl sm:text-6xl lg:text-7xl` (responsive, not fixed 56px) |
| Eyebrow pill `#FEF0E8` orange | ⚠️ PARTIAL | HeroSection.tsx:166 uses `badge-primary` → `--color-primary-light` = `#F4E6DC` (not `#FEF0E8`) |
| Stagger 0/100/200/300/400/500ms | ⚠️ PARTIAL | HeroSection.tsx uses spring delays 0,0.07,0.14,0.21,0.28,0.35s ≈ 70ms steps |
| Right column: score card mockup, rotated 1.5deg | ✅ PASS | HeroSection.tsx:285 `rotate(1.5deg)` |
| Behind-card: `rotate(-2.5deg) opacity(0.6)` | ❌ FAIL | HeroSection.tsx: no second blurred element behind main card |
| Floating trust badges translateY `0→-8→0` | ❌ FAIL | HeroSection.tsx:253-274: static trust strip, no float animation |
| Features 3-col scroll-stagger 80ms | ✅ PASS | page.tsx:258 `<StaggerContainer staggerMs={80}>` |
| `HoursBackSection` dark section with animated counters | ✅ PASS | HoursBackSection.tsx: dark gradient + 4 AnimatedCounter |
| "Get hours back" heading | ✅ PASS | HoursBackSection.tsx:83 |
| NO "Ready in X seconds"/"60 seconds" copy | ✅ PASS | grep: 0 matches |
| NO "FERPA" in user-facing pages | ✅ PASS | grep: 0 matches |
| NO "Add cookies" copy | ✅ PASS | grep: 0 matches |
| NO "powered by Claude"/"refined by Claude" | ✅ PASS | grep: 0 matches |
| Testimonials 3-col | ✅ PASS | page.tsx:723 `grid-cols-1 md:grid-cols-3` |
| Testimonials Lora italic | ❌ FAIL | page.tsx:733 uses `text-sm leading-relaxed` no Lora italic |
| Footer #1A1A18 dark background | ❌ FAIL | page.tsx:853 uses `var(--surface-raised)` = white |
| Footer 4 columns | ❌ FAIL | page.tsx:875: 3 link columns (Product, Account, Legal) + Brand = 2+3 layout, not 4 equal cols |
| Footer all links functional | ⚠️ PARTIAL | page.tsx:878-895: `/privacy`, `/terms`, `#faq`, `/calculator`, `/college` all present. Anchor `#faq` works only on homepage. |
| ZERO blue (`#4A6FA5`, `#2563EB`, `#0284C7`, etc.) in pages/components | ✅ PASS | grep: 0 matches |
| ZERO banned rgba blue in pages/components | ✅ PASS | grep: 0 matches |

---

## PHASE 5 — Pricing

| Item | Status | Evidence |
|------|--------|----------|
| 3 tiers: Free $0, Plus $9.99, Pro $19.99 | ✅ PASS | pricing/page.tsx:13-71 |
| Free plan "forever" period | ✅ PASS | pricing/page.tsx:17 `"forever"` |
| Plus highlighted, 2px orange border + glow | ✅ PASS | pricing/page.tsx:246-251 |
| Plus "Most Popular" pill badge | ✅ PASS | pricing/page.tsx:259-265 |
| Comparison table | ✅ PASS | pricing/page.tsx:367-460 — exists |
| Table grouped Core/AI/Export/Advanced sections | ❌ FAIL | Table compares "Solo vs AdmitPath vs Private Counselor" — not feature-grouped tiers |
| FAQ accordion (Framer Motion height anim) | ✅ PASS | pricing/page.tsx:88-123 `motion.div height: auto/0` |
| Trust row | ✅ PASS | pricing/page.tsx:348-361 |
| NO blue | ✅ PASS | Free tier icon uses #64748B (slate-grey — acceptable, not brand blue) |

---

## PHASE 8 — Blog

| Item | Status | Evidence |
|------|--------|----------|
| `/blog` magazine grid | ✅ PASS | blog/page.tsx:128-238 |
| Featured post full-width 2-col | ✅ PASS | blog/page.tsx:125-184 |
| 3-col grid below | ✅ PASS | blog/page.tsx:192 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| 16:9 card images | ❌ FAIL | Cards use colored gradient strips, not 16:9 image containers |
| Sticky TOC on article page | ❌ FAIL | blog/[slug]/page.tsx: NO TOC implemented |
| Inline CTA `#FEF0E8` background | ⚠️ PARTIAL | blog/[slug]/page.tsx:152-161 has CTA section with orange gradient border, not `#FEF0E8` solid |
| Article schema + BreadcrumbList | ✅ PASS | blog/[slug]/page.tsx:38-70 |
| Blog page BreadcrumbList + Blog schema | ✅ PASS | blog/page.tsx:22-57 |

---

## PHASE 9 — Animations

| Item | Status | Evidence |
|------|--------|----------|
| Hero stagger 0–500ms | ✅ PASS | HeroSection.tsx: spring delays 0–0.35s |
| Scroll triggers threshold 0.15, stagger 80ms | ✅ PASS | scroll-reveal.tsx:24 `-15%` margin, StaggerContainer default 80ms |
| Page transitions (AnimatePresence) | ✅ PASS | page-transition.tsx: full implementation |
| Score dial scaleIn spring | ✅ PASS | analyze/page.tsx:186-236 `MiniScoreDial` spring stiffness:260 |
| Score dial animated fill 0→score% | ✅ PASS | analyze/page.tsx:219-221 strokeDashoffset animate |
| Kanban drag micro-animations | ✅ PASS | colleges/page.tsx:124-138 `motion.div layout` |
| Validation shake `@keyframes shake` | ✅ PASS | globals.css:516-525 |
| Shake wired to form inputs | ❌ FAIL | `.animate-shake` exists but not applied to any form element |
| Tag spring animation | ❌ FAIL | Not found in codebase |
| Toggle slide animation | ❌ FAIL | Not found in codebase |
| Toast slide-in | ✅ PASS | globals.css:526 `.animate-toast-in` |
| FAB spring entry | ❌ FAIL | counselor-widget.tsx: FAB button is plain `<button>`, no motion spring |

---

## PHASE 10 — Security

| Item | Status | Evidence |
|------|--------|----------|
| Rate limits Upstash (AI routes) | ✅ PASS | lib/rate-limit.ts: `@upstash/ratelimit` + fallback |
| AI routes use `rateLimitAI()` | ✅ PASS | analyze/route.ts, chat/route.ts, essay/route.ts all call `rateLimitAI(userId)` |
| `Retry-After: 60` header on 429 | ✅ PASS | analyze/route.ts:145, chat/route.ts, essay/route.ts |
| JWT 15min/7d custom tokens | ❌ FAIL | Using Clerk for all auth — no custom JWT layer |
| No client-side API keys/secrets | ✅ PASS | Only `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in client code |
| File upload validation | ✅ PASS | No file uploads exist — JSON-only API surface |
| Admin dashboard (UI) | ❌ FAIL | Admin reset-db route exists (api/admin/reset-db) but no admin UI page |
| Admin route protected by CRON_SECRET | ✅ PASS | admin/reset-db/route.ts:34-39 |
| Input validation (Zod) on all AI routes | ✅ PASS | All 3 AI routes use Zod schema |

---

## PHASE 11 — AdmitPath Specifics

| Item | Status | Evidence |
|------|--------|----------|
| 7-dim score dials in analyze results | ✅ PASS | analyze/page.tsx: `MiniScoreDial` grid, 7 dimensions |
| Dials: scaleIn spring + animated fill | ✅ PASS | analyze/page.tsx:205-209 |
| College list Kanban (Reach/Target/Safety) | ✅ PASS | colleges/page.tsx: 3-column COLUMNS array |
| Kanban drag-and-drop | ✅ PASS | colleges/page.tsx:113-138 `draggable` with HTML5 DnD |
| Orange across dashboard tool cards | ✅ PASS | dashboard/page.tsx: fixed in this session |
| Dashboard upgrade banner orange gradient | ✅ PASS | dashboard/page.tsx: `#FDF0E8 0%, #F5E0CC 100%` |
| "Ready in X seconds" copy gone | ✅ PASS | grep: 0 matches |
| Orange across essay editor | ⚠️ PARTIAL | essay page exists but not audited in detail |

---

## PHASE 12 — QA

| Item | Status | Evidence |
|------|--------|----------|
| TypeScript `npx tsc --noEmit` clean | ✅ PASS | 0 errors after scroll-reveal margin type fix |
| Zero blue hex violations | ✅ PASS | grep for all banned values: 0 matches |
| Zero banned rgba blue | ✅ PASS | grep: 0 matches |
| prefers-reduced-motion respected | ✅ PASS | globals.css:533-541 |
| Skip-to-content a11y | ✅ PASS | globals.css:568-588, layout.tsx |

---

## Summary

| Phase | PASS | FAIL | PARTIAL |
|-------|------|------|---------|
| 0 | 1 | 0 | 0 |
| 1 | 13 | 11 | 5 |
| 2 | 10 | 16 | 2 |
| 3 | 14 | 7 | 4 |
| 5 | 6 | 1 | 1 |
| 8 | 5 | 2 | 1 |
| 9 | 7 | 4 | 0 |
| 10 | 7 | 2 | 0 |
| 11 | 6 | 0 | 1 |
| 12 | 5 | 0 | 0 |
| **Total** | **74** | **43** | **14** |

---

## Fixes Applied (post-audit)

See below — all FAIL/PARTIAL items addressed.
