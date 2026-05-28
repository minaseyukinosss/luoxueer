'use client';

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/shared/components/providers/LocaleProvider';
import { RefreshIcon, WeiboCommunityIcon, BilibiliBadgeIcon, DouyinBadgeIcon } from '@/shared/components/icons';
import { type SocialStats } from "@/features/about/constants";

interface SocialSectionCreativeProps {
  socialStats: SocialStats[];
  socialLinks: Record<string, string>;
  handleRefresh: (event: MouseEvent<HTMLButtonElement>) => void;
  formatSyncTime: (date: Date) => string;
}

const ORBIT_META: Record<
  string,
  {
    label: string;
    color: string;
    nodeClass: string;
    path: string;
  }
> = {
  Weibo: {
    label: 'Community',
    color: '#e95a2d',
    nodeClass: 'left-[7%] top-[23%]',
    path: 'M50 50 C38 45 30 33 17 31',
  },
  Bilibili: {
    label: 'Live Room',
    color: '#f26f9f',
    nodeClass: 'right-[6%] top-[20%]',
    path: 'M50 50 C62 38 74 31 84 30',
  },
  Douyin: {
    label: 'Video',
    color: '#12cfc9',
    nodeClass: 'left-1/2 bottom-[7%] -translate-x-1/2',
    path: 'M50 50 C44 65 48 78 50 86',
  },
};

const STAR_COLORS = ['#f26f9f', '#12cfc9', '#8dd4e8', '#e95a2d', '#ffffff'];

