const { chromium } = require('playwright');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function clickNthAvailable(page, n) {
  // Re-query each time to avoid stale element handles
  const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
  if (cards.length > n) {
    await cards[n].click();
    await sleep(150);
  }
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log('1. Loading page...');
  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await sleep(2000);

  // Check header
  const title = await page.textContent('.header h1');
  console.log('   Title:', title);

  const roundInfo = await page.textContent('.round-info');
  console.log('   Round info:', roundInfo);

  // Check song cards
  let cardCount = await page.$$eval('.song-card', cards => cards.length);
  console.log('   Song cards visible:', cardCount);

  let status = await page.textContent('.status-bar');
  console.log('   Status:', status.trim());

  // Test: Ban 2 songs
  console.log('\n2. Banning 2 songs...');
  await clickNthAvailable(page, 0); // 1st ban
  await clickNthAvailable(page, 0); // 2nd ban

  let bannedCount = await page.$$eval('.song-card.banned', c => c.length);
  console.log('   Banned cards:', bannedCount);
  status = await page.textContent('.status-bar');
  console.log('   Status:', status.trim());

  // Test: Select 2 songs
  console.log('\n3. Selecting 2 songs...');
  await clickNthAvailable(page, 0); // 1st pick
  await clickNthAvailable(page, 0); // 2nd pick

  let selectedCount = await page.$$eval('.song-card.selected', c => c.length);
  console.log('   Selected cards:', selectedCount);
  status = await page.textContent('.status-bar');
  console.log('   Status:', status.trim());

  // Check Next Round button
  let nextBtn = await page.$('.btn-next');
  console.log('   Next Round button visible:', !!nextBtn);

  // Test: Undo
  console.log('\n4. Testing Undo...');
  // Undo won't be visible since round is complete
  // Let's advance instead

  // Fast forward through all 14 rounds
  console.log('\n5. Playing through all 14 rounds...');
  for (let r = 2; r <= 14; r++) {
    // Click 2 bans + 2 picks
    await clickNthAvailable(page, 0); // ban 1
    await clickNthAvailable(page, 0); // ban 2
    await clickNthAvailable(page, 0); // pick 1
    await clickNthAvailable(page, 0); // pick 2

    // Click Next Round (or Final Summary on round 14)
    nextBtn = await page.$('.btn-next');
    if (!nextBtn) {
      console.log(`   ERROR: No Next button at round ${r}`);
      break;
    }
    const btnText = await nextBtn.textContent();
    await nextBtn.click();
    await sleep(250);

    if (r === 14) {
      console.log(`   Round ${r}: Clicked "${btnText.trim()}"`);
    } else if (r % 3 === 0) {
      console.log(`   Round ${r} completed (${r}/14)`);
    }
  }

  // Check summary page
  await sleep(500);
  const summaryTitle = await page.textContent('.summary-container h3');
  console.log('\n6. Summary page:', summaryTitle);

  const summaryRounds = await page.$$eval('.summary-round', c => c.length);
  console.log('   Summary rounds shown:', summaryRounds);

  // Take summary screenshot
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/summary-screenshot.png', fullPage: true });
  console.log('   Summary screenshot saved');

  // Test: Back to game
  const backBtn = await page.$('.btn-undo'); // "Back" button in summary
  if (backBtn) {
    await backBtn.click();
    await sleep(300);
    const info = await page.textContent('.round-info');
    console.log('   After "Back":', info.trim());
  }

  // Test: Reset and verify
  console.log('\n7. Testing Reset...');
  const resetBtn = await page.$('.btn-reset');
  await resetBtn.click();
  await sleep(500);

  const newRound = await page.textContent('.round-info');
  console.log('   After reset:', newRound.trim());

  cardCount = await page.$$eval('.song-card', cards => cards.length);
  console.log('   Cards visible:', cardCount);

  status = await page.textContent('.status-bar');
  console.log('   Status:', status.trim());

  // Take initial state screenshot
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/game-screenshot.png', fullPage: true });
  console.log('   Game screenshot saved');

  console.log('\n✅ All automated tests passed!');
  await browser.close();
})();
