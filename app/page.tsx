"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const assistantAvatar = "/globe.svg";
const userAvatar = null; 

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! How can I assist you today? If you have any questions about health or wellness, feel free to ask.",
    },
  ]);
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
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-blue-200 via-fuchsia-100 to-cyan-100">
      {/* Animated Colorful Blobs */}
      <div className="absolute top-[-180px] left-[-180px] w-[500px] h-[500px] bg-gradient-to-br from-blue-400 via-cyan-300 to-fuchsia-300 opacity-30 rounded-full blur-3xl z-0 animate-[blob1_12s_infinite] pointer-events-none" />
      <div className="absolute bottom-[-180px] right-[-180px] w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-400 via-blue-300 to-cyan-200 opacity-30 rounded-full blur-3xl z-0 animate-[blob2_14s_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-fuchsia-200 via-blue-100 to-cyan-100 opacity-20 rounded-full blur-3xl z-0 animate-pulse pointer-events-none" />
      <style jsx global>{`
        @keyframes blob1 {
          0%, 100% { transform: scale(1) translateY(0) }
          50% { transform: scale(1.15) translateY(40px) }
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) translateY(0) }
          50% { transform: scale(1.1) translateY(-30px) }
        }
        .animate-fade-in {
          animation: fade-in 0.5s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Centered Chat Card */}
      <div className="flex flex-col w-full max-w-3xl min-h-[80vh] mx-auto my-10 bg-white/80 backdrop-blur-2xl border border-blue-100 shadow-2xl z-10 rounded-3xl">
        {/* Header (sticky) */}
        <div className="flex flex-row items-center justify-between w-full px-8 py-6 border-b border-blue-100 bg-gradient-to-br from-blue-600 via-fuchsia-400 to-cyan-400 shadow-lg sticky top-0 z-20 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-200 via-blue-200 to-cyan-200 flex items-center justify-center shadow-xl border-4 border-white">
              <Image src={assistantAvatar} alt="medDoc Logo" width={40} height={40} className="rounded-full" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow tracking-tight">medDoc</h1>
              <p className="text-base text-blue-50 font-medium drop-shadow-sm">Your <span className="font-bold text-fuchsia-100">AI-powered healthcare assistant</span></p>
            </div>
          </div>
        </div>
        {/* Chat area (flex-grow, scrollable, never cut) */}
        <div className="flex flex-col flex-1 min-h-0 w-full px-0 py-0 overflow-y-auto items-center pt-28">
          <div className="flex flex-col flex-1 w-full px-4 pb-8 gap-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-400 mt-24 text-xl select-none animate-fade-in font-medium">
                Start the conversation with <span className="font-semibold text-fuchsia-600">medDoc</span>!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-end gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 via-fuchsia-200 to-cyan-200 flex items-center justify-center shadow border-2 border-white">
                      <Image src={assistantAvatar} alt="Assistant" width={32} height={32} className="rounded-full" />
                    </div>
                    <div className="w-fit max-w-full px-8 py-5 rounded-3xl shadow-xl text-lg break-words whitespace-pre-line bg-gradient-to-br from-white via-blue-50 to-fuchsia-50 text-gray-800 border border-blue-100 animate-fade-in" style={{wordBreak: 'break-word'}}>
                      <div className="prose prose-blue prose-base sm:prose-lg prose-headings:text-blue-700 prose-strong:text-fuchsia-700 prose-li:marker:text-fuchsia-400 prose-ul:pl-6 prose-p:mb-2">
                        <ReactMarkdown
                          components={{
                            ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul {...props} className="list-disc pl-6" />,
                            ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => <ol {...props} className="list-decimal pl-6" />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-400 via-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow border-2 border-white">🧑</div>
                    <div className="w-fit max-w-full px-8 py-5 rounded-3xl shadow-xl text-lg break-words whitespace-pre-line bg-gradient-to-br from-blue-100 via-cyan-100 to-fuchsia-100 text-black border-2 border-fuchsia-200 animate-fade-in" style={{wordBreak: 'break-word'}}>
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 via-fuchsia-200 to-cyan-200 flex items-center justify-center shadow border-2 border-white">
                  <Image src={assistantAvatar} alt="Assistant" width={32} height={32} className="rounded-full" />
                </div>
                <div className="px-8 py-5 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-fuchsia-50 text-fuchsia-500 animate-pulse w-fit max-w-full border border-fuchsia-200 shadow-xl text-lg">
                  medDoc is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        {/* Input area (sticky at bottom) */}
        <form
          className="flex w-full px-4 py-6 gap-3 bg-white/90 border-t border-blue-100 z-20 sticky bottom-0 rounded-b-3xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-fuchsia-200 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-base bg-blue-50 placeholder:text-fuchsia-300 shadow-md font-medium transition-all text-black"
            placeholder="Type your message..."
            disabled={isLoading}
            maxLength={500}
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-br from-fuchsia-500 via-blue-500 to-cyan-400 hover:from-fuchsia-600 hover:to-blue-600 text-white font-bold px-10 py-4 rounded-full shadow-xl disabled:bg-gray-300 transition-all text-base flex items-center gap-2"
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-fuchsia-400 rounded-full inline-block"></span>
                Sending...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}