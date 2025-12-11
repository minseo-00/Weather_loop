"use client";

import React from "react";
import { useRouter } from "next/navigation";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";

export default function FavoritesPage() {
  const router = useRouter();

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
      className="relative w-full min-h-screen flex flex-col items-center"
      style={{
        backgroundColor: '#f5ecd7',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
        backgroundRepeat: 'repeat',
        color: '#7c5c3a',
      }}
    >
      {/* [필수 기능: 컴포넌트 단위 UI] 상단 헤더 */}
      <WeatherHeader />

      {/* 본문 */}
      <main className="flex-1 w-full flex">
        {/* [필수 기능: 컴포넌트 단위 UI & Props/State] 왼쪽 프로필 영역 */}
        <aside className="relative w-1/4 border-r border-[#d2b48c] flex flex-col items-center pt-16 bg-[#f5ecd7]">
          <img
            src="/images/hedgehog.png"
            alt="profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-[#d2b48c] shadow-md bg-[#e2cfa7]"
          />

          {/* [필수 기능: UI/UX] 사용자 이름/소개 표시 */}
          <div className="mt-5 text-center text-black">
            <p className="text-lg font-medium text-[#7c5c3a]">따봉도치야</p>
            <p className="text-sm opacity-80 text-[#bfa77a]">고마워</p>
          </div>

          {/* [필수 기능: 이벤트 핸들링 / 라우팅] 설정 페이지 이동 */}
          <button
            onClick={() => router.push("/settings")}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-base px-6 py-2 border-2 border-[#d2b48c] rounded-xl text-[#7c5c3a] bg-[#f5ecd7] shadow hover:bg-[#e2cfa7] transition-all"
            style={{ minWidth: 120 }}
          >
            ⚙ 설정
          </button>
        </aside>

        {/* [필수 기능: 리스트 렌더링] 즐겨찾기 카드 그리드 */}
        <section className="flex-1 flex flex-col items-center justify-start py-10">
          {/* [필수 기능: UI/UX] 섹션 제목 */}
          <h2
            className="w-full text-center text-4xl font-bold text-[#7c5c3a] mt-6 mb-2 tracking-wide leading-tight break-keep whitespace-normal"
            style={{ wordBreak: 'keep-all' }}
          >
            내가 좋아하는 음악들
          </h2>
          <p className="w-full text-center mb-8 text-lg text-[#bfa77a]">마음에 드는 곡을 모아둔 나만의 리스트</p>

          {/* [필수 기능: 리스트 렌더링 / CRUD] 즐겨찾기 목록 반복 출력 */}
          <div className="grid grid-cols-3 gap-10">
            {favorites.map((track) => (
              <div
                key={track.id}
                className="w-64 h-80 bg-[#f5ecd7] rounded-3xl shadow-xl flex flex-col items-center p-5 border-2 border-[#d2b48c] relative transition-all duration-200 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* 하트 아이콘 */}
                <div className="absolute top-5 right-5 text-[#e57373] text-2xl">
                  ♥
                </div>
                {/* 앨범아트 */}
                <div className="w-44 h-44 rounded-2xl overflow-hidden flex items-center justify-center bg-[#e2cfa7] border-2 border-[#d2b48c] shadow">
                  <img
                    src={track.img}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 곡 정보 */}
                <div className="mt-4 text-center w-full">
                  <p className="text-xl font-bold text-[#7c5c3a] mb-1 truncate">{track.title}</p>
                  <p className="text-base text-[#bfa77a] truncate">{track.artist}</p>
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
