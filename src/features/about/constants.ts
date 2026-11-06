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
  source: 'weibo' | 'bilibili';
  sourceUrl?: string;
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
    source: 'weibo',
    sourceUrl: 'https://weibo.com/6106700809/5356092054831382',
  },
  {
    date: '2026-09-11',
    title: '学功夫练武术！',
    description: '功夫主题短片上线。双丸子头与武术造型亮相，配文「同学，我看你骨骼惊奇……」，15秒感受这份俏皮。',
    image: '/images/about/updates/kung-fu.webp',
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
    source: 'weibo',
    sourceUrl: 'https://weibo.com/6106700809/5339041131398399',
  },
  {
    date: '2026-08-27',
    title: '杳无音讯',
    description: 'B站更新16秒短片「终于 我们在彼此的生命中杳无音迅」，在咖啡馆的镜头里留下一个回眸。',
    image: '/images/about/updates/no-word.webp',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1grhF6PECk/',
  },
  {
    date: '2026-08-20',
    title: '我保证你是天使',
    description: '蓝色光影、白色羽翼与天使造型，一段28秒的音乐短片。去原视频看看这一次的镜头演绎。',
    image: '/images/about/updates/angel.webp',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1FR8c6nEmv/',
  },
  {
    date: '2026-07-27',
    title: '半壶纱',
    description: '以「最后一句也太难唱了」分享《半壶纱》主题片段。古风造型与山野背景，把25秒留给音乐。',
    image: '/images/about/updates/singing.webp',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1zqgd6DE4C/',
  },
  {
    date: '2026-07-20',
    title: '恶魔未必有我坏',
    description: '小恶魔造型的11秒短片，红色犄角与黑色穿搭带来另一种反差感。点击原视频查看完整片段。',
    image: '/images/about/updates/devil.webp',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1kZKp6WEk6/',
  },
  {
    date: '2026-05-13',
    title: '好好告个别',
    description: '教室、黑板与手中的麦克风，「那就好好告个别吧」。一段26秒的毕业季音乐片段，留下青春的回声。',
    image: '/images/about/updates/goodbye.webp',
    source: 'bilibili',
    sourceUrl: 'https://www.bilibili.com/video/BV1QP5y6EEtk/',
  },
];
