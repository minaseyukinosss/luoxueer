export type DouyinStatsPayload = {
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
};

export type BilibiliStatsPayload = {
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
    status: "live" | "offline";
    roomId: number;
    title: string;
    cover: string;
    url: string;
  } | null;
  fetchedAt: string;
  isFallback?: boolean;
  recordedAt?: string;
};

export type WeiboStatsPayload = {
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
  isFallback?: boolean;
  recordedAt?: string;
};
