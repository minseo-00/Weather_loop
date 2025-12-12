"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";

export default function FavoritesPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);

  // helper to refresh from localStorage
  const refreshProfileFromLocal = () => {
    try {
      const savedName = typeof window !== 'undefined' ? localStorage.getItem('displayName') : null;
      const savedTag = typeof window !== 'undefined' ? localStorage.getItem('displayTagline') : null;
      const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem('avatarDataUrl') : null;
      if (savedName !== null) setDisplayName(savedName);
      if (savedTag !== null) setTagline(savedTag);
      if (savedAvatar !== null) setAvatar(savedAvatar);
    } catch {}
  };

  useEffect(() => {
    // initial load
    refreshProfileFromLocal();
    // fallback default from email if no displayName set
    (async () => {
      try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const email = data?.user?.email as string | undefined;
          const savedName = typeof window !== 'undefined' ? localStorage.getItem('displayName') : null;
          if (email && (!savedName || savedName.length === 0)) {
            const derived = email.split('@')[0];
            setDisplayName(derived);
          }
        }
      } catch {}
    })();
  }, []);

  // update when user returns via back/forward or when tab refocuses
  useEffect(() => {
    const onFocus = () => refreshProfileFromLocal();
    const onVis = () => {
      if (!document.hidden) refreshProfileFromLocal();
    };
    const onProfileUpdated = () => refreshProfileFromLocal();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || ['displayName','displayTagline','avatarDataUrl'].includes(e.key)) {
        refreshProfileFromLocal();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onVis);
      window.addEventListener('profile-updated', onProfileUpdated as EventListener);
      window.addEventListener('storage', onStorage);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('profile-updated', onProfileUpdated as EventListener);
        window.removeEventListener('storage', onStorage);
      }
    };
  }, []);

  const favorites = [
    { id: 1, title: "Golden", artist: "정국", img: "/images/golden.png" },
    { id: 2, title: "Run Run Run", artist: "선우정아", img: "/images/runrun.png" },
    { id: 3, title: "Love Lee", artist: "AKMU", img: "/images/lovelee.png" },
    { id: 4, title: "Super Shy", artist: "NewJeans", img: "/images/supershy.png" },
    { id: 5, title: "ETA", artist: "NewJeans", img: "/images/eta.png" },
    { id: 6, title: "Seven", artist: "정국 ft. Latto", img: "/images/seven.png" },
  ];

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-[#FFF9E8] to-[#FAF3E8]"
    >
      {/* 상단 헤더 */}
      <WeatherHeader />

      {/* 본문 */}
      <main className="flex-1 w-full flex mt-0">
        {/* 왼쪽 프로필 영역 */}
        <aside className="relative w-1/4 border-r border-gray-200 flex flex-col items-center pt-6 bg-white">
          <img
            src={avatar || "/images/hedgehog.png"}
            alt="profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-sm bg-gray-50"
          />

          {/* 사용자 이름/소개 표시 */}
          <div className="mt-5 text-center">
            <p className="text-lg font-semibold text-gray-900">{displayName || '사용자'}</p>
            {tagline ? (
              <p className="text-sm text-gray-500">{tagline}</p>
            ) : null}
          </div>

          {/* 설정 페이지 이동 */}
          <button
            onClick={() => router.push("/settings")}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 text-base px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all"
            style={{ minWidth: 120 }}
          >
            설정
          </button>
        </aside>

        {/* 즐겨찾기 카드 그리드 */}
        <section className="flex-1 flex flex-col items-center justify-start pt-6 pb-10 px-8">
          {/* 섹션 제목 */}
          <h2
            className="w-full text-center text-3xl font-bold text-gray-900 mb-2 tracking-tight"
          >
            내가 좋아하는 음악들
          </h2>
          <p className="w-full text-center mb-10 text-base text-gray-500">마음에 드는 곡을 모아둔 나만의 리스트</p>

          {/* 즐겨찾기 목록 반복 출력 */}
          <div className="grid grid-cols-3 gap-8">
            {favorites.map((track) => (
              <div
                key={track.id}
                className="w-64 h-80 bg-white rounded-2xl shadow-sm flex flex-col items-center p-5 border border-gray-200 relative transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {/* 장식 아이콘 제거됨 */}
                {/* 앨범아트 */}
                <div className="w-44 h-44 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200 shadow-sm">
                  <img
                    src={track.img}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 곡 정보 */}
                <div className="mt-4 text-center w-full">
                  <p className="text-lg font-semibold text-gray-900 mb-1 truncate">{track.title}</p>
                  <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* [필수 기능: 컴포넌트 단위 UI] 하단 플레이어 */}
    </div>
  );
}
