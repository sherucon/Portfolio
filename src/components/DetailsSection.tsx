"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
if (typeof window !== "undefined" && !("ScrollTrigger" in window)) {
  gsap.registerPlugin(ScrollTrigger);
}
export default function DetailsSection() {
  const outerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !outerRef.current ||
      !containerRef.current ||
      !headerRef.current ||
      !lineRef.current ||
      !leftColRef.current ||
      !rightColRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const leftChildren = gsap.utils.toArray(leftColRef.current.children);
      const rightChildren = gsap.utils.toArray(rightColRef.current.children);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      tl.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
      )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, ease: "power3.inOut" },
          "-=0.2",
        )
        .fromTo(
          leftChildren,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.2",
        )
        .fromTo(
          rightChildren,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .to({}, { duration: 1.0 }); // Add a pause at the end of the timeline
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={outerRef} className="relative h-[300vh] w-full z-0">
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-full bg-[#f2f2f2] py-24 px-8 flex flex-col justify-center items-center overflow-hidden"
      >
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Header */}
          <div ref={headerRef} className="mb-8">
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-[#0a0d12] mb-2 tracking-tight">
              The Zoop Ecosystem
            </h2>
            <p className="font-sans font-medium text-xl md:text-2xl text-[#535862]">
              Modern Architecture
            </p>
          </div>
          {/* Separator Line */}
          <div ref={lineRef} className="w-full h-[1px] bg-gray-300 mb-12" />
          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
            {/* Left Column (Metadata) */}
            <div ref={leftColRef} className="flex flex-col gap-10">
              <div>
                <h3 className="font-sans font-bold text-[13px] text-[#535862] tracking-wider uppercase mb-4">
                  Platforms
                </h3>
                <ul className="flex flex-col gap-3 font-sans font-medium text-lg text-[#0a0d12]">
                  <li>Expo (Cross-platform)</li>
                  <li>Web Client</li>
                </ul>
              </div>
              <div>
                <h3 className="font-sans font-bold text-[13px] text-[#535862] tracking-wider uppercase mb-4">
                  Core Tech
                </h3>
                <ul className="flex flex-col gap-3 font-sans font-medium text-lg text-[#0a0d12]">
                  <li>React Frontend</li>
                  <li>Firebase Auth</li>
                  <li>Stream Chat</li>
                </ul>
              </div>
              <div>
                <h3 className="font-sans font-bold text-[13px] text-[#535862] tracking-wider uppercase mb-4">
                  Launch
                </h3>
                <p className="font-sans font-medium text-lg text-[#0a0d12]">
                  Q3 2025
                </p>
              </div>
            </div>
            {/* Right Column (Description) */}
            <div ref={rightColRef} className="flex flex-col gap-10">
              <div>
                <h3 className="font-sans font-bold text-[13px] text-[#535862] tracking-wider uppercase mb-4">
                  Overview
                </h3>
                <p className="font-sans font-medium text-xl text-[#0a0d12] leading-relaxed">
                  Zoop is a random chat platform designed to make meeting new
                  people simple and spontaneous. Users are instantly paired with
                  strangers for one-on-one conversations without the friction of
                  profiles, feeds, or follower counts.
                </p>
              </div>
              <div>
                <h3 className="font-sans font-bold text-[13px] text-[#535862] tracking-wider uppercase mb-4">
                  Context
                </h3>
                <p className="font-sans font-medium text-xl text-[#0a0d12] leading-relaxed mb-6">
                  The application follows a client–server architecture, with a
                  React-based frontend providing the user experience, Firebase
                  handling authentication and user data, and Stream Chat
                  powering real-time messaging and presence.
                </p>
                <p className="font-sans font-medium text-xl text-[#0a0d12] leading-relaxed">
                  This modular architecture keeps the interface responsive,
                  scalable, and easy to extend while allowing each service to
                  focus on a specific responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
