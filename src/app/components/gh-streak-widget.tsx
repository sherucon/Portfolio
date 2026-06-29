"use client";

import { useEffect, useRef } from "react";

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
  R = 42;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function GhStreakWidget({ streak, username, colors: c }: Props) {
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.strokeDashoffset = String(CIRCUMFERENCE);

    const t = setTimeout(() => {
      el.style.transition =
        "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.strokeDashoffset = "0";
    }, 120);

    return () => clearTimeout(t);
  }, [streak]);

  return (
    <div
      className="relative w-full h-full rounded-3xl flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ background: "#f7f7f9" }}
    >
      {/* ── Neumorphic ring platform ── */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "66%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: "#f7f7f9",
          transform: "translateY(-1rem)",
        }}
      >
        {/* SVG ring */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={c.ringAlt} />
              <stop offset="100%" stopColor={c.ring} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="url(#ringGrad)"
            opacity="0.2"
            strokeWidth="12"
          />

          {/* Animated fill */}
          <circle
            ref={circleRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>

        {/* Centre content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="leading-none text-[65px] md:text-[60px] text-[#1a1a1a] font-semibold">
            {streak}
          </span>
          <span
            style={{
              color: c.ring,
              fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
              marginTop: "0.2em",
              fontWeight: 500,
            }}
          >
            day streak
          </span>
        </div>
      </div>

      {/* ── Footer pill ── */}
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-5 no-underline"
        style={{
          position: "absolute",
          bottom: "1.1rem",
          background: "#e4e4e9",
          borderRadius: "9999px",
          padding: "0.3rem 0.9rem",
        }}
      >
        {/* Chain/link icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "clamp(10px, 1.4vw, 14px)",
            height: "clamp(10px, 1.4vw, 14px)",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span
          style={{
            color: "#888",
            fontSize: "clamp(0.55rem, 1.3vw, 0.75rem)",
            whiteSpace: "nowrap",
          }}
        >
          github.com/{username}
        </span>
      </a>
    </div>
  );
}
