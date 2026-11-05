import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { FALLBACK_DOUYIN_DATA } from "../../features/about/data/fallback-data";
import type { DouyinStatsPayload } from "../../features/about/types/social-api";
import { isRecord, readNumber, readString } from "./http";

const PROFILE_URL = "https://www.douyin.com/user/" + FALLBACK_DOUYIN_DATA.secUid;
const REFRESH_MS = 2 * 60 * 1000;
const RETRY_MS = 5 * 60 * 1000;
let snapshot: DouyinStatsPayload | null = null;
let nextAttempt = 0;
let pending: Promise<DouyinStatsPayload> | null = null;

const snapshotFile = () => path.join(process.env.SOCIAL_STATS_DATA_DIR || path.join(process.cwd(), ".data"), "douyin.json");

const readAvatarUrlList = (value: unknown): string => {
  if (!isRecord(value)) return "";

  const urlList = value.url_list;
  if (!Array.isArray(urlList)) return "";

  const firstUrl = urlList.find((item): item is string => typeof item === "string" && item.length > 0);
  return firstUrl ?? "";
};

const readDouyinAvatar = (user: Record<string, unknown>): string => {
  for (const key of ["avatar_larger", "avatar_medium", "avatar_thumb"]) {
    const avatar = readAvatarUrlList(user[key]);
    if (avatar) return avatar;
  }

  return "";
};

export const parseDouyinPayload = (rawPayload: unknown): DouyinStatsPayload | null => {
  if (!isRecord(rawPayload)) return null;

  if (rawPayload.status_code !== 0 || !isRecord(rawPayload.user)) return null;
  const user = rawPayload.user;
  // Missing/malformed counts must not overwrite a valid snapshot with zero.
  if (!Number.isSafeInteger(user.follower_count) || (user.follower_count as number) < 0) return null;
  if (user.sec_uid !== FALLBACK_DOUYIN_DATA.secUid) return null;
  // Missing status means unknown, rather than a confirmed offline state.
  const liveStatus = user.live_status === 0 || user.live_status === 1 ? user.live_status : -1;

  return {
    followers: readNumber(user.follower_count),
    totalFavorited: readNumber(user.total_favorited),
    awemeCount: readNumber(user.aweme_count),
    nickname: readString(user.nickname),
    signature: readString(user.signature),
    avatar: readDouyinAvatar(user),
    liveStatus,
    isLive: liveStatus === 1,
    secUid: readString(user.sec_uid),
    lastUpdated: new Date().toISOString(),
  };
};


const readSnapshot = async (): Promise<DouyinStatsPayload | null> => {
  try {
    const data: unknown = JSON.parse(await readFile(snapshotFile(), "utf8"));
    if (!isRecord(data) || data.secUid !== FALLBACK_DOUYIN_DATA.secUid ||
        !Number.isSafeInteger(data.followers) || (data.followers as number) < 0 ||
        typeof data.lastUpdated !== "string" || !Number.isFinite(Date.parse(data.lastUpdated)) ||
        Date.parse(data.lastUpdated) > Date.now() || data.isFallback) return null;
    if (!["nickname", "signature", "avatar"].every((key) => typeof data[key] === "string") ||
        !["totalFavorited", "awemeCount"].every((key) => typeof data[key] === "number" && Number.isFinite(data[key]) && (data[key] as number) >= 0)) return null;
    return { ...data as DouyinStatsPayload,
      liveStatus: data.liveStatus === 0 || data.liveStatus === 1 ? data.liveStatus : -1,
      isLive: data.liveStatus === 1 };
  } catch {
    return null;
  }
};

const savedResponse = (): DouyinStatsPayload => {
  if (!snapshot) return { ...FALLBACK_DOUYIN_DATA, isFallback: true };
  const isStale = Date.now() - Date.parse(snapshot.lastUpdated) >= REFRESH_MS;
  return { ...snapshot, isStale,
    isLive: !isStale && snapshot.isLive,
    liveStatus: isStale ? -1 : snapshot.liveStatus };
};

export const fetchDouyinGuestProfile = async (): Promise<DouyinStatsPayload> => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.DOUYIN_BROWSER_EXECUTABLE || undefined,
    timeout: 15_000,
  });
  try {
    // A new context has no account cookies, saved logins or shared user profile.
    const context = await browser.newContext({ locale: "zh-CN", viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    // Observe the site's own guest request so its session/signature stays current.
    const [response] = await Promise.all([
      page.waitForResponse(async (response) => {
        const url = new URL(response.url());
        if (url.hostname !== "www.douyin.com" || url.pathname !== "/aweme/v1/web/user/profile/other/" || !response.ok()) return false;
        try { return parseDouyinPayload(await response.json()) !== null; } catch { return false; }
      }, { timeout: 30_000 }),
      page.goto(PROFILE_URL, { waitUntil: "domcontentloaded", timeout: 30_000 }),
    ]);
    const data = parseDouyinPayload(await response.json());
    if (!data) throw new Error("Invalid Douyin guest profile");
    return data;
  } finally {
    await browser.close();
  }
};

const refresh = async (): Promise<DouyinStatsPayload> => {
  snapshot ??= await readSnapshot();
  if (Date.now() < nextAttempt || (snapshot && Date.now() - Date.parse(snapshot.lastUpdated) < REFRESH_MS)) {
    return savedResponse();
  }
  try {
    const data = await fetchDouyinGuestProfile();
    snapshot = data;
    nextAttempt = Date.now() + REFRESH_MS;
    try {
      const file = snapshotFile();
      await mkdir(path.dirname(file), { recursive: true });
      const temporary = `${file}.${process.pid}.tmp`;
      await writeFile(temporary, JSON.stringify(data), "utf8");
      await rename(temporary, file);
    } catch (error) {
      process.stderr.write(`Douyin snapshot could not be saved: ${String(error)}\n`);
    }
    return data;
  } catch (error) {
    process.stderr.write(`Douyin guest profile unavailable: ${error instanceof Error ? error.name : "UnknownError"}\n`);
    nextAttempt = Date.now() + RETRY_MS;
    return savedResponse();
  }
};

export const getDouyinStats = (): Promise<DouyinStatsPayload> => {
  // ponytail: coalesce per process; use a shared lock if deployment gains multiple workers.
  pending ??= refresh().finally(() => { pending = null; });
  return pending;
};
