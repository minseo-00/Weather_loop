"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { searchSpotifyTracks } from "@/shared/api/spotifySearch.api";
import { loadSpotifySDK, createSpotifyPlayer } from "@/shared/spotifyPlayer";

interface SidebarProps {
  weather?: string;
}

export default function Sidebar({ weather: weatherProp }: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  // 장르별 추천곡 mock 데이터 (Spotify 트랙 id 포함, 추후 확장)
  const GENRES = [
    { key: "Indie", label: "인디밴드" },
    { key: "Pop", label: "대중가요" },
    { key: "HipHop", label: "힙합" },
    { key: "Jazz", label: "재즈" },
  ];
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
  const [sdkReady, setSdkReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

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
        const keywordArray = weatherKeywordMap[w] || weatherKeywordMap["Default"];
        const keyword = getRandomKeywords(keywordArray);
        console.log("선택된 검색 키워드:", keyword);
        const items = await searchSpotifyTracks(keyword);
        setTracks(items);
        // 항상 첫 곡을 대표곡으로 지정
        setSelectedTrack(items && items.length > 0 ? items[0] : null);
      } catch (e) {
        setTracks([]);
        setSelectedTrack(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherProp]);

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
  useEffect(() => {
    if (!audio) {
      setCurrentTime(0);
      return;
    }
    const update = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', update);
    return () => {
      audio.removeEventListener('timeupdate', update);
    };
  }, [audio]);

  if (!mounted || loading) {
    return <div className="w-80 flex items-center justify-center h-full">로딩 중...</div>;
  }

  return (
    <aside className="w-80 bg-[#f5ecd7] border-r border-[#d2b48c] flex flex-col items-center py-8 overflow-hidden">
      {/* 대표곡(플레이어 스타일) */}
      {selectedTrack && (
        <div className="w-56 rounded-2xl bg-gradient-to-b from-white to-[#f5ecd7] flex flex-col items-center justify-center mb-8 border border-[#e2cfa7] shadow-lg pt-6 pb-4 mt-8">
          <div className="w-32 h-32 bg-[#e2cfa7] rounded-xl flex items-center justify-center mb-4 overflow-hidden">
            {selectedTrack.album?.images?.[0]?.url || selectedTrack.image ? (
              <img src={selectedTrack.album?.images?.[0]?.url || selectedTrack.image} alt={selectedTrack.name || selectedTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#444] text-5xl">♪</div>
            )}
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#222] mb-1 truncate max-w-[180px]">{selectedTrack.name || selectedTrack.title}</div>
            <div className="text-base text-[#7c5c3a] mb-2">{(selectedTrack.artists ? selectedTrack.artists[0]?.name : selectedTrack.artist) || ''}</div>
            {/* 재생 컨트롤만 (시간 표시 제거) */}
            <div className="flex flex-col items-center mt-2 gap-2">
              <div className="flex items-center gap-6">
                {/* 이전 트랙 */}
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#222]/90 hover:bg-[#222] transition-all"
                  onClick={() => {
                    if (audio) {
                      audio.pause();
                      setAudio(null);
                      setIsPlaying(false);
                    }
                    setAutoPlay(true);
                    playPrevTrack();
                  }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#e2e2e2" d="M17 18V6l-8.5 6z"/><rect x="5" y="6" width="2" height="12" rx="1" fill="#e2e2e2"/></svg>
                </button>
                {/* 재생/멈춤 */}
                {selectedTrack.preview_url ? (
                  <button
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#222]/90 hover:bg-[#222] transition-all shadow-lg"
                    onClick={() => {
                      if (audio) {
                        audio.pause();
                        setIsPlaying(false);
                        setAudio(null);
                      }
                      if (!isPlaying) {
                        const newAudio = new Audio(selectedTrack.preview_url);
                        setAudio(newAudio);
                        newAudio.play();
                        setIsPlaying(true);
                        // 노래 끝나면 자동으로 다음 곡 재생
                        newAudio.onended = () => {
                          setIsPlaying(false);
                          setAudio(null);
                          playNextTrackAuto();
                        };
                      }
                    }}
                  >
                    {isPlaying ? (
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="#e2e2e2"/><rect x="14" y="5" width="4" height="14" rx="1" fill="#e2e2e2"/></svg>
                    ) : (
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#e2e2e2" d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                ) : (
                  sdkReady && deviceId && selectedTrack && typeof selectedTrack.uri === 'string' && selectedTrack.uri.length > 0 && (
                    <button
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-[#222]/90 hover:bg-[#222] transition-all shadow-lg"
                      onClick={async () => {
                        const token = getCookie("spotify_access_token");
                        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                          {
                            method: "PUT",
                            headers: {
                              "Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ uris: [selectedTrack.uri] })
                          });
                      }}
                    >
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#e2e2e2" d="M8 5v14l11-7z"/></svg>
                    </button>
                  )
                )}
                {/* 다음 트랙 */}
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#222]/90 hover:bg-[#222] transition-all"
                  onClick={() => {
                    if (audio) {
                      audio.pause();
                      setAudio(null);
                      setIsPlaying(false);
                    }
                    setAutoPlay(true);
                    playNextTrack();
                  }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#e2e2e2" d="M7 6v12l8.5-6z"/><rect x="17" y="6" width="2" height="12" rx="1" fill="#e2e2e2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 추천곡 리스트 (곡명-가수-미리듣기) */}
      <div className="flex flex-col items-center w-full px-4">
        <h3 className="font-bold mb-2 text-[#7c5c3a]">오늘의 날씨 기반 추천곡</h3>
        {tracks.length === 0 ? (
          <div className="text-gray-400 text-center py-8">Spotify에서 곡을 찾을 수 없습니다.</div>
        ) : (
          <ul className="w-full">
            {tracks.slice(0, 5).map((track, idx) => (
              <li key={track.id} className="flex items-center justify-between py-2 border-b cursor-pointer hover:bg-[#e2cfa7]/30 px-2 rounded"
                onClick={() => setSelectedTrack(track)}>
                <div>
                  <div className="text-sm font-medium">{track.name || track.title}</div>
                  <div className="text-xs text-gray-500">{(track.artists ? track.artists[0]?.name : track.artist) || ''}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
