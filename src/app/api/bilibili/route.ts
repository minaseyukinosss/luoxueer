import { NextResponse } from 'next/server';
import { FALLBACK_BILIBILI_DATA } from '@/app/about/data/fallbackData';

const BILIBILI_USER_API = 'https://api.bilibili.com/x/web-interface/card?mid=406895348';
const BILIBILI_LIVE_API =
  'https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=406895348';

interface BilibiliUserResponse {
  code: number;
  message?: string;
  data?: {
    card?: {
      fans?: number;
      name?: string;
      sign?: string;
      face?: string;
      level_info?: {
        current_level?: number;
      };
      vip?: {
        vipStatus?: number;
        vipType?: number;
        nickname_color?: string;
      };
    };
  };
}

interface BilibiliLiveResponse {
  code: number;
  message?: string;
  data?: {
    liveStatus?: number;
    roomid?: number;
    title?: string;
    cover?: string;
    url?: string;
  };
}

interface BilibiliPayload {
  followers: number;
  nickname: string;
  signature: string;
  avatar: string;
  level: number;
  vip: {
    status: number;
    type: number;
    color: string;
  } | null;
  live: {
    status: 'live' | 'offline';
    roomId: number;
    title: string;
    cover: string;
    url: string;
  } | null;
  fetchedAt: string;
  isFallback?: boolean;
  recordedAt?: string;
}

const fetchJson = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [userRes, liveRes] = await Promise.allSettled([
      fetchJson<BilibiliUserResponse>(BILIBILI_USER_API),
      fetchJson<BilibiliLiveResponse>(BILIBILI_LIVE_API),
    ]);

    if (userRes.status !== 'fulfilled' || !userRes.value || userRes.value.code !== 0) {
      // 使用静态数据作为fallback
      return NextResponse.json(
        {
          ...FALLBACK_BILIBILI_DATA,
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

    const card = userRes.value.data?.card;
    if (!card) {
      // 使用静态数据作为fallback
      return NextResponse.json(
        {
          ...FALLBACK_BILIBILI_DATA,
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

    let live: BilibiliPayload['live'] = null;
    if (liveRes.status === 'fulfilled' && liveRes.value && liveRes.value.code === 0) {
      const liveData = liveRes.value.data;
      if (liveData && liveData.roomid) {
        live = {
          status: liveData.liveStatus === 1 ? 'live' : 'offline',
          roomId: liveData.roomid,
          title: liveData.title ?? '',
          cover: liveData.cover ?? '',
          url: liveData.url ?? '',
        };
      }
    }

    const payload: BilibiliPayload = {
      followers: card.fans ?? 0,
      nickname: card.name ?? '',
      signature: card.sign ?? '',
      avatar: card.face ?? '',
      level: card.level_info?.current_level ?? 0,
      vip: card.vip
        ? {
            status: card.vip.vipStatus ?? 0,
            type: card.vip.vipType ?? 0,
            color: card.vip.nickname_color ?? '',
          }
        : null,
      live,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    // 使用静态数据作为fallback
    return NextResponse.json(
      {
        ...FALLBACK_BILIBILI_DATA,
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
