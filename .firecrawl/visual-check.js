const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await page.waitForTimeout(2500);

  // Screenshot: initial state (6 fresh cards)
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/01-initial.png' });

  // Ban 1
  let cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
  if (cards.length) await cards[0].click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/02-ban1.png' });

  // Ban 2
  cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
  if (cards.length) await cards[0].click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/03-ban2.png' });

  // Pick 1
  cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
  if (cards.length) await cards[0].click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/04-pick1.png' });

  // Pick 2 - round complete
  cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
  if (cards.length) await cards[0].click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/05-round-done.png' });

  // Play to summary
  let nextBtn = await page.$('.btn-next');
  if (nextBtn) { await nextBtn.click(); await page.waitForTimeout(200); }
  for (let r = 2; r <= 14; r++) {
    for (let i = 0; i < 4; i++) {
      const c = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
      if (c.length) await c[0].click();
      await page.waitForTimeout(80);
    }
    const b = await page.$('.btn-next');
    if (b) { await b.click(); await page.waitForTimeout(120); }
  }
  await page.waitForTimeout(400);
  const finalBtn = await page.$('.btn-next');
  if (finalBtn) { await finalBtn.click(); await page.waitForTimeout(500); }

  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/06-summary.png', fullPage: true });
  console.log('All 6 screenshots saved!');

  await browser.close();
})();
