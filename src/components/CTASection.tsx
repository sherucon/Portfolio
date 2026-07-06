"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function CTASection() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const xTo = useRef<any>(null);
    const yTo = useRef<any>(null);

    useEffect(() => {
        if (!cursorRef.current) return;
        xTo.current = gsap.quickTo(cursorRef.current, "x", {
            duration: 0.15,
            ease: "power3.out",
        });
        yTo.current = gsap.quickTo(cursorRef.current, "y", {
            duration: 0.15,
            ease: "power3.out",
        });
    }, []);

    useEffect(() => {
        if (cursorRef.current) {
            gsap.to(cursorRef.current, {
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [isHovered]);

    const handleMouseEnter = (e: React.MouseEvent) => {
        setIsHovered(true);
        // Set position immediately without animation so it doesn't fly in from corner
        gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        xTo.current?.(e.clientX);
        yTo.current?.(e.clientY);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText("sh3rucon@gmail.com");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <footer className="relative bg-[#f2f2f2] pt-10 pb-12 flex rounded-t-[50px] flex-col gap-0 z-10 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col md:flex-row gap-6 max-w-[1200px] w-full mx-auto px-10">
                {/* Left Blue Block */}
                <div className="flex-none w-full md:w-[380px] bg-gradient-to-br from-[#0578FC] to-[#0460ca] rounded-[24px] p-10 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                    <div className="flex items-left gap-2">
                        <Image
                            src="/assets/zoop-trans-logo-white.png"
                            width={60}
                            height={60}
                            alt=""
                        />
                    </div>
                    <div>
                        <p className="font-sans font-semibold text-lg text-white m-0 leading-[1.4]">
                            A concept in
                        </p>
                        <p className="font-sans font-normal text-lg text-white/70 m-0 leading-[1.4]">
                            connection.
                        </p>
                    </div>
                </div>

                {/* Right White Block */}
                <div className="flex-1 bg-white rounded-[24px] p-10 flex flex-col justify-between relative overflow-hidden min-h-[320px]">
                    <div className="flex flex-row gap-16">
                        <div>
                            <p className="font-sans font-medium text-[13px] text-[#535862] tracking-[0.5px] uppercase mb-4">
                                Connect
                            </p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href="https://sherucon.vercel.app"
                                    target="_blank"
                                    className="font-sans font-semibold text-[17px] text-[#0a0d12] hover:text-[#0578FC] transition-colors"
                                >
                                    Portfolio
                                </a>
                                <a
                                    href="https://linkedin.com/in/sherucon"
                                    target="_blank"
                                    className="font-sans font-semibold text-[17px] text-[#0a0d12] hover:text-[#0578FC] transition-colors"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="https://x.com/sherucon"
                                    target="_blank"
                                    className="font-sans font-semibold text-[17px] text-[#0a0d12] hover:text-[#0578FC] transition-colors"
                                >
                                    Twitter
                                </a>
                            </div>
                        </div>
                        <div>
                            <p className="font-sans font-medium text-[13px] text-[#535862] tracking-[0.5px] uppercase mb-4">
                                Source
                            </p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href="https://github.com/sherucon/zoop"
                                    target="_blank"
                                    className="font-sans font-semibold text-[17px] text-[#0a0d12] hover:text-[#0578FC] transition-colors"
                                >
                                    GitHub Repository
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Large Email Text */}
            <div
                className="w-full mt-10 px-10 box-border text-center cursor-none"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsCopied(false);
                }}
                onMouseMove={handleMouseMove}
                onClick={handleCopy}
            >
                <svg
                    viewBox="0 0 900 85"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-auto block"
                >
                    <text
                        x="450"
                        y="70"
                        textAnchor="middle"
                        className="font-sans font-black text-[80px] tracking-[-0.04em] fill-black/5"
                    >
                        sh3rucon@gmail.com
                    </text>
                </svg>
            </div>

            {/* Custom Cursor */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-full text-white font-sans font-bold text-sm tracking-wide ${isCopied
                    ? "bg-[#0578FC] shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    : "bg-[#0578FC] shadow-[0_0_20px_rgba(5,120,252,0.5)]"
                    }`}
                style={{
                    width: "120px",
                    height: "30px",
                    marginTop: "-60px",
                    marginLeft: "-60px",
                    opacity: 0,
                    transform: "scale(0)",
                }}
            >
                {isCopied ? "Copied!" : "Click to copy!"}
            </div>
        </footer>
    );
}
