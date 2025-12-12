"use client";

import Image from "next/image";
import { usePlayer } from "@/widgets/player-bar/context/PlayerProvider";

export default function PlayerBar() {
  const { playing, toggle, currentTrack, isReady } = usePlayer();

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
        {currentTrack ? (
          <Image
            src={currentTrack.albumImage ?? "/images/album.jpg"}
            alt="Album"
            width={48}
            height={48}
            className="rounded-md object-cover overflow-hidden"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-md" />
        )}
      </div>

      {/* 재생 버튼 */}
      <button
        onClick={toggle}
        disabled={!isReady}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          bg-white/20 border border-white/30 text-white text-2xl
          ${!isReady ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}
        `}
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
