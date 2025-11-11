// src/shared/api/track.api.ts
export const getFavorites = async (): Promise<any> => {
  const res = await fetch("/api/bookmarket/list");
  return res.json();
};

export const removeFavorite = async (music_id: number): Promise<any> => {
  const res = await fetch("/api/bookmarket/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ music_id }),
  });
  return res.json();
};
