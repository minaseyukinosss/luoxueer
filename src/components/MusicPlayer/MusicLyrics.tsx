'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useMusic } from '@/contexts/MusicContext';
import { songList } from '@/data/musicData';

const MusicLyrics: React.FC = () => {
  const { currentSong, isPlaying, currentTime } = useMusic();
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  // 获取当前歌曲的歌词，如果没有则显示默认歌词
  const getCurrentLyrics = () => {
    if (currentSong) {
      const song = songList.find(s => s.id === currentSong.id);
      return song?.lyrics || [];
    }
    return [];
  };

  const lyrics = getCurrentLyrics();

  // 根据当前播放时间高亮对应歌词
  useEffect(() => {
    if (lyrics.length === 0) return;

    let activeIndex = -1;
    
    // 找到当前时间对应的歌词行
    for (let i = 0; i < lyrics.length; i++) {
      const currentLineTime = lyrics[i].time;
      const nextLineTime = i < lyrics.length - 1 ? lyrics[i + 1].time : currentLineTime + 3; // 默认3秒显示时间
      
      // 如果当前时间在这行歌词的时间范围内
      if (currentTime >= currentLineTime && currentTime < nextLineTime) {
        activeIndex = i;
        break;
      }
    }
    
    setActiveLyricIndex(activeIndex);
  }, [currentTime, lyrics]);

  // 自动滚动到当前歌词
  useEffect(() => {
    if (activeLyricRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeElement = activeLyricRef.current;
      
      // 获取容器的可视高度
      const containerHeight = container.clientHeight;
      // 获取当前歌词元素相对于容器的位置
      const elementTop = activeElement.offsetTop;
      const elementHeight = activeElement.clientHeight;
      
      // 计算让当前歌词居中需要的滚动位置
      // 目标：让当前歌词显示在容器的垂直中心
      const centerPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
      
      // 使用 requestAnimationFrame 确保 DOM 更新后再滚动
      requestAnimationFrame(() => {
        container.scrollTo({
          top: Math.max(0, centerPosition),
          behavior: 'smooth'
        });
      });
    }
  }, [activeLyricIndex]);

  if (!currentSong) {
    return (
      <div className="h-full flex items-center justify-center px-4" style={{background: 'linear-gradient(to bottom, #ecfdf5 0%, #ecfdf5 70%, #fefefe 100%)'}}>
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">选择一首歌曲</h3>
          <p className="text-sm md:text-base text-gray-500">开始播放查看歌词</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{background: 'linear-gradient(to bottom, #ecfdf5 0%, #ecfdf5 70%, #fefefe 100%)'}}>
      {/* 专辑封面和歌曲信息 */}
      <div className="flex-shrink-0 p-6 md:p-4">
        <div className="flex flex-col items-center space-y-4 md:space-y-3">
          {/* 旋转的专辑封面 */}
          <div className="relative">
            <div className={`w-48 h-48 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl transition-all duration-500 ${isPlaying ? 'animate-record-spin' : ''}`}>
              <Image
                src={currentSong.cover}
                alt={currentSong.album}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            {/* 唱片中心圆点 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-8 h-8 md:w-6 md:h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}></div>
            </div>
            {/* 唱片外圈装饰 */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
          </div>

          {/* 歌曲信息 */}
          <div className="text-center">
            <h1 className="text-xl md:text-lg font-bold text-gray-900">
              {currentSong.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 歌词内容 */}
      <div className="flex-1 overflow-hidden px-4 md:px-4 pb-4">
        <div className="max-w-2xl mx-auto h-full">
          <div 
            ref={lyricsContainerRef} 
            className="h-full overflow-y-auto scroll-smooth hide-scrollbar relative"
            style={{
              maskImage: 'linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%)'
            }}
          >
            <div className="py-16 px-3 flex flex-col items-center">
              {lyrics.map((line, index) => {
                const isActive = index === activeLyricIndex;
                const isPast = index < activeLyricIndex;
                
                return (
                  <div
                    key={index}
                    ref={isActive ? activeLyricRef : null}
                    className={`w-full flex justify-center min-h-[32px] md:min-h-[28px] items-center transition-all duration-400 ease-out ${
                      isActive ? 'active' : ''
                    }`}
                  >
                    <span className={`text-center transition-all duration-400 ease-out ${
                      isActive 
                        ? 'text-emerald-600 text-base md:text-sm font-medium transform scale-104 opacity-100' 
                        : isPast 
                          ? 'text-gray-500 text-sm md:text-xs opacity-80' 
                          : 'text-gray-400 text-sm md:text-xs opacity-70'
                    }`}>
                      {line.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicLyrics;
