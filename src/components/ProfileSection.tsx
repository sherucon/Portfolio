'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProfileSection() {
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
        y: 50,
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
  }, []);

  return (
    <section className="relative py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* Phone image container */}
        <div className="relative mb-16" ref={imageContainerRef}>
          <img
            className="phone-image w-full h-auto rounded-2xl shadow-xl transition-transform duration-500"
            src="/assets/phone2.png"
            alt="Zoop Profile screen"
            ref={imageRef}
          />
        </div>

        {/* Content */}
        <div className="text-center space-y-8">
          <h2
            ref={titleRef}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Customize your profile, your way
          </h2>

          <div className="space-y-6 max-w-xl mx-auto text-left" ref={featuresRef}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <span>Choose your age range</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <span>Select your gender identity</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <span>Add your interests and hobbies</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <span>Control your privacy settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}