'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale } from '@/components/LocaleProvider';

import type { FilterOption, Update, UpdateCategory } from '../constants';

interface UpdatesSectionProps {
  filteredUpdates: Update[];
  selectedCategory: UpdateCategory | 'all';
  setSelectedCategory: (value: UpdateCategory | 'all') => void;
  filterOptions: FilterOption[];
}

export const UpdatesSection = ({
  filteredUpdates,
  selectedCategory,
  setSelectedCategory,
  filterOptions,
}: UpdatesSectionProps) => {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    // 使用 requestAnimationFrame 确保在 DOM 完全更新后测量
    const rafId = requestAnimationFrame(() => {
      if (containerRef.current) {
        // 测量容器的实际内容高度
        const height = containerRef.current.scrollHeight;
        // 确保至少保持一个卡片的高度（320px）
        const newHeight = Math.max(height, 320);
        setContainerHeight(newHeight);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [filteredUpdates]);

  return (
  <section className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-[#2d1f27] dark:text-white">{t.aboutPage.latestUpdates}</h2>
        <p className="text-sm text-[#7c6a77] dark:text-white/60">{t.aboutPage.updatesSubtitle}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {filterOptions.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedCategory(filter.value)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              selectedCategory === filter.value
                ? 'bg-gradient-to-r from-[#E77A9A] to-[#f598b4] text-white shadow-lg shadow-[#E77A9A]/30'
                : 'border border-[#f6d5df] bg-white/80 text-[#7c6a77] shadow-sm shadow-[#f598b4]/10 hover:border-[#E77A9A]/40 hover:text-[#E77A9A] dark:border-white/15 dark:bg-white/10 dark:text-white/70'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
    <div
      ref={containerRef}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300 ease-in-out"
      style={{ minHeight: containerHeight ? `${containerHeight}px` : '320px' }}
    >
      {filteredUpdates.length > 0 ? (
        filteredUpdates.map((update, index) => (
          <article
            key={`${update.title}-${index}`}
            className="group flex h-full flex-col rounded-2xl border border-white/70 bg-white/80 shadow shadow-[#f598b4]/10 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="relative h-44 overflow-hidden rounded-t-2xl sm:h-40 lg:h-44">
              <Image
                src={update.image}
                alt={update.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#E77A9A] shadow-sm shadow-[#f598b4]/20">
                {t.aboutPage.filters[update.category] || update.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9b5de5]/80 dark:text-white/50">{update.date}</p>
              <h3 className="text-base font-semibold text-[#2d1f27] transition-colors duration-300 group-hover:text-[#E77A9A] dark:text-white">
                {update.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-[#6d5f69] dark:text-white/70">{update.description}</p>
              <div className="mt-auto flex items-center justify-between pt-1">
                <button
                  className="group/btn relative text-xs font-semibold text-[#9b5de5] transition-colors duration-300 hover:text-[#7b48c2] dark:text-[#cbb2ff] cursor-not-allowed"
                  disabled
                  aria-label={t.aboutPage.devPending}
                >
                  {t.aboutPage.readMoreBtn}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#E77A9A] to-[#f598b4] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-[#E77A9A]/40 transition-all duration-300 pointer-events-none group-hover/btn:opacity-100 group-hover/btn:-translate-y-0.5 z-50 backdrop-blur-sm">
                    {t.aboutPage.devPending}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gradient-to-br from-[#E77A9A] to-[#f598b4]"></span>
                  </span>
                </button>
                <span className="group/fav relative text-xs text-[#937b87] dark:text-white/60 cursor-not-allowed">
                  {t.aboutPage.collect}
                  <span className="absolute -top-10 right-0 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#E77A9A] to-[#f598b4] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg shadow-[#E77A9A]/40 transition-all duration-300 pointer-events-none group-hover/fav:opacity-100 group-hover/fav:-translate-y-0.5 z-50 backdrop-blur-sm">
                    {t.aboutPage.devPending}
                    <span className="absolute -bottom-1 right-3 w-2 h-2 rotate-45 bg-gradient-to-br from-[#E77A9A] to-[#f598b4]"></span>
                  </span>
                </span>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center" style={{ minHeight: '320px' }}>
          <div className="text-center">
            <p className="text-lg font-medium text-[#7c6a77] dark:text-white/60">{t.aboutPage.noContent}</p>
            <p className="mt-2 text-sm text-[#9b8a95] dark:text-white/40">{t.aboutPage.tryFilter}</p>
          </div>
        </div>
      )}
    </div>
  </section>
  );
};
