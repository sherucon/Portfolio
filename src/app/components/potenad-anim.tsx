"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

export default function PotenadAnim() {
  const [stage, setStage] = useState<Stage>("idle-message");
  // 0 = Frame6 position/colors, 1 = Frame9, 2 = Frame10
  const [rawT, setRawT] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const stageRef = useRef<Stage>("idle-message" as Stage);
  const rawTRef = useRef(0);

  const DURATION = 1000;
  const WAIT_DURATION = 1000;

  const stopRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

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
        setRawT(currentT);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rawTRef.current = toT;
          setRawT(toT);
          onDone();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [],
  );

  const runLoop = useCallback(() => {
    // idle at first state before encoding
    stageRef.current = "idle-message";
    setStage("idle-message");

    setTimeout(() => {
      // Phase 1: encode (Frame6 → Frame9)
      stageRef.current = "encoding";
      setStage("encoding");

      animate(0, 1, () => {
        // Rest at URL
        stageRef.current = "idle-url";
        setStage("idle-url");

        setTimeout(() => {
          // Phase 2: decode (Frame9 → Frame10)
          stageRef.current = "decoding";
          setStage("decoding");

          animate(1, 2, () => {
            // Rest at decoded state
            setTimeout(() => {
              // Phase 3: smoothly return bubble to Frame6 position (red → red)
              stageRef.current = "resetting";
              setStage("resetting");

              animate(2, 3, () => {
                // Snap t back to 0 (same visual position) then loop
                rawTRef.current = 0;
                setRawT(0);
                setTimeout(runLoop, 40);
              });
            }, WAIT_DURATION);
          });
        }, WAIT_DURATION);
      });
    }, WAIT_DURATION);
  }, [animate]);

  useEffect(() => {
    const timeout = setTimeout(runLoop, 100);
    return () => {
      clearTimeout(timeout);
      stopRaf();
    };
  }, [runLoop]);

  // ── Derived visual values ──────────────────────────────────────────────────

  const t = rawT;
  // t segments:
  //   0→1: Frame6 (red, y=60)  → Frame9 (green, y=331)  — encode
  //   1→2: Frame9 (green, y=331) → Frame10 (red, y=601) — decode
  //   2→3: Frame10 (red, y=601) → Frame6 (red, y=60)    — loop reset

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
  const colorT = t <= 1 ? t : t <= 2 ? 2 - t : 0; // used for shadows to pop the middle bubble
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
  const shadowRgb =
    t <= 1
      ? lerpRgb(RED_BDR, YLW_BDR, t)
      : t <= 2
        ? lerpRgb(YLW_BDR, GRN_BDR, t - 1)
        : lerpRgb(GRN_BDR, RED_BDR, t - 2);
  const shadow = `0 ${shadowY2}px ${shadowBlur}px ${shadowRgb.replace("rgb(", "rgba(").replace(")", `,${shadowAlpha})`)}`;

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

  // Shimmer only on encode/decode, not reset
  const shimmerActive =
    (stage === "encoding" || stage === "decoding") && segT > 0.1 && segT < 0.85;

  // Final Y: add arc offset only when animating
  const finalY = isAnimating ? bubbleY + arcOff : bubbleY;

  return (
    <div
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
        style={{
          position: "absolute",
          left: 53,
          top: finalY,
          width: 778,
          height: 151,
          borderRadius: 37,
          background: bgColor,
          border: `6px solid ${bdrColor}`,
          boxShadow: shadow,
          transform: `scale(${scale})`,
          filter: blur > 0.3 ? `blur(${blur}px)` : "none",
          transformOrigin: "center center",
          willChange: "transform, filter, top",
          overflow: "hidden",
        }}
      >
        {/* Shimmer sweep */}
        {shimmerActive && (
          <div
            key={stage + String(Math.round(segT * 10))}
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
          style={{
            position: "absolute",
            left: 169,
            top: "50%",
            margin: 0,
            transform: `translateY(-50%) translateX(${msgSlide}px)`,
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: "normal",
            color: "#000",
            whiteSpace: "nowrap",
            opacity: msgOpacity,
            pointerEvents: "none",
          }}
        >
          {MESSAGE_TEXT}
        </p>

        {/* URL text */}
        <p
          style={{
            position: "absolute",
            left: 84,
            top: "50%",
            margin: 0,
            transform: `translateY(-50%) translateX(${urlSlide}px)`,
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: "normal",
            color: "#000",
            whiteSpace: "nowrap",
            opacity: urlOpacity,
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
