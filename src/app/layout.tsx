import "./globals.css";
import Navbar from "./components/navbar";
import Cursor from "./components/cursor";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
