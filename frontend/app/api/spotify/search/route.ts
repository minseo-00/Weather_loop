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
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const cookieHeader = request.headers.get('cookie')
  const cookies = parseCookies(cookieHeader)
  const accessToken = cookies['spotify_access_token']

  if (!accessToken) {
    return NextResponse.json({ error: 'no_access_token' }, { status: 401 })
  }

  // 여러 키워드로 순차 검색
  const keywordList = query.split(',').map(k => k.trim()).filter(Boolean)
  let allTracks: any[] = [];
  for (let i = 0; i < keywordList.length; i++) {
    const q = keywordList[i];
    const resp = await fetch(`https://api.spotify.com/v1/search?type=track&limit=50&q=${encodeURIComponent(q)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    const data = await resp.json()
    if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
      allTracks = data.tracks.items;
      // 미리듣기 곡이 있으면 바로 반환
      const previewTracks = allTracks.filter((track: any) => !!track.preview_url)
      if (previewTracks.length > 0) {
        return NextResponse.json(previewTracks, { status: resp.status })
      }
      // 없으면 일단 곡 전체 저장(마지막에 미리듣기 없는 곡도 보여주기 위함)
    }
  }
  // 모든 키워드에 대해 미리듣기 곡이 없으면, 첫 번째 키워드의 전체 곡(미리듣기 없는 곡 포함) 반환
  return NextResponse.json(allTracks, { status: 200 })
}
