export type UpdateCategory = 'music' | 'events' | 'vlogs';

export interface SocialStats {
  name: string;
  fullName: string;
  shortName: string;
  followers: string;
  username?: string;
  avatar?: string;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
  isStale?: boolean;
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
    level?: number;
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

export interface UpdateMedia {
  image: string;
  video?: string;
}

export interface Update {
  date: string;
  title: string;
  description: string;
  image: string;
  media?: UpdateMedia[];
  category: UpdateCategory;
  source: 'weibo' | 'bilibili';
  sourceUrl?: string;
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
    username: '罗雪儿_',
    followers: '',
    loading: true,
    error: null,
    extraInfo: {},
  },
  {
    name: 'Bilibili',
    fullName: '哔哩哔哩',
    shortName: 'B站',
    username: '罗雪儿_',
    followers: '',
    loading: true,
    error: null,
    extraInfo: {},
  },
  {
    name: 'Douyin',
    fullName: '抖音短视频',
    shortName: '抖音',
    username: '罗雪儿',
    followers: '',
    loading: true,
    error: null,
    extraInfo: {},
  },
];

export const UPDATES: Update[] = [
  {
    date: '2026-11-03',
    title: '近况影像',
    description: '以「Recently.」更新日常图集，把近期生活收进镜头。换个造型，记录当下的自己。',
    image: '/images/about/updates/recently.webp',
    media: [
      { image: '/images/about/updates/recently.webp' },
      { image: '/images/about/updates/recently-2.webp' },
      { image: '/images/about/updates/recently-3.webp' },
      { image: '/images/about/updates/recently-4.webp' },
      { image: '/images/about/updates/recently-5.webp' },
      { image: '/images/about/updates/recently-6.webp' },
      { image: '/images/about/updates/recently-7.webp' },
      { image: '/images/about/updates/recently-8.webp', video: '/images/about/updates/recently-8.mp4' },
      { image: '/images/about/updates/recently-9.webp', video: '/images/about/updates/recently-9.mp4' },
    ],
    category: 'vlogs',
    source: 'weibo',
    sourceUrl: 'https://weibo.com/6106700809/5361134813317774',
  },
  {
    date: '2026-10-20',
    title: '盛夏的我们',
    description: '分享互动影游《盛夏的我们》定档消息。从盛夏到金秋，新的青春故事即将开启，前往原动态查看公告。',
    image: '/images/about/updates/summer-announcement.webp',
    media: [
      { image: '/images/about/updates/summer-announcement.webp' },
      { image: '/images/about/updates/summer-announcement-2.webp' },
    ],
    category: 'events',
    source: 'weibo',
    sourceUrl: 'https://weibo.com/6106700809/5356092054831382',
  },
  {
    date: '2026-09-11',
    title: '学功夫练武术！',
    description: '功夫主题短片上线。双丸子头与武术造型亮相，配文「同学，我看你骨骼惊奇……」，15秒感受这份俏皮。',
    image: '/images/about/updates/kung-fu.webp',
    category: 'vlogs',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1KzY76jEuM/',
  },
  {
    date: '2026-09-03',
    title: '面具之下',
    description: '公开蜘蛛侠主题造型，以「面具之下」分享角色写真，在日常之外留下另一种镜头记忆。',
    image: '/images/about/updates/mask.webp',
    media: [
      { image: '/images/about/updates/mask.webp' },
      { image: '/images/about/updates/mask-2.webp' },
      { image: '/images/about/updates/mask-3.webp' },
    ],
    category: 'vlogs',
    source: 'weibo',
    sourceUrl: 'https://weibo.com/6106700809/5339041131398399',
  },
  {
    date: '2026-08-27',
    title: '杳无音讯',
    description: 'B站更新16秒短片「终于 我们在彼此的生命中杳无音迅」，在咖啡馆的镜头里留下一个回眸。',
    image: '/images/about/updates/no-word.webp',
    category: 'vlogs',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1grhF6PECk/',
  },
  {
    date: '2026-08-20',
    title: '我保证你是天使',
    description: '蓝色光影、白色羽翼与天使造型，一段28秒的音乐短片。去原视频看看这一次的镜头演绎。',
    image: '/images/about/updates/angel.webp',
    category: 'music',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1FR8c6nEmv/',
  },
  {
    date: '2026-07-27',
    title: '半壶纱',
    description: '以「最后一句也太难唱了」分享《半壶纱》主题片段。古风造型与山野背景，把25秒留给音乐。',
    image: '/images/about/updates/singing.webp',
    category: 'music',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1zqgd6DE4C/',
  },
  {
    date: '2026-07-20',
    title: '恶魔未必有我坏',
    description: '小恶魔造型的11秒短片，红色犄角与黑色穿搭带来另一种反差感。点击原视频查看完整片段。',
    image: '/images/about/updates/devil.webp',
    category: 'vlogs',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1kZKp6WEk6/',
  },
  {
    date: '2026-05-13',
    title: '好好告个别',
    description: '教室、黑板与手中的麦克风，「那就好好告个别吧」。一段26秒的毕业季音乐片段，留下青春的回声。',
    image: '/images/about/updates/goodbye.webp',
    category: 'music',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1QP5y6EEtk/',
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
    href: 'https://live.bilibili.com/2704760',
  },
  {
    label: '抖音',
    description: '关注罗雪儿',
    href: SOCIAL_LINKS.Douyin,
  },
];
