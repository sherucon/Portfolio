"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MESSAGE_TEXT = "Hey whatsup! This is confidential";
const URL_TEXT = "https://potenad.vercel.app/#H4sIAAAAAAA....";

// Frame positions (within the 884×814 canvas)
const POS_FRAME6_Y = 60; // red message
const POS_FRAME9_Y = 331; // green URL
const POS_FRAME10_Y = 601; // red decoded

// Color channels
const RED_BG = [238, 133, 133] as const;
const RED_BDR = [194, 78, 78] as const;
const YLW_BG = [238, 218, 133] as const;
const YLW_BDR = [194, 175, 78] as const;
const GRN_BG = [150, 238, 133] as const;
const GRN_BDR = [74, 192, 51] as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  t: number,
) {
  return `rgb(${Math.round(lerp(from[0], to[0], t))},${Math.round(lerp(from[1], to[1], t))},${Math.round(lerp(from[2], to[2], t))})`;
}

// Smooth ease-out-expo — quick start, gentle deceleration, no bounce
function springEase(t: number): number {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return 1 - Math.pow(2, -10 * t);
}

type Stage =
  | "idle-message"
  | "encoding"
  | "idle-url"
  | "decoding"
  | "resetting";

type Visuals = {
  finalY: number;
  scale: number;
  blur: number;
  bgColor: string;
  bdrColor: string;
  shadow: string;
  msgOpacity: number;
  msgSlide: number;
  urlOpacity: number;
  urlSlide: number;
  shimmerActive: boolean;
};

function getVisuals(t: number, stage: Stage): Visuals {
  // Local progress within whichever segment we're in (always 0→1)
  const segT = t <= 1 ? t : t <= 2 ? t - 1 : t - 2;

  // Position Y across all three segments
  const bubbleY =
    t <= 1
      ? lerp(POS_FRAME6_Y, POS_FRAME9_Y, t)
      : t <= 2
        ? lerp(POS_FRAME9_Y, POS_FRAME10_Y, t - 1)
        : lerp(POS_FRAME10_Y, POS_FRAME6_Y, t - 2);

  // Curved arc bow per segment
  const arcOff = Math.sin(segT * Math.PI) * -6;

  // Color: red→yellow→green→red
  const colorT = t <= 1 ? t : t <= 2 ? 2 - t : 0; // shadows pop the middle bubble
  const bgColor =
    t <= 1
      ? lerpRgb(RED_BG, YLW_BG, t)
      : t <= 2
        ? lerpRgb(YLW_BG, GRN_BG, t - 1)
        : lerpRgb(GRN_BG, RED_BG, t - 2);

  const bdrColor =
    t <= 1
      ? lerpRgb(RED_BDR, YLW_BDR, t)
      : t <= 2
        ? lerpRgb(YLW_BDR, GRN_BDR, t - 1)
        : lerpRgb(GRN_BDR, RED_BDR, t - 2);

  // Shadow
  const shadowAlpha = 0.12 + colorT * 0.12;
  const shadowY2 = 4 + colorT * 6;
  const shadowBlur = 12 + colorT * 16;
  const shadow = `0 ${shadowY2}px ${shadowBlur}px ${bdrColor.replace("rgb(", "rgba(").replace(")", `,${shadowAlpha})`)}`;

  // Scale dip and blur — active on all three moving segments
  const isAnimating =
    stage === "encoding" || stage === "decoding" || stage === "resetting";
  const scalePeak = Math.sin(segT * Math.PI);
  const scale = isAnimating ? 1 - scalePeak * 0.01 : 1;
  const blurPeak = Math.sin(Math.min(segT / 0.65, 1) * Math.PI);
  const blur = isAnimating ? blurPeak * 3.5 : 0;

  // Text — message stays visible during reset, URL invisible
  const msgOpacity =
    t <= 0.55
      ? lerp(1, 0, t / 0.55)
      : t >= 1.45 && t <= 2
        ? lerp(0, 1, (t - 1.45) / 0.55)
        : t > 2
          ? 1
          : 0;

  const urlOpacity =
    t <= 0.45
      ? lerp(0, 1, t / 0.45)
      : t >= 1 && t <= 2
        ? lerp(1, 0, Math.min((t - 1) / 0.45, 1))
        : t > 2
          ? 0
          : 1;

  // Text slide (encode/decode only; reset keeps message centered)
  const msgSlide =
    t <= 1
      ? lerp(0, -18, Math.min(t / 0.6, 1))
      : t <= 2
        ? lerp(-18, 0, Math.min((t - 1) / 0.55, 1))
        : 0;
  const urlSlide =
    t <= 1
      ? lerp(18, 0, Math.min(t / 0.55, 1))
      : t <= 2
        ? lerp(0, 18, Math.min((t - 1) / 0.6, 1))
        : 0;

  // Final Y: add arc offset only when animating
  const finalY = isAnimating ? bubbleY + arcOff : bubbleY;

  return {
    finalY,
    scale,
    blur,
    bgColor,
    bdrColor,
    shadow,
    msgOpacity,
    msgSlide,
    urlOpacity,
    urlSlide,
    shimmerActive:
      (stage === "encoding" || stage === "decoding") &&
      segT > 0.1 &&
      segT < 0.85,
  };
}

