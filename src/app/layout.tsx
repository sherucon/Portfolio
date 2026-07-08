import "./globals.css";
import Navbar from "./components/navbar";
import Cursor from "./components/cursor";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shreyansh Singh",
  description:
    "Portfolio of Shreyansh Singh, a software engineer and designer crafting delightful digital experiences.",
  keywords: [
    "Shreyansh Singh",
    "Software Engineer",
    "Designer",
    "Portfolio",
    "Web Developer",
  ],
  openGraph: {
    title: "Shreyansh Singh",
    description:
      "Portfolio of Shreyansh Singh, a software engineer and designer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Cursor />
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
