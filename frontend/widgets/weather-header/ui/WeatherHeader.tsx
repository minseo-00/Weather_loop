"use client";

import { useState, useEffect } from "react";
import { useWeather } from "../model/useWeather";
import Image from "next/image";
import Link from "next/link";

export default function WeatherHeader() {
  const { time, temp, icon } = useWeather();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImg, setProfileImg] = useState("/images/profile.jpg");

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedProfile = localStorage.getItem("profileImg");

    if (token) setIsLoggedIn(true);
    if (savedProfile) setProfileImg(savedProfile);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 backdrop-blur-xl bg-black/20 z-50">

      {/* 중앙 정렬 영역 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">

        {/* 시간 */}
        <span className="text-xs text-white bg-black/20 px-2 py-1 rounded-full">
          {time}
        </span>

        {/* 로고 */}
        <span className="flex items-center gap-2 text-sm font-semibold text-white bg-black/20 px-3 py-1 rounded-full">
          <div className="relative w-5 h-5">
            <Image
              src="/images/weather-clear-logo.png"
              alt="Weather Logo"
              fill
              className="object-contain"
            />
          </div>
          Weather Loop
        </span>

        {/* 날씨 */}
        <span className="text-xs text-white flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full">
          {icon} {temp}°C
        </span>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center gap-4 ml-auto">

        {/* 프로필 */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/50">
          <Image
            src={profileImg}
            alt="프로필"
            fill
            className="object-cover"
          />
        </div>

        {/* 햄버거 메뉴 버튼 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="absolute top-14 right-6 bg-white/95 shadow-lg rounded-xl p-4 w-44 space-y-3 text-sm">

          {/* 로그인 전 */}
          {!isLoggedIn && (
            <>
              <Link href="/login" className="block hover:opacity-70">
                로그인
              </Link>
              <Link href="/signup" className="block hover:opacity-70">
                회원가입
              </Link>
            </>
          )}

          {/* 로그인 후 */}
          {isLoggedIn && (
            <>
              <Link href="/profile" className="block hover:opacity-70">
                프로필 설정
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                }}
                className="block text-red-500 hover:opacity-70"
              >
                로그아웃
              </button>
            </>
          )}

          {/* ⭐ 없이 맨 아래 즐겨찾기 */}
          <Link
            href="/favorites"
            className="block hover:opacity-70 font-medium pt-2 border-t"
          >
            즐겨찾기
          </Link>
        </div>
      )}

    </header>
  );
}
