// /shared/api/spotifySearch.api.ts
// Spotify 트랙 검색 API 래퍼 (프론트엔드에서 fetch)

import axios from "axios";
// accessToken 필요 없음, 프록시로 요청
export async function searchSpotifyTracks(query: string) {
  const res = await axios.get(`/api/spotify/search`, {
    params: { query },
    withCredentials: true
  });
  return res.data;
}
