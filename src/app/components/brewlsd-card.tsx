"use client";

import * as React from "react";
import { SVGProps } from "react";

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
        <g clipPath="url(#clip0_2112_67)">
          <rect width={1000} height={1000} rx={64} fill="#F7F7F9" />
          <path
            d="M62.1562 100V54.9062H80.1562C88.1562 54.9062 93.4062 59.375 93.4062 66.1875V66.25C93.4062 71 89.8125 75.4062 85.0625 76.0938V76.2188C91.4688 76.875 95.625 81.2812 95.625 87.2188V87.2812C95.625 95.1875 89.8438 100 80.25 100H62.1562ZM78.4688 60.625H69.1562V74.125H76.9062C83.0938 74.125 86.4375 71.625 86.4375 67.0938V67.0312C86.4375 62.9062 83.5312 60.625 78.4688 60.625ZM78.3438 79.5312H69.1562V94.2812H78.8125C85.0938 94.2812 88.4688 91.75 88.4688 86.9375V86.875C88.4688 82.0312 85.0312 79.5312 78.3438 79.5312ZM100.844 100V67.125H107.594V72.75H107.75C108.812 68.9062 111.562 66.5 115.312 66.5C116.281 66.5 117.125 66.6562 117.656 66.75V73.0312C117.125 72.8125 115.938 72.6562 114.625 72.6562C110.281 72.6562 107.594 75.5 107.594 80.4062V100H100.844ZM134.5 100.656C124.844 100.656 119 94.0625 119 83.6875V83.6562C119 73.375 124.938 66.5 134.156 66.5C143.375 66.5 149.031 73.125 149.031 83V85.2812H125.75C125.875 91.5 129.281 95.125 134.656 95.125C138.656 95.125 141.312 93.0625 142.156 90.5938L142.25 90.3438H148.656L148.594 90.6875C147.531 95.9062 142.469 100.656 134.5 100.656ZM134.188 72.0312C129.812 72.0312 126.438 75 125.844 80.5H142.344C141.781 74.8125 138.594 72.0312 134.188 72.0312ZM160.688 100L151.656 67.125H158.406L164.406 93H164.531L171.375 67.125H177.875L184.75 93H184.906L190.906 67.125H197.594L188.594 100H181.562L174.656 75.375H174.5L167.656 100H160.688ZM202.531 100V54.9062H209.531V93.9688H230.531V100H202.531ZM251.906 100.75C241.781 100.75 235.094 95.9375 234.531 88L234.5 87.5312H241.312L241.375 87.9375C242 92.0938 246.156 94.6875 252.188 94.6875C258.219 94.6875 262.031 91.9688 262.031 87.75V87.7188C262.031 84.0938 259.562 82.125 253.594 80.8125L248.688 79.7812C239.844 77.9062 235.562 73.8438 235.562 67.1562V67.125C235.594 59.4375 242.375 54.1562 251.906 54.1562C261.312 54.1562 267.75 59.2812 268.219 66.8438L268.25 67.375H261.438L261.406 66.9375C260.781 62.75 257.156 60.2188 251.812 60.2188C246.219 60.25 242.656 62.9062 242.656 66.8438V66.875C242.656 70.25 245.219 72.3125 250.844 73.5312L255.781 74.5625C265.094 76.5312 269.094 80.3125 269.094 87.2812V87.3125C269.094 95.5312 262.594 100.75 251.906 100.75ZM275.406 100V54.9062H291.312C304.688 54.9062 312.656 63.125 312.656 77.3125V77.375C312.656 91.625 304.75 100 291.312 100H275.406ZM282.406 93.9375H290.656C300.219 93.9375 305.5 88.0938 305.5 77.4375V77.375C305.5 66.7812 300.156 60.9375 290.656 60.9375H282.406V93.9375Z"
            fill="black"
          />
          <path
            d="M69.4062 145.344C67 145.344 65.1562 144.125 64.25 142.141H64.1562V145H59.5938V122.453H64.1562V131.156H64.25C65.1719 129.125 67.0312 127.906 69.4219 127.906C73.625 127.906 76.2344 131.156 76.2344 136.609V136.625C76.2344 142.062 73.625 145.344 69.4062 145.344ZM67.8906 141.562C70.1562 141.562 71.5938 139.672 71.5938 136.625V136.609C71.5938 133.547 70.1562 131.688 67.8906 131.688C65.6875 131.688 64.1562 133.594 64.1562 136.609V136.625C64.1562 139.656 65.6719 141.562 67.8906 141.562ZM78.5781 145V128.25H83.1406V131.172H83.2344C83.7344 129.109 85.0938 127.906 87.0469 127.906C87.5469 127.906 88.0156 127.984 88.3594 128.078V132.094C87.9844 131.938 87.3594 131.844 86.7031 131.844C84.4531 131.844 83.1406 133.188 83.1406 135.625V145H78.5781ZM97.3281 145.344C92.2031 145.344 89.0938 142.016 89.0938 136.656V136.641C89.0938 131.312 92.2344 127.906 97.1406 127.906C102.047 127.906 105.125 131.234 105.125 136.297V137.703H93.5938C93.6406 140.375 95.0938 141.938 97.4219 141.938C99.2969 141.938 100.438 140.906 100.766 139.969L100.797 139.875H104.984L104.938 140.047C104.422 142.516 102.109 145.344 97.3281 145.344ZM97.2188 131.312C95.3438 131.312 93.9375 132.562 93.6406 134.828H100.75C100.469 132.516 99.1094 131.312 97.2188 131.312ZM110.688 145L106.234 128.25H110.828L113.359 140.672H113.453L116.422 128.25H120.797L123.781 140.672H123.875L126.422 128.25H130.922L126.484 145H121.625L118.594 133.156H118.5L115.484 145H110.688ZM139.156 145V122.453H143.719V145H139.156ZM153.688 145.344C149.047 145.344 146.469 143.203 146.109 140.031L146.094 139.891H150.547L150.578 140.031C150.875 141.344 151.859 142.109 153.688 142.109C155.406 142.109 156.453 141.438 156.453 140.359V140.344C156.453 139.453 155.891 138.938 154.25 138.578L151.406 137.984C148.156 137.297 146.516 135.672 146.516 133.172V133.156C146.516 129.969 149.266 127.906 153.531 127.906C157.984 127.906 160.469 130.266 160.578 133.203V133.359H156.375L156.359 133.234C156.203 132.031 155.219 131.125 153.531 131.125C151.953 131.125 150.969 131.828 150.969 132.906V132.922C150.969 133.781 151.547 134.344 153.234 134.703L156.078 135.312C159.578 136.047 161.016 137.422 161.016 139.891V139.906C161.016 143.188 158 145.344 153.688 145.344ZM162.438 149.531L163.719 141.531H167.094L164.812 149.531H162.438ZM184.219 145.328C181.859 145.328 180.031 144.141 179.062 142.219H178.984V145H175.609V122.453H178.984V131.359H179.062C180.047 129.422 181.922 128.25 184.25 128.25C188.375 128.25 191.094 131.531 191.094 136.766V136.781C191.094 142.016 188.391 145.328 184.219 145.328ZM183.328 142.422C185.984 142.422 187.641 140.281 187.641 136.781V136.766C187.641 133.297 185.984 131.141 183.328 131.141C180.781 131.141 178.969 133.359 178.969 136.766V136.781C178.969 140.203 180.766 142.422 183.328 142.422ZM199.297 145.328C195.688 145.328 193.625 143 193.625 139.219V128.562H197V138.562C197 141.047 198.156 142.422 200.5 142.422C202.875 142.422 204.406 140.719 204.406 138.156V128.562H207.797V145H204.406V142.531H204.328C203.469 144.188 201.797 145.328 199.297 145.328ZM216.906 145.328C213.656 145.328 212.094 143.953 212.094 140.672V131.25H209.734V128.562H212.094V124.281H215.547V128.562H218.625V131.25H215.547V140.469C215.547 142.141 216.297 142.641 217.719 142.641C218.078 142.641 218.375 142.609 218.625 142.578V145.188C218.234 145.25 217.594 145.328 216.906 145.328ZM233.938 145.344C229.719 145.344 227.125 142.062 227.125 136.625V136.609C227.125 131.156 229.719 127.906 233.938 127.906C236.312 127.906 238.188 129.125 239.094 131.156H239.188V122.453H243.75V145H239.188V142.141H239.094C238.203 144.125 236.359 145.344 233.938 145.344ZM235.469 141.562C237.688 141.562 239.203 139.656 239.203 136.625V136.609C239.203 133.594 237.672 131.688 235.469 131.688C233.203 131.688 231.766 133.547 231.766 136.609V136.625C231.766 139.672 233.188 141.562 235.469 141.562ZM254.422 145.344C249.297 145.344 246.188 142.016 246.188 136.656V136.641C246.188 131.312 249.328 127.906 254.234 127.906C259.141 127.906 262.219 131.234 262.219 136.297V137.703H250.688C250.734 140.375 252.188 141.938 254.516 141.938C256.391 141.938 257.531 140.906 257.859 139.969L257.891 139.875H262.078L262.031 140.047C261.516 142.516 259.203 145.344 254.422 145.344ZM254.312 131.312C252.438 131.312 251.031 132.562 250.734 134.828H257.844C257.562 132.516 256.203 131.312 254.312 131.312ZM264.688 145V122.453H269.25V145H264.688ZM278.031 145.344C274.344 145.344 272.25 142.984 272.25 139.062V128.25H276.812V138.109C276.812 140.297 277.844 141.562 279.891 141.562C281.938 141.562 283.234 140.062 283.234 137.875V128.25H287.797V145H283.234V142.234H283.141C282.281 144.156 280.562 145.344 278.031 145.344ZM289.625 145L294.875 136.656L289.656 128.25H294.797L297.812 133.906H297.906L300.875 128.25H305.844L300.609 136.531L305.797 145H300.844L297.656 139.188H297.562L294.422 145H289.625ZM314.828 145.344C309.703 145.344 306.594 142.016 306.594 136.656V136.641C306.594 131.312 309.734 127.906 314.641 127.906C319.547 127.906 322.625 131.234 322.625 136.297V137.703H311.094C311.141 140.375 312.594 141.938 314.922 141.938C316.797 141.938 317.938 140.906 318.266 139.969L318.297 139.875H322.484L322.438 140.047C321.922 142.516 319.609 145.344 314.828 145.344ZM314.719 131.312C312.844 131.312 311.438 132.562 311.141 134.828H318.25C317.969 132.516 316.609 131.312 314.719 131.312Z"
            fill="#757575"
          />
          <line
            x1={58}
            y1={186.5}
            x2={942}
            y2={186.5}
            stroke="#E0E0E2"
            strokeWidth={5}
          />
          <g
            className="group/button cursor-pointer"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <circle
              id="button"
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
            />
          </g>
          <rect
            x={58}
            y={263}
            width={1587}
            height={996}
            rx={27}
            fill="url(#pattern0_2112_67)"
            className="transition-all duration-300 ease-out group-hover/card:drop-shadow-[-5px_-5px_25px_rgba(0,0,0,0.6)]"
          />
          <path
            opacity={0.95}
            d="M750 750H1069V1069H750V750Z"
            fill="url(#pattern1_2112_67)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 909.5 909.5"
              to="360 909.5 909.5"
              dur="15s"
              repeatCount="indefinite"
            />
          </path>
        </g>
        <defs>
          <pattern
            id="pattern0_2112_67"
            patternContentUnits="objectBoundingBox"
            width={1}
            height={1}
          >
            <use
              xlinkHref="#image0_2112_67"
              transform="scale(0.000292451 0.000465983)"
            />
          </pattern>
          <pattern
            id="pattern1_2112_67"
            patternContentUnits="objectBoundingBox"
            width={1}
            height={1}
          >
            <use xlinkHref="#image1_2112_67" transform="scale(0.000797448)" />
          </pattern>
          <clipPath id="clip0_2112_67">
            <rect width={1000} height={1000} rx={64} fill="white" />
          </clipPath>
          <image
            id="image0_2112_67"
            width={3420}
            height={2146}
            preserveAspectRatio="none"
            xlinkHref="https://r2.sherucon.tech/work-cards/brewlsd/demo.webp"
          />
          <image
            id="image1_2112_67"
            width={1254}
            height={1254}
            preserveAspectRatio="none"
            xlinkHref="https://r2.sherucon.tech/work-cards/brewlsd/holo.webp"
          />
        </defs>
      </svg>
    </>
  );
};
export default SVGComponent;
