"use client";

import { useEffect, useRef } from "react";

// 8x8 Bayer Dithering Matrix directly from JetBrains Junie shader
const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => v / 64.0));

// Fast 2D smooth noise function (matches GLSL random + smooth interpolation)
function hash2(x: number, y: number): number {
  const sinVal = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return sinVal - Math.floor(sinVal);
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  return (
    a * (1 - ux) * (1 - uy) +
    b * ux * (1 - uy) +
    c * (1 - ux) * uy +
    d * ux * uy
  );
}

// JetBrains Junie's exact Fractional Brownian Motion (fBm) with turbulent flow and vortices
function fbmTurbulentFlow(x: number, y: number, time: number): number {
  let value = 0.0;
  let amplitude = 0.5;
  let totalAmp = 0.0;

  const shiftX = Math.sin(time * 0.1) * 3.0 + Math.cos(time * 0.15) * 2.0;
  const shiftY = Math.cos(time * 0.12) * 3.0 - Math.sin(time * 0.08) * 2.0;

  let flowX = Math.sin(y * 0.8 + time * 0.2) * 1.5;
  let flowY = Math.cos(x * 0.7 + time * 0.15) * 1.5;

  let stX = x;
  let stY = y;

  for (let i = 0; i < 5; i++) {
    const octaveTime = time * (0.4 + i * 0.15);
    const angle =
      smoothNoise(stX * 0.2 + i, stY * 0.2 + i) * 6.28318 + octaveTime;
    const vortexX = Math.cos(angle) * (1.0 + i * 0.3);
    const vortexY = Math.sin(angle) * (1.0 + i * 0.3);

    const temporalMask = 0.7 + 0.3 * Math.sin(time * 0.2 + i * 3.5);
    const n = smoothNoise(stX + vortexX + flowX, stY + vortexY + flowY);
    value += amplitude * n * temporalMask;
    totalAmp += amplitude * temporalMask;

    stX = stX * 1.8 + shiftX * 0.3;
    stY = stY * 1.8 + shiftY * 0.3;
    flowX *= 0.5;
    flowY *= 0.5;
    amplitude *= 0.55;
  }

  return totalAmp > 0 ? value / totalAmp : 0;
}

interface JunieParticleGridProps {
  className?: string;
  gridGap?: number;
  particleRadius?: number;
  timeScale?: number;
}

interface ActiveClick {
  normX: number;
  normY: number;
  time: number;
}

