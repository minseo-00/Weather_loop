import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const SCOPES = [
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  // Needed for Web Playback SDK full-track playback and control
  'streaming',
  'user-modify-playback-state',
  'user-read-playback-state'
].join(' ')

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return new NextResponse('Missing Spotify client id / redirect uri', { status: 500 })
  }

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

  const res = NextResponse.redirect(authUrl)
  res.cookies.set('spotify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // In dev, use 'lax' so the state cookie is sent on the top-level redirect back from Spotify.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 300
  })

  return res
}
