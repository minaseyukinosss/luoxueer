'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/shared/components/providers/LocaleProvider';
import {
  getLockedUpdateIndex,
  getUpdateShowcaseState,
  getUpdateTargetProgress,
} from '@/features/about/lib/update-showcase';

import type { Update } from "@/features/about/constants";

interface UpdatesSectionProps {
  updates: Update[];
}

export const UpdatesSection = ({
  updates,
}: UpdatesSectionProps) => {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const navigationLockRef = useRef<{
    index: number;
    targetScrollY: number;
  } | null>(null);
  const navigationLockTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedUpdates = useMemo(() => updates.filter(Boolean), [updates]);
  const totalUpdates = normalizedUpdates.length;
  const formatUpdateIndex = (index: number) => String(index + 1).padStart(2, '0');
  const getCategoryLabel = (update: Update) => t.aboutPage.filters[update.category];

  const setDisplayedIndex = useCallback((index: number) => {
    setActiveIndex((currentIndex) => (currentIndex === index ? currentIndex : index));
  }, []);

  useEffect(() => {
    const updateActiveIndex = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const state = getUpdateShowcaseState({
        itemCount: normalizedUpdates.length,
        sectionTop: rect.top,
        sectionHeight: rect.height,
        viewportHeight: window.innerHeight,
      });

      const navigationLock = navigationLockRef.current;

      if (navigationLock) {
        const lockedIndex = getLockedUpdateIndex({
          currentScrollY: window.scrollY,
          expiresAt: 1,
          index: navigationLock.index,
          itemCount: normalizedUpdates.length,
          now: 0,
          targetScrollY: navigationLock.targetScrollY,
        });

        if (lockedIndex !== null) {
          setDisplayedIndex(lockedIndex);
          return;
        }

        navigationLockRef.current = null;
      }

      setDisplayedIndex(state.activeIndex);
    };

    updateActiveIndex();
    window.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);

    return () => {
      window.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
      if (navigationLockTimeoutRef.current) {
        window.clearTimeout(navigationLockTimeoutRef.current);
        navigationLockTimeoutRef.current = null;
      }
    };
  }, [normalizedUpdates.length, setDisplayedIndex]);

  const scrollToUpdate = (index: number) => {
    if (!sectionRef.current || normalizedUpdates.length <= 1) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const scrollRange = Math.max(1, rect.height - window.innerHeight);
    const targetProgress = getUpdateTargetProgress({
      index,
      itemCount: normalizedUpdates.length,
    });
    const targetY = window.scrollY + rect.top + scrollRange * targetProgress;
    const safeIndex = Math.min(Math.max(index, 0), normalizedUpdates.length - 1);

    if (navigationLockTimeoutRef.current) {
      window.clearTimeout(navigationLockTimeoutRef.current);
    }

    navigationLockRef.current = {
      index: safeIndex,
      targetScrollY: targetY,
    };
    navigationLockTimeoutRef.current = window.setTimeout(() => {
      navigationLockRef.current = null;
      navigationLockTimeoutRef.current = null;
    }, 1400);
    setDisplayedIndex(safeIndex);

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  const goToAdjacentUpdate = (direction: -1 | 1) => {
    scrollToUpdate(activeIndex + direction);
  };

  if (normalizedUpdates.length === 0) {
    return (
      <section className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-[#7c6a77] dark:text-white/60">{t.aboutPage.noContent}</p>
          <p className="mt-2 text-sm text-[#9b8a95] dark:text-white/40">{t.aboutPage.tryFilter}</p>
        </div>
      </section>
    );
  }

  const activeUpdate = normalizedUpdates[activeIndex] ?? normalizedUpdates[0];

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 min-h-[230vh] w-screen -translate-x-1/2 overflow-x-clip bg-[#fbf8ed] dark:bg-[#160f12] lg:min-h-[260vh]"
      aria-label={t.aboutPage.latestUpdates}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.84),rgba(255,239,246,0.42)_42%,rgba(221,250,247,0.34))] dark:bg-[linear-gradient(120deg,rgba(22,15,18,1),rgba(58,29,42,0.55)_48%,rgba(16,48,48,0.42))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-[#fbf8ed] to-transparent dark:from-[#160f12]" />

        <div className="hidden h-full lg:block">
          <div className="relative mx-auto grid h-full max-w-[1480px] grid-cols-[150px_minmax(0,1fr)_310px] items-center gap-9 px-10 xl:px-16">
            <nav className="flex h-[min(68vh,620px)] flex-col justify-between text-[#2d1f27] dark:text-white" aria-label={t.aboutPage.latestUpdates}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#E77A9A] dark:text-[#f7aac3]">
                  {t.aboutPage.latestUpdates}
                </p>
                <p className="mt-3 max-w-[130px] text-xs leading-relaxed text-[#7c6a77] dark:text-white/55">
                  {t.aboutPage.updatesSubtitle}
                </p>
              </div>

              <div className="flex items-stretch gap-4">
                <div className="relative w-px overflow-hidden bg-[#2d1f27]/12 dark:bg-white/14">
                  <span
                    className="absolute left-0 top-0 block w-px bg-[#2d1f27] transition-all duration-500 dark:bg-white"
                    style={{
                      height: `${100 / totalUpdates}%`,
                      transform: `translateY(${activeIndex * 100}%)`,
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  {normalizedUpdates.map((update, index) => (
                    <button
                      key={`${update.title}-rail-${index}`}
                      type="button"
                      onClick={() => scrollToUpdate(index)}
                      className={`group flex w-[92px] items-center gap-3 text-left transition-all duration-300 ${
                        activeIndex === index ? 'text-[#2d1f27] dark:text-white' : 'text-[#9b8a95] hover:text-[#E77A9A] dark:text-white/38 dark:hover:text-white/78'
                      }`}
                      aria-label={`${t.aboutPage.latestUpdates} ${formatUpdateIndex(index)}`}
                    >
                      <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        activeIndex === index ? 'scale-125 bg-[#E77A9A]' : 'bg-current opacity-40 group-hover:opacity-80'
                      }`} />
                      <span className="font-serif text-sm italic">{formatUpdateIndex(index)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-serif text-4xl italic leading-none text-[#2d1f27] dark:text-white">
                  {formatUpdateIndex(activeIndex)}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[#7c6a77] dark:text-white/45">
                  / {String(totalUpdates).padStart(2, '0')}
                </p>
              </div>
            </nav>

            <div className="relative h-[min(72vh,680px)] min-h-[540px]">
              <div className="absolute inset-0 translate-x-5 translate-y-5 border border-[#2d1f27]/10 bg-white/28 dark:border-white/10 dark:bg-white/5" />
              <div className="relative h-full overflow-hidden border border-white/75 bg-black shadow-[0_34px_120px_-58px_rgba(50,24,38,0.68)] dark:border-white/10">
                {normalizedUpdates.map((update, index) => (
                  <div
                    key={`${update.image}-desktop-image`}
                    className={`absolute inset-0 transition-all duration-[950ms] ease-out ${
                      activeIndex === index
                        ? 'scale-100 opacity-100'
                        : 'pointer-events-none scale-[1.035] opacity-0'
                    }`}
                    aria-hidden={activeIndex !== index}
                  >
                    <Image
                      src={update.image}
                      alt={activeIndex === index ? update.title : ''}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? undefined : 'eager'}
                      sizes="(max-width: 1200px) 100vw, 980px"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,237,0.5)_0%,rgba(251,248,237,0.1)_38%,rgba(0,0,0,0.02)_70%),linear-gradient(0deg,rgba(15,10,12,0.58),transparent_46%)] dark:bg-[linear-gradient(90deg,rgba(22,15,18,0.68),rgba(22,15,18,0.12)_45%,rgba(0,0,0,0.08)),linear-gradient(0deg,rgba(0,0,0,0.68),transparent_48%)]" />

                {normalizedUpdates.map((update, index) => (
                  <div
                    key={`${update.title}-desktop-copy`}
                    className={`absolute inset-x-8 bottom-8 max-w-[720px] transition-all duration-700 ease-out xl:inset-x-10 xl:bottom-10 ${
                      activeIndex === index
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-6 opacity-0'
                    }`}
                    aria-hidden={activeIndex !== index}
                  >
                    <div className="max-w-[520px] border border-white/64 bg-white/72 p-5 shadow-[0_22px_70px_-42px_rgba(45,31,39,0.72)] backdrop-blur-2xl dark:border-white/12 dark:bg-[#191014]/72">
                      <div className="mb-5 flex flex-wrap items-center gap-3">
                        <span className="bg-[#2d1f27] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white dark:bg-white dark:text-[#160f12]">
                          {getCategoryLabel(update)}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.24em] text-[#7c6a77] dark:text-white/58">
                          {update.date}
                        </span>
                      </div>
                      <h3 className="max-w-[11ch] break-words text-[clamp(4.3rem,7vw,7.6rem)] font-semibold leading-[0.86] tracking-normal text-[#050505] dark:text-white">
                        {update.title}
                      </h3>
                      <p className="mt-5 max-w-[440px] text-sm leading-relaxed text-[#4f434b] dark:text-white/72">
                        {update.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex h-[min(68vh,620px)] flex-col justify-between text-[#2d1f27] dark:text-white">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9b8a95] dark:text-white/45">
                  {t.aboutPage.latestUpdates}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {normalizedUpdates.map((update, index) => {
                    const isActive = activeIndex === index;

                    return (
                      <button
                        key={`${update.title}-${index}`}
                        type="button"
                        onClick={() => scrollToUpdate(index)}
                        className={`group grid grid-cols-[74px_minmax(0,1fr)] gap-3 border p-2 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-[#2d1f27]/18 bg-white/76 shadow-[0_18px_54px_-38px_rgba(45,31,39,0.62)] dark:border-white/16 dark:bg-white/10'
                            : 'border-transparent bg-white/24 opacity-68 hover:border-[#E77A9A]/24 hover:bg-white/54 hover:opacity-100 dark:bg-white/5 dark:hover:bg-white/8'
                        }`}
                        aria-label={`${t.aboutPage.latestUpdates} ${update.title}`}
                      >
                        <span className="relative h-16 overflow-hidden bg-[#2d1f27]/10">
                          <Image
                            src={update.image}
                            alt=""
                            fill
                            className={`object-cover transition-transform duration-500 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}
                            sizes="74px"
                          />
                        </span>
                        <span className="min-w-0 self-center">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E77A9A] dark:text-[#f7aac3]">
                            {formatUpdateIndex(index)} · {getCategoryLabel(update)}
                          </span>
                          <span className="mt-1 block truncate text-sm font-semibold text-[#2d1f27] dark:text-white">
                            {update.title}
                          </span>
                          <span className="mt-1 block truncate text-xs text-[#7c6a77] dark:text-white/50">
                            {update.date}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-l border-[#2d1f27]/12 pl-5 dark:border-white/12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9b8a95] dark:text-white/45">
                  {activeUpdate.date}
                </p>
                <p className="mt-3 text-2xl font-semibold leading-tight text-[#2d1f27] dark:text-white">
                  {activeUpdate.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#5f5360] dark:text-white/62">
                  {activeUpdate.description}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToAdjacentUpdate(-1)}
                    className="flex h-9 w-9 items-center justify-center border border-[#2d1f27]/15 bg-white/62 text-[#2d1f27] shadow-sm backdrop-blur transition-colors duration-200 hover:bg-white disabled:opacity-30 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/16"
                    disabled={activeIndex === 0}
                    aria-label="Previous update"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToAdjacentUpdate(1)}
                    className="flex h-9 w-9 items-center justify-center border border-[#2d1f27]/15 bg-white/62 text-[#2d1f27] shadow-sm backdrop-blur transition-colors duration-200 hover:bg-white disabled:opacity-30 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/16"
                    disabled={activeIndex === totalUpdates - 1}
                    aria-label="Next update"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="relative flex h-full flex-col justify-center px-4 pb-8 pt-16 sm:px-6 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#E77A9A] dark:text-[#f7aac3]">
                {t.aboutPage.latestUpdates}
              </p>
              <p className="mt-1 font-serif text-xs italic text-[#7c6a77] dark:text-white/55">
                {formatUpdateIndex(activeIndex)} / {String(totalUpdates).padStart(2, '0')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToAdjacentUpdate(-1)}
                className="flex h-9 w-9 items-center justify-center border border-[#2d1f27]/15 bg-white/70 text-[#2d1f27] shadow-sm backdrop-blur disabled:opacity-30 dark:border-white/15 dark:bg-white/10 dark:text-white"
                disabled={activeIndex === 0}
                aria-label="Previous update"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goToAdjacentUpdate(1)}
                className="flex h-9 w-9 items-center justify-center border border-[#2d1f27]/15 bg-white/70 text-[#2d1f27] shadow-sm backdrop-blur disabled:opacity-30 dark:border-white/15 dark:bg-white/10 dark:text-white"
                disabled={activeIndex === totalUpdates - 1}
                aria-label="Next update"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[44svh] min-h-[290px] overflow-hidden border border-white/70 bg-black shadow-[0_24px_80px_-50px_rgba(50,24,38,0.52)] dark:border-white/10">
              {normalizedUpdates.map((update, index) => (
                <div
                  key={`${update.image}-mobile-image`}
                  className={`absolute inset-0 transition-all duration-[850ms] ease-out ${
                    activeIndex === index
                      ? 'scale-100 opacity-100'
                      : 'pointer-events-none scale-[1.03] opacity-0'
                  }`}
                  aria-hidden={activeIndex !== index}
                >
                  <Image
                    src={update.image}
                    alt={activeIndex === index ? update.title : ''}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'eager'}
                    sizes="100vw"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8ed] via-transparent to-transparent dark:from-[#160f12]" />
            </div>

            <div className="relative z-10 -mt-16 min-h-[210px] border border-white/72 bg-white/78 shadow-[0_20px_70px_-48px_rgba(45,31,39,0.72)] backdrop-blur-2xl dark:border-white/12 dark:bg-[#191014]/76 sm:min-h-[220px]">
              {normalizedUpdates.map((update, index) => (
                <div
                  key={`${update.title}-mobile-title`}
                  className={`absolute inset-x-4 top-4 transition-all duration-700 ease-out ${
                    activeIndex === index
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-5 opacity-0'
                  }`}
                  aria-hidden={activeIndex !== index}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="bg-[#2d1f27] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white dark:bg-white dark:text-[#160f12]">
                      {getCategoryLabel(update)}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#7c6a77] dark:text-white/56">
                      {update.date}
                    </span>
                  </div>
                  <h3 className="max-w-[11ch] break-words text-[clamp(3rem,13vw,4.7rem)] font-semibold leading-[0.88] tracking-normal text-[#050505] dark:text-white">
                    {update.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#5f5360] dark:text-white/68">
                    {update.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-[#2d1f27] dark:bg-white" />
            <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
              {normalizedUpdates.map((update, index) => (
                <button
                  key={`${update.title}-mobile-${index}`}
                  type="button"
                  onClick={() => scrollToUpdate(index)}
                  className={`relative h-12 w-20 shrink-0 overflow-hidden border transition-all duration-300 ${
                    activeIndex === index
                      ? 'border-[#2d1f27] opacity-100 dark:border-white'
                      : 'border-transparent opacity-45'
                  }`}
                  aria-label={`${t.aboutPage.latestUpdates} ${update.title}`}
                >
                  <Image
                    src={update.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            {normalizedUpdates.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToUpdate(index)}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  activeIndex === index ? 'bg-[#2d1f27] dark:bg-white' : 'bg-[#2d1f27]/15 dark:bg-white/15'
                }`}
                aria-label={`${t.aboutPage.latestUpdates} ${formatUpdateIndex(index)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
