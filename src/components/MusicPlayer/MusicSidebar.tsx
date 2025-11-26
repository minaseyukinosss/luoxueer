'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useMusic } from '@/contexts/MusicContext';
import { songList, Song } from '@/data/musicData';

interface MusicSidebarProps {
  onSongSelect?: () => void;
}

const MusicSidebar: React.FC<MusicSidebarProps> = ({ onSongSelect }) => {
  const { currentSong, playSong, isPlaying } = useMusic();

  const songs = useMemo(() => songList, []);

  return (
    <div className="flex flex-col h-full overflow-hidden pl-6 pr-2 md:px-0">
      <div className="flex items-center gap-2 mb-6 md:mb-8 px-2">
        <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Playlist</span>
        <span className="h-px flex-1 bg-gray-200"></span>
        <span className="text-xs font-mono text-gray-400">{songs.length.toString().padStart(2, '0')}</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 pb-24 md:pb-8">
        {songs.map((song, index) => {
          const isCurrent = currentSong?.id === song.id;
          const displayIndex = (index + 1).toString().padStart(2, '0');

          return (
            <button
              key={song.id}
              onClick={() => {
                playSong(song);
                onSongSelect?.();
              }}
              className={`group w-full flex items-center gap-4 p-3 md:p-4 rounded-none border-l-2 transition-all duration-300 text-left hover:bg-white/40 ${
                isCurrent 
                  ? 'border-pink-400 bg-white/60 pl-5' 
                  : 'border-transparent pl-3 hover:pl-4 hover:border-gray-200'
              }`}
            >
              {/* 序号 */}
              <span className={`text-sm font-mono transition-colors ${
                isCurrent ? 'text-pink-500 font-bold' : 'text-gray-300 group-hover:text-gray-400'
              }`}>
                {displayIndex}
              </span>

              {/* 歌曲信息 */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className={`text-lg md:text-xl font-medium tracking-tight truncate transition-colors font-fjalla ${
                  isCurrent ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {song.title}
                </span>
                <span className={`text-xs uppercase tracking-wider truncate ${
                  isCurrent ? 'text-pink-400' : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {song.artist}
                </span>
              </div>

              {/* 播放状态/时长 */}
              <div className="w-8 flex justify-center">
                {isCurrent && isPlaying ? (
                   <div className="flex gap-[3px] items-end h-4">
                     <div className="w-[2px] bg-pink-400 animate-music-bar-1 h-full"></div>
                     <div className="w-[2px] bg-pink-400 animate-music-bar-2 h-2"></div>
                     <div className="w-[2px] bg-pink-400 animate-music-bar-3 h-3"></div>
                   </div>
                ) : (
                   <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-pink-400' : 'bg-gray-200 group-hover:bg-gray-300'}`}></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MusicSidebar;
