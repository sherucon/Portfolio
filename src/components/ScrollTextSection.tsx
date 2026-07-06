"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined" && !("ScrollTrigger" in window)) {
  gsap.registerPlugin(ScrollTrigger);
}

const text = `Finding a genuine connection takes time. Starting a chat on Zoop takes seconds.
  Unlimited conversations.
  Total privacy.
  No waiting.`;

export default function ScrollTextSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Split text into words for animation
    const words = textRef.current.querySelectorAll(".word");
    const phones = containerRef.current.querySelectorAll(".phone");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=350%",
        pin: true,
        scrub: 1,
      },
    });

    tl.fromTo(
      words,
      { opacity: 0.05 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
      },
    );

    tl.fromTo(
      phones,
      { opacity: 0, y: 150, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.2,
        duration: 0.5,
        ease: "back.out(1.2)",
      },
      "+=0.2",
    )
    .to({}, { duration: 1.0 }); // Add a pause at the end of the timeline

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(
        (t) => t.trigger === containerRef.current && t.kill(),
      );
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-[#f2f2f2] flex items-center justify-center min-h-screen px-8 py-24 z-10 relative"
    >
      <div className="w-full max-w-[1450px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          ref={textRef}
          className="font-serif font-bold text-4xl md:text-5xl leading-[1.3] text-black z-10"
        >
          {text.split("\n").map((line, lineIndex) => (
            <div key={lineIndex}>
              {line
                .trim()
                .split(" ")
                .map((word, wordIndex) => (
                  <span
                    key={`${lineIndex}-${wordIndex}`}
                    className="word inline-block mr-[0.25em]"
                  >
                    {word}
                  </span>
                ))}
            </div>
          ))}
        </div>
        <div className="relative flex justify-center items-center h-[50vh] md:h-auto min-h-[400px]">
          <img
            src="/assets/phone2.png"
            alt="Phone App Mockup"
            className="phone absolute w-48 md:w-[300px] rotate-[-10deg] -translate-x-12 md:-translate-x-32 rounded-[3rem]"
          />
          <img
            src="/assets/phone1.png"
            alt="Phone App Mockup"
            className="phone absolute w-48 md:w-[310px] rotate-[0deg] translate-x-12 md:translate-x-16 translate-y-12 rounded-[3rem]"
          />
        </div>
      </div>
    </section>
  );
}
