"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined" && !("ScrollTrigger" in window)) {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      onEnter: () => gsap.to("#scroll-progress-bar", { backgroundColor: "#ebe5d9", boxShadow: "0 0 10px rgba(235,229,217,0.5)", duration: 0.3, ease: "power2.out" }),
      onLeave: () => gsap.to("#scroll-progress-bar", { backgroundColor: "#0578FC", boxShadow: "0 0 10px rgba(5,120,252,0.5)", duration: 0.3, ease: "power2.out" }),
      onEnterBack: () => gsap.to("#scroll-progress-bar", { backgroundColor: "#ebe5d9", boxShadow: "0 0 10px rgba(235,229,217,0.5)", duration: 0.3, ease: "power2.out" }),
      onLeaveBack: () => gsap.to("#scroll-progress-bar", { backgroundColor: "#0578FC", boxShadow: "0 0 10px rgba(5,120,252,0.5)", duration: 0.3, ease: "power2.out" }),
    });

    tl.to(textRef.current, { y: 150, opacity: 0, duration: 1 }, 0);
    tl.to(phoneRef.current, { y: 50, scale: 1.1, duration: 1 }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="theme-blue-section relative bg-[#0578FC] overflow-hidden flex flex-col items-center pt-[120px] pb-[42px] min-h-screen rounded-b-[40px] z-10"
    >
      <div ref={textRef} className="text-center px-8 pt-10 max-w-4xl z-20">
        <h1 className="font-serif font-bold text-7xl md:text-[80px] leading-[1.1] tracking-tight text-white mb-6">
          Meet someone new.
          <br />
          Instantly.
        </h1>
        <p className="font-sans font-semibold text-2xl md:text-[28px] leading-snug tracking-tight text-white z-0">
          Zoop is a modern, mobile-first random chat app built{" "}
          <br className="hidden md:block z-0" />
          around genuine conversations.
        </p>
      </div>

      <div
        ref={phoneRef}
        className="relative w-full max-w-[800px] mt-12 flex justify-center z-10 "
        style={{ perspective: "1100px" }}
      >
        <div className="relative z-10 w-[320px] md:w-[400px] rounded-[32px] p-2 overflow-hidden">
          <img
            src="/assets/phone3.png"
            alt="Zoop Chat Interface"
            className="w-full h-auto rounded-[24px]"
          />
        </div>
      </div>
    </section>
  );
}
