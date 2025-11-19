import type { MouseEvent } from 'react';

import { RefreshIcon, WeiboCommunityIcon, BilibiliBadgeIcon, DouyinBadgeIcon } from '@/components/icons';
import { PLATFORM_META, type PlatformTheme, type SocialStats } from '../constants';

interface SocialSectionCardProps {
  socialStats: SocialStats[];
  socialLinks: Record<string, string>;
  handleRefresh: (event: MouseEvent<HTMLButtonElement>) => void;
  formatSyncTime: (date: Date) => string;
  getPlatformColor: (name: string) => PlatformTheme;
}

export const SocialSectionCard = ({
  socialStats,
  socialLinks,
  handleRefresh,
  formatSyncTime,
  getPlatformColor,
}: SocialSectionCardProps) => (
  <section className="space-y-6">
    <div className="flex items-center justify-between px-1">
      <h2 className="text-2xl font-semibold text-[#2d1f27] dark:text-white">社交动态</h2>
      <span className="text-sm text-[#7c6a77] dark:text-white/60">数据每日自动同步</span>
    </div>
    <div className="flex flex-wrap gap-5">
      {socialStats.map((stat, index) => {
        const colors = getPlatformColor(stat.name);
        const meta = PLATFORM_META[stat.name] ?? PLATFORM_META.default;
        const isDark = colors.mode === 'dark';
        const chipStyle = { background: colors.chipBackground, color: colors.chipText } as const;
        const badgeStyle = { background: colors.badgeBackground, color: colors.badgeText } as const;
        const footerBorder = isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.75)';
        const skeletonBase = isDark ? 'bg-white/15' : 'bg-black/10';
        const isLoading = stat.loading;
        const hasError = Boolean(stat.error);
        const hasData = !isLoading && !hasError;
        const highlights = stat.extraInfo?.highlights ?? [];
        const hasWeiboDetails = stat.name === 'Weibo' ? highlights.length > 0 || Boolean(stat.extraInfo?.nameplate) : false;
        const hasBilibiliDetails =
          stat.name === 'Bilibili'
            ? Boolean(stat.extraInfo?.liveStatus || stat.extraInfo?.nameplate || stat.extraInfo?.videoDescription)
            : false;
        const hasDouyinDetails =
          stat.name === 'Douyin' ? Boolean(stat.extraInfo?.liveStatus || stat.extraInfo?.works || stat.extraInfo?.likes) : false;
        const hasAnyDetails = hasWeiboDetails || hasBilibiliDetails || hasDouyinDetails;

        return (
          <a
            key={stat.name}
            href={socialLinks[stat.name]}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex min-w-[240px] max-w-[320px] flex-1 flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-400 hover:shadow-xl ${
              isDark ? 'text-white/85' : 'text-[#34232D]'
            }`}
            style={{
              animationDelay: `${index * 60}ms`,
              background: colors.cardBackground,
              borderColor: colors.border,
              boxShadow: colors.cardShadow,
              color: colors.text,
              minHeight: '320px',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: colors.muted }}>
                  {stat.fullName}
                </p>
                <h3 className="mt-2 text-xl font-semibold" style={{ color: colors.primary }}>
                  {stat.shortName}
                </h3>
                {hasData && stat.username && (
                  <p className="mt-1 text-sm" style={{ color: colors.muted }}>
                    {stat.username}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                aria-label={`刷新 ${stat.shortName} 数据`}
                className="group/btn flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 hover:border-opacity-80 active:scale-95"
                style={{
                  background: colors.button.background,
                  borderColor: colors.button.border,
                  boxShadow: colors.button.shadow,
                  color: colors.button.text,
                }}
              >
                <RefreshIcon className="h-3 w-3 transition-transform duration-300 group-hover/btn:rotate-180" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: colors.iconBackground,
                  boxShadow: colors.iconShadow,
                  color: isDark ? '#ffffff' : colors.primary,
                }}
              >
                {stat.name === 'Weibo' ? (
                  <WeiboCommunityIcon className="h-6 w-6" />
                ) : stat.name === 'Bilibili' ? (
                  <BilibiliBadgeIcon className="h-6 w-6" />
                ) : stat.name === 'Douyin' ? (
                  <DouyinBadgeIcon className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-semibold tracking-wide">{stat.shortName}</span>
                )}
              </div>
              <div>
                {isLoading ? (
                  <>
                    <div className={`h-6 w-24 rounded-full ${skeletonBase} animate-pulse`} />
                    <div className={`mt-2 h-3 w-16 rounded-full ${skeletonBase} animate-pulse`} />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-semibold" style={{ color: colors.primary }}>
                      {stat.followers || '——'}
                    </p>
                    <p className="text-xs" style={{ color: colors.muted }}>
                      {meta.followerLabel}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 flex-1 space-y-2 text-[13px]" style={{ color: colors.muted }}>
              {isLoading ? (
                <div className="flex flex-wrap gap-1.5">
                  {[0, 1, 2].map((item) => (
                    <span key={item} className={`h-6 w-24 rounded-full ${skeletonBase} animate-pulse`} />
                  ))}
                </div>
              ) : hasError ? (
                <div className="rounded-2xl border border-dashed px-3 py-2 text-xs" style={{ borderColor: colors.border, color: colors.muted }}>
                  {stat.error ?? '暂时无法获取数据'}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {stat.name === 'Weibo' && stat.extraInfo && (
                    <>
                      {highlights.map((highlight, highlightIndex) => (
                        <span key={`${highlight}-${highlightIndex}`} className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={badgeStyle}>
                          {highlight}
                        </span>
                      ))}
                      {stat.extraInfo.nameplate && (
                        <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={badgeStyle}>
                          {stat.extraInfo.nameplate}
                        </span>
                      )}
                    </>
                  )}

                  {stat.name === 'Bilibili' && stat.extraInfo && (
                    <>
                      {stat.extraInfo.liveStatus && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={badgeStyle}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: colors.primary }} />
                          {stat.extraInfo.liveStatus}
                        </span>
                      )}
                      {stat.extraInfo.nameplate && (
                        <span className="rounded-full px-2.5 py-1 text-[11px]" style={badgeStyle}>
                          ⭐ {stat.extraInfo.nameplate}
                        </span>
                      )}
                      {stat.extraInfo.videoDescription && (
                        <p className="w-full text-[11px]" style={{ color: colors.muted }}>
                          {stat.extraInfo.videoDescription}
                        </p>
                      )}
                    </>
                  )}

                  {stat.name === 'Douyin' && stat.extraInfo && (
                    <>
                      {stat.extraInfo.liveStatus && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={badgeStyle}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: colors.primary }} />
                          {stat.extraInfo.liveStatus}
                        </span>
                      )}
                      {stat.extraInfo.works && (
                        <span className="rounded-full px-2.5 py-1 text-[11px]" style={chipStyle}>
                          {stat.extraInfo.works}
                        </span>
                      )}
                      {stat.extraInfo.likes && (
                        <span className="rounded-full px-2.5 py-1 text-[11px]" style={chipStyle}>
                          {stat.extraInfo.likes}
                        </span>
                      )}
                    </>
                  )}

                  {hasData && !hasAnyDetails && (
                    <span className="text-xs opacity-70">暂无更多信息</span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-auto border-t pt-3 text-[11px]" style={{ borderColor: footerBorder, color: colors.muted }}>
              {!isLoading && stat.lastUpdated && (
                <p>
                  同步时间：<span style={{ color: colors.text }}>{formatSyncTime(stat.lastUpdated)}</span>
                </p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span>{meta.sourceLabel}</span>
                <span style={{ color: colors.primary }}>→</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  </section>
);


