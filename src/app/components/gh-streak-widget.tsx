"use client";

import { useEffect, useRef, useState } from "react";
import GithubIcon from "./github-icon";

interface StreakColors {
  ring: string;
  ringAlt: string;
  flameOuter: string;
  flameInner: string;
  glow: string;
}

interface Props {
  streak: number;
  username: string;
  colors: StreakColors;
}

const CX = 50,
  CY = 50,
  R = 40;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function GhStreakWidget({ streak, username, colors: c }: Props) {
  const circleRef = useRef<SVGCircleElement>(null);
  const [flameVisible, setFlameVisible] = useState(false);

  useEffect(() => {
    // Reset to empty
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.strokeDashoffset = String(CIRCUMFERENCE);

    // Kick off fill animation after a short delay so the reset registers
    const startTimer = setTimeout(() => {
      el.style.transition =
        "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.strokeDashoffset = "0";
    }, 120);

    // Show flame when ring finishes
    const flameTimer = setTimeout(() => setFlameVisible(true), 120 + 1650);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(flameTimer);
    };
  }, [streak]);

  return (
    <div
      className="relative w-full h-full rounded-3xl flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "#0a1628" }}
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 55% at 50% 58%, ${c.glow} 0%, transparent 70%)`,
        }}
      />

      {/* GitHub icon — top right */}
      <div className="absolute top-3 right-3 text-[#f0f6fc]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          viewBox="0 0 100 100"
          width="64"
          height="64"
        >
          {/* Outer box from your SVG */}
          <path
            d="M63.6 5c9 0 13.6 0 18.4 1.5 5.3 1.9 9.5 6.1 11.4 11.4C95 22.8 95 27.3 95 36.4v27.2c0 9 0 13.6-1.5 18.4-1.9 5.3-6.1 9.5-11.4 11.4C77.2 95 72.7 95 63.6 95H36.4c-9 0-13.6 0-18.4-1.5-5.3-2-9.5-6.2-11.5-11.5C5 77.2 5 72.7 5 63.6V36.4c0-9 0-13.6 1.5-18.4 2-5.3 6.2-9.5 11.5-11.5C22.8 5 27.3 5 36.4 5h27.2z"
            fill="#fff"
          />

          {/* GitHub mark */}
          <g transform="translate(50 50) scale(1.3) translate(-50 -50)">
            <path
              fill="#181717"
              d="M50 22c-15.46 0-28 12.54-28 28 0 12.37 8.02 22.87 19.15 26.57 1.4.26 1.91-.61 1.91-1.35 0-.67-.03-2.88-.04-5.22-7.79 1.69-9.43-3.31-9.43-3.31-1.27-3.23-3.1-4.09-3.1-4.09-2.54-1.74.19-1.7.19-1.7 2.81.2 4.29 2.89 4.29 2.89 2.5 4.29 6.57 3.05 8.17 2.33.25-1.81.98-3.05 1.78-3.75-6.22-.71-12.76-3.11-12.76-13.84 0-3.06 1.09-5.56 2.88-7.52-.29-.71-1.25-3.57.27-7.44 0 0 2.35-.75 7.7 2.87A26.6 26.6 0 0 1 50 35.1c2.38.01 4.78.32 7.02.95 5.35-3.62 7.69-2.87 7.69-2.87 1.53 3.87.57 6.73.28 7.44 1.79 1.96 2.87 4.46 2.87 7.52 0 10.76-6.55 13.12-12.79 13.82 1.01.87 1.91 2.58 1.91 5.21 0 3.76-.03 6.79-.03 7.72 0 .75.5 1.63 1.92 1.35C69.99 72.86 78 62.36 78 50c0-15.46-12.54-28-28-28z"
            />
          </g>
        </svg>
      </div>

      {/* Ring + centre content */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: "62%", aspectRatio: "1" }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c.ringAlt} />
              <stop offset="100%" stopColor={c.ring} />
            </linearGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#1e2d45"
            strokeWidth="8"
          />

          {/* Animated fill ring */}
          <circle
            ref={circleRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            filter="url(#ringGlow)"
          />
        </svg>

        {/* Centre: streak number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="leading-none text-white"
            style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)" }}
          >
            {streak}
          </span>
          <span
            className="mt-0.5"
            style={{
              color: c.ring,
              fontSize: "clamp(0.5rem, 1.3vw, 0.65rem)",
              opacity: 0.7,
            }}
          >
            day streak
          </span>
        </div>
      </div>

      {/* Footer */}
      <a
        className="mt-4 z-10 underline"
        style={{ color: "#4a6080", fontSize: "clamp(0.5rem, 1.2vw, 0.65rem)" }}
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com/{username}
      </a>
    </div>
  );
}
