"use client";

import { useState } from "react";

export default function Sidebar() {
  const [draggedOver, setDraggedOver] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    const cassetteName = e.dataTransfer.getData("cassette-name");
    setSelectedAlbum(cassetteName);
  };

  return (
    <aside className="w-72 bg-black border-r border-white/10 flex flex-col overflow-hidden">
      {/* Album Area - Center */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Album Frame */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            w-56 h-56 rounded-lg flex flex-col items-center justify-center
            transition-all duration-300 cursor-grab
            ${
              draggedOver
                ? "border-2 border-cyan-500 shadow-lg shadow-cyan-500/50 bg-cyan-500/5"
                : "border-2 border-white/20 bg-white/5 hover:border-white/30"
            }
          `}
        >
          {selectedAlbum ? (
            <>
              {/* Album Cover Placeholder */}
              <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-semibold">
                  {selectedAlbum}
                </span>
              </div>
              {/* Recommended Songs */}
              <div className="w-full px-4 mt-2">
                <p className="text-xs font-semibold text-white/70 mb-2">
                  Recommended Songs
                </p>
                <ul className="text-xs text-white/50 space-y-1">
                  <li>• Song One</li>
                  <li>• Song Two</li>
                  <li>• Song Three</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4 opacity-50">♫</div>
              <p className="text-sm font-semibold text-white mb-2">
                Music Album
              </p>
              <p className="text-xs text-white/50 text-center">
                Drag cassette here
                <br />
                to change music
              </p>
            </>
          )}
        </div>
      </div>

      {/* Controls - Bottom */}
      <div className="flex items-center justify-center gap-4 px-6 pb-8">
        {/* Previous Button */}
        <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group">
          <svg
            className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next Button */}
        <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group">
          <svg
            className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
