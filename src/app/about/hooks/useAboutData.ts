import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';

import {
  FILTER_OPTIONS,
  HERO_QUICK_LINKS,
  INITIAL_SOCIAL_STATS,
  SOCIAL_LINKS,
  TRAIT_CHIPS,
  UPDATES,
  type PlatformTheme,
  type SocialStats,
  type UpdateCategory,
} from '../constants';

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

const getPlatformColor = (name: string): PlatformTheme => {
  switch (name) {
    case 'Weibo':
      return {
        mode: 'light',
        primary: '#E95A2D',
        text: '#33231A',
        muted: 'rgba(87, 64, 50, 0.7)',
        cardBackground: 'linear-gradient(160deg, #FFF4EB 0%, #FFE3D3 100%)',
        border: 'rgba(233, 90, 45, 0.32)',
        cardShadow: '0 18px 32px -24px rgba(233, 90, 45, 0.45)',
        hoverShadow: '0 24px 40px -28px rgba(233, 90, 45, 0.55)',
        statBackground: '#E95A2D',
        badgeBackground: 'rgba(233, 90, 45, 0.08)',
        badgeText: '#A04220',
        chipBackground: 'rgba(233, 90, 45, 0.08)',
        chipText: '#A04220',
        iconBackground: 'linear-gradient(140deg, rgba(255,255,255,0.9) 0%, rgba(255,221,205,0.9) 100%)',
        iconShadow: '0 12px 24px -18px rgba(233, 90, 45, 0.55)',
        button: {
          background: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(233, 90, 45, 0.25)',
          text: '#A04220',
          shadow: '0 10px 24px -18px rgba(233, 90, 45, 0.45)',
        },
      };
    case 'Bilibili':
      return {
        mode: 'light',
        primary: '#F26F9F',
        text: '#34212D',
        muted: 'rgba(99, 68, 86, 0.68)',
        cardBackground: 'linear-gradient(155deg, #FFF5FA 0%, #FFE8F1 100%)',
        border: 'rgba(242, 111, 159, 0.3)',
        cardShadow: '0 18px 32px -24px rgba(242, 111, 159, 0.4)',
        hoverShadow: '0 24px 40px -28px rgba(242, 111, 159, 0.48)',
        statBackground: '#F26F9F',
        badgeBackground: 'rgba(242, 111, 159, 0.08)',
        badgeText: '#8F3C5F',
        chipBackground: 'rgba(242, 111, 159, 0.08)',
        chipText: '#8F3C5F',
        iconBackground: 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(255,220,236,0.92) 100%)',
        iconShadow: '0 12px 24px -18px rgba(242, 111, 159, 0.48)',
        button: {
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'rgba(242, 111, 159, 0.25)',
          text: '#8F3C5F',
          shadow: '0 10px 24px -18px rgba(242, 111, 159, 0.4)',
        },
      };
    case 'Douyin':
      return {
        mode: 'dark',
        primary: '#0FE0D7',
        text: '#F5F7FA',
        muted: 'rgba(198, 206, 220, 0.7)',
        cardBackground: 'linear-gradient(165deg, #14151D 0%, #1B1C25 100%)',
        border: 'rgba(15, 224, 215, 0.18)',
        cardShadow: '0 20px 46px -30px rgba(7, 8, 12, 0.9)',
        hoverShadow: '0 24px 54px -28px rgba(15, 224, 215, 0.35)',
        statBackground: 'linear-gradient(120deg, #FF1F85 0%, #0FE0D7 100%)',
        badgeBackground: 'rgba(15, 224, 215, 0.12)',
        badgeText: '#E5FDFC',
        chipBackground: 'rgba(15, 224, 215, 0.08)',
        chipText: '#E5FDFC',
        iconBackground: 'linear-gradient(140deg, rgba(28,33,47,0.85) 0%, rgba(37,44,61,0.85) 100%)',
        iconShadow: '0 14px 28px -18px rgba(15, 224, 215, 0.55)',
        button: {
          background: 'rgba(32, 36, 44, 0.85)',
          border: 'rgba(15, 224, 215, 0.25)',
          text: '#E5FDFC',
          shadow: '0 12px 28px -22px rgba(15, 224, 215, 0.45)',
        },
      };
    default:
      return {
        mode: 'light',
        primary: '#DD6D95',
        text: '#2F1E2A',
        muted: 'rgba(104, 71, 86, 0.68)',
        cardBackground: 'linear-gradient(160deg, #FFF4F8 0%, #FFE9F2 100%)',
        border: 'rgba(221, 109, 149, 0.28)',
        cardShadow: '0 18px 32px -24px rgba(221, 109, 149, 0.38)',
        hoverShadow: '0 22px 40px -28px rgba(221, 109, 149, 0.45)',
        statBackground: '#DD6D95',
        badgeBackground: 'rgba(221, 109, 149, 0.08)',
        badgeText: '#8B3D5A',
        chipBackground: 'rgba(221, 109, 149, 0.08)',
        chipText: '#8B3D5A',
        iconBackground: 'linear-gradient(150deg, rgba(255,255,255,0.9) 0%, rgba(255,228,240,0.9) 100%)',
        iconShadow: '0 12px 26px -20px rgba(221, 109, 149, 0.45)',
        button: {
          background: 'rgba(255, 255, 255, 0.88)',
          border: 'rgba(221, 109, 149, 0.24)',
          text: '#8B3D5A',
          shadow: '0 10px 24px -18px rgba(221, 109, 149, 0.42)',
        },
      };
  }
};

