"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [year] = useState(() => new Date().getFullYear());
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) throw new Error("Failed to send message");
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
    <div className="min-h-screen w-full flex flex-col justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f0abfc] to-[#a7f3d0] relative overflow-hidden pt-10 sm:pt-16 pb-6">
      {/* Animated Blobs */}
      <div className="absolute top-[-140px] left-[-140px] w-[420px] h-[420px] bg-gradient-to-br from-blue-400 via-cyan-300 to-fuchsia-300 opacity-30 rounded-full blur-3xl z-0 animate-[blob1_12s_infinite] pointer-events-none" />
      <div className="absolute bottom-[-140px] right-[-140px] w-[420px] h-[420px] bg-gradient-to-tr from-fuchsia-400 via-blue-300 to-cyan-200 opacity-30 rounded-full blur-3xl z-0 animate-[blob2_14s_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-fuchsia-200 via-blue-100 to-cyan-100 opacity-20 rounded-full blur-3xl z-0 animate-pulse pointer-events-none" />
      <style jsx global>{`
        @keyframes blob1 {
          0%, 100% { transform: scale(1) translateY(0) }
          50% { transform: scale(1.15) translateY(40px) }
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) translateY(0) }
          50% { transform: scale(1.1) translateY(-30px) }
        }
        .fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .slide-up {
          animation: slideUp 1.1s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .glass {
          background: rgba(255,255,255,0.92);
          box-shadow: 0 8px 40px 0 rgba(168,85,247,0.13), 0 1.5px 8px 0 rgba(59,130,246,0.09);
          backdrop-filter: blur(18px);
        }
        .chat-bg {
          background: linear-gradient(135deg, #fdf6ff 60%, #e0f2fe 100%);
        }
        .chat-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: #f0abfc;
          border-radius: 8px;
        }
      `}</style>
      {/* Main Content Centered */}
      <main className="flex flex-col items-center justify-center w-full flex-1 z-10">
        <div
          className="flex flex-col items-center gap-0 glass rounded-[2.5rem] shadow-2xl p-0 max-w-2xl w-full border border-blue-100 fade-in mx-2 sm:mx-auto"
          style={{
            borderRadius: "2.5rem",
            minHeight: "80vh",
            marginTop: "2vh",
            marginBottom: "2vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Header with a beautiful medical illustration */}
          <div
            className="flex flex-col items-center bg-gradient-to-br from-blue-700 via-cyan-600 to-fuchsia-500 w-full rounded-t-[2.5rem] pt-12 pb-8 px-10 border-b border-blue-100 shadow-lg relative overflow-hidden slide-up"
            style={{
              borderTopLeftRadius: "2.5rem",
              borderTopRightRadius: "2.5rem",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-fuchsia-200 opacity-30 pointer-events-none" />
            <img
              src="https://demigos.com/media/cache/45/b1/45b1102d11d15a094c0b3c1a9eaed946.jpg"
              alt="Medical Doctor"
              className="w-24 h-24 rounded-full border-4 border-fuchsia-200 shadow-xl mb-4 object-cover bg-white"
              style={{ objectPosition: "center" }}
            />
            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-2xl font-serif animate-pulse">
              MedDoc
            </h1>
            <p className="text-lg sm:text-2xl text-blue-100 text-center font-medium max-w-lg drop-shadow font-sans mt-1 animate-fade-in">
              Your{" "}
              <span className="font-bold text-fuchsia-200">
                AI-powered healthcare assistant
              </span>
              . Get instant answers, health tips, and support—anytime, anywhere.
            </p>
          </div>
          {/* Chat Area */}
          <div
            className="flex flex-col w-full px-8 py-8 h-[420px] sm:h-[500px] overflow-y-auto chat-bg chat-scroll transition-all duration-300"
            style={{
              borderBottomLeftRadius: "2.5rem",
              borderBottomRightRadius: "2.5rem",
              flex: 1,
              minHeight: "300px",
            }}
          >
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-400 mt-24 text-xl select-none font-medium animate-fade-in">
                Start the conversation with{" "}
                <span className="font-semibold text-fuchsia-600">MedDoc</span>!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-6 py-4 rounded-3xl shadow-lg text-base break-words transition-all duration-200
                    ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-100 via-cyan-100 to-fuchsia-100 text-black rounded-br-lg border-2 border-fuchsia-200 animate-fade-in"
                        : "bg-gradient-to-br from-white via-blue-50 to-fuchsia-50 text-gray-800 rounded-bl-lg border border-blue-100 animate-fade-in"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="px-6 py-4 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-fuchsia-50 text-fuchsia-500 animate-pulse max-w-[75%] border border-fuchsia-200 shadow">
                  MedDoc is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input Area */}
          <form
            className="flex w-full px-8 pb-10 gap-3 bg-white/90 rounded-b-[2.5rem] border-t border-blue-100 z-10"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading) sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-fuchsia-200 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 text-base bg-blue-50 placeholder:text-fuchsia-300 shadow-md font-medium transition-all duration-200 text-black"
              placeholder="Type your message..."
              disabled={isLoading}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-br from-fuchsia-500 via-blue-500 to-cyan-400 hover:from-fuchsia-600 hover:to-blue-600 text-white font-bold px-10 py-4 rounded-full shadow-xl disabled:bg-gray-300 transition-all duration-200 text-base flex items-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-fuchsia-400 rounded-full inline-block"></span>
                  Sending...
                </span>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Send
                </>
              )}
            </button>
          </form>
        </div>
        <footer className="mt-8 mb-2 text-fuchsia-500 text-sm select-none font-semibold drop-shadow z-10 fade-in text-center w-full">
          <span className="opacity-80">
            &copy; {year} MedDoc. All rights reserved.
          </span>
          <div className="flex justify-center mt-2">
            <img
              src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D"
              alt="Stethoscope"
              className="w-8 h-8 rounded-full shadow"
              style={{ objectFit: "cover" }}
            />
          </div>
        </footer>
      </main>
    </div>
  );
}