"use client";

import * as React from "react";

const SVGComponent = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoVisible, setVideoVisible] = React.useState(true);

  return (
    <svg
      width={1000}
      height={1000}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={["group/card", className].filter(Boolean).join(" ")}
      {...props}
    >
      <g clipPath="url(#clip0_archive_redesign)">
        <rect width={1000} height={1000} rx={64} fill="#F7F7F9" />
        <text
          x={58}
          y={100}
          fill="black"
          fontSize={64}
          className="graphik-semibold"
        >
          Noah White
        </text>
        <text
          x={58}
          y={145}
          fill="#757575"
          fontSize={32}
          className="graphik"
        >
          Archive Redesign
        </text>
        <g
          className="group/button cursor-pointer"
          onClick={() => window.open("https://noahwhite.xyz", "_blank")}
        >
          <circle
            cx={892}
            cy={103}
            r={50}
            fill="#DEDEE0"
            className="transition-colors duration-200 group-hover/button:fill-[#ffffff] group-hover/button:drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]"
          />
          <circle
            cx={892}
            cy={103}
            r={44}
            fill="#FBFBFC"
            className="transition-colors duration-200 group-hover/button:hidden"
          />
          <path
            d="M879.083 115.917L904.917 90.0834M904.917 115.917V90.0834H879.083"
            stroke="#9B9C9F"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-200 group-hover/button:stroke-[#000000]"
          />
        </g>
        <line
          x1={58}
          y1={186.5}
          x2={942}
          y2={186.5}
          stroke="#E0E0E2"
          strokeWidth={5}
        />
        <foreignObject x={0} y={189} width={1000} height={811}>
          <video
            ref={videoRef}
            className={[
              "h-full w-full object-cover transition-opacity duration-300 ease-in-out",
              videoVisible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            src="https://portfolio.sherucon.me/output-smooth.webm"
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onEnded={() => {
              setVideoVisible(false);
              window.setTimeout(() => {
                const video = videoRef.current;
                if (!video) return;
                video.currentTime = 0;
                void video.play();
                setVideoVisible(true);
              }, 300);
            }}
          />
        </foreignObject>
      </g>
      <defs>
        <clipPath id="clip0_archive_redesign">
          <rect width={1000} height={1000} rx={64} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default SVGComponent;
