'use client';

import React, { useRef } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Volume2, VolumeX } from 'lucide-react';

const VolumeControl: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = useMusic();
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(newVolume);
  };

  return (
    <div className="flex items-center gap-2 group" ref={volumeRef}>
      <button onClick={toggleMute} className="text-gray-400 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-100/80">
        {isMuted || volume === 0 ? (
          <VolumeX className="w-4 h-4" strokeWidth={1.5} />
        ) : (
          <Volume2 className="w-4 h-4" strokeWidth={1.5} />
        )}
      </button>

      <div 
        className="w-20 h-4 flex items-center cursor-pointer group/bar"
        onClick={handleVolumeChange}
      >
         {/* Track */}
         <div className="w-full h-[2px] bg-gray-200/80 rounded-full overflow-hidden relative group-hover/bar:h-[4px] transition-all duration-300">
            {/* Fill */}
            <div 
              className="h-full bg-gray-800 rounded-full transition-all duration-150 ease-out shadow-[0_0_6px_rgba(0,0,0,0.1)]"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
         </div>
      </div>
    </div>
  );
};

export default VolumeControl;
