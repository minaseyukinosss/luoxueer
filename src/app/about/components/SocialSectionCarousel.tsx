'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

import { RefreshIcon, WeiboCommunityIcon, BilibiliBadgeIcon, DouyinBadgeIcon } from '@/components/icons';
import { PLATFORM_META, type PlatformTheme, type SocialStats } from '../constants';

interface SocialSectionCarouselProps {
  socialStats: SocialStats[];
  socialLinks: Record<string, string>;
  handleRefresh: (event: MouseEvent<HTMLButtonElement>) => void;
  formatSyncTime: (date: Date) => string;
  getPlatformColor: (name: string) => PlatformTheme;
}

const BACKGROUND_STYLES: Record<
  string,
  {
    image: string;
    position: string;
    size: string;
    scale: number;
    overlay: string;
  }
> = {
  Weibo: {
    image: '/images/about/weibo-bg.webp',
    position: 'center 35%',
    size: 'cover',
    scale: 1.08,
    overlay: 'linear-gradient(140deg, rgba(255,244,236,0.9) 0%, rgba(255,235,225,0.65) 55%, rgba(255,244,236,0.88) 100%)',
  },
  Bilibili: {
    image: '/images/about/bilibili-bg.webp',
    position: 'center 40%',
    size: 'cover',
    scale: 1.08,
    overlay: 'linear-gradient(135deg, rgba(255,252,255,0.9) 0%, rgba(255,238,247,0.65) 50%, rgba(255,246,250,0.88) 100%)',
  },
  Douyin: {
    image: '/images/about/douyin-bg.webp',
    position: 'center 42%',
    size: 'cover',
    scale: 1.02,
    overlay: 'linear-gradient(135deg, rgba(6,7,14,0.92) 0%, rgba(11,12,22,0.78) 45%, rgba(6,7,14,0.95) 100%)',
  },
  default: {
    image: '/images/about/daily.webp',
    position: 'center top',
    size: 'cover',
    scale: 1.1,
    overlay: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0.9) 100%)',
  },
};

const getBackgroundStyle = (platformName: string) => BACKGROUND_STYLES[platformName] ?? BACKGROUND_STYLES.default;

