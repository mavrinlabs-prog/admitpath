import type { MetadataRoute } from "next";
import { answerEngineRules, blockedScraperRules } from "@/lib/ai-crawlers";
import { getPublicAppUrl } from "@/lib/site-url";

const PRIVATE_PATHS = [
  "/api/",
  "/admin/",
  "/analyze",
  "/billing",
  "/chat",
  "/dashboard",
  "/essays",
  "/interview-practice",
  "/money",
  "/offers/orders",
  "/offers/success",
  "/profile/",
  "/settings",
  "/sign-in",
  "/sign-up",
  "/start-trial",
  "/tracker",
  "/unsubscribed",
];

export default function robots(): MetadataRoute.Robots {
  const base = getPublicAppUrl();

  return {
    rules: [
      ...answerEngineRules(PRIVATE_PATHS),
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      ...blockedScraperRules(),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
