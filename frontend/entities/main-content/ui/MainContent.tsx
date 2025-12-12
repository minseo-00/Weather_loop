"use client";

import { useMemo } from "react";
import Cassette from "@/entities/cassette/ui/Cassette";

const GENRES = ["LoFi", "Pop", "Rock", "Jazz"] as const;

interface MainContentProps {
  onCassetteSelect?: (genre: string) => void;
}

export default function MainContent({ onCassetteSelect }: MainContentProps) {
  const cassettes = useMemo(() => GENRES, []);

  return (
    <main className="flex-1 overflow-auto flex justify-center">
      <div className="grid grid-cols-2 grid-rows-2 gap-10 pt-8 pb-12">
        {cassettes.map((genre, idx) => (
          <Cassette
            key={idx}
            id={`cassette-${idx}`}
            genre={genre}
            rotation={0}
            onSelect={onCassetteSelect}
          />
        ))}
      </div>
    </main>
  );
}
