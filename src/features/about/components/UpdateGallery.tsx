'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { useLocale } from '@/shared/components/providers/LocaleProvider';
import type { UpdateMedia } from '@/features/about/constants';

interface GalleryProps {
  media: UpdateMedia[];
  title: string;
}

export function UpdateMediaGrid({ media, title, active, onOpen }: GalleryProps & {
  active: boolean;
  onOpen: (index: number) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="grid h-full gap-1 bg-[#fffdfd] p-1 dark:bg-[#302128]" data-update-gallery
      style={{ gridTemplateColumns: `repeat(${Math.min(media.length, 3)}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${Math.ceil(media.length / 3)}, minmax(0, 1fr))` }}>
      {media.map((item, index) => (
        <button key={item.image} type="button" onClick={() => onOpen(index)} disabled={!active}
          data-update-photo
          aria-label={`${t.aboutPage.openGalleryItem}：${title} ${index + 1}/${media.length}${item.video ? ` · ${t.aboutPage.playVideo}` : ''}`}
          className="group relative min-h-0 overflow-hidden bg-[#eee6e9] focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ef6b9a]">
          <Image src={item.image} alt={active ? (index === 0 ? title : `${title} ${index + 1}`) : ''} fill
            sizes={media.length === 2 ? '(min-width: 1024px) 800px, 450px' : '(min-width: 1024px) 200px, 34vw'} priority={index < 3}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none" />
          {item.video ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden="true" />
              </span>
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function UpdateMediaViewer({ media, title, initialIndex, sourceUrl, onClose }: GalleryProps & {
  initialIndex: number;
  sourceUrl?: string;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const [failedVideo, setFailedVideo] = useState<string | null>(null);
  const item = media[index];
  const move = (direction: -1 | 1) => setIndex(current => Math.max(0, Math.min(media.length - 1, current + direction)));

  useEffect(() => {
    const video = videoRef.current;
    return () => video?.pause();
  }, [item.video]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.getClientRects().length) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const controlClass = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff9bc0] disabled:opacity-25';

  return (
    <dialog ref={dialogRef} aria-label={`${t.aboutPage.openGalleryItem}：${title}`} data-lenis-prevent data-update-viewer
      onCancel={event => { event.preventDefault(); onClose(); }}
      onKeyDown={event => {
        if (event.target instanceof HTMLVideoElement) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none grid-rows-[auto_minmax(0,1fr)_auto] gap-4 bg-[#1a1013] px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] text-white backdrop:bg-[#1a1013]/90 open:grid sm:gap-6 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0 truncate text-sm font-medium">{title}</p>
        <button type="button" onClick={onClose} aria-label={t.aboutPage.closeGallery} autoFocus className={controlClass}>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="relative min-h-0"
        onTouchStart={event => {
          touchStart.current = !item.video && event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={event => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !event.changedTouches[0]) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.25) move(dx < 0 ? 1 : -1);
        }}>
        {item.video ? (
          <video ref={videoRef} key={item.video} src={item.video} poster={item.image} controls playsInline preload="metadata"
            aria-label={`${title} ${index + 1}/${media.length}`}
            onError={() => setFailedVideo(item.video!)} className="h-full w-full object-contain" />
        ) : (
          <Image key={item.image} src={item.image} alt={`${title} ${index + 1}/${media.length}`} fill sizes="100vw" className="object-contain" />
        )}
        {item.video && failedVideo === item.video ? (
          <p role="status" className="absolute inset-0 flex items-center justify-center bg-[#1a1013] px-6 text-center text-sm leading-relaxed text-[#f4d7e2]">{t.aboutPage.videoUnavailable}</p>
        ) : null}
      </div>
      <div className="mx-auto flex w-full max-w-lg flex-wrap items-center justify-center gap-x-5 gap-y-3">
        <button type="button" onClick={() => move(-1)} disabled={index === 0} aria-label={t.aboutPage.previousMedia} className={controlClass}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <p aria-live="polite" aria-atomic="true" className="min-w-16 text-center font-mono text-xs tabular-nums text-[#f4d7e2]" data-gallery-counter>
          {String(index + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}
        </p>
        <button type="button" onClick={() => move(1)} disabled={index === media.length - 1} aria-label={t.aboutPage.nextMedia} className={controlClass}>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-1 text-xs text-[#ffb1cf] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#ff9bc0]">
            {t.aboutPage.viewOriginal}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </dialog>
  );
}
