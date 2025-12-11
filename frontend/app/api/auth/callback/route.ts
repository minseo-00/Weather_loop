import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function parseCookies(cookieHeader: string | null) {
  const result: Record<string, string> = {}
  if (!cookieHeader) return result
  const parts = cookieHeader.split(';')
  for (const part of parts) {
    const [k, v] = part.split('=')
    if (!k) continue
    result[k.trim()] = v ? decodeURIComponent(v.trim()) : ''
  }
  return result
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieHeader = request.headers.get('cookie')
  const cookies = parseCookies(cookieHeader)
  const storedState = cookies['spotify_auth_state']

  if (!state || !storedState || state !== storedState) {
    const redirectTo = new URL('/', request.url)
    redirectTo.searchParams.set('error', 'state_mismatch')
    return NextResponse.redirect(redirectTo.toString())
  }

  if (!code) {
    const redirectTo = new URL('/', request.url)
    redirectTo.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(redirectTo.toString())
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse('Missing Spotify credentials', { status: 500 })
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + basicAuth
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: redirectUri
      })
    })

    const data = await tokenRes.json()

    if (!tokenRes.ok) {
      console.error('Spotify token exchange failed', data)
      const redirectTo = new URL('/', request.url)
      redirectTo.searchParams.set('error', 'invalid_token')
      return NextResponse.redirect(redirectTo.toString())
    }

    const res = NextResponse.redirect(new URL('/', request.url))
    if (data.access_token) {
      res.cookies.set('spotify_access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: data.expires_in ?? 3600
      })
    }
    if (data.refresh_token) {
      res.cookies.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      })
    }

    // remove temporary state cookie
    res.cookies.delete('spotify_auth_state')

    return res
  } catch (err) {
    // log and return descriptive error
    console.error('Error in /api/auth/callback:', err)
    return new NextResponse('Token exchange error', { status: 500 })
  }
}
