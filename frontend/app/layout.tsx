import "./globals.css";
import { PlayerProvider } from "@/widgets/player-bar/context/PlayerProvider";
import WeatherEffects from "@/shared/ui/WeatherEffects";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WeatherEffects />
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
