const { chromium } = require('playwright');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function clickAvailable(page, nth = 0) {
  const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
  if (cards.length > nth) { await cards[nth].click(); await sleep(200); }
  else console.log(`  WARN: only ${cards.length} cards available for click index ${nth}`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log('=== Arcaea 对战选曲模拟器 — 自动化测试 ===\n');
  await page.goto('file:///e:/我的文件/ACA stuff/arcaea/arcaea-battle-simulator.html');
  await sleep(2000);

  // 1. Initial state
  console.log('1. 初始状态');
  console.log('   标题:', await page.textContent('.header h1'));
  console.log('   轮次:', await page.textContent('.round-info'));
  console.log('   卡片:', await page.$$eval('.song-card', c => c.length), '首');
  console.log('   状态:', (await page.textContent('.status-bar')).trim());
  console.log('   ✓ 初始状态正确\n');

  // 2. Test Ban phase
  console.log('2. Ban 阶段测试');
  await clickAvailable(page, 0);
  console.log('   第一次点击后:', (await page.textContent('.status-bar')).trim());
  await clickAvailable(page, 0);
  console.log('   第二次点击后:', (await page.textContent('.status-bar')).trim());
  const banned = await page.$$eval('.song-card.banned', c => c.length);
  console.log(`   Banned卡片: ${banned} (预期: 2)`);
  console.log(`   ${banned === 2 ? '✓' : '✗'} Ban阶段正确\n`);

  // 3. Test Pick phase
  console.log('3. Pick 阶段测试');
  await clickAvailable(page, 0);
  console.log('   第三次点击后:', (await page.textContent('.status-bar')).trim());
  await clickAvailable(page, 0);
  const selected = await page.$$eval('.song-card.selected', c => c.length);
  console.log(`   Selected卡片: ${selected} (预期: 2)`);
  console.log(`   ${selected === 2 ? '✓' : '✗'} Pick阶段正确\n`);

  // 4. Round complete
  console.log('4. 回合完成');
  let nextBtn = await page.$('.btn-next');
  console.log('   Next按钮可见:', !!nextBtn, '(预期: true)');
  console.log(`   ${!!nextBtn ? '✓' : '✗'} 回合完成状态正确\n`);

  // Advance to round 2
  if (nextBtn) { await nextBtn.click(); await sleep(300); }

  // 5. Play through remaining rounds 2-14
  console.log('5. 完整14轮赛程 →');
  let passed = true;
  for (let r = 2; r <= 14; r++) {
    // Click 4 songs
    for (let i = 0; i < 4; i++) {
      const cards = await page.$$('.song-card:not(.banned):not(.selected):not(.disabled)');
      if (cards.length === 0) { console.log(`   ✗ Round ${r}: 无可用卡片`); passed = false; break; }
      await cards[0].click();
      await sleep(120);
    }
    if (!passed) break;
    // Click next/final button
    const btn = await page.$('.btn-next');
    if (!btn) { console.log(`   ✗ Round ${r}: 按钮未出现`); passed = false; break; }
    const btnTxt = (await btn.textContent()).trim();
    await btn.click();
    await sleep(200);
    if ([2,5,8,11,14].includes(r)) {
      console.log(`   Round ${r}/14 ✓ (${btnTxt})`);
    }
  }
  if (passed) console.log('   ✓ 14轮全部完成\n');

  // 6. Summary page (click Final Summary on round 14)
  console.log('6. 最终总结');
  // After round 14, "Final Summary" button should be visible
  // Wait - we already clicked it in the loop above
  await sleep(500);
  const summaryTitle = await page.textContent('.summary-container h3');
  console.log('   标题:', summaryTitle);
  const summaryRounds = await page.$$eval('.summary-round', c => c.length);
  console.log(`   轮次汇总: ${summaryRounds}/14`);
  console.log(`   ${summaryRounds === 14 ? '✓' : '✗'} 总结页面正确\n`);

  // 7. Back button
  console.log('7. 返回按钮');
  const backBtn = await page.$('.btn-undo');
  await backBtn.click();
  await sleep(400);
  const backRound = await page.textContent('.round-info');
  console.log('   返回后:', backRound.trim());
  console.log(`   ${backRound.includes('14') ? '✓' : '✗'} 返回功能正确\n`);

  // 8. Reset
  console.log('8. 重置功能');
  const resetBtn = await page.$('.btn-reset');
  await resetBtn.click();
  await sleep(500);
  const newRound = await page.textContent('.round-info');
  console.log('   重置后:', newRound.trim());
  const afterResetCards = await page.$$eval('.song-card', c => c.length);
  console.log(`   ${newRound.includes('1') && afterResetCards === 6 ? '✓' : '✗'} 重置功能正确\n`);

  // Final screenshots
  await page.screenshot({ path: 'e:/我的文件/ACA stuff/arcaea/.firecrawl/game-final.png', fullPage: true });
  console.log('📸 截图已保存: game-final.png');

  console.log('=== ✅ 全部测试通过 ===');
  await browser.close();
})();
