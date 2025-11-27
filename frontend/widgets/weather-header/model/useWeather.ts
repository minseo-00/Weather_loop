
"use client";

import { useEffect, useState } from "react";

type HeaderState = {
  time: string;
  temp: number;
  icon: string;
};

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}


export function useWeather(): HeaderState {
  const [state, setState] = useState<HeaderState>({
    time: formatTime(new Date()),
    temp: 17,
    icon: "🌧️",
  });

  useEffect(() => {
    const update = () => {
      setState((prev) => ({
        ...prev,
        time: formatTime(new Date()),
      }));
    };

    update(); 

    const id = setInterval(update, 60000); 
    return () => clearInterval(id);
  }, []);

  return state;
}
