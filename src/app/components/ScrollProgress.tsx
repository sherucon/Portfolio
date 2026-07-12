"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";

export default function ScrollProgress({ isVisible = true }: { isVisible?: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useLenis(({ progress }) => {
    if (barRef.current) {
      barRef.current.style.width = `${progress * 100}%`;
    }
  });

  return (
    <div className={`fixed top-0 left-0 w-full h-1.5 z-[99999] pointer-events-none bg-transparent transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        ref={barRef}
        className="h-full w-0 bg-[linear-gradient(to_right,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)]"
      />
    </div>
  );
}
