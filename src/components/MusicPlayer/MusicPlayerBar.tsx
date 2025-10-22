'use client';

import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import PlayModeButton from './PlayModeButton';
import SongInfo from './SongInfo';

// 添加样式来隐藏原生滑块手柄
interface MusicPlayerBarProps {
  onOpenQueue?: () => void;
}

const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({ onOpenQueue }) => {
  const { currentSong, currentTime, duration } = useMusic();

  if (!currentSong) {
    return (
      <div className="h-20 md:h-24 bg-white border-t border-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-400">暂无播放</p>
      </div>
    );
  }

  return (
    <>      
      {/* 桌面端播放器 */}
      <div className="hidden md:block h-24 bg-white border-t border-gray-100 rounded-xl">
        <div className="h-full flex items-center px-6 gap-6">
          {/* 左侧：歌曲信息 */}
          <div className="w-48 md:w-52 min-w-0">
            <SongInfo />
          </div>

          {/* 中间：播放控制 */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4">
            {/* 播放控制按钮 */}
            <div className="mb-2">
              <PlayerControls />
            </div>

            {/* 下方：进度条 */}
            <ProgressBar />
          </div>

          {/* 右侧：播放模式和音量控制 */}
          <div className="w-48 md:w-52 flex items-center justify-end gap-4 pr-2">
            <PlayModeButton />
            <VolumeControl />
          </div>
        </div>
      </div>

      {/* 移动端播放器 - 融入背景设计 */}
      <div className="md:hidden bg-gradient-to-b from-white/95 via-white/90 to-white/85 backdrop-blur-sm border-t border-white/20 rounded-xl safe-area-bottom">
        {/* 进度条区域 - 融入背景 */}
        <div className="relative px-4 pt-6 pb-3">
          <ProgressBar isMobile={true} />
          {/* 时间显示 - 更柔和的样式 */}
          <div className="flex justify-between text-[11px] text-gray-400/80 mt-2 font-medium">
            <span className="tabular-nums">{formatTime(currentTime)}</span>
            <span className="tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 操作图标栏 - 融入背景 */}
        <div className="flex items-center justify-around px-8 py-5">
          {/* 循环模式按钮 */}
          <button className="p-3 text-gray-500/70 hover:text-gray-700 hover:bg-white/30 active:scale-95 transition-all relative rounded-full backdrop-blur-sm">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-1 -left-1 text-[8px] text-gray-300 font-medium">99+</span>
          </button>
          
          {/* 均衡器图标 */}
          <button className="p-3 text-gray-500/70 hover:text-gray-700 hover:bg-white/30 active:scale-95 transition-all relative rounded-full backdrop-blur-sm">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-400/90 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium shadow-sm backdrop-blur-sm">NEW</span>
          </button>
          
          {/* 下载按钮 */}
          <button className="p-3 text-gray-500/70 hover:text-gray-700 hover:bg-white/30 active:scale-95 transition-all rounded-full backdrop-blur-sm">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* 评论按钮 */}
          <button className="p-3 text-gray-500/70 hover:text-gray-700 hover:bg-white/30 active:scale-95 transition-all relative rounded-full backdrop-blur-sm">
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-1 -right-1 text-[8px] text-gray-300 font-medium">8w+</span>
          </button>
          
          {/* 更多菜单按钮 */}
          <button
            onClick={onOpenQueue}
            aria-label="打开播放列表"
            className="p-3 text-gray-500/70 hover:text-gray-700 hover:bg-white/30 active:scale-95 transition-all rounded-full backdrop-blur-sm"
          >
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
          </button>
        </div>

        {/* 播放控制按钮 - 融入背景 */}
        <div className="flex items-center justify-center pb-6 pt-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <PlayerControls />
          </div>
        </div>
      </div>
    </>
  );
};

// 辅助格式化时间的函数
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default MusicPlayerBar;
