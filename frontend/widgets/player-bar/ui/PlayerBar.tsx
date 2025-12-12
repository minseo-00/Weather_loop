"use client";

import Image from "next/image";
import { usePlayer } from "@/widgets/player-bar/context/PlayerProvider";
import { useEffect } from "react";

export default function PlayerBar() {
  const { audioRef, playing, toggle, currentTrack } = usePlayer();

  useEffect(() => {
    // ensure audioRef element exists when currentTrack changes
    if (audioRef.current && currentTrack && currentTrack.preview_url) {
      audioRef.current.src = currentTrack.preview_url;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack, audioRef]);

  return (
    <div
      className="
        fixed bottom-0 left-0 w-full
        backdrop-blur-xl bg-gradient-to-t
        from-black/40 to-black/10
        p-4 flex items-center justify-between
      "
    >
      <audio ref={audioRef} />

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
        className="
          w-14 h-14 rounded-full flex items-center justify-center
          bg-white/20 border border-white/30 text-white
        "
        aria-label={playing ? '일시정지' : '재생'}
        title={playing ? '일시정지' : '재생'}
      >
        {playing ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="7" y="5" width="3" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="3" height="14" rx="1" fill="currentColor"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5v14l10-7z" fill="currentColor"/></svg>
        )}
      </button>

      {/* Favorites 버튼 */}
      <button
        className="
          px-4 py-2 rounded-full text-white text-sm font-medium
          bg-white/15 border border-white/30
        "
      >
        Favorites
      </button>
    </div>
  );
}
