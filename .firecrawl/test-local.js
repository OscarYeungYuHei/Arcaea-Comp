const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await page.waitForTimeout(3000);

  const title = await page.textContent('.header h1');
  const round = await page.textContent('.round-info');
  const cards = await page.$$eval('.song-card', c => c.length);
  const jackets = await page.$$eval('.jacket', els => els.filter(el => {
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== 'none' && bg.includes('url');
  }).length);

  console.log(`Title: ${title}`);
  console.log(`Round: ${round}`);
  console.log(`Cards: ${cards}`);
  console.log(`Jackets loaded: ${jackets}/6`);

  // Quick game test
  for (let i = 0; i < 4; i++) {
    const c = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
    if (c.length) await c[0].click();
    await page.waitForTimeout(150);
  }
  const banned = await page.$$eval('.song-card.banned', c => c.length);
  const selected = await page.$$eval('.song-card.selected', c => c.length);
  console.log(`Banned: ${banned}, Selected: ${selected}`);
  console.log(banned === 2 && selected === 2 ? '✅ Local jacket test passed!' : '❌ Issue with ban/pick');

  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/local-jacket-test.png', fullPage: true });
  await browser.close();
})();
