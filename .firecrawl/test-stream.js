const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Loading streaming version...');
  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await page.waitForTimeout(3000);

  // Check basic state
  console.log('Title:', await page.textContent('.header h1'));
  console.log('Round:', await page.textContent('.round-info'));
  console.log('Cards:', await page.$$eval('.song-card', c => c.length));

  // Check if jacket images loaded
  const jackets = await page.$$eval('.jacket', els => els.filter(el => {
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== 'none' && bg.includes('url');
  }).length);
  console.log('Jackets with images:', jackets);

  // Screenshot initial state
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/stream-initial.png' });
  console.log('Initial screenshot saved');

  // Ban 2 songs and take screenshot
  for (let i = 0; i < 2; i++) {
    const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
    if (cards.length) await cards[0].click();
    await page.waitForTimeout(200);
  }
  console.log('2 songs banned');

  // Pick 2 songs
  for (let i = 0; i < 2; i++) {
    const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
    if (cards.length) await cards[0].click();
    await page.waitForTimeout(200);
  }
  console.log('2 songs selected, round complete');

  // Click Next Round to advance from round 1
  let nextBtn = await page.$('.btn-next');
  if (nextBtn) { await nextBtn.click(); await page.waitForTimeout(300); }
  console.log('Advanced to round 2');

  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/stream-round-done.png' });
  console.log('Round complete screenshot saved');

  // Play through rounds 2-14
  for (let r = 2; r <= 14; r++) {
    for (let i = 0; i < 4; i++) {
      const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
      if (cards.length) await cards[0].click();
      await page.waitForTimeout(80);
    }
    const btn = await page.$('.btn-next');
    if (btn) { await btn.click(); await page.waitForTimeout(150); }
  }
  // Click Final Summary
  await page.waitForTimeout(300);
  const finalBtn = await page.$('.btn-next');
  if (finalBtn) { await finalBtn.click(); await page.waitForTimeout(500); }

  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/stream-summary.png' });
  console.log('Summary screenshot saved');

  // Verify summary
  const rounds = await page.$$eval('.summary-round', c => c.length);
  console.log('Summary rounds:', rounds);
  console.log(rounds === 14 ? '✅ All tests passed!' : '❌ Round count mismatch');

  await browser.close();
})();
