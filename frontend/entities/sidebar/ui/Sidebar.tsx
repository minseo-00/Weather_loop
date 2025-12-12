"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { searchSpotifyTracks } from "@/shared/api/spotifySearch.api";
import { loadSpotifySDK, createSpotifyPlayer } from "@/shared/spotifyPlayer";

interface SidebarProps {
  weather?: string;
  selectedGenre?: string;
  onGenreChange?: (genre: string) => void;
}

export default function Sidebar({ weather: weatherProp, selectedGenre: selectedGenreProp, onGenreChange }: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  // 장르별 추천곡 mock 데이터 (Spotify 트랙 id 포함, 추후 확장)
  const [genres, setGenres] = useState([
    { key: "weather", label: "날씨 추천", emoji: "🌤️" },
    { key: "Indie", label: "인디", emoji: "🎸" },
    { key: "Pop", label: "팝", emoji: "🎤" },
    { key: "HipHop", label: "힙합", emoji: "🎧" },
    { key: "Jazz", label: "재즈", emoji: "🎷" },
    { key: "Rock", label: "록/록발라드", emoji: "🎸" },
    { key: "LoFi", label: "Lo‑Fi", emoji: "😌" },
  ]);
  
  const selectedGenre = selectedGenreProp || "weather";
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleGenreChange = (genre: string) => {
    if (onGenreChange) {
      onGenreChange(genre);
    }
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(trackId)) {
        newFavorites.delete(trackId);
      } else {
        newFavorites.add(trackId);
      }
      return newFavorites;
    });
  };
  const genreTracks: Record<string, any> = {
    Indie: [
      { id: "1", title: "밤하늘의 별을", artist: "양정승", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
      { id: "2", title: "벚꽃 엔딩", artist: "버스커버스커", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
    ],
    Pop: [
      { id: "3", title: "Love Dive", artist: "IVE", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
      { id: "4", title: "Ditto", artist: "NewJeans", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
    ],
    HipHop: [
      { id: "5", title: "VVS", artist: "미란이, 머쉬베놈", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
      { id: "6", title: "아무노래", artist: "지코", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
    ],
    Jazz: [
      { id: "7", title: "Autumn Leaves", artist: "Bill Evans", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
      { id: "8", title: "Take Five", artist: "Dave Brubeck", image: "https://i.scdn.co/image/ab67616d0000b273b2e7e7e7e7e7e7e7e7e7e7e7", preview_url: "" },
    ],
  };

  // 날씨 상태/추천곡
  const [weather, setWeather] = useState<string>(weatherProp ?? "Default");
  const [tracks, setTracks] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(30);
  const [sdkReady, setSdkReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  const [usingSdk, setUsingSdk] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // access_token 쿠키 파싱 함수 복구
  function getCookie(name: string) {
    if (typeof document === "undefined") return "";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || "";
    return "";
  }



  // Web Playback SDK 로드 및 플레이어 초기화
  useEffect(() => {
    const token = getCookie("spotify_access_token");
    if (!token) {
      console.log("No Spotify access token");
      return;
    }
    loadSpotifySDK().then(() => {
      console.log("Spotify SDK loaded");
      setSdkReady(true);
      if (!playerRef.current) {
        playerRef.current = createSpotifyPlayer(token, (id: string) => {
          console.log("Spotify Player ready, deviceId:", id);
          setDeviceId(id);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 날씨별 키워드 매핑 (배열로 변경 - 랜덤 선택 가능)
  const weatherKeywordMap: Record<string, string[]> = {
    Clear: ["sunny day playlist", "summer vibes", "happy mood", "feel good music", "upbeat pop", "신나는", "청량한"],
    Rain: ["rainy day playlist", "rain mood", "melancholy", "lo-fi rain", "acoustic chill", "비오는날", "감성"],
    Snow: ["winter playlist NOT Winter", "cozy winter music", "christmas chill", "snowfall ambient", "겨울감성 NOT 윈터"],
    Clouds: ["cloudy mood", "chill vibes", "soft music", "dreamy playlist", "ambient chill", "잔잔한"],
    Thunderstorm: ["rock energy", "powerful music", "intense playlist", "epic soundtrack", "dramatic"],
    Drizzle: ["lo-fi chill", "soft rain music", "acoustic relaxing", "calm playlist", "부드러운"],
    Mist: ["ambient music", "dreamy playlist", "foggy mood", "ethereal", "atmospheric", "새벽감성"],
    Default: ["top hits 2024", "popular playlist", "trending music", "best chill", "k-pop best"]
  };

  // 배열에서 랜덤하게 1~2개 선택하는 함수
  const getRandomKeywords = (keywords: string[]): string => {
    const shuffled = [...keywords].sort(() => Math.random() - 0.5);
    const count = Math.random() > 0.5 ? 2 : 1;
    return shuffled.slice(0, count).join(", ");
  };



  useEffect(() => {
    setMounted(true);
    const w: string = weatherProp ?? "Default";
    setWeather(w);
    setLoading(true);
    const fetchTracks = async () => {
      try {
        let keyword = "";
        if (selectedGenre === "weather") {
          // 날씨 기반 추천
          keyword = weatherKeywordMap[w] || weatherKeywordMap["Default"];
        } else {
          // 장르 기반 추천
          keyword = selectedGenre;
        }
        const items = await searchSpotifyTracks(keyword);
        setTracks(items);
        // 항상 첫 곡을 대표곡으로 지정
        setSelectedTrack(items && items.length > 0 ? items[0] : null);
      } catch (e) {
        // Spotify 로그인이 필요한 경우 조용히 처리
        console.log('Spotify 로그인이 필요합니다. 추천곡을 불러올 수 없습니다.');
        setTracks([]);
        setSelectedTrack(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherProp, selectedGenre]);

  // selectedTrack 변경 시 콘솔 출력 (디버깅용)
  useEffect(() => {
    if (selectedTrack) {
      // eslint-disable-next-line no-console
      console.log('selectedTrack', JSON.stringify(selectedTrack, null, 2));
      console.log('deviceId', deviceId, 'sdkReady', sdkReady);
    }
  }, [selectedTrack, deviceId, sdkReady]);

  // 현재 선택된 트랙의 인덱스 계산
  const currentTrackIndex = tracks.findIndex(t => t.id === selectedTrack?.id);

  // 다음 곡 재생 함수
  const playNextTrack = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setSelectedTrack(tracks[nextIndex]);
  };

  // 이전 곡 재생 함수
  const playPrevTrack = () => {
    if (tracks.length === 0) return;
    const prevIndex = currentTrackIndex <= 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setSelectedTrack(tracks[prevIndex]);
  };

  // 자동 재생 여부 상태 (이전/다음 버튼으로 곡 변경 시에만 자동 재생)
  const [autoPlay, setAutoPlay] = useState(false);

  // 다음 곡 재생 함수 (자동재생 플래그 설정)
  const playNextTrackAuto = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setAutoPlay(true);
    setSelectedTrack(tracks[nextIndex]);
  };

  // selectedTrack 변경 시 자동 재생 (autoPlay가 true일 때만)
  useEffect(() => {
    if (autoPlay && selectedTrack?.preview_url) {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      const newAudio = new Audio(selectedTrack.preview_url);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
        playNextTrackAuto();
      };
      setAutoPlay(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack, autoPlay]);

  // 재생 시간 상태 및 포맷 함수 (Hook 순서 오류 방지: 최상단에 위치)
  const [currentTime, setCurrentTime] = useState(0);
  function formatTime(sec: number) {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  // 공용 오디오 제어 유틸
  const stopAudio = () => {
    if (audio) {
      try { audio.pause(); } catch {}
    }
    setIsPlaying(false);
    setAudio(null);
  };

  const startAudioFor = (track: any) => {
    if (!track?.preview_url) return;
    const newAudio = new Audio(track.preview_url);
    setAudio(newAudio);
    setIsPlaying(true);
    newAudio.onloadedmetadata = () => {
      const d = isFinite(newAudio.duration) && newAudio.duration > 0 ? newAudio.duration : 30;
      setDuration(d);
    };
    newAudio.play().catch(() => {
      setIsPlaying(false);
      setAudio(null);
    });
    newAudio.onended = () => {
      setIsPlaying(false);
      setAudio(null);
    };
  };

  const getAccessToken = () => getCookie("spotify_access_token");

  const transferPlayback = async () => {
    if (!deviceId) return false;
    const token = getAccessToken();
    if (!token) return false;
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ device_ids: [deviceId], play: true })
      });
      if (!res.ok) return false;
      setNotice('브라우저 플레이어로 전환되었습니다. 다시 재생을 눌러주세요.');
      return true;
    } catch (e) {
      console.warn('transferPlayback failed', e);
      return false;
    }
  };

  const playOnSpotify = async (track: any) => {
    if (!sdkReady || !playerRef.current || !deviceId || !track) {
      setNotice('브라우저 플레이어 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return false;
    }
    const token = getAccessToken();
    if (!token) {
      setNotice('Spotify 로그인 후 전체 재생이 가능합니다.');
      return false;
    }
    try {
      // 브라우저 오디오 활성화 (사용자 제스처 안에서 호출 필요)
      if (playerRef.current.activateElement) {
        try { await playerRef.current.activateElement(); } catch {}
      }
    } catch {}
    const ok = await transferPlayback();
    try {
      const uri = track.uri || (track.id ? `spotify:track:${track.id}` : null);
      if (!uri) return false;
      const playRes = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: [uri] })
      });
      if (!playRes.ok) {
        if (playRes.status === 403) {
          setNotice('Spotify 프리미엄이 필요합니다. 미리듣기로 전환합니다.');
        } else {
          setNotice('브라우저 플레이어로 전환 후 다시 시도하세요.');
        }
        return false;
      }
      setUsingSdk(true);
      setIsPlaying(true);
      // 오디오 미리듣기 정리
      stopAudio();
      return true;
    } catch (e) {
      console.warn('playOnSpotify failed', e);
      setNotice('전체 재생을 시작할 수 없습니다. 미리듣기로 전환합니다.');
      return false;
    }
  };

  const pauseSpotify = async () => {
    if (!playerRef.current) return;
    try {
      await playerRef.current.pause();
      setIsPlaying(false);
    } catch (e) {
      console.warn('pauseSpotify failed', e);
    }
  };

  const resumeSpotify = async () => {
    if (!playerRef.current) return;
    try {
      if (playerRef.current.activateElement) {
        try { await playerRef.current.activateElement(); } catch {}
      }
      await playerRef.current.resume();
      setIsPlaying(true);
    } catch (e) {
      console.warn('resumeSpotify failed', e);
    }
  };

  const handlePlayPause = () => {
    // SDK 우선 사용 (전체 재생)
    if (usingSdk || (sdkReady && playerRef.current && deviceId)) {
      if (isPlaying) {
        pauseSpotify();
      } else {
        if (!usingSdk) {
          playOnSpotify(selectedTrack).then((ok) => {
            if (!ok && selectedTrack?.preview_url) {
              // 권한/프리미엄/스코프 문제 시 미리듣기로 폴백
              stopAudio();
              startAudioFor(selectedTrack);
            } else if (!ok && !selectedTrack?.preview_url) {
              setNotice('이 트랙은 미리듣기를 지원하지 않습니다.');
            }
          });
        } else {
          resumeSpotify();
        }
      }
      return;
    }
    // SDK 사용 불가 시, 마지막 수단으로 미리듣기
    if (selectedTrack?.preview_url) {
      if (isPlaying && audio) {
        stopAudio();
      } else {
        if (audio) stopAudio();
        startAudioFor(selectedTrack);
      }
    }
  };

  const seek = (delta: number) => {
    if (usingSdk && playerRef.current) {
      playerRef.current.getCurrentState().then((state: any) => {
        if (!state) return;
        const pos = (state.position || 0) / 1000;
        const dur = (state.duration || (duration * 1000)) / 1000;
        const next = Math.min(dur, Math.max(0, pos + delta));
        playerRef.current.seek(next * 1000).catch(() => {});
        setCurrentTime(next);
        setDuration(dur || 30);
      });
      return;
    }
    if (audio) {
      const dur = duration || 30;
      const next = Math.min(dur, Math.max(0, (audio.currentTime || 0) + delta));
      try { audio.currentTime = next; } catch {}
      setCurrentTime(next);
    }
  };

  const changeTrack = (step: number) => {
    if (!tracks || tracks.length === 0 || !selectedTrack) return;
    const idx = tracks.findIndex((t) => t.id === selectedTrack.id);
    if (idx < 0) return;
    const nextIdx = (idx + step + tracks.length) % tracks.length;
    const nextTrack = tracks[nextIdx];
    setSelectedTrack(nextTrack);
    // SDK 우선 재생
    if (sdkReady && playerRef.current && deviceId) {
      playOnSpotify(nextTrack).then((ok) => {
        if (!ok && nextTrack?.preview_url) {
          setNotice('전체 재생이 불가하여 미리듣기로 재생합니다.');
          stopAudio();
          startAudioFor(nextTrack);
        }
      });
    } else {
      stopAudio();
      if (nextTrack?.preview_url) startAudioFor(nextTrack);
    }
  };
  useEffect(() => {
    if (!audio) {
      setCurrentTime(0);
      return;
    }
    const update = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      const d = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
      setDuration(d);
    };
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', onMeta);
    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', onMeta);
    };
  }, [audio]);

  // SDK 재생 중이면 주기적으로 상태 폴링하여 진행 시간/길이 반영
  useEffect(() => {
    if (!usingSdk || !playerRef.current) return;
    const timer = setInterval(async () => {
      try {
        const state = await playerRef.current.getCurrentState();
        if (state) {
          setCurrentTime((state.position || 0) / 1000);
          const d = (state.duration || 0) / 1000;
          if (d) setDuration(d);
          setIsPlaying(!state.paused);
        }
      } catch {}
    }, 500);
    return () => clearInterval(timer);
  }, [usingSdk]);

  if (!mounted || loading) {
    return <div className="w-80 flex items-center justify-center h-full surface elev-1">로딩 중...</div>;
  }

  return (
    <aside className="w-80 surface flex flex-col items-center py-8 overflow-hidden elev-1">
      {/* Now Playing (간결 카드) */}
      {selectedTrack && (
        <div className="w-64 surface elev-2 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-md overflow-hidden" style={{ background: 'var(--muted)' }}>
              {selectedTrack.album?.images?.[0]?.url || selectedTrack.image ? (
                <img src={selectedTrack.album?.images?.[0]?.url || selectedTrack.image} alt={selectedTrack.name || selectedTrack.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: '#999' }}>커버</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{selectedTrack.name || selectedTrack.title}</div>
              <div className="text-xs text-gray-500 truncate">{(selectedTrack.artists ? selectedTrack.artists[0]?.name : selectedTrack.artist) || ''}</div>
            </div>
          </div>
          {/* Controls */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              className="w-8 h-8 rounded-full surface hover:elev-1 flex items-center justify-center"
              onClick={() => changeTrack(-1)}
              title="이전 곡"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 5v14" stroke="var(--foreground)" strokeWidth="2"/><path d="M20 19L9 12l11-7v14z" fill="var(--foreground)"/></svg>
            </button>
            <button
              className="px-2 h-8 rounded-full surface hover:elev-1 text-xs font-semibold"
              onClick={() => seek(-10)}
              title="-10초"
            >
              -10s
            </button>
            <button
              className="w-9 h-9 rounded-full btn-accent elev-1 flex items-center justify-center"
              onClick={handlePlayPause}
              title={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="7" y="5" width="3" height="14" rx="1" fill="var(--foreground)"/><rect x="14" y="5" width="3" height="14" rx="1" fill="var(--foreground)"/></svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="var(--foreground)" d="M9 5v14l10-7z"/></svg>
              )}
            </button>
            <button
              className="px-2 h-8 rounded-full surface hover:elev-1 text-xs font-semibold"
              onClick={() => seek(10)}
              title="+10초"
            >
              +10s
            </button>
            <button
              className="w-8 h-8 rounded-full surface hover:elev-1 flex items-center justify-center"
              onClick={() => changeTrack(1)}
              title="다음 곡"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 19V5" stroke="var(--foreground)" strokeWidth="2"/><path d="M4 5l11 7L4 19V5z" fill="var(--foreground)"/></svg>
            </button>
          </div>
          {notice && (
            <div className="mt-2 text-[11px] text-gray-600 flex items-start gap-2">
              <span aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
              </span>
              <div className="flex-1">{notice}</div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setNotice(null)}>닫기</button>
            </div>
          )}
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full h-1.5 rounded bg-[rgba(0,0,0,0.06)] overflow-hidden">
              <div
                className="h-full rounded"
                style={{ width: `${Math.min(100, Math.max(0, (currentTime / (duration || 30)) * 100))}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-strong))' }}
              />
            </div>
            <div className="mt-1.5 text-[11px] text-gray-500 flex justify-between">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 30)}</span>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
      
      {/* 장르 선택 탭 */}
      <div className="w-full px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {genres.map((genre, index) => (
            <button
              key={genre.key}
              draggable
              onDragStart={(e) => {
                setDraggedIndex(index);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIndex !== null && draggedIndex !== index) {
                  const newGenres = [...genres];
                  const [removed] = newGenres.splice(draggedIndex, 1);
                  newGenres.splice(index, 0, removed);
                  setGenres(newGenres);
                }
                setDraggedIndex(null);
              }}
              onDragEnd={() => setDraggedIndex(null)}
              onClick={() => handleGenreChange(genre.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-move ${
                selectedGenre === genre.key
                  ? 'btn-accent text-gray-800 elev-1 scale-105'
                  : 'surface hover:elev-1'
              } ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}`}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* 추천곡 리스트 (곡명-가수-미리듣기) */}
      <div className="flex flex-col items-center w-full px-4">
        <h3 className="font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          {selectedGenre === "weather"
            ? "오늘의 날씨 기반 추천곡"
            : `${(genres.find(g => g.key === selectedGenre)?.label || selectedGenre)} 추천곡`}
        </h3>
        {loading ? (
          <div className="text-gray-400 text-center py-8">로딩 중...</div>
        ) : tracks.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p className="mb-3">음악을 듣기 위해서는</p>
            <p className="mb-4 text-sm">Spotify 로그인이 필요합니다</p>
            <a 
              href="/api/auth/login" 
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors btn-accent elev-2"
            >
              Spotify로 로그인
            </a>
          </div>
        ) : (
          <ul className="w-full">
            {tracks.slice(0, 5).map((track, idx) => (
              <li key={track.id} className="flex items-center justify-between py-2 border-b px-2 rounded group" style={{ borderColor: 'var(--border)' }}>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setSelectedTrack(track)}
                >
                  <div className="text-sm font-medium">{track.name || track.title}</div>
                  <div className="text-xs text-gray-500">{(track.artists ? track.artists[0]?.name : track.artist) || ''}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(track.id);
                  }}
                  className="ml-3 p-2 hover:scale-110 transition-transform"
                >
                  {favorites.has(track.id) ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff6b6b" stroke="#ff6b6b" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" className="group-hover:stroke-[#ff6b6b] transition-colors">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
