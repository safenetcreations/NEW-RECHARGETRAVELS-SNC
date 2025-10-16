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
    const title = await page.title();
    console.log(`Page title: ${title}`);
    const scripts = await page.evaluate(() => Array.from(document.scripts).map(s => s.src || s.textContent?.slice(0, 80)));
    console.log('Scripts on page:', scripts);
    const bodyHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML.slice(0, 500) || 'ROOT_EMPTY');
    console.log(`Root snippet: ${bodyHtml}`);
    const reactKeys = await page.evaluate(async () => {
      const mod = await import('/assets/vendor-react-Bd-P80mk.js');
      return Object.keys(mod);
    });
    console.log('vendor-react keys:', reactKeys.slice(0, 20));
  } finally {
    await browser.close();
  }
})();
