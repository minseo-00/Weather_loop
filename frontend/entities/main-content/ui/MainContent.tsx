"use client";

import { useMemo } from "react";
import Cassette from "@/entities/cassette/ui";
<<<<<<< HEAD
import { useWeatherContext } from "@/shared/context/WeatherContext";
=======
// import PlaylistGrid from "@/widgets/playlist-grid/ui/PlaylistGrid";

const GENRES = ["Pop", "Jazz", "Rock", "LoFi"];
>>>>>>> 93280b557983173712d8f4cbcc9c33bc0f1ae09a

export default function MainContent() {
  const { recommendedGenres, weather, loading } = useWeatherContext();

  // Generate random rotations for scattered layout
  const rotations = useMemo(
    () =>
      recommendedGenres.map(() => {
        return Math.random() * 6 - 3; // Random rotation between -3 and 3 degrees
      }),
    [recommendedGenres]
  );

  return (
    <main
      className="flex-1 bg-[#f5ecd7] overflow-auto flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* 날씨 기반 추천 메시지 */}
      {!loading && weather && (
        <div className="text-center mb-8 mt-20">
          <p className="text-lg text-[#7c5c3a] opacity-80">
            현재 날씨: <span className="font-semibold">{weather}</span>
          </p>
          <p className="text-sm text-[#7c5c3a] opacity-60">
            이런 날씨에 어울리는 음악을 추천해드려요 🎵
          </p>
        </div>
      )}

      {/* Cassette 2x2 Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-16 py-8 w-full max-w-5xl place-items-center">
        {recommendedGenres.map((genre, index) => (
          <Cassette key={`${genre}-${index}`} id={`cassette-${index}`} genre={genre} rotation={rotations[index]} />
        ))}
      </div>

        {/* Cassette/앨범/트랙/플레이리스트 그리드 완전 제거 */}

      {/* Optional: Subtle background grid pattern */}
      <style jsx>{`
        main {
          background-image: 
            linear-gradient(90deg, rgba(255,255,255,.01) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,.01) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </main>
  );
}
