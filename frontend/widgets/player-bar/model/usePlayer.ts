"use client";

import { useState } from "react";

export function usePlayer() {
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying((prev) => !prev);

  return { playing, toggle };
}
