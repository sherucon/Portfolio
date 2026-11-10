"use client";

import Link from "next/link";
import { useState } from "react";
import Spacer from "./spacer";

const EMAIL = "singhshreyansh288@gmail.com";

const RAINBOW = [
  "#5EBD3E",
  "#FFB900",
  "#F78200",
  "#E23838",
  "#973999",
  "#009CDF",
];

export default function Page() {
  const [message, setMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${EMAIL}?body=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <meta
        name="google-site-verification"
        content="s-kj96OSaf-EJMhs8h-9gkfNVek6xQMXphSptcryuF0"
      />

      <div className="bg-white">
        <div className="mx-5 my-0 md:mx-8 lg:mx-16 xl:mx-50">
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_368px]">
            {/* Identity card */}
            <section className="relative flex flex-col overflow-hidden rounded-3xl bg-[#f7f7f9] p-5 sm:p-7 sm:pb-[42px] lg:h-[600px]">
              <h1 className="cactus text-[clamp(3.5rem,7.64vw,6.875rem)] leading-[0.98] tracking-[-0.06em] text-[#111]">
                Shreyansh
                <br />
                Singh
              </h1>
              <p className="mt-5 text-[22px] font-medium leading-[29px] text-[#747474]">
                Product engineer
              </p>

              <div className="mt-auto pt-10">
                <p className="text-[26px] font-medium leading-[34px] text-[#454545]">
                  I figure out what’s next, then build it.
                  <br />
                  From the first “what if” to the thing you use.
                </p>
                <Link
                  href="#work"
                  className="mt-10 inline-flex text-[26px] font-medium leading-[34px] text-[#454545] underline decoration-from-font transition-colors duration-200 hover:text-[#111]"
                >
                  See my work ↓
                </Link>
              </div>

              {/* Apple-style rainbow */}
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 hidden w-[104px] flex-col opacity-50 min-[1440px]:flex"
              >
                {RAINBOW.map((color) => (
                  <div
                    key={color}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </section>

            {/* Contact — iMessage conversation */}
            <section className="relative h-[600px] overflow-hidden rounded-3xl bg-[#f7f7f9] text-[#111]">


              <div className="relative ml-5 mt-5 w-[302px] max-w-[calc(100%-66px)] rounded-[19px] rounded-bl-[6px] bg-[#e4e4e9] px-[14px] py-[11px]">
                <p className="text-base leading-[21px]">
                  want to work together? or just wanna chat? send me a msg
                  here, yes here
                </p>
                <img
                  src="/figma/imessage-tail-incoming.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="absolute bottom-0 -left-[7px]"
                />
              </div>

              <div className="relative ml-auto mr-5 mt-5 w-fit max-w-[calc(100%-40px)] rounded-[19px] rounded-br-[6px] bg-[#0070e8] px-[14px] py-[12px] text-white">
                <p className="text-base leading-[21px]">alr bet</p>
                <img
                  src="/figma/imessage-tail-outgoing.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="absolute -right-[6px] bottom-0"
                />
              </div>

              <p className="mt-2 pr-[23px] text-right text-[11px] font-medium leading-[14.3px] text-[#6e6e73]">
                Delivered
              </p>

              <div className="relative ml-5 mt-[50px] w-fit max-w-[calc(100%-66px)] rounded-[19px] rounded-bl-[6px] bg-[#e4e4e9] px-[14px] py-[11px]">
                <p className="whitespace-nowrap text-base leading-[21px]">
                  whats your name
                </p>
                <img
                  src="/figma/imessage-tail-incoming.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="absolute bottom-0 -left-[7px]"
                />
              </div>

              <form
                onSubmit={sendMessage}
                className="absolute inset-x-0 bottom-0 flex h-[65px] items-center gap-[10px] px-[17px]"
              >
                <a
                  href={`mailto:${EMAIL}`}
                  aria-label="Email me"
                  className="size-7 shrink-0"
                >
                  <img
                    src="/figma/envelope.svg"
                    alt=""
                    width={28}
                    height={28}
                  />
                </a>
                <div className="flex h-[38px] flex-1 items-center rounded-[19px] border border-[#c7c7ce] bg-white pr-1 pl-3">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="iMessage"
                    aria-label="Message"
                    className="min-w-0 flex-1 bg-transparent text-base leading-[21px] text-[#111] outline-none placeholder:text-[#6e6e73]"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="size-[30px] shrink-0"
                  >
                    <img
                      src="/figma/send.svg"
                      alt=""
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
