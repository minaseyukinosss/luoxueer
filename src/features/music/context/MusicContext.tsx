"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Howl, Howler } from "howler";
import { songList, type Song } from "@/features/music/data/music-data";

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  songs: Song[];
  createdAt: string;
  creator: string;
}

export enum PlayMode {
  SEQUENCE = "sequence",
  LOOP = "loop",
  SINGLE = "single",
  SHUFFLE = "shuffle",
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  playMode: PlayMode;
  isMuted: boolean;
  previousVolume: number;
  currentPlaylist: Playlist | null;
  queue: Song[];
  queueIndex: number;
  originalQueue: Song[];
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
  playSong: (song: Song) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
}

const DEFAULT_PLAYLIST: Playlist = {
  id: "1",
  name: "好心情",
  cover: "/images/album/lalala.webp",
  createdAt: "2025-08-19",
  creator: "Minase",
  songs: songList,
};

const PROGRESS_UPDATE_INTERVAL_MS = 250;

type MusicProgressSnapshot = {
  currentTime: number;
  duration: number;
};

type MusicProgressStore = {
  getSnapshot: () => MusicProgressSnapshot;
  subscribe: (listener: () => void) => () => void;
  setProgress: (progress: Partial<MusicProgressSnapshot>) => void;
};

const createMusicProgressStore = (): MusicProgressStore => {
  let snapshot: MusicProgressSnapshot = {
    currentTime: 0,
    duration: 0,
  };
  const listeners = new Set<() => void>();

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setProgress: (progress) => {
      const nextSnapshot = {
        ...snapshot,
        ...progress,
      };

      if (
        nextSnapshot.currentTime === snapshot.currentTime &&
        nextSnapshot.duration === snapshot.duration
      ) {
        return;
      }

      snapshot = nextSnapshot;
      listeners.forEach((listener) => listener());
    },
  };
};

const musicProgressStore = createMusicProgressStore();
const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

