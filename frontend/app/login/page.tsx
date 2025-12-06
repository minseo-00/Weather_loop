"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/shared/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, password })
    });

    console.log(await res.json());
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

        {/* 아이디 */}
        <Input
          type="text"
          value={user_id}
          onChange={(e) => setUserId(e.target.value)}
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
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          로그인
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
