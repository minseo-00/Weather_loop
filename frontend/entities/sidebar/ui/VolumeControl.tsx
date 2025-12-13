import React, { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    spotifyPlayer?: {
      setVolume: (volume: number) => void;
    };
    audioEl?: {
      volume: number;
    };
  }
}

interface VolumeControlProps {
  // 추후 필요시 props로 player 객체 등 받을 수 있음
}

// Spotify Web Playback SDK 또는 HTMLAudioElement와 연동하려면 setVolume 함수 필요
// 이 예시에서는 window.spotifyPlayer?.setVolume 사용, 없으면 콘솔만

const VolumeControl: React.FC<VolumeControlProps> = () => {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(70); // 0~100
  const sliderRef = useRef<HTMLDivElement>(null);

  // 실제 볼륨 연동 (Spotify SDK, HTMLAudioElement 등)
  useEffect(() => {
    // 볼륨 변경 로그
    console.log("볼륨 변경:", volume);
    if (window.spotifyPlayer && typeof window.spotifyPlayer.setVolume === "function") {
      window.spotifyPlayer.setVolume(volume / 100);
    } else if (window.audioEl && typeof window.audioEl.volume !== "undefined") {
      window.audioEl.volume = volume / 100;
    }
  }, [volume]);

  // 외부 클릭 시 슬라이더 닫힘
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative flex items-center justify-center">
      {/* 볼륨 아이콘 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-red-500 hover:bg-white/10 transition-all focus:outline-none"
        title="볼륨 조절"
      >
        {/* 볼륨 아이콘 (음소거/중간/최대) */}
        {volume === 0 ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 8.82v6.36M19 5l-7 7m0 0l7 7" stroke="#ef4444" strokeWidth="2"/>
            <path d="M5 9v6h4l5 5V4l-5 5H5z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        ) : volume < 40 ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 9v6h4l5 5V4l-5 5H5z" stroke="currentColor" strokeWidth="2"/>
            <path d="M15 9.34v5.32" stroke="#ef4444" strokeWidth="2"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 9v6h4l5 5V4l-5 5H5z" stroke="currentColor" strokeWidth="2"/>
            <path d="M15 8v8M19 5v14" stroke="#ef4444" strokeWidth="2"/>
          </svg>
        )}
      </button>
      {/* 볼륨 슬라이더 (세로형, popover) */}
      {open && (
        <div
          ref={sliderRef}
          className="absolute bottom-12 right-1 z-50 flex flex-col items-center bg-[#18181b] border border-white/10 rounded-xl shadow-lg px-3 py-4"
          style={{ minHeight: 100 }}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={100 - volume}
            onChange={e => {
              const v = 100 - Number(e.target.value);
              console.log('슬라이더 onChange:', v);
              setVolume(v);
            }}
            className="h-28 w-3 rounded-full appearance-none custom-volume-slider"
            style={{ writingMode: "vertical-lr", WebkitAppearance: "slider-vertical", accentColor: 'unset' }}
            tabIndex={0}
            autoComplete="off"
          />
          <span className="mt-2 text-xs text-red-500 font-bold">{volume}</span>
          <style>{`
            .custom-volume-slider {
              accent-color: unset !important;
              background: transparent !important;
            }
            .custom-volume-slider::-webkit-slider-thumb {
              -webkit-appearance: none !important;
              appearance: none !important;
              background-color: transparent !important;
              background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><circle cx="9" cy="9" r="8" fill="%23ef4444" stroke="white" stroke-width="2"/></svg>') center/contain no-repeat !important;
              border: none !important;
              border-radius: 50% !important;
              width: 18px !important;
              height: 18px !important;
              box-shadow: 0 0 0 2px #18181b !important;
              outline: none !important;
              filter: none !important;
              mix-blend-mode: normal !important;
              margin: 0 auto !important;
              position: relative !important;
              left: 50%;
              transform: translateX(-50%);
              background-clip: padding-box !important;
              z-index: 2;
            }
            .custom-volume-slider:focus::-webkit-slider-thumb {
              outline: none !important;
              box-shadow: 0 0 0 2px #ef4444 !important;
            }
            .custom-volume-slider::-moz-range-thumb {
              background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><circle cx="9" cy="9" r="8" fill="%23ef4444" stroke="white" stroke-width="2"/></svg>') center/contain no-repeat !important;
              border: none !important;
              border-radius: 50% !important;
              width: 18px !important;
              height: 18px !important;
              box-shadow: 0 0 0 2px #18181b !important;
              outline: none !important;
              filter: none !important;
              mix-blend-mode: normal !important;
              margin: 0 auto !important;
              position: relative !important;
              left: 50%;
              transform: translateX(-50%);
              background-clip: padding-box !important;
              z-index: 2;
            }
            .custom-volume-slider:focus::-moz-range-thumb {
              outline: none !important;
              box-shadow: 0 0 0 2px #ef4444 !important;
            }
            .custom-volume-slider::-ms-thumb {
              background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><circle cx="9" cy="9" r="8" fill="%23ef4444" stroke="white" stroke-width="2"/></svg>') center/contain no-repeat !important;
              border: none !important;
              border-radius: 50% !important;
              width: 18px !important;
              height: 18px !important;
              box-shadow: 0 0 0 2px #18181b !important;
              outline: none !important;
              filter: none !important;
              mix-blend-mode: normal !important;
              margin: 0 auto !important;
              position: relative !important;
              left: 50%;
              transform: translateX(-50%);
              background-clip: padding-box !important;
              z-index: 2;
            }
            .custom-volume-slider:focus::-ms-thumb {
              outline: none !important;
              box-shadow: 0 0 0 2px #ef4444 !important;
            }
            .custom-volume-slider::-webkit-slider-runnable-track {
              background: linear-gradient(to top, #ef4444 ${(volume)}%, #fff ${(volume)}%);
              border-radius: 8px;
              width: 12px;
              height: 100%;
              margin-left: auto;
              margin-right: auto;
            }
            .custom-volume-slider::-moz-range-track {
              background: linear-gradient(to top, #ef4444 ${(volume)}%, #fff ${(volume)}%);
              border-radius: 8px;
              width: 12px;
              height: 100%;
              margin-left: auto;
              margin-right: auto;
            }
            .custom-volume-slider::-ms-fill-lower {
              background: #ef4444;
              border-radius: 8px;
            }
            .custom-volume-slider::-ms-fill-upper {
              background: #fff;
              border-radius: 8px;
            }
            .custom-volume-slider:focus {
              outline: none !important;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default VolumeControl;