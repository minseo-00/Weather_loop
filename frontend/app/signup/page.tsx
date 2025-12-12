"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/shared/api/config";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    password: "",
    name: "",
    email: "",
    nickname: "",
    local: "",
    latitude: null,
    longitude: null
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const register = async () => {
    // 프론트 유효성 검사
    if (!form.email || !form.password || !form.name || !form.nickname) {
      setError("필수 입력값을 모두 입력해주세요.");
      return;
    }
    setError("");
    try {
      const payload = {
        ...form,
        latitude: form.latitude ?? 0,
        longitude: form.longitude ?? 0,
      };
      const res = await axios.post(`${BASE_URL}/auth/register`, payload, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setError(res.data.message || "회원가입에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("회원가입 에러:", err);
      console.error("응답 데이터:", err.response?.data);
      const msg = err.response?.data?.error || "서버 오류가 발생했습니다.";
      setError(msg);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF9E8] to-[#FAF3E8] px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <div
        className="absolute top-6 left-6 cursor-pointer text-xl text-gray-700 hover:text-gray-900 transition"
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div className="w-48 h-48 mb-6 flex items-center justify-center">
        <img
          src="/images/login-art.png"
          alt="Signup Art"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-10 rounded-2xl border border-[#E8DED0] shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">회원가입</h1>
        {error && (
          <div className="text-red-500 text-center font-semibold mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-center font-semibold mb-2">회원가입 성공! 로그인 페이지로 이동합니다.</div>
        )}
        {/* 아이디 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">아이디</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
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
        {/* ...중복 이메일 입력란 제거... */}
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
        {/* ...전화번호 입력란 제거... */}
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
          className="w-full py-3 bg-gradient-to-r from-[#AEC9FF] to-[#FFD6E8] text-gray-800 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
