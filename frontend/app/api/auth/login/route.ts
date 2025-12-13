import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const SCOPES = [
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read'
].join(' ')

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    console.error('환경변수에서 SPOTIFY_REDIRECT_URI를 찾을 수 없습니다.');
    return new NextResponse('Missing Spotify client id / redirect uri', { status: 500 });
  }
  // 환경변수 값 로그로 출력
  console.log('DEBUG ENV redirectUri:', redirectUri);

  const state = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
    show_dialog: 'true',
    state
  })
  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
  console.log('DEBUG AUTH URL:', authUrl)
  const res = NextResponse.redirect(authUrl)
  res.cookies.set('spotify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 300
  })
  return res
}
