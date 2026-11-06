import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Run against a local dev/production server: ABOUT_TEST_URL=http://127.0.0.1:3000 pnpm test:about-scroll
const browser = await chromium.launch({ executablePath: process.env.DOUYIN_BROWSER_EXECUTABLE || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route('**/api/**', route => route.abort());
  await page.goto(`${process.env.ABOUT_TEST_URL || 'http://127.0.0.1:3000'}/about`);
  // Next's development toolbar otherwise covers the first mobile pager at some sizes.
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  const section = page.getByRole('region', { name: '最新动态', exact: true });
  const canvas = section.locator('.w-screen');
  await section.waitFor();
  await page.waitForFunction(() => document.body.style.overflow === 'auto');
  const titles = ['近况影像', '盛夏的我们', '学功夫练武术！', '面具之下', '杳无音讯', '我保证你是天使', '半壶纱', '恶魔未必有我坏', '好好告个别'];
  const weiboTitles = new Set(['近况影像', '盛夏的我们', '面具之下']);

  for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await section.scrollIntoViewIfNeeded();
    const bounds = await canvas.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { height: rect.height, left: rect.left, right: rect.right };
    });
    const height = bounds.height;
    const bottomGap = await section.evaluate(el => document.documentElement.scrollHeight - (el.getBoundingClientRect().bottom + scrollY));
    assert.ok(Math.abs(bottomGap) < 2, `background should reach page bottom, got ${bottomGap}px gap`);
    assert.ok(Math.abs(bounds.left) < 2 && Math.abs(bounds.right - viewport.width) < 2, 'section background should reach both viewport edges');
    assert.ok(height < (viewport.width > 1024 ? 760 : 1100), `module should be compact, got ${height}px`);
    assert.equal(await section.locator('*').evaluateAll(nodes => nodes.some(el => getComputedStyle(el).position === 'sticky')), false);

    for (const index of [...titles.keys(), 0]) {
      const title = titles[index];
      const button = viewport.width >= 1024
        ? section.locator('nav button').nth(index)
        : section.getByRole('button', { name: `最新动态 ${String(index + 1).padStart(2, '0')}`, exact: true });
      await button.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      const before = await page.evaluate(() => scrollY);
      const controlsBefore = await section.getByRole('button').evaluateAll(buttons => buttons.filter(button => !button.closest('.overflow-x-auto') && !button.hasAttribute('data-update-play') && !button.hasAttribute('data-update-photo')).map(button => {
        const rect = button.getBoundingClientRect();
        return { label: button.getAttribute('aria-label'), x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }));
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await section.getByRole('heading', { level: 3 }).innerText(), title);
      assert.doesNotMatch(await section.locator('[data-update-caption]:visible').innerText(), /20\d{2}[.-]\d{2}[.-]\d{2}/, 'title paper should not repeat the date');
      if (viewport.width >= 1024) {
        assert.match((await button.locator('time').innerText()).trim(), /^20\d{2}\.\d{2}\.\d{2}$/);
        assert.match(await button.locator('time').getAttribute('datetime'), /^20\d{2}-\d{2}-\d{2}$/);
        assert.equal((await section.locator('[data-update-counter]').innerText()).replace(/\s/g, ''), `${String(index + 1).padStart(2, '0')}/09`);
      }
      assert.equal(await section.locator('[aria-hidden="false"] img').filter({ visible: true }).first().getAttribute('alt'), title);
      const source = section.getByRole('link', { name: `${weiboTitles.has(title) ? '查看原动态' : '观看原视频'}：${title}`, exact: true });
      assert.match(await source.getAttribute('href'), weiboTitles.has(title) ? /^https:\/\/weibo\.com\/6106700809\/\d+$/ : /^https:\/\/www\.bilibili\.com\/video\/BV\w+\/$/);
      assert.ok((await source.innerText()).includes(weiboTitles.has(title) ? '微博' : 'B 站'));
      assert.equal(await source.getAttribute('target'), '_blank');
      const imageBounds = await section.locator('[data-update-image]:visible').boundingBox();
      const captionBounds = await section.locator('[data-update-caption]:visible').boundingBox();
      const imageBottom = imageBounds.y + imageBounds.height;
      assert.ok(captionBounds.y >= imageBottom - (viewport.width >= 1024 ? 12.5 : 8.5), 'only the small paper edge may overlap the picture');
      const titleBounds = await section.getByRole('heading', { level: 3 }).boundingBox();
      assert.ok(titleBounds.y >= imageBottom + 8, 'title text must remain below the picture');
      if (viewport.width >= 1024) {
        const list = await section.locator('[data-update-list]').boundingBox();
        const details = await section.locator('[data-update-details]').boundingBox();
        assert.ok(details.y - (list.y + list.height) >= 23.5, 'list and details need a clear gap');
        const link = await source.boundingBox();
        const previous = await section.getByRole('button', { name: 'Previous update', exact: true }).boundingBox();
        assert.ok(previous.y - (link.y + link.height) >= 12, 'details must leave room above the fixed controls');
      }
      await page.waitForTimeout(350);
      const controlsAfter = await section.getByRole('button').evaluateAll(buttons => buttons.filter(button => !button.closest('.overflow-x-auto') && !button.hasAttribute('data-update-play') && !button.hasAttribute('data-update-photo')).map(button => {
        const rect = button.getBoundingClientRect();
        return { label: button.getAttribute('aria-label'), x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }));
      assert.equal(controlsAfter.length, controlsBefore.length);
      controlsAfter.forEach((control, index) => {
        const previous = controlsBefore[index];
        for (const axis of ['x', 'y', 'width', 'height']) {
          assert.ok(Math.abs(control[axis] - previous[axis]) <= 0.5,
            `${control.label} ${axis} moved when selecting ${title} at ${viewport.width}px: ${previous[axis]} -> ${control[axis]}`);
        }
      });
      const after = await page.evaluate(() => scrollY);
      assert.ok(Math.abs(after - before) < 3, `selecting ${title} at ${viewport.width}px should not scroll: ${before} -> ${after}`);
      if (viewport.width < 1024) {
        const thumbnail = section.locator('.overflow-x-auto').getByRole('button', { name: `最新动态 ${title}`, exact: true });
        assert.equal(await thumbnail.evaluate(el => {
          const item = el.getBoundingClientRect();
          const strip = el.parentElement.getBoundingClientRect();
          return item.left >= strip.left - 1 && item.right <= strip.right + 1;
        }), true, 'selected mobile thumbnail should remain visible');
      }
    }
    if (viewport.width >= 1024) {
      const timeline = section.locator('nav button');
      const preview = timeline.nth(4);
      const beforeHover = await preview.boundingBox();
      await preview.hover();
      assert.equal(await timeline.nth(0).getAttribute('aria-pressed'), 'true', 'hovering a date must not change the selected story');
      assert.equal(await preview.getAttribute('aria-pressed'), 'false');
      assert.match((await preview.locator('time').innerText()).trim(), /^20\d{2}\.\d{2}\.\d{2}$/);
      assert.deepEqual(await preview.boundingBox(), beforeHover, 'expanding a date must not move its click target');
      await page.mouse.move(0, 0);
      await page.waitForFunction(el => /^\d{2}\.\d{2}$/.test(el.textContent.trim()), await preview.locator('time').elementHandle());
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no horizontal overflow');
    await section.screenshot({ path: `/tmp/luoxueer-updates-${viewport.width}.png` });
    console.log(`${viewport.width}px viewport: module ${Math.round(height)}px; all buttons stay fixed across all nine updates.`);
  }

  // Ordinary page scrolling must not override a user's selected update.
  const selected = section.getByRole('button', { name: '最新动态 盛夏的我们', exact: true });
  await selected.click();
  await page.mouse.wheel(0, -700);
  await page.waitForTimeout(1200);
  assert.equal(await selected.getAttribute('aria-pressed'), 'true');

  // Keep the previous offscreen animation protection covered.
  await page.setViewportSize({ width: 1440, height: 500 });
  await page.locator('.social-orbit-card').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.social-orbit-card')?.getAttribute('data-animating') === 'true');
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('.social-orbit-card')?.getAttribute('data-animating') === 'false');
  console.log('Compact layout, selection and offscreen animation checks passed.');
} finally {
  await browser.close();
}
