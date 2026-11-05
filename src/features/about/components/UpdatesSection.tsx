'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/shared/components/providers/LocaleProvider';
import type { Update } from '@/features/about/constants';

interface UpdatesSectionProps {
  updates: Update[];
}

export const UpdatesSection = ({ updates }: UpdatesSectionProps) => {
  const { t } = useLocale();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const normalizedUpdates = updates.filter(Boolean);
  const totalUpdates = normalizedUpdates.length;
  const activeIndex = Math.min(selectedIndex, Math.max(0, totalUpdates - 1));
  const formatUpdateIndex = (index: number) => String(index + 1).padStart(2, '0');
  const getCategoryLabel = (update: Update) => t.aboutPage.filters[update.category];
  const selectUpdate = (index: number) => setSelectedIndex(Math.min(Math.max(index, 0), totalUpdates - 1));
  const goToAdjacentUpdate = (direction: -1 | 1) => selectUpdate(activeIndex + direction);

  if (normalizedUpdates.length === 0) {
    return (
      <section className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-[#7c6a77] dark:text-white/70">{t.aboutPage.noContent}</p>
          <p className="mt-2 text-sm text-[#a58b99] dark:text-white/50">{t.aboutPage.tryFilter}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip bg-[#f8f6f6] dark:bg-[#1a1013]"
      aria-label={t.aboutPage.latestUpdates}
    >
      <div className="relative overflow-hidden lg:pt-12 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(255,244,248,0.46)_42%,rgba(221,250,247,0.28)),radial-gradient(circle_at_18%_24%,rgba(233,90,45,0.08),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(18,207,201,0.12),transparent_30%)] dark:bg-[linear-gradient(135deg,rgba(26,16,19,1),rgba(58,29,42,0.55)_48%,rgba(16,48,48,0.42))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-[#f8f6f6] to-transparent dark:from-[#1a1013]" />

        <div className="hidden h-[520px] lg:block">
          <div className="relative mx-auto grid h-full max-w-[1120px] grid-cols-[112px_minmax(0,1fr)_232px] items-center gap-7 px-8 xl:px-12">
            <nav className="flex h-[480px] flex-col justify-between text-[#2d1f27] dark:text-white" aria-label={t.aboutPage.latestUpdates}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9b7c8a] dark:text-white/50">
                  {t.aboutPage.latestUpdates}
                </p>
                <p className="mt-3 max-w-[110px] text-xs leading-relaxed text-[#a58b99] dark:text-white/50">
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
                      onClick={() => selectUpdate(index)}
                      aria-pressed={activeIndex === index}
                      className={`group flex w-[92px] items-center gap-3 text-left transition-all duration-300 ${
                        activeIndex === index ? 'text-[#2d1f27] dark:text-white' : 'text-[#a58b99] hover:text-[#e77a9a] dark:text-white/40 dark:hover:text-white/78'
                      }`}
                      aria-label={`${t.aboutPage.latestUpdates} ${formatUpdateIndex(index)}`}
                    >
                      <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        activeIndex === index ? 'scale-125 bg-[#f26f9f]' : 'bg-current opacity-40 group-hover:opacity-80'
                      }`} />
                      <span className="font-serif text-sm italic">{formatUpdateIndex(index)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-serif text-[clamp(1.75rem,2.2vw,2rem)] italic leading-none text-[#2d1f27] dark:text-white">
                  {formatUpdateIndex(activeIndex)}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[#a58b99] dark:text-white/50">
                  / {String(totalUpdates).padStart(2, '0')}
                </p>
              </div>
            </nav>

            <div className="relative h-[clamp(380px,34vw,460px)] w-full max-w-[590px] justify-self-center">
              <div className="absolute inset-0 translate-x-4 translate-y-4 border border-[#2d1f27]/10 bg-white/28 dark:border-white/10 dark:bg-white/5" />
              <div className="relative h-full overflow-hidden border border-white/75 bg-black shadow-[0_34px_120px_-58px_rgba(50,24,38,0.68)] dark:border-white/10">
                {normalizedUpdates.map((update, index) => (
                  <div
                    key={`${update.image}-desktop-image`}
                    className={`absolute inset-0 transition-[opacity,transform] duration-500 motion-reduce:transition-none ease-out ${
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
                      sizes="(min-width: 1280px) 590px, (min-width: 1024px) calc(100vw - 480px), 100vw"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,246,246,0.5)_0%,rgba(248,246,246,0.1)_38%,rgba(0,0,0,0.02)_70%),linear-gradient(0deg,rgba(45,31,39,0.5),transparent_46%)] dark:bg-[linear-gradient(90deg,rgba(26,16,19,0.68),rgba(26,16,19,0.12)_45%,rgba(0,0,0,0.08)),linear-gradient(0deg,rgba(0,0,0,0.68),transparent_48%)]" />

                {normalizedUpdates.map((update, index) => (
                  <div
                    key={`${update.title}-desktop-copy`}
                    className={`absolute inset-x-5 bottom-5 max-w-[480px] transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none xl:inset-x-6 xl:bottom-6 ${
                      activeIndex === index
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-6 opacity-0'
                    }`}
                    aria-hidden={activeIndex !== index}
                  >
                    <div className="max-w-[344px] border border-white/70 bg-white/82 p-3.5 shadow-sm shadow-[#f598b4]/12 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#f26f9f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white dark:bg-[#f26f9f] dark:text-white">
                          {getCategoryLabel(update)}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.24em] text-[#a58b99] dark:text-white/50">
                          {update.date}
                        </span>
                      </div>
                      <h3 className="max-w-[11ch] break-words text-[clamp(1.75rem,2.6vw,2.25rem)] font-semibold leading-[0.98] tracking-normal text-[#2d1f27] dark:text-white">
                        {update.title}
                      </h3>
                      <p className="mt-3 max-w-[344px] text-sm leading-relaxed text-[#7c6a77] dark:text-white/70">
                        {update.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex h-[480px] flex-col justify-between text-[#2d1f27] dark:text-white">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9b7c8a] dark:text-white/50">
                  {t.aboutPage.latestUpdates}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {normalizedUpdates.map((update, index) => {
                    const isActive = activeIndex === index;

                    return (
                      <button
                        key={`${update.title}-${index}`}
                        type="button"
                        onClick={() => selectUpdate(index)}
                        aria-pressed={activeIndex === index}
                        className={`group grid grid-cols-[60px_minmax(0,1fr)] gap-3 border p-2 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-white/78 bg-white/82 shadow-sm shadow-[#f598b4]/12 dark:border-white/10 dark:bg-white/10'
                            : 'border-transparent bg-white/45 opacity-72 hover:border-[#e7a6bd]/60 hover:bg-white/72 hover:opacity-100 dark:bg-white/5 dark:hover:bg-white/8'
                        }`}
                        aria-label={`${t.aboutPage.latestUpdates} ${update.title}`}
                      >
                        <span className="relative h-14 overflow-hidden bg-[#2d1f27]/10">
                          <Image
                            src={update.image}
                            alt=""
                            fill
                            className={`object-cover transition-transform duration-500 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}
                            sizes="60px"
                          />
                        </span>
                        <span className="min-w-0 self-center">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a58b99] dark:text-white/50">
                            {formatUpdateIndex(index)} · {getCategoryLabel(update)}
                          </span>
                          <span className="mt-1 block truncate text-sm font-semibold text-[#2d1f27] dark:text-white">
                            {update.title}
                          </span>
                          <span className="mt-1 block truncate text-xs text-[#a58b99] dark:text-white/50">
                            {update.date}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-l border-[#2d1f27]/12 pl-5 dark:border-white/12">
                {/* All descriptions share one grid cell, reserving the tallest content's height. */}
                <div className="grid" aria-live="polite" aria-atomic="true">
                  {normalizedUpdates.map((update, index) => (
                    <div
                      key={`${update.title}-sidebar-copy-${index}`}
                      className={`col-start-1 row-start-1 ${activeIndex === index ? 'visible' : 'invisible'}`}
                      aria-hidden={activeIndex !== index}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#a58b99] dark:text-white/50">
                        {update.date}
                      </p>
                      <p className="mt-3 text-lg font-semibold leading-tight text-[#2d1f27] dark:text-white">
                        {update.title}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[#7c6a77] dark:text-white/70">
                        {update.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToAdjacentUpdate(-1)}
                    className="flex h-9 w-9 items-center justify-center border border-white/70 bg-white/76 text-[#8f5f73] shadow-sm shadow-[#f598b4]/10 backdrop-blur transition-colors duration-200 hover:bg-white hover:text-[#e77a9a] disabled:opacity-30 dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/16 dark:hover:text-white"
                    disabled={activeIndex === 0}
                    aria-label="Previous update"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToAdjacentUpdate(1)}
                    className="flex h-9 w-9 items-center justify-center border border-white/70 bg-white/76 text-[#8f5f73] shadow-sm shadow-[#f598b4]/10 backdrop-blur transition-colors duration-200 hover:bg-white hover:text-[#e77a9a] disabled:opacity-30 dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/16 dark:hover:text-white"
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

        <div className="relative mx-auto flex w-full max-w-[480px] flex-col px-8 pt-10 pb-20 sm:max-w-[640px] sm:px-10 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#9b7c8a] dark:text-white/50">
                {t.aboutPage.latestUpdates}
              </p>
              <p className="mt-1 font-serif text-xs italic text-[#a58b99] dark:text-white/50">
                {formatUpdateIndex(activeIndex)} / {String(totalUpdates).padStart(2, '0')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToAdjacentUpdate(-1)}
                className="flex h-9 w-9 items-center justify-center border border-white/70 bg-white/76 text-[#8f5f73] shadow-sm shadow-[#f598b4]/10 backdrop-blur disabled:opacity-30 dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                disabled={activeIndex === 0}
                aria-label="Previous update"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goToAdjacentUpdate(1)}
                className="flex h-9 w-9 items-center justify-center border border-white/70 bg-white/76 text-[#8f5f73] shadow-sm shadow-[#f598b4]/10 backdrop-blur disabled:opacity-30 dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                disabled={activeIndex === totalUpdates - 1}
                aria-label="Next update"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[clamp(220px,60vw,260px)] sm:h-[300px] overflow-hidden border border-white/70 bg-black shadow-[0_24px_80px_-50px_rgba(50,24,38,0.52)] dark:border-white/10">
              {normalizedUpdates.map((update, index) => (
                <div
                  key={`${update.image}-mobile-image`}
                  className={`absolute inset-0 transition-[opacity,transform] duration-500 motion-reduce:transition-none ease-out ${
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6f6] via-transparent to-transparent dark:from-[#1a1013]" />
            </div>

            <div className="relative z-10 -mt-12 grid border border-white/70 bg-white/82 p-4 shadow-sm shadow-[#f598b4]/12 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]">
              {normalizedUpdates.map((update, index) => (
                <div
                  key={`${update.title}-mobile-title`}
                  className={`col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                    activeIndex === index
                      ? 'visible translate-y-0 opacity-100'
                      : 'invisible pointer-events-none translate-y-5 opacity-0'
                  }`}
                  aria-hidden={activeIndex !== index}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f26f9f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white dark:bg-[#f26f9f] dark:text-white">
                      {getCategoryLabel(update)}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#a58b99] dark:text-white/50">
                      {update.date}
                    </span>
                  </div>
                  <h3 className="max-w-[11ch] break-words text-[clamp(1.5rem,6.5vw,1.875rem)] font-semibold leading-[1] tracking-normal text-[#2d1f27] dark:text-white">
                    {update.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#7c6a77] dark:text-white/70">
                    {update.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-[#e7a6bd] dark:bg-white/30" />
            <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
              {normalizedUpdates.map((update, index) => (
                <button
                  key={`${update.title}-mobile-${index}`}
                  type="button"
                  onClick={() => selectUpdate(index)}
                  aria-pressed={activeIndex === index}
                  className={`relative h-12 w-20 shrink-0 overflow-hidden border transition-all duration-300 ${
                    activeIndex === index
                      ? 'border-[#f26f9f] opacity-100 dark:border-[#f26f9f]'
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
                onClick={() => selectUpdate(index)}
                aria-pressed={activeIndex === index}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  activeIndex === index ? 'bg-[#f26f9f] dark:bg-[#f26f9f]' : 'bg-[#e7a6bd]/50 dark:bg-white/15'
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
