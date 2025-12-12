"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

type Track = {
  id?: string;
  title?: string;
  artist?: string;
  preview_url?: string | null;
  albumImage?: string;
};

type PlayerContextValue = {
  audioRef: React.RefObject<HTMLAudioElement>;
  playing: boolean;
  toggle: () => void;
  currentTrack: Track | null;
  playTrack: (t: Track) => void;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.preview_url ?? "";
      if (track.preview_url) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        setPlaying(false);
      }
    }
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [playing]);

  const value: PlayerContextValue = {
    audioRef,
    playing,
    toggle,
    currentTrack,
    playTrack,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
