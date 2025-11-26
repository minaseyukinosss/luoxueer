'use client';

import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { PlayMode } from '@/contexts/MusicContext';
import { Repeat, Repeat1, Shuffle } from 'lucide-react';

const PlayModeButton: React.FC = () => {
  const { playMode, togglePlayMode } = useMusic();

  const getPlayModeInfo = () => {
    switch (playMode) {
      case PlayMode.SEQUENCE:
        return {
          icon: <Repeat className="w-4 h-4" strokeWidth={1.5} />,
          title: 'Order'
        };
      case PlayMode.SINGLE:
        return {
          icon: <Repeat1 className="w-4 h-4" strokeWidth={1.5} />,
          title: 'Loop Single'
        };
      case PlayMode.SHUFFLE:
        return {
          icon: <Shuffle className="w-4 h-4" strokeWidth={1.5} />,
          title: 'Shuffle'
        };
      default:
        return {
          icon: <Repeat className="w-4 h-4" strokeWidth={1.5} />,
          title: 'Order'
        };
    }
  };

  const { icon, title } = getPlayModeInfo();

  return (
    <button
      onClick={togglePlayMode}
      className="p-1.5 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100/80 transition-all duration-200 active:scale-95"
      title={title}
    >
      {icon}
    </button>
  );
};

export default PlayModeButton;
