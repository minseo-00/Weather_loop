
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WeatherHeaderProps {
  onWeatherChange?: (weather: string) => void;
  onTempChange?: (temp: number | null) => void;
  onNightChange?: (isNight: boolean) => void;
}

export default function WeatherHeader({ onWeatherChange, onTempChange, onNightChange }: WeatherHeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState<"clear" | "rain" | "snow" | null>(null);
  const router = useRouter();

  // 날씨 상태
  const [weather, setWeather] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [icon, setIcon] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");

  // 시연용: 날씨 강제 변경 함수
  const setDemoWeather = (type: "clear" | "rain" | "snow", isNight: boolean) => {
    let newWeather = "";
    let newTemp = 20;
    let newIcon = "";
    
    if (type === "clear") {
      newWeather = "Clear";
      newIcon = isNight ? "01n" : "01d";
      newTemp = isNight ? 15 : 25;
    } else if (type === "rain") {
      newWeather = "Rain";
      newIcon = isNight ? "10n" : "10d";
      newTemp = isNight ? 12 : 18;
    } else if (type === "snow") {
      newWeather = "Snow";
      newIcon = isNight ? "13n" : "13d";
      newTemp = isNight ? -5 : -2;
    }
    
    setWeather(newWeather);
    setTemp(newTemp);
    setIcon(newIcon);
    setDemoMenuOpen(null);
    
    if (onWeatherChange) onWeatherChange(newWeather);
    if (onTempChange) onTempChange(newTemp);
    if (onNightChange) onNightChange(isNight);
  };

    // 시간 갱신
    useEffect(() => {
      const updateTime = () => {
        const now = new Date();
        setTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
      };
      updateTime();
      const interval = setInterval(updateTime, 1000 * 60); // 1분마다 갱신
      return () => clearInterval(interval);
    }, []);

  // 위치 기반 날씨 정보 가져오기 (10분마다 실시간 갱신)
  useEffect(() => {
    // 대구 중심부 (중구/동성로) 기본 좌표
    const DEFAULT_LAT = 35.8683;
    const DEFAULT_LON = 128.5961;
    let currentLat = DEFAULT_LAT;
    let currentLon = DEFAULT_LON;
    let intervalId: NodeJS.Timeout;
    let useDefaultName = false; // 위치 거부 시 "대구" 표시

    const fetchWeather = (lat: number, lon: number) => {
      axios.get("https://oversad-nikole-peatier.ngrok-free.dev/api/weather", {
        params: { lat, lon },
        withCredentials: true
      }).then(res => {
        const weatherData = res.data;
        const iconValue = weatherData.weather?.[0]?.icon || "";
        const tempValue = Math.round(weatherData.main?.temp);
        setWeather(weatherData.weather?.[0]?.main || "");
        setTemp(tempValue);
        setIcon(iconValue);
        // 위치 거부 시 "대구"로 표시, 허용 시 API 응답 사용
        setCityName(useDefaultName ? "대구" : (weatherData.name || ""));
        if (onWeatherChange) onWeatherChange(weatherData.weather?.[0]?.main || "");
        if (onTempChange) onTempChange(tempValue);
      }).catch(() => {
        setWeather("");
        setTemp(null);
        setIcon("");
        setCityName(useDefaultName ? "대구" : "");
        if (onWeatherChange) onWeatherChange("");
        if (onTempChange) onTempChange(null);
      });
    };

    const startWeatherUpdates = (lat: number, lon: number, isDefault: boolean) => {
      currentLat = lat;
      currentLon = lon;
      useDefaultName = isDefault;
      // 즉시 한 번 호출
      fetchWeather(lat, lon);
      // 10분(600000ms)마다 갱신
      intervalId = setInterval(() => {
        fetchWeather(currentLat, currentLon);
      }, 10 * 60 * 1000);
    };

    // 사용자 위치 요청
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치 허용
          startWeatherUpdates(position.coords.latitude, position.coords.longitude, false);
        },
        () => {
          // 위치 거부 → 대구 기본값 사용
          console.log("위치 권한 거부됨 - 대구 기본값 사용");
          startWeatherUpdates(DEFAULT_LAT, DEFAULT_LON, true);
        }
      );
    } else {
      // Geolocation 미지원 → 대구 기본값 사용
      startWeatherUpdates(DEFAULT_LAT, DEFAULT_LON, true);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // 토큰 유효성 검사
  useEffect(() => {
    // 1초마다 /auth/me로 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("https://oversad-nikole-peatier.ngrok-free.dev/auth/me", { withCredentials: true });
        setIsLoggedIn(!!res.data.user);
        console.log("WeatherHeader.tsx:23 로그인 상태:", !!res.data.user);
      } catch (err) {
        setIsLoggedIn(false);
        console.log("WeatherHeader.tsx:23 로그인 상태: false (에러)");
      }
    };
    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    axios.post("https://oversad-nikole-peatier.ngrok-free.dev/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        setMenuOpen(false);
        router.push("/");
      })
      .finally(() => {
        // 즉시 /auth/me 호출하여 UI 갱신
        axios.get("https://oversad-nikole-peatier.ngrok-free.dev/auth/me", { withCredentials: true })
          .then(res => setIsLoggedIn(!!res.data.user));
      });
  };

  // 메뉴 항목 배열
  const menuItems = [
    { name: "홈으로 가기", path: "/", show: true },
    { name: "마이페이지", path: "/favorites", show: isLoggedIn },
    { name: "로그인/회원가입", path: "/login", show: !isLoggedIn },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 z-50"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* 좌측: 로고 */}
        <div className="flex items-center gap-2" style={{ width: 180 }}>
          <span className="text-xl font-semibold tracking-tight" style={{ color: '#374151', letterSpacing: '-0.02em' }}>Weather Loop</span>
        </div>

        {/* 중앙: 날씨/시간 정보 */}
        <div
          className="flex items-center justify-center gap-4"
          style={{
            background: 'rgba(0, 0, 0, 0.04)',
            borderRadius: 50,
            padding: '8px 24px',
          }}
        >
          {/* 도시 이름 */}
          {cityName && (
            <>
              <span className="text-base font-medium text-gray-800">{cityName}</span>
              <span className="text-gray-300">|</span>
            </>
          )}
          {icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={weather}
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          ) : null}
          <span className="text-base font-medium text-gray-700">{temp !== null ? `${temp}°C` : "--"}</span>
          <span className="text-gray-300">|</span>
          <span className="text-base text-gray-500">{time}</span>
          {/* 시연용 버튼들 - 드롭다운 */}
          <div className="flex gap-1 ml-2 relative">
            {/* 맑음 버튼 */}
            <div className="relative">
              <button 
                className="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-full text-xs transition" 
                onClick={() => setDemoMenuOpen(demoMenuOpen === "clear" ? null : "clear")}
              >
                ☀️
              </button>
              {demoMenuOpen === "clear" && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-1 z-50 min-w-[80px] border border-gray-100">
                  <button 
                    className="w-full px-3 py-2 text-sm text-left hover:bg-yellow-50 flex items-center gap-2"
                    onClick={() => setDemoWeather("clear", false)}
                  >
                    ☀️ 낮
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-sm text-left hover:bg-indigo-50 flex items-center gap-2"
                    onClick={() => setDemoWeather("clear", true)}
                  >
                    🌙 밤
                  </button>
                </div>
              )}
            </div>
            
            {/* 비 버튼 */}
            <div className="relative">
              <button 
                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-xs transition" 
                onClick={() => setDemoMenuOpen(demoMenuOpen === "rain" ? null : "rain")}
              >
                🌧️
              </button>
              {demoMenuOpen === "rain" && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-1 z-50 min-w-[80px] border border-gray-100">
                  <button 
                    className="w-full px-3 py-2 text-sm text-left hover:bg-blue-50 flex items-center gap-2"
                    onClick={() => setDemoWeather("rain", false)}
                  >
                    🌧️ 낮
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-sm text-left hover:bg-indigo-50 flex items-center gap-2"
                    onClick={() => setDemoWeather("rain", true)}
                  >
                    🌧️ 밤
                  </button>
                </div>
              )}
            </div>
            
            {/* 눈 버튼 */}
            <div className="relative">
              <button 
                className="px-2 py-1 bg-indigo-100 hover:bg-indigo-200 rounded-full text-xs transition" 
                onClick={() => setDemoMenuOpen(demoMenuOpen === "snow" ? null : "snow")}
              >
                ❄️
              </button>
              {demoMenuOpen === "snow" && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-1 z-50 min-w-[80px] border border-gray-100">
                  <button 
                    className="w-full px-3 py-2 text-sm text-left hover:bg-cyan-50 flex items-center gap-2"
                    onClick={() => setDemoWeather("snow", false)}
                  >
                    ❄️ 낮
                  </button>
                  <button 
                    className="w-full px-3 py-2 text-sm text-left hover:bg-indigo-50 flex items-center gap-2"
                    onClick={() => setDemoWeather("snow", true)}
                  >
                    ❄️ 밤
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 메뉴 버튼 */}
        <div className="flex items-center gap-4" style={{ width: 160, justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setMenuOpen((v) => !v)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl transition"
          >
            ☰
          </button>
        </div>

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute top-16 right-6 bg-white shadow-xl rounded-2xl p-4 w-48 space-y-2 border border-gray-100">
            {menuItems.filter((item) => item.show).map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                className="block px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition" 
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
              >
                로그아웃
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}
