'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown, LoaderCircle, Mail, Radio } from 'lucide-react';
import { SocialSkeleton } from './SocialSkeleton';
import { useLocale } from '@/shared/components/providers/LocaleProvider';

import type { HeroQuickLink } from "@/features/about/constants";

interface HeroSectionProps {
  totalFollowers: string;
  totalFollowersLoading: boolean;
  socialCount: number;
  isLive: boolean;
  traitChips: string[];
  heroQuickLinks: HeroQuickLink[];
}

const MenuOption = ({
  label,
  onClick,
  className = "mt-1",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`${className} inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-[#6b5260] transition-colors duration-200 hover:bg-[#f26f9f]/10 hover:text-[#e77a9a] focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-[#1f1a22]`}
  >
    <span>{label}</span>
    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
  </button>
);

export const HeroSection = ({
  totalFollowers,
  totalFollowersLoading,
  socialCount,
  isLive,
  traitChips,
  heroQuickLinks,
}: HeroSectionProps) => {
  const { t } = useLocale();
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [isFollowMenuOpen, setIsFollowMenuOpen] = useState(false);
  const [isLiveMenuOpen, setIsLiveMenuOpen] = useState(false);
  const followMenuRef = useRef<HTMLDivElement>(null);
  const liveMenuRef = useRef<HTMLDivElement>(null);

  const handleContactClick = () => {
    setIsEmailVisible(true);
  };

  const handleLiveClick = () => {
    setIsLiveMenuOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setIsFollowMenuOpen(false);
      }
      return next;
    });
  };

  const handleFollowClick = () => {
    setIsFollowMenuOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setIsLiveMenuOpen(false);
      }
      return next;
    });
  };

  const navigateToExternal = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLiveOptionSelect = (url: string) => {
    setIsLiveMenuOpen(false);
    navigateToExternal(url);
  };

  const handleFollowOptionSelect = (url: string) => {
    setIsFollowMenuOpen(false);
    navigateToExternal(url);
  };

  useEffect(() => {
    if (!isLiveMenuOpen && !isFollowMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isLiveMenuOpen &&
        liveMenuRef.current &&
        !liveMenuRef.current.contains(target)
      ) {
        setIsLiveMenuOpen(false);
      }

      if (
        isFollowMenuOpen &&
        followMenuRef.current &&
        !followMenuRef.current.contains(target)
      ) {
        setIsFollowMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isLiveMenuOpen) {
          setIsLiveMenuOpen(false);
        }

        if (isFollowMenuOpen) {
          setIsFollowMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFollowMenuOpen, isLiveMenuOpen]);

  return (
    <section aria-labelledby="about-hero-title" className="relative mt-4 rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(255,255,255,0.72)),radial-gradient(circle_at_16%_18%,rgba(242,111,159,0.16),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(18,207,201,0.1),transparent_28%),radial-gradient(circle_at_78%_88%,rgba(233,90,45,0.08),transparent_26%)] shadow-[0_16px_48px_-36px_rgba(50,24,38,0.28)] backdrop-blur-xl sm:mt-6 lg:mt-8 dark:border-white/10 dark:bg-white/[0.06] dark:bg-none">
      <div className="relative grid grid-cols-[104px_minmax(0,1fr)] gap-x-5 gap-y-6 px-5 py-7 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-x-8 sm:px-8 sm:py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-4 lg:px-10 lg:py-10">
        <div className="relative isolate col-start-1 row-start-1 self-center lg:row-span-2">
          <div className="absolute inset-0 -rotate-[5deg] rounded-t-[100px] rounded-b-2xl bg-[#f26f9f]/30 dark:bg-[#f26f9f]/30" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[100px] rounded-b-2xl border-[3px] border-white bg-[#fde9f0] shadow-[0_16px_32px_-22px_rgba(69,38,56,0.4)] dark:border-white/15">
            <Image src="/images/avatar.webp" alt="罗雪儿" fill priority sizes="(min-width: 1024px) 280px, (min-width: 640px) 150px, 104px" className="object-cover object-[45%_55%]" />
          </div>
        </div>

        <div className="col-start-2 row-start-1 self-center">
          <h1 id="about-hero-title" className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-tight tracking-tight text-[#2d1f27] dark:text-white">{t.aboutPage.title}</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[#a58b99] sm:text-xs dark:text-white/50">{t.aboutPage.subtitle}</p>
        </div>

        <div className="col-span-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-2">
          <p className="text-base leading-relaxed text-[#7c6a77] dark:text-white/70">{t.aboutPage.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {traitChips.map((chip) => (
              <span key={chip} className="inline-flex items-center gap-2 text-xs text-[#a58b99] dark:text-white/50"><span className="h-1 w-1 rounded-full bg-[#f26f9f]" aria-hidden="true" />{chip}</span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-start gap-2">
          <div
            ref={followMenuRef}
            className="relative"
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget as Node)
              ) {
                setIsFollowMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 min-h-11 rounded-full bg-[#f26f9f] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#e45688] focus-visible:ring-2 focus-visible:ring-[#f26f9f]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:bg-[#f26f9f] dark:text-white dark:hover:bg-[#e45688]"
              aria-haspopup="true"
              aria-expanded={isFollowMenuOpen}
              onClick={handleFollowClick}
            >
              {t.aboutPage.followNow}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {isFollowMenuOpen ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-52 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-lg shadow-[#f598b4]/20 backdrop-blur-xl transition-all duration-200 dark:border-white/15 dark:bg-[#1f1a22]/95">
                <p className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#a58b99] dark:text-white/50">
                  {t.aboutPage.followPlatform}
                </p>
                <MenuOption
                  label={t.aboutPage.heroLinks.bilibili}
                  onClick={() => handleFollowOptionSelect('https://space.bilibili.com/406895348')}
                  className="mt-2"
                />
                <MenuOption
                  label={t.aboutPage.heroLinks.weibo}
                  onClick={() => handleFollowOptionSelect('https://weibo.com/6106700809')}
                />
                <MenuOption
                  label={t.aboutPage.heroLinks.douyin}
                  onClick={() =>
                    handleFollowOptionSelect(
                      'https://www.douyin.com/user/MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr'
                    )
                  }
                />
              </div>
            ) : null}
          </div>
          <div
            ref={liveMenuRef}
            className="relative"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsLiveMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 min-h-11 rounded-full border border-[#ead8df] bg-white/75 px-4 py-2.5 text-sm font-semibold text-[#6b5260] transition-colors duration-200 hover:border-[#e7a6bd] hover:bg-white focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:border-white/15 dark:bg-white/5 dark:text-white/80"
              aria-haspopup="true"
              aria-expanded={isLiveMenuOpen}
              onClick={handleLiveClick}
            >
              <span className="h-2 w-2 rounded-full bg-[#ff4b8b]" />
              {t.aboutPage.watchLive}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {isLiveMenuOpen ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-lg shadow-[#f598b4]/15 backdrop-blur-xl transition-all duration-200 dark:border-white/15 dark:bg-[#1f1a22]/95">
                <p className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#a58b99] dark:text-white/50">
                  {t.aboutPage.selectPlatform}
                </p>
                <MenuOption
                  label={t.aboutPage.heroLinks.bilibili}
                  onClick={() => handleLiveOptionSelect('https://live.bilibili.com/27047605')}
                  className="mt-2"
                />
                <MenuOption
                  label={t.aboutPage.heroLinks.douyin}
                  onClick={() => handleLiveOptionSelect('https://www.douyin.com/user/MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr')}
                />
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 min-h-11 rounded-full border border-[#12cfc9]/30 bg-[#12cfc9]/12 px-4 py-2.5 text-sm font-semibold text-[#6b5260] transition-colors duration-200 hover:border-[#12cfc9]/60 hover:bg-[#12cfc9]/20 hover:text-[#2d1f27] focus-visible:ring-2 focus-visible:ring-[#12cfc9]/50 dark:border-[#12cfc9]/30 dark:bg-[#12cfc9]/15 dark:text-white/80 dark:hover:text-white"
            onClick={handleContactClick}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {t.aboutPage.contact}
          </button>

        </div>
          <div className="mt-2 min-h-6 text-xs leading-6 text-[#a58b99] dark:text-white/50" aria-live="polite">
            {isEmailVisible ? <span>{t.businessEmail} <a href="mailto:923755084@qq.com" className="underline decoration-[#e7a6bd] underline-offset-4">923755084@qq.com</a></span> : null}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-y-4 border-t border-[#ead8df]/70 pt-4 sm:grid-cols-[1fr_0.85fr_1.5fr] dark:border-white/10">
            <div className="pr-4">
              <dt className="text-xs text-[#a58b99] dark:text-white/50">{t.aboutPage.followers}</dt>
              <dd aria-busy={totalFollowersLoading} data-testid="total-followers" className="mt-1 flex min-h-9 items-center text-2xl font-semibold leading-9 tabular-nums text-[#f26f9f] sm:text-[28px] dark:text-[#f26f9f]">
                {totalFollowersLoading && totalFollowers === '——' ? (
                  <><SocialSkeleton className="h-7 w-24" /><span className="sr-only">{t.aboutPage.loading}</span></>
                ) : (
                  <span className="relative inline-block">
                    {totalFollowers}
                    {totalFollowersLoading ? <span className="absolute -right-5 top-1/2 -translate-y-1/2"><LoaderCircle className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" /><span className="sr-only">{t.aboutPage.refreshing}</span></span> : null}
                  </span>
                )}
              </dd>
            </div>
            <div className="border-l border-[#ead8df]/70 px-4 dark:border-white/10">
              <dt className="text-xs text-[#a58b99] dark:text-white/50">{t.aboutPage.activePlatforms}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-[#12cfc9] sm:text-[28px] dark:text-[#12cfc9]">{socialCount}</dd>
            </div>
            <div className="col-span-2 border-t border-[#ead8df]/70 pt-3 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 dark:border-white/10">
              <dt className="text-xs text-[#a58b99] dark:text-white/50">{t.aboutPage.annualPlan}</dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-[#2d1f27] dark:text-white/85">{t.aboutPage.annualPlanDesc}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="relative border-t border-[#ead8df]/60 bg-white/40 px-5 py-5 sm:px-8 lg:px-10 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-5 gap-y-3 sm:grid-cols-[44px_minmax(0,1fr)_auto]">
          <div className="row-span-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f26f9f]/14 text-[#f26f9f] sm:row-span-1 dark:text-[#f26f9f]" aria-hidden="true"><Radio className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[#a58b99] dark:text-white/50">{t.aboutPage.nextLive}</p>
            <p className="mt-1 text-base font-semibold text-[#2d1f27] dark:text-white">{t.aboutPage.planning}</p>
          </div>
          <div className="col-start-2 flex flex-wrap items-center gap-2 text-xs sm:col-start-auto">
            <span className="rounded-full bg-[#12cfc9]/20 px-3 py-1.5 font-medium text-[#6b5260] dark:text-white/80">待定</span>
            <span className="text-[#a58b99] dark:text-white/50">{isLive ? t.aboutPage.liveWarming : t.aboutPage.advanceNotice}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#a58b99] sm:pl-16 dark:text-white/50">
          <span>{t.aboutPage.todayInteraction}</span><span>{t.aboutPage.todayMood}</span><span className="font-medium text-[#12cfc9] dark:text-[#12cfc9]">{t.aboutPage.latestSingle}</span>
        </div>
      </div>

      <div className="relative grid grid-cols-3 divide-x divide-[#ead8df]/70 px-5 py-4 sm:px-8 lg:px-10 dark:divide-white/10">
        {heroQuickLinks.map((link, index) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={`group flex min-w-0 items-center justify-between gap-2 py-2 sm:gap-3 text-[#2d1f27] transition-colors hover:text-[#e77a9a] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-[#e77a9a] sm:py-1 ${index > 0 ? 'pl-2 sm:pl-5' : ''} ${index < heroQuickLinks.length - 1 ? 'pr-2 sm:pr-5' : ''} dark:text-white/80 dark:hover:text-white`}>
            <span className="min-w-0"><span className="block text-sm font-semibold">{link.label}</span><span className="mt-1 hidden truncate text-xs text-[#a58b99] sm:block dark:text-white/50">{link.description}</span></span>
            <ArrowUpRight className="h-4 w-4 shrink-0" style={{ color: link.href.includes('weibo') ? '#e95a2d' : link.href.includes('bilibili') ? '#f26f9f' : '#12cfc9' }} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
};
