'use client';

import React from 'react';
import { useMusic } from '@/contexts/MusicContext';

// 控制播放、暂停、上一首、下一首的组件
const PlayerControls: React.FC = () => {
  const {
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong
  } = useMusic();

  return (
    <div className="flex items-center justify-center gap-6 md:gap-16">
      {/* 上一首 */}
      <button
        onClick={previousSong}
        className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        title="上一首"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1m3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 0 0 0 1.64"/>
        </svg>
      </button>

      {/* 播放/暂停 */}
      <button
        onClick={togglePlayPause}
        className="text-emerald-500 hover:text-emerald-600 active:scale-95 transition-all duration-200"
        title={isPlaying ? '暂停' : '播放'}
      >
        {isPlaying ? (
          <svg className="w-10 h-10 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16h2V8H9zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m1-4h2V8h-2z"/>
          </svg>
        ) : (
          <svg className="w-10 h-10 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="m10 16.5l6-4.5l-6-4.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/>
          </svg>
        )}
      </button>

      {/* 下一首 */}
      <button
        onClick={nextSong}
        className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        title="下一首"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="m7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82M16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1"/>
        </svg>
      </button>
    </div>
  );
};

export default PlayerControls;
