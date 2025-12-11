
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
    <header
      className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 z-50"
      style={{
        backgroundColor: '#f5ecd7',
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
        backgroundRepeat: 'repeat',
        borderBottom: '1px solid #d2b48c',
      }}
    >
      {/* 좌측 로고 */}
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <Image src="/images/weather-clear-logo.png" alt="Weather Logo" fill className="object-contain" />
        </div>
        <span className="text-lg font-bold text-white ml-2">Weather Loop</span>
      </div>

      {/* 햄버거 메뉴 버튼 */}
      <button onClick={() => setMenuOpen((v) => !v)} className="text-white text-2xl ml-auto">☰</button>

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
  );
}
      {/* 드롭다운 메뉴 */}
