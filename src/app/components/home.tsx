"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MailIcon from "./mail-icon";
import Spacer from "./spacer";

const EMAIL = "sh3rucon@gmail.com";

const RAINBOW = [
  "#5EBD3E",
  "#FFB900",
  "#F78200",
  "#E23838",
  "#973999",
  "#009CDF",
];

type Sender = "me" | "them";
type Field = "name" | "topic" | "phone" | "email" | "notes";
type Answers = Record<Field, string>;

type ChatMessage = {
  id: number;
  from: Sender;
  text: string;
  delay?: number;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: "them",
    text: "want to work together? or just wanna chat? send me a msg here, yes here",
    delay: 0.15,
  },
  { id: 2, from: "me", text: "That is alright, bet", delay: 0.95 },
  { id: 3, from: "them", text: "What’s your name?", delay: 1.75 },
];

const EMPTY_ANSWERS: Answers = {
  name: "",
  topic: "",
  phone: "",
  email: "",
  notes: "",
};

const STEPS: { field: Field; replies: string[] }[] = [
  { field: "name", replies: ["what did u wanna talk about?"] },
  { field: "topic", replies: ["ahh i see", "whats your phone number?"] },
  { field: "phone", replies: ["and what about your email?"] },
  { field: "email", replies: ["right on", "anything else?"] },
  { field: "notes", replies: ["i'll hit u back asap", "talk soon"] },
];

type ChatBubbleProps = {
  from: Sender;
  delay?: number;
  visible?: boolean;
  delivered?: boolean;
  firstInRun?: boolean;
  lastInRun?: boolean;
  children: React.ReactNode;
};

/* SwiftUI BubbleShape tail, cropped to the part outside the bubble body. */
function BubbleTail({ outgoing }: { outgoing: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 22 12"
      className={`pointer-events-none absolute bottom-[-1px] h-3 w-[22px] ${
        outgoing ? "right-[-6px] -scale-x-100" : "left-[-6px]"
      }`}
    >
      <path
        d="M6 1C6 10 1 11 1 11L0 11C5 12 9 10 13 7C16 11 21 11 21 11Z"
        fill={outgoing ? "#0070e8" : "#e4e4e9"}
      />
    </svg>
  );
}

