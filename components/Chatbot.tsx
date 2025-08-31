"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";

type Message = {
  role: "user" | "bot";
  content: string;
};

const predefinedPrompts = [
  "Know about West Bengal culture",
  "Know about places to visit",
  "Traditional dance forms",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message comes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Call Gemini API
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      const botMessage: Message = { role: "bot", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-[10%] z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <img src="/media/icons/chatbot.png" alt="Chat Icon" className="w-6 h-6" />
        </button>
      )}

      {/* Chatbox */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="
            w-80 h-96 sm:w-96 sm:h-[32rem] 
            max-w-[95vw] max-h-[80vh]
            bg-white shadow-2xl rounded-2xl flex flex-col
          "
        >
          {/* Header with Close Button */}
          <div className="bg-blue-600 text-white p-3 rounded-t-2xl flex justify-between items-center font-semibold">
            <span>Bengal Travel Assistant</span>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-blue-700">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-[80%] break-words ${
                  msg.role === "user"
                    ? "bg-blue-100 ml-auto"
                    : "bg-gray-100 mr-auto"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="flex gap-1 text-gray-500">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="animate-bounce delay-300">●</span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Predefined Prompts */}
          <div className="flex gap-2 overflow-x-auto px-2 py-1">
            {predefinedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                className="bg-gray-200 px-3 py-1 text-sm rounded-full hover:bg-gray-300 whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-2 flex items-center gap-2 border-t"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-full"
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
