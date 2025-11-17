"use client";

import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";

export default function MainPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-white pt-16 pb-20">

      {/* 상단 WeatherHeader */}
      <WeatherHeader />   {/* ← self-closing */}

      {/* 메인 내용 */}
      <div className="flex-1 w-full flex items-center justify-center">
        <h1 className="text-xl opacity-80">메인 페이지</h1>
      </div>

      {/* 하단 PlayerBar */}
      <div className="fixed bottom-0 left-0 w-full">
        <PlayerBar />      {/* ← self-closing */}
      </div>

    </div>
  );
}
