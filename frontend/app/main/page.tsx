"use client";

import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";
import Sidebar from "@/entities/sidebar/ui/Sidebar";
import MainContent from "@/entities/main-content/ui/MainContent";

import { useState } from "react";

export default function MainPage() {
  const [weather, setWeather] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("weather");
  
  // UI는 중립 톤으로 고정 (날씨 배경/하늘색 제거)

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden relative">

      {/* Weather Header - Full Width Top */}
      <WeatherHeader onWeatherChange={setWeather} />

      {/* Main Layout - Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Sidebar */}
        <Sidebar weather={weather} selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />

        {/* Main Content Area */}
        <MainContent onCassetteSelect={setSelectedGenre} />
      </div>
    </div>
  );
}
