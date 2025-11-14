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
      <div className="h-full flex items-center justify-center px-4 relative overflow-hidden" style={{background: 'linear-gradient(to bottom, #ecfdf5 0%, #f0fdf4 70%, #ffffff 100%)'}}>
        {/* 背景装饰 - 统一翠绿色系 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-100 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative group w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8">
            {/* 光晕 */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            
            {/* 图标容器 */}
            <div className="relative w-full h-full bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/50 group-hover:ring-emerald-200/50 transition-all">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            </div>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-3">选择一首歌曲</h3>
          <p className="text-sm md:text-base text-gray-600">开始播放查看歌词</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{background: 'linear-gradient(to bottom, #ecfdf5 0%, #f0fdf4 50%, #ffffff 100%)'}}>
      {/* 背景装饰 - 统一翠绿色系 */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* 专辑封面和歌曲信息 */}
      <div className="flex-shrink-0 p-6 md:p-4 relative z-10">
        <div className="flex flex-col items-center space-y-4 md:space-y-3">
          {/* 旋转的专辑封面 */}
          <div className="relative group">
            {/* 外圈光晕 */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 blur-2xl transition-all duration-500 ${isPlaying ? 'opacity-40 scale-110' : 'opacity-20 scale-100'}`}></div>
            
            {/* 专辑封面 */}
            <div className={`relative w-48 h-48 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl transition-all duration-500 ring-4 ring-white/50 ${isPlaying ? 'animate-record-spin ring-emerald-200/50' : ''}`}>
              <Image
                src={currentSong.cover}
                alt={currentSong.album}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
              {/* 光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
            </div>
            
            {/* 唱片中心圆点 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-8 h-8 md:w-6 md:h-6 bg-white rounded-full shadow-lg ring-2 ring-emerald-100 transition-all duration-300 ${isPlaying ? 'animate-pulse scale-105' : ''}`}></div>
            </div>
            
            {/* 唱片外圈装饰 */}
            <div className="absolute inset-0 rounded-full border-4 border-white/30 group-hover:border-emerald-200/50 transition-colors duration-300"></div>
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
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-lg md:text-base font-semibold transform scale-105 opacity-100 drop-shadow-sm' 
                        : isPast 
                          ? 'text-gray-500 text-sm md:text-xs opacity-75' 
                          : 'text-gray-400 text-sm md:text-xs opacity-65'
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
