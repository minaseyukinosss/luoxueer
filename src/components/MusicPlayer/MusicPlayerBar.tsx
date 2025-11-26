'use client';

import React from 'react';
import Image from 'next/image';
import { useMusic } from '@/contexts/MusicContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import PlayModeButton from './PlayModeButton';
import { ListMusic } from 'lucide-react';

interface MusicPlayerBarProps {
  onOpenQueue?: () => void;
}

const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({ onOpenQueue }) => {
  const { currentSong } = useMusic();

  if (!currentSong) {
    return (
      <div className="hidden md:flex w-[90%] max-w-[1400px] mx-auto mb-6 h-20 rounded-[2rem] border border-white/40 items-center justify-center bg-white/40 backdrop-blur-xl shadow-sm">
        <span className="text-xs font-mono text-gray-400 tracking-widest">SELECT MUSIC</span>
      </div>
    );
  }

  return (
    <>      
      {/* Desktop Player Bar - Floating Style */}
      <div className="hidden md:flex w-[95%] max-w-[1200px] mx-auto mb-6 h-20 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 items-center px-8 justify-between gap-6 z-50 relative shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500">
        
        {/* Left: Song Info */}
        <div className="w-[28%] min-w-0 flex items-center gap-4">
           <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md border border-white/50 group shrink-0">
             <Image 
               src={currentSong.cover} 
               alt={currentSong.title} 
               width={48} 
               height={48} 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
             />
             {/* Vinyl center dot */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-1.5 h-1.5 bg-white/90 rounded-full backdrop-blur-sm shadow-sm"></div>
             </div>
           </div>
           <div className="flex flex-col justify-center min-w-0 gap-0.5">
             <div className="text-sm font-bold text-gray-800 truncate font-fjalla tracking-wide">{currentSong.title}</div>
             <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider truncate opacity-80">{currentSong.artist}</div>
           </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex-1 max-w-xl flex flex-col items-center justify-center gap-1">
           <PlayerControls />
           <div className="w-full px-2">
             <ProgressBar />
           </div>
        </div>

        {/* Right: Volume & Mode & List Toggle */}
        <div className="w-[28%] flex items-center justify-end gap-6">
          <PlayModeButton />
          <VolumeControl />
        </div>
      </div>

      {/* Mobile Player - Floating Capsule Style */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div 
          className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 p-3 pr-4 flex items-center gap-3 cursor-pointer ring-1 ring-black/5"
          onClick={onOpenQueue}
        >
           {/* Spinning Cover */}
           <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-md border border-gray-100 relative">
             <Image 
               src={currentSong.cover} 
               alt={currentSong.title} 
               width={48} 
               height={48} 
               className="w-full h-full object-cover animate-spin-slow-mobile"
             />
             {/* Center dot for vinyl look */}
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
             </div>
           </div>

           {/* Info */}
           <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
             <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 truncate font-fjalla">{currentSong.title}</span>
                <span className="text-xs text-gray-400 truncate font-mono">- {currentSong.artist}</span>
             </div>
             {/* Progress Bar integrated */}
             <div className="w-full mt-2" onClick={(e) => e.stopPropagation()}>
               <ProgressBar isMobile={true} />
             </div>
           </div>

           {/* Controls */}
           <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
             <PlayerControls size="sm" />
             <button className="p-2 text-gray-400 hover:text-gray-600" onClick={onOpenQueue}>
               <ListMusic className="w-5 h-5" strokeWidth={1.5} />
             </button>
           </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayerBar;
