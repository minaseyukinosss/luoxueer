import { NextResponse } from "next/server";
import { FALLBACK_BILIBILI_DATA } from "@/features/about/data/fallback-data";
import type { BilibiliStatsPayload } from "@/features/about/types/social-api";
import { FALLBACK_CACHE_HEADERS, SOCIAL_STATS_CACHE_HEADERS } from "@/shared/lib/api-cache";
import { fetchJson, isRecord, readNumber, readString } from "@/shared/lib/http";

const BILIBILI_USER_API = "https://api.bilibili.com/x/web-interface/card?mid=406895348";
const BILIBILI_LIVE_API =
  "https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=406895348";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const fallbackResponse = () =>
  NextResponse.json(
    {
      ...FALLBACK_BILIBILI_DATA,
      isFallback: true,
    },
    {
      headers: FALLBACK_CACHE_HEADERS,
    },
  );

const parseLivePayload = (rawPayload: unknown): BilibiliStatsPayload["live"] => {
  if (!isRecord(rawPayload) || readNumber(rawPayload.code, -1) !== 0 || !isRecord(rawPayload.data)) {
    return null;
  }

  const liveData = rawPayload.data;
  const roomId = readNumber(liveData.roomid);
  if (!roomId) return null;

  return {
    status: readNumber(liveData.liveStatus) === 1 ? "live" : "offline",
    roomId,
    title: readString(liveData.title),
    cover: readString(liveData.cover),
    url: readString(liveData.url),
  };
};

const parseUserPayload = (rawPayload: unknown, live: BilibiliStatsPayload["live"]): BilibiliStatsPayload | null => {
  if (!isRecord(rawPayload) || readNumber(rawPayload.code, -1) !== 0 || !isRecord(rawPayload.data)) {
    return null;
  }

  const card = rawPayload.data.card;
  if (!isRecord(card)) return null;

  const levelInfo = isRecord(card.level_info) ? card.level_info : null;
  const vip = isRecord(card.vip)
    ? {
        status: readNumber(card.vip.vipStatus),
        type: readNumber(card.vip.vipType),
        color: readString(card.vip.nickname_color),
      }
    : null;

  return {
    followers: readNumber(card.fans),
    nickname: readString(card.name),
    signature: readString(card.sign),
    avatar: readString(card.face),
    level: readNumber(levelInfo?.current_level),
    vip,
    live,
    fetchedAt: new Date().toISOString(),
  };
};

export async function GET() {
  try {
    const [userResult, liveResult] = await Promise.allSettled([
      fetchJson(BILIBILI_USER_API),
      fetchJson(BILIBILI_LIVE_API),
    ]);

    if (userResult.status !== "fulfilled") {
      return fallbackResponse();
    }

    const live = liveResult.status === "fulfilled" ? parseLivePayload(liveResult.value) : null;
    const payload = parseUserPayload(userResult.value, live);

    if (!payload) {
      return fallbackResponse();
    }

    return NextResponse.json(payload, {
      headers: SOCIAL_STATS_CACHE_HEADERS,
    });
  } catch {
    return fallbackResponse();
  }
}
