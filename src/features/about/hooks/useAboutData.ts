import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useLocale } from '@/shared/components/providers/LocaleProvider';

import {
  INITIAL_SOCIAL_STATS,
  SOCIAL_LINKS,
  type FilterOption,
  type HeroQuickLink,
  type SocialStats,
  type Update,
  type UpdateCategory,
} from "@/features/about/constants";
import type {
  BilibiliStatsPayload,
  DouyinStatsPayload,
  WeiboStatsPayload,
} from "@/features/about/types/social-api";
import { isRecord, readBoolean, readNumber, readString } from "@/shared/lib/http";

const parseDouyinStatsPayload = (value: unknown): DouyinStatsPayload => {
  if (!isRecord(value)) {
    throw new Error("抖音数据格式异常");
  }

  return {
    followers: readNumber(value.followers),
    totalFavorited: readNumber(value.totalFavorited),
    awemeCount: readNumber(value.awemeCount),
    nickname: readString(value.nickname),
    signature: readString(value.signature),
    avatar: readString(value.avatar),
    liveStatus: readNumber(value.liveStatus),
    isLive: readBoolean(value.isLive),
    secUid: readString(value.secUid),
    lastUpdated: readString(value.lastUpdated),
  };
};

const parseBilibiliStatsPayload = (value: unknown): BilibiliStatsPayload => {
  if (!isRecord(value)) {
    throw new Error("B 站数据格式异常");
  }

  const rawVip = value.vip;
  const rawLive = value.live;

  return {
    followers: readNumber(value.followers),
    nickname: readString(value.nickname),
    signature: readString(value.signature),
    avatar: readString(value.avatar),
    level: readNumber(value.level),
    vip: isRecord(rawVip)
      ? {
          status: readNumber(rawVip.status),
          type: readNumber(rawVip.type),
          color: readString(rawVip.color),
        }
      : null,
    live: isRecord(rawLive)
      ? {
          status: rawLive.status === "live" ? "live" : "offline",
          roomId: readNumber(rawLive.roomId),
          title: readString(rawLive.title),
          cover: readString(rawLive.cover),
          url: readString(rawLive.url),
        }
      : null,
    fetchedAt: readString(value.fetchedAt),
  };
};

const parseWeiboStatsPayload = (value: unknown): WeiboStatsPayload => {
  if (!isRecord(value)) {
    throw new Error("微博数据格式异常");
  }

  const highlights = Array.isArray(value.highlights)
    ? value.highlights.filter((item): item is string => typeof item === "string")
    : [];

  return {
    nickname: readString(value.nickname),
    followers: readNumber(value.followers),
    follows: readNumber(value.follows),
    posts: readNumber(value.posts),
    bio: readString(value.bio),
    avatar: readString(value.avatar),
    verified: readBoolean(value.verified),
    verifiedReason: readString(value.verifiedReason),
    gender: readString(value.gender),
    location: readString(value.location),
    fetchedAt: readString(value.fetchedAt),
    highlights,
  };
};

const parseFollowers = (value: string): number => {
  if (!value) {
    return 0;
  }

  const upper = value.toUpperCase().replace(/,/g, '');
  const num = parseFloat(upper.replace(/[KM]/g, ''));
  const multiplier = upper.includes('M') ? 1_000_000 : upper.includes('K') ? 1_000 : 1;
  return Number.isFinite(num) ? num * multiplier : 0;
};

const formatTotalFollowers = (total: number): string => {
  if (total >= 1_000_000) {
    return `${(total / 1_000_000).toFixed(2)}M`;
  }
  if (total >= 1_000) {
    return `${Math.round(total / 1_000)}K`;
  }
  return total.toLocaleString();
};

const calculateTotalFollowers = (stats: SocialStats[]): string => {
  const total = stats.reduce((sum, stat) => {
    if (stat.loading || stat.error) {
      return sum;
    }
    return sum + parseFollowers(stat.followers);
  }, 0);

  const hasLoaded = stats.some((stat) => !stat.loading && !stat.error && stat.followers);

  if (!hasLoaded) {
    return '——';
  }

  return formatTotalFollowers(total);
};

