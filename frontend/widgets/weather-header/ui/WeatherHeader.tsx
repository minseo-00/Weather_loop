
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/shared/api/config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WeatherHeader({ onWeatherChange }: { onWeatherChange?: (weather: string) => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // 날씨 상태
  const [weather, setWeather] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [icon, setIcon] = useState<string>("");
  const [time, setTime] = useState<string>("");
  // 시연용: 날씨 강제 변경 함수
  const setDemoWeather = (type: "clear" | "rain" | "snow") => {
    let newWeather = "";
    if (type === "clear") {
      newWeather = "Clear";
      setIcon("01d");
      setTemp(25);
    } else if (type === "rain") {
      newWeather = "Rain";
      setIcon("10d");
      setTemp(18);
    } else if (type === "snow") {
      newWeather = "Snow";
      setIcon("13d");
      setTemp(-2);
    }
    setWeather(newWeather);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentWeatherEffect', type);
        window.dispatchEvent(new CustomEvent('weather-changed', { detail: type }));
      }
    } catch {}
    if (onWeatherChange) onWeatherChange(newWeather);
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

  // 위치 기반 날씨 정보 가져오기
  useEffect(() => {
    const latitude = 1.3521;
    const longitude = 103.8198;
    axios.get(`${BASE_URL}/api/weather`, {
      params: { lat: latitude, lon: longitude },
      withCredentials: true
    }).then(res => {
      const weatherData = res.data;
      const iconValue = weatherData.weather?.[0]?.icon || "";
      setWeather(weatherData.weather?.[0]?.main || "");
      setTemp(Math.round(weatherData.main?.temp));
      setIcon(iconValue);
      const main = (weatherData.weather?.[0]?.main || "") as string;
      const type = main === 'Snow' ? 'snow' : main === 'Rain' ? 'rain' : 'clear';
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentWeatherEffect', type);
          window.dispatchEvent(new CustomEvent('weather-changed', { detail: type }));
        }
      } catch {}
      if (onWeatherChange) onWeatherChange(main);
    }).catch(() => {
      setWeather("");
      setTemp(null);
      setIcon("");
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentWeatherEffect', 'clear');
          window.dispatchEvent(new CustomEvent('weather-changed', { detail: 'clear' }));
        }
      } catch {}
      if (onWeatherChange) onWeatherChange("");
    });
  }, []);

  // 토큰 유효성 검사
  useEffect(() => {
    // 1초마다 /auth/me로 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
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
    axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        setMenuOpen(false);
        router.push("/");
      })
      .finally(() => {
        // 즉시 /auth/me 호출하여 UI 갱신
        axios.get(`${BASE_URL}/auth/me`, { withCredentials: true })
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
        className="sticky top-0 left-0 w-full flex items-center justify-between px-6 py-3 z-50 backdrop-blur-sm surface elev-1"
      >
        {/* 좌측: 빈 공간(중앙 정렬용) */}
        <div style={{ width: 120 }} />

        {/* 중앙: 투명 네모 박스 */}
        <div
          className="flex items-center justify-center gap-4 surface elev-1 rounded-xl px-7 py-2"
          style={{ minWidth: 340, maxWidth: 600 }}
        >
          <span className="text-sm text-gray-600 font-light italic">{time}</span>
          <span className="text-lg text-gray-300">|</span>
          <span className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Weather Loop</span>
          {icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={weather}
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          ) : null}
          <span className="text-sm" style={{ color: 'var(--foreground)' }}>{temp !== null ? `${temp} ℃` : "알 수 없음"}</span>
          <button className="ml-2 px-2 py-1 rounded text-xs btn-accent elev-1" onClick={() => setDemoWeather("clear")}>맑음</button>
          <button className="ml-1 px-2 py-1 rounded text-xs btn-accent elev-1" onClick={() => setDemoWeather("rain")}>비</button>
          <button className="ml-1 px-2 py-1 rounded text-xs btn-accent elev-1" onClick={() => setDemoWeather("snow")}>눈</button>
        </div>

        {/* 우측: 햄버거 메뉴 버튼 */}
        <button onClick={() => setMenuOpen((v) => !v)} className="text-2xl ml-4" style={{ color: 'var(--foreground)' }}>☰</button>

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute top-14 right-6 surface elev-2 rounded-xl p-4 w-44 space-y-3 text-sm">
            {menuItems.filter((item) => item.show).map((item) => (
              <Link key={item.name} href={item.path} className="block hover:opacity-80" onClick={() => setMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="block text-red-500 hover:opacity-80 mt-2"
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
      {/* 드롭다운 메뉴 */}
