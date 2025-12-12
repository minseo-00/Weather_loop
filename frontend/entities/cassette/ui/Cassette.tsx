"use client";

import { useState, useEffect } from "react";

interface CassetteProps {
  id: string;
  genre: string;
  rotation: number;
  onSelect?: (genre: string) => void;
}

export default function Cassette({ id, genre, onSelect }: CassetteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setRotation(Math.random() * 5 - 2.5);
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("cassette-name", genre);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // 드래그 완료 시 해당 장르 선택
    if (onSelect) {
      onSelect(genre);
    }
  };

  const handleClick = () => {
    // 클릭 시 해당 장르 선택
    if (onSelect) {
      onSelect(genre);
    }
  };

  // 장르별 파스텔 컬러 매핑
  const genreColors: Record<string, string> = {
    Pop: "#FFE8A3",      // 파스텔 옐로우
    Rock: "#FFC7B5",     // 파스텔 코랄
    Jazz: "#D4E7FF",     // 파스텔 스카이 블루
    LoFi: "#D9F7E6",     // 파스텔 민트
  };

  const cassetteColor = genreColors[genre] || "#FFE8A3";

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`w-[260px] h-[140px] cursor-grab active:cursor-grabbing flex items-center justify-center select-none transition-all duration-200 ${isDragging ? "opacity-50 scale-95" : "hover:scale-105"}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* 감성 카세트 테이프 SVG */}
      <svg width="260" height="140" viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 본체 */}
        <rect x="20" y="25" width="220" height="90" rx="18" fill={cassetteColor} stroke="#B8A890" strokeWidth="3" />
        {/* 라벨 */}
        <rect x="55" y="50" width="150" height="40" rx="8" fill="#f5f5f5" />
        <text x="130" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#333" style={{fontFamily:'monospace'}}>{genre}</text>
        {/* 구멍/스풀 */}
        <circle cx="70" cy="100" r="20" fill="#444" stroke="#888" strokeWidth="3" />
        <circle cx="190" cy="100" r="20" fill="#444" stroke="#888" strokeWidth="3" />
        <circle cx="70" cy="100" r="7" fill="#bbb" />
        <circle cx="190" cy="100" r="7" fill="#bbb" />
        {/* 테이프 창 */}
        <rect x="110" y="97" width="40" height="16" rx="5" fill="#222" stroke="#666" strokeWidth="2" />
        {/* 나사 */}
        <circle cx="40" cy="50" r="4" fill="#888" />
        <circle cx="220" cy="50" r="4" fill="#888" />
        <circle cx="40" cy="115" r="4" fill="#888" />
        <circle cx="220" cy="115" r="4" fill="#888" />
      </svg>
    </div>
  );
}
