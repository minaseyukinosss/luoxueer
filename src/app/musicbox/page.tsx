'use client';

import { useState } from 'react';
import MusicSidebar from '@/components/MusicPlayer/MusicSidebar';
import MusicLyrics from '@/components/MusicPlayer/MusicLyrics';
import MusicPlayerBar from '@/components/MusicPlayer/MusicPlayerBar';
import { MusicProvider } from '@/contexts/MusicContext';
import '@/styles/index.css';

export default function MusicPage() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <MusicProvider>
      <div className="h-screen music-player">
        
        {/* 简洁装饰线条 */}
        <div className="decorative-line"></div>
        <div className="decorative-line"></div>
        
        {/* 桌面端布局 */}
        <div className="hidden md:block h-full pt-20 px-4 pb-20 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto overflow-hidden">
            {/* 音乐播放器区域 */}
            <div className="h-full rounded-xl shadow-lg p-4 flex gap-4 glass-container overflow-hidden">
              {/* 左侧歌曲列表 */}
              <div className="rounded-xl overflow-hidden h-full">
                <MusicSidebar />
              </div>
              
              {/* 右侧歌词和播放器 */}
              <div className="flex-1 flex flex-col gap-4 min-w-0 h-full overflow-hidden">
                {/* NOW PLAYING 标题 */}
                <div className="soft-header rounded-xl px-4 py-3">
                  <h2 className="text-center text-sm font-bold soft-title tracking-[0.18em] music-title">
                    NOW PLAYING
                  </h2>
                </div>
                
                {/* 上方歌词区域 */}
                <div className="flex-1 rounded-xl overflow-hidden">
                  <MusicLyrics />
                </div>
                
                {/* 下方播放器操作栏 */}
                <div className="rounded-xl overflow-hidden">
                  <MusicPlayerBar />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端布局 */}
        <div className="md:hidden h-full flex flex-col">
          {/* NOW PLAYING 标题 - 使用PC端样式 */}
          <div className="fixed top-16 left-0 right-0 z-20 soft-header px-4 py-3">
            <h2 className="text-center text-sm title-gradient music-title">
              NOW PLAYING
            </h2>
          </div>

          {/* 歌词区域 */}
          <div className="flex-1 pt-28 pb-32 overflow-hidden glass-container">
            <MusicLyrics />
          </div>

          {/* 底部固定播放器 */}
          <div className="fixed bottom-0 left-0 right-0 z-20">
            <MusicPlayerBar onOpenQueue={() => setShowMobileSidebar(true)} />
          </div>

          {/* 移动端侧边栏 - 从底部弹出 */}
          {showMobileSidebar && (
            <>
              {/* 遮罩层 */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                onClick={() => setShowMobileSidebar(false)}
              />
              
              {/* 歌曲列表抽屉 */}
              <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-slide-up max-h-[80vh] flex flex-col">
                {/* 抽屉顶部 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold soft-title music-title">
                    MUSIC
                  </h2>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="关闭歌曲列表"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* 歌曲列表内容 */}
                <div className="flex-1 overflow-hidden h-full">
                  <div className="h-full w-full">
                    <div className="mobile-sidebar-container">
                      <MusicSidebar onSongSelect={() => setShowMobileSidebar(false)} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MusicProvider>
  );
}