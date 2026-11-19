"use client";

import { useEffect, useRef } from "react";

const VIDEO_URL = "https://portfolio.sherucon.me/losill-60fps.webm";
const POSTER_URL = "/losill-poster.webp";

export default function LosIll() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sync = () => {
      if (inViewRef.current && document.visibilityState === "visible") {
        if (!video.src) video.src = VIDEO_URL;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        sync();
      },
      { rootMargin: "300px" },
    );

    observer.observe(video);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, []);

  return (
    <div className="w-full h-full" style={{ background: "#ffffff" }}>
      <video
        ref={videoRef}
        poster={POSTER_URL}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
