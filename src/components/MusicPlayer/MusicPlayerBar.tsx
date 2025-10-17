'use client';

import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import PlayModeButton from './PlayModeButton';
import SongInfo from './SongInfo';

// 添加样式来隐藏原生滑块手柄
const MusicPlayerBar: React.FC = () => {
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
      <div className="hidden md:block h-24 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
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

      {/* 移动端播放器 - 简化版本 */}
      <div className="md:hidden bg-white border-t border-gray-100 shadow-[0_-2px_20px_rgba(0,0,0,0.1)]">
        {/* 进度条 */}
        <div className="relative">
          <ProgressBar isMobile={true} />
        </div>

        {/* 播放器主体 */}
        <div className="px-4 py-3">
          {/* 歌曲信息和封面 */}
          <SongInfo isMobile={true} />

          {/* 播放控制 */}
          <div className="flex items-center justify-between">
            {/* 时间显示 */}
            <span className="text-xs text-gray-500 tabular-nums w-12">
              {formatTime(currentTime)}
            </span>

            {/* 控制按钮 */}
            <PlayerControls />

            {/* 总时长 */}
            <span className="text-xs text-gray-500 tabular-nums w-12 text-right">
              {formatTime(duration)}
            </span>
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