export default function PotenadAnim() {
  const [stage, setStage] = useState<Stage>("idle-message");
  const [shimmerActive, setShimmerActive] = useState(false);

  const hostRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLParagraphElement>(null);
  const urlRef = useRef<HTMLParagraphElement>(null);

  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const stageRef = useRef<Stage>("idle-message");
  const rawTRef = useRef(0);
  const shimmerRef = useRef(false);

  const DURATION = 1000;
  const WAIT_DURATION = 1000;

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const applyVisuals = useCallback((t: number) => {
    const v = getVisuals(t, stageRef.current);
    const bubble = bubbleRef.current;
    if (bubble) {
      bubble.style.transform = `translateY(${v.finalY}px) scale(${v.scale})`;
      bubble.style.background = v.bgColor;
      bubble.style.borderColor = v.bdrColor;
      bubble.style.boxShadow = v.shadow;
      bubble.style.filter = v.blur > 0.3 ? `blur(${v.blur}px)` : "none";
    }

    if (msgRef.current) {
      msgRef.current.style.opacity = String(v.msgOpacity);
      msgRef.current.style.transform = `translateY(-50%) translateX(${v.msgSlide}px)`;
    }

    if (urlRef.current) {
      urlRef.current.style.opacity = String(v.urlOpacity);
      urlRef.current.style.transform = `translateY(-50%) translateX(${v.urlSlide}px)`;
    }

    if (v.shimmerActive !== shimmerRef.current) {
      shimmerRef.current = v.shimmerActive;
      setShimmerActive(v.shimmerActive);
    }
  }, []);

  const animate = useCallback(
    (fromT: number, toT: number, onDone: () => void) => {
      stopRaf();
      startRef.current = null;

      function tick(ts: number) {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = springEase(progress);
        const currentT = lerp(fromT, toT, eased);
        rawTRef.current = currentT;
        applyVisuals(currentT);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rawTRef.current = toT;
          applyVisuals(toT);
          onDone();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [applyVisuals, stopRaf],
  );

  const reset = useCallback(() => {
    stopRaf();
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stageRef.current = "idle-message";
    rawTRef.current = 0;
    shimmerRef.current = false;
    setStage("idle-message");
    setShimmerActive(false);
    applyVisuals(0);
  }, [applyVisuals, stopRaf]);

  const runLoop = useCallback(
    function loop() {
      // idle at first state before encoding
      stageRef.current = "idle-message";
      setStage("idle-message");

      timeoutRef.current = window.setTimeout(() => {
        // Phase 1: encode (Frame6 → Frame9)
        stageRef.current = "encoding";
        setStage("encoding");

        animate(0, 1, () => {
          // Rest at URL
          stageRef.current = "idle-url";
          setStage("idle-url");

          timeoutRef.current = window.setTimeout(() => {
            // Phase 2: decode (Frame9 → Frame10)
            stageRef.current = "decoding";
            setStage("decoding");

            animate(1, 2, () => {
              // Rest at decoded state
              timeoutRef.current = window.setTimeout(() => {
                // Phase 3: smoothly return bubble to Frame6 position (red → red)
                stageRef.current = "resetting";
                setStage("resetting");

                animate(2, 3, () => {
                  // Snap t back to 0 (same visual position) then loop
                  rawTRef.current = 0;
                  applyVisuals(0);
                  timeoutRef.current = window.setTimeout(loop, 40);
                });
              }, WAIT_DURATION);
            });
          }, WAIT_DURATION);
        });
      }, WAIT_DURATION);
    },
    [animate, applyVisuals],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(max-width: 767.98px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let inView = false;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      reset();
      timeoutRef.current = window.setTimeout(runLoop, 100);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      reset();
    };

    const sync = () => {
      if (inView && document.visibilityState === "visible") start();
      else stop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "200px" },
    );

    observer.observe(host);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stopRaf();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [reset, runLoop, stopRaf]);

  const v = getVisuals(rawTRef.current, stage);

  return (
    <div
      ref={hostRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "#f7f7f9",
      }}
    >
      {/* Subtle background grid lines matching Figma */}
      {[271, 542].map((y) => (
        <div
          key={y}
          className="absolute left-0 right-0"
          style={{
            top: y,
            height: 6,
            background: "#E0E0E2",
          }}
        />
      ))}

      {/* ── Single morphing bubble ─────────────────────────────────────────── */}
      <div
        ref={bubbleRef}
        style={{
          position: "absolute",
          left: 53,
          top: 0,
          width: 778,
          height: 151,
          borderRadius: 37,
          background: v.bgColor,
          border: `6px solid ${v.bdrColor}`,
          boxShadow: v.shadow,
          transform: `translateY(${v.finalY}px) scale(${v.scale})`,
          filter: v.blur > 0.3 ? `blur(${v.blur}px)` : "none",
          transformOrigin: "center center",
          willChange: "transform, filter",
          overflow: "hidden",
        }}
      >
        {/* Shimmer sweep */}
        {shimmerActive && (
          <div
            key={stage}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(108deg, transparent 25%, rgba(255,255,255,0.52) 50%, transparent 75%)",
              backgroundSize: "220% 100%",
              animation: "shimmerSweep 680ms cubic-bezier(0.22,1,0.36,1) both",
              borderRadius: "inherit",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Message text */}
        <p
          ref={msgRef}
          style={{
            position: "absolute",
            left: 169,
            top: "50%",
            margin: 0,
            transform: `translateY(-50%) translateX(${v.msgSlide}px)`,
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: "normal",
            color: "#000",
            whiteSpace: "nowrap",
            opacity: v.msgOpacity,
            pointerEvents: "none",
          }}
        >
          {MESSAGE_TEXT}
        </p>

        {/* URL text */}
        <p
          ref={urlRef}
          style={{
            position: "absolute",
            left: 84,
            top: "50%",
            margin: 0,
            transform: `translateY(-50%) translateX(${v.urlSlide}px)`,
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: "normal",
            color: "#000",
            whiteSpace: "nowrap",
            opacity: v.urlOpacity,
            pointerEvents: "none",
          }}
        >
          {URL_TEXT}
        </p>
      </div>

      <style>{`
        @keyframes shimmerSweep {
          0%   { background-position: -110% 0; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { background-position: 210% 0; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
