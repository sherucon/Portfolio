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
      {/* ── GitHub badge — top right ── */}
      {/* <div className="absolute top-3 right-3 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          viewBox="0 0 100 100"
          width="64"
          height="64"
          stroke="gray"
          strokeWidth="0.3"
        >
          Rounded white square
          <path
            d="M63.6 5c9 0 13.6 0 18.4 1.5 5.3 1.9 9.5 6.1 11.4 11.4C95 22.8 95 27.3 95 36.4v27.2c0 9 0 13.6-1.5 18.4-1.9 5.3-6.1 9.5-11.4 11.4C77.2 95 72.7 95 63.6 95H36.4c-9 0-13.6 0-18.4-1.5-5.3-2-9.5-6.2-11.5-11.5C5 77.2 5 72.7 5 63.6V36.4c0-9 0-13.6 1.5-18.4 2-5.3 6.2-9.5 11.5-11.5C22.8 5 27.3 5 36.4 5h27.2z"
            fill="#fff"
          />
          GitHub mark — scaled up to fill the badge
          <g transform="translate(50 50) scale(1.3) translate(-50 -50)">
            <path
              fill="#181717"
              d="M50 22c-15.46 0-28 12.54-28 28 0 12.37 8.02 22.87 19.15 26.57 1.4.26 1.91-.61 1.91-1.35 0-.67-.03-2.88-.04-5.22-7.79 1.69-9.43-3.31-9.43-3.31-1.27-3.23-3.1-4.09-3.1-4.09-2.54-1.74.19-1.7.19-1.7 2.81.2 4.29 2.89 4.29 2.89 2.5 4.29 6.57 3.05 8.17 2.33.25-1.81.98-3.05 1.78-3.75-6.22-.71-12.76-3.11-12.76-13.84 0-3.06 1.09-5.56 2.88-7.52-.29-.71-1.25-3.57.27-7.44 0 0 2.35-.75 7.7 2.87A26.6 26.6 0 0 1 50 35.1c2.38.01 4.78.32 7.02.95 5.35-3.62 7.69-2.87 7.69-2.87 1.53 3.87.57 6.73.28 7.44 1.79 1.96 2.87 4.46 2.87 7.52 0 10.76-6.55 13.12-12.79 13.82 1.01.87 1.91 2.58 1.91 5.21 0 3.76-.03 6.79-.03 7.72 0 .75.5 1.63 1.92 1.35C69.99 72.86 78 62.36 78 50c0-15.46-12.54-28-28-28z"
            />
          </g>
        </svg>
      </div> */}

      {/* ── Neumorphic ring platform ── */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "66%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: "#f0f0f3",
          boxShadow:
            "10px 10px 28px rgba(0,0,0,0.13), -10px -10px 28px rgba(0,0,0,0.13)",
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
            stroke="#e0dfe8"
            strokeWidth="6"
          />

          {/* Animated fill */}
          <circle
            ref={circleRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>

        {/* Centre content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="leading-none text-[45px] md:text-[30px] "
            style={{
              color: "#1a1a1a",
              fontWeight: 500,
            }}
          >
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
        className="flex items-center gap-2 no-underline"
        style={{
          marginTop: "1.5rem",
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
