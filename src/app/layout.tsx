import type { Metadata } from "next";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
export const metadata: Metadata = {
  title: "paraNOyar",
  description:
    "paraNOyar is an informed consent interceptor designed to keep you safe from runaway AI coding agents. Users are instantly presented with the risks of any proposed command without the friction of blindly trusting opaque terminal scripts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistPixelSquare.className} antialiased`}>
      <body className="flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
