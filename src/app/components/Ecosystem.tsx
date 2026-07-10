export default function Ecosystem() {
  return (
    <section className="w-full bg-[#f4f4f4] text-[#111] py-24 px-6 md:px-12 lg:px-24 min-h-[100dvh] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="font-bold text-5xl md:text-6xl tracking-tight mb-2">
            The paraNOyar Ecosystem
          </h2>
          <p className="text-2xl md:text-3xl font-medium text-gray-500">
            Intercept &amp; Translate Architecture
          </p>
        </div>

        <hr className="border-t border-gray-300 mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Left Column (4 columns wide) */}
          <div className="md:col-span-4 flex flex-col gap-12">
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">
                Integrations
              </h3>
              <ul className="space-y-4 font-medium text-lg">
                <li>ALL AI CODING AGENTS</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">
                Core Tech
              </h3>
              <ul className="space-y-4 font-medium text-lg">
                <li>AGENT SKILLS</li>
                <li>LLM INTERCEPTION</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">
                Launch
              </h3>
              <p className="font-medium text-lg">MAR 2026</p>
            </div>
          </div>

          {/* Right Column (8 columns wide) */}
          <div className="md:col-span-8 flex flex-col gap-12">
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">
                Overview
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed font-medium max-w-3xl">
                paraNOyar is an informed consent interceptor designed to keep
                you safe from runaway AI coding agents. Users are instantly
                presented with the risks of any proposed command without the
                friction of blindly trusting opaque terminal scripts.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">
                Context
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed font-medium max-w-3xl mb-8">
                The application follows an intercept-and-translate architecture.
                It hooks directly into the terminal execution pipeline, pauses
                the AI&apos;s execution, uses an LLM to generate a plain-English
                translation of the proposed command, and blocks until the user
                approves.
              </p>
              <p className="text-xl md:text-2xl leading-relaxed font-medium max-w-3xl">
                This modular architecture keeps your machine safe, scalable, and
                easy to monitor while allowing the underlying AI agent to focus
                on its specific responsibility without rewriting its internal
                logic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
