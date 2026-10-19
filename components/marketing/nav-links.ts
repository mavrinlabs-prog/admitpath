/**
 * Single source of truth for marketing navigation so the landing nav, the
 * shared MarketingNav, the mobile drawer, and the footer never drift.
 * Audience pages that exist for this college-admissions app: students,
 * parents, international students, schools/districts, counselors. (There
 * are no homeschool / special-ed / ELL / tutor pages in AdmitPath.)
 */
export const AUDIENCE_LINKS = [
  { href: "/for/students", label: "Students" },
  { href: "/for/parents", label: "Parents" },
  { href: "/for/international", label: "International students" },
  { href: "/for-schools", label: "Schools & districts" },
  { href: "/for-counselors", label: "Counselors" },
] as const;

export const PRIMARY_NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-schools", label: "For schools" },
  { href: "/for-counselors", label: "For counselors" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
] as const;
