'use client';

import React from 'react';
import Image from 'next/image';
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
  const { currentSong, currentTime, duration, isMuted, toggleMute } = useMusic();

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

      {/* 移动端播放器 - 极简悬浮设计 */}
      <div className="md:hidden safe-area-bottom">
        {/* 悬浮播放器容器 */}
        <div className="fixed bottom-0 left-0 right-0 z-30">
          {/* 背景模糊层 */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl"></div>
          
          {/* 主播放器内容 */}
          <div className="relative px-4 py-3">
            {/* 歌曲信息行 */}
            <div className="flex items-center space-x-3 mb-4">
              {/* 专辑封面 - 圆形设计 */}
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-white/60">
                <Image 
                  src={currentSong.cover} 
                  alt={currentSong.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* 歌曲信息 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{currentSong.title}</h3>
                <p className="text-sm text-gray-600 truncate">{currentSong.artist}</p>
              </div>
              
              {/* 播放状态 */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 font-medium">LIVE</span>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <ProgressBar isMobile={true} />
              <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
                <span className="tabular-nums">{formatTime(currentTime)}</span>
                <span className="tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>

            {/* 控制区域 */}
            <div className="flex items-center justify-center">
              {/* 左侧功能按钮 */}
              <div className="flex items-center space-x-4">
                {/* 播放模式 */}
                <div className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                  <PlayModeButton />
                </div>
                
                {/* 音量 */}
                <button 
                  onClick={toggleMute}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  {isMuted ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7L7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91c-.36.15-.58.53-.58.92c0 .72.73 1.18 1.39.91c.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0M19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87c0-3.83-2.4-7.11-5.78-8.4c-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12m-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7M16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02M5 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L9 9H6c-.55 0-1 .45-1 1"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* 中央播放控制 */}
              <div className="flex items-center mx-8">
                <PlayerControls />
              </div>

              {/* 右侧功能按钮 */}
              <div className="flex items-center space-x-4">
                {/* 播放列表 */}
                <button
                  onClick={onOpenQueue}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
                
                {/* 占位元素，保持布局平衡 */}
                <div className="w-9 h-9"></div>
              </div>
            </div>
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
