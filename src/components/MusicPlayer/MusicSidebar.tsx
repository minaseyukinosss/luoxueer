'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useMusic } from '@/contexts/MusicContext';
import { songList, Song } from '@/data/musicData';

interface MusicSidebarProps {
  onSongSelect?: () => void;
}

const MusicSidebar: React.FC<MusicSidebarProps> = ({ onSongSelect }) => {
  const { currentSong, playSong } = useMusic();
  const [isExpanded, setIsExpanded] = useState(true);

  // 根据窗口宽度自动展开/收缩侧边栏
  useEffect(() => {
    const handleResize = () => {
      const shouldExpand = window.innerWidth >= 1200;
      setIsExpanded(shouldExpand);
    };

    // 初始化时检查一次
    handleResize();

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 使用 useMemo 优化歌曲列表渲染
  const songs = useMemo(() => songList, []);

  // 使用 useCallback 优化事件处理函数
  const handleSongClick = useCallback((song: Song) => {
    playSong(song);
    onSongSelect?.(); // 选择歌曲后回调（用于关闭移动端抽屉）
  }, [playSong, onSongSelect]);

  return (
    <div 
      className={`bg-transparent text-gray-800 flex flex-col transition-all duration-300 h-full ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
      style={isExpanded ? { width: '320px', minWidth: '320px' } : { width: '64px', minWidth: '64px' }}
    >
      {/* 顶部标题和展开按钮 - 桌面端显示 */}
      <div className="hidden md:block p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="text-2xl font-bold transition-opacity duration-300 soft-title music-title">
              MUSIC
            </div>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="group relative p-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none focus:bg-gradient-to-r focus:from-indigo-100 focus:to-purple-100"
            aria-label={isExpanded ? "收缩侧边栏" : "展开侧边栏"}
            title={isExpanded ? "收缩侧边栏" : "展开侧边栏"}
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* 图标容器 */}
            <div className="relative z-10 flex items-center justify-center">
              <svg 
                className={`w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-all duration-300 ease-out ${
                  isExpanded ? 'rotate-0' : 'rotate-180'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
            
            {/* 微妙的阴影效果 */}
            <div className="absolute inset-0 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300"></div>
          </button>
        </div>
      </div>

      {/* 播放列表 */}
      <div className="flex-1 overflow-y-auto">
        {isExpanded && (
          <div className="hidden md:block px-4 py-3 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-600">播放列表</span>
          </div>
        )}
        
        <div className={`space-y-1 ${isExpanded ? 'p-4 md:p-4' : 'p-2'} md:block`} role="list" aria-label="歌曲列表">
          {songs.map((song, index) => (
            <button
              key={song.id}
            className={`w-full flex items-center py-3 md:py-2 rounded-lg hover:bg-indigo-50 active:bg-indigo-100 transition-all duration-200 ease-out focus:outline-none focus:bg-indigo-50 focus:scale-[1.02] ${
              isExpanded ? 'space-x-4 px-4' : 'justify-center px-2'
            } ${
              currentSong?.id === song.id ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 focus:bg-indigo-200' : ''
            } md:mx-0 mx-0`}
              onClick={() => handleSongClick(song)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSongClick(song);
                }
              }}
              role="listitem"
              aria-label={`播放 ${song.title} - ${song.artist}`}
              aria-current={currentSong?.id === song.id ? 'true' : 'false'}
              tabIndex={0}
            >
              <div className={`rounded-lg overflow-hidden flex-shrink-0 ${
                isExpanded ? 'w-12 h-12 md:w-10 md:h-10' : 'w-10 h-10'
              }`}>
                <Image
                  src={song.cover}
                  alt={`${song.title} 专辑封面`}
                  width={isExpanded ? 48 : 40}
                  height={isExpanded ? 48 : 40}
                  className="w-full h-full object-cover"
                  priority={index < 3} // 前3首歌曲优先加载
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-base md:text-sm truncate font-medium">{song.title}</div>
                  <div className="text-sm md:text-xs text-gray-500 truncate">{song.artist}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MusicSidebar;
