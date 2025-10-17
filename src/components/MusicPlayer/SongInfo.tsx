'use client';

import React from 'react';
import Image from 'next/image';
import { useMusic } from '@/contexts/MusicContext';

interface SongInfoProps {
  isMobile?: boolean;
}

const SongInfo: React.FC<SongInfoProps> = ({ isMobile = false }) => {
  const { currentSong } = useMusic();
  
  if (!currentSong) return null;
  
  return (
    <div className={`flex items-center gap-3 ${isMobile ? 'mb-3' : ''}`}>
      {/* 封面 */}
      <div className={`relative ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} overflow-hidden shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105 rounded-lg`}>
        <Image
          src={currentSong.cover}
          alt={currentSong.album}
          width={isMobile ? 48 : 56}
          height={isMobile ? 48 : 56}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 歌曲信息 */}
      <div className="flex-1 min-w-0">
        {isMobile ? (
          <>
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {currentSong.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {currentSong.artist}
            </p>
          </>
        ) : (
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {currentSong.title}
            </h3>
            <span className="text-gray-400 text-xs">/</span>
            <span className="text-sm text-gray-500 truncate">
              {currentSong.artist}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongInfo;
