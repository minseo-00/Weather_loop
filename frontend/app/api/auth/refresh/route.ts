import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function parseCookies(cookieHeader: string | null) {
  const result: Record<string, string> = {}
  if (!cookieHeader) return result
  const parts = cookieHeader.split(';')
  for (const part of parts) {
    const [k, ...v] = part.split('=')
    if (!k) continue
    result[k.trim()] = v.length ? decodeURIComponent(v.join('=').trim()) : ''
  }
  return result
}

export async function GET(request: Request) {
  try {
    const cookies = parseCookies(request.headers.get('cookie'))
    const refreshToken = cookies['spotify_refresh_token']
    if (!refreshToken) return NextResponse.json({ error: 'no_refresh_token' }, { status: 401 })

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    if (!clientId || !clientSecret) return NextResponse.json({ error: 'missing_client_credentials' }, { status: 500 })

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + basicAuth
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    const data = await tokenRes.json()
    if (!tokenRes.ok) {
      console.error('Spotify refresh failed', data)
      return NextResponse.json(data, { status: tokenRes.status })
    }

    const res = NextResponse.json({ ok: true })
    if (data.access_token) {
      res.cookies.set('spotify_access_token', data.access_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: data.expires_in ?? 3600
      })
    }
    if (data.refresh_token) {
      res.cookies.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      })
    }

    return res
  } catch (err) {
    console.error('Error in /api/auth/refresh:', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
