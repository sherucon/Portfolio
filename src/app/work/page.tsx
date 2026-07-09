import Spacer from "../components/spacer";
import ParanoyarCard from "../components/paranoyar-card";
import ZoopCard from "../components/zoop-card";
import BrewLSDCard from "../components/brewlsd-card";
import PotenadCard from "../components/potenad-card";
import type { Metadata } from "next";
import VerityCard from "../components/verity-card";

export const metadata: Metadata = {
  title: "Shreyansh | Work",
  description: "Projects and selected works by Shreyansh Singh.",
};

export default function About() {
  return (
    <div className="mx-5 my-0 md:mx-8 lg:mx-16 xl:mx-50">
      <link rel="preconnect" href="https://r2.sherucon.tech" />
      <Spacer />

      <div className="items-center justify-end mb-1 hidden md:flex">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="aspect-square bg-[#f7f7f9] rounded-4xl overflow-hidden">
          <ParanoyarCard className="block h-full w-full" />
        </div>
        <div className="aspect-square bg-[#f7f7f9] rounded-4xl overflow-hidden">
          <ZoopCard className="block h-full w-full" />
        </div>
        <div className="aspect-square bg-[#f7f7f9] rounded-4xl overflow-hidden">
          <BrewLSDCard className="block h-full w-full" />
        </div>
        <div className="aspect-square bg-[#f7f7f9] rounded-4xl">
          <PotenadCard className="block h-full w-full" />
        </div>
        <div className="aspect-square bg-[#f7f7f9] rounded-4xl overflow-hidden">
          <VerityCard className="block h-full w-full" />"
        </div>
      </div>

      <Spacer />
      <div className="md:hidden">
        <Spacer />
      </div>
    </div>
  );
}
