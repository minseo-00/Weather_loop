"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import HomeButton from "@/shared/ui/HomeButton";
import WeatherEffects from "@/shared/ui/WeatherEffects";

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
        const res = await axios.get("/api/weather", {
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

  const register = async () => {
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
      const res = await axios.post("/auth/register", payload, {
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
    } catch (err) {
      console.error("회원가입 에러:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* 날씨 효과 */}
      <WeatherEffects weather={weather} isNight={isNight} />

      {/* 홈 버튼 */}
      <HomeButton />

      <div className="relative z-20 w-64 h-64 mb-8 flex items-center justify-center">
        <img
          src="/images/login-art.png"
          alt="Signup Art"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative z-20 w-full max-w-2xl bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl space-y-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800">회원가입</h1>
        {error && (
          <div className="text-red-500 text-center font-semibold mb-2">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-center font-semibold mb-2">회원가입 성공! 로그인 페이지로 이동합니다.</div>
        )}
        {/* 이메일 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-800">이메일 <span className="text-red-400">*</span></label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="이메일을 입력해주세요"
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white/80"
          />
        </div>
        {/* 비밀번호 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-800">비밀번호 <span className="text-red-400">*</span></label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white/80"
          />
        </div>
        {/* 이름 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-800">이름 <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="이름을 입력해주세요"
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white/80"
          />
        </div>
        {/* 닉네임 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-800">닉네임 <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white/80"
          />
        </div>
        {/* 지역 */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-800">지역</label>
          <input
            type="text"
            value={form.local}
            onChange={(e) => handleChange("local", e.target.value)}
            placeholder="지역명을 입력해주세요 (선택)"
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white/80"
          />
        </div>
        {/* 회원가입 버튼 */}
        <button
          onClick={register}
          className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition shadow-md"
        >
          회원가입
        </button>
        {/* 로그인 페이지 링크 */}
        <p className="text-center text-gray-500 text-sm">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-gray-800 font-semibold hover:underline"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}
