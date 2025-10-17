'use client';

import React, { useRef } from 'react';
import { useMusic } from '@/contexts/MusicContext';

const VolumeControl: React.FC = () => {
  const {
    volume,
    isMuted,
    setVolume,
    toggleMute
  } = useMusic();
  
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleVolumeBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(newVolume);
  };

  return (
    <div className="flex items-center gap-3" ref={volumeRef}>
      {/* 音量图标 */}
      <button
        onClick={toggleMute}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        title={isMuted ? '取消静音' : '静音'}
      >
        {isMuted ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7L7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91c-.36.15-.58.53-.58.92c0 .72.73 1.18 1.39.91c.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0M19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87c0-3.83-2.4-7.11-5.78-8.4c-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12m-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7M16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02M5 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L9 9H6c-.55 0-1 .45-1 1"/>
          </svg>
        )}
      </button>

      {/* 音量滑块 */}
      <div className="relative w-24">
        {/* 滑块背景 */}
        <div 
          className="w-full h-1 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleVolumeBarClick}
        >
          {/* 已调节部分 */}
          <div 
            className="h-1 bg-[#e7618e] rounded-full"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          />
        </div>

        {/* 实际的滑块（隐藏但可交互） */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
        />

        {/* 自定义滑块手柄 */}
        <div
          className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-sm transform -translate-y-1/2 cursor-pointer transition-all duration-150 hover:scale-110 border border-[#e7618e]"
          style={{
            left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)`,
          }}
        />
      </div>

      {/* 音量百分比显示 */}
      <span className="text-xs text-gray-500 w-10 text-right">
        {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
      </span>
    </div>
  );
};

export default VolumeControl;
