const { chromium } = require('playwright');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  // Navigate to round 14 by playing through 13 rounds
  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await sleep(1500);

  // Play rounds 1-13
  for (let r = 1; r <= 13; r++) {
    for (let i = 0; i < 4; i++) {
      const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
      if (cards.length > 0) { await cards[0].click(); await sleep(120); }
    }
    const btn = await page.$('.btn-next');
    if (!btn) { console.log(`No next button at round ${r}`); break; }
    const txt = await btn.textContent();
    await btn.click();
    await sleep(200);
  }

  // Now on round 14
  await sleep(500);
  let info = await page.textContent('.round-info');
  console.log('Current:', info.trim());

  // Click 4 cards on round 14
  for (let i = 0; i < 4; i++) {
    const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
    console.log(`  Click ${i+1}: ${cards.length} available cards`);
    if (cards.length > 0) { await cards[0].click(); await sleep(200); }
  }

  await sleep(300);
  // Check what button is showing
  const nextBtn = await page.$('.btn-next');
  if (nextBtn) {
    const txt = await nextBtn.textContent();
    console.log('Button text:', txt.trim());

    // Get the onclick attribute
    const onclick = await nextBtn.getAttribute('onclick');
    console.log('Button onclick:', onclick);
  } else {
    console.log('No .btn-next button found');
  }

  // Check for summary
  const summary = await page.$('.summary-container');
  console.log('Summary visible:', !!summary);

  // Check isComplete state
  const isComplete = await page.evaluate(() => state.isComplete);
  console.log('state.isComplete:', isComplete);
  const isSummary = await page.evaluate(() => state.isSummary);
  console.log('state.isSummary:', isSummary);
  const currentRound = await page.evaluate(() => state.currentRound);
  console.log('state.currentRound:', currentRound);
  const clickCount = await page.evaluate(() => state.clickCount);
  console.log('state.clickCount:', clickCount);

  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/debug-r14.png', fullPage: true });
  console.log('Debug screenshot saved');

  await browser.close();
})();
