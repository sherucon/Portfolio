"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined" && !("ScrollTrigger" in window)) {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3, // Add a tiny bit of scrub smoothing
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 bg-[#ebe5d9]/10 z-[9999] pointer-events-none">
      <div
        id="scroll-progress-bar"
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-[#ebe5d9] shadow-[0_0_10px_rgba(235,229,217,0.5)]"
      />
    </div>
  );
}
