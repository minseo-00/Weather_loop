
"use client";

import { useEffect, useState } from "react";

type HeaderState = {
  time: string;
  temp: number;
  icon: string;
  weather: string;
  description: string;
};

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

// 날씨 코드를 이모지로 변환
function getWeatherIcon(weatherCode: string): string {
  const iconMap: Record<string, string> = {
    "01d": "☀️", "01n": "🌙",      // 맑음
    "02d": "⛅", "02n": "☁️",      // 구름 조금
    "03d": "☁️", "03n": "☁️",      // 구름
    "04d": "☁️", "04n": "☁️",      // 흐림
    "09d": "🌧️", "09n": "🌧️",    // 소나기
    "10d": "🌦️", "10n": "🌧️",    // 비
    "11d": "⛈️", "11n": "⛈️",     // 천둥번개
    "13d": "❄️", "13n": "❄️",     // 눈
    "50d": "🌫️", "50n": "🌫️",    // 안개
  };
  return iconMap[weatherCode] || "🌤️";
}

export function useWeather(): HeaderState {
  const [state, setState] = useState<HeaderState>({
    time: formatTime(new Date()),
    temp: 0,
    icon: "🌤️",
    weather: "",
    description: "",
  });

  // 날씨 데이터 가져오기
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/weather?lat=${lat}&lon=${lon}`
      );
      if (!response.ok) throw new Error("날씨 정보를 가져올 수 없습니다");
      
      const data = await response.json();
      
      setState((prev) => ({
        ...prev,
        temp: Math.round(data.main.temp),
        icon: getWeatherIcon(data.weather[0].icon),
        weather: data.weather[0].main,
        description: data.weather[0].description,
      }));
    } catch (error) {
      console.error("날씨 API 에러:", error);
    }
  };

  useEffect(() => {
    // 시간 업데이트
    const updateTime = () => {
      setState((prev) => ({
        ...prev,
        time: formatTime(new Date()),
      }));
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // 위치 기반 날씨 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("위치 정보 에러:", error);
          // 기본 위치 (대구)로 날씨 가져오기
          fetchWeather(35.8714, 128.6014);
        }
      );
    } else {
      // Geolocation 미지원 시 대구 기본값
      fetchWeather(35.8714, 128.6014);
    }

    // 10분마다 날씨 업데이트
    const weatherInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          () => fetchWeather(35.8714, 128.6014)
        );
      }
    }, 600000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  return state;
}
