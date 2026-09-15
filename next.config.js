/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  webpack(config) {
    config.cache = false;
    // Redirect @clerk/nextjs imports to Google OAuth shims.
    // Use Object.assign to preserve Next.js internal aliases
    // (replacing the alias object entirely breaks private-next-pages resolution).
    config.resolve = config.resolve || {};
    config.resolve.symlinks = false;
    config.resolve.alias = config.resolve.alias || {};
    Object.assign(config.resolve.alias, {
      "@clerk/nextjs/server": path.resolve(process.cwd(), "lib/clerk-shim-server.ts"),
      "@clerk/nextjs": path.resolve(process.cwd(), "lib/clerk-shim-client.tsx"),
    });
    return config;
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // pdf-parse loads a native canvas binding at runtime. Keeping both packages
  // external ensures Vercel traces the binding into the Node function bundle
  // instead of leaving pdfjs with missing DOMMatrix/ImageData polyfills.
  serverExternalPackages: ["@prisma/client", "prisma", "lenis", "pdf-parse", "@napi-rs/canvas"],
  outputFileTracingIncludes: {
    // @napi-rs/canvas selects its platform package dynamically. NFT cannot
    // infer that branch, so explicitly include the Linux binaries used by
    // Vercel Functions. The direct import in resume-file-extraction.ts keeps
    // the package itself in the trace as well.
    "/api/profile/extract-file": [
      "./node_modules/@napi-rs/canvas/**/*",
      "./node_modules/@napi-rs/canvas-linux-x64-gnu/**/*",
      "./node_modules/@napi-rs/canvas-linux-x64-musl/**/*",
      // pdfjs starts a "fake" worker through a dynamic import in Node. Keep
      // that worker and the document resources needed by real-world resumes.
      "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
      "./node_modules/pdfjs-dist/standard_fonts/**/*",
      "./node_modules/pdfjs-dist/cmaps/**/*",
      "./node_modules/pdfjs-dist/wasm/**/*",
    ],
  },
  experimental: {
    // Tree-shake big icon/animation packages aggressively. Without this,
    // lucide re-exports its full ~400-icon barrel into every client bundle
    // (~30-50 KB of dead code per page). framer-motion gets the same treatment.
    optimizePackageImports: ["lucide-react", "recharts", "date-fns", "framer-motion"],
  },

  // ---------------------------------------------------------------------------
  // Image optimization
  // ---------------------------------------------------------------------------
  images: {
    remotePatterns: [
      // Google user avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Company logos via Clearbit (college logos in match cards)
      { protocol: "https", hostname: "logo.clearbit.com" },
      // College logo fallbacks from Wikipedia/Wikimedia
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Vercel blob storage (user uploads, OG images)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    // Limit on-demand image sizes to prevent abuse
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // ---------------------------------------------------------------------------
  // Redirects (old/moved pages)
  // ---------------------------------------------------------------------------
  async redirects() {
    return [
      // Serve dynamic icon for /favicon.ico requests
      { source: "/favicon.ico", destination: "/icon", permanent: true },
      // Old onboarding path
      { source: "/onboard", destination: "/profile/create", permanent: true },
      // /app was the old authenticated root
      { source: "/app", destination: "/dashboard", permanent: true },
      // Admissions worksheets were renamed to tools.
      { source: "/worksheets/common-app-essay-brainstorm/:path*", destination: "/college-essay-topic-finder", permanent: true },
      { source: "/worksheets/college-list-generator/:path*", destination: "/college-list-builder", permanent: true },
      { source: "/worksheets/activities-list-compressor/:path*", destination: "/tools/activities-optimizer", permanent: true },
      { source: "/worksheets/supplemental-essay-strategist/:path*", destination: "/essays", permanent: true },
      { source: "/worksheets/resume-architect/:path*", destination: "/profile/create", permanent: true },
      { source: "/worksheets/four-year-academic-plan/:path*", destination: "/analyze", permanent: true },
      { source: "/worksheets/activity-portfolio-audit/:path*", destination: "/analyze", permanent: true },
      { source: "/worksheets/summer-program-match/:path*", destination: "/summer", permanent: true },
      { source: "/worksheets/major-exploration-map/:path*", destination: "/choose-a-major", permanent: true },
      { source: "/worksheets/test-strategy-calculator/:path*", destination: "/test-optional-schools-2026", permanent: true },
      { source: "/worksheets/letter-of-rec-strategy/:path*", destination: "/analyze", permanent: true },
      { source: "/worksheets/decision-day-analyzer/:path*", destination: "/decision-matrix", permanent: true },
      { source: "/worksheets", destination: "/tools", permanent: true },
      { source: "/worksheets/:path*", destination: "/tools", permanent: true },
      // Trailing-slash normalization for key pages
      { source: "/dashboard/", destination: "/dashboard", permanent: true },
      { source: "/billing/", destination: "/billing", permanent: true },
    ];
  },

  // ---------------------------------------------------------------------------
  // Security + performance headers
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        // Security headers on all routes
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // DENY (not SAMEORIGIN) to align with CSP `frame-ancestors 'none'` --
          // when the two disagree CSP wins in modern browsers, but legacy
          // browsers fall back to X-Frame-Options. Make them say the same thing.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Prevent browsers from MIME-sniffing away from declared content-type
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
      {
        // Long-cache for generated icons and OG images. Includes the
        // PWA-specific /icon1 (192) and /icon2 (512) routes added in
        // app/icon1.tsx + app/icon2.tsx -- without them in the source
        // pattern, every install prompt would re-render via next/og.
        source: "/(icon|icon1|icon2|apple-icon|api/og)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Cache font files aggressively (they never change once deployed)
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // API routes: prevent caching of authenticated data
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
