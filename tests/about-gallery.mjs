import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: process.env.DOUYIN_BROWSER_EXECUTABLE || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const videoRequests = [];
  page.on('request', request => {
    if (/recently-\d+\.mp4/.test(request.url())) videoRequests.push(request.url());
  });
  await page.route('**/api/**', route => route.abort());
  await page.goto(`${process.env.ABOUT_TEST_URL || 'http://127.0.0.1:3000'}/about`);
  await page.addStyleTag({ content: 'nextjs-portal { display:none!important }' });
  await page.waitForFunction(() => document.body.style.overflow === 'auto');
  const section = page.getByRole('region', { name: '最新动态', exact: true });
  const viewer = page.getByRole('dialog');

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const grid = section.locator('[aria-hidden="false"] [data-update-gallery]:visible');
    const tiles = grid.locator('button');
    assert.equal(await tiles.count(), 9);
    assert.equal(await grid.locator('svg').count(), 2, 'last two items must be identified as videos');
    assert.equal(await grid.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
    const tileBoxes = await tiles.evaluateAll(buttons => buttons.map(button => {
      const box = button.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    }));
    for (let i = 0; i < 9; i++) {
      assert.ok(tileBoxes[i].width >= 44 && tileBoxes[i].height >= 44);
      assert.equal(tileBoxes[i].y, tileBoxes[Math.floor(i / 3) * 3].y);
      assert.equal(tileBoxes[i].x, tileBoxes[i % 3].x);
    }
    if (width === 1440) assert.equal(videoRequests.length, 0, 'grid should not preload video files');
    const before = await section.getByRole('button', { name: 'Next update', exact: true }).boundingBox();
    const scrollBefore = await page.evaluate(() => scrollY);
    await tiles.nth(2).click();
    await viewer.waitFor();
    assert.equal(await viewer.locator('[data-gallery-counter]').innerText(), '03 / 09');
    assert.equal(await viewer.locator('img').evaluate(image => getComputedStyle(image).objectFit), 'contain');
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    assert.equal(await viewer.locator('video').count(), 0);
    await viewer.screenshot({ path: `/tmp/luoxueer-gallery-viewer-${width}.png` });
    await page.keyboard.press('ArrowRight');
    assert.equal(await viewer.locator('[data-gallery-counter]').innerText(), '04 / 09');
    await viewer.getByRole('button', { name: '上一项', exact: true }).click();
    assert.equal(await viewer.locator('[data-gallery-counter]').innerText(), '03 / 09');

    if (width === 390) {
      const image = viewer.locator('img');
      await image.dispatchEvent('touchstart', { touches: [{ identifier: 1, clientX: 280, clientY: 300 }] });
      await image.dispatchEvent('touchend', { changedTouches: [{ identifier: 1, clientX: 80, clientY: 310 }] });
      assert.equal(await viewer.locator('[data-gallery-counter]').innerText(), '04 / 09');
    }
    await page.keyboard.press('Escape');
    assert.equal(await viewer.count(), 0);
    assert.equal(await tiles.nth(2).evaluate(button => document.activeElement === button), true, 'closing should return focus to clicked tile');
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'auto');
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - scrollBefore) < 2, 'closing should not move the page');

    for (const [index, seconds] of [[7, 18], [8, 5]]) {
      await tiles.nth(index).click();
      const video = viewer.locator('video');
      await page.waitForFunction(() => document.querySelector('[data-update-viewer] video')?.readyState >= 2);
      assert.equal(await video.getAttribute('playsinline'), '');
      assert.equal(await video.getAttribute('controls'), '');
      assert.equal(await video.getAttribute('autoplay'), null);
      assert.ok(Math.abs(await video.evaluate(video => video.duration) - seconds) < 1);
      await video.evaluate(video => video.play());
      await page.waitForFunction(() => document.querySelector('[data-update-viewer] video')?.currentTime > 0.1);
      const playingVideo = await video.elementHandle();
      if (index === 7) {
        await viewer.getByRole('button', { name: '下一项', exact: true }).click();
        assert.equal(await playingVideo.evaluate(video => video.paused), true, 'moving between videos must stop the previous sound');
      }
      await viewer.getByRole('button', { name: '关闭图集', exact: true }).click();
      assert.equal(await playingVideo.evaluate(video => video.paused), true, 'closing must pause even a detached video element');
      assert.equal(await page.locator('[data-update-viewer] video').count(), 0, 'closing must remove the playing video');
    }
    assert.deepEqual(await section.getByRole('button', { name: 'Next update', exact: true }).boundingBox(), before);
    for (const [postIndex, count, filename] of [[1, 2, 'summer-announcement'], [3, 3, 'mask']]) {
      const select = width >= 1024 ? section.locator('nav button').nth(postIndex)
        : section.getByRole('button', { name: `最新动态 ${String(postIndex + 1).padStart(2, '0')}`, exact: true });
      await select.click();
      assert.equal(await tiles.count(), count, 'every original album should include all its images');
      const photos = await tiles.evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().y));
      assert.ok(photos.every(y => Math.abs(y - photos[0]) < 1), 'small albums should use one complete row');
      await tiles.last().click();
      assert.equal(await viewer.locator('[data-gallery-counter]').innerText(), `${String(count).padStart(2, '0')} / ${String(count).padStart(2, '0')}`);
      assert.ok(decodeURIComponent(await viewer.locator('img').getAttribute('src')).includes(`${filename}-${count}.webp`), 'viewer must preserve original photo order');
      assert.equal(await viewer.getByRole('button', { name: '下一项', exact: true }).isDisabled(), true);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(550);
      await section.screenshot({ path: `/tmp/luoxueer-gallery-${filename}-${width}.png` });
    }
    await (width >= 1024 ? section.locator('nav button').nth(0)
      : section.getByRole('button', { name: '最新动态 01', exact: true })).click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await section.screenshot({ path: `/tmp/luoxueer-gallery-${width}.png` });
    console.log(`${width}px: all 9/2/3-item original albums, keyboard/swipe, focus/scroll restoration, video playback/cleanup and fixed navigation passed.`);
  }

  // A failed local video still gives a route back to the original post.
  await page.route('**/recently-8.mp4', route => route.abort());
  await section.locator('[data-update-gallery]:visible button').nth(7).click();
  await viewer.getByRole('status').waitFor();
  assert.match(await viewer.getByRole('link', { name: '查看原动态', exact: true }).getAttribute('href'), /5361134813317774$/);
  await page.keyboard.press('Escape');
} finally {
  await browser.close();
}
