import { NextResponse } from "next/server";
import { FALLBACK_WEIBO_DATA } from "@/features/about/data/fallback-data";
import type { WeiboStatsPayload } from "@/features/about/types/social-api";
import { fetchJson, isRecord, readBoolean, readNumber, readString } from "@/shared/lib/http";

const WEIBO_PROFILE_API = "https://weibo.com/ajax/profile/info?uid=6106700809";
const WEIBO_DETAIL_API = "https://weibo.com/ajax/profile/detail?uid=6106700809";

const WEIBO_REQUEST_HEADERS = {
  Accept: "application/json, text/plain, */*",
  Cookie:
    "XSRF-TOKEN=eHT103LCvpKOe1Gdq4Rbkr5H; SUB=_2AkMeTSl0f8NxqwFRmv0XzW3kb41yzQ7EieKoEdivJRMxHRl-yT9xqmgHtRB6Nc0Hm2A1P8S-HsnkwinZdqOgOz-13NHD; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFycbN9MWih_.jGCWL.pcDs; WBPSESS=Hp_nF-gJDcLT7G8YZA6PvWOj8CPtE0bNRiIWkpHPgVXHIwwcsSRQy82Di2h2uH_TXGOJvZOHjnM5Wf5HW-qQBfWuokjqiGJv9_cnAzzL6SBr1ZaXSnuVgYouMJQuIy0E1Y5euvtsOUIkGV7v4G2jVVuaINyKY2GS2AZ8B_OGajY",
  Referer: "https://weibo.com/",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
} satisfies HeadersInit;

export const dynamic = "force-dynamic";

const fallbackResponse = () =>
  NextResponse.json(
    {
      ...FALLBACK_WEIBO_DATA,
      isFallback: true,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Data-Source": "fallback",
      },
    },
  );

const fetchWeiboJson = (url: string) =>
  fetchJson(url, {
    headers: WEIBO_REQUEST_HEADERS,
  });

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

  return {
    nickname: readString(user.screen_name),
    followers: readNumber(user.followers_count),
    follows: readNumber(user.friends_count),
    posts: readNumber(user.statuses_count),
    bio: readString(user.description),
    avatar: readString(user.avatar_hd),
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
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return fallbackResponse();
  }
}
