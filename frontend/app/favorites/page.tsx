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
    <div className="relative w-full min-h-screen flex flex-col items-center bg-white">
      {/* [필수 기능: 컴포넌트 단위 UI] 상단 헤더 */}
      <WeatherHeader />

      {/* 본문 */}
      <main className="flex-1 w-full flex">
        {/* [필수 기능: 컴포넌트 단위 UI & Props/State] 왼쪽 프로필 영역 */}
        <aside className="relative w-1/4 border-r border-gray-300 flex flex-col items-center pt-16">
          <img
            src="/images/hedgehog.png"
            alt="profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
          />

          {/* [필수 기능: UI/UX] 사용자 이름/소개 표시 */}
          <div className="mt-5 text-center text-black">
            <p className="text-lg font-medium">따봉도치야</p>
            <p className="text-sm opacity-80">고마워</p>
          </div>

          {/* [필수 기능: 이벤트 핸들링 / 라우팅] 설정 페이지 이동 */}
          <button
            onClick={() => router.push("/settings")}
            className="absolute bottom-20 left-6 text-sm px-4 py-1.5 border rounded-lg text-black/90 hover:bg-gray-100 transition-all"
          >
            ⚙ 설정
          </button>
        </aside>

        {/* [필수 기능: 리스트 렌더링] 즐겨찾기 카드 그리드 */}
        <section className="flex-1 flex flex-col items-center justify-start py-10">
          {/* [필수 기능: UI/UX] 섹션 제목 */}
          <h2 className="text-5xl font-light text-black mb-10">
            Favorite
          </h2>

          {/* [필수 기능: 리스트 렌더링 / CRUD] 즐겨찾기 목록 반복 출력 */}
          <div className="grid grid-cols-3 gap-10">
            {favorites.map((track) => (
              <div
                key={track.id}
                className="w-60 h-72 bg-gray-100 rounded-2xl shadow-lg flex flex-col items-center p-4 hover:bg-gray-200 transition"
              >
                {/* [필수 기능: UI/UX] 곡 이미지 */}
                <img
                  src={track.img}
                  alt={track.title}
                  className="w-40 h-40 object-cover rounded-xl border-2 border-gray-300 shadow"
                />
                {/* [필수 기능: UI/UX] 곡 제목/아티스트 표시 */}
                <p className="text-black text-lg font-semibold mt-4">
                  {track.title}
                </p>
                <p className="text-black/80 text-sm mt-1">{track.artist}</p>

                {/* [필수 기능: CRUD/즐겨찾기 삭제 버튼 가능] */}
                {/* 여기 버튼 추가하면 즐겨찾기 삭제 가능 */}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* [필수 기능: 컴포넌트 단위 UI] 하단 플레이어 */}
      <PlayerBar />
    </div>
  );
}
