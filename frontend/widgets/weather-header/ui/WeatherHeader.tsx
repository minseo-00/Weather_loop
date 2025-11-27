"use client";

import { useWeather } from "../model/useWeather";
import Image from "next/image";

export default function WeatherHeader() {
  const { time, temp, icon } = useWeather();

  return (
    <header className="fixed top-0 left-0 w-full flex justify-center py-3 backdrop-blur-xl bg-black/20 z-50">
      <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-4 py-1">

        <span className="text-xs text-white bg-black/20 px-2 py-1 rounded-full">
          {time}
        </span>

        <span className="text-sm font-semibold text-white bg-black/20 px-3 py-1 rounded-full">
          Weather Loop
        </span>

        <span className="text-xs text-white flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full">
          {icon} {temp}°C
        </span>

        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/50">
          <Image src="/images/profile.jpg" alt="프로필" width={40} height={40} />
        </div>

      </div>
    </header>
  );
}
