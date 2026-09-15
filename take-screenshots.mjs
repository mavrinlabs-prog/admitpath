import { chromium } from '@playwright/test';
const pages = [
  { url: 'http://localhost:5555/', name: 'admitpath-landing' },
  { url: 'http://localhost:5555/pricing', name: 'admitpath-pricing' },
  { url: 'http://localhost:3002/', name: 'worksheetgen-landing' },
  { url: 'http://localhost:3002/pricing', name: 'worksheetgen-pricing' },
  { url: 'http://localhost:3005/', name: 'competeai-landing' },
  { url: 'http://localhost:3003/', name: 'cognify-landing' },
];
const browser = await chromium.launch({ headless: true });
for (const p of pages) {
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(p.url, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const path = `C:/Users/itmoh/admitpath/${p.name}.png`;
    await page.screenshot({ path, fullPage: false });
    console.log(`OK: ${p.name} => ${path}`);
    await ctx.close();
  } catch (e) {
    console.log(`FAIL: ${p.name} - ${e.message.substring(0, 120)}`);
  }
}
await browser.close();
