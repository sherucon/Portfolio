"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import AnxietySection from "./components/AnxietySection";
import RiskLevels from "./components/RiskLevels";
import Marquee from "./components/Marquee";
import Ecosystem from "./components/Ecosystem";
import InstallFooter from "./components/InstallFooter";

export default function Home() {
  const [canScroll, setCanScroll] = useState(false);

  return (
    <main className={canScroll ? "" : "h-[100dvh] overflow-hidden"}>
      <Hero onShowcaseComplete={() => setCanScroll(true)} />
      <AnxietySection />
      <RiskLevels />
      <Marquee />
      <Ecosystem />
      <InstallFooter />
    </main>
  );
}