const hexToRgba = (hex: string, alpha: number) => {
  const value = hex.replace('#', '');
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const ConstellationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let stars: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      phase: number;
      color: string;
    }[] = [];

    const createStars = () => {
      const count = Math.min(32, Math.max(14, Math.floor((width * height) / 9500)));
      stars = Array.from({ length: count }, (_, index) => {
        const angle = (index * 137.5 * Math.PI) / 180;
        const spread = 0.28 + ((index * 29) % 100) / 140;
        return {
          x: width * (0.5 + Math.cos(angle) * spread * 0.46) + ((index * 19) % 31) - 15,
          y: height * (0.5 + Math.sin(angle) * spread * 0.38) + ((index * 23) % 29) - 14,
          radius: 0.7 + ((index * 7) % 13) / 10,
          vx: ((index % 5) - 2) * 0.075,
          vy: (((index * 3) % 5) - 2) * 0.06,
          phase: index * 0.48,
          color: STAR_COLORS[index % STAR_COLORS.length],
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars();
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);

      const gradient = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.62);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.52)');
      gradient.addColorStop(0.45, 'rgba(255, 240, 248, 0.18)');
      gradient.addColorStop(1, 'rgba(219, 246, 247, 0.05)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      stars.forEach((star, index) => {
        if (!reduceMotion) {
          star.x += star.vx;
          star.y += star.vy;
          if (star.x < -12) star.x = width + 12;
          if (star.x > width + 12) star.x = -12;
          if (star.y < -12) star.y = height + 12;
          if (star.y > height + 12) star.y = -12;
        }

        for (let next = index + 1; next < stars.length; next += 1) {
          const other = stars[next];
          const dx = star.x - other.x;
          const dy = star.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 96) {
            const opacity = (1 - distance / 96) * 0.14;
            context.strokeStyle = `rgba(226, 111, 159, ${opacity})`;
            context.lineWidth = 0.45;
            context.beginPath();
            context.moveTo(star.x, star.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        const pulse = reduceMotion ? 0.75 : 0.58 + Math.sin(time / 520 + star.phase) * 0.2;
        context.beginPath();
        context.fillStyle = hexToRgba(star.color, 0.32 + pulse * 0.22);
        context.shadowColor = star.color;
        context.shadowBlur = 5 + pulse * 6;
        context.arc(star.x, star.y, star.radius + pulse * 0.4, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });

      if (!reduceMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
};

const getPlatformIcon = (name: string, className = 'h-5 w-5') => {
  if (name === 'Weibo') return <WeiboCommunityIcon className={className} />;
  if (name === 'Bilibili') return <BilibiliBadgeIcon className={className} />;
  return <DouyinBadgeIcon className={className} />;
};

const PlatformAvatar = ({
  name,
  avatar,
  accentColor,
  containerClassName,
  iconClassName,
  roundedClassName = 'rounded-xl',
}: {
  name: string;
  avatar?: string;
  accentColor: string;
  containerClassName: string;
  iconClassName?: string;
  roundedClassName?: string;
}) => {
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const showAvatar = Boolean(avatar) && failedAvatar !== avatar;

  return (
    <span
      className={`relative overflow-hidden ${roundedClassName} ${containerClassName}`}
      style={{ background: `${accentColor}14` }}
    >
      {showAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- 社交平台头像来自多个外部 CDN，需原生 img 加载
        <img
          src={avatar}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedAvatar(avatar ?? null)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center" style={{ color: accentColor }}>
          {getPlatformIcon(name, iconClassName)}
        </span>
      )}
    </span>
  );
};

const getStatusLabel = (stat: SocialStats) => {
  if (stat.error) return 'Paused';
  if (stat.loading) return 'Syncing';
  if (stat.extraInfo?.isLive) return 'Live';
  return null;
};

type PlatformInsight = {
  key: string;
  label: string;
  accent?: boolean;
  truncate?: boolean;
};

const truncateText = (text: string, max = 32) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const getPlatformInsights = (stat: SocialStats): PlatformInsight[] => {
  if (stat.loading || stat.error) return [];

  const info = stat.extraInfo;
  if (!info) return [];

  switch (stat.name) {
    case 'Weibo': {
      const items: PlatformInsight[] = [];
      info.highlights?.slice(0, 4).forEach((highlight, index) => {
        items.push({ key: `highlight-${index}`, label: highlight });
      });
      return items;
    }
    case 'Bilibili': {
      const items: PlatformInsight[] = [];
      if (info.level) {
        items.push({ key: 'level', label: `Lv.${info.level}` });
      }
      if (info.isLive && info.liveTitle) {
        items.push({ key: 'live', label: info.liveTitle, accent: true, truncate: true });
      } else if (info.videoDescription) {
        items.push({
          key: 'signature',
          label: truncateText(info.videoDescription.replace(/\n/g, ' ')),
          truncate: true,
        });
      }
      return items;
    }
    case 'Douyin': {
      const items: PlatformInsight[] = [];
      if (info.works) items.push({ key: 'works', label: info.works });
      if (info.likes) items.push({ key: 'likes', label: info.likes });
      if (info.isLive && info.liveStatus) {
        items.push({ key: 'live', label: info.liveStatus, accent: true });
      }
      return items;
    }
    default:
      return [];
  }
};

const PlatformInsightChips = ({
  insights,
  accentColor,
}: {
  insights: PlatformInsight[];
  accentColor: string;
}) => {
  if (insights.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {insights.map((insight) => (
        <span
          key={insight.key}
          className={`inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-[0.6rem] font-medium leading-4 ${
            insight.truncate ? 'truncate' : ''
          }`}
          style={
            insight.accent
              ? { color: '#ff4b8b', background: 'rgba(255, 75, 139, 0.1)' }
              : { color: accentColor, background: `${accentColor}14` }
          }
          title={insight.label}
        >
          {insight.label}
        </span>
      ))}
    </div>
  );
};

export const SocialSectionCreative = ({
  socialStats,
  socialLinks,
  handleRefresh,
  formatSyncTime,
}: SocialSectionCreativeProps) => {
  const { t } = useLocale();

  if (socialStats.length === 0) return null;

  return (
    <section className="relative w-full scroll-mt-24 py-8">
      <div className="mb-6 flex items-end justify-between gap-4 px-1">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.24em] text-[#9b7c8a]">
            <span className="h-px w-8 bg-[#e7a6bd]" />
            Social Orbit
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2d1f27] dark:text-white">
            {t.aboutPage.socialDynamics}
          </h2>
        </div>

        <button
          onClick={handleRefresh}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#ead8df] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b5260] shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#e7a6bd] hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white/70"
          aria-label="刷新数据"
        >
          <RefreshIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
          Sync
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="social-orbit-card relative min-h-[420px] overflow-hidden rounded-[32px] border border-white/70 bg-white/72 shadow-[0_16px_48px_-36px_rgba(50,24,38,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
          <div className="social-orbit-ambient pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.82),transparent_24%),radial-gradient(circle_at_72%_22%,rgba(18,207,201,0.14),transparent_31%),radial-gradient(circle_at_16%_24%,rgba(233,90,45,0.1),transparent_29%),radial-gradient(circle_at_34%_76%,rgba(242,111,159,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(244,250,253,0.58))]" />
          <ConstellationCanvas />

          <svg
            className="social-orbit-network pointer-events-none absolute inset-0 z-[1] h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="orbitBeamWarm" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#e95a2d" stopOpacity="0.18" />
                <stop offset="48%" stopColor="#f26f9f" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#12cfc9" stopOpacity="0.18" />
              </linearGradient>
              <filter id="orbitBeamGlow">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <ellipse className="social-orbit-svg-ring social-orbit-svg-ring--outer" cx="50" cy="50" rx="40" ry="34" />
            <ellipse className="social-orbit-svg-ring social-orbit-svg-ring--middle" cx="50" cy="50" rx="28" ry="23" />
            <ellipse className="social-orbit-svg-ring social-orbit-svg-ring--inner" cx="50" cy="50" rx="15" ry="13" />
            {socialStats.map((stat, index) => {
              const meta = ORBIT_META[stat.name] ?? ORBIT_META.Weibo;

              return (
                <g key={`beam-${stat.name}`} style={{ '--orbit-accent': meta.color, animationDelay: `${index * 0.42}s` } as CSSProperties}>
                  <path className="social-orbit-beam social-orbit-beam--base" d={meta.path} />
                  <path className="social-orbit-beam social-orbit-beam--pulse" d={meta.path} />
                </g>
              );
            })}
          </svg>

          <div className="social-orbit-core absolute left-1/2 top-1/2 z-[3] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/76 text-center shadow-[0_12px_32px_-28px_rgba(245,152,180,0.38)] backdrop-blur-xl sm:h-28 sm:w-28">
            <span className="social-orbit-core-ring pointer-events-none absolute inset-[-12px] rounded-full border border-white/42" />
            <span className="social-orbit-core-glow pointer-events-none absolute inset-[-22px] rounded-full bg-[radial-gradient(circle,rgba(245,152,180,0.14),transparent_68%)]" />
            <div>
              <p className="text-[0.62rem] font-mono uppercase tracking-[0.2em] text-[#a58b99]">
                Luoxueer
              </p>
              <p className="mt-1 text-lg font-black tracking-tight text-[#2d1f27] sm:text-xl">
                Signal
              </p>
            </div>
          </div>

          {socialStats.map((stat, index) => {
            const meta = ORBIT_META[stat.name] ?? ORBIT_META.Weibo;
            const statusLabel = getStatusLabel(stat);

            return (
              <div key={stat.name}>
                <a
                  href={socialLinks[stat.name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-orbit-node group absolute z-[4] flex min-w-[6.45rem] items-center gap-2 rounded-2xl border border-white/78 bg-white/82 px-2.5 py-2 shadow-sm shadow-[#f598b4]/12 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-w-[7.25rem] sm:px-3 ${meta.nodeClass}`}
                  style={{ '--orbit-accent': meta.color, animationDelay: `${index * 0.35}s` } as CSSProperties}
                >
                  <span className="social-orbit-node-ring pointer-events-none absolute inset-[-8px] -z-10 rounded-[24px]" />
                  <span
                    className="pointer-events-none absolute inset-[-10px] -z-10 rounded-[22px] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `${meta.color}2b` }}
                  />
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9"
                    style={{ color: meta.color, background: `${meta.color}14` }}
                  >
                    {getPlatformIcon(stat.name, 'h-[18px] w-[18px] sm:h-5 sm:w-5')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#2d1f27]">
                      {stat.shortName || stat.fullName}
                    </span>
                    <span className="block text-[0.62rem] font-mono uppercase tracking-[0.16em] text-[#9d8692]">
                      0{index + 1}
                    </span>
                  </span>
                  {statusLabel === 'Live' ? (
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#ff4b8b] ring-4 ring-white" />
                  ) : null}
                </a>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3">
          {socialStats.map((stat, index) => {
            const meta = ORBIT_META[stat.name] ?? ORBIT_META.Weibo;
            const platformKey = stat.name.toLowerCase() as keyof typeof t.aboutPage.platformMeta;
            const platformMeta = t.aboutPage.platformMeta[platformKey] ?? t.aboutPage.platformMeta.default;
            const followers = stat.loading ? '...' : stat.error ? '--' : stat.followers || '0';
            const statusLabel = getStatusLabel(stat);
            const platformInsights = getPlatformInsights(stat);

            return (
              <article
                key={stat.name}
                className="group relative grid grid-cols-[auto_1fr] items-start gap-3 rounded-[24px] border border-white/70 bg-white/76 p-4 shadow-sm shadow-[#f598b4]/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-4 dark:border-white/10 dark:bg-white/[0.06]"
              >
                <PlatformAvatar
                  name={stat.name}
                  avatar={stat.avatar}
                  accentColor={meta.color}
                  containerClassName="h-12 w-12"
                  iconClassName="h-6 w-6"
                  roundedClassName="rounded-2xl"
                />

                <div className="min-w-0 pr-12 sm:pr-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-[0.64rem] tracking-[0.08em] text-[#a58b99]">
                      0{index + 1} / {stat.shortName || stat.fullName}
                    </p>
                    {statusLabel ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white"
                        style={{ background: statusLabel === 'Live' ? '#ff4b8b' : '#b9a5af' }}
                      >
                        {statusLabel}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-[#2d1f27] dark:text-white">
                    {stat.loading && !stat.username ? '...' : stat.username}
                  </h3>
                  <PlatformInsightChips insights={platformInsights} accentColor={meta.color} />
                  <p className="mt-1.5 truncate text-[0.625rem] leading-4 text-[#a58b99]/80 dark:text-white/35">
                    {!stat.loading && stat.lastUpdated ? `${t.aboutPage.lastSync} ${formatSyncTime(stat.lastUpdated)}` : platformMeta.source}
                  </p>
                </div>

                <div className="col-start-2 flex items-baseline gap-2 text-left sm:col-auto sm:block sm:text-right">
                  <p className="shrink-0 text-[0.62rem] font-mono uppercase tracking-[0.18em] text-[#a58b99]">
                    {platformMeta.follower}
                  </p>
                  <p
                    className="text-xl font-black leading-none sm:mt-1 sm:text-2xl"
                    style={{ color: meta.color }}
                  >
                    {followers}
                  </p>
                </div>

                <a
                  href={socialLinks[stat.name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#8f5f73] shadow-sm shadow-[#f598b4]/10 transition-all hover:-translate-y-0.5 hover:text-[#e77a9a] hover:shadow-md sm:static"
                  aria-label={`${t.aboutPage.visitHome} ${stat.fullName}`}
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-4 px-2">
        <p className="text-center text-xs leading-relaxed text-[#7c6a77]/70 dark:text-white/40">
          {t.aboutPage.dataDisclaimer}
        </p>
      </div>
    </section>
  );
};
