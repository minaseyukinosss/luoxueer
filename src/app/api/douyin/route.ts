import { NextResponse } from "next/server";
import { FALLBACK_DOUYIN_DATA } from "@/features/about/data/fallback-data";
import type { DouyinStatsPayload } from "@/features/about/types/social-api";
import { fetchJson, isRecord, readNumber, readString } from "@/shared/lib/http";

const DOUYIN_PROFILE_ENDPOINT =
  "https://douyin.wtf/api/douyin/web/handler_user_profile?sec_user_id=MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr";

export const dynamic = "force-dynamic";

const fallbackResponse = () =>
  NextResponse.json(
    {
      ...FALLBACK_DOUYIN_DATA,
      isFallback: true,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Data-Source": "fallback",
      },
    },
  );

const parseDouyinPayload = (rawPayload: unknown): DouyinStatsPayload | null => {
  if (!isRecord(rawPayload)) return null;

  const code = readNumber(rawPayload.code);
  const statusCode = rawPayload.status_code === undefined ? 0 : readNumber(rawPayload.status_code, -1);
  const data = rawPayload.data;

  if (code !== 200 || statusCode !== 0 || !isRecord(data) || !isRecord(data.user)) {
    return null;
  }

  const user = data.user;
  const liveStatus = readNumber(user.live_status);

  return {
    followers: readNumber(user.follower_count),
    totalFavorited: readNumber(user.total_favorited),
    awemeCount: readNumber(user.aweme_count),
    nickname: readString(user.nickname),
    signature: readString(user.signature),
    liveStatus,
    isLive: liveStatus === 1,
    secUid: readString(user.sec_uid),
    lastUpdated: new Date().toISOString(),
  };
};

export async function GET() {
  try {
    const payload = parseDouyinPayload(await fetchJson(DOUYIN_PROFILE_ENDPOINT));

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
