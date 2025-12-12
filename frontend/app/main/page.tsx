"use client";

import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";
import Sidebar from "@/entities/sidebar/ui/Sidebar";
import MainContent from "@/entities/main-content/ui/MainContent";

import { useState } from "react";

export default function MainPage() {
  const [weather, setWeather] = useState<string>("");
  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden"
      style={{
        backgroundColor: '#f5ecd7',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
        backgroundRepeat: 'repeat',
        color: '#7c5c3a',
      }}
    >
      {/* Weather Header - Full Width Top */}
      <WeatherHeader onWeatherChange={setWeather} />

      {/* Main Layout - Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar weather={weather} />

        {/* Main Content Area */}
        <MainContent />
      </div>

    </div>
  );
}
