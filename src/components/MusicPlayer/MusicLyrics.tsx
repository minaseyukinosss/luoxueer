'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useMusic } from '@/contexts/MusicContext';
import { songList } from '@/data/musicData';
import { PlayIcon } from 'lucide-react';

const MusicLyrics: React.FC = () => {
  const { currentSong, isPlaying, currentTime, seekTo, play } = useMusic();
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lyricsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isUserScrollingRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const getCurrentLyrics = useCallback(() => {
    if (currentSong) {
      const song = songList.find(s => s.id === currentSong.id);
      return song?.lyrics || [];
    }
    return [];
  }, [currentSong]);
  
  const lyrics = getCurrentLyrics();

  // Find active lyric index based on context time (coarse update)
  useEffect(() => {
    if (lyrics.length === 0) return;
    let activeIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      const currentLineTime = lyrics[i].time;
      const nextLineTime = i < lyrics.length - 1 ? lyrics[i + 1].time : currentLineTime + 5;
      if (currentTime >= currentLineTime && currentTime < nextLineTime) {
        activeIndex = i;
        break;
      }
    }
    setActiveLyricIndex(activeIndex);
  }, [currentTime, lyrics]);

  // Auto-scroll logic
  useEffect(() => {
    if (activeLyricIndex === -1 || isUserScrollingRef.current) return;

    const activeEl = lyricsRefs.current[activeLyricIndex];
    const container = lyricsContainerRef.current;

    if (activeEl && container) {
      const containerHeight = container.clientHeight;
      const activeOffset = activeEl.offsetTop;
      const activeHeight = activeEl.clientHeight;
      
      isAutoScrollingRef.current = true;
      container.scrollTo({
        top: activeOffset - containerHeight / 2 + activeHeight / 2,
        behavior: 'smooth',
      });
      
      // Reset auto scrolling flag after animation
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 1000);
    }
  }, [activeLyricIndex]);

  const handleScroll = () => {
    if (isAutoScrollingRef.current) return;
    
    isUserScrollingRef.current = true;
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 1500);
  };

  if (!currentSong) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-300">
        <div className="text-lg font-mono tracking-widest opacity-50">SELECT A TRACK</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col md:flex-row md:items-center md:justify-center md:gap-16 lg:gap-24 py-4 md:py-0">
      
      {/* Left Side (PC): Album Art & Info - Smaller & More Elegant */}
      <div className="flex-shrink-0 flex flex-col items-center md:items-end md:w-auto mb-6 md:mb-0 transition-all duration-500">
        {/* Album Cover - Enhanced Vinyl Style */}
        <div className="relative group mb-6">
           {/* Enhanced Soft Shadow with depth */}
           <div className={`absolute inset-0 bg-black/8 blur-2xl rounded-full transform translate-y-3 transition-all duration-700 ${isPlaying ? 'opacity-100 scale-105' : 'opacity-60 scale-100'}`}></div>
           <div className={`absolute inset-0 bg-black/3 blur-xl rounded-full transform translate-y-1 transition-all duration-700 ${isPlaying ? 'opacity-80' : 'opacity-40'}`}></div>
           
           {/* Vinyl Disc Container */}
           <div className={`relative w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 vinyl-disc-container transition-all duration-500 ${isPlaying ? 'animate-record-spin' : ''}`}>
             {/* Outer vinyl ring with grooves */}
             <div className="absolute inset-0 rounded-full vinyl-outer-ring"></div>
             
             {/* Album Cover Image */}
             <div className="absolute inset-[6%] rounded-full overflow-hidden vinyl-cover-shadow">
               <Image
                 src={currentSong.cover}
                 alt={currentSong.album}
                 width={320}
                 height={320}
                 className="w-full h-full object-cover rounded-full"
                 priority
               />
               {/* Subtle overlay for depth */}
               <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none"></div>
             </div>
             
             {/* Vinyl Grooves - Concentric Circles */}
             <div className="absolute inset-0 rounded-full vinyl-grooves pointer-events-none"></div>
             
             {/* Vinyl Texture Overlay */}
             <div className="absolute inset-0 rounded-full vinyl-texture pointer-events-none"></div>
             
             {/* Outer edge highlight */}
             <div className="absolute inset-0 rounded-full vinyl-edge-highlight pointer-events-none"></div>
             
             {/* Center Hole / Label with enhanced styling */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="vinyl-center-label w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
                 {/* Inner groove circles */}
                 <div className="absolute inset-1.5 rounded-full border border-gray-200/50"></div>
                 <div className="absolute inset-3 rounded-full border border-gray-200/30"></div>
                 {/* Center dot */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 bg-gray-400 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"></div>
               </div>
             </div>
             
             {/* Playing indicator ring */}
             {isPlaying && (
               <div className="absolute inset-[-2px] rounded-full vinyl-playing-ring pointer-events-none"></div>
             )}
           </div>
        </div>

        {/* Song Info */}
        <div className="text-center md:text-right w-full hidden md:block max-w-[280px]">
           <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-fjalla tracking-tight leading-tight mb-2 line-clamp-2">
             {currentSong.title}
           </h2>
           <div className="flex items-center justify-center md:justify-end gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest">
             <span>{currentSong.artist}</span>
             <span className="text-gray-300">/</span>
             <span>{currentSong.album}</span>
           </div>
        </div>
      </div>

      {/* Right Side (PC): Lyrics - Bottom Aligned Layout */}
      <div className="flex-1 min-h-0 md:h-full overflow-hidden relative w-full max-w-xl flex flex-col justify-end md:justify-center">
        {/* CSS Mask for fade effect - Expanded area as requested */}
        <div 
          className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth relative"
          ref={lyricsContainerRef}
          onScroll={handleScroll}
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)'
          }}
        >
          <div className="flex flex-col items-center md:items-start py-[40%] md:py-[35%] space-y-3 md:space-y-4 px-4 md:px-0">
            {lyrics.map((line, index) => {
              const isActive = index === activeLyricIndex;
              
              return (
                <div
                  key={index}
                  ref={el => { lyricsRefs.current[index] = el }}
                  className={`group relative transition-all duration-500 ease-out flex items-center justify-center md:justify-start w-full text-center md:text-left ${
                    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <p 
                    className={`font-medium transition-all duration-300 leading-relaxed tracking-wide cursor-default ${
                      isActive 
                        ? 'text-base md:text-xl scale-100 origin-left font-bold text-[#E77A9A]' 
                        : 'text-xs md:text-sm text-gray-500 scale-100 origin-left'
                    }`}
                  >
                    {line.text}
                  </p>
                  
                  {/* Play Button on Hover */}
                  <button
                    className={`ml-4 p-1.5 rounded-full bg-[#E77A9A]/20 text-[#E77A9A] hover:bg-[#E77A9A] hover:text-white opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-200 ease-out ${isActive ? 'hidden' : 'hidden md:block'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      seekTo(line.time);
                      if (!isPlaying) {
                        play();
                      }
                    }}
                    aria-label="Play from this line"
                  >
                    <PlayIcon size={12} fill="currentColor" />
                  </button>
                </div>
              );
            })}
            {lyrics.length === 0 && (
              <p className="text-gray-300 text-xs font-mono uppercase tracking-widest">No Lyrics Available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicLyrics;
