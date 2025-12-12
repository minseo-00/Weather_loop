import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie') || '';
    
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': cookie,
      },
    });

    const data = await res.json();
    
    const response = NextResponse.json(data, { status: res.status });
    
    // 쿠키 삭제
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout proxy error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
