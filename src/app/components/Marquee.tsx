export default function Marquee() {
  const agents = [
    "CLAUDE CODE",
    "CURSOR",
    "ANTIGRAVITY",
    "CLINE",
    "DEVIN",
    "GITHUB COPILOT",
    "WINDSURF",
    "OPENCODE"
  ];

  return (
    <section className="w-full bg-[#111] border-y-4 border-white py-4 overflow-hidden relative flex">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {/* We repeat the array twice to ensure a seamless infinite scroll loop */}
        {[...agents, ...agents].map((agent, i) => (
          <div key={i} className="flex items-center">
            <span className="font-black text-4xl text-white tracking-tighter uppercase">{agent}</span>
            <span className="text-white mx-8 text-2xl">✦</span>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `
      }} />
    </section>
  );
}
