export type UpdateCategory = 'music' | 'events' | 'vlogs';

export interface SocialStats {
  name: string;
  fullName: string;
  shortName: string;
  followers: string;
  username?: string;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
  extraInfo?: {
    vIndex?: string;
    reads?: string;
    interactions?: string;
    videoPlays?: string;
    isLive?: boolean;
    liveStatus?: string;
    liveUrl?: string;
    liveTitle?: string;
    liveCover?: string;
    nameplate?: string;
    works?: string;
    likes?: string;
    videoDescription?: string;
    highlights?: string[];
  };
}

export interface PlatformTheme {
  mode: 'light' | 'dark';
  primary: string;
  text: string;
  muted: string;
  cardBackground: string;
  border: string;
  cardShadow: string;
  hoverShadow: string;
  statBackground: string;
  badgeBackground: string;
  badgeText: string;
  chipBackground: string;
  chipText: string;
  iconBackground: string;
  iconShadow: string;
  button: {
    background: string;
    border: string;
    text: string;
    shadow: string;
  };
}

export interface PlatformMeta {
  sourceLabel: string;
  followerLabel: string;
  badgeLabel?: string;
}

export interface Update {
  date: string;
  title: string;
  description: string;
  image: string;
  category: UpdateCategory;
}

export interface FilterOption {
  label: string;
  value: UpdateCategory | 'all';
}

export interface HeroQuickLink {
  label: string;
  description: string;
  href: string;
}

export const SOCIAL_LINKS: Record<string, string> = {
  Weibo: 'https://weibo.com/6106700809',
  Bilibili: 'https://space.bilibili.com/406895348',
  Douyin:
    'https://www.douyin.com/user/MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr',
};


export const PLATFORM_META: Record<string, PlatformMeta> = {
  Weibo: {
    sourceLabel: '数据来源：微博',
    followerLabel: '关注者',
    badgeLabel: 'V 指数',
  },
  Bilibili: {
    sourceLabel: '数据来源：B站',
    followerLabel: '关注者',
    badgeLabel: '粉丝勋章',
  },
  Douyin: {
    sourceLabel: '数据来源：抖音',
    followerLabel: '关注者',
    badgeLabel: '直播状态',
  },
  default: {
    sourceLabel: '数据来源',
    followerLabel: '关注者',
  },
};

export const INITIAL_SOCIAL_STATS: SocialStats[] = [
  {
    name: 'Weibo',
    fullName: '新浪微博',
    shortName: '微博',
    followers: '',
    loading: true,
    error: null,
    extraInfo: {},
  },
  {
    name: 'Bilibili',
    fullName: '哔哩哔哩',
    shortName: 'B站',
    followers: '',
    loading: true,
    error: null,
    extraInfo: {},
  },
  {
    name: 'Douyin',
    fullName: '抖音短视频',
    shortName: '抖音',
    followers: '',
    loading: true,
    error: null,
    extraInfo: {},
  },
];

export const UPDATES: Update[] = [
  {
    date: '2025-04-23',
    title: '新歌发布',
    description:
      '全新单曲《Gelato》正式发布，one two three！我想和你去遍世界每个地方在角落，一起留下我们爱最甜的模样！',
    image: '/images/album/gelato.webp',
    category: 'music',
  },
  {
    date: 'Everyday！',
    title: '直播预告',
    description: '早上10点，锁定抖音罗雪儿直播间！与大家一起分享音乐和快乐时光。',
    image: '/images/daily.webp',
    category: 'events',
  },
  {
    date: '敬请期待...',
    title: '演唱会预告',
    description:
      '巡回演唱会正在筹划中，敬请期待！说不定哪天就有了！准备好与我一起狂欢吧。',
    image: '/images/live.webp',
    category: 'events',
  },
];

export const TRAIT_CHIPS = ['梦想追寻者', '旅行爱好者', 'chill vibes', '舞台掌控者'];

export const FILTER_OPTIONS: FilterOption[] = [
  { label: '全部', value: 'all' },
  { label: '音乐', value: 'music' },
  { label: '活动', value: 'events' },
  { label: '日志', value: 'vlogs' },
];

export const HERO_QUICK_LINKS: HeroQuickLink[] = [
  {
    label: '微博',
    description: '@NEKOMIMI_Luna',
    href: SOCIAL_LINKS.Weibo,
  },
  {
    label: 'B 站',
    description: '直播间入口',
    href: 'https://live.bilibili.com/',
  },
  {
    label: '抖音',
    description: '关注罗雪儿',
    href: SOCIAL_LINKS.Douyin,
  },
];
