"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useMusic } from "@/features/music/context/MusicContext";

type PlayerControlsProps = {
  size?: "sm" | "md" | "lg";
};

export default function PlayerControls({ size = "md" }: PlayerControlsProps) {
  const { isPlaying, togglePlayPause, nextSong, previousSong } = useMusic();
  const isSmall = size === "sm";

  return (
    <div className={`flex items-center justify-center ${isSmall ? 'gap-3' : 'gap-6'}`}>
      {/* Previous */}
      {!isSmall && (
        <button
          onClick={previousSong}
          className="flex items-center justify-center text-gray-400 hover:text-gray-800 transition-all active:scale-90 transform p-1.5 rounded-full hover:bg-gray-100/80"
          title="Previous"
        >
          <SkipBack className="w-5 h-5" strokeWidth={1.5} />
        </button>
      )}

      {/* Play/Pause */}
      <button
        onClick={togglePlayPause}
        className={`flex items-center justify-center rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 hover:-translate-y-0.5 ${isSmall
            ? 'w-10 h-10 bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/20'
            : 'w-11 h-11 bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/25'
          }`}
      >
        {isPlaying ? (
          <Pause className={isSmall ? 'w-4 h-4 fill-current' : 'w-5 h-5 fill-current'} strokeWidth={0} />
        ) : (
          <Play className={`${isSmall ? 'w-4 h-4 fill-current' : 'w-5 h-5 fill-current'} ml-0.5`} strokeWidth={0} />
        )}
      </button>

      {/* Next */}
      <button
        onClick={nextSong}
        className="flex transform items-center justify-center rounded-full p-1.5 text-gray-400 transition-all hover:bg-gray-100/80 hover:text-gray-800 active:scale-90"
        title="Next"
      >
        <SkipForward className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
