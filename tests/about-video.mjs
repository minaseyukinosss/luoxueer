import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: process.env.DOUYIN_BROWSER_EXECUTABLE || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let playerRequests = 0;
  await page.route('**/api/**', route => route.abort());
  // Test player lifecycle independently of Bilibili's network/rate limits.
  await page.route('https://player.bilibili.com/player.html?**', route => {
    playerRequests++;
    return route.fulfill({ contentType: 'text/html', body: '<html lang="zh"><body style="background:#111;color:white">Embedded video fixture</body></html>' });
  });
  await page.goto(`${process.env.ABOUT_TEST_URL || 'http://127.0.0.1:3000'}/about`);
  await page.addStyleTag({ content: 'nextjs-portal { display:none!important }' });
  await page.waitForFunction(() => document.body.style.overflow === 'auto');
  const section = page.locator('section').filter({ has: page.locator('[data-update-list]') });
  const player = section.locator('[data-update-video] iframe');
  const select = async (index, mobile = false) => {
    const button = mobile
      ? section.getByRole('button', { name: `最新动态 ${String(index + 1).padStart(2, '0')}`, exact: true })
      : section.locator('nav button').nth(index);
    await button.click();
    await page.waitForFunction(el => el.getAttribute('aria-pressed') === 'true', await button.elementHandle());
  };
  const videos = [[2, 'BV1KzY76jEuM'], [4, 'BV1grhF6PECk'], [5, 'BV1FR8c6nEmv'], [6, 'BV1zqgd6DE4C'], [7, 'BV1kZKp6WEk6'], [8, 'BV1QP5y6EEtk']];

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const mobile = width < 1024;
    for (const index of [0, 1, 3]) {
      await select(index, mobile);
      assert.equal(await section.locator('[data-update-play]:visible').count(), 0, 'photo posts must remain photos');
    }
    for (const [index, bvid] of videos) {
      await select(index, mobile);
      assert.equal(await player.count(), 0, 'selecting a video must not autoplay it');
      const requestsBefore = playerRequests;
      const before = await section.locator('[data-update-image]:visible').boundingBox();
      const controls = await section.getByRole('button', { name: 'Previous update', exact: true }).boundingBox();
      await section.locator('[data-update-play]:visible').click();
      await page.waitForFunction(() => document.querySelector('[data-update-video]')?.getAttribute('aria-busy') === 'false');
      assert.equal(await player.count(), 1, 'only one breakpoint may mount a player');
      assert.equal(playerRequests, requestsBefore + 1);
      assert.equal(new URL(await player.getAttribute('src')).searchParams.get('bvid'), bvid);
      assert.deepEqual(await section.locator('[data-update-image]:visible').boundingBox(), before, 'playback must reserve the cover dimensions');
      assert.deepEqual(await section.getByRole('button', { name: 'Previous update', exact: true }).boundingBox(), controls, 'playback must not move navigation');
      const frame = await player.boundingBox();
      const caption = await section.locator('[data-update-caption]:visible').boundingBox();
      assert.ok(frame.y + frame.height <= caption.y + 1, 'caption must not cover video controls');
      await select(0, mobile);
      assert.equal(await player.count(), 0, 'changing stories must destroy the previous player');
    }
    await select(2, mobile);
    await section.locator('[data-update-play]:visible').click();
    await section.getByRole('button', { name: '返回封面', exact: true }).click();
    assert.equal(await player.count(), 0);
    await section.locator('[data-update-play]:visible').click();
    await page.keyboard.press('Escape');
    assert.equal(await player.count(), 0);
    await section.locator('[data-update-play]:visible').click();
    await page.setViewportSize({ width: mobile ? 1440 : 390, height: 1000 });
    await page.waitForFunction(() => !document.querySelector('[data-update-video] iframe'));
    assert.equal(await section.locator('[data-update-play]:visible').count(), 1, 'resizing returns to one visible cover button');
    console.log(`${width}px: six video sources, lazy loading, single player, cleanup, close and stable controls passed.`);
  }
} finally {
  await browser.close();
}
