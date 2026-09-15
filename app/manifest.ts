import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AdmitPath -- AI College Admissions Counseling",
    short_name: "AdmitPath",
    description:
      "College admissions counseling: 7-dimension profile scoring, line-level essay feedback, college list builder, and a prioritized action plan.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    // DL brand colors: primary #4A6FA5 (slate blue), background #D5DCE8 (cool blue-grey)
    background_color: "#D5DCE8",
    theme_color: "#4A6FA5",
    lang: "en-US",
    dir: "ltr",
    orientation: "portrait-primary",
    prefer_related_applications: false,
    icons: [
      // All four endpoints are dynamically rendered via next/og
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "maskable" },
      { src: "/icon1", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon1", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon2", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon2", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["education", "productivity"],
    shortcuts: [
      { name: "Dashboard", short_name: "Home", url: "/dashboard", description: "Open your AdmitPath dashboard", icons: [{ src: "/icon", sizes: "32x32" }] },
      { name: "Run Analysis", short_name: "Analyze", url: "/analyze", description: "Score your profile across 7 dimensions", icons: [{ src: "/icon", sizes: "32x32" }] },
      { name: "Essay Feedback", short_name: "Essays", url: "/essays", description: "Get line-level essay feedback", icons: [{ src: "/icon", sizes: "32x32" }] },
      { name: "College List", short_name: "Colleges", url: "/colleges", description: "Manage your college list", icons: [{ src: "/icon", sizes: "32x32" }] },
      { name: "AI Counselor", short_name: "Chat", url: "/chat", description: "Chat with your AI counselor", icons: [{ src: "/icon", sizes: "32x32" }] },
    ],
    screenshots: [
      {
        src: "/api/og",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
    related_applications: [],
  } as const;
}
