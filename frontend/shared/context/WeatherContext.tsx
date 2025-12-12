"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type WeatherData = {
  weather: string;      // "Clear", "Rain", "Snow", "Clouds" 등
  temp: number;
  icon: string;
  description: string;
  loading: boolean;
};

type WeatherContextType = WeatherData & {
  recommendedGenres: string[];
  refreshWeather: () => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// 날씨에 따른 추천 장르 매핑
function getRecommendedGenres(weather: string, temp: number): string[] {
  const weatherLower = weather.toLowerCase();
  
  // 비/소나기
  if (weatherLower.includes("rain") || weatherLower.includes("drizzle")) {
    return ["LoFi", "Jazz", "Acoustic", "Indie"];
  }
  
  // 눈
  if (weatherLower.includes("snow")) {
    return ["Classical", "Acoustic", "Chill", "Ambient"];
  }
  
  // 천둥번개
  if (weatherLower.includes("thunder") || weatherLower.includes("storm")) {
    return ["Rock", "Metal", "Electronic", "Dramatic"];
  }
  
  // 흐림/안개
  if (weatherLower.includes("cloud") || weatherLower.includes("fog") || weatherLower.includes("mist")) {
    return ["Indie", "Alternative", "Dream Pop", "Ambient"];
  }
  
  // 맑음 - 온도에 따라 다르게
  if (weatherLower.includes("clear") || weatherLower === "") {
    if (temp >= 25) {
      return ["Pop", "Dance", "Reggae", "Summer Hits"];
    } else if (temp >= 15) {
      return ["Pop", "Rock", "Funk", "R&B"];
    } else {
      return ["Acoustic", "Folk", "Indie", "Chill"];
    }
  }
  
  // 기본값
  return ["Pop", "Jazz", "Rock", "LoFi"];
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    weather: "",
    temp: 20,
    icon: "",
    description: "",
    loading: true,
  });

  const fetchWeather = (lat: number, lon: number) => {
    axios.get("http://localhost:3001/api/weather", {
      params: { lat, lon }
    }).then(res => {
      const data = res.data;
      setWeatherData({
        weather: data.weather?.[0]?.main || "",
        temp: Math.round(data.main?.temp) || 20,
        icon: data.weather?.[0]?.icon || "",
        description: data.weather?.[0]?.description || "",
        loading: false,
      });
    }).catch(() => {
      setWeatherData(prev => ({ ...prev, loading: false }));
    });
  };

  const refreshWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => fetchWeather(35.8714, 128.6014) // 대구 기본값
      );
    } else {
      fetchWeather(35.8714, 128.6014);
    }
  };

  useEffect(() => {
    refreshWeather();
    
    // 10분마다 날씨 업데이트
    const interval = setInterval(refreshWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const recommendedGenres = getRecommendedGenres(weatherData.weather, weatherData.temp);

  return (
    <WeatherContext.Provider value={{ ...weatherData, recommendedGenres, refreshWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
}
