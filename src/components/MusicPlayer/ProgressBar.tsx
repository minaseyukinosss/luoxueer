'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';

interface ProgressBarProps {
  isMobile?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isMobile = false }) => {
  const {
    currentTime,
    duration,
    seekTo
  } = useMusic();
  
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // 拖动状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    seekTo(newTime);
  };

  // 拖动开始
  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragTime(currentTime);
    
    // 阻止事件冒泡，避免触发进度条点击事件
    e.stopPropagation();
    
    // 防止文本选择
    document.body.style.userSelect = 'none';
  }, [duration, currentTime]);

  // 拖动过程中
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !duration || !progressBarRef.current) return;
    
    // 直接使用缓存的进度条引用，无需DOM查询
    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const progressWidth = rect.width;
    
    // 计算新的时间位置
    const newTime = Math.max(0, Math.min(duration, (mouseX / progressWidth) * duration));
    setDragTime(newTime);
  }, [isDragging, duration]);

  // 拖动结束
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    seekTo(dragTime);
    
    // 恢复文本选择
    document.body.style.userSelect = '';
  }, [isDragging, dragTime, seekTo]);

  // 添加全局鼠标事件监听器
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleDragMove(e);
      };

      const handleGlobalMouseUp = () => {
        handleDragEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <div className="flex items-center gap-3 w-full">
      {!isMobile && (
        <span className="text-xs text-gray-500 tabular-nums w-12 text-right font-medium">
          {formatTime(isDragging ? dragTime : currentTime)}
        </span>
      )}

      <div className="relative w-full h-1 group progress-container" ref={progressBarRef}>
        {/* 背景进度条 */}
        <div className="absolute inset-0 h-1 bg-gray-200 rounded-full shadow-inner"></div>

        {/* 播放进度 */}
        <div
          className="absolute inset-y-0 left-0 h-1 rounded-full shadow-sm"
          style={{ 
            width: duration ? `${((isDragging ? dragTime : currentTime) / duration) * 100}%` : '0%',
            background: 'linear-gradient(to right, #86efac, #4ade80)'
          }}
        >
          {/* 闪光效果 */}
          <div 
            className="absolute right-0 top-0 w-1 h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.4), transparent)',
              boxShadow: '0 0 3px rgba(255,255,255,0.5), 0 0 6px rgba(134,239,172,0.3)',
              animation: 'progress-shine-soft 2s ease-in-out infinite',
              display: duration && ((isDragging ? dragTime : currentTime) / duration) * 100 > 0 ? 'block' : 'none'
            }}
          ></div>
        </div>

        {/* 可点击区域 */}
        <div 
          className="absolute inset-0 h-6 -top-2 cursor-pointer"
          onClick={handleProgressClick}
        ></div>

        {/* 拖动点 */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full border-2 border-green-400 shadow-lg cursor-grab active:cursor-grabbing ${
            isDragging 
              ? 'w-4 h-4 opacity-100 scale-110 transition-none' 
              : 'w-3 h-3 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200'
          }`}
          style={{ 
            left: `calc(${duration ? ((isDragging ? dragTime : currentTime) / duration) * 100 : 0}% - ${isDragging ? '8px' : '6px'})`,
            display: duration ? 'block' : 'none'
          }}
          onMouseDown={handleDragStart}
        ></div>
      </div>

      {!isMobile && (
        <span className="text-xs text-gray-500 tabular-nums w-12 font-medium">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
