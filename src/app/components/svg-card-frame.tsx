"use client";

import * as React from "react";

/**
 * Renders a 1000x1000 SVG at its native size and scales it with a transform.
 * WebKit mispaints HTML inside foreignObject when the SVG viewport itself is
 * CSS-resized, which pushes card content outside the card in Safari.
 */
export default function SvgCardFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState<number | null>(null);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(() =>
      setScale(frame.clientWidth / 1000),
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className={["relative h-full w-full overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      style={{ visibility: scale === null ? "hidden" : "visible" }}
    >
      <div
        className="origin-top-left"
        style={{
          width: 1000,
          height: 1000,
          transform: `scale(${scale ?? 0})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
