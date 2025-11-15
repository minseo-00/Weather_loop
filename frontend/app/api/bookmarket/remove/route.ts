import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { music_id } = await req.json();

  console.log("삭제 요청 들어옴 =>", music_id);

  // 여기서 나중에 DB 연동하면 됨
  return NextResponse.json({ ok: true });
}
