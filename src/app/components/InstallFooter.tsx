"use client";

import { useState } from "react";

export default function InstallFooter() {
  const [copied, setCopied] = useState(false);
  const command = "npx skills add sherucon/paranoyar";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full bg-[#111] text-white py-32 px-6 flex flex-col items-center justify-center border-t border-[#333]">
      <h2 className="font-black text-4xl md:text-6xl tracking-tighter uppercase mb-12 text-center">
        Take back{" "}
        <span className="text-white underline decoration-4 underline-offset-4">
          Control
        </span>
        .
      </h2>

      <div
        onClick={handleCopy}
        className="group relative bg-black border-2 border-[#333] p-8 md:p-12 w-full max-w-4xl cursor-pointer hover:border-white transition-colors duration-300 overflow-hidden rounded-xl"
      >
        {/* Terminal Header */}
        <div className="absolute top-0 left-0 w-full bg-[#222] px-4 py-2 flex items-center gap-2 border-b border-[#333] group-hover:border-white transition-colors duration-300">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 font-mono text-xs text-gray-400">
            install.sh
          </span>
        </div>

        {/* Command */}
        <div className="mt-8 font-mono text-xl md:text-4xl text-green-400 flex items-center justify-center select-all">
          <span className="text-gray-500 mr-4 select-none">$</span>
          {command}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-black text-4xl uppercase tracking-tighter">
          {copied ? "COPIED TO CLIPBOARD!" : "CLICK TO COPY"}
        </div>
      </div>
    </section>
  );
}
