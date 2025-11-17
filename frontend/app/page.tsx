// /app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 홈 접속 시 자동으로 /main으로 리다이렉트
    router.replace("/main");
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-gray-700">
      Redirecting to main...
    </div>
  );
}
