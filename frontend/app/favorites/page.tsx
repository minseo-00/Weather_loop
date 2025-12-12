"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import HomeButton from "@/shared/ui/HomeButton";
import WeatherEffects from "@/shared/ui/WeatherEffects";
import axios from "axios";

interface UserInfo {
  user_id: string;
  nickname: string;
  name?: string;
}

interface FavoriteTrack {
  bookmark_id: string;
  spotify_id: string;
  music_name: string;
  artist: string;
  preview_img: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [favorites, setFavorites] = useState<FavoriteTrack[]>([]);
  const [loading, setLoading] = useState(true);

  // 날씨 상태
  const [weather, setWeather] = useState<string>("Clear");
  const [isNight, setIsNight] = useState(false);

  // 시간대 체크
  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 18 || hour < 6);
  }, []);

  // API 베이스 URL 헬퍼
  const getBaseUrl = () => 'https://oversad-nikole-peatier.ngrok-free.dev';

  // 사용자 정보 및 북마크 로드
  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const baseUrl = 'https://oversad-nikole-peatier.ngrok-free.dev';
        
        const res = await axios.get(`${baseUrl}/auth/me`, { withCredentials: true });
        if (res.data.user) {
          setUser(res.data.user);
          // 북마크 목록 가져오기
          const bookmarkRes = await axios.get(
            `${baseUrl}/api/bookmark/list/${res.data.user.user_id}`,
            { withCredentials: true }
          );
          if (bookmarkRes.data.ok) {
            setFavorites(bookmarkRes.data.bookmarks);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndFavorites();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* 날씨 효과 */}
      <WeatherEffects weather={weather} isNight={isNight} />

      {/* 홈 버튼 */}
      <HomeButton />

      {/* 상단 헤더 */}
      <WeatherHeader onWeatherChange={setWeather} />

      {/* 본문 */}
      <main className="relative z-20 flex-1 w-full flex">
        {/* 왼쪽 프로필 영역 */}
        <aside className="relative w-1/4 min-w-[280px] border-r border-gray-200 flex flex-col items-center pt-24 bg-white/60 backdrop-blur-md">
          {/* 프로필 이미지 */}
          <div className="w-36 h-36 rounded-full bg-gray-200 border-4 border-gray-300 shadow-lg flex items-center justify-center text-5xl text-gray-600">
            {user?.nickname ? user.nickname.charAt(0).toUpperCase() : "?"}
          </div>

          {/* 사용자 정보 */}
          <div className="mt-6 text-center">
            {loading ? (
              <p className="text-gray-500">로딩 중...</p>
            ) : user ? (
              <>
                <p className="text-xl font-bold text-gray-800">{user.nickname}</p>
                <p className="text-sm text-gray-500 mt-1">{user.user_id}</p>
              </>
            ) : (
              <>
                <p className="text-lg text-gray-800">로그인이 필요합니다</p>
                <button
                  onClick={() => router.push("/login")}
                  className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
                >
                  로그인
                </button>
              </>
            )}
          </div>

          {/* 설정 버튼 */}
          {user && (
            <button
              onClick={() => router.push("/settings")}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-base px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-700 bg-white/80 shadow hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              ⚙️ 설정
            </button>
          )}
        </aside>

        {/* 즐겨찾기 영역 */}
        <section className="flex-1 flex flex-col items-center py-10 px-8">
          <h2 className="text-3xl font-bold text-gray-800 mt-16 mb-2">
            내가 좋아하는 음악들
          </h2>
          <p className="text-gray-500 mb-8">마음에 드는 곡을 모아둔 나만의 리스트</p>

          {/* 구분선 */}
          <hr className="w-full max-w-4xl border-gray-300 mb-8" />

          {/* 즐겨찾기 목록 */}
          {favorites.length === 0 ? (
            /* 빈 상태 UI */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <div className="text-7xl mb-6 opacity-30">🎵</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                아직 좋아하는 음악이 없어요
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                메인 페이지에서 마음에 드는 음악을 찾아<br />
                하트를 눌러 즐겨찾기에 추가해보세요!
              </p>
              <button
                onClick={() => router.push("/main")}
                className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition shadow-md"
              >
                음악 둘러보기
              </button>
            </div>
          ) : (
            /* 즐겨찾기 그리드 */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
              {favorites.map((track) => (
                <div
                  key={track.bookmark_id}
                  className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-gray-200 flex flex-col items-center hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <button 
                    onClick={async () => {
                      try {
                        const baseUrl = getBaseUrl();
                        await axios.delete(`${baseUrl}/api/bookmark/remove`, {
                          data: { user_id: user?.user_id, spotify_id: track.spotify_id },
                          withCredentials: true
                        });
                        setFavorites(prev => prev.filter(f => f.bookmark_id !== track.bookmark_id));
                      } catch (err) {
                        console.error("북마크 삭제 실패:", err);
                      }
                    }}
                    className="absolute top-4 right-4 text-red-500 text-xl cursor-pointer hover:scale-110 transition"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 mb-4">
                    {track.preview_img ? (
                      <img
                        src={track.preview_img}
                        alt={track.music_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">♪</div>
                    )}
                  </div>
                  <p className="font-bold text-gray-800 truncate w-full text-center">{track.music_name}</p>
                  <p className="text-sm text-gray-500 truncate w-full text-center">{track.artist}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
