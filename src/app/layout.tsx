import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zoop",
  description: "Connect instantly with Zoop.",
};

import SmoothScrolling from "@/components/SmoothScrolling";
import ScrollProgress from "@/components/ScrollProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScrollProgress />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
