const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/local-screenshot.png', fullPage: true });
  console.log('Screenshot saved successfully');
  await browser.close();
})();
