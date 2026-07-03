const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await page.waitForTimeout(3000);

  // Check jacket divs directly
  const jackets = await page.$$eval('.jacket', els => els.map(el => ({
    bg: getComputedStyle(el).backgroundImage,
    naturalWidth: (el).naturalWidth || 0,
  })));
  jackets.forEach((j, i) => console.log(`  Jacket ${i+1}: bg=${j.bg.substring(0,80)}...`));

  // Also check if img elements loaded
  const imgLoads = await page.$$eval('.jacket', els => {
    // Create temporary img elements to test loading
    return els.map(el => {
      const bg = getComputedStyle(el).backgroundImage;
      const urlMatch = bg.match(/url\(["']?([^"')]+)["']?\)/);
      return urlMatch ? urlMatch[1].substring(0, 80) : 'no-url';
    });
  });
  console.log('  URLs:', imgLoads);

  await browser.close();
})();
