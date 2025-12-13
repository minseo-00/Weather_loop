"use client";

import React, { useState, useEffect } from "react";
import { searchSpotifyTracks } from "@/shared/api/spotifySearch.api";
import { usePlayer } from "@/widgets/player-bar/context/PlayerProvider";
import axios from "axios";

interface SidebarProps {
  weather?: string;
  isNight?: boolean;
}

import VolumeControl from "./VolumeControl";
// 북마크된 곡 ID를 저장하는 Set
type BookmarkSet = Set<string>;

export default function Sidebar({ weather: weatherProp, isNight = false }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkSet>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  const {
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
  } = usePlayer();

  // 날씨+시간별 키워드 매핑 (다양하고 유명한 곡들)
  const getSearchKeyword = (weather: string, night: boolean): string => {
    // 각 날씨별로 여러 키워드 세트를 두고 랜덤하게 선택
    const keywordSets: Record<string, { day: string[]; night: string[] }> = {
      Clear: {
        day: [
          "feel good hits 2024 pop",
          "좋은기분 인기곡 playlist",
          "happy mood K-pop hits",
          "기분좋은 드라이브 노래",
          "sunny day playlist pop",
          "bright mood popular songs",
          "행복 에너지 인기차트",
          "upbeat hits trending",
        ],
        night: [
          "chill night R&B hits",
          "야경 드라이브 인기곡",
          "late night vibes playlist",
          "밤 감성 발라드 인기",
          "night drive popular songs",
          "별빛 아래 romantic hits",
          "evening chill K-pop",
          "midnight mood popular",
        ]
      },
      Rain: {
        day: [
          "rainy day acoustic popular",
          "비오는날 인기 발라드",
          "chill rain playlist hits",
          "감성 카페 노래 인기곡",
          "acoustic covers popular",
          "잔잔한 노래 추천 인기",
          "soft music rainy mood",
          "빗소리 어울리는 노래",
        ],
        night: [
          "rainy night jazz lo-fi",
          "비오는밤 감성 발라드 인기",
          "late night rain piano",
          "새벽 감성곡 인기차트",
          "midnight rain chill hits",
          "비오는 밤 재즈 인기",
          "cozy night popular songs",
          "rainy evening K-pop ballad",
        ]
      },
      Snow: {
        day: [
          "winter hits popular 2024",
          "겨울 노래 인기차트",
          "christmas songs popular",
          "크리스마스 캐롤 인기",
          "winter K-pop hits",
          "겨울 발라드 명곡",
          "snow day playlist hits",
          "따뜻한 겨울노래 인기",
        ],
        night: [
          "winter night ballad hits",
          "겨울밤 감성 인기곡",
          "cozy christmas popular",
          "눈오는밤 로맨틱 노래",
          "fireplace jazz popular",
          "겨울밤 재즈 인기",
          "snowy night chill hits",
          "따뜻한 밤 발라드 명곡",
        ]
      },
      Clouds: {
        day: [
          "indie pop popular hits",
          "인디 밴드 인기곡 추천",
          "chill pop playlist 2024",
          "흐린날 어울리는 노래",
          "alternative hits popular",
          "감성 인디 인기차트",
          "mellow mood popular songs",
          "cloudy day playlist",
        ],
        night: [
          "dreamy night chill hits",
          "새벽 감성 인기곡",
          "ambient chill popular",
          "몽환적인 노래 인기",
          "late night indie hits",
          "밤 감성 인디 추천",
          "ethereal music popular",
          "midnight chill playlist",
        ]
      },
      Thunderstorm: {
        day: [
          "rock hits popular 2024",
          "록 밴드 인기곡",
          "powerful music hits",
          "강렬한 노래 인기",
          "epic rock playlist",
          "에너지 넘치는 노래",
          "intense popular songs",
          "dramatic hits playlist",
        ],
        night: [
          "dark rock hits popular",
          "밤 록 인기곡",
          "cinematic epic music",
          "격렬한 밤 노래",
          "intense night playlist",
          "dramatic popular songs",
          "powerful night hits",
          "intense K-rock popular",
        ]
      },
      Drizzle: {
        day: [
          "lo-fi beats popular",
          "카페 음악 인기곡",
          "study playlist hits",
          "공부할때 듣는 노래",
          "chill beats popular 2024",
          "집중 음악 인기",
          "relaxing music hits",
          "편안한 노래 추천",
        ],
        night: [
          "sleep music popular",
          "수면 음악 인기",
          "calm piano hits",
          "잔잔한 피아노 인기곡",
          "relaxing night playlist",
          "편안한 밤 노래",
          "peaceful music popular",
          "healing music 인기",
        ]
      },
      Mist: {
        day: [
          "dreamy pop hits",
          "몽환적인 노래 인기",
          "atmospheric music popular",
          "신비로운 분위기 노래",
          "ethereal playlist hits",
          "ambient pop 인기곡",
          "misty mood popular",
          "감성 팝 추천",
        ],
        night: [
          "mysterious night hits",
          "새벽 몽환 인기곡",
          "ambient night popular",
          "신비로운 밤 노래",
          "late night ambient hits",
          "밤 감성 몽환 음악",
          "ethereal night playlist",
          "dreamy midnight popular",
        ]
      },
      Default: {
        day: [
          "top hits 2024 popular",
          "인기차트 K-pop 2024",
          "trending songs popular",
          "최신 인기곡 추천",
          "viral hits playlist",
          "핫한 노래 인기차트",
          "popular music 2024",
          "chart hits K-pop",
        ],
        night: [
          "night playlist popular hits",
          "밤 드라이브 인기곡",
          "chill night R&B popular",
          "심야 감성 인기차트",
          "late night hits 2024",
          "야간 드라이브 노래",
          "midnight vibes popular",
          "밤 감성 추천 인기",
        ]
      }
    };
    
    const w = keywordSets[weather] || keywordSets["Default"];
    const keywords = night ? w.night : w.day;
    // 랜덤하게 키워드 선택
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    return randomKeyword;
  };

  // 시간 포맷
  function formatTime(sec: number) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // 트랙 정보 추출 헬퍼
  const getTrackName = (track: any) => track?.name || track?.title || "Unknown";
  const getArtistName = (track: any) => track?.artists?.[0]?.name || track?.artist || "Unknown";
  const getAlbumImage = (track: any) => track?.album?.images?.[0]?.url || track?.image || track?.albumImage || "";
  // 앨범 이미지 URL을 최대한 보장하는 함수 (track 구조 다양성 대응)
  const getSafeAlbumImage = (track: any) => {
    if (track?.album?.images && Array.isArray(track.album.images) && track.album.images[0]?.url) {
      return track.album.images[0].url;
    }
    if (track?.albumImage) return track.albumImage;
    if (track?.image) return track.image;
    if (track?.images && Array.isArray(track.images) && track.images[0]?.url) {
      return track.images[0].url;
    }
    return "";
  };

  // 이전 날씨/밤낮 상태 추적
  const [prevWeather, setPrevWeather] = useState<string | null>(null);
  const [prevIsNight, setPrevIsNight] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    const w = weatherProp ?? "Default";
    setLoading(true);

    const fetchTracks = async () => {
      try {
        const keyword = getSearchKeyword(w, isNight);
        console.log('Searching tracks with keyword:', keyword, 'weather:', w, 'isNight:', isNight);
        const items = await searchSpotifyTracks(keyword);
        setTracks(items);
        setPlaylist(items);
        
        // 날씨나 밤/낮이 변경되었을 때 첫 곡 자동 재생
        const weatherChanged = prevWeather !== null && prevWeather !== w;
        const nightChanged = prevIsNight !== null && prevIsNight !== isNight;
        
        if ((weatherChanged || nightChanged) && items.length > 0 && isReady) {
          console.log('Weather/Night changed, auto-playing first track');
          // 직접 첫 번째 트랙을 재생
          playTrack(items[0]);
        }
        
        setPrevWeather(w);
        setPrevIsNight(isNight);
      } catch {
        setTracks([]);
        setPlaylist([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherProp, isNight]);

  // 최초 로드 시 isReady가 되면 첫 곡 자동 재생
  useEffect(() => {
    if (isReady && tracks.length > 0 && !currentTrack) {
      console.log('Player ready, auto-playing first track');
      playTrack(tracks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, tracks]);

  // 사용자 정보 및 북마크 목록 불러오기
  useEffect(() => {
    if (!mounted) return; // 클라이언트에서만 실행
    
    const fetchUserAndBookmarks = async () => {
      try {
        // 백엔드 URL (ngrok 사용)
        const baseUrl = '';
        
        console.log('Fetching auth from:', `${baseUrl}/auth/me`);
        const res = await axios.get(`${baseUrl}/auth/me`, { withCredentials: true });
        console.log('Auth check result:', res.data);
        
        if (res.data.user) {
          setUserId(res.data.user.user_id);
          // 북마크 목록 가져오기
          console.log('Fetching bookmarks for:', res.data.user.user_id);
          const bookmarkRes = await axios.get(
            `${baseUrl}/api/bookmark/list?user_id=${res.data.user.user_id}`,
            { withCredentials: true }
          );
          console.log('Bookmark result:', bookmarkRes.data);
          if (bookmarkRes.data.ok) {
            const bookmarkIds = new Set<string>(bookmarkRes.data.bookmarks.map((b: any) => b.spotify_id));
            setBookmarks(bookmarkIds);
          }
        } else {
          console.log('No user logged in');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUserId(null);
      }
    };
    fetchUserAndBookmarks();
  }, [mounted]);

  // API 베이스 URL 헬퍼
  const getBaseUrl = () => '';

  // 북마크 토글 함수
  const toggleBookmark = async (track: any, e: React.MouseEvent) => {
    e.stopPropagation(); // 트랙 클릭 이벤트 방지
    
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const spotifyId = track.id;
    const isCurrentlyBookmarked = bookmarks.has(spotifyId);
    const baseUrl = getBaseUrl();

    try {
      if (isCurrentlyBookmarked) {
        // 북마크 삭제
        await axios.delete(`${baseUrl}/api/bookmark/remove`, {
          data: { user_id: userId, spotify_id: spotifyId },
          withCredentials: true
        });
        setBookmarks(prev => {
          const newSet = new Set(prev);
          newSet.delete(spotifyId);
          return newSet;
        });
        // 북마크 변경 이벤트 발생
        window.dispatchEvent(new CustomEvent('bookmark-updated'));
      } else {
        // 북마크 추가
        const albumImg = getSafeAlbumImage(track);
        if (!albumImg) {
          console.warn('[sidebar][경고] 북마크 추가 시 앨범 이미지 URL이 비어있음! track:', track);
        } else {
          console.log('[sidebar] 북마크 추가 img:', albumImg);
        }
        await axios.post(`${baseUrl}/api/bookmark/add`, {
          user_id: userId,
          music_id: track.id,
          url: track.url || getTrackName(track),
          img: albumImg // base64 인코딩 없이 원본 URL 그대로 저장
        }, { withCredentials: true });
        setBookmarks(prev => new Set(prev).add(spotifyId));
        // 북마크 변경 이벤트 발생
        window.dispatchEvent(new CustomEvent('bookmark-updated'));
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="w-80 flex items-center justify-center h-full bg-black/90">
        <div className="text-white/60">로딩 중...</div>
      </div>
    );
  }

  return (
    <aside className="relative z-30 w-80 bg-gradient-to-b from-[#212121] to-[#121212] flex flex-col h-full overflow-hidden">
      {/* 상단: 현재 재생 곡 카드 */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-white/10">
        {/* 앨범 아트 */}
        <div className="w-48 h-48 rounded-lg overflow-hidden shadow-2xl mb-4 bg-[#282828]">
          {currentTrack && getAlbumImage(currentTrack) ? (
            <img 
              src={getAlbumImage(currentTrack)} 
              alt={getTrackName(currentTrack)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-6xl">
              ♪
            </div>
          )}
        </div>

        {/* 곡 정보 */}
        <div className="text-center w-full px-2">
          <h2 className="text-white font-bold text-lg truncate">
            {currentTrack ? getTrackName(currentTrack) : "재생 중인 곡 없음"}
          </h2>
          <p className="text-white/60 text-sm truncate">
            {currentTrack ? getArtistName(currentTrack) : "-"}
          </p>
        </div>

        {/* 진행바 */}
        <div className="w-full mt-4 px-2">
          <div 
            className="relative w-full h-1 bg-white/20 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seek(percent * duration);
            }}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              style={{ left: duration ? `calc(${(currentTime / duration) * 100}% - 6px)` : '0' }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {/* 북마크 (하트) */}
          <button 
            onClick={(e) => currentTrack && toggleBookmark(currentTrack, e)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-white/10 ${
              currentTrack?.id && bookmarks.has(currentTrack.id) ? 'text-red-500' : 'text-white/70'
            }`}
            title={currentTrack?.id && bookmarks.has(currentTrack.id) ? "좋아요 취소" : "좋아요"}
          >
            {currentTrack?.id && bookmarks.has(currentTrack.id) ? (
              // 꽉 찬 하트
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              // 빈 하트
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            )}
          </button>

          {/* 이전 곡 */}
          <button 
            onClick={playPrev}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
            title="이전 곡"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* 재생/일시정지 */}
          <button 
            onClick={toggle}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform shadow-lg"
            title={playing ? "일시정지" : "재생"}
          >
            {playing ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* 다음 곡 */}
          <button 
            onClick={playNext}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
            title="다음 곡"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* 볼륨 컨트롤 */}
          <VolumeControl />
        </div>
      </div>

      {/* 하단: 플레이리스트 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-white/80 font-semibold text-sm flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            오늘의 추천 곡
            <span className="text-white/40 text-xs ml-auto">{playlist.length}곡</span>
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {playlist.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-white/40 text-sm">
              추천 곡을 불러오는 중...
            </div>
          ) : (
            <ul className="py-2">
              {playlist.map((track, idx) => (
                <li 
                  key={track.id || idx}
                  onClick={() => playTrack(track)}
                  className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-all hover:bg-white/10 ${
                    currentIndex === idx ? 'bg-white/10' : ''
                  }`}
                >
                  {/* 트랙 번호 또는 재생 아이콘 */}
                  <div className="w-6 text-center flex-shrink-0">
                    {currentIndex === idx && playing ? (
                      <div className="flex items-end justify-center gap-0.5 h-4">
                        <span className="w-0.5 bg-red-500 animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                        <span className="w-0.5 bg-red-500 animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                        <span className="w-0.5 bg-red-500 animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
                        <span className="w-0.5 bg-red-500 animate-pulse" style={{ height: '80%', animationDelay: '450ms' }} />
                      </div>
                    ) : (
                      <span className={`text-xs ${currentIndex === idx ? 'text-red-500' : 'text-white/40'}`}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* 앨범 썸네일 */}
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-[#282828]">
                    {getAlbumImage(track) ? (
                      <img 
                        src={getAlbumImage(track)} 
                        alt={getTrackName(track)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-lg">♪</div>
                    )}
                  </div>

                  {/* 곡 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${currentIndex === idx ? 'text-red-500 font-medium' : 'text-white'}`}>
                      {getTrackName(track)}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {getArtistName(track)}
                    </p>
                  </div>

                  {/* 북마크 하트 아이콘 */}
                  <button
                    onClick={(e) => toggleBookmark(track, e)}
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10 ${
                      track.id && bookmarks.has(track.id) ? 'text-red-500' : 'text-white/30 hover:text-white/60'
                    }`}
                    title={track.id && bookmarks.has(track.id) ? "좋아요 취소" : "좋아요"}
                  >
                    {track.id && bookmarks.has(track.id) ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    )}
                  </button>

                  {/* 재생 중 표시 */}
                  {currentIndex === idx && (
                    <div className="flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
