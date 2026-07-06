'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register ScrollTrigger
if (typeof window !== 'undefined' && !('ScrollTrigger' in window)) {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate features on scroll with stagger
    if (featuresRef.current) {
      gsap.from(featuresRef.current.children, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top bottom-=100',
          end: 'bottom top+=100',
          scrub: 1,
        },
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }
  }, []);

  return (
    <section className="relative py-20 bg-white dark:bg-gray-900" ref={containerRef}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Why Zoop?
          </h2>
          <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-300">
            Discover what makes Zoom different from other chat apps
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" ref={featuresRef}>
          {/* Meet New People */}
          <div className="text-center p-6 bg-white/5 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-800/60 transition-all duration-300 transform hover:-scale-[102%]">
            <div className="mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Meet New People
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with interesting people from around the world who share your interests and curiosity.
            </p>
          </div>

          {/* Instant Conversations */}
          <div className="text-center p-6 bg-white/5 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-800/60 transition-all duration-300 transform hover:-scale-[102%]">
            <div className="mb-4">
              <span className="text-4xl">⚡</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Instant Conversations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No waiting, no games. Start real conversations immediately after matching.
            </p>
          </div>

          {/* Privacy First */}
          <div className="text-center p-6 bg-white/5 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white/10 dark:hover:bg-gray-800/60 transition-all duration-300 transform hover:-scale-[102%]">
            <div className="mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your conversations are private and secure. No data mining, no ads, just genuine connections.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}