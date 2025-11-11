'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import type { HeroQuickLink, Update } from '../constants';

interface HeroSectionProps {
  totalFollowers: string;
  socialCount: number;
  isLive: boolean;
  nextEvent?: Update;
  traitChips: string[];
  heroQuickLinks: HeroQuickLink[];
}

export const HeroSection = ({
  totalFollowers,
  socialCount,
  isLive,
  nextEvent,
  traitChips,
  heroQuickLinks,
}: HeroSectionProps) => {
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
    <section className="relative mt-4 overflow-hidden rounded-[40px] border border-white/60 bg-white/80 p-4 shadow-md shadow-[#f598b4]/10 backdrop-blur-2xl transition-all duration-700 dark:border-white/10 dark:bg-white/5 sm:mt-6 sm:p-5 md:mt-8 md:p-6 lg:mt-10 lg:p-7">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-18%] top-[-20%] h-56 w-56 rounded-full bg-[#f7bfd3]/35 blur-3xl" />
      <div className="absolute right-[-15%] bottom-[-25%] h-64 w-64 rounded-full bg-[#c8b7ff]/25 blur-[120px]" />
      <div className="hero-light absolute left-[20%] top-[10%] h-28 w-28 rounded-full bg-gradient-to-br from-[#f598b4]/40 to-[#9b5de5]/30" />
      <div className="hero-ribbon absolute right-[18%] top-[15%] h-48 w-12 rotate-12 rounded-full bg-gradient-to-b from-[#f5d0ea]/40 to-[#d9d0ff]/20 opacity-75" />
      <div className="hero-ribbon absolute left-[10%] bottom-[12%] h-44 w-12 -rotate-6 rounded-full bg-gradient-to-b from-[#f5d0ea]/30 to-transparent opacity-65" />
    </div>

    <div className="relative grid gap-6 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
      <div className="flex flex-col gap-[18px]">
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
          <div className="absolute inset-0 animate-hero-orbit rounded-full border border-white/40 bg-gradient-to-br from-[#fcdde9]/70 via-[#f1d6ff]/50 to-[#d8fff5]/40 shadow-[0_0_60px_rgba(249,152,180,0.25)] backdrop-blur-xl dark:border-white/10" />
          <div className="absolute -inset-2 animate-hero-glow rounded-[28px] bg-gradient-to-br from-[#f598b4]/35 via-transparent to-transparent blur-lg" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-white shadow-xl shadow-[#f598b4]/25 dark:border-white/20">
            <Image
              src="/images/avatar.webp"
              alt="罗雪儿"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 220px, 256px"
            />
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-white to-[#fdf1f5] p-3 text-center shadow-sm shadow-[#f598b4]/20 dark:from-white/10 dark:to-white/5">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#b18da7] dark:text-white/50">粉丝总数</p>
            <p className="mt-1 text-xl font-semibold text-[#9b5de5] sm:text-2xl">{totalFollowers}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-white to-[#eef6ff] p-3 text-center shadow-sm shadow-[#60a5fa]/15 dark:from-white/10 dark:to-white/5">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#5f6d86] dark:text-white/50">活跃平台</p>
            <p className="mt-1 text-xl font-semibold text-[#3b82f6] sm:text-2xl">{socialCount}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-white to-[#e9fbf5] p-3 text-center shadow-sm shadow-[#87d6ba]/20 dark:from-white/10 dark:to-white/5">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#4c7866] dark:text-white/50">年度计划</p>
            <p className="mt-1.5 text-base font-semibold text-[#2d4f47] dark:text-white">概念专辑 + 全国巡演</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[18px]">
        <div className="space-y-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#2d1f27] sm:text-[30px] lg:text-[34px] dark:text-white">罗雪儿</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#b6a3b1] dark:text-white/50">Xueer Luo</p>
          </div>
          <p className="text-sm leading-relaxed text-[#5e4b55] sm:text-base dark:text-white/70">
            Find your own color and be unique.
          </p>
          <div className="flex flex-wrap gap-2">
            {traitChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-gradient-to-r from-[#fce0eb]/70 to-[#f2e7ff]/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#9b5de5] shadow-sm shadow-[#9b5de5]/15 backdrop-blur-sm dark:from-white/10 dark:to-white/10 dark:text-white"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
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
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#E77A9A] to-[#f598b4] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#E77A9A]/35 transition-all duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#fef0f5]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-[#fbd0de]/40"
              aria-haspopup="true"
              aria-expanded={isFollowMenuOpen}
              onClick={handleFollowClick}
            >
              立即关注
              <svg
                className="h-3.5 w-3.5 text-white/90 transition-transform duration-200"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 8l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isFollowMenuOpen ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-52 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-lg shadow-[#f598b4]/20 backdrop-blur-xl transition-all duration-200 dark:border-white/15 dark:bg-[#1f1a22]/95">
                <p className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b6a3b1] dark:text-white/50">
                  关注平台
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleFollowOptionSelect(
                      'https://space.bilibili.com/406895348'
                    )
                  }
                  className="mt-2 inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-[#E77A9A] transition-colors duration-200 hover:bg-[#fde9f0]/80 hover:text-[#b85673] focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-[#f8a3bf] dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#1f1a22]"
                >
                  <span>关注B站账号</span>
                  <span className="text-xs">→</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleFollowOptionSelect('https://weibo.com/6106700809')
                  }
                  className="mt-1 inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-[#E77A9A] transition-colors duration-200 hover:bg-[#fde9f0]/80 hover:text-[#b85673] focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-[#f8a3bf] dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#1f1a22]"
                >
                  <span>关注微博账号</span>
                  <span className="text-xs">→</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleFollowOptionSelect(
                      'https://www.douyin.com/user/MS4wLjABAAAAqouaurDx80BjbJ2NKG7xNDFnyFVIlrtaPq5RcoVixNO37bOt4NYHgFqvjDsBWXIr'
                    )
                  }
                  className="mt-1 inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-[#E77A9A] transition-colors duration-200 hover:bg-[#fde9f0]/80 hover:text-[#b85673] focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-[#f8a3bf] dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#1f1a22]"
                >
                  <span>关注抖音账号</span>
                  <span className="text-xs">→</span>
                </button>
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
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#f6d5df] bg-white/70 px-[18px] py-2 text-sm font-semibold text-[#E77A9A] shadow-sm shadow-[#f598b4]/15 transition-all duration-300 hover:border-[#E77A9A]/50 focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:border-white/20 dark:bg-white/10 dark:text-white"
              aria-haspopup="true"
              aria-expanded={isLiveMenuOpen}
              onClick={handleLiveClick}
            >
              <span className="h-2 w-2 rounded-full bg-[#E77A9A]" />
              观看直播
              <svg
                className="h-3.5 w-3.5 text-[#E77A9A] transition-transform duration-200 dark:text-white"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 8l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isLiveMenuOpen ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-lg shadow-[#f598b4]/15 backdrop-blur-xl transition-all duration-200 dark:border-white/15 dark:bg-[#1f1a22]/95">
                <p className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b6a3b1] dark:text-white/50">
                  选择平台
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleLiveOptionSelect('https://live.bilibili.com/')
                  }
                  className="mt-2 inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-[#E77A9A] transition-colors duration-200 hover:bg-[#fde9f0]/80 hover:text-[#b85673] focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-[#f8a3bf] dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#1f1a22]"
                >
                  <span>前往B站直播间</span>
                  <span className="text-xs">→</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLiveOptionSelect('https://live.douyin.com/')
                  }
                  className="mt-1 inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-[#E77A9A] transition-colors duration-200 hover:bg-[#fde9f0]/80 hover:text-[#b85673] focus-visible:ring-2 focus-visible:ring-[#f598b4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-[#f8a3bf] dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#1f1a22]"
                >
                  <span>前往抖音直播间</span>
                  <span className="text-xs">→</span>
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ede1ff] bg-white/70 px-[18px] py-2 text-sm font-semibold text-[#9b5de5] shadow-sm shadow-[#9b5de5]/15 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9b5de5]/40 dark:border-white/20 dark:bg-white/10 dark:text-white"
            onClick={handleContactClick}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M2.94 5.5 10 10.5l7.06-5H2.94zM2 6.65v7.35h16V6.66l-8 5.67-8-5.68z" />
            </svg>
            联系合作
          </button>
          {isEmailVisible ? (
            <div
              className="inline-flex items-center gap-1 rounded-full border border-[#ede1ff]/60 bg-white/80 px-3 py-1 text-xs font-medium text-[#9b5de5] shadow-sm shadow-[#9b5de5]/15 backdrop-blur-md transition-opacity duration-300 dark:border-white/15 dark:bg-white/10 dark:text-white"
              aria-live="polite"
            >
              <span>商务邮箱：</span>
              <a
                href="mailto:923755084@qq.com"
                className="underline decoration-[#9b5de5]/60 underline-offset-2 transition-colors duration-200 hover:text-[#7c4bd6] dark:hover:text-white"
              >
                923755084@qq.com
              </a>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/75 p-3 shadow-inner shadow-[#f598b4]/10 backdrop-blur-md dark:border-white/15 dark:bg-white/10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8a0af] dark:text-white/50">下一场直播</p>
              <p className="text-lg font-semibold text-[#2d1f27] dark:text-white">
                {nextEvent ? nextEvent.title : '巡演规划中，敬请期待'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#7c6a77] dark:text-white/70">
              <span className="flex items-center gap-1 rounded-full bg-[#fce9f1]/80 px-2 py-0.5 font-medium text-[#E77A9A] dark:bg-white/10 dark:text-white">
                {nextEvent ? nextEvent.date : '待定'}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-[#f2ebff]/80 px-2 py-0.5 font-medium text-[#9b5de5] dark:bg-white/10 dark:text-white">
                {isLive ? '直播预热中' : '提前预约通知'}
              </span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-[#E77A9A] shadow-sm shadow-[#f598b4]/20 backdrop-blur-sm dark:bg-white/10 dark:text-white">
              今日互动 +128
            </span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-[#9b5de5] shadow-sm shadow-[#9b5de5]/20 backdrop-blur-sm dark:bg-white/10 dark:text-white">
              今日心情：Sunny
            </span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-[#87d6ba] shadow-sm shadow-[#87d6ba]/20 backdrop-blur-sm dark:bg-white/10 dark:text-white">
              最新单曲《Gelato》
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {heroQuickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-[110px] flex-1 items-center justify-between rounded-2xl border border-white/70 bg-white/75 px-3 py-2 text-sm shadow-sm shadow-[#f598b4]/15 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E77A9A]/35 hover:shadow-lg dark:border-white/15 dark:bg-white/10"
            >
              <div>
                <p className="font-semibold text-[#2d1f27] dark:text-white">{link.label}</p>
                <p className="text-[11px] text-[#8f7a88] transition-colors duration-300 group-hover:text-[#E77A9A] dark:text-white/60">
                  {link.description}
                </p>
              </div>
              <span className="text-sm text-[#E77A9A] transition-transform duration-300 group-hover:translate-x-1 dark:text-[#f8a3bf]">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
};
