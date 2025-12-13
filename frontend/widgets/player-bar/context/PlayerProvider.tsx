"use client";

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { loadSpotifySDK, createSpotifyPlayer } from "@/shared/spotifyPlayer";

type Track = {
  id?: string;
  name?: string;
  title?: string;
  artist?: string;
  artists?: { name: string }[];
  albumImage?: string;
  album?: { images?: { url: string }[] };
  image?: string;
  uri?: string;
};

type PlayerContextValue = {
  playing: boolean;
  toggle: () => void;
  currentTrack: Track | null;
  playTrack: (t: Track) => void;
  playlist: Track[];
  setPlaylist: (tracks: Track[]) => void;
  currentIndex: number;
  playNext: () => void;
  playPrev: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  repeat: "off" | "all" | "one";
  toggleRepeat: () => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  playAtIndex: (index: number) => void;
  isReady: boolean;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

// 쿠키에서 Spotify access token 가져오기
function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/spotify_access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // 자동 다음 곡 재생을 위한 ref
  const playlistRef = useRef<Track[]>([]);
  const currentIndexRef = useRef(0);
  const repeatRef = useRef<"off" | "all" | "one">("off");
  const shuffleRef = useRef(false);
  const deviceIdRef = useRef<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  
  // ref 동기화
  useEffect(() => { playlistRef.current = playlist; }, [playlist]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { deviceIdRef.current = deviceId; }, [deviceId]);
  useEffect(() => { accessTokenRef.current = accessToken; }, [accessToken]);

  // Spotify SDK 초기화
  useEffect(() => {
    const initPlayer = async () => {
      const token = getAccessTokenFromCookie();
      if (!token) {
        console.log("No Spotify access token found");
        return;
      }
      setAccessToken(token);

      try {
        await loadSpotifySDK();
        const player = createSpotifyPlayer(token, (id) => {
          setDeviceId(id);
          setIsReady(true);
          console.log("Spotify player ready, device ID:", id);
        });
        playerRef.current = player;
        // window에 할당하여 어디서든 접근 가능하게
        if (typeof window !== 'undefined') {
          window.spotifyPlayer = player;
        }

        // 플레이어 상태 변경 리스너
        player.addListener('player_state_changed', (state: any) => {
          if (!state) return;
          setPlaying(!state.paused);
          setCurrentTime(state.position / 1000);
          setDuration(state.duration / 1000);
          
          // 현재 트랙 정보 업데이트
          if (state.track_window?.current_track) {
            const track = state.track_window.current_track;
            setCurrentTrack({
              id: track.id,
              name: track.name,
              artist: track.artists?.map((a: any) => a.name).join(', '),
              albumImage: track.album?.images?.[0]?.url,
              uri: track.uri
            });
          }
          
          // 곡이 끝나면 자동으로 다음 곡 재생
          if (state.paused && state.position === 0 && state.track_window?.previous_tracks?.length > 0) {
            console.log('Track ended, playing next...');
            const pl = playlistRef.current;
            const idx = currentIndexRef.current;
            const rep = repeatRef.current;
            const shuf = shuffleRef.current;
            const devId = deviceIdRef.current;
            const token = accessTokenRef.current;
            
            if (pl.length === 0 || !devId || !token) return;
            
            let nextIdx: number;
            if (rep === 'one') {
              // 한곡 반복
              nextIdx = idx;
            } else if (shuf) {
              nextIdx = Math.floor(Math.random() * pl.length);
            } else {
              nextIdx = (idx + 1) % pl.length;
              // 반복 끔 + 마지막 곡이면 정지
              if (rep === 'off' && idx === pl.length - 1) return;
            }
            
            const nextTrack = pl[nextIdx];
            if (nextTrack) {
              const uri = nextTrack.uri || `spotify:track:${nextTrack.id}`;
              setCurrentIndex(nextIdx);
              fetch(`https://api.spotify.com/v1/me/player/play?device_id=${devId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ uris: [uri] })
              }).catch(err => console.error('Auto next track failed:', err));
            }
          }
        });

      } catch (err) {
        console.error("Failed to initialize Spotify player:", err);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, []);

  // 현재 시간 주기적 업데이트
  useEffect(() => {
    if (!playerRef.current || !playing) return;
    
    const interval = setInterval(async () => {
      const state = await playerRef.current?.getCurrentState();
      if (state) {
        setCurrentTime(state.position / 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playing]);

  // Spotify API로 곡 재생
  const playTrack = useCallback(async (track: Track) => {
    if (!deviceId || !accessToken) {
      console.warn("Player not ready or no access token");
      return;
    }

    const uri = track.uri || `spotify:track:${track.id}`;
    setCurrentTrack(track);
    
    // playlist에서 해당 트랙의 인덱스 찾아서 currentIndex 업데이트
    const idx = playlistRef.current.findIndex(t => t.id === track.id || t.uri === track.uri);
    // 인덱스를 찾지 못하면 0으로 설정 (새 playlist의 첫 곡일 경우)
    setCurrentIndex(idx !== -1 ? idx : 0);
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          uris: [uri]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to play track:", error);
      } else {
        setPlaying(true);
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  }, [deviceId, accessToken]);

  const playAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentIndex(index);
      playTrack(playlist[index]);
    }
  }, [playlist, playTrack]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    setCurrentIndex(nextIndex);
    playTrack(playlist[nextIndex]);
  }, [playlist, currentIndex, shuffle, playTrack]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    let prevIndex: number;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    }
    setCurrentIndex(prevIndex);
    playTrack(playlist[prevIndex]);
  }, [playlist, currentIndex, shuffle, playTrack]);

  const toggle = useCallback(async () => {
    if (!playerRef.current) {
      console.warn("Player not initialized");
      return;
    }
    await playerRef.current.togglePlay();
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const seek = useCallback(async (time: number) => {
    if (playerRef.current) {
      await playerRef.current.seek(time * 1000);
      setCurrentTime(time);
    }
  }, []);

  const value: PlayerContextValue = {
    playing,
    toggle,
    currentTrack,
    playTrack,
    playlist,
    setPlaylist,
    currentIndex,
    playNext,
    playPrev,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    currentTime,
    duration,
    seek,
    playAtIndex,
    isReady,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
