'use client';

import React from 'react';
import { useMusic } from '@/contexts/MusicContext';

// 控制播放、暂停、上一首、下一首的组件
interface PlayerControlsProps {
  size?: 'sm' | 'md' | 'lg';
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ size = 'md' }) => {
  const {
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong
  } = useMusic();

  const iconSize = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const sideIconSize = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const gapCls = size === 'lg' ? 'gap-10' : 'gap-6 md:gap-16';
  const buttonSize = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const playButtonSize = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-12 h-12' : 'w-14 h-14';

  return (
    <div className={`flex items-center justify-center ${gapCls}`}>
      {/* 上一首 */}
      <button
        onClick={previousSong}
        className={`relative ${buttonSize} flex items-center justify-center rounded-full text-gray-600 hover:text-emerald-600 bg-white/80 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 active:scale-90 hover:scale-105 hover:shadow-md hover:shadow-emerald-200/50 border border-gray-200/50 hover:border-emerald-200/50 group`}
        title="上一首"
      >
        {/* 悬停时的光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/20 group-hover:to-teal-400/20 transition-all duration-300 blur-sm"></div>
        <svg className={`${sideIconSize} relative z-10 transition-transform duration-300 group-hover:scale-110`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1m3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 0 0 0 1.64"/>
        </svg>
      </button>

      {/* 播放/暂停 */}
      <button
        onClick={togglePlayPause}
        className={`relative ${playButtonSize} flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl shadow-emerald-400/40 hover:shadow-emerald-500/60 group`}
        title={isPlaying ? '暂停' : '播放'}
      >
        {/* 图标容器 */}
        <div className="relative z-10 flex items-center justify-center">
          {isPlaying ? (
            <svg className={`${iconSize} md:w-10 md:h-10 text-white drop-shadow-lg transition-transform duration-200 group-active:scale-90`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className={`${iconSize} md:w-10 md:h-10 text-white drop-shadow-lg transition-transform duration-200 group-active:scale-90`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </div>
      </button>

      {/* 下一首 */}
      <button
        onClick={nextSong}
        className={`relative ${buttonSize} flex items-center justify-center rounded-full text-gray-600 hover:text-emerald-600 bg-white/80 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 active:scale-90 hover:scale-105 hover:shadow-md hover:shadow-emerald-200/50 border border-gray-200/50 hover:border-emerald-200/50 group`}
        title="下一首"
      >
        {/* 悬停时的光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/20 group-hover:to-teal-400/20 transition-all duration-300 blur-sm"></div>
        <svg className={`${sideIconSize} relative z-10 transition-transform duration-300 group-hover:scale-110`} fill="currentColor" viewBox="0 0 24 24">
          <path d="m7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82M16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1"/>
        </svg>
      </button>
    </div>
  );
};

export default PlayerControls;
