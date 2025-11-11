import { NextResponse } from "next/server";

export async function GET() {
  // 🔥 임시 데이터 (백엔드 생기기 전까지)
  const bookmarket = [
    {
      bookmarket_id: "1",
      music_id: 11,
      title: "Golden",
      artist: "Jungkook",
      img: "/images/golden.png",
    },
    {
      bookmarket_id: "2",
      music_id: 12,
      title: "Seven",
      artist: "Jungkook",
      img: "/images/seven.png",
    },
  ];

  return NextResponse.json({ ok: true, bookmarket });
}
