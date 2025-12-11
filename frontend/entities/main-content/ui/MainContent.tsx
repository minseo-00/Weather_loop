"use client";

import { useState, useMemo } from "react";
import Cassette from "@/entities/cassette/ui";

const GENRES = ["Pop", "Jazz", "LoFi", "Rock", "HipHop", "Indie", "Ambient", "Electronic"];

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
    <main className="flex-1 bg-gradient-to-b from-black via-slate-950 to-black overflow-auto">
      {/* Cassette Grid Container */}
      <div className="p-8 h-full">
        <div className="w-full h-full flex flex-wrap content-start gap-8 lg:gap-12">
          {cassettes.map((genre, index) => (
            <Cassette key={index} id={`cassette-${index}`} genre={genre} rotation={rotations[index]} />
          ))}
        </div>
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
