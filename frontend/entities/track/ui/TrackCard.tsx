// src/entities/track/ui/TrackCard.tsx
import React from "react";

export interface Track {
  bookmarket_id: string;
  music_id: number;
  title: string;
  artist: string;
  img: string;
}

interface TrackCardProps {
  track: Track;
  onRemove?: (music_id: number) => void;
}

export default function TrackCard({ track, onRemove }: TrackCardProps) {
  return (
    <div className="w-72 h-72 relative rounded-[20px] border border-stone-300 overflow-hidden">
      <img src={track.img} className="w-full h-3/4 object-cover" />
      <div className="p-2">
        <div className="text-lg font-bold">{track.title}</div>
        <div className="text-sm">{track.artist}</div>
      </div>
      {onRemove && (
        <button
          className="absolute top-2 right-2 text-red-500 text-2xl"
          onClick={() => onRemove(track.music_id)}
        >
          ♥
        </button>
      )}
    </div>
  );
}
