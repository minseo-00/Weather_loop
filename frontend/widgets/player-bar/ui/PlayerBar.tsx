"use client";

import Image from "next/image";
import { usePlayer } from "../model/usePlayer";

export default function PlayerBar() {
  const { playing, toggle } = usePlayer();

  // 곡 테스트용 (나중에 실제 데이터 연결됨)
  const currentTrack = {
    id: "sample",
    title: "샘플 음악",
    albumImage: "/images/album.jpg",
  };

  return (
    <div
      className="
        fixed bottom-0 left-0 w-full
        backdrop-blur-xl bg-gradient-to-t
        from-black/40 to-black/10
        p-4 flex items-center justify-between
      "
    >
      {/* 앨범 이미지 */}
      <div className="flex items-center">
        <Image
          src={currentTrack.albumImage}
          alt="Album"
          width={48}
          height={48}
          className="rounded-md object-cover overflow-hidden"
        />
      </div>

      {/* 재생 버튼 */}
      <button
        onClick={toggle}
        className="
          w-14 h-14 rounded-full flex items-center justify-center
          bg-white/20 border border-white/30 text-white text-2xl
        "
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Favorites 버튼 */}
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
