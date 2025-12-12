"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/widgets/player-bar/context/PlayerProvider";

type Playlist = {
  id: string;
  name: string;
  images: { url: string }[];
  description?: string;
};

export default function PlaylistGrid() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<any[] | null>(null);
  const [openPlaylist, setOpenPlaylist] = useState<Playlist | null>(null);
  const { playTrack } = usePlayer();

  useEffect(() => {
    let mounted = true;
    async function fetchPlaylists() {
      try {
        const res = await fetch('/api/spotify/playlists', { credentials: 'include' });
        if (!res.ok) {
          setPlaylists([]);
          setLoading(false);
          return;
        }
        const json = await res.json();
        // Spotify returns items array
        const items = json.items || [];
        if (mounted) setPlaylists(items);
      } catch (e) {
        console.error('Failed to load playlists', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPlaylists();
    return () => { mounted = false };
  }, []);

  if (loading) return <div className="w-full flex justify-center py-8">로딩 중...</div>

  if (!playlists.length) return <div className="w-full flex justify-center py-8">플레이리스트가 없습니다.</div>

  return (
    <div className="w-full flex flex-col items-center mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
        {playlists.map((p) => (
          <div key={p.id} className="flex flex-col items-center bg-white rounded-xl p-3 shadow-md cursor-pointer" onClick={async () => {
            setOpenPlaylist(p);
            // fetch tracks
            try {
              const res = await fetch(`/api/spotify/playlists/${p.id}/tracks`, { credentials: 'include' });
              if (!res.ok) return setTracks([]);
              const json = await res.json();
              setTracks(json.items || []);
            } catch (e) {
              console.error(e);
              setTracks([]);
            }
          }}>
            <div className="w-40 h-40 bg-gray-100 rounded-md overflow-hidden mb-3 flex items-center justify-center">
              {p.images && p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm text-gray-500">No image</div>
              )}
            </div>
            <div className="text-sm font-semibold text-center">{p.name}</div>
          </div>
        ))}
      </div>
      {/* Tracks modal / panel */}
      {openPlaylist && (
        <div className="fixed top-20 right-6 w-96 max-h-[70vh] overflow-auto bg-white rounded-lg shadow-xl p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{openPlaylist.name}</h3>
            <button className="text-sm text-gray-600" onClick={() => { setOpenPlaylist(null); setTracks(null); }}>닫기</button>
          </div>
          {tracks === null ? (
            <div>로딩...</div>
          ) : tracks.length === 0 ? (
            <div>트랙 없음</div>
          ) : (
            <ul>
              {tracks.map((it: any, idx: number) => {
                const tr = it.track;
                const artist = tr.artists && tr.artists[0] ? tr.artists[0].name : '';
                return (
                  <li key={idx} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <div className="text-sm font-medium">{tr.name}</div>
                      <div className="text-xs text-gray-500">{artist}</div>
                    </div>
                    <div>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => playTrack({
                        id: tr.id,
                        title: tr.name,
                        artist,
                        preview_url: tr.preview_url,
                        albumImage: tr.album?.images?.[0]?.url
                      })}>
                        ▶ 재생
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


