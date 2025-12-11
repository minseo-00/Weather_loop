"use client";

import { useState, useMemo } from "react";
import Cassette from "@/entities/cassette/ui";

const GENRES = ["Pop", "Jazz", "Rock", "LoFi"];

export default function MainContent() {
  const [cassettes] = useState(GENRES);

  // Generate random rotations for scattered layout
  const rotations = useMemo(
    () =>
      cassettes.map(() => {
        return Math.random() * 6 - 3; // Random rotation between -3 and 3 degrees
      }),
    [cassettes]
  );

  return (
    <main
      className="flex-1 bg-[#f5ecd7] overflow-auto flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://www.transparenttextures.com/patterns/wood-pattern.png)',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Cassette 2x2 Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-16 py-16 w-full max-w-5xl place-items-center">
        {cassettes.map((genre, index) => (
          <Cassette key={index} id={`cassette-${index}`} genre={genre} rotation={rotations[index]} />
        ))}
      </div>

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
