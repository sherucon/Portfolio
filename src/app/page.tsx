import Home from "./components/home";
import Work from "./components/work";
import About from "./components/about";
import Spacer from "./components/spacer";

export default function Page() {
  return (
    <main className="flex flex-col gap-4">
      <section id="home">
        <Home />
      </section>
      <section id="work" className="scroll-mt-10 md:scroll-mt-[120px]">
        <Work stacked />
      </section>
      <section id="about" className="scroll-mt-10 md:scroll-mt-[120px]">
        <About stacked />
        <Spacer />
        <div className="md:hidden">
          <Spacer />
        </div>
      </section>
    </main>
  );
}
