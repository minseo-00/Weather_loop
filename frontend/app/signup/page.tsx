"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    user_id: "",
    password: "",
    name: "",
    email: "",
    nickname: "",
    phone_number: "",
    local: "",
    latitude: null,
    longitude: null
  });

  const register = async () => {
    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    console.log(await res.json());
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">

      {/* 👉 뒤로가기 버튼 */}
      <div
        className="absolute top-6 left-6 cursor-pointer text-xl"
        onClick={() => router.back()}
      >
        ←
      </div>

      <div className="w-64 h-64 mb-8 flex items-center justify-center">
        <img
          src="/images/login-art.png"
          alt="Signup Art"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg space-y-8">

        <h1 className="text-3xl font-bold text-center">회원가입</h1>

        {/* 아이디 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">아이디</label>
          <input
            type="text"
            value={form.user_id}
            onChange={(e) => handleChange("user_id", e.target.value)}
            placeholder="아이디를 입력해주세요"
            className="border rounded-lg p-3"
          />
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            className="border rounded-lg p-3"
          />
        </div>

        {/* 이름 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">이름</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="이름을 입력해주세요"
            className="border rounded-lg p-3"
          />
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">닉네임</label>
          <input
            type="text"
            value={form.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className="border rounded-lg p-3"
          />
        </div>

        {/* 이메일 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">이메일</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="이메일을 입력해주세요"
            className="border rounded-lg p-3"
          />
        </div>

        {/* 전화번호 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">전화번호</label>
          <input
            type="text"
            value={form.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            placeholder="전화번호를 입력해주세요"
            className="border rounded-lg p-3"
          />
        </div>

        {/* 지역 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">지역</label>
          <input
            type="text"
            value={form.local}
            onChange={(e) => handleChange("local", e.target.value)}
            placeholder="지역명을 입력해주세요"
            className="border rounded-lg p-3"
          />
        </div>

        {/* 회원가입 버튼 */}
        <button
          onClick={register}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          회원가입
        </button>

      </div>
    </div>
  );
}
