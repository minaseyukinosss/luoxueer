'use client';

import { useState } from 'react';
import { LoaderCircle, Play, X } from 'lucide-react';
import { useLocale } from '@/shared/components/providers/LocaleProvider';

interface UpdateVideoPlayerProps {
  bvid: string;
  title: string;
  playing: boolean;
  onPlay: () => void;
  onClose: () => void;
}

export const UpdateVideoPlayer = ({ bvid, title, playing, onPlay, onClose }: UpdateVideoPlayerProps) => {
  const { t } = useLocale();
  const [loaded, setLoaded] = useState(false);

  if (!playing) {
    return (
      <button
        type="button"
        data-update-play
        aria-label={`${t.aboutPage.playVideo}：${title}`}
        onClick={() => { setLoaded(false); onPlay(); }}
        className="absolute bottom-4 right-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/80 bg-white/95 px-4 text-sm font-medium text-[#2d1f27] shadow-[0_6px_20px_-10px_rgba(45,31,39,0.4)] transition-colors hover:bg-[#fde9f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef6b9a]"
      >
        <Play className="h-4 w-4 fill-current" aria-hidden="true" />
        {t.aboutPage.playVideo}
      </button>
    );
  }

  const query = new URLSearchParams({ bvid, p: '1', autoplay: '1', muted: '0', danmaku: '0', poster: '1' });

  return (
    <div className="absolute inset-0 z-10 bg-black pb-3" data-update-video data-lenis-prevent aria-busy={!loaded}>
      <iframe
        src={`https://player.bilibili.com/player.html?${query}`}
        title={`${t.aboutPage.videoPlayer}：${title}`}
        className="h-full w-full border-0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoaded(true)}
      />
      {!loaded ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-[#1a1013] text-sm text-white/80" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          {t.aboutPage.loadingVideo}
        </div>
      ) : null}
      <button
        type="button"
        aria-label={t.aboutPage.closeVideo}
        onClick={onClose}
        className="absolute right-2 top-2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/65 text-white transition-colors hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6b9a]"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};
