"use client";

import "tailwindcss";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(true);
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React doesn't serialize the `muted` attr to the DOM — set it imperatively
    // so iOS/iPadOS Safari allows autoplay
    video.muted = true;
    video.play().catch(() => {
      // Autoplay was blocked — switch blend mode to normal so text is still readable
      setVideoPlaying(false);
    });
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://r2.sherucon.tech/homebg.mp4" />

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

      {/* Container for blending context */}
      <div className="fixed inset-0 h-dvh">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="https://r2.sherucon.tech/homebg.mp4" type="video/mp4" />
          Cool background video that your browser blocked 💔
        </video>
        {/* <Sea /> */}

        {/* Text content */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl w-full">
            {/* Left Column - First on mobile, left on desktop */}
            <div className="text-left lg:order-1 order-1">
              <h1
                className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica"
                style={{
                  color: videoPlaying ? undefined : "black",
                  mixBlendMode: videoPlaying ? "difference" : "normal",
                  transform: videoPlaying ? "translateZ(0)" : undefined,
                }}
              >
                HELLO
                <img
                  src="https://r2.sherucon.tech/hellodecor.svg"
                  alt="helloDecor"
                  className="inline-block w-auto mx-1 h-6.5 sm:h-9 md:h-11 lg:h-13.5 align-baseline"
                  style={{
                    mixBlendMode: videoPlaying ? "difference" : "normal",
                    filter: "brightness(0) invert(1)",
                    transform: videoPlaying ? "translateZ(0)" : undefined,
                  }}
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
              <h1
                className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight helvetica"
                style={{
                  mixBlendMode: videoPlaying ? "difference" : "normal",
                  color: videoPlaying ? undefined : "black",
                  transform: videoPlaying ? "translateZ(0)" : undefined,
                }}
              >
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
