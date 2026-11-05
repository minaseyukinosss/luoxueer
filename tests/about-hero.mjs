import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: process.env.DOUYIN_BROWSER_EXECUTABLE || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.route('**/api/**', route => route.abort());
  await page.goto(`${process.env.ABOUT_TEST_URL || 'http://127.0.0.1:3000'}/about`);
  await page.waitForFunction(() => document.body.style.overflow === 'auto');
  const hero = page.getByRole('region', { name: '罗雪儿', exact: true });
  await hero.waitFor();

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 900 }, { width: 390, height: 1000 }, { width: 320, height: 900 }]) {
    await page.setViewportSize(viewport);
    await hero.scrollIntoViewIfNeeded();
    const bounds = await hero.boundingBox();
    assert.ok(bounds.height < (viewport.width >= 1024 ? 760 : 1100), `hero height ${bounds.height}px should remain balanced`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);

    const follow = hero.getByRole('button', { name: '立即关注', exact: true });
    await follow.click();
    assert.equal(await follow.getAttribute('aria-expanded'), 'true');
    for (const platform of ['B 站', '微博', '抖音']) assert.equal(await hero.getByRole('button', { name: platform, exact: true }).isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await follow.getAttribute('aria-expanded'), 'false');

    const live = hero.getByRole('button', { name: '观看直播', exact: true });
    await live.click();
    for (const platform of ['B 站', '抖音']) assert.equal(await hero.getByRole('button', { name: platform, exact: true }).isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await live.getAttribute('aria-expanded'), 'false');

    const before = await hero.getByRole('button', { name: '联系合作', exact: true }).boundingBox();
    await hero.getByRole('button', { name: '联系合作', exact: true }).click();
    assert.equal(await hero.getByRole('link', { name: '923755084@qq.com', exact: true }).getAttribute('href'), 'mailto:923755084@qq.com');
    const after = await hero.getByRole('button', { name: '联系合作', exact: true }).boundingBox();
    assert.ok(Math.abs(after.y - before.y) < 1, 'contact button should stay in place');
    assert.equal(await hero.getByRole('link').count(), 4, 'three platform links and one email link');
    await hero.screenshot({ path: `/tmp/luoxueer-hero-${viewport.width}.png` });
    console.log(`${viewport.width}px: hero ${Math.round(bounds.height)}px; menus and contact work.`);
  }

  for (const language of ['EN', 'JP']) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('button', { name: language, exact: true }).click();
    await page.waitForFunction(expected => document.documentElement.lang === expected, language === 'EN' ? 'en' : 'ja');
    await page.setViewportSize({ width: 390, height: 1000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('section[aria-labelledby="about-hero-title"]').screenshot({ path: `/tmp/luoxueer-hero-${language}.png` });
  }
  console.log('Hero layout, mobile overflow, menus, contact and language checks passed.');
} finally {
  await browser.close();
}
