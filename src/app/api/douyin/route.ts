import { NextResponse } from 'next/server';
import { FALLBACK_DOUYIN_DATA } from '@/app/about/data/fallbackData';

const DOUYIN_PROFILE_ENDPOINT =
  'https://douyin.wtf/api/douyin/web/handler_user_profile?sec_user_id=MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr';

interface DouyinApiResponse {
  code: number;
  data?: {
    user?: {
      follower_count?: number;
      total_favorited?: number;
      aweme_count?: number;
      nickname?: string;
      signature?: string;
      live_status?: number;
      sec_uid?: string;
    };
  };
  status_code?: number;
  status_msg?: string | null;
}

interface DouyinPayload {
  followers: number;
  totalFavorited: number;
  awemeCount: number;
  nickname: string;
  signature: string;
  liveStatus: number;
  isLive: boolean;
  secUid: string;
  lastUpdated: string;
  isFallback?: boolean;
  recordedAt?: string;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(DOUYIN_PROFILE_ENDPOINT, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // 使用静态数据作为fallback
      return NextResponse.json(
        {
          ...FALLBACK_DOUYIN_DATA,
          isFallback: true,
        },
        {
          headers: {
            'Cache-Control': 'no-store',
            'X-Data-Source': 'fallback',
          },
        },
      );
    }

    const payload = (await response.json()) as DouyinApiResponse;
    const user = payload.data?.user;

    if (!user || payload.code !== 200 || (payload.status_code && payload.status_code !== 0)) {
      // 使用静态数据作为fallback
      return NextResponse.json(
        {
          ...FALLBACK_DOUYIN_DATA,
          isFallback: true,
        },
        {
          headers: {
            'Cache-Control': 'no-store',
            'X-Data-Source': 'fallback',
          },
        },
      );
    }

    const body: DouyinPayload = {
      followers: user.follower_count ?? 0,
      totalFavorited: user.total_favorited ?? 0,
      awemeCount: user.aweme_count ?? 0,
      nickname: user.nickname ?? '',
      signature: user.signature ?? '',
      liveStatus: user.live_status ?? 0,
      isLive: (user.live_status ?? 0) === 1,
      secUid: user.sec_uid ?? '',
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    // 使用静态数据作为fallback
    return NextResponse.json(
      {
        ...FALLBACK_DOUYIN_DATA,
        isFallback: true,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Data-Source': 'fallback',
        },
      },
    );
  }
}
