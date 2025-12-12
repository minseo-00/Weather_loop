"use client";

import { useRouter } from "next/navigation";

interface HomeButtonProps {
  className?: string;
}

export default function HomeButton({ className = "" }: HomeButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/main")}
      className={`
        fixed top-6 left-6 z-50
        w-10 h-10 flex items-center justify-center
        bg-white/80 hover:bg-white
        rounded-full shadow-md hover:shadow-lg
        text-xl text-gray-700 hover:text-blue-600
        transition-all duration-200
        backdrop-blur-sm
        ${className}
      `}
      aria-label="홈으로 이동"
      title="메인 페이지로 이동"
    >
      🏠
    </button>
  );
}
