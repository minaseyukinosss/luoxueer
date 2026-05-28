import { NextResponse } from "next/server";
import { FALLBACK_WEIBO_DATA } from "@/features/about/data/fallback-data";
import type { WeiboStatsPayload } from "@/features/about/types/social-api";
import { FALLBACK_CACHE_HEADERS, SOCIAL_STATS_CACHE_HEADERS } from "@/shared/lib/api-cache";
import { fetchJson, isRecord, readBoolean, readNumber, readString } from "@/shared/lib/http";
import { getWeiboRequestHeaders, toWeiboAvatarProxyUrl } from "@/shared/lib/weibo";

const WEIBO_PROFILE_API = "https://weibo.com/ajax/profile/info?uid=6106700809";
const WEIBO_DETAIL_API = "https://weibo.com/ajax/profile/detail?uid=6106700809";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const fallbackResponse = () =>
  NextResponse.json(
    {
      ...FALLBACK_WEIBO_DATA,
      isFallback: true,
    },
    {
      headers: FALLBACK_CACHE_HEADERS,
    },
  );

const fetchWeiboJson = (url: string) => fetchJson(url, { headers: getWeiboRequestHeaders() });

const parseHighlights = (rawPayload: unknown): string[] => {
  if (!isRecord(rawPayload) || readNumber(rawPayload.ok) !== 1 || !isRecord(rawPayload.data)) {
    return [];
  }

  const labelDesc = rawPayload.data.label_desc;
  if (!Array.isArray(labelDesc)) {
    return [];
  }

  return labelDesc
    .map((item) => (isRecord(item) ? readString(item.name).trim() : ""))
    .filter((name) => name.length > 0);
};

const parseWeiboPayload = (rawPayload: unknown, highlights: string[]): WeiboStatsPayload | null => {
  if (!isRecord(rawPayload) || readNumber(rawPayload.ok) !== 1 || !isRecord(rawPayload.data)) {
    return null;
  }

  const user = rawPayload.data.user;
  if (!isRecord(user)) return null;

  const avatarHd = readString(user.avatar_hd);

  return {
    nickname: readString(user.screen_name),
    followers: readNumber(user.followers_count),
    follows: readNumber(user.friends_count),
    posts: readNumber(user.statuses_count),
    bio: readString(user.description),
    avatar: toWeiboAvatarProxyUrl(avatarHd),
    verified: readBoolean(user.verified),
    verifiedReason: readString(user.verified_reason),
    gender: readString(user.gender),
    location: readString(user.location),
    fetchedAt: new Date().toISOString(),
    highlights,
  };
};

export async function GET() {
  try {
    const [profileResult, detailResult] = await Promise.allSettled([
      fetchWeiboJson(WEIBO_PROFILE_API),
      fetchWeiboJson(WEIBO_DETAIL_API),
    ]);

    if (profileResult.status !== "fulfilled") {
      return fallbackResponse();
    }

    const highlights = detailResult.status === "fulfilled" ? parseHighlights(detailResult.value) : [];
    const payload = parseWeiboPayload(profileResult.value, highlights);

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
