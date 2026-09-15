/**
 * 404 page. Anthropic-restraint pattern: hairline-bordered card, no shadow,
 * single editorial headline, three plain text-link redirects.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Error404 } from "@/components/illustrations/Error404";
import { COLLEGES } from "@/data/colleges";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page doesn't exist on AdmitPath. Try one of the suggested routes instead.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}
    >
      <div
        className="animate-fade-in-up w-full max-w-md rounded-2xl border p-8 sm:p-10"
        style={{
          borderColor: "rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.45)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="mx-auto mb-6 flex items-center justify-center"
          style={{ color: "#4A6FA5" }}
        >
          <Error404 size={120} />
        </div>

        <p
          className="mb-6 text-[11px] font-medium uppercase"
          style={{
            letterSpacing: "0.08em",
            color: "var(--dl-text-muted, #5A6275)",
            fontFamily: "var(--font-inter)",
          }}
        >
          404 · Not found
        </p>

        <h1
          className="mb-4 text-2xl sm:text-3xl"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            color: "var(--dl-text-primary, #1B2030)",
          }}
        >
          This page doesn&apos;t exist &mdash; but your dream school does.
        </h1>

        <p
          className="mb-8 text-base leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", color: "var(--dl-text-secondary, #454B5E)" }}
        >
          Let&apos;s get you back on track. Here are the places that matter:
        </p>

        <ul className="mb-8 space-y-3">
          <li>
            <Link
              href="/"
              className="text-base nav-link"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              ← Home
            </Link>
          </li>
          <li>
            <Link
              href="/quiz"
              className="text-base nav-link"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Take the 5-question chances quiz
            </Link>
          </li>
          <li>
            <Link
              href="/college"
              className="text-base nav-link"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Browse {COLLEGES.length} college admissions stats
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-base nav-link"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Read the blog
            </Link>
          </li>
          <li>
            <Link
              href="/pricing"
              className="text-base nav-link"
              style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
            >
              Pricing
            </Link>
          </li>
        </ul>

        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--dl-text-muted, #5A6275)", fontFamily: "var(--font-inter)" }}
        >
          If you think this is a bug, email{" "}
          <a
            href="mailto:maestro.committee@gmail.com"
            className="underline"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            maestro.committee@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
