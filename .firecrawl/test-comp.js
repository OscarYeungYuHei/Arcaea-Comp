const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Testing Arcaea-Comp-main at localhost:8001...');
  await page.goto('http://localhost:8001', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Check title
  const title = await page.textContent('h1');
  console.log('Title:', title);

  // Check round display
  const roundText = await page.textContent('p');
  console.log('Page content:', roundText?.substring(0, 80));

  // Count cards
  const cards = await page.$$eval('.grid > div', c => c.length);
  console.log('Card wrappers:', cards);

  // Check for images
  const imgs = await page.$$eval('img', els => els.map(el => ({
    src: el.src.substring(0, 80),
    naturalWidth: el.naturalWidth,
    complete: el.complete,
  })));
  console.log('Images found:', imgs.length);
  const loaded = imgs.filter(i => i.naturalWidth > 0).length;
  console.log(`Images loaded: ${loaded}/${imgs.length}`);

  // Try ban/pick flow
  if (imgs.length >= 6) {
    for (let i = 0; i < 4; i++) {
      const clickable = await page.$$('.grid > div > div[class*="cursor-pointer"]:not([class*="cursor-default"])');
      // Try to click the card within each wrapper
      const allCards = await page.$$('.grid > div > div');
      // Filter to clickable ones
      for (const card of allCards) {
        const cls = await card.getAttribute('class');
        if (cls && !cls.includes('cursor-default') && cls.includes('cursor-pointer')) {
          await card.click();
          await page.waitForTimeout(150);
          break;
        }
      }
    }
    await page.waitForTimeout(300);
    const banned = await page.$$eval('img', els =>
      els.filter(el => {
        const parent = el.closest('.grid > div > div');
        return parent && parent.className.includes('cursor-default');
      }).length
    );
    console.log(`Cards with status changed: ${banned}`);
  }

  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/comp-test.png', fullPage: true });
  console.log('Screenshot saved');

  console.log('✅ Test complete');
  await browser.close();
})();
