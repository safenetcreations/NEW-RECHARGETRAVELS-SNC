import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', (msg) => {
    console.log(`[browser:${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    console.log(`[pageerror] ${err.message}\n${err.stack}`);
  });

  try {
    await page.goto('http://127.0.0.1:4173/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const body = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'ROOT_EMPTY');
    console.log(body.slice(0, 500));
  } finally {
    await browser.close();
  }
})();
