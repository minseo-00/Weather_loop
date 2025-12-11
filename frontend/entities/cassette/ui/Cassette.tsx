"use client";

import { useState, useEffect } from "react";

interface CassetteProps {
  id: string;
  genre: string;
}

export default function Cassette({ id, genre }: CassetteProps) {
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
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        w-32 h-40 cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? "opacity-50 scale-95" : "hover:scale-105"}
      `}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Cassette Tape Box */}
      <div
        className={`
          w-full h-full rounded-lg overflow-hidden
          bg-gradient-to-b from-slate-900 to-slate-800
          border-2 border-white/20
          shadow-xl hover:shadow-2xl
          transition-all duration-300
          flex flex-col items-center justify-between p-4
          ${isDragging ? "shadow-cyan-500/50" : ""}
        `}
      >
        {/* Top Section - Spools */}
        <div className="flex gap-3 w-full justify-center">
          <div className="w-6 h-6 rounded-full bg-gray-700 border border-white/30" />
          <div className="w-6 h-6 rounded-full bg-gray-700 border border-white/30" />
        </div>

        {/* Middle Section - Tape */}
        <div className="w-full h-8 bg-gray-800 border border-white/20 rounded-sm flex items-center justify-center">
          <div className="w-24 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Bottom Section - Label */}
        <div className="w-full text-center">
          <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
            {genre}
          </p>
          <p className="text-[10px] text-white/50 mt-1">Cassette</p>
        </div>
      </div>
    </div>
  );
}
