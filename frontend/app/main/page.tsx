"use client";

import { useState, useEffect } from "react";
import PlaylistGrid from "@/widgets/playlist-grid/ui/PlaylistGrid";


import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";

export default function MainPage() {
  const [weather, setWeather] = useState<"clear" | "night" | "rain">("clear");

  useEffect(() => {
    setWeather("clear");
  }, []);

  const backgroundImages: Record<string, string> = {
    clear: "/images/weather-clear.jpg",
    night: "/images/weather-night.jpg",
    rain: "/images/weather-rain.jpg",
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImages[weather]})` }}
    >
      {/* 상단*/}
      <WeatherHeader />

      {/* 메인 */}
      <main className="flex-1 w-full flex flex-col items-center justify-start pt-16 px-6">
        <PlaylistGrid />
      </main>

      {}
      <PlayerBar />
    </div>
  );
}
