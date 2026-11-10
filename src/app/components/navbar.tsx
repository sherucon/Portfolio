"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const tabs: { label: string; href: string; id: string; dot?: boolean }[] = [
  { label: "Home", href: "/#home", id: "home" },
  { label: "Work", href: "/#work", id: "work", dot: true },
  { label: "About", href: "/#about", id: "about" },
  //{ label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") return;

    const update = () => {
      const marker = window.scrollY + 130;
      let current = "home";
      let currentTop = -1;
      for (const tab of tabs) {
        const el = document.getElementById(tab.id);
        if (el && el.offsetTop <= marker && el.offsetTop > currentTop) {
          current = tab.id;
          currentTop = el.offsetTop;
        }
      }
      setActiveSection(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  const activeIndex = Math.max(
    tabs.findIndex((t) =>
      pathname === "/" ? t.id === activeSection : t.id === pathname.slice(1),
    ),
    0,
  );

  return (
    <nav className="fixed bottom-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-fit pointer-events-none">
      {/*
       * Outer pill — liquid glass shell
       * - bg-white/10 + backdrop-blur for frosted glass base
       * - ring-1 ring-white/20 for the fine glass edge reflex
       * - shadow for depth
       */}
      <div className="relative flex items-center h-[52px] px-1 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.1)] pointer-events-auto">
        {/* Sliding active pill */}
        <div
          className="absolute top-1 left-1 h-[calc(100%-8px)] rounded-full bg-white/25 ring-1 ring-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.15)] transition-transform duration-[300ms] ease-[cubic-bezier(1,0,0.4,1)]"
          style={{
            width: "calc((100% - 8px) / 3)",
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {/* Tab links */}
        {tabs.map((tab) => {
          const isActive = tab.id === tabs[activeIndex].id;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                // layout
                "relative z-10 flex items-center justify-center",
                "w-[80px] md:w-[96px] h-full",
                "rounded-full",
                // typography
                "text-sm graphik-medium tracking-wide",
                "select-none",
                // colour & transition
                "transition-colors duration-200",
                isActive
                  ? "text-black drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                  : "text-black/60 hover:text-black/90",
              ].join(" ")}
            >
              {tab.dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shrink-0" />
              )}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
