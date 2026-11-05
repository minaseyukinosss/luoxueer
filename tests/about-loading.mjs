import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: process.env.DOUYIN_BROWSER_EXECUTABLE || undefined });
const base = process.env.ABOUT_TEST_URL || 'http://127.0.0.1:3000';
const now = new Date().toISOString();
const fixture = (name, followers) => ({
  followers, nickname: `${name}测试`, fetchedAt: now, lastUpdated: now,
  avatar: '', signature: '公开资料', level: 6, highlights: ['公开资料'],
  totalFavorited: 100, awemeCount: 10, liveStatus: 0, isLive: false,
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pending = new Map();
  await page.route('**/api/**', async route => {
    const name = new URL(route.request().url()).pathname.split('/').at(-1);
    await new Promise(resolve => {
      pending.set(name, async (followers, status = 200) => {
        pending.delete(name);
        await route.fulfill({ status, json: fixture(name, followers) });
        resolve();
      });
    });
  });
  await page.goto(`${base}/about`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.body.style.overflow === 'auto');
  const total = page.getByTestId('total-followers');
  const cards = page.locator('article[data-platform]');
  const refresh = page.getByRole('button', { name: '刷新数据', exact: true });
  await page.waitForFunction(() => document.querySelectorAll('article[data-platform][aria-busy="true"]').length === 3);
  assert.equal(await total.getAttribute('aria-busy'), 'true');
  assert.equal(await total.locator('.animate-pulse').count(), 1);
  for (const card of await cards.all()) assert.ok(await card.locator('.animate-pulse').count() >= 3);
  assert.equal(await refresh.isDisabled(), true);
  const heightBefore = (await total.boundingBox()).height;
  await page.getByRole('region', { name: '罗雪儿', exact: true }).screenshot({ path: '/tmp/luoxueer-loading-hero.png' });
  await page.locator('section').filter({ has: page.getByRole('heading', { name: '社交动态', exact: true }) }).screenshot({ path: '/tmp/luoxueer-loading-social.png' });

  await page.setViewportSize({ width: 390, height: 1000 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.equal(await total.getAttribute('aria-busy'), 'true');
  await page.locator('section').filter({ has: page.getByRole('heading', { name: '社交动态', exact: true }) }).screenshot({ path: '/tmp/luoxueer-loading-social-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });

  await pending.get('weibo')(1000);
  await page.waitForFunction(() => document.querySelector('[data-platform="Weibo"]').getAttribute('aria-busy') === 'false');
  assert.equal(await total.getAttribute('aria-busy'), 'true');
  assert.equal(await total.locator('.animate-pulse').count(), 1, 'partial results must not be presented as the total');
  await pending.get('bilibili')(2000);
  await pending.get('douyin')(3000);
  await page.waitForFunction(() => document.querySelector('[data-testid="total-followers"]').getAttribute('aria-busy') === 'false');
  assert.equal((await total.innerText()).trim(), '6K');
  assert.equal(await refresh.isDisabled(), false);
  assert.equal((await total.boundingBox()).height, heightBefore, 'total placeholder must reserve its height');

  await refresh.click();
  await page.waitForFunction(() => document.querySelectorAll('article[data-platform][aria-busy="true"]').length === 3);
  assert.equal(await total.getAttribute('aria-busy'), 'true');
  assert.ok((await total.innerText()).includes('6K'));
  assert.equal(await total.locator('.animate-pulse').count(), 0, 'refresh keeps the existing total');
  for (const card of await cards.all()) {
    assert.equal(await card.locator('.animate-pulse').count(), 0, 'refresh keeps existing card data');
    assert.ok(await card.locator('.animate-spin').count());
  }
  const refreshBounds = await refresh.boundingBox();
  await pending.get('weibo')(2000);
  await page.waitForFunction(() => document.querySelector('[data-platform="Weibo"]').getAttribute('aria-busy') === 'false');
  assert.ok((await total.innerText()).includes('6K'), 'total stays at last complete snapshot during refresh');
  await pending.get('bilibili')(0, 500);
  await pending.get('douyin')(6000);
  await page.waitForFunction(() => document.querySelector('[data-testid="total-followers"]').getAttribute('aria-busy') === 'false');
  assert.equal((await total.innerText()).trim(), '10K', 'failed refresh preserves last Bilibili count');
  assert.ok((await page.locator('[data-platform="Bilibili"]').innerText()).includes('2.00K'));
  assert.equal(await refresh.isDisabled(), false);
  const readyBounds = await refresh.boundingBox();
  assert.equal(readyBounds.width, refreshBounds.width, 'loading label must not resize refresh button');
  assert.ok(Math.abs(readyBounds.x - refreshBounds.x) < 1);

  const failurePage = await browser.newPage();
  await failurePage.route('**/api/**', route => route.fulfill({ status: 500, json: {} }));
  await failurePage.goto(`${base}/about`, { waitUntil: 'domcontentloaded' });
  await failurePage.waitForFunction(() => document.body.style.overflow === 'auto');
  assert.equal(await failurePage.getByTestId('total-followers').getAttribute('aria-busy'), 'false');
  assert.equal((await failurePage.getByTestId('total-followers').innerText()).trim(), '——');
  assert.equal(await failurePage.locator('article[data-platform][aria-busy="true"]').count(), 0);
  assert.equal(await failurePage.locator('article[data-platform] .animate-pulse').count(), 0);
  console.log('Initial skeletons, partial responses, stable totals, refresh indicators, preserved values and failure exit checks passed.');
} finally {
  await browser.close();
}
