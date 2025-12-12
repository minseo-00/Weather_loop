
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WeatherHeader() {
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
    if (type === "clear") {
      setWeather("Clear");
      setIcon("01d");
      setTemp(25);
    } else if (type === "rain") {
      setWeather("Rain");
      setIcon("10d");
      setTemp(18);
    } else if (type === "snow") {
      setWeather("Snow");
      setIcon("13d");
      setTemp(-2);
    }
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
      const fetchWeather = (lat: number, lon: number) => {
        axios.get("http://localhost:3001/api/weather", {
          params: { lat, lon }
        }).then(res => {
          const weatherData = res.data;
          const iconValue = weatherData.weather?.[0]?.icon || "";
          console.log("WeatherHeader.tsx icon:", iconValue);
          setWeather(weatherData.weather?.[0]?.main || "");
          setTemp(Math.round(weatherData.main?.temp));
          setIcon(iconValue);
        }).catch(() => {
          setWeather("");
          setTemp(null);
          setIcon("");
        });
      };

      // 사용자 위치 가져오기
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
    }, []);

  // 토큰 유효성 검사
  useEffect(() => {
    // 1초마다 /auth/me로 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("http://localhost:3001/auth/me", { withCredentials: true });
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
    axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        setMenuOpen(false);
        router.push("/");
      })
      .finally(() => {
        // 즉시 /auth/me 호출하여 UI 갱신
        axios.get("http://localhost:3001/auth/me", { withCredentials: true })
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
          backgroundColor: '#f5ecd7',
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
          backgroundRepeat: 'repeat',
          borderBottom: '1px solid #d2b48c',
        }}
      >
        {/* 좌측: 빈 공간(중앙 정렬용) */}
        <div style={{ width: 120 }} />

        {/* 중앙: 투명 네모 박스 */}
        <div
          className="flex items-center justify-center gap-4"
          style={{
            background: 'rgba(200, 200, 200, 0.35)',
            borderRadius: 12,
            padding: '8px 28px',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            minWidth: 340,
            maxWidth: 600,
          }}
        >
          <span className="text-lg text-[#4a5a6a] font-light italic">{time}</span>
          <span className="text-lg text-[#4a5a6a]">|</span>
          <span className="text-xl font-bold text-[#4a5a6a]">Weather Loop</span>
          {icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={weather}
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          ) : null}
          <span className="text-lg text-[#222]">{temp !== null ? `${temp} ℃` : "알 수 없음"}</span>
          <button className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs" onClick={() => setDemoWeather("clear")}>맑음</button>
          <button className="ml-1 px-2 py-1 bg-blue-200 rounded text-xs" onClick={() => setDemoWeather("rain")}>비</button>
          <button className="ml-1 px-2 py-1 bg-blue-300 rounded text-xs" onClick={() => setDemoWeather("snow")}>눈</button>
        </div>

        {/* 우측: 햄버거 메뉴 버튼 */}
        <button onClick={() => setMenuOpen((v) => !v)} className="text-[#4a5a6a] text-2xl ml-4">☰</button>

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute top-14 right-6 bg-white/95 shadow-lg rounded-xl p-4 w-44 space-y-3 text-sm">
            {menuItems.filter((item) => item.show).map((item) => (
              <Link key={item.name} href={item.path} className="block hover:opacity-70" onClick={() => setMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="block text-red-500 hover:opacity-70 mt-2"
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
