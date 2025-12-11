"use client";

import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";
import Sidebar from "@/entities/sidebar/ui/Sidebar";
import MainContent from "@/entities/main-content/ui/MainContent";

export default function MainPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-black text-white overflow-hidden">
      {/* Weather Header - Full Width Top */}
      <WeatherHeader />

      {/* Main Layout - Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <MainContent />
      </div>

      {/* Player Bar - Full Width Bottom */}
      <PlayerBar />
    </div>
  );
}
