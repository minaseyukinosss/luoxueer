/**
 * 静态数据 - 用于API接口调用失败时的fallback
 * 记录日期: 2025-12-05
 * 
 * 当外部API接口不可用时，使用这些静态数据确保页面正常显示
 */

// Bilibili 静态数据
export const FALLBACK_BILIBILI_DATA = {
  followers: 326928,
  nickname: '罗雪儿_',
  signature: '商务邮箱：923755084@qq.com\n全平台同名',
  avatar: '',
  level: 6,
  vip: {
    status: 0,
    type: 0,
    color: '',
  },
  live: {
    status: 'offline' as const,
    roomId: 0,
    title: '',
    cover: '',
    url: '',
  },
  fetchedAt: '2025-12-05T09:48:43.000Z',
  // 记录日期，用于标识数据快照时间
  recordedAt: '2025-12-05',
} as const;

// Douyin 静态数据
export const FALLBACK_DOUYIN_DATA = {
  followers: 0,
  totalFavorited: 0,
  awemeCount: 0,
  nickname: '罗雪儿',
  signature: '',
  liveStatus: 0,
  isLive: false,
  secUid: 'MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr',
  lastUpdated: '2025-12-05T09:48:43.000Z',
  // 记录日期
  recordedAt: '2025-12-05',
} as const;

// Weibo 静态数据
export const FALLBACK_WEIBO_DATA = {
  nickname: '罗雪儿_',
  followers: 0,
  follows: 0,
  posts: 0,
  bio: '',
  avatar: '',
  verified: false,
  verifiedReason: '',
  gender: '',
  location: '',
  fetchedAt: '2025-12-05T09:48:43.000Z',
  highlights: [] as string[],
  // 记录日期
  recordedAt: '2025-12-05',
} as const;
