'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/shared/components/providers/LocaleProvider';
import type { Update } from '@/features/about/constants';
import { UpdateVideoPlayer } from './UpdateVideoPlayer';
import { UpdateMediaGrid, UpdateMediaViewer } from './UpdateGallery';

const newsSerif = localFont({
  src: '../assets/fonts/news-serif.ttf',
  weight: '600',
  display: 'swap',
  fallback: ['Georgia', 'Songti SC', 'Yu Mincho', 'SimSun', 'serif'],
  adjustFontFallback: false,
});

interface UpdatesSectionProps {
  updates: Update[];
}

export const UpdatesSection = ({ updates }: UpdatesSectionProps) => {
  const { t } = useLocale();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [timelineFocus, setTimelineFocus] = useState<number | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<{ bvid: string; layout: 'desktop' | 'mobile' } | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const normalizedUpdates = updates.filter(Boolean);
  const totalUpdates = normalizedUpdates.length;
  const activeIndex = Math.min(selectedIndex, Math.max(0, totalUpdates - 1));
  const activeUpdate = normalizedUpdates[activeIndex];
  const activeBvid = activeUpdate?.source === 'bilibili'
    ? activeUpdate.sourceUrl?.match(/^https:\/\/(?:www\.)?bilibili\.com\/video\/(BV[a-zA-Z0-9]{10})(?:\/|$)/)?.[1]
    : undefined;
  const sidebarStart = Math.floor(activeIndex / 3) * 3;
  const sidebarUpdates = normalizedUpdates.slice(sidebarStart, sidebarStart + 3);
  const formatUpdateIndex = (index: number) => String(index + 1).padStart(2, '0');
  const formatUpdateDate = (update: Update) => update.date.replaceAll('-', '.');
  const getSourceLabel = (update: Update) => t.aboutPage.heroLinks[update.source];
  const getSourceAction = (update: Update) => update.source === 'bilibili' ? t.aboutPage.viewOriginalVideo : t.aboutPage.viewOriginal;
  const selectUpdate = (index: number) => {
    if (index !== activeIndex) {
      setVideoPlayer(null);
      setGalleryIndex(null);
    }
    setSelectedIndex(Math.min(Math.max(index, 0), totalUpdates - 1));
  };
  const goToAdjacentUpdate = (direction: -1 | 1) => selectUpdate(activeIndex + direction);

  useEffect(() => {
    if (!videoPlayer) return;
    const breakpoint = window.matchMedia('(min-width: 1024px)');
    const stopVideo = () => setVideoPlayer(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') stopVideo();
    };
    breakpoint.addEventListener('change', stopVideo);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      breakpoint.removeEventListener('change', stopVideo);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoPlayer]);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    if (!strip) return;
    const revealThumbnail = () => {
      const thumbnail = strip.children[activeIndex];
      if (!(thumbnail instanceof HTMLElement) || !strip.clientWidth) return;
      const bounds = strip.getBoundingClientRect();
      const item = thumbnail.getBoundingClientRect();
      if (item.left < bounds.left || item.right > bounds.right) {
        strip.scrollLeft += item.left - bounds.left - (strip.clientWidth - item.width) / 2;
      }
    };
    revealThumbnail();
    const observer = new ResizeObserver(revealThumbnail);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [activeIndex]);

  const heading = (
    <div className="mb-6 px-1">
      <div className="mb-3 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.24em] text-[#9b7c8a]">
        <span className="h-px w-8 bg-[#e7a6bd]" />
        Latest Notes
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-[#2d1f27] dark:text-white">
        {t.aboutPage.latestUpdates}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7c6a77] dark:text-white/60">
        {t.aboutPage.updatesSubtitle}
      </p>
    </div>
  );

  if (normalizedUpdates.length === 0) {
    return (
      <section aria-label={t.aboutPage.latestUpdates}>
        {heading}
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-[#7c6a77] dark:text-white/70">{t.aboutPage.noContent}</p>
            <p className="mt-2 text-sm text-[#a58b99] dark:text-white/50">{t.aboutPage.tryFilter}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="scroll-mt-24" aria-label={t.aboutPage.latestUpdates}>
      {heading}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip bg-[#f8f6f6] dark:bg-[#1a1013]">
      <div className="relative overflow-hidden lg:pb-32">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(255,244,248,0.46)_42%,rgba(221,250,247,0.28)),radial-gradient(circle_at_18%_24%,rgba(233,90,45,0.08),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(18,207,201,0.12),transparent_30%)] dark:bg-[linear-gradient(135deg,rgba(26,16,19,1),rgba(58,29,42,0.55)_48%,rgba(16,48,48,0.42))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-[#f8f6f6] to-transparent dark:from-[#1a1013]" />

        <div className="hidden h-[600px] lg:block">
          <div className="relative mx-auto grid h-full max-w-[1120px] grid-cols-[112px_minmax(0,1fr)_232px] items-start gap-7 px-8 py-6 xl:px-12">
            <nav className="flex h-full flex-col text-[#2d1f27] dark:text-white" aria-label={t.aboutPage.latestUpdates}>
              <div className="flex flex-1 items-center">
                <div className="relative w-full" onMouseLeave={() => setTimelineFocus(null)}>
                  {normalizedUpdates.map((update, index) => {
                    const startsYear = index === 0 || update.date.slice(0, 4) !== normalizedUpdates[index - 1].date.slice(0, 4);
                    const isActive = activeIndex === index;
                    const isPreviewed = timelineFocus === index;
                    const distance = Math.abs(index - (timelineFocus ?? activeIndex));
                    const tickWidth = isActive || distance === 0 ? 26 : distance === 1 ? 19 : distance === 2 ? 14 : 10;
                    return (
                      <div key={`${update.title}-rail-${index}`}>
                        {startsYear ? (
                          <p className={`mb-3 text-right font-mono text-[10px] leading-[15px] tracking-[0.2em] text-[#7c6a77] dark:text-white/60 ${index > 0 ? 'mt-3' : ''}`}>
                            {update.date.slice(0, 4)}
                          </p>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => selectUpdate(index)}
                          onMouseEnter={() => setTimelineFocus(index)}
                          onFocus={() => setTimelineFocus(index)}
                          onBlur={() => setTimelineFocus(null)}
                          aria-pressed={isActive}
                          className="group relative block h-9 w-full text-left focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e77a9a]"
                          aria-label={`${t.aboutPage.latestUpdates} ${update.date} ${update.title}`}
                        >
                          <span className="pointer-events-none absolute inset-y-0 right-0 w-7" aria-hidden="true">
                            {[4, 10, 26, 32].map((position, tick) => (
                              <span key={position} className="absolute right-0 h-px bg-[#b5a4ae]/55 transition-[width] duration-200 ease-out motion-reduce:transition-none dark:bg-white/20" style={{ top: position, width: (tick % 2 === 0 ? 5 : 8) + Math.max(0, 2 - distance) * 2 }} />
                            ))}
                            <span className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full transition-[width,background-color,height] duration-200 ease-out motion-reduce:transition-none ${isActive ? 'h-[2px] bg-[#ef6b9a]' : isPreviewed ? 'h-[2px] bg-[#b8406a] dark:bg-[#ff9bc0]' : 'h-px bg-[#8f7885]/70 dark:bg-white/45'}`} style={{ width: tickWidth }} />
                          </span>
                          <time dateTime={update.date} className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono tabular-nums transition-[right,background-color,color] duration-200 ease-out motion-reduce:transition-none ${
                            isActive
                              ? 'right-8 rounded-[5px] bg-[#2d1f27] px-1.5 py-1.5 text-[11px] font-medium text-white shadow-[0_5px_12px_-8px_rgba(45,31,39,0.6)] dark:bg-[#f8d8e5] dark:text-[#2d1f27]'
                              : isPreviewed
                                ? 'right-8 rounded-[5px] bg-white px-1.5 py-1.5 text-[11px] text-[#b8406a] shadow-sm dark:bg-white/10 dark:text-[#ffb1cf]'
                                : 'right-6 py-1.5 text-[10px] text-[#7c6a77] dark:text-white/60'
                          }`}>
                            {isActive || isPreviewed ? formatUpdateDate(update) : update.date.slice(5).replace('-', '.')}
                          </time>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div data-update-counter>
                <p className="font-[family-name:var(--font-fjalla-one)] text-[2.75rem] leading-none tabular-nums text-[#2d1f27] dark:text-white">
                  {formatUpdateIndex(activeIndex)}
                </p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-[#7c6a77] dark:text-white/60">
                  / {String(totalUpdates).padStart(2, '0')}
                </p>
              </div>
            </nav>

            <div className="grid h-full w-full max-w-[590px] grid-rows-[minmax(0,1fr)_112px] justify-self-center">
              <div className="relative" data-update-image>
                <div className="absolute inset-0 translate-x-3 translate-y-3 border border-[#2d1f27]/10 bg-white/28 dark:border-white/10 dark:bg-white/5" />
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
                    {update.media && update.media.length > 1 ? (
                      <UpdateMediaGrid media={update.media} title={update.title} active={activeIndex === index} onOpen={setGalleryIndex} />
                    ) : <Image
                      src={update.image}
                      alt={activeIndex === index ? update.title : ''}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? undefined : 'eager'}
                      sizes="(min-width: 1280px) 590px, (min-width: 1024px) calc(100vw - 480px), 100vw"
                    />}
                  </div>
                ))}
                {activeBvid ? (
                  <UpdateVideoPlayer key={activeBvid} bvid={activeBvid} title={activeUpdate.title}
                    playing={videoPlayer?.bvid === activeBvid && videoPlayer.layout === 'desktop'}
                    onPlay={() => setVideoPlayer({ bvid: activeBvid, layout: 'desktop' })}
                    onClose={() => setVideoPlayer(null)} />
                ) : null}
                </div>
              </div>
              <div className="relative z-10 -ml-4 -mt-3 grid w-[calc(100%-1.5rem)] max-w-[420px] self-start border border-white/90 bg-[#fffdfd] px-6 py-5 shadow-[0_16px_36px_-24px_rgba(120,50,80,0.4)] dark:border-white/15 dark:bg-[#302128]" data-update-caption>
                {normalizedUpdates.map((update, index) => (
                  <div
                    key={`${update.title}-desktop-copy`}
                    className={`col-start-1 row-start-1 ${activeIndex === index ? 'visible' : 'invisible'}`}
                    aria-hidden={activeIndex !== index}
                  >
                      <h3 className={`${newsSerif.className} break-words text-balance text-[clamp(1.5rem,1.8vw,1.75rem)] font-semibold leading-[1.35] tracking-[0.025em] text-[#2d1f27] dark:text-white`}>
                        {update.title}
                      </h3>
                  </div>
                ))}
              </div>
            </div>

            <aside className="grid h-full grid-rows-[246px_minmax(0,1fr)_36px] gap-6 text-[#2d1f27] dark:text-white">
              <div className="grid h-[246px] grid-rows-3 gap-3" data-update-list>
                  {sidebarUpdates.map((update, offset) => {
                    const index = sidebarStart + offset;
                    const isActive = activeIndex === index;

                    return (
                      <button
                        key={`${update.title}-${index}`}
                        type="button"
                        onClick={() => selectUpdate(index)}
                        aria-pressed={activeIndex === index}
                        className={`group grid grid-cols-[60px_minmax(0,1fr)] gap-3 border p-2 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-[#efb6ca] bg-white/90 shadow-[0_8px_24px_-18px_rgba(175,62,102,0.4)] dark:border-[#f26f9f]/40 dark:bg-white/10'
                            : 'border-transparent bg-transparent opacity-72 hover:border-[#e7a6bd]/60 hover:bg-white/72 hover:opacity-100 dark:hover:bg-white/8'
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
                            {formatUpdateIndex(index)} · {getSourceLabel(update)}
                          </span>
                          <span className="mt-1 block truncate text-sm font-semibold text-[#2d1f27] dark:text-white">
                            {update.title}
                          </span>
                          <span className={`mt-1 block truncate text-xs ${isActive ? 'text-[#b8406a] dark:text-[#ff9bc0]' : 'text-[#7c6a77] dark:text-white/50'}`}>
                            {formatUpdateDate(update)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
              </div>

              <div className="min-h-0 border-t border-[#2d1f27]/12 pt-5 dark:border-white/12" data-update-details>
                {/* All descriptions share one grid cell, reserving the tallest content's height. */}
                <div className="grid" aria-live="polite" aria-atomic="true">
                  {normalizedUpdates.map((update, index) => (
                    <div
                      key={`${update.title}-sidebar-copy-${index}`}
                      className={`col-start-1 row-start-1 ${activeIndex === index ? 'visible' : 'invisible'}`}
                      aria-hidden={activeIndex !== index}
                    >
                      <p className="text-sm leading-6 text-[#7c6a77] dark:text-white/70">
                        {update.description}
                      </p>
                      {update.sourceUrl ? (
                        <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${getSourceAction(update)}：${update.title}`} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-[#b8406a] underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#e77a9a] dark:text-[#ff9bc0]">
                          {getSourceLabel(update)} · {getSourceAction(update)}
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
                <div className="flex items-center gap-2">
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
            </aside>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[480px] flex-col px-8 pt-2 pb-16 sm:max-w-[640px] sm:px-10 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-baseline gap-3">
            <p className="font-mono text-[11px] tracking-[0.08em] text-[#7c6a77] dark:text-white/60">
              {formatUpdateIndex(activeIndex)} / {String(totalUpdates).padStart(2, '0')}
            </p>
            <time dateTime={normalizedUpdates[activeIndex].date} className="font-mono text-[10px] text-[#7c6a77] dark:text-white/60">
              {formatUpdateDate(normalizedUpdates[activeIndex])}
            </time>
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
            <div className="relative h-[clamp(220px,60vw,260px)] sm:h-[300px] overflow-hidden border border-white/70 bg-black shadow-[0_24px_80px_-50px_rgba(50,24,38,0.52)] dark:border-white/10" data-update-image>
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
                  {update.media && update.media.length > 1 ? (
                    <UpdateMediaGrid media={update.media} title={update.title} active={activeIndex === index} onOpen={setGalleryIndex} />
                  ) : <Image
                    src={update.image}
                    alt={activeIndex === index ? update.title : ''}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'eager'}
                    sizes="100vw"
                  />}
                </div>
              ))}
              {activeBvid ? (
                <UpdateVideoPlayer key={activeBvid} bvid={activeBvid} title={activeUpdate.title}
                  playing={videoPlayer?.bvid === activeBvid && videoPlayer.layout === 'mobile'}
                  onPlay={() => setVideoPlayer({ bvid: activeBvid, layout: 'mobile' })}
                  onClose={() => setVideoPlayer(null)} />
              ) : null}
            </div>

            <div className="relative z-10 -ml-2 -mt-2 mr-2 grid border border-white/90 bg-[#fffdfd] p-4 shadow-[0_16px_36px_-24px_rgba(120,50,80,0.4)] dark:border-white/15 dark:bg-[#302128]" data-update-caption>
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
                  <h3 className={`${newsSerif.className} break-words text-balance text-[clamp(1.375rem,6vw,1.625rem)] font-semibold leading-[1.4] tracking-[0.025em] text-[#2d1f27] dark:text-white`}>
                    {update.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#7c6a77] dark:text-white/70">
                    {update.description}
                  </p>
                  {update.sourceUrl ? (
                    <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${getSourceAction(update)}：${update.title}`} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-[#b8406a] underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#e77a9a] dark:text-[#ff9bc0]">
                      {getSourceLabel(update)} · {getSourceAction(update)}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-[#e7a6bd] dark:bg-white/30" />
            <div ref={thumbnailStripRef} className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
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
      </div>
      {galleryIndex !== null && activeUpdate.media ? (
        <UpdateMediaViewer media={activeUpdate.media} title={activeUpdate.title} initialIndex={galleryIndex}
          sourceUrl={activeUpdate.sourceUrl} onClose={() => setGalleryIndex(null)} />
      ) : null}
    </section>
  );
};
