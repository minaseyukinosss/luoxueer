import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Run against a local dev/production server: ABOUT_TEST_URL=http://127.0.0.1:3000 pnpm test:about-scroll
const browser = await chromium.launch({ executablePath: process.env.DOUYIN_BROWSER_EXECUTABLE || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route('**/api/**', route => route.abort());
  await page.goto(`${process.env.ABOUT_TEST_URL || 'http://127.0.0.1:3000'}/about`);
  const section = page.getByRole('region', { name: '最新动态', exact: true });
  await section.waitFor();
  await page.waitForFunction(() => document.body.style.overflow === 'auto');

  for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await section.scrollIntoViewIfNeeded();
    const bounds = await section.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { height: rect.height, left: rect.left, right: rect.right };
    });
    const height = bounds.height;
    const bottomGap = await section.evaluate(el => document.documentElement.scrollHeight - (el.getBoundingClientRect().bottom + scrollY));
    assert.ok(Math.abs(bottomGap) < 2, `background should reach page bottom, got ${bottomGap}px gap`);
    assert.ok(Math.abs(bounds.left) < 2 && Math.abs(bounds.right - viewport.width) < 2, 'section background should reach both viewport edges');
    assert.ok(height < (viewport.width > 1024 ? 760 : 1100), `module should be compact, got ${height}px`);
    assert.equal(await section.locator('*').evaluateAll(nodes => nodes.some(el => getComputedStyle(el).position === 'sticky')), false);

    for (const title of ['新歌发布', '直播预告', '演唱会预告', '直播预告']) {
      const button = section.getByRole('button', { name: `最新动态 ${title}`, exact: true });
      await button.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      const before = await page.evaluate(() => scrollY);
      const controlsBefore = await section.getByRole('button').evaluateAll(buttons => buttons.map(button => {
        const rect = button.getBoundingClientRect();
        return { label: button.getAttribute('aria-label'), x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }));
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await section.getByRole('heading', { level: 3 }).innerText(), title);
      assert.equal(await section.locator('[aria-hidden="false"] img').filter({ visible: true }).getAttribute('alt'), title);
      await page.waitForTimeout(350);
      const controlsAfter = await section.getByRole('button').evaluateAll(buttons => buttons.map(button => {
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
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no horizontal overflow');
    await section.screenshot({ path: `/tmp/luoxueer-updates-${viewport.width}.png` });
    console.log(`${viewport.width}px viewport: module ${Math.round(height)}px; all buttons stay fixed across all three updates.`);
  }

  // Ordinary page scrolling must not override a user's selected update.
  const selected = section.getByRole('button', { name: '最新动态 直播预告', exact: true });
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
