"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // [필수 기능: 라우팅] 홈 접속 시 자동으로 /main으로 리다이렉트
    router.replace("/main");
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-gray-700">
      {/* [필수 기능: UI/UX] 로딩 상태 메시지 표시 */}
      Redirecting to main...
    </div>
  );
}
