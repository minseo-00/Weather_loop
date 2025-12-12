"use client";

import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import PlayerBar from "@/widgets/player-bar/ui/PlayerBar";
import Sidebar from "@/entities/sidebar/ui/Sidebar";
import MainContent from "@/entities/main-content/ui/MainContent";

import { useState, useEffect } from "react";

export default function MainPage() {
  const [weather, setWeather] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [isNight, setIsNight] = useState(false);
  const [time, setTime] = useState<string>("");

  // 시간대 체크 (밤: 18시~6시)
  useEffect(() => {
    const checkNight = () => {
      const hour = new Date().getHours();
      setIsNight(hour >= 18 || hour < 6);
    };
    checkNight();
    const interval = setInterval(checkNight, 60000);
    return () => clearInterval(interval);
  }, []);

  // 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden relative"
      style={{
        backgroundColor: '#faf8f5',
        color: '#5c4a3a',
      }}
    >
      {/* Weather Header - Full Width Top */}
      <WeatherHeader onWeatherChange={setWeather} onTempChange={setTemp} onNightChange={setIsNight} />

      {/* Main Layout - Sidebar + Content (헤더 높이만큼 상단 여백) */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Left Sidebar - 음악 추천 */}
        <Sidebar weather={weather} isNight={isNight} />

        {/* Main Content Area - 날씨 시각화 */}
        <MainContent weather={weather} temp={temp} isNight={isNight} time={time} />
      </div>
    </div>
  );
}
