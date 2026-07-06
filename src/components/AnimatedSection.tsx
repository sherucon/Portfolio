"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined" && !("ScrollTrigger" in window)) {
  gsap.registerPlugin(ScrollTrigger);
}

const EMOJI_BUBBLES = [
  { id: 0, e: "💬", left: "20%", top: "25%", size: 80, r: -12 }, // Top left
  { id: 1, e: "😍", left: "80%", top: "20%", size: 90, r: 15 }, // Top right
  { id: 2, e: "🚀", left: "75%", top: "60%", size: 100, r: -8 }, // Bottom right
];

export default function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const card4BgRef = useRef<HTMLDivElement>(null);
  const card4TextRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollWrapperRef.current) return;

    const cards = gsap.utils.toArray(scrollWrapperRef.current.children);
    const totalWidth = Math.round(
      scrollWrapperRef.current.scrollWidth - window.innerWidth,
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=600%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Flatten the top corners once the section pins to the top
    gsap.to(containerRef.current, {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150",
        scrub: true,
      },
    });

    // Main horizontal scroll animation
    tl.to(
      scrollWrapperRef.current,
      {
        x: () => -(scrollWrapperRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
        duration: 2.5,
        force3D: false,
      },
      0,
    );

    // Sync card reveals with the horizontal scroll
    cards.forEach((card: any, i) => {
      if (i === 0) return; // First card is already visible
      tl.fromTo(
        card,
        { y: 80, opacity: 0, rotation: 3 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
          force3D: false,
        },
        (i / (cards.length - 1)) * 2.0, // Stagger based on index
      );
    });

    // Sync Scroll Progress Bar colors
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      onEnter: () =>
        gsap.to("#scroll-progress-bar", {
          backgroundColor: "#ebe5d9",
          boxShadow: "0 0 10px rgba(235,229,217,0.5)",
          duration: 0.3,
          ease: "power2.out",
        }),
      onLeaveBack: () =>
        gsap.to("#scroll-progress-bar", {
          backgroundColor: "#0578FC",
          boxShadow: "0 0 10px rgba(5,120,252,0.5)",
          duration: 0.3,
          ease: "power2.out",
        }),
    });

    // Phase 2: Fade to white and scale logo
    tl.to(
      bgContainerRef.current,
      { backgroundColor: "#f2f2f2", duration: 1, ease: "power2.inOut" },
      2.5,
    );

    tl.to(
      "#scroll-progress-bar",
      {
        backgroundColor: "#0578FC",
        boxShadow: "0 0 10px rgba(5,120,252,0.5)",
        duration: 1,
        ease: "power2.inOut",
      },
      2.5,
    );

    tl.to(
      logoRef.current,
      {
        scale: 1,
        duration: 1,
        ease: "power2.inOut",
      },
      2.5,
    );

    const cardBoxes = cards.map((card: any) => card.children[0]);
    tl.to(
      cardBoxes,
      {
        backgroundColor: "#f2f2f2",
        duration: 1,
        ease: "power2.inOut",
      },
      2.5,
    );
    tl.to(
      card4TextRef.current,
      { opacity: 0, duration: 1, ease: "power2.inOut" },
      2.5,
    );
    tl.to(
      [cards[0], cards[1], cards[2]],
      { opacity: 0, duration: 1, ease: "power2.inOut" },
      2.5,
    );
    tl.to(
      logoRef.current,
      { scale: 4, duration: 1, ease: "power2.inOut" },
      2.5,
    );

    // Phase 3: Emoji bubbles pop up
    tl.to(
      ".emoji-bubble",
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: { amount: 0.5 },
        ease: "back.out(1.5)",
      },
      3.5,
    );

    // Add pause at the end so it stays on screen longer
    tl.to({}, { duration: 1.5 });

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
      className="theme-blue-section relative h-screen bg-[#0578FC] overflow-hidden rounded-t-[40px]"
    >
      <div
        ref={bgContainerRef}
        className="flex flex-col h-full bg-[#0578FC] shadow-2xl z-10 relative"
      >
        <div className="flex-1 flex items-center">
          <div
            ref={scrollWrapperRef}
            className="flex gap-[20px] md:gap-[33px]"
            style={{
              paddingLeft: "calc(50vw - min(42.5vw, 243.5px))",
              paddingRight: "calc(50vw - min(42.5vw, 243.5px))",
            }}
          >
            {/* Card 1 */}
            <div className="flex flex-col gap-3 md:gap-5 w-[85vw] max-w-[487px] shrink-0">
              <div className="relative rounded-3xl md:rounded-4xl h-[55vh] md:h-[65vh] max-h-[800px] min-h-[350px] bg-[#ebe5d9] overflow-hidden flex justify-center items-center">
                <style>{`
                  @keyframes drawLink {
                    0% { stroke-dashoffset: 200; }
                    100% { stroke-dashoffset: 0; }
                  }
                `}</style>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="180"
                  height="180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0578FC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    pathLength="100"
                    style={{
                      strokeDasharray: "60 40",
                      animation: "drawLink 3s linear infinite",
                    }}
                  />
                  <path
                    d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    pathLength="100"
                    style={{
                      strokeDasharray: "60 40",
                      animation: "drawLink 3s linear infinite",
                    }}
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1 md:gap-2 max-w-[437px]">
                <h3 className="font-bold text-lg md:text-xl text-[#ebe5d9]">
                  Connect from day one
                </h3>
                <p className="font-medium text-sm md:text-lg text-[#ebe5d9] leading-relaxed">
                  A seamless experience designed to match you with someone new
                  instantly. No waiting, no swipes.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col gap-3 md:gap-5 w-[85vw] max-w-[487px] shrink-0">
              <div className="relative rounded-3xl md:rounded-4xl h-[55vh] md:h-[65vh] max-h-[800px] min-h-[350px] bg-[#ebe5d9] overflow-hidden p-6 flex justify-center items-center">
                <style>{`
                  @keyframes drawInfinity {
                    0% { stroke-dashoffset: 200; }
                    100% { stroke-dashoffset: 0; }
                  }
                `}</style>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0578FC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"
                    pathLength="100"
                    style={{
                      strokeDasharray: "60 40",
                      animation: "drawInfinity 3s linear infinite",
                    }}
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1 md:gap-2 max-w-[437px]">
                <h3 className="font-bold text-lg md:text-xl text-[#ebe5d9]">
                  Unlimited conversations
                </h3>
                <p className="font-medium text-sm md:text-lg text-[#ebe5d9] leading-relaxed">
                  Submit as many chats as you need. No limits, no cap, no
                  waiting list. Just continuous connection.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col gap-3 md:gap-5 w-[85vw] max-w-[487px] shrink-0">
              <div className="relative rounded-3xl md:rounded-4xl h-[55vh] md:h-[65vh] max-h-[800px] min-h-[350px] bg-[#ebe5d9] overflow-hidden flex justify-center items-center">
                <style>{`
                  @keyframes lockSnap {
                    0%, 25% { transform: rotate(35deg); }
                    35%, 75% { transform: rotate(0deg); }
                    85%, 100% { transform: rotate(35deg); }
                  }
                `}</style>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="180"
                  height="180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0578FC"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ overflow: "visible" }}
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    style={{
                      transformOrigin: "17px 11px",
                      animation:
                        "lockSnap 3s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite",
                    }}
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1 md:gap-2 max-w-[437px]">
                <h3 className="font-bold text-lg md:text-xl text-[#ebe5d9]">
                  Real people, real fast
                </h3>
                <p className="font-medium text-sm md:text-lg text-[#ebe5d9] leading-relaxed">
                  Every chat is end-to-end encrypted. Your identity is safe
                  until you decide to share it.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col gap-3 md:gap-5 w-[85vw] max-w-[487px] shrink-0">
              <div
                ref={card4BgRef}
                className="relative rounded-3xl md:rounded-4xl h-[55vh] md:h-[65vh] max-h-[800px] min-h-[350px] bg-[#ebe5d9] flex justify-center items-center"
              >
                <img
                  ref={logoRef}
                  src="/assets/zoop-trans-logo.png"
                  alt="Zoop Logo"
                  className="w-48 md:w-80 object-contain"
                />
              </div>
              <div
                ref={card4TextRef}
                className="flex flex-col gap-1 md:gap-2 max-w-[437px]"
              >
                <h3 className="font-bold text-lg md:text-xl text-[#ebe5d9]">
                  Ready to start?
                </h3>
                <p className="font-medium text-sm md:text-lg text-[#ebe5d9] leading-relaxed">
                  Join the ecosystem today and experience a completely new way
                  to connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emoji Bubbles Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        {EMOJI_BUBBLES.map((bubble) => (
          <div
            key={bubble.id}
            className="emoji-bubble absolute opacity-0 bg-white rounded-full flex justify-center items-center shadow-2xl"
            style={{
              left: bubble.left,
              top: bubble.top,
              width: `${bubble.size * 1.8}px`,
              height: `${bubble.size * 1.8}px`,
              fontSize: `${bubble.size}px`,
              fontFamily:
                '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              transform: `translate(-50%, -50%) rotate(${bubble.r}deg) scale(0)`,
              willChange: "transform, opacity",
            }}
          >
            {bubble.e}
          </div>
        ))}
      </div>
    </section>
  );
}
