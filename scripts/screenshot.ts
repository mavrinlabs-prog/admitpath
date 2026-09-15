import { chromium } from "@playwright/test";

const pages = [
  "/",
  "/pricing",
  "/sign-in",
  "/sign-up",
  "/blog",
  "/how-it-works",
  "/faq",
  "/for-schools",
];

async function scrollToBottom(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  for (const p of pages) {
    const page = await ctx.newPage();
    const slug = p === "/" ? "home" : p.replace(/^\//,"").replace(/\//g, "-");
    try {
      await page.goto("http://localhost:5556" + p, {
        timeout: 15000,
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(2000);
      // Scroll through the page to trigger scroll-reveal animations
      await scrollToBottom(page);
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `C:/Users/itmoh/screenshots/admitpath/${slug}.png`,
        fullPage: true,
      });
      const text = await page.textContent("body");
      if (
        text?.includes("Something went wrong") ||
        text?.includes("error occurred") ||
        text?.includes("Internal Server Error")
      ) {
        console.log("ERROR ON " + p);
      }
      console.log("OK " + p);
    } catch (e) {
      console.log("FAIL " + p + ": " + e);
    }
    await page.close();
  }

  // Mobile viewport
  const mCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const mPage = await mCtx.newPage();
  try {
    await mPage.goto("http://localhost:5556", {
      timeout: 15000,
      waitUntil: "domcontentloaded",
    });
    await mPage.waitForTimeout(2000);
    await scrollToBottom(mPage);
    await mPage.waitForTimeout(1500);
    await mPage.screenshot({
      path: "C:/Users/itmoh/screenshots/admitpath/mobile-home.png",
      fullPage: true,
    });
    console.log("OK mobile-home");
  } catch (e) {
    console.log("FAIL mobile: " + e);
  }

  await browser.close();
  console.log("DONE");
})();
