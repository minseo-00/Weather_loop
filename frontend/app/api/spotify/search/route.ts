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

// 배열 랜덤 셈플 함수
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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

  // 여러 키워드로 검색 (쉼표로 구분)
  const keywordList = query.split(',').map(k => k.trim()).filter(Boolean)
  
  // 키워드 순서도 랜덤하게 셈플
  const shuffledKeywords = shuffleArray(keywordList)
  
  let allTracks: any[] = [];
  
  for (let i = 0; i < shuffledKeywords.length; i++) {
    const q = shuffledKeywords[i];
    // Spotify 검색 - offset을 랜덤하게 설정하여 다양한 결과 가져오기
    const randomOffset = Math.floor(Math.random() * 50); // 0~49 사이 랜덤
    const resp = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=30&offset=${randomOffset}&q=${encodeURIComponent(q)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    const data = await resp.json()
    if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
      allTracks = [...allTracks, ...data.tracks.items];
    }
  }
  
  // 중복 제거 (track id 기준)
  const uniqueTracks = allTracks.filter((track, index, self) =>
    index === self.findIndex((t) => t.id === track.id)
  );
  
  // 미리듣기 가능한 곡 우선
  const previewTracks = uniqueTracks.filter((track: any) => !!track.preview_url);
  const noPreviewTracks = uniqueTracks.filter((track: any) => !track.preview_url);
  
  // 결과 셔플 후 반환 (미리듣기 가능한 곡 우선, 그 뒤 불가능한 곡)
  const shuffledPreview = shuffleArray(previewTracks);
  const shuffledNoPreview = shuffleArray(noPreviewTracks);
  const finalTracks = [...shuffledPreview, ...shuffledNoPreview].slice(0, 30);
  
  // 캐시 비활성화 헤더 추가
  return NextResponse.json(finalTracks, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
