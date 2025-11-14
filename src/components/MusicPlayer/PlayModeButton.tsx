'use client';

import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { PlayMode } from '@/contexts/MusicContext';

const PlayModeButton: React.FC = () => {
  const { playMode, togglePlayMode } = useMusic();

  // 获取播放模式图标和提示文本
  const getPlayModeInfo = () => {
    switch (playMode) {
      case PlayMode.SEQUENCE:
        return {
          icon: (
            <path d="M4 6h16M4 12h16M4 18h16" />
          ),
          title: '顺序播放'
        };
      case PlayMode.SINGLE:
        return {
          icon: (
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          ),
          title: '单曲循环'
        };
      case PlayMode.SHUFFLE:
        return {
          icon: (
            <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
          ),
          title: '随机播放'
        };
      default:
        return {
          icon: (
            <path d="M4 6h16M4 12h16M4 18h16" />
          ),
          title: '顺序播放'
        };
    }
  };

  return (
    <button
      onClick={togglePlayMode}
      className="group relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-200 active:scale-95 hover:shadow-sm"
      title={getPlayModeInfo().title}
    >
      {/* 背景动画 */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/0 to-teal-100/0 group-hover:from-emerald-100/20 group-hover:to-teal-100/20 rounded-xl transition-all duration-200"></div>
      
      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        {getPlayModeInfo().icon}
      </svg>
    </button>
  );
};

export default PlayModeButton;
