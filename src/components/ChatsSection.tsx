'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ChatsSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Create scroll-triggered animation for the image container (parallax effect)
    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -50,
        ease: 'none',
      });
    }

    // Animate image scale on scroll
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        {
          scale: 0.95,
          filter: 'brightness(0.9)',
          opacity: 0,
        },
        {
          scale: 1,
          filter: 'brightness(1)',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom+=100',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }

    // Animate title
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    // Animate features with stagger
    if (featuresRef.current) {
      gsap.from(featuresRef.current, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }

    // Add subtle pulse to the play button
    const playButton = document.querySelector('.play-button') as HTMLButtonElement | null;
    if (playButton) {
      gsap.to(playButton, {
        scale: 1.05,
        rotation: 0.01, // Triggers repaint for smoother animation
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <section className="relative py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* Phone image container */}
        <div className="relative mb-16" ref={imageContainerRef}>
          <img
            className="phone-image w-full h-auto rounded-2xl shadow-xl transition-transform duration-500"
            src="/assets/phone1.png"
            alt="Zoop Chats screen"
            ref={imageRef}
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="play-button relative w-14 h-14 bg-primary/20 backdrop-blur-sm rounded-full hover:bg-primary/30 transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Watch how it works"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                <path d="M5 4l11 7-11 7V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-8">
          <h2
            ref={titleRef}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Instant conversations, real people
          </h2>

          <div className="space-y-6 max-w-xl mx-auto text-left" ref={featuresRef}>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
              <span>Match with someone new in seconds</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
              <span>No profiles, no pressure—just conversation</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
              <span>Talk about anything, anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}