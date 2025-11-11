// /app/main/page.tsx
"use client";

import { useState, useEffect } from "react";
import PlaylistGrid from "@/widgets/playlist-grid/ui/PlaylistGrid";

export default function MainPage() {
  const [weather, setWeather] = useState<"clear" | "night" | "rain">("clear");

  useEffect(() => {
    // 나중에 날씨 API 연동 예정
    setWeather("clear");
  }, []);

  const backgroundImages: Record<string, string> = {
    clear: "/images/weather-clear.jpg",
    night: "/images/weather-night.jpg",
    rain: "/images/weather-rain.jpg",
  };

  // 페이지 내부 컴포넌트 정의
  const WeatherHeader = () => (
    <div className="w-full h-48 flex items-center justify-center text-black font-bold
                    bg-white/10 backdrop-blur-md shadow-md">
      WeatherHeader
    </div>
  );

  const PlayerBar = () => (
    <div className="w-full h-36 flex items-center justify-center text-black font-bold
                    bg-white/10 backdrop-blur-md shadow-inner">
      PlayerBar
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImages[weather]})` }}
    >
      {/* 상단 헤더 */}
      <WeatherHeader />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 w-full flex flex-col items-center justify-start pt-6 px-6">
        <PlaylistGrid />
      </main>

      {/* 하단 플레이어 */}
      <PlayerBar />
    </div>
  );
}
