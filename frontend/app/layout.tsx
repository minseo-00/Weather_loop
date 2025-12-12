import "./globals.css";
import { PlayerProvider } from "@/widgets/player-bar/context/PlayerProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
