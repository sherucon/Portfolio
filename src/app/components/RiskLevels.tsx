"use client";

import { useState, useEffect, useRef } from "react";

interface AgentWindowProps {
  userPrompt: string;
  thoughtText: string;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  riskColor: "green" | "yellow" | "red";
  bullets: React.ReactNode;
  commandPrompt: string;
  commandLine: string;
  delayOffset?: number;
  typingSpeed?: number;
  cursorBlinkClass?: string;
  terminalGlowClass?: string;
  shakeOnCommand?: boolean;
  cardShadowClass?: string;
  statusText?: string;
  face?: string;
  dotClass?: string;
}

function AgentWindow({
  userPrompt,
  thoughtText,
  riskLevel,
  riskColor,
  bullets,
  commandPrompt,
  commandLine,
  delayOffset = 0,
  typingSpeed = 40,
  cursorBlinkClass = "animate-[blink_1s_step-end_infinite]",
  terminalGlowClass = "",
  shakeOnCommand = false,
  cardShadowClass = "shadow-2xl",
  statusText = "Waiting for user input..",
  face = "( •_•)",
  dotClass = "",
}: AgentWindowProps) {
  const [step, setStep] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [typedThought, setTypedThought] = useState("");
  const [typedCommand, setTypedCommand] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const colorMap = {
    green: "text-green-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
  };
  const bgMap = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const isMobileNow = window.innerWidth < 1024;

    if (isMobileNow) {
      setTimeout(() => {
        setTypedPrompt(userPrompt);
        setTypedThought(thoughtText);
        setTypedCommand(commandLine);
        setStep(4);
        if (shakeOnCommand) setIsShaking(true);
      }, 0);
      return;
    }

    let isMounted = true;
    
    const runSequence = async () => {
      // initial delay for stagger
      await new Promise((r) => setTimeout(r, delayOffset));

      // Type user prompt
      for (let i = 0; i <= userPrompt.length; i++) {
        if (!isMounted) return;
        setTypedPrompt(userPrompt.slice(0, i));
        await new Promise((r) => setTimeout(r, typingSpeed));
      }
      
      await new Promise((r) => setTimeout(r, 300));
      if (!isMounted) return;
      setStep(1); // Show prompt bubble
      
      await new Promise((r) => setTimeout(r, 600));
      if (!isMounted) return;
      setStep(2); // Show thought

      // Type thought
      for (let i = 0; i <= thoughtText.length; i++) {
        if (!isMounted) return;
        setTypedThought(thoughtText.slice(0, i));
        await new Promise((r) => setTimeout(r, typingSpeed / 2.5)); // fast typing
      }

      await new Promise((r) => setTimeout(r, 500));
      if (!isMounted) return;
      setStep(3); // Show interception block

      await new Promise((r) => setTimeout(r, 600));
      if (!isMounted) return;
      setStep(4); // Show run command block

      // Type command if aggressive
      for (let i = 0; i <= commandLine.length; i++) {
        if (!isMounted) return;
        setTypedCommand(commandLine.slice(0, i));
        
        // If it shakes when "rm -rf" appears
        if (shakeOnCommand && commandLine.slice(0, i).includes("rm -rf")) {
          setIsShaking(true);
        }
        await new Promise((r) => setTimeout(r, typingSpeed * 0.8)); // terminal typing speed
      }
    };

    runSequence();
    return () => { isMounted = false; };
  }, [hasStarted, userPrompt, thoughtText, delayOffset, typingSpeed, commandLine, shakeOnCommand]);

  return (
    <div ref={containerRef} className={`flex-1 bg-[#161618] text-[#ededed] flex flex-col rounded-2xl overflow-hidden border border-[#333] h-[600px] relative transition-shadow duration-1000 ${cardShadowClass} ${isShaking ? "animate-[shake_0.4s_ease-in-out_2]" : ""}`}>
      <div className="flex-1 px-4 pt-6 pb-4 overflow-y-hidden flex flex-col gap-4 relative">
        {step >= 1 ? (
          <div className="shrink-0 flex justify-end animate-[slideUpFade_0.3s_ease_forwards]">
            <div className="bg-[#2a2a2f] p-3 px-4 rounded-2xl max-w-[85%] text-[14px] leading-relaxed flex items-start gap-3">
              <p className="m-0">{userPrompt}</p>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-[80px] right-4 bg-[#2a2a2f] p-3 px-4 rounded-2xl max-w-[85%] text-[14px] leading-relaxed flex items-start gap-3 opacity-0">
             <p className="m-0">{userPrompt}</p>
          </div>
        )}

        {step >= 2 && (
          <div className="shrink-0 flex flex-col gap-2 animate-[slideUpFade_0.3s_ease_forwards]">
            <div className="text-[12px] text-[#888]">Thought for 1s</div>
            <div className="text-[14px] leading-relaxed text-[#e0e0e0]">
              {typedThought}
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="shrink-0 animate-[slideUpFade_0.3s_ease_forwards] mt-2">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${bgMap[riskColor]} ${dotClass}`}></div>
              <span className={`font-bold text-[14px] ${colorMap[riskColor]}`}>{riskLevel}</span>
            </div>
            <div className="text-[13px] text-[#e0e0e0] space-y-2 ml-1">
              {bullets}
            </div>
          </div>
        )}

        {step >= 4 && (
          <div className={`shrink-0 bg-[#1e1e22] border border-[#333] rounded-xl overflow-hidden mt-3 animate-[slideUpFade_0.3s_ease_forwards] transition-shadow duration-700 ${terminalGlowClass}`}>
            <div className="flex justify-between items-center px-4 py-2.5 bg-[#1a1a1c] border-b border-[#333] text-[12px] text-[#aaa]">
              <span>Run {commandPrompt} ?</span>
            </div>
            <div className="p-4 font-mono text-[13px]">
              <div className="bg-[#111] p-3 rounded text-[#ddd] mb-4 border border-[#333] flex">
                <span className="text-[#888] mr-2">~/project $</span>
                <span className="text-[#ddd] whitespace-pre">
                  {typedCommand}
                  <span className={`inline-block w-[7px] h-[14px] bg-[#888] ml-1 align-middle ${cursorBlinkClass}`}></span>
                </span>
              </div>
              <p className="text-[12px] text-[#888] mb-3">{statusText}</p>
              <div className="flex justify-end gap-2">
                <button className="bg-transparent text-[#888] border-none px-3 py-1.5 rounded-md text-[13px] font-medium opacity-50 cursor-not-allowed">
                  Reject
                </button>
                <button className="bg-[#0066ff] text-white border-none px-4 py-1.5 rounded-md text-[13px] font-medium opacity-50 cursor-not-allowed flex items-center gap-1">
                  Run <span className="text-white/50 text-[10px] ml-1">⏎</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="px-4 pb-4 shrink-0">
        <div className="bg-[#222226] border border-[#333] rounded-xl p-3 flex flex-col gap-2">
          <div className="text-[#888] text-[14px] min-h-[20px] flex items-center justify-between">
            <div>
              {step === 0 ? typedPrompt : "Ask anything, @ to mention, / for actions"}
              {step === 0 && typedPrompt.length < userPrompt.length && (
                <span className={`inline-block w-[2px] h-[14px] align-middle bg-[#e0e0e0] ml-[2px] ${cursorBlinkClass}`}></span>
              )}
            </div>
            <div className="text-[14px] opacity-70 tracking-widest">{face}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RiskLevels() {
  return (
    <section className="w-full bg-[#f4f4f4] text-[#111] py-24 px-4 min-h-[100dvh] flex flex-col justify-center overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto">
        <h2 className="font-black text-5xl md:text-7xl tracking-tighter leading-none mb-16 uppercase text-center">
          The 3 Levels of <br /> <span className="underline decoration-8 underline-offset-4">Paranoia</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <AgentWindow
            delayOffset={0}
            userPrompt="check the system logs for errors"
            thoughtText="I will read the system logs to see what caused the crash."
            riskLevel="Low Risk"
            riskColor="green"
            bullets={
              <ul className="list-disc pl-4 marker:text-[#666] space-y-1">
                <li><strong className="text-white">Reads</strong> the system logs to understand what went wrong.</li>
                <li>No state changes will occur on the system.</li>
              </ul>
            }
            commandPrompt="cat /var/log/syslog"
            commandLine="cat /var/log/syslog | grep error"
            typingSpeed={50}
            cursorBlinkClass="animate-[blink_2s_step-end_infinite]"
            terminalGlowClass="shadow-[0_0_15px_rgba(34,197,94,0.05)]"
            face="( -_・)"
            dotClass=""
          />

          <AgentWindow
            delayOffset={1000}
            userPrompt="install the missing package"
            thoughtText="The project needs this dependency to run. I'll install it globally."
            riskLevel="Medium Risk"
            riskColor="yellow"
            bullets={
              <ul className="list-disc pl-4 marker:text-[#666] space-y-1">
                <li><strong className="text-white">Downloads</strong> a package from the internet.</li>
                <li><strong className="text-white">Modifies</strong> global system state by installing a new binary.</li>
              </ul>
            }
            commandPrompt="npm install -g"
            commandLine="npm install -g some-pkg"
            typingSpeed={30}
            cursorBlinkClass="animate-[blink_1s_step-end_infinite]"
            terminalGlowClass="shadow-[0_0_20px_rgba(234,179,8,0.2)]"
            statusText="Waiting for approval..."
            face="( •_•)"
            dotClass=""
          />

          <AgentWindow
            delayOffset={2000}
            userPrompt="clean up the workspace"
            thoughtText="I will delete all the files in the directory to give us a fresh start."
            riskLevel="High Risk"
            riskColor="red"
            bullets={
              <ul className="list-disc pl-4 marker:text-[#666] space-y-1">
                <li><strong className="text-white">Deletes</strong> files permanently without recovery.</li>
                <li><strong className="text-white">Destructive action</strong> that affects all users in this directory.</li>
              </ul>
            }
            commandPrompt="rm -rf ./*"
            commandLine="rm -rf ./*"
            typingSpeed={15}
            cursorBlinkClass="animate-[blink_0.5s_step-end_infinite]"
            terminalGlowClass="shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            shakeOnCommand={true}
            cardShadowClass="shadow-[0_25px_50px_-12px_rgba(239,68,68,0.45)] border-red-500/30"
            statusText="Waiting for user input.."
            face="( 0_0)"
            dotClass="animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]"
          />
        </div>
      </div>
    </section>
  );
}
