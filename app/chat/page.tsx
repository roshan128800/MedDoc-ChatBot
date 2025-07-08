"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const assistantAvatar = "/globe.svg";
const userAvatar = null; 

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      setMessages([
        ...messages,
        { role: "user", text: input },
        { role: "assistant", text: data.reply },
      ]);
      setInput("");
    } catch (error) {
      setMessages([
        ...messages,
        { role: "user", text: input },
        { role: "assistant", text: "Sorry, something went wrong." },
      ]);
      setInput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-0 sm:p-6">
      <div className="flex flex-col items-center gap-0 w-full max-w-xl rounded-[var(--border-radius)] shadow-2xl bg-[var(--card-bg)] backdrop-blur-md border border-[#e5e7eb]" style={{boxShadow: "var(--card-shadow)"}}>
        {/* Header */}
        <div className="flex flex-col items-center w-full rounded-t-[var(--border-radius)] px-8 pt-8 pb-4 border-b border-[#e5e7eb] bg-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Image src={assistantAvatar} alt="medDoc Logo" width={48} height={48} className="rounded-full bg-white shadow" />
            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">medDoc</h1>
          </div>
          <p className="text-sm text-gray-500 text-center font-medium">Your AI-powered healthcare assistant</p>
        </div>
        {/* Chat area */}
        <div className="flex flex-col w-full px-4 py-6 h-[420px] sm:h-[500px] overflow-y-auto bg-transparent transition-all">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 mt-24 text-base select-none animate-fade-in">
              <span className="font-semibold text-[var(--primary)]">Welcome to medDoc!</span><br/>
              <span className="text-gray-400">How can I help you today?</span>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-4 gap-2 items-end animate-fade-in ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <Image src={assistantAvatar} alt="Assistant" width={32} height={32} className="rounded-full bg-white border border-[#e5e7eb] shadow-sm" />
              )}
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow">🧑</div>
              )}
              <div
                className={`max-w-[75%] px-5 py-3 rounded-2xl shadow text-base break-words transition-all ${
                  msg.role === "user"
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-[var(--primary-light)] text-[var(--foreground)] rounded-bl-md border border-[#e5e7eb]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <Image src={assistantAvatar} alt="Assistant" width={32} height={32} className="rounded-full bg-white border border-[#e5e7eb] shadow-sm" />
              <div className="px-5 py-3 rounded-2xl bg-[var(--primary-light)] text-gray-500 animate-pulse max-w-[75%] border border-[#e5e7eb] ml-2 shadow">
                medDoc is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {/* Input area */}
        <form
          className="flex w-full px-4 pb-6 gap-2 bg-transparent rounded-b-[var(--border-radius)] border-t border-[#e5e7eb]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-[#e5e7eb] rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-base bg-white placeholder:text-gray-400 shadow-sm transition-all"
            placeholder="Type your message..."
            disabled={isLoading}
            maxLength={500}
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[var(--primary)] hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg disabled:bg-gray-300 transition-all text-base flex items-center gap-2"
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-blue-400 rounded-full inline-block"></span>
                Sending...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l18-6m0 0l-6 18m6-18L9 21" />
                </svg>
                Send
              </>
            )}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s;
        }
      `}</style>
    </div>
  );
}