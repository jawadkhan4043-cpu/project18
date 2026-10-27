"use client";

import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Sender = "user" | "bot";

interface Message {
  id: number;
  sender: Sender;
  text: string;
}

interface Rule {
  intent: string;
  keywords: string[];
  reply: string;
}

const FALLBACK =
  "Sorry, I could not understand that. Please try asking about fee, admission, timing, library or hostel.";

const GREETING =
  "Hello! Welcome to UOS Helpdesk Bot. You can ask me about fee, admission, timing, library or hostel.";

function getReply(input: string): string {
  const text = input.toLowerCase().replace(/\s+/g, " ").trim();

  for (const rule of rules as Rule[]) {
    if (rule.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      return rule.reply;
    }
  }
  return FALLBACK;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.replace(/\s+/g, " ").trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length, sender: "user", text: trimmed },
      { id: prev.length + 1, sender: "bot", text: getReply(trimmed) },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Header */}
        <header className="bg-green-700 px-5 py-4 text-white">
          <h1 className="text-lg font-semibold">UOS Helpdesk Bot</h1>
          <p className="text-xs text-green-100">Ask about fee, admission, timing, library or hostel</p>
        </header>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "rounded-br-sm bg-green-700 text-white"
                    : "rounded-bl-sm bg-white text-gray-800 shadow"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 border-t border-gray-200 bg-white p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800 outline-none focus:border-green-700"
          />
          <button
            onClick={handleSend}
            className="rounded-full bg-green-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-800"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}