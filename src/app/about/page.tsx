'use client';

import Spacer from "../components/spacer";
import XIcon from "../components/x-icon";
import MailIcon from "../components/mail-icon";
import GithubIcon from "../components/github-icon";
import Link from "next/link";
import LinkedinIcon from "../components/linkedin-icon";
import GitHubTile from "../components/gh-cal";

export default function About() {
    return (
        <div className="m-5 my-0 md:mx-50">
            <Spacer />

            {/* Outer 2-column layout: left card | right nested grid — fully independent */}
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start md:gap-4">

                {/* Left card — grows freely with text, never affects right grid rows */}
                <div className="bg-[#f7f7f9] p-5 rounded-3xl text-[#747474]">

                    <h1 className="text-3xl graphik-medium text-black ">What I'm about.</h1>
                    <br />
                    <hr className="border-1 rounded-xl border-[#e8e8ea]"></hr>
                    <br />

                    <p className="text-lg">I was born and raised in Faridabad, India, back when not every house had a computer. My father brought one home from work, the year I was born. There was never much to do outside, except the usual grass touching, so I grew closer to the machine.</p>

                    <br />

                    <p className="text-lg">My father and I used to play <a href="https://en.wikipedia.org/wiki/Resident_Evil_4" className="underline text-black graphik-medium">Resident Evil 4 (2005) ⤷</a> on our computer, and I'd be shit scared around every corner. I'm currently playing <a href="https://en.wikipedia.org/wiki/Resident_Evil_9" className="underline text-black graphik-medium">Resident Evil 9 ⤷</a>. The internet was a privilege I had from a very young age, and ofc I used it to play games most of my childhood.</p>

                    <br />

                    <p className="text-lg">In the coming years, I'd break my RC and try to build one with the motors from the broken one. Then it was fans and lifts and all sorts of weird abominations. Around the same time, school came around with python and then SQL. I liked it A LOT. I wasn't just using computers, I was building for them, even if it was just a calculator.py 😓.</p>

                    <br />

                    <p className="text-lg">After that, it was less about learning stuff and more about figuring it out by myself.</p>

                    <br />

                    <p className="text-lg">Now I spend most of my time building.
                        Lately that's been <a href="https://github.com/sherucon/paranoyar" className="underline text-black graphik-medium">paraNOyar ⤷</a>, something I've been taking pretty seriously. It's around <span className="text-black graphik-medium">making AI coding agents more transparent</span>, so you actually understand what they're doing instead of blindly trusting them.</p>

                    <br />

                    <p className="text-lg">Outside of that, I'm either playing games, exploring new tech, or out
                        somewhere with a bit of altitude. I like figuring things out, whether it's a system,
                        a product, or something physical I can take apart.</p>

                    <br />

                    <p className="text-lg">I think we're moving fast in a direction where trust is assumed, not earned. I'd like to work on fixing that.</p>
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

                    <div className="aspect-square bg-[#0d1117] p-5 rounded-3xl overflow-hidden">
                        <GitHubTile />
                    </div>

                    <div className="aspect-square bg-[#f7f7f9] p-5 rounded-3xl">
                        3
                    </div>

                    <div className="aspect-square bg-[#f7f7f9] p-5 rounded-3xl">
                        4
                    </div>

                    <div className="aspect-square bg-[#f7f7f9] rounded-3xl overflow-hidden">
                    </div>

                    {/* Music player — spans both columns of the right panel */}
                    <div className="col-span-2 bg-[#f7f7f9] rounded-3xl overflow-hidden h-[450px]">
                        <iframe
                            className="w-full h-full border-0 rounded-3xl overflow-hidden"
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
    )

}
