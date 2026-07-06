'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

if (typeof window !== 'undefined' && !('ScrollTrigger' in window)) {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LogoStripSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.from(textRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' });
    
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="bg-white flex justify-center py-24 overflow-hidden z-20 relative -mt-[40px] rounded-[40px]"
    >
      <div className="flex flex-col gap-8 items-center w-full max-w-7xl px-8">
        <p 
          ref={textRef}
          className="font-medium text-base text-[#535862] text-center m-0"
        >
          People are already connecting on Zoop.
        </p>
        <div className="flex flex-wrap gap-12 md:gap-[113px] items-center justify-center w-full opacity-50 grayscale text-black">
          {/* We'll just use a few placeholder SVGs or text to simulate logos for now */}
          <div className="text-xl font-bold font-serif">University</div>
          <div className="text-xl font-bold font-serif">TechHub</div>
          <div className="text-xl font-bold font-serif">StartupInc</div>
          <div className="text-xl font-bold font-serif">Creators</div>
        </div>
      </div>
    </section>
  );
}
