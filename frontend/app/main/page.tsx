"use client";

import { useState, useEffect } from "react";
import PlaylistGrid from "@/widgets/playlist-grid/ui/PlaylistGrid";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";

export default function MainPage() {
  // [필수 기능: Props & State 관리] 날씨 상태
  const [weather, setWeather] = useState<"clear" | "night" | "rain" | null>(null);

  useEffect(() => {
    // [필수 기능: API 연동 / Props & State 관리] (추후 실제 API로 변경)
    setTimeout(() => {
      setWeather("clear");
    }, 800); // 로딩 상황 예시
  }, []);

  // [필수 기능: UI/UX 디자인] 날씨별 배경 이미지
  const backgroundImages: Record<string, string> = {
    clear: "/images/weather-clear.jpg",
    night: "/images/weather-night.jpg",
    rain: "/images/weather-rain.jpg",
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center bg-cover bg-center"
      style={{
        backgroundImage:
          weather ? `url(${backgroundImages[weather]})` : "none",
      }}
    >
      {/* 상단 헤더 */}
      <WeatherHeader /> {/* [필수 기능: 컴포넌트 단위 UI 설계] */}

      {/* 메인 컨텐츠 */}
      <main className="flex-1 w-full flex flex-col items-center justify-start pt-6 px-6">

        {/* [필수 기능: 조건부 렌더링] 날씨 로딩 중 */}
        {!weather && (
          <p className="text-white text-xl opacity-80 mt-20">
            ⏳ 날씨 정보를 불러오는 중입니다...
          </p>
        )}

        {/* [필수 기능: 조건부 렌더링 + 리스트 렌더링] 날씨가 준비되면 플레이리스트 표시 */}
        {weather && <PlaylistGrid />}
      </main>

      {/* 하단 플레이어 */}
      <PlayerBar /> {/* [필수 기능: 컴포넌트 단위 UI 설계 / 이벤트 핸들링] */}
    </div>
  );
}
