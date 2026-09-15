# AdmitPath Design Audit — Phase 0

Generated: 2026-04-27

## Summary

The globals.css and tailwind.config.ts correctly define the orange brand system (#E67635).
However, **34 source files** still contain hardcoded blue values from the old Discovery Labs
palette (#4A6FA5, #1E3352, #2E4A6E, #4A8BE0). Additionally, the CSS variable `--font-dm-sans`
is referenced in 15+ files but is not defined in globals.css (broken).

---

## 1. Blue Color Violations

### Banned values
| Old blue             | Replace with         | Role            |
|----------------------|----------------------|-----------------|
| `#4A6FA5`            | `#E67635`            | primary         |
| `#4A8BE0`            | `#D4622A`            | primary-hover   |
| `#2E4A6E`            | `#C45220`            | primary-deep    |
| `#1E3352`            | `#B34A1C`            | darkest accent  |
| `rgba(74,111,165,…)` | `rgba(230,118,53,…)` | primary alpha   |
| `rgba(30,51,82,…)`   | `rgba(196,82,32,…)`  | deep alpha      |

### Files with violations (34 files)
- `app/page.tsx` — 20+ inline blue refs
- `app/analyze/page.tsx` — RadarChart, ScoreRing, accent props, gradient CTA
- `app/dashboard/page.tsx` — plan colors, card borders, step gradients
- `app/chat/page.tsx` — message bubbles, FAB, input focus, send button
- `app/essays/page.tsx` — score bar colors, submit button gradient
- `app/colleges/page.tsx` — kanban column reach color
- `app/billing/page.tsx` — plan tier colors and gradients
- `app/pricing/page.tsx` — plan tier colors, comparison table
- `app/settings/page.tsx` — avatar gradient, save button
- `app/sign-in/[[...sign-in]]/page.tsx` — split-screen left panel gradient
- `app/sign-up/[[...sign-up]]/page.tsx` — split-screen left panel gradient
- `app/profile/create/page.tsx` — submit CTA gradient
- `app/calculator/page.tsx` — step icon gradient
- `app/calculator/calculator-client.tsx` — target tier colors
- `app/blog/page.tsx` — logo avatar gradient
- `app/blog/[slug]/page.tsx` — logo avatar gradient
- `app/college/page.tsx` — logo avatar gradient, headings
- `app/college/[slug]/page.tsx` — logo avatar gradient, stat numbers
- `app/global-error.tsx` — error page gradient, Inter/Roboto font fallback
- `app/not-found.tsx` — 404 gradient, font-dm-sans refs
- `app/apple-icon.tsx` — app icon gradient
- `app/icon.tsx` — favicon gradient
- `app/api/og/route.tsx` — OG image header gradient
- `components/landing/HeroSection.tsx` — score bar colors, ring gradient
- `components/landing/MountainSection.tsx` — path stroke, milestone fill, gradient
- `components/landing/FAQSection.tsx` — open border rgba blue
- `components/app-nav.tsx` — avatar gradient, mobile CTA button
- `components/trial-banner.tsx` — chip gradient, usage bar
- `components/counselor-widget.tsx` — FAB, user bubble, typing dots, send button
- `components/paywall-gate.tsx` — feature badge, upgrade button
- `components/sticky-mobile-cta.tsx` — CTA button gradient
- `components/profile-completion-ring.tsx` — SVG ring gradient stops
- `components/ui/toast.tsx` — info toast color/border
- `components/ui/command-palette.tsx` — selected item gradient

---

## 2. Font Variable Issues

### `--font-dm-sans` — UNDEFINED in globals.css
Referenced in 15+ files but never added to globals.css. Falls back to system-ui.

**Fix:** Add `--font-dm-sans: var(--font-instrument-sans)` alias to globals.css `:root`.

**Files affected:** app/page.tsx, app/not-found.tsx, app/global-error.tsx,
app/billing/page.tsx, app/pricing/page.tsx, app/college/page.tsx, app/college/[slug]/page.tsx

### `Inter` / `Roboto` references
- `app/global-error.tsx:35` — hardcodes Inter/Roboto font stack. Replace with Instrument Sans.

---

## 3. Missing Design Tokens

- `--font-jetbrains-mono` — not in globals.css (needed for score values/code)
- `--radius-xs: 2px` — not defined
- `--easing-spring` — not defined (duplicated in Framer Motion configs)

---

## 4. Component Gaps vs Spec

- Chatbot FAB uses generic gradient circle; spec wants custom 3-circles-triangle SVG
- Empty states show raw text; no custom illustrations
- Native `<select>` elements, no custom styling

---

## 5. Copy Violations

None found — timing claims and trial language already cleaned up.

---

## Fix Order

1. globals.css — font alias + missing tokens
2. app/page.tsx — 20+ blue refs
3. Landing components — HeroSection, MountainSection, FAQSection
4. Auth pages — sign-in, sign-up
5. Pricing + Billing
6. In-app pages — dashboard, analyze, chat, essays, colleges
7. Nav/widgets — app-nav, trial-banner, counselor-widget, paywall-gate
8. Remaining components — profile-completion-ring, sticky-mobile-cta, toast, command-palette
9. Misc — settings, profile/create, calculator, blog, college, icons, OG route
10. CLAUDE.md update
