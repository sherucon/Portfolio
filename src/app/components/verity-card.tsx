"use client";

import * as React from "react";
import { SVGProps } from "react";
import DocSearch from "./docsearch";

type OverlayFrame = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  radius: number;
  viewportWidth: number;
  viewportHeight: number;
};

const SVGComponent = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [overlayFrame, setOverlayFrame] = React.useState<OverlayFrame | null>(
    null,
  );

  React.useEffect(() => {
    const updateOverlayFrame = () => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const radius = (Math.min(rect.width, rect.height) * 64) / 1000;
      setOverlayFrame({
        top: Math.max(rect.top, 0),
        left: Math.max(rect.left, 0),
        right: Math.max(window.innerWidth - rect.right, 0),
        bottom: Math.max(window.innerHeight - rect.bottom, 0),
        width: rect.width,
        height: rect.height,
        radius,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
    };

    updateOverlayFrame();
    window.addEventListener("resize", updateOverlayFrame);
    window.addEventListener("scroll", updateOverlayFrame, true);

    return () => {
      window.removeEventListener("resize", updateOverlayFrame);
      window.removeEventListener("scroll", updateOverlayFrame, true);
    };
  }, []);

  return (
    <>
      {overlayFrame && (
        <div
          className="pointer-events-none fixed inset-0 z-[999] transition-[opacity,backdrop-filter,background-color] duration-400 ease-out"
          style={{
            opacity: isButtonHovered ? 1 : 0,
            backgroundColor: isButtonHovered
              ? "rgb(0 0 0 / 0.15)"
              : "rgb(0 0 0 / 0)",
            backdropFilter: isButtonHovered ? "blur(4px)" : "blur(0px)",
            WebkitBackdropFilter: isButtonHovered ? "blur(4px)" : "blur(0px)",
            clipPath: `path('M0 0 H${overlayFrame.viewportWidth} V${overlayFrame.viewportHeight} H0 Z M${overlayFrame.left + overlayFrame.radius} ${overlayFrame.top} A${overlayFrame.radius} ${overlayFrame.radius} 0 0 0 ${overlayFrame.left} ${overlayFrame.top + overlayFrame.radius} V${overlayFrame.top + overlayFrame.height - overlayFrame.radius} A${overlayFrame.radius} ${overlayFrame.radius} 0 0 0 ${overlayFrame.left + overlayFrame.radius} ${overlayFrame.top + overlayFrame.height} H${overlayFrame.left + overlayFrame.width - overlayFrame.radius} A${overlayFrame.radius} ${overlayFrame.radius} 0 0 0 ${overlayFrame.left + overlayFrame.width} ${overlayFrame.top + overlayFrame.height - overlayFrame.radius} V${overlayFrame.top + overlayFrame.radius} A${overlayFrame.radius} ${overlayFrame.radius} 0 0 0 ${overlayFrame.left + overlayFrame.width - overlayFrame.radius} ${overlayFrame.top} H${overlayFrame.left + overlayFrame.radius} Z')`,
          }}
        />
      )}
      <svg
        ref={svgRef}
        width={1000}
        height={1000}
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className={["group/card", className].filter(Boolean).join(" ")}
        {...props}
      >
        <g clipPath="url(#clip0_2137_78)">
          <rect width={1000} height={1000} rx={64} fill="#F7F7F9" />
          <path
            d="M74.875 100L58.8125 54.9062H66.3438L78.6562 92.2188H78.8125L91.125 54.9062H98.6562L82.5938 100H74.875ZM112.5 100.656C102.844 100.656 97 94.0625 97 83.6875V83.6562C97 73.375 102.938 66.5 112.156 66.5C121.375 66.5 127.031 73.125 127.031 83V85.2812H103.75C103.875 91.5 107.281 95.125 112.656 95.125C116.656 95.125 119.312 93.0625 120.156 90.5938L120.25 90.3438H126.656L126.594 90.6875C125.531 95.9062 120.469 100.656 112.5 100.656ZM112.188 72.0312C107.812 72.0312 104.438 75 103.844 80.5H120.344C119.781 74.8125 116.594 72.0312 112.188 72.0312ZM132.281 100V67.125H139.031V72.75H139.188C140.25 68.9062 143 66.5 146.75 66.5C147.719 66.5 148.562 66.6562 149.094 66.75V73.0312C148.562 72.8125 147.375 72.6562 146.062 72.6562C141.719 72.6562 139.031 75.5 139.031 80.4062V100H132.281ZM156.938 62.0625C154.75 62.0625 153 60.3125 153 58.1875C153 56.0312 154.75 54.2812 156.938 54.2812C159.156 54.2812 160.875 56.0312 160.875 58.1875C160.875 60.3125 159.156 62.0625 156.938 62.0625ZM153.562 100V67.125H160.312V100H153.562ZM178.812 100.656C172.312 100.656 169.188 97.9062 169.188 91.3438V72.5H164.469V67.125H169.188V58.5625H176.094V67.125H182.25V72.5H176.094V90.9375C176.094 94.2812 177.594 95.2812 180.438 95.2812C181.156 95.2812 181.75 95.2188 182.25 95.1562V100.375C181.469 100.5 180.188 100.656 178.812 100.656ZM191.719 110.969C190.406 110.969 189 110.812 188.188 110.656V105.375C188.719 105.5 189.5 105.625 190.406 105.625C193.594 105.625 195.344 104.781 196.469 101.594L197.031 100.031L185.062 67.125H192.375L200.656 93.875H200.875L209.156 67.125H216.281L204.031 101.531C201.594 108.344 198.156 110.969 191.719 110.969Z"
            fill="black"
          />
          <path
            d="M58.4062 145L66.6094 122.453H70.3906L78.5781 145H74.9062L72.8438 138.906H64.1562L62.0781 145H58.4062ZM68.4688 126.188L65.0938 136.094H71.8906L68.5312 126.188H68.4688ZM81.0781 145V122.453H84.5781V145H81.0781ZM94.9531 145V122.453H98.3281V145H94.9531ZM108.812 145.328C103.984 145.328 101.062 142.031 101.062 136.844V136.828C101.062 131.688 104.031 128.25 108.641 128.25C113.25 128.25 116.078 131.562 116.078 136.5V137.641H104.438C104.5 140.75 106.203 142.562 108.891 142.562C110.891 142.562 112.219 141.531 112.641 140.297L112.688 140.172H115.891L115.859 140.344C115.328 142.953 112.797 145.328 108.812 145.328ZM108.656 131.016C106.469 131.016 104.781 132.5 104.484 135.25H112.734C112.453 132.406 110.859 131.016 108.656 131.016ZM125.906 150.797C121.688 150.797 119.016 148.844 118.516 146.328L118.5 146.188H121.844L121.906 146.312C122.359 147.359 123.781 148.078 125.891 148.078C128.578 148.078 130.062 146.641 130.062 144.344V142.094H129.984C129.047 143.875 127.172 145.016 124.812 145.016C120.688 145.016 117.969 141.781 117.969 136.656V136.641C117.969 131.484 120.719 128.25 124.891 128.25C127.203 128.25 129.016 129.5 129.984 131.359H130.062V128.562H133.453V144.547C133.453 148.297 130.547 150.797 125.906 150.797ZM125.766 142.266C128.344 142.266 130.062 140.094 130.062 136.703V136.688C130.062 133.312 128.328 131.141 125.766 131.141C123.094 131.141 121.422 133.297 121.422 136.688V136.703C121.422 140.141 123.094 142.266 125.766 142.266ZM141.625 145.297C138.344 145.297 136.141 143.281 136.141 140.328V140.297C136.141 137.438 138.359 135.688 142.25 135.453L146.719 135.188V133.953C146.719 132.141 145.547 131.047 143.453 131.047C141.5 131.047 140.297 131.969 140.016 133.281L139.984 133.422H136.797L136.812 133.25C137.047 130.422 139.5 128.25 143.547 128.25C147.562 128.25 150.109 130.375 150.109 133.672V145H146.719V142.406H146.656C145.703 144.172 143.797 145.297 141.625 145.297ZM139.547 140.25C139.547 141.688 140.734 142.594 142.547 142.594C144.922 142.594 146.719 140.984 146.719 138.844V137.562L142.703 137.812C140.672 137.938 139.547 138.828 139.547 140.219V140.25ZM153.516 145V122.453H156.891V145H153.516ZM173.922 145.328C169.125 145.328 166.125 142.031 166.125 136.766V136.75C166.125 131.547 169.188 128.25 173.875 128.25C178.109 128.25 180.672 130.969 180.953 134.062L180.969 134.172H177.75L177.719 134.047C177.359 132.438 176.109 131.078 173.906 131.078C171.281 131.078 169.578 133.266 169.578 136.781V136.797C169.578 140.391 171.312 142.5 173.922 142.5C176 142.5 177.328 141.297 177.734 139.516L177.75 139.391H181L180.984 139.5C180.625 142.797 177.875 145.328 173.922 145.328ZM190.453 145.328C185.734 145.328 182.656 142.062 182.656 136.781V136.75C182.656 131.5 185.766 128.25 190.438 128.25C195.125 128.25 198.25 131.484 198.25 136.75V136.781C198.25 142.078 195.156 145.328 190.453 145.328ZM190.469 142.5C193.109 142.5 194.797 140.406 194.797 136.781V136.75C194.797 133.156 193.078 131.078 190.438 131.078C187.844 131.078 186.109 133.156 186.109 136.75V136.781C186.109 140.422 187.828 142.5 190.469 142.5ZM206.453 145.328C202.844 145.328 200.781 143 200.781 139.219V128.562H204.156V138.562C204.156 141.047 205.312 142.422 207.656 142.422C210.031 142.422 211.562 140.719 211.562 138.156V128.562H214.953V145H211.562V142.531H211.484C210.625 144.188 208.953 145.328 206.453 145.328ZM218.297 145V128.562H221.672V131.047H221.75C222.609 129.375 224.297 128.25 226.781 128.25C230.391 128.25 232.469 130.578 232.469 134.359V145H229.078V135C229.078 132.531 227.922 131.141 225.578 131.141C223.203 131.141 221.672 132.859 221.672 135.422V145H218.297ZM241.891 145.328C237.781 145.328 235.375 143.297 235.031 140.297L235.016 140.156H238.359L238.391 140.312C238.703 141.828 239.828 142.719 241.906 142.719C243.938 142.719 245.156 141.875 245.156 140.547V140.531C245.156 139.469 244.562 138.859 242.797 138.438L240.109 137.828C236.984 137.109 235.438 135.609 235.438 133.219V133.203C235.438 130.266 238 128.25 241.781 128.25C245.672 128.25 248.016 130.422 248.188 133.219L248.203 133.406H245.031L245.016 133.297C244.812 131.859 243.688 130.859 241.781 130.859C239.969 130.859 238.828 131.719 238.828 133.031V133.047C238.828 134.062 239.5 134.75 241.266 135.172L243.938 135.781C247.297 136.562 248.578 137.891 248.578 140.25V140.266C248.578 143.266 245.766 145.328 241.891 145.328ZM258.219 145.328C253.391 145.328 250.469 142.031 250.469 136.844V136.828C250.469 131.688 253.438 128.25 258.047 128.25C262.656 128.25 265.484 131.562 265.484 136.5V137.641H253.844C253.906 140.75 255.609 142.562 258.297 142.562C260.297 142.562 261.625 141.531 262.047 140.297L262.094 140.172H265.297L265.266 140.344C264.734 142.953 262.203 145.328 258.219 145.328ZM258.062 131.016C255.875 131.016 254.188 132.5 253.891 135.25H262.141C261.859 132.406 260.266 131.016 258.062 131.016ZM268.234 145V122.453H271.609V145H268.234ZM275.203 145V122.453H278.578V145H275.203ZM289.109 145.328C284.391 145.328 281.312 142.062 281.312 136.781V136.75C281.312 131.5 284.422 128.25 289.094 128.25C293.781 128.25 296.906 131.484 296.906 136.75V136.781C296.906 142.078 293.812 145.328 289.109 145.328ZM289.125 142.5C291.766 142.5 293.453 140.406 293.453 136.781V136.75C293.453 133.156 291.734 131.078 289.094 131.078C286.5 131.078 284.766 133.156 284.766 136.75V136.781C284.766 140.422 286.484 142.5 289.125 142.5ZM299.516 145V128.562H302.891V131.375H302.969C303.5 129.453 304.875 128.25 306.75 128.25C307.234 128.25 307.656 128.328 307.922 128.375V131.516C307.656 131.406 307.062 131.328 306.406 131.328C304.234 131.328 302.891 132.75 302.891 135.203V145H299.516ZM310.312 145.234C309.156 145.234 308.25 144.328 308.25 143.188C308.25 142.031 309.156 141.141 310.312 141.141C311.453 141.141 312.359 142.031 312.359 143.188C312.359 144.328 311.453 145.234 310.312 145.234Z"
            fill="#757575"
          />
          <g
            className="group/button cursor-pointer"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
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
              d="M879.083 115.917L904.916 90.0834M904.916 115.917V90.0834H879.083"
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
          <line
            x1={52}
            y1={186.5}
            x2={936}
            y2={186.5}
            stroke="#E0E0E2"
            strokeWidth={5}
          />
          <g className="drop-shadow-[-10px_-10px_50px_rgba(0,0,0,0.5)]">
            <rect
              x={123}
              y={243}
              width={756}
              height={1005}
              rx={50}
              fill="url(#pattern0_2137_78)"
              shapeRendering="crispEdges"
            />
          </g>
        </g>
        <defs>
          <pattern
            id="pattern0_2137_78"
            patternContentUnits="objectBoundingBox"
            width={1}
            height={1}
          >
            <use
              xlinkHref="#image0_2137_78"
              transform="matrix(0.000932234 0 0 0.000701262 -0.0147882 0)"
            />
          </pattern>
          <clipPath id="clip0_2137_78">
            <rect width={1000} height={1000} rx={64} fill="white" />
          </clipPath>
          <image
            id="image0_2137_78"
            width={1103}
            height={1426}
            preserveAspectRatio="none"
            xlinkHref="https://r2.sherucon.tech/work-cards/verity/doc1.webp"
          />
        </defs>
        <foreignObject x={139} y={858} width={724} height={114} className="overflow-visible">
          <DocSearch />
        </foreignObject>
      </svg>
    </>
  );
};
export default SVGComponent;
