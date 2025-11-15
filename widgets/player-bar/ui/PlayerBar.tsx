"use client";

import { usePlayer } from "../model/usePlayer";

export default function PlayerBar() {
  const { playing, toggle } = usePlayer();

  return (
    <div className="fixed bottom-0 left-0 w-full backdrop-blur-xl bg-gradient-to-t from-black/40 to-black/10 p-4 flex items-center justify-between">

      {/* 왼쪽: 빈 영역(필요시 아이콘 추가 가능) */}
      <div className="w-8" />

      {/* 중앙: 재생 버튼 */}
      <button
        onClick={toggle}
        className="
          w-14 h-14 rounded-full flex items-center justify-center
          bg-white/20 border border-white/30 text-white text-2xl
        "
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* 오른쪽: 즐겨찾기 */}
      <button
        className="
          px-4 py-2 rounded-full text-white text-sm font-medium
          bg-white/15 border border-white/30
        "
      >
        ⭐ Favorites
      </button>
    </div>
  );
}
