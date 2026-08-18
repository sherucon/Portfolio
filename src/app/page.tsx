"use client";

import { useEffect, useState } from "react";
import JunieParticleGrid from "./components/particle-grid";

export default function Page() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 2;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => setShowLoader(false), 700);
        }, 400);
      }
      setLoadProgress(currentProgress);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <meta
        name="google-site-verification"
        content="s-kj96OSaf-EJMhs8h-9gkfNVek6xQMXphSptcryuF0"
      />

      {showLoader && (
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-16 h-16 sm:w-24 sm:h-24 animate-[spin_4s_linear_infinite] text-[#FF0000]"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path
              d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - loadProgress}
              fill="currentColor"
              fillOpacity={loadProgress === 100 ? 1 : 0}
              className="transition-all duration-100 ease-out"
            />
          </svg>

          <div className="absolute bottom-0 right-4 sm:right-8 text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] font-bold text-[#FF0000] helvetica leading-none tracking-tighter">
            {loadProgress}%
          </div>
        </div>
      )}

      {/* Main Home Container */}
      <div className="fixed inset-0 h-dvh bg-white overflow-hidden select-none">
        {/* JetBrains Junie Particle Grid Background */}
        <JunieParticleGrid className="z-0" />

        {/* Text content overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl w-full pointer-events-auto">
            {/* Left Column - First on mobile, left on desktop */}
            <div className="text-left lg:order-1 order-1">
              <h1 className="text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica">
                HELLO
                <img
                  src="https://portfolio.sherucon.me/hellodecor.svg"
                  alt="helloDecor"
                  className="inline-block w-auto mx-1 h-6.5 sm:h-9 md:h-11 lg:h-13.5 align-baseline"
                />
                &nbsp;&nbsp;&nbsp;<span> I&apos;M</span>
                <br />
                CREATIVE
                <br />
                TECHNOLOGIST
              </h1>
            </div>

            {/* Right Column - Second on mobile, right on desktop */}
            <div className="text-right lg:text-right lg:order-2 order-2">
              <h1 className="text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica">
                <span className="hidden lg:inline">
                  <br />
                </span>
                SHREYANSH
                <br />
                SINGH
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
