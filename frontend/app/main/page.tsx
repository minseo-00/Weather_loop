"use client";

import { useState, useEffect } from "react";
import PlaylistGrid from "@/widgets/playlist-grid/ui/PlaylistGrid";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";

export default function MainPage() {
  const [weather, setWeather] = useState<"clear" | "night" | "rain" | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setWeather("clear");
    }, 800);
  }, []);

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
      <WeatherHeader />

      <main className="flex-1 w-full flex flex-col items-center justify-start pt-6 px-6">
        {!weather && (
          <p className="text-white text-xl opacity-80 mt-20">
            ⏳ 날씨 정보를 불러오는 중입니다...
          </p>
        )}

        {weather && <PlaylistGrid />}
      </main>

      <PlayerBar />
    </div>
  );
}
