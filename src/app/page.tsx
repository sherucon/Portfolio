"use client";

import { useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import Hero from "./components/Hero";
import AnxietySection from "./components/AnxietySection";
import RiskLevels from "./components/RiskLevels";
import Marquee from "./components/Marquee";
import Ecosystem from "./components/Ecosystem";
import InstallFooter from "./components/InstallFooter";

export default function Home() {
  const [canScroll, setCanScroll] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!canScroll) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      lenis?.start();
      lenis?.resize();
    }
    
    // Trigger a window resize event to force layout recalculations
    window.dispatchEvent(new Event("resize"));
    
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, [canScroll, lenis]);

  return (
    <main
      className={canScroll ? "relative" : "h-[100dvh] overflow-hidden relative"}
    >
      {/* Hero Section doesn't need extra scroll padding since it already has showcase logic */}
      <div className="relative z-10 bg-[#161618]">
        <Hero onShowcaseComplete={() => setCanScroll(true)} />
      </div>

      <div className="md:h-[250vh] relative z-20 bg-[#111]">
        <div className="md:sticky md:top-0 md:h-[100dvh] overflow-hidden">
          <AnxietySection />
        </div>
      </div>

      <div className="md:h-[250vh] relative z-30 bg-[#f4f4f4]">
        <div className="md:sticky md:top-0 md:h-[100dvh] overflow-hidden">
          <RiskLevels />
        </div>
      </div>

      <div className="relative z-40">
        <Marquee />
      </div>

      <div className="md:h-[150vh] relative z-50 bg-[#f4f4f4]">
        <div className="md:sticky md:top-0 md:h-[100dvh] overflow-hidden">
          <Ecosystem />
        </div>
      </div>

      <div className="relative z-60">
        <InstallFooter />
      </div>
    </main>
  );
}