export default function JunieParticleGrid({
  className = "",
  gridGap = 10,
  particleRadius = 2.5,
  timeScale = 0.28,
}: JunieParticleGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Active click wave shocks
    const activeClicks: ActiveClick[] = [];

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const now = performance.now() / 1000;

      // Register click in normalized UV space
      activeClicks.push({
        normX: clickX / (width || 1),
        normY: clickY / (height || 1),
        time: now,
      });

      // Keep only recent clicks
      if (activeClicks.length > 8) {
        activeClicks.shift();
      }
    };

    window.addEventListener("pointerdown", handleClick);

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Particles list for high-speed single-pass drawing with uniform solid opacity
    const particles: { x: number; y: number; r: number }[] = [];

    // Starburst glints
    const starbursts: {
      x: number;
      y: number;
      r: number;
      p: number;
      intensity: number;
    }[] = [];

    const render = (timestamp: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const currentTime = (timestamp / 1000) * timeScale;
      const rawTimeSec = timestamp / 1000;

      // Clean expired clicks (older than 3.5s)
      for (let i = activeClicks.length - 1; i >= 0; i--) {
        if (rawTimeSec - activeClicks[i].time > 3.5) {
          activeClicks.splice(i, 1);
        }
      }

      // Clear background with crisp pure white
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      particles.length = 0;
      starbursts.length = 0;

      const cols = Math.ceil(width / gridGap);
      const rows = Math.ceil(height / gridGap);
      const aspect = width / (height || 1);

      // JetBrains base noise scale: 3.2 in UV space
      const uvScale = 3.2;

      for (let r = 0; r <= rows; r++) {
        const y = r * gridGap;
        const normY = y / (height || 1);
        const bayerRow = r & 7;

        for (let c = 0; c <= cols; c++) {
          const x = c * gridGap;
          const normX = x / (width || 1);
          const bayerCol = c & 7;
          const bayerValue = BAYER_8X8[bayerRow][bayerCol];

          // Compute turbulent base noise value using JetBrains flow & vortex algorithm
          const uvX = normX * uvScale * aspect;
          const uvY = normY * uvScale;
          const baseNoise = fbmTurbulentFlow(uvX, uvY, currentTime);

          // Calculate accumulated wave effect from active clicks
          let totalWaveEffect = 0.0;
          if (activeClicks.length > 0) {
            for (let i = 0; i < activeClicks.length; i++) {
              const click = activeClicks[i];
              const timeSinceClick = rawTimeSec - click.time;

              if (timeSinceClick >= 0.0 && timeSinceClick < 3.2) {
                const dx = (normX - click.normX) * aspect;
                const dy = normY - click.normY;
                const distToClick = Math.sqrt(dx * dx + dy * dy);

                // Wave equation directly from JetBrains Junie shader
                let wave = Math.sin(distToClick * 15.0 - timeSinceClick * 3.2);
                wave = wave * 0.5 + 0.5;

                const temporalFalloff = Math.max(
                  0.0,
                  1.0 - timeSinceClick / 3.2,
                );
                const spatialFalloff = Math.exp(-distToClick * 3.4);
                wave *= spatialFalloff * temporalFalloff;
                wave = Math.pow(wave, 2.4);

                totalWaveEffect += wave * 0.65;
              }
            }
          }

          // Combine base noise and accumulated wave shockwave
          let finalNoise = baseNoise + totalWaveEffect;

          // Apply JetBrains contrast and brightness curve
          const contrast = 1.35;
          const brightness = -0.58; // Negative brightness ensures large clean white space
          finalNoise =
            (finalNoise - 0.5) * contrast +
            0.5 +
            brightness +
            totalWaveEffect * 0.5;
          finalNoise = Math.max(0.0, Math.min(1.0, finalNoise));

          // Apply JetBrains Ordered 8x8 Bayer Dithering
          const spread = 0.48;
          const ditherOffset = spread * (bayerValue - 0.5);
          const ditheredVal = Math.max(
            0.0,
            Math.min(1.0, finalNoise + ditherOffset),
          );

          // Threshold check: empty space vs visible particle
          if (ditheredVal <= 0.32) {
            continue;
          }

          // Uniform particle sizing with exact same solid opacity
          const rSize = particleRadius;

          // Bursting Star Animation for select candidate particles (~3% of dense points)
          const starSeed = (c * 7919 + r * 104729) % 1000;
          if (ditheredVal >= 0.7 && starSeed % 29 === 0) {
            const phaseOffset = (starSeed / 1000) * 10.0;
            const starPeriod = 6.5; // seconds
            const starCycle =
              ((rawTimeSec + phaseOffset) % starPeriod) / starPeriod;

            if (starCycle < 0.25) {
              const p = starCycle / 0.25;
              const intensity = Math.sin(p * Math.PI);
              starbursts.push({ x, y, r: rSize, p, intensity });
            }
          }

          particles.push({ x, y, r: rSize });
        }
      }

      // Draw all particles with exact same solid Tailwind red-500 (rgb(239, 68, 68)) opacity
      ctx.fillStyle = "rgb(239, 68, 68)";
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();

      // Draw indistinct bursting star micro-flares and expanding soft halos in red-500
      if (starbursts.length > 0) {
        for (let i = 0; i < starbursts.length; i++) {
          const star = starbursts[i];
          const { x, y, r, p, intensity } = star;

          // Expanding soft halo shockwave
          const haloRadius = r * (1.1 + 2.4 * p);
          const haloAlpha = 0.35 * (1 - p) * intensity;
          if (haloAlpha > 0.01) {
            ctx.strokeStyle = `rgba(239, 68, 68, ${haloAlpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Indistinct 4-point celestial glint rays
          const rayLen = r * (1.6 + 2.8 * intensity);
          const rayAlpha = 0.35 * intensity;
          if (rayAlpha > 0.01) {
            ctx.strokeStyle = `rgba(239, 68, 68, ${rayAlpha.toFixed(3)})`;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(x - rayLen, y);
            ctx.lineTo(x + rayLen, y);
            ctx.moveTo(x, y - rayLen);
            ctx.lineTo(x, y + rayLen);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointerdown", handleClick);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gridGap, particleRadius, timeScale]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto select-none ${className}`}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
