"use client";

import React from "react";
import { useRouter } from "next/navigation";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";

export default function FavoritesPage() {
  const router = useRouter();

  // 임시 즐겨찾기 데이터
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
      className="relative w-full min-h-screen flex flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: `url(/images/weather-clear.jpg)` }}
    >
      {/* 🔹 상단 헤더 (메인 페이지와 동일 높이) */}
      <WeatherHeader />

      {/* 🔹 본문 */}
      <main className="flex-1 w-full flex">
        {/* ✅ 왼쪽 프로필 영역 */}
        <aside className="relative w-1/4 border-r border-white/30 flex flex-col items-center backdrop-blur-sm bg-white/10 pt-12">
          {/* 프로필 사진 */}
          <img
            src="/images/hedgehog.png"
            alt="profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
          />

          {/* 이름 / 상태 */}
          <div className="mt-5 text-center text-white drop-shadow">
            <p className="text-lg font-medium">따봉도치야</p>
            <p className="text-sm opacity-80">고마워</p>
          </div>

          {/* ⚙ 설정 버튼 (왼쪽 아래 고정) */}
          <button
            onClick={() => router.push("/settings")}
            className="absolute bottom-6 left-6 text-sm px-4 py-1.5 border rounded-lg text-white/90 hover:bg-white/10 transition-all"
          >
            ⚙ 설정
          </button>
        </aside>

        {/* ✅ 오른쪽 즐겨찾기 카드 그리드 */}
        <section className="flex-1 flex flex-col items-center justify-start py-10">
          <h2 className="text-5xl font-light text-white mb-10 drop-shadow">
            Favorite
          </h2>

          <div className="grid grid-cols-3 gap-10">
            {favorites.map((track) => (
              <div
                key={track.id}
                className="w-60 h-72 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center p-4 hover:bg-white/20 transition"
              >
                <img
                  src={track.img}
                  alt={track.title}
                  className="w-40 h-40 object-cover rounded-xl border-2 border-white/30 shadow"
                />
                <p className="text-white text-lg font-semibold mt-4">
                  {track.title}
                </p>
                <p className="text-white/80 text-sm mt-1">{track.artist}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 🔹 하단 플레이어 (메인 페이지와 동일 높이) */}
      <PlayerBar />
    </div>
  );
}
