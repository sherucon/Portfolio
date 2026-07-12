"use client";

import { ReactLenis } from "lenis/react";
import React from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.07, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
