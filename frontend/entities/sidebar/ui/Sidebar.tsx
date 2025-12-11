"use client";

import { useState } from "react";

export default function Sidebar() {
  // Cassette 플레이어 UI 상태 (곡목록 없음)
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const genreSongs: Record<string, string[]> = {
    Pop: ["Love Dive - IVE", "Ditto - NewJeans", "Hype Boy - NewJeans"],
    Jazz: ["Autumn Leaves - Bill Evans", "Take Five - Dave Brubeck", "Blue in Green - Miles Davis"],
    Rock: ["Bohemian Rhapsody - Queen", "Stairway to Heaven - Led Zeppelin", "Hotel California - Eagles"],
    LoFi: ["Snowman - WYS", "Chillhop Essentials - Various Artists", "Dreams - Joakim Karud"],
  };

  return (
    <aside className="w-80 bg-[#f5ecd7] border-r border-[#d2b48c] flex flex-col items-center justify-center py-8 overflow-hidden">
      {/* 앨범아트 영역 */}
      <div className="w-56 h-56 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-8 border border-white/10">
        <div className="w-32 h-32 bg-[#e2cfa7] rounded-md flex items-center justify-center shadow-lg">
          {/* 앨범아트 아이콘 */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" fill="#222" />
            <circle cx="32" cy="32" r="8" fill="#444" />
            <circle cx="44" cy="20" r="4" fill="#444" />
          </svg>
        </div>
      </div>

      {/* 곡 정보 및 안내문구 */}
      <div className="flex flex-col items-center w-full px-4">
        <div className="text-center mb-2">
          <span className="text-lg font-bold text-[#7c5c3a]">재생목록</span>
          <span className="text-lg font-bold text-[#bfa77a] ml-4">음악서랍</span>
          <span className="text-lg font-bold text-[#bfa77a] ml-4">믹스업</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs text-[#bfa77a]">00:00</span>
          <span className="text-xs text-[#d2b48c]">00:00</span>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button className="p-2 rounded-full bg-[#e2cfa7]/60 hover:bg-[#e2cfa7]/80">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="p-2 rounded-full bg-[#e2cfa7]/60 hover:bg-[#e2cfa7]/80">
            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z"/></svg>
          </button>
          <button className="p-2 rounded-full bg-[#e2cfa7]/60 hover:bg-[#e2cfa7]/80">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-base font-bold text-[#7c5c3a]">재생목록</span>
          <span className="text-base font-bold text-[#bfa77a]">음악서랍</span>
          <span className="text-base font-bold text-[#bfa77a]">믹스업</span>
        </div>
        <div className="text-center mt-8 mb-4">
          {selectedAlbum ? (
            <>
              <p className="text-[#7c5c3a] text-base mb-2">{selectedAlbum} 추천곡</p>
              <ul className="text-[#bfa77a] text-sm mb-2">
                {genreSongs[selectedAlbum]?.map((song, idx) => (
                  <li key={idx}>• {song}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="text-[#7c5c3a] text-base mb-2">곡 목록이 없어요.</p>
              <p className="text-[#bfa77a] text-sm">라디오에서 원하는 장르를 선택해보세요.</p>
            </>
          )}
        </div>
   
      </div>
    </aside>
  );
}
