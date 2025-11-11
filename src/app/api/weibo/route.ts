import { NextResponse } from 'next/server';

const WEIBO_PROFILE_API = 'https://weibo.com/ajax/profile/info?uid=6106700809';
const WEIBO_DETAIL_API = 'https://weibo.com/ajax/profile/detail?uid=6106700809';

const WEIBO_COOKIE =
  'XSRF-TOKEN=eHT103LCvpKOe1Gdq4Rbkr5H; SUB=_2AkMeTSl0f8NxqwFRmv0XzW3kb41yzQ7EieKoEdivJRMxHRl-yT9xqmgHtRB6Nc0Hm2A1P8S-HsnkwinZdqOgOz-13NHD; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WFycbN9MWih_.jGCWL.pcDs; WBPSESS=Hp_nF-gJDcLT7G8YZA6PvWOj8CPtE0bNRiIWkpHPgVXHIwwcsSRQy82Di2h2uH_TXGOJvZOHjnM5Wf5HW-qQBfWuokjqiGJv9_cnAzzL6SBr1ZaXSnuVgYouMJQuIy0E1Y5euvtsOUIkGV7v4G2jVVuaINyKY2GS2AZ8B_OGajY';

interface WeiboProfileResponse {
  ok?: number;
  data?: {
    user?: {
      followers_count?: number;
      friends_count?: number;
      statuses_count?: number;
      screen_name?: string;
      description?: string;
      avatar_hd?: string;
      verified?: boolean;
      verified_reason?: string;
      gender?: string;
      location?: string;
    };
  };
}

interface WeiboDetailResponse {
  ok?: number;
  data?: {
    label_desc?: Array<{
      name?: string;
    }>;
  };
}

interface WeiboPayload {
  nickname: string;
  followers: number;
  follows: number;
  posts: number;
  bio: string;
  avatar: string;
  verified: boolean;
  verifiedReason: string;
  gender: string;
  location: string;
  fetchedAt: string;
  highlights: string[];
}

const fetchWeiboProfile = async (): Promise<WeiboProfileResponse> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(WEIBO_PROFILE_API, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json, text/plain, */*',
        Cookie: WEIBO_COOKIE,
        Referer: 'https://weibo.com/',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`request failed: ${response.status}`);
    }

    return (await response.json()) as WeiboProfileResponse;
  } finally {
    clearTimeout(timeout);
  }
};

const fetchWeiboDetail = async (): Promise<WeiboDetailResponse> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(WEIBO_DETAIL_API, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json, text/plain, */*',
        Cookie: WEIBO_COOKIE,
        Referer: 'https://weibo.com/',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`request failed: ${response.status}`);
    }

    return (await response.json()) as WeiboDetailResponse;
  } finally {
    clearTimeout(timeout);
  }
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [profile, detail] = await Promise.all([fetchWeiboProfile(), fetchWeiboDetail()]);

    if (!profile || profile.ok !== 1 || !profile.data?.user) {
      return NextResponse.json(
        { message: '获取微博数据失败' },
        { status: 502 },
      );
    }

    if (!detail || detail.ok !== 1 || !detail.data) {
      return NextResponse.json(
        { message: '获取微博数据失败' },
        { status: 502 },
      );
    }

    const user = profile.data.user;
    const highlights =
      detail.data.label_desc
        ?.map((item) => item.name?.trim())
        .filter((name): name is string => Boolean(name && name.length > 0)) ?? [];

    const payload: WeiboPayload = {
      nickname: user.screen_name ?? '',
      followers: user.followers_count ?? 0,
      follows: user.friends_count ?? 0,
      posts: user.statuses_count ?? 0,
      bio: user.description ?? '',
      avatar: user.avatar_hd ?? '',
      verified: Boolean(user.verified),
      verifiedReason: user.verified_reason ?? '',
      gender: user.gender ?? '',
      location: user.location ?? '',
      fetchedAt: new Date().toISOString(),
      highlights,
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      {
        message: `获取微博数据失败：${message}`,
      },
      { status: 502 },
    );
  }
}
