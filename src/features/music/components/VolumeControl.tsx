"use client";

import { type MouseEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/features/music/context/MusicContext";

export default function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = useMusic();

  const handleVolumeChange = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const newVolume = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    setVolume(newVolume);
  };

  return (
    <div className="group flex items-center gap-2">
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
}