const formatCount = (value: number): string => {
  if (value >= 1_000_000) {
    const formatted = value >= 10_000_000 ? (value / 1_000_000).toFixed(1) : (value / 1_000_000).toFixed(2);
    return `${formatted}M`;
  }
  if (value >= 1_000) {
    const formatted = value >= 10_000 ? (value / 1_000).toFixed(1) : (value / 1_000).toFixed(2);
    return `${formatted}K`;
  }
  return value.toLocaleString();
};

const formatSyncTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const useAboutData = () => {
  const { t } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | 'all'>('all');
  const [socialStats, setSocialStats] = useState<SocialStats[]>(() => INITIAL_SOCIAL_STATS.map((stat) => ({ ...stat })));

  // Localized Data Construction
  const traitChips = useMemo(() => [...t.aboutPage.traits], [t]);

  const filterOptions: FilterOption[] = useMemo(() => [
    { label: t.aboutPage.filters.all, value: 'all' },
    { label: t.aboutPage.filters.music, value: 'music' },
    { label: t.aboutPage.filters.events, value: 'events' },
    { label: t.aboutPage.filters.vlogs, value: 'vlogs' },
  ], [t]);

  const heroQuickLinks: HeroQuickLink[] = useMemo(() => [
    {
      label: t.aboutPage.heroLinks.weibo,
      description: t.aboutPage.heroLinks.weiboDesc,
      href: SOCIAL_LINKS.Weibo,
    },
    {
      label: t.aboutPage.heroLinks.bilibili,
      description: t.aboutPage.heroLinks.bilibiliDesc,
      href: 'https://live.bilibili.com/27047605',
    },
    {
      label: t.aboutPage.heroLinks.douyin,
      description: t.aboutPage.heroLinks.douyinDesc,
      href: SOCIAL_LINKS.Douyin,
    },
  ], [t]);

  const localizedUpdates: Update[] = useMemo(() => [
    {
      date: '2025-04-23',
      title: t.aboutPage.updates[0].title,
      description: t.aboutPage.updates[0].desc,
      image: '/images/album/gelato.webp',
      category: 'music',
    },
    {
      date: 'Everyday！',
      title: t.aboutPage.updates[1].title,
      description: t.aboutPage.updates[1].desc,
      image: '/images/daily.webp',
      category: 'events',
    },
    {
      date: '敬请期待...', // Or translation if needed, but keeping simple for now
      title: t.aboutPage.updates[2].title,
      description: t.aboutPage.updates[2].desc,
      image: '/images/live.webp',
      category: 'events',
    },
  ], [t]);

  const totalFollowers = useMemo(() => calculateTotalFollowers(socialStats), [socialStats]);

  const filteredUpdates = useMemo(() => {
    if (selectedCategory === 'all') return localizedUpdates;
    return localizedUpdates.filter((update) => update.category === selectedCategory);
  }, [selectedCategory, localizedUpdates]);

  const livePlatform = socialStats.find((stat) => stat.extraInfo?.isLive);
  const isLive = Boolean(livePlatform?.extraInfo?.isLive);
  const nextEvent = useMemo(() => localizedUpdates.find((item) => item.category === 'events'), [localizedUpdates]);

  const updateDouyinStat = useCallback(
    (updater: (prev: SocialStats) => SocialStats) => {
      setSocialStats((prevStats) =>
        prevStats.map((stat) => (stat.name === 'Douyin' ? updater(stat) : stat)),
      );
    },
    [],
  );

  const updateBilibiliStat = useCallback(
    (updater: (prev: SocialStats) => SocialStats) => {
      setSocialStats((prevStats) =>
        prevStats.map((stat) => (stat.name === 'Bilibili' ? updater(stat) : stat)),
      );
    },
    [],
  );

  const updateWeiboStat = useCallback(
    (updater: (prev: SocialStats) => SocialStats) => {
      setSocialStats((prevStats) =>
        prevStats.map((stat) => (stat.name === 'Weibo' ? updater(stat) : stat)),
      );
    },
    [],
  );

  const initialFetchRef = useRef(false);

  const fetchDouyinStats = useCallback(async () => {
    updateDouyinStat((stat) => ({
      ...stat,
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch('/api/douyin', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('接口返回异常');
      }

      const data = parseDouyinStatsPayload(await response.json());

      const followers = Number.isFinite(data.followers) ? data.followers : 0;
      const totalFavorited = Number.isFinite(data.totalFavorited) ? data.totalFavorited : 0;
      const awemeCount = Number.isFinite(data.awemeCount) ? data.awemeCount : 0;

      updateDouyinStat((stat) => ({
        ...stat,
        followers: formatCount(followers),
        username: data.nickname || stat.username,
        avatar: data.avatar || stat.avatar,
        loading: false,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
        extraInfo: {
          ...stat.extraInfo,
          isLive: data.isLive,
          liveStatus: data.isLive ? '直播中' : '未开播',
          works: `${awemeCount.toLocaleString()} 作品`,
          likes: `${formatCount(totalFavorited)} 获赞`,
        },
      }));
    } catch (error) {
      updateDouyinStat((stat) => ({
        ...stat,
        loading: false,
        error: error instanceof Error ? error.message : '未知错误',
      }));
    }
  }, [updateDouyinStat]);

  const fetchBilibiliStats = useCallback(async () => {
    updateBilibiliStat((stat) => ({
      ...stat,
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch('/api/bilibili', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('接口返回异常');
      }

      const data = parseBilibiliStatsPayload(await response.json());

      const followers = Number.isFinite(data.followers) ? data.followers : 0;

      updateBilibiliStat((stat) => ({
        ...stat,
        followers: formatCount(followers),
        username: data.nickname || stat.username,
        avatar: data.avatar || stat.avatar,
        loading: false,
        lastUpdated: data.fetchedAt ? new Date(data.fetchedAt) : new Date(),
        extraInfo: {
          ...stat.extraInfo,
          isLive: data.live?.status === 'live',
          liveStatus: data.live?.status === 'live' ? '直播中' : '未开播',
          liveUrl: data.live?.url ?? stat.extraInfo?.liveUrl,
          liveTitle: data.live?.title ?? stat.extraInfo?.liveTitle,
          liveCover: data.live?.cover ?? stat.extraInfo?.liveCover,
          level: data.level || stat.extraInfo?.level,
          videoDescription: data.signature || stat.extraInfo?.videoDescription,
        },
      }));
    } catch (error) {
      updateBilibiliStat((stat) => ({
        ...stat,
        loading: false,
        error: error instanceof Error ? error.message : '未知错误',
      }));
    }
  }, [updateBilibiliStat]);

  const fetchWeiboStats = useCallback(async () => {
    updateWeiboStat((stat) => ({
      ...stat,
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch('/api/weibo', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('接口返回异常');
      }

      const data = parseWeiboStatsPayload(await response.json());

      const followers = Number.isFinite(data.followers) ? data.followers : 0;
      updateWeiboStat((stat) => ({
        ...stat,
        followers: formatCount(followers),
        username: data.nickname || stat.username,
        avatar: data.avatar || stat.avatar,
        loading: false,
        lastUpdated: data.fetchedAt ? new Date(data.fetchedAt) : new Date(),
        extraInfo: {
          ...stat.extraInfo,
          highlights: data.highlights?.length ? data.highlights : stat.extraInfo?.highlights,
        },
      }));
    } catch (error) {
      updateWeiboStat((stat) => ({
        ...stat,
        loading: false,
        error: error instanceof Error ? error.message : '未知错误',
      }));
    }
  }, [updateWeiboStat]);

  useEffect(() => {
    const hasFetchedRef = initialFetchRef;
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;
    void Promise.all([fetchDouyinStats(), fetchBilibiliStats(), fetchWeiboStats()]);
  }, [fetchDouyinStats, fetchBilibiliStats, fetchWeiboStats, initialFetchRef]);

  const handleRefresh = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      void Promise.all([fetchDouyinStats(), fetchBilibiliStats(), fetchWeiboStats()]);
    },
    [fetchDouyinStats, fetchBilibiliStats, fetchWeiboStats],
  );

  return {
    socialStats,
    traitChips,
    heroQuickLinks,
    filterOptions,
    socialLinks: SOCIAL_LINKS,
    selectedCategory,
    setSelectedCategory,
    totalFollowers,
    filteredUpdates,
    livePlatform,
    isLive,
    nextEvent,
    handleRefresh,
    formatSyncTime,
  };
};

export type UseAboutDataReturn = ReturnType<typeof useAboutData>;
