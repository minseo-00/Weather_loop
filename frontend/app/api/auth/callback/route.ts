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
    const resp = NextResponse.redirect(redirectTo.toString())
    return resp
  }

  if (!code) {
    const redirectTo = new URL('/', request.url)
    redirectTo.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(redirectTo.toString())
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI
  console.log('DEBUG CALLBACK ENV:', { clientId, clientSecret: !!clientSecret, redirectUri })
  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse('Missing Spotify credentials', { status: 500 })
  }

  try {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    // debug: log incoming code/state for troubleshooting (safe to log)
    console.log('Spotify callback received code,state:', { code, state })

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

    // Debug logs: print token response so dev can inspect why access_token may be missing
    console.log('DEBUG spotify tokenResponse:', JSON.stringify(data))

    if (!tokenRes.ok) {
      console.error('Spotify token exchange failed', {
        status: tokenRes.status,
        statusText: tokenRes.statusText,
        body: data,
        clientIdPresent: !!clientId,
        redirectUri
      })
      const redirectTo = new URL('/', request.url)
      redirectTo.searchParams.set('error', 'invalid_token')
      return NextResponse.redirect(redirectTo.toString())
    }

    // prepare cookie actions to apply to the final response
    let finalRes: any
    const cookieActions: Array<() => void> = []

    if (data.access_token) {
      console.log('DEBUG will set spotify_access_token cookie, expires_in=', data.expires_in)
      cookieActions.push(() => finalRes.cookies.set('spotify_access_token', data.access_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: data.expires_in ?? 3600
      }))
    } else {
      console.log('DEBUG no access_token in token response')
    }

    if (data.refresh_token) {
      console.log('DEBUG will set spotify_refresh_token cookie')
      cookieActions.push(() => finalRes.cookies.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      }))
    } else {
      console.log('DEBUG no refresh_token in token response')
    }

    // No dev debug cookies in cleanup

    // remove temporary state cookie action
    cookieActions.push(() => finalRes.cookies.delete('spotify_auth_state'))

    // Build and return the final response, applying cookie actions to it so Set-Cookie headers are present
    // finalRes was declared above so closures can reference it safely
    if (process.env.NODE_ENV !== 'production') {
      finalRes = NextResponse.json({
        ok: true,
        tokenResponse: data,
        note: 'Dev mode - cookies have been set on this response (httpOnly tokens not visible to JS).'
      }, { status: 200 })
    } else {
      finalRes = NextResponse.redirect(new URL('/', request.url))
    }

    // apply cookie actions now that finalRes exists
    for (const action of cookieActions) action()

    return finalRes
  } catch (err) {
    // detailed server-side logging for debugging token exchange issues
    console.error('Unhandled error in /api/auth/callback', {
      error: err,
      requestUrl: request.url,
      clientIdPresent: !!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      redirectUriPresent: !!process.env.SPOTIFY_REDIRECT_URI
    })
    return new NextResponse('Token exchange error', { status: 500 })
  }
}
