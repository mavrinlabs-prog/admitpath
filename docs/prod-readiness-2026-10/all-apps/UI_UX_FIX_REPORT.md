# UI / UX fix report — 2026-10-19

Visual checks: production homepages of AdmitPath and CompeteAI were opened in a browser on 2026-10-19 (no console errors; single "Get started" CTA in the header). A 375px mobile pass was reviewed in CSS only, not visually, for all three apps — listed as an open item.

## WorksheetGen
- Header: one CTA ("Get Started", or "Dashboard" when signed in); Sign In removed from landing. "Who it's for" submenu: teachers, homeschool, special ed, ELL, tutors.
- Generators renamed Tools; `/generators/*` → `/tools/*`; `/examples/*` → `/templates`; new `/templates/[slug]` sample pages incl. Multiplication Facts Within 20; `/alternatives` removed (→ `/`).
- Dashboard sidebar: Tools, Templates, Standards.
- "Try the generator" runs the tool directly for signed-in users.
- Worksheet preview restyled to `WORKSHEET_VISUAL_FRAMEWORK.md` (headers, instructions, answer spaces, grade-appropriate typography); 3 Teachers Pay Teachers examples studied for layout patterns only (see WORKSHEETGEN_REPORT.md).
- Smart popup rules; founder cross-promotion removed (incl. author page); all free-pilot copy removed.

## AdmitPath
- Rebuilt as coded components: Maya R. 81/100 report card with 7 dimensions and priority gap (/analyze); "Calibrated against admissions data from" logo strip (uniform boxes, seamless loop, reduced-motion); "Inside the product / command center" preview with every requested section.
- Nav: one auth button, For schools, For counselors, "Who it's for" menu, Tools; chat icon removed. Footer: real `/status` check ("All systems operational" when healthy), CompeteAI cross-link removed.
- `/resources` and blog restyled to the design tokens (off-palette blues removed). Pro feature list moved below core work on the dashboard.
- Removed: one unverifiable testimonial, the "$1/day" claim (Pro is $19.99/month everywhere).

## CompeteAI
- Landing: one CTA + Events/Features/Pricing smooth-scroll links; `/schools` Contact us scrolls to the form; Chapters plan has Contact us next to it.
- Redesigned subscribe-to-continue modal (single "Continue with Pro" → Stripe).
- Blog: posts were unstyled because the Tailwind typography plugin was never installed — fixed; consistent logo; BPA post redirects to `/blog`.
- Shared logo component; footer cross-promotion removed.
- **AI coach chat widget (C22)**: one embedded widget on dashboard + public pages — launcher, header with status, bubbles, typing indicator, page-aware suggested prompts, safe markdown, auto-scroll, error + retry, full-screen on phones; hidden on auth/admin/upgrade pages. Verified live on `/blog/study-smarter` (launcher present, no console errors).
- **Results page (C25)**: score hero with readiness band and change since last attempt, instructional-area breakdown (Free: 3 weakest; Pro: all + difficulty), strengths/gaps, next actions linking to practice / role-play / written workspace / coach, question review with filters. Signed-out access redirects to sign-in (verified live). Needs a signed-in test with real results.
