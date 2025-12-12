import "./globals.css";
<<<<<<< HEAD
import { WeatherProvider } from "@/shared/context/WeatherContext";

=======
import { PlayerProvider } from "@/widgets/player-bar/context/PlayerProvider";
>>>>>>> 93280b557983173712d8f4cbcc9c33bc0f1ae09a

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
<<<<<<< HEAD
        <WeatherProvider>
          {children}
        </WeatherProvider>
=======
        <PlayerProvider>{children}</PlayerProvider>
>>>>>>> 93280b557983173712d8f4cbcc9c33bc0f1ae09a
      </body>
    </html>
  );
}
