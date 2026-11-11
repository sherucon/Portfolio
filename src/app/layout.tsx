import "./globals.css";
import Navbar from "./components/navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Cactus_Classical_Serif } from "next/font/google";

const cactus = Cactus_Classical_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cactus",
  display: "swap",
});

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
    <html lang="en" className={cactus.variable}>
      <body>
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
