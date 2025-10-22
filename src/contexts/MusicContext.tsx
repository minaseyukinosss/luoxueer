'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { songList, Song } from '@/data/musicData';

// Song接口已从musicData.ts导入

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  songs: Song[];
  createdAt: string;
  creator: string;
}

// 播放模式枚举
export enum PlayMode {
  SEQUENCE = 'sequence',    // 顺序播放
  LOOP = 'loop',           // 列表循环
  SINGLE = 'single',       // 单曲循环
  SHUFFLE = 'shuffle'      // 随机播放
}

interface MusicContextType {
  // 播放状态
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playMode: PlayMode;
  isMuted: boolean;
  previousVolume: number;
  
  // 播放列表
  currentPlaylist: Playlist | null;
  queue: Song[];
  queueIndex: number;
  originalQueue: Song[]; // 原始队列（用于随机播放时恢复）
  
  // 播放控制
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlayMode: (mode: PlayMode) => void;
  togglePlayMode: () => void;
  
  // 播放列表管理
  playSong: (song: Song) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.SEQUENCE);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [queue, setQueue] = useState<Song[]>(songList);
  const [queueIndex, setQueueIndex] = useState(0);
  const [originalQueue, setOriginalQueue] = useState<Song[]>(songList);
  
  const howlRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 使用导入的歌曲数据
  const samplePlaylist: Playlist = {
    id: '1',
    name: '好心情',
    cover: '/images/album/lalala.webp',
    createdAt: '2025-08-19',
    creator: 'Minase',
    songs: songList
  };

  // 初始化播放列表和默认歌曲
  useEffect(() => {
    setCurrentPlaylist(samplePlaylist);
    setQueue(samplePlaylist.songs);
    setOriginalQueue(samplePlaylist.songs);
    
    // 默认选择第一首歌曲（但不自动播放）
    if (samplePlaylist.songs.length > 0) {
      setCurrentSong(samplePlaylist.songs[0]);
      setQueueIndex(0);
      
      // 创建 Howl 实例但不播放
      const firstSong = samplePlaylist.songs[0];
      const howl = new Howl({
        src: [firstSong.audioUrl],
        volume: volume,
        onload: () => {
          setDuration(howl.duration());
        },
        onplay: () => {
          setIsPlaying(true);
          startProgressTracking();
        },
        onpause: () => {
          setIsPlaying(false);
          stopProgressTracking();
        },
        onstop: () => {
          setIsPlaying(false);
          stopProgressTracking();
        },
        onend: () => {
          handleSongEnd();
        },
        onseek: () => {
          setCurrentTime(howl.seek());
        }
      });
      howlRef.current = howl;
    }
  }, []);

  // 设置全局音量
  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, []);

  // 创建新的 Howl 实例
  const createHowl = useCallback((song: Song) => {
    if (howlRef.current) {
      howlRef.current.unload();
    }

    const howl = new Howl({
      src: [song.audioUrl],
      volume: volume,
      onload: () => {
        setDuration(howl.duration());
      },
      onplay: () => {
        setIsPlaying(true);
        startProgressTracking();
      },
      onpause: () => {
        setIsPlaying(false);
        stopProgressTracking();
      },
      onstop: () => {
        setIsPlaying(false);
        stopProgressTracking();
      },
      onend: () => {
        handleSongEnd();
      },
      onseek: () => {
        setCurrentTime(howl.seek());
      }
    });

    howlRef.current = howl;
    return howl;
  }, [volume]);

  // 开始进度跟踪
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      if (howlRef.current) {
        setCurrentTime(howlRef.current.seek());
      }
    }, 100);
  }, []);

  // 停止进度跟踪
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // 处理歌曲结束
  const handleSongEnd = useCallback(() => {
    switch (playMode) {
      case PlayMode.SINGLE:
        // 单曲循环，重新播放当前歌曲
        if (howlRef.current) {
          howlRef.current.seek(0);
          howlRef.current.play();
        }
        break;
      case PlayMode.LOOP:
        // 列表循环，播放下一首
        nextSong();
        break;
      case PlayMode.SHUFFLE:
        // 随机播放下一首
        nextSong();
        break;
      case PlayMode.SEQUENCE:
      default:
        // 顺序播放，播放下一首
        nextSong();
        break;
    }
  }, [playMode]);

  // 播放
  const play = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.play();
    }
  }, []);

  // 暂停
  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
    }
  }, []);

  // 切换播放/暂停
  const togglePlayPause = useCallback(() => {
    if (howlRef.current) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    }
  }, [isPlaying, play, pause]);

  // 下一首
  const nextSong = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex;
    if (playMode === PlayMode.SHUFFLE) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }
    
    setQueueIndex(nextIndex);
    const nextSong = queue[nextIndex];
    setCurrentSong(nextSong);
    setCurrentTime(0);
    
    // 创建新的 Howl 实例并播放
    const howl = createHowl(nextSong);
    howl.play();
  }, [queue, queueIndex, playMode, createHowl]);

  // 上一首
  const previousSong = useCallback(() => {
    if (queue.length === 0) return;
    
    let prevIndex;
    if (playMode === PlayMode.SHUFFLE) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    }
    
    setQueueIndex(prevIndex);
    const prevSong = queue[prevIndex];
    setCurrentSong(prevSong);
    setCurrentTime(0);
    
    // 创建新的 Howl 实例并播放
    const howl = createHowl(prevSong);
    howl.play();
  }, [queue, queueIndex, playMode, createHowl]);

  // 跳转到指定时间
  const seekTo = useCallback((time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      setCurrentTime(time);
    }
  }, []);

  // 设置音量
  const setVolumeHandler = useCallback((newVolume: number) => {
    setVolume(newVolume);
    Howler.volume(newVolume);
    
    // 如果当前是静音状态且设置了非零音量，自动取消静音
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
      Howler.mute(false);
    }
  }, [isMuted]);

  // 切换静音
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (newMuted) {
      // 静音时，保存当前音量并设置显示音量为0
      setPreviousVolume(volume);
      setVolume(0);
      Howler.mute(true);
    } else {
      // 取消静音时，恢复之前的音量
      setVolume(previousVolume);
      Howler.mute(false);
    }
  }, [isMuted, volume, previousVolume]);

  // 设置播放模式
  const setPlayModeHandler = useCallback((mode: PlayMode) => {
    setPlayMode(mode);
    
    // 如果是随机播放，打乱队列
    if (mode === PlayMode.SHUFFLE) {
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
    } else {
      // 恢复原始队列
      setQueue(originalQueue);
    }
  }, [queue, originalQueue]);

  // 切换播放模式
  const togglePlayModeHandler = useCallback(() => {
    const modes = [PlayMode.SEQUENCE, PlayMode.SINGLE, PlayMode.SHUFFLE];
    const currentIndex = modes.indexOf(playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPlayModeHandler(modes[nextIndex]);
  }, [playMode, setPlayModeHandler]);

  // 播放指定歌曲
  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    
    // 如果歌曲在队列中，更新索引
    const index = queue.findIndex(s => s.id === song.id);
    if (index !== -1) {
      setQueueIndex(index);
    }
    
    // 创建新的 Howl 实例并播放
    const howl = createHowl(song);
    howl.play();
  }, [queue, createHowl]);

  // 添加到队列
  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  // 从队列移除
  const removeFromQueue = useCallback((songId: string) => {
    setQueue(prev => prev.filter(song => song.id !== songId));
  }, []);

  // 清空队列
  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(0);
  }, []);


  const contextValue: MusicContextType = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playMode,
    isMuted,
    previousVolume,
    currentPlaylist,
    queue,
    queueIndex,
    originalQueue,
    play,
    pause,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    setVolume: setVolumeHandler,
    toggleMute,
    setPlayMode: setPlayModeHandler,
    togglePlayMode: togglePlayModeHandler,
    playSong,
    addToQueue,
    removeFromQueue,
    clearQueue
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};
