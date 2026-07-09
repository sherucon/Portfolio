import { useEffect, useState } from "react";
import svgPaths from "./svg";

const PHRASES = [
  "Ask anything",
  "What's the notice period?",
  "Can either party terminate?",
  "Who owns the IP?",
  "Payment terms?",
  "Late payment fees?",
];

const TYPING_SPEED = 55;
const DELETING_SPEED = 30;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 400;

export default function DocSearch() {
  const [displayed, setDisplayed] = useState("Ask anything");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(PHRASES[0].length);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const current = PHRASES[phraseIndex];

    if (!isDeleting && charIndex < current.length) {
      const id = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(id);
    }

    if (!isDeleting && charIndex === current.length) {
      const id = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(id);
    }

    if (isDeleting && charIndex > 0) {
      const id = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
      }, DELETING_SPEED);
      return () => clearTimeout(id);
    }

    if (isDeleting && charIndex === 0) {
      const id = setTimeout(() => {
        const next = (phraseIndex + 1) % PHRASES.length;
        setPhraseIndex(next);
        setIsDeleting(false);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(id);
    }
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <div className="size-full flex items-center justify-center bg-transparent">
      <div
        className="bg-white/40 backdrop-blur-sm border border-white/40 overflow-clip relative rounded-full shadow-[0_0px_32px_0_rgba(0,0,0,0.5)]"
        style={{ width: "650px", height: "82px" }}
      >
        {/* Animated text */}
        <p className="absolute font-['SF_Pro_Display',sans-serif] font-regular leading-none left-[41px] not-italic text-[24px] text-black top-1/2 -translate-y-1/2 whitespace-nowrap select-none">
          {displayed}
          <span
            className="inline-block w-[2px] h-[30px] ml-[2px] align-middle bg-black"
            style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </p>

        {/* Mic icon */}
        <div
          className="-translate-y-1/2 absolute top-1/2"
          style={{ left: "81.41%", right: "15.21%", aspectRatio: "28/44" }}
          data-name="Icon"
        >
          <div className="absolute inset-[-3.95%_-6.25%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 27 41"
            >
              <path
                d={svgPaths.p3020ed00}
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Send icon */}
        <div
          className="-translate-y-1/2 absolute top-1/2"
          style={{ left: "88.87%", right: "5.77%", aspectRatio: "40/40" }}
          data-name="Icon"
        >
          <div className="absolute inset-[-3.95%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 41 41"
            >
              <path
                d={svgPaths.p1dfea300}
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
