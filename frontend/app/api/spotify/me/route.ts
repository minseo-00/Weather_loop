import { NextResponse } from 'next/server'

function parseCookies(cookieHeader: string | null) {
  const result: Record<string, string> = {}
  if (!cookieHeader) return result
  const parts = cookieHeader.split(';')
  for (const part of parts) {
    const [k, ...rest] = part.split('=')
    if (!k) continue
    result[k.trim()] = rest.join('=').trim()
  }
  return result
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie')
  const cookies = parseCookies(cookieHeader)
  const accessToken = cookies['spotify_access_token']

  if (!accessToken) {
    return NextResponse.json({ error: 'no_access_token' }, { status: 401 })
  }

  const resp = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const data = await resp.json()
  return NextResponse.json(data, { status: resp.status })
}
