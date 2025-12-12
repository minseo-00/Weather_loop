import "./globals.css";
import { WeatherProvider } from "@/shared/context/WeatherContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WeatherProvider>
          {children}
        </WeatherProvider>
      </body>
    </html>
  );
}
