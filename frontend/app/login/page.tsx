"use client";

import React, { useState } from "react";
import axios from "axios";
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
      const res = await axios.post("/api/auth/signin", { email, password });
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      {/* 상단 뒤로가기 */}
      <div
        className="absolute top-6 left-6 cursor-pointer text-xl"
        onClick={() => router.back()}   // ← 뒤로가기 작동
      >
        ←
      </div>

      {/* 로그인 이미지 */}
      <div className="w-64 h-64 mb-8 flex items-center justify-center">
        <img
          src="/images/login-art.png"
          alt="Login Art"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 로그인 박스 */}
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">아이디와 비밀번호를 입력해주세요.</h1>
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
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          로그인
        </button>
        {/* Spotify 로그인 버튼 */}
        <button
          onClick={() => {
            const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "9a0c19a7e9f24b069ecf7fc7945251a3";
            const redirectUri = encodeURIComponent("https://refringent-bioecological-keisha.ngrok-free.dev/api/auth/callback");
            const scope = encodeURIComponent("playlist-read-private playlist-read-collaborative user-read-email user-read-private streaming user-read-playback-state user-modify-playback-state");
            const state = Math.random().toString(36).substring(2, 15);
            // state를 쿠키에 저장 (path=/, 세션 쿠키)
            document.cookie = `spotify_auth_state=${state}; path=/;`;
            const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
            window.location.href = url;
          }}
          className="w-full py-3 mt-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
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
