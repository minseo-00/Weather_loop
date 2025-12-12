"use client";

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL, SPOTIFY_REDIRECT_URI } from "@/shared/api/config";
import { useRouter } from "next/navigation";
import Input from "@/shared/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const login = async () => {
    setError("");
    try {
      await axios.post(`${BASE_URL}/auth/login`, { email, password }, {
        withCredentials: true,
      });
      // 쿠키가 설정되었으므로 즉시 메인으로 이동
      router.replace("/main");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF9E8] to-[#FAF3E8] px-4 py-8">
      
      {/* 상단 뒤로가기 */}
      <div
        className="absolute top-6 left-6 cursor-pointer text-xl text-gray-700 hover:text-gray-900 transition"
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {/* 로그인 이미지 */}
      <div className="w-48 h-48 mb-6 flex items-center justify-center">
        <img
          src="/images/login-art.png"
          alt="Login Art"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 로그인 박스 */}
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E8DED0] shadow-lg space-y-5">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-900">로그인</h1>
          <p className="text-sm text-gray-500">아이디와 비밀번호를 입력해주세요</p>
        </div>
        {error && (
          <div className="text-red-500 text-center font-semibold mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-center font-semibold mb-2">로그인 성공! 메인페이지로 이동합니다.</div>
        )}
        {/* 아이디 */}
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="아이디를 입력하세요"
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
            <input type="checkbox" className="w-4 h-4" />
            <span>로그인 상태 유지</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span>아이디 저장</span>
          </label>
        </div>
        {/* 로그인 버튼 */}
        <button
          onClick={login}
          className="w-full py-3 bg-gradient-to-r from-[#AEC9FF] to-[#FFD6E8] text-gray-800 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          로그인
        </button>
        {/* Spotify 로그인 버튼 */}
        <button
          onClick={() => {
            const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "9a0c19a7e9f24b069ecf7fc7945251a3";
            const redirectUri = encodeURIComponent(SPOTIFY_REDIRECT_URI || "");
            const scope = encodeURIComponent("playlist-read-private playlist-read-collaborative user-read-email user-read-private streaming user-read-playback-state user-modify-playback-state");
            const state = Math.random().toString(36).substring(2, 15);
            // state를 쿠키에 저장 (path=/, 세션 쿠키)
            document.cookie = `spotify_auth_state=${state}; path=/;`;
            const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
            window.location.href = url;
          }}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Spotify로 로그인
        </button>
        {/* 아이디/비번 찾기 + 회원가입 */}
        <div className="flex justify-center gap-6 text-sm text-gray-500 mt-2">
          <button className="hover:underline">비밀번호 찾기</button>
          <button className="hover:underline">아이디 찾기</button>
          <button
            className="hover:underline"
            onClick={() => router.push("/signup")}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
