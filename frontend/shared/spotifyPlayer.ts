// /shared/spotifyPlayer.ts
// Spotify Web Playback SDK 로더 및 플레이어 초기화 유틸

declare global {
  interface Window {
    Spotify?: any;
  }
}

export function loadSpotifySDK(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Spotify) return resolve();
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  });
}

export function createSpotifyPlayer(token: string, onReady: (deviceId: string) => void) {
  // window.Spotify.Player는 SDK가 로드된 후에만 사용 가능
  const player = new window.Spotify.Player({
    name: "WeatherLoop Web Player",
    getOAuthToken: (cb: (token: string) => void) => { cb(token); },
    volume: 0.7
  });
  player.addListener('ready', ({ device_id }: { device_id: string }) => {
    onReady(device_id);
  });
  player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
    console.log('Device ID has gone offline', device_id);
  });
  player.addListener('initialization_error', ({ message }: { message: string }) => {
    console.error('Spotify Player init error', message);
  });
  player.addListener('authentication_error', ({ message }: { message: string }) => {
    console.error('Spotify Player auth error', message);
  });
  player.addListener('account_error', ({ message }: { message: string }) => {
    console.error('Spotify Player account error', message);
  });
  player.connect();
  return player;
}
