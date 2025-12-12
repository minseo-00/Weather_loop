import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie') || '';
    
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookie,
      },
    });

    const data = await res.json();
    
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Auth me proxy error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
