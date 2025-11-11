"use client";

import TrackCard, { Track } from "@/entities/track/ui/TrackCard";

export default function PlaylistGrid() {
  // 🎵 임시 Golden 트랙 데이터
  const track: Track = {
    bookmarket_id: "temp-1",
    music_id: 1,
    title: "",
    artist: "",
    img: "/images/golden.png",
  };

  return (
    <div className="w-full flex flex-col items-center mt-10">
      {/* 이미지 전체가 잘리지 않고 다 보이게 */}
      <div className="w-[350px] h-[350px] rounded-2xl overflow-hidden border-4 border-blue-200 shadow-lg bg-white/10 flex items-center justify-center">
        <img
          src={track.img}
          alt="Golden Cover"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

