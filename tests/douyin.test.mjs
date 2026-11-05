import { test, after } from 'node:test';
import { createRequire } from 'node:module';
const loadModule = createRequire(import.meta.url);
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const { chromium } = loadModule('playwright');
const originalLaunch = chromium.launch;
const root = mkdtempSync(path.join(tmpdir(), 'luoxueer-douyin-'));
symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
execFileSync(path.resolve('node_modules/.bin/tsc'), [
  'src/shared/lib/douyin.ts', '--outDir', root, '--module', 'commonjs',
  '--target', 'es2020', '--esModuleInterop', '--skipLibCheck', '--strict',
]);
const modulePath = path.join(root, 'shared/lib/douyin.js');
const secUid = 'MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr';
const originalDir = process.env.SOCIAL_STATS_DATA_DIR;
after(() => {
  chromium.launch = originalLaunch;
  if (originalDir === undefined) delete process.env.SOCIAL_STATS_DATA_DIR;
  else process.env.SOCIAL_STATS_DATA_DIR = originalDir;
  rmSync(root, { recursive: true, force: true });
});
const load = () => {
  delete loadModule.cache[loadModule.resolve(modulePath)];
  return loadModule(modulePath);
};
const setup = () => {
  process.env.SOCIAL_STATS_DATA_DIR = mkdtempSync(path.join(root, 'snapshot-'));
  return load();
};
const profile = (followers = 12345) => ({ status_code: 0, user: {
  follower_count: followers, sec_uid: secUid, nickname: '罗雪儿', live_status: 1,
} });
const success = (onLaunch = () => {}) => {
  chromium.launch = async () => {
    onLaunch();
    const response = {
      url: () => 'https://www.douyin.com/aweme/v1/web/user/profile/other/',
      ok: () => true,
      json: async () => profile(),
    };
    return {
      newContext: async () => ({ newPage: async () => ({
        goto: async () => {},
        waitForResponse: async (predicate) => {
          assert.equal(await predicate(response), true);
          return response;
        },
      }) }),
      close: async () => {},
    };
  };
};
const failure = () => { chromium.launch = async () => { throw new Error('offline'); }; };
const file = () => path.join(process.env.SOCIAL_STATS_DATA_DIR, 'douyin.json');

test('first failure is unavailable and retries are throttled', async () => {
  const { getDouyinStats } = setup();
  let calls = 0;
  chromium.launch = async () => { calls++; throw new Error('offline'); };
  assert.equal((await getDouyinStats()).isFallback, true);
  assert.equal((await getDouyinStats()).isFallback, true);
  assert.equal(calls, 1);
});

test('success persists; a new process serves recent snapshot with bounded live status', async () => {
  const { getDouyinStats } = setup();
  success();
  const fresh = await getDouyinStats();
  assert.equal(fresh.followers, 12345);
  assert.equal(fresh.isLive, true);
  assert.equal(JSON.parse(readFileSync(file())).followers, 12345);
  chromium.launch = async () => { assert.fail('fresh disk snapshot should avoid upstream'); };
  const cached = await load().getDouyinStats();
  assert.equal(cached.followers, 12345);
  assert.equal(cached.lastUpdated, fresh.lastUpdated);
  assert.equal(cached.isLive, true);
});

test('stale snapshot survives failure with original time and no live status', async () => {
  setup();
  success();
  await load().getDouyinStats();
  const saved = JSON.parse(readFileSync(file()));
  saved.lastUpdated = new Date(Date.now() - 3 * 60000).toISOString();
  writeFileSync(file(), JSON.stringify(saved));
  failure();
  const stale = await load().getDouyinStats();
  assert.equal(stale.followers, saved.followers);
  assert.equal(stale.lastUpdated, saved.lastUpdated);
  assert.equal(stale.isStale, true);
  assert.equal(stale.isLive, false);
  assert.deepEqual(JSON.parse(readFileSync(file())), saved);
});

test('malformed upstream counts or wrong account are rejected; real zero is valid', () => {
  const { parseDouyinPayload } = setup();
  for (const value of [undefined, '123', -1, 1.5, NaN]) {
    assert.equal(parseDouyinPayload(profile(value === undefined ? null : value)), null);
  }
  assert.equal(parseDouyinPayload(profile(0)).followers, 0);
  const wrong = profile();
  wrong.user.sec_uid = 'another-account';
  assert.equal(parseDouyinPayload(wrong), null);
  const failed = profile();
  failed.status_code = 1;
  assert.equal(parseDouyinPayload(failed), null);
});

test('corrupted snapshot is ignored', async () => {
  const { getDouyinStats } = setup();
  writeFileSync(file(), '{');
  failure();
  assert.equal((await getDouyinStats()).isFallback, true);
});

test('concurrent visitors share one upstream request', async () => {
  const { getDouyinStats } = setup();
  let calls = 0;
  success(() => { calls++; });
  const results = await Promise.all(Array.from({ length: 10 }, () => getDouyinStats()));
  assert.equal(calls, 1);
  assert.ok(results.every((data) => data.followers === 12345));
});

test('browser closes when navigation fails', async () => {
  const { fetchDouyinGuestProfile } = setup();
  let closed = false;
  chromium.launch = async () => ({
    newContext: async () => ({ newPage: async () => ({
      waitForResponse: async () => new Promise(() => {}),
      goto: async () => { throw new Error('navigation failed'); },
    }) }),
    close: async () => { closed = true; },
  });
  await assert.rejects(fetchDouyinGuestProfile(), /navigation failed/);
  assert.equal(closed, true);
});

test('missing live status is unknown', () => {
  const { parseDouyinPayload } = setup();
  const data = profile();
  delete data.user.live_status;
  assert.equal(parseDouyinPayload(data).liveStatus, -1);
  assert.equal(parseDouyinPayload(data).isLive, false);
});

test('live guest profile can be fetched and persisted', { skip: process.env.DOUYIN_LIVE_CHECK !== '1' }, async () => {
  const { getDouyinStats } = setup();
  chromium.launch = originalLaunch;
  const data = await getDouyinStats();
  assert.ok(!data.isFallback, 'live request must return a valid guest profile');
  assert.equal(data.secUid, secUid);
  assert.equal(JSON.parse(readFileSync(file())).followers, data.followers);
  console.log(JSON.stringify({ followers: data.followers, liveStatus: data.liveStatus, nickname: data.nickname, lastUpdated: data.lastUpdated }));
});
