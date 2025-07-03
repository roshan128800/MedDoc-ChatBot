"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 p-0 sm:p-6">
      <div className="flex flex-col items-center gap-0 bg-white/95 rounded-3xl shadow-2xl p-0 max-w-2xl w-full border border-blue-100">
        <div className="flex flex-col items-center bg-blue-600 w-full rounded-t-3xl p-8 border-b border-blue-100">
          <h1 className="text-3xl font-bold text-white mb-1">medDoc Chat</h1>
          <p className="text-md text-blue-100 text-center">
            Your AI-powered healthcare assistant
          </p>
        </div>
        <div className="flex flex-col w-full px-6 py-6 h-[420px] sm:h-[500px] overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-blue-50">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 mt-24 text-lg select-none">
              Start the conversation with{" "}
              <span className="font-semibold text-blue-600">medDoc</span>!
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
                className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-md text-base break-words ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md border border-blue-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-500 animate-pulse max-w-[75%] border border-blue-100">
                medDoc is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form
          className="flex w-full px-6 pb-8 gap-2 bg-white rounded-b-3xl border-t border-blue-100"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-blue-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-blue-50 placeholder:text-blue-300 shadow-sm"
            placeholder="Type your message..."
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-lg disabled:bg-gray-300 transition-colors text-base"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-blue-400 rounded-full inline-block"></span>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}