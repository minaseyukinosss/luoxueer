'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';

interface ProgressBarProps {
  isMobile?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isMobile = false }) => {
  const { currentTime, duration, seekTo } = useMusic();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    e.preventDefault();
    setIsDragging(true);
    setDragTime(currentTime);
    e.stopPropagation();
    document.body.style.userSelect = 'none';
  }, [duration, currentTime]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !duration || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(duration, (mouseX / rect.width) * duration));
    setDragTime(newTime);
  }, [isDragging, duration]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    seekTo(dragTime);
    document.body.style.userSelect = '';
  }, [isDragging, dragTime, seekTo]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const progress = duration ? ((isDragging ? dragTime : currentTime) / duration) * 100 : 0;

  // Mobile Slim Bar
  if (isMobile) {
    return (
      <div 
        className="relative w-full h-1 bg-gray-100 rounded-full cursor-pointer overflow-hidden"
        onClick={(e) => {
           e.stopPropagation(); // Prevent opening drawer
           if (!duration) return;
           const rect = e.currentTarget.getBoundingClientRect();
           const newTime = ((e.clientX - rect.left) / rect.width) * duration;
           seekTo(newTime);
        }}
      >
        <div 
           className="absolute top-0 left-0 h-full bg-gray-900 rounded-full"
           style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  // Desktop Detailed Bar
  return (
    <div className="flex items-center gap-3 w-full select-none">
      <span className="text-[10px] text-gray-400 w-8 text-right font-mono tabular-nums tracking-tight">
        {formatTime(isDragging ? dragTime : currentTime)}
      </span>

      <div 
        className="relative w-full h-4 flex items-center cursor-pointer group" 
        ref={progressBarRef}
        onClick={(e) => {
           if (!duration || isDragging) return;
           const rect = e.currentTarget.getBoundingClientRect();
           const newTime = ((e.clientX - rect.left) / rect.width) * duration;
           seekTo(newTime);
        }}
      >
        {/* Track Background */}
        <div className="w-full h-[2px] bg-gray-200/80 relative rounded-full overflow-hidden group-hover:h-[4px] transition-all duration-300">
           {/* Fill */}
           <div 
             className="absolute top-0 left-0 h-full bg-gray-800 transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(0,0,0,0.2)]"
             style={{ width: `${progress}%` }}
           ></div>
        </div>

        {/* Hover Tooltip / Thumb */}
        <div 
          className={`absolute w-2.5 h-2.5 bg-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm ring-2 ring-white cursor-grab active:cursor-grabbing active:scale-125 ${isDragging ? 'opacity-100 scale-125' : 'scale-75 group-hover:scale-100'}`}
          style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleDragStart}
        />
      </div>

      <span className="text-[10px] text-gray-400 w-8 text-left font-mono tabular-nums tracking-tight">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
