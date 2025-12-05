'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '@/components/LocaleProvider';
import { RefreshIcon, WeiboCommunityIcon, BilibiliBadgeIcon, DouyinBadgeIcon } from '@/components/icons';
import { type PlatformTheme, type SocialStats } from '../constants';

interface SocialSectionCreativeProps {
  socialStats: SocialStats[];
  socialLinks: Record<string, string>;
  handleRefresh: (event: MouseEvent<HTMLButtonElement>) => void;
  formatSyncTime: (date: Date) => string;
  getPlatformColor: (name: string) => PlatformTheme;
}

const BACKGROUND_IMGS: Record<string, string> = {
  Weibo: '/images/about/weibo-bg.webp',
  Bilibili: '/images/about/bilibili-bg.webp',
  Douyin: '/images/about/douyin-bg.webp',
  default: '/images/about/daily.webp',
};

export const SocialSectionCreative = ({
  socialStats,
  socialLinks,
  handleRefresh,
  formatSyncTime,
  getPlatformColor,
}: SocialSectionCreativeProps) => {
  const { t } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化动画 (入场)
  useEffect(() => {
    if (contentRefs.current[currentIndex]) {
      gsap.fromTo(
        contentRefs.current[currentIndex],
        { opacity: 0, x: -30, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'back.out(1.2)' }
      );
    }
    if (bgRefs.current[currentIndex]) {
      // 背景有一个“呼吸”式的放大入场
      gsap.fromTo(
        bgRefs.current[currentIndex],
        { opacity: 0, scale: 1.2, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }
      );
    }
  }, [currentIndex]);


  // 自动播放逻辑
  useEffect(() => {
    if (!isAutoPlaying || socialStats.length === 0) return;

    const playNext = () => {
      setCurrentIndex((prev) => (prev + 1) % socialStats.length);
    };

    autoPlayTimerRef.current = setInterval(playNext, 10000); // 从 6000ms 增加到 10000ms (10秒)

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, socialStats.length]);

  const handleManualSwitch = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // 重新启动自动播放计时器
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    setTimeout(() => setIsAutoPlaying(true), 6000); // 从 4000ms 增加到 6000ms
  };

  if (socialStats.length === 0) return null;

  const currentStat = socialStats[currentIndex];
  const colors = getPlatformColor(currentStat.name);
  const platformKey = currentStat.name.toLowerCase() as keyof typeof t.aboutPage.platformMeta;
  const meta = t.aboutPage.platformMeta[platformKey] ?? t.aboutPage.platformMeta.default;
  const isDark = colors.mode === 'dark';

  return (
    <section className="relative w-full py-8">
      {/* 顶部标题栏 */}
      <div className="mb-8 flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2d1f27] dark:text-white">
            {t.aboutPage.socialDynamics}
          </h2>
          <p className="mt-1 text-sm text-[#7c6a77] dark:text-white/60">
            {t.aboutPage.socialSubtitle}
          </p>
        </div>
        
        {/* 平台切换指示器 */}
        <div className="flex gap-2 rounded-full bg-white/50 p-1.5 backdrop-blur-md dark:bg-black/20">
          {socialStats.map((stat, index) => {
            const isActive = index === currentIndex;
            const statColors = getPlatformColor(stat.name);
            return (
              <button
                key={stat.name}
                onClick={() => handleManualSwitch(index)}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive ? 'scale-110 shadow-lg ring-2 ring-white/50 dark:ring-white/20' : 'hover:scale-105 hover:bg-white/40 dark:hover:bg-white/10'
                }`}
                style={{
                  background: isActive ? statColors.primary : 'transparent',
                  color: isActive ? '#fff' : statColors.primary,
                }}
                aria-label={`切换到 ${stat.shortName}`}
              >
                {stat.name === 'Weibo' ? (
                  <WeiboCommunityIcon className="h-4 w-4" />
                ) : stat.name === 'Bilibili' ? (
                  <BilibiliBadgeIcon className="h-4 w-4" />
                ) : (
                  <DouyinBadgeIcon className="h-4 w-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 主展示区 */}
      <div 
        ref={containerRef}
        className="group relative min-h-[400px] w-full overflow-hidden rounded-[40px] border border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] dark:border-white/5 dark:bg-black/20"
      >

        {/* 背景层 */}
        {socialStats.map((stat, index) => {
            const isActive = index === currentIndex;
            const bgImg = BACKGROUND_IMGS[stat.name] ?? BACKGROUND_IMGS.default;
            
            // 根据平台调整背景位置
            let bgPosition = 'center center';
            if (stat.name === 'Weibo') bgPosition = 'center 35%';
            if (stat.name === 'Bilibili') bgPosition = 'center 40%';
            if (stat.name === 'Douyin') bgPosition = 'center 42%';

            return (
                <div
                    key={`bg-${stat.name}`}
                    ref={(el) => { bgRefs.current[index] = el; }}
                    className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'}`}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-no-repeat"
                        style={{ 
                            backgroundImage: `url(${bgImg})`,
                            backgroundPosition: bgPosition,
                        }} 
                    />
                    {/* 渐变遮罩 */}
                    <div 
                        className="absolute inset-0" 
                        style={{
                            background: isDark 
                                ? 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)'
                                : 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 100%)'
                        }}
                    />
                    {/* 底部渐变 */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 h-32"
                        style={{
                            background: isDark
                                ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
                                : 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)'
                        }}
                    />
                </div>
            );
        })}

        {/* 内容层 */}
        <div className="relative z-10 flex h-full min-h-[400px] flex-col justify-center p-6 md:p-10 lg:p-12">
            {socialStats.map((stat, index) => {
                if (index !== currentIndex) return null;
                
                const statColors = getPlatformColor(stat.name);
                const statIsLoading = stat.loading;
                
                // 提取数据
                const followers = stat.followers || '0';
                const extraInfo = stat.extraInfo || {};
                const highlights = extraInfo.highlights ?? [];
                
                return (
                    <div 
                        key={`content-${stat.name}`}
                        ref={(el) => { contentRefs.current[index] = el; }}
                        className="flex h-full w-full flex-col justify-between md:flex-row md:items-end"
                    >
                        {/* 左侧：核心信息 */}
                        <div className="flex max-w-lg flex-col gap-4">
                            {/* 平台标识 */}
                            <div className="flex items-center gap-3">
                                <div 
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-md dark:bg-white/10"
                                    style={{ color: statColors.primary }}
                                >
                                    {stat.name === 'Weibo' ? <WeiboCommunityIcon className="h-6 w-6" /> :
                                     stat.name === 'Bilibili' ? <BilibiliBadgeIcon className="h-6 w-6" /> :
                                     <DouyinBadgeIcon className="h-6 w-6" />}
                                </div>
                                <span 
                                    className="text-lg font-bold tracking-wider uppercase"
                                    style={{ color: statColors.primary }}
                                >
                                    {stat.name}
                                </span>
                            </div>

                            {/* 大标题 & 粉丝数 */}
                            <div>
                                <h3 className={`text-4xl font-black tracking-tight md:text-6xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {stat.fullName}
                                </h3>
                                <div className="mt-1 flex items-baseline gap-2">
                                    {statIsLoading ? (
                                        <div className="h-12 w-56 animate-pulse rounded-lg bg-gray-200/50 dark:bg-white/10" />
                                    ) : (
                                        <>
                                            <span 
                                                className="text-5xl font-bold md:text-7xl"
                                                style={{ 
                                                    color: 'transparent',
                                                    WebkitTextStroke: `2px ${statColors.primary}`,
                                                }}
                                            >
                                                {followers}
                                            </span>
                                            <span className={`text-lg font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                                {meta.follower}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* 描述/简介 */}
                            {extraInfo.videoDescription && (
                                <p className={`line-clamp-2 max-w-md text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                                    {extraInfo.videoDescription}
                                </p>
                            )}

                            {/* 操作按钮 */}
                            <div className="mt-2 flex items-center gap-4">
                                <a
                                    href={socialLinks[stat.name]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white transition-all hover:gap-3 hover:shadow-lg active:scale-95"
                                    style={{ background: statColors.primary }}
                                >
                                    {t.aboutPage.visitHome}
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                </a>
                                <button
                                    onClick={handleRefresh}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-current transition-all hover:rotate-180 hover:bg-black/5 active:scale-90 dark:hover:bg-white/10"
                                    style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }}
                                    aria-label="刷新数据"
                                >
                                    <RefreshIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* 右侧：数据胶囊 (桌面端显示在右下，移动端在下方) */}
                        <div className="mt-8 flex flex-col gap-3 md:mt-0 md:items-end">
                            {/* 微博标签 */}
                            {stat.name === 'Weibo' && highlights.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                    {highlights.map((highlight, highlightIndex) => (
                                        <span
                                            key={`${highlight}-${highlightIndex}`}
                                            className="rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-md transition-all duration-200 hover:scale-105"
                                            style={{
                                                background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)',
                                                color: isDark ? 'rgba(255,255,255,0.9)' : statColors.primary,
                                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                                            }}
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 状态标签 */}
                            {extraInfo.liveStatus && (
                                <div className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md transition-transform hover:scale-105 ${
                                    extraInfo.isLive 
                                        ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/30' 
                                        : 'bg-white/60 text-slate-600 dark:bg-black/40 dark:text-white/70'
                                }`}>
                                    <span className={`h-2 w-2 rounded-full ${extraInfo.isLive ? 'animate-pulse bg-white' : 'bg-slate-400'}`} />
                                    <span className="text-sm font-bold">{extraInfo.liveStatus}</span>
                                </div>
                            )}

                            {/* 认证/勋章信息 */}
                            {extraInfo.nameplate && (
                                <div className={`w-fit rounded-xl px-4 py-2 backdrop-blur-md transition-transform hover:scale-105 ${
                                    isDark ? 'bg-white/10 text-white' : 'bg-white/70 text-slate-800'
                                }`}>
                                    <p className="text-xs opacity-60">认证 / 勋章</p>
                                    <p className="text-sm font-semibold">{extraInfo.nameplate}</p>
                                </div>
                            )}

                            {/* 作品/获赞 (针对抖音等) */}
                            <div className="flex flex-wrap gap-2 md:justify-end">
                                {extraInfo.works && (
                                    <div className={`rounded-xl px-4 py-2 backdrop-blur-md transition-transform hover:scale-105 ${
                                        isDark ? 'bg-white/10 text-white' : 'bg-white/70 text-slate-800'
                                    }`}>
                                        <p className="text-xs opacity-60">作品数</p>
                                        <p className="font-mono text-lg font-bold">{extraInfo.works.replace(/\D/g, '')}</p>
                                    </div>
                                )}
                                {extraInfo.likes && (
                                    <div className={`rounded-xl px-4 py-2 backdrop-blur-md transition-transform hover:scale-105 ${
                                        isDark ? 'bg-white/10 text-white' : 'bg-white/70 text-slate-800'
                                    }`}>
                                        <p className="text-xs opacity-60">获赞数</p>
                                        <p className="font-mono text-lg font-bold">{extraInfo.likes.replace(/\s*获赞$/, '')}</p>
                                    </div>
                                )}
                            </div>

                            {/* 同步时间 */}
                            {!statIsLoading && stat.lastUpdated && (
                                <p className={`mt-2 text-xs font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                                    {t.aboutPage.lastSync} {formatSyncTime(stat.lastUpdated)}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* 免责提示 */}
      <div className="mt-4 px-2">
        <p className="text-xs text-[#7c6a77]/70 dark:text-white/40 text-center leading-relaxed">
          {t.aboutPage.dataDisclaimer}
        </p>
      </div>
    </section>
  );
};
