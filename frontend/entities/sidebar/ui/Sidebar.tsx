"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  // Cassette 플레이어 UI 상태 (곡목록 없음)
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const genreSongs: Record<string, string[]> = {
    Pop: ["Love Dive - IVE", "Ditto - NewJeans", "Hype Boy - NewJeans"],
    Jazz: ["Autumn Leaves - Bill Evans", "Take Five - Dave Brubeck", "Blue in Green - Miles Davis"],
    Rock: ["Bohemian Rhapsody - Queen", "Stairway to Heaven - Led Zeppelin", "Hotel California - Eagles"],
    LoFi: ["Snowman - WYS", "Chillhop Essentials - Various Artists", "Dreams - Joakim Karud"],
  };

    // 날씨별 추천 음악 리스트
    const weatherMusicMap: Record<string, string[]> = {
      Clear: ["여름 안에서", "Sunny Day", "Walking on Sunshine"],
      Clouds: ["구름 위에서", "Cloudy Mood", "Grey Sky"],
      Rain: ["비 오는 거리", "Rainy Day", "Raindrops Keep Fallin’"],
      Snow: ["첫눈", "Snow Flower", "Let It Snow"],
      Thunderstorm: ["천둥 번개", "Thunderstruck"],
      Drizzle: ["이슬비", "Drizzle Song"],
      Mist: ["안개 속에서", "Misty"],
      Default: ["기분 좋은 노래", "Feel Good Song"]
    };

    function getMusicByWeather(weather: string) {
      return weatherMusicMap[weather] || weatherMusicMap["Default"];
    }

    const [weather, setWeather] = useState<string>("");
    const [musicList, setMusicList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      setMounted(true);
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axios.get("http://localhost:3001/api/weather", {
              params: { lat: latitude, lon: longitude }
            });
            const mainWeather = res.data.weather?.[0]?.main || "";
            setWeather(mainWeather);
            setMusicList(getMusicByWeather(mainWeather));
          } catch (err) {
            setWeather("");
            setMusicList(weatherMusicMap["Default"]);
          } finally {
            setLoading(false);
          }
        }, () => {
          setWeather("");
          setMusicList(weatherMusicMap["Default"]);
          setLoading(false);
        });
      } else {
        setWeather("");
        setMusicList(weatherMusicMap["Default"]);
        setLoading(false);
      }
    }, []);

  if (!mounted) {
    return null;
  }
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
            {/* 날씨 기반 추천곡 영역 */}
            <div className="mt-8 p-4 rounded-lg bg-[#e2cfa7]/30">
              <h3 className="font-bold mb-2 text-[#7c5c3a]">오늘의 날씨 기반 추천곡</h3>
              <ul className="list-disc pl-5 text-[#bfa77a]">
                {musicList.map((song, idx) => (
                  <li key={idx}>{song}</li>
                ))}
              </ul>
            </div>
        </div>
   
      </div>
    </aside>
  );
}
