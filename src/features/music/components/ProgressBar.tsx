"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useMusic } from "@/features/music/context/MusicContext";

type ProgressBarProps = {
  isMobile?: boolean;
};

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function ProgressBar({ isMobile = false }: ProgressBarProps) {
  const { currentTime, duration, seekTo } = useMusic();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  const seekFromPointer = useCallback(
    (clientX: number, element: HTMLDivElement) => {
      if (!duration) return 0;

      const rect = element.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration],
  );

  const handleDragStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!duration) return;

      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
      setDragTime(currentTime);
      document.body.style.userSelect = "none";
    },
    [currentTime, duration],
  );

  const handleDragMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !progressBarRef.current) return;
      setDragTime(seekFromPointer(event.clientX, progressBarRef.current));
    },
    [isDragging, seekFromPointer],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    seekTo(dragTime);
    document.body.style.userSelect = "";
  }, [dragTime, isDragging, seekTo]);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove, isDragging]);

  const displayedTime = isDragging ? dragTime : currentTime;
  const progress = duration ? (displayedTime / duration) * 100 : 0;

  if (isMobile) {
    return (
      <div
        className="relative h-1 w-full cursor-pointer overflow-hidden rounded-full bg-gray-100"
        onClick={(event) => {
          event.stopPropagation();
          if (!duration) return;
          seekTo(seekFromPointer(event.clientX, event.currentTarget));
        }}
      >
        <div className="absolute left-0 top-0 h-full rounded-full bg-gray-900" style={{ width: `${progress}%` }} />
      </div>
    );
  }

  return (
    <div className="flex w-full select-none items-center gap-3">
      <span className="w-8 text-right font-mono text-[10px] tabular-nums tracking-tight text-gray-400">
        {formatTime(displayedTime)}
      </span>

      <div
        ref={progressBarRef}
        className="group relative flex h-4 w-full cursor-pointer items-center"
        onClick={(event) => {
          if (!duration || isDragging) return;
          seekTo(seekFromPointer(event.clientX, event.currentTarget));
        }}
      >
        <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-gray-200/80 transition-all duration-300 group-hover:h-[4px]">
          <div
            className="absolute left-0 top-0 h-full bg-gray-800 shadow-[0_0_8px_rgba(0,0,0,0.2)] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className={`absolute h-2.5 w-2.5 cursor-grab rounded-full bg-gray-900 opacity-0 shadow-sm ring-2 ring-white transition-all duration-200 active:scale-125 active:cursor-grabbing group-hover:opacity-100 ${
            isDragging ? "scale-125 opacity-100" : "scale-75 group-hover:scale-100"
          }`}
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
          onMouseDown={handleDragStart}
        />
      </div>

      <span className="w-8 text-left font-mono text-[10px] tabular-nums tracking-tight text-gray-400">
        {formatTime(duration)}
      </span>
    </div>
  );
}