function ChatBubble({
  from,
  delay = 0,
  visible = true,
  delivered = false,
  firstInRun = true,
  lastInRun = true,
  children,
}: ChatBubbleProps) {
  const outgoing = from === "me";

  return (
    <div
      className={`imessage-bubble flex flex-col ${
        outgoing ? "items-end" : "items-start"
      } ${firstInRun ? "mt-2" : "mt-0.5"} first:mt-0 ${
        visible ? "is-visible" : ""
      }`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      <div
        className={`imessage-bubble__body relative w-fit max-w-[302px] rounded-[19px] px-[14px] text-base leading-[21px] ${
          outgoing
            ? "bg-[#0070e8] py-[12px] text-white"
            : "bg-[#e4e4e9] py-[11px]"
        }`}
        style={{
          borderTopRightRadius: outgoing && !firstInRun ? 6 : undefined,
          borderBottomRightRadius: outgoing ? (lastInRun ? 0 : 6) : undefined,
          borderTopLeftRadius: !outgoing && !firstInRun ? 6 : undefined,
          borderBottomLeftRadius: !outgoing ? (lastInRun ? 0 : 6) : undefined,
        }}
      >
        {lastInRun && <BubbleTail outgoing={outgoing} />}
        <p className="break-words">{children}</p>
      </div>
      {delivered && (
        <p className="mr-[3px] mt-1 text-[11px] font-medium leading-[14.3px] text-[#6e6e73]">
          Delivered
        </p>
      )}
    </div>
  );
}

export default function Page() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const chatRef = useRef<HTMLElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(INITIAL_MESSAGES.length + 1);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const node = chatRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setChatStarted(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = messagesRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const scheduleReplies = (replies: string[]) => {
    replies.forEach((text, index) => {
      const timer = window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          { id: nextIdRef.current++, from: "them", text },
        ]);
      }, 650 + index * 700);
      timersRef.current.push(timer);
    });

    const idleTimer = window.setTimeout(
      () => setBusy(false),
      650 + Math.max(0, replies.length - 1) * 700 + 250,
    );
    timersRef.current.push(idleTimer);
  };

  const saveLead = async (nextAnswers: Answers, isComplete: boolean) => {
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          ...nextAnswers,
          complete: isComplete,
        }),
      });
      const result = await response.json().catch(() => null);
      return response.ok && result?.ok === true;
    } catch {
      return false;
    }
  };

  const finished = step >= STEPS.length;

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || finished) return;

    const text = message.trim();
    const currentStep = STEPS[step];
    if (!text || !currentStep) return;

    const updatedAnswers = { ...answers, [currentStep.field]: text };
    const isFinal = step === STEPS.length - 1;

    setAnswers(updatedAnswers);
    setMessage("");
    setBusy(true);
    setMessages((current) => [
      ...current,
      { id: nextIdRef.current++, from: "me", text },
    ]);

    if (isFinal) {
      setSaving(true);
      void saveLead(updatedAnswers, true).then((ok) => {
        setSaving(false);
        if (ok) setSent(true);
        else setSendError(true);
      });
    } else {
      void saveLead(updatedAnswers, false);
    }

    scheduleReplies(currentStep.replies);
    setStep(step + 1);
  };

  const lastOutgoingIndex = messages.reduce(
    (last, current, index) => (current.from === "me" ? index : last),
    -1,
  );

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
            <section
              ref={chatRef}
              aria-label="iMessage conversation"
              className="flex h-[600px] flex-col overflow-hidden rounded-3xl bg-[#f7f7f9] text-[#111]"
            >
              <div
                ref={messagesRef}
                aria-live="polite"
                className="flex flex-1 flex-col overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {messages.map((chatMessage, index) => {
                  const previous = messages[index - 1];
                  const next = messages[index + 1];

                  return (
                    <ChatBubble
                      key={chatMessage.id}
                      from={chatMessage.from}
                      delay={chatMessage.delay}
                      visible={chatMessage.delay === undefined || chatStarted}
                      delivered={index === lastOutgoingIndex}
                      firstInRun={
                        !previous || previous.from !== chatMessage.from
                      }
                      lastInRun={!next || next.from !== chatMessage.from}
                    >
                      {chatMessage.text}
                    </ChatBubble>
                  );
                })}
              </div>

              <form
                onSubmit={sendMessage}
                className="flex h-[65px] shrink-0 items-center gap-[10px] px-[17px]"
              >
                <a
                  href={`mailto:${EMAIL}`}
                  aria-label="Email me"
                  className="inline-flex size-7 shrink-0 items-center justify-center text-[#747474] transition-colors duration-200 hover:text-black"
                >
                  <MailIcon />
                </a>
                <div className="flex h-[38px] flex-1 items-center rounded-[19px] border border-[#c7c7ce] bg-white pr-1 pl-3">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      sent
                        ? "your message was sent"
                        : sendError
                          ? "couldn't send, email me"
                          : saving
                            ? "sending..."
                            : "iMessage"
                    }
                    aria-label={sent ? "Message sent" : "Message"}
                    disabled={finished}
                    className="min-w-0 flex-1 bg-transparent text-base leading-[21px] text-[#111] outline-none placeholder:text-[#6e6e73] disabled:cursor-default"
                  />
                  <button
                    type="submit"
                    aria-label={
                      sent
                        ? "Message sent"
                        : sendError
                          ? "Message failed to send"
                          : "Send message"
                    }
                    disabled={busy || finished}
                    className={`size-[30px] shrink-0 rounded-full transition-opacity ${
                      busy && !sent && !sendError ? "opacity-40" : ""
                    }`}
                  >
                    {sent ? (
                      <svg
                        width={30}
                        height={30}
                        viewBox="0 0 30 30"
                        aria-hidden="true"
                      >
                        <circle cx="15" cy="15" r="15" fill="#34C759" />
                        <path
                          d="M9 15.5l4 4 8-9"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : sendError ? (
                      <svg
                        width={30}
                        height={30}
                        viewBox="0 0 30 30"
                        aria-hidden="true"
                      >
                        <circle cx="15" cy="15" r="15" fill="#FF3B30" />
                        <path
                          d="M15 8v9"
                          stroke="#fff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="15" cy="21.5" r="1.6" fill="#fff" />
                      </svg>
                    ) : (
                      <img
                        src="/figma/send.svg"
                        alt=""
                        width={30}
                        height={30}
                      />
                    )}
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
