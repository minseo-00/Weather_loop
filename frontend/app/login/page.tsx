"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Input from "@/shared/ui/Input";
import HomeButton from "@/shared/ui/HomeButton";
import WeatherEffects from "@/shared/ui/WeatherEffects";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 날씨 상태
  const [weather, setWeather] = useState<string>("Clear");
  const [isNight, setIsNight] = useState(false);

  // 시간대 체크
  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 18 || hour < 6);
  }, []);

  // 날씨 정보 가져오기
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get("https://oversad-nikole-peatier.ngrok-free.dev/api/weather", {
          params: { lat: 35.8683, lon: 128.5961 },
          withCredentials: true
        });
        setWeather(res.data.weather?.[0]?.main || "Clear");
      } catch {
        setWeather("Clear");
      }
    };
    fetchWeather();
  }, []);

  const login = async () => {
    setError("");
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const res = await axios.post(`${backendUrl}/auth/login`, { email, password }, {
        withCredentials: true,
      });
      setSuccess(true);
      setTimeout(() => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        router.push("/main");
        setTimeout(() => window.location.reload(), 300);
      }, 1000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* 날씨 효과 */}
      <WeatherEffects weather={weather} isNight={isNight} />
      
      {/* 홈 버튼 */}
      <HomeButton />

      {/* 로그인 이미지 */}
      <div className="relative z-20 w-64 h-64 mb-8 flex items-center justify-center">
        <img
          src="/images/login-art.png"
          alt="Login Art"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 로그인 박스 */}
      <div className="relative z-20 w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl space-y-6 border border-gray-200">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-800">아이디와 비밀번호를 입력해주세요.</h1>
        </div>
        {error && (
          <div className="text-red-500 text-center font-semibold mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-center font-semibold mb-2">로그인 성공! 메인페이지로 이동합니다.</div>
        )}
        {/* 아이디 */}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
        />
        {/* 비밀번호 */}
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
        {/* 로그인 유지 & 아이디 저장 */}
        <div className="flex justify-between text-sm text-gray-600">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-gray-700" />
            <span>로그인 상태 유지</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-gray-700" />
            <span>아이디 저장</span>
          </label>
        </div>
        {/* 로그인 버튼 */}
        <button
          onClick={login}
          className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition shadow-md"
        >
          로그인
        </button>
        {/* Spotify 로그인 버튼 */}
        <button
          onClick={() => {
            const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "9a0c19a7e9f24b069ecf7fc7945251a3";
            const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "http://localhost:3000/api/auth/callback");
            const scope = encodeURIComponent("playlist-read-private playlist-read-collaborative user-read-email user-read-private streaming user-read-playback-state user-modify-playback-state");
            const state = Math.random().toString(36).substring(2, 15);
            document.cookie = `spotify_auth_state=${state}; path=/; SameSite=Lax; Secure`;
            const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
            window.location.href = url;
          }}
          className="w-full py-3 mt-2 bg-[#1DB954] text-white rounded-xl font-semibold hover:bg-[#1aa34a] transition shadow-md flex items-center justify-center gap-2"
        >
          <span>🎵</span> Spotify로 로그인
        </button>
        {/* 아이디/비번 찾기 + 회원가입 */}
        <div className="flex justify-center gap-6 text-sm text-gray-500 mt-2">
          <button className="hover:underline hover:text-gray-800 transition">비밀번호 찾기</button>
          <button className="hover:underline hover:text-gray-800 transition">아이디 찾기</button>
          <button
            className="hover:underline hover:text-gray-800 transition"
            onClick={() => router.push("/signup")}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
