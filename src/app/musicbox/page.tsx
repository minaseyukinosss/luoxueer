'use client';

import { useState } from 'react';
import MusicSidebar from '@/components/MusicPlayer/MusicSidebar';
import MusicLyrics from '@/components/MusicPlayer/MusicLyrics';
import MusicPlayerBar from '@/components/MusicPlayer/MusicPlayerBar';
import { MusicProvider } from '@/contexts/MusicContext';
import '@/styles/index.css';

export default function MusicPage() {
  // Mobile playlist drawer state
  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);

  return (
    <MusicProvider>
      <div className="relative min-h-screen w-full overflow-hidden bg-[#f8f6f6] dark:bg-[#1a1013] font-sans selection:bg-pink-200 selection:text-gray-900">

        {/* Animated Background - Subtle & Dreamy */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light z-[1]" />
          <div className="absolute left-[-10%] top-[-10%] h-[45rem] w-[45rem] rounded-full bg-[#f7d8e4]/40 blur-[120px] animate-pulse-slow mix-blend-multiply" />
          <div className="absolute right-[-5%] bottom-[-5%] h-[35rem] w-[35rem] rounded-full bg-[#d2c3ff]/30 blur-[100px] animate-float-slow mix-blend-multiply" />
          <div className="absolute left-[20%] bottom-[10%] h-[25rem] w-[25rem] rounded-full bg-blue-100/30 blur-[80px] animate-float mix-blend-multiply" />
        </div>

        {/* Grid Lines - Structure */}
        <div className="absolute top-0 left-6 md:left-12 bottom-0 w-px bg-black/5 z-0" />
        <div className="absolute top-0 right-6 md:right-12 bottom-0 w-px bg-black/5 z-0" />

        {/* Main Container */}
        <div className="relative z-10 h-[100dvh] flex flex-col">

          {/* Content Area - Split Layout */}
          <div className="flex-1 flex flex-col md:flex-row md:gap-12 lg:gap-16 overflow-hidden px-0 md:px-16 lg:px-24 pt-20 md:pt-24 pb-24 md:pb-0 relative">

            {/* Playlist Sidebar (Desktop) & Drawer (Mobile) */}
            <div className={`
              absolute inset-x-0 bottom-0 h-[70%] z-30 md:relative md:z-auto md:h-full md:w-[320px] lg:w-[380px] shrink-0
              bg-[#f8f6f6]/95 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none
              transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)
              ${showMobilePlaylist ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0 md:translate-y-0 md:opacity-100'}
              flex flex-col border-t border-black/5 md:border-t-0 md:border-r rounded-t-[2rem] md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none
            `}>
              {/* Desktop Title - Moved here to save vertical space */}
              <div className="hidden md:block px-2 mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-gray-900 font-fjalla leading-none">
                  MUSIC BOX
                </h1>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-12 h-1 bg-gray-900 rounded-full"></span>
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Now Playing</span>
                </div>
              </div>

              {/* Mobile Drag Handle / Close Trigger */}
              <div
                className="md:hidden w-full flex justify-center pt-4 pb-2 cursor-pointer active:opacity-70"
                onClick={() => setShowMobilePlaylist(false)}
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              <div className="flex-1 overflow-hidden px-2 md:px-0">
                <MusicSidebar onSongSelect={() => setShowMobilePlaylist(false)} />
              </div>
            </div>

            {/* Main Visual & Lyrics Area */}
            <div className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden md:pl-6 lg:pl-10">
              {/* Mobile Title (since we removed the main header) */}
              <div className="md:hidden px-8 mb-4 shrink-0">
                <h1 className="text-3xl font-bold tracking-tighter text-gray-900 font-fjalla leading-none">
                  MUSIC BOX
                </h1>
              </div>

              {/* Large Decorative Text */}
              <div className="absolute top-[10%] right-[-5%] text-[10rem] md:text-[15rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-black/[0.03] to-transparent pointer-events-none select-none font-fjalla z-0 rotate-90 md:rotate-0 mix-blend-overlay">
                VINYL
              </div>

              <div className="relative z-10 flex-1 h-full">
                <MusicLyrics />
              </div>
            </div>
          </div>

          {/* Player Bar - Fixed at bottom for Desktop, floating handled in component for Mobile */}
          <div className="hidden md:block shrink-0 z-40">
            <MusicPlayerBar onOpenQueue={() => setShowMobilePlaylist(true)} />
          </div>

          {/* Mobile Floating Player Placeholder is handled inside MusicPlayerBar */}
          <div className="md:hidden">
            <MusicPlayerBar onOpenQueue={() => setShowMobilePlaylist(prev => !prev)} />
          </div>

        </div>
      </div>
    </MusicProvider>
  );
}