export const SocialSectionCarousel = ({
  socialStats,
  socialLinks,
  handleRefresh,
  formatSyncTime,
  getPlatformColor,
}: SocialSectionCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 自动播放
  useEffect(() => {
    if (!isAutoPlaying || socialStats.length === 0) return;

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % socialStats.length);
    }, 8000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, socialStats.length]);

  // 手动切换
  const goToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 800);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + socialStats.length) % socialStats.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 800);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % socialStats.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 800);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  if (socialStats.length === 0) {
    return null;
  }

  const currentStat = socialStats[currentIndex];
  const colors = getPlatformColor(currentStat.name);
  const isDark = colors.mode === 'dark';

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-[#2d1f27] dark:text-white">社交动态</h2>
        <span className="text-sm text-[#7c6a77] dark:text-white/60">数据每日自动同步</span>
      </div>

      <div className="relative w-full overflow-hidden rounded-3xl" ref={carouselRef}>
        {/* 轮播容器 */}
        <div className="relative h-[420px] w-full overflow-hidden sm:h-[450px]">
          {/* 背景图片层 - 使用多个层实现淡入淡出效果 */}
          {socialStats.map((stat, index) => {
            const isActive = index === currentIndex;
            const bg = getBackgroundStyle(stat.name);
            return (
              <div
                key={stat.name}
                className="absolute inset-0 bg-no-repeat transition-all duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url(${bg.image})`,
                  backgroundPosition: bg.position,
                  backgroundSize: bg.size,
                  transform: `scale(${bg.scale})`,
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 1 : 0,
                }}
              >
                {/* 渐变遮罩层 */}
                <div
                  className="absolute inset-0 transition-opacity duration-1000"
                  style={{
                    background: bg.overlay,
                    opacity: isActive ? 1 : 0,
                  }}
                />
              </div>
            );
          })}

          {/* 内容层 - 使用多个层实现内容切换 */}
          {socialStats.map((stat, index) => {
            const isActive = index === currentIndex;
            const statColors = getPlatformColor(stat.name);
            const statMeta = PLATFORM_META[stat.name] ?? PLATFORM_META.default;
            const statIsDark = statColors.mode === 'dark';
            const statIsLoading = stat.loading;
            const statHasError = Boolean(stat.error);
            const statHasData = !statIsLoading && !statHasError;
            const statHighlights = stat.extraInfo?.highlights ?? [];
            const statHasWeiboDetails = stat.name === 'Weibo' ? statHighlights.length > 0 || Boolean(stat.extraInfo?.nameplate) : false;
            const statHasBilibiliDetails =
              stat.name === 'Bilibili'
                ? Boolean(stat.extraInfo?.liveStatus || stat.extraInfo?.nameplate || stat.extraInfo?.videoDescription)
                : false;
            const statHasDouyinDetails =
              stat.name === 'Douyin' ? Boolean(stat.extraInfo?.liveStatus || stat.extraInfo?.works || stat.extraInfo?.likes) : false;
            const statHasAnyDetails = statHasWeiboDetails || statHasBilibiliDetails || statHasDouyinDetails;
            const statChipStyle = { background: statColors.chipBackground, color: statColors.chipText } as const;
            const statBadgeStyle = { background: statColors.badgeBackground, color: statColors.badgeText } as const;
            const statSkeletonBase = statIsDark ? 'bg-white/15' : 'bg-black/10';

            return (
              <a
                key={stat.name}
                href={socialLinks[stat.name]}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 flex h-full w-full justify-center px-3 transition-all duration-700 ease-in-out sm:px-6"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="flex h-full w-full max-w-[980px] flex-col rounded-[28px] px-5 py-6 sm:px-8 md:px-10">
                  {/* 顶部信息 */}
                  <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex-1">
                    <p
                      className="text-sm uppercase tracking-[0.2em] transition-all duration-500"
                      style={{ color: statIsDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
                    >
                      {stat.fullName}
                    </p>
                    <h3
                      className="mt-3 text-4xl font-bold transition-all duration-500 md:text-5xl"
                      style={{ color: statColors.primary }}
                    >
                      {stat.shortName}
                    </h3>
                    {statHasData && stat.username && (
                      <p
                        className="mt-2 text-lg transition-all duration-500"
                        style={{ color: statIsDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}
                      >
                        @{stat.username}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRefresh(e);
                    }}
                    aria-label={`刷新 ${stat.shortName} 数据`}
                    className="group/btn flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                      background: statIsDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
                      borderColor: statColors.primary,
                      color: statColors.primary,
                    }}
                  >
                    <RefreshIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-180" />
                  </button>
                </div>

                {/* 核心数据展示区 - 紧凑设计 */}
                <div className="mt-6">
                  {statIsLoading ? (
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 shrink-0 rounded-2xl ${statSkeletonBase} animate-pulse`} />
                      <div className="flex-1 space-y-2">
                        <div className={`h-8 w-32 rounded-lg ${statSkeletonBase} animate-pulse`} />
                        <div className={`h-4 w-20 rounded-lg ${statSkeletonBase} animate-pulse`} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {/* 图标 - 更小更精致 */}
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl backdrop-blur-md transition-all duration-500"
                        style={{
                          background: statIsDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)',
                          boxShadow: statIsDark
                            ? '0 4px 16px rgba(0,0,0,0.2)'
                            : '0 4px 16px rgba(0,0,0,0.1)',
                        }}
                      >
                        {stat.name === 'Weibo' ? (
                          <WeiboCommunityIcon className="h-6 w-6" style={{ color: statColors.primary }} />
                        ) : stat.name === 'Bilibili' ? (
                          <BilibiliBadgeIcon className="h-6 w-6" style={{ color: statColors.primary }} />
                        ) : stat.name === 'Douyin' ? (
                          <DouyinBadgeIcon className="h-6 w-6" style={{ color: statColors.primary }} />
                        ) : (
                          <span className="text-base font-semibold" style={{ color: statColors.primary }}>
                            {stat.shortName}
                          </span>
                        )}
                      </div>

                      {/* 数据 - 更紧凑 */}
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <p
                            className="text-3xl font-bold leading-none transition-all duration-500 md:text-4xl"
                            style={{ color: statColors.primary }}
                          >
                            {stat.followers || '——'}
                          </p>
                          <span
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: statIsDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
                          >
                            {statMeta.followerLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 详细信息标签 - 紧凑设计 */}
                {!statIsLoading && (
                  <div className="mt-4">
                    {statHasError ? (
                      <div
                        className="rounded-xl border border-dashed px-3 py-2 text-xs backdrop-blur-sm"
                        style={{
                          borderColor: statColors.border,
                          color: statIsDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                          background: statIsDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
                        }}
                      >
                        {stat.error ?? '暂时无法获取数据'}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {stat.name === 'Weibo' && stat.extraInfo && (
                          <>
                            {statHighlights.map((highlight, highlightIndex) => (
                              <span
                                key={`${highlight}-${highlightIndex}`}
                                className="rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={statBadgeStyle}
                              >
                                {highlight}
                              </span>
                            ))}
                            {stat.extraInfo.nameplate && (
                              <span
                                className="rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={statBadgeStyle}
                              >
                                {stat.extraInfo.nameplate}
                              </span>
                            )}
                          </>
                        )}

                        {stat.name === 'Bilibili' && stat.extraInfo && (
                          <>
                            {stat.extraInfo.liveStatus && (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={statBadgeStyle}
                              >
                                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: statColors.primary }} />
                                {stat.extraInfo.liveStatus}
                              </span>
                            )}
                            {stat.extraInfo.nameplate && (
                              <span
                                className="rounded-lg px-2.5 py-1 text-xs backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={statBadgeStyle}
                              >
                                ⭐ {stat.extraInfo.nameplate}
                              </span>
                            )}
                            {stat.extraInfo.videoDescription && (
                              <p
                                className="w-full text-xs leading-relaxed"
                                style={{ color: statIsDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)' }}
                              >
                                {stat.extraInfo.videoDescription}
                              </p>
                            )}
                          </>
                        )}

                        {stat.name === 'Douyin' && stat.extraInfo && (
                          <>
                            {stat.extraInfo.liveStatus && (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={statBadgeStyle}
                              >
                                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: statColors.primary }} />
                                {stat.extraInfo.liveStatus}
                              </span>
                            )}
                            {stat.extraInfo.works && (
                              <span
                                className="rounded-lg px-2.5 py-1 text-xs backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={statChipStyle}
                              >
                                {stat.extraInfo.works}
                              </span>
                            )}
                            {stat.extraInfo.likes && (
                              <span
                                className="rounded-lg px-2.5 py-1 text-xs backdrop-blur-sm transition-all duration-200 hover:scale-105"
                                style={statChipStyle}
                              >
                                {stat.extraInfo.likes}
                              </span>
                            )}
                          </>
                        )}

                        {statHasData && !statHasAnyDetails && (
                          <span
                            className="text-xs opacity-60"
                            style={{ color: statIsDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
                          >
                            暂无更多信息
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 底部信息 - 紧凑设计，固定在底部 */}
                <div className="mt-auto">
                  <div
                    className="flex items-center justify-between border-t pt-3 text-[10px] backdrop-blur-sm"
                    style={{
                      borderColor: statIsDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                      color: statIsDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {!statIsLoading && stat.lastUpdated && (
                        <span>
                          同步时间：<span style={{ color: statColors.primary }}>{formatSyncTime(stat.lastUpdated)}</span>
                        </span>
                      )}
                      <span>{statMeta.sourceLabel}</span>
                    </div>
                    <span style={{ color: statColors.primary }} className="text-sm">→</span>
                  </div>
                </div>
              </div>
              </a>
            );
          })}

          {/* 导航按钮 */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="上一张"
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
              borderColor: colors.primary,
              color: colors.primary,
            }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            aria-label="下一张"
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
              borderColor: colors.primary,
              color: colors.primary,
            }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 指示器 */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {socialStats.map((_, index) => {
            const indicatorColors = getPlatformColor(socialStats[index].name);
            const indicatorIsDark = indicatorColors.mode === 'dark';
            return (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(index);
                }}
                aria-label={`切换到第 ${index + 1} 张`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8' : 'w-2'
                }`}
                style={{
                  background: index === currentIndex ? indicatorColors.primary : indicatorIsDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