export const useAboutData = () => {
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | 'all'>('all');
  const [socialStats, setSocialStats] = useState<SocialStats[]>(() => INITIAL_SOCIAL_STATS.map((stat) => ({ ...stat })));

  const totalFollowers = useMemo(() => calculateTotalFollowers(socialStats), [socialStats]);

  const filteredUpdates = useMemo(() => {
    if (selectedCategory === 'all') return UPDATES;
    return UPDATES.filter((update) => update.category === selectedCategory);
  }, [selectedCategory]);

  const livePlatform = socialStats.find((stat) => stat.extraInfo?.isLive);
  const isLive = Boolean(livePlatform?.extraInfo?.isLive);
  const nextEvent = useMemo(() => UPDATES.find((item) => item.category === 'events'), []);

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

      const data: {
        followers: number;
        totalFavorited: number;
        awemeCount: number;
        nickname: string;
        liveStatus: number;
        isLive: boolean;
        lastUpdated: string;
      } = await response.json();

      const followers = Number.isFinite(data.followers) ? data.followers : 0;
      const totalFavorited = Number.isFinite(data.totalFavorited) ? data.totalFavorited : 0;
      const awemeCount = Number.isFinite(data.awemeCount) ? data.awemeCount : 0;

      updateDouyinStat((stat) => ({
        ...stat,
        followers: formatCount(followers),
        username: data.nickname || stat.username,
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

      const data: {
        followers: number;
        nickname: string;
        signature: string;
        avatar: string;
        level: number;
        vip: { status: number; type: number; color: string } | null;
        live: {
          status: 'live' | 'offline';
          roomId: number;
          title: string;
          cover: string;
          url: string;
        } | null;
        fetchedAt: string;
      } = await response.json();

      const followers = Number.isFinite(data.followers) ? data.followers : 0;

      updateBilibiliStat((stat) => ({
        ...stat,
        followers: formatCount(followers),
        username: data.nickname || stat.username,
        loading: false,
        lastUpdated: data.fetchedAt ? new Date(data.fetchedAt) : new Date(),
        extraInfo: {
          ...stat.extraInfo,
          isLive: data.live?.status === 'live',
          liveStatus: data.live?.status === 'live' ? '直播中' : '未开播',
          liveUrl: data.live?.url ?? stat.extraInfo?.liveUrl,
          liveTitle: data.live?.title ?? stat.extraInfo?.liveTitle,
          liveCover: data.live?.cover ?? stat.extraInfo?.liveCover,
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

      const data: {
        nickname: string;
        followers: number;
        bio: string;
        avatar: string;
        verified: boolean;
        verifiedReason: string;
        gender: string;
        location: string;
        fetchedAt: string;
        highlights?: string[];
      } = await response.json();

      const followers = Number.isFinite(data.followers) ? data.followers : 0;
      updateWeiboStat((stat) => ({
        ...stat,
        followers: formatCount(followers),
        username: data.nickname || stat.username,
        loading: false,
        lastUpdated: data.fetchedAt ? new Date(data.fetchedAt) : new Date(),
        extraInfo: {
          ...stat.extraInfo,
          highlights: data.highlights?.length ? data.highlights : stat.extraInfo?.highlights,
          nameplate: data.verified ? data.verifiedReason || '认证用户' : undefined,
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
    traitChips: TRAIT_CHIPS,
    heroQuickLinks: HERO_QUICK_LINKS,
    filterOptions: FILTER_OPTIONS,
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
    getPlatformColor,
  };
};

export type UseAboutDataReturn = ReturnType<typeof useAboutData>;
