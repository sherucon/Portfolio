"use client";

import HeroSection from "@/components/HeroSection";

import ScrollTextSection from "@/components/ScrollTextSection";
import AnimatedSection from "@/components/AnimatedSection";
import DetailsSection from "@/components/DetailsSection";
import CTASection from "@/components/CTASection";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  return (
    <main className="bg-[#f2f2f2] min-h-screen">
      <HeroSection />
      <ScrollTextSection />
      <AnimatedSection />
      <DetailsSection />
      <CTASection />
    </main>
  );
}
