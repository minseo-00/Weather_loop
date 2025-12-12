"use client";

import { useState, useEffect } from "react";
import WeatherEffects from "@/shared/ui/WeatherEffects";

interface MainContentProps {
  weather?: string;
  temp?: number | null;
  isNight?: boolean;
  time?: string;
}

export default function MainContent({ weather = "", temp, isNight = false, time = "" }: MainContentProps) {
  const w = weather.toLowerCase();

  // 날씨/시간에 따른 배경 그라데이션
  const getBackground = () => {
    if (w.includes("rain") || w.includes("drizzle") || w.includes("thunderstorm")) {
      return "linear-gradient(180deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)";
    }
    if (w.includes("snow")) {
      return "linear-gradient(180deg, #e8f4f8 0%, #d1e8ed 50%, #b8d4e3 100%)";
    }
    if (w.includes("cloud") || w.includes("mist") || w.includes("fog")) {
      return "linear-gradient(180deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)";
    }
    if (isNight) {
      return "linear-gradient(180deg, #1e293b 0%, #0f172a 50%, #020617 100%)";
    }
    // 맑음 낮
    return "linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #7CB342 100%)";
  };

  // 날씨 이모지
  const getWeatherEmoji = () => {
    if (w.includes("rain") || w.includes("drizzle")) return "🌧️";
    if (w.includes("thunderstorm")) return "⛈️";
    if (w.includes("snow")) return "❄️";
    if (w.includes("cloud")) return "☁️";
    if (w.includes("mist") || w.includes("fog")) return "🌫️";
    if (isNight) return "🌙";
    return "☀️";
  };

  // 날씨 한글 텍스트
  const getWeatherText = () => {
    if (w.includes("rain") || w.includes("drizzle")) return "비";
    if (w.includes("thunderstorm")) return "천둥번개";
    if (w.includes("snow")) return "눈";
    if (w.includes("cloud")) return "흐림";
    if (w.includes("mist") || w.includes("fog")) return "안개";
    if (w.includes("clear")) return isNight ? "맑은 밤" : "맑음";
    return isNight ? "밤" : "맑음";
  };

  // 텍스트 색상 - 모든 날씨에서 흰색으로 통일
  const textColor = "#ffffff";
  const subTextColor = "#f1f5f9";
  const isDark = true; // 항상 그림자 효과 적용

  return (
    <main
      className="flex-1 relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: getBackground(),
        transition: "background 1.5s ease",
      }}
    >
      {/* 날씨 효과 레이어 */}
      <WeatherEffects weather={weather} isNight={isNight} />

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        
        {/* 시간 표시 */}
        <div
          className="text-8xl font-thin tracking-wider mb-4"
          style={{ color: textColor, textShadow: isDark ? "0 2px 20px rgba(0,0,0,0.3)" : "none" }}
        >
          {time}
        </div>

        {/* 날씨 아이콘 + 기온 */}
        <div className="flex items-center gap-6 mb-6">
          <span className="text-6xl">{getWeatherEmoji()}</span>
          {temp !== null && temp !== undefined && (
            <span
              className="text-5xl font-light"
              style={{ color: textColor }}
            >
              {temp}°C
            </span>
          )}
        </div>

        {/* 날씨 텍스트 */}
        <p
          className="text-2xl font-semibold tracking-wide"
          style={{ 
            color: subTextColor,
            textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)',
          }}
        >
          {getWeatherText()}
        </p>

        {/* 하단 인사 메시지 */}
        <div
          className="mt-12 text-lg"
          style={{ 
            color: subTextColor,
            textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            opacity: 0.95,
          }}
        >
          {
            w.includes("rain") ? "비 오는 날엔 감성 음악 어때요?" :
            w.includes("snow") ? "눈 오는 날, 따뜻한 음악과 함께" :
            "좋은 음악과 함께하는 하루 되세요"
          }
        </div>
      </div>

      {/* 바닥 장식 - 가로수/길거리 실루엣 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-full"
          preserveAspectRatio="none"
          style={{ opacity: isDark ? 0.3 : 0.15 }}
        >
          {/* 언덕/풀밭 */}
          <path
            d="M0,120 Q300,80 600,100 T1200,90 L1200,120 Z"
            fill={isDark ? "#1e293b" : "#22c55e"}
          />
          {/* 나무들 */}
          <g fill={isDark ? "#0f172a" : "#166534"}>
            <ellipse cx="100" cy="85" rx="25" ry="35" />
            <rect x="95" y="100" width="10" height="20" fill={isDark ? "#1e293b" : "#854d0e"} />
            
            <ellipse cx="300" cy="75" rx="30" ry="45" />
            <rect x="294" y="100" width="12" height="20" fill={isDark ? "#1e293b" : "#854d0e"} />
            
            <ellipse cx="500" cy="80" rx="20" ry="30" />
            <rect x="495" y="95" width="10" height="25" fill={isDark ? "#1e293b" : "#854d0e"} />
            
            <ellipse cx="750" cy="70" rx="35" ry="50" />
            <rect x="742" y="100" width="16" height="20" fill={isDark ? "#1e293b" : "#854d0e"} />
            
            <ellipse cx="950" cy="85" rx="25" ry="35" />
            <rect x="945" y="100" width="10" height="20" fill={isDark ? "#1e293b" : "#854d0e"} />
            
            <ellipse cx="1100" cy="75" rx="28" ry="40" />
            <rect x="1093" y="98" width="14" height="22" fill={isDark ? "#1e293b" : "#854d0e"} />
          </g>
        </svg>
      </div>
    </main>
  );
}
