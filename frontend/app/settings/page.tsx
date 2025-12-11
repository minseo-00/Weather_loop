"use client";

import { useRouter } from "next/navigation";
import WeatherHeader from "@/widgets/weather-header/ui/WeatherHeader";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[#f5ecd7]"
      style={{
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
        backgroundRepeat: 'repeat',
      }}
    >
      <WeatherHeader />
      <div className="flex flex-1 w-full">
        {/* 좌측 메뉴 */}
        <aside className="w-80 min-h-full border-r border-[#d2b48c] bg-[#f5ecd7] flex flex-col py-12 px-8 gap-2">
          <h2
            className="w-full min-w-0 text-left text-3xl font-bold text-[#7c5c3a] mt-24 mb-8 leading-tight break-words whitespace-normal overflow-visible"
            style={{ wordBreak: 'break-word', minWidth: 0 }}
          >
            계정 관리
          </h2>
          <nav className="flex flex-col gap-2">
            <button className="w-full px-4 py-3 rounded-xl bg-[#e2cfa7] text-[#7c5c3a] font-semibold shadow hover:bg-[#f5ecd7] transition text-left">
              개인 정보
            </button>
          </nav>
        </aside>
        {/* 우측 정보 */}
        <main className="flex-1 min-h-full flex flex-col px-16 py-12">
          <h2
            className="w-full min-w-0 text-left text-3xl font-bold text-[#7c5c3a] mt-24 mb-8 leading-tight break-words whitespace-normal overflow-visible"
            style={{ wordBreak: 'break-word', minWidth: 0 }}
          >
            개인 정보
          </h2>
          <div className="bg-[#f5ecd7] rounded-2xl shadow p-8 w-full max-w-2xl mx-auto">
            <div className="flex items-center gap-8 mb-8">
              <div className="w-28 h-28 rounded-full bg-[#e2cfa7] border-2 border-[#d2b48c] flex items-center justify-center text-2xl text-[#bfa77a] font-bold">프사</div>
              <div>
                <div className="text-xl font-bold text-[#7c5c3a]">상열 이</div>
                <div className="text-base text-[#bfa77a]">미지출</div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-[#e2cfa7] pb-4">
                <span className="font-normal text-[#bfa77a]">이메일 주소</span>
                <span className="text-[#bfa77a]">a***@naver.com</span>
                <button className="border px-3 py-1 rounded-lg text-sm text-[#7c5c3a] bg-[#e2cfa7] hover:bg-[#f5ecd7] transition">확인</button>
              </div>
              <div className="flex justify-between items-center border-b border-[#e2cfa7] pb-4">
                <span className="font-normal text-[#bfa77a]">전화번호</span>
                <span className="text-[#bfa77a]">+82 **-****-2841</span>
                <button className="text-[#bfa77a] hover:text-[#7c5c3a]">수정</button>
              </div>
              <div className="flex justify-between items-center border-b border-[#e2cfa7] pb-4">
                <span className="font-normal text-[#bfa77a]">본인 인증</span>
                <span className="text-[#bfa77a]">시작 안 함</span>
                <button className="text-[#bfa77a] hover:text-[#7c5c3a]">시작</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
