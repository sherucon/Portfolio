import Spacer from "../components/spacer";
import XIcon from "../components/x-icon";
import MailIcon from "../components/mail-icon";
import GithubIcon from "../components/github-icon";
import Link from "next/link";
import LinkedinIcon from "../components/linkedin-icon";
import Gallery from "../components/gallery";

import GhStreak from "../components/gh-streak";
import MediumRSS from "../components/medium-rss";
import LosIll from "../components/losilluminados";

export default function About() {
  return (
    <div className="mx-5 my-0 md:mx-8 lg:mx-16 xl:mx-50">
      <link rel="preconnect" href="https://r2.sherucon.tech" />
      <link
        rel="preconnect"
        href="https://embed.music.apple.com/us/playlist/i-love/pl.u-06oxpqztYrEXE5b?theme=light"
      />
      <title>Shreyansh | About</title>
      <Spacer />

      <div className="flex items-center justify-end mb-1">
        <svg
          className="w-4 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          fill="#000000"
          viewBox="0 0 24 24"
          id="cursor-up-left"
          data-name="Flat Color"
          scale="0.1"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              id="primary"
              d="M20.8,9.4,4.87,2.18A2,2,0,0,0,2.18,4.87h0L9.4,20.8A2,2,0,0,0,11.27,22h.25a2.26,2.26,0,0,0,2-1.8l1.13-5.58,5.58-1.13a2.26,2.26,0,0,0,1.8-2A2,2,0,0,0,20.8,9.4Z"
              fill="#a1a1a1"
            ></path>
          </g>
        </svg>
        <p className="text-sm pr-5 text-[#a1a1a1]">Click around...</p>
      </div>

      {/* Outer 2-column layout: left card | right nested grid — fully independent */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4">
        {/* Left card — grows freely with text, never affects right grid rows */}
        <div className="bg-[#f7f7f9] p-5 rounded-3xl text-[#747474]">
          <h1 className="text-3xl graphik-medium text-black ">
            What I&apos;m about.
          </h1>
          <br />
          <hr className="border-1 rounded-xl border-[#e8e8ea]"></hr>
          <br />

          <p className="text-lg">
            I was born and raised in Faridabad, India, back when not every house
            had a computer. My father brought one home from work, the year I was
            born. There was never much to do outside, except the usual grass
            touching, so I grew closer to the machine.
          </p>

          <br />

          <p className="text-lg">
            My father and I used to play{" "}
            <a
              href="https://en.wikipedia.org/wiki/Resident_Evil_4"
              className="underline text-black graphik-medium"
            >
              Resident Evil 4 (2005) ⤷
            </a>{" "}
            on our computer, and I&apos;d be shit scared around every corner.
            I&apos;m currently playing{" "}
            <a
              href="https://en.wikipedia.org/wiki/Resident_Evil_9"
              className="underline text-black graphik-medium"
            >
              Resident Evil 9 ⤷
            </a>
            . The internet was a privilege I had from a very young age, and ofc
            I used it to play games most of my childhood.
          </p>

          <br />

          <p className="text-lg">
            In the coming years, I&apos;d break my RC and try to build one with
            the motors from the broken one. Then it was fans and lifts and all
            sorts of weird abominations. Around the same time, school came
            around with python and then SQL. I liked it A LOT. I wasn&apos;t
            just using computers, I was building for them, even if it was just a
            calculator.py 😓.
          </p>

          <br />

          <p className="text-lg">
            After that, it was less about learning stuff and more about figuring
            it out by myself.
          </p>

          <br />

          <p className="text-lg">
            Now I spend most of my time building. Lately that&apos;s been{" "}
            <a
              href="https://github.com/sherucon/paranoyar"
              className="underline text-black graphik-medium"
            >
              paraNOyar ⤷
            </a>
            , something I&apos;ve been taking pretty seriously. It&apos;s around{" "}
            <span className="text-black graphik-medium">
              making AI coding agents more transparent
            </span>
            , so you actually understand what they&apos;re doing instead of
            blindly trusting them.
          </p>

          <br />

          <p className="text-lg">
            Outside of that, I&apos;m either playing games, exploring new tech,
            or out somewhere with a bit of altitude. I like figuring things out,
            whether it&apos;s a system, a product, or something physical I can
            take apart.
          </p>

          <br />

          <p className="text-lg">
            I think we&apos;re moving fast in a direction where trust is
            assumed, not earned. I&apos;d like to work on fixing that.
          </p>
          <br />
          <br />

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/sherucon"
              target="_blank"
              className="text-[#747474] hover:text-black transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubIcon />
            </Link>
            <Link
              href="https://x.com/sherucon"
              target="_blank"
              className="text-[#747474] hover:text-black transition-colors duration-200"
              aria-label="X"
            >
              <XIcon />
            </Link>
            <Link
              href="mailto:singhshreyansh288@gmail.com"
              target="_blank"
              className="text-[#747474] hover:text-black transition-colors duration-200"
              aria-label="Mail"
            >
              <MailIcon />
            </Link>
            <Link
              href="https://www.linkedin.com/in/sherucon/"
              target="_blank"
              className="text-[#747474] hover:text-black transition-colors duration-200"
              aria-label="GitHub"
            >
              <LinkedinIcon />
            </Link>
          </div>
          <br />
        </div>

        {/* Right panel — its own independent 2-column grid, so squares stay squares */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
          <div className="aspect-square bg-[#f7f7f9] rounded-3xl overflow-hidden cursor-touch">
            <Gallery />
          </div>

          <div className="aspect-square bg-[#f7f7f9] rounded-3xl overflow-hidden cursor-touch">
            <LosIll />
          </div>

          <div className="aspect-square bg-[#f7f7f9] rounded-3xl overflow-hidden cursor-touch">
            <GhStreak />
          </div>

          <div className="aspect-square bg-[#f7f7f9] rounded-3xl overflow-hidden cursor-touch">
            <MediumRSS />
          </div>

          {/* Music player — spans both columns of the right panel */}
          <div className="col-span-2 bg-[#f7f7f9] rounded-3xl overflow-hidden h-[450px] cursor-touch">
            <iframe
              title="AppleMusic"
              className="w-full h-full border-0 rounded-3xl overflow-hidden cursor-touch"
              src="https://embed.music.apple.com/us/playlist/i-love/pl.u-06oxpqztYrEXE5b?theme=light"
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            />
          </div>
        </div>
      </div>

      <Spacer />
      <div className="md:hidden">
        <Spacer />
      </div>
    </div>
  );
}
