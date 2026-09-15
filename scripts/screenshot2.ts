import { chromium } from "@playwright/test";

const pages = [
  "/sign-in",
  "/sign-up",
  "/blog",
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  for (const p of pages) {
    const page = await ctx.newPage();
    const slug = p.replace(/\//g, "-");
    try {
      await page.goto("http://localhost:5555" + p, {
        timeout: 15000,
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(3000);
      await page.screenshot({
        path: `C:/Users/itmoh/screenshots/admitpath${slug}.png`,
        fullPage: true,
      });
      console.log("OK " + p);
    } catch (e) {
      console.log("FAIL " + p + ": " + e);
    }
    await page.close();
  }

  await browser.close();
  console.log("DONE");
})();