export const useMusicProgress = () =>
  useSyncExternalStore(
    musicProgressStore.subscribe,
    musicProgressStore.getSnapshot,
    musicProgressStore.getSnapshot,
  );

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(DEFAULT_PLAYLIST.songs[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.SEQUENCE);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [queue, setQueue] = useState<Song[]>(DEFAULT_PLAYLIST.songs);
  const [queueIndex, setQueueIndex] = useState(0);
  const [originalQueue] = useState<Song[]>(DEFAULT_PLAYLIST.songs);

  const howlRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleSongEndRef = useRef<() => void>(() => {});

  const unloadCurrentHowl = useCallback(() => {
    howlRef.current?.unload();
    howlRef.current = null;
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();

    const updateProgress = () => {
      if (howlRef.current) {
        const seek = howlRef.current.seek();
        musicProgressStore.setProgress({
          currentTime: typeof seek === "number" ? seek : 0,
        });
      }
    };

    updateProgress();
    progressIntervalRef.current = setInterval(updateProgress, PROGRESS_UPDATE_INTERVAL_MS);
  }, [stopProgressTracking]);

  const createHowl = useCallback(
    (song: Song) => {
      unloadCurrentHowl();
      musicProgressStore.setProgress({ currentTime: 0, duration: 0 });

      const howl = new Howl({
        src: [song.audioUrl],
        format: ["mp4"],
        html5: true,
        volume,
        onload: () => {
          musicProgressStore.setProgress({ duration: howl.duration() });
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
          handleSongEndRef.current();
        },
        onseek: () => {
          const seek = howl.seek();
          musicProgressStore.setProgress({
            currentTime: typeof seek === "number" ? seek : 0,
          });
        },
      });

      howlRef.current = howl;
      return howl;
    },
    [startProgressTracking, stopProgressTracking, unloadCurrentHowl, volume],
  );

  useEffect(() => {
    if (currentSong && !howlRef.current) {
      createHowl(currentSong);
    }
  }, [createHowl, currentSong]);

  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  useEffect(() => {
    return () => {
      stopProgressTracking();
      unloadCurrentHowl();
    };
  }, [stopProgressTracking, unloadCurrentHowl]);

  const play = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.play();
      return;
    }

    if (currentSong) {
      createHowl(currentSong).play();
    }
  }, [createHowl, currentSong]);

  const pause = useCallback(() => {
    howlRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const playQueueSong = useCallback(
    (index: number) => {
      const song = queue[index];
      if (!song) return;

      setQueueIndex(index);
      setCurrentSong(song);
      musicProgressStore.setProgress({ currentTime: 0, duration: 0 });
      createHowl(song).play();
    },
    [createHowl, queue],
  );

  const nextSong = useCallback(() => {
    if (queue.length === 0) return;

    const nextIndex =
      playMode === PlayMode.SHUFFLE
        ? Math.floor(Math.random() * queue.length)
        : (queueIndex + 1) % queue.length;

    playQueueSong(nextIndex);
  }, [playMode, playQueueSong, queue.length, queueIndex]);

  const previousSong = useCallback(() => {
    if (queue.length === 0) return;

    const previousIndex =
      playMode === PlayMode.SHUFFLE
        ? Math.floor(Math.random() * queue.length)
        : queueIndex === 0
          ? queue.length - 1
          : queueIndex - 1;

    playQueueSong(previousIndex);
  }, [playMode, playQueueSong, queue.length, queueIndex]);

  useEffect(() => {
    handleSongEndRef.current = () => {
      if (playMode === PlayMode.SINGLE && howlRef.current) {
        howlRef.current.seek(0);
        howlRef.current.play();
        return;
      }

      nextSong();
    };
  }, [nextSong, playMode]);

  const seekTo = useCallback((time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      musicProgressStore.setProgress({ currentTime: time });
    }
  }, []);

  const setVolumeHandler = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      Howler.volume(newVolume);

      if (isMuted && newVolume > 0) {
        setIsMuted(false);
        Howler.mute(false);
      }
    },
    [isMuted],
  );

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (nextMuted) {
      setPreviousVolume(volume);
      setVolume(0);
      Howler.mute(true);
    } else {
      setVolume(previousVolume);
      Howler.mute(false);
    }
  }, [isMuted, previousVolume, volume]);

  const setPlayModeHandler = useCallback(
    (mode: PlayMode) => {
      setPlayMode(mode);

      if (mode === PlayMode.SHUFFLE) {
        setQueue((currentQueue) => [...currentQueue].sort(() => Math.random() - 0.5));
      } else {
        setQueue(originalQueue);
      }
    },
    [originalQueue],
  );

  const togglePlayModeHandler = useCallback(() => {
    const modes = [PlayMode.SEQUENCE, PlayMode.SINGLE, PlayMode.SHUFFLE];
    const currentIndex = modes.indexOf(playMode);
    setPlayModeHandler(modes[(currentIndex + 1) % modes.length]);
  }, [playMode, setPlayModeHandler]);

  const playSong = useCallback(
    (song: Song) => {
      const index = queue.findIndex((queuedSong) => queuedSong.id === song.id);
      if (index !== -1) {
        setQueueIndex(index);
      }

      setCurrentSong(song);
      musicProgressStore.setProgress({ currentTime: 0, duration: 0 });
      createHowl(song).play();
    },
    [createHowl, queue],
  );

  const addToQueue = useCallback((song: Song) => {
    setQueue((currentQueue) => [...currentQueue, song]);
  }, []);

  const removeFromQueue = useCallback((songId: string) => {
    setQueue((currentQueue) => currentQueue.filter((song) => song.id !== songId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(0);
  }, []);

  const contextValue = useMemo<MusicContextType>(
    () => ({
      currentSong,
      isPlaying,
      volume,
      playMode,
      isMuted,
      previousVolume,
      currentPlaylist: DEFAULT_PLAYLIST,
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
      clearQueue,
    }),
    [
      addToQueue,
      clearQueue,
      currentSong,
      isMuted,
      isPlaying,
      nextSong,
      originalQueue,
      pause,
      play,
      playMode,
      playSong,
      previousSong,
      previousVolume,
      queue,
      queueIndex,
      removeFromQueue,
      seekTo,
      setPlayModeHandler,
      setVolumeHandler,
      toggleMute,
      togglePlayModeHandler,
      togglePlayPause,
      volume,
    ],
  );

  return <MusicContext.Provider value={contextValue}>{children}</MusicContext.Provider>;
};
