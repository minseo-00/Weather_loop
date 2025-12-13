"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";
import HomeButton from "@/shared/ui/HomeButton";
import WeatherEffects from "@/shared/ui/WeatherEffects";
import axios from "axios";

interface UserInfo {
  user_id: string;
  nickname: string;
  name?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("profile");

  // 날씨 상태
  const [weather, setWeather] = useState<string>("Clear");
  const [isNight, setIsNight] = useState(false);

  // 시간대 체크
  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 18 || hour < 6);
  }, []);

  // 사용자 정보 로드
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me", { withCredentials: true });
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      router.push("/login");
    } catch (err) {
      console.error("로그아웃 에러:", err);
    }
  };

  const menuItems = [
    { id: "profile", label: "개인 정보", icon: "👤" },
    { id: "security", label: "보안", icon: "🔒" },
    { id: "notifications", label: "알림 설정", icon: "🔔" },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* 날씨 효과 */}
      <WeatherEffects weather={weather} isNight={isNight} />

      {/* 홈 버튼 */}
      <HomeButton />

      <WeatherHeader onWeatherChange={setWeather} />

      <div className="relative z-20 flex flex-1 w-full">
        {/* 좌측 메뉴 */}
        <aside className="w-72 min-h-full border-r border-gray-200 bg-white/60 backdrop-blur-md flex flex-col py-12 px-6">
          <h2 className="text-2xl font-bold text-gray-800 mt-16 mb-8">
            설정
          </h2>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full px-4 py-3 rounded-xl font-medium text-left flex items-center gap-3 transition ${
                  activeMenu === item.id
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* 로그아웃 버튼 */}
          {user && (
            <button
              onClick={handleLogout}
              className="mt-auto mb-4 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition flex items-center gap-3"
            >
              <span>🚪</span>
              로그아웃
            </button>
          )}
        </aside>

        {/* 우측 컨텐츠 */}
        <main className="flex-1 min-h-full flex flex-col px-12 py-12">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : !user ? (
            /* 비로그인 상태 */
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-6 opacity-30">🔐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                로그인이 필요합니다
              </h3>
              <p className="text-gray-500 mb-6">
                설정을 변경하려면 먼저 로그인해주세요.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition shadow-md"
              >
                로그인
              </button>
            </div>
          ) : (
            /* 로그인 상태 - 설정 내용 */
            <>
              <h2 className="text-2xl font-bold text-gray-800 mt-16 mb-8">
                {menuItems.find((m) => m.id === activeMenu)?.label}
              </h2>

              {activeMenu === "profile" && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-gray-200">
                  {/* 프로필 헤더 */}
                  <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-3xl font-bold text-gray-700">
                      {user.nickname?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{user.nickname}</p>
                      <p className="text-gray-500">{user.user_id}</p>
                    </div>
                  </div>

                  {/* 정보 목록 */}
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-800 font-medium">이메일</span>
                      <span className="text-gray-500">{user.user_id}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-800 font-medium">닉네임</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{user.nickname}</span>
                        <button className="text-sm px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                          수정
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-800 font-medium">비밀번호</span>
                      <button className="text-sm px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                        변경
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "security" && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-gray-200">
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4 opacity-30">🔒</div>
                    <p className="text-gray-500">보안 설정 기능 준비 중입니다.</p>
                  </div>
                </div>
              )}

              {activeMenu === "notifications" && (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-2xl border border-gray-200">
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4 opacity-30">🔔</div>
                    <p className="text-gray-500">알림 설정 기능 준비 중입니다.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
