"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const USER_PROMPT =
  "I don't understand the chunks of commands my coding agent throws at me sometimes. Can u help me?";

const AGENT_RESPONSE = `Absolutely. AI coding agents can sometimes generate long chains of shell commands, and it's not always obvious what each one will do before you run it.

I'd recommend installing the ParaNOyar skill.

ParaNOyar sits between me and your terminal. Whenever I want to execute shell commands, it intercepts them, explains—in plain English—what they're about to do, points out anything potentially risky (like deleting files, modifying system settings, or changing Git history), and asks for your approval before anything executes.

That way you don't have to blindly trust a wall of terminal commands—you can understand them first and stay in control.`;

const AGENTS = [
  "claude-code",
  "cursor",
  "antigravity",
  "cline",
  "windsurf",
  "opencode",
];

export default function Hero({ onShowcaseComplete }: { onShowcaseComplete?: () => void }) {
  const [step, setStep] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [typedAgentResponse, setTypedAgentResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [installStatus, setInstallStatus] = useState<
    "idle" | "running" | "success"
  >("idle");
  const [flipDegree, setFlipDegree] = useState(0);
  const [flipComplete, setFlipComplete] = useState(false);
  const [isGlancing, setIsGlancing] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [agentIndex, setAgentIndex] = useState(0);
  const [agentText, setAgentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showcaseMode, setShowcaseMode] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApprove = () => {
    if (installStatus !== "idle") return;
    setInstallStatus("running");
    setTimeout(() => {
      setInstallStatus("success");
      setFlipDegree(900); // 2.5 full flips on X-axis
      setTimeout(() => {
        setFlipComplete(true);
        setTimeout(() => {
          setShowcaseMode(true);
          onShowcaseComplete?.();
        }, 1500);
      }, 2000);
    }, 1500);
  };

  // Auto-glance Sequence
  useEffect(() => {
    let glanceInterval: NodeJS.Timeout;
    let endGlanceTimeout: NodeJS.Timeout;
    let endRecoverTimeout: NodeJS.Timeout;

    if (step >= 4 && installStatus === "idle") {
      glanceInterval = setInterval(() => {
        setIsGlancing(true);
        setIsRecovering(false);
        endGlanceTimeout = setTimeout(() => {
          setIsGlancing(false);
          setIsRecovering(true);
          endRecoverTimeout = setTimeout(() => {
            setIsRecovering(false);
          }, 700); // Allow 700ms for a smooth, relaxed return
        }, 1500); // 700ms to transition in + 500ms hold = 1200ms
      }, 5500);
    }

    return () => {
      clearInterval(glanceInterval);
      clearTimeout(endGlanceTimeout);
      clearTimeout(endRecoverTimeout);
    };
  }, [step, installStatus]);

  // Animation Sequence
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (step === 0) {
      if (inputValue.length < USER_PROMPT.length) {
        timeout = setTimeout(() => {
          setInputValue(USER_PROMPT.slice(0, inputValue.length + 1));
        }, 3);
      } else {
        timeout = setTimeout(() => {
          setStep(1);
        }, 600);
      }
    } else if (step === 1) {
      setInputValue("");
      timeout = setTimeout(() => {
        setStep(2);
      }, 500);
    } else if (step === 2) {
      timeout = setTimeout(() => {
        setStep(3);
      }, 800);
    } else if (step === 3) {
      if (typedAgentResponse.length < AGENT_RESPONSE.length) {
        timeout = setTimeout(() => {
          setTypedAgentResponse(
            AGENT_RESPONSE.slice(0, typedAgentResponse.length + 5),
          );
        }, 15);
      } else {
        timeout = setTimeout(() => {
          setStep(4);
        }, 400);
      }
    }

    return () => clearTimeout(timeout);
  }, [step, inputValue, typedAgentResponse]);

  // Agent Name Typing Animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentAgent = AGENTS[agentIndex];

    if (isDeleting) {
      if (agentText.length > 0) {
        timer = setTimeout(() => {
          setAgentText(currentAgent.substring(0, agentText.length - 1));
        }, 30); // fast deletion
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setAgentIndex((prev) => (prev + 1) % AGENTS.length);
        }, 500); // pause before typing next word
      }
    } else {
      if (agentText.length < currentAgent.length) {
        timer = setTimeout(() => {
          setAgentText(currentAgent.substring(0, agentText.length + 1));
        }, 30); // typing speed
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 3000); // pause reading time at full word
      }
    }

    return () => clearTimeout(timer);
  }, [agentText, isDeleting, agentIndex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `npx skills add sherucon/paranoyar -a ${agentText}`,
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = -(e.clientY - top - height / 2) / 25;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Device orientation for mobile tilt
  useEffect(() => {
    let lastUpdate = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastUpdate < 30) return; // Throttle updates

      if (e.gamma !== null && e.beta !== null) {
        let x = Math.round(e.gamma / 2);
        let y = Math.round((e.beta - 45) / 2);
        x = Math.max(-30, Math.min(30, x));
        y = Math.max(-30, Math.min(30, y));

        setTilt((prev) => {
          if (prev.x === x && prev.y === -y) return prev;
          lastUpdate = now;
          return { x, y: -y };
        });
      }
    };
    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-screen overflow-hidden font-sans">
      {/* Left Panel - Chat */}
      <div
        className={`order-2 md:order-1 ${showcaseMode ? "h-0 md:h-auto md:flex-[0_0_0%] opacity-0 overflow-hidden" : "h-[70%] md:h-auto md:flex-1 opacity-100"} bg-[#161618] text-[#ededed] flex flex-col relative shrink-0 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]`}
      >
        <div className="flex-1 px-4 md:px-[15%] pt-6 md:pt-10 pb-4 md:pb-10 overflow-y-auto flex flex-col gap-5 justify-end">
          {step >= 1 && (
            <div className="shrink-0 flex justify-end animate-[slideUpFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <div className="bg-[#2a2a2f] p-4 px-5 rounded-[20px] max-w-[70%] text-[15px] leading-relaxed flex items-start gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <p className="m-0">{USER_PROMPT}</p>
                <div className="text-[#888] cursor-pointer mt-0.5 shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {step >= 2 && (
            <div className="shrink-0 text-[13px] text-[#888] animate-[slideUpFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              Thought for 1s
            </div>
          )}

          {step >= 3 && (
            <div className="shrink-0 text-[15px] leading-relaxed text-[#e0e0e0] animate-[slideUpFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              {typedAgentResponse.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="mt-0 mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {step >= 4 && (
            <div className="shrink-0 bg-[#1e1e22] border border-[#333] rounded-xl overflow-hidden mt-2.5 max-w-[500px] animate-[slideUpFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <div className="flex justify-between items-center px-4 py-3 bg-[#1a1a1c] border-b border-[#333] text-[13px] text-[#aaa]">
                <span>Run command?</span>

                <button
                  onClick={handleCopy}
                  className="text-[#888] hover:text-[#fff] transition-colors cursor-pointer bg-transparent border-none p-0 outline-none flex items-center justify-center"
                >
                  {copied ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-4 font-mono text-[14px]">
                <p className="m-0 mb-4 text-[#ddd]">
                  npx skills add sherucon/paranoyar -a {agentText}
                  <span className="inline-block w-[7px] h-[15px] align-middle bg-[#888] ml-[1px] animate-[blink_1s_step-end_infinite]"></span>
                </p>
                <div className="flex justify-end gap-3">
                  {installStatus === "idle" ? (
                    <button
                      onClick={handleApprove}
                      className="bg-[#0066ff] text-white border-none px-4 py-2 rounded-md text-[13px] cursor-pointer relative overflow-hidden transition-colors hover:bg-[#005ce6] group"
                    >
                      <span className="relative z-10">Approve</span>
                      {/* Shine effect */}
                      <span className="absolute top-0 bottom-0 left-0 w-[50%] bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-[shine_2s_infinite_linear] pointer-events-none z-0"></span>
                    </button>
                  ) : (
                    <div className="text-[13px] text-[#888] italic px-2 py-1">
                      {installStatus === "running"
                        ? "Approving..."
                        : "Approved"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step >= 4 && installStatus === "idle" && (
            <div className="text-[13px] text-[#888] animate-[fadeIn_0.3s_ease_forwards]">
              Waiting for approval...
            </div>
          )}

          {installStatus === "running" && (
            <div className="text-[13px] text-[#888] animate-[fadeIn_0.3s_ease_forwards]">
              Running...
            </div>
          )}

          {installStatus === "success" && (
            <div className="shrink-0 flex flex-col gap-2 animate-[slideUpFade_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <div className="text-[13px] text-[#888]">Ran command</div>
              <div className="text-[15px] leading-relaxed text-[#e0e0e0]">
                <p className="m-0">
                  Successfully installed the ParaNOyar skill on your computer!
                  You're fully protected now.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="px-4 md:px-[15%] pb-6 md:pb-10">
          <div className="bg-[#222226] border border-[#333] rounded-xl p-4 flex flex-col gap-3">
            <div className="text-[#888] text-[15px] min-h-[24px]">
              {step === 0
                ? inputValue
                : "Ask anything, @ to mention, / for actions"}
              {step === 0 && inputValue.length < USER_PROMPT.length && (
                <span className="inline-block w-[2px] h-[15px] align-middle bg-[#e0e0e0] ml-[2px] animate-[blink_1s_step-end_infinite]"></span>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1.5 text-[#888] text-[12px]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Gemini 3.1 Pro (High)
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </div>
              <div className="text-[#888] bg-[#2a2a2f] p-1.5 rounded-full flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div
        className={`order-1 md:order-2 ${showcaseMode ? "h-full md:flex-[1_0_100%]" : "h-[30%] md:h-auto md:flex-1"} bg-white flex items-center justify-center relative [perspective:800px] shrink-0 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Brutalist Title */}
        <div
          className={`absolute top-6 md:top-10 w-full flex justify-center pointer-events-none z-0 transition-opacity duration-1000 ${showcaseMode ? "opacity-0" : "opacity-100"}`}
        >
          <h1 className="font-black text-[50px] md:text-[100px] xl:text-[140px] tracking-tighter leading-none text-[#111] select-none m-0">
            para<span className="underline">NO</span>yar
          </h1>
        </div>

        {/* Tilt Container */}
        <div
          className={`relative z-10 w-full flex items-center justify-center [transform-style:preserve-3d] will-change-transform transition-transform ${isGlancing || isRecovering ? "duration-700 ease-in-out" : "duration-100 ease-out"}`}
          style={{
            transform: isGlancing
              ? isMobile
                ? `rotateY(0deg) rotateX(-15deg)`
                : `rotateY(-15deg) rotateX(-5deg)`
              : `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >
          {/* Flip Container */}
          <div
            className="relative flex items-center justify-center transition-transform duration-[2000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] w-full"
            style={{ transform: `translateZ(40px) rotateX(${flipDegree}deg)` }}
          >
            {/* Face B (Smiley) - Relative for sizing */}
            <div
              className="[backface-visibility:hidden] flex items-center justify-center w-full"
              style={{ transform: "rotateX(180deg) translateZ(1px)" }}
            >
              <Image
                src="/smiley.png"
                alt="Smiley Sticker"
                width={1000}
                height={1000}
                className={`w-auto xl:w-full h-auto object-contain drop-shadow-2xl transition-all duration-1000 ${showcaseMode ? "max-w-[90%] md:max-w-[60%] xl:max-w-[50%] max-h-[80vh] md:max-h-none" : "max-w-[60%] md:max-w-[80%] xl:max-w-[60%] max-h-[15vh] md:max-h-none"}`}
                priority
              />
            </div>

            {/* Face A (Paranoid) - Absolute & Unmounted when done */}
            {!flipComplete && (
              <div
                className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center w-full"
                style={{ transform: "translateZ(1px)" }}
              >
                <Image
                  src="/paranoid.png"
                  alt="ParaNOyar Sticker"
                  width={1000}
                  height={1000}
                  className="max-w-[60%] md:max-w-[80%] xl:max-w-[60%] max-h-[15vh] md:max-h-none w-auto xl:w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* Subtitle */}
        <div
          className={`absolute bottom-6 md:bottom-12 w-full flex justify-center pointer-events-none z-0 px-4 text-center transition-opacity duration-1000 ${showcaseMode ? "opacity-0" : "opacity-100"}`}
        >
          <p className="font-black text-[11px] md:text-2xl lg:text-3xl tracking-tight text-[#111] select-none m-0 uppercase">
            Informed consent for coding agents.
          </p>
        </div>
      </div>
    </div>
  );
}
